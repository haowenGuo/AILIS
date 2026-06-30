# AILIS Artifact Runtime: RAGFlow-Lite Extraction

Status: active engineering blueprint.

This document defines how AILIS should extract the useful artifact-runtime layer
from RAGFlow without importing RAGFlow's full deployment platform.

The goal is not a small Excel fix. The goal is a local runtime that turns complex
files into a model-operable world: structured chunks, positions, search, render
hooks, deterministic compute workers, and compact observations that guide the
model without replacing its judgement.

## Source Snapshot

RAGFlow source was inspected from a selective raw snapshot under:

```text
F:\AILIS_self_evolution_runtime\build-cache\ragflow-src
```

The same selective snapshot is now organized as a vendored extraction workspace:

```text
F:\AILIS_self_evolution_runtime\vendor\ragflow-lite
```

The full `git clone` path was not available in this Windows/network session, but
raw GitHub source downloads succeeded. The vendored snapshot is extraction
input, not a replacement implementation.

Important source files in the snapshot:

- `rag__svr__task_executor.py`: task orchestration, parser factory, chunk build,
  embedding, insertion, progress, cancellation.
- `common__constants.py`: `ParserType`, `PipelineTaskType`, model types, task
  status enums.
- `common__doc_store__doc_store_base.py`: search expression interfaces such as
  `MatchTextExpr`, `MatchDenseExpr`, `FusionExpr`, `OrderByExpr`, and
  `DocStoreConnection`.
- `rag__app__table.py`: Excel/table parser and row-as-chunk conversion.
- `rag__app__naive.py`: default document chunker and multi-backend parser
  selection.
- `rag__nlp__search.py`: hybrid full-text/vector search, fallback search,
  highlighting, reranking, citation insertion.
- `rag__nlp__query.py`: full-text query expansion and weighted fields.
- `rag__prompts__generator.py`: chunk formatting, KB prompt packing, citations,
  keyword extraction, question proposal, TOC workflows.
- `deepdoc__README.md` and `deepdoc__parser__*.py`: OCR/layout/table/document
  parsing strategy.

## What RAGFlow Actually Gives Us

RAGFlow's core value is not "parse a file". It is a complete artifact pipeline:

```text
file/task
  -> parser type selection
  -> domain parser backend
  -> normalized sections/tables/images
  -> domain chunker
  -> RAG fields
  -> lexical/vector indexes
  -> compact retrieval results
  -> prompt/citation composer
  -> async task lifecycle
```

For AILIS, the artifact chain should preserve this RAGFlow shape. AILIS should
not hand-build a parallel artifact implementation; it should host and expose the
RAGFlow-lite extractor output.

## Core RAGFlow Ideas To Extract

### 1. Parser Factory

RAGFlow uses `ParserType` and a factory map:

```text
naive, paper, book, presentation, manual, laws, qa, table, resume,
picture, one, audio, email, knowledge_graph, tag
```

AILIS should keep a smaller local enum:

```text
naive, table, presentation, picture, qa, audio, email
```

This gives the model and runtime stable language for "what kind of artifact
world was built".

### 2. Parser Backends Are Optional Adapters

RAGFlow supports backends such as DeepDoc, MinerU, Docling, OpenDataLoader, and
PaddleOCR. AILIS should not make these mandatory.

AILIS adapter policy:

- Default local parsers must stay lightweight.
- Heavy OCR/layout backends are optional worker adapters.
- Parser output must normalize into the same artifact chunk schema.
- If a backend is missing, artifact runtime still works with a lower-fidelity
  parser and says which parser was used.

### 3. Chunk Schema Is The Real Runtime Boundary

RAGFlow's useful boundary is the chunk document, not the raw file parser. AILIS
should accept a RAGFlow-compatible chunk envelope:

```json
{
  "id": "ck-...",
  "artifact_id": "ctx-...",
  "parser_id": "table",
  "doc_type_kwd": "spreadsheet",
  "docnm_kwd": "map.xlsx",
  "chunk_type_kwd": "spreadsheet_row",
  "chunk_order_int": 12,
  "page_num_int": 1,
  "top_int": 0,
  "position_int": [[1, 3, 3, 1, 9]],
  "title_tks": "map row 3",
  "content_with_weight": "Sheet Map row 3: A3=...; E3 fill=F478A7",
  "content_ltks": "sheet map row 3 e3 fill f478a7",
  "content_sm_ltks": "sheet map row 3 e3 fill f478a7",
  "important_kwd": [],
  "chunk_data": {}
}
```

This schema is the bridge contract between the extracted RAGFlow-lite worker and
AILIS.

### 4. Table Runtime Means Row Chunks Plus Metadata

RAGFlow table parser treats table rows as chunks, infers column data types,
maps column roles, and stores typed field names for retrieval/SQL-style use.

RAGFlow-lite first worker target:

- Spreadsheet sheet summary chunks.
- Spreadsheet row chunks.
- Cell address, value, formula, and fill-color text in `content_with_weight`.
- Position data in `position_int`.

Later stages should add:

- Column type inference.
- Column role config: indexing, vectorize, metadata, both.
- Typed field suffixes: `_kwd`, `_long`, `_flt`, `_dt`, `_tks`.

### 5. Search Should Return Candidates, Not Tool Judgement

RAGFlow has full-text search, vector search, fusion, rerank, highlights, and
citations. The important lesson for AILIS is not "tools decide confidence"; it is
"tools return compact candidate evidence with enough structure for the model to
decide".

AILIS bridge contract:

- `artifact_query chunk_search` returns candidate chunks produced by the
  RAGFlow-lite extractor.
- Tool observations must not say evidence is sufficient or high-confidence.
- The model decides whether to query more, compute, render, or answer.

