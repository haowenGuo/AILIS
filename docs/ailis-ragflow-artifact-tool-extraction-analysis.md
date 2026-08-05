# AILIS RAGFlow Artifact Tool Extraction Analysis

Status: decision memo, not an implementation plan.

Purpose: analyze what RAGFlow's artifact capability actually is, what code
should be extracted, what dependencies come with it, and how AILIS can decide
whether to integrate it as a worker, sidecar, or deeper runtime package.

## Core Conclusion

RAGFlow's "artifact tool" is not one tool and not one parser. It is a layered
artifact pipeline:

```text
task/file
  -> parser type and parser_config
  -> domain parser/chunker
  -> tokenizer and chunk schema
  -> table/image/layout metadata
  -> doc-store/search expression layer
  -> retrieval/rerank/citation/prompt composer
```

AILIS should not hand-write the artifact core. AILIS should extract this
pipeline into an `AILIS_ARTIFACT_RUNTIME` boundary and keep AILIS responsible
for context, tool routing, local state, UI, and model observations.

## Source Basis

Local upstream snapshot:

```text
F:\AILIS_self_evolution_runtime\vendor\ragflow-lite\upstream
F:\AILIS_self_evolution_runtime\build-cache\ragflow-src
```

Upstream project:

```text
https://github.com/infiniflow/ragflow
```

Important files inspected:

- `rag__svr__task_executor.py`
- `rag__app__table.py`
- `rag__app__naive.py`
- `rag__nlp____init__.py`
- `rag__nlp__query.py`
- `rag__nlp__search.py`
- `common__constants.py`
- `common__doc_store__doc_store_base.py`
- `deepdoc__parser__excel_parser.py`
- `deepdoc__parser__pdf_parser.py`
- `rag__prompts__generator.py`

## RAGFlow Artifact Architecture

### 1. Task Executor Layer

Source: `rag__svr__task_executor.py`

Important code points:

- `FACTORY` maps parser ids to domain modules:
  - `naive`
  - `paper`
  - `book`
  - `presentation`
  - `manual`
  - `qa`
  - `table`
  - `picture`
  - `audio`
  - `email`
  - others
- `build_chunks(task, progress_callback)` is the main ingestion gate.
- It fetches file binary from storage, merges parser config, calls
  `chunker.chunk(...)`, records raw chunks, attaches document metadata, and
  turns chunks into indexed documents.
- It can run post-processing:
  - keyword extraction
  - question proposal
  - metadata generation
  - tagging
  - TOC generation
  - embedding
  - insertion into doc store

What AILIS needs:

- Parser factory idea.
- Parser config contract.
- Progress/cancel/error contract.
- Chunk output format.

What AILIS should not import directly:

- Redis queues.
- MinIO storage.
- RAGFlow DB services.
- Tenant/user/KB services.
- Full task manager.

AILIS extraction boundary:

```text
AILIS calls worker with:
  file_path | file_bytes
  parser_id
  parser_config
  language

Worker returns:
  chunks
  parser metadata
  field_map
  table_column_names
  render handles, if any
  warnings/errors
```

### 2. Parser Type Layer

Source: `common__constants.py`

RAGFlow parser vocabulary:

```text
presentation, laws, manual, paper, resume, book, qa, table, naive,
picture, one, audio, email, knowledge_graph, tag
```

AILIS likely needs this reduced first set:

```text
table
naive
presentation
picture
qa
audio
email
```

Do not over-reduce too early. The parser id is an important abstraction because
different artifact types need different chunk semantics.

### 3. Table Artifact Path

Source: `rag__app__table.py`

This is the best first extraction target because it is useful for GAIA-style
structured spreadsheet tasks and has a smaller dependency closure than PDF
layout parsing.

Real call chain:

```text
table.chunk(filename, binary, parser_config, kb_id, tenant_id, callback)
  -> if .xlsx: Excel().__call__
       -> RAGFlowExcelParser._load_excel_to_workbook
       -> _extract_images_from_worksheet
       -> _parse_headers
       -> _extract_row_data
       -> DataFrame per sheet
       -> optional VLM figure descriptions for embedded images
  -> if .txt/.csv: parse rows into DataFrame
  -> infer column data types
  -> build pinyin/safe field names
  -> merge field_map/table_column_names
  -> per row:
       d = {docnm_kwd, title_tks}
       text_fields from columns whose role is indexing/vectorize/both
       stored fields from columns whose role is metadata/both
       tokenize(d, formatted_text, language)
       append d
  -> tokenize_table(tbls, doc, is_english) for image/table artifacts
  -> return chunks
```

