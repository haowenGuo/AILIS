# evals/benchmark-catalog/ailis-benchmark-catalog.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：226
- SHA-256：`5e60f1df47fb00a04542e6b52af2c06681d6e3c6b8554df3d17a7c2c01ef8ecb`
- 可运行副本：[打开源文件](../../../../source/evals/benchmark-catalog/ailis-benchmark-catalog.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "version": 1,</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "updatedAt": "2026-06-30",</code> | 结构化数据字段 `updatedAt`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "purpose": "Benchmark catalog for AILIS optimization. Benchmarks are regression signals, not hard-coded task solvers.",</code> | 结构化数据字段 `purpose`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "local": [</code> | 结构化数据字段 `local`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 7 | <code>      "id": "ailis-artifact-tools",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>      "category": "artifact_runtime",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>      "script": "pnpm eval:artifact-tools:run",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>      "status": "runnable",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>      "latestLocalResult": {</code> | 结构化数据字段 `latestLocalResult`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>        "total": 10,</code> | 结构化数据字段 `total`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>        "passed": 10,</code> | 结构化数据字段 `passed`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>        "failed": 0,</code> | 结构化数据字段 `failed`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>        "blocked": 0</code> | 结构化数据字段 `blocked`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 17 | <code>      "measures": ["large_file_handling", "artifact_search", "render", "roundtrip", "tool_observation_compaction"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>      "gaps": ["larger stress fixtures", "scanned PDF/OCR", "native DOCX/PPTX layout renderer", "large JSON/CSV"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 20 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>      "id": "ailis-humanlike",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>      "category": "persona_memory_relationship",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>      "script": "pnpm eval:ailis-humanlike:validate",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>      "status": "runnable",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>      "latestLocalResult": {</code> | 结构化数据字段 `latestLocalResult`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>        "scenarios": 1000,</code> | 结构化数据字段 `scenarios`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>        "validation": "passed"</code> | 结构化数据字段 `validation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 29 | <code>      "measures": ["persona_style", "affinity_stage", "memory_context_use", "anti_pattern_avoidance"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>      "gaps": ["real LLM judge", "Raw Memory Ledger extraction evaluation", "longitudinal preference drift checks"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 32 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 33 | <code>      "id": "ailis-execution-bench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>      "category": "tool_execution_runtime",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>      "script": "pnpm ailis:benchmark-execution",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>      "status": "runnable",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      "latestLocalResult": {</code> | 结构化数据字段 `latestLocalResult`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>        "codeRepair": true,</code> | 结构化数据字段 `codeRepair`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>        "processSession": true,</code> | 结构化数据字段 `processSession`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>        "safety": true,</code> | 结构化数据字段 `safety`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>        "transcript": true</code> | 结构化数据字段 `transcript`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 43 | <code>      "measures": ["code_repair", "pty_session", "permission_policy", "transcript_integrity"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>      "gaps": ["real model task loop", "cross-platform shell matrix", "token and cost metrics"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 46 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 47 | <code>      "id": "ailis-speed-bench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>      "category": "performance_cost",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>      "script": "node scripts/run-ailis-speed-bench.mjs",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>      "status": "too_heavy_for_default_smoke",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>      "latestLocalResult": {</code> | 结构化数据字段 `latestLocalResult`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>        "taskId": "playwright_waiting_comparison",</code> | 结构化数据字段 `taskId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>        "status": "max_steps_reached",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>        "durationMs": 110726,</code> | 结构化数据字段 `durationMs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>        "modelWaitMs": 102103,</code> | 结构化数据字段 `modelWaitMs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>        "toolMs": 8120,</code> | 结构化数据字段 `toolMs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>        "maxApproxInputTokens": 12933</code> | 结构化数据字段 `maxApproxInputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>      "measures": ["llm_wait", "tool_wait", "prompt_size", "agent_steps", "output_success"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 60 | <code>      "gaps": ["smoke mode", "task limit", "hard timeout summary", "short no-network tasks"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 62 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 63 | <code>      "id": "osworld-readiness",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>      "category": "desktop_gui_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>      "script": "pnpm bench:osworld:readiness",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>      "status": "blocked",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>      "latestLocalResult": {</code> | 结构化数据字段 `latestLocalResult`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>        "officialRunReady": false,</code> | 结构化数据字段 `officialRunReady`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>        "blockers": [</code> | 结构化数据字段 `blockers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 70 | <code>          "OSWorld repo is missing",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 71 | <code>          "OSWorld Python dependencies are not installed"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 72 | <code>        ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 73 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 74 | <code>      "measures": ["environment_readiness", "desktop_gui_dependencies"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>      "gaps": ["OSWorld repo", "Python dependency setup", "deterministic smoke run"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 77 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 78 | <code>      "id": "gaia",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 79 | <code>      "category": "general_assistant_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 80 | <code>      "script": "pnpm bench:gaia:official:l1",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>      "status": "script_exists",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>      "measures": ["answer_accuracy", "tool_use", "search_file_reasoning", "visual_optional"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>      "gaps": ["fixed smoke subset", "no-visual and visual split", "current rerun"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 85 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 86 | <code>      "id": "swebench-lite",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>      "category": "software_engineering_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>      "script": "pnpm bench:swebench-lite:execute",</code> | 结构化数据字段 `script`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>      "status": "sample_data_exists",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 90 | <code>      "measures": ["patch_success", "test_pass", "environment_setup", "code_navigation"],</code> | 结构化数据字段 `measures`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>      "gaps": ["stable wheelhouse", "fixed small sample", "nightly run"]</code> | 结构化数据字段 `gaps`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 93 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 94 | <code>  "external": [</code> | 结构化数据字段 `external`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 95 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>      "id": "gaia",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 97 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 98 | <code>      "category": "general_assistant_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 99 | <code>      "source": "https://huggingface.co/datasets/gaia-benchmark/GAIA",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 100 | <code>      "recommendedUse": "Fixed L1/L2 smoke plus official validation reruns."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 102 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 103 | <code>      "id": "swebench-lite",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>      "category": "software_engineering_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>      "source": "https://www.swebench.com/",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>      "recommendedUse": "Small deterministic code repair subset."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 109 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 110 | <code>      "id": "osworld",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>      "category": "desktop_gui_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>      "source": "https://github.com/xlang-ai/OSWorld",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 114 | <code>      "recommendedUse": "Desktop GUI readiness and deterministic smoke."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 115 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 116 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 117 | <code>      "id": "webarena",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 118 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>      "category": "web_browser_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>      "source": "https://github.com/web-arena-x/webarena",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 121 | <code>      "recommendedUse": "Browser navigation and web task robustness."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 123 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 124 | <code>      "id": "browsergym",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 126 | <code>      "category": "web_browser_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 127 | <code>      "source": "https://github.com/ServiceNow/BrowserGym",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 128 | <code>      "recommendedUse": "Unified browser-agent environment when web tools mature."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 129 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 130 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 131 | <code>      "id": "appworld",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 132 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 133 | <code>      "category": "api_tool_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 134 | <code>      "source": "https://github.com/StonyBrookNLP/appworld",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 135 | <code>      "recommendedUse": "Stateful API/tool-use evaluation."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 136 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 137 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 138 | <code>      "id": "bfcl",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 140 | <code>      "category": "tool_calling",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>      "source": "https://gorilla.cs.berkeley.edu/leaderboard.html",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 142 | <code>      "recommendedUse": "Function calling schema and parameter accuracy."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 143 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 144 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 145 | <code>      "id": "terminal-bench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 146 | <code>      "priority": "P0",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 147 | <code>      "category": "terminal_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>      "source": "https://github.com/laude-institute/terminal-bench",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 149 | <code>      "recommendedUse": "Terminal command and shell robustness."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 150 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 151 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 152 | <code>      "id": "workarena",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 153 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 154 | <code>      "category": "business_web_workflow",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 155 | <code>      "source": "https://github.com/ServiceNow/WorkArena",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 156 | <code>      "recommendedUse": "Enterprise browser workflow tasks."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 157 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 158 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 159 | <code>      "id": "tau-bench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 161 | <code>      "category": "stateful_tool_agent",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 162 | <code>      "source": "https://github.com/sierra-research/tau-bench",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 163 | <code>      "recommendedUse": "Tool/API state consistency."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 165 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 166 | <code>      "id": "longbench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 167 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 168 | <code>      "category": "long_context",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 169 | <code>      "source": "https://github.com/THUDM/LongBench",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 170 | <code>      "recommendedUse": "Context compiler and long-document compression checks."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 171 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 172 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 173 | <code>      "id": "ragbench",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 174 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 175 | <code>      "category": "rag_evidence",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 176 | <code>      "source": "https://github.com/rungalileo/ragbench",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 177 | <code>      "recommendedUse": "Evidence retrieval and citation quality."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 178 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 179 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 180 | <code>      "id": "locomo",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 181 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 182 | <code>      "category": "long_term_memory",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 183 | <code>      "source": "https://github.com/snap-research/locomo",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 184 | <code>      "recommendedUse": "Personal memory and long-term conversation recall."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 185 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 186 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 187 | <code>      "id": "longmemeval",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 188 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 189 | <code>      "category": "long_term_memory",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 190 | <code>      "source": "https://github.com/xiaowu0162/LongMemEval",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 191 | <code>      "recommendedUse": "Cross-session memory retrieval evaluation."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 192 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 193 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 194 | <code>      "id": "common-voice",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 195 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 196 | <code>      "category": "asr_multilingual",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 197 | <code>      "source": "https://commonvoice.mozilla.org/en/datasets",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 198 | <code>      "recommendedUse": "Chinese/English/Japanese/Korean ASR WER."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 199 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 200 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 201 | <code>      "id": "librispeech",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 202 | <code>      "priority": "P1",</code> | 结构化数据字段 `priority`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 203 | <code>      "category": "asr_english",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 204 | <code>      "source": "https://www.openslr.org/12",</code> | 结构化数据字段 `source`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 205 | <code>      "recommendedUse": "English ASR WER and latency baseline."</code> | 结构化数据字段 `recommendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 206 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 207 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 208 | <code>  "recommendedDailyGates": [</code> | 结构化数据字段 `recommendedDailyGates`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 209 | <code>    "artifact_tools",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 210 | <code>    "humanlike_validate",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 211 | <code>    "execution_bench",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 212 | <code>    "speed_smoke",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 213 | <code>    "installer_smoke"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 214 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 215 | <code>  "failureTaxonomy": [</code> | 结构化数据字段 `failureTaxonomy`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 216 | <code>    "model_quality",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 217 | <code>    "context_overload",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 218 | <code>    "tool_selection",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 219 | <code>    "tool_contract",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 220 | <code>    "tool_runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 221 | <code>    "environment",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 222 | <code>    "verification_gap",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 223 | <code>    "ui_runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 224 | <code>    "voice_runtime"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 225 | <code>  ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 226 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
