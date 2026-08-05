# AILIS vs Codex Object Model Gap Analysis

Date: 2026-07-03

Scope:

- Codex reference source: `F:/AIGril/AIGrilClaw/.refs/openai-codex`
- Codex commit: `7d47056ea42636271ac020b86347fbbef49490aa`
- AILIS runtime: `F:/AILIS_self_evolution_runtime/electron`

This document compares the model-visible object/data model in Codex and the
current AILIS Agent runtime after removing the old JSON meta-decision path.

## 1. Executive Summary

AILIS is now aligned with Codex on the outer request shape:

```json
{
  "instructions": "...",
  "input": [],
  "tools": [],
  "tool_choice": "auto",
  "parallel_tool_calls": false
}
```

After the 2026-07-03 object-model migration, AILIS is closer to Codex but still
not one-to-one. The current state is:

- Request shell: mostly aligned.
- Native tool decision: aligned in principle; no old JSON meta-decision in the
  main Agent loop.
- ResponseItem history: mostly aligned for live runs. AILIS now has a
  Codex-named `ContextManager`, and the main loop keeps it as run-local
  long-lived history. Runtime snapshots, debug pauses, and pending approvals now
  store Codex `ContextManager` fields (`items`, `history_version`,
  `token_info`, `reference_context_item`); `stepResults` remain as
  transcript/debug snapshots and compatibility data.
- Tool output payload: partially aligned. AILIS now has
  `FunctionCallOutputPayload`, `FunctionCallOutputBody`, and content-item
  constructors; provider adapters convert them to the wire value.
- Tool model: partially aligned. AILIS now has Codex-named `ToolRouter`,
  `ToolRegistry`, and `ToolExposure`, but its schema repair/compression layer
  and direct-tool limit still differ from Codex's full spec planner.
- Context/history runtime: partially aligned. Codex has durable session
  `ContextManager` history; AILIS now uses a long-lived `ContextManager` inside
  a live Agent run and persists checkpoint snapshots across transcript,
  debug-pause, and pending-approval boundaries. Full rollout-level replacement
  history is still pending.
- Compaction/runtime state: not aligned. Codex has `Compaction`,
  `ContextCompaction`, `ContextCompactionItem`, `reference_context_item`, and replacement history;
  AILIS has old `ailis-context-compiler.cjs` but the main Agent path no longer
  uses it.
- Naming: still has AILIS-only concepts in the repository, especially
  `working_state`, `context_pack`, `tool_observations`, and
  `cleared_observations`.

Recommended direction:

1. Keep the new native tool / ResponseItem request path.
2. Replace AILIS-specific `working_state/context_pack` naming with Codex source
   names: `ContextManager`, `ResponseItem`, `Compaction`, `ContextCompactionItem`, and
   `TurnContextItem` concepts.
3. Expand AILIS ResponseItem support to the full Codex enum subset.
4. Make `stepResults` a persistence/debug view, not the source of model-visible
   history.

## 2. Codex Canonical Model

### 2.1 Prompt

Codex source:

- `codex-rs/core/src/client_common.rs`

Canonical Rust shape:

```rust
pub struct Prompt {
    pub input: Vec<ResponseItem>,
    pub(crate) tools: Vec<ToolSpec>,
    pub(crate) parallel_tool_calls: bool,
    pub base_instructions: BaseInstructions,
    pub personality: Option<Personality>,
    pub output_schema: Option<Value>,
    pub output_schema_strict: bool,
}
```

Important points:

- `input` is already structured `ResponseItem[]`.
- `tools` is separate from text prompt.
- `base_instructions` maps to API `instructions`.
- `output_schema` is first-class, not a prompt convention.

### 2.2 ResponsesApiRequest

Codex source:

- `codex-rs/codex-api/src/common.rs`

Canonical wire shape:

```rust
pub struct ResponsesApiRequest {
    pub model: String,
    pub instructions: String,
    pub input: Vec<ResponseItem>,
    pub tools: Vec<serde_json::Value>,
    pub tool_choice: String,
    pub parallel_tool_calls: bool,
    pub reasoning: Option<Reasoning>,
    pub store: bool,
    pub stream: bool,
    pub include: Vec<String>,
    pub service_tier: Option<String>,
    pub prompt_cache_key: Option<String>,
    pub text: Option<TextControls>,
    pub client_metadata: Option<HashMap<String, String>>,
}
```

Important points:

- `tool_choice` is normally `"auto"`.
- `stream` is true in Codex model client.
- `prompt_cache_key` is tied to thread id.
- `client_metadata` includes installation metadata.

