# Codex Runtime Optimization Reference

Last updated: 2026-06-07

This document records how local Codex source reduces runtime latency, prompt bloat, and tool overhead. It is intentionally code-backed: every claim below points to local Codex source under:

```text
F:\AIGril\build-cache\codex-runtime\codex-rs
```

This is not a generic "prompt engineering" note. The important pattern is that Codex does not rely on the model alone to stay fast. The runtime aggressively controls:

- what tool detail reaches the model,
- how large schemas are,
- how much tool output is allowed back into the next turn,
- when history gets compacted,
- how token usage is measured.

For AIGL, this matters because the slow tasks we observed were not tool-time bound. They were model-wait bound: tools finished in seconds, but the model kept re-reading large history and large observations for many rounds.

## 1. The Main Optimization Shape

Codex speed comes from runtime discipline more than from one magic model trick.

The recurring pattern in the source is:

```text
Keep the first-turn tool surface small
-> compact schemas before the model sees them
-> truncate tool output before it re-enters the loop
-> track token usage continuously
-> auto-compact history with explicit retention budgets
```

The direct implication for AIGL is simple:

- If the model sees too many tools too early, it slows down and chooses worse.
- If tool outputs are fed back too verbosely, every next step gets slower.
- If there is no hard token accounting, context growth becomes invisible until tasks feel "mysteriously slow".

## 2. Codex Does Not Dump the Whole Tool World Into Turn 1

### 2.1 Deferred tool exposure is first-class

Codex tool definitions include an explicit `defer_loading` field.

Relevant source:

- `tools/src/tool_definition.rs:7`
- `tools/src/tool_definition.rs:21`
- `tools/src/responses_api.rs:26`
- `tools/src/responses_api.rs:116`
- `tools/src/responses_api.rs:127`

Representative code:

```rust
pub struct ToolDefinition {
    pub name: String,
    pub description: String,
    pub input_schema: JsonSchema,
    pub output_schema: Option<JsonValue>,
    pub defer_loading: bool,
}
```

```rust
pub fn into_deferred(mut self) -> Self {
    self.output_schema = None;
    self.defer_loading = true;
    self
}
```

```rust
pub fn mcp_tool_to_deferred_responses_api_tool(
    tool_name: &ToolName,
    tool: &rmcp::model::Tool,
) -> Result<ResponsesApiTool, serde_json::Error>
```

What this means in plain language:

- Codex can discover many tools without showing every full contract to the model immediately.
- Deferred tools lose some detail up front, especially output schema, and are marked as load-later.
- The first-turn prompt stays smaller and more decision-oriented.

### 2.2 Deferred tools are namespaced and managed deliberately

Codex does not treat deferred tools as a sloppy afterthought.

Relevant source:

- `app-server/src/request_processors/thread_processor.rs:310`

Representative logic:

```rust
if tool.defer_loading && namespace.is_none() {
    return Err(format!(
        "deferred dynamic tool must include a namespace: {name}"
    ));
}
```

Meaning:

- Deferred tools are not random hidden blobs.
- They still live in a structured namespace and are validated at the runtime boundary.

### 2.3 Tool search is a real model-visible mechanism

Codex exposes `tool_search` as its own tool shape.

Relevant source:

- `tools/src/tool_spec.rs:17`

Representative code:

```rust
#[serde(rename = "tool_search")]
ToolSearch {
    execution: String,
    description: String,
    parameters: JsonSchema,
}
```

Meaning:

- Codex does not solve tool sprawl by shoving everything into system prompt prose.
- It has an explicit discovery mechanism when the model needs more capability detail.

### 2.4 Compaction tests explicitly forbid leaking deferred declarations into the active payload

Relevant source:

- `core/tests/suite/compact_remote.rs:62`
- `core/tests/suite/compact_remote.rs:990`

Representative test:

```rust
assert!(
    !contains_defer_loading(tools),
    "model-visible tools should not include deferred declarations: {tools}"
);
```

