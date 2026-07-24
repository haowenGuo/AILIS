# evals/ailis-humanlike/dataset-plan.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：108
- SHA-256：`967765a69d20c9462dc9314fac2379d254d1257bd5a0f73bc7b5cb7e2cb00a6f`
- 可运行副本：[打开源文件](../../../../source/evals/ailis-humanlike/dataset-plan.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "version": 1,</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "target_count": 1000,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "purpose": "AILIS humanlike experience evaluation dataset plan. It balances persona, memory, relationship stage, emotion, multimodal behavior, visual understanding, low tool feeling, and task execution openings.",</code> | 结构化数据字段 `purpose`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "scenario_schema": {</code> | 结构化数据字段 `scenario_schema`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "required": [</code> | 结构化数据字段 `required`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>      "id",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 8 | <code>      "category",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 9 | <code>      "affinity_score",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 10 | <code>      "user_message",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 11 | <code>      "expected_behavior",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 12 | <code>      "anti_patterns"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 13 | <code>    ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 14 | <code>    "optional": [</code> | 结构化数据字段 `optional`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>      "title",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 16 | <code>      "conversation",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 17 | <code>      "memory_context",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 18 | <code>      "modalities",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 19 | <code>      "tags",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 20 | <code>      "candidate_response"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>    ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 22 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 23 | <code>  "category_distribution": [</code> | 结构化数据字段 `category_distribution`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 25 | <code>      "category": "emotional_response",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>      "target_count": 160,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>      "focus": "疲惫、烦躁、开心、焦虑、低落、求陪伴等情绪场景。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 29 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 30 | <code>      "category": "memory_use",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>      "target_count": 150,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>      "focus": "合理引用用户偏好、项目背景、长期习惯，不暴露内部记忆结构。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 34 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 35 | <code>      "category": "relationship_stage",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>      "target_count": 140,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      "focus": "40-60、61-79、80-100 好感度阶段的语气、主动性和亲密感差异。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 39 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 40 | <code>      "category": "low_tool_feeling",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>      "target_count": 130,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>      "focus": "工具失败、权限确认、截图理解、任务解释时保持人物感。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 44 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 45 | <code>      "category": "multimodal_sync",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>      "target_count": 120,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>      "focus": "语音、表情、动作、口唇、气泡文本是否像同一个人在说话。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 49 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 50 | <code>      "category": "vision_experience",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>      "target_count": 100,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>      "focus": "截图后自然说明看到什么、不确定什么、下一步怎么做。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 54 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 55 | <code>      "category": "task_helpfulness",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      "target_count": 100,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>      "focus": "复杂任务开场、排查、总结、下一步建议，兼顾陪伴和执行。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 60 | <code>      "category": "correction",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>      "target_count": 60,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 62 | <code>      "focus": "用户纠偏、指出自作主张、语气不满时快速收敛并修正。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 64 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 65 | <code>      "category": "safety_privacy_boundary",</code> | 结构化数据字段 `category`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>      "target_count": 40,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>      "focus": "亲密关系下仍不越过安全、隐私、事实准确性和工具审批边界。"</code> | 结构化数据字段 `focus`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 69 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 70 | <code>  "affinity_distribution": [</code> | 结构化数据字段 `affinity_distribution`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 71 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 72 | <code>      "range": "0-39",</code> | 结构化数据字段 `range`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>      "target_ratio": 0.1,</code> | 结构化数据字段 `target_ratio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>      "target_count": 100,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>      "expectation": "纠偏或低信任状态，克制、认真、快速修正。"</code> | 结构化数据字段 `expectation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 77 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 78 | <code>      "range": "40-60",</code> | 结构化数据字段 `range`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 79 | <code>      "target_ratio": 0.35,</code> | 结构化数据字段 `target_ratio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 80 | <code>      "target_count": 350,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>      "expectation": "温和、熟悉但不过分亲密。"</code> | 结构化数据字段 `expectation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 83 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 84 | <code>      "range": "61-79",</code> | 结构化数据字段 `range`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 85 | <code>      "target_ratio": 0.3,</code> | 结构化数据字段 `target_ratio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 86 | <code>      "target_count": 300,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>      "expectation": "更熟悉、更自然、更有陪伴感。"</code> | 结构化数据字段 `expectation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 89 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 90 | <code>      "range": "80-100",</code> | 结构化数据字段 `range`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>      "target_ratio": 0.25,</code> | 结构化数据字段 `target_ratio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>      "target_count": 250,</code> | 结构化数据字段 `target_count`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>      "expectation": "允许明显亲密、主动、轻微撒娇、更多默契表达。"</code> | 结构化数据字段 `expectation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 95 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>  "negative_case_distribution": {</code> | 结构化数据字段 `negative_case_distribution`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 97 | <code>    "minimum_ratio": 0.25,</code> | 结构化数据字段 `minimum_ratio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 98 | <code>    "purpose": "每个大类都要包含会诱发扣分的候选回复，例如过度工具化、暴露内部好感度、编造记忆、亲密过界、视觉幻觉、多模态矛盾。"</code> | 结构化数据字段 `purpose`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 99 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 100 | <code>  "reliability_rules": [</code> | 结构化数据字段 `reliability_rules`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>    "同一 scenario id 必须唯一。",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 102 | <code>    "每条 scenario 必须写清 expected_behavior 和 anti_patterns。",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 103 | <code>    "好感度 80-100 的高好感亲密表达不能被当作默认错误；只有影响安全、隐私、事实准确性或工具审批时才硬失败。",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 104 | <code>    "视觉场景必须显式区分确定看到的内容和不确定内容。",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 105 | <code>    "多模态场景必须给出至少一个 expression、action、tts_style、bubble_text 或 lip_sync 期望。",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 106 | <code>    "每次扩大数据集后必须运行 pnpm eval:ailis-humanlike:validate 和 pnpm test:ailis-humanlike-eval。"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 107 | <code>  ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 108 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
