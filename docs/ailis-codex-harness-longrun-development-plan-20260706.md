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

- AILIS 的 tool runtime 结构选择成立。
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
- 这和 Codex 通过 MCP runtime snapshot、connection manager、tool exposure 的结构一致。

问题：

- `mcp_bridge` 仍是模型可见的诱惑路径之一。
- 普通任务必须只看到 direct MCP tool specs；`mcp_bridge` 必须限制在管理/调试/doctor 模式。

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
- 这和 Codex `context_manager/history.rs` 的结构一致。

问题：

- AILIS 主要以字符预算处理工具输出；Codex 同时记录 token usage、估算 token、按 ResponseItem 类型处理。
- AILIS 还必须具备更强的“raw trace 与 model prompt 分离”，不要把 UI/Persona/Debug 文本混进 evidence context。
- 对长程任务，context manager 还必须显式输出 `context_budget_report`、`pinned_evidence_manifest`、`dropped_items_manifest`。

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
- Finalizer 存在风险：会把 advisory refs 当参考，而不是强约束。
- 必须把 evidence contract 前移到工具返回规范，而不是后处理猜测。

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
- Auto optimizer 还必须更明确区分：controller、worker、conversation projector。之前 API 花费过大，说明安全预算、采样策略、失败聚类和人工闸门还不够硬。

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
它必须是每一轮的结构化输入，并被 exec/read/write/MCP runtime 共享。
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
任务模式必须默认不使用 meta-decision JSON。
模型必须直接调用真实工具，运行时在工具边界强校验。
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
AILISRuntimeTool 已经是正确契约。
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
普通模型调用 MCP 时，必须看到 mcp__server__tool direct spec。
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
AILIS 必须统一 Exec Output Store：完整 stdout/stderr 写入 store，模型看到摘要、outputId、line/byte/token 统计和下一步读取工具。
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

## 6. 当前缺口

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

这会让每次修一个 GAIA 问题都会影响其它产品行为。必须在现有模块内部收紧 Harness 职责边界，避免继续扩张模块。

### 6.2 Direct Tool 与 Legacy Planner 混用

AILIS prompt 已经说“不要输出 custom JSON decision object”，但代码里仍存在 legacy planner 和 capability_context 多路径。长程任务里，路径越多，失败分类越难。

阶段契约：

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

AILIS 已有 evidence artifact 和 final_answer refs，但 refs 仍偏 advisory。长程任务/GAIA 契约：

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

### 6.6 LongRun Controller 必须泛化

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

阶段契约：先建立可重复对照，不直接改行为。

工作项：

1. 保持 `docs/ailis-codex-harness-longrun-development-plan-20260706.md` 作为开发事实源。
2. 用现有测试、临时审计命令或已有脚本列出当前 direct tools、deferred tools、MCP tools、broad action tools、legacy planner paths；不要为“看清现状”先扩张正式模块。
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

### Phase 1: 收紧 Harness Core 代码边界

阶段契约：不新增模块，不改表层架构；先在现有文件里把 Harness 职责从“提示词拼装 + 零散守卫”收敛为稳定、可测、可审计的内部代码路径。

现有落点：

```text
electron/ailis-agent-runner.cjs
electron/ailis-tool-runtime.cjs
electron/ailis-tool-contracts.cjs
electron/ailis-context-manager.cjs
electron/ailis-evidence-artifacts.cjs
electron/ailis-mcp-session.cjs
electron/ailis-tool-executor.cjs
```

函数级收敛：

```text
buildRuntimeEnvironmentPromptObject: 输出稳定 runtime snapshot，不继续把环境信息散落进 prompt 文本。
buildLlmAgentDirectToolPrompt: 只组装已编译上下文包，不直接拼接大段工具说明。
validateAgentToolLoopGuard: 从简单轮次限制升级为 budget/重复调用/无证据推进/低置信提交守卫。
validateExactAnswerSubmission: 只做 final answer gate，不承担任务专门判断。
callLlmAgentDirectToolDecision: 固定 direct tool 决策路径，减少 legacy planner 分叉。
```

验收：

```text
Runner 仍通过现有测试。
focused unit tests 直接覆盖这些现有函数。
行为边界变清晰，但文件/模块数量不扩张。
```

### Phase 2: Codex-style ToolSpecRegistry

阶段契约：让所有工具统一成 Codex-style runtime object。

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

阶段契约：普通任务不再通过 `mcp_bridge.call_tool` 执行 MCP 工具。

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
web_fetch(PDF) 返回 unsupported_content_type，并返回 nextToolHint=pdf_extract_text。
```

### Phase 4: Unified Exec 与 Output Store 语义内嵌

阶段契约：解决长程任务中 stdout/stderr 丢失、截断不可追、脚本运行后 finalizer 看不到证据的问题。这里的 Output Store 是现有 runtime 的内部语义，不新增正式模块。

现有落点：

```text
electron/ailis-tool-executor.cjs: executeToolStep 统一写入 step trace。
electron/ailis-tool-runtime.cjs: normalizeToolOutput / dispatch 包装 outputId、preview、complete、truncatedForModel。
electron/ailis-context-manager.cjs: recordItems / forPrompt 只把 preview + outputId 放入模型上下文。
electron/ailis-evidence-artifacts.cjs: 将可引用输出升级为 evidence artifact。
```

工具语义：

```text
exec_command / write_stdin 继续沿用现有入口。
output_search 继续沿用现有 runtime tool，并补齐 outputId 引用能力。
output_tail / output_summary 如已有入口则加固；没有入口时先不新增工具，先让 output_search 覆盖最小闭环。
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