This is a very important clue. Codex is testing for prompt hygiene, not just tool correctness.

### AIGL takeaway

The first fix direction is not "better prompt wording". It is:

- keep the initial capability index thin,
- expose only the tools that are truly needed for the current turn,
- move long contracts and niche tools behind delayed discovery.

## 3. Codex Shrinks Large Schemas Before the Model Ever Sees Them

Codex does not trust third-party or MCP-style schemas to be reasonably sized.

Relevant source:

- `tools/src/json_schema.rs:159`
- `tools/src/json_schema.rs:176`
- `tools/src/json_schema.rs:177`
- `tools/src/json_schema.rs:194`
- `tools/src/json_schema.rs:317`
- `tools/src/json_schema.rs:363`

Representative code:

```rust
sanitize_json_schema(&mut input_schema);
prune_unreachable_definitions(&mut input_schema);
compact_large_tool_schema(&mut input_schema);
```

```rust
const MAX_COMPACT_TOOL_SCHEMA_BYTES: usize = 4_000;
const MAX_COMPACT_TOOL_SCHEMA_DEPTH: usize = 2;
```

```rust
const LARGE_SCHEMA_COMPACTION_PASSES: &[LargeSchemaCompactionPass] = &[
    strip_schema_descriptions,
    drop_schema_definitions,
    collapse_deep_schema_objects_from_root,
];
```

What Codex is doing:

1. Sanitize the schema.
2. Remove unreachable definitions.
3. If still too large, strip descriptions.
4. If still too large, drop definitions.
5. If still too large, collapse deep nested schema objects from the root.

Why this helps:

- Huge tool schemas are silent prompt killers.
- The model does not need every deep sub-object explained in full to decide the next action.
- Compacting schemas protects both latency and tool-call reliability.

### AIGL takeaway

If AIGL exposes full JSON schemas from every MCP tool, browser tool, research tool, and file tool on every turn, the model will waste time parsing contract detail instead of planning. Codex avoids that at the parser layer, not with "please be concise" instructions.

## 4. Codex Truncates Tool Output Before It Goes Back Into the Next Round

This is one of the biggest differences between a fast runtime and a slow one.

Relevant source:

- `utils/output-truncation/src/lib.rs:12`
- `utils/output-truncation/src/lib.rs:29`
- `utils/output-truncation/src/lib.rs:79`
- `core/src/tools/mod.rs:63`
- `core/src/tools/mod.rs:90`
- `core/src/tools/code_mode/mod.rs:253`
- `core/src/tools/code_mode/mod.rs:257`
- `core/src/unified_exec/mod.rs:68`
- `code-mode/src/runtime/mod.rs:25`

Representative code:

```rust
pub fn formatted_truncate_text(content: &str, policy: TruncationPolicy) -> String
```

```rust
pub fn truncate_function_output_items_with_policy(
    items: &[FunctionCallOutputContentItem],
    policy: TruncationPolicy,
) -> Vec<FunctionCallOutputContentItem>
```

```rust
pub(crate) const DEFAULT_MAX_OUTPUT_TOKENS: usize = 10_000;
pub const DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL: usize = 10_000;
```

Codex behavior:

- Large text output is truncated in a structured way.
- Text items can be merged and compacted under a token or byte budget.
- Mixed output keeps non-text items such as images while shrinking text aggressively.
- Exec output is formatted with metadata like exit code and wall time, then truncated for model consumption.
- If some text items are omitted, Codex appends an explicit omission marker instead of pretending the full output is still present.

Representative outcome shape:

```text
Exit code: ...
Wall time: ...
Total output lines: ...
Output:
...
```

### Why this matters

Without this layer, every tool becomes a prompt amplifier:

- one big HTML page,
- one giant shell log,
- one verbose repo tree,
- one long PDF extraction,

and the model pays for that again on every subsequent turn.

### AIGL takeaway

