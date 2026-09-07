# AILIS Evaluation

[Manual](README.md) · [简体中文](evaluation.zh-CN.md) · [Machine-readable snapshot and task index](evaluation/20260907-snapshot.json)

Updated 2026-09-07 from existing local runs and offline audits. No new evaluation or paid model call was made for this publication. Scores belong to their frozen source, model, tools, timeout and scoring protocol: **they do not automatically certify the current GitHub branch or the v1.4.1 installer**.

## Current audited results

| Benchmark | Verified result | Unresolved scope | Scoring basis |
| --- | --- | --- | --- |
| Terminal-Bench 2.1, 89 planned tasks | **65 / 87 · 74.71%** | 2 infrastructure-invalid tasks | 65 passes, 22 valid failures; official verifier with offline validity audit |
| GAIA public validation, 165 planned tasks | **94 / 122 · 77.05%** | 43 infrastructure-interrupted tasks | Manually reviewed clear matches among completed answers; automatic matching alone: 76 / 122 |

Terminal-Bench has **65 / 89 = 73.03%** confirmed passes across the planned suite, a current lower bound rather than two additional capability failures. GAIA's 122 completed tasks are a nonrandom subset: 77.05% is **not** a full-165 score. Neither suite has valid outcomes for every planned task.

## Terminal-Bench versus Codex

AILIS run: `ailis-terminal89-output-integrity-parallel20-luna-max-20260904-v1`, frozen `07c1e85` plus seven tool-output-integrity files. The separate September 5 connection-repair experiment is excluded.

| Condition | AILIS output-integrity batch | Locally archived official Codex submission |
| --- | --- | --- |
| Model / reasoning | gpt-5.6-luna / Max | gpt-5.6-luna / Max |
| Tasks / repetitions | 89 tasks; valid outcomes retained, infrastructure recovery tracked separately | 89 tasks × 5 trials = 445 trials |
| Score | 65 / 87 = 74.71%; 2 unresolved | 337 / 445 = 75.73% ± 1.32% standard error |
| Agent version | Frozen snapshot above, not all current local changes | Codex 0.144.1 |
| Execution conditions | Concurrency 20→10, later recovery at 3/1; outer 3000s with original inner task budgets remaining | Different date and environment; not a matched-load experiment |

This is an observational comparison, not a single-variable Harness A/B. The Codex aggregate includes four reward-hacking disqualifications as unsuccessful trials; AILIS has not received an equivalent independent audit. The Codex reference is a historical archive, not a newly fetched live leaderboard.

### Resource use and latency

AILIS resources cover 89 currently selected attempts, including the two unresolved tasks, not every discarded/recovery attempt. Codex totals are divided by five to obtain **89-trial-equivalent** resources, not a selected best run.

| Metric | AILIS, selected 89 attempts | Codex, 89-trial equivalent |
| --- | ---: | ---: |
| Input tokens | 266,935,258 | 283,318,157.4 |
| Cached input tokens | 255,692,288 | 275,313,423.4 |
| Uncached input tokens | 11,242,970 | 8,004,734.0 |
| Output tokens | 2,343,869 | 2,125,781.0 |
| Weighted input cache rate | **95.79%** | **97.17%** |
| Mean end-to-end trial time | 1,581.5s | 457.3s |
| Inner model requests | 3,976 | Not provided by the official archive |

Both time values use trial start-to-finish, not worker time versus model-only time. The observed 3.46× difference also reflects machine, concurrency, budgets, setup/verifier work and infrastructure; it does not isolate Harness overhead. High cache rates do not guarantee low latency.

The Codex archive reports a $241.45 cost field for 445 trials, or $48.29 per 89-trial equivalent; this is not an audited invoice. AILIS lacks matching billing records and historical settlement prices, so **no actual dollar cost is claimed**. Missing usage is not zero spend.

### Validity corrections and per-task evidence

- Original progress remains 65 passes / 23 failures / 1 unresolved. Offline review found that `bn-fit-modify` failed to install verifier dependencies over TLS and never ran its tests. The public capability denominator is therefore 87; raw rewards were not rewritten and no pass was invented.
- `adaptive-rejection-sampler` has an infrastructure interruption. `video-processing` has both an agent timeout and verifier trouble; its existing timeout-failure policy is retained and disclosed, not silently converted into retry eligibility.
- Separate local native Codex evidence covers **16 distinct tasks**: seven from September and ten valid August tasks, with `caffe-cifar-10` overlapping. The official 445-trial aggregate does not contain individual rewards or timings. Codex outcomes for the other 73 tasks cannot be reconstructed.
- The [snapshot](evaluation/20260907-snapshot.json) lists all 89 AILIS outcomes, times, model requests and tokens, plus available local Codex samples. Raw tool outputs, account state and attachments are not published.

