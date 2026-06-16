# Claw 工具生态驱动手册

日期：2026-05-22

目标：把已经下载到本地的 MCP、模型 SDK、代码能力、外部系统 SDK 整理成一套可直接驱动的开发基座。重点不是“知道它们存在”，而是知道应该怎样把它们挂进你自己的 Claw Gateway。

本地参考库目录：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem`

## 一句话结论

你要做的不是“再造所有工具”，而是做一个强约束的 `Gateway`：

- 上游接视觉前端、桌宠状态机、聊天 UI、审批 UI。
- 中间做 `Session / Run / Event Bus / Transcript / Policy / Secret / Connector Runtime`。
- 下游统一接 `MCP`、模型原生 tools、代码工具、本机工具、SaaS SDK、Webhook。

工具本身尽量借标准和开源实现，你自己重点掌控这几层：

- `Tool Registry`
- `Tool Policy`
- `Approval`
- `Sandbox`
- `Session Isolation`
- `Audit / Transcript`
- `Streaming Event Bridge`

## 本地参考库清单

### MCP 与工具协议

- `mcp-typescript-sdk`
- `mcp-servers`
- `mcp-registry`
- `github-mcp-server`
- `playwright-mcp`

### 模型 Provider SDK

- `openai-node`
- `anthropic-sdk-typescript`
- `google-js-genai`

### 代码能力

- `ripgrep`
- `tree-sitter`
- `language-server-protocol`
- `debug-adapter-protocol`
- `playwright`

### 外部系统 SDK

- `octokit`
- `google-api-nodejs-client`
- `msgraph-sdk-javascript`
- `slack-node-sdk`
- `grammy`
- `notion-sdk-js`

### Schema / 规范 / 安全

- `ajv`
- `typebox`
- `zod`
- `openapi-specification`
- `cloudevents-spec`
- `standard-webhooks`
- `devtools-protocol`

说明：

- 这批仓库已经下载到本地，可以作为代码参考。
- `LSP` 和 `DAP` 的官方 Node 实现仓库这轮没有拉成功，GitHub 连接重置了；当前本地只有协议规范仓库。第一版可以先按协议抽象设计 `Gateway`，后续补 `vscode-languageserver-node` 和 `vscode-debugadapter-node`。

## 你的 Gateway 应该长什么样

建议先把所有下游能力统一成同一套内部协议，不要让前端或 Agent 直接知道自己调用的是 MCP、OpenAI tools、Slack SDK 还是本地 shell。

```ts
export type ToolKind =
  | 'local'
  | 'mcp'
  | 'provider-native'
  | 'saas'
  | 'browser'
  | 'code';

export interface ToolDescriptor {
  name: string;
  title: string;
  description: string;
  inputSchema: unknown;
  outputSchema?: unknown;
  kind: ToolKind;
  risk: 'low' | 'medium' | 'high';
  idempotent?: boolean;
  tags?: string[];
  driver: ToolDriverRef;
}

export interface ToolDriverRef {
  type: 'local' | 'mcp' | 'provider' | 'http' | 'sdk';
  target: string;
  method?: string;
}

export interface ToolCallContext {
  sessionId: string;
  runId: string;
  actorId: string;
  cwd?: string;
  allowReadPaths: string[];
  allowWritePaths: string[];
  approvalState: 'auto' | 'required' | 'granted' | 'denied';
}

export interface ToolCallResult {
  ok: boolean;
  content: Array<{ type: 'text' | 'json' | 'file' | 'image'; data: unknown }>;
  metrics?: {
    latencyMs?: number;
    inputBytes?: number;
    outputBytes?: number;
  };
  error?: {
    code: string;
    message: string;
    retryable?: boolean;
  };
}
```

核心原则：

- `ToolDescriptor` 是统一目录。
- `ToolDriverRef` 只负责“怎么调用”。
- `Policy Engine` 决定“能不能调用”。
- `Approval` 决定“现在要不要放行”。
- `Transcript` 记录“谁在什么上下文里调了什么”。

## 第一层：MCP 怎么驱动

### 1. `mcp-typescript-sdk`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\mcp-typescript-sdk`

当前状态判断：

- 本地拉下来的是 `main` 分支，对应 README 里的 `v2` 预发布线。
- README 明确写了：生产环境当前优先用 `v1.x`，`v2` 适合提前做架构研究。

你在 Claw 里应该怎么用：

1. 先把 `Gateway` 做成 `MCP client`，不要一开始就做 Marketplace。
2. 第一版只支持两种 transport：
   `stdio`
   本地起子进程，适合 filesystem、git、memory 之类工具
   `streamable-http`
   远程 MCP，适合 GitHub 这类远程服务
