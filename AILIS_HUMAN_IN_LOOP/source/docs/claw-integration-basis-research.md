# Claw 集成基座调研

日期：2026-05-22

目标：为自研 Claw 整理一套可落地的能力基座。核心思路不是从零重造所有工具，而是把已有标准、官方 SDK、开源 MCP server、平台 API 和本机能力统一接入一个核心 Gateway，再由视觉前端调用 Gateway。

## 总体判断

自研 Claw 最值得自己做的不是每个工具本身，而是这些层：

- `Gateway`：统一入口、鉴权、会话、事件流、工具调用、审批和审计。
- `Tool Registry`：把内置工具、MCP 工具、平台 API 工具、本机工具统一成一种描述。
- `Policy Engine`：按用户、会话、来源、工具风险、路径、OAuth scope 裁剪能力。
- `Runtime Manager`：管理 MCP server、浏览器、LSP、shell、worker 进程、外部 connector 的生命周期。
- `Visual Frontend Adapter`：把 Gateway 的事件流转成你的视觉前端状态，例如表情、动作、对话、任务进度、审批弹窗。

应该尽量借用的部分：

- MCP、JSON-RPC、JSON Schema、OpenAPI、OAuth 2.0、OIDC、Webhook、CloudEvents。
- OpenAI / Anthropic / Gemini 的原生 tool calling。
- LSP、DAP、Tree-sitter、ripgrep、Git/GitHub API。
- Playwright、CDP、WebDriver BiDi。
- Gmail、Google Drive、Google Calendar、Microsoft Graph、Slack、Discord、Telegram、LINE、Notion、Linear、Jira、Figma 等官方 API。

## 目标架构

```text
视觉前端 / 桌面端 / 移动端 / Web UI
  -> Gateway HTTP + WebSocket
  -> Session / Run / Transcript / Event Bus
  -> Agent Runtime
  -> Tool Registry + Policy Engine
  -> 内置工具 / MCP Client / SaaS Connectors / Code Runtime / Browser Runtime / Local Runtime
  -> 文件、代码、浏览器、邮件、聊天、日历、知识库、云服务、本机动作
```

建议第一版 Gateway 对外只暴露少量稳定方法：

| 方法 | 作用 |
| --- | --- |
| `session.create` | 创建会话 |
| `chat.history` | 读取历史 |
| `chat.send` | 发起一次 Agent run |
| `chat.abort` | 取消 run |
| `events.subscribe` | WebSocket 事件订阅 |
| `tools.catalog` | 查看当前会话可用工具 |
| `tools.invoke` | 统一工具调用入口 |
| `mcp.servers.list` | 查看 MCP server 状态 |
| `approvals.decide` | 用户审批高风险动作 |

## 第一层：MCP 生态

MCP 是目前最值得优先接入的外部工具协议。它把外部系统暴露为 `tools`、`resources`、`prompts`，底层使用 JSON-RPC 风格消息，常见 transport 是 `stdio`、`Streamable HTTP`、历史 SSE。

| 能力 | 建议接入方式 | Gateway 里的抽象 |
| --- | --- | --- |
| 本地 MCP server | `stdio` 启动子进程 | `McpServerProcess` |
| 远程 MCP server | `streamable-http` | `McpRemoteConnection` |
| 老式 SSE MCP | 兼容但不优先 | `McpLegacySseConnection` |
| MCP tools | `tools/list` + `tools/call` | 物化成内部 `ToolDescriptor` |
| MCP resources | `resources/list` + `resources/read` | 物化成 `ResourceProvider` |
| MCP prompts | `prompts/list` + `prompts/get` | 物化成 prompt 模板 |

第一版应该支持：

- `stdio` MCP client。
- `streamable-http` MCP client。
- MCP tool catalog 缓存。
- MCP server health。
- 工具名安全重命名，避免不同 server 的 tool 撞名。
- 每个 MCP server 独立 allowlist。

第一版不急着支持：

- 自己实现完整 MCP server marketplace。
- 私有 MCP registry。
- MCP sampling / elicitation 的全量实现。

推荐优先测试的 MCP server：

