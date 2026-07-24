# docs/ailis-codex-object-model-gap-analysis.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：857
- SHA-256：`0bfa67b0f13b4778a3df32e1b1e6e3604d7a6a158cabbc8d341ea4db35855989`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-object-model-gap-analysis.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`prompt`、`variants`、`variant`、`tool`、`tools`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS vs Codex Object Model Gap Analysis</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-07-03</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Scope:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- Codex reference source: `F:/AIGril/AIGrilClaw/.refs/openai-codex`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- Codex commit: `7d47056ea42636271ac020b86347fbbef49490aa`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- AILIS runtime: `F:/AILIS_self_evolution_runtime/electron`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>This document compares the model-visible object/data model in Codex and the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>current AILIS Agent runtime after removing the old JSON meta-decision path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>## 1. Executive Summary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>AILIS is now aligned with Codex on the outer request shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 19 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>  "instructions": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>  "input": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>  "tools": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>  "tool_choice": "auto",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>  "parallel_tool_calls": false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>After the 2026-07-03 object-model migration, AILIS is closer to Codex but still</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>not one-to-one. The current state is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>- Request shell: mostly aligned.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Native tool decision: aligned in principle; no old JSON meta-decision in the</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>  main Agent loop.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>- ResponseItem history: mostly aligned for live runs. AILIS now has a</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>  Codex-named `ContextManager`, and the main loop keeps it as run-local</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>  long-lived history. Runtime snapshots, debug pauses, and pending approvals now</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  store Codex `ContextManager` fields (`items`, `history_version`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  `token_info`, `reference_context_item`); `stepResults` remain as</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  transcript/debug snapshots and compatibility data.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>- Tool output payload: partially aligned. AILIS now has</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>  `FunctionCallOutputPayload`, `FunctionCallOutputBody`, and content-item</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>  constructors; provider adapters convert them to the wire value.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>- Tool model: partially aligned. AILIS now has Codex-named `ToolRouter`,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>  `ToolRegistry`, and `ToolExposure`, but its schema repair/compression layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>  and direct-tool limit still differ from Codex's full spec planner.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>- Context/history runtime: partially aligned. Codex has durable session</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>  `ContextManager` history; AILIS now uses a long-lived `ContextManager` inside</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>  a live Agent run and persists checkpoint snapshots across transcript,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>  debug-pause, and pending-approval boundaries. Full rollout-level replacement</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>  history is still pending.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>- Compaction/runtime state: not aligned. Codex has `Compaction`,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>  `ContextCompaction`, `ContextCompactionItem`, `reference_context_item`, and replacement history;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>  AILIS has old `ailis-context-compiler.cjs` but the main Agent path no longer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  uses it.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>- Naming: still has AILIS-only concepts in the repository, especially</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>  `working_state`, `context_pack`, `tool_observations`, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  `cleared_observations`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>Recommended direction:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>1. Keep the new native tool / ResponseItem request path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>2. Replace AILIS-specific `working_state/context_pack` naming with Codex source</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>   names: `ContextManager`, `ResponseItem`, `Compaction`, `ContextCompactionItem`, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>   `TurnContextItem` concepts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>3. Expand AILIS ResponseItem support to the full Codex enum subset.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>4. Make `stepResults` a persistence/debug view, not the source of model-visible</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>   history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>## 2. Codex Canonical Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>### 2.1 Prompt</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>- `codex-rs/core/src/client_common.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>Canonical Rust shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 80 | <code>pub struct Prompt {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>    pub input: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>    pub(crate) tools: Vec&lt;ToolSpec&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>    pub(crate) parallel_tool_calls: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>    pub base_instructions: BaseInstructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>    pub personality: Option&lt;Personality&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>    pub output_schema: Option&lt;Value&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>    pub output_schema_strict: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>Important points:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>- `input` is already structured `ResponseItem[]`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- `tools` is separate from text prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>- `base_instructions` maps to API `instructions`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- `output_schema` is first-class, not a prompt convention.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>### 2.2 ResponsesApiRequest</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>- `codex-rs/codex-api/src/common.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>Canonical wire shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 107 | <code>pub struct ResponsesApiRequest {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>    pub model: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>    pub instructions: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>    pub input: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>    pub tools: Vec&lt;serde_json::Value&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>    pub tool_choice: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>    pub parallel_tool_calls: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>    pub reasoning: Option&lt;Reasoning&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>    pub store: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>    pub stream: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>    pub include: Vec&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>    pub service_tier: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>    pub prompt_cache_key: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>    pub text: Option&lt;TextControls&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>    pub client_metadata: Option&lt;HashMap&lt;String, String&gt;&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>Important points:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>- `tool_choice` is normally `"auto"`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- `stream` is true in Codex model client.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- `prompt_cache_key` is tied to thread id.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- `client_metadata` includes installation metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>### 2.3 ResponseInputItem</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>- `codex-rs/protocol/src/models.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>Canonical input-only item subset:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 141 | <code>pub enum ResponseInputItem {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>    Message { role, content, phase },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>    FunctionCallOutput { call_id, output },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>    McpToolCallOutput { call_id, output },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>    CustomToolCallOutput { call_id, name, output },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>    ToolSearchOutput { call_id, status, execution, tools },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>This means Codex distinguishes items a caller can feed in from the larger</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>`ResponseItem` enum returned by the model/runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>### 2.4 ResponseItem</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>- `codex-rs/protocol/src/models.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>Canonical model-visible / history item variants found in the reference source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 162 | <code>message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>reasoning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>local_shell_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>function_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>tool_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>function_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>custom_tool_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>custom_tool_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>tool_search_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>web_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>image_generation_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>compaction_trigger</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>context_compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>other</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>Important fields:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>- `message`: `role`, `content[]`, optional `phase`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- `function_call`: `name`, optional `namespace`, string `arguments`, `call_id`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- `function_call_output`: `call_id`, `output`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>- `tool_search_call`: optional `call_id`, `status`, `execution`, `arguments`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 185 | <code>- `tool_search_output`: optional `call_id`, `status`, `execution`, `tools[]`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 186 | <code>- `custom_tool_call`: `call_id`, `name`, string `input`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 187 | <code>- `compaction`: `encrypted_content`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>- `context_compaction`: optional `encrypted_content`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>### 2.5 ContentItem</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>Codex content item variants:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 195 | <code>input_text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>input_image</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>output_text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>Codex preserves multimodal content at the item level, then strips images in</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>`ContextManager.for_prompt()` when the target model does not support images.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>### 2.6 FunctionCallOutputPayload</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>- `codex-rs/protocol/src/models.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>Canonical shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 212 | <code>pub struct FunctionCallOutputPayload {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>    pub body: FunctionCallOutputBody,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>    pub success: Option&lt;bool&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>pub enum FunctionCallOutputBody {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>    Text(String),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>    ContentItems(Vec&lt;FunctionCallOutputContentItem&gt;),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>pub enum FunctionCallOutputContentItem {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>    InputText { text },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>    InputImage { image_url, detail },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>    EncryptedContent { encrypted_content },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>Important point:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>- The model-facing wire value for `function_call_output.output` can be either</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>  a plain string or structured content items.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>- Plain text conversion is intentionally lossy and not the authoritative</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 234 | <code>  payload.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>### 2.7 ContextManager</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>- `codex-rs/core/src/context_manager/history.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>Canonical state:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 245 | <code>pub(crate) struct ContextManager {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>    items: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>    history_version: u64,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>    token_info: Option&lt;TokenUsageInfo&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>    reference_context_item: Option&lt;TurnContextItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>Key behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>- `record_items()` writes structured items into history.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 256 | <code>- `process_item()` truncates function/custom tool outputs at item boundary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 257 | <code>- `for_prompt()` normalizes history before sending to model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- Normalization ensures:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>  - every function/custom call has an output,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>  - every output has a call,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>  - unsupported images are stripped.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>### 2.8 Turn Loop</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>- `codex-rs/core/src/session/turn.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>Critical flow:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 272 | <code>let sampling_request_input: Vec&lt;ResponseItem&gt; = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>    sess.clone_history()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>        .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>        .for_prompt(&amp;turn_context.model_info.input_modalities)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>let prompt = Prompt {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>    input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>    tools: router.model_visible_specs(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>    parallel_tool_calls: turn_context.model_info.supports_parallel_tool_calls,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 282 | <code>    base_instructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>    personality,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>    output_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>    output_schema_strict,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>Codex does not rebuild the model prompt from ad hoc JSON each round. It samples</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>from normalized canonical history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>### 2.9 ToolRouter</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- `codex-rs/core/src/tools/router.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- `codex-rs/core/src/tools/spec_plan.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>Canonical concepts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 302 | <code>ToolRouter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>ToolRegistry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>model_visible_specs()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>ToolExposure::Direct</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>ToolExposure::DirectModelOnly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>ToolExposure::Deferred</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>ToolSearchHandler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>Important behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>- Direct tools become model-visible specs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 314 | <code>- Deferred tools are searchable through `tool_search`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 315 | <code>- Tool schemas are not ordinary prompt text.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 316 | <code>- Tool exposure is planned before building the prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>## 3. Current AILIS Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>### 3.1 Request Shell</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>AILIS source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>- `electron/ailis-response-model.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>- `electron/ailis-context-manager.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>- `electron/ailis-tool-router.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>- `electron/ailis-codex-response-items.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>Current AILIS request object:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 333 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>  instructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>  input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>  messages: responseItemsToChatMessages({ instructions, input }),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>  model: 'codex_compatible_prompt.v1',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>  promptProfile,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>  stats</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>Main loop sends:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 346 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>  timeoutMs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>  messages,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>  instructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>  input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 351 | <code>  tools: directToolSpecs,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>  toolChoice: 'auto',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 353 | <code>  jsonMode: false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 354 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 355 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>Debug snapshot records:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 360 | <code>codex_request: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>  instructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 362 | <code>  input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 363 | <code>  tools,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>  tool_choice: 'auto',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>  parallel_tool_calls: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>  stats</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>This is close to Codex, but AILIS still keeps `messages` as a compatibility</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>projection beside the canonical request.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 373 | <code>### 3.2 AILIS ResponseItem Support</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>AILIS source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>- `electron/ailis-codex-response-items.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>Currently supported item constructors:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 382 | <code>message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>reasoning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 384 | <code>local_shell_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 385 | <code>function_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 386 | <code>function_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 387 | <code>custom_tool_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 388 | <code>custom_tool_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>tool_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>tool_search_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 391 | <code>web_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 392 | <code>image_generation_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>compaction_trigger</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>context_compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 396 | <code>other</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>Still incomplete compared with Codex runtime behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 401 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 402 | <code>durable history ownership</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 403 | <code>provider reasoning preservation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>real compaction replacement history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>reference_context_item reinjection</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 406 | <code>native local_shell_call execution semantics</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>### 3.3 AILIS Message Content</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>AILIS currently emits:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 414 | <code>[{ type: 'input_text', text }]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 415 | <code>[{ type: 'output_text', text }]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>Missing or incomplete:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>- `input_image` in normal message content.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 421 | <code>- `FunctionCallOutputContentItem` structured outputs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 422 | <code>- `encrypted_content`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 423 | <code>- model capability based image stripping at history normalization time.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>### 3.4 AILIS Tool Output Payload</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>AILIS current internal `function_call_output` shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 430 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 431 | <code>  type: 'function_call_output',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>  call_id,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>  output: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>    body: { kind: 'text' &#124; 'content_items', value },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>    success?: boolean</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 438 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>Codex canonical shape is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 442 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 443 | <code>output: FunctionCallOutputPayload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>  body: Text &#124; ContentItems</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 445 | <code>  success?: boolean</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>Gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>- AILIS now keeps success inside `FunctionCallOutputPayload`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 451 | <code>- OpenAI Responses wire conversion sends only the Codex wire value for `output`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 452 | <code>  and does not send internal `success`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 453 | <code>- Some tool adapters still collapse rich outputs to text before constructing the</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>  payload; this is now an adapter-layer gap rather than a ResponseItem object</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 455 | <code>  gap.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 457 | <code>### 3.5 AILIS Context Message</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>AILIS currently packs context into a user message:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 462 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 463 | <code>  "type": "context",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>  "memory_context": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 465 | <code>  "attached_files": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>  "runtime_environment": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 467 | <code>  "capability_catalog": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 468 | <code>  "external_tool_exposure": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 469 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 470 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>Codex does not use this exact model-visible object. Codex has initial context</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 473 | <code>and settings updates as structured history/context items, tracked through</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 474 | <code>`reference_context_item`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>Gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>- AILIS `type: "context"` is an AILIS-specific user-message convention.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 479 | <code>- It is not a Codex `ResponseItem` variant.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>### 3.6 AILIS Tool Specs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 483 | <code>AILIS current flow:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>- `gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 486 | <code>- dynamic specs from tool observations</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 487 | <code>- `normalizeNativeToolSpec()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 488 | <code>- schema repair/hardening</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 489 | <code>- schema compaction</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 490 | <code>- add optional `progressNote`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 491 | <code>- direct tool limit, default 16</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 492 | <code>- exact-answer mode appends `final_answer` last</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>Current AILIS model-facing tool shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 496 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 497 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 498 | <code>  type: 'function',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>  name,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>  description,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>  parameters,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 502 | <code>  strict?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 503 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 504 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>Responses provider maps it to the same OpenAI Responses tool object.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>Gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 510 | <code>- Codex uses `ToolSpec` and `ToolRouter.model_visible_specs()`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 511 | <code>- AILIS has equivalent intent but not equivalent naming/structure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 512 | <code>- AILIS schema compression/repair is runtime-specific and may change tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 513 | <code>  shape in ways Codex does not.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>- AILIS direct tool limit is a custom cap; Codex uses exposure planning and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 515 | <code>  deferred search rather than a simple visible count limit.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>### 3.7 AILIS Provider Mapping</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 519 | <code>OpenAI Responses provider:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 522 | <code>body = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>  model,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>  input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 525 | <code>  temperature</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 526 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>body.instructions = instructions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 529 | <code>body.tools = mapToolsForResponses(tools)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 530 | <code>body.tool_choice = 'auto'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 531 | <code>body.reasoning = ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 532 | <code>body.parallel_tool_calls = ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 533 | <code>body.service_tier = ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 534 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>Gap against Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>- AILIS does not currently send `stream: true` in this path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 539 | <code>- AILIS does not send `include`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 540 | <code>- AILIS does not send `store`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>- AILIS does not send `prompt_cache_key`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>- AILIS does not send Codex-style `client_metadata`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 543 | <code>- AILIS still has chat-completions compatibility conversion, which is useful</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 544 | <code>  for non-Responses providers but not identical to Codex.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>### 3.8 AILIS History Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>Current live-run main path:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>- First model turn seeds `ContextManager` from conversation/context/user and any</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>  resume-time `initialStepResults`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 552 | <code>- Each completed tool result appends `function_call` /</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 553 | <code>  `function_call_output` or `tool_search_call` / `tool_search_output` items into</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>  the same `ContextManager`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>- Each model turn samples from `ContextManager.forPrompt()`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 556 | <code>- `stepResults` remain for transcript/debug/approval recovery, compatibility,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 557 | <code>  and loop guards; checkpoint snapshots are preferred when resuming</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 558 | <code>  `ContextManager` history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>Codex path:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>- Tool calls and outputs are recorded as `ResponseItem`s into</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 563 | <code>  `ContextManager`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 564 | <code>- Prompt input is `clone_history().for_prompt(...)`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 565 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 566 | <code>Gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>- AILIS has a Codex-named live-run `ContextManager` and stores checkpoint</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 569 | <code>  snapshots at transcript/debug/approval boundaries, but not yet a full</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>  session-level rollout owner.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>- AILIS has no main-path equivalent of `history_version`,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 572 | <code>  `token_info`, or `reference_context_item`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 573 | <code>- AILIS has no `normalize_history()` that enforces call/output invariants on</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 574 | <code>  the canonical history before every model call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>### 3.9 AILIS Compaction / Working State</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 577 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 578 | <code>Current repository still contains:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>- `electron/ailis-context-compiler.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 581 | <code>- `context_pack`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 582 | <code>- `working_state`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 583 | <code>- `tool_observations`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 584 | <code>- `cleared_observations`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 586 | <code>But `electron/ailis-agent-runner.cjs` no longer imports</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 587 | <code>`compileAgentPromptPayloadV1` in the main Agent path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>Codex has:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 592 | <code>compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 593 | <code>compaction_trigger</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 594 | <code>context_compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 595 | <code>reference_context_item</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 596 | <code>replace_compacted_history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>Gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>- AILIS old `working_state` naming is not Codex-native.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 602 | <code>- If this logic comes back into model-visible prompts, it should be renamed and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 603 | <code>  reshaped to Codex-like compaction/history items.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>- The current main path avoids the old broken compiler, but it also lacks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 605 | <code>  Codex-grade compaction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 607 | <code>## 4. One-by-One Comparison Table</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 608 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 609 | <code>&#124; Layer &#124; Codex &#124; AILIS Now &#124; Match &#124; Required Change &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 610 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 611 | <code>&#124; Outer request &#124; `ResponsesApiRequest` &#124; `{instructions,input,tools,toolChoice}` &#124; Partial &#124; Add `stream/include/store/prompt_cache_key/client_metadata` where provider supports them. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 612 | <code>&#124; Prompt internal object &#124; `Prompt { input, tools, base_instructions, personality, output_schema }` &#124; plain JS prompt object &#124; Partial &#124; Rename/reshape internal object to `Prompt` semantics. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 613 | <code>&#124; Input history &#124; `Vec&lt;ResponseItem&gt;` from durable `ContextManager` &#124; long-lived live-run `ContextManager`; transcript/debug/approval checkpoints restore canonical history where available &#124; Partial &#124; Move checkpoints into session-level rollout/compaction storage. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 614 | <code>&#124; Message item &#124; `message {role, content[], phase?}` &#124; supported &#124; Mostly &#124; Preserve phase and image content. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 615 | <code>&#124; Content item &#124; `input_text/input_image/output_text` &#124; text only &#124; Partial &#124; Add image item path and modality stripping. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 616 | <code>&#124; Function call &#124; `function_call {name, namespace?, arguments: string, call_id}` &#124; supported &#124; Mostly &#124; Ensure args always raw JSON string in canonical history. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 617 | <code>&#124; Function output &#124; `function_call_output {call_id, output: FunctionCallOutputPayload}` &#124; implemented internally, wire-converted in provider &#124; Mostly &#124; Preserve richer adapter outputs as content items. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 618 | <code>&#124; Tool search call/output &#124; `tool_search_call/output` &#124; supported &#124; Mostly &#124; Align optional `call_id` and status/execution fields. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 619 | <code>&#124; MCP output &#124; `McpToolCallOutput` maps to `FunctionCallOutput` &#124; no explicit item &#124; No &#124; Add input item support for MCP output before conversion. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 620 | <code>&#124; Custom tool call/output &#124; first-class variants &#124; not supported &#124; No &#124; Add variants or explicitly decide not needed. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 621 | <code>&#124; Web search call &#124; first-class variant &#124; not supported as ResponseItem &#124; No &#124; Add variant if web search is model-native. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 622 | <code>&#124; Image generation call &#124; first-class variant &#124; not supported &#124; No &#124; Add only if image generation is model-native. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 623 | <code>&#124; Reasoning item &#124; first-class variant &#124; not preserved &#124; No &#124; Preserve if provider returns reasoning summaries/encrypted content. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 624 | <code>&#124; Compaction item &#124; `compaction/context_compaction` &#124; old `context_pack` module, not main path &#124; No &#124; Replace old names with Codex compaction item model. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 625 | <code>&#124; Context state &#124; `reference_context_item` baseline &#124; AILIS `type:"context"` user message &#124; No &#124; Build Codex-like context update/reference mechanism. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 626 | <code>&#124; History normalization &#124; `ensure_call_outputs_present`, `remove_orphan_outputs`, image stripping &#124; none on canonical history &#124; No &#124; Add normalize step before prompt build. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 627 | <code>&#124; Tool exposure &#124; `ToolRouter`, direct/deferred/search &#124; `ToolRouter` wrapper over registry + dynamic specs + cap &#124; Partial &#124; Move more planning into router/spec plan; reduce schema mutation. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 628 | <code>&#124; Tool schema storage &#124; structured `ToolSpec` &#124; OpenAI function tool object &#124; Partial &#124; Fine for provider wire; internal naming should match `ToolSpec`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 629 | <code>&#124; Final answer &#124; assistant message, optional output schema &#124; assistant message or `final_answer` tool in exact mode &#124; Partial &#124; Keep `final_answer` only as eval submission endpoint, not general object model. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 630 | <code>&#124; Chat compatibility &#124; not canonical &#124; required for AILIS providers &#124; Intentional divergence &#124; Keep adapter as provider projection, not canonical model. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 632 | <code>## 5. Key Differences That Still Matter</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>### Difference A: `stepResults` is still the source of truth</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 636 | <code>This is the biggest architectural difference.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 640 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 641 | <code>tool call/output -&gt; ResponseItem -&gt; ContextManager -&gt; for_prompt()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 642 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 644 | <code>AILIS live run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 647 | <code>tool call/output -&gt; ContextManager.recordItems() -&gt; forPrompt()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 648 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>AILIS resume/debug boundary:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 653 | <code>stepResults snapshot -&gt; seed ContextManager once -&gt; forPrompt()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 654 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>Impact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>- AILIS can display Codex-shaped input, but it does not yet have Codex-shaped</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 659 | <code>  memory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 660 | <code>- Normalization and compaction cannot be as reliable until history is canonical.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 662 | <code>### Difference B: AILIS `context` message is not Codex-native</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 666 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 667 | <code>{"type":"context","attached_files":[],"runtime_environment":{}}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 668 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 673 | <code>initial context / settings updates / reference_context_item</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 674 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 676 | <code>Impact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 677 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 678 | <code>- The model sees an AILIS-specific JSON convention.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 679 | <code>- This may be less familiar than Codex's trained object/event pattern.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>### Difference C: AILIS does not support full ResponseItem variants</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>The current AILIS V1 only covers the common task path. It does not preserve:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>- reasoning,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 686 | <code>- compaction,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 687 | <code>- context_compaction,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 688 | <code>- local_shell_call,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 689 | <code>- custom_tool_call,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 690 | <code>- web_search_call,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 691 | <code>- image_generation_call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>Impact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 695 | <code>- Long tasks and compaction cannot become truly Codex-like yet.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 696 | <code>- Multimodal/tool outputs remain text-biased.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>### Difference D: Tool output shape is string-first</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>Codex keeps structured tool output payloads. AILIS currently converts most tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>results into text before putting them in `function_call_output`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 703 | <code>Impact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 705 | <code>- Artifact rows, images, and rich outputs are easier to damage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 706 | <code>- This was part of the earlier XLSX failure pattern.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>### Difference E: Tool exposure is similar but not identical</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>AILIS has:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 712 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 713 | <code>modelVisibleSpecs + dynamic specs + schema repair + direct tool cap</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>Codex has:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 719 | <code>ToolRouter + ToolExposure + ToolSearchHandler + model_visible_specs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 720 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>Impact:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>- Functionally similar, but model/debug naming is not Codex-like.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 725 | <code>- Schema repair can accidentally distort tool affordances.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 726 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 727 | <code>## 6. Migration Plan To Full Codex-Like Object Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 729 | <code>### Phase 1: Create `ailis-response-model.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>Define exact JS constructors/types mirroring Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 734 | <code>ResponseInputItem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 735 | <code>ContentItem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>ResponseItem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 737 | <code>FunctionCallOutputPayload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 738 | <code>FunctionCallOutputBody</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 739 | <code>FunctionCallOutputContentItem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>MessagePhase</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 741 | <code>BaseInstructions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 742 | <code>Prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 743 | <code>ResponsesApiRequest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 744 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 746 | <code>Do not invent AILIS-only names for these.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 748 | <code>### Phase 2: Create `ailis-context-manager.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>Mirror Codex naming:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 751 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 752 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 753 | <code>ContextManager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>items</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 755 | <code>history_version</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>token_info</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 757 | <code>reference_context_item</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 758 | <code>recordItems()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 759 | <code>forPrompt()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 760 | <code>rawItems()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 761 | <code>replace()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 762 | <code>normalizeHistory()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 763 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>Move canonical history away from `stepResults`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>### Phase 3: Convert execution loop</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>Current:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 772 | <code>stepResults -&gt; buildCodexInput()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 773 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>Target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 778 | <code>record user/context/tool items -&gt; contextManager.forPrompt() -&gt; Prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 779 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>`stepResults` should become transcript/debug output only.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>### Phase 4: Replace AILIS context names</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>Deprecate model-visible:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 787 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 788 | <code>working_state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 789 | <code>context_pack</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 790 | <code>tool_observations</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 791 | <code>cleared_observations</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 792 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>Replace with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 797 | <code>ResponseItem::Compaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 798 | <code>ResponseItem::ContextCompaction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 799 | <code>TurnContextItem/reference_context_item-like baseline</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 800 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>Internal reducers can still exist, but their model-facing output should be</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 803 | <code>Codex-shaped.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 805 | <code>### Phase 5: Tool router naming</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>Introduce AILIS equivalents named like Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 809 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 810 | <code>ToolRouter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 811 | <code>ToolRegistry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 812 | <code>ToolExposure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 813 | <code>modelVisibleSpecs()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 814 | <code>ToolSearchHandler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 815 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 817 | <code>Keep provider wire format as OpenAI function tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 818 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 819 | <code>### Phase 6: Provider parity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>For OpenAI Responses-compatible providers, include where supported:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 824 | <code>stream</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 825 | <code>include</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 826 | <code>store</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 827 | <code>prompt_cache_key</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 828 | <code>client_metadata</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 829 | <code>text/output_schema controls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 830 | <code>reasoning controls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 831 | <code>parallel_tool_calls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 832 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>For Chat/Anthropic/Gemini, keep projections, but treat them as provider</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 835 | <code>adapters only.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>## 7. Practical Verdict</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 839 | <code>The old JSON meta-decision chain is gone from the main AILIS Agent loop. That</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 840 | <code>part is a real improvement.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>But AILIS is not yet "Codex object model identical." It is currently:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 844 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 845 | <code>Codex-like request shell</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 846 | <code>+ partial ResponseItem projection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 847 | <code>+ native tool calls</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 848 | <code>- canonical ContextManager history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 849 | <code>- full ResponseItem enum</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 850 | <code>- Codex compaction/context items</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 851 | <code>- exact FunctionCallOutputPayload</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 852 | <code>- Codex ToolRouter naming/semantics</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 853 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>The next correct engineering move is not to add more prompt hints. It is to</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 856 | <code>make the internal canonical objects match Codex names and shapes, then let the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 857 | <code>provider adapters project them outward.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