Important details:

- Every table row is treated as a chunk.
- Column roles matter:
  - `indexing`
  - `vectorize`
  - `metadata`
  - `both`
- `field_map` and `table_column_names` are not incidental; they power later
  structured retrieval and UI field selection.
- Column type suffixes:
  - text: `_tks`
  - int: `_long`
  - keyword/bool: `_kwd`
  - float: `_flt`
  - datetime: `_dt`
- For Chinese headers, RAGFlow converts names to pinyin-safe field ids.
- Images embedded in spreadsheets are extracted and can be described by a
  vision model, then attached either to cells or flow images.

Minimum code to extract for table:

- Keep:
  - `rag/app/table.py`
  - `deepdoc/parser/excel_parser.py`
  - `deepdoc/parser/utils.py`
  - `rag/nlp/__init__.py` functions:
    - `tokenize`
    - `tokenize_table`
  - `rag/nlp/rag_tokenizer.py`
  - `common/token_utils.py`
  - `common/parser_config_utils.py`
  - `common/constants.py`
- Replace with AILIS shims:
  - `api.db.services.knowledgebase_service.KnowledgebaseService`
  - `common.settings`
  - RAGFlow storage services
  - tenant/model service access
  - optional figure VLM wrapper

Table extraction output should be:

```json
{
  "runtime": "ragflow_lite",
  "source": "ragflow.table.chunk",
  "parserType": "table",
  "status": "ready",
  "field_map": {},
  "table_column_names": [],
  "chunks": []
}
```

Important limitation:

RAGFlow `table.py` is a table/record chunker. It does not preserve Excel cell
styles such as fill colors, borders, or a visual grid map. It is therefore not
enough by itself for GAIA tasks like "follow a colored Excel map and report the
hex color of a landing cell". Those tasks still require one of:

- AILIS style-aware spreadsheet grid tooling.
- A deterministic `artifact_compute` worker over cell styles.
- `artifact_render` plus visual/layout verification.
- A later DeepDoc/render path if the spreadsheet is treated as a visual artifact.

So "table first" means first extracting RAGFlow's structured-table artifact
tool. It does not replace the existing style-aware Excel map tooling.

### 4. Naive Document Path

Source: `rag__app__naive.py`

This is the general document parser and is much larger. It handles:

- DOCX
- PDF
- CSV/XLSX through a simpler path
- TXT/code files
- Markdown/MDX
- HTML
- EPUB
- JSON/JSONL
- DOC through Tika fallback
- embedded files
- hyperlinks
- tables/images
- optional vision enhancement

Real call chain:

```text
naive.chunk(filename, binary, parser_config, ...)
  -> choose branch by file extension
  -> choose parser backend:
       DeepDOC
       MinerU
       Docling
       OpenDataLoader
       PaddleOCR
       PlainText
  -> produce sections/tables/images
  -> merge sections by token budget and delimiter
  -> tokenize_table(tables)
  -> tokenize_chunks / tokenize_chunks_with_images
  -> attach PDF outline if present
  -> return chunks
```

Important parser_config values:

- `chunk_token_num`
- `delimiter`
- `layout_recognize`
- `analyze_hyperlink`
- `children_delimiter`
- `table_context_size`
- `image_context_size`
- `overlapped_percent`
- `html4excel`

Extraction implication:

- Do not start with full `naive.py` if the goal is quick stability.
- Start with table extraction first.
- Then add a controlled `naive-text` path.
- Then add PDF/DOCX layout path.
- DeepDoc/PDF path should be a later extraction because it brings heavy vision,
  OCR, pdfplumber, layout recognizer, xgboost, huggingface downloads, etc.

### 5. DeepDoc Parser Layer

Sources:

- `deepdoc__README.md`
- `deepdoc__parser__pdf_parser.py`
- `deepdoc__parser__excel_parser.py`
- `deepdoc__parser__docx_parser.py`
- `deepdoc__parser__ppt_parser.py`

DeepDoc is RAGFlow's high-fidelity document understanding layer:

- OCR.
- Layout recognition.
- Table structure recognition.
- PDF page images.
- Table/figure extraction.
- Cropping by text/position.
- Table auto-rotation.

Important PDF code points:

- `RAGFlowPdfParser`
- `_layouts_rec`
- `_table_transformer_job`
- `_extract_table_figure`
- `crop`
- `PlainParser`
- `VisionParser`

AILIS should treat this as a high-value but high-cost extraction:

- Worth extracting for PDF/map/layout GAIA tasks.
- Too heavy for first artifact runtime iteration.
- Should be optional worker backend, not Electron code.

### 6. Tokenizer And Chunk Schema Layer

Sources:

- `rag__nlp____init__.py`
- `rag__nlp__rag_tokenizer.py`

Important functions:

- `tokenize(d, txt, eng)`
- `tokenize_chunks`
- `doc_tokenize_chunks_with_images`
- `tokenize_chunks_with_images`
- `tokenize_table`
- `add_positions`
- `naive_merge`
- `naive_merge_with_images`
- `naive_merge_docx`

This layer is not optional. It creates the RAGFlow chunk fields that downstream
search expects:

```text
content_with_weight
content_ltks
content_sm_ltks
title_tks
title_sm_tks
position_int
page_num_int
top_int
img_id
chunk_order_int
docnm_kwd
```

Important complication:

`rag_tokenizer.py` depends on `infinity.rag_tokenizer`. That means the tokenizer
closure may be heavier than it looks. AILIS has three options:

- Extract and package the upstream tokenizer dependency exactly.
- Use RAGFlow's tokenizer when available and mark fallback as degraded.
- Replace tokenizer temporarily, but that weakens the "not hand-written" goal.

My recommendation: try to preserve the upstream tokenizer first.

### 7. Search Layer

Sources:

- `common__doc_store__doc_store_base.py`
- `rag__nlp__query.py`
- `rag__nlp__search.py`

RAGFlow search is not simple snippet matching.

Search call chain:

```text
Dealer.retrieval(...)
  -> Dealer.search(...)
       -> FulltextQueryer.question(...)
       -> MatchTextExpr
       -> optional MatchDenseExpr
       -> optional FusionExpr("weighted_sum")
       -> dataStore.search(...)
       -> highlight / aggregation / fields
  -> rerank / rerank_by_model / rerank_with_knn
  -> return chunks with positions/highlights/scores
```

Weighted full-text fields from `FulltextQueryer`:

```text
title_tks^10
title_sm_tks^5
important_kwd^30
important_tks^20
question_tks^20
content_ltks^2
content_sm_ltks
```

Dense fusion:

```text
FusionExpr("weighted_sum", topk, {"weights": "0.05,0.95"})
```

AILIS extraction implication:

- The first AILIS search backend should implement RAGFlow's `DocStoreConnection`
  interface locally.
- SQLite FTS5 can be the local doc store, but the expression vocabulary should
  stay RAGFlow-shaped.
- `artifact_query chunk_search` should remain a bridge, not the final search
  engine.
- `artifact_search` should be the RAGFlow-compatible search tool.

### 8. Prompt/Citation Composer

Source: `rag__prompts__generator.py`

Useful functions:

- `chunks_format`
- `kb_prompt`
- `citation_prompt`
- `citation_plus`
- `keyword_extraction`
- `question_proposal`
- `detect_table_of_contents`
- `run_toc_from_text`
- `relevant_chunks_with_toc`
- `sufficiency_check`
- `multi_queries_gen`

AILIS does not need all of these immediately. The important design idea is that
RAGFlow has a separate composer layer that formats retrieved chunks under a token
budget with citations and positions.

AILIS should eventually have:

```text
artifact_compose
  inputs: artifactId, chunkIds/searchResultIds, question, tokenBudget
  output: compact context pack for the model
```

## Artifact Tools AILIS Should Extract

### Tool 1: `artifact_import`

Role:

- Calls RAGFlow-lite worker.
- Produces artifact runtime envelope.
- Registers artifact in AILIS context store.

Backend:

```text
scripts/ailis-ragflow-lite-worker.py parse
```

Inputs:

```json
{
  "path": "...",
  "parser_id": "table|naive|presentation|picture",
  "parser_config": {},
  "language": "Chinese|English"
}
```

Output:

```json
{
  "artifactId": "ctx-...",
  "runtime": "ragflow_lite",
  "parserType": "table",
  "chunks": [],
  "field_map": {},
  "table_column_names": [],
  "warnings": []
}
```

### Tool 2: `artifact_query`

Role:

- AILIS-owned context tool.
- Reads stored artifact envelope.
- Exposes:
  - `runtime_schema`
  - `chunk`
  - `chunk_search`
  - exact structure queries if available

This should not perform RAGFlow parsing.

### Tool 3: `artifact_search`

Role:

- RAGFlow-compatible retrieval over stored chunks.
- Should use extracted search semantics from `query.py/search.py`.

Backends:

- Phase 1: SQLite FTS5 implementing enough of `DocStoreConnection`.
- Phase 2: optional vector store.
- Phase 3: optional reranker.

### Tool 4: `artifact_render`

Role:

- Render or crop artifact views.

Possible upstream sources:

- `deepdoc/parser/pdf_parser.py` crop/position machinery.
- `deepdoc/parser/excel_parser.py` HTML table output.
- AILIS browser/Playwright can render final HTML/PNG, but the extraction of
  positions/layout should come from RAGFlow/DeepDoc where possible.

### Tool 5: `artifact_compute`

Role:

- Deterministic data workers: path finding, graph traversal, formulas,
  aggregations.

This is more AILIS-owned than RAGFlow-owned. RAGFlow is mostly parse/search/RAG;
GAIA-style spreadsheet path solving is a deterministic compute layer on top.

### Tool 6: `artifact_compose`

Role:

- Packs retrieved chunks into model-ready context.
- Eventually extracts from `rag/prompts/generator.py`.

## Extraction Options

### Option A: Python Worker Around RAGFlow Extraction Closure

Recommended first.

Shape:

```text
Electron AILIS
  -> scripts/ailis-ragflow-lite-worker.py
       -> vendor/ragflow-lite/upstream + shims
       -> table.chunk / naive.chunk
  -> JSON envelope
  -> AILIS context artifact store
```

Pros:

- Keeps RAGFlow artifact logic in Python, close to upstream.
- Avoids full RAGFlow server.
- Lets AILIS control context and tool UX.
- Easier to test with local files.

Cons:

- Need shims for RAGFlow DB/settings/model services.
- Need dependency closure management.
- Some RAGFlow imports may be hard to isolate.

### Option B: RAGFlow Sidecar Service

Shape:

```text
AILIS
  -> local RAGFlow-lite HTTP service
  -> parse/search/render endpoints
```

Pros:

- Cleaner process boundary.
- Can preserve more RAGFlow code unchanged.
- Easier to add heavy OCR/layout later.

Cons:

- More operational complexity.
- Need service lifecycle management.
- Moves toward "run RAGFlow" instead of "extract RAGFlow artifact tool".

### Option C: Full RAGFlow Platform Integration

Not recommended now.

Pros:

- Highest fidelity.

Cons:

- Brings Docker/service/database stack.
- Too heavy for AILIS local agent runtime.
- AILIS loses control over local artifact UX.

## Recommended Extraction Order

### Phase 0: Keep Current Bridge

Keep:

- `electron/ailis-artifact-runtime.cjs` as bridge only.
- `vendor/ragflow-lite` as extraction workspace.
- Current context artifact store and tool schema.

Do not:

- Continue hand-writing chunkers in Electron.

### Phase 1: Table Extractor

Goal:

```text
xlsx/csv/txt -> RAGFlow table chunks -> AILIS artifact envelope
```

Implementation targets:

- `scripts/ailis-ragflow-lite-worker.py`
- `scripts/bootstrap-ragflow-lite-deps.ps1`
- `vendor/ragflow-lite/requirements.txt`
- `electron/ailis-artifact-import-tool.cjs`

Hard dependency decisions:

- `xpinyin` and `infinity.rag_tokenizer` are packaged as local Python deps via
  `vendor/ragflow-lite/requirements.txt`.
- NLTK `punkt_tab` is downloaded into `vendor/ragflow-lite/nltk-data`.
- Whether VLM spreadsheet image description is enabled or stubbed.
- `field_map`, table column names, warnings, and chunks persist in the AILIS
  context artifact payload under `ragflowLiteRuntime`.

Current status:

- `scripts/ailis-ragflow-lite-worker.py` exists.
- It dynamically loads upstream `vendor/ragflow-lite/upstream/rag__app__table.py`.
- `scripts/bootstrap-ragflow-lite-deps.ps1` installs the two small runtime deps
  into `vendor/ragflow-lite/python-deps` and NLTK data into
  `vendor/ragflow-lite/nltk-data`; both directories are intentionally ignored
  by Git.
