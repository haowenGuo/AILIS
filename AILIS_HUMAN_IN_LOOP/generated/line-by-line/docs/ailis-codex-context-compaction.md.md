# docs/ailis-codex-context-compaction.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：195
- SHA-256：`cc3dcebe4357c95789ac811cb2336e8f816f73f3e17538cc1affe04e7d8ba07b`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-context-compaction.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`token_count`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS / Codex 上下文治理对齐说明</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>本文档记录 AILIS 在 Agent Loop 变长后，如何参考 Codex 的上下文增长控制方式进行收敛。目标不是重新引入 TaskSpec / EvidenceLedger / TaskGraph，而是让模型每轮看到的内容更像 Codex：当前目标、最近观察、必要能力说明，以及被压缩过的历史。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 1. Codex 的核心做法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>### 1.1 历史是 ResponseItem，而不是散乱日志</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>Codex 把用户消息、工具调用、工具结果、压缩摘要等都纳入统一的 `ResponseItem` 历史。上下文管理器里直接维护 `items: Vec&lt;ResponseItem&gt;`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>参考源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>关键代码摘录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>pub(crate) struct ContextManager {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>    /// The oldest items are at the beginning of the vector.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 20 | <code>    items: Vec&lt;ResponseItem&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>    /// Bumped whenever history is rewritten, such as compaction or rollback.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 22 | <code>    history_version: u64,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>    token_info: Option&lt;TokenUsageInfo&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>AILIS 对应落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>- `F:\AILIS\electron\ailis-turn-items.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- 使用 `recent_turn_items` 作为模型可见的 Codex-like runtime items。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- 每个 item 表示 `tool_call`、`tool_result`、`context` 或 `runtime_note`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>### 1.2 Codex 不把所有旧工具结果永久塞回 prompt</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Codex 的远端压缩流程会把历史交给 compact endpoint，并在压缩结果回来后过滤旧工具调用、旧工具输出、旧 developer 消息，避免过期执行细节继续污染下一轮。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>参考源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote.rs:252`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote.rs:290`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>关键代码摘录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 45 | <code>compacted_history.retain(should_keep_compacted_history_item);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 49 | <code>ResponseItem::FunctionCall { .. }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>&#124; ResponseItem::ToolSearchCall { .. }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 51 | <code>&#124; ResponseItem::FunctionCallOutput { .. }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>&#124; ResponseItem::ToolSearchOutput { .. }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 53 | <code>&#124; ResponseItem::CustomToolCall { .. }</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 54 | <code>&#124; ResponseItem::CustomToolCallOutput { .. } =&gt; false,</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 55 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>AILIS 对应落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>- 保留最近 `recent_turn_items`，旧 observation 做摘要压缩。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- 不再让 `current_progress` 再复制一份最近工具结果全文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- 失败工具仍作为 observation 留给下一轮，但旧失败只保留错误类别和恢复方向。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>### 1.3 Codex 有 token/bytes 观测，而不是凭感觉压缩</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Codex 会记录历史整体可见字节数，以及自上次成功模型响应以来新增 item 的估算 token。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>参考源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs:334`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>关键代码摘录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 74 | <code>estimated_tokens_of_items_added_since_last_successful_api_response:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>    items_after_last_model_generated</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>        .iter()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>        .map(estimate_item_token_count)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>        .fold(0i64, i64::saturating_add),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>AILIS 对应落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>- 已有 `agent.prompt_budget`，记录 `system_chars`、`user_chars`、`total_chars`、`approx_input_tokens`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- 这次新增 `recent_turn_items.retention` 和 `prompt_compaction.omitted_turn_items`，后续跑慢任务时可以直接看 prompt 是否被压住。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>### 1.4 Codex 的增量请求避免重复发送已知输出</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>Codex 的客户端会把上一轮 request input 和服务端返回的 output items 当作 baseline，下一次只发送增量。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>参考源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\client.rs:1001`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>关键代码摘录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 98 | <code>let mut baseline = previous_request.input.clone();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>if let Some(last_response) = last_response {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>    baseline.extend(last_response.items_added.clone());</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>AILIS 当前不直接拥有 OpenAI Responses API 的服务端增量语义，所以本地侧先做两件事：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>- 模型可见 turn items 只保留最近窗口。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- 同一份工具观察只在 `recent_turn_items` 中出现，`current_progress` 只保留状态索引。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>### 1.5 Codex v2 压缩保留最新消息优先</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>Codex v2 compaction 对 retained messages 从新到旧计算预算，优先保留最近消息，超预算就截断。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>参考源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote_v2.rs:457`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>关键代码摘录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 120 | <code>for item in items.into_iter().rev() {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>    if remaining == 0 {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>        continue;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    let token_count = message_text_token_count(&amp;item).max(1);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>AILIS 对应落点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>- `recent_turn_items` 采用 recent window。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- 最近 6 条默认完整保留。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- 更早但仍保留在窗口里的 observation 压缩 `preview`，旧 `args` 改成 `args_summary`，避免大段写文件内容或网页内容反复进入 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>## 2. AILIS 这次具体调整</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>### 2.1 `ailis-turn-items.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>新增行为：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>- `retention.strategy = codex_like_recent_observation_window`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `retention.omitted_items`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- `latest_observation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>- `latest_failed_observation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- 旧 item 标记 `compacted: true`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- 旧 item 的 `args` 改为 `args_summary`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>这对应 Codex 的“工具输出不是永久 transcript 主体”的原则。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>### 2.2 `ailis-agent-runner.cjs`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>原来每轮 user payload 同时包含：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>- `recent_turn_items.items[*].preview`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 153 | <code>- `current_progress.latest_items[*].preview`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>这会让同一条观察被塞两次。现在改成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>- `recent_turn_items` 承载真实观察。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>- `current_progress` 只承载计数、最近状态、最近失败类型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 159 | <code>- `prompt_compaction` 显示 retained/omitted 数量。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>### 2.3 保持不做的事情</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>这次没有恢复：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>- TaskSpec</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>- EvidenceLedger</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- TaskGraph</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- 关键词路由</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- 论文专用硬规则</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>原因：这些层之前已经证明会让执行链路更僵，和 Codex 的“模型直接围绕 observation 继续决策”的形态不一致。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>## 3. 后续验证方法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>最小检查：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>node --check F:\AILIS\electron\ailis-turn-items.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>node --check F:\AILIS\electron\ailis-agent-runner.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>node --test F:\AILIS\tests\ailis-turn-items.test.mjs F:\AILIS\tests\ailis-llm-planner.test.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>慢任务验证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>1. 跑 Playwright 官方文档对比任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>2. 跑 Transformer 论文 + 代码任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>3. 跑 GitHub repo map 任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>4. 对比 `agent.prompt_budget` 事件里的 `approx_input_tokens`、`retained_turn_items`、`omitted_turn_items`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>验收标准：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>- Agent Loop 中后段 prompt 不再持续线性膨胀。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 193 | <code>- 模型仍能看到最近成功/失败 observation。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 194 | <code>- 工具失败后仍能换工具，而不是被旧失败日志淹没。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>- `current_progress` 不再重复塞工具结果全文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