阶段契约：上下文压缩不再靠“把文本截短”，而是编译出一份稳定上下文包。

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

### Phase 5.1: 上下文管控确定性实现蓝图

本节替代所有非契约性描述。实现时不新增正式模块；只修改现有模块内部函数。若代码实现和本节冲突，以本节伪代码为准。

确定性评估：

```text
当前文档可实现把握：80%。
剩余不确定性来自：不同模型实际上下文窗口、provider 是否返回真实 token usage、现有 output store 语义是否能无痛承载所有工具输出、旧 transcript replay 覆盖是否足够。
把握提升条件：先实现本节 6 个单元测试，再跑 2-3 条旧失败链路 replay。
不得直接进入 GAIA 大规模循环：除非 context budget、large output、finalizer gate 三组测试都通过。
```

#### 5.1.1 Codex 源码算法映射

这些是 AILIS 要照搬思想的 Codex 本地源码位置，不是泛泛参考。

```text
F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\context_manager\history.rs
- record_items: 只记录 API/message/tool 所需 ResponseItem，并在写入时按 truncation policy 处理工具输出。
- for_prompt: 发送给模型前运行 normalize_history，输出模型可见 ResponseItem。
- estimate_token_count: base instructions + items token 估算。
- remove_first_item/drop_last_n_user_turns: 删除历史时按 call/output 和 user turn 边界维护一致性。
- truncate_function_output_payload: 工具输出在进入历史时即被预算化。

F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\context_manager\normalize.rs
- ensure_call_outputs_present: call 缺 output 时插入稳定 synthetic output。
- remove_orphan_outputs: output 没有对应 call 时移除或诊断。
- remove_corresponding_for: 删除 call 或 output 时同步删除另一半。
- strip_images_when_unsupported: 模型不支持图片时替换为占位文本。

F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\session\context_window.rs
- context_window_token_status: active_context_tokens、auto_compact_scope_tokens、tokens_until_compaction、token_limit_reached。
- AutoCompactTokenLimitScope::BodyAfterPrefix: 静态前缀和动态 body 分开计算。

F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\unified_exec\head_tail_buffer.rs
- HeadTailBuffer: 大输出保留 head 和 tail，中间丢弃，记录 omitted_bytes。

F:\AIGril\AIGrilClaw\.refs\openai-codex\codex-rs\core\src\tools\context.rs
- ExecCommandToolOutput: 输出保留 raw_output、wall_time、exit_code、max_output_tokens、original_token_count。
- formatted_output: 按 truncation policy 生成模型可见文本。
```

#### 5.1.2 AILIS 修改范围

只修改以下现有文件中的函数，不新增正式 Harness 模块。

```text
electron/ailis-runtime-budget.cjs
electron/ailis-tool-result.cjs
electron/ailis-tool-runtime.cjs
electron/ailis-context-manager.cjs
electron/ailis-evidence-artifacts.cjs
electron/ailis-agent-runner.cjs
scripts/run-gaia-level1-lite.mjs
scripts/run-ailis-gaia-auto-optimizer.mjs
```

#### 5.1.3 `ailis-runtime-budget.cjs`

函数契约：提供唯一预算计算入口；任何调用方不得自行计算 70% 压缩阈值。

```js
/**
 * Estimate tokens in the same spirit as Codex approx_token_count.
 * Priority:
 * 1. Provider usage/token_info when available.
 * 2. UTF-8 bytes / 4 estimate.
 * 3. chars / 3 fallback only when byte length is unavailable.
 */
function approxTokenCount(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  return Math.ceil(Buffer.byteLength(text, 'utf8') / 4);
}

/**
 * Compute a deterministic budget report before every LLM call.
 * This is the AILIS equivalent of Codex context_window_token_status.
 */
function buildContextBudgetReport(parts, config) {
  const modelContextWindowTokens =
    config.modelContextWindowTokens ??
    config.providerTokenInfo?.contextWindow ??
    32000;

  const reservedCompletionTokens = Math.max(
    2048,
    Number(config.maxOutputTokens || config.max_tokens || 0)
  );

  const safetyMarginTokens = Math.max(
    1024,
    Math.ceil(modelContextWindowTokens * 0.05)
  );

  const effectiveInputLimitTokens =
    modelContextWindowTokens - reservedCompletionTokens - safetyMarginTokens;

  const configuredTaskInputBudgetTokens =
    Number(config.taskInputBudgetTokens || 0) || effectiveInputLimitTokens;

  const targetContextTokens = Math.max(
    1024,
    Math.min(effectiveInputLimitTokens, configuredTaskInputBudgetTokens)
  );

  const staticPrefixTokens = approxTokenCount(parts.staticPrefix);
  const toolSpecsTokens = approxTokenCount(parts.toolSpecs);
  const taskStateTokens = approxTokenCount(parts.taskState);
  const pinnedEvidenceTokens = approxTokenCount(parts.pinnedEvidenceManifest);
  const recentItemsTokens = approxTokenCount(parts.recentResponseItems);
  const toolOutputPreviewTokens = approxTokenCount(parts.toolOutputPreviews);
  const droppedManifestTokens = approxTokenCount(parts.droppedItemsManifest);

  const modelVisibleTokensEstimate =
    staticPrefixTokens +
    toolSpecsTokens +
    taskStateTokens +
    pinnedEvidenceTokens +
    recentItemsTokens +
    toolOutputPreviewTokens +
    droppedManifestTokens;

  const activeContextTokens =
    Number(config.providerTokenInfo?.activeContextTokens) ||
    modelVisibleTokensEstimate;

  const budgetUsedRatio = modelVisibleTokensEstimate / targetContextTokens;
  const tokensUntilCompaction =
    Math.floor(targetContextTokens * 0.70 - modelVisibleTokensEstimate);

  return {
    schema: 'ailis.context_budget_report.v1',
    estimateSource: config.providerTokenInfo ? 'provider_usage' : 'utf8_bytes_div_4',
    modelContextWindowTokens,
    reservedCompletionTokens,
    safetyMarginTokens,
    effectiveInputLimitTokens,
    targetContextTokens,
    staticPrefixTokens,
    toolSpecsTokens,
    taskStateTokens,
    pinnedEvidenceTokens,
    recentItemsTokens,
    toolOutputPreviewTokens,
    droppedManifestTokens,
    modelVisibleTokensEstimate,
    activeContextTokens,
    budgetUsedRatio,
    tokensUntilCompaction,
    compactionLevel: classifyCompactionLevel(budgetUsedRatio, effectiveInputLimitTokens)
  };
}

function classifyCompactionLevel(ratio, effectiveInputLimitTokens) {
  if (effectiveInputLimitTokens < 4096) return 'stop';
  if (ratio >= 0.80) return 'stop';
  if (ratio >= 0.70) return 'hard';
  if (ratio >= 0.65) return 'precompact';
  if (ratio >= 0.50) return 'soft';
  return 'none';
}
```

