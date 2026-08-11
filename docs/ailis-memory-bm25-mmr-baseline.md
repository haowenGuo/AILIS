# AILIS Memory Retrieval Baseline

## Decision

As of 2026-08-05, the production retrieval baseline on AILIS `main` is:

```text
bm25_phrase_v2 + soft session-diversity MMR (penalty 0.2)
```

This is a deterministic, local, zero-model-call retrieval path. It replaces the former
keyword-overlap ranking inside Memory v2. Dense retrieval and an LLM query planner are not
part of the default read path.

The decision does not remove AILIS's other memory lanes. The runtime continues to use:

- the immutable Raw Memory Ledger for durable source history;
- asynchronous user-profile and relationship curation;
- explicit memory blocks and project context;
- preference and relationship state;
- the recent event stream for query-time lexical retrieval.

## Retrieval contract

The baseline is frozen with the following parameters:

| Parameter | Value |
| --- | ---: |
| Strategy ID | `bm25_phrase_v2` |
| BM25 `k1` | `1.2` |
| BM25 `b` | `0.72` |
| User-field weight | `1.15` |
| Assistant-field weight | `1.0` |
| Tag-field weight | `1.4` |
| Phrase boost | `0.28` |
| Numeric boost | `0.45` |
| Recency boost | `0.08` |
| Importance boost | `0.02` |
| Session-repeat penalty | `0.2` |
| Default Top-K | `8` |
| Dense retrieval | disabled |
| Retrieval-time query planner | disabled |

The MMR policy is a soft session-diversity penalty rather than a hard cap. After an event
from a session has been selected, another event from the same session is scored as:

```text
adjusted_score = score / (1 + selected_from_session * 0.2)
```

This retains multiple events from one session when their relevance is strong, while allowing
evidence from other sessions to enter Top-K.

## Current evaluation results

This scorecard contains only runs produced by the current
`bm25_phrase_v2 + soft MMR 0.2` retrieval baseline. Results from superseded keyword,
Hybrid RRF, E5/dense, or other historical retrieval strategies are intentionally omitted.

Scores below use different benchmark metrics and must not be combined into one leaderboard.

### LongMemEval-S

| Retrieval | Reader / Judge | Completed | QA | Session R@8 | Turn R@8 | E2E p50 | E2E p95 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 phrase v2 + MMR 0.2 | Luna / Luna medium | 500/500 | 71.60% | 93.53% | 83.31% | 18.6 s | 39.1 s |

| Question type | Correct | Accuracy |
| --- | ---: | ---: |
| Single-session user | 66/70 | 94.29% |
| Multi-session | 76/133 | 57.14% |
| Single-session preference | 19/30 | 63.33% |
| Temporal reasoning | 99/133 | 74.44% |
| Knowledge update | 63/78 | 80.77% |
| Single-session assistant | 35/56 | 62.50% |

The run completed all 500 questions with zero generation or Judge failures. The QA Judge
used the verbatim official LongMemEval prompt and binary aggregation with Luna medium; it is
therefore locally reproducible but not an official leaderboard submission.

### PersonaMem Balanced-140

The deterministic engineering subset contains 20 personas, seven question types, 140
questions, and 39 audited context slices. It used Luna medium as Reader, Top-8 retrieval,
and accepted Ledger state.

| Retrieval | Completed | Correct | Accuracy | Retrieval mean | Retrieval median | Retrieval p95 | E2E median | E2E p95 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 phrase v2 + MMR 0.2 + Ledger | 140/140 | 92/140 | 65.71% | 1.15 s | 1.05 s | 1.78 s | 26.41 s | 53.83 s |

| Question type | Correct | Accuracy |
| --- | ---: | ---: |
| Track full preference evolution | 14/20 | 70% |
| Acknowledge latest user preferences | 13/20 | 65% |
| Generalize to new scenarios | 11/20 | 55% |
| Preference-aligned recommendations | 13/20 | 65% |
| Recall user-shared facts | 14/20 | 70% |
| Revisit reasons behind updates | 14/20 | 70% |
| Suggest new ideas | 13/20 | 65% |

All 39 slice, write-chain, and Ledger audits passed. Dense retrieval, retrieval-time planner,
TaskAgent, short-term-message, and question-writeback counts were all zero.

### LoCoMo

| Retrieval | Completed | Released token F1 | Session R@8 | Turn R@8 | E2E p50 | E2E p95 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| BM25 phrase v2 + MMR 0.2 | 1,986/1,986 | 24.69% | 89.67% | 71.75% | 12.72 s | 30.44 s |

| Category | Questions | Token F1 |
| --- | ---: | ---: |
| Multi-hop | 282 | 16.61% |
| Temporal | 321 | 31.80% |
| Open-domain | 96 | 12.84% |
| Single-hop | 841 | 28.06% |
| Adversarial | 446 | 20.85% |

LoCoMo shows that retrieval is not the only remaining bottleneck. Multi-hop evidence,
unsupported-answer detection, and concise answer construction remain separate work items.

## Interpretation

The baseline is selected for its overall Pareto position, not because it wins every category.

Strengths:

- deterministic and local;
- no embedding-model startup or inference latency;
- no retrieval-time LLM calls;
- high Top-8 evidence recall;
- low observed retrieval tail latency on PersonaMem;
- balanced results across preference evolution, fact recall, reasoning, and recommendation.

Known weaknesses:

- latest-preference and full preference-evolution questions still benefit from stronger
  recency and supersession semantics;
- multi-session and assistant-history questions need structured state or relationship boosts;
- the active Memory v2 event window is bounded, while older durable evidence remains in the
  Raw Memory Ledger and curated capsules;
- BM25 context packing can consume more Reader tokens even while retrieval is much faster.

## Development rule

Future memory work should use this implementation and parameter set as the control group.
Changes should first be evaluated as small, paired additions to the baseline:

1. Ledger current-state, recency, and supersession boosts;
2. deterministic entity/relation expansion for multi-hop queries;
3. context compression and evidence ordering;
4. low-confidence dense fallback, kept off the default path.

Do not silently change the baseline constants, enable dense retrieval globally, or add a
retrieval-time model planner without a paired evaluation and latency report.

## Comparability warning

The local LongMemEval run used Luna-based Reader/Judge protocols rather than the benchmark's
official fixed leaderboard Judge. PersonaMem Balanced-140 is a deterministic engineering
subset whose Reader sees retrieved memory rather than the official full sliced context.
Public system scores may be used only as directional references, not as same-protocol ranking
claims.