3. 把每个 MCP server 的 `tools/list` 结果缓存成内部 `ToolDescriptor`。
4. 每次调用 `tools/call` 前再经过一次本地 `Policy Engine`。

最小驱动流程：

```text
spawn/connect
  -> initialize
  -> tools/list
  -> 映射成 ToolDescriptor
  -> tools/call
  -> 结果标准化
  -> transcript 落盘
```

最小本地 server 参考来自 SDK README：

```ts
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });

server.registerTool(
  'greet',
  {
    description: 'Greet someone by name',
    inputSchema: z.object({ name: z.string() }),
  },
  async ({ name }) => ({
    content: [{ type: 'text', text: `Hello, ${name}!` }],
  }),
);

await server.connect(new StdioServerTransport());
```

Gateway 侧建议封装：

```ts
interface McpServerSpec {
  name: string;
  mode: 'stdio' | 'streamable-http';
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
  allowTools?: string[];
  denyTools?: string[];
  startupTimeoutMs?: number;
}
```

### 2. `mcp-servers`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\mcp-servers`

这个仓库的价值不是“直接上线生产”，而是：

- 看官方 reference server 怎么设计 tools/resources/prompts
- 拿它们作为集成测试目标
- 用来验证你的 `stdio`、`uvx`、Windows 命令包装、tool catalog 刷新逻辑

README 里直接可跑的例子：

```bash
npx -y @modelcontextprotocol/server-memory
uvx mcp-server-git
```

Windows 上如果你要兼容通用 MCP host 配置，通常要支持：

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]
}
```

你应该优先接的 reference server：

- `filesystem`
- `git`
- `memory`
- `fetch`
- `time`

为什么：

- `filesystem` 和 `git` 能验证你的本地权限边界。
- `memory` 能验证长会话工具生命周期。
- `fetch` 能验证 HTTP 出网和 SSRF 防护。
- `time` 很适合拿来做最小稳定回归测试。

### 3. `github-mcp-server`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\github-mcp-server`

推荐接法：

- 能用远程 MCP 就优先远程 MCP。
- 只有在宿主不支持远程 MCP 或需要特殊主机配置时，再起本地 Docker 版。

两种驱动方式：

1. 远程 HTTP MCP

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

2. 本地 Docker MCP

```bash
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

你在 Gateway 里该怎么抽象：

- 把 GitHub 能力当成一个外部 `McpServerSpec`
- 用 `toolsets` 或 `allowed_tools` 限制暴露面
- 默认只开只读工具
- 写操作进入审批流

建议默认 toolset：

- `context`
- `repos`
- `issues`
- `pull_requests`

第二阶段再放开：

- `actions`
- `security`
- `notifications`

### 4. `playwright-mcp`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\playwright-mcp`

推荐启动方式：

```bash
npx @playwright/mcp@latest
```

README 的判断很重要：

- 如果你做的是“代码代理”，CLI + skill 往往更省 token。
- 如果你做的是“长时有状态浏览器 Agent”，MCP 更合适。

你的 Claw 应该这样接：

- 把浏览器自动化拆成单独 runtime，不要塞进普通 shell tool。
- 会话级持有 browser context。
- 用 `accessibility snapshot` 或结构化 DOM 作为主输入，不要默认走截图 OCR。
- 只有需要视觉确认时才补截图。

这里要和 OpenClaw 对齐一下：

- 对模型暴露的第一版工具名，建议先保留 `browser` 这个兼容位。
- `browser.open / browser.click / browser.type / browser.snapshot` 这些更适合做内部 driver 方法。
- 如果第一版不直接做 `browser`，也可以先把浏览器能力挂成 plugin tool 或 MCP tool，而不是把一套新的点式命名固化成公共接口。

## 第二层：模型 Provider 原生 tools 怎么驱动

思路不是让前端分别适配 OpenAI、Claude、Gemini，而是在 Gateway 内部做 provider adapter。

### 1. `openai-node`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\openai-node`

适合你关注的能力：

- `Responses API`
- 流式 SSE
- function/tool calling
- webhook 验签
- Realtime WebSocket

最小文本调用：

```ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.responses.create({
  model: 'gpt-5.2',
  input: 'hello',
});
```

工具调用有两条路：

1. 你自己维护 tool loop
2. 用 SDK 自带 helper，比如 examples 里的 `runTools` 和 `zodFunction`

本地 examples 值得看：

- `examples/tool-call-helpers-zod.ts`
- `examples/parsing-tools.ts`
- `examples/responses/streaming-tools.ts`
- `examples/responses/websocket.ts`