| MCP server | 价值 | 风险 |
| --- | --- | --- |
| `@modelcontextprotocol/server-filesystem` | 文件读写能力 | 必须限制目录 |
| `mcp-server-git` | Git diff、log、status | 不要默认允许 destructive git |
| `github/github-mcp-server` | GitHub repo、issue、PR、Actions | 需要细粒度 OAuth/PAT scope |
| `@modelcontextprotocol/server-memory` | 持久记忆样例 | 要区分用户记忆与系统记忆 |
| `@modelcontextprotocol/server-postgres` | 数据库查询 | 默认只读，防注入 |
| `microsoft/playwright-mcp` | 浏览器自动化 | 不是安全边界，要隔离 profile |

MCP 的关键设计原则：

- MCP server 不是可信内核，只是能力来源。
- MCP tool 暴露给模型前必须经过 Gateway policy。
- MCP 返回内容不能直接当可信系统指令。
- 本地 stdio MCP 进程要有 cwd、env、timeout、stderr logging、生命周期清理。
- 远程 MCP 要校验 URL、TLS、Authorization header、redirect、body size 和 SSRF。

## 第二层：模型原生 Tool Calling

模型工具调用没有完全统一的行业标准。每家 provider 的 schema、调用事件、流式格式都有差异，所以你的 Claw 需要一个 provider adapter。

| Provider | 能力 | 建议 |
| --- | --- | --- |
| OpenAI Responses API | function tools、hosted tools、remote MCP、结构化输出、流式事件 | 第一优先，适合作为内部接口基准 |
| Anthropic Claude | tool use、MCP connector、computer use、text editor 类工具 | 第二优先，代码 Agent 生态强 |
| Google Gemini | function calling、code execution、Google Search grounding、multimodal | 适合多模态和 Google 生态 |
| OpenAI-compatible | vLLM、Ollama、LM Studio、OpenRouter、各种代理 | 适合兼容层，但 tool calling 质量不统一 |

建议定义内部统一格式：

```ts
type ToolDescriptor = {
  name: string;
  title?: string;
  description: string;
  inputSchema: JsonSchema;
  risk: "read" | "write" | "network" | "exec" | "credential" | "destructive";
  source: "builtin" | "mcp" | "connector" | "frontend";
  providerHints?: Record<string, unknown>;
};

type ToolCall = {
  id: string;
  sessionId: string;
  runId: string;
  toolName: string;
  args: unknown;
  requestedBy: "model" | "user" | "system";
};
```

Provider adapter 负责：

- 把内部 `ToolDescriptor` 转成 OpenAI / Anthropic / Gemini 各自格式。
- 把 provider 的 tool call event 转回内部 `ToolCall`。
- 把工具结果再转回 provider 所需消息格式。
- 处理流式 delta、tool call partial、retry、abort。

## 第三层：Schema、API 描述和验证

工具调用的正确性主要靠 schema。

| 技术 | 用途 | 建议 |
| --- | --- | --- |
| JSON Schema | 工具参数标准描述 | 必选 |
| AJV | 运行时 JSON Schema 校验 | 必选 |
| Zod | TypeScript 侧开发体验 | 推荐 |
| TypeBox | TS 类型和 JSON Schema 同源 | 推荐 |
| OpenAPI | 把 REST API 自动转成工具 | 第二阶段 |
| AsyncAPI | 事件/消息系统描述 | 可选 |

Claw 内部建议所有工具必须满足：

- 有 `name`、`description`、`inputSchema`。
- 参数执行前必须 validate。
- validate 后再做权限检查。
- 工具输出也要有最小结构，例如 `content`、`metadata`、`isError`。

## 第四层：代码能力

代码能力不要只理解成“读写文件”。一个真正可用的代码 Agent 至少需要以下能力。

