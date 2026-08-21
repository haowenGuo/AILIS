# AILIS Evaluation

[Documentation](README.md) · [简体中文](evaluation.zh-CN.md) · [Full Scorecard](ailis-evaluation-master-scorecard-20260817.md)

AILIS is evaluated as an end-to-end Agent system: the model, Harness, context, memory, tools, environment, and verifier all participate in the result.

## Agent Benchmarks

| Benchmark | AILIS | Codex, same model |
| :--- | ---: | ---: |
| **GAIA public validation** | **119 / 165 · 72.12%** | 107 / 165 · 64.85% |
| **Terminal-Bench 2.1** | 60 / 89 · 67.42% | **75.73% ± 1.32%** |

GAIA uses the same 165 task IDs, Luna medium, complete visible answers, and one semantic scorer for both systems. Terminal-Bench uses Luna Max on the same 89 tasks; AILIS is one complete pass@1 run and the official Codex result aggregates five runs.

### GAIA By Level

| Level | AILIS + Luna | Codex + Luna | Difference |
| :--- | ---: | ---: | ---: |
| L1 | **43 / 53 · 81.13%** | 41 / 53 · 77.36% | +3.77 pp |
| L2 | **64 / 86 · 74.42%** | 57 / 86 · 66.28% | +8.14 pp |
| L3 | **12 / 26 · 46.15%** | 9 / 26 · 34.62% | +11.54 pp |
| **Total** | **119 / 165 · 72.12%** | 107 / 165 · 64.85% | **+7.27 pp** |

### Agent Efficiency

| GAIA, 165 tasks | AILIS + Luna | Codex + Luna |
| :--- | ---: | ---: |
| Logical input / output tokens | **31.04M / 330.7K** | 68.56M / 497.0K |
| Average task time | **210.4s** | 255.9s |
| P50 / P95 task time | **140.1s / 575.0s** | 229.3s / 584.7s |
| Tool events | 3,628 | **1,959** |

| Terminal-Bench, 89 tasks | AILIS A7 | Official Codex + Luna Max |
| :--- | ---: | ---: |
| Score | 67.42% | **75.73% ± 1.32%** |
| Average trial time | 1,088.0s | **457.3s** |
| Logical input per task | **2.569M** | 3.183M |
| Cached input per task | 1.270M | **3.093M** |
| Uncached input per task | 1.299M | **89.9K** |
| Input cache rate | 49.44% | **97.17%** |
| Output per task | 23.95K | 23.89K |

AILIS reaches the same general task-execution band while using fewer logical input tokens on both suites. The largest measured efficiency gap is stable-prefix reuse: Terminal-Bench uncached input remains 14.44 times Codex's, which also corresponds to longer trials and more timeout pressure.

## Memory And Stateful Work

| Evaluation | Result |
| :--- | ---: |
| **Apple ToolSandbox** | **71.51%** frozen holdout mean |
| **LongMemEval-S** | **358 / 500 · 71.60%** QA accuracy |
| **PersonaMem Balanced-140** | **92 / 140 · 65.71%** |
| **LoCoMo** | **24.69 token-F1** |

LongMemEval-S completed all 500 items with zero generation or Judge failures. LoCoMo completed all 1,986 items; its strong retrieval but lower answer F1 identifies multi-hop evidence composition as the remaining memory bottleneck.

## Evidence

- [Complete scorecard and protocol details](ailis-evaluation-master-scorecard-20260817.md)
- [TaskAgent A7 context baseline](ailis-a7-taskagent-context-baseline.md)
- [GAIA evaluation method](ailis-desktop-real-gaia-eval.md)
- [Memory retrieval baseline](ailis-memory-bm25-mmr-baseline.md)
- [Official Codex Terminal-Bench row](https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/6/leaderboards/main/rows/e5f3feda-4629-46ba-963f-300dcf7c2a4c)

GAIA is public-validation evaluation rather than a private-test leaderboard submission. Different benchmark metrics are reported separately rather than merged into a synthetic overall score.
