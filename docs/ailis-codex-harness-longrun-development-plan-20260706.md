# AILIS 对齐 Codex Harness 的长程任务执行能力开发文档

Date: 2026-07-06
Target repo: `F:\AILIS_self_evolution_runtime`
AILIS branch inspected: `codex/ailis-1.0.7-main`
AILIS HEAD inspected: `27ad8046f166711ec74716e0c363c4133cf622a2`
Local Codex source inspected: `F:\AIGril\AIGrilClaw\.refs\openai-codex`
Local Codex source HEAD inspected: `da4c8ca57d40b074bdc1b5b1218851100150c56b`
Installed Codex package inspected: `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex`, version `0.142.5`

## 0. 目的

这份文档不依赖对话记忆，而是从本机可读的 Codex 源码副本和 AILIS 当前源码出发，抽取两套系统的 Harness 架构，设计一条让 AILIS 更靠近 Codex-style 稳定长程任务执行能力的开发路线。

核心结论：

```text
稳定长程任务不是靠模型记忆变强，而是靠 Harness 把任务状态、工具规格、执行输出、证据、上下文预算、失败分类和恢复逻辑都变成可验证的运行时对象。
```

AILIS 已经有 Agent Runner、Tool Runtime、MCP Session、Context Manager、Evidence Artifact、GAIA Runner 和 Auto Optimizer。现在最重要的不是继续堆工具，而是把这些能力收敛成一个更硬的 Harness Core。

## 1. 本地源码证据范围

### 1.1 Codex 代码来源

本机可读 Codex 源码位置：

```text
F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src
```

本次重点读取的 Codex 文件：

```text
context/environment_context.rs
shell.rs
tools/handlers/shell_spec.rs
tools/handlers/unified_exec.rs
tools/handlers/unified_exec/exec_command.rs
tools/handlers/unified_exec/write_stdin.rs
unified_exec/head_tail_buffer.rs
tools/context.rs
tools/registry.rs
tools/handlers/tool_search_spec.rs
tools/handlers/tool_search.rs
mcp_tool_exposure.rs
tools/handlers/mcp.rs
session/mcp.rs
session/mcp_runtime.rs
context_manager/history.rs
context_manager/normalize.rs
thread_rollout_truncation.rs
tools/handlers/multi_agents_spec.rs
tools/handlers/multi_agents.rs
session/multi_agents.rs
tools/handlers/apply_patch_spec.rs
tools/handlers/request_permissions.rs
```

本机 npm 安装包 `@openai/codex@0.142.5` 只包含 JS wrapper 和平台二进制：

```text
C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\bin\codex.js
C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\node_modules\@openai\codex-win32-x64\vendor\x86_64-pc-windows-msvc\bin\codex.exe
```

因此深层 Harness 分析以 `.refs\openai-codex` 的 Rust 源码为准，npm 包只用于确认安装形态和版本。

### 1.2 AILIS 代码来源

本次重点读取的 AILIS 文件：

```text
electron/ailis-agent-runner.cjs
electron/ailis-agent-runtime-protocol.cjs
electron/ailis-tool-runtime.cjs
electron/ailis-tool-contracts.cjs
electron/ailis-tool-executor.cjs
electron/ailis-mcp-session.cjs
electron/ailis-context-manager.cjs
electron/ailis-turn-items.cjs
electron/ailis-evidence-artifacts.cjs
scripts/run-gaia-level1-lite.mjs
scripts/run-gaia-official.mjs
scripts/run-ailis-gaia-auto-optimizer.mjs
scripts/validate-ailis-harness.mjs
tests/ailis-agent-runner.test.mjs
tests/ailis-agent-execution-flow.test.mjs
tests/run-gaia-level1-lite.test.mjs
```

## 2. Harness 的核心定义

在这里，Harness 不是单个脚本，也不是提示词。Harness 是 Agent 外部的稳定运行系统，负责把模型的每一步变成可验证、可恢复、可审计的执行过程。

一个完整 Harness 至少包括：

```text
1. Runtime Environment
   当前 cwd、shell、OS、权限、网络策略、当前日期、可写根目录。

2. Context Compiler
   把任务状态、历史、证据、工具、预算编译成模型本轮可见输入。

3. Tool Registry / Tool Router
   管理模型可见工具、延迟工具、隐藏工具、MCP 工具和外部工具。

4. Schema Validator
   在工具边界硬校验 required、additionalProperties、空参数和参数类型。

5. Tool Executor
   执行 shell、文件、MCP、浏览器、artifact、subagent 等操作。

6. Output Store
   保存完整 stdout/stderr、网页正文、大文件、PDF、表格、截图等，模型只看摘要和可查询 id。

7. Evidence Store
   把工具输出转成可引用证据，保留 source、field、value、page、range、confidence、complete/truncated。

8. Loop Controller
   控制最大步数、重复调用、预算、审批、阻塞、恢复、终止。

9. Finalizer Gate
   判断是否可以给最终答案；长程评测里尤其要防止低置信度、无证据、格式错误提交。

10. Trace / Agent Lab
    给人类和调试器看完整链路，不等同于模型上下文。

11. LongRun Controller
    通过磁盘 state/progress/event-log/iterations 保证任务跨进程、跨会话、跨上下文恢复。
```

