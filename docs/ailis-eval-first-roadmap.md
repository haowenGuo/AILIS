# AILIS Eval-First Roadmap

Date: 2026-06-24

## Decision

AILIS should postpone heavy sandbox and enterprise-grade boundary-control work for now. The next priority is evaluation.

The reason is simple: without strong evals, it is easy to add architecture that feels responsible but does not prove the assistant is becoming smarter, more useful, or more alive. AILIS should first build a repeatable way to answer these questions:

- Does AILIS feel like the same character over time?
- Does AILIS remember and use context well?
- Can AILIS execute real tasks through tools?
- Does AILIS recover when tools fail?
- Which benchmark scores are credible enough to show publicly?
- Which failures are product blockers rather than just engineering noise?

Sandbox work is still important, but for now it should stay as a minimal safety baseline:

- Never commit secrets.
- Do not silently perform irreversible external actions.
- Keep tool calls auditable.
- Keep local write actions scoped enough for development.

## Evaluation Philosophy

AILIS should not be evaluated like a generic chatbot only. It has two product identities:

1. **Humanlike Companion**: character consistency, naturalness, memory, emotion fit, relationship continuity, low tool feeling, voice and multimodal fit.
2. **Task Execution Agent**: planning, tool use, file/code work, process control, desktop capability, recovery, evidence, and benchmark task success.

The evaluation stack should keep these separate, then combine them into a single release scorecard.

## Current Snapshot

Commands run on 2026-06-24:

```powershell
pnpm eval:ailis-humanlike:validate
pnpm eval:ailis-humanlike:report
pnpm test:ailis-humanlike-eval
pnpm ailis:benchmark-execution
pnpm ailis:smoke-agent
pnpm ailis:smoke-gateway
pnpm bench:swebench-lite:selftest
pnpm test:ailis-agent
pnpm bench:osworld:readiness
pnpm ailis:validate-harness
pnpm openclaw:validate-tools
```

Observed results:

| Area | Command | Result |
| --- | --- | --- |
| Humanlike dataset structure | `pnpm eval:ailis-humanlike:validate` | Passed, 1000 scenarios valid |
| Humanlike coverage | `pnpm eval:ailis-humanlike:report` | Passed, 1000 scenarios, 251 negative probes, issueCount 0 |
| Humanlike unit tests | `pnpm test:ailis-humanlike-eval` | Passed, 12 / 12 |
| Local execution benchmark | `pnpm ailis:benchmark-execution` | Passed; code repair, process session, safety gates, 17 audit entries, 36 transcript items |
| Agent smoke | `pnpm ailis:smoke-agent` | Passed |
| Gateway smoke | `pnpm ailis:smoke-gateway` | Passed |
| SWE-bench tiny selftest | `pnpm bench:swebench-lite:selftest` | Passed, 1 / 1 verified |
| Agent runner tests | `pnpm test:ailis-agent` | Passed, 4 / 4 |
| Harness validation | `pnpm ailis:validate-harness` | Passed, 27 contracts, 12 skills, 16 checked tools |
| OSWorld readiness | `pnpm bench:osworld:readiness` | Script ran, but official run not ready |
| OpenClaw tool surface validation | `pnpm openclaw:validate-tools` | Failed due to missing upstream reference catalog |

OSWorld blockers:

- `build-cache/OSWorld` is missing.
- OSWorld Python dependencies are not installed in the active Windows Python or WSL Python environment.

OpenClaw validation blocker:

```text
missing upstream tool catalog:
F:\AILIS_self_evolution_runtime\AILISClaw\.refs\openclaw-main\src\agents\tool-catalog.ts
```

This should be treated as an alignment environment gap, not as proof that AILIS task execution is broken.

## Eval Tracks

### Track 1: Humanlike Companion Eval

Goal: prove AILIS feels like a consistent long-term assistant, not a generic assistant skin.

Primary commands:

```powershell
pnpm eval:ailis-humanlike:validate
pnpm eval:ailis-humanlike:report
pnpm test:ailis-humanlike-eval
pnpm eval:ailis-humanlike:longitudinal-agent:smoke
```

Core metrics:

- `persona_consistency`
- `naturalness`
- `memory_usefulness`
- `emotional_fit`
- `multimodal_sync`
- `low_tool_feeling`
- `relationship_stage_fit`
- `task_completion`

Near-term target:

