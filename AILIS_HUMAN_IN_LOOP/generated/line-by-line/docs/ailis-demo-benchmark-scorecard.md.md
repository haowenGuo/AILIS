# docs/ailis-demo-benchmark-scorecard.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：481
- SHA-256：`d7641555555f6ee340e8d8be2a41d95ddd64b102be1b9fb721f47e8c432b812d`
- 可运行副本：[打开源文件](../../../source/docs/ailis-demo-benchmark-scorecard.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Demo and Benchmark Scorecard</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Generated: 2026-07-20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Positioning</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>AILIS PC 版展示时不要只说“一个桌宠”，也不要只说“一个 Agent”。它的核心卖点应拆成两条可验收能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>1. Humanlike Companion：拟人化、长期记忆、低工具感、多模态一致性。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>2. Task Execution Agent：文件、代码、命令行、桌面操作、工具审批、恢复与验证。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>视频演示和 benchmark 展示应分别覆盖这两条线，然后在最后合并成一个故事：AILIS 既像一个长期陪伴的虚拟助手，也能在需要时切换成桌面任务执行 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>## External Benchmark References</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>&#124; Benchmark &#124; Why It Matters &#124; Scoring Style &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 17 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 18 | <code>&#124; OSWorld &#124; 真实桌面环境中的 open-ended computer tasks，覆盖 Web、桌面应用、OS 文件 I/O 和跨应用流程。官方 benchmark 有 369 个任务，使用可复现环境和执行式评估脚本。 &#124; Task success rate / per-task execution score &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 19 | <code>&#124; GAIA &#124; 面向通用 AI Assistant 的复杂问题解决 benchmark，适合展示搜索、文件、推理、工具组合能力。 &#124; Exact short-answer matching / leaderboard submission &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 20 | <code>&#124; SWE-bench Lite &#124; 真实 GitHub issue 修复，适合展示代码能力。 &#124; Resolved rate：测试补丁通过即视为解决 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 21 | <code>&#124; CharacterEval / InCharacter &#124; 角色扮演和人格一致性评估参考。CharacterEval 使用多维角色评估；InCharacter 用心理量表和访谈式评估看 persona fidelity。 &#124; Rubric / reward model / judge / personality consistency &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 22 | <code>&#124; MT-Bench / Chatbot Arena style judging &#124; 主观对话质量常用强 Judge 或成对比较。适合 AILIS 的拟人化体验评估，但必须控制 Judge 偏差。 &#124; LLM-as-judge / pairwise preference &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>Reference links:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>- OSWorld: https://os-world.github.io/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- OSWorld GitHub: https://github.com/xlang-ai/OSWorld</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- GAIA: https://huggingface.co/gaia-benchmark</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- GAIA dataset: https://huggingface.co/datasets/gaia-benchmark/GAIA</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- SWE-bench: https://github.com/princeton-nlp/SWE-bench</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- CharacterEval: https://github.com/morecry/CharacterEval</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- InCharacter: https://incharacter.github.io/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- MT-Bench / Chatbot Arena paper: https://arxiv.org/abs/2306.05685</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>## Current Local Scores</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>These are the scores currently available in this repo. They should be presented with their exact scope, not as inflated official leaderboard scores.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>## Public Score Priority</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>For external demos, use public/recognized benchmarks as the main scoreboard. Keep AILIS's internal humanlike eval as a product-quality regression suite, not as the headline industry score.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>### Tier 1: Main Public Benchmarks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>&#124; Capability &#124; Benchmark &#124; Why It Is Credible &#124; AILIS Fit &#124; Status &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 46 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 47 | <code>&#124; Desktop computer operation &#124; OSWorld &#124; Academic benchmark for real computer environments with web, desktop apps, OS file I/O, and cross-app workflows. &#124; Very high. AILIS is a PC desktop assistant. &#124; Readiness ready; small historical run 2/4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 48 | <code>&#124; Code agent &#124; SWE-bench Lite / Verified / Pro &#124; Industry-standard coding-agent benchmark based on real GitHub issues. Verified is widely used but increasingly contaminated; Pro is safer for future claims. &#124; High. AILIS has code tools, patching, tests, terminal. &#124; Harness selftest only &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 49 | <code>&#124; General assistant with tools &#124; GAIA &#124; Commonly used assistant benchmark for search, files, reasoning, and exact answers. &#124; High. Best current fit for AILIS's generic tool-use ability. &#124; Strict-memory-isolated Run 1: 41/53 (77.36%); Run 2 pending. Historical diagnostic mean: 85.85% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 50 | <code>&#124; Tool + user interaction &#124; τ-bench / τ²-bench &#124; Evaluates agents in realistic multi-turn user + API tool environments with policies. &#124; High for future email/customer-service style workflows. &#124; Not integrated &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 51 | <code>&#124; Web agent &#124; WebArena &#124; Realistic, self-hosted web environments with functional-outcome scoring. &#124; Medium. AILIS has web/MCP, but PC desktop is higher priority. &#124; Not integrated &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>&#124; Terminal agent &#124; Terminal-Bench / TerminalWorld &#124; Evaluates real terminal tasks with verifiers, useful for CLI/code/file workflows. &#124; High for command-line execution layer. &#124; Not integrated &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>Recommended public-facing order:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>1. OSWorld small subset, then OSWorld `test_small`, eventually official full run.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>2. SWE-bench Lite small verified subset, then SWE-bench Pro if available.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>3. GAIA Level 1 Lite / official validation subset. Use Level 2/3 only after Hugging Face dataset permission is available.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>4. τ-bench for tool-user-policy interactions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>5. WebArena or Terminal-Bench as secondary specialization tracks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>### Tier 2: Internal Product Evals</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>&#124; Eval &#124; Role &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 65 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>&#124; AILIS Humanlike Eval &#124; Product regression for persona, memory, relationship stage, low tool feeling, multimodal consistency. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 67 | <code>&#124; Longitudinal Companionship Eval &#124; Internal long-term companion quality and failure analysis. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 68 | <code>&#124; AILIS Execution Benchmark &#124; Local harness regression for tools, approval, audit, transcript, command/session/code repair. &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>These can be shown, but label them as internal product-quality evals. They should not replace OSWorld/SWE-bench/GAIA/τ-bench-style public scores.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>### Humanlike Companion</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>&#124; Eval &#124; Scope &#124; Current Result &#124; Use In Demo? &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 75 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 76 | <code>&#124; AILIS Humanlike Dataset Validation &#124; 1000 scenario structure and coverage &#124; 1000 / 1000 valid, issue count 0 &#124; Yes, as dataset coverage &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 77 | <code>&#124; AILIS Humanlike Coverage Report &#124; 9 categories, 4 affinity buckets, negative probes &#124; 251 negative probes, balanced category and affinity coverage &#124; Yes, as evaluation design &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 78 | <code>&#124; Longitudinal Agent Eval &#124; 171 judged checkpoints from 30-day companion scenarios &#124; Avg weighted score 78.46, pass rate 61.4%, hard fails 16 &#124; Yes, as honest current product score &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 79 | <code>&#124; Tool-feel Smoke &#124; 6 judged checkpoints &#124; Avg weighted score 81.37, pass rate 83.3% &#124; Yes, but label as smoke &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>Key humanlike metric averages from the 171-checkpoint run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>&#124; Metric &#124; Score 1-5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 84 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 85 | <code>&#124; persona_consistency &#124; 4.21 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 86 | <code>&#124; naturalness &#124; 4.19 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 87 | <code>&#124; memory_usefulness &#124; 3.41 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 88 | <code>&#124; emotional_fit &#124; 4.21 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>&#124; multimodal_sync &#124; 3.57 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 90 | <code>&#124; low_tool_feeling &#124; 4.38 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 91 | <code>&#124; relationship_stage_fit &#124; 4.16 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 92 | <code>&#124; task_completion &#124; 3.84 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>Interpretation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>- Strong areas: low tool feeling, persona consistency, emotional fit, relationship-stage expression.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- Weak areas: research reading, GitHub task memory, document/script task handling, multimodal voice consistency.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- Demo should emphasize the strong areas, but engineering roadmap should openly name the weak areas.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>### Task Execution</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>&#124; Eval &#124; Scope &#124; Current Result &#124; Use In Demo? &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 103 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 104 | <code>&#124; AILIS Execution Benchmark &#124; Code repair, long process session, safety gates &#124; Passed all task groups; 17 audit entries; 36 transcript items &#124; Yes, primary local task demo &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 105 | <code>&#124; Computer Tool Smoke &#124; Windows computer actions, approval gate, OpenClaw tool-surface validation &#124; Passed &#124; Yes, infrastructure slide &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 106 | <code>&#124; Code Tool Smoke &#124; Code operation smoke &#124; Passed &#124; Yes, simple code demo &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 107 | <code>&#124; SWE-bench Execution Selftest &#124; Local tiny SWE-style harness selftest &#124; 1 / 1 verified &#124; Yes, as harness readiness, not public SWE-bench score &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 108 | <code>&#124; OSWorld PC Readiness &#124; Local environment and tool-surface readiness &#124; officialRunReady true; 15 / 15 required actions present &#124; Yes, as OSWorld readiness &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 109 | <code>&#124; OSWorld Small Historical Run &#124; 4 OSWorld tasks &#124; 2 / 4 success, average score 0.50 &#124; Yes, but label as small historical run &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 110 | <code>&#124; GAIA Level 1 Strict Rerun &#124; All 53 public validation questions, fixed commit and benchmark memory disabled &#124; Run 1: 41 / 53 (77.36%); Run 2 pending &#124; Provisional single-run result; not yet a reproducibility mean &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 111 | <code>&#124; GAIA Level 1 Historical Validation &#124; All 53 public validation questions, two fixed-commit historical runs &#124; Run 1: 43 / 53 (81.13%); Run 2: 48 / 53 (90.57%); mean: 85.85% &#124; Diagnostic only; task-level semantic-memory isolation was missing &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 112 | <code>&#124; GAIA Level 1 Lite Public &#124; 20 public-lite questions, submitted to public scorer &#124; 60% = 12 / 20 correct; 19 / 20 completed locally &#124; Historical comparison only &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 113 | <code>&#124; GAIA Level 1 Lite Smoke &#124; 3 public lite questions, no leaderboard submission &#124; 2 / 3 produced local final answers; official score null because not submitted &#124; No, keep as debug smoke &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>OSWorld small historical breakdown:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>&#124; Domain &#124; Tasks &#124; Average &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 118 | <code>&#124; --- &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 119 | <code>&#124; os &#124; 2 &#124; 0.50 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 120 | <code>&#124; vs_code &#124; 1 &#124; 1.00 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 121 | <code>&#124; multi_apps &#124; 1 &#124; 0.00 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>Interpretation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>- Current task layer is already good enough for deterministic local demos: code repair, file/process control, approval, audit, transcript.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>- OSWorld shows early but real PC-operation signal: 2/4 on a tiny subset. This should be presented as “early OSWorld small-run”, not official leaderboard performance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- Before claiming stronger PC-agent performance, run at least OSWorld `test_small` and a GAIA L1 subset under a fixed model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>## Recommended Simple Benchmark Set</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>### A. Humanlike Product Benchmark</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>Run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 136 | <code>pnpm eval:ailis-humanlike:validate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>pnpm eval:ailis-humanlike:report</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>pnpm test:ailis-humanlike-eval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>For real score after choosing model:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 144 | <code>pnpm eval:ailis-humanlike:longitudinal-agent:smoke</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>Target display:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>- Humanlike Eval: 1000 scenarios.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>- Longitudinal Eval: average score, pass rate, hard fail count.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>- Show category bars: emotional companionship, memory relationship, privacy approval, low tool feeling, multimodal voice.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>### B. Local Task Execution Benchmark</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>Run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 158 | <code>pnpm ailis:benchmark-execution</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>pnpm ailis:smoke-computer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>pnpm ailis:smoke-code</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>pnpm bench:swebench-lite:selftest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>Target display:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>- Code repair: fail test -&gt; patch -&gt; pass test.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- Long process: start -&gt; read -&gt; write stdin -&gt; exit.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- Safety: outside read blocked, exec needs approval, read-only write blocked.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- Transcript/audit: every tool call has evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>### C. OSWorld Mini Benchmark</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>Run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 176 | <code>pnpm bench:osworld:readiness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>pnpm bench:osworld:ailis:test-small:wsl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>Target display:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>- Readiness: 15/15 required computer actions present.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- Small run: success rate and per-domain failures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>- Do not claim official OSWorld score until the full official or verified route is run.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>### D. GAIA Level 1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>Current strict-memory-isolated rerun:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>&#124; Run &#124; Commit &#124; Correct &#124; Accuracy &#124; Protocol status &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 191 | <code>&#124; --- &#124; --- &#124; ---: &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 192 | <code>&#124; Strict Run 1 &#124; `6afc0ae` &#124; 41 / 53 &#124; **77.36%** &#124; Complete &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 193 | <code>&#124; Strict Run 2 &#124; `6afc0ae` &#124; pending &#124; pending &#124; Required before publishing a final mean and per-task stability &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>Strict Run 1 operational metrics:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>&#124; Metric &#124; Result &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 198 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 199 | <code>&#124; Visible correct &#124; 41 / 53 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 200 | <code>&#124; Answer mismatches &#124; 9 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 201 | <code>&#124; Timeouts &#124; 1 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 202 | <code>&#124; Runtime errors &#124; 2 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 203 | <code>&#124; Mean / P50 duration &#124; 248.3 s / 160.9 s &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 204 | <code>&#124; P90 / P95 duration &#124; 556.4 s / 854.4 s &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 205 | <code>&#124; Total / mean model tokens &#124; 7,947,896 / 149,960 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>Strict protocol:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>- GAIA 2023 Level 1 public validation split, the same fixed set of 53 tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- `memoryPolicy: disabled` on both the root request and delegated TaskAgent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>- Codex ChatGPT OAuth bridge with `gpt-5.5`, medium reasoning, 20 maximum agent steps, 360-second LLM timeout, and 600-second request timeout.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 212 | <code>- AILIS owns context assembly, tool execution, observations, orchestration, evidence, and the visible answer pipeline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 213 | <code>- Isolated workspace, fixed commit, no failed-task retry, no task replacement, and no score merging.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 214 | <code>- An unexpected Windows reboot interrupted Strict Run 1 after 46 completed result rows. Recovery reused the same run ID, skipped those 46 task IDs, and executed only the seven unfinished tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 215 | <code>- The 77.36% first-run score is provisional. It must not be averaged with the historical runs below.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>Historical fixed-commit full validation diagnostic:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>&lt;p align="center"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>  &lt;img alt="AILIS GAIA Level 1 validation results" src="assets/benchmarks/gaia-l1-validation-20260719.svg"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>&lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>&#124; Run &#124; Commit &#124; Correct &#124; Accuracy &#124; Runtime status &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 224 | <code>&#124; --- &#124; --- &#124; ---: &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 225 | <code>&#124; 1 &#124; `4f8f435` &#124; 43 / 53 &#124; 81.13% &#124; 52 completed, 1 timeout &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 226 | <code>&#124; 2 &#124; `4f8f435` &#124; 48 / 53 &#124; 90.57% &#124; 53 completed &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 227 | <code>&#124; Mean &#124; `4f8f435` &#124; 45.5 / 53 &#124; 85.85% &#124; arithmetic mean &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>Stability across the two runs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>&#124; Per-task outcome &#124; Tasks &#124; Share &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 232 | <code>&#124; --- &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 233 | <code>&#124; Correct in both runs &#124; 40 / 53 &#124; 75.47% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 234 | <code>&#124; Correct in one run &#124; 11 / 53 &#124; 20.75% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 235 | <code>&#124; Incorrect in both runs &#124; 2 / 53 &#124; 3.77% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 236 | <code>&#124; Same pass/fail outcome &#124; 42 / 53 &#124; 79.25% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>Protocol:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>- GAIA 2023 Level 1 public validation split, 53 tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 241 | <code>- Dataset SHA-256: `469f4c4b5fa532ac07e3d922bcbe709e663c9f9fc83edccf440cc3d44277f236`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 242 | <code>- Codex ChatGPT OAuth bridge with `gpt-5.5`, medium reasoning and temperature `0.2`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 243 | <code>- AILIS owns the harness, context, tools and answer pipeline; Codex is the model backend only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- Separate run IDs and isolated workspaces.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>- No resume, task retry, failed-task replacement or merged score.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- Repository deterministic desktop-real visible-answer scorer, not the official GAIA private scorer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>- Post-run audit: persistent semantic-memory retrieval was not disabled between tasks inside each run. The numbers below therefore cannot be treated as independent-run reproducibility evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>The official GAIA leaderboard currently accepts the 301-question private test split, including 93 Level 1 questions. Its documentation says that the paper reports averages over different runs when possible, but the leaderboard displays the best run. For the historical AILIS diagnostic:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>- Best observed historical run: **90.57%**.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>- Historical two-run arithmetic mean: **85.85%**.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>- Neither value is an official leaderboard submission because this run uses the public validation split and the local desktop-real scorer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>- Neither value is the current reproducibility score because strict task-level memory isolation was absent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>Official references:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>- [GAIA leaderboard policy](https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/content.py)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>- [GAIA leaderboard split sizes and scoring code](https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/app.py)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>- [AILIS desktop-real GAIA evaluation methodology](ailis-desktop-real-gaia-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>Best historical public-lite score:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 265 | <code>runId = full-20-r5-agent-repair-tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>questions = 20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>completed locally = 19/20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>submitted = true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>public scorer = 60% = 12/20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>report = eval-results/engineering/gaia-level1-lite-public/full-20-r5-agent-repair-tools.report.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>summary = eval-results/engineering/gaia-level1-lite-public/full-20-r5-agent-repair-tools.summary.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>Earlier submitted runs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>&#124; Run &#124; Submitted Score &#124; Correct &#124; Completed Locally &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 277 | <code>&#124; --- &#124; ---: &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 278 | <code>&#124; `full-20-r1-mcp` &#124; 30% &#124; 6 / 20 &#124; 8 / 20 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 279 | <code>&#124; `full-20-r2-tools-finalizer` &#124; 45% &#124; 9 / 20 &#124; 15 / 20 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 280 | <code>&#124; `full-20-r5-agent-repair-tools` &#124; 60% &#124; 12 / 20 &#124; 19 / 20 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>This remains useful historical evidence of the earlier public-lite submission path. The fixed-commit 53-task validation runs above are also historical diagnostics because task-level semantic-memory isolation was missing; neither result should be described as the current reproducibility score or an official private-test leaderboard score.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>Current smoke run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 287 | <code>runId = 2026-06-07T03-58-57-082Z</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>questions = 3</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>completed locally = 2/3</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>failed locally = 1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>submitted = false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 292 | <code>official score = null</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>report = eval-results/engineering/gaia-level1-lite-public/2026-06-07T03-58-57-082Z.report.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>Level 2 / Level 3 note:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 299 | <code>GAIA L2/L3 are not part of the current public scorecard because this machine/account does not have the required Hugging Face gated dataset access for those files.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>Run after model/key is stable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 305 | <code>node scripts/run-gaia-level1-lite.mjs --limit 5 --no-submit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>Then optionally submit if the answers look sane:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 311 | <code>node scripts/run-gaia-level1-lite.mjs --limit 20 --submit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>Target display:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>- Exact-answer accuracy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 317 | <code>- Tool usage examples: web search, file reading, spreadsheet/audio/image evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 318 | <code>- Always report base model and temperature.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>## How To Reduce Base Model Influence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>No benchmark can fully remove base model influence. Most serious agent systems handle it by making the model variable explicit and reporting controlled ablations.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>Recommended AILIS protocol:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>1. Fixed model run</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Use one model as the release gate, for example:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 331 | <code>model = doubao-seed-2-0-mini-260215</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>temperature = 0.2</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>max_steps = fixed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>tool profile = fixed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>Every public score must include model, provider, temperature, max steps, tool profile, date, and commit hash.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>2. Same-model ablation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>For each benchmark, run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>&#124; Variant &#124; Meaning &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 344 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 345 | <code>&#124; Base Model Only &#124; No AILIS tools, no memory, no runtime loop &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 346 | <code>&#124; Model + Tools &#124; Same model, direct tools, minimal loop &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 347 | <code>&#124; AILIS Runtime &#124; Same model, full Agent Loop, memory, approval, recovery &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 348 | <code>&#124; AILIS Runtime + Persona Surface &#124; Full product experience &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>The score to advertise as architecture contribution is not only raw score:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 353 | <code>AILIS lift = AILIS Runtime score - Base Model Only score</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 354 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>3. Multi-model robustness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>Run the same benchmark on at least:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>- low-cost mini model</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>- stronger reasoning model</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- one local/open model if practical</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>If AILIS only works on the strongest model, the demo is a model demo. If AILIS improves weak and strong models under the same harness, it is a product/runtime improvement.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>4. Deterministic final-state scoring first</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>For task execution, prefer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>- file exists / content exact match</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 371 | <code>- unit tests pass</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 372 | <code>- command exit code</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 373 | <code>- OSWorld result score</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 374 | <code>- SWE-bench resolved</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 375 | <code>- GAIA exact answer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>Use LLM-as-judge only when deterministic scoring is impossible.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>5. Judge separation for humanlike eval</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>For拟人化:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>- candidate model and judge model should be different.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 384 | <code>- judge prompt must use explicit rubric and anti-patterns.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>- sample some cases for human review.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 386 | <code>- keep raw candidate response, judge packet, judgment JSON, and summary JSON.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 387 | <code>- report hard fail count, not only average score.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>6. Paired comparison for product demos</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>When comparing AILIS vs plain chatbot:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>- same user prompts</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 394 | <code>- same base model</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 395 | <code>- hide system names from judge</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 396 | <code>- randomize order</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 397 | <code>- run both A/B and B/A to reduce position bias</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 398 | <code>- report win/tie/loss, not only absolute score</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>## Demo Video Script</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>### Scene 1: Persona and Memory</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>Goal: show AILIS is not a normal chatbot.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>Script:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>1. User says they are tired after debugging.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>2. AILIS responds with soft persona, remembers user dislikes tool-log-style explanations.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>3. AILIS uses expression/action/voice naturally.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>4. Overlay score: Humanlike longitudinal score 78.46, low_tool_feeling 4.38/5.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>### Scene 2: Multimodal Desktop Presence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>Goal: show character frontend.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>Script:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>1. Ask AILIS to smile, think, dance briefly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 420 | <code>2. Show avatar expression, motion, speech bubble, TTS.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 421 | <code>3. Mention this is product UX, not benchmark.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>### Scene 3: Task Execution Code Repair</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>Goal: show deterministic task ability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>Script:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>1. Create or open a tiny failing Node project.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 430 | <code>2. AILIS runs tests, sees failure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 431 | <code>3. AILIS edits code and reruns tests.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>4. Overlay: AILIS Execution Benchmark passed, SWE-style selftest 1/1 verified.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>### Scene 4: Desktop Computer Control</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>Goal: show PC operation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 438 | <code>Script:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>1. AILIS creates files in a folder, reads them, organizes them.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 441 | <code>2. AILIS asks approval before shell execution or risky write.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 442 | <code>3. Show audit/transcript evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>4. Overlay: computer smoke passed, OSWorld actions 15/15 present.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>### Scene 5: OSWorld Early Signal</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>Goal: show honest external benchmark trajectory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>Script:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>1. Show OSWorld readiness report.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 452 | <code>2. Show historical small-run: 2/4, avg 0.50.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 453 | <code>3. Say this is early PC-operation benchmark, not official leaderboard.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>### Scene 6: Roadmap</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 457 | <code>Goal: end with credibility.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>Show:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>- Short term: GAIA L1 Lite and OSWorld test_small.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 462 | <code>- Medium term: full OSWorld route and SWE-bench Lite subset.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 463 | <code>- Long term: same-model ablation scorecard for every release.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>## What Not To Claim Yet</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>Avoid these claims for now:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>- “AILIS has official OSWorld score.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 470 | <code>- “AILIS beats Codex/Claude/Operator.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 471 | <code>- “AILIS benchmark scores are model-independent.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 472 | <code>- “Humanlike score proves users will prefer it.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 473 | <code>- “SWE-bench score” based only on local selftest.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>Safe claims:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>- “AILIS has a 1000-scenario humanlike eval set with balanced coverage.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 478 | <code>- “AILIS scored 78.46 average on an internal 171-checkpoint longitudinal companion eval.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 479 | <code>- “AILIS passed local deterministic task-execution benchmarks covering code repair, process control, safety gates, transcript and audit.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 480 | <code>- “AILIS is OSWorld-ready locally, with 15/15 required computer actions present.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 481 | <code>- “AILIS has an early OSWorld small-run result of 2/4, avg 0.50, used for debugging rather than leaderboard claims.”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
