# AILIS Memory Full-Fidelity Audit

## Why this audit exists

The first memory-strategy lab established a common AILIS ingestion, selection, and
LongMemEval harness. It did **not** fully reproduce every named external system.
Those implementations remain available for regression experiments, but their
labels now say `Prototype` and their aliases no longer imply official fidelity.

This document is the acceptance contract for the high-quality implementations.
No strategy may be described as full when a required component silently falls
back to a heuristic, hashed embedding, or a different memory algorithm.

## Fidelity classes

| Class | Meaning |
| --- | --- |
| `native_ailis_baseline` | Existing AILIS behavior, kept unchanged as a verified control. |
| `prototype` | Runnable architectural sketch. Useful for ablations, not a faithful reproduction. |
| `native_ailis_full_implementation` | A complete AILIS-owned design with explicit algorithms and no borrowed product claim. |
| `paper_equivalent_reproduction` | Reproduction of every material component described by a paper whose production source is unavailable. |
| `official_source_aligned_reproduction` | Lifecycle and prompts aligned to an inspectable open-source implementation, adapted to AILIS storage/model boundaries. |
| `official_runtime_integration` | Instantiates and executes the upstream runtime directly while adapting AILIS messages, models, and context at explicit boundaries. |
| `official_backend_integration` | Calls the upstream implementation directly. A local imitation is not accepted as a fallback. |

## Strategy matrix

| Strategy ID | Fidelity | Required components | Failure policy |
| --- | --- | --- | --- |
| `bm25_phrase_v1` | Native AILIS baseline | Existing raw-turn BM25, phrase boosts, session diversity | Preserve behavior and scores |
| `hybrid_rrf_v1` | Prototype | Sparse + dense + RRF | May use historical fallback; label always says Prototype |
| `chronos_dual_calendar_v1` | Prototype | Simplified dual-corpus retrieval | Label always says Prototype |
| `observational_memory_v1` | Prototype | Simplified observations | Label always says Prototype |
| `hindsight_cognitive_v1` | Prototype | Simplified cognitive lanes | Label always says Prototype |
| `hybrid_crossencoder_v2` | Native AILIS full | Fielded BM25, real dense embeddings, entity and temporal channels, RRF, real sequence-classification cross-encoder | Retrieval fails explicitly if dense model or reranker is unavailable |
| `chronos_full_v1` | Paper-equivalent | 25-turn extraction batches with 5-turn overlap, subject/verb/object events, ISO ranges, 2–4 lexical aliases, raw turn calendar, event calendar, dense top-100, cross-encoder top-15, ±1 context expansion, dynamic guidance, vector and grep tools over both calendars, iterative ReAct-style loop | Curation or retrieval fails explicitly when its model/dense/reranker dependency is unavailable |
| `mastra_observational_full_v1` | Official runtime | Direct `@mastra/memory` `ObservationalMemory` 1.24.0, direct `@mastra/libsql` storage 1.18.0, resource scope, Actor/Observer/Reflector lifecycle, official threshold observation/reflection, retrieval observation groups, official token counter, durable raw messages and DB, AILIS LanguageModelV3 adapter, bounded raw AILIS tail | Upstream runtime/storage failure is explicit; never substitutes the boundary adapter |
| `mastra_observational_adapter_v1` | Official-source-aligned adapter | AILIS-owned storage/lifecycle using upstream prompt, parser, token counter, anchors, and group utilities | Excluded from the default quality matrix and never labeled as the complete upstream runtime |
| `hindsight_official_v1` | Official backend | Official daemon, official TypeScript client, isolated bank, Retain, Recall, Reflect, upstream semantic/BM25/graph/temporal retrieval and upstream reranking | If the official daemon is unhealthy, return `official_backend_unavailable`; never call `hindsight_cognitive_v1` |

## Data-lane invariants

- Persona conversation and memory are the only inputs to these strategies.
- TaskAgent execution traces are excluded from curation and retrieval.
- Raw Memory Ledger entries remain immutable evidence.
- Derived state records source turn IDs, session IDs, and timestamps.
- The benchmark answer, answer session IDs, question type, and judge output never
  enter ingestion, query planning, retrieval, or response generation.
- Strategy changes never delete baseline raw turns or user-profile data.

## Full-strategy state

Each full strategy owns a separate durable artifact below the selected AILIS
memory root:

```text
memory/
├── events.jsonl
├── memory-state.json
├── memory-strategy.json
├── memory-cognition.json              # prototype/shared historical artifact
├── hybrid-crossencoder-v2.json        # model/index manifest and diagnostics
├── chronos-full-v1.json               # event calendar and extraction cursor
├── mastra-observational-official-v1.json # AILIS-to-upstream provenance/status
├── mastra-observational-official-v1.db   # official LibSQL OM source of truth
├── mastra-observational-full-v1.json  # explicitly named boundary-adapter artifact
└── hindsight-official-v1.json         # daemon profile, bank ID, retained documents
```