稳定的长程任务不是让模型无限思考，而是让运行时不断把不稳定的自然语言过程固化为状态机。

## 3. AILIS 当前架构抽取

### 3.1 桌面与 Agent Runner 入口

AILIS 当前入口是：

```text
AILIS Desktop / Chat / Voice / Avatar
  -> window.ailisDesktop.gateway.runAgent()
  -> AILISAgentRunner classifyOnly
  -> conversation: Companion Chat Service
  -> task: AILISGateway.runAgent()
  -> Agent Runner Loop
  -> Tool Runtime / MCP / Evidence / Final
```

关键文件：

```text
electron/ailis-agent-runner.cjs
```

现状判断：

- AILIS 已经区分 persona/conversation 和 task_agent。
- `FINAL_ANSWER_TOOL_NAME = 'final_answer'` 已存在。
- `buildLlmAgentDirectToolPrompt()` 已明确要求模型使用 OpenAI Responses object model，不要输出 custom JSON decision object。
- Runner 会构建 runtime environment、context manager、direct tool specs、tool summary、evidence sufficiency prompt。
- Runner 会在工具调用前执行 loop guard，尝试阻止重复 search/fetch/read。

问题：

- `ailis-agent-runner.cjs` 过大，混合了 prompt、persona、tool decision、tool execution、evidence、finalizer、approval、loop guard、debug pause 等职责。
- 这会导致 Harness 能力难以独立测试，也容易让 persona 层和 task 执行层互相污染。

### 3.2 Response Item 协议层

关键文件：

```text
electron/ailis-agent-runtime-protocol.cjs
```

AILIS 已支持模型可见 ResponseItem 类型：

```text
message
reasoning
function_call
tool_search_call
function_call_output
tool_search_output
```

还支持 runtime extension：

```text
local_shell_call
custom_tool_call
context_compaction
compaction
other
```

现状判断：

- 这已经非常接近 Codex-style object model。
- `validateSupportedResponseItem()` 会校验 `function_call.name`、`call_id`、`arguments` 必须是 JSON string。
- `tool_search_call` 和 `tool_search_output` 也有 call_id 规则。

问题：

- 协议层已经有了，但 Runner 中仍保留兼容性 JSON planner、capability_context、legacy tool path 等多条路径。
- 后续应让 task_agent 主路径只走 native ResponseItem + direct tools，把兼容路径降级为 legacy fallback。

### 3.3 Tool Runtime 与 Contract

关键文件：

```text
electron/ailis-tool-runtime.cjs
electron/ailis-tool-contracts.cjs
electron/ailis-tool-executor.cjs
```

AILIS 已经有：

- `AILISToolRuntimeRegistry`
- `AILISRuntimeTool`
- `dispatch(toolId, args, context)`
- `dispatchDirectMcpTool()`
- `validateToolContract()`
- `validateAgainstSchema()`
- `additionalProperties === false` 校验
- `tool_search` required `query/q`
- direct MCP id 解析和转发
- 工具输出标准化为 `content/details/structuredContent`

现状判断：

- AILIS 的 tool runtime 方向是对的。
- `tool_search` 已经注册为真实 runtime tool，不只是 prompt 文本。
- MCP direct tools 可以通过 `mcp__server__tool` 路由，不必普通任务走 `mcp_bridge.call_tool`。

问题：

- AILIS 仍有很多 broad action tools，例如 `computer`、`artifact_tools`、`mcp_bridge`，一个 tool 内部再用 `action` 多路复用。
- broad action tool 容易让模型在参数层面犯错，也让 schema 粒度比 Codex 低。
- external/MCP/direct 动态工具的 schema 生命周期还应进一步统一到同一个 ToolSpecRegistry。

### 3.4 MCP Session

关键文件：

```text
electron/ailis-mcp-session.cjs
```

AILIS 已经支持：

- MCP server 注册。
- `tools/list` schema 读取。
- inputSchema 属性提取。
- MCP HTTP JSON-RPC/SSE 响应解析。
- `validateAgainstSchema(args, inputSchema)`。
- `mcp_bridge` 管理动作。
- direct MCP call 参数归一化和调用。

现状判断：

- AILIS 已经把 MCP 从“纯概念”做成了运行时能力。
- 这和 Codex 通过 MCP runtime snapshot、connection manager、tool exposure 的方向一致。

问题：

- `mcp_bridge` 仍是模型可见的诱惑路径之一。
- 普通任务应该只看到 direct MCP tool specs；`mcp_bridge` 应限制在管理/调试/doctor 模式。

### 3.5 Context Manager

关键文件：

