# AILIS Evaluation Scorecard

[Manual](README.md) · [简体中文](evaluation.zh-CN.md) · [Per-task index and exact statistics](evaluation/20260907-snapshot.json)

Updated **2026-09-07**. Capabilities are rows; systems and model settings are columns. AILIS is highlighted and bold marks the highest reported score per row. Luna means gpt-5.6-luna throughout. These are existing frozen-run results—**not an equal-budget ranking or certification of the current GitHub source or installer**.

## Task execution

![AILIS and Codex task-execution scorecard](assets/benchmarks/ailis-evaluation-20260907.en.svg)

**[1] Coding:** Terminal-Bench has 65 passes, 22 valid failures and 2 infrastructure-unresolved tasks out of 89 planned. The valid-sample score is **65 / 87 = 74.71%**; confirmed passes over the planned suite are a lower bound of **65 / 89 = 73.03%**. The archived Codex submission covers **89 tasks**, evaluated five times each, with a mean pass rate of **75.73% ± 1.32% standard error**.

**[2] General tasks:** GAIA has 122 completed tasks and 43 infrastructure-interrupted tasks out of 165 planned. UUIDs, questions, references and levels were matched across systems. AILIS uses Luna Max / 3000s; Codex references use Medium / 600s. **77.05% is the reviewed completed-subset score, not a full-165 result.**

<details>
<summary>Copyable text scorecard</summary>

| Capability / Benchmark | AILIS<br>Luna Max | Codex<br>Luna Max | Codex<br>Luna Medium | Codex<br>GPT-5.5 Medium |
| :--- | ---: | ---: | ---: | ---: |
| **Coding** | | | | |
| **Agentic terminal coding**<br>Terminal-Bench 2.1 [1] | 74.71<br><sub>65 / 87</sub> | **75.73**<br><sub>89 tasks · 5-trial mean · ± 1.32 SE</sub> | — | — |
| **Agent** | | | | |
| **General-purpose tasks**<br>GAIA · Overall [2] | 77.05<br><sub>94 / 122</sub> | — | 67.21<br><sub>82 / 122</sub> | **79.51**<br><sub>97 / 122</sub> |

Scores are percentages; the second line gives sample counts and the evaluation basis. Codex Terminal-Bench covers 89 tasks with five trials per task, not a single 89-task attempt. — means unavailable evidence, not zero.

</details>

### GAIA: automatic scoring versus answer review

| Scoring basis · same 122 tasks | AILIS<br>Luna Max | Codex<br>Luna Medium | Codex<br>GPT-5.5 Medium |
| :--- | ---: | ---: | ---: |
| Reviewed clear matches | 77.05%<br>94 / 122 | 67.21%<br>82 / 122 | **79.51%**<br>97 / 122 |
| Automatic matching only | 62.30%<br>76 / 122 | 66.39%<br>81 / 122 | **78.69%**<br>96 / 122 |
| Separate equivalent answers, excluded from headline | 1 | 0 | 1 |
| Reasoning | Max | Medium | Medium |
| Configured task timeout | 3000s | 600s | 600s |
| Concurrency | 10 | 4 | Historical batches / recovery |

The primary scorecard uses reviewed clear matches, not a mixture of automated and reviewed scores. Review locates the requested answer in saved responses; it generates no new answers. AILIS also has one format-equivalent answer, 24 mismatches and three ambiguous answers, none added to the 94. GPT-5.5 has one separate semantic equivalent.

## Execution efficiency

**Scores, model calls, tokens, caching and latency remain separate metrics.** Weighted cache rate is `sum(cached input) / sum(input)`, not an average of task percentages or a theoretical reusable-prefix ratio. M means 1,000,000 tokens; display values are rounded, with exact integers in the [JSON snapshot](evaluation/20260907-snapshot.json).

### Terminal-Bench 2.1

| Metric | AILIS<br>Luna Max | Official Codex archive<br>Luna Max |
| :--- | ---: | ---: |
| Resource scope | 89 currently selected attempts | 445 trials ÷ 5, equivalent to 89 |
| Input tokens (M) | **266.94** | 283.32 |
| Cached input (M) | **255.69** | 275.31 |
| Uncached input (M) | **11.24** | 8.00 |
| Output tokens (M) | **2.344** | 2.126 |
| Weighted input cache rate | **95.79%** | 97.17% |
| Inner model requests | **3,976** | — |
| Mean end-to-end trial time | **1,581.5s** | 457.3s |
| Recorded cost, 89-trial equivalent | **—** | $48.29 |

Bold highlights AILIS in the efficiency tables, not the best result. AILIS includes spent resources on the two unresolved tasks, but not every discarded attempt. Dividing Codex totals by five is equal-volume normalization, not selecting its best run. Both times use trial start-to-finish; hardware, concurrency, budgets, setup/verifier work and infrastructure differ. The observed 3.46× latency ratio does not isolate Harness overhead.

Codex's archived cost field totals $241.45 for 445 trials; it is not an audited invoice. AILIS lacks corresponding billing records and historical settlement prices, so its monetary cost remains unavailable rather than invented from token totals.

### GAIA · same 122 tasks