### Earlier AILIS comparison

After validity review on both sides, the September 3 pre-fix batch and the output-integrity batch share **84 valid tasks**: **50 / 84 (59.52%) → 63 / 84 (75.00%)**. Seventeen tasks improved, four regressed, a net gain of thirteen. Model requests fell from 4,816 to 3,854, while input tokens increased about 32% and total Agent time decreased only about 1.9%. Budgets, concurrency and infrastructure also changed; output truncation is not proven to explain the entire difference.

## GAIA: the same 122 tasks versus local native Codex

AILIS run: `ailis-gaia165-unified-luna-max-20260905-v1`, based on `659bf61` plus frozen unified-agent worktree changes and separately recorded preflight repairs. It is neither bare `659bf61` nor certification of the later GitHub source-consolidation branch. Task UUIDs, questions, reference answers and levels were matched across all three systems for the offline review.

| System | Reviewed clear matches | Automatic matching only | Reasoning / timeout / concurrency |
| --- | ---: | ---: | --- |
| AILIS + Luna | **94 / 122 · 77.05%** | 76 / 122 · 62.30% | Max / 3000s / 10 |
| Native Codex + Luna | 82 / 122 · 67.21% | 81 / 122 · 66.39% | Medium / 600s / 4 |
| Native Codex + GPT-5.5 | 97 / 122 · 79.51% | 96 / 122 · 78.69% | Medium / 600s / historical batches and recovery |

Reviewed matches include manually locating the requested answer in saved responses; no new answer was generated. AILIS also has one separately reported format-equivalent answer, 24 mismatches and three ambiguous answers. GPT-5.5 has one separately reported semantic equivalent. These equivalents are not added to the headline counts. Review compares saved answers with references; it does not independently re-browse every cited source. Thirteen AILIS clear matches took more than 600s, preventing an equal-budget ranking from this table.

| Level | Tasks | AILIS Luna Max | Codex Luna Medium | Codex GPT-5.5 Medium |
| --- | ---: | ---: | ---: | ---: |
| L1 | 47 | 42 / 47 | 37 / 47 | 41 / 47 |
| L2 | 56 | 39 / 56 | 38 / 56 | 40 / 56 |
| L3 | 19 | 13 / 19 | 7 / 19 | 16 / 19 |

| Resources, same 122 tasks | AILIS Luna Max | Codex Luna Medium | Codex GPT-5.5 Medium |
| --- | ---: | ---: | ---: |
| Mean seconds / task | 336.6 | 219.5 | 179.9 |
| Median seconds / task | 172.1 | 171.1 | 133.3 |
| Input tokens | 115,024,091 | 41,016,520 | 6,790,616 |
| Output tokens | 726,785 | 321,143 | 130,800 |
| Weighted input cache rate | 89.67% | 87.46% | 60.98% |
| Usage coverage | 122 / 122 | 121 / 122 | 117 / 122 |

The selected AILIS attempts contain 2,044 inner model decisions. All 252 saved attempts record 4,446 calls, with usage present for 244 / 252 attempts. Selected-attempt resources are not total recovery spend. Codex CLI whole-turn completion events are not individual model-decision counts. Model, tool surface, reasoning budget and date differences prevent attributing score differences directly to general Agent capability.

## Historical evidence and methodology

Earlier A6 GAIA `119 / 165 (72.12%)`, A7 Terminal-Bench `60 / 89 (67.42%)`, ToolSandbox, LongMemEval, PersonaMem and LoCoMo results remain in the [immutable historical evaluation page](https://github.com/haowenGuo/AILIS/blob/659bf61f2b340d2313b3bae386704265c8d2bba2/docs/evaluation.md). They belong to their own sources and scoring protocols, not to the latest unified Agent.

The [JSON snapshot](evaluation/20260907-snapshot.json) includes relative artifact identifiers, report/source-lock SHA-256 hashes, underlying statistics and per-task labels. Raw logs remain local; hashes identify evidence but **do not mean a complete independently reproducible package has been published**. This documentation update changes no benchmark questions, answers, verifiers, raw scores or retry eligibility.

See [measurement methodology](engineering/measurement.md). Weighted cache rate is always `sum(cached input) / sum(input)`, not an arithmetic mean of task percentages or a theoretical reusable-prefix ratio.
