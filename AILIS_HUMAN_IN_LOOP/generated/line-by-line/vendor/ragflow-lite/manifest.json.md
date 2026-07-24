# vendor/ragflow-lite/manifest.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`structured-data`
- 原始行数：123
- SHA-256：`3cbb800926418855f4ae8b145e19f2a4999858109118e1c46096187017ab49c7`
- 可运行副本：[打开源文件](../../../../source/vendor/ragflow-lite/manifest.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "name": "ailis-ragflow-lite-extraction",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "version": 1,</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "upstream": {</code> | 结构化数据字段 `upstream`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>    "project": "RAGFlow",</code> | 结构化数据字段 `project`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "repository": "https://github.com/infiniflow/ragflow",</code> | 结构化数据字段 `repository`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>    "license": "Apache-2.0",</code> | 结构化数据字段 `license`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>    "snapshotDirectory": "vendor/ragflow-lite/upstream",</code> | 结构化数据字段 `snapshotDirectory`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    "note": "Selective source snapshot for extracting the artifact parsing/chunking runtime into AILIS."</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 11 | <code>  "boundary": {</code> | 结构化数据字段 `boundary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>    "ragflow_lite_owns": [</code> | 结构化数据字段 `ragflow_lite_owns`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      "parser selection",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 14 | <code>      "parser backend logic",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 15 | <code>      "domain chunkers",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 16 | <code>      "RAGFlow chunk fields",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 17 | <code>      "future search semantics"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 18 | <code>    ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 19 | <code>    "ailis_owns": [</code> | 结构化数据字段 `ailis_owns`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>      "context artifact storage",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>      "tool schema",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 22 | <code>      "agent-chain routing",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 23 | <code>      "compact observations",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 24 | <code>      "deterministic compute tools"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 25 | <code>    ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 26 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 27 | <code>  "sourceFiles": [</code> | 结构化数据字段 `sourceFiles`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 29 | <code>      "snapshot": "rag__svr__task_executor.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>      "upstreamPath": "rag/svr/task_executor.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>      "role": "task pipeline, parser factory, chunk/embedding/index orchestration",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>      "extract": "factory and lifecycle concepts; avoid Redis/DB/platform services"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 34 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 35 | <code>      "snapshot": "common__constants.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>      "upstreamPath": "common/constants.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      "role": "ParserType, PipelineTaskType, LLMType enums",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>      "extract": "parser/task vocabulary"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 40 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 41 | <code>      "snapshot": "common__doc_store__doc_store_base.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>      "upstreamPath": "common/doc_store/doc_store_base.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>      "role": "doc-store search expression abstraction",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>      "extract": "MatchTextExpr, MatchDenseExpr, FusionExpr, OrderByExpr semantics"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 46 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 47 | <code>      "snapshot": "rag__app__table.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>      "upstreamPath": "rag/app/table.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>      "role": "Excel/table parsing and row chunking",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>      "extract": "table artifact worker first"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 52 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 53 | <code>      "snapshot": "rag__app__naive.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>      "upstreamPath": "rag/app/naive.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>      "role": "general document parser/chunker over multiple parser backends",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      "extract": "document artifact worker after table"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 58 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>      "snapshot": "rag__nlp__query.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 60 | <code>      "upstreamPath": "rag/nlp/query.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>      "role": "weighted full-text query construction",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 62 | <code>      "extract": "search expression generation after chunk bridge is stable"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 64 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 65 | <code>      "snapshot": "rag__nlp__search.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>      "upstreamPath": "rag/nlp/search.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>      "role": "hybrid search, rerank, citation insertion",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>      "extract": "candidate retrieval semantics; no tool sufficiency judgement"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 70 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 71 | <code>      "snapshot": "rag__prompts__generator.py",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 72 | <code>      "upstreamPath": "rag/prompts/generator.py",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>      "role": "chunk formatting, prompt packing, citations, TOC workflows",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>      "extract": "context composer after import/search workers"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 76 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 77 | <code>      "snapshot": "deepdoc__README.md",</code> | 结构化数据字段 `snapshot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 78 | <code>      "upstreamPath": "deepdoc/README.md",</code> | 结构化数据字段 `upstreamPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 79 | <code>      "role": "OCR, layout recognition, table structure recognition overview",</code> | 结构化数据字段 `role`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 80 | <code>      "extract": "optional high-fidelity parser backend"</code> | 结构化数据字段 `extract`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 82 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 83 | <code>  "ailisBridge": {</code> | 结构化数据字段 `ailisBridge`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>    "module": "electron/ailis-artifact-runtime.cjs",</code> | 结构化数据字段 `module`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 85 | <code>    "behavior": "accepts normalized RAGFlow-lite runtime chunks and exposes runtime_schema/chunk_search; does not synthesize chunks from raw files",</code> | 结构化数据字段 `behavior`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 86 | <code>    "artifactImportTool": "electron/ailis-artifact-import-tool.cjs",</code> | 结构化数据字段 `artifactImportTool`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>    "tableWorker": "scripts/ailis-ragflow-lite-worker.py",</code> | 结构化数据字段 `tableWorker`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>    "tableWorkerStatus": "upstream rag.app.table.chunk path is callable with platform shims and local Python deps",</code> | 结构化数据字段 `tableWorkerStatus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>    "dependencyBootstrap": {</code> | 结构化数据字段 `dependencyBootstrap`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 90 | <code>      "script": "scripts/bootstrap-ragflow-lite-deps.ps1",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>      "requirements": "vendor/ragflow-lite/requirements.txt",</code> | 结构化数据字段 `requirements`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>      "ignoredTargets": [</code> | 结构化数据字段 `ignoredTargets`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>        "vendor/ragflow-lite/python-deps",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 94 | <code>        "vendor/ragflow-lite/nltk-data"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 95 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>      "packages": [</code> | 结构化数据字段 `packages`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 97 | <code>        "xpinyin",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 98 | <code>        "infinity-sdk",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 99 | <code>        "nltk punkt_tab"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 100 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 101 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 102 | <code>    "requiredEnvelope": {</code> | 结构化数据字段 `requiredEnvelope`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 103 | <code>      "runtime": "ragflow_lite_bridge",</code> | 结构化数据字段 `runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>      "source": "ragflow_extractor",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>      "status": "ready",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>      "parserType": "table&#124;naive&#124;presentation&#124;picture&#124;qa&#124;audio&#124;email",</code> | 结构化数据字段 `parserType`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>      "chunks": [</code> | 结构化数据字段 `chunks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 109 | <code>          "id": "string",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>          "content_with_weight": "string",</code> | 结构化数据字段 `content_with_weight`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>          "position_int": "array",</code> | 结构化数据字段 `position_int`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>          "chunk_order_int": "number",</code> | 结构化数据字段 `chunk_order_int`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>          "chunk_data": "object"</code> | 结构化数据字段 `chunk_data`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 114 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 115 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 116 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 117 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 118 | <code>  "nextImplementation": [</code> | 结构化数据字段 `nextImplementation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>    "Extract RAGFlow query.py/search.py semantics into local artifact_search over stored ragflowLiteRuntime chunks.",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 120 | <code>    "Extract non-table naive.py document chunking after table import/search is stable.",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 121 | <code>    "Keep read_xlsx_workbook/artifact_compute for exact Excel styles because RAGFlow table.py chunks do not preserve fill colors."</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 122 | <code>  ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 123 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