```text
electron/ailis-context-manager.cjs
electron/ailis-turn-items.cjs
```

AILIS 已经有：

- `DEFAULT_TOOL_OUTPUT_CHARS = 24000`
- recent outputs 保留。
- pinned complete outputs 保留。
- older exploratory output compact 成 `OLDER_TOOL_OBSERVATION_COMPACTED`。
- `ensureCallOutputsPresent()`。
- checkpoint/restore。
- reasoning-ready/complete/truncated 检测。
- turn items 将工具结果、失败、capability context 编译成 prompt ledger。

现状判断：

- AILIS 已经具备“不要把完整历史塞回模型”的意识。
- 这和 Codex `context_manager/history.rs` 的方向一致。

问题：

- AILIS 主要以字符预算处理工具输出；Codex 同时记录 token usage、估算 token、按 ResponseItem 类型处理。
- AILIS 还需要更强的“raw trace 与 model prompt 分离”，不要把 UI/Persona/Debug 文本混进 evidence context。
- 对长程任务，context manager 还应显式输出 `context_budget_report`、`pinned_evidence_manifest`、`dropped_items_manifest`。

### 3.6 Evidence Artifacts

关键文件：

```text
electron/ailis-evidence-artifacts.cjs
```

AILIS 已有 typed evidence：

```text
ResearchSourceEvidence
ResearchReadEvidence
GroundedSummaryEvidence
IssueContextEvidence
RepoStateEvidence
DiffEvidence
SecretScanEvidence
OperationResultEvidence
DocumentTargetEvidence
TestFailureEvidence
DocumentParseEvidence
DocumentProtectionEvidence
VerificationEvidence
MailboxQueryEvidence
MailSummaryEvidence
VisionSnapshotEvidence
VisionObservationEvidence
QuestionEvidence
```

Evidence payload 已包含：

```text
sourceKind
path/url/uri
artifactId
artifactKind/artifactType/action
sheet/range/coverage
complete/truncated/reasoningReady
pinnedEvidenceId
coveredByEvidence
contentChars
confidence
```

现状判断：

- AILIS 已经有比普通 Agent 更强的证据结构。
- 这对 GAIA、文档、网页、PDF、表格任务都很关键。

问题：

- Evidence artifact 仍偏“从观察结果推断”，不是所有工具都原生返回标准 evidence contract。
- Finalizer 仍可能把 advisory refs 当参考，而不是强约束。
- 应把 evidence contract 前移到工具返回规范，而不是后处理猜测。

### 3.7 GAIA Runner 与 Auto Optimizer

关键文件：

```text
scripts/run-gaia-level1-lite.mjs
scripts/run-gaia-official.mjs
scripts/run-ailis-gaia-auto-optimizer.mjs
```

AILIS 已有：

- GAIA 官方数据下载/本地 scoring server。
- exact answer prompt。
- answer gate。
- finalizer。
- evidence digest。
- retries。
- task transcript/result 保存。
- auto optimizer jobDir。
- `progress.json`、`state.json`、`event-log.jsonl`。
- `chain.json`、`verdict.json`、repair ticket。
- failureCategory 分类：environment、web_retrieval_mcp、tools_mcp、harness_finalization、agent_architecture、model_reasoning。
- spend safety gate、repairBacklog、stop.flag。

现状判断：

- 这已经是长程任务 Harness 的雏形。
- `run-ailis-gaia-auto-optimizer.mjs` 已经非常接近 local controller。

问题：

- GAIA lite runner 中存在越来越多 task/domain-specific heuristic，例如 ClinicalTrials、gift assignment、presentation、quote 等 deterministic extraction。它们短期提分，但长期应迁移为通用 artifact/evidence adapters 或 test fixtures，不要让 benchmark runner 变成任务特判集合。
- Auto optimizer 还应更明确区分：controller、worker、conversation projector。之前 API 花费过大，说明安全预算、采样策略、失败聚类和人工闸门还不够硬。

## 4. Codex Harness 架构抽取

### 4.1 Runtime Environment 是一等上下文

关键文件：

```text
context/environment_context.rs
shell.rs
```

Codex 将环境作为结构化上下文注入，而不是靠模型猜：

```text
cwd
shell
current date
timezone
network
filesystem roots
permission profile
```

Codex shell 处理也按 shell 类型分支：PowerShell、cmd、bash/zsh/sh 不共用一套字符串改写逻辑。

对 AILIS 的启发：

```text
RuntimeEnvironment 不能只是 prompt 文本，也不能写死 Windows。
它应该是每一轮的结构化输入，并被 exec/read/write/MCP runtime 共享。
```

### 4.2 ToolSpec 是真实工具边界，不是二级 JSON 决策

关键文件：

```text
tools/handlers/shell_spec.rs
tools/handlers/apply_patch_spec.rs
tools/handlers/request_permissions.rs
```

Codex 暴露的是真实工具：

```text
exec_command
write_stdin
request_permissions
apply_patch
tool_search
MCP namespace function
multi_agent tools
```

