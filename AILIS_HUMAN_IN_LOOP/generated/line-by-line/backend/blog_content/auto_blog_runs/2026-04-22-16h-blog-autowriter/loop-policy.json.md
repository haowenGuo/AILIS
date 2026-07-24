# backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/loop-policy.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`structured-data`
- 原始行数：17
- SHA-256：`78bcafebc961f71b913d6aa94b91c975beb8f39e7083f80dace7c29baf374dae`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/loop-policy.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "durationHours": 16,</code> | 结构化数据字段 `durationHours`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "heartbeatMinutes": 5,</code> | 结构化数据字段 `heartbeatMinutes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "intervalSeconds": 300,</code> | 结构化数据字段 `intervalSeconds`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "until": "2026-04-22T23:50:00+08:00",</code> | 结构化数据字段 `until`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>  "maxRepairAttemptsPerIssue": 3,</code> | 结构化数据字段 `maxRepairAttemptsPerIssue`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>  "maxConcurrentHeavyRuns": 1,</code> | 结构化数据字段 `maxConcurrentHeavyRuns`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>  "stopWhen": [</code> | 结构化数据字段 `stopWhen`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    "duration_expired",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 10 | <code>    "acceptance_satisfied",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 11 | <code>    "user_stop_flag"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 12 | <code>  ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 13 | <code>  "reportPath": "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/final_100_page_report.md",</code> | 结构化数据字段 `reportPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>  "controller": "scripts/auto_blog_runner.py",</code> | 结构化数据字段 `controller`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>  "progressPath": "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/progress.json",</code> | 结构化数据字段 `progressPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>  "eventLogPath": "backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/event-log.jsonl"</code> | 结构化数据字段 `eventLogPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
