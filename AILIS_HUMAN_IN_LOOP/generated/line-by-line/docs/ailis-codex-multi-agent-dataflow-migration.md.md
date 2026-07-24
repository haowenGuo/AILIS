# docs/ailis-codex-multi-agent-dataflow-migration.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：346
- SHA-256：`444283a25efd22e4f3c0e9d041e73f93497a5e50f1a762ce7cb114c0960728de`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-multi-agent-dataflow-migration.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`spawn_agent`、`forward_child_completion_to_parent`、`followup_task`、`wait_agent`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Codex Multi-Agent Data-Flow Migration</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-07-11</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Source Baseline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The design below is derived from the local Codex checkout rather than remembered behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- Repository: `F:/CODEX/openai-codex-reference`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- Commit: `3b5ad9c0b99cdad1febc085e6eed59a86b808804`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- Multi-agent version: `MultiAgentV2`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>Primary source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- `codex-rs/core/src/tools/handlers/multi_agents_spec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- `codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- `codex-rs/core/src/tools/handlers/multi_agents_v2/followup_task.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- `codex-rs/core/src/tools/handlers/multi_agents_v2/wait.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- `codex-rs/core/src/tools/handlers/multi_agents_v2/message_tool.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- `codex-rs/core/src/agent/control.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- `codex-rs/core/src/session/input_queue.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- `codex-rs/core/src/session/mod.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- `codex-rs/core/src/context/subagent_notification.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- `codex-rs/protocol/src/protocol.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>## Replacement Status</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>The former AILIS implementation modeled a TaskAgent as a synchronous compatibility tool:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 31 | <code>Persona -&gt; subagents(action=spawn, wait=true) -&gt; plain answer text -&gt; Persona</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>Codex models a sub-agent as a persistent thread:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 37 | <code>root Agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  -&gt; spawn_agent(task_name, message, fork_turns)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  -&gt; AgentControl.spawn_agent_with_metadata()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>  -&gt; persistent AgentPath + child thread</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>  -&gt; child completion</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>  -&gt; InterAgentCommunication</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>  -&gt; InputQueue mailbox</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>  -&gt; SubagentNotification in parent model input</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>  -&gt; followup_task(target, message) when more work is needed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>  -&gt; same child thread and history continue</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>That implementation has now been removed. `AgentControl` owns a session-scoped `AgentRegistry`, persistent `AgentPath` records, child execution promises, input handlers, cancellation, and mailbox delivery. `AILISRuntime` no longer owns global `subagents`, run, controller, or input-handler maps and no longer exposes `executeSubagentRelay`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>The replacement deliberately reuses the existing TaskAgent model loop as the child thread executor. It does not preserve the old relay lifecycle around that executor.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>## Codex-Named Object Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>### `AgentStatus`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>Model-visible serialization must match Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 60 | <code>"pending_init"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>"running"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>"interrupted"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>"shutdown"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>"not_found"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>{"completed": "final assistant message"}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>{"errored": "error message"}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>No programmatic `complete/partial evidence` classifier is added. A completed child may receive another `followup_task` when the parent model decides more work is useful.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>### `InterAgentCommunication`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 74 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>  "author": "/root/mavuika_guide",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>  "recipient": "/root",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>  "other_recipients": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>  "content": "&lt;subagent_notification&gt;...&lt;/subagent_notification&gt;",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>  "trigger_turn": false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>### `SubagentNotification`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>```xml</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 86 | <code>&lt;subagent_notification&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>{"agent_path":"/root/mavuika_guide","status":{"completed":"..."}}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>&lt;/subagent_notification&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>### `InputQueue`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>The parent session owns:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 96 | <code>mailbox_pending_mails</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>mailbox_waiters</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>idle_pending_input</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>Required methods keep Codex naming:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 104 | <code>subscribe_mailbox()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>enqueue_mailbox_communication()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>drain_mailbox_input_items()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>get_pending_input()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>### Model-Visible Tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>The Persona tool surface must use Codex MultiAgentV2 names and field names:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 115 | <code>spawn_agent(task_name, message, fork_turns?, agent_type?, model?, reasoning_effort?, service_tier?)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>followup_task(target, message)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>wait_agent(timeout_ms?)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>list_agents(path_prefix?)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>close_agent(target)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>The old `subagents(action=...)`, `sessions_spawn`, and `sessions_yield` tools are deleted rather than hidden. No compatibility route remains in contracts, tool specs, tool runtime registration, Gateway session tools, or model capability text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>## Codex Call Stack and Pseudocode</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>### 1. Spawn</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>Source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>- `create_spawn_agent_tool_v2()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- `handle_spawn_agent()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>- `AgentControl.spawn_agent_with_metadata()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- `AgentControl.spawn_agent_internal()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- `AgentControl.spawn_forked_thread()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- `keep_forked_rollout_item()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 138 | <code>function spawn_agent(task_name, message, fork_turns = "all"):</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>    parent_path = current_turn.session_source.agent_path or "/root"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>    child_path = parent_path.join(task_name)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>    reject duplicate live child_path</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>    fork_mode = parse("none" &#124; "all" &#124; positive integer)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>    child_config = build_agent_spawn_config(parent_turn)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>    if fork_mode != none:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>        parent.flush_rollout()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>        history = parent.read_stored_history()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>        history = truncate_to_last_n_turns(history, fork_mode)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>        history = history.filter(keep_forked_rollout_item)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>        child = fork_thread_with_source(history, child_path)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>    else:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>        child = spawn_new_thread_with_source(child_path)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    AgentControl.send_input(child.id, message)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>    return {task_name: child_path, nickname: child.nickname}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>`keep_forked_rollout_item()` rules copied semantically from Codex:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 162 | <code>keep system/developer/user messages</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>keep assistant messages only when phase == final_answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>drop reasoning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>drop function_call/function_call_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>drop tool_search_call/tool_search_output</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>drop web_search_call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>drop shell calls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>drop process commentary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>preserve compacted history and reference context when valid</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>For AILIS, Persona system instructions are not part of the fork checkpoint. The child receives TaskAgent base instructions plus sanitized task-relevant ResponseItems, so relationship memory, expression rules, TTS rules, and Persona-only prompts remain isolated.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>### 2. Completion Delivery</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>Source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>- `Session.forward_child_completion_to_parent()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- `format_subagent_notification_message()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>- `SubagentNotification.render()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- `AgentControl.send_inter_agent_communication()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- `InputQueue.enqueue_mailbox_communication()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 186 | <code>function forward_child_completion_to_parent(child, status):</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>    notification = SubagentNotification(child.agent_path, status).render()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>    communication = InterAgentCommunication(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>        author = child.agent_path,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>        recipient = child.agent_path.parent,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>        other_recipients = [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>        content = notification,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>        trigger_turn = false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>    AgentControl.send_inter_agent_communication(parent, communication)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>The completion body does not travel through `wait_agent` and is not flattened into the `spawn_agent` tool output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>### 3. Parent Mailbox Injection</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>Source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>- `InputQueue.get_pending_input()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 205 | <code>- `InputQueue.drain_mailbox_input_items()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 208 | <code>before each parent model decision:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>    pending_user_input = parent_input_queue.pending_input</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>    mailbox_items = parent_input_queue.drain_mailbox_input_items()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>    context_manager.record_items(pending_user_input + mailbox_items)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>`InterAgentCommunication.to_response_input_item()` is an assistant commentary `ResponseItem` containing the structured communication JSON. It keeps author and recipient identity available to the model without presenting internal orchestration to the user.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>### 4. Follow-Up on the Same Agent</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>Source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>- `create_followup_task_tool()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>- `handle_message_string_tool(... TriggerTurn ...)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- `AgentControl.send_inter_agent_communication()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 225 | <code>function followup_task(target, message):</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>    child = resolve_agent_target(target)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>    communication = InterAgentCommunication(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>        author = current_agent_path,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>        recipient = child.agent_path,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>        content = message,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>        trigger_turn = true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>    child.input_queue.enqueue_mailbox_communication(communication)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>    child.start_next_turn_from_existing_context()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>The same TaskAgent keeps its ContextManager, Evidence Manifest, output references, tool observations, and compressed checkpoint. The parent sends only the new instruction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### 5. Wait</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>Source evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>- `create_wait_agent_tool_v2()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- `wait_for_mailbox_change()`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 247 | <code>function wait_agent(timeout_ms):</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>    changed = await parent.input_queue.subscribe_mailbox(timeout_ms)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>    return {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>        message: changed ? "Wait completed." : "Wait timed out.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>        timed_out: !changed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 252 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>The next model round drains the completion notification from the mailbox. Returning child content from `wait_agent` would create two competing data channels and must not be done.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>## AILIS Function-Level Migration Matrix</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>&#124; Codex name &#124; AILIS target &#124; Required change &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 260 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 261 | <code>&#124; `AgentStatus` &#124; `electron/ailis-agent-control.cjs` &#124; Add Codex-compatible tagged status serialization. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 262 | <code>&#124; `InterAgentCommunication` &#124; `electron/ailis-agent-control.cjs` &#124; Add exact fields and `to_response_input_item()`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 263 | <code>&#124; `SubagentNotification` &#124; `electron/ailis-agent-control.cjs` &#124; Add exact `agent_path/status` envelope. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 264 | <code>&#124; `InputQueue` &#124; `electron/ailis-agent-control.cjs` &#124; Add parent mailbox, waiters, drain and pending-input APIs. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 265 | <code>&#124; `AgentControl` &#124; `electron/ailis-agent-control.cjs` &#124; Own stable paths, spawn/follow-up/wait/list/close and completion forwarding. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 266 | <code>&#124; `spawn_agent` &#124; tool contracts/specs/runtime &#124; Replace Persona `subagents(action=spawn)` surface. Return handle immediately. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 267 | <code>&#124; `followup_task` &#124; tool contracts/specs/runtime &#124; Require explicit `target`; continue the same TaskAgent. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 268 | <code>&#124; `wait_agent` &#124; tool contracts/specs/runtime &#124; Wait only for mailbox state; do not return result content. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 269 | <code>&#124; `list_agents` &#124; tool contracts/specs/runtime &#124; Return `agent_name`, `agent_status`, `last_task_message`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 270 | <code>&#124; `close_agent` &#124; tool contracts/specs/runtime &#124; Close the target and return `previous_status`. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 271 | <code>&#124; `keep_forked_rollout_item` &#124; `electron/ailis-agent-runner.cjs` &#124; Build sanitized parent ContextManager checkpoint. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 272 | <code>&#124; `drain_mailbox_input_items` &#124; `electron/ailis-agent-runner.cjs` &#124; Inject completion ResponseItems before each parent decision. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 273 | <code>&#124; legacy `subagents` &#124; removed &#124; Delete contract, spec, runtime dispatch, global maps, relay methods, prompts, OpenClaw surface entries, and evaluation settlement workarounds. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>## Implemented Runtime Invariants</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>- One `AgentRegistry` tree is owned per root session; `list_agents` and target resolution cannot cross session boundaries.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 278 | <code>- One direct child may be live under the same parent path. A second spawn returns `agent_thread_limit_reached` with the existing target instead of creating duplicate semantic work.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 279 | <code>- `followup_task` enters the live child input handler or resumes the same stable Agent record from its semantic checkpoint.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>- Mailbox storage is session-scoped, so a child completion is not lost when the parent HTTP run id changes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>- Before Persona safety finalization, the Harness waits for live direct children and injects completed mailbox items into the final model request.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>- Forked history follows Codex rollout filtering and structurally removes Persona relationship memory, capability catalog, and external tool exposure while retaining runtime environment and attachments.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>- Unknown terminal provider statuses normalize to `Errored`, never `NotFound`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>- Invalid native tool observations preserve provider `reasoning_content` for DeepSeek/Qwen chat round trips.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>## Acceptance Tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>### Contract tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 290 | <code>- Persona tools contain Codex names and exact snake_case fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- Persona tools do not contain `subagents`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>- Runtime source contains no legacy relay/global-map symbols.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 293 | <code>- All schemas reject unknown fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>### History fork test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>Parent history contains user messages, final assistant output, commentary, reasoning, tool calls, and tool outputs. Child fork must retain only user messages and final assistant output plus its TaskAgent instructions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>### Mailbox test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>Child completion must enqueue exactly one `InterAgentCommunication`. `wait_agent` returns only wait status. The next parent model request contains exactly one completion notification.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>### Isolation and lifecycle tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>- Two sessions may use the same canonical task name without seeing each other's Agent records.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>- A delayed child completion remains available to a later parent run in the same session.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 307 | <code>- A second live direct child is rejected without starting another model call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 308 | <code>- Provider failure is delivered as `{"errored":"..."}` and retains a resumable handoff package.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>### Continuation test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 313 | <code>spawn_agent(task_name="mavuika_guide")</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>child completes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>followup_task(target="mavuika_guide")</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>Assertions:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>- only one stable `agent_path` exists;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 321 | <code>- no second TaskAgent record is created;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 322 | <code>- child run id advances but TaskAgent identity remains the same;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 323 | <code>- previous ContextManager checkpoint and tool observations remain available;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- parent receives the second completion through the same mailbox path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>### Live guide regression</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Expected healthy chain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 331 | <code>Persona round 1: spawn_agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>Persona round 2: wait_agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>TaskAgent: at most 3 work rounds + 1 finalization round</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>Persona round 3: final answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>If the parent decides more evidence is needed:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 340 | <code>Persona: followup_task(target=existing task_name)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>Persona: wait_agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>same TaskAgent: continue from checkpoint</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>Persona: final answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>The number of TaskAgent identities for one guide task must remain one unless the model explicitly creates a genuinely independent task name.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
