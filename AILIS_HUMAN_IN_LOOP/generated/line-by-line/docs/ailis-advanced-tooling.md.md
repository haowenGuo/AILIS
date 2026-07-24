# docs/ailis-advanced-tooling.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：135
- SHA-256：`8cd5c71e917fdd97f4835a5d2f17cd1bcb15ebc0260638f0664d0df7509579d5`
- 可运行副本：[打开源文件](../../../source/docs/ailis-advanced-tooling.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS 高级工具层驱动说明</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>这份文档描述当前 AILIS Gateway 下可由 Agent 调用的增强工具面。统一入口仍是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>```http</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 6 | <code>POST /tools/call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>  "tool": "computer &#124; code &#124; email &#124; file_manager",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  "args": { "action": "..." },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>  "context": { "workspace": "F:/AILIS", "approved": true }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>所有会修改电脑、代码仓库、邮箱或远程系统的动作都需要 `context.approved=true`。没有凭据、没有外部 CLI、没有 native PTY 时，工具会返回 `needs_config` 或 `not_available`，不会假装成功。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>## computer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>覆盖电脑操作基座：文件系统、二进制流、文件监听、ACL、回滚、命令行、后台进程、可选 PTY。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>常用动作：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 23 | <code>{ "tool": "computer", "args": { "action": "read_binary", "path": "asset.bin", "offset": 0, "length": 262144 } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>{ "tool": "computer", "args": { "action": "write_binary", "path": "asset.bin", "dataBase64": "..." }, "context": { "approved": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>{ "tool": "computer", "args": { "action": "watch_start", "path": ".", "maxEvents": 500 } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>{ "tool": "computer", "args": { "action": "watch_poll", "id": "&lt;watchId&gt;" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>{ "tool": "computer", "args": { "action": "acl_get", "path": "note.txt" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>{ "tool": "computer", "args": { "action": "rollback_list" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>{ "tool": "computer", "args": { "action": "rollback_restore", "id": "&lt;rollbackId&gt;" }, "context": { "approved": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>{ "tool": "computer", "args": { "action": "pty_status" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>{ "tool": "computer", "args": { "action": "pty_start", "command": "node -v" }, "context": { "approved": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>注意：`node-pty` 是 native 模块。当前 pnpm 提示它的 build script 被忽略时，`pty_start` 会返回 `not_available`，但 `session_start/process_read/process_write` 仍可用。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>## code</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>覆盖代码操作基座：Git、代码搜索、语义索引、AST 重命名、TypeScript/LSP 风格诊断、GitHub PR/CI 钩子。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>常用动作：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 43 | <code>{ "tool": "code", "args": { "action": "git_status" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>{ "tool": "code", "args": { "action": "git_diff", "staged": false } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>{ "tool": "code", "args": { "action": "search", "query": "AILIS" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>{ "tool": "code", "args": { "action": "semantic_index", "path": ".", "includeSymbols": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>{ "tool": "code", "args": { "action": "symbols", "path": "src/app.js" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>{ "tool": "code", "args": { "action": "rename_symbol", "path": "src/app.js", "from": "oldName", "to": "newName" }, "context": { "approved": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>{ "tool": "code", "args": { "action": "lsp_diagnostics", "path": "src/app.ts" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>{ "tool": "code", "args": { "action": "ci_status" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>{ "tool": "code", "args": { "action": "pr_create", "title": "change", "body": "summary" }, "context": { "approved": true } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>`ci_status/pr_create` 依赖 GitHub CLI `gh`。如果没有安装或没有登录，会返回 `needs_config`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>## email</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>保留 IMAP/SMTP 基座，同时补 OAuth 和官方 API 深度入口。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>常用动作：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 63 | <code>{ "tool": "email", "args": { "action": "oauth_authorize_url", "provider": "gmail", "clientId": "...", "redirectUri": "http://127.0.0.1/callback" } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>{ "tool": "email", "args": { "action": "oauth_exchange_code", "provider": "outlook", "clientId": "...", "redirectUri": "...", "code": "..." } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>{ "tool": "email", "args": { "action": "oauth_refresh", "provider": "gmail", "clientId": "...", "refreshToken": "..." } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>{ "tool": "email", "args": { "action": "gmail_list_labels", "accessToken": "..." } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>{ "tool": "email", "args": { "action": "gmail_list_threads", "accessToken": "...", "q": "is:unread", "limit": 10 } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>{ "tool": "email", "args": { "action": "outlook_graph_messages", "accessToken": "...", "limit": 10 } }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>Gmail 官方 API 能处理 labels/threads；Outlook Graph 能处理 messages/folders。QQ 邮箱主要仍走 IMAP/SMTP 授权码。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>## Agent Loop / Agentic Executor</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>默认仍可使用规则 Planner，保证没有模型配置时系统可用。任务执行入口现在支持 Agentic Executor Loop：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 78 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>  "message": "搜索代码里 AILIS Gateway 的定义并总结",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>  "agentLoop": "llm",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>  "context": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>    "llm": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>      "provider": "openai-compatible",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>      "baseUrl": ".../v1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>      "model": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>      "apiKey": "..."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>Agentic Executor 工作流是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>1. 用户给复杂目标。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>2. Agent 每轮只决定一个下一步动作：`tool`、`final` 或 `blocked`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>3. 如果下一步是安全只读工具，Gateway 直接执行并把 observation 回灌给 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>4. 如果下一步会修改电脑或调用高风险工具，Gateway 返回 `status: "needs_approval"` 和 `approvalId`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>5. 用户回复“确认执行”，或 API 调用传入 `confirmApprovalId` 且 `context.approved=true`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>6. Agent 执行已确认工具动作，然后继续进入“观察 -&gt; 决策 -&gt; 工具调用”的循环。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>7. Agent 主动复核后输出 `final_answer`，或在无法继续时输出明确 blocked reason。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>确认示例：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 105 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>  "message": "确认执行",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>  "sessionId": "main"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>API 直接确认示例：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 114 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  "confirmApprovalId": "上一步返回的 approvalId",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  "context": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>    "workspace": "F:/AILIS",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>    "approved": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>缺少模型配置时自动回落到规则 Planner；不会因为 Planner 不可用而破坏普通对话或明确 slash command。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>## 验收命令</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 128 | <code>pnpm test:ailis-computer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>pnpm test:ailis-computer-advanced</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>pnpm test:ailis-code</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>pnpm test:ailis-email</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>pnpm test:ailis-llm-planner</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>pnpm ailis:smoke-code</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>pnpm ailis:validate-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
