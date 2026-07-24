# docs/ailis-runtime-codex-openclaw-verification.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：85
- SHA-256：`2a6fc755d2e4a5a54ef78c8939938447154a709d3aba9ead4e89a6900670f83c`
- 可运行副本：[打开源文件](../../../source/docs/ailis-runtime-codex-openclaw-verification.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Runtime 对照验收报告</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-05-24  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>AILIS 范围：`electron/ailis-runtime.cjs`、`electron/ailis-gateway.cjs`、`electron/ailis-agent-runner.cjs`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>OpenClaw 参考：`build-cache/openclaw-runtime`，包版本 `openclaw@2026.4.11`  </code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>Codex 参考：`build-cache/codex-runtime`，Git `7d47056`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>这份报告不是泛泛比较架构，而是把 AILIS runtime 当前实现逐项对到 Codex/OpenClaw 的代码证据。结论先说：AILIS v1 已经打通了个人项目需要的 Agentic Executor Loop 基座，包括工具曝光、审批、JSONL transcript、计划工具、结果保护、修复、MCP/subagent 桥面。但它不是 OpenClaw/Codex 的完整复刻，差距主要在真实 MCP 会话管理、真实子进程子智能体、OS/container sandbox、协议级 item event 兼容和事件背压。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>## 可重复验收</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>新增脚本：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 15 | <code>pnpm ailis:verify-runtime-alignment</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>它会静态扫描三类代码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>- AILIS：本项目 `electron/`、`tests/`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- OpenClaw：`build-cache/openclaw-runtime/dist` 与 `docs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- Codex：`build-cache/codex-runtime/codex-rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>并校验 12 个关键能力面：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>1. formal item transcript 与事件流</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>2. `update_plan` 真工具化</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>3. 工具曝光与 catalog</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>4. approval / policy 分类</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>5. sandbox / permission profile</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>6. transcript repair</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>7. tool result guard</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>8. MCP bridge</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>9. subagent relay</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>10. approval resume</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>11. local core computer tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>12. event backpressure / lossless tier</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>`ailis:validate-gateway` 已经把这个脚本放到第一步，后续验证 Gateway 会先跑对齐检查。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>## 逐项代码对照</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>&#124; 能力面 &#124; Codex 代码证据 &#124; OpenClaw 代码证据 &#124; AILIS 当前实现 &#124; 验收结论 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 44 | <code>&#124;---&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 45 | <code>&#124; Formal item transcript / event lifecycle &#124; `codex-rs/app-server-protocol/src/protocol/common.rs` 有 `turn/started`、`turn/completed`、`item/started`、`item/completed`、`item/plan/delta`；`v2/item.rs` 定义 `ItemStartedNotification`、`ItemCompletedNotification`、`PlanDeltaNotification` &#124; `dist/agent-events-*.js` 有 `emitAgentItemEvent`、`emitAgentPlanEvent`、`emitAgentApprovalEvent`，stream 分别是 `item`、`plan`、`approval` &#124; `ailis-runtime.cjs` 写入 `thread.started`、`turn.started`、`tool.call`、`tool.result`、`plan.updated`、`turn.completed` JSONL；Gateway 提供 `/transcript` 与 SSE &#124; 概念对齐，但协议名不是 Codex 原生协议 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 46 | <code>&#124; `update_plan` 真工具化 &#124; Codex 协议有 `PlanDeltaNotification`，用于计划流式增量 &#124; OpenClaw `tool-policy-*.js` 和 `openclaw-tools-*.js` 暴露 `update_plan`；`agent-events` 有 plan stream &#124; Runtime 里 `update_plan` 是真实工具，Agent Runner 从 LLM 输出 `plan_update` 后调用 runtime tool &#124; 对齐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 47 | <code>&#124; 工具曝光 / catalog &#124; Codex 通过协议和 tool handler 暴露命令、MCP、agent 工具 &#124; OpenClaw catalog 包含 `read/write/edit/apply_patch/exec/process/sessions_spawn/subagents/update_plan/...` &#124; Gateway `/tools` 返回 `runtimeTools`、`coreTools`，并保留 fast list `materializedProbe` &#124; 对齐但规模简化 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 48 | <code>&#124; Approval / policy 分类 &#124; `shell.rs` 对 sandbox override 做 approval guard；`handlers/mod.rs` 校验 `with_additional_permissions` 必须匹配 approval policy &#124; `acp-cli-*.js` 的 `classifyAcpToolApproval` 分类 `readonly_scoped`、`readonly_search`、`exec_capable`、`control_plane`、`mutating` &#124; Runtime 有 `classifyToolCall`、`evaluateToolCall`，把 read、mutating、exec、control plane、MCP、subagent 分级 &#124; 对齐但策略模型更小 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 49 | <code>&#124; Sandbox / permission profile &#124; `codex_thread.rs` 从 `PermissionProfile` 推导 `SandboxPolicy`；exec handler 使用 `file_system_sandbox_policy` &#124; OpenClaw ACP 文档和 spawn 逻辑会限制 sandboxed requester 与 ACP/subagent 的关系 &#124; AILIS 有 `permissionProfile`、workspace-write、approval-required，但没有 container/OS sandbox &#124; 部分对齐，核心缺口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 50 | <code>&#124; Transcript repair &#124; Codex 侧重点是 lossless event 与 resume；不是同一份 JS repair 函数 &#124; `extra-params-*.js` 有 synthetic missing tool result，docs 写明 tool result pairing repair &#124; `repairTranscript` 会为缺失 `tool.result` 插入 `repaired_missing_result`，测试覆盖 &#124; OpenClaw 对齐，Codex 邻近 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 51 | <code>&#124; Tool result guard &#124; Codex 对 completed item 和 transcript delivery 做强保证 &#124; OpenClaw 导出 `stripToolResultDetails`、`sanitizeToolUseResultPairing` &#124; `guardToolResult` 会 redact、截断、补 guard metadata；Gateway 对成功/失败结果统一 guard &#124; 对齐但简化 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>&#124; MCP bridge &#124; `v2/mcp.rs` 定义 `McpServerToolCallParams` 与 `McpServerToolCallResponse` &#124; OpenClaw ACP 文档说明 per-session `mcpServers` 限制，并提供 plugin-tools MCP bridge &#124; AILIS 有 `mcp_bridge` runtime tool、MCP call begin/end transcript event &#124; 只有桥面，没有真实 MCP transport/session manager &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 53 | <code>&#124; Subagent relay &#124; `multi_agents_common.rs` 把 approval policy、cwd、permission profile 复制到 child config &#124; OpenClaw docs：`sessions_spawn`、`subagents`、push-based completion、depth/tool policy &#124; AILIS 有 `subagents` runtime tool、spawn/send/list/close 状态和 transcript event &#124; 只有 relay/stub，没有真实 child agent 进程 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 54 | <code>&#124; Approval resume &#124; Codex thread resume 测试覆盖 pending approval replay &#124; OpenClaw 有 approval stream 和 ACP approval classifier &#124; Agent Runner 有 `storePendingAgentApproval`、`executePendingAgentApproval`，Runtime 写 `approval.requested` &#124; v1 可用 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 55 | <code>&#124; Local core computer tools &#124; Codex `shell.rs` 处理 shell、approval、apply_patch intercept &#124; OpenClaw catalog 暴露 read/write/edit/apply_patch/exec/process &#124; Gateway 本地 fast path 支持 `read/write/exec`，computer tool 覆盖文件、进程、PTY、ACL、watch、rollback、binary 等入口 &#124; AILIS 自定义实现，工具形态对齐 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 56 | <code>&#124; Event backpressure / lossless tier &#124; `app-server-client/src/lib.rs` 把 `ItemCompleted`、`TurnCompleted`、`PlanDelta` 等定义为 lossless tier &#124; OpenClaw agent events 有 seq 和 listener 广播 &#124; AILIS 有 SSE 和 JSONL 持久化，但没有 Codex 那种 lossless/best-effort 背压分层 &#124; 明确缺口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>## 当前可保证到什么程度</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>可以保证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>- Agent Loop 能把 LLM 决策落到工具调用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- 工具调用会经过 Gateway / Runtime 的 policy check。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- `update_plan` 不再是文本，而是真 runtime tool。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- 每次任务执行都会留下可读 JSONL transcript。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- transcript 中缺失 tool result 时能做 repair。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- 工具结果会经过 guard，降低过长输出和敏感字段直接泄露风险。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- `subagents`、`mcp_bridge` 已经作为控制面工具出现在模型可调用面里。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>不能保证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>- 不能说已经达到 Codex 的完整 sandbox 安全级别。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- 不能说已经达到 OpenClaw 的完整 MCP/plugin/subagent 生态级别。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- 不能说事件系统已经有 Codex 的 lossless backpressure 级别。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- 不能说 transcript schema 与 Codex app-server protocol 兼容，只能说概念对齐。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## 下一步建议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>如果目标是个人桌面助手，当前 v1 已经足够继续做 AILIS 前端到任务执行的真实体验。接下来优先级应该是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>1. 把真实 MCP client/session manager 接进 `mcp_bridge`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>2. 把 `subagents` 从内存 stub 升级为真实 child Agent Runner。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>3. 给高风险工具做更细的审批 UI。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>4. 再考虑 container sandbox 或 Windows Job Object / restricted token 级隔离。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>5. 最后再做 Codex 协议级 item event 兼容和 lossless event queue。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