`exec_command` 有 output schema：

```text
wall_time_seconds
exit_code
session_id
original_token_count
output
required: wall_time_seconds, output
additionalProperties: false
```

`apply_patch` 是 freeform tool，并绑定 lark grammar，不让模型把 patch 包成 JSON。

对 AILIS 的启发：

```text
任务模式应尽量少用 meta-decision JSON。
模型应该直接调用真实工具，运行时在工具边界强校验。
```

### 4.3 Tool Registry 是运行时中心

关键文件：

```text
tools/registry.rs
```

Codex 的工具注册层负责：

```text
ToolExecutor
CoreToolRuntime
ToolExposure
supports_parallel_tool_calls
waits_for_runtime_cancellation
pre_tool_use_payload
post_tool_use_payload
telemetry_tags
```

这意味着工具不是一段 prompt，也不是一堆 if/else，而是有 id、spec、exposure、handler、telemetry、hooks 的运行时对象。

对 AILIS 的启发：

```text
AILISRuntimeTool 已经是正确方向。
下一步要把所有 core/MCP/external/artifact/subagent 工具都纳入一个统一 ToolSpecRegistry + ToolRuntimeRegistry。
```

### 4.4 tool_search 是延迟工具发现，不是网页搜索

关键文件：

```text
tools/handlers/tool_search_spec.rs
tools/handlers/tool_search.rs
```

Codex `tool_search` 的语义：

```text
Searches over deferred tool metadata with BM25 and exposes matching tools for the next model call.
For MCP tool discovery, always use tool_search instead of list_mcp_resources/list_mcp_resource_templates.
```

实现上：

```text
ToolSearchHandler
  search_infos: Vec<ToolSearchInfo>
  search_engine: SearchEngine<usize>
  returns ToolSearchOutput { tools }
  coalesce_loadable_tool_specs(...)
```

对 AILIS 的启发：

```text
tool_search 只做工具发现。
web_search 是网页检索。
两者名字和 schema 必须彻底隔离，避免模型把工具发现当网页搜索。
```

### 4.5 MCP 工具被映射成 namespace/function

关键文件：

```text
mcp_tool_exposure.rs
tools/handlers/mcp.rs
session/mcp.rs
session/mcp_runtime.rs
```

Codex MCP 关键形态：

```text
McpToolExposure {
  direct_tools,
  deferred_tools
}

McpHandler::spec()
  -> ToolSpec::Namespace(ResponsesApiNamespace)
  -> ResponsesApiNamespaceTool::Function(tool)
```

MCP runtime 有 snapshot/manager/runtime_context，MCP server 刷新、连接、权限、elicitation 也属于 session runtime。

对 AILIS 的启发：

```text
普通模型调用 MCP 时，应该看到 mcp__server__tool direct spec。
mcp_bridge 只做管理、health、resource、debug，不做普通任务主路径。
```

### 4.6 Unified Exec 是长程任务的基础设施

关键文件：

```text
tools/handlers/unified_exec/exec_command.rs
tools/handlers/unified_exec/write_stdin.rs
unified_exec/head_tail_buffer.rs
tools/context.rs
```

Codex exec 输出包含：

```text
wall_time
raw_output
truncation_policy
max_output_tokens
process_id/session_id
exit_code
original_token_count
output
```

`write_stdin` 可以继续与已有 session/process 交互。

`HeadTailBuffer` 保留输出 head/tail，而不是简单截断。

Sandbox denied 也会转换成 model-visible exec output，而不是吞掉错误。

对 AILIS 的启发：

```text
长程任务不能只靠一次 exec 返回字符串。
AILIS 需要统一 Exec Output Store：完整 stdout/stderr 写入 store，模型看到摘要、outputId、line/byte/token 统计和下一步读取工具。
```

### 4.7 Context Manager 管 ResponseItem，不是 raw transcript

关键文件：

```text
context_manager/history.rs
context_manager/normalize.rs
thread_rollout_truncation.rs
```

Codex ContextManager：

```text
items: Vec<ResponseItem>
token_info: Option<TokenUsageInfo>
record_items(..., TruncationPolicy)
for_prompt(...)
estimate_token_count(...)
update_token_info(...)
normalize_history(...)
truncate_function_output_payload(...)
```

Normalize 会保证：

```text
ensure_call_outputs_present
remove_orphan_outputs
strip unsupported images
```

Thread rollout truncation 按 user turn / fork turn 边界截断，不是按纯字符截断。

对 AILIS 的启发：

```text
模型 prompt history、raw event log、Agent Lab trace、Evidence Store 必须分开。
压缩不能丢掉完整证据，只能压缩模型可见摘要。
```

### 4.8 Multi-agent 是受控并行，不是忙等

关键文件：

```text
tools/handlers/multi_agents_spec.rs
tools/handlers/multi_agents.rs
session/multi_agents.rs
```

Codex 多智能体工具强调：

