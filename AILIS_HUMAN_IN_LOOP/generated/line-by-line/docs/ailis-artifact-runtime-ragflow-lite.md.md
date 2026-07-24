# docs/ailis-artifact-runtime-ragflow-lite.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`documentation`
- 原始行数：345
- SHA-256：`56a5e7b4af2933bc11d8225c67153489c0b17f1ef2cb98db222c0717d77ee16e`
- 可运行副本：[打开源文件](../../../source/docs/ailis-artifact-runtime-ragflow-lite.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Artifact Runtime: RAGFlow-Lite Extraction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Status: active engineering blueprint.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This document defines how AILIS should extract the useful artifact-runtime layer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>from RAGFlow without importing RAGFlow's full deployment platform.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>The goal is not a small Excel fix. The goal is a local runtime that turns complex</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>files into a model-operable world: structured chunks, positions, search, render</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>hooks, deterministic compute workers, and compact observations that guide the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>model without replacing its judgement.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>## Source Snapshot</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>RAGFlow source was inspected from a selective raw snapshot under:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>F:\AILIS_self_evolution_runtime\build-cache\ragflow-src</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>The same selective snapshot is now organized as a vendored extraction workspace:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 24 | <code>F:\AILIS_self_evolution_runtime\vendor\ragflow-lite</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>The full `git clone` path was not available in this Windows/network session, but</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>raw GitHub source downloads succeeded. The vendored snapshot is extraction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>input, not a replacement implementation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>Important source files in the snapshot:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>- `rag__svr__task_executor.py`: task orchestration, parser factory, chunk build,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>  embedding, insertion, progress, cancellation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>- `common__constants.py`: `ParserType`, `PipelineTaskType`, model types, task</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>  status enums.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>- `common__doc_store__doc_store_base.py`: search expression interfaces such as</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>  `MatchTextExpr`, `MatchDenseExpr`, `FusionExpr`, `OrderByExpr`, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  `DocStoreConnection`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>- `rag__app__table.py`: Excel/table parser and row-as-chunk conversion.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `rag__app__naive.py`: default document chunker and multi-backend parser</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>  selection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>- `rag__nlp__search.py`: hybrid full-text/vector search, fallback search,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>  highlighting, reranking, citation insertion.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>- `rag__nlp__query.py`: full-text query expansion and weighted fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- `rag__prompts__generator.py`: chunk formatting, KB prompt packing, citations,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>  keyword extraction, question proposal, TOC workflows.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>- `deepdoc__README.md` and `deepdoc__parser__*.py`: OCR/layout/table/document</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>  parsing strategy.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>## What RAGFlow Actually Gives Us</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>RAGFlow's core value is not "parse a file". It is a complete artifact pipeline:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 56 | <code>file/task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  -&gt; parser type selection</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>  -&gt; domain parser backend</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>  -&gt; normalized sections/tables/images</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>  -&gt; domain chunker</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>  -&gt; RAG fields</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>  -&gt; lexical/vector indexes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>  -&gt; compact retrieval results</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>  -&gt; prompt/citation composer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>  -&gt; async task lifecycle</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>For AILIS, the artifact chain should preserve this RAGFlow shape. AILIS should</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>not hand-build a parallel artifact implementation; it should host and expose the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>RAGFlow-lite extractor output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>## Core RAGFlow Ideas To Extract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>### 1. Parser Factory</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>RAGFlow uses `ParserType` and a factory map:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 79 | <code>naive, paper, book, presentation, manual, laws, qa, table, resume,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>picture, one, audio, email, knowledge_graph, tag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>AILIS should keep a smaller local enum:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 86 | <code>naive, table, presentation, picture, qa, audio, email</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>This gives the model and runtime stable language for "what kind of artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>world was built".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>### 2. Parser Backends Are Optional Adapters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>RAGFlow supports backends such as DeepDoc, MinerU, Docling, OpenDataLoader, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>PaddleOCR. AILIS should not make these mandatory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>AILIS adapter policy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>- Default local parsers must stay lightweight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- Heavy OCR/layout backends are optional worker adapters.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- Parser output must normalize into the same artifact chunk schema.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- If a backend is missing, artifact runtime still works with a lower-fidelity</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>  parser and says which parser was used.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>### 3. Chunk Schema Is The Real Runtime Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>RAGFlow's useful boundary is the chunk document, not the raw file parser. AILIS</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>should accept a RAGFlow-compatible chunk envelope:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 111 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>  "id": "ck-...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  "artifact_id": "ctx-...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  "parser_id": "table",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  "doc_type_kwd": "spreadsheet",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  "docnm_kwd": "map.xlsx",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>  "chunk_type_kwd": "spreadsheet_row",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>  "chunk_order_int": 12,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  "page_num_int": 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>  "top_int": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>  "position_int": [[1, 3, 3, 1, 9]],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>  "title_tks": "map row 3",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>  "content_with_weight": "Sheet Map row 3: A3=...; E3 fill=F478A7",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>  "content_ltks": "sheet map row 3 e3 fill f478a7",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>  "content_sm_ltks": "sheet map row 3 e3 fill f478a7",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>  "important_kwd": [],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>  "chunk_data": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>This schema is the bridge contract between the extracted RAGFlow-lite worker and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>AILIS.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>### 4. Table Runtime Means Row Chunks Plus Metadata</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>RAGFlow table parser treats table rows as chunks, infers column data types,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>maps column roles, and stores typed field names for retrieval/SQL-style use.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>RAGFlow-lite first worker target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>- Spreadsheet sheet summary chunks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>- Spreadsheet row chunks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- Cell address, value, formula, and fill-color text in `content_with_weight`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- Position data in `position_int`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>Later stages should add:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>- Column type inference.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 149 | <code>- Column role config: indexing, vectorize, metadata, both.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>- Typed field suffixes: `_kwd`, `_long`, `_flt`, `_dt`, `_tks`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>### 5. Search Should Return Candidates, Not Tool Judgement</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>RAGFlow has full-text search, vector search, fusion, rerank, highlights, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>citations. The important lesson for AILIS is not "tools decide confidence"; it is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>"tools return compact candidate evidence with enough structure for the model to</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>decide".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>AILIS bridge contract:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>- `artifact_query chunk_search` returns candidate chunks produced by the</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>  RAGFlow-lite extractor.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>- Tool observations must not say evidence is sufficient or high-confidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- The model decides whether to query more, compute, render, or answer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>### 6. Prompt Packing Matters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>RAGFlow's prompt generator formats chunks, controls token budget, builds</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>citations, and uses TOC-aware workflows. AILIS should eventually add a composer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>that turns selected chunks into a compact answer context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>For now, `chunk_search` returns bounded extracted chunks with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 174 | <code>- `content_with_weight`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>- `position_int`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- `chunk_order_int`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- `chunk_data`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>This is the minimum viable runtime output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>## What Not To Extract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>Do not pull these into local AILIS by default:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>- Elasticsearch, Infinity, Milvus, OceanBase, MinIO, Redis.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 186 | <code>- RAGFlow's multi-tenant KB services.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 187 | <code>- Full Docker deployment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>- RAGFlow web admin UI.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>- Mandatory local OCR/layout/reranker/embedding models.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 190 | <code>- RAPTOR/GraphRAG as default path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>Those are platform features. AILIS needs a local artifact runtime first.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>## Current AILIS Bridge Landing</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>Implemented corrective bridge slice:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>- `electron/ailis-artifact-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>  - Accepts a RAGFlow-lite runtime envelope from an extractor.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>  - Normalizes already-produced RAGFlow chunks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>  - Does not synthesize chunks from raw workbook/text payloads.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>  - Marks artifacts as `awaiting_ragflow_extraction` when no extractor output is</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>    attached.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>- `electron/ailis-context-artifact-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 206 | <code>  - Stores `artifactRuntime` bridge metadata on every created context artifact.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 207 | <code>  - Adds `artifact_query runtime_schema`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 208 | <code>  - Adds `artifact_query chunk_search` / `runtime_search` over extracted chunks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>- `electron/ailis-xlsx-workbook-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>  - Advertises `runtime_schema` and `chunk_search`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 212 | <code>  - Keeps existing deterministic spreadsheet compute path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>- `electron/ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 215 | <code>  - Exposes the new actions in the tool schema.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>- `tests/ailis-artifact-runtime.test.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 218 | <code>  - Verifies that AILIS bridges a provided RAGFlow-lite chunk envelope without</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 219 | <code>    fabricating chunks from raw artifact payload.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>- `vendor/ragflow-lite`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>  - Contains the selective upstream RAGFlow snapshot, Apache-2.0 license, and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>    extraction manifest.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>## Target AILIS Tool World</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>The final runtime should expose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 230 | <code>artifact_import</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  Calls the extracted RAGFlow-lite worker and stages its runtime envelope.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>artifact_query</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>  Exact structural access: summary, range, page, section, chunk_search.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>artifact_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>  Optional heavier lexical/vector search across artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>artifact_compute</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>  Deterministic workers: spreadsheet path, formulas, tables, graphs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>artifact_render</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>  Render sheet/page/slide/crop to image for visual verification.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>artifact_verify</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>  Check generated outputs and evidence references.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>AILIS currently has `artifact_query`, `artifact_compute`, and a first</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>`artifact_import` implementation for the RAGFlow-lite table worker.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>`artifact_search` and `artifact_render` are still next modules.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>## Next Engineering Phases</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>### Phase 1: RAGFlow-Lite Bridge</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>- Keep `ailis-artifact-runtime.cjs` as a bridge only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- Do not synthesize chunks in Electron from raw artifacts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>- Store artifact-level bridge metadata:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>  - parser type</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>  - parser backend</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 262 | <code>  - chunk count</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 263 | <code>  - supported actions</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 264 | <code>  - render availability</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 265 | <code>  - compute availability</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 266 | <code>- Current implementation:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 267 | <code>  - `electron/ailis-artifact-import-tool.cjs` calls</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 268 | <code>    `scripts/ailis-ragflow-lite-worker.py table`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>  - Worker output is stored under `payload.ragflowLiteRuntime`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 270 | <code>  - `artifact_query runtime_schema/chunk_search` reads the stored worker chunks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 271 | <code>    directly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>  - `tests/ailis-artifact-import-tool.test.mjs` and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>    `tests/ailis-gateway.test.mjs` cover the import -&gt; query chain.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>### Phase 2: Extracted RAGFlow Worker</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>Add `scripts/ailis-ragflow-lite-worker.py` and make it use the vendored</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>RAGFlow-lite dependency closure:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>- XLSX/CSV: start from RAGFlow `rag/app/table.py` and its parser dependencies.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>- TXT/MD/PDF/DOCX/PPTX: start from RAGFlow `rag/app/naive.py` and parser</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>  backend selection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>- Images/scans: start from RAGFlow picture/DeepDoc path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>The worker emits `ragflowLiteRuntime` chunks into AILIS; AILIS stores and exposes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>them. Local Python deps are installed with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 289 | <code>powershell -ExecutionPolicy Bypass -File scripts\bootstrap-ragflow-lite-deps.ps1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>The bootstrap installs `xpinyin`, `infinity-sdk`, and NLTK `punkt_tab` into</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>ignored local directories under `vendor/ragflow-lite/`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>### Phase 3: RAGFlow-Lite Search</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>Search should be extracted from RAGFlow search semantics, not invented in AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>- SQLite FTS5 as default.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 300 | <code>- Optional vector index later.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 301 | <code>- RAGFlow-style fields and weighted query expansion.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 302 | <code>- Search results stay candidate-only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>### Phase 4: Render And Visual Verification</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>Add `artifact_render`:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>- XLSX sheet to HTML/PNG.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 309 | <code>- PDF page crop.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 310 | <code>- PPT slide PNG.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 311 | <code>- Image crop/region.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>This is required for GAIA-style map/layout tasks where text extraction alone is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>not enough.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>### Phase 5: Advanced RAGFlow Features</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>Only after the local runtime is stable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>- TOC extraction and TOC-aware chunk selection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 321 | <code>- Citation insertion.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 322 | <code>- Column type/role inference for tables.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 323 | <code>- Optional embeddings/reranker.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- Optional DeepDoc/MinerU/Docling backends.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>## Design Rule</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Tools should expose compact state and actions. They should not make final answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>confidence judgements for the model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 331 | <code>Bad:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 334 | <code>tool: high confidence, answer is probably X</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>Good:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 340 | <code>tool: here are candidate chunks, positions, exact cells, render handles,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>and deterministic compute outputs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>The model remains the intelligence layer. The artifact runtime is the operating</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>system for files.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
