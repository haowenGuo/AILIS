# docs/ailis-codex-compatible-object-model-migration.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：163
- SHA-256：`38b7cdc856eeab763277710299433ac478337ccbbe018638ca2c9f52c83a1c69`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-compatible-object-model-migration.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Codex-Compatible Object Model Migration</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>## Source Baseline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Codex source inspected from:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- `F:/AIGril/AIGrilClaw/.refs/openai-codex`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- commit `7d47056ea42636271ac020b86347fbbef49490aa`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>The Codex model-visible request is built from:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>- `codex-rs/core/src/client_common.rs`: `Prompt`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- `codex-rs/codex-api/src/common.rs`: `ResponsesApiRequest`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- `codex-rs/protocol/src/models.rs`: `ResponseItem`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- `codex-rs/core/src/context_manager/history.rs`: history normalization</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- `codex-rs/core/src/session/turn.rs`: per-turn sampling input construction</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>Canonical Codex request shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 21 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>  "model": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>  "instructions": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>  "input": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>    {"type": "message", "role": "user", "content": []},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>    {"type": "function_call", "name": "tool_name", "arguments": "{}", "call_id": "call_1"},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>    {"type": "function_call_output", "call_id": "call_1", "output": "..."}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>  ],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  "tools": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>  "tool_choice": "auto",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>  "parallel_tool_calls": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>  "reasoning": null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>  "stream": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>## AILIS Original Model-Visible Shape</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>AILIS previously built model-visible data in `electron/ailis-agent-runner.cjs` and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>`electron/ailis-context-compiler.cjs` as a custom JSON payload inside a user message:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 43 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>  "user_goal": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>  "recent_conversation": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>  "memory_context": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>  "runtime_environment": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>  "recent_turn_items": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>  "tool_observations": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>  "context_pack": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>    "working_state": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>    "active_observation_ids": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>    "cleared_observations": []</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  "capability_catalog": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  "current_progress": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>The model was also asked to emit a custom decision object:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 63 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>  "action": "load_context&#124;tool&#124;final&#124;blocked",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>  "tool_call": {"tool": "...", "args": {}},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>  "final_answer": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>  "blocked_reason": "..."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>This diverged from Codex in two important ways:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>1. Prior tool observations were represented as AILIS-specific fields instead of standard</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>   `function_call` / `function_call_output` pairs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>2. The next action was represented as an AILIS JSON meta-decision instead of native tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>   calls or assistant final messages.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>## Object Model Mapping</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>&#124; Codex / Responses object &#124; Old AILIS field &#124; Migration rule &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 81 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 82 | <code>&#124; `instructions` &#124; `system` message text &#124; Keep as separate request field for Responses; convert to system message for chat providers. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 83 | <code>&#124; `input[]` &#124; JSON user payload &#124; Build an ordered `ResponseItem[]`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 84 | <code>&#124; `message` &#124; `user_goal`, `recent_conversation`, context JSON &#124; Emit regular `message` items with `role`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 85 | <code>&#124; `function_call` &#124; `tool_call`, `recent_turn_items.tool_call` &#124; Reconstruct from executed `stepResults`: `name`, JSON-string `arguments`, `call_id`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 86 | <code>&#124; `function_call_output` &#124; `tool_observations`, `recent_turn_items.tool_result` &#124; Reconstruct from `stepResults.response`: same `call_id`, text output, optional `success`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 87 | <code>&#124; `tool_search_call` &#124; `tool_search` step &#124; Emit when `stepResult.tool === "tool_search"`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 88 | <code>&#124; `tool_search_output` &#124; tool_search returned tools &#124; Emit with `tools[]`, `status`, `execution`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>&#124; `tools` &#124; direct tool specs &#124; Preserve as provider-native tool specs. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 90 | <code>&#124; `tool_choice` &#124; `toolChoice` &#124; Use `"auto"` for direct-tool loop. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 91 | <code>&#124; final answer &#124; `action="final"`, `final_answer` &#124; Direct-tool path now allows final assistant message; legacy JSON fallback still maps old final. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>## Implemented V1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>New module:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>- `electron/ailis-codex-response-items.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- `electron/ailis-response-model.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- `electron/ailis-context-manager.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- `electron/ailis-tool-router.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>Responsibilities:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>- Defines Codex-named `ResponseItem`, `ContentItem`, `FunctionCallOutputPayload`,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>  `FunctionCallOutputBody`, `ContextManager`, `ToolRouter`, and compaction item</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>  constructors.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>- Converts `stepResults` into Codex-style `ResponseItem` pairs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>- Converts `tool_search` into `tool_search_call` / `tool_search_output`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- Builds ordered `input[]` from conversation, context, user goal, and tool history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>  through `ContextManager.forPrompt()`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>- In the live Agent loop, `ContextManager` is now a run-local long-lived history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>  owner. Tool results are appended into it as they complete; `stepResults` remain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  for transcript/debug/approval recovery instead of being the per-turn prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  source.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>- `ContextManager` can now export/import a snapshot shaped like Codex</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>  `ContextManager` fields: `items`, `history_version`, `token_info`, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>  `reference_context_item`. Runtime context snapshots, debug pauses, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>  pending approvals store this checkpoint so resume paths can continue from the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  canonical history instead of rebuilding only from `stepResults`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>- Provides a chat-completions compatibility projection that preserves native</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>  `assistant.tool_calls` and `tool` response messages.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>Provider updates:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>- `electron/desktop-llm-provider.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>- OpenAI Responses provider can send `payload.instructions` + `payload.input` directly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- Chat-completions providers receive a compatibility conversion from `ResponseItem[]`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>  to `system/user/assistant(tool_calls)/tool` messages.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>Agent runner updates:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- Direct tool executor builds a `codex_request`:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 136 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>  "instructions": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>  "input": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>  "tools": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>  "tool_choice": "auto",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>  "parallel_tool_calls": false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>- Runtime debug snapshots now include `codex_request` for inspection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>- The old JSON meta-decision planner and repair/fallback path have been removed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 147 | <code>  from the main Agent loop.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>- `FunctionCallOutputPayload` stays internal; OpenAI Responses provider converts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 149 | <code>  it to the Codex wire value before sending `input[]`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>## Remaining Work</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>- Extend checkpoint durability beyond approval/debug resume into full</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>  session-level rollout storage and future compaction replacement history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>- Replace any future model-visible `context_pack` with Codex `compaction` /</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>  `context_compaction` style items.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>- Keep `working_state`, `tool_observations`, and `cleared_observations` out of</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>  the main model-visible Agent protocol unless they are reshaped into Codex</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>  object names.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>- Convert final answer to assistant `message` semantics everywhere possible; keep `final_answer`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>  tool only where a provider or eval harness requires a tool submission endpoint.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>- Add transcript replay tests that assert each round contains Codex-compatible</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>  `input[]` and paired call/output items.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
