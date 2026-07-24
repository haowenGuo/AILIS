# RAGFlow-Lite Extraction Snapshot

This directory is the AILIS extraction workspace for the RAGFlow artifact layer.

It is not a fork of the full RAGFlow platform and it is not an AILIS rewrite of
RAGFlow. The purpose is to keep the upstream code that should drive artifact
parsing/chunking close to AILIS, while AILIS only provides local context storage,
tool exposure, and agent-chain integration.

## Layout

```text
vendor/ragflow-lite/
  LICENSE.ragflow
  README.md
  manifest.json
  requirements.txt
  upstream/
```

`upstream/` contains a selective snapshot of RAGFlow source files flattened by
path name. For example:

```text
rag__app__table.py              -> rag/app/table.py
rag__svr__task_executor.py      -> rag/svr/task_executor.py
common__constants.py            -> common/constants.py
common__doc_store__doc_store_base.py -> common/doc_store/doc_store_base.py
```

The current table path is callable through
`scripts/ailis-ragflow-lite-worker.py`. It imports the upstream `rag/app/table.py`
closure from this flattened snapshot, emits a RAGFlow chunk envelope, and
`artifact_import` stores that envelope as an AILIS context artifact.

Install the small local Python dependency set with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\bootstrap-ragflow-lite-deps.ps1
```

The bootstrap writes to ignored local directories:

- `vendor/ragflow-lite/python-deps/`
- `vendor/ragflow-lite/nltk-data/`

## Boundary

RAGFlow-lite owns:

- parser selection
- parser backend logic
- domain chunkers
- RAGFlow chunk fields
- future lexical/vector search semantics

AILIS owns:

- local artifact registration
- context artifact payload storage
- `artifact_query runtime_schema`
- `artifact_query chunk_search`
- `artifact_compute`
- routing observations to the model

AILIS should not synthesize RAGFlow chunks from raw artifacts unless this is
explicitly marked as a temporary fallback. The normal chain is:

```text
file
  -> RAGFlow-lite extractor
  -> RAGFlow chunk envelope
  -> AILIS context artifact store
  -> artifact_query / artifact_compute
  -> model reasoning
```

## License

RAGFlow source files inspected here carry Apache-2.0 license headers. Keep
`LICENSE.ragflow` with any distributed snapshot and preserve upstream notices for
direct code reuse.

## Current Limits

- The table worker resolves `xpinyin`, `infinity.rag_tokenizer`, and NLTK
  `punkt_tab` through the local bootstrap path.
- Spreadsheet embedded image descriptions are still disabled through a shim.
- RAGFlow `table.py` chunks are row/text oriented and do not preserve Excel fill
  colors. Use AILIS `read_xlsx_workbook` and `artifact_compute` for exact style
  and grid-path tasks.