For AIGL, this is more important than adding more tools. Before adding more tools, every tool needs a model-facing truncation adapter:

- `web_fetch` should not dump whole pages by default.
- `github_repo_read` should return scoped structure, not raw noise.
- `pdf_extract_text` should return sections or a bounded excerpt, not uncontrolled blobs.
- shell/file/browser tools need separate truncation policies, not one generic "return text".

## 5. Codex Also Caps Telemetry and Runtime Preview Surfaces

Relevant source:

- `core/src/tools/mod.rs:29`
- `core/src/tools/mod.rs:30`

Representative constants:

```rust
pub(crate) const TELEMETRY_PREVIEW_MAX_BYTES: usize = 2 * 1024;
pub(crate) const TELEMETRY_PREVIEW_MAX_LINES: usize = 64;
```

This is subtle but important:

- Codex does not let internal previews grow carelessly either.
- Even logging and telemetry surfaces are treated as model-budget-sensitive.

### AIGL takeaway

If AIGL reuses verbose event text for both UI progress and model context, it is doing the opposite of this design. Internal traces should be rich; model-facing traces should be lean.

## 6. Codex Tracks Token Usage Continuously Instead of Guessing

Relevant source:

- `core/src/client.rs:1825`
- `core/src/client.rs:1827`
- `core/src/client.rs:1828`

Representative code:

```rust
session_telemetry.sse_event_completed(
    usage.input_tokens,
    usage.output_tokens,
    Some(usage.cached_input_tokens),
    Some(usage.reasoning_output_tokens),
    usage.total_tokens,
);
```

Codex is not blind while running. It records:

- input tokens,
- output tokens,
- cached input tokens,
- reasoning output tokens,
- total tokens.

Why this matters:

- You cannot optimize what you do not measure.
- Cached input tokens tell you whether repeated context is being reused well.
- Reasoning output tokens tell you whether the model is spending too much effort per decision.

### AIGL takeaway

AIGL should log per-turn:

- total prompt tokens,
- delta from previous turn,
- tool-result tokens added this round,
- duplicated observation tokens,
- cached vs non-cached tokens if provider supports it.

Otherwise "it feels slow" stays anecdotal.

## 7. Codex Auto-Compaction Is Windowed and Token-Aware

Codex does not compact history in a vague way. It tracks compaction windows and prefill baselines.

Relevant source:

- `core/src/state/auto_compact_window.rs:4`
- `core/src/state/auto_compact_window.rs:46`
- `core/src/state/auto_compact_window.rs:59`
- `core/src/state/auto_compact_window.rs:70`

Representative code:

```rust
pub(crate) struct AutoCompactWindowSnapshot {
    pub(crate) ordinal: u64,
    pub(crate) prefill_input_tokens: Option<i64>,
}
```

```rust
pub(super) fn ensure_server_observed_prefill_from_usage(&mut self, usage: &TokenUsage)
```

```rust
pub(super) fn set_estimated_prefill(&mut self, tokens: i64)
```

Meaning:

- Codex tracks the current compaction window.
- It records a token baseline for what was already in context before new growth.
- It prefers server-observed usage over estimates when available.

This is more disciplined than "summarize every now and then".

## 8. Codex Compacts History With Explicit Retention Budgets

### 8.1 Inline compaction keeps only bounded recent user material

Relevant source:

- `core/src/compact.rs:46`
- `core/src/compact.rs:48`
- `core/src/compact.rs:465`

Representative code:

```rust
pub const SUMMARIZATION_PROMPT: &str = include_str!("../templates/compact/prompt.md");
const COMPACT_USER_MESSAGE_MAX_TOKENS: usize = 20_000;
```

```rust
pub(crate) fn build_compacted_history(
    initial_context: Vec<ResponseItem>,
    user_messages: &[String],
    summary_text: &str,
) -> Vec<ResponseItem>
```

What Codex keeps:

- canonical initial context,
- a bounded amount of recent user messages,
- a generated summary.

