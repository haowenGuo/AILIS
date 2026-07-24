# docs/ailis-gateway-v0.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`documentation`
- 原始行数：112
- SHA-256：`eec1469fe2582e4bbfb0dd3cff35fc2015cf31226ee5a702a6daf637b2aabe19`
- 可运行副本：[打开源文件](../../../source/docs/ailis-gateway-v0.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Gateway v0</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS Gateway v0 is a thin local HTTP gateway for the personal Claw build. It does not reimplement OpenClaw tools. It provides one stable entrypoint for the frontend and future agent loop.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Default URL when the Electron app is running:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 8 | <code>http://127.0.0.1:19777</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## Endpoints</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 14 | <code>GET /health</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>Returns gateway status, workspace root, audit log path, and OpenClaw tool-surface validation summary.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 20 | <code>GET /tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>GET /tools/list</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>Returns the OpenClaw-aligned tool registry:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>- `coreTools`: 33 mirrored OpenClaw core tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- `optionalRuntimeTools`: optional runtime tools such as `pdf`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- `channelMcpTools`: 9 OpenClaw channel MCP tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>Each tool includes a route and status such as `available`, `needs_config`, `needs_session`, `needs_pairing`, `skipped_external`, or `not_materialized`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 33 | <code>POST /tools/call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>Calls one tool through the gateway.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 39 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>  "tool": "read",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>  "args": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>    "path": "README.md"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>  "context": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>    "workspace": "F:/AILIS"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>Response:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 53 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  "ok": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  "callId": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  "tool": "read",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  "status": "completed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>  "durationMs": 12,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>  "result": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 64 | <code>POST /rpc</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>Supports:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- `gateway.health`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- `tools.list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- `tools.call`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- `audit.list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 75 | <code>GET /events</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>Server-sent events stream. Emits `gateway.started`, `tool.call.started`, and `tool.call.finished`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 81 | <code>GET /audit?limit=100</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>Reads recent audit log entries. Sensitive fields such as tokens, passwords, secrets, and API keys are redacted.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>## Safety Defaults</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>- File tools are confined to the configured workspace root.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- `apply_patch` paths must be relative workspace paths.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- `exec` requires `context.approved=true`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- `message` is forced to `dryRun=true` unless `context.approved=true`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- Browser, canvas, media generation, PDF, and memory tools are treated as external side-effect tools unless explicitly enabled with `context.executeExternal=true`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- Every tool call is written to the audit log.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>## Validation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>Run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>pnpm ailis:smoke-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>pnpm test:ailis-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>The smoke test verifies:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>- Gateway starts on a local port.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- `/health` returns OK.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>- `/tools` exposes 33 core, 1 optional runtime, and 9 channel MCP tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- `write` and `read` execute through OpenClaw runtime tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>- `exec` is blocked without approval.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>- `exec` runs with `context.approved=true`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- Audit entries are written.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