### 2.3 ResponseInputItem

Codex source:

- `codex-rs/protocol/src/models.rs`

Canonical input-only item subset:

```rust
pub enum ResponseInputItem {
    Message { role, content, phase },
    FunctionCallOutput { call_id, output },
    McpToolCallOutput { call_id, output },
    CustomToolCallOutput { call_id, name, output },
    ToolSearchOutput { call_id, status, execution, tools },
}
```

This means Codex distinguishes items a caller can feed in from the larger
`ResponseItem` enum returned by the model/runtime.

### 2.4 ResponseItem

Codex source:

- `codex-rs/protocol/src/models.rs`

Canonical model-visible / history item variants found in the reference source:

```text
message
reasoning
local_shell_call
function_call
tool_search_call
function_call_output
custom_tool_call
custom_tool_call_output
tool_search_output
web_search_call
image_generation_call
compaction
compaction_trigger
context_compaction
other
```

Important fields:

- `message`: `role`, `content[]`, optional `phase`
- `function_call`: `name`, optional `namespace`, string `arguments`, `call_id`
- `function_call_output`: `call_id`, `output`
- `tool_search_call`: optional `call_id`, `status`, `execution`, `arguments`
- `tool_search_output`: optional `call_id`, `status`, `execution`, `tools[]`
- `custom_tool_call`: `call_id`, `name`, string `input`
- `compaction`: `encrypted_content`
- `context_compaction`: optional `encrypted_content`

### 2.5 ContentItem

Codex content item variants:

```text
input_text
input_image
output_text
```

Codex preserves multimodal content at the item level, then strips images in
`ContextManager.for_prompt()` when the target model does not support images.

### 2.6 FunctionCallOutputPayload

Codex source:

- `codex-rs/protocol/src/models.rs`

Canonical shape:

```rust
pub struct FunctionCallOutputPayload {
    pub body: FunctionCallOutputBody,
    pub success: Option<bool>,
}

pub enum FunctionCallOutputBody {
    Text(String),
    ContentItems(Vec<FunctionCallOutputContentItem>),
}

pub enum FunctionCallOutputContentItem {
    InputText { text },
    InputImage { image_url, detail },
    EncryptedContent { encrypted_content },
}
```

Important point:

- The model-facing wire value for `function_call_output.output` can be either
  a plain string or structured content items.
- Plain text conversion is intentionally lossy and not the authoritative
  payload.

### 2.7 ContextManager

Codex source:

- `codex-rs/core/src/context_manager/history.rs`

Canonical state:

```rust
pub(crate) struct ContextManager {
    items: Vec<ResponseItem>,
    history_version: u64,
    token_info: Option<TokenUsageInfo>,
    reference_context_item: Option<TurnContextItem>,
}
```

Key behavior:

- `record_items()` writes structured items into history.
- `process_item()` truncates function/custom tool outputs at item boundary.
- `for_prompt()` normalizes history before sending to model.
- Normalization ensures:
  - every function/custom call has an output,
  - every output has a call,
  - unsupported images are stripped.

### 2.8 Turn Loop

Codex source:

- `codex-rs/core/src/session/turn.rs`

Critical flow:

```rust
let sampling_request_input: Vec<ResponseItem> = {
    sess.clone_history()
        .await
        .for_prompt(&turn_context.model_info.input_modalities)
};

let prompt = Prompt {
    input,
    tools: router.model_visible_specs(),
    parallel_tool_calls: turn_context.model_info.supports_parallel_tool_calls,
    base_instructions,
    personality,
    output_schema,
    output_schema_strict,
};
```

Codex does not rebuild the model prompt from ad hoc JSON each round. It samples
from normalized canonical history.

### 2.9 ToolRouter

Codex source:

- `codex-rs/core/src/tools/router.rs`
- `codex-rs/core/src/tools/spec_plan.rs`

Canonical concepts:

```text
ToolRouter
ToolRegistry
model_visible_specs()
ToolExposure::Direct
ToolExposure::DirectModelOnly
ToolExposure::Deferred
ToolSearchHandler
```

Important behavior:

- Direct tools become model-visible specs.
- Deferred tools are searchable through `tool_search`.
- Tool schemas are not ordinary prompt text.
- Tool exposure is planned before building the prompt.

## 3. Current AILIS Model

### 3.1 Request Shell

AILIS source:

- `electron/ailis-agent-runner.cjs`
- `electron/ailis-response-model.cjs`
- `electron/ailis-context-manager.cjs`
- `electron/ailis-tool-router.cjs`
- `electron/ailis-codex-response-items.cjs`