If a message is too large, it gets truncated to fit the remaining token budget.

### 8.2 Remote compaction retains only selected roles

Relevant source:

- `core/src/compact_remote_v2.rs:48`
- `core/src/compact_remote_v2.rs:351`
- `core/src/compact_remote_v2.rs:367`

Representative code:

```rust
const RETAINED_MESSAGE_TOKEN_BUDGET: usize = 64_000;
```

```rust
matches!(role.as_str(), "user" | "developer" | "system")
```

Meaning:

- Remote compaction does not blindly preserve every past item.
- It filters by message role and then truncates retained text to a token budget.

This is very relevant to AIGL. If AIGL keeps replaying giant tool observations, redundant progress strings, and persona wrappers inside the active history, it is violating the same principle Codex is enforcing here.

## 9. Codex Web Search Is Also Context-Budgeted

Relevant source:

- `tools/src/tool_spec.rs:45`
- `codex-api/src/search.rs:181`
- `app-server-protocol/schema/typescript/WebSearchToolConfig.ts:7`

Representative code:

```rust
search_context_size: Option<WebSearchContextSize>,
```

```ts
export type WebSearchToolConfig = {
  context_size: WebSearchContextSize | null,
  allowed_domains: Array<string> | null,
  location: WebSearchLocation | null,
};
```

Meaning:

- Codex treats web search as a bounded retrieval tool, not a raw HTML floodgate.
- Search context size is configurable as `low`, `medium`, or `high`.

### AIGL takeaway

This is the opposite of returning a whole fetched page unless the model explicitly asked for that much. AIGL should separate:

- search result retrieval,
- page fetch,
- targeted extraction,
- full download.

Those are different cost profiles and should not share one loose text-return path.

## 10. What Codex Is Optimizing, in One Sentence

Codex tries to ensure that the model sees only the minimum useful contract and the minimum useful evidence needed for the next decision.

That is the real optimization philosophy.

Not:

- "make the prompt more clever",
- "tell the model to be concise",
- "hope the model picks the right tool faster".

But:

- show less,
- validate earlier,
- truncate harder,
- measure continuously,
- compact with explicit budgets.

## 11. Direct Mapping to AIGL's Slowdown

From the slow AIGL runs we saw earlier, the main symptom was:

- tools finished quickly,
- model waiting dominated total runtime,
- repeated rounds kept dragging large observations back into context.

Against Codex's design, that usually points to four concrete problems:

1. Too much tool contract detail is visible too early.
2. Tool outputs are too large and too raw.
3. Progress and observation text are duplicated across runtime layers.
4. Compaction and token budgeting are weaker than the rate of context growth.

This is why a task can spend only a few seconds in tools but several minutes in model wait.

## 12. What AIGL Should Copy Next

If we want the highest-value Codex-aligned changes, the order should be:

1. Deferred tool exposure for non-core tools.
   Only a thin active tool set should be visible at turn start.

2. Schema compaction before tool exposure.
   Use the Codex pattern: sanitize, prune, compact, then expose.

3. Per-tool model-facing truncation adapters.
   `web_fetch`, `github_repo_read`, `pdf_extract_text`, `browser_extract_dom`, and shell/file tools should each have bounded result shapes.

4. Explicit token accounting in the runtime.
   Track prompt growth and observation growth per round.

5. Real auto-compaction windows.
   Compact based on measured token growth, not vague heuristics.

6. Separation between trace richness and model context richness.
   Internal traces can stay detailed; model-facing context must stay lean.

## 13. The Core Lesson for This Project

The most important thing Codex teaches here is not "use these exact words". It is architectural:

- model reasoning should stay focused on the next decision,
- runtime should absorb the ugly cost-control work,
- tools should return shaped evidence, not whatever bytes happened to come back,
- compaction should be a built-in budget mechanism, not an afterthought.

That is the difference between a system that feels powerful for one or two steps and a system that can stay fast through long research or engineering tasks.