预算分账硬规则：

```text
toolSpecsTokens > targetContextTokens * 0.15 -> hide deferred specs, keep tool_search only.
pinnedEvidenceTokens > targetContextTokens * 0.25 -> compress evidence summaries, never drop ids.
recentItemsTokens > targetContextTokens * 0.30 -> keep latest 2-4 call/output pairs, compact older pairs.
toolOutputPreviewTokens > targetContextTokens * 0.20 -> convert old previews to output refs.
droppedManifestTokens > targetContextTokens * 0.05 -> keep only ids/reasons/recovery tool, drop prose.
```

#### 5.1.4 `ailis-runtime-budget.cjs` Head/Tail 伪代码

Codex `HeadTailBuffer` 的策略必须替代大输出的 middle truncate。

```js
/**
 * Keep stable head and tail, drop the middle.
 * Used for command output, logs, HTML, long JSON text, transcript text.
 */
function makeHeadTailPreview(text, maxChars) {
  const source = String(text || '').replace(/\r\n/g, '\n');
  if (source.length <= maxChars) {
    return {
      text: source,
      truncatedForModel: false,
      omittedChars: 0,
      originalTextChars: source.length,
      visibleTextChars: source.length
    };
  }

  const marker = '\n... [middle omitted for model budget] ...\n';
  const remaining = Math.max(0, maxChars - marker.length);
  const headChars = Math.ceil(remaining * 0.55);
  const tailChars = remaining - headChars;
  const head = source.slice(0, headChars);
  const tail = tailChars > 0 ? source.slice(-tailChars) : '';

  return {
    text: [
      'OUTPUT_TRUNCATED_FOR_MODEL: true',
      `originalTextChars=${source.length}`,
      `visibleTextChars<=${maxChars}`,
      `omittedChars=${source.length - head.length - tail.length}`,
      '--- head ---',
      head,
      '--- omitted middle ---',
      marker.trim(),
      '--- tail ---',
      tail
    ].join('\n'),
    truncatedForModel: true,
    omittedChars: source.length - head.length - tail.length,
    originalTextChars: source.length,
    visibleTextChars: head.length + tail.length
  };
}
```

#### 5.1.5 `ailis-tool-result.cjs`

函数契约：工具输出出生时必须变成预算化 observation；禁止先把 1MB 文本塞进 `ContextManager` 后再补救。

```js
/**
 * Normalize every tool output into a model-safe observation.
 * Raw/full output is not placed in model text when it exceeds budget.
 */
function normalizeAilisToolOutput(result, { toolId, outputStore, evidenceStore }) {
  const raw = coerceToolResult(result);
  const rawText = extractPrimaryText(raw);
  const rawBytes = Buffer.byteLength(rawText, 'utf8');
  const rawLines = rawText ? rawText.split(/\r?\n/).length : 0;
  const approxOriginalTokens = approxTokenCount(rawText);

  const shouldExternalize =
    rawBytes > 6000 ||
    rawLines > 120 ||
    approxOriginalTokens > 1500 ||
    containsLargeStructuredPayload(raw.structuredContent);

  let outputRef = null;
  if (shouldExternalize) {
    outputRef = outputStore.write({
      toolId,
      rawText,
      structuredContent: raw.structuredContent,
      rawBytes,
      rawLines,
      approxOriginalTokens,
      hash: sha256(rawText)
    });
  }

  const preview = makeHeadTailPreview(rawText, shouldExternalize ? 6000 : 12000);

  return {
    content: [{
      type: 'text',
      text: renderObservationText({
        status: raw.status,
        toolId,
        outputId: outputRef?.outputId ?? null,
        complete: raw.complete !== false,
        truncatedForModel: preview.truncatedForModel,
        originalTokens: approxOriginalTokens,
        preview: preview.text,
        nextTools: outputRef ? ['output_read', 'output_tail', 'output_search'] : []
      })
    }],
    isError: raw.isError === true,
    details: compactDetails(raw.details),
    structuredContent: compactStructuredContent(raw.structuredContent),
    outputRef,
    modelBudget: {
      status: 'compacted',
      rawBytes,
      rawLines,
      approxOriginalTokens,
      visibleTextChars: preview.visibleTextChars,
      truncatedForModel: preview.truncatedForModel
    }
  };
}
```

