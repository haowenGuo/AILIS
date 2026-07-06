# AILIS Codex-Compatible Object Model Migration

## Source Baseline

Codex source inspected from:

- `F:/AIGril/AIGrilClaw/.refs/openai-codex`
- commit `7d47056ea42636271ac020b86347fbbef49490aa`

The Codex model-visible request is built from:

- `codex-rs/core/src/client_common.rs`: `Prompt`
- `codex-rs/codex-api/src/common.rs`: `ResponsesApiRequest`
- `codex-rs/protocol/src/models.rs`: `ResponseItem`
- `codex-rs/core/src/context_manager/history.rs`: history normalization
- `codex-rs/core/src/session/turn.rs`: per-turn sampling input construction

Canonical Codex request shape:

```json
{
  "model": "...",
  "instructions": "...",
  "input": [
    {"type": "message", "role": "user", "content": []},
    {"type": "function_call", "name": "tool_name", "arguments": "{}", "call_id": "call_1"},
    {"type": "function_call_output", "call_id": "call_1", "output": "..."}
  ],
  "tools": [],
  "tool_choice": "auto",
  "parallel_tool_calls": false,
  "reasoning": null,
  "stream": true
}
```

## AILIS Original Model-Visible Shape

AILIS previously built model-visible data in `electron/ailis-agent-runner.cjs` and
`electron/ailis-context-compiler.cjs` as a custom JSON payload inside a user message:

```json
{
  "user_goal": "...",
  "recent_conversation": [],
  "memory_context": "...",
  "runtime_environment": {},
  "recent_turn_items": {},
  "tool_observations": [],
  "context_pack": {
    "working_state": {},
    "active_observation_ids": [],
    "cleared_observations": []
  },
  "capability_catalog": {},
  "current_progress": {}
}
```

The model was also asked to emit a custom decision object:

```json
{
  "action": "load_context|tool|final|blocked",
  "tool_call": {"tool": "...", "args": {}},
  "final_answer": "...",
  "blocked_reason": "..."
}
```

This diverged from Codex in two important ways:

1. Prior tool observations were represented as AILIS-specific fields instead of standard
   `function_call` / `function_call_output` pairs.
2. The next action was represented as an AILIS JSON meta-decision instead of native tool
   calls or assistant final messages.

## Object Model Mapping

| Codex / Responses object | Old AILIS field | Migration rule |
| --- | --- | --- |
| `instructions` | `system` message text | Keep as separate request field for Responses; convert to system message for chat providers. |
| `input[]` | JSON user payload | Build an ordered `ResponseItem[]`. |
| `message` | `user_goal`, `recent_conversation`, context JSON | Emit regular `message` items with `role`. |
| `function_call` | `tool_call`, `recent_turn_items.tool_call` | Reconstruct from executed `stepResults`: `name`, JSON-string `arguments`, `call_id`. |
| `function_call_output` | `tool_observations`, `recent_turn_items.tool_result` | Reconstruct from `stepResults.response`: same `call_id`, text output, optional `success`. |
| `tool_search_call` | `tool_search` step | Emit when `stepResult.tool === "tool_search"`. |
| `tool_search_output` | tool_search returned tools | Emit with `tools[]`, `status`, `execution`. |
| `tools` | direct tool specs | Preserve as provider-native tool specs. |
| `tool_choice` | `toolChoice` | Use `"auto"` for direct-tool loop. |
| final answer | `action="final"`, `final_answer` | Direct-tool path now allows final assistant message; legacy JSON fallback still maps old final. |

## Implemented V1

New module:

- `electron/ailis-codex-response-items.cjs`
- `electron/ailis-response-model.cjs`
- `electron/ailis-context-manager.cjs`
- `electron/ailis-tool-router.cjs`

Responsibilities:

- Defines Codex-named `ResponseItem`, `ContentItem`, `FunctionCallOutputPayload`,
  `FunctionCallOutputBody`, `ContextManager`, `ToolRouter`, and compaction item
  constructors.
- Converts `stepResults` into Codex-style `ResponseItem` pairs.
- Converts `tool_search` into `tool_search_call` / `tool_search_output`.
- Builds ordered `input[]` from conversation, context, user goal, and tool history
  through `ContextManager.forPrompt()`.
- In the live Agent loop, `ContextManager` is now a run-local long-lived history
  owner. Tool results are appended into it as they complete; `stepResults` remain
  for transcript/debug/approval recovery instead of being the per-turn prompt
  source.
- `ContextManager` can now export/import a snapshot shaped like Codex
  `ContextManager` fields: `items`, `history_version`, `token_info`, and
  `reference_context_item`. Runtime context snapshots, debug pauses, and
  pending approvals store this checkpoint so resume paths can continue from the
  canonical history instead of rebuilding only from `stepResults`.
- Provides a chat-completions compatibility projection that preserves native
  `assistant.tool_calls` and `tool` response messages.

Provider updates:

- `electron/desktop-llm-provider.cjs`
- OpenAI Responses provider can send `payload.instructions` + `payload.input` directly.
- Chat-completions providers receive a compatibility conversion from `ResponseItem[]`
  to `system/user/assistant(tool_calls)/tool` messages.

Agent runner updates:

- `electron/ailis-agent-runner.cjs`
- Direct tool executor builds a `codex_request`:

```json
{
  "instructions": "...",
  "input": [],
  "tools": [],
  "tool_choice": "auto",
  "parallel_tool_calls": false
}
```

- Runtime debug snapshots now include `codex_request` for inspection.
- The old JSON meta-decision planner and repair/fallback path have been removed
  from the main Agent loop.
- `FunctionCallOutputPayload` stays internal; OpenAI Responses provider converts
  it to the Codex wire value before sending `input[]`.

## Remaining Work

- Extend checkpoint durability beyond approval/debug resume into full
  session-level rollout storage and future compaction replacement history.
- Replace any future model-visible `context_pack` with Codex `compaction` /
  `context_compaction` style items.
- Keep `working_state`, `tool_observations`, and `cleared_observations` out of
  the main model-visible Agent protocol unless they are reshaped into Codex
  object names.
- Convert final answer to assistant `message` semantics everywhere possible; keep `final_answer`
  tool only where a provider or eval harness requires a tool submission endpoint.
- Add transcript replay tests that assert each round contains Codex-compatible
  `input[]` and paired call/output items.