Current AILIS request object:

```js
{
  instructions,
  input,
  messages: responseItemsToChatMessages({ instructions, input }),
  model: 'codex_compatible_prompt.v1',
  promptProfile,
  stats
}
```

Main loop sends:

```js
{
  timeoutMs,
  messages,
  instructions,
  input,
  tools: directToolSpecs,
  toolChoice: 'auto',
  jsonMode: false
}
```

Debug snapshot records:

```js
codex_request: {
  instructions,
  input,
  tools,
  tool_choice: 'auto',
  parallel_tool_calls: false,
  stats
}
```

This is close to Codex, but AILIS still keeps `messages` as a compatibility
projection beside the canonical request.

### 3.2 AILIS ResponseItem Support

AILIS source:

- `electron/ailis-codex-response-items.cjs`

Currently supported item constructors:

```text
message
reasoning
local_shell_call
function_call
function_call_output
custom_tool_call
custom_tool_call_output
tool_search_call
tool_search_output
web_search_call
image_generation_call
compaction
compaction_trigger
context_compaction
other
```

Still incomplete compared with Codex runtime behavior:

```text
durable history ownership
provider reasoning preservation
real compaction replacement history
reference_context_item reinjection
native local_shell_call execution semantics
```

### 3.3 AILIS Message Content

AILIS currently emits:

```js
[{ type: 'input_text', text }]
[{ type: 'output_text', text }]
```

Missing or incomplete:

- `input_image` in normal message content.
- `FunctionCallOutputContentItem` structured outputs.
- `encrypted_content`.
- model capability based image stripping at history normalization time.

### 3.4 AILIS Tool Output Payload

AILIS current internal `function_call_output` shape:

```js
{
  type: 'function_call_output',
  call_id,
  output: {
    body: { kind: 'text' | 'content_items', value },
    success?: boolean
  }
}
```

Codex canonical shape is:

```text
output: FunctionCallOutputPayload
  body: Text | ContentItems
  success?: boolean
```

Gap:

- AILIS now keeps success inside `FunctionCallOutputPayload`.
- OpenAI Responses wire conversion sends only the Codex wire value for `output`
  and does not send internal `success`.
- Some tool adapters still collapse rich outputs to text before constructing the
  payload; this is now an adapter-layer gap rather than a ResponseItem object
  gap.

### 3.5 AILIS Context Message

AILIS currently packs context into a user message:

```json
{
  "type": "context",
  "memory_context": "...",
  "attached_files": [],
  "runtime_environment": {},
  "capability_catalog": {},
  "external_tool_exposure": {}
}
```

Codex does not use this exact model-visible object. Codex has initial context
and settings updates as structured history/context items, tracked through
`reference_context_item`.

Gap:

- AILIS `type: "context"` is an AILIS-specific user-message convention.
- It is not a Codex `ResponseItem` variant.

### 3.6 AILIS Tool Specs

AILIS current flow:

- `gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs()`
- dynamic specs from tool observations
- `normalizeNativeToolSpec()`
- schema repair/hardening
- schema compaction
- add optional `progressNote`
- direct tool limit, default 16
- exact-answer mode appends `final_answer` last

Current AILIS model-facing tool shape:

```js
{
  type: 'function',
  name,
  description,
  parameters,
  strict?
}
```

Responses provider maps it to the same OpenAI Responses tool object.

Gap:

- Codex uses `ToolSpec` and `ToolRouter.model_visible_specs()`.
- AILIS has equivalent intent but not equivalent naming/structure.
- AILIS schema compression/repair is runtime-specific and may change tool
  shape in ways Codex does not.
- AILIS direct tool limit is a custom cap; Codex uses exposure planning and
  deferred search rather than a simple visible count limit.

### 3.7 AILIS Provider Mapping

OpenAI Responses provider:

```js
body = {
  model,
  input,
  temperature
}

body.instructions = instructions
body.tools = mapToolsForResponses(tools)
body.tool_choice = 'auto'
body.reasoning = ...
body.parallel_tool_calls = ...
body.service_tier = ...
```

Gap against Codex:

- AILIS does not currently send `stream: true` in this path.
- AILIS does not send `include`.
- AILIS does not send `store`.
- AILIS does not send `prompt_cache_key`.
- AILIS does not send Codex-style `client_metadata`.
- AILIS still has chat-completions compatibility conversion, which is useful
  for non-Responses providers but not identical to Codex.

### 3.8 AILIS History Runtime

Current live-run main path:

- First model turn seeds `ContextManager` from conversation/context/user and any
  resume-time `initialStepResults`.
