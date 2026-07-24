# docs/claw-integration-basis-research.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：567
- SHA-256：`eee864453580a169f9a9cbd3029b44f1dc9961789bc1d7318e83d4e6ed0957bb`
- 可运行副本：[打开源文件](../../../source/docs/claw-integration-basis-research.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`tools`、`calling`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># Claw 集成基座调研</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-05-22</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>目标：为自研 Claw 整理一套可落地的能力基座。核心思路不是从零重造所有工具，而是把已有标准、官方 SDK、开源 MCP server、平台 API 和本机能力统一接入一个核心 Gateway，再由视觉前端调用 Gateway。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## 总体判断</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>自研 Claw 最值得自己做的不是每个工具本身，而是这些层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>- `Gateway`：统一入口、鉴权、会话、事件流、工具调用、审批和审计。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- `Tool Registry`：把内置工具、MCP 工具、平台 API 工具、本机工具统一成一种描述。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- `Policy Engine`：按用户、会话、来源、工具风险、路径、OAuth scope 裁剪能力。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- `Runtime Manager`：管理 MCP server、浏览器、LSP、shell、worker 进程、外部 connector 的生命周期。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- `Visual Frontend Adapter`：把 Gateway 的事件流转成你的视觉前端状态，例如表情、动作、对话、任务进度、审批弹窗。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>应该尽量借用的部分：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>- MCP、JSON-RPC、JSON Schema、OpenAPI、OAuth 2.0、OIDC、Webhook、CloudEvents。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- OpenAI / Anthropic / Gemini 的原生 tool calling。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- LSP、DAP、Tree-sitter、ripgrep、Git/GitHub API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- Playwright、CDP、WebDriver BiDi。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- Gmail、Google Drive、Google Calendar、Microsoft Graph、Slack、Discord、Telegram、LINE、Notion、Linear、Jira、Figma 等官方 API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>## 目标架构</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>视觉前端 / 桌面端 / 移动端 / Web UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  -&gt; Gateway HTTP + WebSocket</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>  -&gt; Session / Run / Transcript / Event Bus</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>  -&gt; Agent Runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>  -&gt; Tool Registry + Policy Engine</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>  -&gt; 内置工具 / MCP Client / SaaS Connectors / Code Runtime / Browser Runtime / Local Runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>  -&gt; 文件、代码、浏览器、邮件、聊天、日历、知识库、云服务、本机动作</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>建议第一版 Gateway 对外只暴露少量稳定方法：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>&#124; 方法 &#124; 作用 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 40 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 41 | <code>&#124; `session.create` &#124; 创建会话 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 42 | <code>&#124; `chat.history` &#124; 读取历史 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 43 | <code>&#124; `chat.send` &#124; 发起一次 Agent run &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 44 | <code>&#124; `chat.abort` &#124; 取消 run &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 45 | <code>&#124; `events.subscribe` &#124; WebSocket 事件订阅 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 46 | <code>&#124; `tools.catalog` &#124; 查看当前会话可用工具 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 47 | <code>&#124; `tools.invoke` &#124; 统一工具调用入口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 48 | <code>&#124; `mcp.servers.list` &#124; 查看 MCP server 状态 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 49 | <code>&#124; `approvals.decide` &#124; 用户审批高风险动作 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>## 第一层：MCP 生态</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>MCP 是目前最值得优先接入的外部工具协议。它把外部系统暴露为 `tools`、`resources`、`prompts`，底层使用 JSON-RPC 风格消息，常见 transport 是 `stdio`、`Streamable HTTP`、历史 SSE。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>&#124; 能力 &#124; 建议接入方式 &#124; Gateway 里的抽象 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 56 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 57 | <code>&#124; 本地 MCP server &#124; `stdio` 启动子进程 &#124; `McpServerProcess` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 58 | <code>&#124; 远程 MCP server &#124; `streamable-http` &#124; `McpRemoteConnection` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 59 | <code>&#124; 老式 SSE MCP &#124; 兼容但不优先 &#124; `McpLegacySseConnection` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 60 | <code>&#124; MCP tools &#124; `tools/list` + `tools/call` &#124; 物化成内部 `ToolDescriptor` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 61 | <code>&#124; MCP resources &#124; `resources/list` + `resources/read` &#124; 物化成 `ResourceProvider` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 62 | <code>&#124; MCP prompts &#124; `prompts/list` + `prompts/get` &#124; 物化成 prompt 模板 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>第一版应该支持：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>- `stdio` MCP client。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- `streamable-http` MCP client。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- MCP tool catalog 缓存。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- MCP server health。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- 工具名安全重命名，避免不同 server 的 tool 撞名。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- 每个 MCP server 独立 allowlist。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>第一版不急着支持：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>- 自己实现完整 MCP server marketplace。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- 私有 MCP registry。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- MCP sampling / elicitation 的全量实现。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>推荐优先测试的 MCP server：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>&#124; MCP server &#124; 价值 &#124; 风险 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 82 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 83 | <code>&#124; `@modelcontextprotocol/server-filesystem` &#124; 文件读写能力 &#124; 必须限制目录 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 84 | <code>&#124; `mcp-server-git` &#124; Git diff、log、status &#124; 不要默认允许 destructive git &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 85 | <code>&#124; `github/github-mcp-server` &#124; GitHub repo、issue、PR、Actions &#124; 需要细粒度 OAuth/PAT scope &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 86 | <code>&#124; `@modelcontextprotocol/server-memory` &#124; 持久记忆样例 &#124; 要区分用户记忆与系统记忆 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 87 | <code>&#124; `@modelcontextprotocol/server-postgres` &#124; 数据库查询 &#124; 默认只读，防注入 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 88 | <code>&#124; `microsoft/playwright-mcp` &#124; 浏览器自动化 &#124; 不是安全边界，要隔离 profile &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>MCP 的关键设计原则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>- MCP server 不是可信内核，只是能力来源。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- MCP tool 暴露给模型前必须经过 Gateway policy。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- MCP 返回内容不能直接当可信系统指令。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>- 本地 stdio MCP 进程要有 cwd、env、timeout、stderr logging、生命周期清理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- 远程 MCP 要校验 URL、TLS、Authorization header、redirect、body size 和 SSRF。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>## 第二层：模型原生 Tool Calling</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>模型工具调用没有完全统一的行业标准。每家 provider 的 schema、调用事件、流式格式都有差异，所以你的 Claw 需要一个 provider adapter。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>&#124; Provider &#124; 能力 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 103 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 104 | <code>&#124; OpenAI Responses API &#124; function tools、hosted tools、remote MCP、结构化输出、流式事件 &#124; 第一优先，适合作为内部接口基准 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 105 | <code>&#124; Anthropic Claude &#124; tool use、MCP connector、computer use、text editor 类工具 &#124; 第二优先，代码 Agent 生态强 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 106 | <code>&#124; Google Gemini &#124; function calling、code execution、Google Search grounding、multimodal &#124; 适合多模态和 Google 生态 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 107 | <code>&#124; OpenAI-compatible &#124; vLLM、Ollama、LM Studio、OpenRouter、各种代理 &#124; 适合兼容层，但 tool calling 质量不统一 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>建议定义内部统一格式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>type ToolDescriptor = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  name: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  title?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  description: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  inputSchema: JsonSchema;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>  risk: "read" &#124; "write" &#124; "network" &#124; "exec" &#124; "credential" &#124; "destructive";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>  source: "builtin" &#124; "mcp" &#124; "connector" &#124; "frontend";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  providerHints?: Record&lt;string, unknown&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>type ToolCall = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>  id: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>  sessionId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>  runId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>  toolName: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>  args: unknown;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>  requestedBy: "model" &#124; "user" &#124; "system";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>Provider adapter 负责：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>- 把内部 `ToolDescriptor` 转成 OpenAI / Anthropic / Gemini 各自格式。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- 把 provider 的 tool call event 转回内部 `ToolCall`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- 把工具结果再转回 provider 所需消息格式。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- 处理流式 delta、tool call partial、retry、abort。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>## 第三层：Schema、API 描述和验证</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>工具调用的正确性主要靠 schema。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>&#124; 技术 &#124; 用途 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 144 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 145 | <code>&#124; JSON Schema &#124; 工具参数标准描述 &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 146 | <code>&#124; AJV &#124; 运行时 JSON Schema 校验 &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 147 | <code>&#124; Zod &#124; TypeScript 侧开发体验 &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 148 | <code>&#124; TypeBox &#124; TS 类型和 JSON Schema 同源 &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 149 | <code>&#124; OpenAPI &#124; 把 REST API 自动转成工具 &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 150 | <code>&#124; AsyncAPI &#124; 事件/消息系统描述 &#124; 可选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>Claw 内部建议所有工具必须满足：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>- 有 `name`、`description`、`inputSchema`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- 参数执行前必须 validate。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- validate 后再做权限检查。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>- 工具输出也要有最小结构，例如 `content`、`metadata`、`isError`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>## 第四层：代码能力</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>代码能力不要只理解成“读写文件”。一个真正可用的代码 Agent 至少需要以下能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>&#124; 能力 &#124; 标准 / 实现 &#124; 第一版建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 164 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 165 | <code>&#124; 文件读取 &#124; Node fs / Python pathlib / MCP filesystem &#124; 必选，只读白名单 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 166 | <code>&#124; 文件写入 &#124; Node fs / apply_patch &#124; 必选，默认 workspace-only &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 167 | <code>&#124; 搜索 &#124; ripgrep / fd &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 168 | <code>&#124; Patch &#124; unified diff / apply_patch &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 169 | <code>&#124; Shell &#124; child_process.spawn / node-pty &#124; 可选，默认审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 170 | <code>&#124; Git &#124; Git CLI / libgit2 / GitHub API &#124; 必选，先读后写 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 171 | <code>&#124; 语义能力 &#124; LSP &#124; 第二阶段优先 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 172 | <code>&#124; 调试能力 &#124; DAP &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 173 | <code>&#124; 语法树 &#124; Tree-sitter &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 174 | <code>&#124; 测试发现 &#124; package manager + test framework adapter &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>建议第一批代码工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>&#124; 工具 &#124; 风险 &#124; 行为 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 179 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 180 | <code>&#124; `file.read` &#124; read &#124; 只允许 workspace &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 181 | <code>&#124; `file.list` &#124; read &#124; 支持 glob 和 ignore &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 182 | <code>&#124; `code.search` &#124; read &#124; 包装 ripgrep &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 183 | <code>&#124; `file.patch` &#124; write &#124; 使用 patch，记录 diff &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 184 | <code>&#124; `git.status` &#124; read &#124; 无审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 185 | <code>&#124; `git.diff` &#124; read &#124; 无审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 186 | <code>&#124; `git.log` &#124; read &#124; 无审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 187 | <code>&#124; `test.run` &#124; exec &#124; 需策略允许，可超时 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 188 | <code>&#124; `shell.exec` &#124; exec &#124; 默认审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 189 | <code>&#124; `lsp.hover` &#124; read &#124; 后续接 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 190 | <code>&#124; `lsp.definition` &#124; read &#124; 后续接 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 191 | <code>&#124; `lsp.references` &#124; read &#124; 后续接 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>代码能力安全底线：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>- 永远不要让模型直接拼 shell 跑。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 196 | <code>- shell 参数要做结构化，不要只传一整串字符串。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>- `rm`、`git reset`、`git clean`、部署命令默认人工审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>- 写文件前记录 before/after diff。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- 工作区之外默认不可读不可写。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- `.env`、密钥文件、浏览器 cookie、SSH key 默认不可读。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>## 第五层：浏览器与电脑交互</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>浏览器能力优先用 Playwright。视觉前端如果需要“电脑控制”，也应通过 Gateway 暴露受控动作，而不是让模型直接操作系统。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>&#124; 能力 &#124; 标准 / 实现 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 207 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 208 | <code>&#124; 页面导航 &#124; Playwright &#124; 第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 209 | <code>&#124; DOM/可访问性树 &#124; Playwright accessibility snapshot &#124; 第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 210 | <code>&#124; 截图 &#124; Playwright screenshot &#124; 第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 211 | <code>&#124; 点击/输入 &#124; Playwright locator &#124; 第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 212 | <code>&#124; 浏览器底层调试 &#124; CDP &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 213 | <code>&#124; 跨浏览器自动化 &#124; WebDriver BiDi &#124; 可选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 214 | <code>&#124; 远程浏览器 &#124; Playwright server / browserless / CDP endpoint &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 215 | <code>&#124; 桌面 GUI &#124; Windows UI Automation / macOS Accessibility &#124; 暂缓 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>建议第一版工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>- `browser.open`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 220 | <code>- `browser.snapshot`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>- `browser.click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- `browser.type`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- `browser.screenshot`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>- `browser.extract_text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>风险点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>- 浏览器登录态等同真实账号权限。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- 页面内容可能包含 prompt injection。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>- 浏览器下载文件可能绕过文件权限。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 231 | <code>- `file://` 默认禁用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>- 每个会话最好使用隔离 browser context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>## 第六层：Web、搜索和抓取</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>&#124; 能力 &#124; 选项 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 237 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 238 | <code>&#124; 普通抓取 &#124; `fetch` / `undici` &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 239 | <code>&#124; HTML 提取 &#124; Readability / linkedom / cheerio &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 240 | <code>&#124; 搜索 &#124; Brave Search / Tavily / Bing / SerpAPI / provider hosted search &#124; 选一个 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 241 | <code>&#124; 站点地图 &#124; sitemap.xml &#124; 可选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 242 | <code>&#124; RSS &#124; RSS/Atom parser &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 243 | <code>&#124; 网页转 Markdown &#124; Readability + Turndown &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>安全底线：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>- SSRF 防护，禁止访问内网、metadata service、localhost，除非明确允许。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 248 | <code>- 限制响应大小、重定向次数、下载类型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 249 | <code>- 抓取结果标记为 `untrusted_web_content`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>## 第七层：邮件、日历、文件云盘</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>&#124; 平台 &#124; 官方接口 &#124; 第一版用途 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 254 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 255 | <code>&#124; Gmail &#124; Gmail API + push notifications + Pub/Sub &#124; 邮件读取、触发事件 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 256 | <code>&#124; Google Calendar &#124; Calendar API + push notifications &#124; 日程读取、创建事件 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 257 | <code>&#124; Google Drive &#124; Drive API + changes/watch &#124; 文件搜索、读取、上传 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 258 | <code>&#124; Microsoft 365 &#124; Microsoft Graph &#124; Outlook、Calendar、OneDrive、Teams &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 259 | <code>&#124; iCloud &#124; 无稳定开放全量 API &#124; 不建议第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>建议统一抽象：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 264 | <code>type ExternalEvent = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>  provider: "gmail" &#124; "google-calendar" &#124; "drive" &#124; "graph" &#124; string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>  accountId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>  eventType: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>  externalId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>  receivedAt: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>  payloadRef?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>原则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>- 邮件正文、附件、日历详情都算敏感数据。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 277 | <code>- OAuth token 放 Gateway secret store，前端永远不直接拿。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 278 | <code>- 事件型系统用 webhook / push notification，不靠频繁轮询。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 279 | <code>- 写操作，例如发邮件、改日历、删文件，默认需要审批或明确规则。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>## 第八层：聊天和协作平台</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>&#124; 平台 &#124; 接入方式 &#124; 建议优先级 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 284 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 285 | <code>&#124; Telegram &#124; Bot API / webhook / grammY &#124; 高 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 286 | <code>&#124; Slack &#124; Events API / Web API / incoming webhook &#124; 高 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 287 | <code>&#124; Discord &#124; Gateway / Interactions / Webhooks &#124; 中 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 288 | <code>&#124; LINE &#124; Messaging API / webhook &#124; 中 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 289 | <code>&#124; Google Chat &#124; Chat app / incoming webhook &#124; 中 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 290 | <code>&#124; Teams &#124; Microsoft Graph / Bot Framework &#124; 中 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 291 | <code>&#124; WhatsApp &#124; Meta WhatsApp Cloud API &#124; 后续 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>聊天平台统一抽象：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 296 | <code>type ChannelMessage = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>  channel: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>  accountId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 299 | <code>  conversationId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>  senderId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>  text?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>  attachments?: AttachmentRef[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>  receivedAt: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>  trust: "external" &#124; "trusted_operator" &#124; "system";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>关键策略：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>- 外部聊天内容默认不可信。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 311 | <code>- 群聊中需要 mention gating 或 allowlist。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 312 | <code>- 不要让任意陌生人触发高权限工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 313 | <code>- 每个平台单独做 rate limit 和 replay protection。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>## 第九层：项目管理、知识库和设计平台</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>&#124; 平台 &#124; 官方接口 / MCP &#124; 可做工具 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 318 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 319 | <code>&#124; GitHub &#124; REST/GraphQL API、官方 MCP server &#124; repo、issue、PR、Actions &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 320 | <code>&#124; GitLab &#124; REST/GraphQL API &#124; repo、MR、CI &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 321 | <code>&#124; Linear &#124; GraphQL API &#124; issue、project、cycle &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 322 | <code>&#124; Jira &#124; REST API &#124; issue、sprint、project &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 323 | <code>&#124; Notion &#124; Notion API &#124; page、database、search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 324 | <code>&#124; Confluence &#124; REST API &#124; 文档读取、发布 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 325 | <code>&#124; Figma &#124; REST API / plugin API &#124; 设计读取、token、assets &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 326 | <code>&#124; Hugging Face &#124; Hub API &#124; model、dataset、space &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>这些平台最适合先通过 MCP 接入。等某个能力成为核心路径，再做原生 connector。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>## 第十层：文档、媒体和多模态</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>&#124; 能力 &#124; 实现 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 333 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 334 | <code>&#124; PDF 读取 &#124; pdf.js / pdfplumber / poppler &#124; 第一版只读 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 335 | <code>&#124; DOCX &#124; mammoth / python-docx &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 336 | <code>&#124; PPTX &#124; pptxgenjs / python-pptx &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 337 | <code>&#124; XLSX &#124; SheetJS / openpyxl &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 338 | <code>&#124; OCR &#124; Tesseract / 云 OCR &#124; 需要时接 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 339 | <code>&#124; 图片理解 &#124; 模型 vision API &#124; 第一版可接 provider &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 340 | <code>&#124; TTS &#124; OpenAI / Azure / Edge TTS &#124; 可用于视觉前端 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 341 | <code>&#124; STT &#124; Whisper / Deepgram / Azure &#124; 可选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>文档工具风险：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>- Office 文档可能有宏和嵌入对象。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 346 | <code>- PDF/HTML/文档内容都可能携带 prompt injection。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 347 | <code>- 写文档类工具要有预览和 diff。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>## 第十一层：记忆和知识检索</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>&#124; 能力 &#124; 实现 &#124; 建议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 352 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 353 | <code>&#124; 短期会话记忆 &#124; Transcript JSONL / SQLite &#124; 必选 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 354 | <code>&#124; 长期用户记忆 &#124; SQLite / Postgres &#124; 第一版 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 355 | <code>&#124; 向量检索 &#124; sqlite-vec / pgvector / Qdrant &#124; 第二阶段 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 356 | <code>&#124; 全文检索 &#124; SQLite FTS5 / Meilisearch / Tantivy &#124; 推荐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 357 | <code>&#124; 知识图谱 &#124; Neo4j / RDF / 自建轻量图 &#124; 后续 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>记忆要分区：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>- `system_memory`：系统配置、工具状态。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- `user_memory`：用户偏好、长期事实。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>- `project_memory`：项目上下文、代码约定。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 364 | <code>- `session_memory`：当前会话临时信息。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>## Gateway 核心模块设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>建议模块边界：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>&#124; 模块 &#124; 职责 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 371 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 372 | <code>&#124; `gateway/server` &#124; HTTP + WebSocket + JSON-RPC &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 373 | <code>&#124; `gateway/auth` &#124; token、device、origin、scope &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 374 | <code>&#124; `gateway/events` &#124; event bus、订阅、backpressure &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 375 | <code>&#124; `sessions` &#124; session metadata、history、transcript &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 376 | <code>&#124; `runs` &#124; run lifecycle、abort、idempotency &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 377 | <code>&#124; `providers` &#124; OpenAI / Anthropic / Gemini adapter &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 378 | <code>&#124; `tools/registry` &#124; 工具注册、catalog、schema &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 379 | <code>&#124; `tools/policy` &#124; allow/deny、risk、审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 380 | <code>&#124; `tools/invoke` &#124; 统一执行入口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 381 | <code>&#124; `mcp/runtime` &#124; MCP server 生命周期和 catalog &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 382 | <code>&#124; `connectors` &#124; Gmail、Slack、GitHub 等原生接口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 383 | <code>&#124; `code-runtime` &#124; 文件、搜索、patch、git、LSP &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 384 | <code>&#124; `browser-runtime` &#124; Playwright contexts &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 385 | <code>&#124; `approvals` &#124; 审批请求、决策、持久记录 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 386 | <code>&#124; `secrets` &#124; OAuth token、API key、加密存储 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 387 | <code>&#124; `frontend-bridge` &#124; 视觉前端动作、表情、状态 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>核心数据模型：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 392 | <code>type CapabilityRisk =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>  &#124; "read"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 394 | <code>  &#124; "write"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 395 | <code>  &#124; "network"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 396 | <code>  &#124; "exec"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 397 | <code>  &#124; "browser"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 398 | <code>  &#124; "credential"</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 399 | <code>  &#124; "destructive";</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 401 | <code>type ToolPolicy = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 402 | <code>  allow?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 403 | <code>  deny?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>  requireApproval?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>  allowedPaths?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 406 | <code>  deniedPaths?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>  allowedHosts?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 408 | <code>  maxOutputBytes?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>  timeoutMs?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>type ToolResult = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 413 | <code>  content: Array&lt;{ type: "text" &#124; "json" &#124; "image" &#124; "file"; value: unknown }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 414 | <code>  metadata?: Record&lt;string, unknown&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 415 | <code>  isError?: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 417 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>## 安全基线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>第一天就要做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>- Gateway 默认只绑定 `127.0.0.1`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 424 | <code>- 非 loopback 必须 token、origin check、scope。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 425 | <code>- 前端只拿 session token，不拿 provider key 和 OAuth refresh token。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 426 | <code>- 所有工具先过 schema，再过 policy，再执行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 427 | <code>- 文件工具默认 workspace-only。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 428 | <code>- Shell 默认关闭或审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 429 | <code>- MCP server 默认不可信，逐个 allowlist。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 430 | <code>- Web fetch 做 SSRF 防护。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 431 | <code>- Webhook 做签名/secret、body size、rate limit、replay protection。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 432 | <code>- 高风险调用落审计日志。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 433 | <code>- 每个 run 有 `runId`、`idempotencyKey`、`AbortSignal`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 434 | <code>- 工具输出要标记来源和信任级别。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>高风险工具类别：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 438 | <code>&#124; 类别 &#124; 例子 &#124; 默认策略 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 439 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 440 | <code>&#124; `exec` &#124; shell、test、package install &#124; 审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 441 | <code>&#124; `write` &#124; 写文件、改 issue、改日历 &#124; 根据来源审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 442 | <code>&#124; `destructive` &#124; delete、reset、deploy、send email &#124; 强审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 443 | <code>&#124; `credential` &#124; OAuth、cookie、token、secret &#124; 不直接暴露给模型 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 444 | <code>&#124; `browser-auth` &#124; 登录态浏览器操作 &#124; 隔离 profile &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 445 | <code>&#124; `network-private` &#124; 内网 URL、本机 URL &#124; 默认禁止 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>## 性能基线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>必须避免每次对话都冷启动一切。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>- Gateway 常驻。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 452 | <code>- MCP catalog 缓存，带 TTL 和版本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- MCP stdio server 按需启动，空闲回收。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>- LSP server 按 workspace 复用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>- Browser context 按 session 复用，但 profile 隔离。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>- WebSocket 流式事件，慢客户端要背压或断开。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 457 | <code>- 工具结果限制大小，超大结果转文件引用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 458 | <code>- 长任务进入 job queue，不阻塞 Gateway 主循环。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 459 | <code>- 所有外部 API 设置 timeout、retry、circuit breaker。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>## 正确性基线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>- 所有 Gateway method 有 schema。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 464 | <code>- 所有工具参数有 schema。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 465 | <code>- 工具名稳定且唯一。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 466 | <code>- 工具调用有 `toolCallId`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 467 | <code>- 写操作有 before/after diff 或外部对象版本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 468 | <code>- 外部 webhook 事件有去重 key。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 469 | <code>- Provider 流式事件统一归一成内部 event。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 470 | <code>- Transcript 是事实源，UI 状态可以重建。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 471 | <code>- 测试覆盖 schema、policy、tool invoke、abort、retry、权限边界。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>## 第一版 MVP 选型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>建议你自己的 Claw 第一版只做这些：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>&#124; 层 &#124; 第一版内容 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 478 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 479 | <code>&#124; Gateway &#124; HTTP health + WebSocket JSON-RPC &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 480 | <code>&#124; Session &#124; `chat.history`、JSONL transcript &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 481 | <code>&#124; Provider &#124; OpenAI Responses 或 OpenAI-compatible 其一 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 482 | <code>&#124; Tool Registry &#124; 内置工具 + schema + policy &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 483 | <code>&#124; MCP &#124; stdio + streamable HTTP client &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 484 | <code>&#124; 文件工具 &#124; read/list/search/patch &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 485 | <code>&#124; Git 工具 &#124; status/diff/log &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 486 | <code>&#124; Browser &#124; Playwright open/snapshot/click/type/screenshot &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 487 | <code>&#124; Web &#124; fetch/search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 488 | <code>&#124; 视觉前端 &#124; expression/action/message/status &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 489 | <code>&#124; 安全 &#124; loopback、token、allowlist、审批 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>MVP 不建议一开始做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>- 全渠道聊天平台。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 494 | <code>- 完整 OAuth 多账号系统。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 495 | <code>- 私有 MCP marketplace。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 496 | <code>- 复杂远程节点。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 497 | <code>- 自动部署工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 498 | <code>- 完整 DAP 调试。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 499 | <code>- 高危本机 GUI 控制。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 501 | <code>## 第二阶段扩展</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>&#124; 方向 &#124; 能力 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 504 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 505 | <code>&#124; 代码智能 &#124; LSP hover/definition/references/completion &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 506 | <code>&#124; 项目协作 &#124; GitHub MCP、Linear、Jira、Notion &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 507 | <code>&#124; 邮件日历 &#124; Gmail、Google Calendar、Microsoft Graph &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 508 | <code>&#124; 文档 &#124; PDF/DOCX/XLSX/PPTX &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 509 | <code>&#124; 记忆 &#124; SQLite FTS + vector &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 510 | <code>&#124; 多模态 &#124; STT/TTS/vision/image &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 511 | <code>&#124; 自动任务 &#124; cron、watcher、heartbeat &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 512 | <code>&#124; 插件系统 &#124; manifest、permissions、lifecycle &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>## 参考资料</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>协议和标准：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>- MCP Specification：https://modelcontextprotocol.io/specification/2025-06-18</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 519 | <code>- MCP Registry：https://modelcontextprotocol.io/registry/about</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 520 | <code>- MCP TypeScript SDK：https://github.com/modelcontextprotocol/typescript-sdk</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 521 | <code>- MCP Servers：https://github.com/modelcontextprotocol/servers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 522 | <code>- JSON-RPC 2.0：https://www.jsonrpc.org/specification</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 523 | <code>- JSON Schema：https://json-schema.org/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 524 | <code>- OpenAPI：https://www.openapis.org/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 525 | <code>- OAuth 2.0 RFC 6749：https://www.rfc-editor.org/rfc/rfc6749</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 526 | <code>- OpenID Connect：https://openid.net/developers/how-connect-works/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 527 | <code>- CloudEvents：https://cloudevents.io/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 528 | <code>- Standard Webhooks：https://www.standardwebhooks.com/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>模型工具调用：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>- OpenAI Tools：https://platform.openai.com/docs/guides/tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 533 | <code>- Anthropic Tool Use：https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 534 | <code>- Gemini Function Calling：https://ai.google.dev/gemini-api/docs/function-calling</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>代码和浏览器：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>- Language Server Protocol：https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 539 | <code>- Debug Adapter Protocol：https://microsoft.github.io/debug-adapter-protocol/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 540 | <code>- Tree-sitter：https://tree-sitter.github.io/tree-sitter/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>- Playwright：https://playwright.dev/docs/intro</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>- Playwright MCP：https://github.com/microsoft/playwright-mcp</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 543 | <code>- Chrome DevTools Protocol：https://chromedevtools.github.io/devtools-protocol/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 544 | <code>- WebDriver BiDi：https://w3c.github.io/webdriver-bidi/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>平台 API：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>- GitHub MCP Server：https://github.com/github/github-mcp-server</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 549 | <code>- GitHub REST API：https://docs.github.com/en/rest</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 550 | <code>- Gmail Push Notifications：https://developers.google.com/workspace/gmail/api/guides/push</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>- Google Drive API：https://developers.google.com/drive/api</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 552 | <code>- Google Calendar API：https://developers.google.com/calendar/api</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 553 | <code>- Microsoft Graph：https://learn.microsoft.com/en-us/graph/overview</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 554 | <code>- Slack API：https://api.slack.com/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 555 | <code>- Discord API：https://discord.com/developers/docs/intro</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 556 | <code>- Telegram Bot API：https://core.telegram.org/bots/api</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 557 | <code>- LINE Messaging API：https://developers.line.biz/en/docs/messaging-api/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 558 | <code>- Google Chat Webhooks：https://developers.google.com/workspace/chat/quickstart/webhooks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 559 | <code>- Notion API：https://developers.notion.com/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 560 | <code>- Linear API：https://developers.linear.app/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 561 | <code>- Jira REST API：https://developer.atlassian.com/cloud/jira/platform/rest/v3/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 562 | <code>- Figma API：https://www.figma.com/developers/api</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 563 | <code>- Hugging Face Hub API：https://huggingface.co/docs/hub/api</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>## 一句话路线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>先做一个小而硬的 Gateway：`Session + Provider + Tool Registry + MCP Client + 文件/代码/浏览器工具 + 视觉前端桥`。等这条主链路稳定，再逐步接 Gmail、Slack、GitHub、Notion、LSP、文档、多模态和自动任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
