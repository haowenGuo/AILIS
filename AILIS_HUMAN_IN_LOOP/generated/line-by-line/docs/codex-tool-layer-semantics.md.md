# docs/codex-tool-layer-semantics.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：1441
- SHA-256：`0fa0617d7dd72724395018457c064fc0066086b65253615b787a5cea7eef4205`
- 可运行副本：[打开源文件](../../../source/docs/codex-tool-layer-semantics.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`of`、`tool`、`tool_name`、`message`、`exposure`、`spec`、`registry`、`search_infos`、`tools`、`file_params`、`payload`、`result`、`client`、`external_web_access`、`with`、`calls`、`call`、`specs`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># Codex Tool Layer Semantics</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This document records how the Codex tool layer is actually structured in the local Codex source, and what AILIS should copy from it. The point is not "add more tools"; the point is that every tool has a hard semantic boundary: what the model sees, what the runtime can execute, what the output means, and how failures are represented.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Source root used for this document:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 8 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## 0. The Core Lesson</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>A Codex-style tool is not just a prompt description. It is a typed contract with three separate parts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>1. Model-visible declaration: `ToolSpec`, `ResponsesApiTool`, schema, namespace, exposure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>2. Runtime executor: `ToolExecutor`, `ToolRegistry`, `ToolRouter`, payload validation, hooks, telemetry.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>3. Output contract: `ToolOutput`, typed response item, success flag, truncation, code-mode form.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>This is the boundary AILIS violated in the PDF failure:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 22 | <code>web_fetch said: I return readable text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>web_fetch did: I decoded arbitrary HTTP bytes as text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>runtime/evidence layer then accepted bytes-looking text as evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>Codex avoids this class of bug by keeping tool declarations and executable behavior tied together, and by separating generic web search, shell execution, MCP tools, MCP resources, dynamic tools, and freeform patch tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>## 1. Model-Visible Tool Spec</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>Codex starts with a closed enum of model-visible tool shapes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_spec.rs:13</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_spec.rs:17</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 43 | <code>#[derive(Debug, Clone, Serialize, PartialEq)]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 44 | <code>#[serde(tag = "type")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 45 | <code>pub enum ToolSpec {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>    #[serde(rename = "function")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 47 | <code>    Function(ResponsesApiTool),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>    #[serde(rename = "namespace")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 49 | <code>    Namespace(ResponsesApiNamespace),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>    #[serde(rename = "tool_search")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 51 | <code>    ToolSearch {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>        execution: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>        description: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>        parameters: JsonSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>    #[serde(rename = "image_generation")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 57 | <code>    ImageGeneration { output_format: String },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>    #[serde(rename = "web_search")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 59 | <code>    WebSearch { ... },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>    #[serde(rename = "custom")]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 61 | <code>    Freeform(FreeformTool),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>`web_search` is not the same thing as an arbitrary downloader.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>`Freeform` is not a JSON function.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>`Namespace` tools are explicitly grouped.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>`tool_search` is its own model-visible mechanism for discovering deferred tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>For AILIS, this means `web_fetch`, `pdf_extract_text`, `download_file`, `read_mcp_resource`, and `browser_extract_dom` should not all pretend to be the same kind of thing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## 2. Function Tool Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>Codex's normal function tool shape is `ResponsesApiTool`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 84 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\responses_api.rs:25</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\responses_api.rs:127</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 91 | <code>pub struct ResponsesApiTool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>    pub name: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>    pub description: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>    pub strict: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>    pub defer_loading: Option&lt;bool&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>    pub parameters: JsonSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>    #[serde(skip)]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 98 | <code>    pub output_schema: Option&lt;Value&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>pub fn tool_definition_to_responses_api_tool(tool_definition: ToolDefinition) -&gt; ResponsesApiTool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>    ResponsesApiTool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>        name: tool_definition.name,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>        description: tool_definition.description,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>        strict: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>        defer_loading: tool_definition.defer_loading.then_some(true),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>        parameters: tool_definition.input_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>        output_schema: tool_definition.output_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>The important part is `parameters` plus `output_schema`. Codex has a place to say what input the model must provide and what output shape the tool returns. Even when `strict` is false, the contract is still represented structurally.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>The lower-level metadata is `ToolDefinition`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 120 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_definition.rs:4</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_definition.rs:21</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 127 | <code>pub struct ToolDefinition {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>    pub name: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>    pub description: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>    pub input_schema: JsonSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>    pub output_schema: Option&lt;JsonValue&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>    pub defer_loading: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>pub fn into_deferred(mut self) -&gt; Self {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>    self.output_schema = None;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>    self.defer_loading = true;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>    self</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>Meaning for AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>If a tool returns "readable text", the output contract should make that explicit. If the HTTP response is `application/pdf`, a text fetch tool should return `unsupported_content_type`, not a fake success.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>## 3. Runtime Executor Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>The central Codex boundary is `ToolExecutor`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 153 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_executor.rs:6</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_executor.rs:35</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 160 | <code>pub enum ToolExposure {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>    Direct,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>    Deferred,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>    DirectModelOnly,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>    Hidden,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>#[async_trait::async_trait]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 168 | <code>pub trait ToolExecutor&lt;Invocation&gt;: Send + Sync {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>    fn tool_name(&amp;self) -&gt; ToolName;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>    fn spec(&amp;self) -&gt; ToolSpec;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    fn exposure(&amp;self) -&gt; ToolExposure {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>        ToolExposure::Direct</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>    fn supports_parallel_tool_calls(&amp;self) -&gt; bool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>        false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    async fn handle(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>        &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>        invocation: Invocation,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>    ) -&gt; Result&lt;Box&lt;dyn ToolOutput&gt;, FunctionCallError&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>This is the key design: model-visible spec and executable runtime are tied together. A tool cannot merely be a prompt fragment. It must provide:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 190 | <code>tool_name -&gt; identity</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>spec -&gt; schema and model-visible description</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>exposure -&gt; whether it is visible now or discoverable later</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>handle -&gt; actual execution</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>AILIS should mirror this boundary. Each AILIS tool should have one owner object/module that owns both the schema and the execution behavior.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>## 4. Router and Payload Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>Codex converts model output into a typed `ToolCall` before dispatching.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 205 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:27</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:89</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 212 | <code>pub struct ToolCall {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>    pub tool_name: ToolName,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>    pub call_id: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>    pub payload: ToolPayload,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>pub fn build_tool_call(item: ResponseItem) -&gt; Result&lt;Option&lt;ToolCall&gt;, FunctionCallError&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>    match item {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>        ResponseItem::FunctionCall { name, namespace, arguments, call_id, .. } =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>            let tool_name = ToolName::new(namespace, name);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>            Ok(Some(ToolCall {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>                tool_name,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>                call_id,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>                payload: ToolPayload::Function { arguments },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>            }))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>        ResponseItem::ToolSearchCall { call_id: Some(call_id), execution, arguments, .. }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>            if execution == "client" =&gt; { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>        ResponseItem::CustomToolCall { name, input, call_id, .. } =&gt; { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>        _ =&gt; Ok(None),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>The model does not directly call arbitrary JavaScript. It emits a tool-call item, and Codex maps that item into one of a few payload types. This gives the runtime a chance to reject an incompatible payload before execution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>## 5. Registry Dispatch Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>Codex dispatches through `ToolRegistry`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 247 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:42</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:249</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:326</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 255 | <code>pub(crate) trait CoreToolRuntime: ToolExecutor&lt;ToolInvocation&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>    fn search_info(&amp;self) -&gt; Option&lt;ToolSearchInfo&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 257 | <code>        None</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>    fn matches_kind(&amp;self, payload: &amp;ToolPayload) -&gt; bool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>        matches!(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>            payload,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>            ToolPayload::Function { .. } &#124; ToolPayload::ToolSearch { .. }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>        )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>pub struct ToolRegistry {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>    tools: HashMap&lt;ToolName, Arc&lt;dyn CoreToolRuntime&gt;&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>Dispatch checks the tool exists and the payload kind matches.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 278 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:362</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:396</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 285 | <code>let tool = match self.tool(&amp;tool_name) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>    Some(tool) =&gt; tool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>    None =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>        let message = unsupported_tool_call_message(&amp;invocation.payload, &amp;tool_name);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>        return Err(FunctionCallError::RespondToModel(message));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>if !tool.matches_kind(&amp;invocation.payload) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>    let message = format!("tool {tool_name} invoked with incompatible payload");</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>    return Err(FunctionCallError::Fatal(message));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>Meaning for AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>Validation should happen before execution, and errors should be tool errors, not vague Agent uncertainty. If `pdf_extract_text` receives an HTML URL, it can reject it. If `web_fetch_text` receives a PDF content type, it can reject it.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>## 6. Tool Planning and Visibility</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>Codex does not dump every possible tool into every turn. It builds a planned tool set, then chooses which specs become model-visible.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 310 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:153</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:183</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:499</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 318 | <code>fn build_tool_specs_and_registry(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>    turn_context: &amp;TurnContext,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>    params: ToolRouterParams&lt;'_&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>) -&gt; (Vec&lt;ToolSpec&gt;, ToolRegistry) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 322 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>    add_tool_sources(&amp;context, &amp;mut planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>    append_tool_search_executor(&amp;context, &amp;mut planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>    prepend_code_mode_executors(&amp;context, &amp;mut planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>    build_model_visible_specs_and_registry(turn_context, planned_tools)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>fn add_tool_sources(context: &amp;CoreToolPlanContext&lt;'_&gt;, planned_tools: &amp;mut PlannedTools) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>    add_shell_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>    add_mcp_resource_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>    add_core_utility_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>    add_collaboration_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>    add_mcp_runtime_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>    add_dynamic_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>    add_extension_tools(context, planned_tools);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>    for spec in hosted_model_tool_specs(context.turn_context) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>        planned_tools.add_hosted_spec(spec);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>Direct tools enter the model-visible list.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 348 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:191</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:198</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 355 | <code>for runtime in &amp;runtimes {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>    let exposure = runtime.exposure();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>    if exposure.is_direct() &amp;&amp; !is_hidden_by_code_mode_only(turn_context, &amp;tool_name, exposure) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 358 | <code>        let spec = runtime.spec();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 359 | <code>        specs.push(spec_for_model_request(turn_context, exposure, spec));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 360 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>let registry = ToolRegistry::from_tools(runtimes);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>Important detail:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>All runtimes are registered, but only direct tools are initially visible. Deferred tools can still be discovered through `tool_search`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>## 7. Deferred Tool Search</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>Codex has a formal tool discovery mechanism, not a giant prompt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 377 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:762</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 379 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:19</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 385 | <code>fn append_tool_search_executor(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 386 | <code>    context: &amp;CoreToolPlanContext&lt;'_&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 387 | <code>    planned_tools: &amp;mut PlannedTools,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 388 | <code>) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>    if !(search_tool_enabled(turn_context) &amp;&amp; namespace_tools_enabled(turn_context)) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>        return;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 391 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>    let search_infos = planned_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>        .runtimes()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>        .iter()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 396 | <code>        .filter(&#124;executor&#124; executor.exposure() == ToolExposure::Deferred)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>        .filter_map(&#124;executor&#124; executor.search_info())</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>        .collect::&lt;Vec&lt;_&gt;&gt;();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>    planned_tools.add(ToolSearchHandler::new(search_infos));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 402 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>Tool search indexes text but returns real loadable tool specs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 409 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:39</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:103</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 416 | <code>let documents: Vec&lt;Document&lt;usize&gt;&gt; = entries</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 417 | <code>    .iter()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>    .map(&#124;entry&#124; entry.search_text.clone())</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 419 | <code>    .enumerate()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 420 | <code>    .map(&#124;(idx, search_text)&#124; Document::new(idx, search_text))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 421 | <code>    .collect();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>let tools = self.search(query, limit)?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>Ok(boxed_tool_output(ToolSearchOutput { tools }))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 425 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>Deferred specs deliberately remove `output_schema`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 432 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:25</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\tool_search_entry.rs:35</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 438 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 439 | <code>ToolSpec::Function(mut tool) =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 440 | <code>    tool.defer_loading = Some(true);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 441 | <code>    tool.output_schema = None;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 442 | <code>    LoadableToolSpec::Function(tool)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>ToolSpec::Namespace(mut namespace) =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>    for tool in &amp;mut namespace.tools {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>        let ResponsesApiNamespaceTool::Function(tool) = tool;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 448 | <code>        tool.defer_loading = Some(true);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 449 | <code>        tool.output_schema = None;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 451 | <code>    LoadableToolSpec::Namespace(namespace)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 452 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 453 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>Meaning for AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 457 | <code>Capability catalog should not dump every contract into the first prompt. It should expose a small direct set plus a searchable deferred catalog. The model can ask for relevant tools when needed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>## 8. MCP Tool Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>Codex treats MCP as a real external protocol layer, not just a bridge string.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>`ToolInfo` keeps raw MCP identity and model-visible identity separately.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 468 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:28</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 469 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:139</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 470 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 475 | <code>pub struct ToolInfo {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 476 | <code>    pub server_name: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 477 | <code>    pub supports_parallel_tool_calls: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 478 | <code>    pub server_origin: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 479 | <code>    pub callable_name: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 480 | <code>    pub callable_namespace: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>    pub namespace_description: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 482 | <code>    pub tool: Tool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 483 | <code>    pub connector_id: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 484 | <code>    pub connector_name: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>    pub plugin_display_names: Vec&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>pub(crate) fn normalize_tools_for_model&lt;I&gt;(tools: I) -&gt; Vec&lt;ToolInfo&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 489 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>The comments in Codex are exactly the rule AILIS should copy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 494 | <code>//! Raw MCP tool identities must be preserved for protocol calls, while</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 495 | <code>//! model-visible tool names must be sanitized, deduplicated, and kept within API</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 496 | <code>//! limits.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 497 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>MCP input schema can be shaped before exposing to the model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 501 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 504 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\tools.rs:114</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 505 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 510 | <code>pub(crate) fn tool_with_model_visible_input_schema(tool: &amp;Tool) -&gt; Tool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>    let file_params = declared_openai_file_input_param_names(tool.meta.as_deref());</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 512 | <code>    if file_params.is_empty() {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>        return tool.clone();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>    let mut tool = tool.clone();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 517 | <code>    let mut input_schema = JsonValue::Object(tool.input_schema.as_ref().clone());</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 518 | <code>    mask_input_schema_for_file_path_params(&amp;mut input_schema, &amp;file_params);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 520 | <code>    tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 521 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 522 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 526 | <code>The MCP server owns the raw protocol schema. Codex can adapt the model-visible schema without corrupting the raw execution identity.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>## 9. MCP Tool Output Schema</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>Codex does not flatten MCP results into arbitrary text by default. It wraps MCP result shape.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 534 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 535 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\mcp_tool.rs:6</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 536 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\mcp_tool.rs:39</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 537 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 542 | <code>pub fn parse_mcp_tool(tool: &amp;rmcp::model::Tool) -&gt; Result&lt;ToolDefinition, serde_json::Error&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 543 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>    Ok(ToolDefinition {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 545 | <code>        name: tool.name.to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 546 | <code>        description: tool.description.clone().map(Into::into).unwrap_or_default(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>        input_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>        output_schema: Some(mcp_call_tool_result_output_schema(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 549 | <code>            structured_content_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 550 | <code>        )),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 551 | <code>        defer_loading: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 552 | <code>    })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 553 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>pub fn mcp_call_tool_result_output_schema(structured_content_schema: JsonValue) -&gt; JsonValue {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 556 | <code>    json!({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 557 | <code>        "type": "object",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 558 | <code>        "properties": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 559 | <code>            "content": { "type": "array", "items": { "type": "object" } },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 560 | <code>            "structuredContent": structured_content_schema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 561 | <code>            "isError": { "type": "boolean" },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 562 | <code>            "_meta": { "type": "object" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>        },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 564 | <code>        "required": ["content"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 565 | <code>        "additionalProperties": false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>    })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 569 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 570 | <code>Meaning for the PDF bug:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>An MCP `web_fetch` tool should return something like:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 575 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 576 | <code>  "content": [{ "type": "text", "text": "unsupported content type: application/pdf" }],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 577 | <code>  "structuredContent": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 578 | <code>    "ok": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>    "error_code": "unsupported_content_type",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 580 | <code>    "content_type": "application/pdf",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 581 | <code>    "suggested_tool": "pdf_extract_text"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 582 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 583 | <code>  "isError": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 584 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 585 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>It should not return `%PDF-1.5...` as if it were readable paper text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>## 10. MCP Handler and Real Transport</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>Codex wraps each MCP tool in an `McpHandler`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 595 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 596 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:55</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 600 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 603 | <code>pub struct McpHandler {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>    tool_info: ToolInfo,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 605 | <code>    spec: ToolSpec,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 606 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>async fn handle(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 609 | <code>    &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 610 | <code>    invocation: ToolInvocation,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 611 | <code>) -&gt; Result&lt;Box&lt;dyn ToolOutput&gt;, FunctionCallError&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 612 | <code>    let payload = match payload {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 613 | <code>        ToolPayload::Function { arguments } =&gt; arguments,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 614 | <code>        _ =&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 615 | <code>            return Err(FunctionCallError::RespondToModel(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 616 | <code>                "mcp handler received unsupported payload".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 617 | <code>            ));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 618 | <code>        }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 619 | <code>    };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>    let result = handle_mcp_tool_call(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 622 | <code>        Arc::clone(&amp;session),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 623 | <code>        &amp;turn,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 624 | <code>        call_id.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>        self.tool_info.server_name.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>        self.tool_info.tool.name.to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 627 | <code>        self.tool_name().to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 628 | <code>        payload,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 629 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 630 | <code>    .await;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 631 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 632 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>The actual transport call goes through `McpConnectionManager`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 636 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 639 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_call.rs:547</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 640 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_call.rs:571</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 641 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:589</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 642 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 644 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 647 | <code>let result = sess</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 648 | <code>    .call_tool(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 649 | <code>        &amp;invocation.server,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 650 | <code>        &amp;invocation.tool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 651 | <code>        rewritten_arguments,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 652 | <code>        request_meta,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 653 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 654 | <code>    .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 655 | <code>    .map_err(&#124;e&#124; format!("tool call error: {e:?}"))?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 656 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>And in the MCP manager:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 660 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 661 | <code>pub async fn call_tool(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>    &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 663 | <code>    server: &amp;str,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 664 | <code>    tool: &amp;str,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 665 | <code>    arguments: Option&lt;serde_json::Value&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 666 | <code>    meta: Option&lt;serde_json::Value&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 667 | <code>) -&gt; Result&lt;CallToolResult&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 668 | <code>    let client = self.client_by_name(server).await?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 669 | <code>    if !client.tool_filter.allows(tool) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 670 | <code>        return Err(anyhow!(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 671 | <code>            "tool '{tool}' is disabled for MCP server '{server}'"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 672 | <code>        ));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 673 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>    let result: rmcp::model::CallToolResult = client</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 676 | <code>        .client</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 677 | <code>        .call_tool(tool.to_string(), arguments, meta, client.tool_timeout)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 678 | <code>        .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 679 | <code>        .with_context(&#124;&#124; format!("tool call failed for `{server}/{tool}`"))?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 680 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 681 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>Codex MCP is a real client manager with server startup, tool filters, timeouts, and actual `tools/call`. AILIS should not treat MCP as a passive registry plus manual wrappers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>## 11. MCP Resources Are Not MCP Tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>Codex separates `call_tool` from `read_resource`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 691 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 694 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource_spec.rs:6</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 695 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource_spec.rs:62</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 696 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp_resource\read_mcp_resource.rs:27</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 697 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:669</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 698 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 702 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 703 | <code>pub fn create_list_mcp_resources_tool() -&gt; ToolSpec { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>pub fn create_list_mcp_resource_templates_tool() -&gt; ToolSpec { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 705 | <code>pub fn create_read_mcp_resource_tool() -&gt; ToolSpec { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 706 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>And the read handler:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 711 | <code>pub struct ReadMcpResourceHandler;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>async fn handle(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>    &amp;self,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 715 | <code>    invocation: ToolInvocation,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 716 | <code>) -&gt; Result&lt;Box&lt;dyn ToolOutput&gt;, FunctionCallError&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 717 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 718 | <code>    let result = session</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 719 | <code>        .read_resource(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 720 | <code>            &amp;server,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 721 | <code>            ReadResourceRequestParams {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 722 | <code>                meta: None,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>                uri: uri.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>            },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>        )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>        .await</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>        .map_err(&#124;err&#124; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>            FunctionCallError::RespondToModel(format!("resources/read failed: {err:#}"))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>        })?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 731 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>Meaning for AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>Do not merge "tools" and "resources" into one vague MCP bridge. A database schema, a file-like resource, and an executable GitHub action are different surfaces.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 737 | <code>## 12. Hosted Web Search Is Not Web Fetch</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 739 | <code>Codex models hosted web search as a `ToolSpec::WebSearch`, not as a generic function tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 741 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 744 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\hosted_spec.rs:20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:241</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 746 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 748 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 751 | <code>pub fn create_web_search_tool(options: WebSearchToolOptions&lt;'_&gt;) -&gt; Option&lt;ToolSpec&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 752 | <code>    let external_web_access = match options.web_search_mode {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 753 | <code>        Some(WebSearchMode::Cached) =&gt; Some(false),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>        Some(WebSearchMode::Live) =&gt; Some(true),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 755 | <code>        Some(WebSearchMode::Disabled) &#124; None =&gt; None,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>    }?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 758 | <code>    Some(ToolSpec::WebSearch {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 759 | <code>        external_web_access: Some(external_web_access),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 760 | <code>        filters: ...,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 761 | <code>        user_location: ...,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 762 | <code>        search_context_size: ...,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 763 | <code>        search_content_types,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 764 | <code>    })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 765 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 766 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 770 | <code>Search is not fetch. Fetch is not parse. Parse is not summarize. AILIS should split these:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 771 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 772 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 773 | <code>web_search: find sources</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 774 | <code>web_fetch_text/html: retrieve readable HTML/text only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 775 | <code>download_file: download bytes to a file</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 776 | <code>pdf_extract_text: parse PDF to readable text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 777 | <code>paper_fetch: task-level composition that may call search/fetch/pdf/html tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 778 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 780 | <code>The last one can be a skill or higher-level tool, but the lower tools must keep hard boundaries.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>## 13. Shell Tool Has Explicit Output Schema</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 783 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 784 | <code>Codex's shell tool is a concrete function with explicit input parameters and an output schema.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 785 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 786 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 789 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:19</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 790 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:247</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 791 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 793 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 795 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 796 | <code>ToolSpec::Function(ResponsesApiTool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 797 | <code>    name: "exec_command".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 798 | <code>    description: "...".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 799 | <code>    strict: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 800 | <code>    defer_loading: None,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 801 | <code>    parameters: JsonSchema::object(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 802 | <code>        properties,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 803 | <code>        Some(vec!["cmd".to_string()]),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 804 | <code>        Some(false.into()),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 805 | <code>    ),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 806 | <code>    output_schema: Some(unified_exec_output_schema()),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 807 | <code>})</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 808 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>The output schema includes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 811 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 812 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 813 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 814 | <code>  "wall_time_seconds": "number",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 815 | <code>  "exit_code": "number",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 816 | <code>  "session_id": "number",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 817 | <code>  "original_token_count": "number",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 818 | <code>  "output": "string"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 819 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 820 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 824 | <code>Command execution has a real lifecycle. If still running, return a `session_id`. If output is truncated, return `original_token_count`. AILIS's tool layer should follow this pattern for long-running browser, repo, PDF, and benchmark tasks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 826 | <code>## 14. Apply Patch Is Freeform Grammar</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 828 | <code>Codex does not model file patching as arbitrary shell text. It uses a grammar-bound freeform tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 832 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 833 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 834 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:9</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 835 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 839 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 840 | <code>const APPLY_PATCH_LARK_GRAMMAR: &amp;str = include_str!("apply_patch.lark");</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>pub fn create_apply_patch_freeform_tool(include_environment_id: bool) -&gt; ToolSpec {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 843 | <code>    ToolSpec::Freeform(FreeformTool {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 844 | <code>        name: "apply_patch".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 845 | <code>        description: "Use the `apply_patch` tool to edit files. This is a FREEFORM tool, so do not wrap the patch in JSON.".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 846 | <code>        format: FreeformToolFormat {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 847 | <code>            r#type: "grammar".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 848 | <code>            syntax: "lark".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 849 | <code>            definition,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 850 | <code>        },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 851 | <code>    })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 852 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 853 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 857 | <code>Some tools should not be JSON functions. For AILIS, this matters if we later add structured patching, region screenshots, or UI action scripts. If the payload has a domain grammar, expose it as a grammar or strict schema, not loose prose.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 859 | <code>## 15. Dynamic Tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>Codex supports tools contributed by the current thread/session as dynamic tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 862 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 863 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 866 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:32</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 867 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:39</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 868 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\dynamic.rs:129</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 869 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 871 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 872 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 873 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 874 | <code>pub struct DynamicToolHandler {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 875 | <code>    tool_name: ToolName,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 876 | <code>    spec: ToolSpec,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 877 | <code>    exposure: ToolExposure,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 878 | <code>    search_text: String,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 879 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>pub fn new(tool: &amp;DynamicToolSpec) -&gt; Option&lt;Self&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 882 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 883 | <code>    exposure: if tool.defer_loading {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>        ToolExposure::Deferred</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 885 | <code>    } else {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 886 | <code>        ToolExposure::Direct</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 887 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 888 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 890 | <code>impl CoreToolRuntime for DynamicToolHandler {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 891 | <code>    fn search_info(&amp;self) -&gt; Option&lt;ToolSearchInfo&gt; {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 892 | <code>        ToolSearchInfo::from_spec(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 893 | <code>            self.search_text.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 894 | <code>            self.spec(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 895 | <code>            Some(ToolSearchSourceInfo {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 896 | <code>                name: "Dynamic tools".to_string(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 897 | <code>                description: Some("Tools provided by the current Codex thread.".to_string()),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 898 | <code>            }),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 899 | <code>        )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 900 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 901 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 902 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 903 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 904 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 906 | <code>AILIS's `Capability Registry` and `Skill Auto-Authoring` should map nicely to this. Newly installed capabilities can become dynamic tools with `defer_loading` instead of permanently bloating the first prompt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 908 | <code>## 16. Output Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 909 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 910 | <code>Codex makes tool output responsible for how it re-enters the model context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 911 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 912 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 915 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_output.rs:15</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 916 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\context.rs:65</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 917 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\context.rs:110</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 918 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 920 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 922 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 923 | <code>pub trait ToolOutput: Send {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 924 | <code>    fn log_preview(&amp;self) -&gt; String;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 925 | <code>    fn success_for_logging(&amp;self) -&gt; bool;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 926 | <code>    fn to_response_item(&amp;self, call_id: &amp;str, payload: &amp;ToolPayload) -&gt; ResponseInputItem;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 927 | <code>    fn code_mode_result(&amp;self, payload: &amp;ToolPayload) -&gt; JsonValue { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 928 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 929 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>MCP output has a dedicated wrapper:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 934 | <code>pub struct McpToolOutput {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 935 | <code>    pub result: CallToolResult,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 936 | <code>    pub tool_input: JsonValue,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 937 | <code>    pub wall_time: Duration,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 938 | <code>    pub original_image_detail_supported: bool,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 939 | <code>    pub truncation_policy: TruncationPolicy,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 940 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>fn response_payload(&amp;self) -&gt; FunctionCallOutputPayload {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 943 | <code>    let mut payload = self.result.as_function_call_output_payload();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 944 | <code>    ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 945 | <code>    truncate_function_output_payload(&amp;payload, self.truncation_policy * 1.2)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 946 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 947 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 949 | <code>Important comment from Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 951 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 952 | <code>// This is the context-injection form, so keep it aligned with the</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 953 | <code>// function-call output truncation that conversation history already</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 954 | <code>// applies. Code-mode consumers still get the raw `CallToolResult`.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 955 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 957 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 959 | <code>Codex distinguishes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 962 | <code>raw result for programmatic consumers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 963 | <code>truncated model-context result</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 964 | <code>telemetry preview</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 965 | <code>post-tool hook payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 966 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>AILIS should not use one giant text blob for all four purposes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>## 17. What Codex Would Do Differently For The PDF Case</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>The Codex-aligned flow for `https://arxiv.org/abs/1706.03762` should be:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>1. Use search or fetch on the `abs` HTML page.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 975 | <code>2. Parse HTML as HTML/text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 976 | <code>3. If PDF is needed, either use a dedicated `download_file` tool or a dedicated `pdf_extract_text` tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 977 | <code>4. If a text-fetch tool sees `application/pdf`, return a typed unsupported content result.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 978 | <code>5. Let the model choose fallback based on explicit tool result, not on a fake success.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 979 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 980 | <code>Expected AILIS-style tool result for wrong tool:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 982 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 983 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 984 | <code>  "ok": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 985 | <code>  "error_code": "unsupported_content_type",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 986 | <code>  "url": "https://arxiv.org/pdf/1706.03762.pdf",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 987 | <code>  "content_type": "application/pdf",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 988 | <code>  "message": "web_fetch_text only returns readable HTML or text. Use pdf_extract_text or download_file.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 989 | <code>  "suggested_tools": ["pdf_extract_text", "download_file"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 990 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 991 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 992 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 993 | <code>This keeps the Agent intelligent. It does not hardcode "if arxiv then PDF parser". It simply makes the tool honest.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 995 | <code>## 18. Codex-to-AILIS Mapping</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 997 | <code>&#124; Codex concept &#124; Codex source &#124; AILIS target &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 998 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 999 | <code>&#124; `ToolSpec` enum &#124; `tools/src/tool_spec.rs:17` &#124; AILIS tool specs should have distinct kinds: function, namespace, hosted/search, freeform, MCP &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1000 | <code>&#124; `ResponsesApiTool` &#124; `tools/src/responses_api.rs:25` &#124; Every tool has name, description, input schema, output schema, defer flag &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1001 | <code>&#124; `ToolExecutor` &#124; `tools/src/tool_executor.rs:41` &#124; Every tool implementation owns both spec and `handle()` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1002 | <code>&#124; `ToolExposure` &#124; `tools/src/tool_executor.rs:8` &#124; Direct vs deferred vs hidden tools; avoid first-prompt bloat &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1003 | <code>&#124; `ToolRouter` &#124; `core/src/tools/router.rs:34` &#124; Convert model output into typed calls before execution &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1004 | <code>&#124; `ToolRegistry` &#124; `core/src/tools/registry.rs:249` &#124; Single dispatch path, payload-kind check, hooks, telemetry &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1005 | <code>&#124; `ToolSearchHandler` &#124; `core/src/tools/handlers/tool_search.rs:23` &#124; Searchable capability catalog instead of giant prompt &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1006 | <code>&#124; `McpConnectionManager` &#124; `codex-mcp/src/connection_manager.rs:70` &#124; Real MCP session manager, not passive bridge &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1007 | <code>&#124; `McpHandler` &#124; `core/src/tools/handlers/mcp.rs:29` &#124; One MCP tool -&gt; one runtime wrapper &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1008 | <code>&#124; `ReadMcpResourceHandler` &#124; `core/src/tools/handlers/mcp_resource/read_mcp_resource.rs:27` &#124; Resources separate from tools &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1009 | <code>&#124; `McpToolOutput` &#124; `core/src/tools/context.rs:65` &#124; Raw result, context result, telemetry preview separated &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1010 | <code>&#124; `apply_patch` freeform &#124; `core/src/tools/handlers/apply_patch_spec.rs:9` &#124; Domain grammar for patch-like operations &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1011 | <code>&#124; hosted `web_search` &#124; `core/src/tools/hosted_spec.rs:20` &#124; Search is not fetch; fetch is not parse &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1013 | <code>## 19. Practical AILIS Rules From Codex</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1015 | <code>Rule 1: Tool names must not overpromise.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1017 | <code>`web_fetch_text` should not return binary PDF bytes. `pdf_extract_text` should not claim to browse HTML pages.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>Rule 2: Runtime result must match the output schema.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1020 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1021 | <code>If the schema says `text`, validate that text is readable text. If validation fails, return structured error.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1023 | <code>Rule 3: Separate search, fetch, download, parse, and summarize.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1025 | <code>The Agent can compose them. The tool layer should not blur them.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1027 | <code>Rule 4: Tool visibility should be staged.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1028 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1029 | <code>Use direct tools for core primitives and `tool_search` for specialized tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1030 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1031 | <code>Rule 5: MCP tool identity must be split.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1033 | <code>Preserve raw server/tool names for protocol calls. Sanitize names only for the model-visible surface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1034 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1035 | <code>Rule 6: Evidence should not decide semantic success from text length.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1036 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1037 | <code>A ledger may record tool observations, but it should not declare a PDF parsed just because a string is long.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1038 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1039 | <code>Rule 7: Final answer should be model/Agent-owned.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1041 | <code>Runtime can block impossible or unsafe calls, but should not replace incomplete work with canned "uncertain" templates.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1043 | <code>## 20. Refactor Target And Current Status</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>The least invasive Codex-aligned change was:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1046 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1047 | <code>1. Introduce a `ToolRuntime` contract parallel to Codex `ToolExecutor`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1048 | <code>2. Move tool schema and handler into the same module for each AILIS tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1049 | <code>3. Add `ToolExposure` and a searchable deferred catalog.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1050 | <code>4. Split `web_fetch` into honest primitives:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1051 | <code>   `web_fetch_text`, `web_fetch_html`, `download_file`, `pdf_extract_text`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1052 | <code>5. Change MCP result shape to preserve `content`, `structuredContent`, `isError`, `_meta`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1053 | <code>6. Keep observation records as eval/debug metadata, never as the completion judge.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1054 | <code>7. Let the Agent loop decide next step from real tool results.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1055 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1056 | <code>This is not a large rewrite. It is a boundary correction. The existing AILIS Agent can remain the brain; the tool layer just has to stop lying to it.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1057 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1058 | <code>Current AILIS status after the Codex-aligned tool runtime pass:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1059 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1060 | <code>&#124; Target &#124; AILIS status &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1061 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1062 | <code>&#124; `ToolExecutor`-like object &#124; Implemented in `electron/ailis-tool-runtime.cjs` as `AILISRuntimeTool`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1063 | <code>&#124; Central `ToolRegistry` &#124; Implemented as `AILISToolRuntimeRegistry`; runtime and gateway dispatch through it first. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1064 | <code>&#124; Tool exposure &#124; Implemented as `TOOL_EXPOSURE.DIRECT/DEFERRED/HIDDEN`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1065 | <code>&#124; Runtime `tool_search` &#124; Implemented as a real callable tool returning loadable specs for runtime, gateway, and MCP tools. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1066 | <code>&#124; Direct MCP tool ids &#124; Implemented as `mcp__server__tool` for the model-facing canonical id, with legacy `mcp:&lt;server&gt;:&lt;tool&gt;` accepted as a compatibility alias; the registry converts either form to MCP `tools/call`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1067 | <code>&#124; Gateway-local tools &#124; Registered into the gateway registry: `email`, `file_manager`, `computer`, `code`, `artifact_verifier`, `vision.capture_context`, `read`, `write`, `exec`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1068 | <code>&#124; Tool outputs &#124; Normalized through the registry into `content`, `details`, and `structuredContent`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1069 | <code>&#124; Deprecated task gates &#124; Removed from the main loop: `TaskSpec`, `TaskGraph`, `EvidenceLedger`, and `RecoveryLoop` are no longer completion gates. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1070 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1071 | <code>## 21. Actual Codex Tool Selection Chain</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1072 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1073 | <code>Codex does not have an AILIS-style `TaskSpec`, `TaskGraph`, or `EvidenceLedger` gate in the main turn loop. Tool selection is produced by this chain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1075 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1076 | <code>conversation history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1077 | <code>  -&gt; build_skills_and_plugins(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1078 | <code>  -&gt; built_tools(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1079 | <code>  -&gt; ToolRouter(model_visible_specs + runtime registry)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1080 | <code>  -&gt; build_prompt(input, router, turn_context, base_instructions)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1081 | <code>  -&gt; model returns ResponseItem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1082 | <code>  -&gt; ToolRouter::build_tool_call(ResponseItem)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1083 | <code>  -&gt; ToolRegistry::dispatch_any_with_terminal_outcome(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1084 | <code>  -&gt; ToolOutput::to_response_item(...)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1085 | <code>  -&gt; next model request sees the observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1086 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1087 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1088 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1089 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1090 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1091 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:117</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1092 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:887</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1093 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:90</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1094 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:326</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1095 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\tools\src\tool_output.rs:16</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1096 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1097 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1098 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1100 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1101 | <code>/// Takes a user message as input and runs a loop where, at each sampling request, the model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1102 | <code>/// replies with either:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1103 | <code>///</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1104 | <code>/// - requested function calls</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1105 | <code>/// - an assistant message</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1106 | <code>///</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1107 | <code>/// If the model requests a function call, we execute it and send the output</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1108 | <code>/// back to the model in the next sampling request.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1109 | <code>pub(crate) async fn run_turn(...) -&gt; Option&lt;String&gt; { ... }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1110 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1112 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1113 | <code>pub(crate) fn build_prompt(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1114 | <code>    input: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1115 | <code>    router: &amp;ToolRouter,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1116 | <code>    turn_context: &amp;TurnContext,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1117 | <code>    base_instructions: BaseInstructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1118 | <code>) -&gt; Prompt {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1119 | <code>    Prompt {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1120 | <code>        input,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1121 | <code>        tools: router.model_visible_specs(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1122 | <code>        parallel_tool_calls: turn_context.model_info.supports_parallel_tool_calls,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1123 | <code>        base_instructions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1124 | <code>        personality: turn_context.personality,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1125 | <code>        output_schema: turn_context.final_output_json_schema.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1126 | <code>        output_schema_strict: ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1127 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1128 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1129 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>Meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1133 | <code>Codex gives the model typed tools and prior observations. The model decides the next call. Runtime parses and executes it. Runtime does not pre-classify the task into a narrow action lane.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1135 | <code>## 22. Codex Tool Semantics Are Runtime Objects</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1137 | <code>In Codex, "tool semantics" are not just natural-language prompt text. They are runtime-owned objects with five properties:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1139 | <code>&#124; Semantic part &#124; Codex owner &#124; Source &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1140 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1141 | <code>&#124; Callable identity &#124; `ToolName`, `ToolInfo` &#124; `tools/src/tool_executor.rs:41`, `codex-mcp/src/tools.rs:29` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1142 | <code>&#124; Model-visible schema &#124; `ToolSpec`, `ResponsesApiTool` &#124; `tools/src/tool_spec.rs:17`, `tools/src/responses_api.rs:26` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1143 | <code>&#124; Visibility policy &#124; `ToolExposure` &#124; `tools/src/tool_executor.rs:8` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1144 | <code>&#124; Runtime handler &#124; `ToolExecutor::handle` &#124; `tools/src/tool_executor.rs:41` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1145 | <code>&#124; Model-facing result &#124; `ToolOutput::to_response_item` &#124; `tools/src/tool_output.rs:16` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1147 | <code>Representative Codex code:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1149 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1150 | <code>#[async_trait::async_trait]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1151 | <code>pub trait ToolExecutor&lt;Invocation&gt;: Send + Sync {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1152 | <code>    fn tool_name(&amp;self) -&gt; ToolName;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1153 | <code>    fn spec(&amp;self) -&gt; ToolSpec;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1154 | <code>    fn exposure(&amp;self) -&gt; ToolExposure { ToolExposure::Direct }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1155 | <code>    async fn handle(&amp;self, invocation: Invocation) -&gt; Result&lt;Box&lt;dyn ToolOutput&gt;, FunctionCallError&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1156 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1157 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1159 | <code>This is the part AILIS should copy most directly. If a tool module owns only prompt text but not executable behavior, it is not Codex-like. If a runtime handler executes something that its schema did not promise, it is also not Codex-like.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1161 | <code>## 23. Where AILIS Currently Differs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1163 | <code>AILIS is already closer than before, but there are still real differences that explain the research failures.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1165 | <code>### 23.1 AILIS still has a JSON planner protocol before tool calls</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1167 | <code>AILIS asks the model to emit an intermediate JSON decision:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1169 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1170 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:2863</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1171 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:2879</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1172 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:2921</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1173 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1175 | <code>AILIS-side shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1177 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1178 | <code>action="load_context&#124;tool&#124;final&#124;blocked"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1179 | <code>tool_call={tool,title,args}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1180 | <code>capability_request={skills,tools,mcp,reason}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1181 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1183 | <code>Codex does not require the model to satisfy this extra JSON planner layer. It uses the model provider's native response items:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1185 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1186 | <code>ResponseItem::FunctionCall</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1187 | <code>ResponseItem::ToolSearchCall</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1188 | <code>ResponseItem::CustomToolCall</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1189 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1191 | <code>Consequence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1193 | <code>For AILIS, the model can fail before it reaches the real tool layer. In the Playwright task, it had to learn `load_context`, then `mcp_bridge`, then MCP inner tool schema, then file-write schema. Codex shortens that path by putting real tool specs directly in `tools`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1195 | <code>### 23.2 AILIS keeps `mcp_bridge`, but normal calls can bypass it</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1197 | <code>AILIS runtime route:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1199 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1200 | <code>F:\AILIS\electron\ailis-runtime.cjs:1087</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1201 | <code>F:\AILIS\electron\ailis-runtime.cjs:1566</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1202 | <code>F:\AILIS\electron\ailis-runtime.cjs:1789</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1203 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1205 | <code>AILIS exposes `mcp_bridge` actions such as:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1207 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1208 | <code>schema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1209 | <code>list_servers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1210 | <code>list_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1211 | <code>list_tool_specs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1212 | <code>search_tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1213 | <code>read_resource</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1214 | <code>call_tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1215 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1217 | <code>Codex route:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1219 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1220 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1221 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1222 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1224 | <code>Codex wraps each MCP tool as a model-visible namespace function:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1226 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1227 | <code>Ok(ToolSpec::Namespace(ResponsesApiNamespace {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1228 | <code>    name: tool_info.callable_namespace.clone(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1229 | <code>    description,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1230 | <code>    tools: vec![ResponsesApiNamespaceTool::Function(tool)],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1231 | <code>}))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1232 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1234 | <code>Current consequence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1236 | <code>AILIS keeps `mcp_bridge` for management actions such as server registration, health checks, resource reads, prompts, and schema discovery. Normal MCP tool calls no longer have to go through the bridge: `AILISToolRuntimeRegistry.dispatch()` recognizes canonical `mcp__server__tool` ids and also accepts legacy `mcp:&lt;server&gt;:&lt;tool&gt;` aliases, then forwards the original args to MCP `tools/call`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1238 | <code>Remaining gap:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1240 | <code>Codex represents MCP tools as provider-native namespace/function specs. AILIS now has equivalent direct ids and specs, but the Agent still uses an AILIS JSON planner protocol instead of provider-native `ResponseItem::FunctionCall`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>### 23.3 AILIS capability loading is similar to Codex tool_search, but not the same</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1244 | <code>AILIS has a deferred first-turn catalog:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1246 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1247 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:1832</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1248 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:1848</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1249 | <code>F:\AILIS\electron\ailis-agent-runner.cjs:4152</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1250 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1252 | <code>This is conceptually aligned with Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1254 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1255 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\spec_plan.rs:762</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1256 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1257 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1259 | <code>But Codex `tool_search` returns loadable tool specs, not prose context:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1261 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1262 | <code>Ok(boxed_tool_output(ToolSearchOutput { tools }))</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1263 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1265 | <code>AILIS `load_context` returns text sections plus compact specs. That helps token budget, but the model still has to translate prose into AILIS's JSON tool-call protocol.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1267 | <code>Consequence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1269 | <code>For research tasks, AILIS may stop after reading enough prose to write an answer, even if it has not truly used the intended official-document tool. Codex's native tool output path makes the loaded tool itself part of the model's available callable surface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1271 | <code>### 23.4 AILIS file-write tools still compete</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1273 | <code>The Playwright task showed:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1275 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1276 | <code>filesystem_ailis.edit_file failed because the model guessed content instead of edits.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1277 | <code>filesystem_ailis.edit_file failed again because it needed oldText.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1278 | <code>computer.write failed once because the model guessed target instead of path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1279 | <code>computer.write then succeeded.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1280 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1282 | <code>This is not primarily a weak-model problem. It is a tool surface problem:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1284 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1285 | <code>too many overlapping write tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1286 | <code>schemas discovered after failure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1287 | <code>no single obvious "write file with content" direct tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1288 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1290 | <code>Codex avoids much of this by exposing clear local primitives:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1292 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1293 | <code>shell command with explicit output schema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1294 | <code>apply_patch as grammar-bound freeform edit tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1295 | <code>MCP/dynamic tools as namespace functions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1296 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1298 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1300 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1301 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\shell_spec.rs:19</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1302 | <code>F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\apply_patch_spec.rs:9</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1303 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1305 | <code>### 23.5 AILIS research tools improved, but the model-visible semantics are still indirect</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1307 | <code>The research MCP server now correctly rejects PDF bytes for `web_fetch`:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1309 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1310 | <code>F:\AILIS\scripts\mcp-ailis-research-server.cjs:216</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1311 | <code>F:\AILIS\scripts\mcp-ailis-research-server.cjs:923</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1312 | <code>F:\AILIS\tests\mcp-ailis-research-server.test.mjs:31</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1313 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1315 | <code>That fixes one concrete bug. The deeper issue is still that the model must discover:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1317 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1318 | <code>web_search -&gt; web_fetch for HTML/text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1319 | <code>pdf_extract_text for PDF</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1320 | <code>download_file for bytes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1321 | <code>artifact_verifier for final file checks</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1322 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1324 | <code>Codex's answer is not "hardcode if arxiv then pdf_extract_text". Codex's answer is "make these separate typed tools, make them searchable, and make wrong calls return structured observations".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1326 | <code>## 24. Why AILIS Research Fails In Plain Engineering Terms</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1328 | <code>The common failure chain is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1330 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1331 | <code>1. User asks for research or official docs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1332 | <code>2. AILIS first prompt exposes only a broad capability index.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1333 | <code>3. Model must decide to load MCP context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1334 | <code>4. Runtime returns MCP prose/spec context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1335 | <code>5. Model must choose either mcp_bridge or a direct MCP tool id such as mcp__server__tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1336 | <code>6. If it chooses mcp_bridge, it must also choose action/server/tool/args correctly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1337 | <code>7. A tool may fail with schema/content-type/output issues.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1338 | <code>8. The failure becomes observation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1339 | <code>9. Model may recover, but it may also final early if the partial text looks enough.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1340 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1342 | <code>So the root is mixed:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1344 | <code>&#124; Area &#124; Is it the model? &#124; Is it architecture/tools? &#124; What happens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1345 | <code>&#124; --- &#124; ---: &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1346 | <code>&#124; Choosing official evidence &#124; Partly &#124; Yes &#124; Search snippets look enough, so model may stop early &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1347 | <code>&#124; Calling file write &#124; Partly &#124; Yes &#124; Overlapping tools and late schemas cause guessing &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1348 | <code>&#124; PDF vs HTML &#124; No &#124; Yes &#124; Tool boundary must reject impossible content &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1349 | <code>&#124; MCP parameter schema &#124; Partly &#124; Yes &#124; Bridge indirection adds extra parameters &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1350 | <code>&#124; Final too early &#124; Partly &#124; Yes &#124; No native output artifact verification in the tool loop &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1352 | <code>The important diagnosis:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1354 | <code>This is not solved by adding more prompt rules. Prompt rules may help one benchmark and hurt another. Codex relies more on typed tools, native tool specs, and observation loops.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1356 | <code>## 25. Codex-Aligned AILIS Target Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1358 | <code>The target should be:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1360 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1361 | <code>Agent Loop</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1362 | <code>  -&gt; model sees direct core tools + tool_search-like discovery</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1363 | <code>  -&gt; model calls native direct tool ids</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1364 | <code>  -&gt; runtime validates payload shape</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1365 | <code>  -&gt; runtime executes exact handler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1366 | <code>  -&gt; ToolOutput returns structured success/error observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1367 | <code>  -&gt; model continues or final</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1368 | <code>  -&gt; Persona Surface renders final/progress for AILIS</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1369 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1371 | <code>Concrete AILIS mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1373 | <code>&#124; Codex module &#124; AILIS module to align &#124; Required shape &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1374 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1375 | <code>&#124; `ToolExecutor` &#124; `ailis-tool-runtime.cjs` or equivalent &#124; one object owns `id/spec/exposure/handle/output` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1376 | <code>&#124; `ToolSpec` &#124; `ailis-tool-contracts.cjs` &#124; separate model-visible schema from prose skill &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1377 | <code>&#124; `ToolExposure` &#124; `capability_catalog` &#124; direct/deferred/hidden instead of all prompt text &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1378 | <code>&#124; `ToolSearchHandler` &#124; `capability_manager` or new `tool_search` runtime tool &#124; returns loadable specs, not only prose &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1379 | <code>&#124; `McpHandler` &#124; `ailis-mcp-session.cjs` + runtime adapter &#124; one MCP tool becomes one direct callable spec &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1380 | <code>&#124; `ToolRegistry` &#124; `AILISRuntime.executeTool` &#124; central dispatch with payload-kind validation &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1381 | <code>&#124; `ToolOutput` &#124; runtime response normalizer &#124; raw result, model context, telemetry, persona text separated &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1382 | <code>&#124; `ThreadItem` &#124; `ailis-turn-items.cjs` &#124; chronological tool calls/results, no completion gate &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1384 | <code>This preserves the user's product direction:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1386 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1387 | <code>Codex-like underneath: typed tools, searchable capabilities, observations, retries.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1388 | <code>AILIS-like above: persona rendering, voice, expression, bubble, warmth.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1389 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1391 | <code>## 26. Implemented Change List, Not A Rewrite</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1393 | <code>Implemented in this pass:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1395 | <code>1. Added a real AILIS `ToolRuntime` registry next to current contracts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1396 | <code>2. Wrapped existing built-ins as runtime objects: runtime tools plus gateway-local `computer`, `code`, `file_manager`, `email`, `artifact_verifier`, and `vision.capture_context`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1397 | <code>3. Promoted MCP-discovered tools into direct runtime call ids: canonical `mcp__server__tool`, with legacy `mcp:&lt;server&gt;:&lt;tool&gt;` kept as a compatibility alias.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1398 | <code>4. Kept `mcp_bridge` available, but direct MCP calls and `tool_search` no longer require the model to hand-assemble bridge payloads.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1399 | <code>5. Added `tool_search` as a real callable tool that returns specs, not only prose context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1400 | <code>6. Kept `write`/`read`/`exec` as local core compatibility tools, but registered them into the gateway runtime registry rather than routing them through a separate public path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1401 | <code>7. Normalized tool outputs through the registry into `content`, `details`, and `structuredContent`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1402 | <code>8. Kept Persona Surface above tool observations; tool semantics do not render final user-facing personality text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1404 | <code>Still not fully identical to Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1406 | <code>1. AILIS still has its own JSON decision protocol. Codex uses provider-native response items and a Rust `ToolRouter`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1407 | <code>2. AILIS has a gateway API compatibility layer that returns `coreTools/runtimeTools/localTools` for existing UI and smoke scripts. Internally this now reads from the registry, but the public shape remains old for compatibility.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1408 | <code>3. Some broad tools, especially `computer`, still multiplex many actions under one schema. That is acceptable for the current product, but Codex-style purity would split more actions into narrower executors over time.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1410 | <code>## 27. Acceptance Tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1412 | <code>These tests should tell us whether AILIS has actually become more Codex-like, instead of just learning one task.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1414 | <code>&#124; Test &#124; Expected behavior &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1415 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1416 | <code>&#124; Playwright official API task &#124; Search or fetch official Playwright docs, write file, read/verify file, final with source clarity &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1417 | <code>&#124; arXiv paper task &#124; Fetch abs page, use PDF parser for PDF, write `paper-card.md`, verify required sections &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1418 | <code>&#124; GitHub repo task &#124; Use GitHub/browser/MCP evidence, inspect repo state, avoid claiming actions without observation &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1419 | <code>&#124; CSV/log/TOML/YAML task &#124; Use structured artifact verifier, not freeform text guessing &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1420 | <code>&#124; Email task &#124; Load email capability, call email tool/MCP, avoid exposing secrets or tool logs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1421 | <code>&#124; Wrong tool call test &#124; `web_fetch` on PDF returns `unsupported_content_type` and model retries with `pdf_extract_text` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1422 | <code>&#124; First prompt budget test &#124; First prompt contains only catalog + direct core specs, not full contracts &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1424 | <code>The Playwright chain from `F:\AILIS\logs\ailis-browser-wait-chain-2026-06-05T15-07-54-181Z.md` is a useful baseline. It completed, but it should not need multiple schema-guess failures to write a file, and it should collect official-document evidence before final.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1426 | <code>## 28. Bottom Line</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1428 | <code>Codex manages tool selection by giving the model a small, accurate, executable tool surface and then trusting the model to choose the next call from observations.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1430 | <code>AILIS currently gives the model a persona-aware JSON agent protocol, a deferred capability catalog, and an MCP bridge. That is workable, but research tasks suffer when the bridge and capability text are too indirect.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1432 | <code>The Codex-aligned direction is not to hardcode task routes. It is to make the executable tool surface honest and discoverable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1434 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1435 | <code>clear direct tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1436 | <code>deferred searchable specs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1437 | <code>real runtime validation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1438 | <code>structured observations</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1439 | <code>no fake evidence</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1440 | <code>persona rendering only at the user surface</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1441 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
