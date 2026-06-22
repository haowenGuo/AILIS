# AILIS / Codex 上下文治理对齐说明

本文档记录 AILIS 在 Agent Loop 变长后，如何参考 Codex 的上下文增长控制方式进行收敛。目标不是重新引入 TaskSpec / EvidenceLedger / TaskGraph，而是让模型每轮看到的内容更像 Codex：当前目标、最近观察、必要能力说明，以及被压缩过的历史。

## 1. Codex 的核心做法

### 1.1 历史是 ResponseItem，而不是散乱日志

Codex 把用户消息、工具调用、工具结果、压缩摘要等都纳入统一的 `ResponseItem` 历史。上下文管理器里直接维护 `items: Vec<ResponseItem>`。

参考源码：

- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs:32`

关键代码摘录：

```rust
pub(crate) struct ContextManager {
    /// The oldest items are at the beginning of the vector.
    items: Vec<ResponseItem>,
    /// Bumped whenever history is rewritten, such as compaction or rollback.
    history_version: u64,
    token_info: Option<TokenUsageInfo>,
}
```

AILIS 对应落点：

- `F:\AILIS\electron\ailis-turn-items.cjs`
- 使用 `recent_turn_items` 作为模型可见的 Codex-like runtime items。
- 每个 item 表示 `tool_call`、`tool_result`、`context` 或 `runtime_note`。

### 1.2 Codex 不把所有旧工具结果永久塞回 prompt

Codex 的远端压缩流程会把历史交给 compact endpoint，并在压缩结果回来后过滤旧工具调用、旧工具输出、旧 developer 消息，避免过期执行细节继续污染下一轮。

参考源码：

- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote.rs:252`
- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote.rs:290`

关键代码摘录：

```rust
compacted_history.retain(should_keep_compacted_history_item);
```

```rust
ResponseItem::FunctionCall { .. }
| ResponseItem::ToolSearchCall { .. }
| ResponseItem::FunctionCallOutput { .. }
| ResponseItem::ToolSearchOutput { .. }
| ResponseItem::CustomToolCall { .. }
| ResponseItem::CustomToolCallOutput { .. } => false,
```

AILIS 对应落点：

- 保留最近 `recent_turn_items`，旧 observation 做摘要压缩。
- 不再让 `current_progress` 再复制一份最近工具结果全文。
- 失败工具仍作为 observation 留给下一轮，但旧失败只保留错误类别和恢复方向。

### 1.3 Codex 有 token/bytes 观测，而不是凭感觉压缩

Codex 会记录历史整体可见字节数，以及自上次成功模型响应以来新增 item 的估算 token。

参考源码：

- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs:334`

关键代码摘录：

```rust
estimated_tokens_of_items_added_since_last_successful_api_response:
    items_after_last_model_generated
        .iter()
        .map(estimate_item_token_count)
        .fold(0i64, i64::saturating_add),
```

AILIS 对应落点：

- `F:\AILIS\electron\ailis-agent-runner.cjs`
- 已有 `agent.prompt_budget`，记录 `system_chars`、`user_chars`、`total_chars`、`approx_input_tokens`。
- 这次新增 `recent_turn_items.retention` 和 `prompt_compaction.omitted_turn_items`，后续跑慢任务时可以直接看 prompt 是否被压住。

### 1.4 Codex 的增量请求避免重复发送已知输出

Codex 的客户端会把上一轮 request input 和服务端返回的 output items 当作 baseline，下一次只发送增量。

参考源码：

- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\client.rs:1001`

关键代码摘录：

```rust
let mut baseline = previous_request.input.clone();
if let Some(last_response) = last_response {
    baseline.extend(last_response.items_added.clone());
}
```

AILIS 当前不直接拥有 OpenAI Responses API 的服务端增量语义，所以本地侧先做两件事：

- 模型可见 turn items 只保留最近窗口。
- 同一份工具观察只在 `recent_turn_items` 中出现，`current_progress` 只保留状态索引。

### 1.5 Codex v2 压缩保留最新消息优先

Codex v2 compaction 对 retained messages 从新到旧计算预算，优先保留最近消息，超预算就截断。

参考源码：

- `F:\AILIS\AILISClaw\.refs\openai-codex\codex-rs\core\src\compact_remote_v2.rs:457`

关键代码摘录：

```rust
for item in items.into_iter().rev() {
    if remaining == 0 {
        continue;
    }
    let token_count = message_text_token_count(&item).max(1);
```

AILIS 对应落点：

- `recent_turn_items` 采用 recent window。
- 最近 6 条默认完整保留。
- 更早但仍保留在窗口里的 observation 压缩 `preview`，旧 `args` 改成 `args_summary`，避免大段写文件内容或网页内容反复进入 prompt。

## 2. AILIS 这次具体调整

### 2.1 `ailis-turn-items.cjs`

新增行为：

- `retention.strategy = codex_like_recent_observation_window`
- `retention.omitted_items`
- `latest_observation`
- `latest_failed_observation`
- 旧 item 标记 `compacted: true`
- 旧 item 的 `args` 改为 `args_summary`

这对应 Codex 的“工具输出不是永久 transcript 主体”的原则。

### 2.2 `ailis-agent-runner.cjs`

原来每轮 user payload 同时包含：

- `recent_turn_items.items[*].preview`
- `current_progress.latest_items[*].preview`

这会让同一条观察被塞两次。现在改成：

- `recent_turn_items` 承载真实观察。
- `current_progress` 只承载计数、最近状态、最近失败类型。
- `prompt_compaction` 显示 retained/omitted 数量。

### 2.3 保持不做的事情

这次没有恢复：

- TaskSpec
- EvidenceLedger
- TaskGraph
- 关键词路由
- 论文专用硬规则

原因：这些层之前已经证明会让执行链路更僵，和 Codex 的“模型直接围绕 observation 继续决策”的形态不一致。

## 3. 后续验证方法

最小检查：

```powershell
node --check F:\AILIS\electron\ailis-turn-items.cjs
node --check F:\AILIS\electron\ailis-agent-runner.cjs
node --test F:\AILIS\tests\ailis-turn-items.test.mjs F:\AILIS\tests\ailis-llm-planner.test.mjs
```

慢任务验证：

1. 跑 Playwright 官方文档对比任务。
2. 跑 Transformer 论文 + 代码任务。
3. 跑 GitHub repo map 任务。
4. 对比 `agent.prompt_budget` 事件里的 `approx_input_tokens`、`retained_turn_items`、`omitted_turn_items`。

验收标准：

- Agent Loop 中后段 prompt 不再持续线性膨胀。
- 模型仍能看到最近成功/失败 observation。
- 工具失败后仍能换工具，而不是被旧失败日志淹没。
- `current_progress` 不再重复塞工具结果全文。
