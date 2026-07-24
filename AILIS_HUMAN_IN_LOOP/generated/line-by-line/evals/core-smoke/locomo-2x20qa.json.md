# evals/core-smoke/locomo-2x20qa.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：427
- SHA-256：`59c5451c23cbb8722b20689ff54c07ed4bf3b2425054bd41a9db428a107ae54e`
- 可运行副本：[打开源文件](../../../../source/evals/core-smoke/locomo-2x20qa.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "status": "ready",</code> | 结构化数据字段 `status`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "requestedSamples": 2,</code> | 结构化数据字段 `requestedSamples`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "requestedQaPerSample": 20,</code> | 结构化数据字段 `requestedQaPerSample`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "availableSamples": 2,</code> | 结构化数据字段 `availableSamples`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>  "availableQa": 40,</code> | 结构化数据字段 `availableQa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>  "sourcePath": "F:\\AILIS_self_evolution_runtime\\build-cache\\benchmarks\\locomo\\data\\locomo10.json",</code> | 结构化数据字段 `sourcePath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>  "samples": [</code> | 结构化数据字段 `samples`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 10 | <code>      "benchmark": "locomo",</code> | 结构化数据字段 `benchmark`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>      "sampleId": "conv-26",</code> | 结构化数据字段 `sampleId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>      "sourcePath": "F:\\AILIS_self_evolution_runtime\\build-cache\\benchmarks\\locomo\\data\\locomo10.json",</code> | 结构化数据字段 `sourcePath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      "speakers": {</code> | 结构化数据字段 `speakers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>        "speakerA": "Caroline",</code> | 结构化数据字段 `speakerA`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>        "speakerB": "Melanie"</code> | 结构化数据字段 `speakerB`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 17 | <code>      "contextStats": {</code> | 结构化数据字段 `contextStats`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>        "chars": 174017,</code> | 结构化数据字段 `chars`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>        "roughTokens": 49720,</code> | 结构化数据字段 `roughTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>        "qaCount": 199,</code> | 结构化数据字段 `qaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>        "selectedQaCount": 20</code> | 结构化数据字段 `selectedQaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 23 | <code>      "evaluationMode": "Load this sample into Raw Memory Ledger/artifact memory once, then answer selected QA. Do not stuff full sample into every QA prompt.",</code> | 结构化数据字段 `evaluationMode`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>      "selectedQa": [</code> | 结构化数据字段 `selectedQa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 26 | <code>          "smokeId": "locomo-01-qa-01",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>          "question": "When did Caroline go to the LGBTQ support group?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>          "answer": "7 May 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>            "D1:3"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 31 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 32 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 34 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 35 | <code>          "smokeId": "locomo-01-qa-02",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>          "question": "When did Melanie paint a sunrise?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>          "answer": 2022,</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>            "D1:12"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 40 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 41 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 43 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 44 | <code>          "smokeId": "locomo-01-qa-03",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>          "question": "What fields would Caroline be likely to pursue in her educaton?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>          "answer": "Psychology, counseling certification",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>            "D1:9",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 49 | <code>            "D1:11"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 50 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 51 | <code>          "category": 3</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 53 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 54 | <code>          "smokeId": "locomo-01-qa-04",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>          "question": "What did Caroline research?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>          "answer": "Adoption agencies",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>            "D2:8"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 60 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 62 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 63 | <code>          "smokeId": "locomo-01-qa-05",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>          "question": "What is Caroline's identity?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>          "answer": "Transgender woman",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>            "D1:5"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 68 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 69 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 70 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 71 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 72 | <code>          "smokeId": "locomo-01-qa-06",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>          "question": "When did Melanie run a charity race?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>          "answer": "The sunday before 25 May 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>            "D2:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 77 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 78 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 79 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 80 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 81 | <code>          "smokeId": "locomo-01-qa-07",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>          "question": "When is Melanie planning on going camping?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>          "answer": "June 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 85 | <code>            "D2:7"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 86 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 87 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 89 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 90 | <code>          "smokeId": "locomo-01-qa-08",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>          "question": "What is Caroline's relationship status?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>          "answer": "Single",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>            "D3:13",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 95 | <code>            "D2:14"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 97 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 98 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 99 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 100 | <code>          "smokeId": "locomo-01-qa-09",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>          "question": "When did Caroline give a speech at a school?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 102 | <code>          "answer": "The week before 9 June 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 103 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>            "D3:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 105 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 106 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 108 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 109 | <code>          "smokeId": "locomo-01-qa-10",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>          "question": "When did Caroline meet up with her friends, family, and mentors?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>          "answer": "The week before 9 June 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>            "D3:11"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 114 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 115 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 116 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 117 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 118 | <code>          "smokeId": "locomo-01-qa-11",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>          "question": "How long has Caroline had her current group of friends for?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>          "answer": "4 years",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 121 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>            "D3:13"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 123 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 124 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 126 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 127 | <code>          "smokeId": "locomo-01-qa-12",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 128 | <code>          "question": "Where did Caroline move from 4 years ago?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 129 | <code>          "answer": "Sweden",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 130 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 131 | <code>            "D3:13",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 132 | <code>            "D4:3"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 133 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 134 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 135 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 136 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 137 | <code>          "smokeId": "locomo-01-qa-13",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 138 | <code>          "question": "How long ago was Caroline's 18th birthday?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>          "answer": "10 years ago",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 140 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>            "D4:5"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 142 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 143 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 144 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 145 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 146 | <code>          "smokeId": "locomo-01-qa-14",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 147 | <code>          "question": "What career path has Caroline decided to persue?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>          "answer": "counseling or mental health for Transgender people",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 149 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 150 | <code>            "D4:13",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 151 | <code>            "D1:11"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 152 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 153 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 154 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 155 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 156 | <code>          "smokeId": "locomo-01-qa-15",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 157 | <code>          "question": "Would Caroline still want to pursue counseling as a career if she hadn't received support growing up?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 158 | <code>          "answer": "Likely no",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 159 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>            "D4:15",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 161 | <code>            "D3:5"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 162 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 163 | <code>          "category": 3</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 165 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 166 | <code>          "smokeId": "locomo-01-qa-16",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 167 | <code>          "question": "What activities does Melanie partake in?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 168 | <code>          "answer": "pottery, camping, painting, swimming",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 169 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 170 | <code>            "D5:4",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 171 | <code>            "D9:1",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 172 | <code>            "D1:12",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 173 | <code>            "D1:18"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 174 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 175 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 176 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 177 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 178 | <code>          "smokeId": "locomo-01-qa-17",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 179 | <code>          "question": "When did Melanie sign up for a pottery class?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 180 | <code>          "answer": "2 July 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 181 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 182 | <code>            "D5:4"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 183 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 184 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 185 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 186 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 187 | <code>          "smokeId": "locomo-01-qa-18",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 188 | <code>          "question": "When is Caroline going to the transgender conference?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 189 | <code>          "answer": "July 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 190 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 191 | <code>            "D5:13"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 192 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 193 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 194 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 195 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 196 | <code>          "smokeId": "locomo-01-qa-19",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 197 | <code>          "question": "Where has Melanie camped?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 198 | <code>          "answer": "beach, mountains, forest",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 199 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 200 | <code>            "D6:16",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 201 | <code>            "D4:6",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 202 | <code>            "D8:32"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 203 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 204 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 205 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 206 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 207 | <code>          "smokeId": "locomo-01-qa-20",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 208 | <code>          "question": "What do Melanie's kids like?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 209 | <code>          "answer": "dinosaurs, nature",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 210 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 211 | <code>            "D6:6",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 212 | <code>            "D4:8"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 213 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 214 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 215 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 216 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 217 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 218 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 219 | <code>      "benchmark": "locomo",</code> | 结构化数据字段 `benchmark`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 220 | <code>      "sampleId": "conv-30",</code> | 结构化数据字段 `sampleId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 221 | <code>      "sourcePath": "F:\\AILIS_self_evolution_runtime\\build-cache\\benchmarks\\locomo\\data\\locomo10.json",</code> | 结构化数据字段 `sourcePath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 222 | <code>      "speakers": {</code> | 结构化数据字段 `speakers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 223 | <code>        "speakerA": "Jon",</code> | 结构化数据字段 `speakerA`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 224 | <code>        "speakerB": "Gina"</code> | 结构化数据字段 `speakerB`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 225 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 226 | <code>      "contextStats": {</code> | 结构化数据字段 `contextStats`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 227 | <code>        "chars": 119095,</code> | 结构化数据字段 `chars`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 228 | <code>        "roughTokens": 34028,</code> | 结构化数据字段 `roughTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 229 | <code>        "qaCount": 105,</code> | 结构化数据字段 `qaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 230 | <code>        "selectedQaCount": 20</code> | 结构化数据字段 `selectedQaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 231 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 232 | <code>      "evaluationMode": "Load this sample into Raw Memory Ledger/artifact memory once, then answer selected QA. Do not stuff full sample into every QA prompt.",</code> | 结构化数据字段 `evaluationMode`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 233 | <code>      "selectedQa": [</code> | 结构化数据字段 `selectedQa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 234 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 235 | <code>          "smokeId": "locomo-02-qa-01",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 236 | <code>          "question": "When Jon has lost his job as a banker?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 237 | <code>          "answer": "19 January, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 238 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 239 | <code>            "D1:2"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 240 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 241 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 242 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 243 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 244 | <code>          "smokeId": "locomo-02-qa-02",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 245 | <code>          "question": "When Gina has lost her job at Door Dash?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 246 | <code>          "answer": "January, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 247 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 248 | <code>            "D1:3"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 249 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 250 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 251 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 252 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 253 | <code>          "smokeId": "locomo-02-qa-03",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 254 | <code>          "question": "How do Jon and Gina both like to destress?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 255 | <code>          "answer": "by dancing",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 256 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 257 | <code>            "D1:7",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 258 | <code>            "D1:6"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 259 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 260 | <code>          "category": 4</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 261 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 262 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 263 | <code>          "smokeId": "locomo-02-qa-04",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 264 | <code>          "question": "What do Jon and Gina both have in common?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 265 | <code>          "answer": "They lost their jobs and decided to start their own businesses.",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 266 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 267 | <code>            "D1:2",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 268 | <code>            "D1:3",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 269 | <code>            "D1:4",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 270 | <code>            "D2:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 271 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 272 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 273 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 274 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 275 | <code>          "smokeId": "locomo-02-qa-05",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 276 | <code>          "question": "Why did Jon decide to start his dance studio?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 277 | <code>          "answer": "He lost his job and decided to start his own business to share his passion.",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 278 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 279 | <code>            "D1:2",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 280 | <code>            "D1:4"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 281 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 282 | <code>          "category": 4</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 283 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 284 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 285 | <code>          "smokeId": "locomo-02-qa-06",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 286 | <code>          "question": "What Jon thinks the ideal dance studio should look like?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 287 | <code>          "answer": "By the water, with natural light and Marley flooring",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 288 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 289 | <code>            "D1:20",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 290 | <code>            "D2:4",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 291 | <code>            "D2:8"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 292 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 293 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 294 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 295 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 296 | <code>          "smokeId": "locomo-02-qa-07",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 297 | <code>          "question": "When is Jon's group performing at a festival?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 298 | <code>          "answer": "February, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 299 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 300 | <code>            "D1:24"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 301 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 302 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 303 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 304 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 305 | <code>          "smokeId": "locomo-02-qa-08",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 306 | <code>          "question": "When did Gina launch an ad campaign for her store?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 307 | <code>          "answer": "29 January, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 308 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 309 | <code>            "D2:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 310 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 311 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 312 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 313 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 314 | <code>          "smokeId": "locomo-02-qa-09",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 315 | <code>          "question": "When was Jon in Paris?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 316 | <code>          "answer": "28 January 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 317 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 318 | <code>            "D2:4"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 319 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 320 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 321 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 322 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 323 | <code>          "smokeId": "locomo-02-qa-10",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 324 | <code>          "question": "Which city have both Jean and John visited?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 325 | <code>          "answer": "Rome",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 326 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 327 | <code>            "D2:5",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 328 | <code>            "D15:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 329 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 330 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 331 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 332 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 333 | <code>          "smokeId": "locomo-02-qa-11",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 334 | <code>          "question": "When did Gina team up with a local artist for some cool designs?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 335 | <code>          "answer": "February, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 336 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 337 | <code>            "D5:5"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 338 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 339 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 340 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 341 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 342 | <code>          "smokeId": "locomo-02-qa-12",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 343 | <code>          "question": "When did Gina get her tattoo?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 344 | <code>          "answer": "A few years ago",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 345 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 346 | <code>            "D5:15"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 347 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 348 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 349 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 350 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 351 | <code>          "smokeId": "locomo-02-qa-13",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 352 | <code>          "question": "When did Jon start to go to the gym?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 353 | <code>          "answer": "March, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 354 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 355 | <code>            "D6:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 356 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 357 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 358 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 359 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 360 | <code>          "smokeId": "locomo-02-qa-14",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 361 | <code>          "question": "When did Gina open her online clothing store?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 362 | <code>          "answer": "16 March, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 363 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 364 | <code>            "D6:6"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 365 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 366 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 367 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 368 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 369 | <code>          "smokeId": "locomo-02-qa-15",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 370 | <code>          "question": "When did Jon start expanding his studio's social media presence?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 371 | <code>          "answer": "April, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 372 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 373 | <code>            "D8:13"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 374 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 375 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 376 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 377 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 378 | <code>          "smokeId": "locomo-02-qa-16",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 379 | <code>          "question": "When did Jon host a dance competition?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 380 | <code>          "answer": "May, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 381 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 382 | <code>            "D8:13"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 383 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 384 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 385 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 386 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 387 | <code>          "smokeId": "locomo-02-qa-17",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 388 | <code>          "question": "When did Jon go to a fair to get more exposure for his dance studio?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 389 | <code>          "answer": "24 April, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 390 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 391 | <code>            "D10:1"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 392 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 393 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 394 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 395 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 396 | <code>          "smokeId": "locomo-02-qa-18",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 397 | <code>          "question": "Why did Gina decide to start her own clothing store?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 398 | <code>          "answer": "She always loved fashion trends and finding unique pieces and she lost her job so decided it was time to start her own business.",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 399 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 400 | <code>            "D6:8",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 401 | <code>            "D1:3"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 402 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 403 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 404 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 405 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 406 | <code>          "smokeId": "locomo-02-qa-19",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 407 | <code>          "question": "Do Jon and Gina start businesses out of what they love?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 408 | <code>          "answer": "Yes",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 409 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 410 | <code>            "D1:4",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 411 | <code>            "D6:8"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 412 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 413 | <code>          "category": 1</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 414 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 415 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 416 | <code>          "smokeId": "locomo-02-qa-20",</code> | 结构化数据字段 `smokeId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 417 | <code>          "question": "When did Gina interview for a design internship?",</code> | 结构化数据字段 `question`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 418 | <code>          "answer": "10 May, 2023",</code> | 结构化数据字段 `answer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 419 | <code>          "evidence": [</code> | 结构化数据字段 `evidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 420 | <code>            "D11:14"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 421 | <code>          ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 422 | <code>          "category": 2</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 423 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 424 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 425 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 426 | <code>  ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 427 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
