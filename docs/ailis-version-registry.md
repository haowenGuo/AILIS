# AILIS Version Registry

Last updated: 2026-08-17

## 1. Current Decision

The accepted product development parent is:

| Field | Value |
| --- | --- |
| Name | `A7-main` |
| Product commit | `fbf2454dbf32562d995b221386ce95d996b9fcb9` |
| Branch | `main` / `origin/main` |
| Accepted mechanism | A7 canonical tool-history retention and late compaction |
| Frozen Terminal evaluation source | `e3c7e7d93767df8978487b84f4219119d39726e5` |
| Mainline mechanism integration | `8675ef81d7aae0b54fc46df6fb341361508ca3c0` |
| Product-commit score | Not yet rerun as a complete fixed-source benchmark |

`fbf2454` is accepted because it carries the best current balance of behavior,
quality, cost, and context transparency. It does **not** inherit the score of
every ancestor or frozen evaluation snapshot. The Terminal-Bench `60/89`
belongs to `e3c7e7d`; the GAIA semantic `119/165` belongs to the frozen A6
answer set at `085e17d` under the shared scorer.

The current dirty working tree is an unscored candidate. It contains a large
Agent Loop extraction and unrelated benchmark/rendering changes. It is not
`A8`, is not a new baseline, and must not be mixed into claims about A7.

## 2. Four Different Kinds of Version

AILIS previously mixed four identifiers. They are now separate:

| Kind | Example | Meaning |
| --- | --- | --- |
| Product release | `v1.3.0` | Shipped desktop product tag |
| Product baseline | `A7-main@fbf2454` | Accepted parent for subsequent development |
| Mechanism baseline | `TaskAgent-A7` | A reusable Harness mechanism with frozen evidence |
| Experiment/run | `GAIA-P1`, `TB-A7`, a concrete run ID | A source commit under one immutable protocol |

A score is identified by this tuple:

```text
source commit
+ dataset commit or manifest hash
+ task-set hash
+ model and reasoning effort
+ prompt profile
+ tool-surface hash
+ timeout/retry policy
+ scorer or verifier
+ exact run IDs
```

Changing any member creates a new score identity. A descendant commit receives
no score until it is run under a fixed protocol.

## 3. Product Releases

SemVer tags describe shipped products, not benchmark candidates:

| Release | Commit | Date |
| --- | --- | --- |
| `v1.0.1` | `117dc58` | 2026-04-13 |
| `v1.0.2` | `c9052f4` | 2026-04-18 |
| `v1.0.3` | `8d2ab35` | 2026-04-18 |
| `v1.0.4` | `30a0bea` | 2026-06-15 |
| `v1.0.5` | `633e599` | 2026-06-22 |
| `v1.0.6` | `34a6368` | 2026-06-23 |
| `v1.0.7` | `67a6b81` | 2026-06-30 |
| `v1.1.0` | `cbc264e` | 2026-07-07 |
| `v1.2.0` | `6c17d3c` | 2026-07-20 |
| `v1.3.0` | `0837fd1` | 2026-08-05 |

## 4. GAIA P-Series

The P-series is a mechanism history, not a monotonic release sequence.

