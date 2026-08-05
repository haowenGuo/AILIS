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

## Evaluation evidence

Scores below use different benchmark metrics and must not be combined into one leaderboard.

### LongMemEval-S

| Run | Reader / Judge | QA | Session R@8 | Turn R@8 | E2E p50 | E2E p95 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Memory v3 Hybrid | Luna medium / Luna medium | **76.00%** | 87.22% | 75.18% | 86.3 s | 210.7 s |
| BM25 phrase v2 + MMR | Luna / Luna medium | 71.60% | **93.53%** | **83.31%** | **18.6 s** | **39.1 s** |

The BM25 run improved evidence recall and reduced end-to-end latency by roughly 4.7x at the
mean, but its complete LongMemEval run did not use the same Ledger/context packing as the
Hybrid run. The QA difference is therefore not a pure retriever comparison.

### PersonaMem Balanced-140

This is the strongest same-question engineering A/B currently available. Both runs used the
same 140 questions, 20 personas, 39 audited slices, Luna medium Reader, Top-8, and accepted
Ledger state.

| Retrieval | Correct | Accuracy | Retrieval mean | Retrieval p95 |
| --- | ---: | ---: | ---: | ---: |
| Hybrid RRF + E5 + Ledger | 76/140 | 54.29% | 88.14 s | 381.15 s |
| **BM25 + MMR + Ledger** | **92/140** | **65.71%** | **1.15 s** | **1.78 s** |

The paired gain was 16 questions / 11.43 percentage points, with exact McNemar
`p = 0.0113`. Mean retrieval was 76.5x faster and p95 retrieval was 214.6x faster.

### LoCoMo

The completed 1,986-question BM25 run recorded:

- official released token F1: `24.69%`;
- Session R@8: `89.67%`;
- Turn R@8: `71.75%`;
- E2E p50: `12.72 s`;
- E2E p95: `30.44 s`.

LoCoMo shows that retrieval is not the only remaining bottleneck. Multi-hop evidence,
unsupported-answer detection, and concise answer construction remain separate work items.

## Interpretation

The baseline is selected for its overall Pareto position, not because it wins every category.

Strengths:

- deterministic and local;
- no embedding-model startup or inference latency;
- no retrieval-time LLM calls;
- high Top-8 evidence recall;
- very large tail-latency reduction on PersonaMem;
- improved preference recommendation, generalization, reason recall, and idea generation.

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

The local LongMemEval runs used Luna-based Reader/Judge protocols rather than the benchmark's
official fixed leaderboard Judge. PersonaMem Balanced-140 is a deterministic engineering
subset whose Reader sees retrieved memory rather than the official full sliced context.
Public system scores may be used only as directional references, not as same-protocol ranking
claims.
