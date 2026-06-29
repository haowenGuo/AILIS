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

The current snapshot is reference/extraction input. The next implementation
step is to create a Python extraction worker that imports or adapts this upstream
closure directly, then emits a RAGFlow chunk envelope for AILIS.

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