```text
只委派具体、边界清楚、可并行的 sidecar task。
不要把关键路径阻塞任务甩给子代理再等待。
不要重复 wait_agent。
子任务要 self-contained，不要和主任务重复。
```

对 AILIS 的启发：

```text
AILIS 的 subagents 适合并行调查、独立修复、回归测试，不适合替代 LongRun Controller。
长程稳定必须靠 controller/state/event-log，而不是靠多个模型相互聊天。
```

## 5. AILIS vs Codex 对照矩阵

| 维度 | Codex 当前代码形态 | AILIS 当前代码形态 | AILIS 目标 |
|---|---|---|---|
| 环境上下文 | `EnvironmentContext` 一等对象 | `buildRuntimeEnvironmentPromptObject` 已有 | 做成独立 `RuntimeEnvironment` 模块，所有工具共享 |
| 工具规格 | 真实 direct tools + ToolSpec | direct tools + broad action tools + legacy planner | task 主路径全 direct，legacy 降级 |
| 工具发现 | BM25 over deferred metadata，返回 loadable specs | `tool_search` runtime tool 已有 | tool_search 只返回可执行 specs，不夹业务检索语义 |
| MCP | namespace/function spec | direct MCP id + mcp_bridge 共存 | 普通任务隐藏 bridge，只暴露 direct MCP |
| Exec | unified exec + session + structured output | computer/code/exec 多路径 | 统一 `exec_command/write_stdin/output_*` |
| 输出保存 | raw output + truncation policy + metadata | context manager 主要压缩 prompt 输出 | 建 Output Store，完整输出外存 |
| 上下文 | ResponseItem history + token usage + normalize | AILIS ContextManager 已有，偏字符预算 | 增加 token accounting、manifest、drop report |
| 证据 | tool output 与 context 管理分离 | typed evidence artifacts 已有 | 工具原生返回 evidence contract，final 强引用 |
| Finalizer | 工具/输出/上下文闭环 | GAIA finalizer + answer gate | 通用 FinalizerGate，不只 GAIA |
| 长程任务 | 运行时/会话/工具/上下文稳定 | GAIA auto optimizer 已有 controller 雏形 | 泛化 LongRun Controller，任务无关 |
| 可观测性 | registry hooks、telemetry、tool output | Agent events/evidence artifacts | Agent Lab 用 trace graph 展示完整链路 |

## 6. 当前最关键差距

### 6.1 Runner 过大，Harness 边界不清

`electron/ailis-agent-runner.cjs` 同时承担：

```text
persona prompt
task prompt
tool exposure
context manager
evidence audit
loop guard
approval pause/resume
native tool parsing
legacy JSON planner
final answer normalization
```

这会让每次修一个 GAIA 问题都可能碰到其它产品行为。需要把 Harness Core 拆成独立模块。

### 6.2 Direct Tool 与 Legacy Planner 混用

AILIS prompt 已经说“不要输出 custom JSON decision object”，但代码里仍存在 legacy planner 和 capability_context 多路径。长程任务里，路径越多，失败分类越难。

目标：

```text
task_agent 主路径：ResponseItem + direct tools + ToolRuntimeRegistry。
legacy planner：只作为旧 UI/API fallback，不作为 GAIA/长程任务默认路径。
```

### 6.3 Output Store 不够统一

Codex `ExecCommandToolOutput` 保留 raw output、wall time、exit code、session id、original token count。AILIS 当前工具输出虽然有 context compaction，但还缺一个统一的 output store contract。

目标输出：

```json
{
  "status": "completed",
  "outputId": "out_...",
  "complete": true,
  "truncatedForModel": true,
  "originalBytes": 820000,
  "previewBytes": 24000,
  "stdoutLines": 13000,
  "stderrLines": 0,
  "wallTimeMs": 842,
  "exitCode": 0,
  "nextTools": ["output_read", "output_tail", "output_search"]
}
```

### 6.4 Evidence Gate 还不够硬

AILIS 已有 evidence artifact 和 final_answer refs，但 refs 仍偏 advisory。长程任务/GAIA 需要：

```text
final_answer 必须引用 available evidence refs。
引用不存在 refs -> audit warning 或 reject。
低置信度/缺证据 -> 不能自动提交。
complete=false/truncated=true 的证据不能单独支撑 exact answer。
```

### 6.5 GAIA Runner 有过多局部启发式

`run-gaia-level1-lite.mjs` 里有一些确定性 extractor，有助于短期提分，但如果继续堆在 benchmark runner，会让系统变成“GAIA 特判器”。

迁移原则：

```text
特定任务启发式 -> 通用 artifact adapter / MCP tool / evidence extractor / regression fixture。
benchmark runner 只负责运行、评分、final gate、记录链路。
```

### 6.6 LongRun Controller 需要泛化

`run-ailis-gaia-auto-optimizer.mjs` 已有：

