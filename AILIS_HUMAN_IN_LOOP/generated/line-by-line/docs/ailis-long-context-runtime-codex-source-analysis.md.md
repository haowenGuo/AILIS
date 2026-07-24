# docs/ailis-long-context-runtime-codex-source-analysis.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：1310
- SHA-256：`3615a756d7c8d7deb9322678381a8d40c5695e49c2cc672f167e0badec946807`
- 可运行副本：[打开源文件](../../../source/docs/ailis-long-context-runtime-codex-source-analysis.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`item_ref`、`processed`、`policy_with_serialization_budget`、`enforces`、`pre_sampling_compact`、`response_item`、`active_context_tokens`、`token_limit_reached`、`token_status`、`reset_client_session`、`history_snapshot`、`history_items`、`summary_suffix`、`summary_text`、`user_messages`、`initial_context`、`reference_context_item`、`state`、`should_inject_full_context`、`context_items`、`exposure`、`spec`、`model_visible_specs`、`search_infos`、`active`、`coverage`、`cleared`、`promptObservations`、`canonicalState`、`reduceArtifactObservation`、`obs`、`artifact`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS 长程任务上下文 Runtime：Codex 源码级分析与开发方案</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-06-30</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>范围：AILIS Agent Loop、Artifact Tools、长程任务执行、上下文压缩、工具结果管理</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>核心目标：基于本机公开/参考 Codex 源码，整理一套可落地的 AILIS 长程任务上下文管理 Runtime，而不是继续依赖零散 prompt 压缩。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## 0. 结论先行</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>AILIS 目前的 `Context Compiler V1` 做到了“把旧工具结果从 prompt 里清掉”，但没有做到 Codex 更关键的部分：在清掉之前，把工具 observation 归约进稳定的 canonical working state。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>因此最近 GAIA XLSX 地图题会失败：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- 模型调用 `artifact_tools.search START`，得到 `START=A1`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- 下一轮调用 `artifact_tools.search END`，得到 `END=I20`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- V1 只保留最新 active observation，于是 `START=A1` 被清成 placeholder。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- 模型又回去查 `START`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- 下一轮 `END=I20` 又被清掉。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- 最终形成 `START/END` 交替搜索，直到 max loop。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>这不是 XLSX adapter 的核心失败，也不是单纯模型超时，而是上下文管理语义错误：清理工具结果之前没有先做 `observation -&gt; working_state` 的状态归约。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>Codex 源码的核心思想可以概括为：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 25 | <code>ResponseItem history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>  -&gt; normalize / truncate at record boundary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>  -&gt; token accounting</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>  -&gt; pre-turn or mid-turn compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  -&gt; replacement history installation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>  -&gt; canonical context reinjection</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>  -&gt; prompt = history.for_prompt() + model_visible_tool_specs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>AILIS 下一版应该变成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 37 | <code>StepResult / ToolObservation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  -&gt; AilisResponseItem history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  -&gt; ObservationReducer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>  -&gt; AilisWorkingState</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>  -&gt; ActiveObservation selection</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>  -&gt; ContextPack / PromptPack</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>  -&gt; optional CompactionCheckpoint</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>不能继续是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 49 | <code>StepResult string</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>  -&gt; 保留最新一个 observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>  -&gt; 旧 observation 清成 placeholder</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>  -&gt; 希望模型自己记得所有事实</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>## 1. 参考源码范围</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>本分析使用本机源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\context_manager\history.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\session\turn.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\session\mod.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\stream_events_utils.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\compact.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\compact_remote.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\compact_remote_v2.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\tools\router.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- `F:\CODEX\openai-codex-reference\codex-rs\core\src\tools\spec_plan.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>AILIS 当前相关源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-context-compiler.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-turn-items.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>Artifact Tools 协议参考：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>- `C:\Users\Lenovo\Documents\New project 9\ARTIFACT_TOOLS_SYSTEM_DESIGN.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>## 2. Codex 源码架构图</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>```mermaid</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 82 | <code>flowchart TB</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  UserInput["UserInput"] --&gt; RunTurn["session::turn::run_turn"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>  RunTurn --&gt; ContextUpdates["record_context_updates_and_set_reference_context_item"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>  ContextUpdates --&gt; History["ContextManager history"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>  RunTurn --&gt; PromptInput["clone_history().for_prompt(...)"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>  PromptInput --&gt; Prompt["Prompt { input, tools, base_instructions }"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>  Prompt --&gt; ModelStream["ModelClientSession.stream"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>  ModelStream --&gt; OutputDone["handle_output_item_done"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>  OutputDone --&gt; History</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>  OutputDone --&gt; ToolFuture["ToolCallRuntime.handle_tool_call"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>  ToolFuture --&gt; ToolOutput["ResponseInputItem"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>  ToolOutput --&gt; History</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>  History --&gt; TokenUsage["token usage accounting"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>  TokenUsage --&gt; CompactCheck["pre/mid turn compact"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>  CompactCheck --&gt; Replacement["replace_compacted_history"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>  Replacement --&gt; History</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>关键点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>- `ContextManager` 是长期上下文的内存模型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `ResponseItem` 是模型可见历史的基本单位。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- 工具调用和工具输出是 history 的一等项，不是拼在一段文本里的日志。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- prompt 构建时用 `history.for_prompt()`，并单独注入 `tools: router.model_visible_specs()`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- compact 不是字符串截断，而是生成并安装 replacement history。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- compact 后通过 `reference_context_item` 决定下一轮是否重注入 canonical initial context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>## 3. Codex 核心源码摘录与解释</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>### 3.1 `ContextManager`：历史不是聊天文本，而是结构化 ResponseItem</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>源码位置：`codex-rs/core/src/context_manager/history.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>关键结构：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 118 | <code>pub(crate) struct ContextManager {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>    /// The oldest items are at the beginning of the vector.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 120 | <code>    items: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>    /// Bumped whenever history is rewritten, such as compaction or rollback.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 122 | <code>    history_version: u64,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>    token_info: Option&lt;TokenUsageInfo&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    /// Reference context snapshot used for diffing and producing model-visible</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 125 | <code>    /// settings update items.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 126 | <code>    reference_context_item: Option&lt;TurnContextItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>- `items` 是模型上下文历史，不是 UI 消息列表。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- `history_version` 标记 compaction/rollback 后的历史重写。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- `token_info` 让 runtime 可以根据真实 token usage 决定是否 compact。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- `reference_context_item` 是“当前系统/环境/权限上下文的基线”，用于决定下一轮只发 diff 还是完整重注入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>AILIS 对应缺口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>- 现在 `stepResults` 只是数组日志，没有正式的 `AilisResponseItem` 历史模型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `context_pack` 是从 `stepResults` 临时编译出来的，不是长期上下文的 canonical record。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- 没有 `reference_context_item` 等价机制来保证压缩后系统/任务上下文重注入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>### 3.2 写入 history 时就处理工具输出，而不是最后粗暴压缩</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>源码位置：`history.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>关键函数：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>pub(crate) fn record_items&lt;I&gt;(&amp;mut self, items: I, policy: TruncationPolicy)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>where</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>    I: IntoIterator,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>    I::Item: std::ops::Deref&lt;Target = ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>    for item in items {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>        let item_ref = item.deref();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>        if !is_api_message(item_ref) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>            continue;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>        let processed = self.process_item(item_ref, policy);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>        self.items.push(processed);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>工具输出处理：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 170 | <code>fn process_item(&amp;self, item: &amp;ResponseItem, policy: TruncationPolicy) -&gt; ResponseItem {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>    let policy_with_serialization_budget = policy * 1.2;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>    match item {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>        ResponseItem::FunctionCallOutput { call_id, output } =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>            ResponseItem::FunctionCallOutput {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>                call_id: call_id.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>                output: truncate_function_output_payload(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>                    output,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>                    policy_with_serialization_budget,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>                ),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>            }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>        ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>- 截断发生在“写入历史边界”，不是 prompt 构建最后一刻随便砍字符串。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 190 | <code>- 截断对象是 `FunctionCallOutputPayload`，保留 call_id 和结构。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 191 | <code>- 后续 prompt 看到的是结构化历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>- `artifact_tools.query` 的 `compactRows` 不能普通字符串中间截断。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 196 | <code>- 对工具输出的压缩必须发生在 adapter/output contract 层，保留行、列、ref、continuation、truncated 标记。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>- `Context Compiler` 只能决定 prompt retention，不应该破坏 observation 结构。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>### 3.3 `for_prompt()` 前会 normalize，保证工具调用链合法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>源码位置：`history.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>关键函数：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 206 | <code>pub(crate) fn for_prompt(mut self, input_modalities: &amp;[InputModality]) -&gt; Vec&lt;ResponseItem&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>    self.normalize_history(input_modalities);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>    self.items</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>normalize 注释：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 215 | <code>/// This function enforces a couple of invariants on the in-memory history:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 216 | <code>/// 1. every call (function/custom) has a corresponding output entry</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 217 | <code>/// 2. every output has a corresponding call entry</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 218 | <code>/// 3. when images are unsupported, image content is stripped from messages and tool outputs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 219 | <code>fn normalize_history(&amp;mut self, input_modalities: &amp;[InputModality]) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>    normalize::ensure_call_outputs_present(&amp;mut self.items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>    normalize::remove_orphan_outputs(&amp;mut self.items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>    normalize::strip_images_when_unsupported(input_modalities, &amp;mut self.items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>- Codex 不允许 prompt 里出现“孤儿工具输出”或“工具调用没有结果”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- 多模态上下文也在这里按模型能力处理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>- `recent_turn_items` 和 `tool_observations` 只是 prompt view，不应该成为唯一历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 234 | <code>- 要增加 `AilisResponseHistory.normalizeForPrompt()`：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 235 | <code>  - 每个 tool_call 必须有 tool_result 或 aborted result。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 236 | <code>  - 每个 tool_result 必须能追溯 call_id/step_id。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>  - artifact render/image observation 在非视觉模型下要降级为 metadata/ref，不要塞图片。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### 3.4 `run_turn`：模型每轮看的是 history snapshot</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>源码位置：`codex-rs/core/src/session/turn.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>关键流程：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 246 | <code>pub(crate) async fn run_turn(...) -&gt; Option&lt;String&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>    let pre_sampling_compact =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>        match run_pre_sampling_compact(&amp;sess, &amp;turn_context, &amp;mut client_session).await {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>            ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>        };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>    sess.record_context_updates_and_set_reference_context_item(turn_context.as_ref())</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>        .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>    let sampling_request_input: Vec&lt;ResponseItem&gt; = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>        sess.clone_history()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>            .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>            .for_prompt(&amp;turn_context.model_info.input_modalities)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>    match run_sampling_request(..., sampling_request_input.clone(), ...).await {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>        ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>- 每轮模型调用前先检查是否需要 compact。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 272 | <code>- 先记录 context updates，再记录用户输入和能力注入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>- prompt input 是 history snapshot，不是现场拼装的巨大任务 JSON。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>AILIS 当前情况：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>- `executeAgentLoop` 每轮从 `events + stepResults + messageHistory + memoryContext` 现场构造 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 278 | <code>- `compileAgentPromptPayloadV1` 只在构造 prompt 的末端做压缩。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 279 | <code>- 缺少“历史先规范化，再生成 prompt view”的层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>- 引入 `AilisContextRuntime`，让 `executeAgentLoop` 不直接以 `stepResults` 为核心构建上下文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>- 每轮顺序应改为：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 285 | <code>  1. record incoming user/context items</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>  2. record previous tool outputs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>  3. reduce observations into working_state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>  4. maybe compact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>  5. build prompt pack from normalized history + working_state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>### 3.5 工具调用结果会立刻进入 history，并触发 follow-up</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>源码位置：`codex-rs/core/src/stream_events_utils.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>模型输出工具调用：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 298 | <code>// The model emitted a tool call; log it, persist the item immediately, and queue the tool execution.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 299 | <code>Ok(Some(call)) =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>    record_completed_response_item(ctx.sess.as_ref(), ctx.turn_context.as_ref(), &amp;item)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>        .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>    let tool_future: InFlightFuture&lt;'static&gt; = Box::pin(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>        ctx.tool_runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>            .clone()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>            .handle_tool_call(call, cancellation_token),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>    );</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>    output.needs_follow_up = true;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>    output.tool_future = Some(tool_future);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>工具 future drain：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 317 | <code>async fn drain_in_flight(...) -&gt; CodexResult&lt;()&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 318 | <code>    while let Some(res) = in_flight.next().await {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>        match res {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>            Ok(response_input) =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>                let response_item = response_input.into();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 322 | <code>                sess.record_conversation_items(&amp;turn_context, std::slice::from_ref(&amp;response_item))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>                    .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>                ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>            }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>            ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 328 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>- 工具调用本身是 history item。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 335 | <code>- 工具结果完成后立刻写 history。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 336 | <code>- `needs_follow_up = true` 表示模型需要看到工具结果后再决策。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 338 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>- `stepResults` 应转成 `ToolCallItem + ToolResultItem`，而不是只有工具结果数组。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 341 | <code>- 工具失败也是 observation，但应该经过 reducer 进入：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 342 | <code>  - latest failure state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 343 | <code>  - retry/suppression state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 344 | <code>  - capability health state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 345 | <code>- 不应靠 prompt 文字反复提醒“失败也是 observation”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>### 3.6 Token 触发 compact：pre-turn 与 mid-turn 都有</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>源码位置：`turn.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>token 状态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 354 | <code>async fn auto_compact_token_status(...) -&gt; AutoCompactTokenStatus {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 355 | <code>    let active_context_tokens = sess.get_total_token_usage().await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>    let token_limit_reached =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 358 | <code>        auto_compact_scope_tokens &gt;= auto_compact_scope_limit &#124;&#124; full_context_window_limit_reached;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 359 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 360 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>pre-sampling compact：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 366 | <code>async fn run_pre_sampling_compact(...) -&gt; CodexResult&lt;PreSamplingCompactResult&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>    let token_status = auto_compact_token_status(sess.as_ref(), turn_context.as_ref()).await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>    if token_status.token_limit_reached {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>        reset_client_session &#124;= run_auto_compact(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>            sess,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>            turn_context,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>            client_session,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>            InitialContextInjection::DoNotInject,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 374 | <code>            CompactionReason::ContextLimit,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>            CompactionPhase::PreTurn,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>        )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>        .await?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 379 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 381 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>mid-turn compact：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 385 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 386 | <code>if token_limit_reached &amp;&amp; needs_follow_up {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 387 | <code>    let reset_client_session = match run_auto_compact(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 388 | <code>        &amp;sess,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>        &amp;turn_context,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>        &amp;mut client_session,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 391 | <code>        InitialContextInjection::BeforeLastUserMessage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 392 | <code>        CompactionReason::ContextLimit,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>        CompactionPhase::MidTurn,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>    .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 396 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>- pre-turn compact：新采样前先整理历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 403 | <code>- mid-turn compact：如果工具调用后还要继续，但上下文超限，先 compact 再继续。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 404 | <code>- mid-turn 需要 `BeforeLastUserMessage`，保证模型继续看见当前任务上下文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>- 不能只用 `MAX_AGENT_LOOP_STEPS` 控制长程任务。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 409 | <code>- 要增加上下文预算状态：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 410 | <code>  - `activePromptChars`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 411 | <code>  - `activeToolObservationChars`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 412 | <code>  - `workingStateChars`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 413 | <code>  - `directToolSchemaChars`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 414 | <code>  - `modelTimeoutRisk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 415 | <code>- 如果需要 follow-up 且 prompt 预算超限，先 compact/reduce，再继续下一轮。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>### 3.7 Compact 不是摘要字符串，而是 replacement history</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>源码位置：`compact.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>本地 compact 关键逻辑：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 424 | <code>let history_snapshot = sess.clone_history().await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 425 | <code>let history_items = history_snapshot.raw_items();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 426 | <code>let summary_suffix = get_last_assistant_message_from_turn(history_items).unwrap_or_default();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 427 | <code>let summary_text = format!("{SUMMARY_PREFIX}\n{summary_suffix}");</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>let user_messages = collect_user_messages(history_items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>let mut new_history = build_compacted_history(Vec::new(), &amp;user_messages, &amp;summary_text);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>if matches!(initial_context_injection, InitialContextInjection::BeforeLastUserMessage) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>    let initial_context = sess.build_initial_context(turn_context.as_ref()).await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>    new_history =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>        insert_initial_context_before_last_real_user_or_summary(new_history, initial_context);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 438 | <code>sess.replace_compacted_history(new_history, reference_context_item, compacted_item)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 439 | <code>    .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 440 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 442 | <code>关键设计：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 444 | <code>- 生成 `summary_text`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 445 | <code>- 保留用户消息的一部分。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 446 | <code>- 构造 `new_history`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 447 | <code>- 必要时重注入 initial context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 448 | <code>- 调用 `replace_compacted_history` 安装新历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>- `prompt_compaction` 不能只是 prompt 字段。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- 要有 `CompactionCheckpoint`：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>  - compacted range</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>  - replacement history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>  - working_state snapshot</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 457 | <code>  - cold_store refs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 458 | <code>  - token/char budget before and after</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 459 | <code>- compact 后，下一轮应以 checkpoint 后的 history 为准。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>### 3.8 Initial context 注入规则非常具体</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>源码位置：`compact.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>源码注释：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 468 | <code>/// Inserts canonical initial context into compacted replacement history at the</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 469 | <code>/// model-expected boundary.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 470 | <code>///</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 471 | <code>/// Placement rules:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 472 | <code>/// - Prefer immediately before the last real user message.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 473 | <code>/// - If no real user messages remain, insert before the compaction summary so</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 474 | <code>///   the summary stays last.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 475 | <code>/// - If there are no user messages, insert before the last compaction item so</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 476 | <code>///   that item remains last (remote compaction may return only compaction items).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 477 | <code>/// - If there are no user messages or compaction items, append the context.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 478 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>- Codex 并不相信“摘要自然会保留所有系统上下文”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 483 | <code>- 它明确知道哪些 context 是 canonical，compact 后要重新放回模型视野。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>- 对 AILIS，canonical context 至少包括：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 488 | <code>  - current user goal</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 489 | <code>  - file attachments metadata</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 490 | <code>  - runtime environment</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 491 | <code>  - active artifact sessions</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 492 | <code>  - artifact working facts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 493 | <code>  - tool exposure state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 494 | <code>  - loop guard state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 495 | <code>  - latest failed tool state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 496 | <code>- 这些不应该被普通摘要吞掉。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>### 3.9 `replace_compacted_history` 会推进 window generation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 500 | <code>源码位置：`session/mod.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 502 | <code>关键函数：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 505 | <code>pub(crate) async fn replace_compacted_history(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 506 | <code>    &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>    items: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>    reference_context_item: Option&lt;TurnContextItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>    compacted_item: CompactedItem,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 510 | <code>) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>    {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 512 | <code>        let mut state = self.state.lock().await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>        state.replace_history(items, reference_context_item.clone());</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>        state.start_next_auto_compact_window();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>    self.persist_rollout_items(&amp;[RolloutItem::Compacted(compacted_item)])</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 518 | <code>        .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>    if let Some(turn_context_item) = reference_context_item {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 520 | <code>        self.persist_rollout_items(&amp;[RolloutItem::TurnContext(turn_context_item)])</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 521 | <code>            .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 522 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>    self.services.model_client.advance_window_generation();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 525 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 526 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>- compact 是 session state 的真实变更。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 531 | <code>- compact 被持久化到 rollout。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 532 | <code>- auto compact window 推进。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 533 | <code>- model client 的 window generation 也推进。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>- `context_pack` 不能只存在于 prompt 里。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 538 | <code>- `.ailis-state/transcripts` 中应持久化 `context_checkpoint` item。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 539 | <code>- Debug replay 应能恢复：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 540 | <code>  - history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>  - working_state</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>  - checkpoint</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 543 | <code>  - cold-store references</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>### 3.10 `reference_context_item` 控制 full context reinjection</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>源码位置：`session/mod.rs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>关键函数：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 552 | <code>pub(crate) async fn record_context_updates_and_set_reference_context_item(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 553 | <code>    &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>    turn_context: &amp;TurnContext,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 556 | <code>    let reference_context_item = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 557 | <code>        let state = self.state.lock().await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 558 | <code>        state.reference_context_item()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 559 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 560 | <code>    let should_inject_full_context = reference_context_item.is_none();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 561 | <code>    let context_items = if should_inject_full_context {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 562 | <code>        self.build_initial_context(turn_context).await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>    } else {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 564 | <code>        self.build_settings_update_items(reference_context_item.as_ref(), turn_context)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 565 | <code>            .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>    state.set_reference_context_item(Some(turn_context_item));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>源码测试：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>`record_context_updates_and_set_reference_context_item_reinjects_full_context_after_clear`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>测试含义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 577 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 578 | <code>- 当 baseline 被清掉，下一轮必须完整重注入 initial context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 579 | <code>- 这和我们现在的问题完全对应：AILIS 清掉 observation 后，没有对应的 working_state/baseline 重注入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 581 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 583 | <code>- 增加 `working_state_reference_version`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 584 | <code>- 如果 prompt compiler 清掉了某类 observation，但 reducer 没有把它写进 working_state，必须禁止清理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 585 | <code>- 如果 checkpoint 重建后 `working_state` 缺 baseline，下一轮必须 full reinjection。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>### 3.11 Tool schema 暴露：direct/deferred，不是压缩坏 schema</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>源码位置：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>- `tools/router.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 592 | <code>- `tools/spec_plan.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>关键结构：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 597 | <code>pub struct ToolRouter {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>    registry: ToolRegistry,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 599 | <code>    model_visible_specs: Vec&lt;ToolSpec&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 601 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>构建 model-visible specs：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 606 | <code>for runtime in &amp;runtimes {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 607 | <code>    let exposure = runtime.exposure();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 608 | <code>    if exposure.is_direct() {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 609 | <code>        let spec = runtime.spec();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 610 | <code>        specs.push(spec_for_model_request(turn_context, exposure, spec));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 611 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 612 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 613 | <code>...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 614 | <code>let model_visible_specs = merge_into_namespaces(specs)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 615 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 617 | <code>deferred tools：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 620 | <code>if let Some(deferred_mcp_tools) = context.deferred_mcp_tools {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 621 | <code>    for tool in deferred_mcp_tools {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 622 | <code>        ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 623 | <code>        planned_tools.add_with_exposure(handler, ToolExposure::Deferred)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 624 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>tool_search：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 631 | <code>let search_infos = planned_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 632 | <code>    .runtimes()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 633 | <code>    .iter()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 634 | <code>    .filter(&#124;executor&#124; executor.exposure() == ToolExposure::Deferred)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 635 | <code>    .filter_map(&#124;executor&#124; executor.search_info())</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 636 | <code>    .collect::&lt;Vec&lt;_&gt;&gt;();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 637 | <code>...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 638 | <code>planned_tools.add(ToolSearchHandler::new(search_infos));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 639 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>源码意义：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 643 | <code>- Codex 不是把所有工具 schema 都塞给模型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 644 | <code>- 直接工具只放必要子集。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 645 | <code>- deferred 工具通过 `tool_search` 暴露。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 646 | <code>- schema 是结构化 tool spec，不是用户 prompt 字符串。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 647 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 648 | <code>AILIS 对应开发要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>- 不要压缩工具 schema 到不可调用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 651 | <code>- `artifact_tools` 这种核心工具应常驻 direct 或高优先级 direct。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 652 | <code>- 大量 MCP/external tools 应 deferred，通过 tool_search 暴露。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 653 | <code>- direct tool validation 必须基于真实本轮 tools 数组。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>## 4. AILIS 当前实现对照</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>### 4.1 当前 Prompt 构建点</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 659 | <code>源码位置：`electron/ailis-agent-runner.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 661 | <code>JSON meta decision 路径：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 663 | <code>- `buildLlmAgentExecutorMessages(...)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 664 | <code>- 构建 `promptPayload`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 665 | <code>- 调用 `compileAgentPromptPayloadV1(promptPayload, { stepResults, events, promptProfile })`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 666 | <code>- 再调用 `compactAgentUserPayloadForLocalModel(...)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 668 | <code>Direct tool 路径：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>- `buildLlmAgentDirectToolMessages(...)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 671 | <code>- 同样构建 `promptPayload`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 672 | <code>- 同样调用 `compileAgentPromptPayloadV1(...)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 673 | <code>- 如果 compact profile，则再压缩 payload</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>Loop 主体：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 677 | <code>- `executeAgentLoop`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 678 | <code>- 每轮根据 `stepResults` 重新构造 prompt</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 679 | <code>- 再调用 LLM decision</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 680 | <code>- 再执行一个 tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 681 | <code>- 把 `stepResult` push 到数组</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>### 4.2 当前 V1 Context Compiler 的关键问题</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>源码位置：`electron/ailis-context-compiler.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>当前逻辑：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 690 | <code>const active = selectActiveObservations(items);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 691 | <code>const coverage = computeObservationCoverage(items, active);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 692 | <code>const cleared = buildClearedObservations(items, active, coverage);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 693 | <code>const promptObservations = active.map(buildPromptObservation);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 694 | <code>const canonicalState = buildCanonicalState(items, active, payload);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 695 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>`buildCanonicalState` 当前只有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 699 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 700 | <code>artifact: latestArtifact ? {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>    sessionId: artifactSessionId(latestArtifact) &#124;&#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 702 | <code>    sheet: artifactSheet(activeItem &#124;&#124; latestArtifact) &#124;&#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 703 | <code>    range: artifactRange(activeItem &#124;&#124; latestArtifact) &#124;&#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>    action: (activeItem &#124;&#124; latestArtifact).action &#124;&#124; null</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 705 | <code>} : null</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 706 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>问题：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>- 没有 artifact facts。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 711 | <code>- 没有 search/query 累积结果。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 712 | <code>- 没有 working state。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 713 | <code>- 没有 `START=A1`、`END=I20`、`usedRange=A1:I20` 这类任务事实。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 714 | <code>- 没有 repeated call state。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 715 | <code>- 没有 observation reducer。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>### 4.3 当前失败的直接机制</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>对 XLSX map 任务：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 721 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 722 | <code>search START -&gt; observation has START=A1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>search END   -&gt; only END active; START cleared</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>search START -&gt; only START active; END cleared</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>search END   -&gt; only END active; START cleared</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 729 | <code>`progress_ledger` 只保留类似：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 732 | <code>artifact_tools:search completed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 733 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>这对模型没有帮助，因为它没有事实值。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 737 | <code>正确机制应该是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 739 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 740 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 741 | <code>  "working_state": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 742 | <code>    "artifact": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 743 | <code>      "sessions": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 744 | <code>        "arts_xxx": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>          "sheets": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 746 | <code>            "Sheet1": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>              "usedRange": "A1:I20",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 748 | <code>              "textCells": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 749 | <code>                "START": ["A1"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 750 | <code>                "END": ["I20"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 751 | <code>              },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 752 | <code>              "queries": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 753 | <code>              "neededNext": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>                "query Sheet1!A1:I20 include values/styles"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 755 | <code>              ]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>            }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 757 | <code>          }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 758 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 759 | <code>      }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 760 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 761 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 762 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 763 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>这里的 `neededNext` 不是硬编码解题器，而是状态提示：已经知道起终点和范围，但还没读范围格子。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>## 5. AILIS Context Runtime 目标架构</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>### 5.1 新增核心模块</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>建议新增或重构为这些模块：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 773 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 774 | <code>electron/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 775 | <code>  ailis-response-history.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 776 | <code>  ailis-context-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 777 | <code>  ailis-observation-reducer.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 778 | <code>  ailis-working-state.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 779 | <code>  ailis-prompt-pack-builder.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 780 | <code>  ailis-compaction-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 781 | <code>  ailis-tool-exposure-planner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 782 | <code>  ailis-context-cold-store.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 783 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>各模块职责：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 787 | <code>`ailis-response-history.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>- 管理 `AilisResponseItem[]`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 790 | <code>- 提供 `recordItems`、`normalizeForPrompt`、`cloneForPrompt`、`replaceHistory`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 791 | <code>- 保证 tool_call/tool_result 成对。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 792 | <code>- 保留 call_id、step_id、tool、args、result ref。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>`ailis-observation-reducer.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>- 把工具 observation 归约进 `AilisWorkingState`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 797 | <code>- 每类工具有 reducer：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 798 | <code>  - `reduceArtifactObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 799 | <code>  - `reduceWebObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 800 | <code>  - `reduceExecObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 801 | <code>  - `reduceEmailObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 802 | <code>  - `reduceFileObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 803 | <code>  - `reduceFailureObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 805 | <code>`ailis-working-state.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>- 存 canonical state。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 808 | <code>- 这是 prompt compaction 后必须保留的状态。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 809 | <code>- 保存 facts，不保存大原文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 811 | <code>`ailis-prompt-pack-builder.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 813 | <code>- 从 history + working_state + active observation + tool exposure 构建 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 814 | <code>- 不直接从原始 `stepResults` 现场猜。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 816 | <code>`ailis-compaction-runtime.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 817 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 818 | <code>- 负责 token/char budget 检测。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 819 | <code>- 生成 `CompactionCheckpoint`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 820 | <code>- 安装 replacement history。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 821 | <code>- 持久化 checkpoint。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>`ailis-context-cold-store.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>- 保存完整工具输出。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 826 | <code>- prompt 里只放 ref。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 827 | <code>- 支持按 ref 恢复具体 observation。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 828 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 829 | <code>`ailis-tool-exposure-planner.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>- 管 direct/deferred 工具暴露。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 832 | <code>- `artifact_tools` 核心保持 direct。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 833 | <code>- MCP/external 大量工具通过 tool_search deferred。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 834 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 835 | <code>### 5.2 核心对象模型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 838 | <code>type AilisResponseItem =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 839 | <code>  &#124; { type: "user_message"; id: string; text: string; createdAt: string }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 840 | <code>  &#124; { type: "assistant_message"; id: string; text: string; phase?: string }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 841 | <code>  &#124; { type: "tool_call"; id: string; callId: string; tool: string; args: object }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 842 | <code>  &#124; { type: "tool_result"; id: string; callId: string; tool: string; ok: boolean; outputRef: ColdStoreRef; observation?: object }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 843 | <code>  &#124; { type: "context_update"; id: string; context: object }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 844 | <code>  &#124; { type: "compaction"; id: string; checkpointId: string; summary: string };</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 845 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 848 | <code>type AilisWorkingState = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 849 | <code>  schema: "ailis_working_state.v1";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 850 | <code>  task: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 851 | <code>    userGoal: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 852 | <code>    exactAnswerMode: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 853 | <code>    status: "active" &#124; "ready_to_answer" &#124; "blocked";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 854 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 855 | <code>  artifacts: Record&lt;string, ArtifactWorkingState&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 856 | <code>  tools: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 857 | <code>    repeatedCalls: Array&lt;{ tool: string; action?: string; signature: string; count: number }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 858 | <code>    latestFailure?: ToolFailureState;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 859 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 860 | <code>  evidence: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 861 | <code>    candidateRefs: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 862 | <code>    rejectedRefs: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 863 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 864 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 865 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 868 | <code>type ArtifactWorkingState = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 869 | <code>  sessionId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 870 | <code>  artifactId?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 871 | <code>  path?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 872 | <code>  format?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 873 | <code>  kind?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 874 | <code>  sheets?: Record&lt;string, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 875 | <code>    usedRange?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 876 | <code>    knownCells?: Record&lt;string, {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 877 | <code>      ref: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 878 | <code>      value?: string &#124; number &#124; boolean &#124; null;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 879 | <code>      formula?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 880 | <code>      fill?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 881 | <code>      sourceObservationId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 882 | <code>    }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 883 | <code>    textIndexFacts?: Record&lt;string, string[]&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>    queriedRanges?: Array&lt;{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 885 | <code>      range: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 886 | <code>      include: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 887 | <code>      truncated: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 888 | <code>      observationId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 889 | <code>    }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 890 | <code>    renderRefs?: Array&lt;{ target: string; imagePath: string; nonblank?: boolean }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 891 | <code>  }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 892 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 893 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 895 | <code>### 5.3 Observation Reducer 规则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 897 | <code>Reducer 是这个 Runtime 的核心。原则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>1. 工具结果进入 prompt 前，必须先被 reducer 看见。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 900 | <code>2. 只要 observation 会被清理，就必须满足以下至少一个条件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 901 | <code>   - 关键信息已经进入 working_state。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 902 | <code>   - 该 observation 被更完整的 active observation 覆盖。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 903 | <code>   - cold store ref 可恢复，且 prompt 中明确提示如何恢复。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 904 | <code>3. `lossless=false` 不能被标成 lossless。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 905 | <code>4. 行列结构不能被字符串中间截断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 906 | <code>5. repeated call 信息要进入 working_state，防止模型反复调用同一个搜索。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 908 | <code>Artifact reducer 示例逻辑：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 909 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 910 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 911 | <code>function reduceArtifactObservation(state, item) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 912 | <code>  const obs = item.artifactObservation;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 913 | <code>  if (!obs) return state;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>  const artifact = upsertArtifactState(state, obs.sessionId, obs);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 917 | <code>  if (item.action === 'open_session') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 918 | <code>    artifact.sessionId = obs.sessionId;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 919 | <code>    artifact.path = obs.path;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 920 | <code>    artifact.format = obs.format;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 921 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 923 | <code>  if (item.action === 'inspect') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 924 | <code>    mergeWorkbookOrSheetInventory(artifact, obs, item.id);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 925 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>  if (item.action === 'search') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 928 | <code>    mergeSearchHitsAsFacts(artifact, obs, item.id);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 929 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>  if (item.action === 'query') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 932 | <code>    mergeRangeRowsAsKnownCells(artifact, obs, item.id);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 933 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>  if (item.action === 'render') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 936 | <code>    mergeRenderRef(artifact, obs, item.id);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 937 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 939 | <code>  return state;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 940 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 941 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>注意：这不是 `solve_map`。Reducer 不解题，只保存工具已经观察到的结构化事实，让模型能在后续轮同时看到事实。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>### 5.4 Prompt Pack Builder</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>Prompt pack 应该分成明确层次：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 949 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 950 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 951 | <code>  "user_goal": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 952 | <code>  "working_state": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 953 | <code>  "recent_history": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 954 | <code>  "active_observations": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 955 | <code>  "cleared_observations": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 956 | <code>  "cold_store_refs": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 957 | <code>  "tool_exposure": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 958 | <code>  "budget_report": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 959 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 960 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 961 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 962 | <code>关键区别：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>- `working_state` 是 canonical。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 965 | <code>- `active_observations` 是当前决策材料。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 966 | <code>- `cleared_observations` 只是索引，不承担证据表达。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 967 | <code>- `recent_history` 只保留最近未归约或需要语义连续性的项。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 968 | <code>- `tool_exposure` 与 tools schema 分离。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>### 5.5 Compaction Checkpoint</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 973 | <code>type CompactionCheckpoint = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 974 | <code>  id: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 975 | <code>  createdAt: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 976 | <code>  trigger: "pre_turn_budget" &#124; "mid_turn_budget" &#124; "manual" &#124; "loop_guard";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 977 | <code>  inputHistoryRange: { fromIndex: number; toIndex: number };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 978 | <code>  replacementHistory: AilisResponseItem[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 979 | <code>  workingStateSnapshot: AilisWorkingState;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 980 | <code>  coldStoreRefs: ColdStoreRef[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 981 | <code>  budgetBefore: PromptBudget;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 982 | <code>  budgetAfter: PromptBudget;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 983 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 984 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 986 | <code>Checkpoint 必须持久化到 transcript：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 987 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 988 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 989 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 990 | <code>  "type": "agent.context_checkpoint",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 991 | <code>  "checkpoint": { "...": "..." }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 992 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 993 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 995 | <code>这样后续 debug/replay 不依赖当前内存。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 997 | <code>## 6. AILIS 开发路线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 998 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 999 | <code>### Phase 1：修正 Context Compiler V1 的语义</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1001 | <code>目标：先解决“清理过度导致模型缺事实”。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1002 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1003 | <code>改动：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>- 在 `ailis-context-compiler.cjs` 增加正式的 `buildWorkingStateFromItems(items, payload)`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1006 | <code>- `buildCanonicalState` 改名或升级为 `buildContextPackState`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1007 | <code>- 对 artifact_tools 增加 reducer：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1008 | <code>  - open_session -&gt; artifact session</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1009 | <code>  - inspect -&gt; workbook/sheet inventory</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1010 | <code>  - search -&gt; text cells/search hits/usedRange</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1011 | <code>  - query -&gt; known cells/ranges/compactRows</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1012 | <code>  - render -&gt; render refs/nonblank diagnostics</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1013 | <code>  - validate -&gt; diagnostics</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1014 | <code>- 清理 observation 前检查 reducer coverage。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1016 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1018 | <code>- 重放失败 transcript，prompt 中同时包含 `START=A1` 和 `END=I20`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1019 | <code>- 不再反复 `search START` / `search END`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1020 | <code>- 不增加 `solve_map` 这类死板工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1022 | <code>### Phase 2：正式引入 AilisResponseHistory</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1023 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1024 | <code>目标：让 history 成为 Runtime 状态，而不是 `stepResults` 临时数组。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1026 | <code>改动：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1028 | <code>- 新建 `ailis-response-history.cjs`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1029 | <code>- `executeAgentLoop` 每轮将 step result 记录成：</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1030 | <code>  - tool_call item</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1031 | <code>  - tool_result item</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1032 | <code>  - runtime_note item</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1033 | <code>- prompt builder 从 `history.cloneForPrompt()` 取上下文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1034 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1035 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1036 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1037 | <code>- tool_result 必须能追溯 tool_call。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1038 | <code>- failed tool result 不会孤立。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1039 | <code>- debug pause/resume 后 history 完整。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1041 | <code>### Phase 3：Compaction Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1043 | <code>目标：从 prompt 末端压缩，升级为 session state 级 compact。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>改动：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1046 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1047 | <code>- 新建 `ailis-compaction-runtime.cjs`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1048 | <code>- 每轮决策前做 budget check。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1049 | <code>- 超限时生成 checkpoint。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1050 | <code>- compact 后安装 replacement history。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1051 | <code>- working_state 不参与普通摘要丢失。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1052 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1053 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>- 长链路任务 prompt 不随 stepResults 线性膨胀。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1056 | <code>- compact 后仍保留 artifact facts。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1057 | <code>- checkpoint 可从 transcript 恢复。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>### Phase 4：Tool Exposure Planner</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1060 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1061 | <code>目标：接近 Codex direct/deferred 工具体系。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1063 | <code>改动：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1065 | <code>- `artifact_tools`、`tool_search`、`update_plan`、必要 file/read 工具保持 direct。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1066 | <code>- MCP/external tools 通过 deferred search 暴露。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1067 | <code>- schema 不进入普通 prompt 文本压缩路径。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1069 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1070 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1071 | <code>- direct tools 的 schema 永远可调用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1072 | <code>- 工具过多不会导致 prompt 超大。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1073 | <code>- 工具搜索命中后下一轮 direct tool 可用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1075 | <code>### Phase 5：Long-run Eval</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1076 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1077 | <code>目标：用真实失败任务做回归。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1078 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1079 | <code>测试集：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1080 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1081 | <code>- GAIA XLSX map 题。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1082 | <code>- BBC Earth 搜索/公开转写题。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1083 | <code>- 复杂 XLSX blind test。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1084 | <code>- PDF 局部字段查找。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1085 | <code>- DOCX 表格/批注查找。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1086 | <code>- PPTX 图片/shape inventory。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1087 | <code>- Web research 多轮检索题。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1089 | <code>每个测试要记录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1090 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1091 | <code>- 是否完成。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1092 | <code>- loop 数。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1093 | <code>- prompt chars/token estimate。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1094 | <code>- active_observation 数。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1095 | <code>- working_state chars。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1096 | <code>- repeated tool call count。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1097 | <code>- 是否发生 compact。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1098 | <code>- compact 前后关键信息是否保留。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1100 | <code>## 7. 关键测试设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1102 | <code>### 7.1 Reducer coverage 测试</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1104 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1106 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1107 | <code>artifact_tools search START -&gt; Sheet1!A1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1108 | <code>artifact_tools search END -&gt; Sheet1!I20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1109 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1111 | <code>断言：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1113 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1114 | <code>state.artifacts[sessionId].sheets.Sheet1.textIndexFacts.START includes "A1"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1115 | <code>state.artifacts[sessionId].sheets.Sheet1.textIndexFacts.END includes "I20"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1116 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1118 | <code>### 7.2 Clearing safety 测试</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1120 | <code>如果 `search START` 被清理，必须满足：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1122 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1123 | <code>working_state contains START=A1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1124 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1126 | <code>否则不能清理。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1128 | <code>### 7.3 Query compactRows lossless 测试</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1130 | <code>如果 artifact query 返回：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1132 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1133 | <code>{ "truncated": false, "compactRows": [...] }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1134 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1136 | <code>断言：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1138 | <code>- prompt 中保留完整 `compactRows`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1139 | <code>- 不做中间字符串截断。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1140 | <code>- 如果超预算，必须分页或 rows-level truncation。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1142 | <code>### 7.4 Repeated call loop guard</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1144 | <code>输入连续：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1146 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1147 | <code>search START</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1148 | <code>search END</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1149 | <code>search START</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1150 | <code>search END</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1151 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1153 | <code>断言：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1155 | <code>- working_state 中出现 repeatedCalls。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1156 | <code>- prompt 中提示已有事实和重复模式。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1157 | <code>- 模型下一步应选择 query/inspect/final，而不是继续同 query。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1159 | <code>### 7.5 Checkpoint replay</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1161 | <code>构造 20 轮工具链路，触发 compact。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1163 | <code>断言：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1165 | <code>- compact 后 transcript 有 `agent.context_checkpoint`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1166 | <code>- 从 checkpoint 恢复 prompt 仍包含关键 artifact facts。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1167 | <code>- 不依赖旧 raw tool result 留在 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1169 | <code>## 8. 不应该做的事</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1171 | <code>1. 不要为 GAIA XLSX 地图题写 `solve_map`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1172 | <code>   这会把系统变成题库工具，不是 agent runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1174 | <code>2. 不要把所有旧 observation 都保留在 prompt。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1175 | <code>   这会重新导致超时。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1177 | <code>3. 不要让工具返回“高置信/低置信/应该继续”这类硬判断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1178 | <code>   工具返回 facts、diagnostics、coverage、continuation，由模型判断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1180 | <code>4. 不要把 `lossless_tool_observations` 做成实际 1200 字摘要。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1181 | <code>   名字和行为必须一致。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1183 | <code>5. 不要把 tool schema 当普通 prompt 字符串压缩。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1184 | <code>   schema 应走 direct/deferred tool spec。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1186 | <code>6. 不要依赖最近 N 条历史。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1187 | <code>   最近 N 条会丢任务事实，必须有 working_state。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1189 | <code>## 9. 下一步最小可行改动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1191 | <code>优先做 Phase 1，不要先大重构。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1193 | <code>最小改动：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1195 | <code>1. 在 `electron/ailis-context-compiler.cjs` 增加：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1196 | <code>   - `buildWorkingStateFromItems`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1197 | <code>   - `reduceArtifactObservation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1198 | <code>   - `extractArtifactSearchFacts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1199 | <code>   - `extractArtifactQueryFacts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1200 | <code>   - `buildRepeatedCallFacts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1202 | <code>2. `context_pack` 增加：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1204 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1205 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1206 | <code>  "working_state": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1207 | <code>    "schema": "ailis_working_state.v1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1208 | <code>    "artifacts": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1209 | <code>    "tools": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1210 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1211 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1212 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1214 | <code>3. 清理规则改成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1217 | <code>if (item.tool === 'artifact_tools' &amp;&amp; !isRepresentedInWorkingState(item, workingState)) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1218 | <code>  keepAsActiveOrRecent(item);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1219 | <code>} else {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1220 | <code>  clear(item);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1221 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1222 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1224 | <code>4. 测试先补：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1226 | <code>- `Context Compiler V1 carries START and END search facts after clearing older observations`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1227 | <code>- `Context Compiler V1 does not clear artifact observation if reducer cannot represent it`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1228 | <code>- `Context Compiler V1 keeps complete compactRows without middle truncation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1229 | <code>- `Context Compiler V1 flags repeated identical artifact searches`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1231 | <code>这个改动不会锁死模型，也不会添加死板 solver。它只是让模型在长程任务中不失忆。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1233 | <code>## 10. 与 Artifact Tools 协议的关系</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1235 | <code>Artifact Tools 协议强调：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1237 | <code>- `inspect` 是 AGENT 的眼睛。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1238 | <code>- 输出要小而结构化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1239 | <code>- 大区域分页。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1240 | <code>- 样式、公式、merge、comment、relationship、image、shape 要结构化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1241 | <code>- render 和 validate 是一等能力。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1243 | <code>Context Runtime 要做的是把这些工具 observation 变成模型可长期操作的世界状态。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1245 | <code>因此 Artifact Tools 和 Context Runtime 的边界是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1247 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1248 | <code>Artifact Tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1249 | <code>  解析文件，返回结构化 observation。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1251 | <code>Observation Reducer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1252 | <code>  把 observation 中的稳定事实归约到 working_state。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1254 | <code>Prompt Pack Builder:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1255 | <code>  把 working_state + active observation 交给模型。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1257 | <code>LLM:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1258 | <code>  自己判断下一步和答案。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1259 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1261 | <code>如果这条边界不清楚，就会继续出现两个极端：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1263 | <code>- 工具太智能，替模型做错误判断。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1264 | <code>- 工具太原始，把大 JSON 扔给模型导致超时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>正确平衡点是：工具负责结构化事实，Runtime 负责状态保持，模型负责决策和推理。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1268 | <code>## 11. 对当前 GAIA XLSX 任务的预期修复结果</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1270 | <code>修复后，执行链路应变成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1272 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1273 | <code>iter0 tool_search artifact_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1274 | <code>iter1 artifact_tools open_session</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1275 | <code>iter2 artifact_tools inspect workbook/sheet</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1276 | <code>iter3 artifact_tools search START</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1277 | <code>  working_state records START=A1 and usedRange=A1:I20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1278 | <code>iter4 artifact_tools search END</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1279 | <code>  working_state records END=I20 and keeps START=A1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1280 | <code>iter5 model sees START, END, usedRange simultaneously</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1281 | <code>  next likely calls artifact_tools query Sheet1!A1:I20 include values/styles</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1282 | <code>iter6 model reasons on returned grid/styles</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1283 | <code>  final F478A7</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1284 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1286 | <code>如果模型仍然重复 `search START/END`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1288 | <code>- loop guard 会显示 repeated calls。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1289 | <code>- working_state 会提示已有 facts。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1290 | <code>- 这时问题才可能是模型策略问题，而不是 Runtime 失忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1292 | <code>## 12. 最终判断</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1294 | <code>Codex 长程上下文管理的工程核心不是某个神奇 prompt，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1296 | <code>- 结构化 history。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1297 | <code>- 工具调用和工具输出作为一等 ResponseItem。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1298 | <code>- 写入时截断和 normalize。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1299 | <code>- token usage 驱动的 pre/mid-turn compaction。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1300 | <code>- compact 后 replacement history 安装。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1301 | <code>- canonical initial context 重注入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1302 | <code>- direct/deferred 工具 schema 分层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1304 | <code>AILIS 当前最该补的是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1306 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1307 | <code>Observation Reducer + Working State + Safe Clearing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1308 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1310 | <code>这比继续调提示词、加死板工具、或扩大超时时间更重要。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