#### 5.1.6 `ailis-tool-runtime.cjs`

运行契约：所有 runtime tool 和 direct MCP tool 必须走同一校验、输出预算、证据生成路径。

```js
/**
 * Dispatch one tool call.
 * Contract validation happens before handler execution.
 * Output normalization happens after handler execution.
 */
async function dispatch(toolId, args, context) {
  const tool = resolveToolOrDirectMcp(toolId);
  if (!tool) return toolError('not_materialized');

  const validation = validateToolContract(toolId, args);
  if (!validation.ok) {
    return normalizedValidationObservation(validation);
  }

  const startedAt = Date.now();
  try {
    const rawResult = await tool.handle(validation.args, context);
    const normalized = normalizeAilisToolOutput(rawResult, {
      toolId,
      outputStore: context.outputStore,
      evidenceStore: context.evidenceStore
    });
    normalized.trace = {
      toolId,
      durationMs: Date.now() - startedAt,
      argsDigest: digestArgs(validation.args),
      status: normalized.isError ? 'failed' : 'completed'
    };
    return normalized;
  } catch (error) {
    return normalizeAilisToolOutput(toolExceptionToResult(error), { toolId });
  }
}
```

#### 5.1.7 `ailis-context-manager.cjs`

函数契约：`ContextManager` 保存 ResponseItem 历史；`forPrompt()` 必须编译 context package，禁止只返回 raw history 的浅拷贝。

```js
/**
 * Record model/API items.
 * Tool outputs are processed immediately with model-visible truncation.
 */
ContextManager.prototype.recordItems = function(items, policy) {
  for (const item of items) {
    if (!isResponseItemLike(item)) continue;
    this.items.push(this.processItem(item, policy));
  }
  this.history_version += 1;
};

/**
 * Prepare input for the next model call.
 * Algorithm mirrors Codex ContextManager::for_prompt + normalize_history,
 * but returns a package that can be rendered into ResponseItems.
 */
ContextManager.prototype.forPrompt = function(options) {
  const work = this.clone();
  work.normalizeHistory(options.inputModalities);

  let pkg = work.buildContextPackage(options);
  let budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);

  if (budget.compactionLevel === 'soft') {
    work.compactExploratoryToolOutputs({ stalePreviewChars: 1200 });
    pkg = work.buildContextPackage(options);
    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);
  }

  if (budget.compactionLevel === 'precompact') {
    work.compactOldTurnsToDroppedManifest({ keepRecentPairs: 4 });
    work.compressEvidenceSummaries({ keepIds: true });
    pkg = work.buildContextPackage(options);
    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);
  }

  if (budget.compactionLevel === 'hard') {
    work.keepOnlyMinimalPromptState({
      keepRecentPairs: 2,
      keepLatestFailure: true,
      keepPinnedEvidence: true,
      keepOutputRefs: true
    });
    pkg = work.buildContextPackage(options);
    budget = buildContextBudgetReport(pkg.parts, options.budgetConfig);
  }

  if (budget.compactionLevel === 'stop') {
    return renderBlockedContextPackage({
      reason: 'context_budget_exhausted',
      budget,
      checkpoint: work.toCheckpoint()
    });
  }

  pkg.budgetReport = budget;
  return renderContextPackageAsResponseItems(pkg);
};
```

#### 5.1.8 `ContextManager.normalizeHistory`

Codex 对应 `normalize.rs`，AILIS 必须保持同样不变量。

```js
/**
 * Invariants after normalizeHistory:
 * 1. Every tool/function/custom/tool_search call has exactly one output.
 * 2. No orphan output remains unless it is a server tool_search output.
 * 3. If model does not support images, image payloads become placeholder text.
 * 4. Removing an item never leaves its call/output counterpart behind.
 */
ContextManager.prototype.normalizeHistory = function(inputModalities) {
  this.ensureCallOutputsPresent();
  this.removeOrphanOutputs();
  if (!supportsImages(inputModalities)) {
    this.stripImagesWhenUnsupported();
  }
};
```

#### 5.1.9 `ContextManager.buildContextPackage`

```js
/**
 * Build a precise state package, not a transcript dump.
 */
ContextManager.prototype.buildContextPackage = function(options) {
  const pairs = collectCallOutputPairs(this.items);
  const latestFailure = findLatestFailure(pairs);
  const recentPairs = takeRecentPairs(pairs, options.keepRecentPairs ?? 4);
  const pinnedEvidence = collectPinnedEvidence(this.items, {
    maxItems: options.maxPinnedEvidence ?? 24,
    maxSummaryChars: 700
  });
  const outputRefs = collectAvailableOutputRefs(this.items, {
    maxRefs: options.maxOutputRefs ?? 48
  });
  const dropped = this.droppedItemsManifest ?? [];

  return {
    schema: 'ailis.context_package.v1',
    goal: options.goal,
    runtimeEnvironment: options.runtimeEnvironment,
    taskState: inferTaskState({
      latestFailure,
      pinnedEvidence,
      recentPairs,
      userGoal: options.goal
    }),
    recentResponseItems: flattenPairs(recentPairs),
    pinnedEvidenceManifest: pinnedEvidence,
    availableOutputRefs: outputRefs,
    toolSummary: options.toolSummary,
    droppedItemsManifest: compactDroppedManifest(dropped),
    parts: {
      staticPrefix: options.staticPrefix,
      toolSpecs: options.toolSummary,
      taskState: inferTaskState(...),
      pinnedEvidenceManifest: pinnedEvidence,
      recentResponseItems: flattenPairs(recentPairs),
      toolOutputPreviews: collectVisibleToolPreviews(recentPairs),
      droppedItemsManifest: compactDroppedManifest(dropped)
    }
  };
};
```