对你的 Gateway 最重要的判断：

- 如果你要统一多模型，建议自己维护 tool loop，不要过度绑定单家 SDK helper。
- 但可以借 `zodFunction` 这类 helper 来快速产出 JSON Schema。

### 2. `anthropic-sdk-typescript`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\anthropic-sdk-typescript`

本地 examples 已经把 tool loop 写得很清楚：

- `examples/tools.ts`
- `examples/tools-streaming.ts`
- `examples/tools-helpers-json-schema.ts`
- `examples/mcp.ts`

Claude 的最小 tool loop 形态：

```ts
const message = await client.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  messages: [userMessage],
  tools,
});

// 如果 stop_reason === 'tool_use'
// 取出 tool_use block
// 执行本地工具
// 再把 tool_result 作为下一轮 user content 送回去
```

Anthropic 这条线有一个很值得你研究的点：

- 它已经在 SDK example 里演示了 `mcp_servers`

也就是 Claude 不只是“自己定义 tools”，还可以直接消费远程 MCP server：

```ts
mcp_servers: [
  {
    type: 'url',
    url: 'http://example-server.modelcontextprotocol.io/sse',
    name: 'example',
    authorization_token: 'YOUR_TOKEN',
  },
]
```

对你的启发是：

- 你的 Claw Gateway 既可以自己维护 MCP client
- 也可以在特定 provider 上直接透传给 provider-native MCP
- 但从可控性、审计和跨模型一致性来说，优先建议你自己托管 MCP client

### 3. `google-js-genai`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\google-js-genai`

Gemini 这条线的亮点很多：

- 普通 function calling
- `mcpToTool`
- 内建 `google_search`
- 内建 `code_execution`
- 示例里还有 `computer_use`、`url_context`

最有参考价值的本地 sample：

- `sdk-samples/generate_content_with_function_calling.ts`
- `sdk-samples/mcp_client.ts`
- `sdk-samples/interactions_tool_call_with_mcp_server.ts`
- `sdk-samples/interactions_tool_call_with_code_execution.ts`
- `sdk-samples/interactions_tool_call_with_google_search.ts`

最值得你注意的是 `mcpToTool`：

```ts
tools: [mcpToTool(printingClient, beepingClient)]
```

这说明 Gemini 生态已经把“把 MCP server 映射成模型工具”做成了现成功能。对你自己的 Gateway 来说，最稳的路线依然是：

- 内部统一注册所有工具
- 对外再按 provider 转成 OpenAI / Claude / Gemini 各自的 tool schema

不要反过来让内部架构跟着某一家 provider 的 tool 形状跑。

## 第三层：代码能力怎么驱动

代码能力建议拆成 6 个子系统，不要用一个大而全的“code tool”糊起来。

### 1. 文件系统工具

这层建议你自己实现，不直接外包给第三方 SDK。

和 OpenClaw 对齐后的建议是：

- 对模型暴露：`read`、`write`、`edit`、`apply_patch`
- 对 Gateway 内部 driver：可以继续拆成 `read_text`、`read_json`、`list_dir`、`glob`、`stat`、`write_file` 这些更细操作

也就是说：

- `read / write / edit / apply_patch` 是公共 tool surface
- 更细的文件函数是内部实现细节

必须做的约束：

- `allowReadPaths`
- `allowWritePaths`
- workspace root 校验
- 二进制/大文件大小限制
- 写操作审批

### 2. 搜索与 grep：`ripgrep`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\ripgrep`

这是你本地代码搜索的首选底座，不要自己写递归 grep。

推荐暴露的工具：

- `code.search_text`
- `code.search_files`
- `code.search_symbol_hint`

典型驱动命令：

```bash
rg "pattern" <path>
rg --files <path>
rg -n "TODO|FIXME" <path>
rg -t ts "ToolDescriptor" src
```

为什么重要：

- 默认尊重 `.gitignore`
- Windows 支持好
- 性能稳定

### 3. 语法树：`tree-sitter`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\tree-sitter`

它不是编辑器替代品，而是给你的 Gateway 提供：

- 语法级 chunking
- 函数/类/导入提取
- 符号级 diff
- prompt 上下文压缩
- 简单 refactor 辅助

适合暴露的内部能力：

- `code.parse_ast`
- `code.list_symbols`
- `code.extract_function`
- `code.chunk_semantic`

建议定位：

- `Tree-sitter` 用来补 LSP 的空白
- 不要拿它取代 LSP 的 rename / references / diagnostics

### 4. 语言服务：`LSP`

