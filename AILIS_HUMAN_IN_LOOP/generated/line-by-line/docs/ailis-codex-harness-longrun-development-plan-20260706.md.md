# docs/ailis-codex-harness-longrun-development-plan-20260706.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：2048
- SHA-256：`34ae0ded3c8a99c78a53ef9af3174fc74a297da97fa0617750dfbca8cd90e2c9`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-harness-longrun-development-plan-20260706.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`spec`、`approxTokenCount`、`text`、`buildContextBudgetReport`、`modelContextWindowTokens`、`reservedCompletionTokens`、`safetyMarginTokens`、`effectiveInputLimitTokens`、`configuredTaskInputBudgetTokens`、`targetContextTokens`、`staticPrefixTokens`、`toolSpecsTokens`、`taskStateTokens`、`pinnedEvidenceTokens`、`recentItemsTokens`、`toolOutputPreviewTokens`、`droppedManifestTokens`、`modelVisibleTokensEstimate`、`activeContextTokens`、`budgetUsedRatio`、`tokensUntilCompaction`、`classifyCompactionLevel`、`makeHeadTailPreview`、`source`、`marker`、`remaining`、`headChars`、`tailChars`、`head`、`tail`、`normalizeAilisToolOutput`、`raw`、`rawText`、`rawBytes`、`rawLines`、`approxOriginalTokens`、`shouldExternalize`、`outputRef`、`preview`、`dispatch`、`tool`、`validation`、`startedAt`、`rawResult`、`normalized`、`work`、`pkg`、`budget`、`pairs`、`latestFailure`、`recentPairs`、`pinnedEvidence`、`outputRefs`、`dropped`、`classifyEvidencePolicy`、`finalizerGate`、`evidencePolicy`、`formatOk`、`coverage`、`persistLongrunIteration`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>﻿# AILIS 对齐 Codex Harness 的长程任务执行能力开发文档</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-07-06</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>Target repo: `F:\AILIS_self_evolution_runtime`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>AILIS branch inspected: `codex/ailis-1.0.7-main`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>AILIS HEAD inspected: `27ad8046f166711ec74716e0c363c4133cf622a2`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>Local Codex source inspected: `F:\AIGril\AIGrilClaw\.refs\openai-codex`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>Local Codex source HEAD inspected: `da4c8ca57d40b074bdc1b5b1218851100150c56b`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>Installed Codex package inspected: `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex`, version `0.142.5`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## 0. 目的</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>这份文档不依赖对话记忆，而是从本机可读的 Codex 源码副本和 AILIS 当前源码出发，抽取两套系统的 Harness 架构，设计一条让 AILIS 更靠近 Codex-style 稳定长程任务执行能力的开发路线。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>核心结论：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>稳定长程任务不是靠模型记忆变强，而是靠 Harness 把任务状态、工具规格、执行输出、证据、上下文预算、失败分类和恢复逻辑都变成可验证的运行时对象。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>AILIS 已经有 Agent Runner、Tool Runtime、MCP Session、Context Manager、Evidence Artifact、GAIA Runner 和 Auto Optimizer。现在最重要的不是继续堆工具，而是把这些能力收敛成一个更硬的 Harness Core。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>## 1. 本地源码证据范围</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>### 1.1 Codex 代码来源</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>本机可读 Codex 源码位置：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 30 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>本次重点读取的 Codex 文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>context/environment_context.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>shell.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>tools/handlers/shell_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>tools/handlers/unified_exec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>tools/handlers/unified_exec/exec_command.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>tools/handlers/unified_exec/write_stdin.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>unified_exec/head_tail_buffer.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>tools/context.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>tools/registry.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>tools/handlers/tool_search_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>tools/handlers/tool_search.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>mcp_tool_exposure.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>tools/handlers/mcp.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>session/mcp.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>session/mcp_runtime.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>context_manager/history.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>context_manager/normalize.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>thread_rollout_truncation.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>tools/handlers/multi_agents_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>tools/handlers/multi_agents.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>session/multi_agents.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>tools/handlers/apply_patch_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>tools/handlers/request_permissions.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>本机 npm 安装包 `@openai/codex@0.142.5` 只包含 JS wrapper 和平台二进制：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 64 | <code>C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\bin\codex.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\node_modules\@openai\codex-win32-x64\vendor\x86_64-pc-windows-msvc\bin\codex.exe</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>因此深层 Harness 分析以 `.refs\openai-codex` 的 Rust 源码为准，npm 包只用于确认安装形态和版本。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>### 1.2 AILIS 代码来源</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>本次重点读取的 AILIS 文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 75 | <code>electron/ailis-agent-runner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>electron/ailis-agent-runtime-protocol.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>electron/ailis-tool-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>electron/ailis-tool-contracts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>electron/ailis-tool-executor.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>electron/ailis-mcp-session.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>electron/ailis-context-manager.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>electron/ailis-turn-items.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>electron/ailis-evidence-artifacts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>scripts/run-gaia-level1-lite.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>scripts/run-gaia-official.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>scripts/run-ailis-gaia-auto-optimizer.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>scripts/validate-ailis-harness.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>tests/ailis-agent-runner.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>tests/ailis-agent-execution-flow.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>tests/run-gaia-level1-lite.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>## 2. Harness 的核心定义</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>在这里，Harness 不是单个脚本，也不是提示词。Harness 是 Agent 外部的稳定运行系统，负责把模型的每一步变成可验证、可恢复、可审计的执行过程。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>一个完整 Harness 至少包括：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>1. Runtime Environment</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>   当前 cwd、shell、OS、权限、网络策略、当前日期、可写根目录。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>2. Context Compiler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>   把任务状态、历史、证据、工具、预算编译成模型本轮可见输入。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>3. Tool Registry / Tool Router</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>   管理模型可见工具、延迟工具、隐藏工具、MCP 工具和外部工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>4. Schema Validator</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>   在工具边界硬校验 required、additionalProperties、空参数和参数类型。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>5. Tool Executor</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>   执行 shell、文件、MCP、浏览器、artifact、subagent 等操作。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>6. Output Store</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>   保存完整 stdout/stderr、网页正文、大文件、PDF、表格、截图等，模型只看摘要和可查询 id。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>7. Evidence Store</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>   把工具输出转成可引用证据，保留 source、field、value、page、range、confidence、complete/truncated。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>8. Loop Controller</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>   控制最大步数、重复调用、预算、审批、阻塞、恢复、终止。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>9. Finalizer Gate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>   判断是否可以给最终答案；长程评测里尤其要防止低置信度、无证据、格式错误提交。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>10. Trace / Agent Lab</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>    给人类和调试器看完整链路，不等同于模型上下文。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>11. LongRun Controller</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>    通过磁盘 state/progress/event-log/iterations 保证任务跨进程、跨会话、跨上下文恢复。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>稳定的长程任务不是让模型无限思考，而是让运行时不断把不稳定的自然语言过程固化为状态机。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>## 3. AILIS 当前架构抽取</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>### 3.1 桌面与 Agent Runner 入口</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>AILIS 当前入口是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 143 | <code>AILIS Desktop / Chat / Voice / Avatar</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>  -&gt; window.ailisDesktop.gateway.runAgent()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>  -&gt; AILISAgentRunner classifyOnly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>  -&gt; conversation: Companion Chat Service</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>  -&gt; task: AILISGateway.runAgent()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>  -&gt; Agent Runner Loop</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  -&gt; Tool Runtime / MCP / Evidence / Final</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 155 | <code>electron/ailis-agent-runner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>- AILIS 已经区分 persona/conversation 和 task_agent。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>- `FINAL_ANSWER_TOOL_NAME = 'final_answer'` 已存在。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- `buildLlmAgentDirectToolPrompt()` 已明确要求模型使用 OpenAI Responses object model，不要输出 custom JSON decision object。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- Runner 会构建 runtime environment、context manager、direct tool specs、tool summary、evidence sufficiency prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- Runner 会在工具调用前执行 loop guard，尝试阻止重复 search/fetch/read。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>- `ailis-agent-runner.cjs` 过大，混合了 prompt、persona、tool decision、tool execution、evidence、finalizer、approval、loop guard、debug pause 等职责。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- 这会导致 Harness 能力难以独立测试，也容易让 persona 层和 task 执行层互相污染。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>### 3.2 Response Item 协议层</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 176 | <code>electron/ailis-agent-runtime-protocol.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>AILIS 已支持模型可见 ResponseItem 类型：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 182 | <code>message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>reasoning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>function_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>tool_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>function_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>tool_search_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>还支持 runtime extension：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 193 | <code>local_shell_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>custom_tool_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>context_compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>other</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>- 这已经非常接近 Codex-style object model。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>- `validateSupportedResponseItem()` 会校验 `function_call.name`、`call_id`、`arguments` 必须是 JSON string。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 204 | <code>- `tool_search_call` 和 `tool_search_output` 也有 call_id 规则。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>- 协议层已经有了，但 Runner 中仍保留兼容性 JSON planner、capability_context、legacy tool path 等多条路径。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>- 后续应让 task_agent 主路径只走 native ResponseItem + direct tools，把兼容路径降级为 legacy fallback。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>### 3.3 Tool Runtime 与 Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 216 | <code>electron/ailis-tool-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>electron/ailis-tool-contracts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>electron/ailis-tool-executor.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>AILIS 已经有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>- `AILISToolRuntimeRegistry`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>- `AILISRuntimeTool`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>- `dispatch(toolId, args, context)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- `dispatchDirectMcpTool()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>- `validateToolContract()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>- `validateAgainstSchema()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- `additionalProperties === false` 校验</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>- `tool_search` required `query/q`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 231 | <code>- direct MCP id 解析和转发</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>- 工具输出标准化为 `content/details/structuredContent`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>- AILIS 的 tool runtime 结构选择成立。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- `tool_search` 已经注册为真实 runtime tool，不只是 prompt 文本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>- MCP direct tools 可以通过 `mcp__server__tool` 路由，不必普通任务走 `mcp_bridge.call_tool`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>- AILIS 仍有很多 broad action tools，例如 `computer`、`artifact_tools`、`mcp_bridge`，一个 tool 内部再用 `action` 多路复用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 243 | <code>- broad action tool 容易让模型在参数层面犯错，也让 schema 粒度比 Codex 低。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- external/MCP/direct 动态工具的 schema 生命周期还应进一步统一到同一个 ToolSpecRegistry。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>### 3.4 MCP Session</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 251 | <code>electron/ailis-mcp-session.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 252 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>AILIS 已经支持：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>- MCP server 注册。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 257 | <code>- `tools/list` schema 读取。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- inputSchema 属性提取。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>- MCP HTTP JSON-RPC/SSE 响应解析。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>- `validateAgainstSchema(args, inputSchema)`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>- `mcp_bridge` 管理动作。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 262 | <code>- direct MCP call 参数归一化和调用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>- AILIS 已经把 MCP 从“纯概念”做成了运行时能力。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 267 | <code>- 这和 Codex 通过 MCP runtime snapshot、connection manager、tool exposure 的结构一致。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>- `mcp_bridge` 仍是模型可见的诱惑路径之一。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 272 | <code>- 普通任务必须只看到 direct MCP tool specs；`mcp_bridge` 必须限制在管理/调试/doctor 模式。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>### 3.5 Context Manager</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 279 | <code>electron/ailis-context-manager.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>electron/ailis-turn-items.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>AILIS 已经有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>- `DEFAULT_TOOL_OUTPUT_CHARS = 24000`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 286 | <code>- recent outputs 保留。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 287 | <code>- pinned complete outputs 保留。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- older exploratory output compact 成 `OLDER_TOOL_OBSERVATION_COMPACTED`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- `ensureCallOutputsPresent()`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- checkpoint/restore。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- reasoning-ready/complete/truncated 检测。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>- turn items 将工具结果、失败、capability context 编译成 prompt ledger。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- AILIS 已经具备“不要把完整历史塞回模型”的意识。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- 这和 Codex `context_manager/history.rs` 的结构一致。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>- AILIS 主要以字符预算处理工具输出；Codex 同时记录 token usage、估算 token、按 ResponseItem 类型处理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 302 | <code>- AILIS 还必须具备更强的“raw trace 与 model prompt 分离”，不要把 UI/Persona/Debug 文本混进 evidence context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 303 | <code>- 对长程任务，context manager 还必须显式输出 `context_budget_report`、`pinned_evidence_manifest`、`dropped_items_manifest`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>### 3.6 Evidence Artifacts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 310 | <code>electron/ailis-evidence-artifacts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>AILIS 已有 typed evidence：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 316 | <code>ResearchSourceEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>ResearchReadEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 318 | <code>GroundedSummaryEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>IssueContextEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>RepoStateEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>DiffEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 322 | <code>SecretScanEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>OperationResultEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>DocumentTargetEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>TestFailureEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>DocumentParseEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>DocumentProtectionEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 328 | <code>VerificationEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>MailboxQueryEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>MailSummaryEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>VisionSnapshotEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>VisionObservationEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>QuestionEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>Evidence payload 已包含：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 338 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 339 | <code>sourceKind</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>path/url/uri</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>artifactId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>artifactKind/artifactType/action</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>sheet/range/coverage</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>complete/truncated/reasoningReady</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>pinnedEvidenceId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>coveredByEvidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>contentChars</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>confidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>- AILIS 已经有比普通 Agent 更强的证据结构。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 354 | <code>- 这对 GAIA、文档、网页、PDF、表格任务都很关键。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>- Evidence artifact 仍偏“从观察结果推断”，不是所有工具都原生返回标准 evidence contract。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- Finalizer 存在风险：会把 advisory refs 当参考，而不是强约束。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>- 必须把 evidence contract 前移到工具返回规范，而不是后处理猜测。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>### 3.7 GAIA Runner 与 Auto Optimizer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 367 | <code>scripts/run-gaia-level1-lite.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>scripts/run-gaia-official.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>scripts/run-ailis-gaia-auto-optimizer.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>AILIS 已有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>- GAIA 官方数据下载/本地 scoring server。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 375 | <code>- exact answer prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 376 | <code>- answer gate。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 377 | <code>- finalizer。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 378 | <code>- evidence digest。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 379 | <code>- retries。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 380 | <code>- task transcript/result 保存。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 381 | <code>- auto optimizer jobDir。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 382 | <code>- `progress.json`、`state.json`、`event-log.jsonl`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 383 | <code>- `chain.json`、`verdict.json`、repair ticket。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 384 | <code>- failureCategory 分类：environment、web_retrieval_mcp、tools_mcp、harness_finalization、agent_architecture、model_reasoning。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>- spend safety gate、repairBacklog、stop.flag。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>现状判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>- 这已经是长程任务 Harness 的雏形。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 390 | <code>- `run-ailis-gaia-auto-optimizer.mjs` 已经非常接近 local controller。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>- GAIA lite runner 中存在越来越多 task/domain-specific heuristic，例如 ClinicalTrials、gift assignment、presentation、quote 等 deterministic extraction。它们短期提分，但长期应迁移为通用 artifact/evidence adapters 或 test fixtures，不要让 benchmark runner 变成任务特判集合。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 395 | <code>- Auto optimizer 还必须更明确区分：controller、worker、conversation projector。之前 API 花费过大，说明安全预算、采样策略、失败聚类和人工闸门还不够硬。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 397 | <code>## 4. Codex Harness 架构抽取</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>### 4.1 Runtime Environment 是一等上下文</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 401 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 404 | <code>context/environment_context.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>shell.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 406 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>Codex 将环境作为结构化上下文注入，而不是靠模型猜：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 411 | <code>cwd</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>shell</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 413 | <code>current date</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 414 | <code>timezone</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 415 | <code>network</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>filesystem roots</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 417 | <code>permission profile</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>Codex shell 处理也按 shell 类型分支：PowerShell、cmd、bash/zsh/sh 不共用一套字符串改写逻辑。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 422 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 425 | <code>RuntimeEnvironment 不能只是 prompt 文本，也不能写死 Windows。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 426 | <code>它必须是每一轮的结构化输入，并被 exec/read/write/MCP runtime 共享。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 427 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>### 4.2 ToolSpec 是真实工具边界，不是二级 JSON 决策</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 434 | <code>tools/handlers/shell_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>tools/handlers/apply_patch_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>tools/handlers/request_permissions.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>Codex 暴露的是真实工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 442 | <code>exec_command</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>write_stdin</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>request_permissions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 445 | <code>apply_patch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>tool_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>MCP namespace function</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 448 | <code>multi_agent tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 449 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>`exec_command` 有 output schema：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 454 | <code>wall_time_seconds</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 455 | <code>exit_code</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 456 | <code>session_id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 457 | <code>original_token_count</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 459 | <code>required: wall_time_seconds, output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>additionalProperties: false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 461 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>`apply_patch` 是 freeform tool，并绑定 lark grammar，不让模型把 patch 包成 JSON。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 468 | <code>任务模式必须默认不使用 meta-decision JSON。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 469 | <code>模型必须直接调用真实工具，运行时在工具边界强校验。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 470 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>### 4.3 Tool Registry 是运行时中心</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 477 | <code>tools/registry.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 478 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>Codex 的工具注册层负责：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 483 | <code>ToolExecutor</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 484 | <code>CoreToolRuntime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>ToolExposure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>supports_parallel_tool_calls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>waits_for_runtime_cancellation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 488 | <code>pre_tool_use_payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 489 | <code>post_tool_use_payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 490 | <code>telemetry_tags</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>这意味着工具不是一段 prompt，也不是一堆 if/else，而是有 id、spec、exposure、handler、telemetry、hooks 的运行时对象。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 497 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 498 | <code>AILISRuntimeTool 已经是正确契约。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>下一步要把所有 core/MCP/external/artifact/subagent 工具都纳入一个统一 ToolSpecRegistry + ToolRuntimeRegistry。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 502 | <code>### 4.4 tool_search 是延迟工具发现，不是网页搜索</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 507 | <code>tools/handlers/tool_search_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>tools/handlers/tool_search.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>Codex `tool_search` 的语义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 513 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 514 | <code>Searches over deferred tool metadata with BM25 and exposes matching tools for the next model call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>For MCP tool discovery, always use tool_search instead of list_mcp_resources/list_mcp_resource_templates.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>实现上：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 521 | <code>ToolSearchHandler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 522 | <code>  search_infos: Vec&lt;ToolSearchInfo&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>  search_engine: SearchEngine&lt;usize&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>  returns ToolSearchOutput { tools }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 525 | <code>  coalesce_loadable_tool_specs(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 526 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 531 | <code>tool_search 只做工具发现。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 532 | <code>web_search 是网页检索。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 533 | <code>两者名字和 schema 必须彻底隔离，避免模型把工具发现当网页搜索。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 534 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>### 4.5 MCP 工具被映射成 namespace/function</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 541 | <code>mcp_tool_exposure.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 542 | <code>tools/handlers/mcp.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 543 | <code>session/mcp.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>session/mcp_runtime.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 545 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>Codex MCP 关键形态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 550 | <code>McpToolExposure {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 551 | <code>  direct_tools,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 552 | <code>  deferred_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 553 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>McpHandler::spec()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 556 | <code>  -&gt; ToolSpec::Namespace(ResponsesApiNamespace)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 557 | <code>  -&gt; ResponsesApiNamespaceTool::Function(tool)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 558 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>MCP runtime 有 snapshot/manager/runtime_context，MCP server 刷新、连接、权限、elicitation 也属于 session runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 565 | <code>普通模型调用 MCP 时，必须看到 mcp__server__tool direct spec。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>mcp_bridge 只做管理、health、resource、debug，不做普通任务主路径。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 569 | <code>### 4.6 Unified Exec 是长程任务的基础设施</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 574 | <code>tools/handlers/unified_exec/exec_command.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 575 | <code>tools/handlers/unified_exec/write_stdin.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 576 | <code>unified_exec/head_tail_buffer.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 577 | <code>tools/context.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 578 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>Codex exec 输出包含：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 581 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 582 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 583 | <code>wall_time</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 584 | <code>raw_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 585 | <code>truncation_policy</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 586 | <code>max_output_tokens</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 587 | <code>process_id/session_id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 588 | <code>exit_code</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 589 | <code>original_token_count</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 590 | <code>output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 591 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>`write_stdin` 可以继续与已有 session/process 交互。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 595 | <code>`HeadTailBuffer` 保留输出 head/tail，而不是简单截断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>Sandbox denied 也会转换成 model-visible exec output，而不是吞掉错误。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 602 | <code>长程任务不能只靠一次 exec 返回字符串。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 603 | <code>AILIS 必须统一 Exec Output Store：完整 stdout/stderr 写入 store，模型看到摘要、outputId、line/byte/token 统计和下一步读取工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 606 | <code>### 4.7 Context Manager 管 ResponseItem，不是 raw transcript</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 610 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 611 | <code>context_manager/history.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 612 | <code>context_manager/normalize.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 613 | <code>thread_rollout_truncation.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 614 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 615 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 616 | <code>Codex ContextManager：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 619 | <code>items: Vec&lt;ResponseItem&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 620 | <code>token_info: Option&lt;TokenUsageInfo&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 621 | <code>record_items(..., TruncationPolicy)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 622 | <code>for_prompt(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 623 | <code>estimate_token_count(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 624 | <code>update_token_info(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>normalize_history(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>truncate_function_output_payload(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 627 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 629 | <code>Normalize 会保证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 632 | <code>ensure_call_outputs_present</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 633 | <code>remove_orphan_outputs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 634 | <code>strip unsupported images</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 635 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>Thread rollout truncation 按 user turn / fork turn 边界截断，不是按纯字符截断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 642 | <code>模型 prompt history、raw event log、Agent Lab trace、Evidence Store 必须分开。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 643 | <code>压缩不能丢掉完整证据，只能压缩模型可见摘要。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 644 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>### 4.8 Multi-agent 是受控并行，不是忙等</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 647 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 648 | <code>关键文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 651 | <code>tools/handlers/multi_agents_spec.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 652 | <code>tools/handlers/multi_agents.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 653 | <code>session/multi_agents.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 654 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>Codex 多智能体工具强调：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 659 | <code>只委派具体、边界清楚、可并行的 sidecar task。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 660 | <code>不要把关键路径阻塞任务甩给子代理再等待。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 661 | <code>不要重复 wait_agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>子任务要 self-contained，不要和主任务重复。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 663 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>对 AILIS 的启发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 668 | <code>AILIS 的 subagents 适合并行调查、独立修复、回归测试，不适合替代 LongRun Controller。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 669 | <code>长程稳定必须靠 controller/state/event-log，而不是靠多个模型相互聊天。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 670 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>## 5. AILIS vs Codex 对照矩阵</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>&#124; 维度 &#124; Codex 当前代码形态 &#124; AILIS 当前代码形态 &#124; AILIS 目标 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 675 | <code>&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 676 | <code>&#124; 环境上下文 &#124; `EnvironmentContext` 一等对象 &#124; `buildRuntimeEnvironmentPromptObject` 已有 &#124; 做成独立 `RuntimeEnvironment` 模块，所有工具共享 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 677 | <code>&#124; 工具规格 &#124; 真实 direct tools + ToolSpec &#124; direct tools + broad action tools + legacy planner &#124; task 主路径全 direct，legacy 降级 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 678 | <code>&#124; 工具发现 &#124; BM25 over deferred metadata，返回 loadable specs &#124; `tool_search` runtime tool 已有 &#124; tool_search 只返回可执行 specs，不夹业务检索语义 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 679 | <code>&#124; MCP &#124; namespace/function spec &#124; direct MCP id + mcp_bridge 共存 &#124; 普通任务隐藏 bridge，只暴露 direct MCP &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 680 | <code>&#124; Exec &#124; unified exec + session + structured output &#124; computer/code/exec 多路径 &#124; 统一 `exec_command/write_stdin/output_*` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 681 | <code>&#124; 输出保存 &#124; raw output + truncation policy + metadata &#124; context manager 主要压缩 prompt 输出 &#124; 建 Output Store，完整输出外存 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 682 | <code>&#124; 上下文 &#124; ResponseItem history + token usage + normalize &#124; AILIS ContextManager 已有，偏字符预算 &#124; 增加 token accounting、manifest、drop report &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 683 | <code>&#124; 证据 &#124; tool output 与 context 管理分离 &#124; typed evidence artifacts 已有 &#124; 工具原生返回 evidence contract，final 强引用 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 684 | <code>&#124; Finalizer &#124; 工具/输出/上下文闭环 &#124; GAIA finalizer + answer gate &#124; 通用 FinalizerGate，不只 GAIA &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 685 | <code>&#124; 长程任务 &#124; 运行时/会话/工具/上下文稳定 &#124; GAIA auto optimizer 已有 controller 雏形 &#124; 泛化 LongRun Controller，任务无关 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 686 | <code>&#124; 可观测性 &#124; registry hooks、telemetry、tool output &#124; Agent events/evidence artifacts &#124; Agent Lab 用 trace graph 展示完整链路 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 687 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 688 | <code>## 6. 当前缺口</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 690 | <code>### 6.1 Runner 过大，Harness 边界不清</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 691 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 692 | <code>`electron/ailis-agent-runner.cjs` 同时承担：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 695 | <code>persona prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 696 | <code>task prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 697 | <code>tool exposure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 698 | <code>context manager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 699 | <code>evidence audit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 700 | <code>loop guard</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>approval pause/resume</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 702 | <code>native tool parsing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 703 | <code>legacy JSON planner</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>final answer normalization</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 705 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 707 | <code>这会让每次修一个 GAIA 问题都会影响其它产品行为。必须在现有模块内部收紧 Harness 职责边界，避免继续扩张模块。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>### 6.2 Direct Tool 与 Legacy Planner 混用</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>AILIS prompt 已经说“不要输出 custom JSON decision object”，但代码里仍存在 legacy planner 和 capability_context 多路径。长程任务里，路径越多，失败分类越难。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>阶段契约：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 716 | <code>task_agent 主路径：ResponseItem + direct tools + ToolRuntimeRegistry。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 717 | <code>legacy planner：只作为旧 UI/API fallback，不作为 GAIA/长程任务默认路径。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 718 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>### 6.3 Output Store 不够统一</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>Codex `ExecCommandToolOutput` 保留 raw output、wall time、exit code、session id、original token count。AILIS 当前工具输出虽然有 context compaction，但还缺一个统一的 output store contract。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>目标输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 727 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>  "status": "completed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>  "outputId": "out_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>  "complete": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 731 | <code>  "truncatedForModel": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 732 | <code>  "originalBytes": 820000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 733 | <code>  "previewBytes": 24000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 734 | <code>  "stdoutLines": 13000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 735 | <code>  "stderrLines": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>  "wallTimeMs": 842,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 737 | <code>  "exitCode": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 738 | <code>  "nextTools": ["output_read", "output_tail", "output_search"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 739 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 742 | <code>### 6.4 Evidence Gate 还不够硬</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 744 | <code>AILIS 已有 evidence artifact 和 final_answer refs，但 refs 仍偏 advisory。长程任务/GAIA 契约：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 746 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 747 | <code>final_answer 必须引用 available evidence refs。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 748 | <code>引用不存在 refs -&gt; audit warning 或 reject。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 749 | <code>低置信度/缺证据 -&gt; 不能自动提交。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 750 | <code>complete=false/truncated=true 的证据不能单独支撑 exact answer。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 751 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>### 6.5 GAIA Runner 有过多局部启发式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>`run-gaia-level1-lite.mjs` 里有一些确定性 extractor，有助于短期提分，但如果继续堆在 benchmark runner，会让系统变成“GAIA 特判器”。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>迁移原则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 760 | <code>特定任务启发式 -&gt; 通用 artifact adapter / MCP tool / evidence extractor / regression fixture。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 761 | <code>benchmark runner 只负责运行、评分、final gate、记录链路。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 762 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 764 | <code>### 6.6 LongRun Controller 必须泛化</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>`run-ailis-gaia-auto-optimizer.mjs` 已有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 769 | <code>progress.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 770 | <code>state.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 771 | <code>event-log.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 772 | <code>repairBacklog</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 773 | <code>failedTaskIds</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 774 | <code>chain.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 775 | <code>verdict.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 776 | <code>safety gate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 777 | <code>stop.flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 778 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 780 | <code>但它主要绑定 GAIA。目标是抽象成通用 longrun harness：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 783 | <code>longrun/jobs/&lt;job-id&gt;/mission.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 784 | <code>longrun/jobs/&lt;job-id&gt;/acceptance.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 785 | <code>longrun/jobs/&lt;job-id&gt;/loop-policy.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 786 | <code>longrun/jobs/&lt;job-id&gt;/state.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 787 | <code>longrun/jobs/&lt;job-id&gt;/progress.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 788 | <code>longrun/jobs/&lt;job-id&gt;/event-log.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 789 | <code>longrun/jobs/&lt;job-id&gt;/iterations/iter-XXX/...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 790 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>## 7. 目标架构</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>### 7.1 分层目标</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 797 | <code>AILIS Surface Layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 798 | <code>  voice / avatar / expression / persona / desktop UX</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>AILIS Agent Layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 801 | <code>  task intent / high-level planning / final response style</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>AILIS Harness Core</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 804 | <code>  RuntimeEnvironment</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 805 | <code>  ContextCompiler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 806 | <code>  ToolSpecRegistry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 807 | <code>  ToolRuntimeRegistry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 808 | <code>  ToolSearchRuntime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 809 | <code>  McpToolRegistry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 810 | <code>  UnifiedExecRuntime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 811 | <code>  OutputStore</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 812 | <code>  ArtifactEvidenceStore</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 813 | <code>  LoopController</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 814 | <code>  FinalizerGate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 815 | <code>  LongRunController</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 816 | <code>  TraceStore / AgentLab</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 817 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 818 | <code>AILIS Adapter Layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 819 | <code>  MCP servers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 820 | <code>  web/search/fetch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 821 | <code>  PDF/DOCX/XLSX/PPTX/audio/image adapters</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 822 | <code>  shell/filesystem/browser/code adapters</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 823 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>### 7.2 目标执行流</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 827 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 828 | <code>User Task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 829 | <code>  -&gt; Agent Runner classifies conversation vs task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 830 | <code>  -&gt; TaskHarnessRun created with runId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 831 | <code>  -&gt; RuntimeEnvironment snapshot</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 832 | <code>  -&gt; ContextCompiler builds ResponseItem prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 833 | <code>  -&gt; ToolSpecRegistry exposes direct core tools + selected deferred tool_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 834 | <code>  -&gt; Model emits native tool call or final_answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 835 | <code>  -&gt; ToolRouter validates schema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 836 | <code>  -&gt; ToolExecutor runs exact handler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 837 | <code>  -&gt; OutputStore persists raw payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 838 | <code>  -&gt; EvidenceStore creates typed evidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 839 | <code>  -&gt; LoopController decides continue / final / ask / repair / block</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 840 | <code>  -&gt; FinalizerGate validates evidence refs and answer contract</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 841 | <code>  -&gt; PersonaRenderer formats user-facing AILIS response</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 842 | <code>  -&gt; TraceStore keeps full chain for Agent Lab and replay</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 843 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>### 7.3 长程任务目标流</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 848 | <code>LongRunController</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 849 | <code>  -&gt; read mission/acceptance/policy/state/event-log</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 850 | <code>  -&gt; select next iteration</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 851 | <code>  -&gt; start AILIS/Codex worker or local verifier</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 852 | <code>  -&gt; collect artifacts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 853 | <code>  -&gt; write chain/verdict</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 854 | <code>  -&gt; classify failure category</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 855 | <code>  -&gt; repair or queue repair ticket</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 856 | <code>  -&gt; update progress/state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 857 | <code>  -&gt; heartbeat/conversation projector reports only state summary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 858 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 860 | <code>关键点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 863 | <code>对话窗口不是进程管理器。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 864 | <code>长程任务的事实源是磁盘 event-log/state/progress/artifacts。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 865 | <code>heartbeat 只做投影和小修复，不启动重复重任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 866 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>## 8. 分阶段开发计划</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 870 | <code>### Phase 0: 固化源码基线与现状快照</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 872 | <code>阶段契约：先建立可重复对照，不直接改行为。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>工作项：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 876 | <code>1. 保持 `docs/ailis-codex-harness-longrun-development-plan-20260706.md` 作为开发事实源。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 877 | <code>2. 用现有测试、临时审计命令或已有脚本列出当前 direct tools、deferred tools、MCP tools、broad action tools、legacy planner paths；不要为“看清现状”先扩张正式模块。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 878 | <code>3. 运行轻量验证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 881 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 882 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 883 | <code>pnpm test:ailis-agent-execution-flow</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 885 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 887 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 889 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 890 | <code>文档有本地源码来源和 HEAD。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 891 | <code>能列出 AILIS 当前工具面。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 892 | <code>不触碰大规模行为。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 893 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 895 | <code>### Phase 1: 收紧 Harness Core 代码边界</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 897 | <code>阶段契约：不新增模块，不改表层架构；先在现有文件里把 Harness 职责从“提示词拼装 + 零散守卫”收敛为稳定、可测、可审计的内部代码路径。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>现有落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 902 | <code>electron/ailis-agent-runner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 903 | <code>electron/ailis-tool-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 904 | <code>electron/ailis-tool-contracts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 905 | <code>electron/ailis-context-manager.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 906 | <code>electron/ailis-evidence-artifacts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 907 | <code>electron/ailis-mcp-session.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 908 | <code>electron/ailis-tool-executor.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 909 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>函数级收敛：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 913 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 914 | <code>buildRuntimeEnvironmentPromptObject: 输出稳定 runtime snapshot，不继续把环境信息散落进 prompt 文本。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 915 | <code>buildLlmAgentDirectToolPrompt: 只组装已编译上下文包，不直接拼接大段工具说明。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 916 | <code>validateAgentToolLoopGuard: 从简单轮次限制升级为 budget/重复调用/无证据推进/低置信提交守卫。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 917 | <code>validateExactAnswerSubmission: 只做 final answer gate，不承担任务专门判断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 918 | <code>callLlmAgentDirectToolDecision: 固定 direct tool 决策路径，减少 legacy planner 分叉。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 919 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 921 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 923 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 924 | <code>Runner 仍通过现有测试。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 925 | <code>focused unit tests 直接覆盖这些现有函数。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 926 | <code>行为边界变清晰，但文件/模块数量不扩张。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 927 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>### Phase 2: Codex-style ToolSpecRegistry</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>阶段契约：让所有工具统一成 Codex-style runtime object。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>工作项：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>1. 扩展 `AILISRuntimeTool`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 937 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 938 | <code>id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 939 | <code>name</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 940 | <code>namespace</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 941 | <code>spec</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 942 | <code>exposure: direct/deferred/hidden</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 943 | <code>inputSchema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 944 | <code>outputSchema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 945 | <code>handler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 946 | <code>supportsParallel</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 947 | <code>waitsForCancellation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 948 | <code>preToolUsePayload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 949 | <code>postToolUsePayload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 950 | <code>telemetryTags</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 951 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 952 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 953 | <code>2. direct core tools 保持少量：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 955 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 956 | <code>read</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 957 | <code>write</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 958 | <code>apply_patch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 959 | <code>exec_command</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 960 | <code>write_stdin</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 961 | <code>tool_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 962 | <code>request_permissions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 963 | <code>final_answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 964 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>3. broad action tools 分两步处理：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 969 | <code>短期：继续支持 computer/code/artifact_tools，但在 ToolSpecRegistry 标记为 broad_action_tool。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 970 | <code>中期：将常用 action 拆成窄 direct tools，例如 output_read、artifact_query、pdf_extract_text、web_fetch。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 971 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 973 | <code>4. `tool_search` 只返回 loadable specs，不返回大段能力说明。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 974 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 975 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 977 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 978 | <code>tool_search("pdf") 返回可直接调用的 PDF 工具 spec。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 979 | <code>tool_search("web") 返回 web_search/web_fetch specs，但不把 tool_search 解释成网页搜索。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 980 | <code>模型不能对 required 非空工具发 `{}`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 981 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 983 | <code>### Phase 3: MCP Direct Path 收敛</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 984 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 985 | <code>阶段契约：普通任务不再通过 `mcp_bridge.call_tool` 执行 MCP 工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 987 | <code>工作项：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 989 | <code>1. `mcp_bridge` exposure 默认改为 hidden/debug，只有 doctor/admin context 暴露。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 990 | <code>2. MCP `tools/list` 生成 direct namespace specs：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 991 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 992 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 993 | <code>mcp__ailis_research__web_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 994 | <code>mcp__ailis_research__web_fetch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 995 | <code>mcp__ailis_research__pdf_extract_text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 996 | <code>...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 997 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 998 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 999 | <code>3. 对 direct MCP tool 做 schema validator：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1001 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1002 | <code>required 必须满足。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1003 | <code>additionalProperties false 时拒绝未知字段。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1004 | <code>空 args 只有 schema 无 required 且工具允许时才执行。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1005 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1007 | <code>4. MCP tool output 统一进入 OutputStore + EvidenceStore。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1008 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1009 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1010 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1011 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1012 | <code>普通任务 transcript 中不出现 mcp_bridge.call_tool。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1013 | <code>错误参数会产生 structured validation error。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1014 | <code>web_fetch(PDF) 返回 unsupported_content_type，并返回 nextToolHint=pdf_extract_text。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1015 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1017 | <code>### Phase 4: Unified Exec 与 Output Store 语义内嵌</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>阶段契约：解决长程任务中 stdout/stderr 丢失、截断不可追、脚本运行后 finalizer 看不到证据的问题。这里的 Output Store 是现有 runtime 的内部语义，不新增正式模块。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1020 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1021 | <code>现有落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1023 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1024 | <code>electron/ailis-tool-executor.cjs: executeToolStep 统一写入 step trace。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1025 | <code>electron/ailis-tool-runtime.cjs: normalizeToolOutput / dispatch 包装 outputId、preview、complete、truncatedForModel。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1026 | <code>electron/ailis-context-manager.cjs: recordItems / forPrompt 只把 preview + outputId 放入模型上下文。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1027 | <code>electron/ailis-evidence-artifacts.cjs: 将可引用输出升级为 evidence artifact。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1028 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1029 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1030 | <code>工具语义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1032 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1033 | <code>exec_command / write_stdin 继续沿用现有入口。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1034 | <code>output_search 继续沿用现有 runtime tool，并补齐 outputId 引用能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1035 | <code>output_tail / output_summary 如已有入口则加固；没有入口时先不新增工具，先让 output_search 覆盖最小闭环。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1036 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1038 | <code>输出 contract：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1039 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1040 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1041 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1042 | <code>  "schema": "ailis.output_observation.v1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1043 | <code>  "status": "completed&#124;failed&#124;running&#124;timeout&#124;permission_required",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1044 | <code>  "outputId": "out_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1045 | <code>  "wallTimeMs": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1046 | <code>  "exitCode": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1047 | <code>  "sessionId": null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1048 | <code>  "stdoutBytes": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1049 | <code>  "stderrBytes": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1050 | <code>  "stdoutLines": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1051 | <code>  "stderrLines": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1052 | <code>  "preview": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1053 | <code>  "complete": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1054 | <code>  "truncatedForModel": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1055 | <code>  "nextTools": []</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1056 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1057 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1060 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1061 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1062 | <code>运行输出 1MB 的脚本，模型只看到 preview + outputId。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1063 | <code>output_search 能找到中间答案。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1064 | <code>Agent Lab 可查看完整输出。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1065 | <code>Finalizer 可引用 outputId/evidenceId。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1066 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1067 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1068 | <code>### Phase 5: Context Compiler 与 Evidence Manifest</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1069 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1070 | <code>阶段契约：上下文压缩不再靠“把文本截短”，而是编译出一份稳定上下文包。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1071 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1072 | <code>Context package：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1073 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1074 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1075 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1076 | <code>  "runtimeEnvironment": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1077 | <code>  "taskState": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1078 | <code>  "recentResponseItems": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1079 | <code>  "pinnedEvidenceManifest": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1080 | <code>  "availableOutputIds": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1081 | <code>  "toolSummary": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1082 | <code>  "budgetReport": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1083 | <code>  "droppedItemsManifest": []</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1084 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1085 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1086 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1087 | <code>工作项：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1089 | <code>1. ContextManager 增加 token accounting。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1090 | <code>2. `forPrompt()` 输出 ResponseItem list + manifest。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1091 | <code>3. tool output compaction 只压缩模型视图，不删除 trace/evidence。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1092 | <code>4. `ensureCallOutputsPresent()` 和 `removeOrphanOutputs()` 放到 compiler 阶段。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1093 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1094 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1096 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1097 | <code>连续 30 轮工具调用后，模型上下文仍包含 pinned evidence manifest。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1098 | <code>旧输出被 compact 后，仍可用 outputId/artifactId 回查。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1099 | <code>call/output 配对不丢失。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1100 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1102 | <code>### Phase 5.1: 上下文管控确定性实现蓝图</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1104 | <code>本节替代所有非契约性描述。实现时不新增正式模块；只修改现有模块内部函数。若代码实现和本节冲突，以本节伪代码为准。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1106 | <code>确定性评估：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1108 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1109 | <code>当前文档可实现把握：80%。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1110 | <code>剩余不确定性来自：不同模型实际上下文窗口、provider 是否返回真实 token usage、现有 output store 语义是否能无痛承载所有工具输出、旧 transcript replay 覆盖是否足够。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1111 | <code>把握提升条件：先实现本节 6 个单元测试，再跑 2-3 条旧失败链路 replay。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1112 | <code>不得直接进入 GAIA 大规模循环：除非 context budget、large output、finalizer gate 三组测试都通过。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1113 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1115 | <code>#### 5.1.1 Codex 源码算法映射</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1117 | <code>这些是 AILIS 要照搬思想的 Codex 本地源码位置，不是泛泛参考。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1119 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1120 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1121 | <code>- record_items: 只记录 API/message/tool 所需 ResponseItem，并在写入时按 truncation policy 处理工具输出。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1122 | <code>- for_prompt: 发送给模型前运行 normalize_history，输出模型可见 ResponseItem。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1123 | <code>- estimate_token_count: base instructions + items token 估算。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1124 | <code>- remove_first_item/drop_last_n_user_turns: 删除历史时按 call/output 和 user turn 边界维护一致性。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1125 | <code>- truncate_function_output_payload: 工具输出在进入历史时即被预算化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1127 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\context_manager\normalize.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1128 | <code>- ensure_call_outputs_present: call 缺 output 时插入稳定 synthetic output。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1129 | <code>- remove_orphan_outputs: output 没有对应 call 时移除或诊断。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1130 | <code>- remove_corresponding_for: 删除 call 或 output 时同步删除另一半。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1131 | <code>- strip_images_when_unsupported: 模型不支持图片时替换为占位文本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1133 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\session\context_window.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1134 | <code>- context_window_token_status: active_context_tokens、auto_compact_scope_tokens、tokens_until_compaction、token_limit_reached。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1135 | <code>- AutoCompactTokenLimitScope::BodyAfterPrefix: 静态前缀和动态 body 分开计算。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1137 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\unified_exec\head_tail_buffer.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1138 | <code>- HeadTailBuffer: 大输出保留 head 和 tail，中间丢弃，记录 omitted_bytes。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1140 | <code>F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\tools\context.rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1141 | <code>- ExecCommandToolOutput: 输出保留 raw_output、wall_time、exit_code、max_output_tokens、original_token_count。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1142 | <code>- formatted_output: 按 truncation policy 生成模型可见文本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1143 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1145 | <code>#### 5.1.2 AILIS 修改范围</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1147 | <code>只修改以下现有文件中的函数，不新增正式 Harness 模块。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1149 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1150 | <code>electron/ailis-runtime-budget.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1151 | <code>electron/ailis-tool-result.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1152 | <code>electron/ailis-tool-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1153 | <code>electron/ailis-context-manager.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1154 | <code>electron/ailis-evidence-artifacts.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1155 | <code>electron/ailis-agent-runner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1156 | <code>scripts/run-gaia-level1-lite.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1157 | <code>scripts/run-ailis-gaia-auto-optimizer.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1158 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1160 | <code>#### 5.1.3 `ailis-runtime-budget.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1162 | <code>函数契约：提供唯一预算计算入口；任何调用方不得自行计算 70% 压缩阈值。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1164 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1165 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1166 | <code> * Estimate tokens in the same spirit as Codex approx_token_count.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1167 | <code> * Priority:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1168 | <code> * 1. Provider usage/token_info when available.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1169 | <code> * 2. UTF-8 bytes / 4 estimate.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1170 | <code> * 3. chars / 3 fallback only when byte length is unavailable.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1171 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1172 | <code>function approxTokenCount(value) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1173 | <code>  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1174 | <code>  return Math.ceil(Buffer.byteLength(text, 'utf8') / 4);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1175 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1177 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1178 | <code> * Compute a deterministic budget report before every LLM call.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1179 | <code> * This is the AILIS equivalent of Codex context_window_token_status.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1180 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1181 | <code>function buildContextBudgetReport(parts, config) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1182 | <code>  const modelContextWindowTokens =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1183 | <code>    config.modelContextWindowTokens ??</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1184 | <code>    config.providerTokenInfo?.contextWindow ??</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1185 | <code>    32000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1187 | <code>  const reservedCompletionTokens = Math.max(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1188 | <code>    2048,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1189 | <code>    Number(config.maxOutputTokens &#124;&#124; config.max_tokens &#124;&#124; 0)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1190 | <code>  );</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1192 | <code>  const safetyMarginTokens = Math.max(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1193 | <code>    1024,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1194 | <code>    Math.ceil(modelContextWindowTokens * 0.05)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1195 | <code>  );</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1197 | <code>  const effectiveInputLimitTokens =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1198 | <code>    modelContextWindowTokens - reservedCompletionTokens - safetyMarginTokens;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1200 | <code>  const configuredTaskInputBudgetTokens =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1201 | <code>    Number(config.taskInputBudgetTokens &#124;&#124; 0) &#124;&#124; effectiveInputLimitTokens;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1203 | <code>  const targetContextTokens = Math.max(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1204 | <code>    1024,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1205 | <code>    Math.min(effectiveInputLimitTokens, configuredTaskInputBudgetTokens)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1206 | <code>  );</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1208 | <code>  const staticPrefixTokens = approxTokenCount(parts.staticPrefix);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1209 | <code>  const toolSpecsTokens = approxTokenCount(parts.toolSpecs);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1210 | <code>  const taskStateTokens = approxTokenCount(parts.taskState);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1211 | <code>  const pinnedEvidenceTokens = approxTokenCount(parts.pinnedEvidenceManifest);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1212 | <code>  const recentItemsTokens = approxTokenCount(parts.recentResponseItems);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1213 | <code>  const toolOutputPreviewTokens = approxTokenCount(parts.toolOutputPreviews);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1214 | <code>  const droppedManifestTokens = approxTokenCount(parts.droppedItemsManifest);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>  const modelVisibleTokensEstimate =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1217 | <code>    staticPrefixTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1218 | <code>    toolSpecsTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1219 | <code>    taskStateTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1220 | <code>    pinnedEvidenceTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1221 | <code>    recentItemsTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1222 | <code>    toolOutputPreviewTokens +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1223 | <code>    droppedManifestTokens;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1225 | <code>  const activeContextTokens =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1226 | <code>    Number(config.providerTokenInfo?.activeContextTokens) &#124;&#124;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1227 | <code>    modelVisibleTokensEstimate;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1229 | <code>  const budgetUsedRatio = modelVisibleTokensEstimate / targetContextTokens;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1230 | <code>  const tokensUntilCompaction =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1231 | <code>    Math.floor(targetContextTokens * 0.70 - modelVisibleTokensEstimate);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1233 | <code>  return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1234 | <code>    schema: 'ailis.context_budget_report.v1',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1235 | <code>    estimateSource: config.providerTokenInfo ? 'provider_usage' : 'utf8_bytes_div_4',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1236 | <code>    modelContextWindowTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1237 | <code>    reservedCompletionTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1238 | <code>    safetyMarginTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1239 | <code>    effectiveInputLimitTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1240 | <code>    targetContextTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1241 | <code>    staticPrefixTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1242 | <code>    toolSpecsTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1243 | <code>    taskStateTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1244 | <code>    pinnedEvidenceTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1245 | <code>    recentItemsTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1246 | <code>    toolOutputPreviewTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1247 | <code>    droppedManifestTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1248 | <code>    modelVisibleTokensEstimate,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1249 | <code>    activeContextTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1250 | <code>    budgetUsedRatio,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1251 | <code>    tokensUntilCompaction,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1252 | <code>    compactionLevel: classifyCompactionLevel(budgetUsedRatio, effectiveInputLimitTokens)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1253 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1254 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1256 | <code>function classifyCompactionLevel(ratio, effectiveInputLimitTokens) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1257 | <code>  if (effectiveInputLimitTokens &lt; 4096) return 'stop';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1258 | <code>  if (ratio &gt;= 0.80) return 'stop';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1259 | <code>  if (ratio &gt;= 0.70) return 'hard';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1260 | <code>  if (ratio &gt;= 0.65) return 'precompact';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1261 | <code>  if (ratio &gt;= 0.50) return 'soft';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1262 | <code>  return 'none';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1263 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1264 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>预算分账硬规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1268 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1269 | <code>toolSpecsTokens &gt; targetContextTokens * 0.15 -&gt; hide deferred specs, keep tool_search only.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1270 | <code>pinnedEvidenceTokens &gt; targetContextTokens * 0.25 -&gt; compress evidence summaries, never drop ids.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1271 | <code>recentItemsTokens &gt; targetContextTokens * 0.30 -&gt; keep latest 2-4 call/output pairs, compact older pairs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1272 | <code>toolOutputPreviewTokens &gt; targetContextTokens * 0.20 -&gt; convert old previews to output refs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1273 | <code>droppedManifestTokens &gt; targetContextTokens * 0.05 -&gt; keep only ids/reasons/recovery tool, drop prose.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1274 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1276 | <code>#### 5.1.4 `ailis-runtime-budget.cjs` Head/Tail 伪代码</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1278 | <code>Codex `HeadTailBuffer` 的策略必须替代大输出的 middle truncate。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1280 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1281 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1282 | <code> * Keep stable head and tail, drop the middle.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1283 | <code> * Used for command output, logs, HTML, long JSON text, transcript text.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1284 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1285 | <code>function makeHeadTailPreview(text, maxChars) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1286 | <code>  const source = String(text &#124;&#124; '').replace(/\r\n/g, '\n');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1287 | <code>  if (source.length &lt;= maxChars) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1288 | <code>    return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1289 | <code>      text: source,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1290 | <code>      truncatedForModel: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1291 | <code>      omittedChars: 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1292 | <code>      originalTextChars: source.length,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1293 | <code>      visibleTextChars: source.length</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1294 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1295 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1297 | <code>  const marker = '\n... [middle omitted for model budget] ...\n';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1298 | <code>  const remaining = Math.max(0, maxChars - marker.length);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1299 | <code>  const headChars = Math.ceil(remaining * 0.55);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1300 | <code>  const tailChars = remaining - headChars;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1301 | <code>  const head = source.slice(0, headChars);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1302 | <code>  const tail = tailChars &gt; 0 ? source.slice(-tailChars) : '';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1304 | <code>  return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1305 | <code>    text: [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1306 | <code>      'OUTPUT_TRUNCATED_FOR_MODEL: true',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1307 | <code>      `originalTextChars=${source.length}`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1308 | <code>      `visibleTextChars&lt;=${maxChars}`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1309 | <code>      `omittedChars=${source.length - head.length - tail.length}`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1310 | <code>      '--- head ---',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1311 | <code>      head,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1312 | <code>      '--- omitted middle ---',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1313 | <code>      marker.trim(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1314 | <code>      '--- tail ---',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1315 | <code>      tail</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1316 | <code>    ].join('\n'),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1317 | <code>    truncatedForModel: true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1318 | <code>    omittedChars: source.length - head.length - tail.length,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1319 | <code>    originalTextChars: source.length,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1320 | <code>    visibleTextChars: head.length + tail.length</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1321 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1322 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1323 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1325 | <code>#### 5.1.5 `ailis-tool-result.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1327 | <code>函数契约：工具输出出生时必须变成预算化 observation；禁止先把 1MB 文本塞进 `ContextManager` 后再补救。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1329 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1330 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1331 | <code> * Normalize every tool output into a model-safe observation.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1332 | <code> * Raw/full output is not placed in model text when it exceeds budget.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1333 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1334 | <code>function normalizeAilisToolOutput(result, { toolId, outputStore, evidenceStore }) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1335 | <code>  const raw = coerceToolResult(result);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1336 | <code>  const rawText = extractPrimaryText(raw);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1337 | <code>  const rawBytes = Buffer.byteLength(rawText, 'utf8');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1338 | <code>  const rawLines = rawText ? rawText.split(/\r?\n/).length : 0;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1339 | <code>  const approxOriginalTokens = approxTokenCount(rawText);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1341 | <code>  const shouldExternalize =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1342 | <code>    rawBytes &gt; 6000 &#124;&#124;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1343 | <code>    rawLines &gt; 120 &#124;&#124;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1344 | <code>    approxOriginalTokens &gt; 1500 &#124;&#124;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1345 | <code>    containsLargeStructuredPayload(raw.structuredContent);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1347 | <code>  let outputRef = null;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1348 | <code>  if (shouldExternalize) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1349 | <code>    outputRef = outputStore.write({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1350 | <code>      toolId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1351 | <code>      rawText,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1352 | <code>      structuredContent: raw.structuredContent,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1353 | <code>      rawBytes,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1354 | <code>      rawLines,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1355 | <code>      approxOriginalTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1356 | <code>      hash: sha256(rawText)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1357 | <code>    });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1358 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1360 | <code>  const preview = makeHeadTailPreview(rawText, shouldExternalize ? 6000 : 12000);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1362 | <code>  return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1363 | <code>    content: [{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1364 | <code>      type: 'text',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1365 | <code>      text: renderObservationText({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1366 | <code>        status: raw.status,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1367 | <code>        toolId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1368 | <code>        outputId: outputRef?.outputId ?? null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1369 | <code>        complete: raw.complete !== false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1370 | <code>        truncatedForModel: preview.truncatedForModel,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1371 | <code>        originalTokens: approxOriginalTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1372 | <code>        preview: preview.text,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1373 | <code>        nextTools: outputRef ? ['output_read', 'output_tail', 'output_search'] : []</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1374 | <code>      })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1375 | <code>    }],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1376 | <code>    isError: raw.isError === true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1377 | <code>    details: compactDetails(raw.details),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1378 | <code>    structuredContent: compactStructuredContent(raw.structuredContent),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1379 | <code>    outputRef,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1380 | <code>    modelBudget: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1381 | <code>      status: 'compacted',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1382 | <code>      rawBytes,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1383 | <code>      rawLines,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1384 | <code>      approxOriginalTokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1385 | <code>      visibleTextChars: preview.visibleTextChars,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1386 | <code>      truncatedForModel: preview.truncatedForModel</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1387 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1388 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1389 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1390 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1392 | <code>#### 5.1.6 `ailis-tool-runtime.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1394 | <code>运行契约：所有 runtime tool 和 direct MCP tool 必须走同一校验、输出预算、证据生成路径。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1396 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1397 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1398 | <code> * Dispatch one tool call.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1399 | <code> * Contract validation happens before handler execution.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1400 | <code> * Output normalization happens after handler execution.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1401 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1402 | <code>async function dispatch(toolId, args, context) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1403 | <code>  const tool = resolveToolOrDirectMcp(toolId);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1404 | <code>  if (!tool) return toolError('not_materialized');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1406 | <code>  const validation = validateToolContract(toolId, args);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1407 | <code>  if (!validation.ok) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1408 | <code>    return normalizedValidationObservation(validation);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1409 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1411 | <code>  const startedAt = Date.now();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1412 | <code>  try {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1413 | <code>    const rawResult = await tool.handle(validation.args, context);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1414 | <code>    const normalized = normalizeAilisToolOutput(rawResult, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1415 | <code>      toolId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1416 | <code>      outputStore: context.outputStore,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1417 | <code>      evidenceStore: context.evidenceStore</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1418 | <code>    });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1419 | <code>    normalized.trace = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1420 | <code>      toolId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1421 | <code>      durationMs: Date.now() - startedAt,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1422 | <code>      argsDigest: digestArgs(validation.args),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1423 | <code>      status: normalized.isError ? 'failed' : 'completed'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1424 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1425 | <code>    return normalized;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1426 | <code>  } catch (error) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1427 | <code>    return normalizeAilisToolOutput(toolExceptionToResult(error), { toolId });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1428 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1429 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1430 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1432 | <code>#### 5.1.7 `ailis-context-manager.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1434 | <code>函数契约：`ContextManager` 保存 ResponseItem 历史；`forPrompt()` 必须编译 context package，禁止只返回 raw history 的浅拷贝。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1436 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1437 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1438 | <code> * Record model/API items.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1439 | <code> * Tool outputs are processed immediately with model-visible truncation.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1440 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1441 | <code>ContextManager.prototype.recordItems = function(items, policy) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1442 | <code>  for (const item of items) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1443 | <code>    if (!isResponseItemLike(item)) continue;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1444 | <code>    this.items.push(this.processItem(item, policy));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1445 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1446 | <code>  this.history_version += 1;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1447 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1449 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1450 | <code> * Prepare input for the next model call.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1451 | <code> * Algorithm mirrors Codex ContextManager::for_prompt + normalize_history,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1452 | <code> * but returns a package that can be rendered into ResponseItems.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1453 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1454 | <code>ContextManager.prototype.forPrompt = function(options) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1455 | <code>  const work = this.clone();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1456 | <code>  work.normalizeHistory(options.inputModalities);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1458 | <code>  let pkg = work.buildContextPackage(options);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1459 | <code>  let budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1461 | <code>  if (budget.compactionLevel === 'soft') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1462 | <code>    work.compactExploratoryToolOutputs({ stalePreviewChars: 1200 });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1463 | <code>    pkg = work.buildContextPackage(options);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1464 | <code>    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1465 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1467 | <code>  if (budget.compactionLevel === 'precompact') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1468 | <code>    work.compactOldTurnsToDroppedManifest({ keepRecentPairs: 4 });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1469 | <code>    work.compressEvidenceSummaries({ keepIds: true });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1470 | <code>    pkg = work.buildContextPackage(options);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1471 | <code>    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1472 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1474 | <code>  if (budget.compactionLevel === 'hard') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1475 | <code>    work.keepOnlyMinimalPromptState({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1476 | <code>      keepRecentPairs: 2,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1477 | <code>      keepLatestFailure: true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1478 | <code>      keepPinnedEvidence: true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1479 | <code>      keepOutputRefs: true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1480 | <code>    });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1481 | <code>    pkg = work.buildContextPackage(options);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1482 | <code>    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1483 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1485 | <code>  if (budget.compactionLevel === 'stop') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1486 | <code>    return renderBlockedContextPackage({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1487 | <code>      reason: 'context_budget_exhausted',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1488 | <code>      budget,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1489 | <code>      checkpoint: work.toCheckpoint()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1490 | <code>    });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1491 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1493 | <code>  pkg.budgetReport = budget;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1494 | <code>  return renderContextPackageAsResponseItems(pkg);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1495 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1496 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1498 | <code>#### 5.1.8 `ContextManager.normalizeHistory`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1500 | <code>Codex 对应 `normalize.rs`，AILIS 必须保持同样不变量。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1502 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1503 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1504 | <code> * Invariants after normalizeHistory:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1505 | <code> * 1. Every tool/function/custom/tool_search call has exactly one output.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1506 | <code> * 2. No orphan output remains unless it is a server tool_search output.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1507 | <code> * 3. If model does not support images, image payloads become placeholder text.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1508 | <code> * 4. Removing an item never leaves its call/output counterpart behind.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1509 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1510 | <code>ContextManager.prototype.normalizeHistory = function(inputModalities) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1511 | <code>  this.ensureCallOutputsPresent();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1512 | <code>  this.removeOrphanOutputs();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1513 | <code>  if (!supportsImages(inputModalities)) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1514 | <code>    this.stripImagesWhenUnsupported();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1515 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1516 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1517 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1519 | <code>#### 5.1.9 `ContextManager.buildContextPackage`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1521 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1522 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1523 | <code> * Build a precise state package, not a transcript dump.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1524 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1525 | <code>ContextManager.prototype.buildContextPackage = function(options) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1526 | <code>  const pairs = collectCallOutputPairs(this.items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1527 | <code>  const latestFailure = findLatestFailure(pairs);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1528 | <code>  const recentPairs = takeRecentPairs(pairs, options.keepRecentPairs ?? 4);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1529 | <code>  const pinnedEvidence = collectPinnedEvidence(this.items, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1530 | <code>    maxItems: options.maxPinnedEvidence ?? 24,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1531 | <code>    maxSummaryChars: 700</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1532 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1533 | <code>  const outputRefs = collectAvailableOutputRefs(this.items, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1534 | <code>    maxRefs: options.maxOutputRefs ?? 48</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1535 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1536 | <code>  const dropped = this.droppedItemsManifest ?? [];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1538 | <code>  return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1539 | <code>    schema: 'ailis.context_package.v1',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1540 | <code>    goal: options.goal,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1541 | <code>    runtimeEnvironment: options.runtimeEnvironment,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1542 | <code>    taskState: inferTaskState({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1543 | <code>      latestFailure,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1544 | <code>      pinnedEvidence,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1545 | <code>      recentPairs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1546 | <code>      userGoal: options.goal</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1547 | <code>    }),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1548 | <code>    recentResponseItems: flattenPairs(recentPairs),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1549 | <code>    pinnedEvidenceManifest: pinnedEvidence,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1550 | <code>    availableOutputRefs: outputRefs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1551 | <code>    toolSummary: options.toolSummary,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1552 | <code>    droppedItemsManifest: compactDroppedManifest(dropped),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1553 | <code>    parts: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1554 | <code>      staticPrefix: options.staticPrefix,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1555 | <code>      toolSpecs: options.toolSummary,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1556 | <code>      taskState: inferTaskState(...),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1557 | <code>      pinnedEvidenceManifest: pinnedEvidence,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1558 | <code>      recentResponseItems: flattenPairs(recentPairs),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1559 | <code>      toolOutputPreviews: collectVisibleToolPreviews(recentPairs),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1560 | <code>      droppedItemsManifest: compactDroppedManifest(dropped)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1561 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1562 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1563 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1564 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1565 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1566 | <code>#### 5.1.10 Context package 保留规则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1568 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1569 | <code>MUST_KEEP:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1570 | <code>- latest user goal and explicit constraints</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1571 | <code>- output format/unit/language requirements</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1572 | <code>- pending call/output pairs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1573 | <code>- latest failed tool call and failure layer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1574 | <code>- latest successful evidence-producing observation</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1575 | <code>- pinnedEvidenceManifest ids and summaries</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1576 | <code>- availableOutputRefs for every externalized output used by evidence</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1577 | <code>- active permission/env/provider blocker</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>CAN_COMPACT:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1580 | <code>- old exploratory tool outputs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1581 | <code>- repeated search/fetch attempts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1582 | <code>- old tool specs reloadable through tool_search</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1583 | <code>- persona/UI/chitchat text unrelated to task</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1584 | <code>- raw observation already covered by evidence manifest</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1586 | <code>CAN_DROP_WITH_MANIFEST:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1587 | <code>- old raw output with outputId/artifactId</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1588 | <code>- abandoned failed path after replacement strategy exists</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1589 | <code>- old intermediate reasoning text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1590 | <code>- old capability catalog entries reloadable by tool_search</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1592 | <code>NEVER_DROP:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1593 | <code>- current user request</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1594 | <code>- final answer format constraints</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1595 | <code>- evidence summary needed by current answer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1596 | <code>- call without output / output without call</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1597 | <code>- unresolved blocker</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1598 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1600 | <code>#### 5.1.11 Finalizer gate 伪代码</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1602 | <code>运行契约：Finalizer 必须按 evidencePolicy 分级；普通任务不得被 strict 证据门槛误卡，GAIA/exact-answer 不得低置信提交。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1604 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1605 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1606 | <code> * Classify how much evidence is required for this task.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1607 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1608 | <code>function classifyEvidencePolicy(task) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1609 | <code>  if (task.exactAnswerMode &#124;&#124; task.autoSubmit &#124;&#124; task.benchmark === 'GAIA') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1610 | <code>    return 'strict';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1611 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1612 | <code>  if (task.highRiskFact &#124;&#124; task.requiresExternalEvidence) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1613 | <code>    return 'required';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1614 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1615 | <code>  if (task.localCodeChange &#124;&#124; task.localFileGeneration &#124;&#124; task.testRun) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1616 | <code>    return 'local_verification';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1617 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1618 | <code>  if (task.creative &#124;&#124; task.brainstorming &#124;&#124; task.userAsksForOpinion) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1619 | <code>    return 'not_required';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1620 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1621 | <code>  return 'preferred';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1622 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1624 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1625 | <code> * Finalizer returns one of:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1626 | <code> * final &#124; allow_with_caveat &#124; continue &#124; ask_user &#124; blocked</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1627 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1628 | <code>function finalizerGate(candidate, contextPackage) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1629 | <code>  const evidencePolicy = classifyEvidencePolicy(contextPackage.taskState);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1630 | <code>  const formatOk = validateAnswerFormat(candidate, contextPackage.taskState);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1631 | <code>  if (!formatOk.ok) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1632 | <code>    return continueWithFix('answer_format_invalid', formatOk);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1633 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1635 | <code>  const coverage = evaluateEvidenceCoverage({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1636 | <code>    answer: candidate.answer,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1637 | <code>    evidenceManifest: contextPackage.pinnedEvidenceManifest,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1638 | <code>    outputRefs: contextPackage.availableOutputRefs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1639 | <code>    localVerification: contextPackage.taskState.localVerification</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1640 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1642 | <code>  if (evidencePolicy === 'strict') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1643 | <code>    if (candidate.confidence === 'low') return continueOrBlocked('low_confidence');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1644 | <code>    if (coverage.status !== 'complete') return continueOrBlocked('strict_evidence_missing');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1645 | <code>    return final(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1646 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1647 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1648 | <code>  if (evidencePolicy === 'required') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1649 | <code>    if (coverage.status === 'complete') return final(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1650 | <code>    if (coverage.hasLowCostNextStep) return continueWithTool(coverage.nextToolHint);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1651 | <code>    return allowWithCaveat(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1652 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1653 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1654 | <code>  if (evidencePolicy === 'local_verification') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1655 | <code>    if (coverage.localDiffOrTestOrOutputRef) return final(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1656 | <code>    if (contextPackage.taskState.completedLocally) return allowWithCaveat(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1657 | <code>    return continueWithTool('run focused local verification');</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1658 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1660 | <code>  if (evidencePolicy === 'not_required') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1661 | <code>    return final(candidate, { status: 'not_required' });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1662 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1664 | <code>  if (coverage.status === 'complete' &#124;&#124; coverage.status === 'partial') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1665 | <code>    return finalOrCaveat(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1666 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1667 | <code>  if (coverage.hasLowCostNextStep) return continueWithTool(coverage.nextToolHint);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1668 | <code>  return allowWithCaveat(candidate, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1669 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1670 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1672 | <code>Blocked 只允许在以下条件出现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1674 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1675 | <code>- permission/env/provider blocker prevents progress</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1676 | <code>- user decision is required</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1677 | <code>- strict evidence is missing and no low-cost next step exists</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1678 | <code>- minimal context package cannot fit within budget</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1679 | <code>- tool schema/runtime corruption prevents reliable execution</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1680 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1682 | <code>普通用户任务不得因为缺少 evidenceId 自动 blocked。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1683 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1684 | <code>#### 5.1.12 长程任务 checkpoint 伪代码</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1686 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1687 | <code>/**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1688 | <code> * Called after every longrun iteration.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1689 | <code> * Conversation window is only a projector; disk artifacts are source of truth.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1690 | <code> */</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1691 | <code>function persistLongrunIteration(jobDir, iteration, result) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1692 | <code>  writeJson(`${jobDir}/iterations/${iteration}/chain.json`, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1693 | <code>    steps: result.steps,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1694 | <code>    outputRefs: result.outputRefs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1695 | <code>    evidenceRefs: result.evidenceRefs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1696 | <code>    budgetReports: result.budgetReports</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1697 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1699 | <code>  writeJson(`${jobDir}/iterations/${iteration}/verdict.json`, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1700 | <code>    status: result.status,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1701 | <code>    failureLayer: classifyFailureLayer(result),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1702 | <code>    confidence: result.confidence,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1703 | <code>    cost: result.cost,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1704 | <code>    loopCount: result.steps.length</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1705 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1707 | <code>  writeJson(`${jobDir}/iterations/${iteration}/context-package.json`, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1708 | <code>    contextPackage: result.nextContextPackage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1709 | <code>    budgetReport: result.nextContextPackage.budgetReport</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1710 | <code>  });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1712 | <code>  if (result.status !== 'success') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1713 | <code>    writeText(`${jobDir}/iterations/${iteration}/repair-ticket.md`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1714 | <code>      renderRepairTicket(result)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1715 | <code>    );</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1716 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1717 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1718 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1720 | <code>#### 5.1.13 必须先通过的测试</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1722 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1723 | <code>tests/ailis-context-manager-budget.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1724 | <code>- buildContextBudgetReport has deterministic denominator.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1725 | <code>- 70% hard gate triggers before next LLM call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1726 | <code>- minimal context package produces blocked/new-window signal when it cannot fit.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1728 | <code>tests/ailis-tool-output-compaction.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1729 | <code>- 1MB output yields &lt;= 6000 chars model preview.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1730 | <code>- preview contains head, tail, omitted count, outputId, nextTools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1731 | <code>- output_search can recover a middle sentinel string.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1733 | <code>tests/ailis-context-package.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1734 | <code>- 50 tool calls keep call/output pairing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1735 | <code>- latest user request and format constraints are never dropped.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1736 | <code>- old output becomes droppedItemsManifest + outputRef.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1738 | <code>tests/ailis-finalizer-gate.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1739 | <code>- GAIA exact low-confidence answer is rejected.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1740 | <code>- local code/test success can final without web evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1741 | <code>- preferred evidence missing returns allow_with_caveat, not blocked.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1742 | <code>- truncated evidence with sufficient summary can final.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1743 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1745 | <code>#### 5.1.14 实现顺序</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1746 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1747 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1748 | <code>1. ailis-runtime-budget.cjs: buildContextBudgetReport + makeHeadTailPreview。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1749 | <code>2. ailis-tool-result.cjs: normalizeAilisToolOutput 立刻生成 safe preview + outputRef metadata。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1750 | <code>3. ailis-context-manager.cjs: forPrompt 改为 buildContextPackage + budget gate。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1751 | <code>4. ailis-evidence-artifacts.cjs: evidence manifest 只放 ref/summary/coverage/completeness。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1752 | <code>5. ailis-agent-runner.cjs: buildLlmAgentDirectToolPrompt 使用 context package，不再读 raw transcript。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1753 | <code>6. GAIA/LongRun: finalizerGate 使用 evidencePolicy，checkpoint 写 context-package.json。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1754 | <code>7. 跑 5.1.13 测试，再跑旧失败 transcript replay。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1755 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1756 | <code>### Phase 6: FinalizerGate 通用化</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1758 | <code>阶段契约：把 GAIA finalizer 的经验迁移成通用 final gate。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1760 | <code>FinalizerGate 输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1761 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1762 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1763 | <code>user goal</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1764 | <code>answer candidate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1765 | <code>available evidence refs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1766 | <code>evidence manifest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1767 | <code>task type</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1768 | <code>format contract</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1769 | <code>confidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1770 | <code>known blockers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1771 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1773 | <code>FinalizerGate 输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1775 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1776 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1777 | <code>  "ok": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1778 | <code>  "answer": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1779 | <code>  "confidence": "high&#124;medium&#124;low",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1780 | <code>  "evidencePolicy": "strict&#124;required&#124;preferred&#124;not_required&#124;local_verification",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1781 | <code>  "evidenceCoverage": "complete&#124;partial&#124;missing&#124;not_required",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1782 | <code>  "evidenceRefs": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1783 | <code>  "outputRefs": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1784 | <code>  "warnings": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1785 | <code>  "missingFields": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1786 | <code>  "nextAction": "final&#124;allow_with_caveat&#124;continue&#124;ask_user&#124;blocked",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1787 | <code>  "nextToolHint": null</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1788 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1789 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1791 | <code>硬规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1793 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1794 | <code>exact-answer benchmark: low confidence 不提交。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1795 | <code>引用不存在 evidence ref -&gt; strict mode reject；balanced/light mode warning，不必自动 blocked。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1796 | <code>complete=false/truncated=true 的证据不能单独支撑 strict final，但可作为 partial evidence 支撑 allow_with_caveat。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1797 | <code>local_verification 任务可引用 diff/test/outputId/file path 作为证据，不要求网页或外部 evidence。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1798 | <code>工具失败后不能用“猜测”补 strict final；普通用户任务必须明确 caveat 或 ask_user。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1799 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1801 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1803 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1804 | <code>GAIA low-confidence finalizer 不提交空/猜测答案。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1805 | <code>普通用户任务可以带 caveat 回答，但必须标明证据不足。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1806 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1808 | <code>### Phase 7: LongRun Controller 泛化</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1810 | <code>阶段契约：把 GAIA auto optimizer 的模式抽象成通用长期任务框架。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1811 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1812 | <code>沿用并规范现有 longrun 目录契约：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1814 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1815 | <code>longrun/jobs/&lt;job-id&gt;/mission.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1816 | <code>longrun/jobs/&lt;job-id&gt;/acceptance.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1817 | <code>longrun/jobs/&lt;job-id&gt;/loop-policy.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1818 | <code>longrun/jobs/&lt;job-id&gt;/state.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1819 | <code>longrun/jobs/&lt;job-id&gt;/progress.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1820 | <code>longrun/jobs/&lt;job-id&gt;/event-log.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1821 | <code>longrun/jobs/&lt;job-id&gt;/control-queue.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1822 | <code>longrun/jobs/&lt;job-id&gt;/stop.flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1823 | <code>longrun/jobs/&lt;job-id&gt;/iterations/iter-001/plan.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1824 | <code>longrun/jobs/&lt;job-id&gt;/iterations/iter-001/chain.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1825 | <code>longrun/jobs/&lt;job-id&gt;/iterations/iter-001/verdict.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1826 | <code>longrun/jobs/&lt;job-id&gt;/iterations/iter-001/repair-ticket.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1827 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1828 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1829 | <code>Controller loop：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1831 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1832 | <code>read mission/acceptance/policy/state/event-log/control-queue</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1833 | <code>check stop.flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1834 | <code>check active processes / leases</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1835 | <code>select next task or repair</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1836 | <code>run worker</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1837 | <code>collect chain/verdict/artifacts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1838 | <code>classify failure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1839 | <code>update state/progress/event-log</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1840 | <code>sleep or continue</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1841 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1843 | <code>安全策略：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1845 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1846 | <code>maxConcurrentHeavyRuns = 1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1847 | <code>maxConsecutiveFailures</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1848 | <code>maxRepairBacklog</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1849 | <code>maxPaidTasksPerRun</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1850 | <code>stopOnEnvironmentFailure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1851 | <code>stopOnLowBalanceProviderError</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1852 | <code>repairRequired blocks paid continuation unless policy permits backlog mode</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1853 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1855 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1857 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1858 | <code>controller 重启后能从 event-log 恢复。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1859 | <code>heartbeat 只读 progress，不重复启动重任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1860 | <code>出现 provider balance/env failure 时立刻停止付费循环。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1861 | <code>每个失败都有 chain/verdict/repair ticket。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1862 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1863 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1864 | <code>### Phase 8: Replay 和回归测试</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1865 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1866 | <code>阶段契约：每次修复不是“感觉变好”，而是用链路证明。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1868 | <code>测试层级：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1870 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1871 | <code>unit tests: schema/tool/output/evidence/finalizer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1872 | <code>focused replay: 旧失败 transcript</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1873 | <code>canary benchmark: 2-5 道 GAIA 小样本</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1874 | <code>cost guard benchmark: 禁止大规模无闸门循环</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1875 | <code>manual desktop smoke: AILIS 桌面端真实任务</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1876 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1878 | <code>验收命令：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1880 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1881 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1882 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1883 | <code>pnpm test:ailis-agent-execution-flow</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1884 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1885 | <code>pnpm test:ailis-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1886 | <code>node scripts/run-gaia-level1-lite.mjs --max-agent-steps 5 --task-retries 0 --no-submit --task-ids &lt;canary&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1887 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1889 | <code>## 9. 代码级修改矩阵（不新增模块）</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1890 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1891 | <code>这一章是执行口径：不再优先新增 Harness 模块，也不把表层架构重新命名。开发重点是现有模块内部函数的约束、数据结构、状态保存、错误分类和回归测试，让行为更接近 Codex-style Harness。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1892 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1893 | <code>### 9.1 Agent Runner 主循环</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1895 | <code>文件：`electron/ailis-agent-runner.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1897 | <code>&#124; 函数 &#124; 当前职责 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1898 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1899 | <code>&#124; `buildRuntimeEnvironmentPromptObject` &#124; 生成运行环境提示对象 &#124; 固定 runtime snapshot 字段：cwd、shell、权限、网络、日期、工具暴露模式、预算；避免把环境信息散落到自由文本 &#124; 同一环境两次生成结构稳定，测试只比较结构字段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1900 | <code>&#124; `buildEvidenceSufficiencyPromptObject` &#124; 让模型判断证据是否足够 &#124; 输出结构化审计要求：`sufficient/confidence/missing_fields/next_action/evidence_refs`；不要让模型自由发挥成普通回复 &#124; 低证据任务返回 continue 或 ask_user，不直接 final &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1901 | <code>&#124; `buildLlmAgentDirectToolPrompt` &#124; 拼 direct tool prompt &#124; 只放少量核心 direct tools + tool_search；MCP/Web/PDF 通过 tool_search 暴露；不要把所有 schema 塞进 prompt &#124; transcript 中工具说明显著变短，tool_search 能返回可执行 spec &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1902 | <code>&#124; `validateNativeDirectToolCall` &#124; 校验模型工具调用 &#124; 对 required、additionalProperties、空 `{}`、未知工具、桥接工具暴露模式做统一拒绝 &#124; 失败 transcript 不再出现空参数 MCP 调用继续执行 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1903 | <code>&#124; `callLlmAgentDirectToolDecision` &#124; 请求模型下一步动作 &#124; 固定 direct-tool 决策路径，减少 legacy planner 分叉；模型输出无效时进入 repair prompt，而不是硬执行 &#124; 无效 tool call 有 structured validation error 和下一步修复实现要求 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1904 | <code>&#124; `validateAgentToolLoopGuard` &#124; loop 守卫 &#124; 从步数守卫升级为预算、重复搜索、无新证据、同 URL 重抓、低置信 final 的综合守卫 &#124; 5 步任务能早停、追问或给出证据不足，而不是空转 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1905 | <code>&#124; `validateExactAnswerSubmission` &#124; 最终答案校验 &#124; 只保留通用 final answer gate：答案格式、证据引用、置信度、缺失字段；不要写 GAIA/游戏/网页特判 &#124; 普通任务和 GAIA 共享同一类 final gate 语义 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1907 | <code>### 9.2 Tool Contract 严格化</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1909 | <code>文件：`electron/ailis-tool-contracts.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1911 | <code>&#124; 函数/区域 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1912 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1913 | <code>&#124; `validateAgainstSchema` &#124; 补齐 Codex-style schema contract：required 必须满足，`additionalProperties:false` 拒绝未知字段，类型错误返回可读 path &#124; 单测覆盖缺 required、未知字段、类型错误、嵌套对象 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1914 | <code>&#124; `normalizeArgsForContract` &#124; 只做安全、显式、可解释的 normalization；禁止把 `{}` 猜成默认搜索/默认抓取 &#124; `web_search.query`、`web_fetch.url`、`describe_image.path` 缺失时直接拒绝 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1915 | <code>&#124; `validateToolContract` &#124; 返回 structured validation result：`ok/error/path/retryable/suggestedFix` &#124; runner 可以把错误反馈给模型重试，而不是吞掉后继续 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1916 | <code>&#124; `getToolContractPromptText` / `compactSchemaForPrompt` &#124; prompt 中只给必要字段和 required 信息；完整 schema 留在 runtime 校验 &#124; 上下文减少，但校验严格性不下降 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1917 | <code>&#124; `tool_search` contract &#124; 明确 query 必填；tool_search 只搜工具，不承担网页搜索 &#124; `tool_search` 空参数被拒绝，带 query 时返回 deferred/direct tool specs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1918 | <code>&#124; `mcp_bridge` contract &#124; 普通任务默认 hidden/debug；只保留 doctor/admin 兜底 &#124; 正常任务 transcript 不再依赖 bridge 执行 MCP &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1920 | <code>### 9.3 Tool Runtime 与 tool_search</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1922 | <code>文件：`electron/ailis-tool-runtime.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1924 | <code>&#124; 函数/类 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1925 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1926 | <code>&#124; `AILISRuntimeTool.searchInfo` &#124; 输出短 metadata：name、namespace、description、required fields、exposure、score hints &#124; tool_search 返回可加载工具，而不是长说明书 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1927 | <code>&#124; `AILISToolRuntimeRegistry.search` &#124; 按 query 做 deferred tool 检索和重排；优先返回精确工具，再返回相关工具 &#124; `tool_search("web fetch")` 能稳定露出 `web_fetch`，不是泛泛说明 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1928 | <code>&#124; `AILISToolRuntimeRegistry.dispatch` &#124; dispatch 前统一调用 contract validation；失败返回 validation observation，不执行 handler &#124; handler 不再收到 `{}` 或错误字段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1929 | <code>&#124; `dispatchDirectMcpTool` &#124; direct MCP tool 走同一 validator、trace、output normalization &#124; MCP direct path 和 core tool 行为一致 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1930 | <code>&#124; `normalizeToolOutput` &#124; 所有工具输出统一成 `status/preview/outputId/evidenceIds/complete/truncatedForModel/nextTools` &#124; 大输出不直接塞进上下文，完整内容可回查 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1931 | <code>&#124; default registry 的 `tool_search` &#124; 只暴露工具检索语义；搜索网页必须由返回的 `web_search` 工具执行 &#124; 模型不再把 tool_search 当 web search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1932 | <code>&#124; default registry 的 `output_search` &#124; 补强 outputId / artifactId 搜索和摘要 &#124; finalizer 能引用旧输出证据 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1934 | <code>### 9.4 MCP Manager</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1936 | <code>文件：`electron/ailis-mcp-session.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1937 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1938 | <code>&#124; 函数/类 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1939 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1940 | <code>&#124; `schemaPropertyNames` &#124; 更准确抽取 required、properties、additionalProperties、description &#124; MCP spec 进入 tool_search 后不会丢字段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1941 | <code>&#124; `AILISMcpManager.searchToolSpecs` &#124; 返回 Codex-style loadable specs：server、tool、namespace、inputSchema、required、exposure &#124; `tool_search("pdf")` 能返回 `mcp__...__pdf_extract_text` 这类 direct spec &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1942 | <code>&#124; `AILISMcpManager.callTool` &#124; call 前复用严格 schema validation；call 后统一 output normalization &#124; MCP error/timeout/schema error 可分类 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1943 | <code>&#124; direct MCP spec 生成路径 &#124; direct path 是主路径，`mcp_bridge.call_tool` 只作调试兜底 &#124; 普通任务不再通过 bridge 绕过 schema &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1945 | <code>### 9.5 Context Manager</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1947 | <code>文件：`electron/ailis-context-manager.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1949 | <code>&#124; 函数 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1950 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1951 | <code>&#124; `recordItems` &#124; 写入 response item 时保留 call/output 配对、outputId、evidenceId、tool status &#124; replay 可以恢复完整链路 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1952 | <code>&#124; `forPrompt` &#124; 输出上下文包：recent items、pinned evidence manifest、available output ids、budget report、dropped items manifest &#124; 压缩后模型仍知道可引用证据 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1953 | <code>&#124; `truncateFunctionOutputPayload` &#124; 只压缩模型视图，不删除完整输出引用；preview 必须标注 truncated/complete &#124; 大输出不会污染上下文 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1954 | <code>&#124; `ensureCallOutputsPresent` &#124; 把缺失 output 变成 structured diagnostic，不要静默丢失 &#124; transcript 不再有孤儿 tool call &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1955 | <code>&#124; `fromCheckpoint` &#124; 恢复时保留 output/evidence manifest 和预算状态 &#124; 长程任务中断后可继续 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1957 | <code>### 9.6 Evidence Artifacts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1959 | <code>文件：`electron/ailis-evidence-artifacts.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1961 | <code>&#124; 函数 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1962 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1963 | <code>&#124; `artifactEvidencePayload` / `payloadForArtifact` &#124; 区分网页、PDF、截图、命令输出、ASR/TTS、文件读取等证据类型 &#124; finalizer 能判断证据类型和完整性 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1964 | <code>&#124; `confidenceFromText` &#124; 只做弱启发，不替代模型证据判断；置信度来源要标注 &#124; 不把启发式分数当最终事实 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1965 | <code>&#124; `validateEvidenceArtifact` &#124; 校验证据必须有 source、payload、confidence、completeness、createdAt、引用 id &#124; 无效证据不能支撑 final &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1966 | <code>&#124; `createEvidenceArtifact` &#124; tool output 成功后统一生成可引用证据；失败输出只生成 diagnostic evidence &#124; 答案引用的 evidenceId 可追溯 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1967 | <code>&#124; `getEvidenceArtifactsPromptObject` &#124; 给模型一份 evidence manifest，不直接塞入所有原文 &#124; 上下文更短，证据链更稳定 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1968 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1969 | <code>### 9.7 Tool Executor 与 Trace</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1970 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1971 | <code>文件：`electron/ailis-tool-executor.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1973 | <code>&#124; 函数 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1974 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1975 | <code>&#124; `executeToolStep` &#124; step started/finished/error 统一记录 tool name、args digest、validation、duration、outputId、evidenceIds &#124; Agent Lab 和 replay 能还原每步 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1976 | <code>&#124; `executeToolStep` error path &#124; 区分 validation_error、tool_error、timeout、permission_required、environment_error &#124; 自动优化器能按层分类修复 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1977 | <code>&#124; `executeToolStep` result path &#124; 返回给 runner 的永远是 normalized observation &#124; runner 禁止依赖每个工具私有格式 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1979 | <code>### 9.8 GAIA 与 LongRun Harness</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1980 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1981 | <code>文件：`scripts/run-gaia-level1-lite.mjs`、`scripts/run-ailis-gaia-auto-optimizer.mjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1983 | <code>&#124; 函数/区域 &#124; 实现契约 &#124; 验收点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1984 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1985 | <code>&#124; `buildFinalAnswerGate` &#124; 复用通用 final gate 语义：证据 refs、置信度、缺失字段、nextAction &#124; GAIA 不再单独积累一堆特判 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1986 | <code>&#124; `buildEvidenceDigest` &#124; 输入 evidence manifest，而不是从 transcript 文本里猜证据 &#124; evidence digest 可回放、可检查 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1987 | <code>&#124; `finalizeAnswerFromEvidence` &#124; low confidence / missing refs / truncated-only evidence 不提交 &#124; 省 API 钱，避免错误提交 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1988 | <code>&#124; `acceptExactAnswerCandidate` / `acceptEvidenceAnswerCandidate` &#124; 接受条件来自 final gate，不来自任务私有字符串 &#124; 泛化到非 GAIA benchmark &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1989 | <code>&#124; `classifyGaiaResult` &#124; 分类维度固定为 MCP/TOOLS/AGENT/HARNESS/ENV/PROVIDER/DATA &#124; repair ticket 更可执行 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1990 | <code>&#124; `buildRepairTicket` &#124; 自动包含 failing step、tool call、validation error、evidence gap、最小复现命令 &#124; 修复从链路出发，不从答案出发 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1991 | <code>&#124; `shouldContinueAfterVerdict` / `evaluateSafetyGate` &#124; 成本和安全闸门前置：余额/环境失败/连续失败时停止重跑 &#124; 不再烧 API 空转 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1992 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1993 | <code>### 9.9 第一批实现顺序</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1995 | <code>1. 先改 `ailis-tool-contracts.cjs`：让错误参数不能进入工具执行。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1996 | <code>2. 再改 `ailis-tool-runtime.cjs` 和 `ailis-mcp-session.cjs`：让 tool_search 暴露 direct specs，MCP bridge 降级。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1997 | <code>3. 再改 `ailis-context-manager.cjs` 和 `ailis-evidence-artifacts.cjs`：让输出和证据可引用、可压缩、可回放。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1998 | <code>4. 再改 `ailis-agent-runner.cjs`：减少 prompt 堆叠，增强 loop guard 和 final gate。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1999 | <code>5. 最后改 GAIA/LongRun 脚本：把失败分类、repair ticket、成本闸门接到统一 evidence/trace 结构上。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2001 | <code>### 9.10 不做什么</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2002 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2003 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2004 | <code>不新增正式 Harness 模块。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2005 | <code>不重命名表层架构。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2006 | <code>不把 GAIA 某题写成特判。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2007 | <code>不为了一个网页、一个游戏、一个 PDF 源定制 runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2008 | <code>不让“新增工具”替代 schema、context、evidence、trace 的硬化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2009 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2010 | <code>## 10. 禁止事项</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2012 | <code>为了保持泛化，禁止以下优化方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2014 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2015 | <code>不要把 GAIA 某一道题的答案或专门字符串写进 runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2016 | <code>不要把 web_search 写成某个游戏/网站/论文源的特判器。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2017 | <code>不要继续把所有工具 schema 塞进 prompt。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2018 | <code>不要让 finalizer 在 low confidence 下自动提交 benchmark 答案。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2019 | <code>不要让 heartbeat 启动重复 controller。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2020 | <code>不要把完整工具输出塞进模型上下文。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2021 | <code>不要让 persona_output 混进 task evidence。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2022 | <code>不要让 mcp_bridge 成为普通任务主路径。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2023 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2025 | <code>## 11. 最小可交付目标</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2027 | <code>本轮范围固定为以下最小可交付实现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2028 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2029 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2030 | <code>1. 文档与代码级修改矩阵。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2031 | <code>2. tool contracts 严格校验 最小实现。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2032 | <code>3. runtime outputId / evidenceId 引用 最小实现。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2033 | <code>4. MCP bridge exposure 降级，tool_search 返回 direct specs。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2034 | <code>5. 2-3 个旧失败 transcript replay 通过。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2035 | <code>6. GAIA canary 在低步数和低预算下能给出明确 chain/verdict。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2036 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2038 | <code>完成本轮范围后，AILIS 必须具备可恢复、可审计、可控制成本的 Harness 基线。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2039 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2040 | <code>## 12. 一句话架构原则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2041 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2042 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2043 | <code>Runtime owns environment, tools, schemas, outputs, evidence, budgets, state, and recovery.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2044 | <code>Model owns intent, reasoning, next-action choice, and evidence sufficiency judgment.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2045 | <code>AILIS Surface owns warmth, persona, voice, expression, and user experience.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2046 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 2047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2048 | <code>这就是 AILIS 对齐 Codex Harness 的核心契约。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
