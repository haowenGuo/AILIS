# scripts/verify-ailis-runtime-alignment.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：274
- SHA-256：`26dfcd678a4c42687f099db02e07150a89c5c3b6f7536a06006ef6f63ac8b668`
- 可运行副本：[打开源文件](../../../source/scripts/verify-ailis-runtime-alignment.mjs)
- 依赖：`node:fs`、`node:path`、`node:child_process`
- 主要符号：`root`、`rel`、`abs`、`human`、`codex`、`findDistFile`、`dist`、`match`、`openclaw`、`checks`、`gatewayDefinitions`、`AILISToolRuntimeRegistry`、`classifyAcpToolApproval`、`guardedResult`、`AILISMcpManager`、`AgentControl`、`ev`、`readText`、`full`、`lineNumber`、`index`、`evaluateEvidence`、`text`、`matches`、`missing`、`found`、`getOpenClawVersion`、`pkg`、`json`、`getCodexVersion`、`dir`、`evaluated`、`evidence`、`requiredFailures`、`failed`、`status`、`marker`、`firstMatch`、`suffix`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import { execFileSync } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const root = process.cwd();</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 6 | <code>const rel = (...parts) =&gt; path.join(...parts);</code> | 声明局部标识符 `rel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 7 | <code>const abs = (...parts) =&gt; path.join(root, ...parts);</code> | 声明局部标识符 `abs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const human = {</code> | 声明局部标识符 `human`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 10 | <code>  runtime: rel('electron', 'ailis-runtime.cjs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 11 | <code>  toolRuntime: rel('electron', 'ailis-tool-runtime.cjs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 12 | <code>  toolSpecs: rel('electron', 'ailis-tool-specs.cjs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>  gateway: rel('electron', 'ailis-gateway.cjs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>  runner: rel('electron', 'ailis-agent-runner.cjs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>  runtimeTest: rel('tests', 'ailis-runtime.test.mjs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 16 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>const codex = {</code> | 声明局部标识符 `codex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 19 | <code>  common: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'common.rs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 20 | <code>  item: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'v2', 'item.rs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 21 | <code>  mcp: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-protocol', 'src', 'protocol', 'v2', 'mcp.rs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>  thread: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'codex_thread.rs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 23 | <code>  shell: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'shell.rs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 24 | <code>  handlerMod: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'mod.rs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 25 | <code>  multiAgents: rel('build-cache', 'codex-runtime', 'codex-rs', 'core', 'src', 'tools', 'handlers', 'multi_agents_common.rs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 26 | <code>  appClient: rel('build-cache', 'codex-runtime', 'codex-rs', 'app-server-client', 'src', 'lib.rs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 27 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>function findDistFile(prefix) {</code> | 定义函数 `findDistFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>  const dist = abs('build-cache', 'openclaw-runtime', 'dist');</code> | 声明局部标识符 `dist`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 31 | <code>  if (!fs.existsSync(dist)) return null;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>  const match = fs.readdirSync(dist).find((entry) =&gt; entry.startsWith(prefix) &amp;&amp; entry.endsWith('.js'));</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>  return match ? rel('build-cache', 'openclaw-runtime', 'dist', match) : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>const openclaw = {</code> | 声明局部标识符 `openclaw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>  agentEvents: findDistFile('agent-events-'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>  acpCli: findDistFile('acp-cli-'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 39 | <code>  extraParams: findDistFile('extra-params-'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 40 | <code>  agentRunner: findDistFile('agent-runner.runtime-'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>  toolPolicy: findDistFile('tool-policy-'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>  tools: findDistFile('openclaw-tools-'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>  transcriptDoc: rel('build-cache', 'openclaw-runtime', 'docs', 'reference', 'transcript-hygiene.md'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 44 | <code>  acpDoc: rel('build-cache', 'openclaw-runtime', 'docs', 'cli', 'acp.md'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>const checks = [</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>    id: 'formal-item-transcript-and-events',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>    verdict: 'aligned-conceptually',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 51 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>      ev('Codex item lifecycle protocol', codex.common, ['TurnStarted =&gt; "turn/started"', 'ItemStarted =&gt; "item/started"', 'ItemCompleted =&gt; "item/completed"', 'PlanDelta =&gt; "item/plan/delta"']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 53 | <code>      ev('OpenClaw agent event streams', openclaw.agentEvents, ['stream: "item"', 'stream: "plan"', 'stream: "approval"']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 54 | <code>      ev('AILIS JSONL runtime transcript', human.runtime, ["type: 'thread.started'", "type: 'turn.started'", "item.type === 'tool.call'", "type: 'tool.result'", "this.emitGatewayEvent('runtime.item'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>      ev('AILIS SSE transcript route', human.gateway, ["url.pathname === '/transcript'", 'formatSseEvent(event)', 'writeGatewayEventToClient']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>    id: 'update-plan-as-real-runtime-tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>    verdict: 'aligned',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>      ev('Codex plan delta notification', codex.item, ['pub struct PlanDeltaNotification', 'pub delta: String']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>      ev('OpenClaw plan tool and stream', openclaw.toolPolicy, ['id: "update_plan"', 'label: "update_plan"']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 64 | <code>      ev('AILIS update_plan tool definition', human.toolSpecs, ["id: 'update_plan'", 'AILIS_RUNTIME_TOOL_DEFINITIONS']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 65 | <code>      ev('AILIS update_plan transcript event', human.runtime, ["type: 'plan.updated'", 'async updatePlan']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 66 | <code>      ev('AILIS agent drives update_plan', human.runner, ["tool: 'update_plan'", 'plan_update']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 70 | <code>    id: 'tool-exposure-and-catalog',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>    verdict: 'aligned-simplified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>      ev('OpenClaw broad tool catalog', openclaw.toolPolicy, ['id: "update_plan"', 'id: "exec"', 'id: "read"']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 74 | <code>      ev('AILIS gateway exposes registry-backed tools', human.gateway, ['const gatewayDefinitions = this.gatewayToolRuntimeRegistry.listDefinitions()', 'const runtimeTools = gatewayDefinitions', 'codex_like_gateway_tool_registry']),</code> | 声明局部标识符 `gatewayDefinitions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>      ev('AILIS runtime exposes tool definitions', human.runtime, ['getRuntimeToolDefinitions()', 'toolRuntimeRegistry']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 76 | <code>      ev('AILIS Codex-like tool runtime registry', human.toolRuntime, ['class AILISToolRuntimeRegistry', 'modelVisibleSpecs', 'async dispatch']),</code> | 定义类 `AILISToolRuntimeRegistry`，把相关状态与行为收拢为一个运行时对象。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 77 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>    id: 'approval-and-policy-classification',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 81 | <code>    verdict: 'aligned-simplified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>      ev('Codex approval guard for exec escalation', codex.shell, ['Approval policy guard', 'requests_sandbox_override()', 'AskForApproval::OnRequest']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 84 | <code>      ev('Codex validates additional permissions', codex.handlerMod, ['normalize_and_validate_additional_permissions', 'approval_policy: AskForApproval']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 85 | <code>      ev('OpenClaw ACP approval classifier', openclaw.acpCli, ['function classifyAcpToolApproval', '"readonly_scoped"', 'approvalClass: "exec_capable"', 'approvalClass: "control_plane"', 'approvalClass: "mutating"']),</code> | 定义函数 `classifyAcpToolApproval`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 86 | <code>      ev('AILIS policy classification', human.runtime, ['classifyToolCall', 'evaluateToolCall', "class: 'readonly_scoped'", "class: 'exec_capable'", "class: 'control_plane'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 90 | <code>    id: 'sandbox-and-permission-profile',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 91 | <code>    verdict: 'partial-gap-no-container-sandbox',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>      ev('Codex derives sandbox from permission profile', codex.thread, ['pub approval_policy: AskForApproval', 'pub permission_profile: PermissionProfile', 'pub fn sandbox_policy(&amp;self) -&gt; SandboxPolicy']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 94 | <code>      ev('Codex exec uses sandbox policy', codex.shell, ['file_system_sandbox_policy', 'permission_profile: turn.permission_profile()']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 95 | <code>      ev('AILIS permission profile model', human.runtime, ['normalizePermissionProfile', "fileSystem: 'workspace-write'", "shell: 'approval-required'", "approvalPolicy: 'on-request'"]),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 96 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 99 | <code>    id: 'transcript-repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>    verdict: 'openclaw-aligned-codex-adjacent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 102 | <code>      ev('OpenClaw synthetic missing tool result', openclaw.extraParams, ['missing tool result in session history', 'makeMissingToolResult', 'repairToolUseResultPairing']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>      ev('OpenClaw transcript hygiene docs', openclaw.transcriptDoc, ['Tool result pairing repair', 'synthetic tool results']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>      ev('AILIS transcript repair inserts missing tool.result', human.runtime, ['async repairTranscript', "status: 'repaired_missing_result'", "type: 'transcript.repair'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 105 | <code>      ev('AILIS repair test', human.runtimeTest, ['repairs incomplete transcripts', "status === 'repaired_missing_result'"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 106 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>    id: 'tool-result-guard',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>    verdict: 'aligned-simplified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>      ev('OpenClaw result cleanup exports', openclaw.extraParams, ['stripToolResultDetails', 'sanitizeToolUseResultPairing']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>      ev('AILIS guard redacts and truncates results', human.runtime, ['guardToolResult', 'redactObject(part)', 'next.truncated = true', "status: 'guarded'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 114 | <code>      ev('AILIS gateway guards every result', human.gateway, ['const guardedResult = this.runtime.guardToolResult(result, { toolId, callId })', 'const guardedError = this.runtime.guardToolResult']),</code> | 声明局部标识符 `guardedResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>    id: 'mcp-bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>    verdict: 'aligned-simplified-stdio-session-manager',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>      ev('Codex MCP tool call protocol', codex.mcp, ['pub struct McpServerToolCallParams', 'pub server: String', 'pub tool: String', 'pub struct McpServerToolCallResponse']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>      ev('OpenClaw ACP MCP bridge constraints', openclaw.acpDoc, ['Per-session `mcpServers` are not supported in bridge mode', 'plugin-tools-mcp-bridge']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 123 | <code>      ev('AILIS MCP runtime bridge surface', human.toolSpecs, ["id: 'mcp_bridge'", 'AILIS_RUNTIME_TOOL_DEFINITIONS']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>      ev('AILIS MCP direct dispatch', human.toolRuntime, ['dispatchDirectMcpTool', 'tool_search']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>      ev('AILIS MCP call lifecycle', human.runtime, ['executeMcpBridge', "type: 'mcp.tool.call.begin'", "type: 'mcp.tool.call.end'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>      ev('AILIS MCP stdio session manager', rel('electron', 'ailis-mcp-session.cjs'), ['class AILISMcpManager', "session.request('tools/list'", "session.request('tools/call'", "session.request('resources/read'"]),</code> | 定义类 `AILISMcpManager`，把相关状态与行为收拢为一个运行时对象。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 130 | <code>    id: 'codex-agent-control',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 131 | <code>    verdict: 'aligned-session-scoped-thread-tree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 132 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>      ev('Codex child agents inherit runtime policy', codex.multiAgents, ['apply_spawn_agent_runtime_overrides', 'approval_policy', 'set_permission_profile']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 134 | <code>      ev('AILIS Codex collaboration tool definitions', human.toolSpecs, ["id: 'spawn_agent'", "id: 'followup_task'", "id: 'wait_agent'", "id: 'list_agents'", "id: 'close_agent'"]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>      ev('AILIS session-scoped AgentControl', rel('electron', 'ailis-agent-control.cjs'), ['class AgentControl', 'class AgentRegistry', 'await_live_children', 'forward_child_completion_to_parent']),</code> | 定义类 `AgentControl`，把相关状态与行为收拢为一个运行时对象。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>      ev('AILIS legacy relay removal', human.toolRuntime, ['definitionById.spawn_agent', 'agent_control.spawn_agent_with_metadata']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>    id: 'approval-resume',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 141 | <code>    verdict: 'aligned-simplified-durable-pending-store',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 143 | <code>      ev('AILIS agent pending approval', human.runner, ['storePendingAgentApproval', 'executePendingAgentApproval', 'approvalType: \'agent_tool_call\'']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 144 | <code>      ev('AILIS durable pending store', human.runner, ['pending-agent-state.json', 'loadPendingState', 'persistPendingState', 'durable_pending_store']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>      ev('AILIS policy can request approval', human.runtime, ["? 'approval.requested'", "result.status === 'needs_approval'"]),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 146 | <code>      ev('Codex approval mode appears in thread config', codex.thread, ['pub approval_policy: AskForApproval']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 147 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 150 | <code>    id: 'local-core-computer-tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>    verdict: 'ailis-specific-aligned-to-codex-tool-shape',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>      ev('Codex command execution handler', codex.shell, ['ToolEmitter::shell', 'ShellRequest', 'intercept_apply_patch']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>      ev('AILIS local core tools registered as runtime tools', human.gateway, ['createGatewayToolRuntimeRegistry', "'ailis-local-core'", 'executeGatewayLocalTool']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>      ev('AILIS gateway dispatches through registry first', human.gateway, ['this.gatewayToolRuntimeRegistry.dispatch', 'this.executeGatewayLocalTool']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 156 | <code>      ev('AILIS agent prompt exposes computer actions', human.runner, ['computer action：list/tree/stat/read/write/write_binary/append/mkdir/copy/move/rename/delete/search/hash/du/exec_command/write_stdin/exec/session_start/process_read/process_write/process_kill/pty_start/pty_write/pty_kill/watch/watch_stop/rollback_list/rollback_restore/acl_get/acl_set']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 157 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>  {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>    id: 'event-backpressure-and-lossless-tier',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    verdict: 'aligned-simplified-cursor-replay-and-slow-consumer-guard',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 162 | <code>    evidence: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 163 | <code>      ev('Codex lossless event delivery tier', codex.appClient, ['server_notification_requires_delivery', 'ItemCompleted(_)', 'TurnCompleted(_)', 'PlanDelta(_)']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>      ev('AILIS SSE event route', human.gateway, ['this.sseClients', 'eventLog', 'getEventsAfter', 'writeGatewayEventToClient']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>      ev('AILIS transcript JSONL persistence', human.runtime, ['fsp.appendFile(run.transcriptPath', 'JSON.stringify(transcriptItem)']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>  },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>function ev(label, file, patterns, required = true) {</code> | 定义函数 `ev`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>  return { label, file, patterns, required };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 172 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 174 | <code>function readText(file) {</code> | 定义函数 `readText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 175 | <code>  if (!file) return null;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 176 | <code>  const full = abs(file);</code> | 声明局部标识符 `full`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>  if (!fs.existsSync(full)) return null;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 178 | <code>  return fs.readFileSync(full, 'utf8');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>function lineNumber(text, needle) {</code> | 定义函数 `lineNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>  const index = text.indexOf(needle);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>  if (index &lt; 0) return null;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>  return text.slice(0, index).split(/\r?\n/).length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>function evaluateEvidence(item) {</code> | 定义函数 `evaluateEvidence`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>  const text = readText(item.file);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>  if (text == null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 190 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 191 | <code>      ...item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 192 | <code>      ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 193 | <code>      missing: ['file_missing'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>      matches: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>  const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>  const missing = [];</code> | 声明局部标识符 `missing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 199 | <code>  for (const pattern of item.patterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 200 | <code>    const found = text.includes(pattern);</code> | 声明局部标识符 `found`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 201 | <code>    if (!found) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 202 | <code>      missing.push(pattern);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>      continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>      pattern,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>      line: lineNumber(text, pattern),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>  return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>    ...item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>    ok: missing.length === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>    missing,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>    matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 215 | <code>  };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>function getOpenClawVersion() {</code> | 定义函数 `getOpenClawVersion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>  const pkg = abs('build-cache', 'openclaw-runtime', 'package.json');</code> | 声明局部标识符 `pkg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>  if (!fs.existsSync(pkg)) return 'missing';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 221 | <code>  const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));</code> | 声明局部标识符 `json`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>  return `${json.name &#124;&#124; 'openclaw'}@${json.version &#124;&#124; 'unknown'}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>function getCodexVersion() {</code> | 定义函数 `getCodexVersion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>  const dir = abs('build-cache', 'codex-runtime');</code> | 声明局部标识符 `dir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>  if (!fs.existsSync(path.join(dir, '.git'))) return 'missing';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 228 | <code>  try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 229 | <code>    return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 230 | <code>  } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>    return 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 232 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>const evaluated = checks.map((check) =&gt; {</code> | 声明局部标识符 `evaluated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 236 | <code>  const evidence = check.evidence.map(evaluateEvidence);</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>  const requiredFailures = evidence.filter((item) =&gt; item.required &amp;&amp; !item.ok);</code> | 声明局部标识符 `requiredFailures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>  return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>    ...check,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 240 | <code>    evidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>    ok: requiredFailures.length === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 242 | <code>    requiredFailures,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 243 | <code>  };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>const failed = evaluated.filter((check) =&gt; !check.ok);</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>console.log('AILIS runtime alignment verification');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>console.log(`OpenClaw reference: ${getOpenClawVersion()}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>console.log(`Codex reference: ${getCodexVersion()}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>console.log('');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>for (const check of evaluated) {</code> | 声明局部标识符 `check`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 254 | <code>  const status = check.ok ? 'PASS' : 'FAIL';</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>  console.log(`[${status}] ${check.id} (${check.verdict})`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>  for (const item of check.evidence) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>    const marker = item.ok ? '  - ok' : item.required ? '  - missing' : '  - optional-missing';</code> | 声明局部标识符 `marker`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>    const firstMatch = item.matches[0];</code> | 声明局部标识符 `firstMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>    const suffix = firstMatch ? `:${firstMatch.line}` : '';</code> | 声明局部标识符 `suffix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 260 | <code>    console.log(`${marker}: ${item.label} :: ${item.file &#124;&#124; 'unresolved'}${suffix}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>    if (!item.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 262 | <code>      for (const missing of item.missing) {</code> | 声明局部标识符 `missing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 263 | <code>        console.log(`      missing pattern: ${missing}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>      }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>console.log('');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 270 | <code>console.log(`Summary: ${evaluated.length - failed.length}/${evaluated.length} checks passed.`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>if (failed.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 273 | <code>  process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 274 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