- Each completed tool result appends `function_call` /
  `function_call_output` or `tool_search_call` / `tool_search_output` items into
  the same `ContextManager`.
- Each model turn samples from `ContextManager.forPrompt()`.
- `stepResults` remain for transcript/debug/approval recovery, compatibility,
  and loop guards; checkpoint snapshots are preferred when resuming
  `ContextManager` history.

Codex path:

- Tool calls and outputs are recorded as `ResponseItem`s into
  `ContextManager`.
- Prompt input is `clone_history().for_prompt(...)`.

Gap:

- AILIS has a Codex-named live-run `ContextManager` and stores checkpoint
  snapshots at transcript/debug/approval boundaries, but not yet a full
  session-level rollout owner.
- AILIS has no main-path equivalent of `history_version`,
  `token_info`, or `reference_context_item`.
- AILIS has no `normalize_history()` that enforces call/output invariants on
  the canonical history before every model call.

### 3.9 AILIS Compaction / Working State

Current repository still contains:

- `electron/ailis-context-compiler.cjs`
- `context_pack`
- `working_state`
- `tool_observations`
- `cleared_observations`

But `electron/ailis-agent-runner.cjs` no longer imports
`compileAgentPromptPayloadV1` in the main Agent path.

Codex has:

```text
compaction
compaction_trigger
context_compaction
reference_context_item
replace_compacted_history
```

Gap:

- AILIS old `working_state` naming is not Codex-native.
- If this logic comes back into model-visible prompts, it should be renamed and
  reshaped to Codex-like compaction/history items.
- The current main path avoids the old broken compiler, but it also lacks
  Codex-grade compaction.

## 4. One-by-One Comparison Table

| Layer | Codex | AILIS Now | Match | Required Change |
| --- | --- | --- | --- | --- |
| Outer request | `ResponsesApiRequest` | `{instructions,input,tools,toolChoice}` | Partial | Add `stream/include/store/prompt_cache_key/client_metadata` where provider supports them. |
| Prompt internal object | `Prompt { input, tools, base_instructions, personality, output_schema }` | plain JS prompt object | Partial | Rename/reshape internal object to `Prompt` semantics. |
| Input history | `Vec<ResponseItem>` from durable `ContextManager` | long-lived live-run `ContextManager`; transcript/debug/approval checkpoints restore canonical history where available | Partial | Move checkpoints into session-level rollout/compaction storage. |
| Message item | `message {role, content[], phase?}` | supported | Mostly | Preserve phase and image content. |
| Content item | `input_text/input_image/output_text` | text only | Partial | Add image item path and modality stripping. |
| Function call | `function_call {name, namespace?, arguments: string, call_id}` | supported | Mostly | Ensure args always raw JSON string in canonical history. |
| Function output | `function_call_output {call_id, output: FunctionCallOutputPayload}` | implemented internally, wire-converted in provider | Mostly | Preserve richer adapter outputs as content items. |
| Tool search call/output | `tool_search_call/output` | supported | Mostly | Align optional `call_id` and status/execution fields. |
| MCP output | `McpToolCallOutput` maps to `FunctionCallOutput` | no explicit item | No | Add input item support for MCP output before conversion. |
| Custom tool call/output | first-class variants | not supported | No | Add variants or explicitly decide not needed. |
| Web search call | first-class variant | not supported as ResponseItem | No | Add variant if web search is model-native. |
| Image generation call | first-class variant | not supported | No | Add only if image generation is model-native. |
| Reasoning item | first-class variant | not preserved | No | Preserve if provider returns reasoning summaries/encrypted content. |
| Compaction item | `compaction/context_compaction` | old `context_pack` module, not main path | No | Replace old names with Codex compaction item model. |
| Context state | `reference_context_item` baseline | AILIS `type:"context"` user message | No | Build Codex-like context update/reference mechanism. |
| History normalization | `ensure_call_outputs_present`, `remove_orphan_outputs`, image stripping | none on canonical history | No | Add normalize step before prompt build. |
| Tool exposure | `ToolRouter`, direct/deferred/search | `ToolRouter` wrapper over registry + dynamic specs + cap | Partial | Move more planning into router/spec plan; reduce schema mutation. |
| Tool schema storage | structured `ToolSpec` | OpenAI function tool object | Partial | Fine for provider wire; internal naming should match `ToolSpec`. |
| Final answer | assistant message, optional output schema | assistant message or `final_answer` tool in exact mode | Partial | Keep `final_answer` only as eval submission endpoint, not general object model. |
| Chat compatibility | not canonical | required for AILIS providers | Intentional divergence | Keep adapter as provider projection, not canonical model. |