本地协议仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\language-server-protocol`

第一版怎么接最稳：

1. 先做一个 `LspRuntimeManager`
2. 按语言启动对应的 language server 进程
3. 通过 JSON-RPC 管理 `initialize / didOpen / didChange / completion / hover / definition / references / rename / codeAction`
4. 结果只暴露成内部工具，不把 LSP 原始包直接给 Agent

建议第一批对外工具：

- `lsp.hover`
- `lsp.definition`
- `lsp.references`
- `lsp.document_symbols`
- `lsp.workspace_symbols`
- `lsp.rename_preview`
- `lsp.diagnostics`

为什么只先做这些：

- 这些工具最稳
- 最容易做可解释 UI
- 不会一上来就把编辑流程绑死在某个语言 server 的怪异行为上

### 5. 调试协议：`DAP`

本地协议仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\debug-adapter-protocol`

DAP 适合第二阶段接入，不建议第一版就做满。

第一版如果要接，建议只做只读调试：

- `debug.launch`
- `debug.set_breakpoints`
- `debug.continue`
- `debug.stacktrace`
- `debug.scopes`
- `debug.variables`

不要第一天就给 Agent：

- 任意 attach 任意进程
- 任意写变量
- 任意执行 debug console 命令

### 6. Git 与代码宿主

本地代码工作区内：

- Git CLI 负责本地仓库操作
- `octokit` 或 `github-mcp-server` 负责远程 GitHub

最小本地 git 工具：

- `git.status`
- `git.diff`
- `git.show`
- `git.log`
- `git.add`
- `git.commit`
- `git.branch`

高风险动作：

- `git.push`
- `git.reset`
- `git.checkout --`
- `git rebase`

这些都应该审批。

## 第四层：外部系统怎么驱动

