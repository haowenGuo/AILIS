# RAGFlow-Lite Source Index For AILIS

This index records the selective RAGFlow source snapshot used to design the
AILIS artifact runtime. The source snapshot lives in:

```text
F:\AILIS_self_evolution_runtime\build-cache\ragflow-src
```

The files are reference material. They are not vendored as runtime dependencies.
RAGFlow source files inspected here carry Apache-2.0 headers; any future direct
code reuse must preserve the required license notices.

## Runtime Orchestration

### `rag__svr__task_executor.py`

Core ideas:

- Parser factory maps `ParserType` to chunker modules.
- Task types map to pipeline task types: parse, RAPTOR, GraphRAG, mindmap,
  memory.
- Pipeline shape:
  - collect task
  - initialize parser/model config
  - build chunks
  - optional keyword/question/metadata generation
  - optional TOC
  - embedding
  - insert chunks
  - progress/cancel/error handling

AILIS extraction:

- Keep parser factory and task lifecycle ideas.
- Do not import Redis queues, DB services, MinIO, or platform task services.

## Constants And Interfaces

### `common__constants.py`

Core ideas:

- `ParserType`: presentation, laws, manual, paper, resume, book, qa, table,
  naive, picture, one, audio, email, knowledge_graph, tag.
- `PipelineTaskType`: parse, download, RAPTOR, GraphRAG, mindmap, memory.
- Model types: chat, embedding, speech2text, image2text, rerank, tts, ocr.

AILIS extraction:

- Use a reduced parser enum first: naive, table, presentation, picture, qa,
  audio, email.

### `common__doc_store__doc_store_base.py`

Core ideas:

- Search expressions:
  - `MatchTextExpr`
  - `MatchDenseExpr`
  - `MatchSparseExpr`
  - `MatchTensorExpr`
  - `FusionExpr`
  - `OrderByExpr`
- `DocStoreConnection` abstracts index create/delete/search/insert/get.

AILIS extraction:

- Use the expression vocabulary as the future local search abstraction.
- Implement SQLite FTS5 first, vector search later.

### `common__parser_config_utils.py`

Core ideas:

- Normalizes parser backend names such as MinerU, PaddleOCR, OpenDataLoader.

AILIS extraction:

- Treat parser backend as metadata on every artifact.
- Missing heavy backends must degrade gracefully.

## Domain Chunkers

### `rag__app__table.py`

Core ideas:

- Excel parser loads workbook, extracts rows, headers, images.
- Embedded images can be described by a VLM and attached to the table flow.
- Every row becomes a chunk.
- Column roles can be indexing/vectorize/metadata/both.
- Column types map to typed fields.
- Chinese column names can be converted to pinyin-safe field names.

AILIS extraction:

- Already implemented first slice: sheet summary chunks and spreadsheet row
  chunks.
- Next: column type inference and column roles.

### `rag__app__naive.py`

Core ideas:

- Default document parser path.
- Supports multiple parser backends: DeepDoc, MinerU, Docling, OpenDataLoader,
  PaddleOCR, plain text.
- Configurable chunk token number, delimiter, layout recognizer, hyperlink
  analysis, table/image context sizes.
- Handles embedded files and image/table context.

AILIS extraction:

- Add parser adapters behind `artifact_import`.
- Normalize all outputs into the same chunk schema.

### `rag__app__qa.py`

Core ideas:

- QA documents can be transformed into question-answer chunks.
- Prefix and question-level utilities help chunk structured QA files.

AILIS extraction:

- Keep as a future domain parser for eval datasets and FAQ-like artifacts.

### `rag__app__presentation.py`, `rag__app__paper.py`, `rag__app__manual.py`

Core ideas:

- Domain-specific chunking is not cosmetic; it changes what the model sees.
- Position fields preserve page/layout relation.

AILIS extraction:

- Presentation/PDF adapters should not emit plain text only. They should emit
  positioned sections, tables, images, and render handles.

## Search And Query

### `rag__nlp__query.py`

Core ideas:

- Weighted full-text fields:
  - `title_tks^10`
  - `title_sm_tks^5`
  - `important_kwd^30`
  - `important_tks^20`
  - `question_tks^20`
  - `content_ltks^2`
  - `content_sm_ltks`
- Query normalization handles Chinese/English differently.
- Synonym expansion and phrase boosting are used.

AILIS extraction:

- Current `chunk_search` is only a bridge over chunks already produced by the
  RAGFlow-lite extractor.
- The real search backend should be extracted from this weighted-field query
  logic, not invented in AILIS.

### `rag__nlp__search.py`

Core ideas:

- `Dealer.SearchResult` keeps total, ids, fields, highlight, aggregation,
  keywords, grouped docs, query vector.
- Search path:
  - build full-text query
  - optionally build dense vector query
  - fuse text/dense with `FusionExpr`
  - fallback with lower `min_match`
  - return fields/highlights/aggregations
- Rerank combines token similarity, vector similarity, rank features, tags,
  and optional model reranker.
- Citation insertion embeds answer pieces and aligns them to chunks.

AILIS extraction:

- Search should return candidate evidence, not sufficiency judgement.
- Extract weighted local search first; vector/reranker later.

## Prompt And Output Composition

### `rag__prompts__generator.py`

Core ideas:

- `chunks_format` and `kb_prompt` pack chunks under token budget.
- Citation prompts and citation plus utilities format grounded answers.
- Keyword extraction, question proposal, full-question generation, tagging,
  TOC extraction, and TOC-aware relevance are model-assisted workflows.

AILIS extraction:

- Add an `artifact_compose` or internal context-packing layer later.
- The immediate runtime only exposes chunks and positions.

## DeepDoc

### `deepdoc__README.md`

Core ideas:

- OCR.
- Layout recognition.
- Table structure recognition.
- Table auto-rotation.
- Parsers for PDF, DOCX, Excel, PPT.

AILIS extraction:

- Use as optional high-fidelity backend reference.
- Do not require it for the first local runtime.

## Current AILIS Implementation Mapping

Current files:

- `electron/ailis-artifact-runtime.cjs`
  - RAGFlow-lite bridge. Accepts upstream extractor chunks; does not synthesize
    artifact chunks from raw files.
- `electron/ailis-context-artifact-store.cjs`
  - Artifact registration and query surface.
- `electron/ailis-xlsx-workbook-tool.cjs`
  - Existing spreadsheet parser and deterministic compute affordances. This is
    not the final RAGFlow-lite table extractor.
- `electron/ailis-tool-contracts.cjs`
  - Tool schema.

Next files to add:

- `electron/ailis-artifact-import-tool.cjs`
- `electron/ailis-artifact-render-tool.cjs`
- `scripts/ailis-ragflow-lite-worker.py`
- `tests/ailis-artifact-import-tool.test.mjs`
- `tests/ailis-artifact-render-tool.test.mjs`
