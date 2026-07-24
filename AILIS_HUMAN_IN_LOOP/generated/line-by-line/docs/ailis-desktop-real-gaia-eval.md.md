# docs/ailis-desktop-real-gaia-eval.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：330
- SHA-256：`e3747db09cccccc41aa453c0f89e3f7a3fb18adb6d5d11ee00927f3ed1265ba2`
- 可运行副本：[打开源文件](../../../source/docs/ailis-desktop-real-gaia-eval.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Desktop-Real GAIA Evaluation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This document defines the GAIA evaluation path that is intended to measure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>AILIS as users actually experience it in the desktop app.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>## Why This Exists</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>AILIS has two different GAIA-like evaluation needs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>1. Strict exact-answer submission.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>   This is the leaderboard-style path. It requires a clean machine-readable</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>   answer field such as `final_answer`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>2. Desktop-real product evaluation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>   This is the user-facing path. It should use the same gateway shape as the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>   desktop chat UI: message history, attachments, persona orchestration, direct</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>   tool execution, and normal visible replies.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>The previous full L1 run used the strict exact-answer harness with direct tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>execution disabled by default. That is useful for testing a submission protocol,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>but it is not a faithful measurement of the desktop product path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>## Runner</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>Use:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>pnpm bench:gaia:desktop-real:smoke</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>or:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>pnpm bench:gaia:desktop-real:l1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>Direct script usage:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 40 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>Dry plan without spending model tokens:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 46 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 5 --plan-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>## Codex Subscription Model Backend</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>The desktop-real runner can use the local Codex login as an evaluation-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>model backend. AILIS remains the harness: it owns context assembly, memory,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>tool visibility, tool execution, observations, retries, evidence, finalization,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>and interruption. Codex performs one stateless model inference per call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>Prerequisite:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 59 | <code>codex login status</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>The status must report that Codex is logged in with ChatGPT. No OpenAI API key</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>is read by this path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Plan one task without spending model tokens:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 68 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>  --codex-model-bridge `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>  --codex-model gpt-5.5 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>  --codex-reasoning-effort medium `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>  --limit 1 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>  --plan-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>Run a resumable L1 evaluation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 79 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>  --codex-model-bridge `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>  --codex-model gpt-5.5 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>  --codex-reasoning-effort medium `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  --max-agent-steps 20 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>  --llm-timeout-ms 180000 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>  --request-timeout-ms 900000 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>  --run-id codex-model-bridge-gaia-l1 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>  --resume</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>Bridge isolation contract:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>- Each inference starts a fresh ephemeral Codex app-server thread.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- `baseInstructions` and `developerInstructions` are replaced by a short</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>  model-backend contract.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>- The temporary Codex home contains only a short-lived copy of `auth.json`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>  It does not contain global `AGENTS.md`, project instructions, MCP config,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>  plugins, memories, or thread databases, and it is deleted after process exit.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>- Shell, browser, computer-use, app, plugin, image, goal, multi-agent, workspace</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>  dependency, web-search, and MCP surfaces are disabled or empty.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>- The bridge uses the official ChatGPT Codex backend with OAuth and forces HTTPS</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>  because WebSocket transport is unreliable on some networks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>- Tool decisions are constrained to the tool names currently exposed by AILIS.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>  Codex returns structured tool-call intent; AILIS executes the tool and owns the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>  next inference context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>- Any Codex-side tool item, server callback, loaded instruction source, invalid</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>  schema output, auth failure, or transport failure is recorded as a provider</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>  failure instead of being silently accepted.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>This is a Codex CLI/app-server evaluation adapter, not a general OpenAI API and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>not a production serving interface. Its latency and concurrency are bounded by</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>the local Codex process and the ChatGPT plan.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>## Runtime Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>The runner intentionally mirrors the desktop chat path:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>- `directToolExecutor: true`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- `nativeDirectTools: true`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>- `agentRole: persona_orchestrator`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- `memoryPolicy: disabled` for both the root request and delegated TaskAgent</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `workspaceRoot` defaults to the project root, matching the development</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>  desktop Gateway workspace</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>The GAIA runner disables both semantic-memory reads and memory writes. Separate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>session IDs and workspaces are not sufficient isolation by themselves because a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>shared persistent memory index can otherwise expose earlier benchmark tasks to</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>later tasks in the same run.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>- `messageHistory` is empty by default for benchmark tasks, so the current</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>  question is not duplicated into both `message` and synthetic history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>- file attachments are passed through the same attachment shape used by chat</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- the current evaluation runner injects the `exact_answer_eval` execution profile</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>- the current evaluation runner enables `answerOnly` and `exactAnswerMode`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- tool approvals are automatic and every task starts with empty message history</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>This means the score answers a different question from the strict GAIA runner:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>&gt; Did the real desktop-style AILIS interaction produce a visible answer that</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>&gt; contains the correct result?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>## Metrics</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>Each run emits:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>- `*.jsonl`: one final row per task.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>- `*.summary.json`: aggregate metrics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>- `*.report.md`: readable report.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 147 | <code>- `gateway-audit/&lt;run-id&gt;`: full gateway audit artifacts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 148 | <code>- `*.progress.jsonl`: append-only progress stream.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>Headline metrics:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>- `visibleCorrect`: visible answer matched the gold answer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 153 | <code>- `responseOk`: the agent run completed without runtime failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- `manualReview`: the visible response had content but no safe deterministic</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>  answer extraction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>- `durationMs`, `avgDurationMs`, `p50/p90/p95DurationMs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>- token usage from gateway LLM events and response usage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>- optional estimated cost when `--cost-input-per-1m` and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 159 | <code>  `--cost-output-per-1m` are provided.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>- tool call count and tool error count in each task row.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>## Optimization Shadow Mode</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>Experimental optimization diagnostics are disabled by default. Shadow Mode can</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>measure context repetition, duplicate artifacts, suspicious tool arguments,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>multi-field evidence coverage, and repeated research attempts without changing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>model input, tool arguments, tool choice, or answer admission.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>Enable all Shadow observers for a diagnostic run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 172 | <code>$env:AILIS_OPTIMIZATION_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>Or enable only one observer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>$env:AILIS_CONTEXT_DELTA_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>$env:AILIS_ARTIFACT_DEDUP_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>$env:AILIS_TOOL_ARG_LINT_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>$env:AILIS_EVIDENCE_MATRIX_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>$env:AILIS_NO_PROGRESS_ADVISORY_SHADOW = '1'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>Shadow data is written as `agent.optimization_shadow` transcript items and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>Gateway events. It is not included in the next model request. These flags do</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>not activate context compression, argument rewriting, routing, early stopping,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>or answer blocking.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>## Regression Admission Gate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>Do not enable an active optimization from a smoke result. Freeze one commit,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>run the same complete task set independently at least twice for the baseline</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>and candidate, and compare the result JSONL files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 197 | <code>pnpm bench:gaia:compare -- `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>  --baseline baseline-run-1.jsonl `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>  --baseline baseline-run-2.jsonl `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>  --candidate candidate-run-1.jsonl `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>  --candidate candidate-run-2.jsonl `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>  --expected-tasks 53 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>  --output eval-results/engineering/gaia-regression-gate.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>The default gate rejects the candidate when:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>- either cohort has fewer than two independent runs;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>- any run has a missing, extra, or replaced task;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- aggregate visible success decreases;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>- timeout rate increases;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 212 | <code>- P95 duration increases by more than 15%;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 213 | <code>- mean model tokens increase by more than 10%;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 214 | <code>- a task that is correct in every baseline run is wrong in every candidate run.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>Thresholds can be made stricter from the CLI. Loosening them requires an</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>explicit recorded decision; it must not happen implicitly inside the runner.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>The comparison process exits non-zero when a candidate is rejected.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>## Scoring Policy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>The desktop-real runner does not require a separate `final_answer` field.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>It accepts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>- structured answer fields when available;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- visible answer lines such as `Answer: 3`, `Final answer: ...`, or `答案是...`;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>- exact visible containment for longer non-ambiguous gold answers;</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>- list answers when all list parts appear.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- scaled-unit equivalents when the question explicitly asks for a scaled unit,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>  such as accepting `17000 hours` as the visible desktop equivalent of `17`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  thousand hours.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>For very short gold answers such as `3`, `b`, or `No`, the runner does not</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>count a random occurrence in a long paragraph. It requires a visible answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>line or a structured answer candidate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>This keeps the product score closer to user perception while avoiding obvious</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>false positives.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>## Relationship To Strict GAIA</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>Use the strict runner when the question is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>&gt; Can AILIS produce a machine-submittable GAIA answer field?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>Use desktop-real when the question is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>&gt; Can AILIS, as a desktop embodied assistant, solve the task for the user?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>Both metrics matter. They should be reported separately.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>## Level 2 Preparation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>GAIA is gated on Hugging Face. Accept the dataset terms and authenticate once:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 257 | <code>hf auth login</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>Prepare the public Level 2 validation metadata and attachments:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 263 | <code>node scripts/run-gaia-official.mjs `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>  --split validation `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>  --levels 2 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>  --run-id gaia-l2-desktop-source `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>  --download-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>The command emits `*.desktop-source.jsonl` and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>`*.desktop-source.summary.json`. Run a low-cost desktop-real smoke first:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 274 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>  --source-jsonl eval-results/engineering/gaia-official/gaia-l2-desktop-source.desktop-source.jsonl `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>  --source-summary eval-results/engineering/gaia-official/gaia-l2-desktop-source.desktop-source.summary.json `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 277 | <code>  --codex-model-bridge `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>  --isolated-workspace `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>  --limit 3 `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>  --no-resume</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>## Common Commands</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>Run three tasks:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 288 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 3</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>Run one task by task id:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 294 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --task-ids ec09fa32-d03f-4bf8-84b0-1f16922c3ae4</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>Run against a deliberately isolated temporary workspace:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 300 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 3 --isolated-workspace</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>Use a specific workspace root:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 306 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --workspace-root F:\AILIS_self_evolution_runtime --limit 3</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>Run with explicit cost estimates:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 312 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 10 --cost-input-per-1m 0.27 --cost-output-per-1m 1.10</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>Use an already running gateway:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 318 | <code>node scripts/run-ailis-desktop-real-gaia-eval.mjs --gateway-url http://127.0.0.1:3100 --limit 3</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>## Guardrails</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>- Start with `--plan-only` or `--limit 3` before a full L1 run.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- Report strict GAIA score and desktop-real score separately.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>- Do not submit desktop-real visible-answer scores as official GAIA leaderboard</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>  results.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>- Keep API keys out of reports; the runner redacts LLM settings.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>- Verify `turnContext.memory.hasContext` is false and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 329 | <code>  `turnContext.toolContext.memoryPolicy` is `disabled` in a smoke transcript</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>  before starting a full score run.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
