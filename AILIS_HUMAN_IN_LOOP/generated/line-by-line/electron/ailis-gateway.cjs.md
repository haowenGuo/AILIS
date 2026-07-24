# electron/ailis-gateway.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`source-code`
- 原始行数：5885
- SHA-256：`b6acde84d237063144f4a3213467ce2d5de5a24a0a54d7b6ef293fae0c1e70ce`
- 可运行副本：[打开源文件](../../../source/electron/ailis-gateway.cjs)
- 依赖：`http`、`fs`、`fs/promises`、`path`、`events`、`crypto`、`url`、`./ailis-runtime-budget.cjs`、`./ailis-agent-object-model.cjs`、`./ailis-observation-contract.cjs`、`./ailis-agent-runtime-protocol.cjs`、`./openclaw-tool-surface.cjs`、`./openclaw-runtime.cjs`、`./ailis-runtime.cjs`、`./ailis-tool-runtime.cjs`、`./ailis-platform-adapter.cjs`、`./ailis-agent-runner.cjs`、`./ailis-memory-store.cjs`、`./ailis-raw-memory-ledger.cjs`、`./ailis-user-profile-curator.cjs`、`./ailis-preference-state.cjs`、`./ailis-task-result-capsules.cjs`、`./ailis-task-agent-harness.cjs`、`./ailis-self-evolution-runtime.cjs`、`./ailis-ember-harness.cjs`、`./ailis-sensitive-word-classifier.cjs`、`./ailis-tool-contracts.cjs`、`./ailis-file-manager-tool.cjs`、`./ailis-computer-tool.cjs`、`./ailis-code-tool.cjs`、`./ailis-artifact-verifier-tool.cjs`、`./ailis-artifact-import-tool.cjs`、`./ailis-github-pages-tool.cjs`、`./ailis-vision-tool.cjs`、`./ailis-tool-acquisition-gateway.cjs`、`./ailis-tool-routing.cjs`、`./ailis-mcp-adapter.cjs`、`./ailis-email-tool.cjs`
- 主要符号：`http`、`fs`、`fsp`、`path`、`EMAIL_TOOL_ID`、`TASK_RESULTS_TOOL_ID`、`HANDOFF_TASK_TOOL_ID`、`WEB_RUN_TOOL_ID`、`WEB_SEARCH_TOOL_ID`、`PROJECT_ROOT`、`DEFAULT_PORT`、`DEFAULT_TOOL_GATEWAY_URL`、`MAX_BODY_BYTES`、`TOOL_CALL_TIMEOUT_MS`、`DEFAULT_EVENT_REPLAY_LIMIT`、`MAX_EVENT_REPLAY_LIMIT`、`MAX_SSE_WRITABLE_BYTES`、`DEFAULT_HTTP_REQUEST_TIMEOUT_MS`、`DEFAULT_PROFILE_CURATION_START_DELAY_MS`、`DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS`、`DEFAULT_PROFILE_CURATION_DEBOUNCE_MS`、`TASK_AGENT_MAX_MODEL_ROUNDS`、`GATEWAY_BACKED_TOOL_IDS`、`SESSION_BOUND_TOOL_IDS`、`EXTERNAL_SIDE_EFFECT_TOOL_IDS`、`PLUGIN_OR_TRIGGER_TOOL_IDS`、`FILE_TOOL_IDS`、`LOCAL_CORE_TOOL_IDS`、`SAFE_METHODS`、`LOSSLESS_EVENT_TYPES`、`LOSSLESS_EVENT_PREFIXES`、`CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS`、`EXTENDED_LOCAL_TOOL_EXPOSURE`、`WEB_RUN_DESCRIPTION`、`collectSuggestedMcpToolNames`、`names`、`seen`、`visit`、`tool`、`args`、`attachSuggestedMcpToolsForDirectExposure`、`source`、`suggestedNames`、`wanted`、`specs`、`directTools`、`AILIS_LOCAL_TOOL_DEFINITIONS`、`emailToolModule`、`emailToolLoadError`、`loadEmailToolModule`、`shouldIncludeDirectToolInSearch`、`safeListEmailProviderDetails`、`GatewayHttpError`、`normalizeString`、`trimmed`、`formatGatewayToolError`、`message`、`validationErrors`、`parseEventCursor`、`text`、`raw`、`match`、`seq`、`isLosslessGatewayEvent`、`eventType`、`formatSseEvent`、`isPathInside`、`normalizedSearchTokens`、`looksLikeHistoricalWebStateQuestion`、`hasPastAnchor`、`namesWebState`、`historicalArchiveUrlFromQueries`、`directUrl`、`siteMatch`、`pathPart`、`domain`、`isEvaluationAnswerLeak`、`questionTokens`、`resultTokens`、`matched`、`isEvaluationTaskMirror`、`url`、`repeatsQuestion`、`looksLikeEvaluationCorpus`、`extractStructuredQueryAnchors`、`matches`、`looksLikeNestedSelectorTask`、`hasSelector`、`hasHierarchy`、`extractQuotedSelectorTerms`、`terms`、`pattern`、`term`、`key`、`countExactLexicalOccurrences`、`normalizedTerm`、`escaped`、`structuredAnchorKind`、`anchor`、`countExactLexicalChildTitleUnits`、`normalizedParent`、`matchesByAnchor`、`index`、`start`、`end`、`updateSelectionProtocolTitleCounts`、`parentKind`、`quotedTerm`、`groups`、`currentGroup`、`lines`、`anchors`、`parentAnchor`、`groupKey`、`childAnchors`、`childKey`、`counts`、`selectorParentKind`、`buildSearchSelectionAudit`、`question`、`lower`、`allEntries`、`title`、`rawCounts`、`countsByIdentity`、`identity`、`existing`、`parentIndexCandidates`、`parent`、`child`、`parentPath`、`childPath`、`candidateSetComplete`、`cloneJson`、`firstObject`、`bridgeStructuredContent`、`bridgeTextContent`、`content`、`sourceViewportSectionLinks`、`links`、`label`、`targetDocument`、`fragment`、`isFullControlContext`、`rawProfile`、`profile`、`summarize`、`isSafeTokenMetricKey`、`redactObject`、`redacted`、`isSafeTokenMetric`、`createTimeoutError`、`error`、`withTimeout`、`timer`、`extractToolResultText`、`chunks`、`classifyToolResult`、`sourceStatus`、`genericStatuses`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const http = require('http');</code> | 导入依赖 `http`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5 | <code>const { EventEmitter } = require('events');</code> | 导入依赖 `events`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 6 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 7 | <code>const { pathToFileURL } = require('url');</code> | 导入依赖 `url`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 8 | <code>const { approxTokenCount, summarizeForModel } = require('./ailis-runtime-budget.cjs');</code> | 导入依赖 `./ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 10 | <code>    normalizeToolOutput,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 11 | <code>    toolOutputToThreadItem</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 12 | <code>} = require('./ailis-agent-object-model.cjs');</code> | 导入依赖 `./ailis-agent-object-model.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 14 | <code>    attachObservationContract</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 15 | <code>} = require('./ailis-observation-contract.cjs');</code> | 导入依赖 `./ailis-observation-contract.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 16 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 17 | <code>    runtimeEventMetadata</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 18 | <code>} = require('./ailis-agent-runtime-protocol.cjs');</code> | 导入依赖 `./ailis-agent-runtime-protocol.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 21 | <code>    OPENCLAW_CORE_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 22 | <code>    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 23 | <code>    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 24 | <code>    getOpenClawToolSurfaceSummary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 25 | <code>    validateOpenClawToolSurface</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 26 | <code>} = require('./openclaw-tool-surface.cjs');</code> | 导入依赖 `./openclaw-tool-surface.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 27 | <code>const { AILISAgentRuntimeSupervisor } = require('./openclaw-runtime.cjs');</code> | 导入依赖 `./openclaw-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 28 | <code>const { AILISRuntime } = require('./ailis-runtime.cjs');</code> | 导入依赖 `./ailis-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 29 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 30 | <code>    TOOL_EXPOSURE,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 31 | <code>    AILISRuntimeTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 32 | <code>    AILISToolRuntimeRegistry</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 33 | <code>} = require('./ailis-tool-runtime.cjs');</code> | 导入依赖 `./ailis-tool-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 34 | <code>const { createAILISPlatformAdapter } = require('./ailis-platform-adapter.cjs');</code> | 导入依赖 `./ailis-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 35 | <code>const { AILISAgentRunner } = require('./ailis-agent-runner.cjs');</code> | 导入依赖 `./ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 36 | <code>const { AILISMemoryRuntime } = require('./ailis-memory-store.cjs');</code> | 导入依赖 `./ailis-memory-store.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 37 | <code>const { AILISRawMemoryLedger } = require('./ailis-raw-memory-ledger.cjs');</code> | 导入依赖 `./ailis-raw-memory-ledger.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 38 | <code>const { AILISUserProfileCurator } = require('./ailis-user-profile-curator.cjs');</code> | 导入依赖 `./ailis-user-profile-curator.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 39 | <code>const { AILISPreferenceState } = require('./ailis-preference-state.cjs');</code> | 导入依赖 `./ailis-preference-state.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 40 | <code>const { AILISTaskResultCapsuleStore } = require('./ailis-task-result-capsules.cjs');</code> | 导入依赖 `./ailis-task-result-capsules.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 41 | <code>const { AILISSystemTaskAgentHarness } = require('./ailis-task-agent-harness.cjs');</code> | 导入依赖 `./ailis-task-agent-harness.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 42 | <code>const { AilisSelfEvolutionRuntime } = require('./ailis-self-evolution-runtime.cjs');</code> | 导入依赖 `./ailis-self-evolution-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 43 | <code>const { AILISEmberHarness } = require('./ailis-ember-harness.cjs');</code> | 导入依赖 `./ailis-ember-harness.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 44 | <code>const { AILISSensitiveWordClassifier } = require('./ailis-sensitive-word-classifier.cjs');</code> | 导入依赖 `./ailis-sensitive-word-classifier.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 45 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 46 | <code>    listToolContracts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 47 | <code>    validateToolContract</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 48 | <code>} = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 49 | <code>const EMAIL_TOOL_ID = 'email';</code> | 声明局部标识符 `EMAIL_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 50 | <code>const TASK_RESULTS_TOOL_ID = 'task_results';</code> | 声明局部标识符 `TASK_RESULTS_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 51 | <code>const HANDOFF_TASK_TOOL_ID = 'handoff_task';</code> | 声明局部标识符 `HANDOFF_TASK_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 52 | <code>const WEB_RUN_TOOL_ID = 'web_run';</code> | 声明局部标识符 `WEB_RUN_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 53 | <code>const WEB_SEARCH_TOOL_ID = 'web_search';</code> | 声明局部标识符 `WEB_SEARCH_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 54 | <code>const { FILE_MANAGER_TOOL_ID, executeFileManagerTool } = require('./ailis-file-manager-tool.cjs');</code> | 导入依赖 `./ailis-file-manager-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 55 | <code>const { COMPUTER_TOOL_ID, AILISComputerTool } = require('./ailis-computer-tool.cjs');</code> | 导入依赖 `./ailis-computer-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 56 | <code>const { CODE_TOOL_ID, executeCodeTool } = require('./ailis-code-tool.cjs');</code> | 导入依赖 `./ailis-code-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 57 | <code>const { ARTIFACT_VERIFIER_TOOL_ID, executeArtifactVerifierTool } = require('./ailis-artifact-verifier-tool.cjs');</code> | 导入依赖 `./ailis-artifact-verifier-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 58 | <code>const { ARTIFACT_IMPORT_TOOL_ID, executeArtifactImportTool } = require('./ailis-artifact-import-tool.cjs');</code> | 导入依赖 `./ailis-artifact-import-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 59 | <code>const { GITHUB_PAGES_TOOL_ID, executeGitHubPagesTool } = require('./ailis-github-pages-tool.cjs');</code> | 导入依赖 `./ailis-github-pages-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 60 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 61 | <code>    AILIS_VISION_TOOL_DEFINITION,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 62 | <code>    VISION_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 63 | <code>    executeVisionTool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 64 | <code>} = require('./ailis-vision-tool.cjs');</code> | 导入依赖 `./ailis-vision-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 65 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 66 | <code>    isExternalVirtualToolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 67 | <code>} = require('./ailis-tool-acquisition-gateway.cjs');</code> | 导入依赖 `./ailis-tool-acquisition-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 68 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 69 | <code>    buildToolRoutingAdvice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 70 | <code>    rankToolSearchResults</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 71 | <code>} = require('./ailis-tool-routing.cjs');</code> | 导入依赖 `./ailis-tool-routing.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 72 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 73 | <code>    createAilisDirectMcpToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 74 | <code>    parseAilisDirectMcpToolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 75 | <code>} = require('./ailis-mcp-adapter.cjs');</code> | 导入依赖 `./ailis-mcp-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 76 | <code>const PROJECT_ROOT = path.resolve(__dirname, '..');</code> | 声明局部标识符 `PROJECT_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 77 | <code>const DEFAULT_PORT = Number(process.env.AILIS_GATEWAY_PORT &#124;&#124; 19777);</code> | 声明局部标识符 `DEFAULT_PORT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 78 | <code>const DEFAULT_TOOL_GATEWAY_URL =</code> | 声明局部标识符 `DEFAULT_TOOL_GATEWAY_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 79 | <code>    process.env.AILIS_TOOL_OPENCLAW_GATEWAY_URL &#124;&#124; 'ws://127.0.0.1:18789';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 80 | <code>const MAX_BODY_BYTES = 1024 * 1024;</code> | 声明局部标识符 `MAX_BODY_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 81 | <code>const TOOL_CALL_TIMEOUT_MS = 45000;</code> | 声明局部标识符 `TOOL_CALL_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 82 | <code>const DEFAULT_EVENT_REPLAY_LIMIT = 2000;</code> | 声明局部标识符 `DEFAULT_EVENT_REPLAY_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 83 | <code>const MAX_EVENT_REPLAY_LIMIT = 10000;</code> | 声明局部标识符 `MAX_EVENT_REPLAY_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 84 | <code>const MAX_SSE_WRITABLE_BYTES = 1024 * 1024;</code> | 声明局部标识符 `MAX_SSE_WRITABLE_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 85 | <code>const DEFAULT_HTTP_REQUEST_TIMEOUT_MS = Math.max(0, Number(process.env.AILIS_GATEWAY_HTTP_REQUEST_TIMEOUT_MS &#124;&#124; 0) &#124;&#124; 0);</code> | 声明局部标识符 `DEFAULT_HTTP_REQUEST_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 86 | <code>const DEFAULT_PROFILE_CURATION_START_DELAY_MS = Number(process.env.AILIS_PROFILE_CURATION_START_DELAY_MS &#124;&#124; 60 * 1000);</code> | 声明局部标识符 `DEFAULT_PROFILE_CURATION_START_DELAY_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 87 | <code>const DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS = Number(process.env.AILIS_PROFILE_CURATION_CHECK_INTERVAL_MS &#124;&#124; 6 * 60 * 60 * 1000);</code> | 声明局部标识符 `DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 88 | <code>const DEFAULT_PROFILE_CURATION_DEBOUNCE_MS = Number(process.env.AILIS_PROFILE_CURATION_DEBOUNCE_MS &#124;&#124; 2 * 60 * 1000);</code> | 声明局部标识符 `DEFAULT_PROFILE_CURATION_DEBOUNCE_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 89 | <code>const TASK_AGENT_MAX_MODEL_ROUNDS = 9;</code> | 声明局部标识符 `TASK_AGENT_MAX_MODEL_ROUNDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>const GATEWAY_BACKED_TOOL_IDS = new Set(['sessions_list', 'gateway', 'cron', 'nodes']);</code> | 声明局部标识符 `GATEWAY_BACKED_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 92 | <code>const SESSION_BOUND_TOOL_IDS = new Set([</code> | 声明局部标识符 `SESSION_BOUND_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 93 | <code>    'session_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 94 | <code>    'sessions_history',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 95 | <code>    'sessions_send'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 96 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>const EXTERNAL_SIDE_EFFECT_TOOL_IDS = new Set([</code> | 声明局部标识符 `EXTERNAL_SIDE_EFFECT_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 98 | <code>    'browser',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 99 | <code>    'canvas',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 100 | <code>    'image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 101 | <code>    'image_generate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 102 | <code>    'music_generate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 103 | <code>    'video_generate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 104 | <code>    'pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 105 | <code>    'memory_search',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 106 | <code>    'memory_get'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 107 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>const PLUGIN_OR_TRIGGER_TOOL_IDS = new Set(['code_execution', 'x_search', 'heartbeat_respond']);</code> | 声明局部标识符 `PLUGIN_OR_TRIGGER_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 109 | <code>const FILE_TOOL_IDS = new Set(['read', 'write', 'edit']);</code> | 声明局部标识符 `FILE_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 110 | <code>const LOCAL_CORE_TOOL_IDS = new Set(['read', 'write', 'exec', 'apply_patch']);</code> | 声明局部标识符 `LOCAL_CORE_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 111 | <code>const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);</code> | 声明局部标识符 `SAFE_METHODS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 112 | <code>const LOSSLESS_EVENT_TYPES = new Set([</code> | 声明局部标识符 `LOSSLESS_EVENT_TYPES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 113 | <code>    'gateway.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 114 | <code>    'gateway.stopped',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 115 | <code>    'runtime.item',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 116 | <code>    'tool.call.begin',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 117 | <code>    'tool.call.success',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 118 | <code>    'tool.call.failure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 119 | <code>    'tool.call.started',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 120 | <code>    'tool.call.finished',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 121 | <code>    'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 122 | <code>    'agent.run.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 123 | <code>    'agent.step.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 124 | <code>    'agent.step.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 125 | <code>    'agent.progress.note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 126 | <code>    'agent.plan.updated',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 127 | <code>    'context_artifact.created',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 128 | <code>    'subagent.event',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 129 | <code>    'mcp.tool.call.begin',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 130 | <code>    'mcp.tool.call.end',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 131 | <code>    'mcp.resource.read.begin',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 132 | <code>    'mcp.resource.read.end'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 133 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>const LOSSLESS_EVENT_PREFIXES = ['approval.', 'subagent.', 'mcp.', 'agent.', 'ember.'];</code> | 声明局部标识符 `LOSSLESS_EVENT_PREFIXES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 135 | <code>const CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS = new Set([</code> | 声明局部标识符 `CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 136 | <code>    'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 137 | <code>    'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 138 | <code>    'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 139 | <code>    WEB_RUN_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 140 | <code>    HANDOFF_TASK_TOOL_ID</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 141 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>// Extended tools stay out of the first-turn tool surface, but remain discoverable</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 143 | <code>// through tool_search. The Registry is the source of truth for their full specs.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 144 | <code>const EXTENDED_LOCAL_TOOL_EXPOSURE = TOOL_EXPOSURE.DEFERRED;</code> | 声明局部标识符 `EXTENDED_LOCAL_TOOL_EXPOSURE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>const WEB_RUN_DESCRIPTION = fs.readFileSync(</code> | 声明局部标识符 `WEB_RUN_DESCRIPTION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 147 | <code>    path.join(__dirname, 'ailis-web-run-description.md'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 148 | <code>    'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 149 | <code>).replace(/\r\n/g, '\n').trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>function collectSuggestedMcpToolNames(value, maxDepth = 8) {</code> | 定义函数 `collectSuggestedMcpToolNames`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 152 | <code>    const names = new Set();</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 153 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 154 | <code>    const visit = (entry, depth = 0) =&gt; {</code> | 声明局部标识符 `visit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 155 | <code>        if (!entry &#124;&#124; depth &gt; maxDepth &#124;&#124; typeof entry !== 'object' &#124;&#124; seen.has(entry)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>        seen.add(entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 159 | <code>        if (Array.isArray(entry)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 160 | <code>            entry.slice(0, 64).forEach((item) =&gt; visit(item, depth + 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 161 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 162 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        const tool = normalizeString(entry.tool &#124;&#124; entry.tool_name &#124;&#124; entry.toolName);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 164 | <code>        const args = entry.args &#124;&#124; entry.arguments;</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 165 | <code>        if (tool &amp;&amp; args &amp;&amp; typeof args === 'object' &amp;&amp; !Array.isArray(args)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 166 | <code>            names.add(tool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 167 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>        Object.values(entry).forEach((item) =&gt; visit(item, depth + 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 169 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    visit(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 171 | <code>    return [...names];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 172 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 174 | <code>async function attachSuggestedMcpToolsForDirectExposure(result, sourceToolId, mcpManager, timeoutMs = 8000) {</code> | 定义函数 `attachSuggestedMcpToolsForDirectExposure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 175 | <code>    if (!result &#124;&#124; typeof result !== 'object' &#124;&#124; !mcpManager) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 176 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 177 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    const source = parseAilisDirectMcpToolId(sourceToolId);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 179 | <code>    if (!source?.server) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 180 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 181 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    const suggestedNames = collectSuggestedMcpToolNames(result);</code> | 声明局部标识符 `suggestedNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 183 | <code>    if (!suggestedNames.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    const wanted = new Set(suggestedNames.map((name) =&gt; normalizeString(name).toLowerCase()));</code> | 声明局部标识符 `wanted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 187 | <code>    const specs = await mcpManager.listToolSpecs(source.server, timeoutMs).catch(() =&gt; []);</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 188 | <code>    const directTools = specs</code> | 声明局部标识符 `directTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 189 | <code>        .filter((spec) =&gt; wanted.has(normalizeString(spec.tool &#124;&#124; spec.name).toLowerCase()))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 190 | <code>        .map((spec) =&gt; createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 191 | <code>            id: spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 192 | <code>            server: spec.server &#124;&#124; source.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 193 | <code>            tool: spec.tool &#124;&#124; spec.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 194 | <code>            name: spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 195 | <code>            title: spec.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 196 | <code>            description: spec.description &#124;&#124; spec.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 197 | <code>            inputSchema: spec.inputSchema &#124;&#124; spec.input_schema &#124;&#124; spec.parameters &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 198 | <code>            schemaProperties: spec.schemaProperties &#124;&#124; spec.schema_properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 199 | <code>            callPattern: spec.callPattern &#124;&#124; spec.call_pattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 200 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>        .filter((spec) =&gt; spec.callable !== false &amp;&amp; spec.modelFacing !== false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 202 | <code>    if (directTools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 203 | <code>        Object.defineProperty(result, '__ailisSuggestedMcpTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 204 | <code>            value: directTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 205 | <code>            enumerable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 206 | <code>            configurable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 207 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    return directTools;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 210 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>const AILIS_LOCAL_TOOL_DEFINITIONS = Object.freeze([</code> | 声明局部标识符 `AILIS_LOCAL_TOOL_DEFINITIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 213 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 214 | <code>        id: WEB_RUN_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 215 | <code>        label: 'web.run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 216 | <code>        description: WEB_RUN_DESCRIPTION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 217 | <code>        modelDescriptionChars: 9000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 218 | <code>        parseToolInputSchemaWithoutCompaction: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 219 | <code>        // The mutually exclusive operation fields are runtime-validated.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 220 | <code>        // Provider strict mode cannot represent this optional-field union portably.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 221 | <code>        strict: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 222 | <code>        sectionId: 'web',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 223 | <code>        route: 'ailis-research-mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 224 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 225 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 226 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 227 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 229 | <code>        id: WEB_SEARCH_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 230 | <code>        label: 'web_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 231 | <code>        description: 'Legacy single-query public web search kept for compatibility. New model turns use web_run.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 232 | <code>        sectionId: 'web',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 233 | <code>        route: 'ailis-research-mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 234 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 235 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 236 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 237 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 239 | <code>        id: HANDOFF_TASK_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 240 | <code>        label: 'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 241 | <code>        description: 'Transfer the immutable current user request to the session\'s persistent system TaskAgent and wait for one compact TaskResult packet. No task text or lifecycle command is accepted from the model; the Harness owns thread identity, checkpointing, execution, and result transport.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 242 | <code>        sectionId: 'persona-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 243 | <code>        route: 'ailis-system-task-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 244 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 245 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 246 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 247 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 249 | <code>        id: TASK_RESULTS_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 250 | <code>        label: 'task_results',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 251 | <code>        description: 'Read-only access to AILIS public results from earlier completed work. Search relevant results or retrieve one result by id; this never reruns the task.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 252 | <code>        sectionId: 'persona-context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 253 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 254 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 255 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 256 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 257 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 259 | <code>        id: EMAIL_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 260 | <code>        label: 'email',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 261 | <code>        description: 'Manage QQ Mail, Gmail, and Outlook mailboxes through IMAP/SMTP.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 262 | <code>        sectionId: 'email',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 263 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 264 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 265 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 266 | <code>        needsApprovalActions: Object.freeze(['send', 'mark_read', 'mark_unread', 'move', 'delete'])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 267 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 269 | <code>        id: FILE_MANAGER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 270 | <code>        label: 'file_manager',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 271 | <code>        description: 'Scan, organize, and safely clean junk files with dry-run and quarantine-first execution.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 272 | <code>        sectionId: 'file-management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 273 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 274 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 275 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 276 | <code>        needsApprovalActions: Object.freeze(['clean', 'organize'])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 277 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 279 | <code>        id: COMPUTER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 280 | <code>        label: 'computer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 281 | <code>        description: 'Full local computer operation layer: filesystem, binary streams, watchers, rollback, shell sessions, and optional PTY.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 282 | <code>        sectionId: 'computer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 283 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 284 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 285 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 286 | <code>        needsApprovalActions: Object.freeze([</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 287 | <code>            'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 288 | <code>            'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 289 | <code>            'append',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 290 | <code>            'mkdir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 291 | <code>            'copy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 292 | <code>            'move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 293 | <code>            'rename',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 294 | <code>            'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 295 | <code>            'acl_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 296 | <code>            'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 297 | <code>            'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 298 | <code>            'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 299 | <code>            'pty_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 300 | <code>            'pty_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 301 | <code>            'pty_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 302 | <code>            'write_stdin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 303 | <code>            'process_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 304 | <code>            'process_kill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 305 | <code>            'rollback_restore'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 306 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 309 | <code>        id: CODE_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 310 | <code>        label: 'code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 311 | <code>        description: 'Code operation layer: Git, code search, symbol index, AST refactor, TypeScript diagnostics, PR and CI hooks.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 312 | <code>        sectionId: 'code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 313 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 314 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 315 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 316 | <code>        needsApprovalActions: Object.freeze(['git_commit', 'rename_symbol', 'test', 'pr_create'])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 317 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 319 | <code>        id: ARTIFACT_VERIFIER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 320 | <code>        label: 'artifact_verifier',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 321 | <code>        description: 'Read-only structured artifact verification for JSON/JSONL/CSV/TSV/YAML/TOML/Markdown/log/text files.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 322 | <code>        sectionId: 'artifact-verification',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 323 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 324 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 325 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 326 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 327 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 329 | <code>        id: ARTIFACT_IMPORT_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 330 | <code>        label: 'artifact_import',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 331 | <code>        description: 'Import local files through extracted RAGFlow-lite artifact workers and register queryable AILIS context artifacts.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 332 | <code>        sectionId: 'context-artifacts',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 333 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 334 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 335 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 336 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 337 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 339 | <code>        id: GITHUB_PAGES_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 340 | <code>        label: 'github_pages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 341 | <code>        description: 'Read-only GitHub Pages and gh-pages deployment diagnostics with blockers and verification evidence.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 342 | <code>        sectionId: 'github-pages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 343 | <code>        route: 'ailis-local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 344 | <code>        materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 345 | <code>        status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 346 | <code>        needsApprovalActions: Object.freeze([])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 347 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    AILIS_VISION_TOOL_DEFINITION</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 349 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>let emailToolModule = null;</code> | 声明局部标识符 `emailToolModule`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 352 | <code>let emailToolLoadError = null;</code> | 声明局部标识符 `emailToolLoadError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>function loadEmailToolModule() {</code> | 定义函数 `loadEmailToolModule`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 355 | <code>    if (emailToolModule) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 356 | <code>        return emailToolModule;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 357 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>    if (emailToolLoadError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 359 | <code>        throw emailToolLoadError;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 360 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 362 | <code>        emailToolModule = require('./ailis-email-tool.cjs');</code> | 导入依赖 `./ailis-email-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 363 | <code>        return emailToolModule;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 364 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 365 | <code>        emailToolLoadError = error;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 366 | <code>        throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 367 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>function shouldIncludeDirectToolInSearch(entry, query, includeDirect) {</code> | 定义函数 `shouldIncludeDirectToolInSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 371 | <code>    return includeDirect === true &#124;&#124; entry.exposure !== TOOL_EXPOSURE.DIRECT;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 372 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>function safeListEmailProviderDetails() {</code> | 定义函数 `safeListEmailProviderDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 375 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 376 | <code>        return loadEmailToolModule().listProviderDetails();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 377 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 378 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 379 | <code>            error: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 380 | <code>            providers: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 381 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 385 | <code>class GatewayHttpError extends Error {</code> | 定义类 `GatewayHttpError`，把相关状态与行为收拢为一个运行时对象。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 386 | <code>    constructor(statusCode, code, message, details = undefined) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 387 | <code>        super(message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 388 | <code>        this.statusCode = statusCode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 389 | <code>        this.code = code;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 390 | <code>        this.details = details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 391 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 395 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 396 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 397 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 399 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 400 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>function formatGatewayToolError(error) {</code> | 定义函数 `formatGatewayToolError`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 403 | <code>    const message = normalizeString(error?.message &#124;&#124; String(error), 'tool call failed');</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 404 | <code>    const validationErrors = Array.isArray(error?.details?.errors)</code> | 声明局部标识符 `validationErrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 405 | <code>        ? error.details.errors.map((entry) =&gt; normalizeString(entry)).filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 406 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 407 | <code>    return validationErrors.length</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 408 | <code>        ? `${message}: ${validationErrors.join('; ')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 409 | <code>        : message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 410 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>function parseEventCursor(value, fallback = 0) {</code> | 定义函数 `parseEventCursor`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 413 | <code>    const text = Array.isArray(value) ? value[0] : value;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 414 | <code>    const raw = normalizeString(String(text &#124;&#124; ''), '');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 415 | <code>    const match = raw.match(/(\d+)$/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 416 | <code>    const seq = match ? Number(match[1]) : Number(raw);</code> | 声明局部标识符 `seq`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 417 | <code>    return Number.isFinite(seq) &amp;&amp; seq &gt;= 0 ? seq : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 418 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>function isLosslessGatewayEvent(type) {</code> | 定义函数 `isLosslessGatewayEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 421 | <code>    const eventType = normalizeString(type);</code> | 声明局部标识符 `eventType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 422 | <code>    return LOSSLESS_EVENT_TYPES.has(eventType) &#124;&#124; LOSSLESS_EVENT_PREFIXES.some((prefix) =&gt; eventType.startsWith(prefix));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 423 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>function formatSseEvent(event) {</code> | 定义函数 `formatSseEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 426 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 427 | <code>        `id: ${event.seq}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 428 | <code>        `event: ${event.type}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 429 | <code>        `data: ${JSON.stringify(event)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 430 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 431 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 432 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 433 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 435 | <code>function isPathInside(rootPath, targetPath) {</code> | 定义函数 `isPathInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 436 | <code>    return createAILISPlatformAdapter().isPathInside(rootPath, targetPath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 437 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>function normalizedSearchTokens(value = '') {</code> | 定义函数 `normalizedSearchTokens`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 440 | <code>    return [...new Set(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 441 | <code>        normalizeString(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 442 | <code>            .toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 443 | <code>            .match(/[\p{L}\p{N}]{2,}/gu) &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 444 | <code>    )];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>function looksLikeHistoricalWebStateQuestion(value = '') {</code> | 定义函数 `looksLikeHistoricalWebStateQuestion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 448 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 449 | <code>    const hasPastAnchor =</code> | 声明局部标识符 `hasPastAnchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 450 | <code>        /\b(?:as[- ]of&#124;historical(?:ly)?&#124;past state&#124;at (?:the )?(?:time&#124;end&#124;start)&#124;before&#124;during)\b/i.test(text) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 451 | <code>        /\b(?:in&#124;on&#124;from)\s+(?:19&#124;20)\d{2}\b/i.test(text) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 452 | <code>        /\b(?:19&#124;20)\d{2}\s+(?:version&#124;listing&#124;record&#124;result&#124;state&#124;catalog)\b/i.test(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 453 | <code>    const namesWebState =</code> | 声明局部标识符 `namesWebState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 454 | <code>        /\b(?:website&#124;webpage&#124;site&#124;database&#124;catalog&#124;registry&#124;index&#124;api&#124;oai&#124;search results?&#124;listed&#124;listing&#124;record)\b/i.test(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 455 | <code>    return hasPastAnchor &amp;&amp; namesWebState;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 456 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>function historicalArchiveUrlFromQueries(queries = []) {</code> | 定义函数 `historicalArchiveUrlFromQueries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 459 | <code>    for (const query of Array.isArray(queries) ? queries : []) {</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 460 | <code>        const text = normalizeString(query?.q);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 461 | <code>        const directUrl = text.match(/https?:\/\/[^\s"'&lt;&gt;]+/i)?.[0]</code> | 声明局部标识符 `directUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 462 | <code>            ?.replace(/[),.;:!?]+$/, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 463 | <code>        if (directUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 464 | <code>            return directUrl;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 465 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>        const siteMatch = text.match(/\bsite:([a-z0-9.-]+)(\/[^\s"'&lt;&gt;]*)?/i);</code> | 声明局部标识符 `siteMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 467 | <code>        if (siteMatch?.[1]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 468 | <code>            const pathPart = normalizeString(siteMatch[2]).replace(/[),.;:!?]+$/, '');</code> | 声明局部标识符 `pathPart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 469 | <code>            return `https://${siteMatch[1]}${pathPart &#124;&#124; ''}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 470 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>        const domain = (Array.isArray(query?.domains) ? query.domains : [])</code> | 声明局部标识符 `domain`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 472 | <code>            .map((entry) =&gt; normalizeString(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 473 | <code>            .find(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 474 | <code>        if (domain) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 475 | <code>            return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 476 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 479 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>function isEvaluationAnswerLeak(sourceQuestion = '', result = {}) {</code> | 定义函数 `isEvaluationAnswerLeak`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 482 | <code>    const questionTokens = normalizedSearchTokens(sourceQuestion);</code> | 声明局部标识符 `questionTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 483 | <code>    if (questionTokens.length &lt; 5) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 484 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 485 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 487 | <code>        result?.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 488 | <code>        result?.snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 489 | <code>        result?.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 490 | <code>    ].map((value) =&gt; normalizeString(value)).filter(Boolean).join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 491 | <code>    if (!/\b(?:ground truth&#124;reference answer&#124;expected answer&#124;gold answer&#124;correct answer)\s*[:=-]/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 492 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 493 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 494 | <code>    const resultTokens = new Set(normalizedSearchTokens(text));</code> | 声明局部标识符 `resultTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 495 | <code>    const matched = questionTokens.filter((token) =&gt; resultTokens.has(token)).length;</code> | 声明局部标识符 `matched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 496 | <code>    return matched / questionTokens.length &gt;= 0.65;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 497 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>function isEvaluationTaskMirror(sourceQuestion = '', result = {}) {</code> | 定义函数 `isEvaluationTaskMirror`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 500 | <code>    const questionTokens = normalizedSearchTokens(sourceQuestion);</code> | 声明局部标识符 `questionTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 501 | <code>    if (questionTokens.length &lt; 5) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 502 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 503 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>    const url = normalizeString(result?.url).toLowerCase();</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 505 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 506 | <code>        result?.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 507 | <code>        result?.snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 508 | <code>        result?.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 509 | <code>    ].map((value) =&gt; normalizeString(value)).filter(Boolean).join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 510 | <code>    const resultTokens = new Set(normalizedSearchTokens(text));</code> | 声明局部标识符 `resultTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 511 | <code>    const matched = questionTokens.filter((token) =&gt; resultTokens.has(token)).length;</code> | 声明局部标识符 `matched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 512 | <code>    const repeatsQuestion = matched / questionTokens.length &gt;= 0.72;</code> | 声明局部标识符 `repeatsQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 513 | <code>    const looksLikeEvaluationCorpus =</code> | 声明局部标识符 `looksLikeEvaluationCorpus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 514 | <code>        /(?:^&#124;[./_-])(?:gaia&#124;benchmark&#124;benchmarks&#124;magentic_dataset&#124;agent.?rx&#124;harbor-datasets)(?:[./_-]&#124;$)/i.test(url) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 515 | <code>        /\b(?:gaia task&#124;benchmark task&#124;evaluation task&#124;output requirements&#124;write only the final answer)\b/i.test(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 516 | <code>    return repeatsQuestion &amp;&amp; looksLikeEvaluationCorpus;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 517 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 519 | <code>function extractStructuredQueryAnchors(value = '') {</code> | 定义函数 `extractStructuredQueryAnchors`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 520 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 521 | <code>    const matches = text.match(/\b(?:rule&#124;article&#124;chapter&#124;section&#124;part&#124;item&#124;table&#124;figure&#124;episode&#124;volume&#124;book)\s+(?:\d+(?:\.\d+)*[a-z]?&#124;[ivxlcdm]+)\b/gi) &#124;&#124; [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 522 | <code>    return [...new Set(matches.map((entry) =&gt; entry.replace(/\s+/g, ' ').trim()))];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 523 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>function looksLikeNestedSelectorTask(value = '') {</code> | 定义函数 `looksLikeNestedSelectorTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 526 | <code>    const text = normalizeString(value).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 527 | <code>    const hasSelector = /\b(?:first&#124;last&#124;most&#124;least&#124;earliest&#124;latest&#124;highest&#124;lowest&#124;alphabetic(?:al&#124;ally)?&#124;fewest)\b/.test(text);</code> | 声明局部标识符 `hasSelector`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 528 | <code>    const hasHierarchy = /\b(?:under&#124;within&#124;among&#124;section&#124;article&#124;chapter&#124;rule&#124;group&#124;category&#124;titles?&#124;records?&#124;entries)\b/.test(text);</code> | 声明局部标识符 `hasHierarchy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 529 | <code>    return hasSelector &amp;&amp; hasHierarchy;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 530 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>function extractQuotedSelectorTerms(value = '') {</code> | 定义函数 `extractQuotedSelectorTerms`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 533 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 534 | <code>    const terms = [];</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 535 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 536 | <code>    const pattern = /"([^"\r\n]{1,80})"&#124;“([^”\r\n]{1,80})”/g;</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 537 | <code>    let match;</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 538 | <code>    while ((match = pattern.exec(text)) !== null) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 539 | <code>        const term = normalizeString(match[1] &#124;&#124; match[2]);</code> | 声明局部标识符 `term`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 540 | <code>        const key = term.toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 541 | <code>        if (!term &#124;&#124; seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 542 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 543 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>        seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 545 | <code>        terms.push(term);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 546 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>    return terms;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 548 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>function countExactLexicalOccurrences(value = '', term = '') {</code> | 定义函数 `countExactLexicalOccurrences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 551 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 552 | <code>    const normalizedTerm = normalizeString(term);</code> | 声明局部标识符 `normalizedTerm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 553 | <code>    if (!text &#124;&#124; !normalizedTerm) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 554 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 555 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>    const escaped = normalizedTerm.replace(/[.*+?^${}()&#124;[\]\\]/g, '\\$&amp;');</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 557 | <code>    const pattern = new RegExp(</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 558 | <code>        `(?:^&#124;[^\\p{L}\\p{N}_])${escaped}(?=$&#124;[^\\p{L}\\p{N}_])`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 559 | <code>        'giu'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 560 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    return [...text.matchAll(pattern)].length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 562 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>function structuredAnchorKind(value = '') {</code> | 定义函数 `structuredAnchorKind`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 565 | <code>    const anchor = extractStructuredQueryAnchors(value)[0] &#124;&#124; '';</code> | 声明局部标识符 `anchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 566 | <code>    return normalizeString(anchor.split(/\s+/)[0]).toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 567 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 569 | <code>function countExactLexicalChildTitleUnits(value = '', term = '', parentAnchor = '') {</code> | 定义函数 `countExactLexicalChildTitleUnits`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 570 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 571 | <code>    const normalizedParent = normalizeString(parentAnchor).toLowerCase();</code> | 声明局部标识符 `normalizedParent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 572 | <code>    const pattern = /\b(?:rule&#124;article&#124;chapter&#124;section&#124;part&#124;item&#124;table&#124;figure&#124;episode&#124;volume&#124;book)\s+(?:\d+(?:\.\d+)*[a-z]?&#124;[ivxlcdm]+)\b/gi;</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 573 | <code>    const matches = [...text.matchAll(pattern)];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 574 | <code>    if (!matches.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 575 | <code>        return countExactLexicalOccurrences(text, term);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 576 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>    const matchesByAnchor = new Map();</code> | 声明局部标识符 `matchesByAnchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 578 | <code>    for (let index = 0; index &lt; matches.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 579 | <code>        const anchor = normalizeString(matches[index][0]).toLowerCase();</code> | 声明局部标识符 `anchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 580 | <code>        if (!anchor &#124;&#124; anchor === normalizedParent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 581 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 582 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 583 | <code>        const start = matches[index].index &#124;&#124; 0;</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 584 | <code>        const end = matches[index + 1]?.index ?? text.length;</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 585 | <code>        const matched = countExactLexicalOccurrences(text.slice(start, end), term) &gt; 0;</code> | 声明局部标识符 `matched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 586 | <code>        matchesByAnchor.set(anchor, matchesByAnchor.get(anchor) === true &#124;&#124; matched);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 587 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 588 | <code>    return [...matchesByAnchor.values()].filter(Boolean).length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 589 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>function updateSelectionProtocolTitleCounts(selectionProtocol = null, sourceViews = []) {</code> | 定义函数 `updateSelectionProtocolTitleCounts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 592 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 593 | <code>        !selectionProtocol &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 594 | <code>        !normalizeString(selectionProtocol.parentKind) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 595 | <code>        !normalizeString(selectionProtocol.quotedTerm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 596 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 597 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 598 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 599 | <code>    const parentKind = normalizeString(selectionProtocol.parentKind).toLowerCase();</code> | 声明局部标识符 `parentKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 600 | <code>    const quotedTerm = normalizeString(selectionProtocol.quotedTerm);</code> | 声明局部标识符 `quotedTerm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 601 | <code>    const groups = selectionProtocol.groupTitleMatches &amp;&amp;</code> | 声明局部标识符 `groups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 602 | <code>        typeof selectionProtocol.groupTitleMatches === 'object'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 603 | <code>        ? selectionProtocol.groupTitleMatches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 604 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 605 | <code>    let currentGroup = normalizeString(selectionProtocol.currentGroup);</code> | 声明局部标识符 `currentGroup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 606 | <code>    const lines = (Array.isArray(sourceViews) ? sourceViews : [])</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 607 | <code>        .flatMap((sourceView) =&gt; Array.isArray(sourceView?.lines) ? sourceView.lines : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 608 | <code>        .map((line) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 609 | <code>            lineno: Number(line?.lineno &#124;&#124; line?.lineNumber &#124;&#124; line?.line_number) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 610 | <code>            text: normalizeString(line?.text &#124;&#124; line?.rendered)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 611 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>        .filter((line) =&gt; line.text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 613 | <code>        .sort((left, right) =&gt; left.lineno - right.lineno);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 614 | <code>    for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 615 | <code>        const anchors = extractStructuredQueryAnchors(line.text);</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 616 | <code>        const parentAnchor = anchors.find((anchor) =&gt; structuredAnchorKind(anchor) === parentKind);</code> | 声明局部标识符 `parentAnchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 617 | <code>        if (parentAnchor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 618 | <code>            currentGroup = normalizeString(parentAnchor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 619 | <code>            const groupKey = currentGroup.toLowerCase();</code> | 声明局部标识符 `groupKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 620 | <code>            groups[groupKey] &#124;&#124;= {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 621 | <code>                label: currentGroup,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 622 | <code>                matchedChildren: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 623 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 624 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 625 | <code>        if (!currentGroup &#124;&#124; countExactLexicalOccurrences(line.text, quotedTerm) === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 626 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 627 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>        const childAnchors = anchors.filter((anchor) =&gt; structuredAnchorKind(anchor) !== parentKind);</code> | 声明局部标识符 `childAnchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 629 | <code>        for (const childAnchor of childAnchors) {</code> | 声明局部标识符 `childAnchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 630 | <code>            const groupKey = currentGroup.toLowerCase();</code> | 声明局部标识符 `groupKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 631 | <code>            groups[groupKey] &#124;&#124;= {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 632 | <code>                label: currentGroup,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 633 | <code>                matchedChildren: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 634 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>            const childKey = normalizeString(childAnchor).toLowerCase();</code> | 声明局部标识符 `childKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 636 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 637 | <code>                childKey &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 638 | <code>                !groups[groupKey].matchedChildren.some((child) =&gt; child.key === childKey)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 639 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 640 | <code>                groups[groupKey].matchedChildren.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 641 | <code>                    key: childKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 642 | <code>                    label: normalizeString(childAnchor),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 643 | <code>                    title: line.text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 644 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>    selectionProtocol.currentGroup = currentGroup;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 649 | <code>    selectionProtocol.groupTitleMatches = groups;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 650 | <code>    const counts = Object.values(groups)</code> | 声明局部标识符 `counts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 651 | <code>        .map((group) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 652 | <code>            group: normalizeString(group.label),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 653 | <code>            count: Array.isArray(group.matchedChildren) ? group.matchedChildren.length : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 654 | <code>            matched_children: (Array.isArray(group.matchedChildren) ? group.matchedChildren : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 655 | <code>                .map((child) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 656 | <code>                    id: normalizeString(child.label),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 657 | <code>                    title: normalizeString(child.title)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 658 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 660 | <code>        .filter((group) =&gt; group.group)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 661 | <code>        .sort((left, right) =&gt; right.count - left.count &#124;&#124; left.group.localeCompare(right.group));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 662 | <code>    selectionProtocol.groupTitleCounts = counts;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 663 | <code>    return counts;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 664 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 666 | <code>function selectorParentKind(value = '') {</code> | 定义函数 `selectorParentKind`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 667 | <code>    const text = normalizeString(value).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 668 | <code>    const match = text.match(/\b(article&#124;chapter&#124;section&#124;part&#124;item&#124;table&#124;figure&#124;episode&#124;volume&#124;book&#124;group&#124;category)\s+(?:that&#124;which&#124;with&#124;having&#124;has&#124;had&#124;whose)\b/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 669 | <code>    return normalizeString(match?.[1]).toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 670 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>function buildSearchSelectionAudit(sourceQuestion = '', results = []) {</code> | 定义函数 `buildSearchSelectionAudit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 673 | <code>    const question = normalizeString(sourceQuestion);</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 674 | <code>    const lower = question.toLowerCase();</code> | 声明局部标识符 `lower`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 675 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 676 | <code>        !/\b(?:most&#124;least&#124;fewest&#124;highest&#124;lowest)\b/.test(lower) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 677 | <code>        !/\b(?:titles?&#124;labels?&#124;records?&#124;entries&#124;names?)\b/.test(lower)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 678 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 679 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 680 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 681 | <code>    const quotedTerm = extractQuotedSelectorTerms(question)[0];</code> | 声明局部标识符 `quotedTerm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 682 | <code>    if (!quotedTerm) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 683 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 684 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>    const parentKind = selectorParentKind(question);</code> | 声明局部标识符 `parentKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 686 | <code>    const allEntries = (Array.isArray(results) ? results : [])</code> | 声明局部标识符 `allEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 687 | <code>        .map((result) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 688 | <code>            const title = normalizeString(result?.title);</code> | 声明局部标识符 `title`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 689 | <code>            const parentAnchor = extractStructuredQueryAnchors(title)[0] &#124;&#124; '';</code> | 声明局部标识符 `parentAnchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 690 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 691 | <code>            ref_id: normalizeString(result?.ref_id &#124;&#124; result?.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 692 | <code>            title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 693 | <code>            url: normalizeString(result?.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 694 | <code>            structured_anchor: parentAnchor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 695 | <code>            structured_kind: structuredAnchorKind(title),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 696 | <code>            visible_snippet_occurrences: countExactLexicalChildTitleUnits(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 697 | <code>                result?.snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 698 | <code>                quotedTerm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 699 | <code>                parentAnchor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 700 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 701 | <code>            search_rank: Number(result?.rank) &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 702 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 704 | <code>        .filter((entry) =&gt; entry.ref_id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 705 | <code>    const rawCounts = allEntries</code> | 声明局部标识符 `rawCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 706 | <code>        .filter((entry) =&gt; !parentKind &#124;&#124; entry.structured_kind === parentKind)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 707 | <code>        .sort((left, right) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 708 | <code>            right.visible_snippet_occurrences - left.visible_snippet_occurrences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 709 | <code>            (left.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER) - (right.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 710 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>    const countsByIdentity = new Map();</code> | 声明局部标识符 `countsByIdentity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 712 | <code>    for (const entry of rawCounts) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 713 | <code>        const identity = normalizeString(entry.structured_anchor).toLowerCase() &#124;&#124;</code> | 声明局部标识符 `identity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 714 | <code>            normalizeString(entry.url).toLowerCase() &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 715 | <code>            normalizeString(entry.title).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 716 | <code>        const existing = countsByIdentity.get(identity);</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 717 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 718 | <code>            !existing &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 719 | <code>            entry.visible_snippet_occurrences &gt; existing.visible_snippet_occurrences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 720 | <code>            (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 721 | <code>                entry.visible_snippet_occurrences === existing.visible_snippet_occurrences &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 722 | <code>                (entry.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER) &lt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 723 | <code>                    (existing.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 724 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 726 | <code>            countsByIdentity.set(identity, entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 727 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 728 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>    const counts = [...countsByIdentity.values()].sort((left, right) =&gt;</code> | 声明局部标识符 `counts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 730 | <code>        right.visible_snippet_occurrences - left.visible_snippet_occurrences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 731 | <code>        (left.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER) - (right.search_rank &#124;&#124; Number.MAX_SAFE_INTEGER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 732 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>    if (!counts.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 734 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 735 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 736 | <code>    const parentIndexCandidates = counts</code> | 声明局部标识符 `parentIndexCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 737 | <code>        .flatMap((parentCandidate) =&gt; allEntries.filter((candidate) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 738 | <code>            if (!candidate.url &#124;&#124; !parentCandidate.url &#124;&#124; candidate.url === parentCandidate.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 739 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 740 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 742 | <code>                const parent = new URL(candidate.url);</code> | 声明局部标识符 `parent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 743 | <code>                const child = new URL(parentCandidate.url);</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 744 | <code>                const parentPath = parent.pathname.replace(/\/+$/, '');</code> | 声明局部标识符 `parentPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 745 | <code>                const childPath = child.pathname.replace(/\/+$/, '');</code> | 声明局部标识符 `childPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 746 | <code>                return parent.origin === child.origin &amp;&amp;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 747 | <code>                    parentPath &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 748 | <code>                    childPath.startsWith(`${parentPath}/`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 749 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 750 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 751 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>        .filter((candidate, index, entries) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 754 | <code>            entries.findIndex((entry) =&gt; entry.ref_id === candidate.ref_id) === index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 755 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>        .sort((left, right) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 757 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 758 | <code>                return new URL(right.url).pathname.length - new URL(left.url).pathname.length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 759 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 760 | <code>                return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 761 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>    const candidateSetComplete = false;</code> | 声明局部标识符 `candidateSetComplete`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 764 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 765 | <code>        status: candidateSetComplete ? 'incomplete_counts' : 'incomplete_candidate_set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 766 | <code>        selector: lower.match(/\b(most&#124;least&#124;fewest&#124;highest&#124;lowest)\b/)?.[1] &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 767 | <code>        parent_kind: parentKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 768 | <code>        quoted_term: quotedTerm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 769 | <code>        lexical_match: 'exact_whole_token_or_phrase',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 770 | <code>        scope: 'deduplicated_structured_child_title_units_visible_in_search_result_snippets',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 771 | <code>        result_ranking_is_selection_evidence: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 772 | <code>        counts_are_final_group_counts: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 773 | <code>        competing_matching_candidates_visible: counts.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 774 | <code>        candidate_set_coverage_sufficient: candidateSetComplete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 775 | <code>        parent_index_candidates: parentIndexCandidates.map((entry) =&gt; entry.ref_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 776 | <code>        caveat: 'Search snippets may be partial. Repeated structured child identifiers and the parent page title are excluded, but visible counts still require verification against each parent page and the candidate-set boundary.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 777 | <code>        candidates: counts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 778 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 782 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 783 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 784 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 785 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 786 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>function firstObject(...values) {</code> | 定义函数 `firstObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 790 | <code>    return values.find((value) =&gt; value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value)) &#124;&#124; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 791 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 793 | <code>function bridgeStructuredContent(result = {}) {</code> | 定义函数 `bridgeStructuredContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 794 | <code>    return firstObject(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 795 | <code>        result.structuredContent?.result?.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 796 | <code>        result.structured_content?.result?.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 797 | <code>        result.details?.result?.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 798 | <code>        result.details?.result?.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 799 | <code>        result.details?.result?.details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 800 | <code>        result.result?.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 801 | <code>        result.result?.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 802 | <code>        result.result?.details?.result?.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 803 | <code>        result.result?.details?.result?.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 804 | <code>        result.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 805 | <code>        result.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 806 | <code>        result.result?.details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 807 | <code>        result.details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 808 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 809 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 811 | <code>function bridgeTextContent(result = {}) {</code> | 定义函数 `bridgeTextContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 812 | <code>    const content = Array.isArray(result.content)</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 813 | <code>        ? result.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 814 | <code>        : Array.isArray(result.result?.content)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 815 | <code>        ? result.result.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 816 | <code>        : Array.isArray(result.details?.result?.content)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 817 | <code>        ? result.details.result.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 818 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 819 | <code>    return content.map((item) =&gt; normalizeString(item?.text)).filter(Boolean).join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 820 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>function sourceViewportSectionLinks(sourceViews = [], pageUrl = '') {</code> | 定义函数 `sourceViewportSectionLinks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 823 | <code>    let page;</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 824 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 825 | <code>        page = new URL(pageUrl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 826 | <code>        page.hash = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 827 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 828 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 829 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 830 | <code>    const links = [];</code> | 声明局部标识符 `links`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 831 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 832 | <code>    const pattern = /\[([^\]\n]{1,200})\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 833 | <code>    for (const sourceView of sourceViews) {</code> | 声明局部标识符 `sourceView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 834 | <code>        const lines = Array.isArray(sourceView?.lines) ? sourceView.lines : [];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 835 | <code>        for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 836 | <code>            const text = normalizeString(line?.text &#124;&#124; line?.rendered);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 837 | <code>            pattern.lastIndex = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 838 | <code>            let match;</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 839 | <code>            while ((match = pattern.exec(text))) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 840 | <code>                const label = normalizeString(match[1]).replace(/\s+/g, ' ');</code> | 声明局部标识符 `label`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 841 | <code>                if (!label &#124;&#124; /^(?:jump to content&#124;\(?top\)?)$/i.test(label)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 842 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 843 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>                let target;</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 845 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 846 | <code>                    target = new URL(match[2], pageUrl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 847 | <code>                } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 848 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 849 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 850 | <code>                if (!target.hash) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 851 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 852 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>                const targetDocument = new URL(target.toString());</code> | 声明局部标识符 `targetDocument`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 854 | <code>                targetDocument.hash = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 855 | <code>                if (targetDocument.toString() !== page.toString() &#124;&#124; seen.has(target.toString())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 856 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 857 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 858 | <code>                seen.add(target.toString());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 859 | <code>                let fragment = target.hash.slice(1);</code> | 声明局部标识符 `fragment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 860 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 861 | <code>                    fragment = decodeURIComponent(fragment);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 862 | <code>                } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 863 | <code>                    // Keep the raw fragment when percent-decoding is invalid.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 864 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 865 | <code>                links.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 866 | <code>                    kind: 'section',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 867 | <code>                    text: label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 868 | <code>                    url: target.toString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 869 | <code>                    pattern: normalizeString(fragment.replace(/_/g, ' '), label),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 870 | <code>                    navigationMode: 'find',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 871 | <code>                    navigation_mode: 'find'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 872 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 873 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 874 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 875 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 876 | <code>    return links.slice(0, 12);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 877 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 879 | <code>function isFullControlContext(context = {}) {</code> | 定义函数 `isFullControlContext`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 880 | <code>    const rawProfile = typeof context.permissionProfile === 'string'</code> | 声明局部标识符 `rawProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 881 | <code>        ? context.permissionProfile</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 882 | <code>        : context.permissionProfile?.id &#124;&#124; context.permissions &#124;&#124; context.policy &#124;&#124; context.sandbox;</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 883 | <code>    const profile = normalizeString(rawProfile).toLowerCase();</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 884 | <code>    return (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 885 | <code>        profile === 'danger-full-access' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 886 | <code>        profile === 'full-access' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 887 | <code>        context.allowComputerWideAccess === true &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 888 | <code>        (context.computerControlEnabled === true &amp;&amp; context.allowOutsideWorkspace === true)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 889 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 890 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>function summarize(value, maxChars = 600) {</code> | 定义函数 `summarize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 893 | <code>    let text = '';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 894 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 895 | <code>        text = typeof value === 'string' ? value : JSON.stringify(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 896 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 897 | <code>        text = String(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 898 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 899 | <code>    if (text === undefined &#124;&#124; text === null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 900 | <code>        text = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 901 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 902 | <code>    text = text.replace(/\s+/g, ' ').trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 903 | <code>    return text.length &gt; maxChars ? `${text.slice(0, maxChars - 3)}...` : text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 904 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 906 | <code>function isSafeTokenMetricKey(key = '') {</code> | 定义函数 `isSafeTokenMetricKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 907 | <code>    return /^(prompt&#124;completion&#124;input&#124;output&#124;total&#124;reasoning&#124;cached&#124;candidates)Tokens$/i.test(key) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 908 | <code>        /^(prompt&#124;completion&#124;input&#124;output&#124;total&#124;reasoning&#124;cached)_tokens$/i.test(key) &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 909 | <code>        /^(prompt&#124;completion&#124;total&#124;candidates)TokenCount$/i.test(key) &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 910 | <code>        /(^&#124;_)token_count$&#124;^max_output_tokens$/i.test(key);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 911 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 913 | <code>function redactObject(value) {</code> | 定义函数 `redactObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 914 | <code>    if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 915 | <code>        return value.map((entry) =&gt; redactObject(entry));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 916 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 917 | <code>    if (!value &#124;&#124; typeof value !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 918 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 919 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 921 | <code>    const redacted = {};</code> | 声明局部标识符 `redacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 922 | <code>    for (const [key, entry] of Object.entries(value)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 923 | <code>        const isSafeTokenMetric = isSafeTokenMetricKey(key);</code> | 声明局部标识符 `isSafeTokenMetric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 924 | <code>        if (!isSafeTokenMetric &amp;&amp; /token&#124;password&#124;secret&#124;api[_-]?key&#124;authorization&#124;credential&#124;pass&#124;auth[_-]?code/i.test(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 925 | <code>            redacted[key] = '__REDACTED__';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 926 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 927 | <code>            redacted[key] = redactObject(entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 928 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>    return redacted;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 931 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>function createTimeoutError(ms) {</code> | 定义函数 `createTimeoutError`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 934 | <code>    const error = new Error(`tool call timeout after ${ms}ms`);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 935 | <code>    error.code = 'AILIS_GATEWAY_TIMEOUT';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 936 | <code>    return error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 937 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 939 | <code>async function withTimeout(ms, action) {</code> | 定义函数 `withTimeout`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 940 | <code>    let timer = null;</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 941 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 942 | <code>        return await Promise.race([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 943 | <code>            action(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 944 | <code>            new Promise((_, reject) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 945 | <code>                timer = setTimeout(() =&gt; reject(createTimeoutError(ms)), ms);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 946 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 947 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 949 | <code>        if (timer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 950 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 951 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 955 | <code>function extractToolResultText(result) {</code> | 定义函数 `extractToolResultText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 956 | <code>    const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 957 | <code>    for (const part of Array.isArray(result?.content) ? result.content : []) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 958 | <code>        if (typeof part?.text === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 959 | <code>            chunks.push(part.text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 960 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 961 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 962 | <code>    if (result?.details) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 963 | <code>        chunks.push(summarize(result.details, 1200));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 964 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 965 | <code>    return chunks.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 966 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>function classifyToolResult(result) {</code> | 定义函数 `classifyToolResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 969 | <code>    const sourceStatus = normalizeString(result?.details?.status).toLowerCase();</code> | 声明局部标识符 `sourceStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 970 | <code>    const genericStatuses = new Set([</code> | 声明局部标识符 `genericStatuses`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 971 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 972 | <code>        'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 973 | <code>        'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 974 | <code>        'ok',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 975 | <code>        'partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 976 | <code>        'degraded',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 977 | <code>        'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 978 | <code>        'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 979 | <code>        'error'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 980 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 981 | <code>    const observationContract =</code> | 声明局部标识符 `observationContract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 982 | <code>        result?.details?.observationContract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 983 | <code>        result?.details?.observation_contract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 984 | <code>        result?.structuredContent?.observationContract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 985 | <code>        result?.structuredContent?.observation_contract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 986 | <code>        {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 987 | <code>    if (sourceStatus &amp;&amp; !genericStatuses.has(sourceStatus)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 988 | <code>        return sourceStatus;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 989 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 990 | <code>    if (typeof observationContract.status === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 991 | <code>        return observationContract.status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 992 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 993 | <code>    if (typeof result?.details?.status === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 994 | <code>        return result.details.status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 995 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>    const text = extractToolResultText(result);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 997 | <code>    if (/missing_.*key&#124;api key&#124;not configured&#124;no provider registered&#124;TTS conversion failed/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 998 | <code>        return 'needs_config';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 999 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1000 | <code>    if (/pairing required/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1001 | <code>        return 'needs_pairing';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1002 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1003 | <code>    if (/No session context&#124;Unknown sessionKey&#124;sessionKey required/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1004 | <code>        return 'needs_session';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    if (result?.isError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1007 | <code>        return 'error';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1008 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1009 | <code>    return 'completed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1010 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>function extractToolSearchToolsForDirectExposure(result = {}) {</code> | 定义函数 `extractToolSearchToolsForDirectExposure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1013 | <code>    const tools =</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1014 | <code>        result?.__ailisRawToolSearchTools &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1015 | <code>        result?.structuredContent?.tools &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1016 | <code>        result?.details?.tools &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1017 | <code>        [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1018 | <code>    return Array.isArray(tools) ? tools : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1019 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1020 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1021 | <code>function compactToolSearchSchemaForModel(schema = {}) {</code> | 定义函数 `compactToolSearchSchemaForModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1022 | <code>    const source = schema &amp;&amp; typeof schema === 'object' &amp;&amp; !Array.isArray(schema) ? schema : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1023 | <code>    const properties = source.properties &amp;&amp; typeof source.properties === 'object' &amp;&amp; !Array.isArray(source.properties)</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1024 | <code>        ? source.properties</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1025 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1026 | <code>    const compactProperties = Object.fromEntries(Object.entries(properties).slice(0, 16).map(([name, property]) =&gt; {</code> | 声明局部标识符 `compactProperties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1027 | <code>        const value = property &amp;&amp; typeof property === 'object' &amp;&amp; !Array.isArray(property) ? property : {};</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1028 | <code>        return [name, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1029 | <code>            ...(value.type ? { type: value.type } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1030 | <code>            ...(Array.isArray(value.enum) ? { enum: value.enum.slice(0, 16) } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1031 | <code>            ...(value.description ? { description: summarizeForModel(value.description, 240) } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1032 | <code>        }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1033 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1034 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1035 | <code>        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1036 | <code>        properties: compactProperties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1037 | <code>        required: (Array.isArray(source.required) ? source.required : []).filter((name) =&gt; name in compactProperties),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1038 | <code>        additionalProperties: source.additionalProperties === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1039 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1040 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1041 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1042 | <code>function compactToolSearchEntryForModel(entry = {}) {</code> | 定义函数 `compactToolSearchEntryForModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1043 | <code>    const spec = entry.spec &amp;&amp; typeof entry.spec === 'object' ? entry.spec : {};</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1044 | <code>    const schema = entry.input_schema &#124;&#124; entry.inputSchema &#124;&#124; entry.parameters &#124;&#124; spec.parameters &#124;&#124; {};</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1045 | <code>    const id = normalizeString(entry.id &#124;&#124; entry.name &#124;&#124; spec.name);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1046 | <code>    const searchError = normalizeString(entry.type).endsWith('_search_error');</code> | 声明局部标识符 `searchError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1047 | <code>    const callable = Boolean(id) &amp;&amp;</code> | 声明局部标识符 `callable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1048 | <code>        !searchError &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1049 | <code>        entry.callable !== false &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1050 | <code>        spec.callable !== false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1051 | <code>    const availability = normalizeString(</code> | 声明局部标识符 `availability`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1052 | <code>        entry.availability &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1053 | <code>        entry.health &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1054 | <code>        entry.status &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1055 | <code>        spec.availability &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1056 | <code>        spec.health &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1057 | <code>        spec.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1058 | <code>        callable ? 'available' : 'unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1059 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1060 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1061 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1062 | <code>        name: id === VISION_TOOL_ID</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1063 | <code>            ? 'vision_capture_context'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1064 | <code>            : normalizeString(entry.name &#124;&#124; spec.name &#124;&#124; id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1065 | <code>        description: summarizeForModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1066 | <code>            entry.description &#124;&#124; spec.description &#124;&#124; entry.summary &#124;&#124; entry.title &#124;&#124; id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1067 | <code>            420</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1068 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1069 | <code>        input_schema: compactToolSearchSchemaForModel(schema),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1070 | <code>        strict: entry.strict === true &#124;&#124; spec.strict === true &#124;&#124; schema.additionalProperties === false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1071 | <code>        callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1072 | <code>        availability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1073 | <code>        spec_ref: `tool_registry:${id}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1074 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1076 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1077 | <code>function attachRawToolSearchToolsForDirectExposure(guardedResult, rawResult) {</code> | 定义函数 `attachRawToolSearchToolsForDirectExposure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1078 | <code>    if (!guardedResult &#124;&#124; typeof guardedResult !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1079 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1080 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1081 | <code>    const tools = extractToolSearchToolsForDirectExposure(rawResult);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1082 | <code>    if (!tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1083 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1084 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1085 | <code>    Object.defineProperty(guardedResult, '__ailisRawToolSearchTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1086 | <code>        value: tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1087 | <code>        enumerable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1088 | <code>        configurable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1089 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1090 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1092 | <code>function makeExternalVirtualToolResult(result = {}, { toolId = '' } = {}) {</code> | 定义函数 `makeExternalVirtualToolResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1093 | <code>    const status = normalizeString(result.status, result.ok === false ? 'error' : 'completed');</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1094 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1095 | <code>        isError: result.ok === false &#124;&#124; status !== 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1096 | <code>        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1097 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1098 | <code>                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1099 | <code>                text: summarize(result, 6000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1100 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1101 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1102 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1103 | <code>            ...result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1104 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1105 | <code>            toolId: result.toolId &#124;&#124; toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1106 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1107 | <code>        structuredContent: result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1108 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1109 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1111 | <code>function classifyError(error) {</code> | 定义函数 `classifyError`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1112 | <code>    const message = error instanceof Error ? error.message : String(error);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1113 | <code>    if (error instanceof GatewayHttpError &amp;&amp; normalizeString(error.code)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1114 | <code>        return normalizeString(error.code);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1115 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1116 | <code>    if (error?.code === 'AILIS_GATEWAY_APPROVAL_REQUIRED') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1117 | <code>        return 'needs_approval';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>    if (error?.code === 'AILIS_GATEWAY_BLOCKED') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1120 | <code>        return 'blocked';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1122 | <code>    if (/missing_.*key&#124;api key&#124;not configured&#124;no provider registered/i.test(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1123 | <code>        return 'needs_config';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1124 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1125 | <code>    if (/sessionKey required&#124;Unknown sessionKey&#124;No session context&#124;task required/i.test(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1126 | <code>        return 'needs_session';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1127 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>    if (/pairing required/i.test(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1129 | <code>        return 'needs_pairing';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1131 | <code>    if (/gateway.*(closed&#124;timeout&#124;ECONNREFUSED&#124;not connected)&#124;Not connected/i.test(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1132 | <code>        return 'needs_gateway';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1133 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1134 | <code>    return 'error';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1135 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1137 | <code>function analysisTimestamp(value = {}) {</code> | 定义函数 `analysisTimestamp`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1138 | <code>    const numericTs = Number(value.ts &#124;&#124; value.startedAt &#124;&#124; value.completedAt &#124;&#124; 0);</code> | 声明局部标识符 `numericTs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1139 | <code>    if (Number.isFinite(numericTs) &amp;&amp; numericTs &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1140 | <code>        return numericTs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1141 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1142 | <code>    const parsed = Date.parse(value.iso &#124;&#124; value.createdAt &#124;&#124; value.updatedAt &#124;&#124; '');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1143 | <code>    return Number.isFinite(parsed) ? parsed : 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1144 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1146 | <code>function analysisIso(value = {}) {</code> | 定义函数 `analysisIso`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1147 | <code>    const ts = analysisTimestamp(value);</code> | 声明局部标识符 `ts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1148 | <code>    return ts ? new Date(ts).toISOString() : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1149 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1151 | <code>function usageMetric(usage = {}, keys = []) {</code> | 定义函数 `usageMetric`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1152 | <code>    if (!usage &#124;&#124; typeof usage !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1153 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1154 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>    for (const key of keys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1156 | <code>        const value = key.split('.').reduce((current, part) =&gt; current?.[part], usage);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1157 | <code>        const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1158 | <code>        if (Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1159 | <code>            return numericValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1160 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1162 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1163 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1165 | <code>function normalizeUsageForAnalysis(usage = {}) {</code> | 定义函数 `normalizeUsageForAnalysis`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1166 | <code>    if (!usage &#124;&#124; typeof usage !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1167 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1169 | <code>    const promptTokens = usageMetric(usage, ['promptTokens', 'prompt_tokens', 'input_tokens', 'promptTokenCount']);</code> | 声明局部标识符 `promptTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1170 | <code>    const completionTokens = usageMetric(usage, ['completionTokens', 'completion_tokens', 'output_tokens', 'candidatesTokenCount']);</code> | 声明局部标识符 `completionTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1171 | <code>    const totalTokens = usageMetric(usage, ['totalTokens', 'total_tokens', 'totalTokenCount']);</code> | 声明局部标识符 `totalTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1172 | <code>    const reasoningTokens = usageMetric(usage, [</code> | 声明局部标识符 `reasoningTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1173 | <code>        'reasoningTokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1174 | <code>        'completion_tokens_details.reasoning_tokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1175 | <code>        'output_tokens_details.reasoning_tokens'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1176 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1177 | <code>    const cachedTokens = usageMetric(usage, [</code> | 声明局部标识符 `cachedTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1178 | <code>        'cachedTokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1179 | <code>        'prompt_tokens_details.cached_tokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1180 | <code>        'input_tokens_details.cached_tokens'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1181 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1182 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1183 | <code>        promptTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1184 | <code>        completionTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1185 | <code>        totalTokens: totalTokens ?? (</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1186 | <code>            Number.isFinite(promptTokens) &#124;&#124; Number.isFinite(completionTokens)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1187 | <code>                ? Number(promptTokens &#124;&#124; 0) + Number(completionTokens &#124;&#124; 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1188 | <code>                : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1189 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1190 | <code>        reasoningTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1191 | <code>        cachedTokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1192 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1193 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1195 | <code>function addUsageTotals(total, usage = {}) {</code> | 定义函数 `addUsageTotals`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1196 | <code>    const normalized = normalizeUsageForAnalysis(usage);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1197 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1198 | <code>        return total;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1200 | <code>    for (const key of ['promptTokens', 'completionTokens', 'totalTokens', 'reasoningTokens', 'cachedTokens']) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1201 | <code>        const numericValue = Number(normalized[key]);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1202 | <code>        if (Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1203 | <code>            total[key] += numericValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1204 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>    return total;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1207 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1209 | <code>function getPayloadIteration(payload = {}) {</code> | 定义函数 `getPayloadIteration`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1210 | <code>    const value = Number(payload.iteration ?? payload.context?.iteration ?? payload.args?.iteration);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1211 | <code>    return Number.isFinite(value) ? value : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1212 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1214 | <code>function summarizeForAnalysis(value, maxChars = 1800) {</code> | 定义函数 `summarizeForAnalysis`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1215 | <code>    return summarize(value, maxChars);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1216 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1218 | <code>function timelineKind(type = '') {</code> | 定义函数 `timelineKind`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1219 | <code>    if (/context_snapshot&#124;prompt_budget&#124;context_artifact/.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1220 | <code>        return 'context';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1221 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1222 | <code>    if (/llm_call&#124;token_usage/.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1223 | <code>        return 'llm';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1224 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1225 | <code>    if (/tool\./.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1226 | <code>        return 'tool';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1227 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1228 | <code>    if (/decision&#124;reasoning&#124;capability/.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1229 | <code>        return 'agent';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1230 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1231 | <code>    if (/final&#124;blocked&#124;completed/.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1232 | <code>        return 'result';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1233 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1234 | <code>    return 'runtime';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1235 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1237 | <code>function timelineTitle(type = '', payload = {}) {</code> | 定义函数 `timelineTitle`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1238 | <code>    const iteration = getPayloadIteration(payload);</code> | 声明局部标识符 `iteration`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1239 | <code>    const prefix = Number.isFinite(iteration) ? `轮次 ${iteration + 1} · ` : '';</code> | 声明局部标识符 `prefix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1240 | <code>    if (type === 'agent.context_snapshot') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1241 | <code>        return `${prefix}完整上下文`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1243 | <code>    if (type === 'agent.llm_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1244 | <code>        return `${prefix}LLM 决策 ${payload.model &#124;&#124; payload.provider &#124;&#124; ''}`.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1245 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1246 | <code>    if (type === 'agent.decision') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1247 | <code>        return `${prefix}Agent 决策 ${payload.action &#124;&#124; payload.status &#124;&#124; ''}`.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1248 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1249 | <code>    if (type === 'tool.call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1250 | <code>        return `${prefix}工具开始 ${payload.tool &#124;&#124; ''}`.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1251 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1252 | <code>    if (type === 'tool.result') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1253 | <code>        return `${prefix}工具结果 ${payload.tool &#124;&#124; ''}`.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1254 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1255 | <code>    if (type === 'agent.capability_context') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1256 | <code>        return `${prefix}能力上下文加载`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1257 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1258 | <code>    if (type === 'context_artifact.created') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1259 | <code>        return `${prefix}上下文产物 ${payload.artifactId &#124;&#124; ''}`.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1260 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>    if (type === 'agent.progress_note') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1262 | <code>        return `${prefix}公开进展`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1263 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1264 | <code>    if (type === 'agent.reasoning') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1265 | <code>        return `${prefix}推理摘要`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>    if (type === 'agent.final') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1268 | <code>        return '最终答复';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1270 | <code>    if (type === 'agent.blocked') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1271 | <code>        return '运行阻塞';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1272 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1273 | <code>    return payload.title &#124;&#124; payload.stage &#124;&#124; type &#124;&#124; 'runtime item';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1274 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1276 | <code>function isRunAuditEntry(entry = {}, runId = '') {</code> | 定义函数 `isRunAuditEntry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1277 | <code>    if (!entry &#124;&#124; typeof entry !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1278 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1279 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1280 | <code>    return entry.runId === runId &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1281 | <code>        entry.args?.runId === runId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1282 | <code>        entry.context?.runId === runId &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1283 | <code>        entry.result?.runId === runId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1284 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1286 | <code>function isRunGatewayEvent(event = {}, runId = '') {</code> | 定义函数 `isRunGatewayEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1287 | <code>    const payload = event?.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1288 | <code>    return payload.runId === runId &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1289 | <code>        payload.context?.runId === runId &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1290 | <code>        payload.result?.runId === runId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1291 | <code>        payload.args?.runId === runId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1292 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1294 | <code>function throwBlocked(message, details = undefined) {</code> | 定义函数 `throwBlocked`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1295 | <code>    const error = new Error(message);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1296 | <code>    error.code = 'AILIS_GATEWAY_BLOCKED';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1297 | <code>    error.details = details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1298 | <code>    throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1299 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1301 | <code>function throwApprovalRequired(message, details = undefined) {</code> | 定义函数 `throwApprovalRequired`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1302 | <code>    const error = new Error(message);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1303 | <code>    error.code = 'AILIS_GATEWAY_APPROVAL_REQUIRED';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1304 | <code>    error.details = details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1305 | <code>    throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1306 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1308 | <code>function summarizeEmberHarnessRecord(record = {}) {</code> | 定义函数 `summarizeEmberHarnessRecord`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1309 | <code>    if (!record &#124;&#124; typeof record !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1310 | <code>        return record;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1311 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1312 | <code>    const snapshot = record.snapshot &amp;&amp; typeof record.snapshot === 'object'</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1313 | <code>        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1314 | <code>            snapshotId: record.snapshot.snapshotId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1315 | <code>            stage: record.snapshot.stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1316 | <code>            boundary: record.snapshot.boundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1317 | <code>            textHash: record.snapshot.textHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1318 | <code>            textChars: record.snapshot.textChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1319 | <code>            approxTokens: record.snapshot.approxTokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1320 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1321 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1322 | <code>    const rollbackTo = record.rollbackTo &amp;&amp; typeof record.rollbackTo === 'object'</code> | 声明局部标识符 `rollbackTo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1323 | <code>        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1324 | <code>            snapshotId: record.rollbackTo.snapshotId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1325 | <code>            stage: record.rollbackTo.stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1326 | <code>            boundary: record.rollbackTo.boundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1327 | <code>            textHash: record.rollbackTo.textHash</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1328 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1329 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1330 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1331 | <code>        schema: record.schema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1332 | <code>        checkId: record.checkId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1333 | <code>        runId: record.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1334 | <code>        sessionId: record.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1335 | <code>        stage: record.stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1336 | <code>        boundary: record.boundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1337 | <code>        mode: record.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1338 | <code>        status: record.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1339 | <code>        decision: record.decision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1340 | <code>        blocked: record.blocked,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1341 | <code>        riskLevel: record.riskLevel,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1342 | <code>        riskTypes: record.riskTypes,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1343 | <code>        summary: record.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1344 | <code>        suggestion: record.suggestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1345 | <code>        evaluatorConfigured: record.evaluatorConfigured,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1346 | <code>        snapshot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1347 | <code>        rollbackTo</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1348 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1349 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1351 | <code>function buildSmokeStatusMap(reportPath) {</code> | 定义函数 `buildSmokeStatusMap`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1352 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1353 | <code>        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1354 | <code>        const map = new Map();</code> | 声明局部标识符 `map`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1355 | <code>        for (const result of Array.isArray(report.results) ? report.results : []) {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1356 | <code>            if (result?.id &amp;&amp; !String(result.id).includes(':')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1357 | <code>                map.set(result.id, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1358 | <code>                    status: result.status &#124;&#124; 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1359 | <code>                    check: result.check &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1360 | <code>                    materialized: Boolean(result.materialized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1361 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1362 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1365 | <code>            ok: Boolean(report.summary?.ok),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1366 | <code>            generatedAt: report.generatedAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1367 | <code>            path: reportPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1368 | <code>            map</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1369 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1370 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1371 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1372 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1373 | <code>            generatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1374 | <code>            path: reportPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1375 | <code>            map: new Map()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1376 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1377 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1378 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1380 | <code>function buildGatewayConfig() {</code> | 定义函数 `buildGatewayConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1381 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1382 | <code>        browser: { enabled: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1383 | <code>        plugins: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1384 | <code>            entries: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1385 | <code>                browser: { enabled: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1386 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1387 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1388 | <code>        tools: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1389 | <code>            profile: 'full',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1390 | <code>            experimental: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1391 | <code>                planTool: true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1392 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1393 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1394 | <code>        agents: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1395 | <code>            defaults: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1396 | <code>                imageModel: { primary: 'openai/gpt-5.4' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1397 | <code>                imageGenerationModel: { primary: 'openai/gpt-image-1' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1398 | <code>                videoGenerationModel: { primary: 'openai/sora-2' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1399 | <code>                musicGenerationModel: { primary: 'suno/default' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1400 | <code>                pdfModel: { primary: 'anthropic/claude-sonnet-4-6' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1401 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1402 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1403 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1404 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1406 | <code>class AILISGateway extends EventEmitter {</code> | 定义类 `AILISGateway`，把相关状态与行为收拢为一个运行时对象。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1407 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1408 | <code>        super();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1409 | <code>        this.app = options.app;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1410 | <code>        this.projectRoot = path.resolve(options.projectRoot &#124;&#124; PROJECT_ROOT);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1411 | <code>        this.workspaceRoot = path.resolve(options.workspaceRoot &#124;&#124; this.projectRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1412 | <code>        this.port = options.port === undefined ? DEFAULT_PORT : Number(options.port);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1413 | <code>        this.host = normalizeString(options.host, '127.0.0.1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1414 | <code>        this.toolGatewayUrl = normalizeString(options.toolGatewayUrl, DEFAULT_TOOL_GATEWAY_URL);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1415 | <code>        this.auditDir = path.resolve(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1416 | <code>            options.auditDir &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1417 | <code>                (this.app?.getPath?.('userData')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1418 | <code>                    ? path.join(this.app.getPath('userData'), 'ailis-gateway')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1419 | <code>                    : path.join(this.projectRoot, 'tmp', 'ailis-gateway'))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1420 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1421 | <code>        this.auditLogPath = path.join(this.auditDir, 'audit.jsonl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1422 | <code>        this.smokeReportPath = path.join(this.projectRoot, 'tmp', 'openclaw-tool-smoke', 'last-report.json');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1423 | <code>        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter &#124;&#124; options.platform &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1424 | <code>        this.rawMemoryLedger = options.rawMemoryLedger &#124;&#124; new AILISRawMemoryLedger({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1425 | <code>            rootDir: path.join(this.auditDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1426 | <code>            workspaceRoot: this.workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1427 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1428 | <code>        this.runtime = new AILISRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1429 | <code>            auditDir: this.auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1430 | <code>            workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1431 | <code>            projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1432 | <code>            platformAdapter: this.platformAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1433 | <code>            rawMemoryLedger: this.rawMemoryLedger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1434 | <code>            emitGatewayEvent: (type, payload) =&gt; this.emitGatewayEvent(type, payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1435 | <code>            mcpServers: options.mcpServers,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1436 | <code>            mcpConfigPath: options.mcpConfigPath &#124;&#124; path.join(this.auditDir, 'mcp-servers.json'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1437 | <code>            agentExecutor: (payload) =&gt; this.executeTaskAgent(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1438 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1439 | <code>        this.server = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1440 | <code>        this.startedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1441 | <code>        this.sseClients = new Set();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1442 | <code>        this.eventSeq = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1443 | <code>        this.eventLog = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1444 | <code>        this.eventLogLimit = Math.max(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1445 | <code>            100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1446 | <code>            Math.min(Number(options.eventLogLimit &#124;&#124; DEFAULT_EVENT_REPLAY_LIMIT), MAX_EVENT_REPLAY_LIMIT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1447 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1448 | <code>        this.httpRequestTimeoutMs = Math.max(</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1449 | <code>            0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1450 | <code>            Number(options.httpRequestTimeoutMs ?? options.requestTimeoutMs ?? DEFAULT_HTTP_REQUEST_TIMEOUT_MS) &#124;&#124; 0</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1451 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1452 | <code>        this.toolRuntimeModulePromise = null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1453 | <code>        this.toolSets = new Map();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1454 | <code>        this.webRunSessions = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1455 | <code>        this.toolRuntimeSupervisor = null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1456 | <code>        this.profileCurationEnabled = options.profileCurationEnabled !== false;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1457 | <code>        this.profileCurationStartDelayMs = Math.max(1000, Number(options.profileCurationStartDelayMs) &#124;&#124; DEFAULT_PROFILE_CURATION_START_DELAY_MS);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1458 | <code>        this.profileCurationCheckIntervalMs = Math.max(60 * 1000, Number(options.profileCurationCheckIntervalMs) &#124;&#124; DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1459 | <code>        this.profileCurationStartTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1460 | <code>        this.profileCurationIntervalTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1461 | <code>        this.profileCurationDebounceTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1462 | <code>        this.profileCurationDebounceMs = Math.max(5000, Number(options.profileCurationDebounceMs) &#124;&#124; DEFAULT_PROFILE_CURATION_DEBOUNCE_MS);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1463 | <code>        this.profileCurationRunning = false;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1464 | <code>        this.computerTool = new AILISComputerTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1465 | <code>            workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1466 | <code>            platformAdapter: this.platformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1467 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1468 | <code>        this.getEmailProfiles = typeof options.getEmailProfiles === 'function'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1469 | <code>            ? options.getEmailProfiles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1470 | <code>            : () =&gt; options.emailProfiles &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1471 | <code>        this.getDefaultToolContext = typeof options.getDefaultContext === 'function'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1472 | <code>            ? options.getDefaultContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1473 | <code>            : () =&gt; options.defaultContext &#124;&#124; {};</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1474 | <code>        this.visionServices = options.visionServices &#124;&#124; {};</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1475 | <code>        this.memoryRuntime = options.memoryRuntime &#124;&#124; new AILISMemoryRuntime({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1476 | <code>            rootDir: path.join(this.auditDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1477 | <code>            workspaceRoot: this.workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1478 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1479 | <code>        this.preferenceState = options.preferenceState &#124;&#124; new AILISPreferenceState({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1480 | <code>            rootDir: path.join(this.auditDir, 'memory')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1481 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1482 | <code>        this.taskResultCapsules = options.taskResultCapsules &#124;&#124; new AILISTaskResultCapsuleStore({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1483 | <code>            rootDir: path.join(this.auditDir, 'task-results')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1484 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1485 | <code>        this.taskAgentHarness = options.taskAgentHarness &#124;&#124; new AILISSystemTaskAgentHarness({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1486 | <code>            rootDir: path.join(this.auditDir, 'task-agent-harness'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1487 | <code>            taskResultCapsules: this.taskResultCapsules,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1488 | <code>            maxAgentSteps: TASK_AGENT_MAX_MODEL_ROUNDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1489 | <code>            executeTaskAgent: (payload) =&gt; this.executeTaskAgent(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1490 | <code>            emitEvent: (type, payload) =&gt; this.emitGatewayEvent(type, payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1491 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1492 | <code>        this.taskResultBackfill = { ok: true, imported: 0, capsuleCount: this.taskResultCapsules?.getStatus?.().capsuleCount &#124;&#124; 0 };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1493 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1494 | <code>            const memoryEvents = this.memoryRuntime?.searchMemory?.('', { limit: 500 })?.events &#124;&#124; [];</code> | 声明局部标识符 `memoryEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1495 | <code>            this.taskResultBackfill = this.taskResultCapsules?.backfillFromMemoryEvents?.(memoryEvents) &#124;&#124; this.taskResultBackfill;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1496 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1497 | <code>            this.taskResultBackfill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1498 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1499 | <code>                imported: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1500 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1501 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1502 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1503 | <code>        const configuredEmberEvaluator = typeof options.emberHarnessEvaluator === 'function'</code> | 声明局部标识符 `configuredEmberEvaluator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1504 | <code>            ? options.emberHarnessEvaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1505 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1506 | <code>        this.localSafetyEvaluator = options.localSafetyEvaluator &#124;&#124; options.localSafetyClassifier &#124;&#124; (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1507 | <code>            !options.emberHarness &amp;&amp; !configuredEmberEvaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1508 | <code>                ? new AILISSensitiveWordClassifier({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1509 | <code>                    customLexiconPath: options.emberHarnessLexiconPath &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1510 | <code>                        path.join(this.auditDir, 'safety', 'sensitive-words.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1511 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1512 | <code>                : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1513 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1514 | <code>        const activeEmberEvaluator = configuredEmberEvaluator &#124;&#124; (</code> | 声明局部标识符 `activeEmberEvaluator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1515 | <code>            this.localSafetyEvaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1516 | <code>                ? (payload) =&gt; this.localSafetyEvaluator.evaluate(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1517 | <code>                : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1518 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1519 | <code>        this.emberHarness = options.emberHarness &#124;&#124; new AILISEmberHarness({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1520 | <code>            enabled: options.emberHarnessEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1521 | <code>            mode: options.emberHarnessMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1522 | <code>            evaluator: activeEmberEvaluator,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1523 | <code>            evaluatorStatus: this.localSafetyEvaluator</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1524 | <code>                ? () =&gt; this.localSafetyEvaluator.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1525 | <code>                : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1526 | <code>            maxRunRecords: options.emberHarnessMaxRunRecords,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1527 | <code>            maxTotalRecords: options.emberHarnessMaxTotalRecords</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1528 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1529 | <code>        this.userProfileCurator = options.userProfileCurator &#124;&#124; new AILISUserProfileCurator({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1530 | <code>            rootDir: path.join(this.auditDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1531 | <code>            workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1532 | <code>            rawMemoryLedger: this.rawMemoryLedger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1533 | <code>            preferenceState: this.preferenceState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1534 | <code>            llmClient: typeof options.profileCurationLlm === 'function' ? options.profileCurationLlm : null,</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1535 | <code>            emitGatewayEvent: (type, payload) =&gt; this.emitGatewayEvent(type, payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1536 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1537 | <code>        this.selfEvolutionRuntime = options.selfEvolutionRuntime &#124;&#124; new AilisSelfEvolutionRuntime({</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1538 | <code>            auditDir: this.auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1539 | <code>            workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1540 | <code>            projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1541 | <code>            runtime: this.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1542 | <code>            memoryRuntime: this.memoryRuntime,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1543 | <code>            emitGatewayEvent: (type, payload) =&gt; this.emitGatewayEvent(type, payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1544 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1545 | <code>        this.runtime.setSelfEvolutionRuntime?.(this.selfEvolutionRuntime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1546 | <code>        this.gatewayToolRuntimeRegistry = this.createGatewayToolRuntimeRegistry();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1547 | <code>        this.agentRunner = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1548 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1550 | <code>    configureEmberHarness(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1551 | <code>        const enabled = options.enabled !== undefined</code> | 声明局部标识符 `enabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1552 | <code>            ? options.enabled !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1553 | <code>            : this.emberHarness?.enabled !== false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1554 | <code>        const harnessPatch = { enabled };</code> | 声明局部标识符 `harnessPatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1555 | <code>        if ('mode' in options) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1556 | <code>            harnessPatch.mode = options.mode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1557 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1558 | <code>        const status = this.emberHarness?.configure?.(harnessPatch) &#124;&#124; null;</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1559 | <code>        if (this.localSafetyEvaluator) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1560 | <code>            if (enabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1561 | <code>                void this.prepareLocalSafetyEvaluator('configuration_changed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1562 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1563 | <code>                void this.localSafetyEvaluator.dispose().catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1564 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1566 | <code>        this.emitGatewayEvent('ember.harness.configured', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1567 | <code>            enabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1568 | <code>            mode: status?.mode &#124;&#124; options.mode &#124;&#124; 'observe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1569 | <code>            status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1570 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1571 | <code>        return this.emberHarness?.getStatus?.() &#124;&#124; status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1572 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1574 | <code>    async prepareLocalSafetyEvaluator(reason = 'manual') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1575 | <code>        if (!this.localSafetyEvaluator &#124;&#124; this.emberHarness?.enabled === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1576 | <code>            return this.emberHarness?.getStatus?.() &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1577 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1578 | <code>        this.emitGatewayEvent('ember.harness.evaluator', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1579 | <code>            reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1580 | <code>            status: this.localSafetyEvaluator.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1581 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1582 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1583 | <code>            await this.localSafetyEvaluator.prepare();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1584 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1585 | <code>        const status = this.emberHarness?.getStatus?.() &#124;&#124; null;</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1586 | <code>        this.emitGatewayEvent('ember.harness.evaluator', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1587 | <code>            reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1588 | <code>            status: status?.evaluatorRuntime &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1589 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1590 | <code>        return status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1591 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1593 | <code>    createGatewayToolRuntimeRegistry() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1594 | <code>        const registry = new AILISToolRuntimeRegistry({ runtime: this.runtime });</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1595 | <code>        const localDefinitions = [</code> | 声明局部标识符 `localDefinitions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1596 | <code>            ...AILIS_LOCAL_TOOL_DEFINITIONS.map((definition) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1597 | <code>                ...definition,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1598 | <code>                exposure: CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS.has(definition.id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1599 | <code>                    ? TOOL_EXPOSURE.DIRECT</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1600 | <code>                    : EXTENDED_LOCAL_TOOL_EXPOSURE</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1601 | <code>            })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1602 | <code>            ...['read', 'write', 'exec', 'apply_patch'].map((id) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1603 | <code>                const toolSurfaceDefinition = OPENCLAW_CORE_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === id) &#124;&#124; {};</code> | 声明局部标识符 `toolSurfaceDefinition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1604 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1605 | <code>                    id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1606 | <code>                    label: toolSurfaceDefinition.label &#124;&#124; id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1607 | <code>                    description: toolSurfaceDefinition.description &#124;&#124; `Local core ${id} tool.`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1608 | <code>                    sectionId: toolSurfaceDefinition.sectionId &#124;&#124; 'local-core',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1609 | <code>                    route: 'ailis-local-core',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1610 | <code>                    materialized: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1611 | <code>                    status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1612 | <code>                    needsApprovalActions: id === 'exec' ? Object.freeze(['exec']) : id === 'apply_patch' ? Object.freeze(['apply_patch']) : Object.freeze([]),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1613 | <code>                    exposure: CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS.has(id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1614 | <code>                        ? TOOL_EXPOSURE.DIRECT</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1615 | <code>                        : EXTENDED_LOCAL_TOOL_EXPOSURE</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1616 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1617 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1618 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1619 | <code>        for (const definition of localDefinitions) {</code> | 声明局部标识符 `definition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1620 | <code>            registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1621 | <code>                definition,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1622 | <code>                handle: async (args, context) =&gt; this.executeGatewayLocalTool(definition.id, args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1623 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1625 | <code>        for (const definition of this.runtime.getRuntimeToolDefinitions()) {</code> | 声明局部标识符 `definition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1626 | <code>            if (definition.id === 'tool_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1627 | <code>                registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1628 | <code>                    definition: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1629 | <code>                        ...definition,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1630 | <code>                        route: 'ailis-gateway',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1631 | <code>                        description: 'Tool discovery. Searches deferred tool metadata and exposes matching tools for the next Agent step. Use it as soon as the visible direct tools are a poor semantic fit or would require manually reconstructing structured facts, cross-record ordering, entity resolution, document parsing, transcripts, APIs, or artifact data. When a user names an authoritative database, registry, service, or file type and asks for structured fields, call tool_search before broad web_run discovery; use web_run only to discover a connector prerequisite, then return to the connector.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1632 | <code>                        exposure: TOOL_EXPOSURE.DIRECT</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1633 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1634 | <code>                    handle: async (args) =&gt; this.executeGatewayToolSearch(args)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1635 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1636 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1637 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>            registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1639 | <code>                definition: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1640 | <code>                    ...definition,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1641 | <code>                    route: definition.route &#124;&#124; 'ailis-runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1642 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1643 | <code>                handle: async (args, context) =&gt; this.runtime.executeTool(definition.id, args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1644 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1645 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1646 | <code>        return registry;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1647 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1649 | <code>    async executeGatewayToolSearch(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1650 | <code>        const query = normalizeString(args.query &#124;&#124; args.q);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1651 | <code>        const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 12), 50));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1652 | <code>        const retrievalLimit = Math.max(limit, Math.min(50, Math.max(12, limit * 4)));</code> | 声明局部标识符 `retrievalLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1653 | <code>        const includeDirect = args.includeDirect === true;</code> | 声明局部标识符 `includeDirect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1654 | <code>        const local = this.gatewayToolRuntimeRegistry.search(query, retrievalLimit)</code> | 声明局部标识符 `local`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1655 | <code>            .filter((entry) =&gt; shouldIncludeDirectToolInSearch(entry, query, includeDirect))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1656 | <code>            .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1657 | <code>                id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1658 | <code>                type: 'gateway_or_runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1659 | <code>                exposure: entry.exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1660 | <code>                spec: entry.spec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1661 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1662 | <code>        let mcp = [];</code> | 声明局部标识符 `mcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1663 | <code>        if (args.includeMcp !== false &amp;&amp; this.runtime?.mcpManager?.searchToolSpecs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1664 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1665 | <code>                mcp = (await this.runtime.mcpManager.searchToolSpecs({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1666 | <code>                    query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1667 | <code>                    limit: retrievalLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1668 | <code>                    timeoutMs: args.timeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1669 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1670 | <code>                    .map((spec) =&gt; createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1671 | <code>                        id: spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1672 | <code>                        server: spec.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1673 | <code>                        tool: spec.tool &#124;&#124; spec.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1674 | <code>                        name: spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1675 | <code>                        title: spec.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1676 | <code>                        description: spec.description &#124;&#124; spec.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1677 | <code>                        inputSchema: spec.inputSchema &#124;&#124; spec.input_schema &#124;&#124; spec.parameters &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1678 | <code>                        schemaProperties: spec.schemaProperties &#124;&#124; spec.schema_properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1679 | <code>                        callPattern: spec.callPattern &#124;&#124; spec.call_pattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1680 | <code>                    }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1681 | <code>                    .filter((spec) =&gt; spec.callable !== false &amp;&amp; spec.modelFacing !== false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1682 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1683 | <code>                mcp = [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1684 | <code>                    type: 'mcp_tool_search_error',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1685 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1686 | <code>                }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1687 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1688 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1689 | <code>        let external = [];</code> | 声明局部标识符 `external`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1690 | <code>        if (args.includeExternal !== false &amp;&amp; this.runtime?.capabilityManager?.searchExternalToolEntries) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1691 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1692 | <code>                const searched = await this.runtime.capabilityManager.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1693 | <code>                    query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1694 | <code>                    limit: retrievalLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1695 | <code>                    includeExposed: args.includeExposed !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1696 | <code>                    includeContracts: args.includeContracts !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1697 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1698 | <code>                external = Array.isArray(searched.tools) ? searched.tools : [];</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1699 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1700 | <code>                external = [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1701 | <code>                    type: 'external_tool_search_error',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1702 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1703 | <code>                }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1704 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1705 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1706 | <code>        const tools = rankToolSearchResults([...external, ...local, ...mcp], query, limit);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1707 | <code>        const publicTools = tools.map(compactToolSearchEntryForModel);</code> | 声明局部标识符 `publicTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1708 | <code>        const recommendedTool = publicTools.find((entry) =&gt; entry.callable) &#124;&#124; null;</code> | 声明局部标识符 `recommendedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1709 | <code>        const routingAdvice = recommendedTool ? buildToolRoutingAdvice(query, tools) : '';</code> | 声明局部标识符 `routingAdvice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1710 | <code>        const discovery = {</code> | 声明局部标识符 `discovery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1711 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1712 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1713 | <code>            routing_advice: routingAdvice,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1714 | <code>            recommended_tool: recommendedTool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1715 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1716 | <code>                      id: recommendedTool.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1717 | <code>                      name: recommendedTool.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1718 | <code>                      callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1719 | <code>                      availability: recommendedTool.availability</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1720 | <code>                  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1721 | <code>                : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1722 | <code>            tools: publicTools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1723 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1724 | <code>        const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1725 | <code>            content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1726 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1727 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1728 | <code>                    text: JSON.stringify(discovery, null, 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1729 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1730 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1731 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1732 | <code>                ...discovery</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1733 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1734 | <code>            structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1735 | <code>                ...discovery</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1736 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1737 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1738 | <code>        Object.defineProperty(result, '__ailisRawToolSearchTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1739 | <code>            value: tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1740 | <code>            enumerable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1741 | <code>            configurable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1742 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1743 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1744 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1746 | <code>    resolveDefaultContext() {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1747 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1748 | <code>            const context = this.getDefaultToolContext();</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1749 | <code>            return context &amp;&amp; typeof context === 'object' ? context : {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1750 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1751 | <code>            return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1752 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1753 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1755 | <code>    mergeDefaultContext(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1756 | <code>        const requestContext = context &amp;&amp; typeof context === 'object' ? context : {};</code> | 声明局部标识符 `requestContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1757 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1758 | <code>            ...this.resolveDefaultContext(),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1759 | <code>            ...requestContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1760 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1761 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1763 | <code>    async start() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1764 | <code>        if (this.server) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1765 | <code>            return this.getStatus({ includeAgentRunner: false });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1766 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1768 | <code>        await fsp.mkdir(this.auditDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1769 | <code>        this.server = http.createServer((req, res) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1770 | <code>            this.handleHttpRequest(req, res).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1771 | <code>                this.sendJson(res, error.statusCode &#124;&#124; 500, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1772 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1773 | <code>                    status: error.code &#124;&#124; 'internal_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1774 | <code>                    error: error.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1775 | <code>                    ...(error.details ? { details: error.details } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1776 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1777 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1778 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1779 | <code>        this.server.requestTimeout = this.httpRequestTimeoutMs;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1780 | <code>        this.server.timeout = this.httpRequestTimeoutMs;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1782 | <code>        await new Promise((resolve, reject) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1783 | <code>            this.server.once('error', reject);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1784 | <code>            this.server.listen(this.port, this.host, () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1785 | <code>                this.server.off('error', reject);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1786 | <code>                this.startedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1787 | <code>                resolve();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1788 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1789 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1791 | <code>        this.emitGatewayEvent('gateway.started', this.getStatus({ includeAgentRunner: false }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1792 | <code>        this.startProfileCurationScheduler();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1793 | <code>        if (this.emberHarness?.enabled !== false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1794 | <code>            void this.prepareLocalSafetyEvaluator('gateway_started');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1795 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1796 | <code>        return this.getStatus({ includeAgentRunner: false });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1797 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1799 | <code>    async stop() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1800 | <code>        this.stopProfileCurationScheduler();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1801 | <code>        for (const client of this.sseClients) {</code> | 声明局部标识符 `client`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1802 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1803 | <code>                client.res?.end?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1804 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1805 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1806 | <code>        this.sseClients.clear();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1808 | <code>        if (this.toolRuntimeSupervisor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1809 | <code>            await this.toolRuntimeSupervisor.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1810 | <code>            this.toolRuntimeSupervisor = null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1811 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1813 | <code>        if (this.computerTool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1814 | <code>            await this.computerTool.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1815 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1817 | <code>        if (this.runtime) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1818 | <code>            await this.runtime.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1819 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1820 | <code>        if (this.localSafetyEvaluator) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1821 | <code>            await this.localSafetyEvaluator.dispose().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1822 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1824 | <code>        if (!this.server) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1825 | <code>            return this.getStatus({ includeAgentRunner: false });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1826 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1828 | <code>        const server = this.server;</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1829 | <code>        this.server = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1830 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1831 | <code>        this.emitGatewayEvent('gateway.stopped', {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1832 | <code>        return this.getStatus({ includeAgentRunner: false });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1833 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1834 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1835 | <code>    startProfileCurationScheduler() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1836 | <code>        if (!this.profileCurationEnabled &#124;&#124; !this.userProfileCurator) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1837 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1838 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1839 | <code>        this.stopProfileCurationScheduler();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1840 | <code>        this.profileCurationStartTimer = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1841 | <code>            void this.runScheduledProfileCuration('startup');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1842 | <code>        }, this.profileCurationStartDelayMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1843 | <code>        this.profileCurationStartTimer.unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1844 | <code>        this.profileCurationIntervalTimer = setInterval(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1845 | <code>            void this.runScheduledProfileCuration('interval');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1846 | <code>        }, this.profileCurationCheckIntervalMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1847 | <code>        this.profileCurationIntervalTimer.unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1848 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1850 | <code>    stopProfileCurationScheduler() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1851 | <code>        if (this.profileCurationStartTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1852 | <code>            clearTimeout(this.profileCurationStartTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1853 | <code>            this.profileCurationStartTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1854 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1855 | <code>        if (this.profileCurationIntervalTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1856 | <code>            clearInterval(this.profileCurationIntervalTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1857 | <code>            this.profileCurationIntervalTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1858 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1859 | <code>        if (this.profileCurationDebounceTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1860 | <code>            clearTimeout(this.profileCurationDebounceTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1861 | <code>            this.profileCurationDebounceTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1862 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1863 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1865 | <code>    scheduleProfileCurationSoon(trigger = 'conversation_idle') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1866 | <code>        if (!this.profileCurationEnabled &#124;&#124; !this.userProfileCurator) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1867 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1868 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1869 | <code>        if (this.profileCurationDebounceTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1870 | <code>            clearTimeout(this.profileCurationDebounceTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1871 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1872 | <code>        this.profileCurationDebounceTimer = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1873 | <code>            this.profileCurationDebounceTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1874 | <code>            void this.runScheduledProfileCuration(trigger, { force: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1875 | <code>        }, this.profileCurationDebounceMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1876 | <code>        this.profileCurationDebounceTimer.unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1877 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1878 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1880 | <code>    async runScheduledProfileCuration(trigger = 'scheduled', options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1881 | <code>        if (this.profileCurationRunning) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1882 | <code>            this.scheduleProfileCurationSoon(trigger);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1883 | <code>            return { ok: false, status: 'profile_curation_already_running' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1884 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1885 | <code>        if (!this.profileCurationEnabled &#124;&#124; !this.userProfileCurator) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1886 | <code>            return { ok: false, status: 'profile_curation_not_started' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1887 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1888 | <code>        this.profileCurationRunning = true;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1889 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1890 | <code>            const [profileState, rawStatus] = await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1891 | <code>                this.getUserProfileCurationState(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1892 | <code>                Promise.resolve(this.getRawMemoryStatus())</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1893 | <code>            ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1894 | <code>            const rebuild = profileState?.rebuild &#124;&#124; null;</code> | 声明局部标识符 `rebuild`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1895 | <code>            const activeRebuild = ['running', 'paused', 'partial_completed', 'failed', 'promoting'].includes(rebuild?.status);</code> | 声明局部标识符 `activeRebuild`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1896 | <code>            const capsuleCount = Number(profileState?.userProfile?.items?.length &#124;&#124; 0) +</code> | 声明局部标识符 `capsuleCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1897 | <code>                Number(profileState?.relationshipProfile?.items?.length &#124;&#124; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1898 | <code>            const shouldRebuild = Number(rawStatus?.entryCount) &gt; 0 &amp;&amp; (</code> | 声明局部标识符 `shouldRebuild`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1899 | <code>                activeRebuild &#124;&#124; (!rebuild &amp;&amp; capsuleCount === 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1900 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1901 | <code>            const result = shouldRebuild</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1902 | <code>                ? await this.rebuildUserProfile({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1903 | <code>                      trigger,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1904 | <code>                      maxPasses: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1905 | <code>                      maxBatches: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1906 | <code>                      ...options</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1907 | <code>                  })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1908 | <code>                : await this.curateUserProfile({ trigger, ...options });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1909 | <code>            this.emitGatewayEvent('memory.profile_curation.scheduled', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1910 | <code>                trigger,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1911 | <code>                ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1912 | <code>                status: result?.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1913 | <code>                rebuildId: result?.rebuild?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1914 | <code>                processedEntryCount: result?.run?.processedEntryCount &#124;&#124; result?.rebuild?.processedEntryCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1915 | <code>                profileUpdateCount: result?.run?.profileUpdateCount &#124;&#124; result?.rebuild?.profileUpdateCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1916 | <code>                relationshipUpdateCount: result?.run?.relationshipUpdateCount &#124;&#124; result?.rebuild?.relationshipUpdateCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1917 | <code>                preferenceEventCount: result?.run?.preferenceEventCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1918 | <code>                affinityChanged: result?.run?.affinityChanged === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1919 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1920 | <code>            if (result?.status === 'rebuild_partial') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1921 | <code>                this.scheduleProfileCurationSoon('profile_rebuild_resume');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1922 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1923 | <code>            return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1924 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1925 | <code>            this.emitGatewayEvent('memory.profile_curation.error', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1926 | <code>                trigger,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1927 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1928 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1929 | <code>            return { ok: false, status: 'profile_curation_error', error: error?.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1930 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1931 | <code>            this.profileCurationRunning = false;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1932 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1933 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1935 | <code>    getAddress() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1936 | <code>        const address = this.server?.address?.();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1937 | <code>        if (address &amp;&amp; typeof address === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1938 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1939 | <code>                host: address.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1940 | <code>                port: address.port,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1941 | <code>                url: `http://${address.address === '::' ? '127.0.0.1' : address.address}:${address.port}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1942 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1943 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1944 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1945 | <code>            host: this.host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1946 | <code>            port: this.port,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1947 | <code>            url: `http://${this.host}:${this.port}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1948 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1949 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1951 | <code>    getStatus(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1952 | <code>        const includeAgentRunner = options.includeAgentRunner !== false;</code> | 声明局部标识符 `includeAgentRunner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1953 | <code>        const address = this.getAddress();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1954 | <code>        const gatewayToolDefinitions = this.gatewayToolRuntimeRegistry?.listDefinitions?.() &#124;&#124; [];</code> | 声明局部标识符 `gatewayToolDefinitions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1955 | <code>        const directGatewayTools = this.gatewayToolRuntimeRegistry?.modelVisibleSpecs?.() &#124;&#124; [];</code> | 声明局部标识符 `directGatewayTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1956 | <code>        const agentToolSurface = getOpenClawToolSurfaceSummary();</code> | 声明局部标识符 `agentToolSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1957 | <code>        const agentToolSurfaceValidation = validateOpenClawToolSurface().summary;</code> | 声明局部标识符 `agentToolSurfaceValidation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1958 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1959 | <code>            enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1960 | <code>            running: Boolean(this.server),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1961 | <code>            startedAt: this.startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1962 | <code>            host: address.host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1963 | <code>            port: address.port,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1964 | <code>            url: address.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1965 | <code>            workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1966 | <code>            platform: this.platformAdapter.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1967 | <code>            auditLogPath: this.auditLogPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1968 | <code>            toolGatewayUrl: this.toolGatewayUrl,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1969 | <code>            agentToolSurface,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1970 | <code>            agentToolSurfaceValidation,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1971 | <code>            openClawToolSurface: agentToolSurface,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1972 | <code>            openClawToolSurfaceValidation: agentToolSurfaceValidation,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1973 | <code>            toolContracts: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1974 | <code>                version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1975 | <code>                count: listToolContracts().length</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1976 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1977 | <code>            toolRuntime: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1978 | <code>                model: 'ailis_gateway_tool_registry.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1979 | <code>                registeredToolCount: gatewayToolDefinitions.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1980 | <code>                directToolCount: directGatewayTools.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1981 | <code>                deferredToolCount: gatewayToolDefinitions.filter((tool) =&gt; tool.exposure === TOOL_EXPOSURE.DEFERRED).length</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1982 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1983 | <code>            defaultContext: redactObject(this.resolveDefaultContext()),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1984 | <code>            runtime: this.runtime.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1985 | <code>            memory: this.memoryRuntime?.getStatus?.() &#124;&#124; null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1986 | <code>            emberHarness: this.emberHarness?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1987 | <code>            rawMemory: this.rawMemoryLedger?.getStatus?.() &#124;&#124; null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1988 | <code>            interactionPreferences: this.preferenceState?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1989 | <code>            taskResultCapsules: this.taskResultCapsules?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1990 | <code>            taskAgentHarness: this.taskAgentHarness?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1991 | <code>            taskResultBackfill: this.taskResultBackfill,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1992 | <code>            userProfileCuration: this.userProfileCurator?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1993 | <code>            userProfileCurationScheduler: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1994 | <code>                enabled: this.profileCurationEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1995 | <code>                running: this.profileCurationRunning,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1996 | <code>                startDelayMs: this.profileCurationStartDelayMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1997 | <code>                checkIntervalMs: this.profileCurationCheckIntervalMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1998 | <code>                debounceMs: this.profileCurationDebounceMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1999 | <code>                scheduled: Boolean(this.profileCurationStartTimer &#124;&#124; this.profileCurationIntervalTimer &#124;&#124; this.profileCurationDebounceTimer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2000 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2001 | <code>            selfEvolution: this.selfEvolutionRuntime?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2002 | <code>            toolRuntimeGateway: this.toolRuntimeSupervisor?.getStatus?.() &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2003 | <code>            agentRunner: includeAgentRunner</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2004 | <code>                ? this.ensureAgentRunner().getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2005 | <code>                : (this.agentRunner?.getStatus?.() &#124;&#124; {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2006 | <code>                    enabled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2007 | <code>                    status: 'not_loaded'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2008 | <code>                }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2009 | <code>            events: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2010 | <code>                seq: this.eventSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2011 | <code>                buffered: this.eventLog.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2012 | <code>                bufferLimit: this.eventLogLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2013 | <code>                clients: this.sseClients.size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2014 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2015 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2016 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2018 | <code>    ensureAgentRunner() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2019 | <code>        if (!this.agentRunner) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2020 | <code>            this.agentRunner = new AILISAgentRunner({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2021 | <code>                gateway: this,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2022 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2023 | <code>                memoryRuntime: this.memoryRuntime,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2024 | <code>                preferenceState: this.preferenceState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2025 | <code>                taskResultCapsules: this.taskResultCapsules</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2026 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2027 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2028 | <code>        return this.agentRunner;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2029 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2030 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2031 | <code>    getMemorySnapshot(options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2032 | <code>        return this.memoryRuntime?.getSnapshot?.(options) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2033 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2034 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2035 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2036 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2038 | <code>    getRawMemoryStatus() {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2039 | <code>        return this.rawMemoryLedger?.getStatus?.() &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2040 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2041 | <code>            status: 'raw_memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2042 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2043 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2045 | <code>    replayRawMemory(options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2046 | <code>        return this.rawMemoryLedger?.replay?.(options &#124;&#124; {}) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2047 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2048 | <code>            status: 'raw_memory_not_configured',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2049 | <code>            entries: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2050 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2051 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2052 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2053 | <code>    listRawMemorySessions(limit = 100) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2054 | <code>        return this.rawMemoryLedger?.listSessions?.(limit) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2055 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2056 | <code>            status: 'raw_memory_not_configured',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2057 | <code>            sessions: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2058 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2059 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2060 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2061 | <code>    async curateUserProfile(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2062 | <code>        return await this.userProfileCurator?.runDailyCuration?.(options &#124;&#124; {}) &#124;&#124; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2063 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2064 | <code>            status: 'user_profile_curator_not_configured'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2065 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2066 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2067 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2068 | <code>    async rebuildUserProfile(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2069 | <code>        return await this.userProfileCurator?.rebuildFromRawMemory?.(options &#124;&#124; {}) &#124;&#124; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2070 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2071 | <code>            status: 'user_profile_curator_not_configured'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2072 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2073 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2075 | <code>    async getUserProfileCurationState() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2076 | <code>        return await this.userProfileCurator?.getState?.() &#124;&#124; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2077 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2078 | <code>            status: 'user_profile_curator_not_configured'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2079 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2080 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2081 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2082 | <code>    searchMemory(query, options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2083 | <code>        return this.memoryRuntime?.searchMemory?.(query, options) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2084 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2085 | <code>            status: 'memory_not_configured',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2086 | <code>            events: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2087 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2088 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2089 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2090 | <code>    updateMemoryBlock(key, value) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2091 | <code>        return this.memoryRuntime?.updateBlock?.(key, value) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2092 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2093 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2094 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2095 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2096 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2097 | <code>    resetMemoryAffinity(score) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2098 | <code>        return this.memoryRuntime?.resetAffinity?.(score) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2099 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2100 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2101 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2102 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2104 | <code>    clearMemory(payload = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2105 | <code>        return this.memoryRuntime?.clearMemory?.(payload) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2106 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2107 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2108 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2109 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2111 | <code>    forgetMemory(payload = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2112 | <code>        return this.memoryRuntime?.forgetMemory?.(payload) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2113 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2114 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2115 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2116 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2118 | <code>    saveMemorySecret(payload = {}) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2119 | <code>        return this.memoryRuntime?.saveSecret?.(payload) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2120 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2121 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2122 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2123 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2125 | <code>    deleteMemorySecret(name) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2126 | <code>        return this.memoryRuntime?.deleteSecret?.(name) &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2127 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2128 | <code>            status: 'memory_not_configured'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2129 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2132 | <code>    async analyzeSelfEvolution(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2133 | <code>        await this.selfEvolutionRuntime?.ensureLoaded?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2134 | <code>        return await this.selfEvolutionRuntime.analyze(payload &#124;&#124; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2135 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2137 | <code>    async listSelfEvolutionProposals(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2138 | <code>        await this.selfEvolutionRuntime?.ensureLoaded?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2139 | <code>        return await this.selfEvolutionRuntime.listProposals(payload &#124;&#124; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2140 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2142 | <code>    async markSelfEvolutionProposal(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2143 | <code>        await this.selfEvolutionRuntime?.ensureLoaded?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2144 | <code>        return await this.selfEvolutionRuntime.markProposal(payload &#124;&#124; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2145 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2147 | <code>    async applySelfEvolutionProposal(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2148 | <code>        await this.selfEvolutionRuntime?.ensureLoaded?.();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2149 | <code>        return await this.selfEvolutionRuntime.applyProposal(payload &#124;&#124; {}, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2150 | <code>            approved: payload?.approved === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2151 | <code>            source: payload?.source &#124;&#124; 'gateway'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2152 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2155 | <code>    emitGatewayEvent(type, payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2156 | <code>        if (type === 'subagent.event' &amp;&amp; payload.type === 'subagent.completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2157 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2158 | <code>                this.taskResultCapsules?.recordExecution?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2159 | <code>                    sessionId: payload.parentSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2160 | <code>                    parentRunId: payload.parentRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2161 | <code>                    action: 'resume',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2162 | <code>                    task: payload.task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2163 | <code>                    ok: payload.payload?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2164 | <code>                    status: payload.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2165 | <code>                    subagent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2166 | <code>                        id: payload.subagentId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2167 | <code>                        childRunId: payload.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2168 | <code>                        sessionId: payload.parentSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2169 | <code>                        task: payload.task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2170 | <code>                        status: payload.status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2171 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2172 | <code>                    childResult: payload.payload?.result &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2173 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2174 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2175 | <code>                payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2176 | <code>                    ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2177 | <code>                    taskStateError: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2178 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2179 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2180 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2181 | <code>        this.eventSeq += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2182 | <code>        const protocolMetadata = runtimeEventMetadata({ type, payload });</code> | 声明局部标识符 `protocolMetadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2183 | <code>        const event = {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2184 | <code>            id: `evt-${this.eventSeq}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2185 | <code>            seq: this.eventSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2186 | <code>            ts: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2187 | <code>            type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2188 | <code>            ...protocolMetadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2189 | <code>            payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2190 | <code>            delivery: isLosslessGatewayEvent(type) ? 'lossless' : 'best_effort'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2191 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2192 | <code>        this.eventLog.push(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2193 | <code>        if (this.eventLog.length &gt; this.eventLogLimit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2194 | <code>            this.eventLog = this.eventLog.slice(-this.eventLogLimit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2195 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2196 | <code>        this.emit('event', event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2197 | <code>        for (const client of this.sseClients) {</code> | 声明局部标识符 `client`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2198 | <code>            this.writeGatewayEventToClient(client, event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2200 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2202 | <code>    getEventsAfter(cursor = 0, limit = this.eventLogLimit) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2203 | <code>        const boundedLimit = Math.max(1, Math.min(Number(limit) &#124;&#124; this.eventLogLimit, this.eventLogLimit));</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2204 | <code>        return this.eventLog.filter((event) =&gt; event.seq &gt; cursor).slice(-boundedLimit);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2207 | <code>    writeSseChunk(client, chunk) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2208 | <code>        if (!client &#124;&#124; client.closed &#124;&#124; !client.res?.writable) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2209 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2211 | <code>        if (client.res.writableLength &gt; MAX_SSE_WRITABLE_BYTES) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2212 | <code>            client.closed = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2213 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2214 | <code>                client.res.end();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2215 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2216 | <code>            this.sseClients.delete(client);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2217 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2218 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2219 | <code>        const ok = client.res.write(chunk);</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2220 | <code>        if (!ok &amp;&amp; !client.pendingDrain) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2221 | <code>            client.pendingDrain = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2222 | <code>            client.res.once('drain', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2223 | <code>                client.pendingDrain = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2224 | <code>                if (client.skipped &gt; 0 &amp;&amp; !client.closed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2225 | <code>                    const skipped = client.skipped;</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2226 | <code>                    client.skipped = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2227 | <code>                    this.writeSseChunk(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2228 | <code>                        client,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2229 | <code>                        formatSseEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2230 | <code>                            id: `lag-${this.eventSeq}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2231 | <code>                            seq: this.eventSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2232 | <code>                            ts: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2233 | <code>                            type: 'gateway.lagged',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2234 | <code>                            delivery: 'lossless',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2235 | <code>                            payload: { skipped }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2236 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2237 | <code>                    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2238 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2239 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2240 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2241 | <code>        return ok;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2244 | <code>    writeGatewayEventToClient(client, event, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2245 | <code>        if (!client &#124;&#124; client.closed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2246 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2247 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2248 | <code>        const lossless = event.delivery === 'lossless' &#124;&#124; isLosslessGatewayEvent(event.type);</code> | 声明局部标识符 `lossless`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2249 | <code>        if (client.pendingDrain &amp;&amp; !lossless &amp;&amp; options.force !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2250 | <code>            client.skipped += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2251 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2252 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2253 | <code>        if (client.skipped &gt; 0 &amp;&amp; (lossless &#124;&#124; options.force === true)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2254 | <code>            const skipped = client.skipped;</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2255 | <code>            client.skipped = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2256 | <code>            this.writeSseChunk(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2257 | <code>                client,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2258 | <code>                formatSseEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2259 | <code>                    id: `lag-${event.seq}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2260 | <code>                    seq: event.seq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2261 | <code>                    ts: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2262 | <code>                    type: 'gateway.lagged',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2263 | <code>                    delivery: 'lossless',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2264 | <code>                    payload: { skipped }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2265 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2266 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2267 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2268 | <code>        this.writeSseChunk(client, formatSseEvent(event));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2271 | <code>    async handleHttpRequest(req, res) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2272 | <code>        this.applyCors(req, res);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2274 | <code>        if (req.method === 'OPTIONS') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2275 | <code>            res.writeHead(204);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2276 | <code>            res.end();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2277 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2278 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2280 | <code>        const url = new URL(req.url &#124;&#124; '/', 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2281 | <code>        if (url.pathname === '/events' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2282 | <code>            this.handleEvents(req, res);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2283 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2284 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2286 | <code>        if (url.pathname === '/events/recent' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2287 | <code>            const cursor = parseEventCursor(url.searchParams.get('cursor') &#124;&#124; url.searchParams.get('since'), 0);</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2288 | <code>            const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit') &#124;&#124; 100), this.eventLogLimit));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2289 | <code>            this.sendJson(res, 200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2290 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2291 | <code>                cursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2292 | <code>                latestSeq: this.eventSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2293 | <code>                events: this.getEventsAfter(cursor, limit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2294 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2295 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2296 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2298 | <code>        if (url.pathname === '/health' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2299 | <code>            this.sendJson(res, 200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2300 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2301 | <code>                status: this.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2302 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2303 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2304 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2306 | <code>        if (url.pathname === '/ember-harness/status' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2307 | <code>            const runId = url.searchParams.get('runId') &#124;&#124; '';</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2308 | <code>            this.sendJson(res, 200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2309 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2310 | <code>                status: this.emberHarness?.getStatus?.() &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2311 | <code>                records: runId ? this.emberHarness?.listRunRecords?.(runId, Number(url.searchParams.get('limit') &#124;&#124; 50)) &#124;&#124; [] : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2312 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2313 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2314 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2316 | <code>        if ((url.pathname === '/tools' &#124;&#124; url.pathname === '/tools/list') &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2317 | <code>            this.sendJson(res, 200, await this.listTools());</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2318 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2319 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2321 | <code>        if (url.pathname === '/tools/call' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2322 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2323 | <code>            this.sendJson(res, 200, await this.callTool(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2324 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2325 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2327 | <code>        if (url.pathname === '/agent/run' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2328 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2329 | <code>            this.sendJson(res, 200, await this.runAgent(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2330 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2331 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2333 | <code>        if (url.pathname === '/agent/interrupt' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2334 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2335 | <code>            this.sendJson(res, 200, await this.interruptAgentRun(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2336 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2337 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2339 | <code>        if (url.pathname === '/agent/analysis/runs' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2340 | <code>            this.sendJson(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2341 | <code>                res,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2342 | <code>                200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2343 | <code>                await this.listAgentAnalysisRuns(Number(url.searchParams.get('limit') &#124;&#124; 40))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2344 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2345 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2348 | <code>        if (url.pathname === '/agent/analysis/run' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2349 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2350 | <code>            this.sendJson(res, 200, await this.runAgentAnalysis(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2351 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2354 | <code>        if (url.pathname === '/agent/analysis/continue' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2355 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2356 | <code>            this.sendJson(res, 200, await this.continueAgentAnalysis(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2357 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2358 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2360 | <code>        if (url.pathname === '/agent/analysis/interrupt' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2361 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2362 | <code>            this.sendJson(res, 200, await this.interruptAgentRun(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2363 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2364 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2366 | <code>        if (url.pathname === '/agent/analysis' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2367 | <code>            this.sendJson(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2368 | <code>                res,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2369 | <code>                200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2370 | <code>                await this.analyzeAgentRun(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2371 | <code>                    url.searchParams.get('runId') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2372 | <code>                    { transcriptLimit: Number(url.searchParams.get('limit') &#124;&#124; 2000) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2373 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2374 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2375 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2376 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2378 | <code>        if (url.pathname === '/raw-memory/status' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2379 | <code>            this.sendJson(res, 200, this.getRawMemoryStatus());</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2380 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2381 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2383 | <code>        if (url.pathname === '/raw-memory/sessions' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2384 | <code>            this.sendJson(res, 200, this.listRawMemorySessions(Number(url.searchParams.get('limit') &#124;&#124; 100)));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2385 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2386 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2388 | <code>        if (url.pathname === '/raw-memory/replay' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2389 | <code>            this.sendJson(res, 200, this.replayRawMemory({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2390 | <code>                sessionId: url.searchParams.get('sessionId') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2391 | <code>                runId: url.searchParams.get('runId') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2392 | <code>                type: url.searchParams.get('type') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2393 | <code>                source: url.searchParams.get('source') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2394 | <code>                since: url.searchParams.get('since') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2395 | <code>                until: url.searchParams.get('until') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2396 | <code>                includePayload: url.searchParams.get('includePayload') !== 'false',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2397 | <code>                limit: Number(url.searchParams.get('limit') &#124;&#124; 200)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2398 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2399 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2400 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2402 | <code>        if (url.pathname === '/memory/profile/state' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2403 | <code>            this.sendJson(res, 200, await this.getUserProfileCurationState());</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2404 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2405 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2407 | <code>        if (url.pathname === '/memory/profile/curate' &amp;&amp; (req.method === 'GET' &#124;&#124; req.method === 'POST')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2408 | <code>            const body = req.method === 'POST' ? await this.readJsonBody(req) : {};</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2409 | <code>            this.sendJson(res, 200, await this.curateUserProfile({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2410 | <code>                ...(body &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2411 | <code>                force: body.force === true &#124;&#124; url.searchParams.get('force') === 'true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2412 | <code>                rawLimit: body.rawLimit &#124;&#124; Number(url.searchParams.get('rawLimit') &#124;&#124; 5000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2413 | <code>                evidenceLimit: body.evidenceLimit &#124;&#124; Number(url.searchParams.get('evidenceLimit') &#124;&#124; 120)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2414 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2415 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2416 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2418 | <code>        if (url.pathname === '/memory/profile/rebuild' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2419 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2420 | <code>            this.sendJson(res, 200, await this.rebuildUserProfile(body &#124;&#124; {}));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2421 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2422 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2424 | <code>        if (url.pathname === '/self-evolution/analyze' &amp;&amp; (req.method === 'GET' &#124;&#124; req.method === 'POST')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2425 | <code>            const body = req.method === 'POST' ? await this.readJsonBody(req) : {};</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2426 | <code>            this.sendJson(res, 200, await this.analyzeSelfEvolution({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2427 | <code>                ...(body &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2428 | <code>                limit: body.limit &#124;&#124; Number(url.searchParams.get('limit') &#124;&#124; 80),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2429 | <code>                taskText: body.taskText &#124;&#124; url.searchParams.get('taskText') &#124;&#124; url.searchParams.get('task') &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2430 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2431 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2432 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2434 | <code>        if (url.pathname === '/self-evolution/proposals' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2435 | <code>            this.sendJson(res, 200, await this.listSelfEvolutionProposals({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2436 | <code>                limit: Number(url.searchParams.get('limit') &#124;&#124; 80),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2437 | <code>                status: url.searchParams.get('status') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2438 | <code>                type: url.searchParams.get('type') &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2439 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2440 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2441 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2443 | <code>        if (url.pathname === '/self-evolution/proposal/mark' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2444 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2445 | <code>            this.sendJson(res, 200, await this.markSelfEvolutionProposal(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2446 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2447 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2449 | <code>        if (url.pathname === '/self-evolution/proposal/apply' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2450 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2451 | <code>            this.sendJson(res, 200, await this.applySelfEvolutionProposal(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2452 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2453 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2455 | <code>        if (url.pathname === '/rpc' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2456 | <code>            const body = await this.readJsonBody(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2457 | <code>            this.sendJson(res, 200, await this.handleRpc(body));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2458 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2459 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2461 | <code>        if (url.pathname === '/audit' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2462 | <code>            this.sendJson(res, 200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2463 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2464 | <code>                entries: await this.readAuditEntries(Number(url.searchParams.get('limit') &#124;&#124; 100))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2465 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2466 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2469 | <code>        if (url.pathname === '/transcript' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2470 | <code>            this.sendJson(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2471 | <code>                res,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2472 | <code>                200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2473 | <code>                await this.runtime.readTranscript(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2474 | <code>                    url.searchParams.get('runId') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2475 | <code>                    Number(url.searchParams.get('limit') &#124;&#124; 500)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2476 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2477 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2478 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2479 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2481 | <code>        throw new GatewayHttpError(404, 'not_found', `Unknown route: ${req.method} ${url.pathname}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2482 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2484 | <code>    applyCors(req, res) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2485 | <code>        res.setHeader('Access-Control-Allow-Origin', '*');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2486 | <code>        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2487 | <code>        res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2488 | <code>        if (!SAFE_METHODS.has(req.method &#124;&#124; 'GET')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2489 | <code>            res.setHeader('Cache-Control', 'no-store');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2490 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2491 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2493 | <code>    handleEvents(req, res) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2494 | <code>        const url = new URL(req.url &#124;&#124; '/', 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2495 | <code>        const cursor = parseEventCursor(</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2496 | <code>            url.searchParams.get('cursor') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2497 | <code>                url.searchParams.get('since') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2498 | <code>                req.headers['last-event-id'] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2499 | <code>                req.headers['x-ailis-event-cursor'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2500 | <code>            0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2501 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2502 | <code>        const replayLimit = Math.max(1, Math.min(Number(url.searchParams.get('limit') &#124;&#124; this.eventLogLimit), this.eventLogLimit));</code> | 声明局部标识符 `replayLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2503 | <code>        const replay = cursor &gt; 0 ? this.getEventsAfter(cursor, replayLimit) : [];</code> | 声明局部标识符 `replay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2504 | <code>        res.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2505 | <code>            'Content-Type': 'text/event-stream; charset=utf-8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2506 | <code>            'Cache-Control': 'no-cache, no-transform',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2507 | <code>            Connection: 'keep-alive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2508 | <code>            'Access-Control-Allow-Origin': '*'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2509 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2510 | <code>        res.write(`event: gateway.hello\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2511 | <code>        res.write(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2512 | <code>            `data: ${JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2513 | <code>                ts: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2514 | <code>                cursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2515 | <code>                latestSeq: this.eventSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2516 | <code>                replayed: replay.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2517 | <code>                status: this.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2518 | <code>            })}\n\n`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2519 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2520 | <code>        const client = {</code> | 声明局部标识符 `client`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2521 | <code>            id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2522 | <code>            res,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2523 | <code>            connectedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2524 | <code>            cursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2525 | <code>            skipped: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2526 | <code>            pendingDrain: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2527 | <code>            closed: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2528 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2529 | <code>        for (const event of replay) {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2530 | <code>            this.writeGatewayEventToClient(client, event, { force: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2531 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2532 | <code>        this.sseClients.add(client);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2533 | <code>        req.on('close', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2534 | <code>            client.closed = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2535 | <code>            this.sseClients.delete(client);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2536 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2537 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2539 | <code>    async readJsonBody(req) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2540 | <code>        const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2541 | <code>        let total = 0;</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2542 | <code>        for await (const chunk of req) {</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2543 | <code>            total += chunk.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2544 | <code>            if (total &gt; MAX_BODY_BYTES) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2545 | <code>                throw new GatewayHttpError(413, 'payload_too_large', 'Request body is too large');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2546 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2547 | <code>            chunks.push(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2548 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2549 | <code>        const raw = Buffer.concat(chunks).toString('utf8').trim();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2550 | <code>        if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2551 | <code>            return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2552 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2553 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2554 | <code>            return JSON.parse(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2555 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2556 | <code>            throw new GatewayHttpError(400, 'invalid_json', error.message &#124;&#124; 'Invalid JSON');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2557 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2558 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2560 | <code>    sendJson(res, statusCode, payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2561 | <code>        if (res.headersSent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2562 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2563 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2564 | <code>        res.writeHead(statusCode, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2565 | <code>            'Content-Type': 'application/json; charset=utf-8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2566 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2567 | <code>        res.end(JSON.stringify(payload, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2568 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2569 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2570 | <code>    async handleRpc(body = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2571 | <code>        const method = normalizeString(body.method);</code> | 声明局部标识符 `method`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2572 | <code>        const params = body.params &amp;&amp; typeof body.params === 'object' ? body.params : {};</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2573 | <code>        if (method === 'gateway.health') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2574 | <code>            return { ok: true, status: this.getStatus() };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2575 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2576 | <code>        if (method === 'tools.list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2577 | <code>            return await this.listTools(params);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2579 | <code>        if (method === 'tools.call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2580 | <code>            return await this.callTool(params);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2581 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2582 | <code>        if (method === 'agent.run') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2583 | <code>            return await this.runAgent(params);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2584 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2585 | <code>        if (method === 'audit.list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2586 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2587 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2588 | <code>                entries: await this.readAuditEntries(Number(params.limit &#124;&#124; 100))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2589 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2590 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2591 | <code>        if (method === 'runtime.status') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2592 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2593 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2594 | <code>                status: this.runtime.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2595 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2596 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2597 | <code>        if (method === 'transcript.read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2598 | <code>            return await this.runtime.readTranscript(params.runId &#124;&#124; params.id &#124;&#124; '', Number(params.limit &#124;&#124; 500));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2599 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2600 | <code>        if (method === 'transcript.repair') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2601 | <code>            return await this.runtime.repairTranscript(params.runId &#124;&#124; params.id &#124;&#124; '');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2602 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2603 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2604 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2605 | <code>            status: 'unknown_method',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2606 | <code>            error: `Unknown RPC method: ${method}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2607 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2608 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2610 | <code>    async listTools(params = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2611 | <code>        const context = this.mergeDefaultContext(</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2612 | <code>            params.context &amp;&amp; typeof params.context === 'object' ? params.context : params</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2613 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2614 | <code>        const smoke = buildSmokeStatusMap(this.smokeReportPath);</code> | 声明局部标识符 `smoke`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2615 | <code>        const shouldMaterialize =</code> | 声明局部标识符 `shouldMaterialize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2616 | <code>            params.materialize === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2617 | <code>            params.includeMaterialized === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2618 | <code>            context.materialize === true &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2619 | <code>            context.includeMaterialized === true;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2620 | <code>        const registeredToolIds = new Set(this.gatewayToolRuntimeRegistry?.toolIds?.() &#124;&#124; []);</code> | 声明局部标识符 `registeredToolIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2621 | <code>        const materialized = shouldMaterialize</code> | 声明局部标识符 `materialized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2622 | <code>            ? await this.listMaterializedToolIds().catch(() =&gt; [])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2623 | <code>            : [...registeredToolIds];</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2624 | <code>        const materializedSet = new Set(materialized);</code> | 声明局部标识符 `materializedSet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2625 | <code>        const coreTools = OPENCLAW_CORE_TOOL_DEFINITIONS.map((tool) =&gt; ({</code> | 声明局部标识符 `coreTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2626 | <code>            id: tool.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2627 | <code>            label: tool.label,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2628 | <code>            description: tool.description,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2629 | <code>            sectionId: tool.sectionId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2630 | <code>            route: this.resolveToolRoute(tool.id),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2631 | <code>            status: registeredToolIds.has(tool.id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2632 | <code>                ? 'available'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2633 | <code>                : smoke.map.get(tool.id)?.status &#124;&#124; this.defaultToolStatus(tool.id, materializedSet),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2634 | <code>            materialized:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2635 | <code>                registeredToolIds.has(tool.id) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2636 | <code>                materializedSet.has(tool.id) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2637 | <code>                Boolean(smoke.map.get(tool.id)?.materialized),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2638 | <code>            needsApproval: tool.id === 'exec',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2639 | <code>            externalSideEffect: EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(tool.id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2640 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2642 | <code>        const optionalRuntimeTools = OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.map((tool) =&gt; ({</code> | 声明局部标识符 `optionalRuntimeTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2643 | <code>            ...tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2644 | <code>            route: 'openclaw-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2645 | <code>            status: smoke.map.get(tool.id)?.status &#124;&#124; this.defaultToolStatus(tool.id, materializedSet),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2646 | <code>            materialized: materializedSet.has(tool.id) &#124;&#124; Boolean(smoke.map.get(tool.id)?.materialized),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2647 | <code>            externalSideEffect: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2648 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2650 | <code>        const channelMcpTools = OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.map((tool) =&gt; ({</code> | 声明局部标识符 `channelMcpTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2651 | <code>            ...tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2652 | <code>            route: 'openclaw-channel-mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2653 | <code>            status: smoke.map.get(tool.id)?.status &#124;&#124; 'needs_pairing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2654 | <code>            materialized: Boolean(smoke.map.get(tool.id)?.materialized)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2655 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2656 | <code>        const gatewayDefinitions = this.gatewayToolRuntimeRegistry.listDefinitions();</code> | 声明局部标识符 `gatewayDefinitions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2657 | <code>        const runtimeTools = gatewayDefinitions</code> | 声明局部标识符 `runtimeTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2658 | <code>            .filter((tool) =&gt; ['ailis-runtime', 'ailis-gateway'].includes(tool.route))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2659 | <code>            .map((tool) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2660 | <code>                ...tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2661 | <code>                status: tool.status &#124;&#124; 'available',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2662 | <code>                materialized: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2663 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2664 | <code>        const localTools = this.gatewayToolRuntimeRegistry.listDefinitions()</code> | 声明局部标识符 `localTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2665 | <code>            .filter((tool) =&gt; tool.route === 'ailis-local')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2666 | <code>            .map((tool) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2667 | <code>            ...tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2668 | <code>            providers: tool.id === EMAIL_TOOL_ID ? safeListEmailProviderDetails() : undefined</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2669 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2670 | <code>        const exposed = this.runtime.exposeToolGroups(</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2671 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2672 | <code>                coreTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2673 | <code>                optionalRuntimeTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2674 | <code>                channelMcpTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2675 | <code>                runtimeTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2676 | <code>                localTools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2677 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2678 | <code>            context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2679 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2681 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2682 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2683 | <code>            gateway: this.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2684 | <code>            smoke: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2685 | <code>                ok: smoke.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2686 | <code>                generatedAt: smoke.generatedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2687 | <code>                path: smoke.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2688 | <code>                materializedProbe: shouldMaterialize ? 'live' : 'skipped_fast_list'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2689 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2690 | <code>            ...exposed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2691 | <code>            contracts: listToolContracts()</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2692 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2693 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2695 | <code>    resolveToolRoute(toolId) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2696 | <code>        const gatewayTool = this.gatewayToolRuntimeRegistry?.definition(toolId);</code> | 声明局部标识符 `gatewayTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2697 | <code>        if (gatewayTool?.route) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2698 | <code>            return gatewayTool.route;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2699 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2700 | <code>        if (this.runtime.canExecuteTool(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2701 | <code>            return 'ailis-runtime';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2702 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2703 | <code>        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) &#124;&#124; SESSION_BOUND_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2704 | <code>            return 'openclaw-gateway';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2705 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2706 | <code>        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2707 | <code>            return 'provider-plugin-or-trigger';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2708 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2709 | <code>        return 'openclaw-runtime';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2712 | <code>    defaultToolStatus(toolId, materializedSet) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2713 | <code>        if (this.gatewayToolRuntimeRegistry?.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2714 | <code>            return 'available';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2715 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2716 | <code>        if (this.runtime.canExecuteTool(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2717 | <code>            return 'available';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2718 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2719 | <code>        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2720 | <code>            return materializedSet.has(toolId) ? 'available' : 'not_materialized';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2721 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2722 | <code>        if (EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2723 | <code>            return materializedSet.has(toolId) ? 'skipped_external' : 'not_materialized';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2724 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2725 | <code>        if (SESSION_BOUND_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2726 | <code>            return materializedSet.has(toolId) ? 'needs_session' : 'not_materialized';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2727 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2728 | <code>        return materializedSet.has(toolId) ? 'available' : 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2729 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2731 | <code>    async listMaterializedToolIds() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2732 | <code>        const tools = await this.getToolSet({ workspace: this.workspaceRoot });</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2733 | <code>        return [...new Set([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2734 | <code>            ...tools.keys(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2735 | <code>            ...(this.gatewayToolRuntimeRegistry?.toolIds?.() &#124;&#124; [])</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2736 | <code>        ])];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2737 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2739 | <code>    shouldRunEmberHarness(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2740 | <code>        return this.emberHarness?.enabled !== false &amp;&amp;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2741 | <code>            context.emberHarness !== false &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2742 | <code>            context.disableEmberHarness !== true;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2743 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2745 | <code>    async runEmberHarnessCheck({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2746 | <code>        stage = 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2747 | <code>        boundary = 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2748 | <code>        text = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2749 | <code>        context = {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2750 | <code>        metadata = {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2751 | <code>        runId = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2752 | <code>        sessionId = ''</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 2753 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2754 | <code>        const finalRunId = normalizeString(</code> | 声明局部标识符 `finalRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2755 | <code>            runId &#124;&#124; context.runId &#124;&#124; context.parentRunId &#124;&#124; context.sessionRunId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2756 | <code>            'global'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2757 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2758 | <code>        const finalSessionId = normalizeString(</code> | 声明局部标识符 `finalSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2759 | <code>            sessionId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey &#124;&#124; context.parentSessionId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2760 | <code>            'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2761 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2762 | <code>        if (!this.shouldRunEmberHarness(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2763 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2764 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2765 | <code>                status: 'disabled',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2766 | <code>                decision: 'allow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2767 | <code>                blocked: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2768 | <code>                runId: finalRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2769 | <code>                sessionId: finalSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2770 | <code>                stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2771 | <code>                boundary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2772 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2773 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2774 | <code>        const result = await this.emberHarness.check({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2775 | <code>            runId: finalRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2776 | <code>            sessionId: finalSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2777 | <code>            stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2778 | <code>            boundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2779 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2780 | <code>            metadata: redactObject(metadata),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2781 | <code>            evaluator: typeof context.emberHarnessEvaluator === 'function' ? context.emberHarnessEvaluator : null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2782 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2783 | <code>        const eventPayload = {</code> | 声明局部标识符 `eventPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2784 | <code>            schema: result.schema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2785 | <code>            checkId: result.checkId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2786 | <code>            runId: result.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2787 | <code>            sessionId: result.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2788 | <code>            stage: result.stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2789 | <code>            boundary: result.boundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2790 | <code>            mode: result.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2791 | <code>            status: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2792 | <code>            decision: result.decision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2793 | <code>            blocked: result.blocked,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2794 | <code>            riskLevel: result.riskLevel,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2795 | <code>            riskTypes: result.riskTypes,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2796 | <code>            summary: result.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2797 | <code>            suggestion: result.suggestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2798 | <code>            evaluatorDetails: result.evaluatorDetails,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2799 | <code>            evaluatorConfigured: result.evaluatorConfigured,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2800 | <code>            snapshot: result.snapshot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2801 | <code>            rollbackTo: result.rollbackTo</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2802 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2803 | <code>        this.emitGatewayEvent('ember.harness.check', eventPayload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2804 | <code>        await this.appendAudit({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2805 | <code>            type: 'ember.harness.check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2806 | <code>            runId: result.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2807 | <code>            sessionId: result.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2808 | <code>            status: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2809 | <code>            ok: result.blocked !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2810 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2811 | <code>                stage: result.stage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2812 | <code>                boundary: result.boundary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2813 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2814 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2815 | <code>                workspace: context.workspace &#124;&#124; context.workspaceDir,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2816 | <code>                planner: context.planner,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2817 | <code>                iteration: context.iteration</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2818 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2819 | <code>            result: eventPayload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2820 | <code>        }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2821 | <code>        if (result.runId &amp;&amp; result.runId !== 'global') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2822 | <code>            await this.runtime.appendItem(result.runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2823 | <code>                type: 'ember.harness.check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2824 | <code>                sessionId: result.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2825 | <code>                status: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2826 | <code>                payload: eventPayload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2827 | <code>            }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2828 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2829 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2830 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2832 | <code>    async callTool(request = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2833 | <code>        const callId = randomUUID();</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2834 | <code>        const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2835 | <code>        const toolId = normalizeString(request.tool &#124;&#124; request.name);</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2836 | <code>        const args = request.args &amp;&amp; typeof request.args === 'object' ? request.args : {};</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2837 | <code>        const context = this.mergeDefaultContext(</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2838 | <code>            request.context &amp;&amp; typeof request.context === 'object' ? request.context : {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2839 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2840 | <code>        const transcriptRunId = normalizeString(context.runId &#124;&#124; request.runId);</code> | 声明局部标识符 `transcriptRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2841 | <code>        const transcriptSessionId = normalizeString(</code> | 声明局部标识符 `transcriptSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2842 | <code>            context.sessionId &#124;&#124; context.sessionKey &#124;&#124; request.sessionId &#124;&#124; request.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2843 | <code>            'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2844 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2845 | <code>        const auditBase = {</code> | 声明局部标识符 `auditBase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2846 | <code>            callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2847 | <code>            tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2848 | <code>            args: redactObject(args),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2849 | <code>            context: redactObject(context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2850 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2852 | <code>        this.emitGatewayEvent('tool.call.started', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2853 | <code>            callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2854 | <code>            tool: toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2855 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2857 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2858 | <code>            if (!toolId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2859 | <code>                throw new GatewayHttpError(400, 'missing_tool', 'tools.call requires a tool name');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2860 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2861 | <code>            if (!isExternalVirtualToolId(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2862 | <code>                const contractValidation = validateToolContract(toolId, args);</code> | 声明局部标识符 `contractValidation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2863 | <code>                if (!contractValidation.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2864 | <code>                    throw new GatewayHttpError(400, 'invalid_tool_args', 'tool arguments failed contract validation', {</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2865 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2866 | <code>                        contract: contractValidation.contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2867 | <code>                        errors: contractValidation.errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2868 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2869 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2870 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2871 | <code>            const workspaceDir = this.resolveWorkspace(context.workspace, context);</code> | 声明局部标识符 `workspaceDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2872 | <code>            if (transcriptRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2873 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2874 | <code>                    type: 'tool.call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2875 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2876 | <code>                    status: 'started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2877 | <code>                    payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2878 | <code>                        schema: 'ailis.tool_call.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2879 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2880 | <code>                        toolName: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2881 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2882 | <code>                        args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2883 | <code>                        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2884 | <code>                            workspace: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2885 | <code>                            approved: context.approved === true,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2886 | <code>                            planner: context.planner,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2887 | <code>                            stepId: context.stepId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2888 | <code>                            iteration: context.iteration</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2889 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2890 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2891 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2892 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2893 | <code>            const beginEvent = {</code> | 声明局部标识符 `beginEvent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2894 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2895 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2896 | <code>                stage: 'begin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2897 | <code>                startedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2898 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2899 | <code>            this.emitGatewayEvent('tool.call.begin', beginEvent);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2900 | <code>            if (transcriptRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2901 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2902 | <code>                    type: 'tool.event',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2903 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2904 | <code>                    status: 'begin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2905 | <code>                    payload: beginEvent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2906 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2907 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2908 | <code>            const policyDecision = this.runtime.evaluateToolCall({ toolId, args, context, workspaceDir });</code> | 声明局部标识符 `policyDecision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2909 | <code>            if (policyDecision.denied) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2910 | <code>                throwBlocked(`tool call blocked by AILIS runtime policy: ${policyDecision.reason}`, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2911 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2912 | <code>                    reason: policyDecision.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2913 | <code>                    policy: policyDecision.policy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2914 | <code>                    classification: policyDecision.classification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2915 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2916 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2917 | <code>            if (policyDecision.needsApproval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2918 | <code>                throwApprovalRequired(`tool call requires approval by AILIS runtime policy: ${policyDecision.reason}`, {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2919 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2920 | <code>                    approval: 'required',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2921 | <code>                    reason: policyDecision.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2922 | <code>                    policy: policyDecision.policy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2923 | <code>                    classification: policyDecision.classification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2924 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2925 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2926 | <code>            const preToolGate = await this.runEmberHarnessCheck({</code> | 声明局部标识符 `preToolGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2927 | <code>                stage: policyDecision.classification?.mutates ? 'pre_side_effect' : 'tool_call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2928 | <code>                boundary: 'tool_call_before_execution',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2929 | <code>                text: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2930 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2931 | <code>                    args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2932 | <code>                    policy: policyDecision.policy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2933 | <code>                    classification: policyDecision.classification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2934 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2935 | <code>                context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2936 | <code>                runId: transcriptRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2937 | <code>                sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2938 | <code>                metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2939 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2940 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2941 | <code>                    workspace: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2942 | <code>                    mutates: policyDecision.classification?.mutates === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2943 | <code>                    needsApproval: policyDecision.needsApproval === true</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2944 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2945 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2946 | <code>            if (preToolGate.blocked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2947 | <code>                throwBlocked('tool call blocked by EMBER-Harness stage gate before execution', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2948 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2949 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2950 | <code>                    emberHarness: summarizeEmberHarnessRecord(preToolGate)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2951 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2952 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2953 | <code>            const result = await withTimeout(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2954 | <code>                Number(request.timeoutMs &#124;&#124; context.timeoutMs &#124;&#124; TOOL_CALL_TIMEOUT_MS),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2955 | <code>                () =&gt; this.callAgentRuntimeTool({ callId, toolId, args, context, workspaceDir })</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2956 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2957 | <code>            const guardedResult = this.runtime.guardToolResult(result, { toolId, callId });</code> | 声明局部标识符 `guardedResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2958 | <code>            attachObservationContract(guardedResult, { toolId });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2959 | <code>            const postToolGate = await this.runEmberHarnessCheck({</code> | 声明局部标识符 `postToolGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2960 | <code>                stage: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2961 | <code>                boundary: 'tool_result_enter_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2962 | <code>                text: guardedResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2963 | <code>                context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2964 | <code>                runId: transcriptRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2965 | <code>                sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2966 | <code>                metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2967 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2968 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2969 | <code>                    workspace: workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2970 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2971 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2972 | <code>            if (postToolGate.blocked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2973 | <code>                throwBlocked('tool result blocked by EMBER-Harness before entering model context', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2974 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2975 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2976 | <code>                    emberHarness: summarizeEmberHarnessRecord(postToolGate)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2977 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2978 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2979 | <code>            if (toolId === 'tool_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2980 | <code>                attachRawToolSearchToolsForDirectExposure(guardedResult, result);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2981 | <code>            } else if (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2982 | <code>                parseAilisDirectMcpToolId(toolId) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2983 | <code>                toolId === WEB_SEARCH_TOOL_ID &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2984 | <code>                toolId === WEB_RUN_TOOL_ID</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2985 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2986 | <code>                await attachSuggestedMcpToolsForDirectExposure(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2987 | <code>                    guardedResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2988 | <code>                    toolId === WEB_SEARCH_TOOL_ID</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2989 | <code>                        ? 'mcp__ailis_research__web_search'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2990 | <code>                        : toolId === WEB_RUN_TOOL_ID</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2991 | <code>                        ? 'mcp__ailis_research__web_fetch'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2992 | <code>                        : toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2993 | <code>                    this.runtime?.mcpManager,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2994 | <code>                    Number(request.timeoutMs &#124;&#124; context.timeoutMs &#124;&#124; 8000)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2995 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2996 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2997 | <code>            const status = classifyToolResult(guardedResult);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2998 | <code>            const semanticFailure = ['blocked', 'failed'].includes(status);</code> | 声明局部标识符 `semanticFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2999 | <code>            const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3000 | <code>                ok: !semanticFailure &amp;&amp; guardedResult?.isError !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3001 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3002 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3003 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3004 | <code>                durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3005 | <code>                result: guardedResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3006 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3007 | <code>            const canonicalToolOutput = normalizeToolOutput({</code> | 声明局部标识符 `canonicalToolOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3008 | <code>                id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3009 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3010 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3011 | <code>                args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3012 | <code>                response</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3013 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3014 | <code>            await this.appendAudit({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3015 | <code>                ...auditBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3016 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3017 | <code>                ok: response.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3018 | <code>                durationMs: response.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3019 | <code>                resultPreview: summarize(guardedResult)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3020 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3021 | <code>            if (transcriptRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3022 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3023 | <code>                    type: 'tool.result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3024 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3025 | <code>                    status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3026 | <code>                    payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3027 | <code>                        schema: canonicalToolOutput.schema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3028 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3029 | <code>                        toolName: canonicalToolOutput.toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3030 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3031 | <code>                        ok: response.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3032 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3033 | <code>                        durationMs: response.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3034 | <code>                        outputPreview: canonicalToolOutput.outputPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3035 | <code>                        errorSummary: canonicalToolOutput.errorSummary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3036 | <code>                        threadItem: toolOutputToThreadItem(canonicalToolOutput),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3037 | <code>                        result: guardedResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3038 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3039 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3040 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3041 | <code>                    type: 'tool.event',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3042 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3043 | <code>                    status: 'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3044 | <code>                    payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3045 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3046 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3047 | <code>                        stage: 'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3048 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3049 | <code>                        durationMs: response.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3050 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3051 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3052 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3053 | <code>            this.emitGatewayEvent('tool.call.success', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3054 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3055 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3056 | <code>                stage: 'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3057 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3058 | <code>                durationMs: response.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3059 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3060 | <code>            this.emitGatewayEvent('tool.call.finished', response);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3061 | <code>            return response;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3062 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3063 | <code>            const status = classifyError(error);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3064 | <code>            const errorMessage = formatGatewayToolError(error);</code> | 声明局部标识符 `errorMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3065 | <code>            const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3066 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3067 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3068 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3069 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3070 | <code>                durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3071 | <code>                error: errorMessage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3072 | <code>                ...(error.details ? { details: error.details } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3073 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3074 | <code>            await this.appendAudit({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3075 | <code>                ...auditBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3076 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3077 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3078 | <code>                durationMs: response.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3079 | <code>                error: response.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3080 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3081 | <code>            if (transcriptRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3082 | <code>                const guardedError = this.runtime.guardToolResult(</code> | 声明局部标识符 `guardedError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3083 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3084 | <code>                        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3085 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3086 | <code>                                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3087 | <code>                                text: response.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3088 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3089 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3090 | <code>                        isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3091 | <code>                        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3092 | <code>                            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3093 | <code>                            code: error?.code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3094 | <code>                            error: response.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3095 | <code>                            ...(error.details ? { details: error.details } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3096 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3097 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3098 | <code>                    { toolId, callId }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3099 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3100 | <code>                const canonicalToolOutput = normalizeToolOutput({</code> | 声明局部标识符 `canonicalToolOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3101 | <code>                    id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3102 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3103 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3104 | <code>                    args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3105 | <code>                    response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3106 | <code>                        ...response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3107 | <code>                        result: guardedError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3108 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3109 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3110 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3111 | <code>                    type: 'tool.result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3112 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3113 | <code>                    status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3114 | <code>                    payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3115 | <code>                        schema: canonicalToolOutput.schema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3116 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3117 | <code>                        toolName: canonicalToolOutput.toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3118 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3119 | <code>                        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3120 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3121 | <code>                        durationMs: response.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3122 | <code>                        outputPreview: canonicalToolOutput.outputPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3123 | <code>                        errorSummary: canonicalToolOutput.errorSummary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3124 | <code>                        threadItem: toolOutputToThreadItem(canonicalToolOutput),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3125 | <code>                        result: guardedError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3126 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3127 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3128 | <code>                await this.runtime.appendItem(transcriptRunId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3129 | <code>                    type: 'tool.event',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3130 | <code>                    sessionId: transcriptSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3131 | <code>                    status: 'failure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3132 | <code>                    payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3133 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3134 | <code>                        tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3135 | <code>                        stage: 'failure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3136 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3137 | <code>                        error: response.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3138 | <code>                        durationMs: response.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3139 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3140 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3141 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3142 | <code>            this.emitGatewayEvent('tool.call.failure', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3143 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3144 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3145 | <code>                stage: 'failure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3146 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3147 | <code>                error: response.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3148 | <code>                durationMs: response.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3149 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3150 | <code>            this.emitGatewayEvent('tool.call.finished', response);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3151 | <code>            return response;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3152 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3155 | <code>    async runAgent(request = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3156 | <code>        const input = request &amp;&amp; typeof request === 'object' ? request : {};</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3157 | <code>        const context = this.mergeDefaultContext(</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3158 | <code>            input.context &amp;&amp; typeof input.context === 'object' ? input.context : {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3159 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3160 | <code>        const requestedTextDelta = typeof input.onTextDelta === 'function'</code> | 声明局部标识符 `requestedTextDelta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3161 | <code>            ? input.onTextDelta</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3162 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3163 | <code>        const streamBeforeFinalGate = Boolean(</code> | 声明局部标识符 `streamBeforeFinalGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3164 | <code>            requestedTextDelta &amp;&amp; !this.shouldRunEmberHarness(context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3165 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3166 | <code>        const sessionId = normalizeString(input.sessionId &#124;&#124; input.sessionKey &#124;&#124; context.sessionId &#124;&#124; context.sessionKey, 'main');</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3167 | <code>        const runId = normalizeString(input.runId &#124;&#124; context.runId);</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3168 | <code>        const inputGate = await this.runEmberHarnessCheck({</code> | 声明局部标识符 `inputGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3169 | <code>            stage: 'user_input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3170 | <code>            boundary: 'untrusted_input_enter_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3171 | <code>            text: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3172 | <code>                message: input.message &#124;&#124; input.prompt &#124;&#124; input.task &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3173 | <code>                attachments: Array.isArray(input.attachments) ? input.attachments : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3174 | <code>                messageHistoryCount: Array.isArray(input.messageHistory) ? input.messageHistory.length : 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3175 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3176 | <code>            context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3177 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3178 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3179 | <code>            metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3180 | <code>                source: 'agent.run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3181 | <code>                agentLoop: input.agentLoop &#124;&#124; context.agentLoop,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3182 | <code>                planner: input.planner &#124;&#124; context.planner</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3183 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3184 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3185 | <code>        if (inputGate.blocked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3186 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3187 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3188 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3189 | <code>                mode: 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3190 | <code>                intent: 'blocked_by_ember_harness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3191 | <code>                displayText: '本次请求已被 EMBER-Harness 阶段门控阻断，未进入智能体执行链路。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3192 | <code>                speechText: '本次请求已被安全门控阻断。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3193 | <code>                emberHarness: summarizeEmberHarnessRecord(inputGate)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3194 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3195 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3196 | <code>        const result = await this.ensureAgentRunner().runMessage({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3197 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3198 | <code>            onTextDelta: streamBeforeFinalGate ? requestedTextDelta : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3199 | <code>            context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3200 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3201 | <code>        const finalText = normalizeString(</code> | 声明局部标识符 `finalText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3202 | <code>            result?.displayText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3203 | <code>            result?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3204 | <code>            result?.finalAnswer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3205 | <code>            result?.answer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3206 | <code>            result?.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3207 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3208 | <code>        if (!finalText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3209 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3210 | <code>                ...result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3211 | <code>                emberHarness: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3212 | <code>                    input: summarizeEmberHarnessRecord(inputGate)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3213 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3214 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3215 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3216 | <code>        const finalGate = await this.runEmberHarnessCheck({</code> | 声明局部标识符 `finalGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3217 | <code>            stage: 'final_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3218 | <code>            boundary: 'final_output_before_user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3219 | <code>            text: finalText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3220 | <code>            context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3221 | <code>            runId: result?.runId &#124;&#124; runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3222 | <code>            sessionId: result?.sessionId &#124;&#124; sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3223 | <code>            metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3224 | <code>                source: 'agent.run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3225 | <code>                status: result?.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3226 | <code>                ok: result?.ok === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3227 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3228 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3229 | <code>        if (finalGate.blocked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3230 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3231 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3232 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3233 | <code>                mode: result?.mode &#124;&#124; 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3234 | <code>                intent: 'blocked_by_ember_harness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3235 | <code>                runId: result?.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3236 | <code>                sessionId: result?.sessionId &#124;&#124; sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3237 | <code>                durationMs: result?.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3238 | <code>                displayText: '最终回答已被 EMBER-Harness 阶段门控阻断，系统已回退到最近稳定阶段快照。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3239 | <code>                speechText: '最终回答已被安全门控阻断。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3240 | <code>                emberHarness: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3241 | <code>                    input: summarizeEmberHarnessRecord(inputGate),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3242 | <code>                    final: summarizeEmberHarnessRecord(finalGate)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3243 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3244 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3245 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3246 | <code>        if (requestedTextDelta &amp;&amp; !streamBeforeFinalGate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3247 | <code>            await requestedTextDelta(finalText, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3248 | <code>                runId: result?.runId &#124;&#124; runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3249 | <code>                sessionId: result?.sessionId &#124;&#124; sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3250 | <code>                bufferedBy: 'ember_final_output_gate'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3251 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3252 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3253 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3254 | <code>            ...result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3255 | <code>            emberHarness: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3256 | <code>                input: summarizeEmberHarnessRecord(inputGate),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3257 | <code>                final: summarizeEmberHarnessRecord(finalGate)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3258 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3259 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3260 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3262 | <code>    async interruptAgentRun(request = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3263 | <code>        const input = request &amp;&amp; typeof request === 'object' ? request : {};</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3264 | <code>        const context = input.context &amp;&amp; typeof input.context === 'object' ? input.context : {};</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3265 | <code>        return await this.ensureAgentRunner().requestInterruptRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3266 | <code>            runId: input.runId &#124;&#124; context.runId &#124;&#124; '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3267 | <code>            sessionId: input.sessionId &#124;&#124; input.sessionKey &#124;&#124; context.sessionId &#124;&#124; context.sessionKey &#124;&#124; '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3268 | <code>            reason: input.reason &#124;&#124; context.reason &#124;&#124; 'user_interrupt',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3269 | <code>            source: input.source &#124;&#124; context.source &#124;&#124; 'gateway'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3270 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3273 | <code>    async executeTaskAgent({ agent, args = {}, context = {}, signal, onEvent, registerInputHandler } = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3274 | <code>        const task = normalizeString(agent?.task &#124;&#124; args.task &#124;&#124; args.prompt &#124;&#124; args.message);</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3275 | <code>        if (!task) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3276 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3277 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3278 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3279 | <code>                displayText: 'Subagent task is empty.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3280 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3281 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3282 | <code>        const parentLlmSettings = (</code> | 声明局部标识符 `parentLlmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3283 | <code>            args.llmSettings &amp;&amp; typeof args.llmSettings === 'object' ? args.llmSettings :</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3284 | <code>            args.llm &amp;&amp; typeof args.llm === 'object' ? args.llm :</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3285 | <code>            context.llmSettings &amp;&amp; typeof context.llmSettings === 'object' ? context.llmSettings :</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3286 | <code>            context.llm &amp;&amp; typeof context.llm === 'object' ? context.llm :</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3287 | <code>            null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3288 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3289 | <code>        const inheritanceMode = ['clean', 'recent', 'checkpoint'].includes(normalizeString(</code> | 声明局部标识符 `inheritanceMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3290 | <code>            args.inheritanceMode &#124;&#124; context.taskAgentInheritanceMode,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3291 | <code>            'clean'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3292 | <code>        ).toLowerCase())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3293 | <code>            ? normalizeString(args.inheritanceMode &#124;&#124; context.taskAgentInheritanceMode, 'clean').toLowerCase()</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3294 | <code>            : 'clean';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3295 | <code>        const inheritedCheckpoint = inheritanceMode === 'checkpoint'</code> | 声明局部标识符 `inheritedCheckpoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3296 | <code>            ? args.contextManagerCheckpoint &#124;&#124; context.initialContextManagerCheckpoint &#124;&#124; null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3297 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3298 | <code>        const recentMessages = inheritanceMode === 'recent'</code> | 声明局部标识符 `recentMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3299 | <code>            ? (Array.isArray(args.recentMessages) ? args.recentMessages : context.recentMessages &#124;&#124; [])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3300 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3301 | <code>        const attachments = Array.isArray(context.attachments)</code> | 声明局部标识符 `attachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3302 | <code>            ? context.attachments</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3303 | <code>            : Array.isArray(context.fileAttachments)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3304 | <code>                ? context.fileAttachments</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3305 | <code>                : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3306 | <code>        const requestedMaxAgentSteps = Number(args.maxAgentSteps &#124;&#124; context.maxAgentSteps &#124;&#124; TASK_AGENT_MAX_MODEL_ROUNDS);</code> | 声明局部标识符 `requestedMaxAgentSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3307 | <code>        const taskAgentMaxSteps = Math.max(</code> | 声明局部标识符 `taskAgentMaxSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3308 | <code>            1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3309 | <code>            Math.min(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3310 | <code>                Number.isFinite(requestedMaxAgentSteps) ? requestedMaxAgentSteps : TASK_AGENT_MAX_MODEL_ROUNDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3311 | <code>                TASK_AGENT_MAX_MODEL_ROUNDS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3312 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3313 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3314 | <code>        const childContext = this.mergeDefaultContext({</code> | 声明局部标识符 `childContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3315 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3316 | <code>            ...(parentLlmSettings ? { llmSettings: parentLlmSettings } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3317 | <code>            parentRunId: agent?.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3318 | <code>            parentSessionId: agent?.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3319 | <code>            agentId: agent?.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3320 | <code>            agentLabel: agent?.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3321 | <code>            agentPath: agent?.agent_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3322 | <code>            runId: agent?.childRunId &#124;&#124; context.runId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3323 | <code>            sessionId: agent?.childSessionId &#124;&#124; context.sessionId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3324 | <code>            sessionKey: agent?.childSessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3325 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3326 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3327 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3328 | <code>            contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3329 | <code>            cleanContext: inheritanceMode === 'clean',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3330 | <code>            taskAgentInheritanceMode: inheritanceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3331 | <code>            initialContextManagerCheckpoint: inheritedCheckpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3332 | <code>            attachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3333 | <code>            fileAttachments: attachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3334 | <code>            maxAgentSteps: taskAgentMaxSteps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3335 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3336 | <code>        await onEvent?.({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3337 | <code>            type: 'subagent.runner.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3338 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3339 | <code>            message: task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3340 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3341 | <code>                agentId: agent?.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3342 | <code>                sessionId: agent?.childSessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3343 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3344 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3345 | <code>        const agentRunner = this.ensureAgentRunner();</code> | 声明局部标识符 `agentRunner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3346 | <code>        const runPromise = agentRunner.runMessage({</code> | 声明局部标识符 `runPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3347 | <code>            runId: agent?.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3348 | <code>            message: task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3349 | <code>            messageHistory: recentMessages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3350 | <code>            attachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3351 | <code>            sessionId: agent?.childSessionId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3352 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3353 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3354 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3355 | <code>            ...(parentLlmSettings ? { llmSettings: parentLlmSettings } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3356 | <code>            taskAgentInheritanceMode: inheritanceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3357 | <code>            initialContextManagerCheckpoint: inheritedCheckpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3358 | <code>            initialStepResults: Array.isArray(args.initialStepResults) ? args.initialStepResults : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3359 | <code>            maxAgentSteps: taskAgentMaxSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3360 | <code>            context: childContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3361 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3362 | <code>        const unregisterInputHandler = typeof registerInputHandler === 'function'</code> | 声明局部标识符 `unregisterInputHandler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3363 | <code>            ? registerInputHandler((message) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3364 | <code>                  const delivered = agentRunner.enqueueRunInput({</code> | 声明局部标识符 `delivered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3365 | <code>                      runId: agent?.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3366 | <code>                      sessionId: agent?.childSessionId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3367 | <code>                      message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3368 | <code>                  });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3369 | <code>                  if (!delivered) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3370 | <code>                      throw new Error('TaskAgent input queue is not available for this run.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 3371 | <code>                  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3372 | <code>              })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3373 | <code>            : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3374 | <code>        let result;</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3375 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3376 | <code>            result = signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3377 | <code>                ? await new Promise((resolve, reject) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3378 | <code>                  if (signal.aborted) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3379 | <code>                      reject(new Error('subagent run aborted'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3380 | <code>                      return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3381 | <code>                  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3382 | <code>                  const onAbort = () =&gt; reject(new Error('subagent run aborted'));</code> | 声明局部标识符 `onAbort`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3383 | <code>                  signal.addEventListener('abort', onAbort, { once: true });</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3384 | <code>                  runPromise.then(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3385 | <code>                      (value) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3386 | <code>                          signal.removeEventListener('abort', onAbort);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3387 | <code>                          resolve(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3388 | <code>                      },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3389 | <code>                      (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3390 | <code>                          signal.removeEventListener('abort', onAbort);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3391 | <code>                          reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3392 | <code>                      }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3393 | <code>                  );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3394 | <code>                  })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3395 | <code>                : await runPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3396 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3397 | <code>            unregisterInputHandler?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3398 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3399 | <code>        await onEvent?.({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3400 | <code>            type: 'subagent.runner.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3401 | <code>            status: result?.status &#124;&#124; 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3402 | <code>            message: normalizeString(result?.displayText &#124;&#124; result?.speechText, 'subagent runner finished'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3403 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3404 | <code>                runId: result?.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3405 | <code>                ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3406 | <code>                durationMs: result?.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3407 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3408 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3409 | <code>        const taskRunHandoff = result?.taskRunHandoff &#124;&#124;</code> | 声明局部标识符 `taskRunHandoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3410 | <code>            result?.task_run_handoff &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3411 | <code>            result?.handoff &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3412 | <code>            null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3413 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3414 | <code>            ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3415 | <code>            status: result?.status &#124;&#124; (result?.ok === false ? 'failed' : 'completed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3416 | <code>            runId: result?.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3417 | <code>            mode: result?.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3418 | <code>            intent: result?.intent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3419 | <code>            displayText: taskRunHandoff?.userVisibleSummary &#124;&#124; result?.displayText &#124;&#124; result?.speechText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3420 | <code>            speechText: result?.speechText &#124;&#124; taskRunHandoff?.userVisibleSummary &#124;&#124; result?.displayText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3421 | <code>            durationMs: result?.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3422 | <code>            taskRunHandoff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3423 | <code>            steps: result?.steps &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3424 | <code>            plan: result?.plan &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3425 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3426 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3428 | <code>    async callAgentRuntimeTool({ callId = '', toolId, args, context, workspaceDir }) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3429 | <code>        if (isExternalVirtualToolId(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3430 | <code>            const result = await this.runtime?.capabilityManager?.executeVirtualExternalTool?.(toolId, args, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3431 | <code>                ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3432 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3433 | <code>                workspace: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3434 | <code>                workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3435 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3436 | <code>            return makeExternalVirtualToolResult(result &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3437 | <code>                status: 'capability_manager_unavailable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3438 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3439 | <code>                toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3440 | <code>                message: 'Capability Manager is not available for external virtual tool execution.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3441 | <code>            }, { toolId });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3442 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3443 | <code>        if (this.gatewayToolRuntimeRegistry?.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3444 | <code>            return await this.gatewayToolRuntimeRegistry.dispatch(toolId, args, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3445 | <code>                ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3446 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3447 | <code>                workspace: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3448 | <code>                workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3449 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3450 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3451 | <code>        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3452 | <code>            return this.notAvailableResult(toolId, 'provider-plugin-or-trigger');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3453 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3454 | <code>        if (EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(toolId) &amp;&amp; context.executeExternal !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3455 | <code>            return this.notAvailableResult(toolId, 'external-side-effect');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3456 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3457 | <code>        if (SESSION_BOUND_TOOL_IDS.has(toolId) &amp;&amp; !context.sessionKey &amp;&amp; !args.sessionKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3458 | <code>            return this.notAvailableResult(toolId, 'needs-session');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3459 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3460 | <code>        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) &#124;&#124; SESSION_BOUND_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3461 | <code>            await this.ensureToolGatewayReady();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3462 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3464 | <code>        const tools = await this.getToolSet({</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3465 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3466 | <code>            workspace: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3467 | <code>            sessionKey: context.sessionKey &#124;&#124; args.sessionKey &#124;&#124; 'main'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3468 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3469 | <code>        const tool = tools.get(toolId);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3470 | <code>        if (!tool?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3471 | <code>            return this.notAvailableResult(toolId, 'not-materialized');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3472 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3474 | <code>        const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });</code> | 声明局部标识符 `finalArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3475 | <code>        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) &#124;&#124; SESSION_BOUND_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3476 | <code>            return await this.withDefaultAgentRuntimeGatewayEnv(() =&gt; tool.execute(`ailis-${toolId}`, finalArgs));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3477 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3478 | <code>        return await tool.execute(`ailis-${toolId}`, finalArgs);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3479 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3481 | <code>    getWebRunSession(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3482 | <code>        const key = normalizeString(</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3483 | <code>            context.runId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3484 | <code>            'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3485 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3486 | <code>        let state = this.webRunSessions.get(key);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3487 | <code>        if (!state) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3488 | <code>            state = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3489 | <code>                refs: new Map(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3490 | <code>                countersByTurn: new Map(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3491 | <code>                selectionProtocol: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3492 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3493 | <code>            this.webRunSessions.set(key, state);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3494 | <code>            while (this.webRunSessions.size &gt; 64) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3495 | <code>                this.webRunSessions.delete(this.webRunSessions.keys().next().value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3496 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3497 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3498 | <code>        return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3499 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3501 | <code>    registerWebRunRef(context = {}, kind = 'search', url = '', metadata = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3502 | <code>        const state = this.getWebRunSession(context);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3503 | <code>        const iteration = Math.max(0, Number(context.iteration) &#124;&#124; 0);</code> | 声明局部标识符 `iteration`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3504 | <code>        const turnCounters = state.countersByTurn.get(iteration) &#124;&#124; { search: 0, view: 0 };</code> | 声明局部标识符 `turnCounters`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3505 | <code>        const counterKey = kind === 'view' ? 'view' : 'search';</code> | 声明局部标识符 `counterKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3506 | <code>        const refId = `turn${iteration}${counterKey}${turnCounters[counterKey]}`;</code> | 声明局部标识符 `refId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3507 | <code>        turnCounters[counterKey] += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3508 | <code>        state.countersByTurn.set(iteration, turnCounters);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3509 | <code>        state.refs.set(refId, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3510 | <code>            ref_id: refId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3511 | <code>            url: normalizeString(url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3512 | <code>            ...cloneJson(metadata)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3513 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3514 | <code>        return refId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3515 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3517 | <code>    resolveWebRunRef(context = {}, refId = '') {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3518 | <code>        const normalized = normalizeString(refId);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3519 | <code>        if (/^https?:\/\//i.test(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3520 | <code>            return { ref_id: normalized, url: normalized };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3521 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3522 | <code>        return this.getWebRunSession(context).refs.get(normalized) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3525 | <code>    executeWebRunCachedFind(resolved = {}, operation = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3526 | <code>        const extractedText = String(resolved.extractedText &#124;&#124; resolved.extracted_text &#124;&#124; '');</code> | 声明局部标识符 `extractedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3527 | <code>        const pattern = normalizeString(operation.pattern);</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3528 | <code>        if (!extractedText &#124;&#124; !pattern) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3529 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3530 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3531 | <code>        const allLines = extractedText.split(/\r?\n/);</code> | 声明局部标识符 `allLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3532 | <code>        const normalizedPattern = pattern.toLowerCase();</code> | 声明局部标识符 `normalizedPattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3533 | <code>        const matchIndexes = [];</code> | 声明局部标识符 `matchIndexes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3534 | <code>        for (let index = 0; index &lt; allLines.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3535 | <code>            if (allLines[index].toLowerCase().includes(normalizedPattern)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3536 | <code>                matchIndexes.push(index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3537 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3538 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3539 | <code>        const selectedIndexes = new Set();</code> | 声明局部标识符 `selectedIndexes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3540 | <code>        for (const matchIndex of matchIndexes.slice(0, 8)) {</code> | 声明局部标识符 `matchIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3541 | <code>            for (</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3542 | <code>                let index = Math.max(0, matchIndex - 3);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3543 | <code>                index &lt;= Math.min(allLines.length - 1, matchIndex + 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3544 | <code>                index += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3545 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3546 | <code>                selectedIndexes.add(index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3547 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3548 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3549 | <code>        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {</code> | 声明局部标识符 `viewRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3550 | <code>            parent_ref_id: normalizeString(operation.ref_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3551 | <code>            mode: 'find',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3552 | <code>            extractedText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3553 | <code>            contentType: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3554 | <code>                resolved.contentType &#124;&#124; resolved.content_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3555 | <code>                'application/pdf'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3556 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3557 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3558 | <code>        const sourceLines = [...selectedIndexes]</code> | 声明局部标识符 `sourceLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3559 | <code>            .sort((left, right) =&gt; left - right)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3560 | <code>            .map((index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3561 | <code>                lineNumber: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3562 | <code>                line_number: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3563 | <code>                lineno: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3564 | <code>                text: allLines[index],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3565 | <code>                rendered: `L${index + 1}: ${allLines[index]}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3566 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3567 | <code>        const lineStart = sourceLines[0]?.lineno &#124;&#124; 1;</code> | 声明局部标识符 `lineStart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3568 | <code>        const lineEnd = sourceLines.at(-1)?.lineno &#124;&#124; lineStart;</code> | 声明局部标识符 `lineEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3569 | <code>        const sourceWindow = {</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3570 | <code>            type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3571 | <code>            action: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3572 | <code>                type: 'find_in_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3573 | <code>                url: normalizeString(resolved.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3574 | <code>                pattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3575 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3576 | <code>            url: normalizeString(resolved.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3577 | <code>            ref_id: viewRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3578 | <code>            contentType: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3579 | <code>                resolved.contentType &#124;&#124; resolved.content_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3580 | <code>                'application/pdf'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3581 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3582 | <code>            content_type: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3583 | <code>                resolved.contentType &#124;&#124; resolved.content_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3584 | <code>                'application/pdf'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3585 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3586 | <code>            totalLines: allLines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3587 | <code>            total_lines: allLines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3588 | <code>            lineno: lineStart,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3589 | <code>            lineStart,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3590 | <code>            line_start: lineStart,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3591 | <code>            lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3592 | <code>            line_end: lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3593 | <code>            hasMoreBefore: lineStart &gt; 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3594 | <code>            has_more_before: lineStart &gt; 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3595 | <code>            hasMoreAfter: lineEnd &lt; allLines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3596 | <code>            has_more_after: lineEnd &lt; allLines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3597 | <code>            lines: sourceLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3598 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3599 | <code>        const text = matchIndexes.length</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3600 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3601 | <code>                  `Find results in cached extracted source for pattern: ${pattern}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3602 | <code>                  `Matches: ${matchIndexes.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3603 | <code>                  ...sourceLines.map((line) =&gt; line.rendered)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3604 | <code>              ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3605 | <code>            : `No matches in cached extracted source for pattern: ${pattern}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3606 | <code>        const structuredContent = {</code> | 声明局部标识符 `structuredContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3607 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3608 | <code>            cached: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3609 | <code>            url: normalizeString(resolved.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3610 | <code>            ref_id: viewRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3611 | <code>            pattern,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3612 | <code>            matchCount: matchIndexes.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3613 | <code>            match_count: matchIndexes.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3614 | <code>            source: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3615 | <code>            source_window: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3616 | <code>            sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3617 | <code>            sourceViewport: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3618 | <code>            source_viewport: sourceWindow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3619 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3620 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3621 | <code>            content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3622 | <code>            isError: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3623 | <code>            details: structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3624 | <code>            structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3625 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3626 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3628 | <code>    async executeWebRunSearch(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3629 | <code>        const queries = (Array.isArray(args.search_query) ? args.search_query : [])</code> | 声明局部标识符 `queries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3630 | <code>            .slice(0, 4)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3631 | <code>            .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3632 | <code>                q: normalizeString(entry?.q),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3633 | <code>                recency: entry?.recency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3634 | <code>                domains: Array.isArray(entry?.domains) ? entry.domains.map((domain) =&gt; normalizeString(domain)).filter(Boolean) : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3635 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3636 | <code>            .filter((entry) =&gt; entry.q);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3637 | <code>        if (!queries.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3638 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3639 | <code>                content: [{ type: 'text', text: 'web_run search_query requires at least one non-empty q.' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3640 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3641 | <code>                structuredContent: { status: 'invalid_tool_args', error: 'empty search_query' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3642 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3643 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3644 | <code>        const sourceQuestion = normalizeString(</code> | 声明局部标识符 `sourceQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3645 | <code>            context.currentUserMessage &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3646 | <code>            context.currentTaskRequest &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3647 | <code>            context.current_task_request</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3648 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3649 | <code>        let queryAssumptionAudit = null;</code> | 声明局部标识符 `queryAssumptionAudit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3650 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3651 | <code>            context.exactAnswerMode === true &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3652 | <code>            Math.max(0, Number(context.iteration) &#124;&#124; 0) === 0 &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3653 | <code>            looksLikeNestedSelectorTask(sourceQuestion)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3654 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3655 | <code>            const normalizedSource = sourceQuestion.toLowerCase();</code> | 声明局部标识符 `normalizedSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3656 | <code>            const unverifiedAnchors = [...new Set(queries.flatMap((query) =&gt;</code> | 声明局部标识符 `unverifiedAnchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3657 | <code>                extractStructuredQueryAnchors(query.q)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3658 | <code>                    .filter((anchor) =&gt; !normalizedSource.includes(anchor.toLowerCase()))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3659 | <code>            ))];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3660 | <code>            if (unverifiedAnchors.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3661 | <code>                queryAssumptionAudit = {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3662 | <code>                    status: 'unverified_intermediate_anchor_advisory',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3663 | <code>                    anchors: unverifiedAnchors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3664 | <code>                    queryGuidance: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3665 | <code>                        action: 'verify',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3666 | <code>                        strategy: 'parent_index_first',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3667 | <code>                        remove_unverified_anchors: unverifiedAnchors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3668 | <code>                        next_evidence: 'Retrieve the parent candidate index and apply the user-specified selector before naming a child identifier.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3669 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3670 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3671 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3672 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3673 | <code>        const maxResults = args.response_length === 'short' ? 4 : args.response_length === 'long' ? 12 : 8;</code> | 声明局部标识符 `maxResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3674 | <code>        const perQueryTimeoutMs = Math.max(</code> | 声明局部标识符 `perQueryTimeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3675 | <code>            25,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3676 | <code>            Math.min(Number(context.webRunSearchTimeoutMs) &#124;&#124; 45000, 120000)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3677 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3678 | <code>        const responses = await Promise.all(queries.map(async (query) =&gt; {</code> | 声明局部标识符 `responses`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3679 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3680 | <code>                return await withTimeout(perQueryTimeoutMs, () =&gt; this.runtime.executeMcpBridge({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3681 | <code>                    action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3682 | <code>                    server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3683 | <code>                    tool: 'web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3684 | <code>                    timeoutMs: perQueryTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3685 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3686 | <code>                        query: query.q,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3687 | <code>                        maxResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3688 | <code>                        ...(query.recency !== undefined ? { recency: query.recency } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3689 | <code>                        ...(query.domains.length ? { domains: query.domains } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3690 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3691 | <code>                }, context));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3692 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3693 | <code>                const timedOut = error?.code === 'AILIS_GATEWAY_TIMEOUT';</code> | 声明局部标识符 `timedOut`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3694 | <code>                const status = timedOut ? 'search_timeout' : 'search_failed';</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3695 | <code>                const message = timedOut</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3696 | <code>                    ? `Search query exceeded its ${perQueryTimeoutMs}ms budget.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3697 | <code>                    : normalizeString(error?.message &#124;&#124; String(error), 'The underlying search tool failed.');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3698 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3699 | <code>                    content: [{ type: 'text', text: message }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3700 | <code>                    isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3701 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3702 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3703 | <code>                        error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3704 | <code>                        retryable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3705 | <code>                        timeoutMs: perQueryTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3706 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3707 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3708 | <code>                        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3709 | <code>                        error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3710 | <code>                        retryable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3711 | <code>                        timeoutMs: perQueryTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3712 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3713 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3714 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3715 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3716 | <code>        const failures = responses.flatMap((response, queryIndex) =&gt; {</code> | 声明局部标识符 `failures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3717 | <code>            const details = bridgeStructuredContent(response);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3718 | <code>            const nestedDetails = firstObject(details.details, response?.details?.details);</code> | 声明局部标识符 `nestedDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3719 | <code>            const failed = response?.isError === true</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3720 | <code>                &#124;&#124; response?.details?.result?.isError === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3721 | <code>                &#124;&#124; details.isError === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3722 | <code>                &#124;&#124; details.status === 'error'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3723 | <code>                &#124;&#124; nestedDetails.status === 'invalid_mcp_tool_args';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3724 | <code>            if (!failed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3725 | <code>                return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3726 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3727 | <code>            return [{</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3728 | <code>                query_index: queryIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3729 | <code>                query: queries[queryIndex].q,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3730 | <code>                status: normalizeString(nestedDetails.status &#124;&#124; details.status, 'search_failed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3731 | <code>                error: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3732 | <code>                    nestedDetails.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3733 | <code>                    &#124;&#124; details.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3734 | <code>                    &#124;&#124; bridgeTextContent(response),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3735 | <code>                    'The underlying search tool failed.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3736 | <code>                ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3737 | <code>                ...(Array.isArray(nestedDetails.errors) ? { errors: cloneJson(nestedDetails.errors) } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3738 | <code>            }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3739 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3740 | <code>        const excludedEvaluationLeakResults = [];</code> | 声明局部标识符 `excludedEvaluationLeakResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3741 | <code>        const evaluationMode = Boolean(</code> | 声明局部标识符 `evaluationMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3742 | <code>            normalizeString(context.evaluationName &#124;&#124; context.evaluation_name) &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3743 | <code>            context.benchmarkEvaluation === true &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3744 | <code>            context.benchmark_evaluation === true</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3745 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3746 | <code>        const queryResults = responses.map((response, queryIndex) =&gt; {</code> | 声明局部标识符 `queryResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3747 | <code>            const details = bridgeStructuredContent(response);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3748 | <code>            const results = Array.isArray(details.results)</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3749 | <code>                ? details.results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3750 | <code>                : Array.isArray(details.webSearchOutput?.search?.results)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3751 | <code>                ? details.webSearchOutput.search.results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3752 | <code>                : Array.isArray(details.search?.results)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3753 | <code>                ? details.search.results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3754 | <code>                : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3755 | <code>            return results.flatMap((result) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3756 | <code>                if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3757 | <code>                    evaluationMode &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3758 | <code>                    (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3759 | <code>                        isEvaluationAnswerLeak(sourceQuestion, result) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3760 | <code>                        isEvaluationTaskMirror(sourceQuestion, result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3761 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3762 | <code>                ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3763 | <code>                    excludedEvaluationLeakResults.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3764 | <code>                        query_index: queryIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3765 | <code>                        title: normalizeString(result?.title),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3766 | <code>                        url: normalizeString(result?.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3767 | <code>                        reason: isEvaluationAnswerLeak(sourceQuestion, result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3768 | <code>                            ? 'Search result repeats the evaluation question and exposes a labeled answer.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3769 | <code>                            : 'Search result is an evaluation-corpus mirror that repeats the task prompt without source evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3770 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3771 | <code>                    return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3772 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3773 | <code>                return [{ ...result, query_index: queryIndex }];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3774 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3775 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3776 | <code>        const specializedNextCalls = [];</code> | 声明局部标识符 `specializedNextCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3777 | <code>        const seenSpecializedCalls = new Set();</code> | 声明局部标识符 `seenSpecializedCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3778 | <code>        for (const response of responses) {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3779 | <code>            const details = bridgeStructuredContent(response);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3780 | <code>            for (const call of Array.isArray(details.suggestedNextCalls) ? details.suggestedNextCalls : []) {</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3781 | <code>                const tool = normalizeString(call?.tool);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3782 | <code>                const callArgs = call?.args &amp;&amp; typeof call.args === 'object' &amp;&amp; !Array.isArray(call.args)</code> | 声明局部标识符 `callArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3783 | <code>                    ? cloneJson(call.args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3784 | <code>                    : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3785 | <code>                if (!tool &#124;&#124; !callArgs &#124;&#124; ['open_page', 'web_fetch', 'web_run', 'web_search'].includes(tool)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3786 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3787 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3788 | <code>                const key = `${tool}:${JSON.stringify(callArgs)}`;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3789 | <code>                if (seenSpecializedCalls.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3790 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3791 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3792 | <code>                seenSpecializedCalls.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3793 | <code>                specializedNextCalls.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3794 | <code>                    tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3795 | <code>                    args: callArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3796 | <code>                    reason: normalizeString(call.reason, 'Use the source-specific reader suggested by the search backend.')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3797 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3798 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3799 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3800 | <code>        const merged = [];</code> | 声明局部标识符 `merged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3801 | <code>        const seenUrls = new Set();</code> | 声明局部标识符 `seenUrls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3802 | <code>        const longest = Math.max(0, ...queryResults.map((results) =&gt; results.length));</code> | 声明局部标识符 `longest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3803 | <code>        for (let rank = 0; rank &lt; longest &amp;&amp; merged.length &lt; maxResults; rank += 1) {</code> | 声明局部标识符 `rank`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3804 | <code>            for (const results of queryResults) {</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3805 | <code>                const result = results[rank];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3806 | <code>                const url = normalizeString(result?.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3807 | <code>                if (!url &#124;&#124; seenUrls.has(url)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3808 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3809 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3810 | <code>                seenUrls.add(url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3811 | <code>                const refId = this.registerWebRunRef(context, 'search', url, {</code> | 声明局部标识符 `refId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3812 | <code>                    title: result.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3813 | <code>                    snippet: result.snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3814 | <code>                    query_index: result.query_index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3815 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3816 | <code>                merged.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3817 | <code>                    id: refId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3818 | <code>                    ref_id: refId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3819 | <code>                    title: normalizeString(result.title &#124;&#124; result.text &#124;&#124; url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3820 | <code>                    url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3821 | <code>                    snippet: normalizeString(result.snippet &#124;&#124; result.content),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3822 | <code>                    source: normalizeString(result.source &#124;&#124; result.sourceBackend),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3823 | <code>                    rank: merged.length + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3824 | <code>                    query_index: result.query_index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3825 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3826 | <code>                if (merged.length &gt;= maxResults) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3827 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3828 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3829 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3830 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3831 | <code>        const queryValues = queries.map((query) =&gt; query.q);</code> | 声明局部标识符 `queryValues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3832 | <code>        let deferredToolSearchSuggestion = null;</code> | 声明局部标识符 `deferredToolSearchSuggestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3833 | <code>        if (sourceQuestion &amp;&amp; this.runtime?.capabilityManager?.searchExternalToolEntries) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3834 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3835 | <code>                const searched = await this.runtime.capabilityManager.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3836 | <code>                    query: sourceQuestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3837 | <code>                    limit: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3838 | <code>                    includeExposed: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3839 | <code>                    includeContracts: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3840 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3841 | <code>                const matches = (Array.isArray(searched?.tools) ? searched.tools : [])</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3842 | <code>                    .filter((entry) =&gt; entry?.callable === true)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3843 | <code>                    .sort((left, right) =&gt; Number(right.search_score &#124;&#124; 0) - Number(left.search_score &#124;&#124; 0));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3844 | <code>                const top = matches[0];</code> | 声明局部标识符 `top`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3845 | <code>                const runnerUp = matches[1];</code> | 声明局部标识符 `runnerUp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3846 | <code>                const topScore = Number(top?.search_score &#124;&#124; 0);</code> | 声明局部标识符 `topScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3847 | <code>                const runnerUpScore = Number(runnerUp?.search_score &#124;&#124; 0);</code> | 声明局部标识符 `runnerUpScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3848 | <code>                if (top &amp;&amp; topScore &gt;= 3 &amp;&amp; (!runnerUp &#124;&#124; topScore - runnerUpScore &gt;= 2)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3849 | <code>                    deferredToolSearchSuggestion = {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3850 | <code>                        tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3851 | <code>                        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3852 | <code>                            query: sourceQuestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3853 | <code>                            limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3854 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3855 | <code>                        reason: `A callable deferred structured/API tool is a strong semantic match (${normalizeString(top.id &#124;&#124; top.name &#124;&#124; top.toolId)}). Discover its schema before doing more broad web search.`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3856 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3857 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3858 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3859 | <code>                deferredToolSearchSuggestion = null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3860 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3861 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3862 | <code>        const action = queryValues.length === 1</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3863 | <code>            ? { type: 'search', query: queryValues[0] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3864 | <code>            : { type: 'search', queries: queryValues };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3865 | <code>        const webSearchCall = { type: 'web_search_call', status: 'completed', action };</code> | 声明局部标识符 `webSearchCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3866 | <code>        if (failures.length === responses.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3867 | <code>            const failedCall = { ...webSearchCall, status: 'failed' };</code> | 声明局部标识符 `failedCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3868 | <code>            const failedSearch = {</code> | 声明局部标识符 `failedSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3869 | <code>                status: 'search_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3870 | <code>                queries: queryValues,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3871 | <code>                results: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3872 | <code>                candidates: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3873 | <code>                failures</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3874 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3875 | <code>            const structuredContent = {</code> | 声明局部标识符 `structuredContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3876 | <code>                type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3877 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3878 | <code>                webSearchCall: failedCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3879 | <code>                web_search_call: failedCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3880 | <code>                search: failedSearch</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3881 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3882 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3883 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3884 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3885 | <code>                    text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3886 | <code>                        'Web search failed before producing results.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3887 | <code>                        ...failures.map((failure) =&gt; `${failure.query}: ${failure.status}: ${failure.error}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3888 | <code>                    ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3889 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3890 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3891 | <code>                details: structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3892 | <code>                structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3893 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3894 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3895 | <code>        const searchStatus = merged.length ? 'completed' : 'empty';</code> | 声明局部标识符 `searchStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3896 | <code>        const filteredQueries = queries.filter((query) =&gt; query.recency !== undefined &#124;&#124; query.domains.length &gt; 0);</code> | 声明局部标识符 `filteredQueries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3897 | <code>        const queryNeedsReformulation = queries.some((query) =&gt; {</code> | 声明局部标识符 `queryNeedsReformulation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3898 | <code>            const terms = query.q.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}._:-]*/gu) &#124;&#124; [];</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3899 | <code>            const uniqueTerms = new Set(terms);</code> | 声明局部标识符 `uniqueTerms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3900 | <code>            return query.q.length &gt; 180 &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3901 | <code>                terms.length &gt; 24 &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3902 | <code>                (terms.length &gt;= 12 &amp;&amp; uniqueTerms.size / terms.length &lt; 0.65);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3903 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3904 | <code>        const selectionAudit = merged.length</code> | 声明局部标识符 `selectionAudit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3905 | <code>            ? buildSearchSelectionAudit(sourceQuestion, merged)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3906 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3907 | <code>        const historicalArchiveUrl = !merged.length &amp;&amp; looksLikeHistoricalWebStateQuestion(sourceQuestion)</code> | 声明局部标识符 `historicalArchiveUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3908 | <code>            ? historicalArchiveUrlFromQueries(queries)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3909 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3910 | <code>        const historicalArchiveSuggestion = historicalArchiveUrl</code> | 声明局部标识符 `historicalArchiveSuggestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3911 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3912 | <code>                  tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3913 | <code>                  args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3914 | <code>                      archive: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3915 | <code>                          url: historicalArchiveUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3916 | <code>                          mode: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3917 | <code>                          matchType: 'prefix',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3918 | <code>                          ...(sourceQuestion ? { query: sourceQuestion } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3919 | <code>                      }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3920 | <code>                  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3921 | <code>                  reason: 'The task asks for a past public-web state and the live search returned no candidates. Inspect an archived snapshot of the known URL or stable prefix instead of repeatedly rewriting broad search queries.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3922 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3923 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3924 | <code>        const queryGuidance = historicalArchiveSuggestion</code> | 声明局部标识符 `queryGuidance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3925 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3926 | <code>                  action: 'switch_source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3927 | <code>                  strategy: 'historical_archive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3928 | <code>                  repeat_previous_query: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3929 | <code>                  archive_url: historicalArchiveUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3930 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3931 | <code>            : !merged.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3932 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3933 | <code>                  action: 'reformulate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3934 | <code>                  strategy: queryNeedsReformulation ? 'fresh_concise_query' : 'broaden_or_simplify',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3935 | <code>                  repeat_previous_query: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3936 | <code>                  target_term_count: { min: 3, max: 8 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3937 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3938 | <code>            : selectionAudit?.candidate_set_coverage_sufficient === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3939 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3940 | <code>                  action: selectionAudit.parent_index_candidates.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3941 | <code>                      ? 'inspect_parent_index'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3942 | <code>                      : selectionAudit.candidates.length &gt;= 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3943 | <code>                      ? 'inspect_competing_parents'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3944 | <code>                      : 'reformulate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3945 | <code>                  strategy: selectionAudit.parent_index_candidates.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3946 | <code>                      ? 'nearest_url_ancestor_first'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3947 | <code>                      : selectionAudit.candidates.length &gt;= 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3948 | <code>                      ? 'compare_visible_parents_and_expand_candidate_boundary'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3949 | <code>                      : 'fresh_concise_parent_index_query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3950 | <code>                  repeat_previous_query: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3951 | <code>                  target_term_count: { min: 3, max: 8 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3952 | <code>                  parent_index_refs: selectionAudit.parent_index_candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3953 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3954 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3955 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3956 | <code>            selectionAudit?.candidate_set_coverage_sufficient === false &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3957 | <code>            selectionAudit.parent_index_candidates.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3958 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3959 | <code>            const state = this.getWebRunSession(context);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3960 | <code>            const parentIndexRef = selectionAudit.parent_index_candidates[0];</code> | 声明局部标识符 `parentIndexRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3961 | <code>            const parentIndex = state.refs.get(parentIndexRef);</code> | 声明局部标识符 `parentIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3962 | <code>            if (parentIndex?.url &amp;&amp; state.selectionProtocol?.boundaryComplete !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3963 | <code>                state.selectionProtocol = {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3964 | <code>                    status: 'parent_index_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3965 | <code>                    parentKind: selectionAudit.parent_kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3966 | <code>                    quotedTerm: selectionAudit.quoted_term,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3967 | <code>                    selector: selectionAudit.selector,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3968 | <code>                    parentIndexRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3969 | <code>                    parentIndexUrl: parentIndex.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3970 | <code>                    relevantStart: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3971 | <code>                    totalLines: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3972 | <code>                    ranges: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3973 | <code>                    currentGroup: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3974 | <code>                    groupTitleMatches: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3975 | <code>                    groupTitleCounts: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3976 | <code>                    boundaryComplete: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3977 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3978 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3979 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3980 | <code>        const prioritizedOpenResults = selectionAudit?.candidate_set_coverage_sufficient === false &amp;&amp;</code> | 声明局部标识符 `prioritizedOpenResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3981 | <code>            selectionAudit.parent_index_candidates.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3982 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3983 | <code>                  ...selectionAudit.parent_index_candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3984 | <code>                      .map((refId) =&gt; merged.find((result) =&gt; result.ref_id === refId))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3985 | <code>                      .filter(Boolean),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3986 | <code>                  ...selectionAudit.candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3987 | <code>                      .map((candidate) =&gt; merged.find((result) =&gt; result.ref_id === candidate.ref_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3988 | <code>                      .filter((result) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3989 | <code>                          result &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3990 | <code>                          !selectionAudit.parent_index_candidates.includes(result.ref_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3991 | <code>                      )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3992 | <code>              ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3993 | <code>            : selectionAudit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3994 | <code>            ? selectionAudit.candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3995 | <code>                .map((candidate) =&gt; merged.find((result) =&gt; result.ref_id === candidate.ref_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3996 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3997 | <code>            : merged;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3998 | <code>        const suggestedNextCalls = merged.length</code> | 声明局部标识符 `suggestedNextCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3999 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4000 | <code>                  ...(deferredToolSearchSuggestion ? [deferredToolSearchSuggestion] : []),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4001 | <code>                  ...specializedNextCalls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4002 | <code>                  ...prioritizedOpenResults.map((result) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4003 | <code>                      const lexicalCandidate = selectionAudit?.candidates</code> | 声明局部标识符 `lexicalCandidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4004 | <code>                          ?.find((candidate) =&gt; candidate.ref_id === result.ref_id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4005 | <code>                      return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4006 | <code>                      tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4007 | <code>                      args: { open: [{ ref_id: result.ref_id }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4008 | <code>                      reason: selectionAudit?.parent_index_candidates.includes(result.ref_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4009 | <code>                          ? `Open the nearest parent index before selecting a child. Only ${selectionAudit.competing_matching_candidates_visible} matching parent candidate(s) are visible, so the current search result set cannot establish "${selectionAudit.selector}".`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4010 | <code>                          : selectionAudit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4011 | <code>                          ? `Inspect this parent candidate and count unique child titles. Its visible snippet contains ${lexicalCandidate?.visible_snippet_occurrences &#124;&#124; 0} exact occurrence(s) of "${selectionAudit.quoted_term}", but snippet counts are not final selection evidence.`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4012 | <code>                          : 'Open a relevant candidate to inspect source evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4013 | <code>                      };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4014 | <code>                  })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4015 | <code>              ].slice(0, 3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4016 | <code>            : historicalArchiveSuggestion</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4017 | <code>            ? [historicalArchiveSuggestion]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4018 | <code>            : deferredToolSearchSuggestion</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4019 | <code>            ? [deferredToolSearchSuggestion]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4020 | <code>            : filteredQueries.length &amp;&amp; !queryNeedsReformulation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4021 | <code>            ? [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4022 | <code>                  tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4023 | <code>                  args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4024 | <code>                      search_query: queries.map((query) =&gt; ({ q: query.q })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4025 | <code>                      ...(args.response_length ? { response_length: args.response_length } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4026 | <code>                  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4027 | <code>                  reason: 'Retry the same model-authored queries without optional recency or domain transport filters.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4028 | <code>              }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4029 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4030 | <code>        const webSearchOutput = {</code> | 声明局部标识符 `webSearchOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4031 | <code>            type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4032 | <code>            webSearchCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4033 | <code>            web_search_call: webSearchCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4034 | <code>            functionCallOutput: { type: 'function_call_output', status: 'completed', output_kind: 'web_search_results' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4035 | <code>            function_call_output: { type: 'function_call_output', status: 'completed', output_kind: 'web_search_results' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4036 | <code>            search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4037 | <code>                status: searchStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4038 | <code>                queries: queryValues,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4039 | <code>                results: merged,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4040 | <code>                candidates: merged,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4041 | <code>                ...(excludedEvaluationLeakResults.length ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4042 | <code>                    evaluationLeakAudit: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4043 | <code>                        status: 'excluded_labeled_answer_leaks',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4044 | <code>                        excluded_count: excludedEvaluationLeakResults.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4045 | <code>                        excluded_results: excludedEvaluationLeakResults</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4046 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4047 | <code>                } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4048 | <code>                ...(failures.length ? { failures } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4049 | <code>                ...(queryGuidance ? { queryGuidance } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4050 | <code>                ...(queryAssumptionAudit ? { queryAssumptionAudit } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4051 | <code>                ...(selectionAudit ? { selectionAudit } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4052 | <code>                ...(suggestedNextCalls.length ? { suggestedNextCalls } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4053 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4054 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4055 | <code>        const selectionAuditText = selectionAudit</code> | 声明局部标识符 `selectionAuditText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4056 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4057 | <code>                  `Selection audit (incomplete): search ranking does not answer "${selectionAudit.selector}".`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4058 | <code>                  `Exact whole-token/phrase "${selectionAudit.quoted_term}" occurrences visible in result snippets:`,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4059 | <code>                  ...selectionAudit.candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4060 | <code>                      .filter((candidate) =&gt; candidate.visible_snippet_occurrences &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4061 | <code>                      .map((candidate) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4062 | <code>                          `- [${candidate.ref_id}] ${candidate.visible_snippet_occurrences} occurrence(s)`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4063 | <code>                      ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4064 | <code>                  ...(selectionAudit.parent_index_candidates.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4065 | <code>                      ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4066 | <code>                            `Only ${selectionAudit.competing_matching_candidates_visible} matching parent candidate(s) are visible. Open the nearest parent index [${selectionAudit.parent_index_candidates[0]}] before selecting a child.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4067 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4068 | <code>                      : selectionAudit.candidates.length &gt;= 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4069 | <code>                      ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4070 | <code>                            `${selectionAudit.competing_matching_candidates_visible} parent candidate(s) are visible, but search results do not establish the full candidate-set boundary. Inspect the competing parents and continue boundary discovery before selecting a child.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4071 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4072 | <code>                      : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4073 | <code>                            `Only ${selectionAudit.competing_matching_candidates_visible} matching parent candidate(s) are visible. Write a fresh concise parent-index query before selecting a child.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4074 | <code>                        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4075 | <code>                  'These are diagnostic snippet counts, not final per-group title counts. Inspect the leading candidates and verify unique matching titles plus the candidate-set boundary before selecting a child.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4076 | <code>              ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4077 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4078 | <code>        const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4079 | <code>            ...(queryAssumptionAudit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4080 | <code>                ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4081 | <code>                      `Query assumption audit (advisory): ${queryAssumptionAudit.anchors.join(', ')} are possible intermediate identifiers not stated by the user.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4082 | <code>                      'The search still ran. Treat those identifiers as hypotheses and verify the parent selection before relying on them.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4083 | <code>                  ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4084 | <code>                : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4085 | <code>            ...selectionAuditText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4086 | <code>            ...((queryAssumptionAudit &#124;&#124; selectionAudit &#124;&#124; historicalArchiveSuggestion) &amp;&amp; suggestedNextCalls[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4087 | <code>                ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4088 | <code>                      'Next recommended call (advisory; the model may choose another evidence action):',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4089 | <code>                      `${suggestedNextCalls[0].tool} ${JSON.stringify(suggestedNextCalls[0].args)}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4090 | <code>                  ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4091 | <code>                : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4092 | <code>            ...(excludedEvaluationLeakResults.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4093 | <code>                ? [`Excluded ${excludedEvaluationLeakResults.length} evaluation-answer leak candidate(s); labeled benchmark answers are not source evidence.`]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4094 | <code>                : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4095 | <code>            merged.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4096 | <code>                ? 'Search results (open a relevant reference to inspect source evidence):'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4097 | <code>                : historicalArchiveSuggestion</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4098 | <code>                ? `No live search results for this past-state question. Run the visible archive call for ${historicalArchiveUrl} instead of repeating broad web search.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4099 | <code>                : queryNeedsReformulation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4100 | <code>                ? 'No search results. Write one fresh concise query with 3-8 discriminative terms; do not concatenate or repeat prior queries.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4101 | <code>                : 'No search results. Broaden the query and omit optional recency/domain filters before retrying.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4102 | <code>            ...merged.flatMap((result, index) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4103 | <code>                `${index + 1}. [${result.ref_id}] ${result.title}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4104 | <code>                `   URL: ${result.url}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4105 | <code>                result.snippet ? `   Snippet: ${result.snippet}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4106 | <code>            ].filter(Boolean))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4107 | <code>        ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4108 | <code>        const structuredContent = {</code> | 声明局部标识符 `structuredContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4109 | <code>            type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4110 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4111 | <code>            webSearchCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4112 | <code>            web_search_call: webSearchCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4113 | <code>            webSearchOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4114 | <code>            web_search_output: webSearchOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4115 | <code>            search: webSearchOutput.search</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4116 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4117 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4118 | <code>            content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4119 | <code>            isError: responses.every((response) =&gt; response?.isError === true),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4120 | <code>            details: structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4121 | <code>            structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4122 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4123 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4125 | <code>    async executeWebRunNavigation(operation = {}, context = {}, mode = 'open') {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4126 | <code>        const resolved = this.resolveWebRunRef(context, operation.ref_id);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4127 | <code>        if (!resolved?.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4128 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4129 | <code>                content: [{ type: 'text', text: `Unknown web reference id: ${normalizeString(operation.ref_id)}` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4130 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4131 | <code>                structuredContent: { status: 'unknown_ref_id', ref_id: normalizeString(operation.ref_id) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4132 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4133 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4134 | <code>        const state = this.getWebRunSession(context);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4135 | <code>        const selectionProtocol = state.selectionProtocol;</code> | 声明局部标识符 `selectionProtocol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4136 | <code>        const sourceQuestion = normalizeString(</code> | 声明局部标识符 `sourceQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4137 | <code>            context.currentUserMessage &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4138 | <code>            context.currentTaskRequest &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4139 | <code>            context.current_task_request</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4140 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4141 | <code>        if (mode === 'find') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4142 | <code>            const cachedFind = this.executeWebRunCachedFind(resolved, operation, context);</code> | 声明局部标识符 `cachedFind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4143 | <code>            if (cachedFind) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4144 | <code>                return cachedFind;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4145 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4146 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4147 | <code>        const comparableUrl = (value = '') =&gt; normalizeString(value)</code> | 声明局部标识符 `comparableUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4148 | <code>            .replace(/#.*$/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4149 | <code>            .replace(/\/+$/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4150 | <code>            .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4151 | <code>        const selectionDependencyAdvisory = (</code> | 声明局部标识符 `selectionDependencyAdvisory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4152 | <code>            mode === 'open' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4153 | <code>            context.exactAnswerMode === true &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4154 | <code>            selectionProtocol &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4155 | <code>            selectionProtocol.boundaryComplete !== true &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4156 | <code>            comparableUrl(resolved.url) !== comparableUrl(selectionProtocol.parentIndexUrl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4157 | <code>        ) ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4158 | <code>            status: 'selection_dependency_unresolved_advisory',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4159 | <code>            parent_kind: selectionProtocol.parentKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4160 | <code>            selector: selectionProtocol.selector,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4161 | <code>            quoted_term: selectionProtocol.quotedTerm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4162 | <code>            boundary_complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4163 | <code>            required_parent_index_ref: selectionProtocol.parentIndexRef</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4164 | <code>        } : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4165 | <code>        const resolvedFetchBackend = normalizeString(</code> | 声明局部标识符 `resolvedFetchBackend`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4166 | <code>            resolved.fetchBackend &#124;&#124; resolved.fetch_backend</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4167 | <code>        ).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4168 | <code>        let tool = mode === 'find'</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4169 | <code>            ? 'web_find'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4170 | <code>            : resolvedFetchBackend.startsWith('crawl4ai')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4171 | <code>            ? 'render_page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4172 | <code>            : resolvedFetchBackend</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4173 | <code>            ? 'web_fetch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4174 | <code>            : 'render_page';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4175 | <code>        const bridgeArgs = mode === 'find'</code> | 声明局部标识符 `bridgeArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4176 | <code>            ? { url: resolved.url, pattern: operation.pattern }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4177 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4178 | <code>                url: resolved.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4179 | <code>                ...(operation.lineno !== undefined ? { lineno: operation.lineno } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4180 | <code>                ...(sourceQuestion ? { query: sourceQuestion } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4181 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4182 | <code>        let response = await this.runtime.executeMcpBridge({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4183 | <code>            action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4184 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4185 | <code>            tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4186 | <code>            args: bridgeArgs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4187 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4188 | <code>        const renderedFailed = tool === 'render_page' &amp;&amp; (</code> | 声明局部标识符 `renderedFailed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4189 | <code>            response?.isError === true &#124;&#124; response?.details?.result?.isError === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4190 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4191 | <code>        if (renderedFailed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4192 | <code>            tool = 'web_fetch';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4193 | <code>            response = await this.runtime.executeMcpBridge({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4194 | <code>                action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4195 | <code>                server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4196 | <code>                tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4197 | <code>                args: bridgeArgs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4198 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4200 | <code>        const cloned = cloneJson(response) &#124;&#124; {};</code> | 声明局部标识符 `cloned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4201 | <code>        const details = bridgeStructuredContent(cloned);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4202 | <code>        const contentType = normalizeString(details.contentType &#124;&#124; details.content_type).toLowerCase();</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4203 | <code>        if (mode === 'open' &amp;&amp; contentType.includes('application/pdf')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4204 | <code>            const pdfResponse = await this.executeWebRunPdf(resolved.url, context, {</code> | 声明局部标识符 `pdfResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4205 | <code>                parentRefId: normalizeString(operation.ref_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4206 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4207 | <code>            if (pdfResponse.isError !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4208 | <code>                return pdfResponse;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4209 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4211 | <code>        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {</code> | 声明局部标识符 `viewRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4212 | <code>            parent_ref_id: normalizeString(operation.ref_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4213 | <code>            mode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4214 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4215 | <code>        const sourceViews = [</code> | 声明局部标识符 `sourceViews`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4216 | <code>            details.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4217 | <code>            details.source_viewport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4218 | <code>            details.sourceViewport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4219 | <code>            details.source_window,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4220 | <code>            details.sourceWindow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4221 | <code>        ].filter((value) =&gt; value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4222 | <code>        for (const sourceView of sourceViews) {</code> | 声明局部标识符 `sourceView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4223 | <code>            sourceView.ref_id = viewRef;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4224 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4225 | <code>        const observedLinks = Array.isArray(details.observedRelevantLinks)</code> | 声明局部标识符 `observedLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4226 | <code>            ? details.observedRelevantLinks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4227 | <code>            : Array.isArray(details.observed_relevant_links)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4228 | <code>            ? details.observed_relevant_links</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4229 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4230 | <code>        const sectionLinks = sourceViewportSectionLinks(sourceViews, resolved.url);</code> | 声明局部标识符 `sectionLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4231 | <code>        const mergedLinks = [];</code> | 声明局部标识符 `mergedLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4232 | <code>        const seenLinkUrls = new Set();</code> | 声明局部标识符 `seenLinkUrls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4233 | <code>        for (const link of [...sectionLinks, ...observedLinks]) {</code> | 声明局部标识符 `link`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4234 | <code>            const url = normalizeString(link?.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4235 | <code>            if (!url &#124;&#124; seenLinkUrls.has(url)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4236 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4237 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4238 | <code>            seenLinkUrls.add(url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4239 | <code>            mergedLinks.push(link);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4240 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4241 | <code>        const numberedLinks = mergedLinks</code> | 声明局部标识符 `numberedLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4242 | <code>            .map((link, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4243 | <code>                ...link,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4244 | <code>                id: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4245 | <code>                url: normalizeString(link?.url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4246 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4247 | <code>            .filter((link) =&gt; link.url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4248 | <code>        if (numberedLinks.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4249 | <code>            const state = this.getWebRunSession(context);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4250 | <code>            const view = state.refs.get(viewRef);</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4251 | <code>            if (view) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4252 | <code>                view.links = cloneJson(numberedLinks);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4253 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4254 | <code>            const openedRef = state.refs.get(normalizeString(operation.ref_id));</code> | 声明局部标识符 `openedRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4255 | <code>            if (openedRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4256 | <code>                openedRef.links = cloneJson(numberedLinks);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4257 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4258 | <code>            details.observedRelevantLinks = numberedLinks;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4259 | <code>            details.observed_relevant_links = numberedLinks;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4260 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4261 | <code>        const fetchBackend = normalizeString(details.fetchBackend &#124;&#124; details.fetch_backend);</code> | 声明局部标识符 `fetchBackend`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4262 | <code>        const view = state.refs.get(viewRef);</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4263 | <code>        if (view) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4264 | <code>            view.fetchBackend = fetchBackend;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4265 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4266 | <code>        const openedRef = state.refs.get(normalizeString(operation.ref_id));</code> | 声明局部标识符 `openedRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4267 | <code>        if (openedRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4268 | <code>            openedRef.fetchBackend = fetchBackend;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4269 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4270 | <code>        details.ref_id = viewRef;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4271 | <code>        details.url = resolved.url;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4272 | <code>        if (selectionDependencyAdvisory) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4273 | <code>            details.selectionDependencyAdvisory = selectionDependencyAdvisory;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 4274 | <code>            details.selection_dependency_advisory = selectionDependencyAdvisory;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4275 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4276 | <code>        const primarySourceView = sourceViews[0] &#124;&#124; {};</code> | 声明局部标识符 `primarySourceView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4277 | <code>        const hasMoreAfter = primarySourceView.hasMoreAfter === true &#124;&#124;</code> | 声明局部标识符 `hasMoreAfter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4278 | <code>            primarySourceView.has_more_after === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4279 | <code>        const lineEnd = Number(</code> | 声明局部标识符 `lineEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4280 | <code>            primarySourceView.lineEnd &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4281 | <code>            primarySourceView.line_end &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4282 | <code>            primarySourceView.endLine &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4283 | <code>            primarySourceView.end_line</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4284 | <code>        ) &#124;&#124; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4285 | <code>        const parentKind = selectorParentKind(sourceQuestion);</code> | 声明局部标识符 `parentKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4286 | <code>        const parentAnchorsInViewport = new Set(</code> | 声明局部标识符 `parentAnchorsInViewport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4287 | <code>            sourceViews.flatMap((sourceView) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4288 | <code>                (Array.isArray(sourceView?.lines) ? sourceView.lines : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4289 | <code>                    .flatMap((line) =&gt; extractStructuredQueryAnchors(line?.text &#124;&#124; line?.rendered))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4290 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4291 | <code>                .filter((anchor) =&gt; structuredAnchorKind(anchor) === parentKind)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4292 | <code>                .map((anchor) =&gt; anchor.toLowerCase())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4293 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4294 | <code>        const selectionGroupCounts = updateSelectionProtocolTitleCounts(</code> | 声明局部标识符 `selectionGroupCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4295 | <code>            selectionProtocol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4296 | <code>            sourceViews</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4297 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4298 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4299 | <code>            selectionProtocol &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4300 | <code>            comparableUrl(resolved.url) === comparableUrl(selectionProtocol.parentIndexUrl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4301 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4302 | <code>            const lineStart = Number(</code> | 声明局部标识符 `lineStart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4303 | <code>                primarySourceView.lineStart &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4304 | <code>                primarySourceView.line_start &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4305 | <code>                primarySourceView.lineno</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4306 | <code>            ) &#124;&#124; 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4307 | <code>            const totalLines = Number(</code> | 声明局部标识符 `totalLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4308 | <code>                primarySourceView.totalLines &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4309 | <code>                primarySourceView.total_lines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4310 | <code>            ) &#124;&#124; lineEnd;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4311 | <code>            const parentAnchorLines = sourceViews.flatMap((sourceView) =&gt;</code> | 声明局部标识符 `parentAnchorLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4312 | <code>                (Array.isArray(sourceView?.lines) ? sourceView.lines : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4313 | <code>                    .filter((line) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4314 | <code>                        extractStructuredQueryAnchors(line?.text &#124;&#124; line?.rendered)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4315 | <code>                            .some((anchor) =&gt; structuredAnchorKind(anchor) === selectionProtocol.parentKind)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4316 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4317 | <code>                    .map((line) =&gt; Number(line?.lineno &#124;&#124; line?.lineNumber &#124;&#124; line?.line_number) &#124;&#124; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4318 | <code>                    .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4319 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4320 | <code>            if (parentAnchorLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4321 | <code>                const firstParentLine = Math.min(...parentAnchorLines);</code> | 声明局部标识符 `firstParentLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4322 | <code>                selectionProtocol.relevantStart = selectionProtocol.relevantStart &gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4323 | <code>                    ? Math.min(selectionProtocol.relevantStart, firstParentLine)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4324 | <code>                    : firstParentLine;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4325 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4326 | <code>            selectionProtocol.totalLines = Math.max(selectionProtocol.totalLines &#124;&#124; 0, totalLines);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4327 | <code>            selectionProtocol.ranges.push([lineStart, lineEnd]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4328 | <code>            selectionProtocol.ranges.sort((left, right) =&gt; left[0] - right[0]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4329 | <code>            const mergedRanges = [];</code> | 声明局部标识符 `mergedRanges`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4330 | <code>            for (const range of selectionProtocol.ranges) {</code> | 声明局部标识符 `range`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4331 | <code>                const previous = mergedRanges[mergedRanges.length - 1];</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4332 | <code>                if (!previous &#124;&#124; range[0] &gt; previous[1] + 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4333 | <code>                    mergedRanges.push([...range]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4334 | <code>                } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4335 | <code>                    previous[1] = Math.max(previous[1], range[1]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4336 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4337 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4338 | <code>            selectionProtocol.ranges = mergedRanges;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4339 | <code>            selectionProtocol.boundaryComplete = selectionProtocol.relevantStart &gt; 0 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4340 | <code>                mergedRanges.some((range) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4341 | <code>                    range[0] &lt;= selectionProtocol.relevantStart &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4342 | <code>                    range[1] &gt;= selectionProtocol.totalLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4343 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4344 | <code>            selectionProtocol.status = selectionProtocol.boundaryComplete</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4345 | <code>                ? 'parent_index_complete'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4346 | <code>                : 'parent_index_incomplete';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4347 | <code>            details.selectionProtocol = {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 4348 | <code>                status: selectionProtocol.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4349 | <code>                parent_kind: selectionProtocol.parentKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4350 | <code>                selector: selectionProtocol.selector,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4351 | <code>                quoted_term: selectionProtocol.quotedTerm,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4352 | <code>                boundary_complete: selectionProtocol.boundaryComplete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4353 | <code>                relevant_line_start: selectionProtocol.relevantStart &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4354 | <code>                total_lines: selectionProtocol.totalLines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4355 | <code>                covered_ranges: cloneJson(selectionProtocol.ranges),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4356 | <code>                exact_title_match_counts: cloneJson(selectionGroupCounts),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4357 | <code>                winning_group: selectionProtocol.boundaryComplete &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4358 | <code>                    selectionGroupCounts.length &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4359 | <code>                    (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4360 | <code>                        selectionGroupCounts.length === 1 &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4361 | <code>                        selectionGroupCounts[0].count &gt; selectionGroupCounts[1].count</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4362 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4363 | <code>                    ? selectionGroupCounts[0].group</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4364 | <code>                    : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4365 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4366 | <code>            details.selection_protocol = details.selectionProtocol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4367 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4368 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4369 | <code>            mode === 'open' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4370 | <code>            context.exactAnswerMode === true &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4371 | <code>            looksLikeNestedSelectorTask(sourceQuestion) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4372 | <code>            parentKind &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4373 | <code>            parentAnchorsInViewport.size &gt;= 2 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4374 | <code>            hasMoreAfter &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4375 | <code>            lineEnd &gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4376 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4377 | <code>            const nextCall = {</code> | 声明局部标识符 `nextCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4378 | <code>                tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4379 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4380 | <code>                    open: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4381 | <code>                        ref_id: viewRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4382 | <code>                        lineno: lineEnd + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4383 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4384 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4385 | <code>                reason: 'Continue the same parent index at the next unread line before selecting a child; the current viewport does not establish the candidate-set boundary.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4386 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4387 | <code>            const existingCalls = Array.isArray(details.suggestedNextCalls)</code> | 声明局部标识符 `existingCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4388 | <code>                ? details.suggestedNextCalls</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4389 | <code>                : Array.isArray(details.suggested_next_calls)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4390 | <code>                ? details.suggested_next_calls</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4391 | <code>                : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4392 | <code>            const suggestedNextCalls = [</code> | 声明局部标识符 `suggestedNextCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4393 | <code>                nextCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4394 | <code>                ...existingCalls.filter((call) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4395 | <code>                    JSON.stringify(call?.args &#124;&#124; {}) !== JSON.stringify(nextCall.args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4396 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4397 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4398 | <code>            details.suggestedNextCalls = suggestedNextCalls;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4399 | <code>            details.suggested_next_calls = suggestedNextCalls;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4400 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4401 | <code>        const navigationSuggestedCalls = Array.isArray(details.suggestedNextCalls)</code> | 声明局部标识符 `navigationSuggestedCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4402 | <code>            ? details.suggestedNextCalls</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4403 | <code>            : Array.isArray(details.suggested_next_calls)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4404 | <code>            ? details.suggested_next_calls</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4405 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4406 | <code>        const selectionCountText = selectionGroupCounts.length</code> | 声明局部标识符 `selectionCountText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4407 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4408 | <code>                  `Exact "${normalizeString(selectionProtocol?.quotedTerm)}" child-title counts observed in the parent index (${selectionProtocol?.boundaryComplete === true ? 'candidate boundary complete' : 'provisional; more lines remain'}):`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4409 | <code>                  ...selectionGroupCounts.map((group) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4410 | <code>                      `- ${group.group}: ${group.count}${group.matched_children.length ? ` (${group.matched_children.map((child) =&gt; child.id).join(', ')})` : ''}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4411 | <code>                  ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4412 | <code>                  ...(selectionProtocol?.boundaryComplete === true &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4413 | <code>                  selectionGroupCounts.length &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4414 | <code>                  (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4415 | <code>                      selectionGroupCounts.length === 1 &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4416 | <code>                      selectionGroupCounts[0].count &gt; selectionGroupCounts[1].count</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4417 | <code>                  )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4418 | <code>                      ? [`Unique winning group: ${selectionGroupCounts[0].group}.`]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4419 | <code>                      : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4420 | <code>              ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4421 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4422 | <code>        const navigationNextCallText = navigationSuggestedCalls[0]</code> | 声明局部标识符 `navigationNextCallText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4423 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4424 | <code>                  'Next recommended call (advisory; the model may choose another evidence action):',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4425 | <code>                  `${navigationSuggestedCalls[0].tool} ${JSON.stringify(navigationSuggestedCalls[0].args)}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4426 | <code>              ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4427 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4428 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4429 | <code>            content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4430 | <code>                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4431 | <code>                text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4432 | <code>                    selectionDependencyAdvisory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4433 | <code>                        ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4434 | <code>                              `Selection dependency audit (advisory): parent comparison at ${selectionDependencyAdvisory.required_parent_index_ref} is not complete.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4435 | <code>                              'The requested child page was opened anyway. Use its evidence as a hypothesis and finish the parent comparison before making a global selector claim.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4436 | <code>                          ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4437 | <code>                        : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4438 | <code>                    selectionCountText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4439 | <code>                    navigationNextCallText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4440 | <code>                    bridgeTextContent(cloned)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4441 | <code>                ].filter(Boolean).join('\n\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4442 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4443 | <code>            isError: cloned.isError === true &#124;&#124; cloned.details?.result?.isError === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4444 | <code>            details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4445 | <code>            structuredContent: details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4446 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4447 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4449 | <code>    async executeWebRunClick(operation = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4450 | <code>        const resolved = this.resolveWebRunRef(context, operation.ref_id);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4451 | <code>        const linkId = Number(operation.id);</code> | 声明局部标识符 `linkId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4452 | <code>        const link = Array.isArray(resolved?.links)</code> | 声明局部标识符 `link`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4453 | <code>            ? resolved.links.find((candidate) =&gt; Number(candidate.id) === linkId)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4454 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4455 | <code>        if (!link?.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4456 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4457 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4458 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4459 | <code>                    text: `Unknown link id ${normalizeString(operation.id)} for web reference ${normalizeString(operation.ref_id)}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4460 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4461 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4462 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4463 | <code>                    status: 'unknown_link_id',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4464 | <code>                    ref_id: normalizeString(operation.ref_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4465 | <code>                    id: linkId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4466 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4467 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4468 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4469 | <code>        const navigationMode = normalizeString(link.navigationMode &#124;&#124; link.navigation_mode).toLowerCase();</code> | 声明局部标识符 `navigationMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4470 | <code>        const sectionPattern = normalizeString(link.pattern &#124;&#124; link.text &#124;&#124; link.title);</code> | 声明局部标识符 `sectionPattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4471 | <code>        if (navigationMode === 'find' &amp;&amp; sectionPattern) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4472 | <code>            return await this.executeWebRunNavigation({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4473 | <code>                ref_id: operation.ref_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4474 | <code>                pattern: sectionPattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4475 | <code>            }, context, 'find');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4476 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4477 | <code>        const navigation = await this.executeWebRunNavigation({ ref_id: link.url }, context, 'open');</code> | 声明局部标识符 `navigation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4478 | <code>        if (normalizeString(link.kind).toLowerCase() !== 'pdf') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4479 | <code>            return navigation;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4480 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4481 | <code>        const navigationDetails = firstObject(navigation.structuredContent, navigation.details);</code> | 声明局部标识符 `navigationDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4482 | <code>        const contentType = normalizeString(</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4483 | <code>            navigationDetails.contentType &#124;&#124; navigationDetails.content_type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4484 | <code>        ).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4485 | <code>        if (contentType.includes('application/pdf')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4486 | <code>            return navigation;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4487 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4488 | <code>        const observedLinks = Array.isArray(navigationDetails.observedRelevantLinks)</code> | 声明局部标识符 `observedLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4489 | <code>            ? navigationDetails.observedRelevantLinks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4490 | <code>            : Array.isArray(navigationDetails.observed_relevant_links)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4491 | <code>            ? navigationDetails.observed_relevant_links</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4492 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4493 | <code>        const pdfCandidate = observedLinks.find((candidate) =&gt; (</code> | 声明局部标识符 `pdfCandidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4494 | <code>            normalizeString(candidate?.kind).toLowerCase() === 'pdf' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4495 | <code>            normalizeString(candidate?.url) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4496 | <code>            normalizeString(candidate.url) !== normalizeString(link.url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4497 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4498 | <code>        if (!pdfCandidate?.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4499 | <code>            return navigation;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4500 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4501 | <code>        const pdfResponse = await this.executeWebRunPdf(pdfCandidate.url, context, {</code> | 声明局部标识符 `pdfResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4502 | <code>            parentRefId: navigationDetails.ref_id &#124;&#124; operation.ref_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4503 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4504 | <code>        return pdfResponse.isError === true ? navigation : pdfResponse;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4505 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4507 | <code>    async executeWebRunScreenshot(operation = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4508 | <code>        const resolved = this.resolveWebRunRef(context, operation.ref_id);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4509 | <code>        if (!resolved?.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4510 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4511 | <code>                content: [{ type: 'text', text: `Unknown web reference id: ${normalizeString(operation.ref_id)}` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4512 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4513 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4514 | <code>                    status: 'unknown_ref_id',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4515 | <code>                    ref_id: normalizeString(operation.ref_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4516 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4517 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4518 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4519 | <code>        const workspaceDir = this.resolveWorkspace(</code> | 声明局部标识符 `workspaceDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4520 | <code>            context.workspaceDir &#124;&#124; context.workspace &#124;&#124; this.workspaceRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4521 | <code>            context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4522 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4523 | <code>        const screenshotDir = path.join(workspaceDir, '.ailis-web-screenshots');</code> | 声明局部标识符 `screenshotDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4524 | <code>        await fsp.mkdir(screenshotDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4525 | <code>        const screenshotPath = path.join(screenshotDir, `${randomUUID()}.png`);</code> | 声明局部标识符 `screenshotPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4526 | <code>        const sourceQuestion = normalizeString(</code> | 声明局部标识符 `sourceQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4527 | <code>            context.currentUserMessage &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4528 | <code>            context.currentTaskRequest &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4529 | <code>            context.current_task_request</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4530 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4531 | <code>        const response = await this.runtime.executeMcpBridge({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4532 | <code>            action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4533 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4534 | <code>            tool: 'webpage_screenshot',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4535 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4536 | <code>                url: resolved.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4537 | <code>                path: screenshotPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4538 | <code>                detail: normalizeString(operation.detail, 'original'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4539 | <code>                ...(operation.waitFor ? { waitFor: operation.waitFor } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4540 | <code>                ...(operation.delayMs !== undefined ? { delayMs: operation.delayMs } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4541 | <code>                ...(sourceQuestion ? { query: sourceQuestion } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4542 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4543 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4544 | <code>        const cloned = cloneJson(response) &#124;&#124; {};</code> | 声明局部标识符 `cloned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4545 | <code>        const details = bridgeStructuredContent(cloned);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4546 | <code>        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {</code> | 声明局部标识符 `viewRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4547 | <code>            parent_ref_id: normalizeString(operation.ref_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4548 | <code>            mode: 'screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4549 | <code>            screenshotPath: normalizeString(details.path &#124;&#124; screenshotPath)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4550 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4551 | <code>        details.ref_id = viewRef;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4552 | <code>        details.url = resolved.url;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4553 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4554 | <code>            content: [{ type: 'text', text: bridgeTextContent(cloned) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4555 | <code>            isError: cloned.isError === true &#124;&#124; cloned.details?.result?.isError === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4556 | <code>            details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4557 | <code>            structuredContent: details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4558 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4561 | <code>    async executeWebRunPdf(url = '', context = {}, { parentRefId = '' } = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4562 | <code>        const sourceQuestion = normalizeString(</code> | 声明局部标识符 `sourceQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4563 | <code>            context.currentUserMessage &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4564 | <code>            context.currentTaskRequest &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4565 | <code>            context.current_task_request</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4566 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4567 | <code>        const response = await this.runtime.executeMcpBridge({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4568 | <code>            action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4569 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4570 | <code>            tool: 'pdf_extract_text',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4571 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4572 | <code>                url: normalizeString(url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4573 | <code>                maxChars: 24000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4574 | <code>                maxPages: 24,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4575 | <code>                ...(sourceQuestion ? { query: sourceQuestion } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4576 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4577 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4578 | <code>        const cloned = cloneJson(response) &#124;&#124; {};</code> | 声明局部标识符 `cloned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4579 | <code>        const details = bridgeStructuredContent(cloned);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4580 | <code>        const text = bridgeTextContent(cloned);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4581 | <code>        const isError = cloned.isError === true &#124;&#124; cloned.details?.result?.isError === true &#124;&#124; !normalizeString(text);</code> | 声明局部标识符 `isError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4582 | <code>        if (isError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4583 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4584 | <code>                content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4585 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4586 | <code>                details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4587 | <code>                structuredContent: details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4588 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4589 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4590 | <code>        const extractedText = String(</code> | 声明局部标识符 `extractedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4591 | <code>            details.extractedText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4592 | <code>            details.extracted_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4593 | <code>            text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4594 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4595 | <code>        delete details.extractedText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4596 | <code>        delete details.extracted_text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4597 | <code>        const viewRef = this.registerWebRunRef(context, 'view', url, {</code> | 声明局部标识符 `viewRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4598 | <code>            parent_ref_id: normalizeString(parentRefId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4599 | <code>            mode: 'open',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4600 | <code>            extractedText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4601 | <code>            contentType: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4602 | <code>                details.contentType &#124;&#124; details.content_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4603 | <code>                'application/pdf'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4604 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4605 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4606 | <code>        const sourceLines = extractedText</code> | 声明局部标识符 `sourceLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4607 | <code>            .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4608 | <code>            .map((line, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4609 | <code>                lineNumber: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4610 | <code>                line_number: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4611 | <code>                lineno: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4612 | <code>                text: line,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4613 | <code>                rendered: `L${index + 1}: ${line}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4614 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4615 | <code>        const lineEnd = Math.max(1, sourceLines.length);</code> | 声明局部标识符 `lineEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4616 | <code>        const sourceWindow = {</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4617 | <code>            type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4618 | <code>            action: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4619 | <code>                type: 'open_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4620 | <code>                url: normalizeString(url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4621 | <code>                lineno: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4622 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4623 | <code>            url: normalizeString(url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4624 | <code>            ref_id: viewRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4625 | <code>            contentType: normalizeString(details.contentType &#124;&#124; details.content_type, 'application/pdf'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4626 | <code>            content_type: normalizeString(details.contentType &#124;&#124; details.content_type, 'application/pdf'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4627 | <code>            totalLines: lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4628 | <code>            total_lines: lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4629 | <code>            lineno: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4630 | <code>            lineStart: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4631 | <code>            line_start: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4632 | <code>            lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4633 | <code>            line_end: lineEnd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4634 | <code>            hasMoreBefore: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4635 | <code>            has_more_before: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4636 | <code>            hasMoreAfter: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4637 | <code>            has_more_after: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4638 | <code>            lines: sourceLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4639 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4640 | <code>        const structuredContent = {</code> | 声明局部标识符 `structuredContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4641 | <code>            ...details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4642 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4643 | <code>            url: normalizeString(url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4644 | <code>            ref_id: viewRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4645 | <code>            source: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4646 | <code>            source_window: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4647 | <code>            sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4648 | <code>            sourceViewport: sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4649 | <code>            source_viewport: sourceWindow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4650 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4651 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4652 | <code>            content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4653 | <code>            isError: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4654 | <code>            details: structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4655 | <code>            structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4656 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4657 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4659 | <code>    async executeWebRun(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4660 | <code>        if (Array.isArray(args.search_query) &amp;&amp; args.search_query.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4661 | <code>            return await this.executeWebRunSearch(args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4662 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4663 | <code>        if (Array.isArray(args.open) &amp;&amp; args.open.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4664 | <code>            return await this.executeWebRunNavigation(args.open[0], context, 'open');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4665 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4666 | <code>        if (Array.isArray(args.click) &amp;&amp; args.click.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4667 | <code>            return await this.executeWebRunClick(args.click[0], context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4668 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4669 | <code>        if (Array.isArray(args.find) &amp;&amp; args.find.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4670 | <code>            return await this.executeWebRunNavigation(args.find[0], context, 'find');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4671 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4672 | <code>        if (Array.isArray(args.screenshot) &amp;&amp; args.screenshot.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4673 | <code>            return await this.executeWebRunScreenshot(args.screenshot[0], context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4674 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4675 | <code>        if (Array.isArray(args.archive) &amp;&amp; args.archive.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4676 | <code>            return await this.runtime.executeMcpBridge({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4677 | <code>                action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4678 | <code>                server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4679 | <code>                tool: 'web_archive_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4680 | <code>                args: cloneJson(args.archive[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4681 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4682 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4683 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4684 | <code>            content: [{ type: 'text', text: 'This web_run backend currently executes search_query, open, click, find, screenshot, and archive commands.' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4685 | <code>            isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4686 | <code>            structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4687 | <code>                status: 'unsupported_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4688 | <code>                supported_commands: ['search_query', 'open', 'click', 'find', 'screenshot', 'archive']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4689 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4690 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4691 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4693 | <code>    async executeGatewayLocalTool(toolId, args, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4694 | <code>        const workspaceDir = context.workspaceDir &#124;&#124; this.resolveWorkspace(context.workspace, context);</code> | 声明局部标识符 `workspaceDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4695 | <code>        if (toolId === HANDOFF_TASK_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4696 | <code>            const taskResult = await this.taskAgentHarness.handoff(args, {</code> | 声明局部标识符 `taskResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4697 | <code>                ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4698 | <code>                workspace: context.workspace &#124;&#124; workspaceDir,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4699 | <code>                workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4700 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4701 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4702 | <code>                content: [{ type: 'text', text: JSON.stringify(taskResult, null, 2) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4703 | <code>                isError: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4704 | <code>                details: taskResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4705 | <code>                structuredContent: taskResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4706 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4707 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4708 | <code>        if (toolId === WEB_RUN_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4709 | <code>            return await this.executeWebRun(args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4710 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4711 | <code>        if (toolId === WEB_SEARCH_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4712 | <code>            return await this.runtime.executeMcpBridge({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4713 | <code>                action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4714 | <code>                server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4715 | <code>                tool: 'web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4716 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4717 | <code>                    query: args.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4718 | <code>                    ...(args.maxResults !== undefined ? { maxResults: args.maxResults } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4719 | <code>                    ...(args.search_context_size ? { search_context_size: args.search_context_size } : {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4720 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4721 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4722 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4723 | <code>        if (toolId === TASK_RESULTS_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4724 | <code>            const action = normalizeString(args.action, 'search').toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4725 | <code>            const limit = Math.max(1, Math.min(Number(args.limit) &#124;&#124; 3, 8));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4726 | <code>            const sessionId = normalizeString(args.sessionId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey);</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4727 | <code>            if (action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4728 | <code>                const capsule = this.taskResultCapsules?.get?.(args.id) &#124;&#124; null;</code> | 声明局部标识符 `capsule`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4729 | <code>                const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4730 | <code>                    status: capsule ? 'completed' : 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4731 | <code>                    result: capsule</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4732 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4733 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4734 | <code>                    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4735 | <code>                    isError: !capsule,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4736 | <code>                    details: payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4737 | <code>                    structuredContent: payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4738 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4739 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4740 | <code>            const results = this.taskResultCapsules?.search?.(args.query, { sessionId, limit }) &#124;&#124; [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4741 | <code>            const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4742 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4743 | <code>                query: normalizeString(args.query),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4744 | <code>                results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4745 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4746 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4747 | <code>                content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4748 | <code>                isError: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4749 | <code>                details: payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4750 | <code>                structuredContent: payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4751 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4752 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4753 | <code>        if (toolId === EMAIL_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4754 | <code>            const { executeEmailTool } = loadEmailToolModule();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4755 | <code>            return await executeEmailTool(args, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4756 | <code>                ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4757 | <code>                emailProfiles: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4758 | <code>                    ...(this.getEmailProfiles() &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4759 | <code>                    ...(context.emailProfiles &#124;&#124; context.emailAccounts &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4760 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4761 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4762 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4763 | <code>        if (toolId === FILE_MANAGER_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4764 | <code>            return await executeFileManagerTool(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4765 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4766 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4767 | <code>                projectRoot: this.projectRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4768 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4769 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4770 | <code>        if (toolId === COMPUTER_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4771 | <code>            const action = normalizeString(args.action &#124;&#124; args.operation &#124;&#124; args.intent).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4772 | <code>            if (['exec_command', 'exec', 'run'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4773 | <code>                const interceptedPatch = this.extractPatchFromCommand(args.cmd &#124;&#124; args.command);</code> | 声明局部标识符 `interceptedPatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4774 | <code>                if (interceptedPatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4775 | <code>                    return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4776 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4777 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4778 | <code>            return await this.computerTool.execute(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4779 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4780 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4781 | <code>                projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4782 | <code>                platformAdapter: this.platformAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4783 | <code>                outputStore: this.runtime.outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4784 | <code>                contextArtifactStore: this.runtime.contextArtifactStore,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4785 | <code>                auditDir: this.auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4786 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4787 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4788 | <code>        if (toolId === CODE_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4789 | <code>            return await executeCodeTool(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4790 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4791 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4792 | <code>                projectRoot: this.projectRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4793 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4794 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4795 | <code>        if (toolId === ARTIFACT_VERIFIER_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4796 | <code>            return await executeArtifactVerifierTool(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4797 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4798 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4799 | <code>                projectRoot: this.projectRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4800 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4801 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4802 | <code>        if (toolId === ARTIFACT_IMPORT_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4803 | <code>            return await executeArtifactImportTool(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4804 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4805 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4806 | <code>                projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4807 | <code>                contextArtifactStore: this.runtime.contextArtifactStore</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4808 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4809 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4810 | <code>        if (toolId === GITHUB_PAGES_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4811 | <code>            return await executeGitHubPagesTool(args, context, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4812 | <code>                workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4813 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4814 | <code>                projectRoot: this.projectRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4815 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4816 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4817 | <code>        if (toolId === VISION_TOOL_ID) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4818 | <code>            return await executeVisionTool(args, context, this.visionServices);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4819 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4820 | <code>        if (LOCAL_CORE_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4821 | <code>            return await this.executeLocalCoreTool({ toolId, args, context, workspaceDir });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4822 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4823 | <code>        return this.notAvailableResult(toolId, 'not-materialized');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4824 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4826 | <code>    notAvailableResult(toolId, reason) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4827 | <code>        const statusByReason = {</code> | 声明局部标识符 `statusByReason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4828 | <code>            'provider-plugin-or-trigger': 'not_materialized',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4829 | <code>            'external-side-effect': 'skipped_external',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4830 | <code>            'needs-session': 'needs_session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4831 | <code>            'not-materialized': 'not_materialized'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4832 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4833 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4834 | <code>            content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4835 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4836 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4837 | <code>                    text: JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4838 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4839 | <code>                            tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4840 | <code>                            status: statusByReason[reason] &#124;&#124; 'unavailable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4841 | <code>                            reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4842 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4843 | <code>                        null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4844 | <code>                        2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4845 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4846 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4847 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4848 | <code>            isError: reason !== 'external-side-effect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4849 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4850 | <code>                tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4851 | <code>                status: statusByReason[reason] &#124;&#124; 'unavailable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4852 | <code>                reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4853 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4854 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4855 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4857 | <code>    extractPatchFromCommand(command = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4858 | <code>        const text = normalizeString(command);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4859 | <code>        const start = text.indexOf('*** Begin Patch');</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4860 | <code>        const end = text.indexOf('*** End Patch');</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4861 | <code>        if (start &lt; 0 &#124;&#124; end &lt; start) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4862 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4863 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4864 | <code>        return text.slice(start, end + '*** End Patch'.length).trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4865 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4867 | <code>    parseLocalPatch(input = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4868 | <code>        const patch = normalizeString(input);</code> | 声明局部标识符 `patch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4869 | <code>        if (!patch.startsWith('*** Begin Patch') &#124;&#124; !patch.includes('*** End Patch')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4870 | <code>            throwBlocked('apply_patch input must start with *** Begin Patch and end with *** End Patch');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4871 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4872 | <code>        const lines = patch.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4873 | <code>        const operations = [];</code> | 声明局部标识符 `operations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4874 | <code>        let index = 1;</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4875 | <code>        const readBody = () =&gt; {</code> | 声明局部标识符 `readBody`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4876 | <code>            const body = [];</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4877 | <code>            while (index &lt; lines.length &amp;&amp; !/^\*\*\* (?:Add File&#124;Update File&#124;Delete File&#124;End Patch)/.test(lines[index])) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 4878 | <code>                body.push(lines[index]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4879 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4880 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4881 | <code>            return body;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4882 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4883 | <code>        while (index &lt; lines.length) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 4884 | <code>            const line = lines[index];</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4885 | <code>            if (/^\*\*\* End Patch\s*$/.test(line)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4886 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4887 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4888 | <code>            let match = line.match(/^\*\*\* Add File:\s+(.+)$/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4889 | <code>            if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4890 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4891 | <code>                operations.push({ type: 'add', path: match[1].trim(), body: readBody() });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4892 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4893 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4894 | <code>            match = line.match(/^\*\*\* Update File:\s+(.+)$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4895 | <code>            if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4896 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4897 | <code>                operations.push({ type: 'update', path: match[1].trim(), body: readBody() });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4898 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4899 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4900 | <code>            match = line.match(/^\*\*\* Delete File:\s+(.+)$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4901 | <code>            if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4902 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4903 | <code>                operations.push({ type: 'delete', path: match[1].trim(), body: [] });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4904 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4905 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4906 | <code>            if (normalizeString(line)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4907 | <code>                throwBlocked(`unsupported apply_patch line: ${line}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4908 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4909 | <code>            index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4910 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4911 | <code>        if (!operations.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4912 | <code>            throwBlocked('apply_patch contains no file operations');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4913 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4914 | <code>        return operations;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4915 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4917 | <code>    patchBodyToText(body = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4918 | <code>        const content = [];</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4919 | <code>        for (const line of body) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4920 | <code>            if (line.startsWith('+')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4921 | <code>                content.push(line.slice(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4922 | <code>            } else if (line.startsWith('***')) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4923 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4924 | <code>            } else if (normalizeString(line)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4925 | <code>                throwBlocked(`add file patch lines must start with +: ${line}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4926 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4927 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4928 | <code>        return content.length ? `${content.join('\n')}\n` : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4931 | <code>    applyUpdatePatchText(source = '', body = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4932 | <code>        let text = source.replace(/\r\n/g, '\n');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4933 | <code>        let oldLines = [];</code> | 声明局部标识符 `oldLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4934 | <code>        let newLines = [];</code> | 声明局部标识符 `newLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4935 | <code>        const flush = () =&gt; {</code> | 声明局部标识符 `flush`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4936 | <code>            if (!oldLines.length &amp;&amp; !newLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4937 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4938 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4939 | <code>            const oldBlock = oldLines.length ? `${oldLines.join('\n')}\n` : '';</code> | 声明局部标识符 `oldBlock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4940 | <code>            const newBlock = newLines.length ? `${newLines.join('\n')}\n` : '';</code> | 声明局部标识符 `newBlock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4941 | <code>            const variants = oldBlock.endsWith('\n') ? [oldBlock, oldBlock.slice(0, -1)] : [oldBlock];</code> | 声明局部标识符 `variants`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4942 | <code>            const found = variants.find((variant) =&gt; variant &amp;&amp; text.includes(variant));</code> | 声明局部标识符 `found`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4943 | <code>            if (!found) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4944 | <code>                throwBlocked('apply_patch update hunk did not match target file');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4945 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4946 | <code>            text = text.replace(found, found.endsWith('\n') ? newBlock : newBlock.replace(/\n$/, ''));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4947 | <code>            oldLines = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4948 | <code>            newLines = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4949 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4950 | <code>        for (const line of body) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4951 | <code>            if (line.startsWith('@@')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4952 | <code>                flush();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4953 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4954 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4955 | <code>            if (line.startsWith(' ')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4956 | <code>                oldLines.push(line.slice(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4957 | <code>                newLines.push(line.slice(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4958 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4959 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4960 | <code>            if (line.startsWith('-')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4961 | <code>                oldLines.push(line.slice(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4962 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4963 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4964 | <code>            if (line.startsWith('+')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4965 | <code>                newLines.push(line.slice(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4966 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4967 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4968 | <code>            if (/^\\ No newline/.test(line) &#124;&#124; !normalizeString(line)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4969 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4970 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4971 | <code>            throwBlocked(`unsupported update patch line: ${line}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4972 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4973 | <code>        flush();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4974 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4975 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4977 | <code>    async executeLocalApplyPatch(input, workspaceDir, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4978 | <code>        this.assertPatchInsideWorkspace(input, workspaceDir, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4979 | <code>        const operations = this.parseLocalPatch(input);</code> | 声明局部标识符 `operations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4980 | <code>        const changedFiles = [];</code> | 声明局部标识符 `changedFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4981 | <code>        for (const operation of operations) {</code> | 声明局部标识符 `operation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4982 | <code>            const target = this.resolveToolPath(operation.path, workspaceDir, 'patchPath', context);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4983 | <code>            if (operation.type === 'add') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4984 | <code>                const content = this.patchBodyToText(operation.body);</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4985 | <code>                await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4986 | <code>                await fsp.writeFile(target, content, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4987 | <code>                changedFiles.push({ action: 'add', path: target, bytes: Buffer.byteLength(content, 'utf8') });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4988 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4989 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4990 | <code>            if (operation.type === 'delete') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4991 | <code>                await fsp.rm(target, { force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4992 | <code>                changedFiles.push({ action: 'delete', path: target });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4993 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4994 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4995 | <code>            const source = await fsp.readFile(target, 'utf8').catch((error) =&gt; {</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4996 | <code>                throwBlocked(`apply_patch update target not found: ${operation.path}`, { error: error?.message &#124;&#124; String(error) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4997 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4998 | <code>            const next = this.applyUpdatePatchText(source, operation.body);</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4999 | <code>            await fsp.writeFile(target, next, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5000 | <code>            changedFiles.push({ action: 'update', path: target, bytes: Buffer.byteLength(next, 'utf8') });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5001 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5002 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5003 | <code>            content: [{ type: 'text', text: `apply_patch completed: ${changedFiles.length} file(s)` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5004 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5005 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5006 | <code>                action: 'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5007 | <code>                changedFiles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5008 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5009 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5010 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5012 | <code>    async executeLocalCoreTool({ toolId, args, context, workspaceDir }) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5013 | <code>        if (toolId === 'read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5014 | <code>            const target = this.resolveToolPath(args.path, workspaceDir, 'path', context);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5015 | <code>            const artifactRecord = await this.runtime.contextArtifactStore?.findByPath?.(target).catch(() =&gt; null);</code> | 声明局部标识符 `artifactRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5016 | <code>            if (artifactRecord?.payloadPath &amp;&amp; path.resolve(artifactRecord.payloadPath) === path.resolve(target)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5017 | <code>                return this.runtime.contextArtifactStore.guardReadResult(artifactRecord, target);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5018 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5019 | <code>            let stat = null;</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5020 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5021 | <code>                stat = await fsp.stat(target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5022 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5023 | <code>            if (!stat &#124;&#124; !stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5024 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5025 | <code>                    content: [{ type: 'text', text: `file not found: ${target}` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5026 | <code>                    isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5027 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5028 | <code>                        status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5029 | <code>                        path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5030 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5031 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5032 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5033 | <code>            const maxBytes = Math.min(Math.max(Number(args.maxBytes &#124;&#124; 128 * 1024), 1), 5 * 1024 * 1024);</code> | 声明局部标识符 `maxBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5034 | <code>            const handle = await fsp.open(target, 'r');</code> | 声明局部标识符 `handle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5035 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5036 | <code>                const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5037 | <code>                const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5038 | <code>                const text = buffer.subarray(0, bytesRead).toString(args.encoding &#124;&#124; 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5039 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5040 | <code>                    content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5041 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5042 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5043 | <code>                        action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5044 | <code>                        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5045 | <code>                        bytesRead,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5046 | <code>                        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5047 | <code>                        truncated: stat.size &gt; maxBytes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5048 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5049 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5050 | <code>            } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5051 | <code>                await handle.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5052 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5053 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5055 | <code>        if (toolId === 'write') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5056 | <code>            const target = this.resolveToolPath(args.path, workspaceDir, 'path', context);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5057 | <code>            const content = typeof args.content === 'string' ? args.content : '';</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5058 | <code>            await fsp.mkdir(path.dirname(target), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5059 | <code>            await fsp.writeFile(target, content, args.encoding &#124;&#124; 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5060 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5061 | <code>                content: [{ type: 'text', text: `write completed: ${target}` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5062 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5063 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5064 | <code>                    action: 'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5065 | <code>                    path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5066 | <code>                    bytes: Buffer.byteLength(content, args.encoding &#124;&#124; 'utf8')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5067 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5068 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5069 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5070 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5071 | <code>        if (toolId === 'apply_patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5072 | <code>            return await this.executeLocalApplyPatch(args.input &#124;&#124; args.patch, workspaceDir, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5073 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5075 | <code>        if (toolId === 'exec') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5076 | <code>            const interceptedPatch = this.extractPatchFromCommand(args.command &#124;&#124; args.cmd);</code> | 声明局部标识符 `interceptedPatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5077 | <code>            if (interceptedPatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5078 | <code>                return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5079 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5080 | <code>            const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });</code> | 声明局部标识符 `finalArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5081 | <code>            return await this.computerTool.execute(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5082 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5083 | <code>                    action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5084 | <code>                    command: finalArgs.command &#124;&#124; finalArgs.cmd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5085 | <code>                    args: finalArgs.args &#124;&#124; finalArgs.arguments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5086 | <code>                    workdir: finalArgs.workdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5087 | <code>                    timeoutMs: finalArgs.timeoutMs &#124;&#124; finalArgs.timeout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5088 | <code>                    maxOutputBytes: finalArgs.maxOutputBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5089 | <code>                    env: finalArgs.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5090 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5091 | <code>                context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5092 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5093 | <code>                    workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5094 | <code>                    workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5095 | <code>                    projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5096 | <code>                    platformAdapter: this.platformAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5097 | <code>                    outputStore: this.runtime.outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5098 | <code>                    auditDir: this.auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5099 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5100 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5101 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5103 | <code>        return this.notAvailableResult(toolId, 'not-materialized');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5104 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5106 | <code>    prepareToolArgs({ toolId, args, context, workspaceDir }) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5107 | <code>        const finalArgs = { ...args };</code> | 声明局部标识符 `finalArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5108 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5109 | <code>            /(?:^&#124;__)pdf_extract_text$/i.test(toolId) &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5110 | <code>            !normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5111 | <code>                finalArgs.query &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5112 | <code>                finalArgs.q &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5113 | <code>                finalArgs.extractQuery &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5114 | <code>                finalArgs.extract_query</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5115 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5116 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5117 | <code>            const sourceQuestion = normalizeString(</code> | 声明局部标识符 `sourceQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5118 | <code>                context.currentUserMessage &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5119 | <code>                context.currentTaskRequest &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5120 | <code>                context.current_task_request</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5121 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5122 | <code>            if (sourceQuestion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5123 | <code>                finalArgs.query = sourceQuestion;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5124 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5125 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5126 | <code>        if (FILE_TOOL_IDS.has(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5127 | <code>            this.assertToolPathInsideWorkspace(finalArgs.path, workspaceDir, 'path', context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5128 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5129 | <code>        if (toolId === 'apply_patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5130 | <code>            this.assertPatchInsideWorkspace(finalArgs.input, workspaceDir, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5131 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5132 | <code>        if (toolId === 'exec') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5133 | <code>            if (context.approved !== true &amp;&amp; finalArgs.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5134 | <code>                throwApprovalRequired('exec requires context.approved=true in AILIS Gateway v0', {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5135 | <code>                    tool: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5136 | <code>                    approval: 'required'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5137 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5138 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5139 | <code>            const commandArgs = Array.isArray(finalArgs.args)</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5140 | <code>                ? finalArgs.args</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5141 | <code>                : Array.isArray(finalArgs.arguments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5142 | <code>                ? finalArgs.arguments</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5143 | <code>                : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5144 | <code>            const wrapperExecutable = normalizeString(commandArgs[0]).toLowerCase();</code> | 声明局部标识符 `wrapperExecutable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5145 | <code>            const wrapsExistingCommand = this.platformAdapter?.isWindows?.() === true</code> | 声明局部标识符 `wrapsExistingCommand`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5146 | <code>                &amp;&amp; /^(?:powershell&#124;powershell\.exe&#124;pwsh&#124;pwsh\.exe)$/.test(wrapperExecutable)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5147 | <code>                &amp;&amp; commandArgs.some((entry) =&gt; /^-(?:command&#124;c)$/i.test(normalizeString(entry)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5148 | <code>                &amp;&amp; normalizeString(finalArgs.command &#124;&#124; finalArgs.cmd);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5149 | <code>            if (wrapsExistingCommand) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5150 | <code>                finalArgs.args = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5151 | <code>                delete finalArgs.arguments;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5152 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5153 | <code>            if (finalArgs.timeoutMs === undefined &amp;&amp; finalArgs.timeout !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5154 | <code>                const timeout = Number(finalArgs.timeout);</code> | 声明局部标识符 `timeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5155 | <code>                if (Number.isFinite(timeout) &amp;&amp; timeout &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5156 | <code>                    finalArgs.timeoutMs = timeout &lt; 1000 ? timeout * 1000 : timeout;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5157 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5158 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5159 | <code>            finalArgs.workdir = this.resolveToolPath(finalArgs.workdir &#124;&#124; workspaceDir, workspaceDir, 'workdir', context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5160 | <code>            finalArgs.host = finalArgs.host &#124;&#124; 'gateway';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5161 | <code>            finalArgs.security = finalArgs.security &#124;&#124; 'full';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5162 | <code>            finalArgs.ask = finalArgs.ask &#124;&#124; 'off';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5163 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5164 | <code>        if (toolId === 'message' &amp;&amp; context.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5165 | <code>            finalArgs.dryRun = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5167 | <code>        return finalArgs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5170 | <code>    getProtectedPathRoot(targetPath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5171 | <code>        const target = path.resolve(targetPath);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5172 | <code>        return this.platformAdapter.protectedRoots().find((root) =&gt; this.platformAdapter.isPathInside(root, target)) &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5175 | <code>    assertFullControlPathAllowed(targetPath, context = {}, fieldName = 'path') {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5176 | <code>        if (!isFullControlContext(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5177 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5178 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5179 | <code>        const protectedRoot = this.getProtectedPathRoot(targetPath);</code> | 声明局部标识符 `protectedRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5180 | <code>        if (protectedRoot) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5181 | <code>            throwBlocked(`${fieldName} targets protected C drive system files`, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5182 | <code>                fieldName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5183 | <code>                target: path.resolve(targetPath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5184 | <code>                protectedRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5185 | <code>                permissionProfile: context.permissionProfile &#124;&#124; context.policy &#124;&#124; context.sandbox &#124;&#124; 'full-control'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5186 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5187 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5188 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5190 | <code>    resolveWorkspace(rawWorkspace, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5191 | <code>        const workspace = normalizeString(rawWorkspace)</code> | 声明局部标识符 `workspace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5192 | <code>            ? path.resolve(rawWorkspace)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5193 | <code>            : this.workspaceRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5194 | <code>        if (isFullControlContext(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5195 | <code>            this.assertFullControlPathAllowed(workspace, context, 'workspace');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5196 | <code>            return workspace;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5198 | <code>        if (!isPathInside(this.workspaceRoot, workspace)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5199 | <code>            throwBlocked('workspace must stay inside the configured AILIS workspace root', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5200 | <code>                workspace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5201 | <code>                workspaceRoot: this.workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5202 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5203 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5204 | <code>        return workspace;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5207 | <code>    resolveToolPath(rawPath, workspaceDir, fieldName, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5208 | <code>        const value = normalizeString(rawPath);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5209 | <code>        if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5210 | <code>            throwBlocked(`${fieldName} is required`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5211 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5212 | <code>        const target = path.isAbsolute(value) ? path.resolve(value) : path.resolve(workspaceDir, value);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5213 | <code>        if (isFullControlContext(context)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5214 | <code>            this.assertFullControlPathAllowed(target, context, fieldName);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5215 | <code>            return target;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5216 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5217 | <code>        if (!isPathInside(workspaceDir, target)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5218 | <code>            throwBlocked(`${fieldName} must stay inside workspace`, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5219 | <code>                fieldName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5220 | <code>                target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5221 | <code>                workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5222 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5224 | <code>        return target;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5227 | <code>    assertToolPathInsideWorkspace(rawPath, workspaceDir, fieldName, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5228 | <code>        this.resolveToolPath(rawPath, workspaceDir, fieldName, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5229 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5231 | <code>    assertPatchInsideWorkspace(rawPatch, workspaceDir, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5232 | <code>        const patch = normalizeString(rawPatch);</code> | 声明局部标识符 `patch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5233 | <code>        if (!patch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5234 | <code>            throwBlocked('apply_patch input is required');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5235 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5236 | <code>        const pattern = /^\*\*\* (?:Add File&#124;Update File&#124;Delete File):\s+(.+)$/gm;</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5237 | <code>        let match = pattern.exec(patch);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5238 | <code>        while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 5239 | <code>            const patchPath = match[1].trim();</code> | 声明局部标识符 `patchPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5240 | <code>            if (path.isAbsolute(patchPath) &#124;&#124; patchPath.split(/[\\/]+/).includes('..')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5241 | <code>                throwBlocked('apply_patch paths must be relative workspace paths', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5242 | <code>                    patchPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5243 | <code>                    workspaceDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5244 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5245 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5246 | <code>            this.resolveToolPath(patchPath, workspaceDir, 'patchPath', context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5247 | <code>            match = pattern.exec(patch);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5248 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5251 | <code>    async loadToolRuntimeModule() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5252 | <code>        if (!this.toolRuntimeModulePromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5253 | <code>            const harnessPath = path.join(</code> | 声明局部标识符 `harnessPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5254 | <code>                this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5255 | <code>                'build-cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5256 | <code>                'openclaw-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5257 | <code>                'dist',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5258 | <code>                'plugin-sdk',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5259 | <code>                'agent-harness.js'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5260 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5261 | <code>            this.toolRuntimeModulePromise = import(pathToFileURL(harnessPath).href);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5262 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5263 | <code>        return await this.toolRuntimeModulePromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5264 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5266 | <code>    async getToolSet(context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5267 | <code>        const workspaceDir = this.resolveWorkspace(context.workspace, context);</code> | 声明局部标识符 `workspaceDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5268 | <code>        const sessionKey = normalizeString(context.sessionKey, 'main');</code> | 声明局部标识符 `sessionKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5269 | <code>        const cacheKey = `${workspaceDir}&#124;${sessionKey}`;</code> | 声明局部标识符 `cacheKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5270 | <code>        if (this.toolSets.has(cacheKey)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5271 | <code>            return this.toolSets.get(cacheKey);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5273 | <code>        const { createOpenClawCodingTools } = await this.loadToolRuntimeModule();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5274 | <code>        const tools = createOpenClawCodingTools({</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5275 | <code>            workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5276 | <code>            agentDir: workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5277 | <code>            senderIsOwner: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5278 | <code>            modelHasVision: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5279 | <code>            modelProvider: 'openai',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5280 | <code>            modelId: 'gpt-5.4',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5281 | <code>            sessionKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5282 | <code>            runSessionKey: sessionKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5283 | <code>            onYield: async () =&gt; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5284 | <code>            config: buildGatewayConfig()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5285 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5286 | <code>        const toolMap = new Map(tools.map((tool) =&gt; [tool.name, tool]));</code> | 声明局部标识符 `toolMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5287 | <code>        this.toolSets.set(cacheKey, toolMap);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5288 | <code>        return toolMap;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5289 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5291 | <code>    async ensureToolGatewayReady() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5292 | <code>        if (!this.toolRuntimeSupervisor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5293 | <code>            this.toolRuntimeSupervisor = new AILISAgentRuntimeSupervisor({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5294 | <code>                app: this.app,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5295 | <code>                gatewayUrl: this.toolGatewayUrl</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5296 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5297 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5298 | <code>        return await this.toolRuntimeSupervisor.ensureReady();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5299 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5301 | <code>    async withDefaultAgentRuntimeGatewayEnv(action) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5302 | <code>        const priorAgentRuntimeGatewayUrl = process.env.OPENCLAW_GATEWAY_URL;</code> | 声明局部标识符 `priorAgentRuntimeGatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5303 | <code>        const priorAilisAgentRuntimeGatewayUrl = process.env.AILIS_OPENCLAW_GATEWAY_URL;</code> | 声明局部标识符 `priorAilisAgentRuntimeGatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5304 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5305 | <code>            delete process.env.OPENCLAW_GATEWAY_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5306 | <code>            delete process.env.AILIS_OPENCLAW_GATEWAY_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5307 | <code>            return await action();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5308 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5309 | <code>            if (priorAgentRuntimeGatewayUrl === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5310 | <code>                delete process.env.OPENCLAW_GATEWAY_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5311 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5312 | <code>                process.env.OPENCLAW_GATEWAY_URL = priorAgentRuntimeGatewayUrl;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5313 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5314 | <code>            if (priorAilisAgentRuntimeGatewayUrl === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5315 | <code>                delete process.env.AILIS_OPENCLAW_GATEWAY_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5316 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5317 | <code>                process.env.AILIS_OPENCLAW_GATEWAY_URL = priorAilisAgentRuntimeGatewayUrl;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5318 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5319 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5320 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5322 | <code>    async appendAudit(entry) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5323 | <code>        await fsp.mkdir(this.auditDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5324 | <code>        const safeEntry = redactObject(entry);</code> | 声明局部标识符 `safeEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5325 | <code>        const line = JSON.stringify({</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5326 | <code>            ts: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5327 | <code>            iso: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5328 | <code>            ...safeEntry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5329 | <code>            argsPreview: summarize(safeEntry.args),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5330 | <code>            contextPreview: summarize(safeEntry.context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5331 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5332 | <code>        await fsp.appendFile(this.auditLogPath, `${line}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5335 | <code>    async readAuditEntries(limit = 100) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5336 | <code>        const boundedLimit = Math.min(Math.max(Number(limit) &#124;&#124; 100, 1), 1000);</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5337 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5338 | <code>            const text = await fsp.readFile(this.auditLogPath, 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5339 | <code>            return text</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5340 | <code>                .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5341 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5342 | <code>                .slice(-boundedLimit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5343 | <code>                .map((line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5344 | <code>                    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5345 | <code>                        return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5346 | <code>                    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5347 | <code>                        return { raw: line };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5348 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5349 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5350 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5351 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5355 | <code>    async listAgentAnalysisRuns(limit = 40) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5356 | <code>        const boundedLimit = Math.min(Math.max(Number(limit) &#124;&#124; 40, 1), 200);</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5357 | <code>        const entries = await this.readAuditEntries(1000);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5358 | <code>        const runs = new Map();</code> | 声明局部标识符 `runs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5359 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5360 | <code>            const runId = normalizeString(entry.runId &#124;&#124; entry.result?.runId &#124;&#124; entry.args?.runId);</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5361 | <code>            if (!runId &#124;&#124; (entry.type &amp;&amp; entry.type !== 'agent.run')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5362 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5363 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5364 | <code>            const ts = analysisTimestamp(entry);</code> | 声明局部标识符 `ts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5365 | <code>            const prior = runs.get(runId);</code> | 声明局部标识符 `prior`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5366 | <code>            if (prior &amp;&amp; prior.ts &gt; ts) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5367 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5368 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5369 | <code>            runs.set(runId, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5370 | <code>                runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5371 | <code>                sessionId: normalizeString(entry.args?.sessionId &#124;&#124; entry.context?.sessionId &#124;&#124; entry.sessionId, 'main'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5372 | <code>                ts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5373 | <code>                iso: analysisIso(entry),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5374 | <code>                status: normalizeString(entry.status, 'unknown'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5375 | <code>                ok: entry.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5376 | <code>                durationMs: Number.isFinite(Number(entry.durationMs)) ? Number(entry.durationMs) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5377 | <code>                mode: normalizeString(entry.mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5378 | <code>                intent: normalizeString(entry.intent),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5379 | <code>                planner: normalizeString(entry.planner),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5380 | <code>                message: normalizeString(entry.args?.message &#124;&#124; entry.message),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5381 | <code>                resultPreview: summarizeForAnalysis(entry.resultPreview &#124;&#124; entry.displayText &#124;&#124; entry.error &#124;&#124; '', 360)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5382 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5383 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5385 | <code>        const activeRuns = this.ensureAgentRunner()?.activeRuns;</code> | 声明局部标识符 `activeRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5386 | <code>        if (activeRuns?.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5387 | <code>            for (const run of activeRuns.values()) {</code> | 声明局部标识符 `run`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5388 | <code>                if (!run?.runId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5389 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5390 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5391 | <code>                runs.set(run.runId, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5392 | <code>                    runId: run.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5393 | <code>                    sessionId: normalizeString(run.sessionId, 'main'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5394 | <code>                    ts: Number(run.startedAt) &#124;&#124; Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5395 | <code>                    iso: new Date(Number(run.startedAt) &#124;&#124; Date.now()).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5396 | <code>                    status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5397 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5398 | <code>                    durationMs: Date.now() - (Number(run.startedAt) &#124;&#124; Date.now()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5399 | <code>                    mode: normalizeString(run.mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5400 | <code>                    intent: normalizeString(run.intent),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5401 | <code>                    planner: normalizeString(run.planner),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5402 | <code>                    message: normalizeString(run.message),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5403 | <code>                    resultPreview: 'running'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5404 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5405 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5406 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5408 | <code>        const sortedRuns = [...runs.values()]</code> | 声明局部标识符 `sortedRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5409 | <code>            .sort((a, b) =&gt; (b.ts &#124;&#124; 0) - (a.ts &#124;&#124; 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5410 | <code>            .slice(0, boundedLimit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5411 | <code>        await Promise.all(sortedRuns.map(async (run) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5412 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 5413 | <code>                const transcript = await this.runtime.readTranscript(run.runId, 500);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5414 | <code>                const transcriptItems = transcript.items &#124;&#124; [];</code> | 声明局部标识符 `transcriptItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5415 | <code>                const finalItem = [...transcriptItems].reverse().find((item) =&gt;</code> | 声明局部标识符 `finalItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5416 | <code>                    ['turn.completed', 'agent.final', 'agent.blocked', 'approval.requested'].includes(item.type)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5417 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5418 | <code>                const latestDebugPause = [...transcriptItems].reverse().find((item) =&gt; item.type === 'agent.debug.paused') &#124;&#124; null;</code> | 声明局部标识符 `latestDebugPause`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5419 | <code>                const latestDebugPauseActive = latestDebugPause &amp;&amp;</code> | 声明局部标识符 `latestDebugPauseActive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5420 | <code>                    (!finalItem &#124;&#124; analysisTimestamp(latestDebugPause) &gt;= analysisTimestamp(finalItem));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5421 | <code>                if (!latestDebugPauseActive) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5422 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5423 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5424 | <code>                run.status = 'debug_paused';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5425 | <code>                run.debugPaused = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5426 | <code>                run.debugSessionId = normalizeString(latestDebugPause.payload?.debugSessionId);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 5427 | <code>                run.pausedAtIteration = Number.isFinite(Number(latestDebugPause.payload?.iteration))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5428 | <code>                    ? Number(latestDebugPause.payload.iteration)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5429 | <code>                    : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5430 | <code>                run.nextIteration = Number.isFinite(Number(latestDebugPause.payload?.nextIteration))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5431 | <code>                    ? Number(latestDebugPause.payload.nextIteration)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5432 | <code>                    : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5433 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5434 | <code>                // The list should stay usable even if an old transcript was rotated or is malformed.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5435 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5436 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5438 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5439 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5440 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5441 | <code>            runs: sortedRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5442 | <code>            auditLogPath: this.auditLogPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5443 | <code>            transcriptDir: this.runtime?.transcriptDir &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5444 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5445 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5447 | <code>    buildRunTimeline({ transcriptItems = [], events = [], auditEntries = [] } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5448 | <code>        const timeline = [];</code> | 声明局部标识符 `timeline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5449 | <code>        for (const item of transcriptItems) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5450 | <code>            const payload = item.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5451 | <code>            timeline.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5452 | <code>                source: 'transcript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5453 | <code>                id: item.id &#124;&#124; `${item.runId}:${item.seq}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5454 | <code>                seq: item.seq &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5455 | <code>                ts: analysisTimestamp(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5456 | <code>                iso: analysisIso(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5457 | <code>                type: item.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5458 | <code>                kind: timelineKind(item.type),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5459 | <code>                status: item.status &#124;&#124; payload.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5460 | <code>                iteration: getPayloadIteration(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5461 | <code>                title: timelineTitle(item.type, payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5462 | <code>                durationMs: Number.isFinite(Number(payload.durationMs)) ? Number(payload.durationMs) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5463 | <code>                ok: payload.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5464 | <code>                tool: payload.tool &#124;&#124; payload.toolCall?.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5465 | <code>                preview: summarizeForAnalysis(payload.displayText &#124;&#124; payload.text &#124;&#124; payload.summary &#124;&#124; payload.error &#124;&#124; payload.result &#124;&#124; payload, 900)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5466 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5468 | <code>        for (const event of events) {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5469 | <code>            const payload = event.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5470 | <code>            timeline.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5471 | <code>                source: 'event',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5472 | <code>                id: event.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5473 | <code>                seq: event.seq &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5474 | <code>                ts: analysisTimestamp(event),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5475 | <code>                iso: analysisIso(event),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5476 | <code>                type: event.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5477 | <code>                kind: timelineKind(event.type),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5478 | <code>                status: payload.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5479 | <code>                iteration: getPayloadIteration(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5480 | <code>                title: timelineTitle(event.type, payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5481 | <code>                durationMs: Number.isFinite(Number(payload.durationMs)) ? Number(payload.durationMs) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5482 | <code>                ok: payload.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5483 | <code>                tool: payload.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5484 | <code>                preview: summarizeForAnalysis(payload, 700)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5485 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5486 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5487 | <code>        for (const entry of auditEntries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5488 | <code>            timeline.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5489 | <code>                source: 'audit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5490 | <code>                id: entry.callId &#124;&#124; entry.runId &#124;&#124; `${entry.ts &#124;&#124; entry.iso}:audit`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5491 | <code>                seq: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5492 | <code>                ts: analysisTimestamp(entry),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5493 | <code>                iso: analysisIso(entry),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5494 | <code>                type: entry.type &#124;&#124; 'tool.audit',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5495 | <code>                kind: entry.type === 'agent.run' ? 'result' : 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5496 | <code>                status: entry.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5497 | <code>                iteration: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5498 | <code>                title: entry.type === 'agent.run'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5499 | <code>                    ? `审计记录 ${entry.status &#124;&#124; ''}`.trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5500 | <code>                    : `工具审计 ${entry.tool &#124;&#124; ''}`.trim(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5501 | <code>                durationMs: Number.isFinite(Number(entry.durationMs)) ? Number(entry.durationMs) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5502 | <code>                ok: entry.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5503 | <code>                tool: entry.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5504 | <code>                preview: summarizeForAnalysis(entry.resultPreview &#124;&#124; entry.error &#124;&#124; entry.argsPreview &#124;&#124; entry, 700)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5505 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5506 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5507 | <code>        return timeline</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5508 | <code>            .sort((a, b) =&gt; (a.ts &#124;&#124; 0) - (b.ts &#124;&#124; 0) &#124;&#124; (a.seq &#124;&#124; 0) - (b.seq &#124;&#124; 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5509 | <code>            .slice(-2000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5510 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5512 | <code>    extractOutputStoreFromToolPayload(payload = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5513 | <code>        const result = payload.result &#124;&#124; {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5514 | <code>        const details = result.details &#124;&#124; {};</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5515 | <code>        const structured = result.structuredContent &#124;&#124; {};</code> | 声明局部标识符 `structured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5516 | <code>        const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5517 | <code>            details.outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5518 | <code>            structured.outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5519 | <code>            result.outputStore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5520 | <code>            payload.outputStore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5521 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5522 | <code>        return candidates.find((candidate) =&gt; candidate &amp;&amp; typeof candidate === 'object' &amp;&amp; candidate.outputId) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5525 | <code>    buildRunRounds(transcriptItems = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5526 | <code>        const rounds = new Map();</code> | 声明局部标识符 `rounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5527 | <code>        const ensureRound = (iteration) =&gt; {</code> | 声明局部标识符 `ensureRound`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5528 | <code>            const index = Number.isFinite(Number(iteration)) ? Number(iteration) : 0;</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5529 | <code>            if (!rounds.has(index)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5530 | <code>                rounds.set(index, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5531 | <code>                    iteration: index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5532 | <code>                    label: `第 ${index + 1} 轮`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5533 | <code>                    promptBudget: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5534 | <code>                    approxInputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5535 | <code>                    messages: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5536 | <code>                    decision: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5537 | <code>                    llmCalls: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5538 | <code>                    tools: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5539 | <code>                    progressNotes: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5540 | <code>                    notes: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5541 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5542 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5543 | <code>            return rounds.get(index);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5544 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5546 | <code>        const toolCalls = new Map();</code> | 声明局部标识符 `toolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5547 | <code>        for (const item of transcriptItems) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5548 | <code>            const payload = item.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5549 | <code>            const iteration = getPayloadIteration(payload);</code> | 声明局部标识符 `iteration`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5550 | <code>            if (item.type === 'agent.context_snapshot') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5551 | <code>                const round = ensureRound(iteration);</code> | 声明局部标识符 `round`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5552 | <code>                round.promptBudget = payload.promptBudget &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5553 | <code>                round.approxInputTokens = Number(payload.promptBudget?.approx_input_tokens) &#124;&#124; approxTokenCount(JSON.stringify(payload.messages &#124;&#124; []));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5554 | <code>                round.messages = Array.isArray(payload.messages) ? payload.messages : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5555 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5556 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5557 | <code>            if (item.type === 'agent.llm_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5558 | <code>                ensureRound(iteration).llmCalls.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5559 | <code>                    callId: payload.callId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5560 | <code>                    provider: payload.provider &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5561 | <code>                    model: payload.model &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5562 | <code>                    status: payload.status &#124;&#124; item.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5563 | <code>                    action: payload.action &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5564 | <code>                    ok: payload.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5565 | <code>                    durationMs: Number(payload.durationMs) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5566 | <code>                    usage: normalizeUsageForAnalysis(payload.usage &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5567 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5568 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5569 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5570 | <code>            if (item.type === 'agent.decision') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5571 | <code>                ensureRound(iteration).decision = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5572 | <code>                    status: item.status &#124;&#124; payload.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5573 | <code>                    action: payload.action &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5574 | <code>                    intent: payload.intent &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5575 | <code>                    summary: payload.summary &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5576 | <code>                    publicReasoning: payload.publicReasoning &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5577 | <code>                    progressNoteSource: payload.progressNoteSource &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5578 | <code>                    riskLevel: payload.riskLevel &#124;&#124; '',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5579 | <code>                    toolCall: payload.toolCall &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5580 | <code>                    error: payload.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5581 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5582 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5583 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5584 | <code>            if (item.type === 'agent.progress_note') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5585 | <code>                ensureRound(iteration).progressNotes.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5586 | <code>                    text: payload.text &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5587 | <code>                    source: payload.source &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5588 | <code>                    action: payload.action &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5589 | <code>                    intent: payload.intent &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5590 | <code>                    status: item.status &#124;&#124; payload.status &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5591 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5592 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5593 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5594 | <code>            if (item.type === 'tool.call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5595 | <code>                const callId = normalizeString(payload.callId &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5596 | <code>                const tool = {</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5597 | <code>                    callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5598 | <code>                    tool: payload.toolName &#124;&#124; payload.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5599 | <code>                    status: 'started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5600 | <code>                    ok: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5601 | <code>                    durationMs: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5602 | <code>                    args: payload.args &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5603 | <code>                    resultPreview: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5604 | <code>                    outputStore: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5605 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5606 | <code>                toolCalls.set(callId, tool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5607 | <code>                ensureRound(iteration).tools.push(tool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5608 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5609 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5610 | <code>            if (item.type === 'tool.result') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5611 | <code>                const callId = normalizeString(payload.callId &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5612 | <code>                let tool = toolCalls.get(callId);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5613 | <code>                if (!tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5614 | <code>                    tool = {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5615 | <code>                        callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5616 | <code>                        tool: payload.toolName &#124;&#124; payload.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5617 | <code>                        status: payload.status &#124;&#124; item.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5618 | <code>                        ok: payload.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5619 | <code>                        durationMs: Number(payload.durationMs) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5620 | <code>                        args: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5621 | <code>                        resultPreview: payload.outputPreview &#124;&#124; summarizeForAnalysis(payload.result &#124;&#124; payload.error &#124;&#124; '', 900),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5622 | <code>                        outputStore: this.extractOutputStoreFromToolPayload(payload)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5623 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5624 | <code>                    ensureRound(iteration).tools.push(tool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5625 | <code>                } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5626 | <code>                    tool.status = payload.status &#124;&#124; item.status &#124;&#124; tool.status;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5627 | <code>                    tool.ok = payload.ok === true;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5628 | <code>                    tool.durationMs = Number(payload.durationMs) &#124;&#124; tool.durationMs;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 5629 | <code>                    tool.resultPreview = payload.outputPreview &#124;&#124; summarizeForAnalysis(payload.result &#124;&#124; payload.error &#124;&#124; '', 900);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5630 | <code>                    tool.outputStore = this.extractOutputStoreFromToolPayload(payload) &#124;&#124; tool.outputStore;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5631 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5632 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5633 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5635 | <code>        return [...rounds.values()].sort((a, b) =&gt; a.iteration - b.iteration);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5636 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5638 | <code>    buildRunToolCalls(transcriptItems = []) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5639 | <code>        const calls = new Map();</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5640 | <code>        for (const item of transcriptItems) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5641 | <code>            const payload = item.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5642 | <code>            if (!['tool.call', 'tool.result'].includes(item.type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5643 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5644 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5645 | <code>            const callId = normalizeString(payload.callId &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5646 | <code>            if (!callId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5647 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5648 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5649 | <code>            const existing = calls.get(callId) &#124;&#124; {</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5650 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5651 | <code>                tool: payload.toolName &#124;&#124; payload.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5652 | <code>                startedAt: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5653 | <code>                completedAt: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5654 | <code>                status: 'started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5655 | <code>                ok: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5656 | <code>                durationMs: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5657 | <code>                iteration: getPayloadIteration(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5658 | <code>                args: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5659 | <code>                resultPreview: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5660 | <code>                outputStore: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5661 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5662 | <code>            if (item.type === 'tool.call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5663 | <code>                existing.startedAt = analysisTimestamp(item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5664 | <code>                existing.tool = payload.toolName &#124;&#124; payload.tool &#124;&#124; existing.tool;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5665 | <code>                existing.args = payload.args &#124;&#124; existing.args;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5666 | <code>                existing.iteration = getPayloadIteration(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5667 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5668 | <code>                existing.completedAt = analysisTimestamp(item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5669 | <code>                existing.tool = payload.toolName &#124;&#124; payload.tool &#124;&#124; existing.tool;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5670 | <code>                existing.status = payload.status &#124;&#124; item.status &#124;&#124; existing.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5671 | <code>                existing.ok = payload.ok === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5672 | <code>                existing.durationMs = Number(payload.durationMs) &#124;&#124; existing.durationMs;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 5673 | <code>                existing.resultPreview = payload.outputPreview &#124;&#124; summarizeForAnalysis(payload.result &#124;&#124; payload.error &#124;&#124; '', 900);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5674 | <code>                existing.outputStore = this.extractOutputStoreFromToolPayload(payload) &#124;&#124; existing.outputStore;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5675 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5676 | <code>            calls.set(callId, existing);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5677 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5678 | <code>        return [...calls.values()].sort((a, b) =&gt; (a.startedAt &#124;&#124; a.completedAt &#124;&#124; 0) - (b.startedAt &#124;&#124; b.completedAt &#124;&#124; 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5679 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5681 | <code>    buildRunBottlenecks({ rounds = [], toolCalls = [], llmCalls = [], status = '' } = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5682 | <code>        const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5683 | <code>        for (const call of llmCalls) {</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5684 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5685 | <code>                kind: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5686 | <code>                label: `轮次 ${Number(call.iteration ?? 0) + 1} LLM ${call.model &#124;&#124; call.provider &#124;&#124; ''}`.trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5687 | <code>                durationMs: Number(call.durationMs) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5688 | <code>                severity: call.ok === false ? 'high' : 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5689 | <code>                detail: call.status &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5690 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5691 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5692 | <code>        for (const tool of toolCalls) {</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5693 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5694 | <code>                kind: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5695 | <code>                label: `${tool.tool &#124;&#124; 'tool'} ${tool.status &#124;&#124; ''}`.trim(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5696 | <code>                durationMs: Number(tool.durationMs) &#124;&#124; 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5697 | <code>                severity: tool.ok === false ? 'high' : 'medium',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5698 | <code>                detail: tool.resultPreview &#124;&#124; ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5699 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5700 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5701 | <code>        for (const round of rounds) {</code> | 声明局部标识符 `round`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5702 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5703 | <code>                kind: 'context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5704 | <code>                label: `${round.label} 输入上下文`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5705 | <code>                tokens: Number(round.approxInputTokens) &#124;&#124; 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5706 | <code>                severity: Number(round.approxInputTokens) &gt; 24000 ? 'high' : 'low',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5707 | <code>                detail: `${Number(round.approxInputTokens) &#124;&#124; 0} approx tokens`</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5708 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5709 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5710 | <code>        const failedTool = toolCalls.find((tool) =&gt; tool.ok === false);</code> | 声明局部标识符 `failedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5711 | <code>        const slowest = candidates</code> | 声明局部标识符 `slowest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5712 | <code>            .filter((entry) =&gt; Number(entry.durationMs) &gt; 0 &#124;&#124; Number(entry.tokens) &gt; 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5713 | <code>            .sort((a, b) =&gt; (b.durationMs &#124;&#124; b.tokens &#124;&#124; 0) - (a.durationMs &#124;&#124; a.tokens &#124;&#124; 0))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5714 | <code>            .slice(0, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5715 | <code>        const primary = failedTool</code> | 声明局部标识符 `primary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5716 | <code>            ? `首要问题可能在工具 ${failedTool.tool &#124;&#124; failedTool.callId}：${failedTool.status &#124;&#124; 'failed'}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5717 | <code>            : slowest[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5718 | <code>                ? `最大开销来自 ${slowest[0].label}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5719 | <code>                : status &amp;&amp; status !== 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5720 | <code>                    ? `运行状态停在 ${status}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5721 | <code>                    : '未发现明显单点瓶颈';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5722 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5723 | <code>            primary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5724 | <code>            items: slowest</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5725 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5726 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5728 | <code>    async analyzeAgentRun(runId, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5729 | <code>        const id = normalizeString(runId);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5730 | <code>        if (!id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5731 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5732 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5733 | <code>                status: 'missing_run_id',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5734 | <code>                error: 'runId is required'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5735 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5736 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5737 | <code>        const transcript = await this.runtime.readTranscript(id, Number(options.transcriptLimit &#124;&#124; 2000));</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5738 | <code>        const transcriptItems = transcript.items &#124;&#124; [];</code> | 声明局部标识符 `transcriptItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5739 | <code>        const auditEntries = (await this.readAuditEntries(1000)).filter((entry) =&gt; isRunAuditEntry(entry, id));</code> | 声明局部标识符 `auditEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5740 | <code>        const events = this.eventLog.filter((event) =&gt; isRunGatewayEvent(event, id));</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5741 | <code>        const timeline = this.buildRunTimeline({ transcriptItems, events, auditEntries });</code> | 声明局部标识符 `timeline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5742 | <code>        const rounds = this.buildRunRounds(transcriptItems);</code> | 声明局部标识符 `rounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5743 | <code>        const toolCalls = this.buildRunToolCalls(transcriptItems);</code> | 声明局部标识符 `toolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5744 | <code>        const llmCalls = rounds.flatMap((round) =&gt;</code> | 声明局部标识符 `llmCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5745 | <code>            round.llmCalls.map((call) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5746 | <code>                ...call,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5747 | <code>                iteration: round.iteration</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5748 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5749 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5750 | <code>        const usageTotals = {</code> | 声明局部标识符 `usageTotals`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5751 | <code>            promptTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5752 | <code>            completionTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5753 | <code>            totalTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5754 | <code>            reasoningTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5755 | <code>            cachedTokens: 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5756 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5757 | <code>        for (const call of llmCalls) {</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5758 | <code>            addUsageTotals(usageTotals, call.usage &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5759 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5760 | <code>        const finalItem = [...transcriptItems].reverse().find((item) =&gt;</code> | 声明局部标识符 `finalItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5761 | <code>            ['turn.completed', 'agent.final', 'agent.blocked', 'approval.requested'].includes(item.type)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5762 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5763 | <code>        const latestDebugPause = [...transcriptItems].reverse().find((item) =&gt; item.type === 'agent.debug.paused') &#124;&#124; null;</code> | 声明局部标识符 `latestDebugPause`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5764 | <code>        const latestDebugPauseActive = latestDebugPause &amp;&amp;</code> | 声明局部标识符 `latestDebugPauseActive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5765 | <code>            (!finalItem &#124;&#124; analysisTimestamp(latestDebugPause) &gt;= analysisTimestamp(finalItem));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5766 | <code>        const finalAudit = [...auditEntries].reverse().find((entry) =&gt; entry.type === 'agent.run') &#124;&#124; null;</code> | 声明局部标识符 `finalAudit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5767 | <code>        const status = normalizeString(</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5768 | <code>            finalAudit?.status &#124;&#124; finalItem?.status &#124;&#124; finalItem?.payload?.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5769 | <code>            transcript.ok ? 'running_or_partial' : transcript.status &#124;&#124; 'not_found'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5770 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5771 | <code>        const ok = finalAudit ? finalAudit.ok === true : finalItem?.payload?.ok === true;</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5772 | <code>        const durationMs = Number(finalAudit?.durationMs ?? finalItem?.payload?.durationMs);</code> | 声明局部标识符 `durationMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5773 | <code>        const totalContextTokens = rounds.reduce((sum, round) =&gt; sum + (Number(round.approxInputTokens) &#124;&#124; 0), 0);</code> | 声明局部标识符 `totalContextTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5774 | <code>        const bottlenecks = this.buildRunBottlenecks({ rounds, toolCalls, llmCalls, status });</code> | 声明局部标识符 `bottlenecks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5775 | <code>        const outputArtifacts = toolCalls</code> | 声明局部标识符 `outputArtifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5776 | <code>            .filter((tool) =&gt; tool.outputStore?.outputId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5777 | <code>            .map((tool) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5778 | <code>                callId: tool.callId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5779 | <code>                tool: tool.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5780 | <code>                status: tool.status,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5781 | <code>                iteration: tool.iteration,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5782 | <code>                outputId: tool.outputStore.outputId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5783 | <code>                path: tool.outputStore.path &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5784 | <code>                bytes: Number(tool.outputStore.bytes) &#124;&#124; 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5785 | <code>                lineCount: Number(tool.outputStore.lineCount) &#124;&#124; 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5786 | <code>                previewTruncated: tool.outputStore.previewTruncated === true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5787 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5788 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5789 | <code>            ok: transcript.ok &#124;&#124; auditEntries.length &gt; 0 &#124;&#124; events.length &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5790 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5791 | <code>            runId: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5792 | <code>            sessionId: normalizeString(transcriptItems[0]?.sessionId &#124;&#124; finalAudit?.args?.sessionId, 'main'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5793 | <code>            summary: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5794 | <code>                ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5795 | <code>                status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5796 | <code>                durationMs: Number.isFinite(durationMs) ? durationMs : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5797 | <code>                mode: finalAudit?.mode &#124;&#124; finalItem?.payload?.mode &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5798 | <code>                intent: finalAudit?.intent &#124;&#124; finalItem?.payload?.intent &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5799 | <code>                planner: finalAudit?.planner &#124;&#124; finalItem?.payload?.planner &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5800 | <code>                rounds: rounds.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5801 | <code>                llmCalls: llmCalls.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5802 | <code>                toolCalls: toolCalls.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5803 | <code>                failedTools: toolCalls.filter((tool) =&gt; tool.ok === false).length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5804 | <code>                outputArtifacts: outputArtifacts.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5805 | <code>                totalContextTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5806 | <code>                usage: usageTotals,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5807 | <code>                primaryBottleneck: bottlenecks.primary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5808 | <code>                debugPaused: status === 'debug_paused' &#124;&#124; Boolean(latestDebugPauseActive),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5809 | <code>                debugSessionId: latestDebugPauseActive ? normalizeString(latestDebugPause?.payload?.debugSessionId) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5810 | <code>                pausedAtIteration: latestDebugPauseActive &amp;&amp; Number.isFinite(Number(latestDebugPause?.payload?.iteration))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5811 | <code>                    ? Number(latestDebugPause.payload.iteration)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5812 | <code>                    : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5813 | <code>                nextIteration: latestDebugPauseActive &amp;&amp; Number.isFinite(Number(latestDebugPause?.payload?.nextIteration))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5814 | <code>                    ? Number(latestDebugPause.payload.nextIteration)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5815 | <code>                    : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5816 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5817 | <code>            transcript: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5818 | <code>                ok: transcript.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5819 | <code>                status: transcript.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5820 | <code>                path: transcript.transcriptPath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5821 | <code>                itemCount: transcriptItems.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5822 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5823 | <code>            audit: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5824 | <code>                path: this.auditLogPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5825 | <code>                entryCount: auditEntries.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5826 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5827 | <code>            rounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5828 | <code>            toolCalls,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5829 | <code>            llmCalls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5830 | <code>            outputArtifacts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5831 | <code>            bottlenecks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5832 | <code>            timeline</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5833 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5834 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5836 | <code>    async runAgentAnalysis(request = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5837 | <code>        const result = await this.runAgent(request &#124;&#124; {});</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5838 | <code>        const runId = normalizeString(result?.runId &#124;&#124; result?.result?.runId &#124;&#124; result?.payload?.runId);</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5839 | <code>        const analysis = runId ? await this.analyzeAgentRun(runId, request.analysis &#124;&#124; {}) : null;</code> | 声明局部标识符 `analysis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5840 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5841 | <code>            ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5842 | <code>            status: result?.status &#124;&#124; analysis?.status &#124;&#124; 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5843 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5844 | <code>            result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5845 | <code>            analysis</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5846 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5847 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5849 | <code>    async continueAgentAnalysis(request = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5850 | <code>        const debugSessionId = normalizeString(request.debugSessionId &#124;&#124; request.context?.debugSessionId);</code> | 声明局部标识符 `debugSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5851 | <code>        const runId = normalizeString(request.runId &#124;&#124; request.context?.runId);</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5852 | <code>        const result = await this.runAgent({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5853 | <code>            ...(request &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5854 | <code>            debugSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5855 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5856 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5857 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5858 | <code>            debugBreakAfterRound: request.debugBreakAfterRound !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5859 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5860 | <code>                ...(request.context &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5861 | <code>                debugSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5862 | <code>                runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5863 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5864 | <code>                planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5865 | <code>                debugBreakAfterRound: request.debugBreakAfterRound !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5866 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5867 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5868 | <code>        const nextRunId = normalizeString(result?.runId &#124;&#124; result?.result?.runId &#124;&#124; result?.payload?.runId &#124;&#124; runId);</code> | 声明局部标识符 `nextRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5869 | <code>        const analysis = nextRunId ? await this.analyzeAgentRun(nextRunId, request.analysis &#124;&#124; {}) : null;</code> | 声明局部标识符 `analysis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5870 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5871 | <code>            ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5872 | <code>            status: result?.status &#124;&#124; analysis?.status &#124;&#124; 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5873 | <code>            runId: nextRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5874 | <code>            result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5875 | <code>            analysis</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5876 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5877 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5878 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5880 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5881 | <code>    DEFAULT_PORT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5882 | <code>    AILISGateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5883 | <code>    attachSuggestedMcpToolsForDirectExposure,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5884 | <code>    collectSuggestedMcpToolNames</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5885 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