| Name | Commit | Main change | Best valid evidence | Decision |
| --- | --- | --- | --- | --- |
| Frozen | `6afc0ae` | Isolated GAIA runner | L1 `41,43/53`, mean 79.25% | Reference |
| P0 | `8ebc1e5` | Windows path/attachment correctness | L1 `47,50/53`, mean 91.51% | PASS |
| P1 | `7ba2cf7` | Evidence navigation and answer preservation | L1 mean 90.57%; mini20 `14/20`; strict full165 `105` | Quality reference; L1 gate FAIL |
| P1.1 | `e135213` | Bounded recovery/entity lookup | L1 mean 82.08%; mini20 `10/20` | Global regression |
| P1.2 | `35b6f8b` | Concise retry/data-plane attempt | `13/15` before early stop | Control regressions |
| P2 | `7f94302` | Shadow journal/replay | mini20 `11/20` | Diagnostic only |
| P3 | `aebd722` | Canonical context plus 20-round behavior change | Failure side improved | Rejected mixed variables |
| P3.1 | `95f8d84` | Canonical finalization, old boundary retained | L2/L3 `69,64/112` | Positive signal, incomplete gate |
| P4 | `504d014` | Replay loadable tools | mini20 `9/20` | Rejected |
| P5 | `5941d0a` | Loaded tools as native contracts | mini20 `12/20` | Failure side not fixed |
| P6 | `cb6076a` | Native schema tool calls | mini20 `13/20` | Diagnostic only |
| P7 | `174c98b` | Preserve reasoning summaries | mini20 `11/20` | Rejected |
| P8 | `9e7b893` | Clarify exec/network affordances | mini20 `12/20` | Rejected |
| P9 | `9067a50` | Stable long-tail tool loading | mini20 `9/20` | Resource relation still missing |
| P10 | `c0d24be` | Preserve viewport link refs | mini20 `10/20` | One local fix; global failure remains |

The important lesson is that P0 succeeded because it repaired a narrow runtime
capability without changing successful reasoning paths. P1-P10 repeatedly
showed that a locally plausible Harness change can alter tool choice, evidence
visibility, answer selection, or round distribution and regress the global set.

## 5. Post-P Experiments

| Name | Commit | Evidence | Decision |
| --- | --- | --- | --- |
| A1 native transport | `a4baea3` | `96/165`, ~15.00M tokens, 542.9s mean | Rejected |
| Batched web | `de756a4` | `102/165`, 165 answers, 13.92M, 150.0s | Efficiency reference |
| A4 | `b6f6dc0` | conservative `106/165`, 164 answers, 13.43M, 113.7s | L2 signal, global gate FAIL |
| A5 | `63d44a6` | `97/165`, 14.94M, 155.7s | Final-context regression |
| GAIA-A6 | `085e17d` | exact `102/165`; semantic `119/165`; Luna medium | Frozen GAIA evidence |
| Terminal-A7 | `e3c7e7d` | `60/89`; Luna Max | Accepted context mechanism, one pass only |
| A8 Codex prompt | `208e4a0` | focused `1/3` | Prompt-only hypothesis rejected |

GAIA's A6 and Terminal's A7 are different experiment lines. The name A7 is
reserved for the accepted context mechanism; it is not evidence that every
product surface at `fbf2454` was evaluated by the Terminal run.

## 6. Current Comparable Evidence

| Benchmark | AILIS | Same-model Codex | Boundary |
| --- | ---: | ---: | --- |
| GAIA public validation, Luna medium, same semantic scorer | **119/165, 72.12%** | 107/165, 64.85% | Complete local public validation |
| Terminal-Bench 2.1, Luna Max | 60/89, 67.42% | **75.73% +/- 1.32%** | AILIS one pass; Codex five-pass aggregate |
| OSWorld | 9/15, 60.00% | Not in this registry | Partial, not headline |
| SWE-bench Pro | 6/11, 54.55% | Not in this registry | Fixed smoke subset |

These rows must not be averaged. They measure different systems, task sets,
budgets, and metrics.

## 7. Naming and Promotion Rules

1. Create candidates from `A7-main@fbf2454`, never from an arbitrary dirty
   worktree.
2. Use one mechanism per candidate: `A7-R1-cache`, `A7-R2-projector`, etc.
3. Record the complete score identity before the first live task.
4. Keep diagnostics, infrastructure-invalid attempts, partial runs, and formal
   scores in separate directories and fields.
5. Failure-side correctness is necessary but not sufficient. A candidate stops
   on any stable-control regression.
6. A mechanism may be accepted after bilateral focused evidence; a product
   baseline requires a complete fixed-source run; a release-stability claim
   requires two complete paired runs.
7. Never attach a source-run score to a minimal integration or later README
   commit without rerunning it.

The machine-readable source of truth is
[`../evals/benchmark-catalog/ailis-version-registry.json`](../evals/benchmark-catalog/ailis-version-registry.json).
