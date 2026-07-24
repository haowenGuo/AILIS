# docs/openclaw-from-zero.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：988
- SHA-256：`bfcb9455bce79f94b3640ab1cd99410290413944c7766e41f106e8a08940b846`
- 可运行副本：[打开源文件](../../../source/docs/openclaw-from-zero.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`ProviderAdapter`、`ChannelAdapter`、`calling`、`defineMiniClawPlugin`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># 从 0 到 1 手搓一个小型 OpenClaw 参考</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>本文基于 `openclaw/openclaw` 上游源码做结构拆解，并给出一个适合当前 AILIS / AILIS 桌宠项目的“小型 OpenClaw”实现路线。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>参考源码已下载到：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- `F:\AILIS\AILISClaw\.refs\openclaw-main`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- 上游仓库：&lt;https://github.com/openclaw/openclaw&gt;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- 本次参考版本：`package.json` 显示 `2026.5.21`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## 一句话理解</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>OpenClaw 不是单纯聊天 SDK。它更像一个本地优先的 AI 助手控制面：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- Gateway 常驻在本机，暴露 HTTP + WebSocket。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- 桌面端、WebChat、CLI、移动端、渠道插件都连接 Gateway。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- Agent 层负责会话、模型选择、工具、技能、转录文件、fallback。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- 插件层负责 provider、channel、tools、nodes、HTTP route、hook。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- 上层 UI 只关心几类 RPC 和事件：`chat.send`、`chat.history`、`sessions.*`、`chat` delta/final 事件。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>对当前项目来说，第一阶段不用复刻完整 OpenClaw，只需要实现一个“MiniClaw Gateway + Agent Runner + Electron Bridge”。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>## 上游源码主链路</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>### 1. CLI 入口</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>核心文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>- `.refs/openclaw-main/src/entry.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- `.refs/openclaw-main/src/cli/run-main.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- `.refs/openclaw-main/openclaw.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>启动路径大致是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>openclaw.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  -&gt; src/entry.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  -&gt; src/cli/run-main.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  -&gt; commander command registry</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>  -&gt; gateway / agent / message / sessions / doctor / plugins ...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>上游做了很多启动优化：Node 版本检查、compile cache、help fast path、profile/container 参数、proxy/dotenv/config 预加载。小型版本不需要这些，保留一个明确入口即可。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>建议最小化：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>node mini-openclaw.mjs gateway --port 19011</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>node mini-openclaw.mjs agent --message "hello"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>### 2. Gateway 控制面</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>核心文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>- `.refs/openclaw-main/src/gateway/server.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- `.refs/openclaw-main/src/gateway/server.impl.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- `.refs/openclaw-main/src/gateway/server-runtime-state.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- `.refs/openclaw-main/src/gateway/server-http.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `.refs/openclaw-main/src/gateway/server/ws-connection.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `.refs/openclaw-main/src/gateway/server/ws-connection/message-handler.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- `.refs/openclaw-main/src/gateway/server-methods.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>上游 Gateway 分成几层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 67 | <code>server.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>  -&gt; lazy import server.impl.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>server.impl.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>  -&gt; 读配置</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>  -&gt; 准备 auth / plugin / channel / runtime state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>  -&gt; 创建 HTTP server + WebSocketServer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>  -&gt; 挂载 WS 连接处理、HTTP routes、channel runtime、cron、node runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>server-runtime-state.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>  -&gt; createGatewayHttpServer()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>  -&gt; attachGatewayUpgradeHandler()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>  -&gt; WebSocketServer(noServer: true)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>  -&gt; clients / broadcast / chatRunState / dedupe</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>server-methods.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  -&gt; coreGatewayHandlers</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>  -&gt; handleGatewayRequest()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>  -&gt; method registry + role/scope authorization</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>小型版本只需要这几个概念：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>- 一个 HTTP server，处理 `/health`、`/ready`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- 一个 WS server，处理 `connect` 握手。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- 一个 RPC method registry，按 `method` 分发。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- 一个事件广播器，向已连接 UI 推送 `chat`、`session.message`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- 一个内存中的 clients 集合。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>### 3. WebSocket 协议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>上游协议是 request/response/event 三类帧：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 101 | <code>{ "type": "req", "id": "1", "method": "connect", "params": {} }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>{ "type": "res", "id": "1", "ok": true, "result": {} }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>{ "type": "event", "event": "chat", "payload": {} }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>上游握手前会先发 `connect.challenge`，然后要求客户端发 `connect`。还会校验 protocol version、role、scopes、token/password/device identity、origin、pairing。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>小型版本建议第一阶段只做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>- 仅监听 `127.0.0.1`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>- `auth: none` 只允许 loopback。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- 若开放到非 loopback，必须启用 token。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- `connect` 参数保留 `client`、`role`、`scopes` 字段，暂不实现复杂设备配对。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>最小 connect 返回：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 118 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  "server": { "name": "MiniClaw", "version": "0.1.0" },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>  "methods": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>    "health",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>    "chat.send",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>    "chat.history",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>    "chat.abort",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>    "sessions.list",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>    "sessions.subscribe",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>    "sessions.messages.subscribe"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>  ],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>  "events": ["chat", "session.message", "sessions.changed"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>### 4. Agent 执行层</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>核心文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>- `.refs/openclaw-main/src/commands/agent-via-gateway.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- `.refs/openclaw-main/src/agents/agent-command.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- `.refs/openclaw-main/src/agents/command/attempt-execution.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `.refs/openclaw-main/src/agents/harness/selection.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- `.refs/openclaw-main/src/agents/model-selection.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>上游 Agent 路径：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 146 | <code>CLI agent command</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>  -&gt; 优先 callGateway(method="agent")</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>  -&gt; Gateway 不可用时 embedded fallback</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>agentCommand()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>  -&gt; resolve config</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>  -&gt; resolve session</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>  -&gt; resolve workspace / agent dir</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>  -&gt; resolve model/provider/thinking/verbose</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>  -&gt; load skills snapshot</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>  -&gt; resolve transcript file</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>  -&gt; runWithModelFallback()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>  -&gt; runAgentAttempt()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>  -&gt; CLI backend or embedded PI backend or plugin harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>  -&gt; persist transcript</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>  -&gt; deliver result</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>小型版本先保留这条简化链路：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 167 | <code>chat.send RPC</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>  -&gt; create runId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>  -&gt; append user message to session JSONL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>  -&gt; broadcast chat delta start</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>  -&gt; call provider adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>  -&gt; stream assistant text as chat delta</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>  -&gt; append assistant message to session JSONL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>  -&gt; broadcast chat final</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>暂时不做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>- ACP runtime</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- 多 agent routing</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>- complex fallback</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- skills snapshot hydration</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- sandbox</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>- cron</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 185 | <code>- channel delivery</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>### 5. 插件、渠道、Provider</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>核心文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>- `.refs/openclaw-main/src/plugins/registry.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 192 | <code>- `.refs/openclaw-main/src/plugins/runtime.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 193 | <code>- `.refs/openclaw-main/src/channels/plugins/types.plugin.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 194 | <code>- `.refs/openclaw-main/src/gateway/server-channels.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>- `.refs/openclaw-main/extensions/openai/index.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 196 | <code>- `.refs/openclaw-main/extensions/telegram/index.ts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>上游插件能力很宽：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>- provider：OpenAI、Anthropic、Gemini、Ollama 等。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>- channel：Telegram、Discord、Slack、WhatsApp 等。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>- tools：浏览器、Canvas、nodes、sessions、cron。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>- HTTP route：插件自带网页或 webhook。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 204 | <code>- hooks：agent 前后、conversation、gateway lifecycle。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>小型版本建议只抽两个接口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 209 | <code>export class ProviderAdapter {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>  async *streamChat({ messages, model, signal }) {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>export class ChannelAdapter {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>  async start({ onMessage }) {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>  async send({ target, text }) {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>  async stop() {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>第一版先内置一个 `openai-compatible` provider，不做动态插件加载。等 Gateway 和桌面桥跑稳，再把 provider/channel 改成插件注册。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>## Agent、Tool、MCP 与本机系统如何打通</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>OpenClaw 的关键设计不是“Agent 直接拥有电脑权限”，而是把所有能力都压到一条受控链路里：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 227 | <code>用户/渠道/UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>  -&gt; Gateway RPC 或 WebSocket event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>  -&gt; Agent command / run attempt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>  -&gt; Tool policy 计算可见工具</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  -&gt; Tool / MCP / Plugin / Channel / Node 执行</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>  -&gt; before-tool-call hook / 审批 / 沙箱 / schema 校验</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>  -&gt; 结果写入 transcript 并广播给 UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>核心分层如下：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>1. Agent Runtime 是调度层。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>   上游在 `src/agents/agent-command.ts` 里解析会话、workspace、模型、技能、转录文件，然后在 `runAgentAttempt()` 里选择 CLI backend、embedded PI backend 或 plugin harness。CLI backend 走 Claude/Codex/Gemini 这类外部 Agent；embedded backend 则直接把工具对象交给 PI runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>2. Tool Registry 是能力清单层。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>   内置工具来自 `createOpenClawCodingTools()`，包括 `read/write/edit/apply_patch/exec/process`、`message`、`sessions_*`、`web_fetch/web_search`、`image/pdf/tts/nodes` 等。插件工具通过 `api.registerTool()` 注册，但必须先在插件 manifest 的 `contracts.tools` 中声明，否则注册会被拒绝。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>3. Tool Policy 是权限裁剪层。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 245 | <code>   工具不是注册了就能用。OpenClaw 会按全局配置、agent 配置、provider/model、channel group、sender、sandbox、subagent 继承权限逐层过滤。子 Agent 默认禁用 `gateway`、`agents_list`、`session_status`、`cron`、`sessions_send` 等系统级工具；叶子子 Agent 还会禁用继续 spawn/管理其他 session 的工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>4. MCP 是适配层，不是权限源头。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 248 | <code>   对外部 CLI Agent，OpenClaw 会把 MCP 配置注入到 Claude/Codex/Gemini 的运行参数里。对 embedded Agent，OpenClaw 自己启动 MCP client，把每个 MCP server 的 `tools/list` 物化成普通 Agent Tool，再继续走同一套 Tool Policy 和 before-tool-call hook。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>5. 电脑和外部系统都被抽象成工具或 channel。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>   文件/代码通常走 `read/write/edit/apply_patch/exec` 和 file-transfer 工具；浏览器走 browser plugin；远端机器走 node capability；邮件这类事件型系统走 hook/channel，例如 Gmail watcher 会启动 `gog gmail watch serve`，把 Gmail PubSub 事件转进 Gateway hook，再变成一次可审计的 Agent 输入。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>对应到从 0 手搓的 MiniClaw，最小接口应该是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 256 | <code>type Tool = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 257 | <code>  name: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>  description: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>  inputSchema: object;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>  execute(ctx: ToolContext, args: unknown): Promise&lt;ToolResult&gt;;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>type ToolContext = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>  sessionKey: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>  agentId: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>  workspaceDir: string;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>  sender?: { channel?: string; id?: string; isOwner?: boolean };</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>  abortSignal?: AbortSignal;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>然后所有工具调用都必须经过：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 275 | <code>schema validate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>  -&gt; policy allow/deny</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 277 | <code>  -&gt; approval/sandbox guard</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>  -&gt; execute</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>  -&gt; result normalize</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>  -&gt; transcript + event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>## 性能、正确性、安全性的做法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>### 性能</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>- Gateway 常驻，插件 registry、channel runtime、MCP session runtime、WebSocket clients 都复用，不为每次聊天重新冷启动。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- Gateway 大量使用 lazy import。HTTP route、plugin route、hooks、WS message handler 都是第一次使用时再加载。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- WebSocket event 是流式广播，慢消费者会被丢弃可丢事件或断开，避免一个卡住的 UI 拖垮全局。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- MCP runtime 有 session 级缓存、catalog 缓存、lease 和 idle TTL。一次会话中 MCP server 不需要反复启动和 `tools/list`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- `tools.allow` 会反向影响工具构造计划。只允许 `read` 时，不会把全部 shell、OpenClaw、plugin 工具都实例化出来。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>### 正确性</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>- 所有 Gateway method 都在 method descriptor 中声明 scope，未知 method 直接拒绝。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 296 | <code>- RPC 参数、MCP 参数、工具参数都有 schema 校验；工具 schema 在交给不同 provider 前还会做兼容性归一化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- `chat.send`、`sessions.send` 等入口使用 `idempotencyKey` 和 runId，避免 UI 重试造成重复执行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>- transcript/session 是单独的持久层，运行结果写入后再发 `session.message`，UI 可以重连恢复状态。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 299 | <code>- MCP 工具名会被安全重命名为 provider-safe 名称，并按 server/tool 排序，保证同一轮工具列表稳定。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>### 安全性</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>- Gateway 默认偏本地，非 loopback 绑定会报警；HTTP/WS 有 token/password/device identity/origin/scopes/rate limit 多层校验。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 304 | <code>- scopes 默认拒绝。没有设备身份的客户端即使自称有 scopes，也会被清空或要求重新配对。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 305 | <code>- `tools.invoke` 只是一个入口，真正可用工具仍由 `resolveGatewayScopedTools()` 按 session、agent、channel、policy 重新计算。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>- shell/exec 有三道闸：`security` 模式、allowlist/safeBins、审批。node-host 执行还要求真实的 `exec.approval.*` 记录，防止用户把 `approved=true` 塞进参数绕过审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 307 | <code>- 文件能力默认应限制 workspace 或显式 allowReadPaths/allowWritePaths；file-transfer 插件的描述里明确“没有策略配置就拒绝”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 308 | <code>- Gmail 这类外部系统需要 pushToken/hookToken，watcher 进程可重启、可续租、可停止，不把邮箱权限直接暴露给模型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>MiniClaw 的安全底线可以更简单，但不要省掉这 5 个点：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>1. Gateway 默认只监听 `127.0.0.1`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>2. Renderer 永远不能直接持有 API key、邮箱 token、文件系统全权限。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>3. 工具必须有 schema、allow/deny、审计日志。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>4. 写文件、发邮件、跑命令都要显式审批或白名单。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>5. 所有 tool result 都写 transcript，便于回放、调试和追责。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>## 当前项目接入点</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>当前项目已经有 OpenClaw 桥接雏形，重点文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>- `F:\AILIS\electron\openclaw-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 323 | <code>- `F:\AILIS\electron\main.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- `F:\AILIS\electron\preload.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>- `F:\AILIS\src\openclaw-chat-service.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>- `F:\AILIS\src\control-panel-app.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>- `F:\AILIS\src\chat-service.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>已有链路：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 331 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 332 | <code>control-panel</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>  -&gt; backendMode = openclaw</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>  -&gt; openclawGatewayUrl = ws://127.0.0.1:19011</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>electron/main.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>  -&gt; OpenClawRuntimeSupervisor</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>  -&gt; OpenClawGatewayManager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>  -&gt; IPC: assistant-status/history/send-message/abort-run/list-sessions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>preload.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>  -&gt; window.ailisDesktop.assistant.*</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>renderer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>  -&gt; OpenClawDesktopChatService</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>  -&gt; assistant.getHistory()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>  -&gt; assistant.sendMessage()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>  -&gt; assistant.onEvent(chat/session.message/status)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>所以从 0 手搓时，最经济的做法不是重写前端，而是让你自己的 MiniClaw Gateway 兼容现有 Electron 桥期待的 RPC 和事件。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>## MiniClaw MVP 文件规划</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>建议先放在一个独立目录，避免污染桌宠已有代码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 358 | <code>F:\AILIS\src\mini-openclaw\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 359 | <code>  gateway\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 360 | <code>    server.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>    protocol.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 362 | <code>    clients.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 363 | <code>    methods.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>    auth.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>  agent\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>    runner.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>    provider-openai-compatible.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>    transcript-store.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>    session-store.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>    events.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>  config\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>    paths.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>    config.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 374 | <code>  cli\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>    mini-openclaw.mjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>  README.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>第二阶段再接进 Electron：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 382 | <code>F:\AILIS\electron\mini-openclaw-runtime.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>F:\AILIS\electron\main.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 384 | <code>F:\AILIS\src\openclaw-chat-service.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 385 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>## MVP RPC 清单</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>先实现这些就能让当前桌宠聊天跑起来：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>### `connect`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 396 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>  "client": { "id": "ailis-desktop", "mode": "backend", "version": "dev" },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>  "role": "operator",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 399 | <code>  "scopes": ["operator.read", "operator.write"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 400 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 406 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>  "server": { "name": "MiniClaw", "version": "0.1.0" },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 408 | <code>  "methods": ["health", "chat.send", "chat.history"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>  "events": ["chat", "session.message", "status"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>### `health`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 418 | <code>{ "ok": true, "status": "live" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 419 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>### `chat.history`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 426 | <code>{ "sessionKey": "main", "limit": 200 }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 427 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 432 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>  "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>  "messages": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 435 | <code>    { "role": "user", "content": "hello", "timestamp": 1760000000000 },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>    { "role": "assistant", "content": [{ "type": "text", "text": "hi" }], "timestamp": 1760000001000 }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>  ]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 438 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 439 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>### `chat.send`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 446 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>  "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 448 | <code>  "message": "帮我整理今天的计划",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 449 | <code>  "idempotencyKey": "uuid"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 451 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>立即返回：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 456 | <code>{ "runId": "run_xxx", "sessionKey": "main", "status": "accepted" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 457 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>随后推事件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 462 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 463 | <code>  "type": "event",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 464 | <code>  "event": "chat",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 465 | <code>  "payload": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 466 | <code>    "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 467 | <code>    "runId": "run_xxx",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 468 | <code>    "state": "delta",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 469 | <code>    "message": { "role": "assistant", "content": "..." }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 470 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 471 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 472 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>final：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 477 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 478 | <code>  "type": "event",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 479 | <code>  "event": "chat",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 480 | <code>  "payload": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>    "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 482 | <code>    "runId": "run_xxx",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 483 | <code>    "state": "final",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 484 | <code>    "message": { "role": "assistant", "content": "完整回答" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>### `sessions.messages.subscribe`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 494 | <code>{ "key": "main" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 495 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 497 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 500 | <code>{ "key": "main" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>之后每次落盘消息都推：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 506 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>  "type": "event",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>  "event": "session.message",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>  "payload": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 510 | <code>    "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>    "message": { "role": "assistant", "content": [{ "type": "text", "text": "..." }] }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 512 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>## 从 0 到 1 阶段计划</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>### P0：项目边界</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>目标：先不要做完整 OpenClaw，只做桌宠能用的 Gateway。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 521 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 522 | <code>产物：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>- `mini-openclaw` 独立目录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 525 | <code>- 一个可执行 CLI。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 526 | <code>- 一个本地状态目录，例如 `F:\AILIS\tmp\mini-openclaw-home`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>- `node src/mini-openclaw/cli/mini-openclaw.mjs gateway --port 19011`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 531 | <code>- 浏览器访问 `http://127.0.0.1:19011/health` 返回 `{ ok: true }`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>### P1：WS 协议和 RPC</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>目标：兼容 Electron 侧 GatewayClient 的基本 request/event 模式。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>实现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>- `protocol.js`：解析 JSON 帧，校验 `type/id/method/params`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 540 | <code>- `clients.js`：保存 client、subscriptions、send/broadcast。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>- `methods.js`：注册 `health`、`chat.history`、`chat.send`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 543 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>- 手写一个 Node WS client 能 connect。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 546 | <code>- 调 `chat.history` 返回空数组。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 547 | <code>- 调 `chat.send` 能收到 delta/final 事件。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>### P2：Session 和 Transcript</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>目标：所有对话可恢复。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 553 | <code>状态文件建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 556 | <code>mini-openclaw-home\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 557 | <code>  sessions\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 558 | <code>    sessions.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 559 | <code>    main.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 560 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>`sessions.json`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 565 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>  "main": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>    "sessionId": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>    "sessionKey": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>    "updatedAt": 1760000000000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>    "title": "Main"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 572 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 573 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>`main.jsonl` 每行一条：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 577 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 578 | <code>{"role":"user","content":"hello","timestamp":1760000000000}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>{"role":"assistant","content":[{"type":"text","text":"hi"}],"timestamp":1760000001000}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 580 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 581 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 582 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 583 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 584 | <code>- 重启 Gateway 后 `chat.history` 仍能读取历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 585 | <code>- 前端打开聊天面板能展示历史。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>### P3：Provider Adapter</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>目标：先接一个 OpenAI-compatible provider。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>配置：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 594 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 595 | <code>  "provider": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 596 | <code>    "baseUrl": "https://api.openai.com/v1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>    "apiKeyEnv": "OPENAI_API_KEY",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>    "model": "gpt-4.1-mini"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 599 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 601 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>接口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 606 | <code>async function* streamChat({ messages, model, signal }) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 607 | <code>  // yield { type: 'delta', text: '...' }</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 608 | <code>  // yield { type: 'final', text: '...' }</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 609 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 610 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 611 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 612 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 614 | <code>- `chat.send` 能真实调用模型。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 615 | <code>- UI 逐步显示流式文本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 616 | <code>- AbortSignal 能停止一次运行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>### P4：接入 Electron 桌宠</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>目标：让现有 `OpenClawDesktopChatService` 不用大改即可使用 MiniClaw。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 622 | <code>两种路线：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>1. 兼容上游 GatewayClient 协议，让 `electron/openclaw-runtime.cjs` 继续工作。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>2. 新增 `electron/mini-openclaw-runtime.cjs`，在里面直接用 `ws` 实现简化客户端。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 627 | <code>推荐路线 2，原因是可控、容易调试；等协议稳定后再考虑复用上游 SDK。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 629 | <code>验收：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>- 控制面板选择 OpenClaw 后端。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 632 | <code>- 自动启动本地 MiniClaw Gateway。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 633 | <code>- 聊天面板发送消息，桌宠能显示流式回复。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>### P5：工具系统</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>目标：让助手能调用有限本地能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>第一批工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>- `desktop.expression.set`：改表情。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 642 | <code>- `desktop.action.play`：触发动作。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 643 | <code>- `memory.note.add`：写入本地记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 644 | <code>- `file.read`：只读白名单目录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>工具调用先不做复杂 function calling。可以让模型输出控制标签：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 647 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 648 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 649 | <code>[action:wave]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 650 | <code>[expression:happy]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 651 | <code>你好，我在。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 652 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 653 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 654 | <code>这和当前 `src/chat-service.js` 的 `parseReplyMarkup()` 兼容。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>### P6：插件化</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>等 MVP 稳定后再抽插件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 660 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 661 | <code>export function defineMiniClawPlugin(plugin) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>  return plugin;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 663 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>plugin.register({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 666 | <code>  registerProvider(adapter) {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 667 | <code>  registerTool(tool) {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 668 | <code>  registerChannel(channel) {}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 669 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 670 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>第一版只需要本地加载：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 675 | <code>mini-openclaw/plugins/openai-compatible.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 676 | <code>mini-openclaw/plugins/desktop-tools.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 677 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>不用一开始就做 npm 插件、manifest 扫描、热更新。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>## 建议不要一开始复刻的部分</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>OpenClaw 上游很强，但第一版小型实现不要碰这些：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>- 全渠道消息系统。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 686 | <code>- 设备配对、节点权限、移动端 node。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 687 | <code>- ACP control-plane。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 688 | <code>- Docker/SSH/OpenShell sandbox。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 689 | <code>- Cron heartbeat 自动任务。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 690 | <code>- 插件市场、安装器、版本兼容。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 691 | <code>- provider 大模型目录和价格系统。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>- 多 agent fallback / auth profile / skills snapshot。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>这些都可以在 MiniClaw 的核心链路跑通后逐步长出来。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>## 安全底线</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>即使是小型版，也要保留这些规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>- 默认只绑定 `127.0.0.1`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 701 | <code>- 非 loopback 必须 token。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 702 | <code>- 所有文件读写工具必须有白名单根目录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 703 | <code>- Shell 工具默认关闭。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 704 | <code>- Renderer 不能直接拿 API key，只能经 Electron main 或 Gateway。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 705 | <code>- `chat.send` 需要 idempotencyKey，避免 UI 重试造成重复运行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 706 | <code>- 每个 run 都要能 abort。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>## 最小数据流</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>```mermaid</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 711 | <code>sequenceDiagram</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 712 | <code>  participant UI as Chat UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 713 | <code>  participant Main as Electron Main</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>  participant GW as MiniClaw Gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 715 | <code>  participant Agent as Agent Runner</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 716 | <code>  participant LLM as Provider</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>  UI-&gt;&gt;Main: assistant.sendMessage(content)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 719 | <code>  Main-&gt;&gt;GW: WS req chat.send</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 720 | <code>  GW--&gt;&gt;Main: accepted(runId)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 721 | <code>  GW-&gt;&gt;Agent: run(sessionKey, message)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 722 | <code>  Agent-&gt;&gt;GW: append user + session.message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>  Agent-&gt;&gt;LLM: streamChat(messages)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>  LLM--&gt;&gt;Agent: delta text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>  Agent--&gt;&gt;GW: chat delta</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>  GW--&gt;&gt;Main: event chat delta</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>  Main--&gt;&gt;UI: ailis:assistant-event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>  Agent-&gt;&gt;GW: append assistant + chat final</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>  GW--&gt;&gt;Main: event chat final</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>  Main--&gt;&gt;UI: final payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 731 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>## 第一轮落地清单</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>建议按这个顺序做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 737 | <code>1. 新建 `src/mini-openclaw/gateway/server.js`，跑通 `/health`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 738 | <code>2. 加 `ws` 服务和 `connect` 握手。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 739 | <code>3. 加 `chat.history`，读取 JSONL。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>4. 加 `chat.send`，先用假 provider 每 50ms 输出几个 delta。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 741 | <code>5. 接到 `electron/mini-openclaw-runtime.cjs`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 742 | <code>6. 控制面板选择 OpenClaw 后端，自动启动 MiniClaw。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 743 | <code>7. 替换假 provider 为 OpenAI-compatible provider。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 744 | <code>8. 增加 abort、错误事件、重连。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>9. 增加 transcript/session 单元测试。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 746 | <code>10. 再考虑 tools 和插件化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 748 | <code>## 和上游的映射表</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>&#124; MiniClaw 模块 &#124; 上游参考 &#124; 作用 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 751 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 752 | <code>&#124; `gateway/server.js` &#124; `src/gateway/server-runtime-state.ts`、`server-http.ts` &#124; HTTP + WS server &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 753 | <code>&#124; `gateway/methods.js` &#124; `src/gateway/server-methods.ts` &#124; RPC registry &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 754 | <code>&#124; `gateway/protocol.js` &#124; `src/gateway/protocol/*`、`ws-connection/message-handler.ts` &#124; frame shape、connect &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 755 | <code>&#124; `agent/runner.js` &#124; `src/agents/agent-command.ts` &#124; 会话、模型、运行 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 756 | <code>&#124; `agent/provider-openai-compatible.js` &#124; `extensions/openai/index.ts` &#124; provider adapter &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 757 | <code>&#124; `agent/transcript-store.js` &#124; `src/config/sessions/transcript*.ts` &#124; JSONL 历史 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 758 | <code>&#124; `agent/events.js` &#124; `src/infra/agent-events.ts`、`server-chat.ts` &#124; delta/final 广播 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 759 | <code>&#124; `electron/mini-openclaw-runtime.cjs` &#124; 当前 `electron/openclaw-runtime.cjs` &#124; 桌面桥 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>## 关键取舍</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>第一版不要追求“像 OpenClaw 一样完整”，而是追求“协议像、数据流像、能接桌宠”。只要 `connect`、`chat.history`、`chat.send`、`chat` 事件和 `session.message` 事件稳定，AILIS 就已经拥有了 OpenClaw 式的本地助手核心。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>## OpenClaw 借用的标准、SDK 和开源实现</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>一个判断先说在前面：OpenClaw 不是把 Agent、Tool、MCP、邮件、聊天、浏览器、代码智能这些东西从头全发明了一遍。它更像一个统一接线层，自己负责：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>- Gateway、Session、Transcript、事件广播。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 770 | <code>- Tool registry、策略过滤、审批、hook、沙箱边界。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 771 | <code>- 把不同生态的能力收束成一套统一运行时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 773 | <code>真正的“底层协议”和“现成实现”，大多来自行业标准、官方 API、官方 SDK 或成熟开源项目。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>### 1. MCP：跨 Agent 工具接入的主标准</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>- `@modelcontextprotocol/sdk` 直接出现在上游依赖里。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 780 | <code>- [mcp-transport.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/mcp-transport.ts#L1) 明确支持 `stdio`、`sse`、`streamable-http`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 781 | <code>- [mcp-http.handlers.ts](https://github.com/openclaw/openclaw/blob/main/src/gateway/mcp-http.handlers.ts#L1) 直接实现 `initialize`、`tools/list`、`tools/call`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>- 标准：Model Context Protocol。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 786 | <code>- 官方实现：`modelcontextprotocol/typescript-sdk`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 787 | <code>- 作用：把外部工具、资源、prompt server 统一暴露给 Agent。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>这部分几乎就是“直接借标准”，OpenClaw 自己主要补了会话隔离、policy、hook、loopback auth 和工具物化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 791 | <code>### 2. Tool 调用：没有完全统一的行业标准，OpenClaw 做的是适配层</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 793 | <code>这里要分两层看：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 795 | <code>- 模型侧：OpenAI Responses tools、Anthropic `tool_use`、Gemini function calling，各家格式相近，但并不完全统一。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 796 | <code>- OpenClaw 内部：把这些 provider-native tool API 统一映射成自己的 Tool registry。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 798 | <code>也就是说，OpenClaw 不是发明了“工具调用”这件事，而是把多家模型厂商各自的 tool API 接成一套。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>如果你从 0 到 1 手搓一个 MiniClaw，最稳的路线通常是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>1. 先只支持一家 provider 的 function calling。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 803 | <code>2. 再加 MCP，把外部工具标准化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 804 | <code>3. 最后再补一个内部 Tool registry，统一本地工具、MCP 工具、provider 工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 805 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 806 | <code>### 3. Tool 参数描述：JSON Schema / Zod / TypeBox / AJV 这套生态</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>- 上游依赖里有 `ajv`、`zod`、`typebox`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 811 | <code>- Gateway 和 plugin/tool 注册流程里有 schema 校验与归一化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 813 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>- 标准：JSON Schema。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 816 | <code>- 常见实现：AJV、Zod、TypeBox。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 817 | <code>- 作用：描述工具参数、做输入校验、做 provider 之间的 schema 归一化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 818 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 819 | <code>这也是 OpenClaw 正确性的重要来源之一：不是模型说传什么就传什么，而是先过 schema。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>### 4. RPC 与代码智能：JSON-RPC + LSP</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>- [pi-bundle-lsp-runtime.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-bundle-lsp-runtime.ts#L1) 里直接写了 “Minimal LSP JSON-RPC framing over stdio”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 826 | <code>- 同文件里实现了 `Content-Length` framing、`initialize`、`shutdown`、`$/cancelRequest` 这一类标准 LSP/JSON-RPC 行为。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 828 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>- 标准：JSON-RPC 2.0。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 831 | <code>- 标准：Language Server Protocol。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 832 | <code>- 作用：代码 hover、definition、references、completion、diagnostics 这一类“代码语义工具”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>这意味着 OpenClaw 并不是自己写一套“代码理解协议”，而是直接站在 LSP 生态上吃现成能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 836 | <code>### 5. 浏览器 / 电脑交互：Playwright + CDP</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 839 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 840 | <code>- 上游依赖和浏览器插件依赖里有 `playwright-core`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 841 | <code>- [extensions/browser/package.json](https://github.com/openclaw/openclaw/blob/main/extensions/browser/package.json#L1) 直接依赖 `playwright-core`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 842 | <code>- [browser-cdp.ts](https://github.com/openclaw/openclaw/blob/main/src/plugin-sdk/browser-cdp.ts#L1) 说明它也接了 CDP URL 这一层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 844 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 846 | <code>- 开源实现：Playwright。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 847 | <code>- 协议/接口：Chrome DevTools Protocol。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 848 | <code>- 作用：截图、点按、输入、页面控制、浏览器自动化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 850 | <code>所以“电脑交互”通常也不是 Agent 直接碰 OS，而是先走浏览器自动化框架或受控 runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 852 | <code>### 6. 邮件与外部事件：OAuth 2.0 + Gmail API + Pub/Sub + Webhook</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 853 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 854 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 855 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 856 | <code>- [gmail-watcher.ts](https://github.com/openclaw/openclaw/blob/main/src/hooks/gmail-watcher.ts#L1) 会启动 `gog gmail watch serve`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 857 | <code>- 代码注释已经写明：这是在 Gateway 启动时自动起 Gmail watcher。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 859 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>- 认证标准：OAuth 2.0。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 862 | <code>- 邮件 API：Gmail API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 863 | <code>- 事件分发：Google Cloud Pub/Sub。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 864 | <code>- 推送方式：Webhook / HTTP callback。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 865 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 866 | <code>这条链路不是 OpenClaw 自造邮箱协议，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>1. 用 OAuth 拿 Gmail 权限。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 869 | <code>2. 用 Gmail push notification 订阅邮箱变化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 870 | <code>3. 由 Pub/Sub 把事件送到你的后端。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 871 | <code>4. OpenClaw 的 hook runtime 再把事件转成 Agent 输入。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 872 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 873 | <code>### 7. 聊天与外部渠道：Bot API / Webhook / 官方平台 SDK</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 874 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 875 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 876 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 877 | <code>- `wizard` 文案和 channel runtime 里已经能看到 `telegram`、`line`、`google chat`、`synology chat`、`imessage-webhook` 这些渠道痕迹。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 878 | <code>- [server-channels.ts](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-channels.ts#L1) 是统一的 channel 生命周期管理器。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 879 | <code>- [webhook-request-guards.ts](https://github.com/openclaw/openclaw/blob/main/src/plugin-sdk/webhook-request-guards.ts#L1) 是统一 webhook 防护层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 883 | <code>- Telegram：Bot API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 884 | <code>- LINE：Messaging API + webhook。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 885 | <code>- Slack：incoming webhook / Web API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 886 | <code>- Google Chat：incoming webhook / Chat app API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>OpenClaw 自己做的不是“聊天协议本身”，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 890 | <code>- 统一 channel runtime。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 891 | <code>- 统一 webhook 入口。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 892 | <code>- 统一 session 映射。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 893 | <code>- 统一 agent dispatch。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 895 | <code>### 8. Webhook 安全：不是一个 RFC，但已有社区规范和成熟做法</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 897 | <code>源码证据：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>- 上游 lockfile 里有 `standardwebhooks`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 900 | <code>- [webhook-request-guards.ts](https://github.com/openclaw/openclaw/blob/main/src/plugin-sdk/webhook-request-guards.ts#L1) 实现了方法限制、Content-Type 限制、限流、并发 in-flight 限制、body size limit。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>对应生态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 903 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 904 | <code>- 社区规范：Standard Webhooks。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 905 | <code>- 常见做法：签名校验、重放保护、请求体大小限制、速率限制、异步处理、SSRF 防护。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>OpenClaw 在这层补的值非常大，因为“能收 webhook”不难，“能安全稳定地收 webhook”才难。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 909 | <code>### 9. 文件系统 / Shell / 本机能力：通常没有统一协议，重点在沙箱和权限边界</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>这一层反而最不像 MCP/LSP 那样有漂亮标准。通常做法是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 913 | <code>- 文件系统：直接走 Node/Python/Rust 的本地 I/O API。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 914 | <code>- Shell：走受控 `spawn/exec`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 915 | <code>- 目录权限：workspace allowlist / denylist。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 916 | <code>- 高危能力：审批流、safe bins、沙箱容器、只读挂载。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 917 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 918 | <code>OpenClaw 自己补的是这部分最难的工程化部分：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 920 | <code>- 工具是否可见。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 921 | <code>- 工具是否可调用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 922 | <code>- 调用前是否要审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 923 | <code>- 参数是否越权。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 924 | <code>- 执行是否在 sandbox。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 925 | <code>- 结果是否需要审计和落 transcript。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>所以这层没有一个“万能标准”，更多是工程纪律。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>### 10. 代码结构理解：Tree-sitter 这类增量解析生态也很重要</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>源码依赖里还有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>- `web-tree-sitter`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 934 | <code>- `tree-sitter-bash`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 936 | <code>这类库不是像 LSP 那样负责“编辑器到语言服务”的协议，而是负责：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 937 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 938 | <code>- 语法树。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 939 | <code>- 增量解析。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 940 | <code>- 更稳的代码块/命令解析。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 941 | <code>- prompt 构造前的结构化抽取。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>它们通常和 LSP 互补：LSP 给语义能力，Tree-sitter 给轻量快速的结构解析。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>## 一张归纳表</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>&#124; 能力层 &#124; OpenClaw 更像什么 &#124; 常见标准 / 开源实现 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 948 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 949 | <code>&#124; Agent 与外部工具 &#124; 统一适配层 &#124; MCP、provider-native tool APIs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 950 | <code>&#124; Tool 参数 &#124; schema 归一化层 &#124; JSON Schema、AJV、Zod、TypeBox &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 951 | <code>&#124; 代码语义 &#124; LSP runtime 宿主 &#124; LSP、JSON-RPC &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 952 | <code>&#124; 浏览器交互 &#124; 浏览器工具编排层 &#124; Playwright、CDP &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 953 | <code>&#124; 邮件事件 &#124; hook + watcher runtime &#124; OAuth 2.0、Gmail API、Pub/Sub、Webhook &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 954 | <code>&#124; 聊天渠道 &#124; channel runtime &#124; Telegram Bot API、LINE webhook、Slack webhook、Google Chat webhook &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 955 | <code>&#124; Webhook 接入 &#124; 安全入口层 &#124; Standard Webhooks、签名、限流、异步处理 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 956 | <code>&#124; 文件 / Shell / 本机 &#124; 权限与审批层 &#124; 本地 I/O API、spawn/exec、sandbox、approval &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 958 | <code>## 对你手搓 MiniClaw 的直接建议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 959 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 960 | <code>如果你的目标不是复刻整个 OpenClaw，而是先做一个“能跑起来、能扩展”的 AILIS，我建议依赖顺序这样选：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 961 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 962 | <code>1. 模型工具调用：先选一家 provider，先跑通 OpenAI Responses tools 或 Gemini function calling。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 963 | <code>2. 外部工具协议：优先接 MCP，不要先自造远程工具协议。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 964 | <code>3. 本地工具 schema：统一用 JSON Schema 或 Zod。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 965 | <code>4. 代码能力：优先 LSP，补 Tree-sitter。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 966 | <code>5. 浏览器：优先 Playwright，不要自己造浏览器控制协议。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 967 | <code>6. 邮件/聊天：优先 webhook + 官方 API，不要自己碰底层 IM/邮箱协议。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 968 | <code>7. 安全：从第一天就做 allowlist、审批、日志、transcript。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>一句话总结就是：OpenClaw 的强，不是“把所有零件都自己重新造了”，而是“知道哪些地方该借标准，哪些地方该自己做统一编排和安全边界”。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>## 参考资料（官方 / 规范）</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>- MCP 规范：[modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification/2025-06-18)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 975 | <code>- MCP TypeScript SDK：[github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 976 | <code>- JSON-RPC 2.0：[jsonrpc.org/specification](https://www.jsonrpc.org/specification)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 977 | <code>- OAuth 2.0：[RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 978 | <code>- JSON Schema：[json-schema.org](https://json-schema.org/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 979 | <code>- LSP 3.17：[Language Server Protocol](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 980 | <code>- Playwright：[playwright.dev/docs/intro](https://playwright.dev/docs/intro)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 981 | <code>- Chrome DevTools Protocol：[chromedevtools.github.io/devtools-protocol](https://chromedevtools.github.io/devtools-protocol/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 982 | <code>- Gmail Push Notifications：[developers.google.com/workspace/gmail/api/guides/push](https://developers.google.com/workspace/gmail/api/guides/push)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 983 | <code>- Telegram Bot API：[core.telegram.org/bots/api](https://core.telegram.org/bots/api)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 984 | <code>- LINE Messaging API Webhook：[developers.line.biz](https://developers.line.biz/en/docs/messaging-api/receiving-messages/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 985 | <code>- Slack Incoming Webhooks：[api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 986 | <code>- Google Chat Webhooks：[developers.google.com/workspace/chat/quickstart/webhooks](https://developers.google.com/workspace/chat/quickstart/webhooks)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 987 | <code>- Standard Webhooks：[standardwebhooks.com](https://www.standardwebhooks.com/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 988 | <code>- Tree-sitter：[tree-sitter.github.io](https://tree-sitter.github.io/tree-sitter/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
