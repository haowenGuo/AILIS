# Codex Memory Checkpoint

Date/time: 2026-06-18 Asia/Shanghai
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `AILIS-self-evolution`

## Current User Intent

- Restart/fresh-run AILIS and rerun the real Kaggle/strategy task to inspect the behavior chain.
- The core acceptance target is Codex-style tool use:
  - Small default core surface.
  - `tool_search` exposes research/Web/MCP tools on demand.
  - No empty `{}` direct MCP calls.
  - `web_search` discovery must be followed by `web_fetch` evidence.
  - Avoid shell/Bing HTML scraping when stable Web tools exist.

## What Changed

- `electron/ailis-runtime-budget.cjs`
  - Preserves JSON-schema `required` arrays and `properties` objects during model-facing compaction.
  - Fixes the failure mode where `tool_search` returned schema contracts but compacted them into strings.
- `electron/ailis-tool-routing.cjs`
  - Adds a public/current-web routing profile for Kaggle/latest/strategy/competition queries.
  - Returns both `web_search` and `web_fetch`, with `web_search` ranked first.
  - Fixes `webPenalty: 0` being ignored because of `||`.
- `electron/ailis-turn-items.cjs`
  - Classifies successful `web_search` output as `search_results_need_fetch`.
  - Recovery hint tells the next model turn to call `mcp__ailis_research__web_fetch` on a high-signal URL before another broad search/final.
- `electron/ailis-agent-runner.cjs`
  - Temporarily disables direct tools that fail non-retryably, especially `describe_image` when the configured provider rejects `image_url`.
  - Suppresses repeated `update_plan` direct-tool loops after 2 consecutive direct `update_plan` steps.
  - Suppresses `tool_search` for the next turn after a successful `tool_search` has already exposed concrete tools, forcing the model to use the surfaced tool instead of repeatedly searching for tools.
- `scripts/mcp-ailis-research-server.cjs`
  - `describe_image` now returns actionable provider-unsupported errors and next actions.
  - `web_fetch` now falls back from Python `requests` to Node `fetch` on transport failures such as SSL EOF.
  - Fetch diagnostics include backend/fallback metadata and SSL failure hints.
- `tests/ailis-tool-layer.test.mjs`
  - Adds regression coverage for public web routing, strict MCP schemas, compacted schema preservation, empty-arg rejection, vision-failure tool suppression, `update_plan`/`tool_search` loop suppression, and `web_fetch` Node fallback.
- `tests/ailis-turn-items.test.mjs`
  - Adds regression coverage for `web_search -> web_fetch` evidence-gap classification.

## Actual Runs

- Pre-final-fix real Gateway-only run:
  - Log: `.runtime-logs\kaggle_strategy_gateway_only_20260618160858.json`
  - Result: `max_steps_reached`, 24 steps.
  - Empty args: none.
  - Tool counts:
    - `computer`: 1
    - `tool_search`: 5
    - `update_plan`: 8
    - `mcp__ailis_research__describe_image`: 1
    - `exec`: 2
    - `mcp__ailis_research__web_search`: 4
    - `mcp__ailis_research__web_fetch`: 3
  - Important improvement: chain reached `tool_search -> web_search -> web_fetch`, including successful `web_fetch` of `https://www.kaggle.com/competitions`.
  - Remaining failure seen in that run: after useful web evidence, the model kept searching for tools / updating plans and later searched for vision tools again.
- Post-final-loop-fix real Gateway-only run:
  - Log: `.runtime-logs\kaggle_strategy_gateway_only_20260618161404.json`
  - Result: `provider_error`.
  - Provider returned `Insufficient Balance` before any tool step, so final loop-suppression behavior could not be real-LLM validated in that run.

## Validation

- `node --check scripts\mcp-ailis-research-server.cjs`: passed.
- `node --check electron\ailis-agent-runner.cjs`: passed.
- `node --check electron\ailis-runtime-budget.cjs electron\ailis-tool-routing.cjs electron\ailis-turn-items.cjs`: passed in earlier validation.
- `node --test tests\ailis-tool-layer.test.mjs`: passed 15/15.
- `node --test tests\ailis-turn-items.test.mjs`: passed 5/5.

## Important Constraints

- Do not reveal or store API keys. Desktop LLM config was read from `%APPDATA%\AILIS\desktop-state.json` only for local execution and logs redacted the key.
- Worktree has many pre-existing rename/runtime changes. Do not reset or revert unrelated files.
- Commit only the files directly involved in this tool-chain fix unless the user explicitly requests the broad rename commit.

## Next Useful Checks

1. Once LLM provider balance/config is restored, rerun the Gateway-only Kaggle task and verify:
   - No empty args.
   - After a successful `tool_search`, the next step uses exposed `web_search`/`web_fetch` instead of another `tool_search`.
   - After 2 consecutive `update_plan`, `update_plan` disappears from native direct tools for the next turn.
   - The run ends with final/blocked instead of `max_steps_reached`.
2. Consider adding a real OCR/page-text fallback if the app needs to identify current browser game/competition when vision provider does not support image input.