The Mastra JSON contains AILIS event provenance and lifecycle diagnostics. The
official LibSQL record remains the source of truth for raw messages, active
observations, reflection generations, and official OM cursors. Mastra 1.24 does
not support asynchronous buffering in cross-session `resource` scope, so this
integration follows the upstream-required synchronous threshold mode. Messages
below that threshold remain durable and query-visible through the bounded raw
tail; they are not mislabeled as Observer output.

The Hindsight file contains identifiers and lifecycle status only. The official
Hindsight database remains the source of truth for Hindsight facts and mental
models.

## Acceptance gates

Before a full strategy can be used in a score comparison:

1. Contract tests prove that unavailable required dependencies cause explicit
   failure rather than fallback.
2. Restart tests prove that the derived state and cursor resume without
   duplicate ingestion.
3. Source-provenance tests map selected memory back to original AILIS turns.
4. Temporal-update tests preserve old state for historical questions and prefer
   new state for current questions.
5. TaskAgent-isolation tests prove zero executor material in Persona memory.
6. A cold and warm latency report records model downloads separately from steady
   retrieval latency.
7. LongMemEval runs record the fidelity class, upstream version/model identity,
   and all non-default configuration.

## Reproducible model gate

Full Hybrid and Chronos use immutable default model revisions:

| Component | Model | Revision |
| --- | --- | --- |
| Dense retrieval | `Xenova/multilingual-e5-small` | `761b726dd34fb83930e26aab4e9ac3899aa1fa78` |
| Cross-encoder | `Xenova/ms-marco-MiniLM-L-6-v2` | `a09144355adeed5f58c8ed011d209bf8ee5a1fec` |

The cross-encoder tokenizes query/document pairs directly. A one-logit ranking
head is scored with sigmoid, not a one-element softmax. The model doctor rejects
invalid row counts, non-finite scores, semantic misranking, missing cached
artifacts, and any silent hashed-vector fallback.

Prepare once:

```powershell
pnpm ailis:memory-models:prepare -- `
  --endpoint https://hf-mirror.com/ `
  --cache-dir D:\path\to\transformers-cache
```

Prove a cache-only load:

```powershell
pnpm ailis:memory-models:doctor -- `
  --cache-dir D:\path\to\transformers-cache `
  --json
```

The verified local gate loaded both pinned models, produced 384-dimensional
dense embeddings, ranked the semantically relevant passage first, ranked the
relevant query/document pair first, and repeated both checks with remote model
access disabled.

## Live upstream gates

The following gates were executed on 2026-07-30, independently of mocked unit
clients:

| Runtime | Live gate | Result |
| --- | --- | --- |
| AILIS Hybrid | Cache-only dense + real pairwise cross-encoder end-to-end search | Relevant “miso ramen” event ranked first; no remote access |
| Mastra OM | Official `ObservationalMemory` + official `LibSQLStore.stores.memory` + AILIS LanguageModelV3 stream adapter + restart | Observation persisted, source event recovered, restart reused the official DB without a second Observer call; a below-threshold turn remained durable and retrievable without an Observer call or false stalled status |
| Hindsight | Official daemon/client 0.8.6 + embedded PostgreSQL/pgvector + local embedding/reranker + `openai-codex` | Bank creation, Retain, Recall, source-event recovery, Reflect synthesis, health and clean daemon shutdown passed |
| Ten-process preflight | Hybrid, ten immutable LongMemEval shards, offline model cache | Dense and cross-encoder warmup both reported exact pinned revisions before worker launch |

The Hindsight live run used local `BAAI/bge-small-en-v1.5` embeddings and
`cross-encoder/ms-marco-MiniLM-L6-v2` reranking. Its end-to-end diagnostic run
included per-profile database startup/migrations and completed in about 86
seconds on the test machine; that number is an operational smoke measurement,
not a steady-state benchmark.

## Upstream baselines

- Mastra source package audited: `@mastra/memory` 1.24.0, Apache-2.0.
- Mastra storage package used directly: `@mastra/libsql` 1.18.0.
- Hindsight source audited: `vectorize-io/hindsight` commit `cc1eaee`,
  packages `@vectorize-io/hindsight-all` and
  `@vectorize-io/hindsight-client` 0.8.6, MIT.
- Chronos audited from arXiv `2603.16862v1`. No official production repository
  was published with the paper, so AILIS must call its implementation a
  paper-equivalent reproduction, not an official Chronos port.
