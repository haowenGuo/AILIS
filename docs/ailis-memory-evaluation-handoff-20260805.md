# AILIS Memory Evaluation Handoff

Date: 2026-08-05
Workspace: `F:\AILIS_self_evolution_runtime`
Branch: `codex/ailis-self-evolve-sync-20260804`
Status: memory evaluation work is paused and ready for another Codex to continue.

## 1. Objective And Product Constraints

The memory work tested whether AILIS can retrieve and use long-term conversational
evidence without adding an expensive LLM query planner to every memory lookup.

The user has made these constraints explicit:

- Prefer deterministic, pure-code retrieval for the production fast path.
- Do not accept a small quality gain that multiplies latency or token cost.
- Keep `Raw Memory Ledger` as the full-fidelity source of original experience.
- Separate retrieval quality from answer-model quality when evaluating failures.
- Preserve benchmark data and raw outputs so every score can be reproduced.
- Do not add benchmark-specific predicates to production retrieval.

## 2. Selected Production Baseline

The selected low-cost baseline is `bm25_phrase_v2`:

```text
BM25 phrase-aware lexical ranking
  -> soft session-diversity MMR
  -> top-k evidence

adjusted_score = bm25_score / (1 + selected_from_session * 0.2)
```

This is not a hard per-session cap. Strong additional turns from the same session can
still win, while weaker duplicate turns lose priority. It makes no model call and uses
no embeddings or cross-encoder.

Primary implementation:

- `electron/ailis-memory-store.cjs`
- `electron/ailis-memory-strategies.cjs`
- `electron/ailis-memory-lexical-index.cjs`
- `electron/ailis-raw-memory-ledger.cjs`

Primary tests:

- `tests/ailis-memory-store.test.mjs`
- `tests/ailis-memory-strategies.test.mjs`
- `tests/ailis-memory-full-fidelity.test.mjs`
- `tests/ailis-raw-memory-ledger.test.mjs`

Design and experiment notes:

- `docs/ailis-memory-lexical-retrieval-experiment-20260804.md`
- `docs/ailis-memory-bm25-mmr02-luna-full-eval-20260805.md`
- `docs/ailis-memory-v3-hybrid-ledger.md`
- `docs/ailis-memory-strategy-lab.md`
- `docs/ailis-memory-architecture-v1.md`
- `docs/ailis-memory-architecture-v2.md`

## 3. Retrieval-Only Result

The production-path retrieval microbenchmark selected MMR penalty `0.2`.

| Dataset | Strategy | Session R@8 | Turn R@8 |
|---|---|---:|---:|
| LongMemEval 470 answerable | BM25 hard-cap baseline | 93.34% | 79.56% |
| LongMemEval 470 answerable | BM25 + MMR 0.2 | 93.95% | 83.20% |
| LoCoMo 40 | BM25 hard-cap baseline | 80.83% | 64.79% |
| LoCoMo 40 | BM25 + MMR 0.2 | 82.08% | 64.79% |

Warm-cache production-path latency on the same 500-event workload:

| Strategy | p50 | p95 | Mean |
|---|---:|---:|---:|
| `bm25_phrase_v1` | 39.79 ms | 57.35 ms | 42.23 ms |
| `bm25_phrase_v2` | 40.52 ms | 60.55 ms | 42.76 ms |

The complete grid outputs are under:

- `eval-results/memory-retrieval-experiments/`

The selected strategy improved 38 LongMemEval questions and regressed 11 at Turn
R@8. Paired bootstrap 95% CI for Turn R@8 improvement was +2.01 to +5.37 points.

PRF variants sometimes scored higher, but they require a second ranking pass and
showed query-drift risk. They remain experimental and are not the production default.

## 4. Full End-To-End Evaluation

Both formal runs replayed original user/assistant history through the native AILIS
memory runtime and Raw Memory Ledger. Each question used isolated state. Reference
answers and `has_answer` were excluded from ingestion and prompts. TaskAgent and
question-time writes were disabled.

| Benchmark | Questions | Completion | QA | Session R@8 | Turn R@8 | E2E p50 | E2E p95 |
|---|---:|---:|---:|---:|---:|---:|---:|
| LongMemEval | 500 | 100% | 72.80% | 93.53% | 83.31% | 18.56 s | 38.98 s |
| LoCoMo | 1,986 | 100% | 24.69 F1 | 89.67% | 71.75% | 12.72 s | 30.44 s |

