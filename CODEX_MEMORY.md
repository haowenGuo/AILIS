# Codex Memory Checkpoint

Date/time: 2026-09-01 Asia/Shanghai
Workspace: `F:\AILIS\main`
Branch before submission: `codex/taskagent-cost-projection`
Base HEAD: `08761b73c75e05f88f62be8a02569b42cb235355`

## Current objective

- Submit and deploy the latest AILIS mainline changes.
- Re-run the same three official Terminal-Bench 2.1 tasks for a comparable regression result:
  `cancel-async-tasks`, `fix-git`, and `write-compressor`.
- Model and effort remain `gpt-5.6-luna` / `max`, serial execution, official verifiers.

## Included implementation

- TaskAgent uses the native Codex instruction snapshot through
  `electron/codex-native-instructions.cjs`.
- Context history follows an append-only Codex-style model: one original user turn followed
  by model decisions, tool calls, and tool outputs, without duplicated request wrappers.
- Default TaskAgent tools are aligned to the real runtime surface:
  `exec_command`, `write_stdin`, `apply_patch`, `update_plan`, and `tool_search`.
- Optional web, vision, goal, and permission tools are exposed only when the request or
  runtime state requires them. Legacy collaboration tools are hidden.
- `apply_patch` uses a native free-form/custom tool call. `update_plan` is explicitly a
  progress-board operation and returns a compact UI-only observation.
- Screen capture can be invoked by Persona or TaskAgent and routes image pixels through a
  configured multimodal model without automatic per-turn capture.
- Avatar lip-sync amplitude and web presentation behavior include the current UX tuning.

## Verification before submission

- Focused system TaskAgent harness: 18/18 passed.
- Full relevant regression selection: 305 tests, 300 passed, 4 skipped, 0 failed after
  updating one stale assertion for the new on-demand `task_goal` surface.
- Temporary `.tmp-codex-luna-desktop.*.log` files are local diagnostics and must not be
  committed.

## Latest comparable benchmark

- Report: `longrun/jobs/ailis-codex-tools-p0p1-terminal3-luna-max-20260831-v4/final-analysis.md`
- Result: 2/3.
- `cancel-async-tasks`: passed.
- `fix-git`: passed and terminated cleanly.
- `write-compressor`: failed (2/3 verifier tests; decompressor segfault/timeout).

## Next actions

1. Build, commit, fast-forward `origin/main`, and deploy the web build.
2. Launch a fresh three-task job from the committed source using the same immutable task set.
3. Compare score, termination, model calls, prompt/cache telemetry, and failure cause with v4.