### 1. Google API：Gmail / Drive / Calendar

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\google-api-nodejs-client`

适合场景：

- Gmail 读信、发信、watch
- Drive 文件搜索与下载
- Calendar 读写日程

驱动方式：

- 用户 OAuth2 为主
- 后端保管 refresh token
- Gateway 用 token broker 代发请求

这个 SDK 的现实判断：

- 适合 Workspace API 接入
- 但它自己处于 maintenance mode
- 对 GCP 基础设施能力，优先用更专门的 `@google-cloud/*`

这里也建议和 OpenClaw 风格保持克制：

- 这些更适合作为 connector / plugin / MCP tool 的内部能力
- 第一版不要急着把 `gmail.* / drive.* / calendar.*` 固化成核心公共工具名
- 如果后面真的要对模型公开，优先走 flat snake_case 命名，而不是点式命名

### 2. Microsoft Graph：Outlook / Calendar / OneDrive

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\msgraph-sdk-javascript`

驱动方式：

- Azure AD / Microsoft identity
- Gateway 保存租户配置和 refresh token
- `client.api(path)` 做 REST 风格调用

建议把这类能力先归到 connector 层，而不是第一版 core tool surface。

### 3. Slack

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\slack-node-sdk`

Slack 不要只理解成“发一条消息”，它有几条不同接入面：

- `@slack/web-api`
- `@slack/oauth`
- `@slack/webhook`
- `@slack/socket-mode`

怎么选：

- 只发通知：`webhook`
- 读写频道、线程、用户：`web-api`
- 需要实时事件：`socket-mode` 或 Events API
- 需要用户安装授权：`oauth`

建议先把 Slack 做成：

- channel adapter
- connector runtime
- 或 plugin tool

而不是在第一版核心工具面里再发明一套新的 `slack.*` 命名。

### 4. Telegram

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\grammy`

这条线适合拿来做“外部人格入口”：

- Telegram bot 是一个很轻量的外部聊天壳
- 你可以把消息事件转换成 Gateway `chat.send`

建议角色：

- `Channel Adapter`
- 而不是工具库本身

### 5. Notion

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\notion-sdk-js`

Notion SDK 的优点是简单直接，适合：

- 检索知识库
- 读 page / block / database
- 新建页面、写笔记

这个 SDK 自带一些很实用的工程能力：

- 错误码分类
- debug logging
- 自动 retry

Notion 也类似：

- 先做 connector / plugin tool
- 核心工具面优先对齐 OpenClaw 的通用工具名

### 6. GitHub REST / GraphQL：`octokit`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\octokit`

GitHub 这条线建议双轨：

- 本地代码上下文和仓库动作：优先 `github-mcp-server`
- 精细 REST / GraphQL 业务动作：补 `octokit`

适合用 `octokit` 的地方：

- 某些 GitHub MCP 不好覆盖的细节 API
- Webhook 验签
- GitHub App auth
- GraphQL 查询

## 第五层：Schema、事件和 Webhook 基座

### 1. `zod` / `typebox` / `ajv`

本地仓库：

- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\zod`
- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\typebox`
- `F:\AILIS\AILISClaw\.refs\tool-ecosystem\ajv`

推荐组合：

- 开发时写 schema：`zod` 或 `typebox`
- 运行时高性能校验：`ajv`

落地建议：

- `ToolDescriptor.inputSchema` 统一导出为 JSON Schema
- `Gateway` 在 `tools.invoke`、`webhook.receive`、`connector.callback`、`approval.submit` 统一用 `ajv` 校验
- 如果你重视 TypeScript 类型一体化，`typebox + ajv` 很适合做内部协议
- 如果你重视开发体验和 provider helper 兼容，`zod` 很舒服

### 2. `openapi-specification`

这个仓库的价值是帮你约束：

- Gateway HTTP API
- Connector OAuth callback API
- 外部 Webhook API

建议：

- `Gateway REST API` 用 OpenAPI 描述
- 但内部 tool 协议还是 JSON Schema 即可

### 3. `cloudevents-spec`

适合你做统一事件总线时使用。

推荐内部事件格式参考：

```json
{
  "id": "evt_123",
  "type": "tool.call.completed",
  "source": "gateway/tool-runtime",
  "time": "2026-05-22T12:34:56Z",
  "subject": "session_abc",
  "data": {}
}
```

这会让你的：

- WebSocket push
- webhook 出站
- 审计日志
- 回放系统

更容易统一。

### 4. `standard-webhooks`

这个仓库很适合做 webhook 安全基座。

你自己的 Claw 如果将来要对外发 webhook，建议直接遵循它的签名规范，不要自造签名头。

用法建议：

- 入站 webhook：按各家官方规范验签
- 出站 webhook：你自己的 Gateway 统一采用 `standard-webhooks`

## 性能、正确性、安全怎么做

### 性能

- `Tool catalog` 做 session 级缓存，避免每轮都重拉 MCP `tools/list`
- 长连接流式输出统一走 WebSocket/SSE，不要轮询
- 浏览器、LSP、MCP server 做 runtime 复用，不要每次请求冷启动
- 代码搜索优先 `rg`
- AST 解析优先增量化，能缓存就缓存

### 正确性

- 所有 tool args 先过 JSON Schema 校验
- 结果做标准化，避免 provider 间工具输出格式漂移
- 非幂等工具必须带 `idempotencyKey`
- 关键动作要有 dry-run / preview
- 写操作尽量走 `plan -> preview -> approve -> apply`

### 安全

- 文件系统按路径白名单
- shell 按命令 allowlist 或 safe bin 分类
- 出网按域名 allowlist
- OAuth token 不直接暴露给模型
- 高风险工具进入审批
- transcript 默认全量记录
- webhook 和 OAuth callback 都做 nonce / signature / origin 校验

## 第一版建议接入顺序

先做小闭环，不要一口吃满所有生态。

### Phase 1：最小可用 Claw

- `Gateway`
- `Session / Run / Transcript / Event Bus`
- 一个模型 provider adapter
- 本地文件工具
- `ripgrep`
- `git` 只读工具
- `playwright-mcp`
- `mcp-typescript-sdk` client
- `mcp-servers` 里的 `filesystem`、`git`、`time`

### Phase 2：真正好用

- OpenAI / Claude / Gemini 三家 tool adapter
- `github-mcp-server`
- `octokit`
- `Tree-sitter`
- `LSP Runtime`
- `Notion`
- `Slack`

### Phase 3：外部人格与办公流

- Gmail / Calendar / Drive
- Microsoft Graph
- Telegram / Discord / LINE channel adapter
- webhook 出站
- automation / heartbeat / scheduled run

## 接下来最值得立刻实现的模块

如果你现在就要开始写自己的 Claw，我建议直接开这 6 个目录：

```text
src/gateway/
src/session/
src/events/
src/tools/
src/connectors/
src/runtimes/
```

其中优先级最高的 4 个文件：

```text
src/tools/tool-registry.ts
src/tools/tool-policy.ts
src/runtimes/mcp-runtime.ts
src/gateway/chat-send.ts
```

这 4 个先跑通，你后面加任何工具都会快很多。

## 本轮结果

这轮不是只列文档，而是已经把一批关键参考仓库拉到了本地，并把它们整理成了可直接映射到 `Gateway` 的驱动手册。

配套文档：

- [claw-integration-basis-research.md](F:/AILIS/docs/claw-integration-basis-research.md)
- [openclaw-from-zero.md](F:/AILIS/docs/openclaw-from-zero.md)