| 能力 | 标准 / 实现 | 第一版建议 |
| --- | --- | --- |
| 文件读取 | Node fs / Python pathlib / MCP filesystem | 必选，只读白名单 |
| 文件写入 | Node fs / apply_patch | 必选，默认 workspace-only |
| 搜索 | ripgrep / fd | 必选 |
| Patch | unified diff / apply_patch | 必选 |
| Shell | child_process.spawn / node-pty | 可选，默认审批 |
| Git | Git CLI / libgit2 / GitHub API | 必选，先读后写 |
| 语义能力 | LSP | 第二阶段优先 |
| 调试能力 | DAP | 第二阶段 |
| 语法树 | Tree-sitter | 推荐 |
| 测试发现 | package manager + test framework adapter | 必选 |

建议第一批代码工具：

| 工具 | 风险 | 行为 |
| --- | --- | --- |
| `file.read` | read | 只允许 workspace |
| `file.list` | read | 支持 glob 和 ignore |
| `code.search` | read | 包装 ripgrep |
| `file.patch` | write | 使用 patch，记录 diff |
| `git.status` | read | 无审批 |
| `git.diff` | read | 无审批 |
| `git.log` | read | 无审批 |
| `test.run` | exec | 需策略允许，可超时 |
| `shell.exec` | exec | 默认审批 |
| `lsp.hover` | read | 后续接 |
| `lsp.definition` | read | 后续接 |
| `lsp.references` | read | 后续接 |

代码能力安全底线：

- 永远不要让模型直接拼 shell 跑。
- shell 参数要做结构化，不要只传一整串字符串。
- `rm`、`git reset`、`git clean`、部署命令默认人工审批。
- 写文件前记录 before/after diff。
- 工作区之外默认不可读不可写。
- `.env`、密钥文件、浏览器 cookie、SSH key 默认不可读。

## 第五层：浏览器与电脑交互

浏览器能力优先用 Playwright。视觉前端如果需要“电脑控制”，也应通过 Gateway 暴露受控动作，而不是让模型直接操作系统。

| 能力 | 标准 / 实现 | 建议 |
| --- | --- | --- |
| 页面导航 | Playwright | 第一版 |
| DOM/可访问性树 | Playwright accessibility snapshot | 第一版 |
| 截图 | Playwright screenshot | 第一版 |
| 点击/输入 | Playwright locator | 第一版 |
| 浏览器底层调试 | CDP | 第二阶段 |
| 跨浏览器自动化 | WebDriver BiDi | 可选 |
| 远程浏览器 | Playwright server / browserless / CDP endpoint | 第二阶段 |
| 桌面 GUI | Windows UI Automation / macOS Accessibility | 暂缓 |

建议第一版工具：

- `browser.open`
- `browser.snapshot`
- `browser.click`
- `browser.type`
- `browser.screenshot`
- `browser.extract_text`

风险点：

- 浏览器登录态等同真实账号权限。
- 页面内容可能包含 prompt injection。
- 浏览器下载文件可能绕过文件权限。
- `file://` 默认禁用。
- 每个会话最好使用隔离 browser context。

## 第六层：Web、搜索和抓取

| 能力 | 选项 | 建议 |
| --- | --- | --- |
| 普通抓取 | `fetch` / `undici` | 必选 |
| HTML 提取 | Readability / linkedom / cheerio | 必选 |
| 搜索 | Brave Search / Tavily / Bing / SerpAPI / provider hosted search | 选一个 |
| 站点地图 | sitemap.xml | 可选 |
| RSS | RSS/Atom parser | 推荐 |
| 网页转 Markdown | Readability + Turndown | 推荐 |

安全底线：

- SSRF 防护，禁止访问内网、metadata service、localhost，除非明确允许。
- 限制响应大小、重定向次数、下载类型。
- 抓取结果标记为 `untrusted_web_content`。

## 第七层：邮件、日历、文件云盘

| 平台 | 官方接口 | 第一版用途 |
| --- | --- | --- |
| Gmail | Gmail API + push notifications + Pub/Sub | 邮件读取、触发事件 |
| Google Calendar | Calendar API + push notifications | 日程读取、创建事件 |
| Google Drive | Drive API + changes/watch | 文件搜索、读取、上传 |
| Microsoft 365 | Microsoft Graph | Outlook、Calendar、OneDrive、Teams |
| iCloud | 无稳定开放全量 API | 不建议第一版 |

建议统一抽象：