```text
progress.json
state.json
event-log.jsonl
repairBacklog
failedTaskIds
chain.json
verdict.json
safety gate
stop.flag
```

但它主要绑定 GAIA。目标是抽象成通用 longrun harness：

```text
longrun/jobs/<job-id>/mission.md
longrun/jobs/<job-id>/acceptance.md
longrun/jobs/<job-id>/loop-policy.json
longrun/jobs/<job-id>/state.json
longrun/jobs/<job-id>/progress.json
longrun/jobs/<job-id>/event-log.jsonl
longrun/jobs/<job-id>/iterations/iter-XXX/...
```

## 7. 目标架构

### 7.1 分层目标

```text
AILIS Surface Layer
  voice / avatar / expression / persona / desktop UX

AILIS Agent Layer
  task intent / high-level planning / final response style

AILIS Harness Core
  RuntimeEnvironment
  ContextCompiler
  ToolSpecRegistry
  ToolRuntimeRegistry
  ToolSearchRuntime
  McpToolRegistry
  UnifiedExecRuntime
  OutputStore
  ArtifactEvidenceStore
  LoopController
  FinalizerGate
  LongRunController
  TraceStore / AgentLab

AILIS Adapter Layer
  MCP servers
  web/search/fetch
  PDF/DOCX/XLSX/PPTX/audio/image adapters
  shell/filesystem/browser/code adapters
```

### 7.2 目标执行流

```text
User Task
  -> Agent Runner classifies conversation vs task
  -> TaskHarnessRun created with runId
  -> RuntimeEnvironment snapshot
  -> ContextCompiler builds ResponseItem prompt
  -> ToolSpecRegistry exposes direct core tools + selected deferred tool_search
  -> Model emits native tool call or final_answer
  -> ToolRouter validates schema
  -> ToolExecutor runs exact handler
  -> OutputStore persists raw payload
  -> EvidenceStore creates typed evidence
  -> LoopController decides continue / final / ask / repair / block
  -> FinalizerGate validates evidence refs and answer contract
  -> PersonaRenderer formats user-facing AILIS response
  -> TraceStore keeps full chain for Agent Lab and replay
```

### 7.3 长程任务目标流

```text
LongRunController
  -> read mission/acceptance/policy/state/event-log
  -> select next iteration
  -> start AILIS/Codex worker or local verifier
  -> collect artifacts
  -> write chain/verdict
  -> classify failure category
  -> repair or queue repair ticket
  -> update progress/state
  -> heartbeat/conversation projector reports only state summary
```

关键点：

```text
对话窗口不是进程管理器。
长程任务的事实源是磁盘 event-log/state/progress/artifacts。
heartbeat 只做投影和小修复，不启动重复重任务。
```

## 8. 分阶段开发计划

### Phase 0: 固化源码基线与现状快照

目标：先建立可重复对照，不直接改行为。

工作项：

1. 新增 `docs/ailis-codex-harness-longrun-development-plan-20260706.md`。
2. 新增或更新一个 harness inventory 脚本，列出当前 direct tools、deferred tools、MCP tools、broad action tools、legacy planner paths。
3. 运行轻量验证：

```text
pnpm ailis:validate-harness
pnpm test:ailis-agent
pnpm test:ailis-agent-execution-flow
pnpm test:ailis-tool-contracts
```

验收：

```text
文档有本地源码来源和 HEAD。
能列出 AILIS 当前工具面。
不触碰大规模行为。
```

### Phase 1: 拆出 Harness Core 边界

目标：把 `ailis-agent-runner.cjs` 中的 Harness 职责拆成独立模块，但保持行为兼容。

建议新模块：

```text
electron/ailis-runtime-environment.cjs
electron/ailis-context-compiler.cjs
electron/ailis-loop-controller.cjs
electron/ailis-finalizer-gate.cjs
electron/ailis-trace-store.cjs
```

迁移内容：

```text
buildRuntimeEnvironmentPromptObject -> ailis-runtime-environment.cjs
buildLlmAgentDirectToolPrompt 的上下文组装 -> ailis-context-compiler.cjs
validateAgentToolLoopGuard -> ailis-loop-controller.cjs
validateExactAnswerSubmission/final_answer audit -> ailis-finalizer-gate.cjs
agent.context_snapshot / evidence events -> ailis-trace-store.cjs
```

验收：

```text
Runner 仍通过现有测试。
新模块有 focused unit tests。
行为不变，只改变边界。
```

### Phase 2: Codex-style ToolSpecRegistry

目标：让所有工具统一成 Codex-style runtime object。

工作项：

1. 扩展 `AILISRuntimeTool`：

```text
id
name
namespace
spec
exposure: direct/deferred/hidden
inputSchema
outputSchema
handler
supportsParallel
waitsForCancellation
preToolUsePayload
postToolUsePayload
telemetryTags
```

2. direct core tools 保持少量：

```text
read
write
apply_patch
exec_command
write_stdin
tool_search
request_permissions
final_answer
```

