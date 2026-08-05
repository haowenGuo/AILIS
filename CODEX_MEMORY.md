# Codex Memory Checkpoint

Date/time: 2026-07-29
Workspace: `F:\AILIS_self_evolution_runtime-gaia-p1-baseline`
Branch: `codex/p1-native-tool-transport`
Base commit: `32de3f56e4380650e9ed107b4eadc353235f4562`

## Objective

- Replace P1's JSON-emulated Codex tool calls with native Responses function calls.
- Keep AILIS as the sole owner of tool execution, context, retry, evidence, approval, and finalization.
- Preserve canonical ResponseItems and native roles.
- Send real `parallel_tool_calls=true`.
- Execute parallel-safe calls concurrently, unsafe calls serially, and persist every emitted call.
- Keep finalization, audit, answer selection, and task routing unchanged.

## Implemented

- `electron/codex-model-bridge.cjs`
  - Production bridge now calls the native ChatGPT Codex Responses endpoint.
  - Sends canonical input, native function tools, tool choice, reasoning controls, encrypted reasoning inclusion, stable prompt cache key, and `parallel_tool_calls`.
  - Parses all SSE response items and all function calls.
  - Uses the current OAuth snapshot and Windows HTTPS proxy without writing secrets.
  - Strips stateless ResponseItem IDs at the wire boundary, matching locked Codex source behavior.
  - Compiles optional strict arguments as required nullable fields and removes returned null leaves before AILIS validation.
  - Hydrates compact `tool_search_output.tools` history with current native tool specs.
  - Projects AILIS web viewport extensions onto standard Responses web action fields.
  - Legacy app-server/decision-schema code remains callable only by the isolated shadow A/B script; production no longer uses it.
- `electron/desktop-llm-provider.cjs`
  - Codex provider advertises `codex-responses-native`; JSON mode/schema are disabled.
- `electron/ailis-agent-runner.cjs`
  - Records provider reasoning/message/function-call ResponseItems before AILIS-owned outputs.
  - Builds deterministic execution groups: contiguous safe calls run concurrently, unsafe calls run one at a time.
  - Persists the complete multi-call roster and every preflight disposition before execution.
  - Keeps all pending calls and execution groups across approval pause/resume.
  - Uses a stable per-run prompt cache key.
- `electron/ailis-model-input-builder.cjs`
  - Avoids duplicating a native function call when recording its AILIS-owned output.
- `electron/ailis-web-run-description.md`
  - Only states that independent `search_query` variants may share a call; a single query remains valid.
- Added deterministic shadow/reconciliation scripts and focused tests.

## Verification

- Syntax checks passed for all changed runtime and script files.
- Integration suite passed: `214/214`, covering:
  - native bridge request/SSE parsing
  - provider adapters
  - canonical ResponseItems
  - ContextManager/ToolRouter
  - Agent runner scheduling
  - approval checkpoint no-tail-loss
- Live diagnostic two-tool probe returned two standard function calls in one native response with `parallel_tool_calls=true`.
- No AILIS tools were executed by Codex during the probe or shadow replay.

## Transport-Only Shadow A/B

Source transcripts:
`F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p1-vs-codex-validation165-20260728`

Reconciled reports:
- `F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\candidate-p1-native-transport-shadow-working-20260729\shadow-reconciled.md`
- `F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\candidate-p1-native-transport-shadow-working-20260729\shadow-reconciled.json`

Results:
- Diagnostic only; `excludedFromScore=true`; no tools executed.
- Final native compatibility: `4/4`.
- Three directly paired successful rows:
  - legacy input tokens: `123,415`
  - native input tokens: `49,490` (`-59.90%`)
  - legacy latency: `109,420 ms`
  - native latency: `53,016 ms` (`-51.55%`)
- A fourth legacy row timed out at 120 seconds; native returned in `17,115 ms`.
- Observed native cached tokens: `0`. The stable cache key is transported, but cache hits are not proven.
- This replay validates transport compatibility and cost only, not task correctness.

## Boundary

- No full GAIA gate has been started.
- Do not claim score improvement from shadow replay.
- Do not merge into the accepted baseline before a fixed-commit focused correctness control and then the agreed paired regression gate.
- Do not mix finalization, audit, answer selection, routing, or prompt-policy changes into this candidate.