- Keep 1000 / 1000 scenario validation passing.
- Keep issueCount at 0.
- Run longitudinal smoke regularly.
- Track failures by category, not just average score.

### Track 2: Task Execution Eval

Goal: prove AILIS can actually do work through tools.

Primary commands:

```powershell
pnpm ailis:benchmark-execution
pnpm ailis:smoke-agent
pnpm ailis:smoke-gateway
pnpm ailis:validate-harness
pnpm test:ailis-agent
```

Core evidence:

- Tool calls produce transcript items.
- Mutating operations leave audit evidence.
- Code repair can move from failing test to passing test.
- Long-running process sessions can start, read, write, and exit.
- Approval-required actions are correctly surfaced.

Near-term target:

- Keep all local execution smoke tests green.
- Add a stable JSON summary output that can be shown as a release artifact.
- Separate "blocked by missing external benchmark environment" from "runtime failed".

### Track 3: Public Benchmark Eval

Goal: get credible external comparison points without overstating them.

Priority order:

1. GAIA Level 1 / Level 1 Lite
2. SWE-bench Lite selftest and then real small subset
3. OSWorld readiness and then `test_small`
4. AgentBench local tasks
5. TerminalBench or WebArena later if they match the product direction

Current best public-facing GAIA note from the existing scorecard:

```text
GAIA Level 1 Lite public subset:
20 questions
submitted score: 60% = 12 / 20
completed locally: 19 / 20
```

This can be shown, but must be labeled as a Level 1 Lite public subset, not an official full GAIA leaderboard claim.

### Track 4: Regression Gate

Goal: make every release answer one question: did AILIS get better or worse?

Recommended lightweight release gate:

```powershell
pnpm eval:ailis-humanlike:validate
pnpm eval:ailis-humanlike:report
pnpm test:ailis-humanlike-eval
pnpm ailis:benchmark-execution
pnpm ailis:smoke-agent
pnpm ailis:smoke-gateway
pnpm ailis:validate-harness
pnpm bench:swebench-lite:selftest
```

Optional heavier gate:

```powershell
pnpm eval:ailis-humanlike:longitudinal-agent:smoke
pnpm bench:gaia:official:l1
pnpm bench:osworld:readiness
```

Do not include OSWorld official runs in the default gate until OSWorld dependencies are installed and stable.

## What To Build Next

### P0: Unified Eval Report

Create a single report generator that collects:

- Humanlike validation summary.
- Humanlike coverage summary.
- Local execution benchmark summary.
- Agent/gateway smoke summary.
- SWE-bench selftest summary.
- OSWorld readiness status.
- Known blockers.

Suggested output:

```text
eval-results/ailis-release-scorecard/latest.summary.json
eval-results/ailis-release-scorecard/latest.report.md
```

This gives AILIS a release dashboard without needing a heavy web UI.

### P1: Failure Taxonomy

Every failed eval should land in one of these buckets:

- Model reasoning failure.
- Tool contract failure.
- Runtime integration failure.
- Missing environment dependency.
- Memory/persona failure.
- Multimodal sync failure.
- Benchmark harness failure.
- External service or credential failure.

This matters more than a single average score. AILIS needs to know what kind of intelligence is failing.

### P2: Longitudinal Eval Sampling

The 30-day companion benchmark is valuable but heavy. Add a stable sampled mode:

- 1 day smoke
- 3 day smoke
- 30 day critical checkpoints
- full 30 day run

This makes long-term memory and personality regressions easier to run often.

### P3: Public Benchmark Environment Setup

Before improving scores, make the environment reliable:

- Clone OSWorld into `build-cache/OSWorld`.
- Install OSWorld dependencies in WSL or a dedicated Python environment.
- Restore or vendor the OpenClaw upstream reference catalog used by `openclaw:validate-tools`.
- Keep GAIA dataset access and cache paths documented.

## What Not To Do Yet

Do not spend the next phase building:

- A heavy enterprise sandbox.
- A complex permission matrix.
- A commercial account and payment system.
- A large multi-user backend.
- A polished benchmark website before the score pipeline is stable.

These can come later. For now, the highest leverage work is to make AILIS measurable.

## Definition Of Progress

AILIS is improving when:

- Humanlike eval scores rise without increasing hard failures.
- Longitudinal memory failures decrease.
- Task execution evals keep passing across releases.
- Public benchmark runs become reproducible.
- Failures are classified clearly enough to generate the next engineering task.
- The assistant feels less like a tool wrapper while becoming better at real work.