```ts
type ExternalEvent = {
  provider: "gmail" | "google-calendar" | "drive" | "graph" | string;
  accountId: string;
  eventType: string;
  externalId: string;
  receivedAt: number;
  payloadRef?: string;
};
```

原则：

- 邮件正文、附件、日历详情都算敏感数据。
- OAuth token 放 Gateway secret store，前端永远不直接拿。
- 事件型系统用 webhook / push notification，不靠频繁轮询。
- 写操作，例如发邮件、改日历、删文件，默认需要审批或明确规则。

## 第八层：聊天和协作平台

| 平台 | 接入方式 | 建议优先级 |
| --- | --- | --- |
| Telegram | Bot API / webhook / grammY | 高 |
| Slack | Events API / Web API / incoming webhook | 高 |
| Discord | Gateway / Interactions / Webhooks | 中 |
| LINE | Messaging API / webhook | 中 |
| Google Chat | Chat app / incoming webhook | 中 |
| Teams | Microsoft Graph / Bot Framework | 中 |
| WhatsApp | Meta WhatsApp Cloud API | 后续 |

聊天平台统一抽象：

```ts
type ChannelMessage = {
  channel: string;
  accountId: string;
  conversationId: string;
  senderId: string;
  text?: string;
  attachments?: AttachmentRef[];
  receivedAt: number;
  trust: "external" | "trusted_operator" | "system";
};
```

关键策略：

- 外部聊天内容默认不可信。
- 群聊中需要 mention gating 或 allowlist。
- 不要让任意陌生人触发高权限工具。
- 每个平台单独做 rate limit 和 replay protection。

## 第九层：项目管理、知识库和设计平台

| 平台 | 官方接口 / MCP | 可做工具 |
| --- | --- | --- |
| GitHub | REST/GraphQL API、官方 MCP server | repo、issue、PR、Actions |
| GitLab | REST/GraphQL API | repo、MR、CI |
| Linear | GraphQL API | issue、project、cycle |
| Jira | REST API | issue、sprint、project |
| Notion | Notion API | page、database、search |
| Confluence | REST API | 文档读取、发布 |
| Figma | REST API / plugin API | 设计读取、token、assets |
| Hugging Face | Hub API | model、dataset、space |

这些平台最适合先通过 MCP 接入。等某个能力成为核心路径，再做原生 connector。

## 第十层：文档、媒体和多模态

| 能力 | 实现 | 建议 |
| --- | --- | --- |
| PDF 读取 | pdf.js / pdfplumber / poppler | 第一版只读 |
| DOCX | mammoth / python-docx | 第二阶段 |
| PPTX | pptxgenjs / python-pptx | 第二阶段 |
| XLSX | SheetJS / openpyxl | 第二阶段 |
| OCR | Tesseract / 云 OCR | 需要时接 |
| 图片理解 | 模型 vision API | 第一版可接 provider |
| TTS | OpenAI / Azure / Edge TTS | 可用于视觉前端 |
| STT | Whisper / Deepgram / Azure | 可选 |

文档工具风险：

- Office 文档可能有宏和嵌入对象。
- PDF/HTML/文档内容都可能携带 prompt injection。
- 写文档类工具要有预览和 diff。

## 第十一层：记忆和知识检索

| 能力 | 实现 | 建议 |
| --- | --- | --- |
| 短期会话记忆 | Transcript JSONL / SQLite | 必选 |
| 长期用户记忆 | SQLite / Postgres | 第一版 |
| 向量检索 | sqlite-vec / pgvector / Qdrant | 第二阶段 |
| 全文检索 | SQLite FTS5 / Meilisearch / Tantivy | 推荐 |
| 知识图谱 | Neo4j / RDF / 自建轻量图 | 后续 |

记忆要分区：

- `system_memory`：系统配置、工具状态。
- `user_memory`：用户偏好、长期事实。
- `project_memory`：项目上下文、代码约定。
- `session_memory`：当前会话临时信息。

## Gateway 核心模块设计

建议模块边界：