3. broad action tools 分两步处理：

```text
短期：继续支持 computer/code/artifact_tools，但在 ToolSpecRegistry 标记为 broad_action_tool。
中期：将常用 action 拆成窄 direct tools，例如 output_read、artifact_query、pdf_extract_text、web_fetch。
```

4. `tool_search` 只返回 loadable specs，不返回大段能力说明。

验收：

```text
tool_search("pdf") 返回可直接调用的 PDF 工具 spec。
tool_search("web") 返回 web_search/web_fetch specs，但不把 tool_search 解释成网页搜索。
模型不能对 required 非空工具发 `{}`。
```

### Phase 3: MCP Direct Path 收敛

目标：普通任务不再通过 `mcp_bridge.call_tool` 执行 MCP 工具。

工作项：

1. `mcp_bridge` exposure 默认改为 hidden/debug，只有 doctor/admin context 暴露。
2. MCP `tools/list` 生成 direct namespace specs：

```text
mcp__ailis_research__web_search
mcp__ailis_research__web_fetch
mcp__ailis_research__pdf_extract_text
...
```

3. 对 direct MCP tool 做 schema validator：

```text
required 必须满足。
additionalProperties false 时拒绝未知字段。
空 args 只有 schema 无 required 且工具允许时才执行。
```

4. MCP tool output 统一进入 OutputStore + EvidenceStore。

验收：

```text
普通任务 transcript 中不出现 mcp_bridge.call_tool。
错误参数会产生 structured validation error。
web_fetch(PDF) 返回 unsupported_content_type，并建议 pdf_extract_text。
```

### Phase 4: Unified Exec 与 Output Store

目标：解决长程任务中 stdout/stderr 丢失、截断不可追、脚本运行后 finalizer 看不到证据的问题。

建议新模块：

```text
electron/ailis-output-store.cjs
electron/ailis-unified-exec-runtime.cjs
```

工具：

```text
exec_command
write_stdin
output_read
output_tail
output_search
output_summary
```

输出 contract：

```json
{
  "schema": "ailis.output_observation.v1",
  "status": "completed|failed|running|timeout|permission_required",
  "outputId": "out_...",
  "wallTimeMs": 0,
  "exitCode": 0,
  "sessionId": null,
  "stdoutBytes": 0,
  "stderrBytes": 0,
  "stdoutLines": 0,
  "stderrLines": 0,
  "preview": "...",
  "complete": true,
  "truncatedForModel": false,
  "nextTools": []
}
```

验收：

```text
运行输出 1MB 的脚本，模型只看到 preview + outputId。
output_search 能找到中间答案。
Agent Lab 可查看完整输出。
Finalizer 可引用 outputId/evidenceId。
```

### Phase 5: Context Compiler 与 Evidence Manifest

目标：上下文压缩不再靠“把文本截短”，而是编译出一份稳定上下文包。

Context package：

```json
{
  "runtimeEnvironment": {},
  "taskState": {},
  "recentResponseItems": [],
  "pinnedEvidenceManifest": [],
  "availableOutputIds": [],
  "toolSummary": [],
  "budgetReport": {},
  "droppedItemsManifest": []
}
```

工作项：

1. ContextManager 增加 token accounting。
2. `forPrompt()` 输出 ResponseItem list + manifest。
3. tool output compaction 只压缩模型视图，不删除 trace/evidence。
4. `ensureCallOutputsPresent()` 和 `removeOrphanOutputs()` 放到 compiler 阶段。

验收：

```text
连续 30 轮工具调用后，模型上下文仍包含 pinned evidence manifest。
旧输出被 compact 后，仍可用 outputId/artifactId 回查。
call/output 配对不丢失。
```

### Phase 6: FinalizerGate 通用化

目标：把 GAIA finalizer 的经验迁移成通用 final gate。

FinalizerGate 输入：

```text
user goal
answer candidate
available evidence refs
evidence manifest
task type
format contract
confidence
known blockers
```

FinalizerGate 输出：

```json
{
  "ok": true,
  "answer": "...",
  "confidence": "high|medium|low",
  "evidenceRefs": [],
  "warnings": [],
  "missingFields": [],
  "nextAction": "final|continue|ask_user|blocked"
}
```

硬规则：

```text
exact-answer benchmark: low confidence 不提交。
引用不存在 evidence ref -> reject 或 warning，按模式决定。
complete=false/truncated=true 的证据不能单独支撑 final。
工具失败后不能用“猜测”补 final。
```

验收：

```text
GAIA low-confidence finalizer 不提交空/猜测答案。
普通用户任务可以带 caveat 回答，但必须标明证据不足。
```

### Phase 7: LongRun Controller 泛化

目标：把 GAIA auto optimizer 的模式抽象成通用长期任务框架。

建议路径：

