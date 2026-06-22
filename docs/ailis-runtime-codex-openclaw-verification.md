# AILIS Runtime 对照验收报告

日期：2026-05-24  
AILIS 范围：`electron/ailis-runtime.cjs`、`electron/ailis-gateway.cjs`、`electron/ailis-agent-runner.cjs`
OpenClaw 参考：`build-cache/openclaw-runtime`，包版本 `openclaw@2026.4.11`  
Codex 参考：`build-cache/codex-runtime`，Git `7d47056`

这份报告不是泛泛比较架构，而是把 AILIS runtime 当前实现逐项对到 Codex/OpenClaw 的代码证据。结论先说：AILIS v1 已经打通了个人项目需要的 Agentic Executor Loop 基座，包括工具曝光、审批、JSONL transcript、计划工具、结果保护、修复、MCP/subagent 桥面。但它不是 OpenClaw/Codex 的完整复刻，差距主要在真实 MCP 会话管理、真实子进程子智能体、OS/container sandbox、协议级 item event 兼容和事件背压。

## 可重复验收

新增脚本：

```bash
pnpm ailis:verify-runtime-alignment
```

它会静态扫描三类代码：

- AILIS：本项目 `electron/`、`tests/`
- OpenClaw：`build-cache/openclaw-runtime/dist` 与 `docs`
- Codex：`build-cache/codex-runtime/codex-rs`

并校验 12 个关键能力面：

1. formal item transcript 与事件流
2. `update_plan` 真工具化
3. 工具曝光与 catalog
4. approval / policy 分类
5. sandbox / permission profile
6. transcript repair
7. tool result guard
8. MCP bridge
9. subagent relay
10. approval resume
11. local core computer tools
12. event backpressure / lossless tier

`ailis:validate-gateway` 已经把这个脚本放到第一步，后续验证 Gateway 会先跑对齐检查。

## 逐项代码对照