#### 5.1.10 Context package 保留规则

```text
MUST_KEEP:
- latest user goal and explicit constraints
- output format/unit/language requirements
- pending call/output pairs
- latest failed tool call and failure layer
- latest successful evidence-producing observation
- pinnedEvidenceManifest ids and summaries
- availableOutputRefs for every externalized output used by evidence
- active permission/env/provider blocker

CAN_COMPACT:
- old exploratory tool outputs
- repeated search/fetch attempts
- old tool specs reloadable through tool_search
- persona/UI/chitchat text unrelated to task
- raw observation already covered by evidence manifest

CAN_DROP_WITH_MANIFEST:
- old raw output with outputId/artifactId
- abandoned failed path after replacement strategy exists
- old intermediate reasoning text
- old capability catalog entries reloadable by tool_search

NEVER_DROP:
- current user request
- final answer format constraints
- evidence summary needed by current answer
- call without output / output without call
- unresolved blocker
```

#### 5.1.11 Finalizer gate 伪代码

运行契约：Finalizer 必须按 evidencePolicy 分级；普通任务不得被 strict 证据门槛误卡，GAIA/exact-answer 不得低置信提交。

```js
/**
 * Classify how much evidence is required for this task.
 */
function classifyEvidencePolicy(task) {
  if (task.exactAnswerMode || task.autoSubmit || task.benchmark === 'GAIA') {
    return 'strict';
  }
  if (task.highRiskFact || task.requiresExternalEvidence) {
    return 'required';
  }
  if (task.localCodeChange || task.localFileGeneration || task.testRun) {
    return 'local_verification';
  }
  if (task.creative || task.brainstorming || task.userAsksForOpinion) {
    return 'not_required';
  }
  return 'preferred';
}

/**
 * Finalizer returns one of:
 * final | allow_with_caveat | continue | ask_user | blocked
 */
function finalizerGate(candidate, contextPackage) {
  const evidencePolicy = classifyEvidencePolicy(contextPackage.taskState);
  const formatOk = validateAnswerFormat(candidate, contextPackage.taskState);
  if (!formatOk.ok) {
    return continueWithFix('answer_format_invalid', formatOk);
  }

  const coverage = evaluateEvidenceCoverage({
    answer: candidate.answer,
    evidenceManifest: contextPackage.pinnedEvidenceManifest,
    outputRefs: contextPackage.availableOutputRefs,
    localVerification: contextPackage.taskState.localVerification
  });

  if (evidencePolicy === 'strict') {
    if (candidate.confidence === 'low') return continueOrBlocked('low_confidence');
    if (coverage.status !== 'complete') return continueOrBlocked('strict_evidence_missing');
    return final(candidate, coverage);
  }

  if (evidencePolicy === 'required') {
    if (coverage.status === 'complete') return final(candidate, coverage);
    if (coverage.hasLowCostNextStep) return continueWithTool(coverage.nextToolHint);
    return allowWithCaveat(candidate, coverage);
  }

  if (evidencePolicy === 'local_verification') {
    if (coverage.localDiffOrTestOrOutputRef) return final(candidate, coverage);
    if (contextPackage.taskState.completedLocally) return allowWithCaveat(candidate, coverage);
    return continueWithTool('run focused local verification');
  }

  if (evidencePolicy === 'not_required') {
    return final(candidate, { status: 'not_required' });
  }

  if (coverage.status === 'complete' || coverage.status === 'partial') {
    return finalOrCaveat(candidate, coverage);
  }
  if (coverage.hasLowCostNextStep) return continueWithTool(coverage.nextToolHint);
  return allowWithCaveat(candidate, coverage);
}
```

Blocked 只允许在以下条件出现：

```text
- permission/env/provider blocker prevents progress
- user decision is required
- strict evidence is missing and no low-cost next step exists
- minimal context package cannot fit within budget
- tool schema/runtime corruption prevents reliable execution
```

普通用户任务不得因为缺少 evidenceId 自动 blocked。

#### 5.1.12 长程任务 checkpoint 伪代码

```js
/**
 * Called after every longrun iteration.
 * Conversation window is only a projector; disk artifacts are source of truth.
 */
function persistLongrunIteration(jobDir, iteration, result) {
  writeJson(`${jobDir}/iterations/${iteration}/chain.json`, {
    steps: result.steps,
    outputRefs: result.outputRefs,
    evidenceRefs: result.evidenceRefs,
    budgetReports: result.budgetReports
  });

  writeJson(`${jobDir}/iterations/${iteration}/verdict.json`, {
    status: result.status,
    failureLayer: classifyFailureLayer(result),
    confidence: result.confidence,
    cost: result.cost,
    loopCount: result.steps.length
  });

  writeJson(`${jobDir}/iterations/${iteration}/context-package.json`, {
    contextPackage: result.nextContextPackage,
    budgetReport: result.nextContextPackage.budgetReport
  });

  if (result.status !== 'success') {
    writeText(`${jobDir}/iterations/${iteration}/repair-ticket.md`,
      renderRepairTicket(result)
    );
  }
}
```

