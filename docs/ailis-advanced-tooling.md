# AILIS 高级工具层驱动说明

这份文档描述当前 AILIS Gateway 下可由 Agent 调用的增强工具面。统一入口仍是：

```http
POST /tools/call
{
  "tool": "computer | code | email | file_manager",
  "args": { "action": "..." },
  "context": { "workspace": "F:/AILIS", "approved": true }
}
```

所有会修改电脑、代码仓库、邮箱或远程系统的动作都需要 `context.approved=true`。没有凭据、没有外部 CLI、没有 native PTY 时，工具会返回 `needs_config` 或 `not_available`，不会假装成功。

## computer

覆盖电脑操作基座：文件系统、二进制流、文件监听、ACL、回滚、命令行、后台进程、可选 PTY。

常用动作：

```json
{ "tool": "computer", "args": { "action": "read_binary", "path": "asset.bin", "offset": 0, "length": 262144 } }
{ "tool": "computer", "args": { "action": "write_binary", "path": "asset.bin", "dataBase64": "..." }, "context": { "approved": true } }
{ "tool": "computer", "args": { "action": "watch_start", "path": ".", "maxEvents": 500 } }
{ "tool": "computer", "args": { "action": "watch_poll", "id": "<watchId>" } }
{ "tool": "computer", "args": { "action": "acl_get", "path": "note.txt" } }
{ "tool": "computer", "args": { "action": "rollback_list" } }
{ "tool": "computer", "args": { "action": "rollback_restore", "id": "<rollbackId>" }, "context": { "approved": true } }
{ "tool": "computer", "args": { "action": "pty_status" } }
{ "tool": "computer", "args": { "action": "pty_start", "command": "node -v" }, "context": { "approved": true } }
```

注意：`node-pty` 是 native 模块。当前 pnpm 提示它的 build script 被忽略时，`pty_start` 会返回 `not_available`，但 `session_start/process_read/process_write` 仍可用。

## code

覆盖代码操作基座：Git、代码搜索、语义索引、AST 重命名、TypeScript/LSP 风格诊断、GitHub PR/CI 钩子。

常用动作：

```json
{ "tool": "code", "args": { "action": "git_status" } }
{ "tool": "code", "args": { "action": "git_diff", "staged": false } }
{ "tool": "code", "args": { "action": "search", "query": "AILIS" } }
{ "tool": "code", "args": { "action": "semantic_index", "path": ".", "includeSymbols": true } }
{ "tool": "code", "args": { "action": "symbols", "path": "src/app.js" } }
{ "tool": "code", "args": { "action": "rename_symbol", "path": "src/app.js", "from": "oldName", "to": "newName" }, "context": { "approved": true } }
{ "tool": "code", "args": { "action": "lsp_diagnostics", "path": "src/app.ts" } }
{ "tool": "code", "args": { "action": "ci_status" } }
{ "tool": "code", "args": { "action": "pr_create", "title": "change", "body": "summary" }, "context": { "approved": true } }
```

`ci_status/pr_create` 依赖 GitHub CLI `gh`。如果没有安装或没有登录，会返回 `needs_config`。

## email

保留 IMAP/SMTP 基座，同时补 OAuth 和官方 API 深度入口。

常用动作：

```json
{ "tool": "email", "args": { "action": "oauth_authorize_url", "provider": "gmail", "clientId": "...", "redirectUri": "http://127.0.0.1/callback" } }
{ "tool": "email", "args": { "action": "oauth_exchange_code", "provider": "outlook", "clientId": "...", "redirectUri": "...", "code": "..." } }
{ "tool": "email", "args": { "action": "oauth_refresh", "provider": "gmail", "clientId": "...", "refreshToken": "..." } }
{ "tool": "email", "args": { "action": "gmail_list_labels", "accessToken": "..." } }
{ "tool": "email", "args": { "action": "gmail_list_threads", "accessToken": "...", "q": "is:unread", "limit": 10 } }
{ "tool": "email", "args": { "action": "outlook_graph_messages", "accessToken": "...", "limit": 10 } }
```

Gmail 官方 API 能处理 labels/threads；Outlook Graph 能处理 messages/folders。QQ 邮箱主要仍走 IMAP/SMTP 授权码。

## Agent Loop / Agentic Executor

默认仍可使用规则 Planner，保证没有模型配置时系统可用。任务执行入口现在支持 Agentic Executor Loop：

```json
{
  "message": "搜索代码里 AILIS Gateway 的定义并总结",
  "agentLoop": "llm",
  "context": {
    "llm": {
      "provider": "openai-compatible",
      "baseUrl": ".../v1",
      "model": "...",
      "apiKey": "..."
    }
  }
}
```

Agentic Executor 工作流是：

1. 用户给复杂目标。
2. Agent 每轮只决定一个下一步动作：`tool`、`final` 或 `blocked`。
3. 如果下一步是安全只读工具，Gateway 直接执行并把 observation 回灌给 Agent。
4. 如果下一步会修改电脑或调用高风险工具，Gateway 返回 `status: "needs_approval"` 和 `approvalId`。
5. 用户回复“确认执行”，或 API 调用传入 `confirmApprovalId` 且 `context.approved=true`。
6. Agent 执行已确认工具动作，然后继续进入“观察 -> 决策 -> 工具调用”的循环。
7. Agent 主动复核后输出 `final_answer`，或在无法继续时输出明确 blocked reason。

确认示例：

```json
{
  "message": "确认执行",
  "sessionId": "main"
}
```

API 直接确认示例：

```json
{
  "confirmApprovalId": "上一步返回的 approvalId",
  "context": {
    "workspace": "F:/AILIS",
    "approved": true
  }
}
```

缺少模型配置时自动回落到规则 Planner；不会因为 Planner 不可用而破坏普通对话或明确 slash command。

## 验收命令

```powershell
pnpm test:ailis-computer
pnpm test:ailis-computer-advanced
pnpm test:ailis-code
pnpm test:ailis-email
pnpm test:ailis-llm-planner
pnpm ailis:smoke-code
pnpm ailis:validate-gateway
```
