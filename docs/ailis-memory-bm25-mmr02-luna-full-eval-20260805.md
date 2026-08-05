# AILIS BM25 + MMR 0.2 Full Memory Evaluation

Date: 2026-08-05

## Configuration

| Item | Value |
|---|---|
| Memory strategy | `bm25_phrase_v2` |
| Retrieval policy | BM25 + soft session-diversity MMR |
| Session repeat penalty | `0.2` |
| Dense retrieval / reranker | Disabled |
| Profile / cognition curation | Disabled |
| Answer model | `gpt-5.6-luna` through `codex-model-bridge` |
| Workers | 10 |
| Per-question timeout | 300 seconds |
| Question isolation | One native AILIS memory state per question |
| TaskAgent | Disabled |
| Question-time memory writes | Read only |

The runs use the production AILIS memory ingestion and prompt construction path. Reference
answers and `has_answer` fields are not exposed to the answer model.

## Headline Results

| Benchmark | Questions | Completion | QA score | Session R@8 | Turn R@8 | E2E p50 | E2E p95 |
|---|---:|---:|---:|---:|---:|---:|---:|
| LongMemEval | 500 | 100% | 72.80% | 93.53% | 83.31% | 18.56 s | 38.98 s |
| LoCoMo | 1,986 | 100% | 24.69 F1 | 89.67% | 71.75% | 12.72 s | 30.44 s |

No generation failures, TaskAgent violations, read-only violations, synthetic-user isolation
violations, or curation-drain violations were recorded in either run.

The end-to-end latency includes isolated state setup, history replay, retrieval, prompt
construction, and Luna inference. It must not be compared directly with the earlier retrieval-only
microbenchmark, where LongMemEval BM25 + MMR 0.2 had about 40.52 ms p50 and 60.55 ms p95.

## LongMemEval

Generation completed 500/500 questions in about 41.5 minutes. The Luna judge completed 500/500
official prompt checks in about 16.6 minutes with no judge failures.

| Question type | Count | QA accuracy | Session R@8 | Turn R@8 | Mean E2E |
|---|---:|---:|---:|---:|---:|
| Single-session user | 70 | 94.29% | 100.00% | 96.88% | 20.85 s |
| Multi-session | 133 | 57.14% | 89.36% | 72.75% | 20.35 s |
| Single-session preference | 30 | 66.67% | 86.67% | 66.11% | 20.75 s |
| Temporal reasoning | 133 | 75.94% | 89.69% | 81.14% | 23.96 s |
| Knowledge update | 78 | 83.33% | 99.36% | 90.51% | 17.29 s |
| Single-session assistant | 56 | 64.29% | 100.00% | 96.43% | 18.43 s |

Retrieval and answer quality are strongly coupled:

| Evidence condition | Questions | QA accuracy |
|---|---:|---:|
| Session evidence fully recalled at 8 | 436 | 79.36% |
| Session evidence partially recalled or missed | 64 | 28.13% |
| Turn evidence fully recalled at 8 | 360 | 85.56% |
| Turn evidence partially recalled or missed | 119 | 32.77% |

LongMemEval uses the verbatim official binary judge prompts, but the judge is Luna rather than the
official leaderboard's pinned GPT-4o judge. The score is therefore internally reproducible but not
strictly leaderboard-comparable. Judge usage was 1,787,592 tokens, including 4,122 reasoning
tokens. The generation runner currently records provider/model and latency but not generation token
usage.

## LoCoMo

The released `locomo10.json` contains 10 conversations and 1,986 QA items. The full adapter keeps
all sessions and evidence coordinates. Temporal questions use the released date instruction, and
category 5 uses the released adversarial `Not mentioned in the conversation` choice protocol.

Generation completed 1,986/1,986 questions in about 2 hours 42 minutes. The released LoCoMo
normalization, Porter stemming, category-specific token F1, multi-answer F1, and adversarial rules
were ported to the local scorer.

| Official category | Count | QA score | Session R@8 | Turn R@8 |
|---|---:|---:|---:|---:|
| Single-hop retrieval | 841 | 28.06 | 95.84% | 75.43% |
| Multi-hop retrieval | 282 | 16.61 | 65.80% | 37.45% |
| Temporal reasoning | 321 | 31.80 | 87.44% | 68.80% |
| Open-domain knowledge | 96 | 12.84 | 59.91% | 29.61% |
| Adversarial | 446 | 20.85 | 99.55% | 96.97% |

| Evidence condition | Questions | QA score |
|---|---:|---:|
| Session evidence fully recalled at 8 | 1,682 | 27.21 |
| Session evidence partially recalled or missed | 296 | 10.12 |
| Turn evidence fully recalled at 8 | 1,327 | 30.26 |
| Turn evidence partially recalled or missed | 650 | 13.17 |

The low LoCoMo QA score is not explained by one defect:

1. Multi-hop and open-domain turn retrieval remains weak, so complete supporting evidence often
   does not reach the model.
2. The released token-F1 metric penalizes explanatory wording. Luna returned 12.74 words on average
   rather than an aggressively short answer string.
3. Adversarial questions deliberately contain highly similar distractor evidence with a wrong
   entity, subject, or implication. Lexical BM25 retrieves that distractor very reliably, but Luna
   selected `Not mentioned` in only 20.85% of these cases.
4. Even with full turn evidence, LoCoMo QA reaches only 30.26. This leaves a substantial
   answer-construction and relation-resolution bottleneck beyond retrieval.

## Conclusion

BM25 + MMR 0.2 is the best current low-cost production baseline: it is deterministic, pure-code,
and materially improves evidence diversity without the large latency increase of LLM query
planning or dense reranking. It is strong on LongMemEval retrieval and achieves 72.8% QA with Luna.

It is not the end state for LoCoMo. The next experiments should preserve this baseline and target
entity/role-aware lexical expansion, temporal relation features, and concise benchmark answer
construction separately. Changing all three at once would make the source of any gain impossible
to identify.

## Artifacts

- LongMemEval run: `eval-results/longmemeval-ailis/bm25-mmr02-gpt56-luna-full500-20260805-v1`
- LongMemEval judge: `eval-results/longmemeval-ailis/bm25-mmr02-gpt56-luna-full500-20260805-v1/official-judge-gpt56-luna-low-20260805-v1`
- LoCoMo run: `eval-results/locomo-ailis/bm25-mmr02-gpt56-luna-full1986-20260805-v1`
- LoCoMo score: `eval-results/locomo-ailis/bm25-mmr02-gpt56-luna-full1986-20260805-v1/locomo-official-eval`
- Full LoCoMo adapter: `evals/locomo/locomo-full.longmemeval.json`
- Full LoCoMo gold: `evals/locomo/locomo-full.gold.json`