#### 5.1.13 必须先通过的测试

```text
tests/ailis-context-manager-budget.test.mjs
- buildContextBudgetReport has deterministic denominator.
- 70% hard gate triggers before next LLM call.
- minimal context package produces blocked/new-window signal when it cannot fit.

tests/ailis-tool-output-compaction.test.mjs
- 1MB output yields <= 6000 chars model preview.
- preview contains head, tail, omitted count, outputId, nextTools.
- output_search can recover a middle sentinel string.

tests/ailis-context-package.test.mjs
- 50 tool calls keep call/output pairing.
- latest user request and format constraints are never dropped.
- old output becomes droppedItemsManifest + outputRef.

tests/ailis-finalizer-gate.test.mjs
- GAIA exact low-confidence answer is rejected.
- local code/test success can final without web evidence.
- preferred evidence missing returns allow_with_caveat, not blocked.
- truncated evidence with sufficient summary can final.
```

#### 5.1.14 实现顺序

```text
1. ailis-runtime-budget.cjs: buildContextBudgetReport + makeHeadTailPreview。
2. ailis-tool-result.cjs: normalizeAilisToolOutput 立刻生成 safe preview + outputRef metadata。
3. ailis-context-manager.cjs: forPrompt 改为 buildContextPackage + budget gate。
4. ailis-evidence-artifacts.cjs: evidence manifest 只放 ref/summary/coverage/completeness。
5. ailis-agent-runner.cjs: buildLlmAgentDirectToolPrompt 使用 context package，不再读 raw transcript。
6. GAIA/LongRun: finalizerGate 使用 evidencePolicy，checkpoint 写 context-package.json。
7. 跑 5.1.13 测试，再跑旧失败 transcript replay。
```
### Phase 6: FinalizerGate 通用化