- It uses shims for RAGFlow platform services:
  - `KnowledgebaseService.update_parser_config`
  - `common.settings`
  - spreadsheet figure parser
- `artifact_import` now calls the worker, registers the returned
  `ragflowLiteRuntime` in `AILISContextArtifactStore`, and returns next-step
  `artifact_query runtime_schema/chunk_search` hints.
- Test coverage:
  - `tests/ailis-ragflow-lite-worker.test.mjs`
  - `tests/ailis-artifact-import-tool.test.mjs`
  - `tests/ailis-gateway.test.mjs`

Known degraded pieces:

- Spreadsheet embedded image descriptions are disabled until the figure parser
  path is extracted.
- RAGFlow `table.py` row chunks do not preserve Excel fill colors. GAIA-style
  color map tasks still need `read_xlsx_workbook` / `artifact_compute` for exact
  styles while `artifact_import` provides RAGFlow-shaped table chunks.

### Phase 2: Local RAGFlow Search

Goal:

```text
chunks -> SQLite FTS RAGFlow-shaped doc store -> artifact_search
```

Extract:

- `common/doc_store/doc_store_base.py`
- `rag/nlp/query.py`
- relevant parts of `rag/nlp/search.py`

Implement:

- Local `DocStoreConnection` adapter.
- Weighted field mapping.
- Highlight/position output.

### Phase 3: Naive Text/HTML/Markdown

Goal:

```text
txt/md/html/json -> naive chunks -> artifact_search
```

Use a smaller subset of `naive.py` before touching PDF/DOCX.

### Phase 4: PDF/DOCX/DeepDoc

Goal:

```text
pdf/docx/pptx -> layout/table/image chunks + render handles
```

This is high-value but dependency-heavy.

Extract:

- DeepDoc parser subset.
- PDF crop/render hooks.
- Table/image context.

### Phase 5: Compose/Citation

Goal:

```text
retrieved chunks -> compact model context with citations
```

Extract:

- `chunks_format`
- `kb_prompt`
- citation utilities
- TOC-aware retrieval if useful

## Concrete Dependency Closures

### Table Extractor Closure

Likely required Python packages:

- pandas
- numpy
- openpyxl
- python-dateutil
- xpinyin
- Pillow
- chardet
- infinity-sdk for `infinity.rag_tokenizer`

RAGFlow modules:

- `rag.app.table`
- `deepdoc.parser.excel_parser`
- `deepdoc.parser.utils`
- `rag.nlp`
- `rag.nlp.rag_tokenizer`
- `common.constants`
- `common.token_utils`
- `common.parser_config_utils`
- `common.settings` shim

AILIS shims:

- `KnowledgebaseService.update_parser_config`
  - Instead of DB write, collect updates into output JSON.
- `settings`
  - `DOC_ENGINE_INFINITY`
  - `DOC_ENGINE_OCEANBASE`
  - any doc-engine flags used by table path.
- figure parser
  - either actual upstream figure VLM path or no-op with warning.

### Naive/PDF Closure

Likely required packages:

- pdfplumber
- pypdf
- python-docx
- markdown
- markdownify
- beautifulsoup4
- mammoth
- Pillow
- xgboost
- scikit-learn
- huggingface_hub
- optional OCR/layout packages/models

This should be delayed until table extraction and local search are working.

## Decision Points For You

1. First artifact family:
   - table/spreadsheet first
   - PDF/document first
   - both in parallel

2. Runtime shape:
   - Python worker CLI
   - local sidecar HTTP service
   - deeper Python package embedded under AILIS

3. Tokenizer fidelity:
   - preserve RAGFlow/infinity tokenizer exactly
   - allow temporary fallback tokenizer with clear degraded label

4. Search fidelity:
   - only bridge chunks first
   - immediately extract RAGFlow query/search semantics

5. Heavy parser policy:
   - keep DeepDoc optional
   - bundle DeepDoc dependencies by default
   - use external sidecar for DeepDoc

## My Recommendation

Use Option A first:

```text
RAGFlow-lite Python worker + AILIS bridge
```

Start with table extraction, because it has the best value/cost ratio and
directly addresses recent GAIA Excel failures.

Then build `artifact_search` around RAGFlow's `DocStoreConnection` shape with a
SQLite FTS adapter. Only after table and search are stable should AILIS attempt
DeepDoc/PDF extraction.

This gives AILIS its own artifact runtime identity without throwing away the
engineering intelligence inside RAGFlow.