| 能力面 | Codex 代码证据 | OpenClaw 代码证据 | AILIS 当前实现 | 验收结论 |
|---|---|---|---|---|
| Formal item transcript / event lifecycle | `codex-rs/app-server-protocol/src/protocol/common.rs` 有 `turn/started`、`turn/completed`、`item/started`、`item/completed`、`item/plan/delta`；`v2/item.rs` 定义 `ItemStartedNotification`、`ItemCompletedNotification`、`PlanDeltaNotification` | `dist/agent-events-*.js` 有 `emitAgentItemEvent`、`emitAgentPlanEvent`、`emitAgentApprovalEvent`，stream 分别是 `item`、`plan`、`approval` | `ailis-runtime.cjs` 写入 `thread.started`、`turn.started`、`tool.call`、`tool.result`、`plan.updated`、`turn.completed` JSONL；Gateway 提供 `/transcript` 与 SSE | 概念对齐，但协议名不是 Codex 原生协议 |
| `update_plan` 真工具化 | Codex 协议有 `PlanDeltaNotification`，用于计划流式增量 | OpenClaw `tool-policy-*.js` 和 `openclaw-tools-*.js` 暴露 `update_plan`；`agent-events` 有 plan stream | Runtime 里 `update_plan` 是真实工具，Agent Runner 从 LLM 输出 `plan_update` 后调用 runtime tool | 对齐 |
| 工具曝光 / catalog | Codex 通过协议和 tool handler 暴露命令、MCP、agent 工具 | OpenClaw catalog 包含 `read/write/edit/apply_patch/exec/process/sessions_spawn/subagents/update_plan/...` | Gateway `/tools` 返回 `runtimeTools`、`coreTools`，并保留 fast list `materializedProbe` | 对齐但规模简化 |
| Approval / policy 分类 | `shell.rs` 对 sandbox override 做 approval guard；`handlers/mod.rs` 校验 `with_additional_permissions` 必须匹配 approval policy | `acp-cli-*.js` 的 `classifyAcpToolApproval` 分类 `readonly_scoped`、`readonly_search`、`exec_capable`、`control_plane`、`mutating` | Runtime 有 `classifyToolCall`、`evaluateToolCall`，把 read、mutating、exec、control plane、MCP、subagent 分级 | 对齐但策略模型更小 |
| Sandbox / permission profile | `codex_thread.rs` 从 `PermissionProfile` 推导 `SandboxPolicy`；exec handler 使用 `file_system_sandbox_policy` | OpenClaw ACP 文档和 spawn 逻辑会限制 sandboxed requester 与 ACP/subagent 的关系 | AILIS 有 `permissionProfile`、workspace-write、approval-required，但没有 container/OS sandbox | 部分对齐，核心缺口 |
| Transcript repair | Codex 侧重点是 lossless event 与 resume；不是同一份 JS repair 函数 | `extra-params-*.js` 有 synthetic missing tool result，docs 写明 tool result pairing repair | `repairTranscript` 会为缺失 `tool.result` 插入 `repaired_missing_result`，测试覆盖 | OpenClaw 对齐，Codex 邻近 |
| Tool result guard | Codex 对 completed item 和 transcript delivery 做强保证 | OpenClaw 导出 `stripToolResultDetails`、`sanitizeToolUseResultPairing` | `guardToolResult` 会 redact、截断、补 guard metadata；Gateway 对成功/失败结果统一 guard | 对齐但简化 |
| MCP bridge | `v2/mcp.rs` 定义 `McpServerToolCallParams` 与 `McpServerToolCallResponse` | OpenClaw ACP 文档说明 per-session `mcpServers` 限制，并提供 plugin-tools MCP bridge | AILIS 有 `mcp_bridge` runtime tool、MCP call begin/end transcript event | 只有桥面，没有真实 MCP transport/session manager |
| Subagent relay | `multi_agents_common.rs` 把 approval policy、cwd、permission profile 复制到 child config | OpenClaw docs：`sessions_spawn`、`subagents`、push-based completion、depth/tool policy | AILIS 有 `subagents` runtime tool、spawn/send/list/close 状态和 transcript event | 只有 relay/stub，没有真实 child agent 进程 |
| Approval resume | Codex thread resume 测试覆盖 pending approval replay | OpenClaw 有 approval stream 和 ACP approval classifier | Agent Runner 有 `storePendingAgentApproval`、`executePendingAgentApproval`，Runtime 写 `approval.requested` | v1 可用 |
| Local core computer tools | Codex `shell.rs` 处理 shell、approval、apply_patch intercept | OpenClaw catalog 暴露 read/write/edit/apply_patch/exec/process | Gateway 本地 fast path 支持 `read/write/exec`，computer tool 覆盖文件、进程、PTY、ACL、watch、rollback、binary 等入口 | AILIS 自定义实现，工具形态对齐 |
| Event backpressure / lossless tier | `app-server-client/src/lib.rs` 把 `ItemCompleted`、`TurnCompleted`、`PlanDelta` 等定义为 lossless tier | OpenClaw agent events 有 seq 和 listener 广播 | AILIS 有 SSE 和 JSONL 持久化，但没有 Codex 那种 lossless/best-effort 背压分层 | 明确缺口 |

## 当前可保证到什么程度

可以保证：

- Agent Loop 能把 LLM 决策落到工具调用。
- 工具调用会经过 Gateway / Runtime 的 policy check。
- `update_plan` 不再是文本，而是真 runtime tool。
- 每次任务执行都会留下可读 JSONL transcript。
- transcript 中缺失 tool result 时能做 repair。
- 工具结果会经过 guard，降低过长输出和敏感字段直接泄露风险。
- `subagents`、`mcp_bridge` 已经作为控制面工具出现在模型可调用面里。

不能保证：

- 不能说已经达到 Codex 的完整 sandbox 安全级别。
- 不能说已经达到 OpenClaw 的完整 MCP/plugin/subagent 生态级别。
- 不能说事件系统已经有 Codex 的 lossless backpressure 级别。
- 不能说 transcript schema 与 Codex app-server protocol 兼容，只能说概念对齐。

## 下一步建议

如果目标是个人桌面助手，当前 v1 已经足够继续做 AILIS 前端到任务执行的真实体验。接下来优先级应该是：

1. 把真实 MCP client/session manager 接进 `mcp_bridge`。
2. 把 `subagents` 从内存 stub 升级为真实 child Agent Runner。
3. 给高风险工具做更细的审批 UI。
4. 再考虑 container sandbox 或 Windows Job Object / restricted token 级隔离。
5. 最后再做 Codex 协议级 item event 兼容和 lossless event queue。