阶段契约：把 GAIA finalizer 的经验迁移成通用 final gate。

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
  "evidencePolicy": "strict|required|preferred|not_required|local_verification",
  "evidenceCoverage": "complete|partial|missing|not_required",
  "evidenceRefs": [],
  "outputRefs": [],
  "warnings": [],
  "missingFields": [],
  "nextAction": "final|allow_with_caveat|continue|ask_user|blocked",
  "nextToolHint": null
}
```

硬规则：

```text
exact-answer benchmark: low confidence 不提交。
引用不存在 evidence ref -> strict mode reject；balanced/light mode warning，不必自动 blocked。
complete=false/truncated=true 的证据不能单独支撑 strict final，但可作为 partial evidence 支撑 allow_with_caveat。
local_verification 任务可引用 diff/test/outputId/file path 作为证据，不要求网页或外部 evidence。
工具失败后不能用“猜测”补 strict final；普通用户任务必须明确 caveat 或 ask_user。
```

验收：

```text
GAIA low-confidence finalizer 不提交空/猜测答案。
普通用户任务可以带 caveat 回答，但必须标明证据不足。
```

### Phase 7: LongRun Controller 泛化

阶段契约：把 GAIA auto optimizer 的模式抽象成通用长期任务框架。

沿用并规范现有 longrun 目录契约：

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

阶段契约：每次修复不是“感觉变好”，而是用链路证明。

测试层级：

```text
unit tests: schema/tool/output/evidence/finalizer
focused replay: 旧失败 transcript
canary benchmark: 2-5 道 GAIA 小样本
cost guard benchmark: 禁止大规模无闸门循环
manual desktop smoke: AILIS 桌面端真实任务
```

验收命令：

```text
pnpm ailis:validate-harness
pnpm test:ailis-tool-contracts
pnpm test:ailis-agent-execution-flow
pnpm test:ailis-agent
pnpm test:ailis-runtime
node scripts/run-gaia-level1-lite.mjs --max-agent-steps 5 --task-retries 0 --no-submit --task-ids <canary>
```

## 9. 代码级修改矩阵（不新增模块）

这一章是执行口径：不再优先新增 Harness 模块，也不把表层架构重新命名。开发重点是现有模块内部函数的约束、数据结构、状态保存、错误分类和回归测试，让行为更接近 Codex-style Harness。

### 9.1 Agent Runner 主循环

文件：`electron/ailis-agent-runner.cjs`

| 函数 | 当前职责 | 实现契约 | 验收点 |
| --- | --- | --- | --- |
| `buildRuntimeEnvironmentPromptObject` | 生成运行环境提示对象 | 固定 runtime snapshot 字段：cwd、shell、权限、网络、日期、工具暴露模式、预算；避免把环境信息散落到自由文本 | 同一环境两次生成结构稳定，测试只比较结构字段 |
| `buildEvidenceSufficiencyPromptObject` | 让模型判断证据是否足够 | 输出结构化审计要求：`sufficient/confidence/missing_fields/next_action/evidence_refs`；不要让模型自由发挥成普通回复 | 低证据任务返回 continue 或 ask_user，不直接 final |
| `buildLlmAgentDirectToolPrompt` | 拼 direct tool prompt | 只放少量核心 direct tools + tool_search；MCP/Web/PDF 通过 tool_search 暴露；不要把所有 schema 塞进 prompt | transcript 中工具说明显著变短，tool_search 能返回可执行 spec |
| `validateNativeDirectToolCall` | 校验模型工具调用 | 对 required、additionalProperties、空 `{}`、未知工具、桥接工具暴露模式做统一拒绝 | 失败 transcript 不再出现空参数 MCP 调用继续执行 |
| `callLlmAgentDirectToolDecision` | 请求模型下一步动作 | 固定 direct-tool 决策路径，减少 legacy planner 分叉；模型输出无效时进入 repair prompt，而不是硬执行 | 无效 tool call 有 structured validation error 和下一步修复实现要求 |
| `validateAgentToolLoopGuard` | loop 守卫 | 从步数守卫升级为预算、重复搜索、无新证据、同 URL 重抓、低置信 final 的综合守卫 | 5 步任务能早停、追问或给出证据不足，而不是空转 |
| `validateExactAnswerSubmission` | 最终答案校验 | 只保留通用 final answer gate：答案格式、证据引用、置信度、缺失字段；不要写 GAIA/游戏/网页特判 | 普通任务和 GAIA 共享同一类 final gate 语义 |

### 9.2 Tool Contract 严格化

文件：`electron/ailis-tool-contracts.cjs`

| 函数/区域 | 实现契约 | 验收点 |
| --- | --- | --- |
| `validateAgainstSchema` | 补齐 Codex-style schema contract：required 必须满足，`additionalProperties:false` 拒绝未知字段，类型错误返回可读 path | 单测覆盖缺 required、未知字段、类型错误、嵌套对象 |
| `normalizeArgsForContract` | 只做安全、显式、可解释的 normalization；禁止把 `{}` 猜成默认搜索/默认抓取 | `web_search.query`、`web_fetch.url`、`describe_image.path` 缺失时直接拒绝 |
| `validateToolContract` | 返回 structured validation result：`ok/error/path/retryable/suggestedFix` | runner 可以把错误反馈给模型重试，而不是吞掉后继续 |
| `getToolContractPromptText` / `compactSchemaForPrompt` | prompt 中只给必要字段和 required 信息；完整 schema 留在 runtime 校验 | 上下文减少，但校验严格性不下降 |
| `tool_search` contract | 明确 query 必填；tool_search 只搜工具，不承担网页搜索 | `tool_search` 空参数被拒绝，带 query 时返回 deferred/direct tool specs |
| `mcp_bridge` contract | 普通任务默认 hidden/debug；只保留 doctor/admin 兜底 | 正常任务 transcript 不再依赖 bridge 执行 MCP |

### 9.3 Tool Runtime 与 tool_search

文件：`electron/ailis-tool-runtime.cjs`

| 函数/类 | 实现契约 | 验收点 |
| --- | --- | --- |
| `AILISRuntimeTool.searchInfo` | 输出短 metadata：name、namespace、description、required fields、exposure、score hints | tool_search 返回可加载工具，而不是长说明书 |
| `AILISToolRuntimeRegistry.search` | 按 query 做 deferred tool 检索和重排；优先返回精确工具，再返回相关工具 | `tool_search("web fetch")` 能稳定露出 `web_fetch`，不是泛泛说明 |
| `AILISToolRuntimeRegistry.dispatch` | dispatch 前统一调用 contract validation；失败返回 validation observation，不执行 handler | handler 不再收到 `{}` 或错误字段 |
| `dispatchDirectMcpTool` | direct MCP tool 走同一 validator、trace、output normalization | MCP direct path 和 core tool 行为一致 |
| `normalizeToolOutput` | 所有工具输出统一成 `status/preview/outputId/evidenceIds/complete/truncatedForModel/nextTools` | 大输出不直接塞进上下文，完整内容可回查 |
| default registry 的 `tool_search` | 只暴露工具检索语义；搜索网页必须由返回的 `web_search` 工具执行 | 模型不再把 tool_search 当 web search |
| default registry 的 `output_search` | 补强 outputId / artifactId 搜索和摘要 | finalizer 能引用旧输出证据 |

### 9.4 MCP Manager

文件：`electron/ailis-mcp-session.cjs`

| 函数/类 | 实现契约 | 验收点 |
| --- | --- | --- |
| `schemaPropertyNames` | 更准确抽取 required、properties、additionalProperties、description | MCP spec 进入 tool_search 后不会丢字段 |
| `AILISMcpManager.searchToolSpecs` | 返回 Codex-style loadable specs：server、tool、namespace、inputSchema、required、exposure | `tool_search("pdf")` 能返回 `mcp__...__pdf_extract_text` 这类 direct spec |
| `AILISMcpManager.callTool` | call 前复用严格 schema validation；call 后统一 output normalization | MCP error/timeout/schema error 可分类 |
| direct MCP spec 生成路径 | direct path 是主路径，`mcp_bridge.call_tool` 只作调试兜底 | 普通任务不再通过 bridge 绕过 schema |

### 9.5 Context Manager

文件：`electron/ailis-context-manager.cjs`

| 函数 | 实现契约 | 验收点 |
| --- | --- | --- |
| `recordItems` | 写入 response item 时保留 call/output 配对、outputId、evidenceId、tool status | replay 可以恢复完整链路 |
| `forPrompt` | 输出上下文包：recent items、pinned evidence manifest、available output ids、budget report、dropped items manifest | 压缩后模型仍知道可引用证据 |
| `truncateFunctionOutputPayload` | 只压缩模型视图，不删除完整输出引用；preview 必须标注 truncated/complete | 大输出不会污染上下文 |
| `ensureCallOutputsPresent` | 把缺失 output 变成 structured diagnostic，不要静默丢失 | transcript 不再有孤儿 tool call |
| `fromCheckpoint` | 恢复时保留 output/evidence manifest 和预算状态 | 长程任务中断后可继续 |

### 9.6 Evidence Artifacts

文件：`electron/ailis-evidence-artifacts.cjs`

| 函数 | 实现契约 | 验收点 |
| --- | --- | --- |
| `artifactEvidencePayload` / `payloadForArtifact` | 区分网页、PDF、截图、命令输出、ASR/TTS、文件读取等证据类型 | finalizer 能判断证据类型和完整性 |
| `confidenceFromText` | 只做弱启发，不替代模型证据判断；置信度来源要标注 | 不把启发式分数当最终事实 |
| `validateEvidenceArtifact` | 校验证据必须有 source、payload、confidence、completeness、createdAt、引用 id | 无效证据不能支撑 final |
| `createEvidenceArtifact` | tool output 成功后统一生成可引用证据；失败输出只生成 diagnostic evidence | 答案引用的 evidenceId 可追溯 |
| `getEvidenceArtifactsPromptObject` | 给模型一份 evidence manifest，不直接塞入所有原文 | 上下文更短，证据链更稳定 |

### 9.7 Tool Executor 与 Trace

文件：`electron/ailis-tool-executor.cjs`

| 函数 | 实现契约 | 验收点 |
| --- | --- | --- |
| `executeToolStep` | step started/finished/error 统一记录 tool name、args digest、validation、duration、outputId、evidenceIds | Agent Lab 和 replay 能还原每步 |
| `executeToolStep` error path | 区分 validation_error、tool_error、timeout、permission_required、environment_error | 自动优化器能按层分类修复 |
| `executeToolStep` result path | 返回给 runner 的永远是 normalized observation | runner 禁止依赖每个工具私有格式 |

### 9.8 GAIA 与 LongRun Harness

文件：`scripts/run-gaia-level1-lite.mjs`、`scripts/run-ailis-gaia-auto-optimizer.mjs`

| 函数/区域 | 实现契约 | 验收点 |
| --- | --- | --- |
| `buildFinalAnswerGate` | 复用通用 final gate 语义：证据 refs、置信度、缺失字段、nextAction | GAIA 不再单独积累一堆特判 |
| `buildEvidenceDigest` | 输入 evidence manifest，而不是从 transcript 文本里猜证据 | evidence digest 可回放、可检查 |
| `finalizeAnswerFromEvidence` | low confidence / missing refs / truncated-only evidence 不提交 | 省 API 钱，避免错误提交 |
| `acceptExactAnswerCandidate` / `acceptEvidenceAnswerCandidate` | 接受条件来自 final gate，不来自任务私有字符串 | 泛化到非 GAIA benchmark |
| `classifyGaiaResult` | 分类维度固定为 MCP/TOOLS/AGENT/HARNESS/ENV/PROVIDER/DATA | repair ticket 更可执行 |
| `buildRepairTicket` | 自动包含 failing step、tool call、validation error、evidence gap、最小复现命令 | 修复从链路出发，不从答案出发 |
| `shouldContinueAfterVerdict` / `evaluateSafetyGate` | 成本和安全闸门前置：余额/环境失败/连续失败时停止重跑 | 不再烧 API 空转 |

### 9.9 第一批实现顺序

1. 先改 `ailis-tool-contracts.cjs`：让错误参数不能进入工具执行。
2. 再改 `ailis-tool-runtime.cjs` 和 `ailis-mcp-session.cjs`：让 tool_search 暴露 direct specs，MCP bridge 降级。
3. 再改 `ailis-context-manager.cjs` 和 `ailis-evidence-artifacts.cjs`：让输出和证据可引用、可压缩、可回放。
4. 再改 `ailis-agent-runner.cjs`：减少 prompt 堆叠，增强 loop guard 和 final gate。
5. 最后改 GAIA/LongRun 脚本：把失败分类、repair ticket、成本闸门接到统一 evidence/trace 结构上。

### 9.10 不做什么

```text
不新增正式 Harness 模块。
不重命名表层架构。
不把 GAIA 某题写成特判。
不为了一个网页、一个游戏、一个 PDF 源定制 runtime。
不让“新增工具”替代 schema、context、evidence、trace 的硬化。
```
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

本轮范围固定为以下最小可交付实现：

```text
1. 文档与代码级修改矩阵。
2. tool contracts 严格校验 最小实现。
3. runtime outputId / evidenceId 引用 最小实现。
4. MCP bridge exposure 降级，tool_search 返回 direct specs。
5. 2-3 个旧失败 transcript replay 通过。
6. GAIA canary 在低步数和低预算下能给出明确 chain/verdict。
```

完成本轮范围后，AILIS 必须具备可恢复、可审计、可控制成本的 Harness 基线。

## 12. 一句话架构原则

```text
Runtime owns environment, tools, schemas, outputs, evidence, budgets, state, and recovery.
Model owns intent, reasoning, next-action choice, and evidence sufficiency judgment.
AILIS Surface owns warmth, persona, voice, expression, and user experience.
```

这就是 AILIS 对齐 Codex Harness 的核心契约。