## 5. Key Differences That Still Matter

### Difference A: `stepResults` is still the source of truth

This is the biggest architectural difference.

Codex:

```text
tool call/output -> ResponseItem -> ContextManager -> for_prompt()
```

AILIS live run:

```text
tool call/output -> ContextManager.recordItems() -> forPrompt()
```

AILIS resume/debug boundary:

```text
stepResults snapshot -> seed ContextManager once -> forPrompt()
```

Impact:

- AILIS can display Codex-shaped input, but it does not yet have Codex-shaped
  memory.
- Normalization and compaction cannot be as reliable until history is canonical.

### Difference B: AILIS `context` message is not Codex-native

AILIS:

```json
{"type":"context","attached_files":[],"runtime_environment":{}}
```

Codex:

```text
initial context / settings updates / reference_context_item
```

Impact:

- The model sees an AILIS-specific JSON convention.
- This may be less familiar than Codex's trained object/event pattern.

### Difference C: AILIS does not support full ResponseItem variants

The current AILIS V1 only covers the common task path. It does not preserve:

- reasoning,
- compaction,
- context_compaction,
- local_shell_call,
- custom_tool_call,
- web_search_call,
- image_generation_call.

Impact:

- Long tasks and compaction cannot become truly Codex-like yet.
- Multimodal/tool outputs remain text-biased.

### Difference D: Tool output shape is string-first

Codex keeps structured tool output payloads. AILIS currently converts most tool
results into text before putting them in `function_call_output`.

Impact:

- Artifact rows, images, and rich outputs are easier to damage.
- This was part of the earlier XLSX failure pattern.

### Difference E: Tool exposure is similar but not identical

AILIS has:

```text
modelVisibleSpecs + dynamic specs + schema repair + direct tool cap
```

Codex has:

```text
ToolRouter + ToolExposure + ToolSearchHandler + model_visible_specs
```

Impact:

- Functionally similar, but model/debug naming is not Codex-like.
- Schema repair can accidentally distort tool affordances.

## 6. Migration Plan To Full Codex-Like Object Model

### Phase 1: Create `ailis-response-model.cjs`

Define exact JS constructors/types mirroring Codex:

```text
ResponseInputItem
ContentItem
ResponseItem
FunctionCallOutputPayload
FunctionCallOutputBody
FunctionCallOutputContentItem
MessagePhase
BaseInstructions
Prompt
ResponsesApiRequest
```

Do not invent AILIS-only names for these.

### Phase 2: Create `ailis-context-manager.cjs`

Mirror Codex naming:

```text
ContextManager
items
history_version
token_info
reference_context_item
recordItems()
forPrompt()
rawItems()
replace()
normalizeHistory()
```

Move canonical history away from `stepResults`.

### Phase 3: Convert execution loop

Current:

```text
stepResults -> buildCodexInput()
```

Target:

```text
record user/context/tool items -> contextManager.forPrompt() -> Prompt
```

`stepResults` should become transcript/debug output only.

### Phase 4: Replace AILIS context names

Deprecate model-visible:

```text
working_state
context_pack
tool_observations
cleared_observations
```

Replace with:

```text
ResponseItem::Compaction
ResponseItem::ContextCompaction
TurnContextItem/reference_context_item-like baseline
```

Internal reducers can still exist, but their model-facing output should be
Codex-shaped.

### Phase 5: Tool router naming

Introduce AILIS equivalents named like Codex:

```text
ToolRouter
ToolRegistry
ToolExposure
modelVisibleSpecs()
ToolSearchHandler
```

Keep provider wire format as OpenAI function tools.

### Phase 6: Provider parity

For OpenAI Responses-compatible providers, include where supported:

```text
stream
include
store
prompt_cache_key
client_metadata
text/output_schema controls
reasoning controls
parallel_tool_calls
```

For Chat/Anthropic/Gemini, keep projections, but treat them as provider
adapters only.

## 7. Practical Verdict

The old JSON meta-decision chain is gone from the main AILIS Agent loop. That
part is a real improvement.

But AILIS is not yet "Codex object model identical." It is currently:

```text
Codex-like request shell
+ partial ResponseItem projection
+ native tool calls
- canonical ContextManager history
- full ResponseItem enum
- Codex compaction/context items
- exact FunctionCallOutputPayload
- Codex ToolRouter naming/semantics
```

The next correct engineering move is not to add more prompt hints. It is to
make the internal canonical objects match Codex names and shapes, then let the
provider adapters project them outward.
