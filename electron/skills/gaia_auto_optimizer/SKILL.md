---
id: gaia_auto_optimizer
label: GAIA Auto Optimizer
description: Use GAIA/GIAI tasks as the continuous self-evolution benchmark for AILIS; run one task per iteration, extract the execution chain, classify success/failure, and prefer generalized Tools/MCP fixes before Agent/Harness fixes.
when: 用户要求基于 GAIA/GIAI 自动迭代优化、持续提升 AILIS 任务执行能力、分析任务链路、降低 LOOP 轮次、修复 Tools/MCP/Agent/Harness 瓶颈时。
tools:
  - self_evolution
  - tool_search
  - mcp_bridge
triggers:
  - GAIA
  - GIAI
  - 自动优化
  - 自动迭代
  - 执行链路
---
# GAIA Auto Optimizer

This skill defines the default optimization policy for AILIS self-evolution work driven by GAIA/GIAI tasks.

## Core Policy

- Run exactly one GAIA/GIAI task per optimization iteration unless the user explicitly asks for a batch.
- After every task, extract the execution chain before changing code: prompt, tool discovery, tool calls, MCP calls, observations, loop guards, finalization, answer gate, score/verdict.
- If the task succeeds, optimize efficiency: reduce loop count, remove redundant tool calls, improve per-turn evidence use, and keep the exact-answer path reliable.
- If the task fails, mark it as a priority repair item and classify the bottleneck before patching.
- Prefer generalized fixes. Do not hard-code task IDs, answers, URLs, names, or one-off heuristics.
- Optimize Tools and MCP first. Modify Agent or Harness only when the chain shows a general orchestration, stopping, schema, finalization, or evaluation issue.
- Every repair must include a regression test or replay artifact that protects the generalized capability.

## Failure Classification

Use these classes before repair:

- `tools_mcp`: parser, fetcher, document reader, spreadsheet reader, PDF/audio/image/tool schema, MCP registration, or tool result contract issue.
- `web_retrieval_mcp`: web_search/web_fetch ranking, extraction, JS shell, anti-bot, content quality, or source-followup issue.
- `agent_architecture`: wrong tool choice, failure to stop after ready evidence, repeated loops, tool_search misuse, or ignoring recovery hints.
- `harness_finalization`: answer gate, exact-answer extraction, scorer integration, transcript linkage, or artifact provenance issue.
- `environment`: missing credentials, missing dataset, network, local service unavailable, rate limit, process timeout.
- `model_reasoning`: evidence was sufficient and accessible, but the model reasoned incorrectly.

## Repair Order

1. Reproduce or replay the failing task with durable artifacts.
2. Extract the chain and label the first irreversible wrong turn.
3. Patch the smallest generalized layer.
4. Run focused tests for that layer.
5. Re-run the same GAIA/GIAI task.
6. If it succeeds, measure loop count and redundant calls; optimize efficiency only if it will not reduce reliability.
7. Move to the next queued task only after recording the verdict and repair notes.

## Long-Run Artifacts

Use `longrun/jobs/ailis-gaia-auto-optimizer/` as the durable job root unless the user chooses another path. Required files:

- `mission.md`: optimization objective.
- `acceptance.md`: completion criteria.
- `loop-policy.json`: iteration, retry, source, and stop policy.
- `event-log.jsonl`: append-only history.
- `progress.json`: heartbeat/projector status.
- `iterations/iter-*/chain.json`: extracted execution chain.
- `iterations/iter-*/verdict.json`: pass/fail, failure class, next action.
- `iterations/iter-*/repair-ticket.md`: generalized repair request when needed.

Never store secrets in these artifacts.
