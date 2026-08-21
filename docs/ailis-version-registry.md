# AILIS Version And Evidence Registry

Last updated: 2026-08-21

[Documentation](README.md) · [Evaluation](evaluation.md) · [GitHub Releases](https://github.com/haowenGuo/AILIS/releases)

AILIS tracks product releases, accepted runtime mechanisms, and benchmark runs separately. A newer product commit does not automatically inherit a historical benchmark score.

## Current Product

| Field | Current value |
| --- | --- |
| Package version | `1.4.0` |
| Development branch | `main` / `origin/main` |
| Latest tagged release candidate | `v1.4.0-rc.2` at `df9e962` |
| Current TaskAgent context mechanism | A7 canonical tool-history retention and late compaction |
| A7 mainline integration | `8675ef8` |
| Frozen A7 Terminal-Bench source | `e3c7e7d` |

Commits after the A7 integration include product, release, documentation, and runtime changes. They remain `v1.4.0` product development unless a new named Harness baseline is explicitly promoted through a fixed evaluation gate.

## Version Types

| Type | Example | Meaning |
| --- | --- | --- |
| Product version | `v1.4.0-rc.2` | A tagged desktop build |
| Runtime mechanism | `TaskAgent A7` | An accepted general Harness behavior |
| Evaluation source | `e3c7e7d` | The immutable source snapshot used by a score |
| Experiment | `GAIA A6`, `TB A7` | One source, task set, model, tool surface, and protocol |

## Published Evidence

| Benchmark | Result | Evidence owner |
| --- | ---: | --- |
| GAIA public validation | `119 / 165 · 72.12%` semantic | frozen A6 answer set at `085e17d` |
| Terminal-Bench 2.1 | `60 / 89 · 67.42%` pass@1 | A7 evaluation source `e3c7e7d` |
| Apple ToolSandbox | `71.51%` frozen holdout mean | frozen 239-scenario production-Agent run |
| LongMemEval-S | `358 / 500 · 71.60%` | BM25/MMR memory baseline run |
| LoCoMo | `24.69` token-F1 | BM25/MMR memory baseline run |

The complete protocols, resource metrics, and Codex comparisons are collected in [AILIS Evaluation](evaluation.md) and the [full scorecard](ailis-evaluation-master-scorecard-20260817.md).

## Release History

| Release | Commit | Date |
| --- | --- | --- |
| `v1.4.0-rc.2` | `df9e962` | 2026-08-17 |
| `v1.4.0-rc.1` | `45dd6ae` | 2026-08-17 |
| `v1.3.0` | `0837fd1` | 2026-08-05 |
| `v1.2.0` | `6c17d3c` | 2026-07-20 |
| `v1.1.0` | `cbc264e` | 2026-07-07 |
| `v1.0.7` | `67a6b81` | 2026-06-30 |

Older tags remain available in Git history and on the Releases page.

## Score Identity

A benchmark score belongs to the complete tuple below:

```text
source commit
+ dataset and task-set hash
+ model and reasoning effort
+ prompt and context profile
+ tool-surface hash
+ timeout and retry policy
+ scorer or verifier
+ run IDs
```

Changing any member creates a new score identity. Documentation-only changes may cite an existing score with its original evidence owner; runtime changes require a new fixed-source run before receiving that score.

## Promotion Rules

1. Change one general mechanism per candidate.
2. Keep diagnostics and infrastructure-invalid attempts outside formal scores.
3. Require zero deterministic regressions on stable controls.
4. Require failure-side improvement before a full run.
5. Record latency, token, cache, timeout, and tool metrics with correctness.
6. Promote a product baseline only after complete fixed-source evaluation.
7. Never attach a source-run score to a later runtime commit without rerunning it.

The machine-readable engineering registry remains at [`evals/benchmark-catalog/ailis-version-registry.json`](../evals/benchmark-catalog/ailis-version-registry.json).
