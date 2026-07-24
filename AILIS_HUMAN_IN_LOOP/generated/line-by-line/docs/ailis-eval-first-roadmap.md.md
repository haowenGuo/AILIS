# docs/ailis-eval-first-roadmap.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：271
- SHA-256：`863663772655263f234dc049d44d2a8dfa28197ab89f1bd786fda0b2ba48090a`
- 可运行副本：[打开源文件](../../../source/docs/ailis-eval-first-roadmap.md)
- 依赖：`runtime failed`
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Eval-First Roadmap</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-06-24</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Decision</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>AILIS should postpone heavy sandbox and enterprise-grade boundary-control work for now. The next priority is evaluation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>The reason is simple: without strong evals, it is easy to add architecture that feels responsible but does not prove the assistant is becoming smarter, more useful, or more alive. AILIS should first build a repeatable way to answer these questions:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>- Does AILIS feel like the same character over time?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- Does AILIS remember and use context well?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- Can AILIS execute real tasks through tools?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- Does AILIS recover when tools fail?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- Which benchmark scores are credible enough to show publicly?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- Which failures are product blockers rather than just engineering noise?</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>Sandbox work is still important, but for now it should stay as a minimal safety baseline:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>- Never commit secrets.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- Do not silently perform irreversible external actions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- Keep tool calls auditable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- Keep local write actions scoped enough for development.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>## Evaluation Philosophy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>AILIS should not be evaluated like a generic chatbot only. It has two product identities:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>1. **Humanlike Companion**: character consistency, naturalness, memory, emotion fit, relationship continuity, low tool feeling, voice and multimodal fit.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>2. **Task Execution Agent**: planning, tool use, file/code work, process control, desktop capability, recovery, evidence, and benchmark task success.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>The evaluation stack should keep these separate, then combine them into a single release scorecard.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>## Current Snapshot</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>Commands run on 2026-06-24:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 39 | <code>pnpm eval:ailis-humanlike:validate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>pnpm eval:ailis-humanlike:report</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>pnpm test:ailis-humanlike-eval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>pnpm ailis:benchmark-execution</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>pnpm ailis:smoke-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>pnpm ailis:smoke-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>pnpm bench:swebench-lite:selftest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>pnpm bench:osworld:readiness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>pnpm openclaw:validate-tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>Observed results:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>&#124; Area &#124; Command &#124; Result &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 55 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 56 | <code>&#124; Humanlike dataset structure &#124; `pnpm eval:ailis-humanlike:validate` &#124; Passed, 1000 scenarios valid &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 57 | <code>&#124; Humanlike coverage &#124; `pnpm eval:ailis-humanlike:report` &#124; Passed, 1000 scenarios, 251 negative probes, issueCount 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 58 | <code>&#124; Humanlike unit tests &#124; `pnpm test:ailis-humanlike-eval` &#124; Passed, 12 / 12 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 59 | <code>&#124; Local execution benchmark &#124; `pnpm ailis:benchmark-execution` &#124; Passed; code repair, process session, safety gates, 17 audit entries, 36 transcript items &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 60 | <code>&#124; Agent smoke &#124; `pnpm ailis:smoke-agent` &#124; Passed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 61 | <code>&#124; Gateway smoke &#124; `pnpm ailis:smoke-gateway` &#124; Passed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 62 | <code>&#124; SWE-bench tiny selftest &#124; `pnpm bench:swebench-lite:selftest` &#124; Passed, 1 / 1 verified &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 63 | <code>&#124; Agent runner tests &#124; `pnpm test:ailis-agent` &#124; Passed, 4 / 4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 64 | <code>&#124; Harness validation &#124; `pnpm ailis:validate-harness` &#124; Passed, 27 contracts, 12 skills, 16 checked tools &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 65 | <code>&#124; OSWorld readiness &#124; `pnpm bench:osworld:readiness` &#124; Script ran, but official run not ready &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>&#124; OpenClaw tool surface validation &#124; `pnpm openclaw:validate-tools` &#124; Failed due to missing upstream reference catalog &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>OSWorld blockers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>- `build-cache/OSWorld` is missing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- OSWorld Python dependencies are not installed in the active Windows Python or WSL Python environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>OpenClaw validation blocker:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 76 | <code>missing upstream tool catalog:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>F:\AILIS_self_evolution_runtime\AILISClaw\.refs\openclaw-main\src\agents\tool-catalog.ts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>This should be treated as an alignment environment gap, not as proof that AILIS task execution is broken.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>## Eval Tracks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>### Track 1: Humanlike Companion Eval</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>Goal: prove AILIS feels like a consistent long-term assistant, not a generic assistant skin.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>Primary commands:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 91 | <code>pnpm eval:ailis-humanlike:validate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>pnpm eval:ailis-humanlike:report</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>pnpm test:ailis-humanlike-eval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>pnpm eval:ailis-humanlike:longitudinal-agent:smoke</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>Core metrics:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>- `persona_consistency`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- `naturalness`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- `memory_usefulness`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- `emotional_fit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `multimodal_sync`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `low_tool_feeling`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- `relationship_stage_fit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `task_completion`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>Near-term target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>- Keep 1000 / 1000 scenario validation passing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>- Keep issueCount at 0.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- Run longitudinal smoke regularly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- Track failures by category, not just average score.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>### Track 2: Task Execution Eval</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>Goal: prove AILIS can actually do work through tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>Primary commands:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>pnpm ailis:benchmark-execution</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>pnpm ailis:smoke-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>pnpm ailis:smoke-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>Core evidence:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>- Tool calls produce transcript items.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>- Mutating operations leave audit evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- Code repair can move from failing test to passing test.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- Long-running process sessions can start, read, write, and exit.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- Approval-required actions are correctly surfaced.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>Near-term target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>- Keep all local execution smoke tests green.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- Add a stable JSON summary output that can be shown as a release artifact.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- Separate "blocked by missing external benchmark environment" from "runtime failed".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>### Track 3: Public Benchmark Eval</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>Goal: get credible external comparison points without overstating them.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>Priority order:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>1. GAIA Level 1 / Level 1 Lite</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>2. SWE-bench Lite selftest and then real small subset</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>3. OSWorld readiness and then `test_small`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>4. TerminalBench or WebArena later if they match the product direction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>Current best public-facing GAIA note from the existing scorecard:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 157 | <code>GAIA Level 1 Lite public subset:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>20 questions</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>submitted score: 60% = 12 / 20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>completed locally: 19 / 20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>This can be shown, but must be labeled as a Level 1 Lite public subset, not an official full GAIA leaderboard claim.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>### Track 4: Regression Gate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>Goal: make every release answer one question: did AILIS get better or worse?</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>Recommended lightweight release gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 172 | <code>pnpm eval:ailis-humanlike:validate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>pnpm eval:ailis-humanlike:report</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>pnpm test:ailis-humanlike-eval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>pnpm ailis:benchmark-execution</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>pnpm ailis:smoke-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>pnpm ailis:smoke-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>pnpm bench:swebench-lite:selftest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>Optional heavier gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 185 | <code>pnpm eval:ailis-humanlike:longitudinal-agent:smoke</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>pnpm bench:gaia:official:l1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>pnpm bench:osworld:readiness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>Do not include OSWorld official runs in the default gate until OSWorld dependencies are installed and stable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>## What To Build Next</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>### P0: Unified Eval Report</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>Create a single report generator that collects:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>- Humanlike validation summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- Humanlike coverage summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- Local execution benchmark summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>- Agent/gateway smoke summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>- SWE-bench selftest summary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>- OSWorld readiness status.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 204 | <code>- Known blockers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>Suggested output:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 209 | <code>eval-results/ailis-release-scorecard/latest.summary.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>eval-results/ailis-release-scorecard/latest.report.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>This gives AILIS a release dashboard without needing a heavy web UI.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>### P1: Failure Taxonomy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>Every failed eval should land in one of these buckets:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>- Model reasoning failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 220 | <code>- Tool contract failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>- Runtime integration failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- Missing environment dependency.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- Memory/persona failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>- Multimodal sync failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>- Benchmark harness failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- External service or credential failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>This matters more than a single average score. AILIS needs to know what kind of intelligence is failing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>### P2: Longitudinal Eval Sampling</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>The 30-day companion benchmark is valuable but heavy. Add a stable sampled mode:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>- 1 day smoke</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 235 | <code>- 3 day smoke</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 236 | <code>- 30 day critical checkpoints</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- full 30 day run</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>This makes long-term memory and personality regressions easier to run often.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>### P3: Public Benchmark Environment Setup</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>Before improving scores, make the environment reliable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>- Clone OSWorld into `build-cache/OSWorld`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- Install OSWorld dependencies in WSL or a dedicated Python environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>- Restore or vendor the OpenClaw upstream reference catalog used by `openclaw:validate-tools`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 248 | <code>- Keep GAIA dataset access and cache paths documented.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>## What Not To Do Yet</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>Do not spend the next phase building:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>- A heavy enterprise sandbox.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 255 | <code>- A complex permission matrix.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 256 | <code>- A commercial account and payment system.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 257 | <code>- A large multi-user backend.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- A polished benchmark website before the score pipeline is stable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>These can come later. For now, the highest leverage work is to make AILIS measurable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>## Definition Of Progress</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>AILIS is improving when:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>- Humanlike eval scores rise without increasing hard failures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 267 | <code>- Longitudinal memory failures decrease.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 268 | <code>- Task execution evals keep passing across releases.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 269 | <code>- Public benchmark runs become reproducible.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 270 | <code>- Failures are classified clearly enough to generate the next engineering task.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 271 | <code>- The assistant feels less like a tool wrapper while becoming better at real work.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