| Metric | AILIS<br>Luna Max | Codex<br>Luna Medium | Codex<br>GPT-5.5 Medium |
| :--- | ---: | ---: | ---: |
| Input tokens (M) | **115.02** | 41.02 | 6.79 |
| Output tokens (M) | **0.727** | 0.321 | 0.131 |
| Weighted input cache rate | **89.67%** | 87.46% | 60.98% |
| Usage coverage | **122 / 122** | 121 / 122 | 117 / 122 |
| Inner model decisions | **2,044** | — | — |
| Mean seconds / task | **336.6** | 219.5 | 179.9 |
| Median seconds / task | **172.1** | 171.1 | 133.3 |

Missing usage is not zero spend. Codex CLI whole-turn completion events are not individual model decisions, so those call counts remain unavailable. Thirteen AILIS clear matches took more than 600s; equal-budget scores cannot be inferred. All 252 saved AILIS attempts record 4,446 calls, with usage present for 244 / 252 attempts. Resources for the selected 122 attempts are not total recovery spend.

## Harness changes: matched-task comparison

The September 3 pre-fix batch and September 4 output-integrity batch share **84 valid tasks** after validity review on both sides. This is an AILIS version comparison, not a Codex comparison.

| Metric · same 84 tasks | After output fix | Before output fix |
| :--- | ---: | ---: |
| Pass rate | **75.00%** | 59.52% |
| Passes | **63 / 84** | 50 / 84 |
| Model requests | **3,854** | 4,816 |
| Outcome changes | **17 improvements, 4 regressions** | Net gain of 13 passes |

Model requests decreased about 20%, but input tokens increased about 32% and total Agent time decreased only about 1.9%. Concurrency, timeouts and infrastructure also changed; the entire difference cannot be attributed solely to removing output truncation.

## Memory and stateful tasks · historical baselines

| Capability | Benchmark | AILIS historical score | Metric / sample |
| :--- | :--- | ---: | :--- |
| Stateful tool use | Apple ToolSandbox | **71.51%** | Frozen holdout mean |
| Long-term question answering | LongMemEval-S | **71.60%** | 358 / 500, QA accuracy |
| Personalized memory | PersonaMem Balanced-140 | **65.71%** | 92 / 140 |
| Conversational memory | LoCoMo | **24.69** | token-F1, 1,986 tasks |

These are earlier independent runs, not re-evaluations of the current unified Agent. LoCoMo F1 is not directly rankable against pass rates. Earlier A6 GAIA 119 / 165 (72.12%) and A7 Terminal-Bench 60 / 89 (67.42%) also belong to their own frozen sources and scoring protocols; see the [historical scorecard](https://github.com/haowenGuo/AILIS/blob/659bf61f2b340d2313b3bae386704265c8d2bba2/docs/evaluation.md).

## Protocols and evidence

<details>
<summary>Sources, models, budgets, retries and validity audit</summary>

### Terminal-Bench

- Run: `ailis-terminal89-output-integrity-parallel20-luna-max-20260904-v1`.
- Source: frozen `07c1e85` plus seven output-integrity files; the September 5 connection-repair experiment is excluded.
- Configuration: Luna Max; concurrency 20→10, later recovery at 3/1; outer 3000s with original inner task budgets remaining. Valid outcomes are retained, infrastructure recovery is tracked separately—not a clean same-condition pass@1 comparison with the official submission.
- Original progress remains 65 passes / 23 failures / 1 unresolved. Audit found that `bn-fit-modify` never ran verifier tests because dependency download failed over TLS. It is excluded from the capability denominator; raw rewards were not rewritten and no pass was invented.
- `adaptive-rejection-sampler` has an execution-chain interruption. `video-processing` has both an agent timeout and verifier trouble; its existing timeout-failure policy is retained and disclosed, not silently converted into retry eligibility.
- The Codex archive is 0.144.1 / Luna Max / 89 × 5 trials and includes four reward-hacking disqualifications. AILIS has not received equivalent independent scrutiny.
- The archive is neither 445 locally executed trajectories nor a live leaderboard. Separate local native Codex evidence covers 16 distinct tasks: seven from September and ten valid August tasks, with caffe overlapping. Individual Codex rewards/timings for the remaining 73 tasks are unavailable, not reconstructed.

### GAIA

- Run: `ailis-gaia165-unified-luna-max-20260905-v1`.
- Source: `659bf61` plus frozen unified-agent worktree changes and recorded preflight repairs; neither the bare commit nor certification of the later GitHub consolidation branch.
- AILIS: Luna Max / 3000s / concurrency 10. Native Codex Luna: Medium / 600s / concurrency 4. Native Codex GPT-5.5: Medium / 600s / historical batches and recovery.
- The 122 tasks are a nonrandom completed subset; 43 remain infrastructure-interrupted. UUIDs, questions, references and levels were checked across systems. Saved answers were reviewed against references without independently re-browsing every citation.
- Tool surfaces, reasoning budgets, time limits, dates and environments differ. Score gaps do not directly measure general Agent capability; unresolved tasks are not capability zeros and subset scores must not be extrapolated to the full suite.

</details>

The [machine-readable snapshot](evaluation/20260907-snapshot.json) contains all 89 AILIS task outcomes/resources, 122 three-system answer labels, exact aggregates, relative artifact identifiers and SHA-256 hashes. Raw long logs, attachments and account data remain local. Public hashes do not constitute a complete independently reproducible package.

This update changes presentation only: no evaluation or paid model calls, and no changes to benchmark questions, answers, official verifiers, raw scores or retry eligibility. See [measurement methodology](engineering/measurement.md) for metric definitions.