| 模块 | 职责 |
| --- | --- |
| `gateway/server` | HTTP + WebSocket + JSON-RPC |
| `gateway/auth` | token、device、origin、scope |
| `gateway/events` | event bus、订阅、backpressure |
| `sessions` | session metadata、history、transcript |
| `runs` | run lifecycle、abort、idempotency |
| `providers` | OpenAI / Anthropic / Gemini adapter |
| `tools/registry` | 工具注册、catalog、schema |
| `tools/policy` | allow/deny、risk、审批 |
| `tools/invoke` | 统一执行入口 |
| `mcp/runtime` | MCP server 生命周期和 catalog |
| `connectors` | Gmail、Slack、GitHub 等原生接口 |
| `code-runtime` | 文件、搜索、patch、git、LSP |
| `browser-runtime` | Playwright contexts |
| `approvals` | 审批请求、决策、持久记录 |
| `secrets` | OAuth token、API key、加密存储 |
| `frontend-bridge` | 视觉前端动作、表情、状态 |

核心数据模型：

```ts
type CapabilityRisk =
  | "read"
  | "write"
  | "network"
  | "exec"
  | "browser"
  | "credential"
  | "destructive";

type ToolPolicy = {
  allow?: string[];
  deny?: string[];
  requireApproval?: string[];
  allowedPaths?: string[];
  deniedPaths?: string[];
  allowedHosts?: string[];
  maxOutputBytes?: number;
  timeoutMs?: number;
};

type ToolResult = {
  content: Array<{ type: "text" | "json" | "image" | "file"; value: unknown }>;
  metadata?: Record<string, unknown>;
  isError?: boolean;
};
```

## 安全基线

第一天就要做：

- Gateway 默认只绑定 `127.0.0.1`。
- 非 loopback 必须 token、origin check、scope。
- 前端只拿 session token，不拿 provider key 和 OAuth refresh token。
- 所有工具先过 schema，再过 policy，再执行。
- 文件工具默认 workspace-only。
- Shell 默认关闭或审批。
- MCP server 默认不可信，逐个 allowlist。
- Web fetch 做 SSRF 防护。
- Webhook 做签名/secret、body size、rate limit、replay protection。
- 高风险调用落审计日志。
- 每个 run 有 `runId`、`idempotencyKey`、`AbortSignal`。
- 工具输出要标记来源和信任级别。

高风险工具类别：

| 类别 | 例子 | 默认策略 |
| --- | --- | --- |
| `exec` | shell、test、package install | 审批 |
| `write` | 写文件、改 issue、改日历 | 根据来源审批 |
| `destructive` | delete、reset、deploy、send email | 强审批 |
| `credential` | OAuth、cookie、token、secret | 不直接暴露给模型 |
| `browser-auth` | 登录态浏览器操作 | 隔离 profile |
| `network-private` | 内网 URL、本机 URL | 默认禁止 |

## 性能基线

必须避免每次对话都冷启动一切。

- Gateway 常驻。
- MCP catalog 缓存，带 TTL 和版本。
- MCP stdio server 按需启动，空闲回收。
- LSP server 按 workspace 复用。
- Browser context 按 session 复用，但 profile 隔离。
- WebSocket 流式事件，慢客户端要背压或断开。
- 工具结果限制大小，超大结果转文件引用。
- 长任务进入 job queue，不阻塞 Gateway 主循环。
- 所有外部 API 设置 timeout、retry、circuit breaker。

## 正确性基线

- 所有 Gateway method 有 schema。
- 所有工具参数有 schema。
- 工具名稳定且唯一。
- 工具调用有 `toolCallId`。
- 写操作有 before/after diff 或外部对象版本。
- 外部 webhook 事件有去重 key。
- Provider 流式事件统一归一成内部 event。
- Transcript 是事实源，UI 状态可以重建。
- 测试覆盖 schema、policy、tool invoke、abort、retry、权限边界。

## 第一版 MVP 选型

建议你自己的 Claw 第一版只做这些：

