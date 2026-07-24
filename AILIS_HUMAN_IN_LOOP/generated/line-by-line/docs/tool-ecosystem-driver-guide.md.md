# docs/tool-ecosystem-driver-guide.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：933
- SHA-256：`b5ba58560776073867587e214e7997ab3bad9f5f12a6505cd11daff016b08354`
- 可运行副本：[打开源文件](../../../source/docs/tool-ecosystem-driver-guide.md)
- 依赖：`@modelcontextprotocol/server`、`@modelcontextprotocol/server/stdio`、`zod/v4`、`openai`
- 主要符号：`server`、`client`、`response`、`message`、`calling`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># Claw 工具生态驱动手册</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-05-22</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>目标：把已经下载到本地的 MCP、模型 SDK、代码能力、外部系统 SDK 整理成一套可直接驱动的开发基座。重点不是“知道它们存在”，而是知道应该怎样把它们挂进你自己的 Claw Gateway。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>本地参考库目录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## 一句话结论</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>你要做的不是“再造所有工具”，而是做一个强约束的 `Gateway`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- 上游接视觉前端、桌宠状态机、聊天 UI、审批 UI。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- 中间做 `Session / Run / Event Bus / Transcript / Policy / Secret / Connector Runtime`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- 下游统一接 `MCP`、模型原生 tools、代码工具、本机工具、SaaS SDK、Webhook。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>工具本身尽量借标准和开源实现，你自己重点掌控这几层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>- `Tool Registry`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- `Tool Policy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- `Approval`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- `Sandbox`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- `Session Isolation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- `Audit / Transcript`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- `Streaming Event Bridge`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>## 本地参考库清单</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>### MCP 与工具协议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>- `mcp-typescript-sdk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- `mcp-servers`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- `mcp-registry`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `github-mcp-server`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `playwright-mcp`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>### 模型 Provider SDK</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>- `openai-node`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- `anthropic-sdk-typescript`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- `google-js-genai`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>### 代码能力</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>- `ripgrep`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- `tree-sitter`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- `language-server-protocol`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- `debug-adapter-protocol`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- `playwright`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>### 外部系统 SDK</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>- `octokit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>- `google-api-nodejs-client`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- `msgraph-sdk-javascript`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- `slack-node-sdk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- `grammy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `notion-sdk-js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>### Schema / 规范 / 安全</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>- `ajv`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- `typebox`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- `zod`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- `openapi-specification`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- `cloudevents-spec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- `standard-webhooks`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- `devtools-protocol`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>说明：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>- 这批仓库已经下载到本地，可以作为代码参考。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- `LSP` 和 `DAP` 的官方 Node 实现仓库这轮没有拉成功，GitHub 连接重置了；当前本地只有协议规范仓库。第一版可以先按协议抽象设计 `Gateway`，后续补 `vscode-languageserver-node` 和 `vscode-debugadapter-node`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## 你的 Gateway 应该长什么样</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>建议先把所有下游能力统一成同一套内部协议，不要让前端或 Agent 直接知道自己调用的是 MCP、OpenAI tools、Slack SDK 还是本地 shell。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 82 | <code>export type ToolKind =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  &#124; 'local'</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 84 | <code>  &#124; 'mcp'</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 85 | <code>  &#124; 'provider-native'</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 86 | <code>  &#124; 'saas'</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 87 | <code>  &#124; 'browser'</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 88 | <code>  &#124; 'code';</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>export interface ToolDescriptor {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>  name: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>  title: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>  description: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>  inputSchema: unknown;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>  outputSchema?: unknown;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>  kind: ToolKind;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>  risk: 'low' &#124; 'medium' &#124; 'high';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>  idempotent?: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>  tags?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>  driver: ToolDriverRef;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>export interface ToolDriverRef {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>  type: 'local' &#124; 'mcp' &#124; 'provider' &#124; 'http' &#124; 'sdk';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>  target: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>  method?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>export interface ToolCallContext {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>  sessionId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>  runId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>  actorId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  cwd?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  allowReadPaths: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  allowWritePaths: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  approvalState: 'auto' &#124; 'required' &#124; 'granted' &#124; 'denied';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>export interface ToolCallResult {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>  ok: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>  content: Array&lt;{ type: 'text' &#124; 'json' &#124; 'file' &#124; 'image'; data: unknown }&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>  metrics?: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>    latencyMs?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    inputBytes?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>    outputBytes?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>  error?: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>    code: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>    message: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>    retryable?: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>  };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>核心原则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>- `ToolDescriptor` 是统一目录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- `ToolDriverRef` 只负责“怎么调用”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- `Policy Engine` 决定“能不能调用”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `Approval` 决定“现在要不要放行”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- `Transcript` 记录“谁在什么上下文里调了什么”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>## 第一层：MCP 怎么驱动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>### 1. `mcp-typescript-sdk`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\mcp-typescript-sdk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>当前状态判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>- 本地拉下来的是 `main` 分支，对应 README 里的 `v2` 预发布线。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- README 明确写了：生产环境当前优先用 `v1.x`，`v2` 适合提前做架构研究。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>你在 Claw 里应该怎么用：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>1. 先把 `Gateway` 做成 `MCP client`，不要一开始就做 Marketplace。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>2. 第一版只支持两种 transport：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>   `stdio`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>   本地起子进程，适合 filesystem、git、memory 之类工具</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>   `streamable-http`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>   远程 MCP，适合 GitHub 这类远程服务</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>3. 把每个 MCP server 的 `tools/list` 结果缓存成内部 `ToolDescriptor`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>4. 每次调用 `tools/call` 前再经过一次本地 `Policy Engine`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>最小驱动流程：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 170 | <code>spawn/connect</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>  -&gt; initialize</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>  -&gt; tools/list</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>  -&gt; 映射成 ToolDescriptor</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>  -&gt; tools/call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>  -&gt; 结果标准化</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>  -&gt; transcript 落盘</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>最小本地 server 参考来自 SDK README：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 182 | <code>import { McpServer } from '@modelcontextprotocol/server';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>import * as z from 'zod/v4';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>server.registerTool(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>  'greet',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>  {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>    description: 'Greet someone by name',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>    inputSchema: z.object({ name: z.string() }),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>  async ({ name }) =&gt; ({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>    content: [{ type: 'text', text: `Hello, ${name}!` }],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>  }),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>await server.connect(new StdioServerTransport());</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>Gateway 侧建议封装：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 205 | <code>interface McpServerSpec {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>  name: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>  mode: 'stdio' &#124; 'streamable-http';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>  command?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>  args?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>  url?: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>  env?: Record&lt;string, string&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>  allowTools?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>  denyTools?: string[];</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>  startupTimeoutMs?: number;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>### 2. `mcp-servers`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\mcp-servers`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>这个仓库的价值不是“直接上线生产”，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>- 看官方 reference server 怎么设计 tools/resources/prompts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>- 拿它们作为集成测试目标</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>- 用来验证你的 `stdio`、`uvx`、Windows 命令包装、tool catalog 刷新逻辑</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>README 里直接可跑的例子：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 233 | <code>npx -y @modelcontextprotocol/server-memory</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>uvx mcp-server-git</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>Windows 上如果你要兼容通用 MCP host 配置，通常要支持：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 240 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 241 | <code>  "command": "cmd",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 244 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>你应该优先接的 reference server：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>- `filesystem`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 249 | <code>- `git`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 250 | <code>- `memory`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 251 | <code>- `fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>- `time`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>为什么：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>- `filesystem` 和 `git` 能验证你的本地权限边界。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 257 | <code>- `memory` 能验证长会话工具生命周期。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- `fetch` 能验证 HTTP 出网和 SSRF 防护。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>- `time` 很适合拿来做最小稳定回归测试。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>### 3. `github-mcp-server`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\github-mcp-server`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>推荐接法：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>- 能用远程 MCP 就优先远程 MCP。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 270 | <code>- 只有在宿主不支持远程 MCP 或需要特殊主机配置时，再起本地 Docker 版。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>两种驱动方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>1. 远程 HTTP MCP</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 277 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>  "servers": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>    "github": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>      "type": "http",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>      "url": "https://api.githubcopilot.com/mcp/"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 282 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>2. 本地 Docker MCP</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 290 | <code>docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>你在 Gateway 里该怎么抽象：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>- 把 GitHub 能力当成一个外部 `McpServerSpec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 296 | <code>- 用 `toolsets` 或 `allowed_tools` 限制暴露面</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- 默认只开只读工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>- 写操作进入审批流</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>建议默认 toolset：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>- `context`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 303 | <code>- `repos`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 304 | <code>- `issues`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 305 | <code>- `pull_requests`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>第二阶段再放开：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>- `actions`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 310 | <code>- `security`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 311 | <code>- `notifications`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>### 4. `playwright-mcp`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\playwright-mcp`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>推荐启动方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 322 | <code>npx @playwright/mcp@latest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>README 的判断很重要：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 327 | <code>- 如果你做的是“代码代理”，CLI + skill 往往更省 token。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>- 如果你做的是“长时有状态浏览器 Agent”，MCP 更合适。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>你的 Claw 应该这样接：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>- 把浏览器自动化拆成单独 runtime，不要塞进普通 shell tool。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>- 会话级持有 browser context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 334 | <code>- 用 `accessibility snapshot` 或结构化 DOM 作为主输入，不要默认走截图 OCR。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 335 | <code>- 只有需要视觉确认时才补截图。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>这里要和 OpenClaw 对齐一下：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>- 对模型暴露的第一版工具名，建议先保留 `browser` 这个兼容位。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 340 | <code>- `browser.open / browser.click / browser.type / browser.snapshot` 这些更适合做内部 driver 方法。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 341 | <code>- 如果第一版不直接做 `browser`，也可以先把浏览器能力挂成 plugin tool 或 MCP tool，而不是把一套新的点式命名固化成公共接口。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>## 第二层：模型 Provider 原生 tools 怎么驱动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>思路不是让前端分别适配 OpenAI、Claude、Gemini，而是在 Gateway 内部做 provider adapter。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>### 1. `openai-node`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\openai-node`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>适合你关注的能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>- `Responses API`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 356 | <code>- 流式 SSE</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 357 | <code>- function/tool calling</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 358 | <code>- webhook 验签</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- Realtime WebSocket</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>最小文本调用：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 364 | <code>import OpenAI from 'openai';</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>const response = await client.responses.create({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>  model: 'gpt-5.2',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>  input: 'hello',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>工具调用有两条路：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>1. 你自己维护 tool loop</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>2. 用 SDK 自带 helper，比如 examples 里的 `runTools` 和 `zodFunction`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>本地 examples 值得看：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>- `examples/tool-call-helpers-zod.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 382 | <code>- `examples/parsing-tools.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 383 | <code>- `examples/responses/streaming-tools.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 384 | <code>- `examples/responses/websocket.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>对你的 Gateway 最重要的判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>- 如果你要统一多模型，建议自己维护 tool loop，不要过度绑定单家 SDK helper。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 389 | <code>- 但可以借 `zodFunction` 这类 helper 来快速产出 JSON Schema。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>### 2. `anthropic-sdk-typescript`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\anthropic-sdk-typescript`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 397 | <code>本地 examples 已经把 tool loop 写得很清楚：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>- `examples/tools.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 400 | <code>- `examples/tools-streaming.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 401 | <code>- `examples/tools-helpers-json-schema.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 402 | <code>- `examples/mcp.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>Claude 的最小 tool loop 形态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 407 | <code>const message = await client.messages.create({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 408 | <code>  model: 'claude-sonnet-4-5-20250929',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>  max_tokens: 1024,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>  messages: [userMessage],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>  tools,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 414 | <code>// 如果 stop_reason === 'tool_use'</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 415 | <code>// 取出 tool_use block</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 416 | <code>// 执行本地工具</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 417 | <code>// 再把 tool_result 作为下一轮 user content 送回去</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 418 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>Anthropic 这条线有一个很值得你研究的点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 422 | <code>- 它已经在 SDK example 里演示了 `mcp_servers`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>也就是 Claude 不只是“自己定义 tools”，还可以直接消费远程 MCP server：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 427 | <code>mcp_servers: [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>  {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 429 | <code>    type: 'url',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 430 | <code>    url: 'http://example-server.modelcontextprotocol.io/sse',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 431 | <code>    name: 'example',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>    authorization_token: 'YOUR_TOKEN',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>对你的启发是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>- 你的 Claw Gateway 既可以自己维护 MCP client</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 440 | <code>- 也可以在特定 provider 上直接透传给 provider-native MCP</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 441 | <code>- 但从可控性、审计和跨模型一致性来说，优先建议你自己托管 MCP client</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>### 3. `google-js-genai`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\google-js-genai`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>Gemini 这条线的亮点很多：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>- 普通 function calling</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 452 | <code>- `mcpToTool`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- 内建 `google_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>- 内建 `code_execution`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>- 示例里还有 `computer_use`、`url_context`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 457 | <code>最有参考价值的本地 sample：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>- `sdk-samples/generate_content_with_function_calling.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 460 | <code>- `sdk-samples/mcp_client.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 461 | <code>- `sdk-samples/interactions_tool_call_with_mcp_server.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 462 | <code>- `sdk-samples/interactions_tool_call_with_code_execution.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 463 | <code>- `sdk-samples/interactions_tool_call_with_google_search.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>最值得你注意的是 `mcpToTool`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 468 | <code>tools: [mcpToTool(printingClient, beepingClient)]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 469 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>这说明 Gemini 生态已经把“把 MCP server 映射成模型工具”做成了现成功能。对你自己的 Gateway 来说，最稳的路线依然是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>- 内部统一注册所有工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 474 | <code>- 对外再按 provider 转成 OpenAI / Claude / Gemini 各自的 tool schema</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>不要反过来让内部架构跟着某一家 provider 的 tool 形状跑。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>## 第三层：代码能力怎么驱动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>代码能力建议拆成 6 个子系统，不要用一个大而全的“code tool”糊起来。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>### 1. 文件系统工具</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>这层建议你自己实现，不直接外包给第三方 SDK。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>和 OpenClaw 对齐后的建议是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>- 对模型暴露：`read`、`write`、`edit`、`apply_patch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 489 | <code>- 对 Gateway 内部 driver：可以继续拆成 `read_text`、`read_json`、`list_dir`、`glob`、`stat`、`write_file` 这些更细操作</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>也就是说：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>- `read / write / edit / apply_patch` 是公共 tool surface</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 494 | <code>- 更细的文件函数是内部实现细节</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 496 | <code>必须做的约束：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>- `allowReadPaths`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 499 | <code>- `allowWritePaths`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 500 | <code>- workspace root 校验</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 501 | <code>- 二进制/大文件大小限制</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 502 | <code>- 写操作审批</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>### 2. 搜索与 grep：`ripgrep`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\ripgrep`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 510 | <code>这是你本地代码搜索的首选底座，不要自己写递归 grep。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 512 | <code>推荐暴露的工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>- `code.search_text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 515 | <code>- `code.search_files`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 516 | <code>- `code.search_symbol_hint`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>典型驱动命令：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 521 | <code>rg "pattern" &lt;path&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 522 | <code>rg --files &lt;path&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>rg -n "TODO&#124;FIXME" &lt;path&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>rg -t ts "ToolDescriptor" src</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 525 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 527 | <code>为什么重要：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 529 | <code>- 默认尊重 `.gitignore`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 530 | <code>- Windows 支持好</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 531 | <code>- 性能稳定</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>### 3. 语法树：`tree-sitter`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\tree-sitter`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>它不是编辑器替代品，而是给你的 Gateway 提供：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>- 语法级 chunking</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>- 函数/类/导入提取</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 543 | <code>- 符号级 diff</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 544 | <code>- prompt 上下文压缩</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 545 | <code>- 简单 refactor 辅助</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>适合暴露的内部能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>- `code.parse_ast`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 550 | <code>- `code.list_symbols`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>- `code.extract_function`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 552 | <code>- `code.chunk_semantic`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 554 | <code>建议定位：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>- `Tree-sitter` 用来补 LSP 的空白</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 557 | <code>- 不要拿它取代 LSP 的 rename / references / diagnostics</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>### 4. 语言服务：`LSP`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>本地协议仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 562 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 563 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\language-server-protocol`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>第一版怎么接最稳：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>1. 先做一个 `LspRuntimeManager`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>2. 按语言启动对应的 language server 进程</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>3. 通过 JSON-RPC 管理 `initialize / didOpen / didChange / completion / hover / definition / references / rename / codeAction`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>4. 结果只暴露成内部工具，不把 LSP 原始包直接给 Agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>建议第一批对外工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>- `lsp.hover`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 575 | <code>- `lsp.definition`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 576 | <code>- `lsp.references`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 577 | <code>- `lsp.document_symbols`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 578 | <code>- `lsp.workspace_symbols`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 579 | <code>- `lsp.rename_preview`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 580 | <code>- `lsp.diagnostics`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 581 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 582 | <code>为什么只先做这些：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 583 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 584 | <code>- 这些工具最稳</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 585 | <code>- 最容易做可解释 UI</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 586 | <code>- 不会一上来就把编辑流程绑死在某个语言 server 的怪异行为上</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 588 | <code>### 5. 调试协议：`DAP`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 589 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 590 | <code>本地协议仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 592 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\debug-adapter-protocol`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>DAP 适合第二阶段接入，不建议第一版就做满。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>第一版如果要接，建议只做只读调试：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 598 | <code>- `debug.launch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 599 | <code>- `debug.set_breakpoints`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 600 | <code>- `debug.continue`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 601 | <code>- `debug.stacktrace`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 602 | <code>- `debug.scopes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 603 | <code>- `debug.variables`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>不要第一天就给 Agent：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 607 | <code>- 任意 attach 任意进程</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 608 | <code>- 任意写变量</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 609 | <code>- 任意执行 debug console 命令</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>### 6. Git 与代码宿主</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 613 | <code>本地代码工作区内：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 614 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 615 | <code>- Git CLI 负责本地仓库操作</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 616 | <code>- `octokit` 或 `github-mcp-server` 负责远程 GitHub</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>最小本地 git 工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>- `git.status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 621 | <code>- `git.diff`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 622 | <code>- `git.show`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 623 | <code>- `git.log`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 624 | <code>- `git.add`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 625 | <code>- `git.commit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 626 | <code>- `git.branch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>高风险动作：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>- `git.push`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 631 | <code>- `git.reset`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 632 | <code>- `git.checkout --`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 633 | <code>- `git rebase`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>这些都应该审批。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>## 第四层：外部系统怎么驱动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>### 1. Google API：Gmail / Drive / Calendar</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 643 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\google-api-nodejs-client`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>适合场景：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 647 | <code>- Gmail 读信、发信、watch</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 648 | <code>- Drive 文件搜索与下载</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 649 | <code>- Calendar 读写日程</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 651 | <code>驱动方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>- 用户 OAuth2 为主</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 654 | <code>- 后端保管 refresh token</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 655 | <code>- Gateway 用 token broker 代发请求</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>这个 SDK 的现实判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 659 | <code>- 适合 Workspace API 接入</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 660 | <code>- 但它自己处于 maintenance mode</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 661 | <code>- 对 GCP 基础设施能力，优先用更专门的 `@google-cloud/*`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 663 | <code>这里也建议和 OpenClaw 风格保持克制：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>- 这些更适合作为 connector / plugin / MCP tool 的内部能力</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 666 | <code>- 第一版不要急着把 `gmail.* / drive.* / calendar.*` 固化成核心公共工具名</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 667 | <code>- 如果后面真的要对模型公开，优先走 flat snake_case 命名，而不是点式命名</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>### 2. Microsoft Graph：Outlook / Calendar / OneDrive</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 671 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\msgraph-sdk-javascript`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>驱动方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 677 | <code>- Azure AD / Microsoft identity</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 678 | <code>- Gateway 保存租户配置和 refresh token</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 679 | <code>- `client.api(path)` 做 REST 风格调用</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>建议把这类能力先归到 connector 层，而不是第一版 core tool surface。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>### 3. Slack</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\slack-node-sdk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>Slack 不要只理解成“发一条消息”，它有几条不同接入面：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 691 | <code>- `@slack/web-api`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>- `@slack/oauth`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 693 | <code>- `@slack/webhook`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 694 | <code>- `@slack/socket-mode`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>怎么选：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>- 只发通知：`webhook`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 699 | <code>- 读写频道、线程、用户：`web-api`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 700 | <code>- 需要实时事件：`socket-mode` 或 Events API</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 701 | <code>- 需要用户安装授权：`oauth`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 703 | <code>建议先把 Slack 做成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 705 | <code>- channel adapter</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 706 | <code>- connector runtime</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 707 | <code>- 或 plugin tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>而不是在第一版核心工具面里再发明一套新的 `slack.*` 命名。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>### 4. Telegram</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\grammy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>这条线适合拿来做“外部人格入口”：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>- Telegram bot 是一个很轻量的外部聊天壳</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 720 | <code>- 你可以把消息事件转换成 Gateway `chat.send`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>建议角色：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>- `Channel Adapter`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 725 | <code>- 而不是工具库本身</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 726 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 727 | <code>### 5. Notion</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 729 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\notion-sdk-js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>Notion SDK 的优点是简单直接，适合：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>- 检索知识库</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 736 | <code>- 读 page / block / database</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 737 | <code>- 新建页面、写笔记</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 739 | <code>这个 SDK 自带一些很实用的工程能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 741 | <code>- 错误码分类</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 742 | <code>- debug logging</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 743 | <code>- 自动 retry</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 745 | <code>Notion 也类似：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 746 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 747 | <code>- 先做 connector / plugin tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 748 | <code>- 核心工具面优先对齐 OpenClaw 的通用工具名</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>### 6. GitHub REST / GraphQL：`octokit`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 751 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 752 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 754 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\octokit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 756 | <code>GitHub 这条线建议双轨：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 758 | <code>- 本地代码上下文和仓库动作：优先 `github-mcp-server`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 759 | <code>- 精细 REST / GraphQL 业务动作：补 `octokit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>适合用 `octokit` 的地方：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>- 某些 GitHub MCP 不好覆盖的细节 API</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 764 | <code>- Webhook 验签</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 765 | <code>- GitHub App auth</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 766 | <code>- GraphQL 查询</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>## 第五层：Schema、事件和 Webhook 基座</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 770 | <code>### 1. `zod` / `typebox` / `ajv`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 771 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 772 | <code>本地仓库：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\zod`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 775 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\typebox`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 776 | <code>- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\ajv`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 777 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 778 | <code>推荐组合：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 780 | <code>- 开发时写 schema：`zod` 或 `typebox`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 781 | <code>- 运行时高性能校验：`ajv`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>落地建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>- `ToolDescriptor.inputSchema` 统一导出为 JSON Schema</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 786 | <code>- `Gateway` 在 `tools.invoke`、`webhook.receive`、`connector.callback`、`approval.submit` 统一用 `ajv` 校验</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 787 | <code>- 如果你重视 TypeScript 类型一体化，`typebox + ajv` 很适合做内部协议</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 788 | <code>- 如果你重视开发体验和 provider helper 兼容，`zod` 很舒服</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>### 2. `openapi-specification`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>这个仓库的价值是帮你约束：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>- Gateway HTTP API</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 795 | <code>- Connector OAuth callback API</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 796 | <code>- 外部 Webhook API</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 798 | <code>建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>- `Gateway REST API` 用 OpenAPI 描述</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 801 | <code>- 但内部 tool 协议还是 JSON Schema 即可</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>### 3. `cloudevents-spec`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 805 | <code>适合你做统一事件总线时使用。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>推荐内部事件格式参考：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 809 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 810 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 811 | <code>  "id": "evt_123",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 812 | <code>  "type": "tool.call.completed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 813 | <code>  "source": "gateway/tool-runtime",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 814 | <code>  "time": "2026-05-22T12:34:56Z",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 815 | <code>  "subject": "session_abc",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 816 | <code>  "data": {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 817 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 818 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 820 | <code>这会让你的：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>- WebSocket push</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 823 | <code>- webhook 出站</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 824 | <code>- 审计日志</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 825 | <code>- 回放系统</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 827 | <code>更容易统一。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 828 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 829 | <code>### 4. `standard-webhooks`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>这个仓库很适合做 webhook 安全基座。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 833 | <code>你自己的 Claw 如果将来要对外发 webhook，建议直接遵循它的签名规范，不要自造签名头。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 834 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 835 | <code>用法建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>- 入站 webhook：按各家官方规范验签</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 838 | <code>- 出站 webhook：你自己的 Gateway 统一采用 `standard-webhooks`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 839 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 840 | <code>## 性能、正确性、安全怎么做</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>### 性能</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 844 | <code>- `Tool catalog` 做 session 级缓存，避免每轮都重拉 MCP `tools/list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 845 | <code>- 长连接流式输出统一走 WebSocket/SSE，不要轮询</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 846 | <code>- 浏览器、LSP、MCP server 做 runtime 复用，不要每次请求冷启动</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 847 | <code>- 代码搜索优先 `rg`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 848 | <code>- AST 解析优先增量化，能缓存就缓存</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 850 | <code>### 正确性</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 852 | <code>- 所有 tool args 先过 JSON Schema 校验</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 853 | <code>- 结果做标准化，避免 provider 间工具输出格式漂移</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 854 | <code>- 非幂等工具必须带 `idempotencyKey`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 855 | <code>- 关键动作要有 dry-run / preview</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 856 | <code>- 写操作尽量走 `plan -&gt; preview -&gt; approve -&gt; apply`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 857 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 858 | <code>### 安全</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 860 | <code>- 文件系统按路径白名单</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 861 | <code>- shell 按命令 allowlist 或 safe bin 分类</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 862 | <code>- 出网按域名 allowlist</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 863 | <code>- OAuth token 不直接暴露给模型</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 864 | <code>- 高风险工具进入审批</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 865 | <code>- transcript 默认全量记录</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 866 | <code>- webhook 和 OAuth callback 都做 nonce / signature / origin 校验</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>## 第一版建议接入顺序</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 870 | <code>先做小闭环，不要一口吃满所有生态。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 872 | <code>### Phase 1：最小可用 Claw</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>- `Gateway`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 875 | <code>- `Session / Run / Transcript / Event Bus`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 876 | <code>- 一个模型 provider adapter</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 877 | <code>- 本地文件工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 878 | <code>- `ripgrep`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 879 | <code>- `git` 只读工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 880 | <code>- `playwright-mcp`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 881 | <code>- `mcp-typescript-sdk` client</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 882 | <code>- `mcp-servers` 里的 `filesystem`、`git`、`time`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>### Phase 2：真正好用</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 885 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 886 | <code>- OpenAI / Claude / Gemini 三家 tool adapter</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 887 | <code>- `github-mcp-server`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 888 | <code>- `octokit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 889 | <code>- `Tree-sitter`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 890 | <code>- `LSP Runtime`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 891 | <code>- `Notion`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 892 | <code>- `Slack`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>### Phase 3：外部人格与办公流</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>- Gmail / Calendar / Drive</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 897 | <code>- Microsoft Graph</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 898 | <code>- Telegram / Discord / LINE channel adapter</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 899 | <code>- webhook 出站</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 900 | <code>- automation / heartbeat / scheduled run</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>## 接下来最值得立刻实现的模块</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 903 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 904 | <code>如果你现在就要开始写自己的 Claw，我建议直接开这 6 个目录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 906 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 907 | <code>src/gateway/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 908 | <code>src/session/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 909 | <code>src/events/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 910 | <code>src/tools/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 911 | <code>src/connectors/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 912 | <code>src/runtimes/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 913 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>其中优先级最高的 4 个文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 917 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 918 | <code>src/tools/tool-registry.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 919 | <code>src/tools/tool-policy.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 920 | <code>src/runtimes/mcp-runtime.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 921 | <code>src/gateway/chat-send.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 922 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 924 | <code>这 4 个先跑通，你后面加任何工具都会快很多。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>## 本轮结果</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 928 | <code>这轮不是只列文档，而是已经把一批关键参考仓库拉到了本地，并把它们整理成了可直接映射到 `Gateway` 的驱动手册。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>配套文档：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 932 | <code>- [claw-integration-basis-research.md](claw-integration-basis-research.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 933 | <code>- [openclaw-from-zero.md](openclaw-from-zero.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