No generation failure, TaskAgent violation, read-only violation, synthetic-user
isolation violation, profile drain, or cognition drain was recorded.

### LongMemEval canonical artifacts

Run root:

`eval-results/longmemeval-ailis/bm25-mmr02-gpt56-luna-full500-20260805-v1`

Important files:

- `manifest.json`: exact runtime, model, memory policy, isolation, and dataset config.
- `summary.json`: completion and retrieval metrics.
- `results.jsonl`: one complete diagnostic row per question.
- `hypotheses.jsonl`: generated answers in evaluator format.
- `parallel-status.json`: shard/orchestrator completion.
- `official-judge-gpt56-luna-low-20260805-v1/summary.json`: 364/500, 72.80%.
- `official-judge-gpt56-luna-low-20260805-v1/judgments.jsonl`: all binary judgments.

Dataset:

`F:\AILIS_self_evolution_runtime\.local\benchmarks\LongMemEval\data\longmemeval_s_cleaned.json`

The judge used the verbatim official LongMemEval prompt and binary aggregation, but
used `gpt-5.6-luna` instead of the leaderboard-pinned GPT-4o judge. It is internally
reproducible, not strictly leaderboard-comparable. Judge usage was 1,787,592 tokens.

### LoCoMo canonical artifacts

Run root:

`eval-results/locomo-ailis/bm25-mmr02-gpt56-luna-full1986-20260805-v1`

Important files:

- `manifest.json`: generation configuration.
- `summary.json`: completion and retrieval metrics.
- `results.jsonl`: evidence coordinates, retrieval diagnostics, answer, and latency.
- `hypotheses.jsonl`: all 1,986 candidate answers.
- `locomo-official-eval/summary.json`: released metric result, 24.6867738 F1.
- `locomo-official-eval/judgments.jsonl`: per-item official token-F1 records.

Adapter and gold data:

- `evals/locomo/locomo-full.longmemeval.json`
- `evals/locomo/locomo-full.gold.json`
- `evals/locomo/locomo-2x20qa.longmemeval.json`
- `evals/locomo/locomo-2x20qa.gold.json`

The canonical LoCoMo category result is the official evaluator summary:

| Category | Count | F1 |
|---|---:|---:|
| Multi-hop | 282 | 16.61 |
| Temporal | 321 | 31.80 |
| Open-domain | 96 | 12.84 |
| Single-hop | 841 | 28.06 |
| Adversarial | 446 | 20.85 |

Important warning: the generation run's `summary.json` currently has incorrect
`byQuestionType` labels for several LoCoMo category numbers. Do not use that block for
category reporting. Use `locomo-official-eval/summary.json`, whose category mapping is
ported from the released LoCoMo evaluator.

## 5. Current Failure Analysis

The deterministic pre-analysis found:

- Mean candidate length: 12.74 words.
- Mean gold length: 4.91 words.
- Normalized exact match: 0.45%.
- Zero token-F1 answers: 36.96%.
- Gold answer appears as a substring in the candidate: 26.44%.
- Full Turn evidence at R@8: 1,327 items.
- F1 with full Turn evidence: 30.26.
- F1 with partial/missing Turn evidence: 13.17.
- Adversarial items with explicit `not mentioned`-style abstention: 93/446.
- Adversarial items that supplied a concrete guess: 353/446.

These numbers show that 24.69 F1 is not one defect. The main hypotheses are:

- Retrieval failure: necessary turns are not all in the top eight.
- Answer-construction failure: evidence is complete but entity/relation/temporal reasoning fails.
- Format/paraphrase loss: semantically correct answers are penalized by strict token F1.
- Abstention failure: an unanswerable adversarial item receives a concrete guess.

Do not claim exact proportions for those four causes until the semantic Judge finishes.

## 6. Pending Semantic Attribution Judge

Script:

`scripts/run-locomo-semantic-codex-judge.mjs`

Current status:

- Implemented.
- `node --check` passes.
- No smoke run has been executed.
- No semantic-judge output directory exists yet.
- Official token F1 was deliberately removed from the Judge prompt to prevent score leakage.
- The Judge sees only category, question, reference, and candidate.
- F1 and Turn R@8 are joined only after the independent semantic decision.

Judge output schema:

```json
{
  "semantic_label": "correct|partial|incorrect",
  "is_explicit_abstention": true,
  "is_unsupported_guess": false,
  "format_only_mismatch": false,
  "reason_code": "correct_exact|correct_paraphrase|correct_verbose|partial_answer|wrong_fact|wrong_entity|wrong_time|unsupported_inference|should_abstain|contradictory|other",
  "confidence": 0.0,
  "rationale": "brief reason"
}
```

Deterministic attribution precedence:

1. Category 5 correct abstention -> `correct_abstention`.
2. Category 5 concrete answer -> `should_abstain_but_guessed`.
3. Semantic correct but lexical F1 below one -> `format_or_paraphrase_loss`.
4. Semantic incorrect/partial and Turn R@8 below one -> `retrieval_failure`.
5. Semantic incorrect/partial and Turn R@8 equals one -> `reasoning_failure_with_full_evidence`.

First run a cheap smoke validation:

```powershell
node scripts\run-locomo-semantic-codex-judge.mjs `
  --judge-run-id semantic-judge-smoke12-gpt56-luna-medium-20260805-v1 `
  --limit 12 `
  --workers 4 `
  --model gpt-5.6-luna `
  --reasoning-effort medium
```

Inspect `judgments.jsonl` for schema validity, semantic consistency, and at least a few
known paraphrase/date cases. Then run all predictions:

```powershell
node scripts\run-locomo-semantic-codex-judge.mjs `
  --source-run-id bm25-mmr02-gpt56-luna-full1986-20260805-v1 `
  --judge-run-id semantic-judge-gpt56-luna-medium-20260805-v1 `
  --workers 10 `
  --model gpt-5.6-luna `
  --reasoning-effort medium `
  --timeout-ms 300000 `
  --max-attempts 3
```

The runner is resumable. Do not use `--force` unless intentionally replacing all
existing semantic judgments.

Scientific caveat: candidate generation and semantic judging currently use the same
model family. After the full run, manually audit a stratified sample and consider a
second independent judge on disagreement/high-impact cases.

## 7. Reproduction Tools

- `scripts/run-ailis-longmemeval-parallel.mjs`: isolated multi-process generation.
- `scripts/run-longmemeval-codex-judge.mjs`: official-prompt LongMemEval judge.
- `scripts/prepare-ailis-locomo-eval.mjs`: full LoCoMo adapter and gold generation.
- `scripts/evaluate-ailis-locomo.py`: released LoCoMo token-F1 port.
- `scripts/compare-longmemeval-memory-retrieval.mjs`: retrieval comparison.
- `scripts/evaluate-lexical-memory-experiments.mjs`: pure-code strategy grids.
- `scripts/analyze-lexical-memory-candidate.mjs`: candidate diagnostics/bootstrap.
- `scripts/run-ailis-longmemeval-memory-matrix.mjs`: strategy matrix runner.

Validation commands:

```powershell
node --check scripts\run-locomo-semantic-codex-judge.mjs
node --test tests\ailis-longmemeval-eval.test.mjs
node --test tests\ailis-longmemeval-parallel.test.mjs
node --test tests\ailis-memory-strategies.test.mjs
node --test tests\ailis-memory-store.test.mjs
```

## 8. Git And Workspace Safety

The worktree is heavily dirty and contains unrelated renderer, runtime, website, release,
and benchmark changes from multiple Codex sessions. Memory files are a mixture of modified
tracked files and untracked new files. Do not use reset, checkout, clean, or broad staging.

Stage memory work with explicit paths only after reviewing diffs. `eval-results` contains
large per-question state trees and may be ignored or intentionally kept local; do not add
the entire result tree to Git without checking repository policy and size.

No API keys or credentials are recorded in this handoff.

## 9. Recommended Next Actions

1. Run the 12-item semantic Judge smoke test and inspect every row.
2. Add a stratified smoke set containing all five LoCoMo categories, especially adversarial.
3. Run the full 1,986-item semantic Judge with resume enabled.
4. Report the four requested attribution proportions with confidence-aware manual audit.
5. Fix only the mislabeled LoCoMo `byQuestionType` summary metadata; do not alter canonical results.
6. Keep `bm25_phrase_v2 + MMR 0.2` frozen as the production baseline during attribution.
7. Test future retrieval changes against both retrieval recall and semantic QA, not token F1 alone.
