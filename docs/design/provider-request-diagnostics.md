# 模型请求阶段诊断

2026-09-21：修复 Provider 上层丢弃 `details`、Agent Loop 不记录错误原因的问题。
这次只增加可观测性，不修订模型请求正文、模型选择、原有重试/兼容策略、时限或取消策略。
历史日志已经丢失的底层错误不能追溯恢复；这些字段对加载新代码后的请求生效。

## 去哪里看

现有每次运行的 `.audit/transcripts/<session>/<run>.jsonl`：

- `agent.llm_request`：单次 HTTP 请求的阶段事件。
- `agent.llm_call`：本轮模型决策的最终统计；失败时额外保留 `payload.details`。
- Gateway 同步发出 `agent.llm_request` 与 `agent.llm_call.completed`，用于调试台。

`runId/sessionId/iteration/callId` 将阶段事件关联到 Agent 轮次。
`diagnostic.requestId` 是本地生成的单次 HTTP 请求编号，不发送给模型，也不改 HTTP 正文/请求头。
有些轮次会先 GET 会话再 POST 推理，因此一个 callId 可以关联多个 requestId。
`serverRequestId` 仅在响应头实际提供 `x-request-id` 时记录，否则为空，不伪造跨端关联。

## 事件与字段

| event | phase | 含义 |
|---|---|---|
| request_started | awaiting_headers | 即将调用 fetch；尚未获得响应头 |
| response_headers | response_headers | fetch 已返回 Response，记录 HTTP 状态 |
| body_read_started | response_body | 开始读取响应正文 |
| first_body_chunk | response_body | SSE 第一个流片段，最多一次；不记录片段内容 |
| request_completed | completed | HTTP 正文读取/解析完成；不等于模型语义或任务成功 |
| failed | 失败时所在阶段 | 网络、HTTP 非成功响应、解析或取消等错误 |

共同字段：`requestId`、`endpointKind`、`method`、`timeoutMs`、`elapsedMs`、
`httpStatus`（响应头可用后）、`serverRequestId`、`receivedBytes`。
`receivedBytes` 目前只累计 SSE 流片段字节；非流式 JSON 路径不计量，0 不代表没有返回正文。

`endpointKind` 将云端会话获取标为 `cloud_session`，模型调用标为 `chat_completions` 等。
不记录完整 URL、查询参数、用户信息、请求/响应正文、请求头、登录 Token 或原始堆栈。

错误包含 `name`、分类 `code`、`causeCode`、脱敏的 `causeMessage`、
最多四层 `causes`（包含原始底层 code），以及 `abortSource`：
`external` 表示外部取消信号，`deadline` 表示本地超时计时器，空字符串表示未观察到本地取消。
原有错误分类策略不变；例如 fetch 将取消包装为 TypeError 时，分类仍可能是网络错误，但 abortSource 会指出已触发本地计时器。

## 阅读示例（离线测试构造，并非历史失败根因）

```json
{
  "type": "agent.llm_request",
  "payload": {
    "iteration": 8,
    "callId": "run:agent_decision:8",
    "diagnostic": {
      "requestId": "local-http-request-id",
      "endpointKind": "chat_completions",
      "event": "failed",
      "phase": "awaiting_headers",
      "code": "transient_network_error",
      "causeCode": "ECONNRESET",
      "causeMessage": "socket hang up",
      "abortSource": ""
    }
  }
}
```

这个例子表示尚未取得响应头时观察到连接重置。它仍不能单独证明是哪个网络设备或哪一端重置。
如果 phase 为 `response_body` 且 httpStatus 为 200，则已取得响应头、后续读正文失败。
如果 endpointKind 为 `cloud_session`，则失败发生在获取登录会话，不应误称上游模型推理失败。

`fetch` 没有暴露独立 DNS、TCP、TLS 成功事件，因此这里不伪造这些阶段，也不把“没有响应头”解释成“服务器绝对没收到请求”。

## 安全与隔离

- 仅走审计事件，不追加进模型 input、system/developer 或 Session 历史。
- AsyncLocalStorage 隔离并发请求的诊断回调。
- 仅白名单字段入日志；已知请求凭据、URL、Bearer、常见密钥形式脱敏；错误消息有长度上限。
- HTTP 错误响应正文不复制进新诊断日志；JSON 解析错误不记录解析器引用的正文片段。
- 诊断回调异常被隔离，不触发模型重试或改变正常响应。
- 现有最终错误文本行为未更改；本次脱敏保证针对新增的诊断字段，不宣称已审计所有旧日志。
- 不逐 token 记录事件。一次普通成功 JSON 请求四个事件，成功 SSE 通常五个，避免日志膨胀。

本次接入覆盖 `desktop-llm-provider.cjs` 的共用 fetch JSON/SSE 通道与主 Agent Loop。
本地 Codex bridge 自有的原生网络实现、服务器入口日志不在这次改动范围；没有部署或重启服务器。

## 验证

`tests/ailis-provider-diagnostics.test.mjs` 使用 mock HTTP/流，不访问真实模型。
覆盖连接重置、会话失败、会话缓存、HTTP 错误、正文断流、SSE、外部取消、超时、
脱敏、日志回调异常、并发隔离，以及真实 Agent Loop 日志落盘/上下文隔离。

```powershell
node --test tests/ailis-provider-diagnostics.test.mjs
node --test tests/desktop-llm-provider.test.mjs tests/ailis-agent-runner.test.mjs tests/ailis-unified-compaction.test.mjs tests/ailis-provider-diagnostics.test.mjs
```

测试不重跑 ALE，不修改旧任务、评分器、产物、source-lock 或历史成绩。
