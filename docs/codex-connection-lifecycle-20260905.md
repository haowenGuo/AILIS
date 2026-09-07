# 模型连接超时、取消与阶段审计修复

## 范围

修复主线 `electron/codex-model-bridge.cjs` 的 Responses 连接生命周期，以及 `electron/desktop-llm-provider.cjs` 中被过滤掉的连接预算/审计参数传递。
没有修改模型、instructions、input 拼接、工具、缓存参数、请求头或重试次数；没有修改题目、verifier、已有成绩或旧评测的冻结 source snapshot。
没有启动付费模型调用或评测，也没有部署/重启运行中的服务。

## 修复内容

- `codexConnectTimeoutMs` 真正生效，未设置时默认 30000 ms，且不超过单次模型请求总时限。它覆盖代理连接及 TLS 握手的累计时间，不是每个阶段重新获得一份时限。
- 连接建立阶段接入内部 AbortSignal。连接超时、总超时、用户取消都会清理 CONNECT request、raw socket、TLS socket；连接迟到也不能继续发送模型 POST。
- 直接连接的 TCP/TLS 阶段同样受连接时限保护。
- `codexStreamIdleTimeoutMs` 在 HTTP 请求阶段生效；未配置则保留原先的总时限默认值。持续收到数据仍不能绕过总时限。
- HTTP response 的 aborted/error/不完整 close 立即传播为网络错误，不再只等待总超时。
- 原有模型重试次数和退避保持不变。每次重试前，本次拥有的连接会被取消；没有修改共享转发器的重试策略。

例如原评测的 300 秒单次模型时限、30 秒连接时限、最多 3 次尝试：纯连接挂起应受约 `30 × 3 + 2 + 4 = 96` 秒约束，而不是把每次建连都拖到 300 秒。这不是对真实请求总耗时或上游恢复的保证。

## 日志

沿用既有、显式启用的 `AILIS_CODEX_PROTOCOL_AUDIT_PATH` / `codexProtocolAuditPath`，新增 `event: "transport"` 记录，不把这些记录当模型请求正文或 usage。

每次请求从连接之前开始记录 `attempt_started`；即使模型 POST 没有发出，也有对应的 `attempt_finished`。记录包含 requestId、逻辑 callId / attempt / maxAttempts（普通推理重试）、phase、elapsedMs、超时预算、错误码、requestSent 和接收字节数。代理连接还记录无凭据的 host/port 及可获得的 socket 地址，便于排查本地路径。

主要阶段：

```
attempt_started
→ proxy_connect_started → proxy_tcp_connected → proxy_connect_response
→ tls_handshake_started → tls_connected
→ request_created → request_sent → response_headers
→ response_first_byte → response_end → attempt_finished
```

直连/失败路径会跳过不适用或尚未到达的阶段。request_sent 指请求已交给底层发送，并不证明远端应用已经接收处理。旧 `event: request/response` 记录及显式 full 模式保持原契约；新增 transport 记录不保存请求/响应正文、认证头、代理用户名或密码。

错误不再只有笼统的总时限提示：连接挂起会指出 proxy CONNECT 或 TLS handshake；返回值也附带 transportPhase / transportRequestId。

## 验证

`tests/codex-connection-lifecycle.test.mjs` 使用模拟连接和仅监听 127.0.0.1 的临时代理，不访问外网或模型服务。

覆盖代理无响应、TLS 无响应、TLS 提前关闭、代理拒绝、预先取消、握手中取消、迟到连接、连续失败后的清理、HTTP 中途断流、空闲超时、响应期间取消，以及成功请求的正文/缓存相关头不变。

本机代理测试额外验证：收到 CONNECT 并开始 TLS 后，超时会使代理端实际观察到 TCP 连接关闭，而不只是 JavaScript Promise 返回 timeout。

回归命令：

```powershell
node --test tests/codex-connection-lifecycle.test.mjs tests/codex-model-bridge.test.mjs tests/desktop-llm-provider.test.mjs
```

连接层专项回归曾连续三次为 79/79；随后增加 provider 入口参数传递测试，最终专项 80/80 通过（含 14 项新测试）。

额外运行 `tests/ailis-llm-planner.test.mjs` 得到 25 通过、14 失败、4 跳过；保持其他工作区文件不变，仅在测试进程内将模型桥替换为修改前的 HEAD 版本，对照仍是同样 14 项失败。它们涉及旧 Persona/handoff、工具执行和新 Session 行为的断言，不属于本次连接修复范围；没有为了让回归变绿而修改这些模块或断言。

## 尚未证明的事

本修复解决本地超时与取消缺口，不证明上游首次关闭 TLS 连接的根因已经解决，也不证明那道题会通过。旧冻结评测仍含旧连接代码；如需验证新版本，必须另行明确记录源码版本和授权，不偷偷改旧快照或旧结果。