### 6. Prompt Packing Matters

RAGFlow's prompt generator formats chunks, controls token budget, builds
citations, and uses TOC-aware workflows. AILIS should eventually add a composer
that turns selected chunks into a compact answer context.

For now, `chunk_search` returns bounded extracted chunks with:

- `content_with_weight`
- `position_int`
- `chunk_order_int`
- `chunk_data`

This is the minimum viable runtime output.

## What Not To Extract

Do not pull these into local AILIS by default:

- Elasticsearch, Infinity, Milvus, OceanBase, MinIO, Redis.
- RAGFlow's multi-tenant KB services.
- Full Docker deployment.
- RAGFlow web admin UI.
- Mandatory local OCR/layout/reranker/embedding models.
- RAPTOR/GraphRAG as default path.

Those are platform features. AILIS needs a local artifact runtime first.

## Current AILIS Bridge Landing

Implemented corrective bridge slice:

- `electron/ailis-artifact-runtime.cjs`
  - Accepts a RAGFlow-lite runtime envelope from an extractor.
  - Normalizes already-produced RAGFlow chunks.
  - Does not synthesize chunks from raw workbook/text payloads.
  - Marks artifacts as `awaiting_ragflow_extraction` when no extractor output is
    attached.

- `electron/ailis-context-artifact-store.cjs`
  - Stores `artifactRuntime` bridge metadata on every created context artifact.
  - Adds `artifact_query runtime_schema`.
  - Adds `artifact_query chunk_search` / `runtime_search` over extracted chunks.

- `electron/ailis-xlsx-workbook-tool.cjs`
  - Advertises `runtime_schema` and `chunk_search`.
  - Keeps existing deterministic spreadsheet compute path.

- `electron/ailis-tool-contracts.cjs`
  - Exposes the new actions in the tool schema.

- `tests/ailis-artifact-runtime.test.mjs`
  - Verifies that AILIS bridges a provided RAGFlow-lite chunk envelope without
    fabricating chunks from raw artifact payload.

- `vendor/ragflow-lite`
  - Contains the selective upstream RAGFlow snapshot, Apache-2.0 license, and
    extraction manifest.

## Target AILIS Tool World

The final runtime should expose:

```text
artifact_import
  Calls the extracted RAGFlow-lite worker and stages its runtime envelope.

artifact_query
  Exact structural access: summary, range, page, section, chunk_search.

artifact_search
  Optional heavier lexical/vector search across artifacts.

artifact_compute
  Deterministic workers: spreadsheet path, formulas, tables, graphs.

artifact_render
  Render sheet/page/slide/crop to image for visual verification.

artifact_verify
  Check generated outputs and evidence references.
```

AILIS currently has `artifact_query`, `artifact_compute`, and a first
`artifact_import` implementation for the RAGFlow-lite table worker.
`artifact_search` and `artifact_render` are still next modules.

## Next Engineering Phases

### Phase 1: RAGFlow-Lite Bridge

- Keep `ailis-artifact-runtime.cjs` as a bridge only.
- Do not synthesize chunks in Electron from raw artifacts.
- Store artifact-level bridge metadata:
  - parser type
  - parser backend
  - chunk count
  - supported actions
  - render availability
  - compute availability
- Current implementation:
  - `electron/ailis-artifact-import-tool.cjs` calls
    `scripts/ailis-ragflow-lite-worker.py table`.
  - Worker output is stored under `payload.ragflowLiteRuntime`.
  - `artifact_query runtime_schema/chunk_search` reads the stored worker chunks
    directly.
  - `tests/ailis-artifact-import-tool.test.mjs` and
    `tests/ailis-gateway.test.mjs` cover the import -> query chain.

### Phase 2: Extracted RAGFlow Worker

Add `scripts/ailis-ragflow-lite-worker.py` and make it use the vendored
RAGFlow-lite dependency closure:

- XLSX/CSV: start from RAGFlow `rag/app/table.py` and its parser dependencies.
- TXT/MD/PDF/DOCX/PPTX: start from RAGFlow `rag/app/naive.py` and parser
  backend selection.
- Images/scans: start from RAGFlow picture/DeepDoc path.

The worker emits `ragflowLiteRuntime` chunks into AILIS; AILIS stores and exposes
them. Local Python deps are installed with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\bootstrap-ragflow-lite-deps.ps1
```

The bootstrap installs `xpinyin`, `infinity-sdk`, and NLTK `punkt_tab` into
ignored local directories under `vendor/ragflow-lite/`.

### Phase 3: RAGFlow-Lite Search

Search should be extracted from RAGFlow search semantics, not invented in AILIS:

- SQLite FTS5 as default.
- Optional vector index later.
- RAGFlow-style fields and weighted query expansion.
- Search results stay candidate-only.

### Phase 4: Render And Visual Verification

Add `artifact_render`:

- XLSX sheet to HTML/PNG.
- PDF page crop.
- PPT slide PNG.
- Image crop/region.

This is required for GAIA-style map/layout tasks where text extraction alone is
not enough.

### Phase 5: Advanced RAGFlow Features

Only after the local runtime is stable:

- TOC extraction and TOC-aware chunk selection.
- Citation insertion.
- Column type/role inference for tables.
- Optional embeddings/reranker.
- Optional DeepDoc/MinerU/Docling backends.

## Design Rule

Tools should expose compact state and actions. They should not make final answer
confidence judgements for the model.

Bad:

```text
tool: high confidence, answer is probably X
```

Good:

```text
tool: here are candidate chunks, positions, exact cells, render handles,
and deterministic compute outputs
```

The model remains the intelligence layer. The artifact runtime is the operating
system for files.
