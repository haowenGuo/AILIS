# AILIS Agent Runner v0

AILIS Agent Runner v0 是 AILIS 对话系统和 Gateway 工具面的统一中间层。所有用户输入都会先进入 Agent Loop 做识别：如果是情感/日常对话，转回 AILIS 原对话系统；如果是任务执行，才进入 AILIS 任务执行 Agent。

## Runtime Path

```text
AILIS Chat
  -> window.ailisDesktop.gateway.runAgent()
  -> AILIS Agent Loop classifyOnly
  -> conversation: AILIS Companion Chat Service
  -> task: AILISGateway.runAgent()
  -> AILISTaskAgent / Tool planning
  -> AILISGateway.callTool()
  -> OpenClaw-style tools
```

HTTP 入口：

```text
POST http://127.0.0.1:19777/agent/run
```

RPC 入口：

```json
{
  "method": "agent.run",
  "params": {
    "sessionId": "main",
    "message": "读取 package.json"
  }
}
```

## Supported v0 Commands

```text
你好
我今天有点累
读取 package.json
/read package.json
/write tmp/note.txt hello
抓取 https://example.com/
/tool read {"path":"package.json"}
/exec pnpm build
```

Runner 返回里会包含：

```json
{
  "mode": "conversation | task",
  "intent": "emotional_chat | casual_chat | read_file | write_file | ...",
  "executionRequired": true
}
```

`mode=conversation` 时不会调用工具，前端会把消息交回 AILIS Companion Chat Service，保留原本的人设、记忆、动作、表情和语音链路。`mode=task` 时才进入任务执行 Agent；只有 `plan.steps` 非空时才会进入 Gateway 工具执行。

`exec` 会走 Gateway 安全策略。没有 `context.approved=true` 时会返回 `needs_approval`，不会直接执行。

## Acceptance

```text
pnpm test:ailis-agent
pnpm ailis:smoke-agent
pnpm ailis:validate-gateway
pnpm build
```

当前验收覆盖：

- 对话消息进入 Agent Runner。
- Runner 能用 `classifyOnly` 区分 conversation/task。
- conversation 由 AILIS Companion Chat Service 处理。
- Runner 能处理 emotional_chat/read/write/exec。
- read/write 通过 Gateway 调用真实工具完成。
- exec 未确认时被拦截为 `needs_approval`。
- `/agent/run` 和 RPC `agent.run` 都可用。
- Agent run 写入 audit log。
