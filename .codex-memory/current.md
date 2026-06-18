# Codex Memory Checkpoint

Date/time: 2026-06-18 14:03 Asia/Shanghai
Workspace: F:\AILIS_self_evolution_runtime
Git state: branch AILIS-self-evolution, dirty worktree with many pre-existing local changes; do not revert unrelated user changes.

## Objective
- Rework the AILIS tool layer to follow Codex-style dynamic tool semantics.
- Default model-facing tools should be small and stable; research/Web/MCP tools should be discoverable through `tool_search`.
- Port Codex-style schema contract behavior: preserve/require `required`, prefer `additionalProperties:false`, reject or downgrade invalid schemas, and never execute empty `{}` arguments for tools that require parameters.

## Latest User Intent
- Implement these changes now:
  - Codex-style tool exposure: few core tools visible by default, research/Web/MCP tools exposed through `tool_search`.
  - Strong schema contracts for `web_search.query`, `web_fetch.url`, and `describe_image.path`.
  - Regression tests for the empty-argument failure path.
  - Validate against the previous Kaggle/Doubao failure transcript so repeated `mcp__...({})` calls no longer occur.

## Current State
- Runtime repo is `F:\AILIS_self_evolution_runtime`; current working shell was previously `F:\AIGril\AIGrilClaw`.
- Actual runner file is `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`.
- Actual provider file is `F:\AILIS_self_evolution_runtime\electron\desktop-llm-provider.cjs`.
- Actual research MCP file is `F:\AILIS_self_evolution_runtime\scripts\mcp-ailis-research-server.cjs`.
- Implemented Codex-style smaller default direct surface:
  - Default direct tools include `tool_search`, `update_plan`, `computer`, `read`, `write`, `exec`, `apply_patch`, and `request_permissions`.
  - `artifact_query`, `artifact_compute`, `read_xlsx_workbook`, `github_pages`, `mcp_bridge`, and `subagents` are discovered through `tool_search`.
- Implemented dynamic search exposure:
  - `tool_search` results can promote deferred tools into next-turn native direct specs.
  - MCP search results now preserve `input_schema` and include a model-facing `spec`.
- Implemented schema/preflight hardening:
  - `web_search.query`, `web_fetch.url`, and `describe_image.path` are required with `minLength:1`.
  - Object schemas are closed with `additionalProperties:false` where properties exist.
  - Native direct executor rejects invalid/empty arguments before tool execution and falls back to repair.
- Local Codex reference repo is `F:\AIGril\AIGrilClaw\.refs\openai-codex`.
- Relevant Codex reference:
  - `codex-rs\app-server\src\request_processors\thread_processor.rs`: validates dynamic tools, reserved namespaces, deferred tools, and schemas.
  - `codex-rs\app-server\tests\suite\v2\dynamic_tools.rs`: asserts exact tool schema injection and deferred tool behavior.
  - `codex-rs\app-server\README.md`: documents `deferLoading` and `tool_search` behavior.

## Decisions And Constraints
- Do not store API keys, tokens, or secrets in checkpoint files.
- Do not modify unrelated dirty files or revert user changes.
- Use `apply_patch` for manual edits.
- If committing, commit only relevant files for this tool-layer fix.

## Known Problems
- Previous Doubao Pro exact-task transcript selected correct tools but emitted empty args:
  - `mcp__ailis_research__web_search {}` -> `web_search requires query`
  - `mcp__ailis_research__web_fetch {}` -> schema error for missing `url`
  - `mcp__ailis_research__describe_image {}` -> `describe_image requires an existing image path`
- Historical transcript counts:
  - Doubao probe had empty `web_search` 8 times, empty `web_fetch` 5 times, empty `describe_image` 20 times.
  - DeepSeek/user transcript had empty `describe_image` 2 times.
- Current deterministic replay blocks all three empty-call shapes through `validateNativeDirectToolCall`.
- A live `executeGatewayToolSearch` against the actual MCP manager timed out once at 60 seconds during this session. The deterministic mocked-MCP integration test passes; live MCP startup/search may still need separate diagnosis if it recurs.

## Next Actions
1. Commit the Codex-style tool-layer changes.
2. Restart AILIS and run a short live Kaggle/game-strategy task to confirm the model now uses `tool_search` then calls direct MCP tools with required args.
3. If live MCP search still times out, diagnose MCP startup/list-tools separately from schema/preflight.

## Commands And Results
- `node --check electron\ailis-mcp-adapter.cjs electron\ailis-tool-specs.cjs electron\ailis-tool-runtime.cjs electron\ailis-gateway.cjs electron\ailis-agent-runner.cjs scripts\mcp-ailis-research-server.cjs`: all passed.
- `node --test tests\ailis-tool-layer.test.mjs`: passed, 12 tests.
- `node --test tests\ailis-tool-contracts.test.mjs`: passed, 2 tests.
- `node --test tests\desktop-llm-provider.test.mjs`: passed, 16 tests.
- `node --test tests\ailis-agent-runner.test.mjs`: passed, 3 tests.
- `node --test tests\ailis-gateway.test.mjs`: passed, 9 tests.
- `node --test tests\ailis-agent-execution-flow.test.mjs`: passed, 8 tests.
- `node --test tests\ailis-runtime.test.mjs`: passed, 7 tests.
- Combined targeted suite `node --test tests\ailis-tool-layer.test.mjs tests\ailis-tool-contracts.test.mjs tests\ailis-agent-runner.test.mjs tests\ailis-gateway.test.mjs tests\ailis-agent-execution-flow.test.mjs tests\desktop-llm-provider.test.mjs`: passed, 50 tests.