| 层 | 第一版内容 |
| --- | --- |
| Gateway | HTTP health + WebSocket JSON-RPC |
| Session | `chat.history`、JSONL transcript |
| Provider | OpenAI Responses 或 OpenAI-compatible 其一 |
| Tool Registry | 内置工具 + schema + policy |
| MCP | stdio + streamable HTTP client |
| 文件工具 | read/list/search/patch |
| Git 工具 | status/diff/log |
| Browser | Playwright open/snapshot/click/type/screenshot |
| Web | fetch/search |
| 视觉前端 | expression/action/message/status |
| 安全 | loopback、token、allowlist、审批 |

MVP 不建议一开始做：

- 全渠道聊天平台。
- 完整 OAuth 多账号系统。
- 私有 MCP marketplace。
- 复杂远程节点。
- 自动部署工具。
- 完整 DAP 调试。
- 高危本机 GUI 控制。

## 第二阶段扩展

| 方向 | 能力 |
| --- | --- |
| 代码智能 | LSP hover/definition/references/completion |
| 项目协作 | GitHub MCP、Linear、Jira、Notion |
| 邮件日历 | Gmail、Google Calendar、Microsoft Graph |
| 文档 | PDF/DOCX/XLSX/PPTX |
| 记忆 | SQLite FTS + vector |
| 多模态 | STT/TTS/vision/image |
| 自动任务 | cron、watcher、heartbeat |
| 插件系统 | manifest、permissions、lifecycle |

## 参考资料

协议和标准：

- MCP Specification：https://modelcontextprotocol.io/specification/2025-06-18
- MCP Registry：https://modelcontextprotocol.io/registry/about
- MCP TypeScript SDK：https://github.com/modelcontextprotocol/typescript-sdk
- MCP Servers：https://github.com/modelcontextprotocol/servers
- JSON-RPC 2.0：https://www.jsonrpc.org/specification
- JSON Schema：https://json-schema.org/
- OpenAPI：https://www.openapis.org/
- OAuth 2.0 RFC 6749：https://www.rfc-editor.org/rfc/rfc6749
- OpenID Connect：https://openid.net/developers/how-connect-works/
- CloudEvents：https://cloudevents.io/
- Standard Webhooks：https://www.standardwebhooks.com/

模型工具调用：

- OpenAI Tools：https://platform.openai.com/docs/guides/tools
- Anthropic Tool Use：https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview
- Gemini Function Calling：https://ai.google.dev/gemini-api/docs/function-calling

代码和浏览器：

- Language Server Protocol：https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
- Debug Adapter Protocol：https://microsoft.github.io/debug-adapter-protocol/
- Tree-sitter：https://tree-sitter.github.io/tree-sitter/
- Playwright：https://playwright.dev/docs/intro
- Playwright MCP：https://github.com/microsoft/playwright-mcp
- Chrome DevTools Protocol：https://chromedevtools.github.io/devtools-protocol/
- WebDriver BiDi：https://w3c.github.io/webdriver-bidi/

平台 API：

- GitHub MCP Server：https://github.com/github/github-mcp-server
- GitHub REST API：https://docs.github.com/en/rest
- Gmail Push Notifications：https://developers.google.com/workspace/gmail/api/guides/push
- Google Drive API：https://developers.google.com/drive/api
- Google Calendar API：https://developers.google.com/calendar/api
- Microsoft Graph：https://learn.microsoft.com/en-us/graph/overview
- Slack API：https://api.slack.com/
- Discord API：https://discord.com/developers/docs/intro
- Telegram Bot API：https://core.telegram.org/bots/api
- LINE Messaging API：https://developers.line.biz/en/docs/messaging-api/
- Google Chat Webhooks：https://developers.google.com/workspace/chat/quickstart/webhooks
- Notion API：https://developers.notion.com/
- Linear API：https://developers.linear.app/
- Jira REST API：https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- Figma API：https://www.figma.com/developers/api
- Hugging Face Hub API：https://huggingface.co/docs/hub/api

## 一句话路线

先做一个小而硬的 Gateway：`Session + Provider + Tool Registry + MCP Client + 文件/代码/浏览器工具 + 视觉前端桥`。等这条主链路稳定，再逐步接 Gmail、Slack、GitHub、Notion、LSP、文档、多模态和自动任务。
