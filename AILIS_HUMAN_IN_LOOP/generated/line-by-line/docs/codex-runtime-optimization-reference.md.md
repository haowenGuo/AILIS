# docs/codex-runtime-optimization-reference.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：554
- SHA-256：`ebc595ad6b33457593d76f77cb595f507917f4fa5501ddb0fd4a8b015ca7cb25`
- 可运行副本：[打开源文件](../../../source/docs/codex-runtime-optimization-reference.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># Codex Runtime Optimization Reference</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Last updated: 2026-06-07</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This document records how local Codex source reduces runtime latency, prompt bloat, and tool overhead. It is intentionally code-backed: every claim below points to local Codex source under:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 8 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>This is not a generic "prompt engineering" note. The important pattern is that Codex does not rely on the model alone to stay fast. The runtime aggressively controls:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- what tool detail reaches the model,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- how large schemas are,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- how much tool output is allowed back into the next turn,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- when history gets compacted,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- how token usage is measured.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>For AILIS, this matters because the slow tasks we observed were not tool-time bound. They were model-wait bound: tools finished in seconds, but the model kept re-reading large history and large observations for many rounds.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## 1. The Main Optimization Shape</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>Codex speed comes from runtime discipline more than from one magic model trick.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>The recurring pattern in the source is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>Keep the first-turn tool surface small</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>-&gt; compact schemas before the model sees them</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>-&gt; truncate tool output before it re-enters the loop</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>-&gt; track token usage continuously</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>-&gt; auto-compact history with explicit retention budgets</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>The direct implication for AILIS is simple:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- If the model sees too many tools too early, it slows down and chooses worse.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- If tool outputs are fed back too verbosely, every next step gets slower.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- If there is no hard token accounting, context growth becomes invisible until tasks feel "mysteriously slow".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>## 2. Codex Does Not Dump the Whole Tool World Into Turn 1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>### 2.1 Deferred tool exposure is first-class</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>Codex tool definitions include an explicit `defer_loading` field.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>- `tools/src/tool_definition.rs:7`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- `tools/src/tool_definition.rs:21`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- `tools/src/responses_api.rs:26`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- `tools/src/responses_api.rs:116`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- `tools/src/responses_api.rs:127`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 58 | <code>pub struct ToolDefinition {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>    pub name: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>    pub description: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>    pub input_schema: JsonSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>    pub output_schema: Option&lt;JsonValue&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>    pub defer_loading: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 68 | <code>pub fn into_deferred(mut self) -&gt; Self {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>    self.output_schema = None;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>    self.defer_loading = true;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>    self</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 76 | <code>pub fn mcp_tool_to_deferred_responses_api_tool(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>    tool_name: &amp;ToolName,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>    tool: &amp;rmcp::model::Tool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>) -&gt; Result&lt;ResponsesApiTool, serde_json::Error&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>What this means in plain language:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>- Codex can discover many tools without showing every full contract to the model immediately.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- Deferred tools lose some detail up front, especially output schema, and are marked as load-later.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>- The first-turn prompt stays smaller and more decision-oriented.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>### 2.2 Deferred tools are namespaced and managed deliberately</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>Codex does not treat deferred tools as a sloppy afterthought.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>- `app-server/src/request_processors/thread_processor.rs:310`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>Representative logic:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 99 | <code>if tool.defer_loading &amp;&amp; namespace.is_none() {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>    return Err(format!(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>        "deferred dynamic tool must include a namespace: {name}"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>    ));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>- Deferred tools are not random hidden blobs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- They still live in a structured namespace and are validated at the runtime boundary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>### 2.3 Tool search is a real model-visible mechanism</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>Codex exposes `tool_search` as its own tool shape.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>- `tools/src/tool_spec.rs:17`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>#[serde(rename = "tool_search")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 123 | <code>ToolSearch {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    execution: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>    description: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>    parameters: JsonSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>- Codex does not solve tool sprawl by shoving everything into system prompt prose.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- It has an explicit discovery mechanism when the model needs more capability detail.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>### 2.4 Compaction tests explicitly forbid leaking deferred declarations into the active payload</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>- `core/tests/suite/compact_remote.rs:62`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `core/tests/suite/compact_remote.rs:990`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>Representative test:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 145 | <code>assert!(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>    !contains_defer_loading(tools),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>    "model-visible tools should not include deferred declarations: {tools}"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>This is a very important clue. Codex is testing for prompt hygiene, not just tool correctness.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>The first fix direction is not "better prompt wording". It is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>- keep the initial capability index thin,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>- expose only the tools that are truly needed for the current turn,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 159 | <code>- move long contracts and niche tools behind delayed discovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>## 3. Codex Shrinks Large Schemas Before the Model Ever Sees Them</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>Codex does not trust third-party or MCP-style schemas to be reasonably sized.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>- `tools/src/json_schema.rs:159`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- `tools/src/json_schema.rs:176`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- `tools/src/json_schema.rs:177`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- `tools/src/json_schema.rs:194`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- `tools/src/json_schema.rs:317`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- `tools/src/json_schema.rs:363`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 174 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 177 | <code>sanitize_json_schema(&amp;mut input_schema);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>prune_unreachable_definitions(&amp;mut input_schema);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>compact_large_tool_schema(&amp;mut input_schema);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 183 | <code>const MAX_COMPACT_TOOL_SCHEMA_BYTES: usize = 4_000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>const MAX_COMPACT_TOOL_SCHEMA_DEPTH: usize = 2;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 188 | <code>const LARGE_SCHEMA_COMPACTION_PASSES: &amp;[LargeSchemaCompactionPass] = &amp;[</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>    strip_schema_descriptions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>    drop_schema_definitions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>    collapse_deep_schema_objects_from_root,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>What Codex is doing:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>1. Sanitize the schema.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>2. Remove unreachable definitions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>3. If still too large, strip descriptions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>4. If still too large, drop definitions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>5. If still too large, collapse deep nested schema objects from the root.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>Why this helps:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>- Huge tool schemas are silent prompt killers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 206 | <code>- The model does not need every deep sub-object explained in full to decide the next action.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 207 | <code>- Compacting schemas protects both latency and tool-call reliability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>If AILIS exposes full JSON schemas from every MCP tool, browser tool, research tool, and file tool on every turn, the model will waste time parsing contract detail instead of planning. Codex avoids that at the parser layer, not with "please be concise" instructions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>## 4. Codex Truncates Tool Output Before It Goes Back Into the Next Round</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>This is one of the biggest differences between a fast runtime and a slow one.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>- `utils/output-truncation/src/lib.rs:12`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 220 | <code>- `utils/output-truncation/src/lib.rs:29`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>- `utils/output-truncation/src/lib.rs:79`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- `core/src/tools/mod.rs:63`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- `core/src/tools/mod.rs:90`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>- `core/src/tools/code_mode/mod.rs:253`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>- `core/src/tools/code_mode/mod.rs:257`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- `core/src/unified_exec/mod.rs:68`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>- `code-mode/src/runtime/mod.rs:25`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 232 | <code>pub fn formatted_truncate_text(content: &amp;str, policy: TruncationPolicy) -&gt; String</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 236 | <code>pub fn truncate_function_output_items_with_policy(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>    items: &amp;[FunctionCallOutputContentItem],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>    policy: TruncationPolicy,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>) -&gt; Vec&lt;FunctionCallOutputContentItem&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 243 | <code>pub(crate) const DEFAULT_MAX_OUTPUT_TOKENS: usize = 10_000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 244 | <code>pub const DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL: usize = 10_000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 245 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>- Large text output is truncated in a structured way.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 250 | <code>- Text items can be merged and compacted under a token or byte budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 251 | <code>- Mixed output keeps non-text items such as images while shrinking text aggressively.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>- Exec output is formatted with metadata like exit code and wall time, then truncated for model consumption.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>- If some text items are omitted, Codex appends an explicit omission marker instead of pretending the full output is still present.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>Representative outcome shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 258 | <code>Exit code: ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>Wall time: ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>Total output lines: ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>Output:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>### Why this matters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>Without this layer, every tool becomes a prompt amplifier:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>- one big HTML page,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 270 | <code>- one giant shell log,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 271 | <code>- one verbose repo tree,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 272 | <code>- one long PDF extraction,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>and the model pays for that again on every subsequent turn.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>For AILIS, this is more important than adding more tools. Before adding more tools, every tool needs a model-facing truncation adapter:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>- `web_fetch` should not dump whole pages by default.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>- `github_repo_read` should return scoped structure, not raw noise.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>- `pdf_extract_text` should return sections or a bounded excerpt, not uncontrolled blobs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>- shell/file/browser tools need separate truncation policies, not one generic "return text".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>## 5. Codex Also Caps Telemetry and Runtime Preview Surfaces</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>- `core/src/tools/mod.rs:29`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- `core/src/tools/mod.rs:30`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>Representative constants:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 295 | <code>pub(crate) const TELEMETRY_PREVIEW_MAX_BYTES: usize = 2 * 1024;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>pub(crate) const TELEMETRY_PREVIEW_MAX_LINES: usize = 64;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>This is subtle but important:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>- Codex does not let internal previews grow carelessly either.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 302 | <code>- Even logging and telemetry surfaces are treated as model-budget-sensitive.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>If AILIS reuses verbose event text for both UI progress and model context, it is doing the opposite of this design. Internal traces should be rich; model-facing traces should be lean.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>## 6. Codex Tracks Token Usage Continuously Instead of Guessing</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>- `core/src/client.rs:1825`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 313 | <code>- `core/src/client.rs:1827`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 314 | <code>- `core/src/client.rs:1828`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 319 | <code>session_telemetry.sse_event_completed(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>    usage.input_tokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>    usage.output_tokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 322 | <code>    Some(usage.cached_input_tokens),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>    Some(usage.reasoning_output_tokens),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>    usage.total_tokens,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Codex is not blind while running. It records:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>- input tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 331 | <code>- output tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 332 | <code>- cached input tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>- reasoning output tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 334 | <code>- total tokens.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>Why this matters:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 338 | <code>- You cannot optimize what you do not measure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 339 | <code>- Cached input tokens tell you whether repeated context is being reused well.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 340 | <code>- Reasoning output tokens tell you whether the model is spending too much effort per decision.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>AILIS should log per-turn:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>- total prompt tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 347 | <code>- delta from previous turn,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 348 | <code>- tool-result tokens added this round,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 349 | <code>- duplicated observation tokens,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 350 | <code>- cached vs non-cached tokens if provider supports it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>Otherwise "it feels slow" stays anecdotal.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>## 7. Codex Auto-Compaction Is Windowed and Token-Aware</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>Codex does not compact history in a vague way. It tracks compaction windows and prefill baselines.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>- `core/src/state/auto_compact_window.rs:4`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>- `core/src/state/auto_compact_window.rs:46`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- `core/src/state/auto_compact_window.rs:59`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>- `core/src/state/auto_compact_window.rs:70`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 368 | <code>pub(crate) struct AutoCompactWindowSnapshot {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>    pub(crate) ordinal: u64,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>    pub(crate) prefill_input_tokens: Option&lt;i64&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 375 | <code>pub(super) fn ensure_server_observed_prefill_from_usage(&amp;mut self, usage: &amp;TokenUsage)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 379 | <code>pub(super) fn set_estimated_prefill(&amp;mut self, tokens: i64)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>- Codex tracks the current compaction window.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>- It records a token baseline for what was already in context before new growth.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 386 | <code>- It prefers server-observed usage over estimates when available.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>This is more disciplined than "summarize every now and then".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 390 | <code>## 8. Codex Compacts History With Explicit Retention Budgets</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>### 8.1 Inline compaction keeps only bounded recent user material</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>- `core/src/compact.rs:46`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 397 | <code>- `core/src/compact.rs:48`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 398 | <code>- `core/src/compact.rs:465`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 403 | <code>pub const SUMMARIZATION_PROMPT: &amp;str = include_str!("../templates/compact/prompt.md");</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>const COMPACT_USER_MESSAGE_MAX_TOKENS: usize = 20_000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 408 | <code>pub(crate) fn build_compacted_history(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>    initial_context: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>    user_messages: &amp;[String],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>    summary_text: &amp;str,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>) -&gt; Vec&lt;ResponseItem&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 413 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>What Codex keeps:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>- canonical initial context,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 418 | <code>- a bounded amount of recent user messages,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 419 | <code>- a generated summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>If a message is too large, it gets truncated to fit the remaining token budget.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>### 8.2 Remote compaction retains only selected roles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>- `core/src/compact_remote_v2.rs:48`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 428 | <code>- `core/src/compact_remote_v2.rs:351`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 429 | <code>- `core/src/compact_remote_v2.rs:367`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 434 | <code>const RETAINED_MESSAGE_TOKEN_BUDGET: usize = 64_000;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 438 | <code>matches!(role.as_str(), "user" &#124; "developer" &#124; "system")</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 439 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>- Remote compaction does not blindly preserve every past item.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 444 | <code>- It filters by message role and then truncates retained text to a token budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>This is very relevant to AILIS. If AILIS keeps replaying giant tool observations, redundant progress strings, and persona wrappers inside the active history, it is violating the same principle Codex is enforcing here.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>## 9. Codex Web Search Is Also Context-Budgeted</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>Relevant source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>- `tools/src/tool_spec.rs:45`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- `codex-api/src/search.rs:181`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>- `app-server-protocol/schema/typescript/WebSearchToolConfig.ts:7`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>Representative code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 459 | <code>search_context_size: Option&lt;WebSearchContextSize&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 463 | <code>export type WebSearchToolConfig = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>  context_size: WebSearchContextSize &#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 465 | <code>  allowed_domains: Array&lt;string&gt; &#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>  location: WebSearchLocation &#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 467 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 468 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 470 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>- Codex treats web search as a bounded retrieval tool, not a raw HTML floodgate.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 473 | <code>- Search context size is configurable as `low`, `medium`, or `high`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>### AILIS takeaway</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>This is the opposite of returning a whole fetched page unless the model explicitly asked for that much. AILIS should separate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>- search result retrieval,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 480 | <code>- page fetch,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 481 | <code>- targeted extraction,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 482 | <code>- full download.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>Those are different cost profiles and should not share one loose text-return path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>## 10. What Codex Is Optimizing, in One Sentence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>Codex tries to ensure that the model sees only the minimum useful contract and the minimum useful evidence needed for the next decision.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>That is the real optimization philosophy.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>Not:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>- "make the prompt more clever",</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 495 | <code>- "tell the model to be concise",</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 496 | <code>- "hope the model picks the right tool faster".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>But:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 500 | <code>- show less,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 501 | <code>- validate earlier,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 502 | <code>- truncate harder,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 503 | <code>- measure continuously,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 504 | <code>- compact with explicit budgets.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>## 11. Direct Mapping to AILIS's Slowdown</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>From the slow AILIS runs we saw earlier, the main symptom was:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 510 | <code>- tools finished quickly,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 511 | <code>- model waiting dominated total runtime,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 512 | <code>- repeated rounds kept dragging large observations back into context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>Against Codex's design, that usually points to four concrete problems:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>1. Too much tool contract detail is visible too early.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 517 | <code>2. Tool outputs are too large and too raw.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 518 | <code>3. Progress and observation text are duplicated across runtime layers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>4. Compaction and token budgeting are weaker than the rate of context growth.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>This is why a task can spend only a few seconds in tools but several minutes in model wait.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 523 | <code>## 12. What AILIS Should Copy Next</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>If we want the highest-value Codex-aligned changes, the order should be:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 527 | <code>1. Deferred tool exposure for non-core tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 528 | <code>   Only a thin active tool set should be visible at turn start.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>2. Schema compaction before tool exposure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 531 | <code>   Use the Codex pattern: sanitize, prune, compact, then expose.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>3. Per-tool model-facing truncation adapters.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 534 | <code>   `web_fetch`, `github_repo_read`, `pdf_extract_text`, `browser_extract_dom`, and shell/file tools should each have bounded result shapes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>4. Explicit token accounting in the runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 537 | <code>   Track prompt growth and observation growth per round.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>5. Real auto-compaction windows.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 540 | <code>   Compact based on measured token growth, not vague heuristics.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 542 | <code>6. Separation between trace richness and model context richness.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 543 | <code>   Internal traces can stay detailed; model-facing context must stay lean.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>## 13. The Core Lesson for This Project</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>The most important thing Codex teaches here is not "use these exact words". It is architectural:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>- model reasoning should stay focused on the next decision,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 550 | <code>- runtime should absorb the ugly cost-control work,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>- tools should return shaped evidence, not whatever bytes happened to come back,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 552 | <code>- compaction should be a built-in budget mechanism, not an afterthought.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 554 | <code>That is the difference between a system that feels powerful for one or two steps and a system that can stay fast through long research or engineering tasks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
