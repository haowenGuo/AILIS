# AILIS Pure-Code Memory Retrieval Experiment

## Goal

Improve long-term memory retrieval without LLM query rewriting, dense embeddings, cross-encoders, benchmark-specific rules, or material latency growth.

The production baseline was `bm25_phrase_v1` after RetrievalRequest query separation:

- LongMemEval: Session R@8 93.34%, Turn R@8 79.56%.
- LoCoMo 40: Session R@8 80.83%, Turn R@8 64.79%.

## Evaluation Protocol

- Replayed the preserved native AILIS memory state for all 500 LongMemEval questions and 40 LoCoMo questions.
- Excluded the 30 LongMemEval abstention questions from answerable recall, matching the official local evaluation protocol.
- Used deterministic SHA-256 question splits: 280 LongMemEval development questions and 190 holdout questions.
- Verified the independent experiment scorer against production retrieval on all 500 questions. Session order and Turn/Session recall at R@1, R@5, R@8, and R@20 had zero parity failures.
- Used paired 10,000-sample bootstrap analysis for the selected candidates.
- Re-ran the final candidate through the real `AILISMemoryRuntime.searchMemory()` path for quality and latency.

## Strategies Tested

More than 80 deterministic configurations across these families were evaluated:

1. BM25 `k1` and `b` grids.
2. User, assistant, and tag field weights.
3. Phrase, numeric, recency, and importance weights.
4. Fixed per-session caps from one to unlimited.
5. Neighbor and session-context priors.
6. Prefix matching for light morphological tolerance.
7. True BM25F field-length normalization.
8. RM3-like pseudo relevance feedback with multiple support and weight thresholds.
9. Reciprocal-rank fusion between lexical channels.
10. Soft session-diversity MMR with penalties from 0.05 to 0.4.
11. Top-rank preservation plus MMR.
12. Conservative user-field and all-field PRF combined with MMR.

No configuration used the benchmark answer, question type, or hand-written task predicate during retrieval.

## Main Findings

### Hard session caps are the main Turn-recall bottleneck

Removing the old two-events-per-session cap raised LongMemEval Turn R@8 to 83.96%, but reduced Session R@8 to 92.12%. The cap protected session coverage but discarded additional relevant turns from a strong session.

### Soft diversity is a better tradeoff

MMR applies a diminishing score only after an event from the same session has already been selected:

```text
adjusted_score = bm25_score / (1 + selected_from_session * 0.2)
```

It does not classify the task or reject any event. A sufficiently strong third event can still be selected, while repetitive weak events lose priority.

### PRF can score higher but is not the default

Constrained PRF plus MMR reached LongMemEval Session R@8 94.03% and Turn R@8 83.36%. A less conservative PRF reached Turn R@8 84.18%. However, LoCoMo subgroup analysis showed query-drift risk on the small single-hop subset, and PRF requires a second scoring pass. PRF remains an experiment rather than the default production path.

## Selected Production Result

The selected default is BM25 plus soft session-diversity MMR with penalty 0.2.

| Dataset | Strategy | Session R@8 | Turn R@8 |
|---|---|---:|---:|
| LongMemEval 470 | BM25 hard cap baseline | 93.34% | 79.56% |
| LongMemEval 470 | BM25 + MMR 0.2 | **93.95%** | **83.20%** |
| LoCoMo 40 | BM25 hard cap baseline | 80.83% | 64.79% |
| LoCoMo 40 | BM25 + MMR 0.2 | **82.08%** | **64.79%** |

LongMemEval paired movement at R@8:

- Session: 8 improved, 1 regressed, 461 unchanged.
- Turn: 38 improved, 11 regressed, 421 unchanged.
- Session delta bootstrap 95% CI: +0.10 to +1.24 percentage points.
- Turn delta bootstrap 95% CI: +2.01 to +5.37 percentage points.

Every LongMemEval question category improved or remained unchanged in mean Turn R@8. The largest reliable gains were temporal reasoning and knowledge updates.

## Runtime Cost

Fair warm-cache production-path comparison on the same machine:

| Strategy | p50 | p95 | Mean |
|---|---:|---:|---:|
| `bm25_phrase_v1` | 39.79 ms | 57.35 ms | 42.23 ms |
| `bm25_phrase_v2` with MMR 0.2 | 40.52 ms | 60.55 ms | 42.76 ms |

The selected quality improvement adds about 0.53 ms mean and 3.20 ms p95 on this 500-event workload. It makes no model call and consumes no tokens.

## Production Integration

- `bm25_phrase_v1` remains unchanged as a reproducible baseline.
- `bm25_phrase_v2` uses MMR 0.2 for compact in-memory history.
- The SQLite FTS5 path for history beyond 500 turns now uses the same 0.2 penalty instead of 0.32.
- Diagnostics expose `sessionRepeatPenalty` and the in-memory backend `in_memory_bm25_mmr_v2`.
- PRF and other experimental variants remain isolated in the evaluation harness.