```text
longrun/jobs/<job-id>/mission.md
longrun/jobs/<job-id>/acceptance.md
longrun/jobs/<job-id>/loop-policy.json
longrun/jobs/<job-id>/state.json
longrun/jobs/<job-id>/progress.json
longrun/jobs/<job-id>/event-log.jsonl
longrun/jobs/<job-id>/control-queue.jsonl
longrun/jobs/<job-id>/stop.flag
longrun/jobs/<job-id>/iterations/iter-001/plan.json
longrun/jobs/<job-id>/iterations/iter-001/chain.json
longrun/jobs/<job-id>/iterations/iter-001/verdict.json
longrun/jobs/<job-id>/iterations/iter-001/repair-ticket.md
```

Controller loop：

```text
read mission/acceptance/policy/state/event-log/control-queue
check stop.flag
check active processes / leases
select next task or repair
run worker
collect chain/verdict/artifacts
classify failure
update state/progress/event-log
sleep or continue
```

安全策略：

```text
maxConcurrentHeavyRuns = 1
maxConsecutiveFailures
maxRepairBacklog
maxPaidTasksPerRun
stopOnEnvironmentFailure
stopOnLowBalanceProviderError
repairRequired blocks paid continuation unless policy permits backlog mode
```

验收：

```text
controller 重启后能从 event-log 恢复。
heartbeat 只读 progress，不重复启动重任务。
出现 provider balance/env failure 时立刻停止付费循环。
每个失败都有 chain/verdict/repair ticket。
```

### Phase 8: Replay 和回归测试

目标：每次修复不是“感觉变好”，而是用链路证明。

测试层级：

```text
unit tests: schema/tool/output/evidence/finalizer
focused replay: 旧失败 transcript
canary benchmark: 2-5 道 GAIA 小样本
cost guard benchmark: 禁止大规模无闸门循环
manual desktop smoke: AILIS 桌面端真实任务
```

验收命令建议：

```text
pnpm ailis:validate-harness
pnpm test:ailis-tool-contracts
pnpm test:ailis-agent-execution-flow
pnpm test:ailis-agent
pnpm test:ailis-runtime
node scripts/run-gaia-level1-lite.mjs --max-agent-steps 5 --task-retries 0 --no-submit --task-ids <canary>
```

## 9. 第一批具体开发任务

### Task A: Harness Inventory Report

新增脚本：

```text
scripts/audit-ailis-harness-core.mjs
```

输出：

```text
runtime tools count
core direct tools
deferred tools
hidden/debug tools
broad action tools
MCP direct tools
legacy planner entrypoints
schema strictness summary
output/evidence contract coverage
```

价值：

```text
先看清工具面，避免继续靠感觉修。
```

### Task B: Output Store MVP

新增：

```text
electron/ailis-output-store.cjs
```

接入：

```text
exec/code/computer/MCP/artifact_tools 返回大输出时写 output store。
ContextManager 只保留 preview + outputId。
```

### Task C: FinalizerGate MVP

新增：

```text
electron/ailis-finalizer-gate.cjs
```

迁移：

```text
validateExactAnswerSubmission
unknown evidence refs warning
low-confidence exact answer reject
missing evidence handling
```

### Task D: MCP Bridge Exposure 降级

改动：

```text
mcp_bridge 普通 task_agent 不默认暴露。
tool_search 返回 direct MCP specs。
管理/调试/doctor 模式才暴露 mcp_bridge。
```

### Task E: LongRun Generic Job Contract

新增：

```text
scripts/run-ailis-longrun-controller.mjs
```

先不要替换 GAIA optimizer，而是让 GAIA optimizer 适配同一 job contract。

## 10. 禁止事项

为了保持泛化，禁止以下优化方式：

```text
不要把 GAIA 某一道题的答案或专门字符串写进 runtime。
不要把 web_search 写成某个游戏/网站/论文源的特判器。
不要继续把所有工具 schema 塞进 prompt。
不要让 finalizer 在 low confidence 下自动提交 benchmark 答案。
不要让 heartbeat 启动重复 controller。
不要把完整工具输出塞进模型上下文。
不要让 persona_output 混进 task evidence。
不要让 mcp_bridge 成为普通任务主路径。
```

## 11. 最小可交付目标

第一轮不要追求全部重构。最小可交付版本：

```text
1. 文档与 inventory 脚本。
2. Output Store MVP。
3. FinalizerGate MVP。
4. MCP bridge exposure 降级。
5. 2-3 个旧失败 transcript replay 通过。
6. GAIA canary 在低步数和低预算下能给出明确 chain/verdict。
```

如果这一轮完成，AILIS 会从“有很多 Agent 能力”向“有可恢复、可审计、可控制成本的 Harness”迈出关键一步。

## 12. 一句话架构原则

```text
Runtime owns environment, tools, schemas, outputs, evidence, budgets, state, and recovery.
Model owns intent, reasoning, next-action choice, and evidence sufficiency judgment.
AILIS Surface owns warmth, persona, voice, expression, and user experience.
```

这就是 AILIS 对齐 Codex Harness 的核心方向。
