# evals/core-smoke/manifest.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：59
- SHA-256：`1ac598639a005b652ffa2e258f8e664a29ddc3a424aa538eab109fad50ce9e23`
- 可运行副本：[打开源文件](../../../../source/evals/core-smoke/manifest.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "version": 1,</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "updatedAt": "2026-07-01T02:55:19.268Z",</code> | 结构化数据字段 `updatedAt`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "outputDir": "F:\\AILIS_self_evolution_runtime\\evals\\core-smoke",</code> | 结构化数据字段 `outputDir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "requestedCounts": {</code> | 结构化数据字段 `requestedCounts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "gaia": 10,</code> | 结构化数据字段 `gaia`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>    "terminalBench": 10,</code> | 结构化数据字段 `terminalBench`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>    "locomoSamples": 2,</code> | 结构化数据字段 `locomoSamples`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    "locomoQaPerSample": 20</code> | 结构化数据字段 `locomoQaPerSample`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 11 | <code>  "files": {</code> | 结构化数据字段 `files`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>    "gaia": "F:\\AILIS_self_evolution_runtime\\evals\\core-smoke\\gaia-10.json",</code> | 结构化数据字段 `gaia`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>    "terminalBench": "F:\\AILIS_self_evolution_runtime\\evals\\core-smoke\\terminal-bench-10.json",</code> | 结构化数据字段 `terminalBench`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>    "locomo": "F:\\AILIS_self_evolution_runtime\\evals\\core-smoke\\locomo-2x20qa.json"</code> | 结构化数据字段 `locomo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 16 | <code>  "statuses": {</code> | 结构化数据字段 `statuses`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>    "gaia": "ready_from_local_history",</code> | 结构化数据字段 `gaia`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>    "terminalBench": "ready",</code> | 结构化数据字段 `terminalBench`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>    "locomo": "ready"</code> | 结构化数据字段 `locomo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>  "counts": {</code> | 结构化数据字段 `counts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>    "gaia": 10,</code> | 结构化数据字段 `gaia`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>    "terminalBench": 10,</code> | 结构化数据字段 `terminalBench`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>    "locomoSamples": 2,</code> | 结构化数据字段 `locomoSamples`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>    "locomoQa": 40</code> | 结构化数据字段 `locomoQa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 27 | <code>  "costPlan": {</code> | 结构化数据字段 `costPlan`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>    "model": "deepseek-v4-flash",</code> | 结构化数据字段 `model`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>    "pricingReference": {</code> | 结构化数据字段 `pricingReference`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>      "inputCacheMissUsdPerMillion": 0.14,</code> | 结构化数据字段 `inputCacheMissUsdPerMillion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>      "outputUsdPerMillion": 0.28</code> | 结构化数据字段 `outputUsdPerMillion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 33 | <code>    "intendedUse": "Smoke only. Stop on repeated loop failures; do not use full benchmark budgets until adapters are stable.",</code> | 结构化数据字段 `intendedUse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>    "roughUpperBounds": {</code> | 结构化数据字段 `roughUpperBounds`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>      "gaia10": {</code> | 结构化数据字段 `gaia10`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>        "inputTokens": 800000,</code> | 结构化数据字段 `inputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>        "outputTokens": 80000</code> | 结构化数据字段 `outputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 39 | <code>      "terminalBench10": {</code> | 结构化数据字段 `terminalBench10`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>        "inputTokens": 800000,</code> | 结构化数据字段 `inputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>        "outputTokens": 80000</code> | 结构化数据字段 `outputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 43 | <code>      "locomo40Qa": {</code> | 结构化数据字段 `locomo40Qa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>        "inputTokens": 800000,</code> | 结构化数据字段 `inputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>        "outputTokens": 80000</code> | 结构化数据字段 `outputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 47 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 48 | <code>    "totalRoughUpperBound": {</code> | 结构化数据字段 `totalRoughUpperBound`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>      "inputTokens": 2400000,</code> | 结构化数据字段 `inputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>      "outputTokens": 240000,</code> | 结构化数据字段 `outputTokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>      "usdNoCache": 0.4032</code> | 结构化数据字段 `usdNoCache`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 53 | <code>    "availableTaskCounts": {</code> | 结构化数据字段 `availableTaskCounts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>      "gaia": 10,</code> | 结构化数据字段 `gaia`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>      "terminalBench": 10,</code> | 结构化数据字段 `terminalBench`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      "locomoQa": 40</code> | 结构化数据字段 `locomoQa`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 58 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
