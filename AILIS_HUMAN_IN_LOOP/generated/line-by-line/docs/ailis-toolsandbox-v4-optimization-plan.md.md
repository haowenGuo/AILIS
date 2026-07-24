# docs/ailis-toolsandbox-v4-optimization-plan.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：956
- SHA-256：`cca3e4b720f1646be63536e24a6aa733367174102b1f4eeb7f8da69bbff55bca`
- 可运行副本：[打开源文件](../../../source/docs/ailis-toolsandbox-v4-optimization-plan.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Apple ToolSandbox V4 Optimization Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Last updated: 2026-07-20</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 1. Objective</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>V4 should improve AILIS task quality without weakening authenticity, model</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>autonomy, or no-regression evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>The primary engineering goals are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>1. Stop forcing tool execution when the model can answer directly or must</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>   surface an information gap.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>2. Improve exact-match tool argument grounding without app-side answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>   rewriting or scenario-specific rules.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>3. Preserve the strong state-dependency and multi-tool behavior already</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>   demonstrated by V3.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>4. Reduce model calls, tokens, and wall-clock duration after quality gates</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>   pass.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>5. Establish a new evidence protocol that cannot mislabel already-seen</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>   ToolSandbox scenarios as unseen generalization.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>This is an implementation plan, not a new benchmark result.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>## 2. Frozen Evidence Baseline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>The immutable V3 evidence remains the historical comparison point. V4 must</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>never rewrite, pool into, or replace these artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>### 2.1 Unseen holdout V3</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>&#124; Metric &#124; Frozen value &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 33 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 34 | <code>&#124; Validation ID &#124; `holdout-v3-20260719-01` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 35 | <code>&#124; Processed / officially scored &#124; 239 / 239 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 36 | <code>&#124; Errors &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 37 | <code>&#124; Valid-only mean &#124; 0.7150834063502134 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 38 | <code>&#124; Errors-as-zero mean &#124; 0.7150834063502134 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 39 | <code>&#124; Perfect / zero &#124; 91 / 45 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 40 | <code>&#124; AILIS + user-simulator calls &#124; 2,602 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 41 | <code>&#124; AILIS + user-simulator tokens &#124; 22,053,949 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 42 | <code>&#124; Official interaction turns &#124; 2,259 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 43 | <code>&#124; Summed duration &#124; 44,179,549 ms &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>The per-scenario resource baseline is approximately 10.89 LLM calls, 92,276</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>tokens, and 3.08 minutes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>The V3 source fingerprint is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>`786152E8F4D5C63DEAEEF8BC80AE0B04AF0617ECA89CFCCE8E4B46F0E340CFDD`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>Its source-mtime fingerprint is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>`BF3891C4F3292501B68F38366CC4A3598745FCF5EB2E983F37628030C4C2DA80`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>These fingerprints are historical and must not be reused after source changes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>### 2.2 Targeted recovery</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>The fixed failure cohort produced 155 valid official scores, zero errors, zero</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>zeros, a mean of 0.8149472303285492, and 43 perfect scores.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>This result is selection-conditioned targeted recovery. It is useful for</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>diagnosis and repair verification, but it is not an unbiased registry or</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>generalization estimate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>### 2.3 Stability V1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>&#124; Metric &#124; Frozen value &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 67 | <code>&#124; Deterministic sample &#124; 64 / 64 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 68 | <code>&#124; Errors &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 69 | <code>&#124; Frozen baseline mean &#124; 0.7501482793003078 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 70 | <code>&#124; New mean &#124; 0.8830792571853442 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 71 | <code>&#124; Paired mean delta &#124; +0.13293097788503622 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 72 | <code>&#124; Bootstrap 95% interval &#124; [+0.04862654881339136, +0.21628423839623379] &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 73 | <code>&#124; Improved / unchanged / regressed &#124; 29 / 22 / 13 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 74 | <code>&#124; Severe regressions &#124; 2 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>The low and medium baseline bands improved strongly, while the high and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>perfect bands regressed by -0.0804301713932947 and -0.13892719478723164.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>V4 therefore needs to improve weak cases while protecting already-strong</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>behavior.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>### 2.4 Current quality interpretation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>The frozen 0.7151 holdout mean represents solid but uneven task quality. It</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>shows broad real capability, especially on state dependency and multi-tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>work, but 45 zero-score cases and two severe stability regressions prevent a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>high-reliability production claim.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>The score distribution is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>&#124; Score band &#124; Count &#124; Share &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 91 | <code>&#124; --- &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 92 | <code>&#124; Perfect, 1.0 &#124; 91 &#124; 38.1% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 93 | <code>&#124; High but imperfect, [0.75, 1.0) &#124; 57 &#124; 23.8% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 94 | <code>&#124; Medium, (0.50, 0.75) &#124; 28 &#124; 11.7% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 95 | <code>&#124; Half score, (0.25, 0.50] &#124; 18 &#124; 7.5% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 96 | <code>&#124; Hard zero &#124; 45 &#124; 18.8% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>The nonzero rate is 194/239, or 81.2%, but that is not a task success rate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>ToolSandbox similarity is continuous and a nonzero trajectory can still miss</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>important milestones. The better quality label is **strong research</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>prototype / pre-production agent**, not production-grade high reliability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>The 0.8831 stability mean is encouraging no-material-regression evidence on a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>selected paired sample. It is not the product-wide success rate and must not</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>replace the 0.7151 holdout estimate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>### 2.5 Official paper reference, not an eligible leaderboard rank</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>The official project does not expose a continuously updated public submission</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>leaderboard. The authoritative ranking reference is the fixed model table in</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>the [ToolSandbox paper, Table 5](https://arxiv.org/html/2408.04682#S4), with</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>the [official repository](https://github.com/apple/ToolSandbox) providing the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>runner and result-comparison notebooks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>&#124; Paper order &#124; Agent in official paper &#124; Full-suite average &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 116 | <code>&#124; ---: &#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 117 | <code>&#124; 1 &#124; GPT-4o-2024-05-13 &#124; 73.0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 118 | <code>&#124; 2 &#124; Claude-3-Opus-20240229 &#124; 69.2 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 119 | <code>&#124; 3 &#124; GPT-3.5-Turbo-0125 &#124; 65.6 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 120 | <code>&#124; 4 &#124; GPT-4-0125-Preview &#124; 64.3 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 121 | <code>&#124; 5 &#124; Claude-3-Sonnet-20240229 &#124; 63.8 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 122 | <code>&#124; 6 &#124; Gemini-1.5-Pro-001 &#124; 60.4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 123 | <code>&#124; 7 &#124; Claude-3-Haiku-20240307 &#124; 54.9 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 124 | <code>&#124; Reference only &#124; AILIS V3 holdout &#124; 71.5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>AILIS is numerically 1.5 points below the paper's GPT-4o row and 2.3 points</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>above its Claude-3-Opus row. It is **not valid to place AILIS second on that</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>leaderboard**, because the protocols differ:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>- The paper row covers all 1,032 scenarios; V3 covers a frozen 239-scenario</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>  non-RapidAPI holdout.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>- The official repository requires `RAPID_API_KEY` for its API-backed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>  scenarios. V3 permanently excludes those 304 scenarios.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>- V3 is heavily skewed toward `INSUFFICIENT_INFORMATION`: 126/239, or 52.7%,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>  versus 224/1,032, or 21.7%, in the paper's full suite.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>- The agent wrapper, prompt, user-simulator model, and model version differ.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- AILIS is a multi-layer agent system, while the paper table is intended as a</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>  model comparison under a shared minimalist prompt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>The honest positioning is: **numerically near the top proprietary-model</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>reference band on a differently skewed subset, with no official rank claim**.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>### 2.6 Directional category comparison</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>Category comparisons use the same 0-100 similarity scale but remain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>descriptive because the scenario populations differ.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>&#124; Category &#124; AILIS V3 &#124; GPT-4o paper &#124; Difference &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 149 | <code>&#124; --- &#124; ---: &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 150 | <code>&#124; Multiple Tool Call &#124; 83.4 &#124; 80.1 &#124; +3.3 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 151 | <code>&#124; Multiple User Turn &#124; 83.4 &#124; 74.7 &#124; +8.7 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 152 | <code>&#124; State Dependency &#124; 93.4 &#124; 84.0 &#124; +9.4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 153 | <code>&#124; Canonicalization &#124; 83.1 &#124; 76.6 &#124; +6.5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 154 | <code>&#124; Insufficient Information &#124; 60.9 &#124; 42.0 &#124; +18.9 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 155 | <code>&#124; Three Distraction Tools &#124; 71.0 &#124; 75.0 &#124; -4.0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 156 | <code>&#124; Ten Distraction Tools &#124; 70.2 &#124; 74.6 &#124; -4.4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 157 | <code>&#124; All Tools Available &#124; 75.2 &#124; 72.6 &#124; +2.6 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 158 | <code>&#124; Tool Name Scrambled &#124; 70.0 &#124; 72.4 &#124; -2.4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 159 | <code>&#124; Tool Description Scrambled &#124; 66.6 &#124; 69.3 &#124; -2.7 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 160 | <code>&#124; Argument Description Scrambled &#124; 70.0 &#124; 73.0 &#124; -3.0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 161 | <code>&#124; Argument Type Scrambled &#124; 73.7 &#124; 71.9 &#124; +1.8 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>The useful signal is not a rank. AILIS is already strong on multi-step state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>reasoning, while distractor resistance and lossy schema descriptions are the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>clearest robustness gaps.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>## 3. Non-Negotiable Evaluation Boundaries</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>1. The formal ToolSandbox target remains 728 non-RapidAPI scenarios.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>2. The 304 RapidAPI scenarios remain `excluded_environment`; they are never</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>   called, paid for, or counted.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>3. V1 and V2 attempts remain isolated history. Cross-drift and post-drift V2</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>   results remain quarantined.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>4. Raw completed counts, raw intermediate means, latest-attempt projections,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>   retries, and targeted cohorts must not be reported as unbiased improvement.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>5. All 728 offline scenarios have now been observed. No V4 replay of those</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>   scenarios may be called a new unseen holdout.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>6. A new unseen-generalization claim requires a genuinely external or newly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>   released scenario set that is frozen before any V4 result is observed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>7. AILIS and the official on-policy user simulator must use the declared</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>   provider/model only. No fallback, mock result, expected-answer injection,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>   evaluator feedback, answer post-processing, or scenario-name branch is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>   allowed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>8. The model remains the semantic decision-maker. Deterministic code may</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>   validate schemas, lifecycle, permissions, budgets, evidence references,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>   and contracts, but must not decide task meaning by keyword, regex, scenario</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>   name, or answer rewrite.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>9. Every primary phase uses one immutable first attempt per scenario. Errors</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>   remain in the primary report and count as zero before any retry batch is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>   created.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>## 4. Evidence-Backed Failure Diagnosis</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>### 4.1 Catastrophic minefield cohort: 45 hard zeros</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>Every zero has the same evaluator shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>- `milestoneSimilarity = 1.0`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- `minefieldSimilarity = 1.0`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- final similarity = 0</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>The model satisfied the positive objective, then an unnecessary or</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>unsupported tool call destroyed the whole score. This exactly matches the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>paper's minefield definition and its timestamp example: an unavailable fact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>must lead to a limitation response, not a fabricated argument.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>The 45 zeros divide into two mechanisms:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>&#124; Root family &#124; Count &#124; Share of zeros &#124; Observed failure &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 210 | <code>&#124; --- &#124; ---: &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 211 | <code>&#124; Missing temporal observation &#124; 42 &#124; 93.3% &#124; Fabricated or ambient-clock-derived time was passed into holiday/reminder tools &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 212 | <code>&#124; Missing identity/capability &#124; 3 &#124; 6.7% &#124; Message history was treated as a contact directory and a phone identity was inferred &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>The temporal failures contain 14 holiday-difference scenarios and 28</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>reminder recency/creation/modification scenarios. Ten holiday trajectories</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>share the sequence `search_holiday -&gt; datetime_info_to_timestamp -&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>timestamp_diff`; reminder failures similarly construct timestamps without an</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>official current-time observation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>The identity failures appear only when distractors make `search_messages`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>available. One trajectory searched messages for a name, inferred the wrong</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>person-to-phone relationship from sender/recipient fields, enabled cellular,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>and sent the message. The issue is not missing tool syntax; it is unsupported</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>identity provenance.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>Four system mechanisms reinforce this behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>1. The ToolSandbox bridge sets both `requireTaskExecution: true` and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>   `requireExecutionEvidence: true` for every scenario.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>2. The persona is forced through `handoff_task`, and a no-work-tool final is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>   treated as incomplete.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>3. The model-visible `runtime_environment` exposes an authoritative host</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>   clock even when the official scenario intentionally withholds the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>   `get_current_timestamp` capability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>4. A representative model-input transcript has persistent memory enabled and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 236 | <code>   exposes the benchmark scenario name through its workspace/project path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>V4 must fix the protocol across the whole ToolSandbox adapter. It must not</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>detect scenario names or selectively hide information after recognizing a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>task.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>### 4.2 Half-score cohort: 18 deterministic semantic misses</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>All 18 low nonzero records score exactly 0.5 and have no minefield violation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 245 | <code>They split cleanly:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>&#124; Root family &#124; Count &#124; Failure &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 248 | <code>&#124; --- &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 249 | <code>&#124; Relative weekday canonicalization &#124; 14 &#124; "Next Friday" was mapped to 2026-07-24 instead of the nearest upcoming Friday, 2026-07-17 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 250 | <code>&#124; Missing reminder content &#124; 4 &#124; The model inserted generic content `"reminder"` instead of asking what the reminder was for &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>The first family observed the official current timestamp but made the wrong</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>semantic choice. The second had a valid date and time but invented a required</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 254 | <code>task argument. Both need model-owned semantic decisions with explicit</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 255 | <code>provenance, not a runtime date parser or a hidden placeholder rewrite.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>The paper independently identifies time canonicalization, hallucinated</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>timestamps, and premature decisions under ambiguity as common failure modes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>### 4.3 Medium-score cohort: 28 incomplete trajectories</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>The 28 scores in `(0.50, 0.75)` cluster into four families:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>&#124; Root family &#124; Count &#124; Main gap &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 265 | <code>&#124; --- &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 266 | <code>&#124; Remove contact with removal capability withheld &#124; 14 &#124; Tried invalid mutation workarounds, then produced a verbose partial-match limitation response &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 267 | <code>&#124; Relationship update &#124; 7 &#124; Used plural surface forms such as `friends`/`enemies` instead of grounded canonical values &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 268 | <code>&#124; Message-recency contact update &#124; 6 &#124; Skipped the current-time milestone and did not ground the final person's name &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 269 | <code>&#124; Repeated relationship update &#124; 1 &#124; Partial exact-match and response-completeness loss &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>These are not random one-off misses. They map to three reusable capabilities:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>capability recognition before mutation, exact argument grounding, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>evidence-complete final responses.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>### 4.4 Stability regressions</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>The 64-scenario stability sample improved overall, but 13 scenarios regressed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>The two severe cases are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>1. `find_days_till_holiday_insufficient_information_alt`: 1.0 to 0.0 from</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>   forced execution and a minefield call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 282 | <code>2. `update_contact_relationship_with_relationship_alt_all_tools`: 1.0 to 0.5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>   from plural categorical arguments.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>The remaining larger regressions concentrate in message-recency selection,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>contact mutation, and state-recovery completion. Three message-search cases</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>dropped to 0.5 or 0.3333; two send-message cases dropped to 0.75 after</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>recovering cellular state; one contact update dropped to 0.5. V4 therefore</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>must protect already-correct high/perfect behavior, not only recover the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>holdout zeros.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>### 4.5 Exact-match categorical argument drift</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>The current prompt correctly warns against invented values, but its blanket</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>first-lookup literal-preservation rule conflicts with categorical</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>normalization when a tool schema exposes no enum. For example, the user phrase</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>"friends" is useful natural language but the official tool trace expects the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>stored value `friend`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>This is a generic schema-grounding problem. Production code must not contain a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>special case for `friend`, `friends`, contact tools, or any scenario ID.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>### 4.6 Cost amplification</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>Forced persona handoff, mandatory execution evidence, repeated tool schemas,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>and unnecessary work-tool calls amplify cost. V3 averaged 10.89 LLM calls,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>92,276 tokens, and 3.08 minutes per holdout scenario.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>The 239 records contain 592 official tool calls, or 2.48 per scenario, but 657</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>internal `handoff_task` calls, or 2.75 per scenario. The primary efficiency</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>opportunity is therefore orchestration overhead, not indiscriminately</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>removing useful official tool calls.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>Cost optimization is secondary to quality. A cheaper run that increases</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>errors, zeros, or high-band regressions does not pass V4.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>### 4.7 Optimization priority and expected leverage</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>&#124; Priority &#124; Mechanism &#124; Directly affected evidence &#124; Why first &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 320 | <code>&#124; --- &#124; --- &#124; ---: &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 321 | <code>&#124; P0 &#124; Model-owned outcome plus official epistemic boundary &#124; 45 hard zeros + 1 severe regression &#124; Removes catastrophic all-or-nothing failures &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 322 | <code>&#124; P1 &#124; Temporal, missing-field, and identity provenance &#124; 18 half scores + 42 temporal zeros + 3 identity zeros &#124; Largest concentrated quality headroom &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 323 | <code>&#124; P1 &#124; Exact categorical grounding &#124; 7 medium scores + 2 relationship regressions &#124; Restores exact-match behavior without answer rewriting &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 324 | <code>&#124; P2 &#124; Recency evidence and completion grounding &#124; 6 medium scores + 4 recency regressions &#124; Protects high/perfect multi-step behavior &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 325 | <code>&#124; P2 &#124; Capability-aware blocked responses &#124; 14 medium scores &#124; Avoids invalid mutation probes and improves concise completion &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 326 | <code>&#124; P3 &#124; Handoff/context efficiency &#124; 657 internal handoffs &#124; Reduces cost only after quality gates pass &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>If all 45 hard zeros merely rose to 0.80 while every other score stayed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>unchanged, the holdout projection would rise from 0.7151 to approximately</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>0.8657. This is a headroom calculation, not a forecast: those scenarios are</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>already seen, and any replay is targeted evidence only.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>## 5. Target Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>### 5.1 Model-owned execution outcome</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>Replace the benchmark-wide mandatory execution flags with a model-owned</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>execution outcome contract:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 341 | <code>outcome</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>  direct_answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>  clarification_needed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>  executed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>  blocked</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>answer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>evidence_refs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>missing_fields</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>public_reason</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 351 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>`public_reason` is a short auditable summary, not hidden chain of thought.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>The model decides the outcome:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>- `direct_answer` when visible evidence is already sufficient.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 358 | <code>- `clarification_needed` when a required user field is absent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- `executed` when external state, retrieval, calculation, or mutation was</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>  actually performed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>- `blocked` when a required capability or environment is unavailable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>The harness validates structure rather than meaning:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>- `executed` requires at least one successful task-advancing tool result and a</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 366 | <code>  successful latest execution step.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>- `direct_answer` and `clarification_needed` do not require a synthetic tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 368 | <code>  call.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>- `blocked` requires a concrete missing field, capability, permission, or</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 370 | <code>  environment reason.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>- The runtime never upgrades or downgrades the model's outcome based on text</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 372 | <code>  matching.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>### 5.2 Model-owned argument grounding</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>Each tool argument should have trace-side provenance selected by the model:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 379 | <code>user_literal</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 380 | <code>schema_enum</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 381 | <code>prior_observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 382 | <code>model_semantic_normalization</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 385 | <code>The provenance is stored outside official tool arguments and is never passed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 386 | <code>to ToolSandbox tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>For exact-match categorical fields with no enum, the model chooses among:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 390 | <code>1. Use the user value when it is already the contract value.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 391 | <code>2. Perform a non-mutating discovery call and ground the later exact value in</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 392 | <code>   the returned records.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>3. Apply a semantic normalization and record that provenance.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>4. Omit the unsafe optional filter or request clarification.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>The runtime validates declared schema types, enums, required fields, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>additional-property rules. It never singularizes, pluralizes, canonicalizes,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>or rewrites a value behind the model's back.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>### 5.3 Clean benchmark context</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>Each scenario must have:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>- A unique session ID.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 405 | <code>- `messageHistory` containing only official in-scenario conversation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 406 | <code>- `memoryPolicy: disabled` for persistent user/persona memory.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 407 | <code>- A clean TaskAgent context at scenario start.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 408 | <code>- In-scenario TaskAgent checkpoints retained only for official multi-turn</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 409 | <code>  continuity.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>- Scenario IDs, benchmark labels, evaluator state, expected answers, and</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 411 | <code>  similarities absent from model-visible prompt payloads.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>- Workspace and memory paths replaced by opaque model-visible handles so a</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 413 | <code>  scenario name cannot leak through a filesystem path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 414 | <code>- Scenario IDs retained out of band for artifact paths, tracing, and official</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 415 | <code>  score joins.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 416 | <code>- The host/benchmark clock retained for deterministic runner bookkeeping but</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 417 | <code>  omitted from the model-visible ToolSandbox context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>- Time becoming model-visible only through an official user message, system</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 419 | <code>  message, or official tool result.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>This hardening does not alter the frozen official V3 scores. However, the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>newly observed clock and scenario-path exposure must be disclosed as a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 423 | <code>comparability and clean-room audit limitation. V4 removes that exposure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>prospectively and makes the protocol easier to audit and reproduce.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>Clock visibility is a suite-level adapter rule, not a task classifier. The</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 427 | <code>adapter must not inspect scenario categories, tool names, or user wording to</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>decide whether to expose the clock.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>### 5.4 Model-owned epistemic and capability state</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>Before execution, the model may emit a compact public decision record:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 435 | <code>required_facts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>  field</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>  status: known &#124; missing &#124; ambiguous</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 438 | <code>  source_ref</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>required_capabilities</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 441 | <code>  capability</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 442 | <code>  status: available &#124; unavailable &#124; uncertain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>  source_ref</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>selected_outcome</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>public_reason</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>The harness checks only structural facts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>- Referenced observations exist.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 452 | <code>- A `known` field has a source reference.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- An `executed` mutation has successful execution evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>- A `blocked` or `clarification_needed` outcome names the missing fact or</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>  capability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 457 | <code>The harness does not infer which facts a task needs, map identities, interpret</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>relative dates, or choose a tool. Those remain model decisions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>## 6. Implementation Workstreams</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>### Workstream A: Execution decision contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>Candidate files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 466 | <code>- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 467 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 468 | <code>- `electron/ailis-task-agent-harness.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 469 | <code>- `electron/ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 470 | <code>- `electron/ailis-turn-context.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>Changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>1. Stop setting blanket mandatory-execution flags in the ToolSandbox bridge.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 475 | <code>2. Add an explicit `executionPolicy: model_decides` protocol field.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 476 | <code>3. Keep persona tool choice on `auto`; do not force `handoff_task`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 477 | <code>4. Add the structured outcome to TaskAgent finalization and handoff packets.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 478 | <code>5. Apply execution-evidence validation only when the model selects</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 479 | <code>   `executed`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 480 | <code>6. Record the selected outcome and evidence references in runtime artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>7. Preserve existing safety, approval, budget, interruption, and latest-step</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 482 | <code>   failure gates.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>Acceptance tests:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>- A model-selected direct answer completes without a work-tool call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 487 | <code>- A model-selected clarification completes with explicit missing fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 488 | <code>- A model-selected execution cannot claim completion without successful work</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 489 | <code>  evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 490 | <code>- A failed latest mutation remains incomplete.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 491 | <code>- Persona handoff remains available and succeeds for real stateful tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 492 | <code>- No deterministic task classifier is introduced.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>### Workstream B: Exact-match argument grounding</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 496 | <code>Candidate files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 499 | <code>- `electron/ailis-model-input-builder.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 500 | <code>- `electron/ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 501 | <code>- `electron/ailis-tool-routing.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 502 | <code>- `electron/ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>Changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>1. Preserve required fields, enum values, descriptions, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>   `additionalProperties` through model-facing schema conversion.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>2. Audit schema compaction for lossy enum or description truncation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 509 | <code>3. Replace blanket first-lookup literal preservation with a semantic</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 510 | <code>   grounding instruction for exact-match categorical fields.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>4. Add trace-side argument provenance without adding fields to official tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 512 | <code>   calls.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>5. Let the model use a non-mutating discovery call when a canonical value is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>   not exposed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>6. Return rejected calls as authoritative schema observations and retain the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>   existing no-identical-retry guard.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>Acceptance tests:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>- Enum-backed values are passed exactly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 521 | <code>- Values returned by prior observations can be reused exactly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 522 | <code>- Surface-form and canonical-form fixture pairs are resolved by model choice,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 523 | <code>  not runtime rewriting.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>- Scrambled tool names, argument descriptions, and argument types remain</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 525 | <code>  routable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 526 | <code>- Production source contains no benchmark scenario IDs or fixture value</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 527 | <code>  branches.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 529 | <code>### Workstream C: Epistemic, identity, and temporal provenance</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 531 | <code>Candidate files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 534 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 535 | <code>- `electron/ailis-model-input-builder.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 536 | <code>- `electron/ailis-task-agent-harness.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>Changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>1. Remove the model-visible host clock for every ToolSandbox scenario while</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 541 | <code>   keeping it trace-side for deterministic runner timestamps.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 542 | <code>2. Add the model-owned epistemic/capability decision record.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 543 | <code>3. Attach source references to identity, current-time, relative-time, and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>   mutation arguments.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 545 | <code>4. Let the model block or clarify when a required fact or capability is</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 546 | <code>   absent.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>5. Treat message sender/recipient fields as observations, not automatic</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 548 | <code>   person-name-to-phone bindings.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 549 | <code>6. Add synthetic fixtures for unavailable time, ambiguous weekdays, missing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 550 | <code>   reminder content, and uncertain identity.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 551 | <code>7. Keep all semantic selection in the model; validators check only references</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 552 | <code>   and contracts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 554 | <code>Acceptance tests:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>- No ToolSandbox model input contains the host clock.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 557 | <code>- A model can use an official `get_current_timestamp` result as provenance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 558 | <code>- A missing current-time capability can end as `blocked` without a tool call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 559 | <code>- A required missing reminder field can end as `clarification_needed`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 560 | <code>- An identity cannot be marked grounded to an observation that does not</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 561 | <code>  expose the cited identifier.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 562 | <code>- No test relies on a production keyword, scenario name, or fixed date.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>### Workstream D: Benchmark isolation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 565 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 566 | <code>Candidate files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>- `scripts/toolsandbox/ailis-toolsandbox-bridge.mjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 569 | <code>- `scripts/toolsandbox/run_ailis_toolsandbox.py`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 570 | <code>- `electron/ailis-turn-context.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 571 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>Changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>1. Set `memoryPolicy: disabled` explicitly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 576 | <code>2. Assert one unique session and one clean TaskAgent root per scenario.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 577 | <code>3. Preserve official multi-turn state only inside that scenario.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 578 | <code>4. Split model-visible context from trace-only evaluation metadata.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>5. Add a prompt-snapshot audit that rejects scenario name, expected answer,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 580 | <code>   evaluator result, similarity, and post-score feedback exposure.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 581 | <code>6. Keep RapidAPI exclusion before agent and user-simulator execution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 583 | <code>### Workstream E: Context and cost efficiency</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 585 | <code>Candidate files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>- `electron/ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 588 | <code>- `electron/ailis-model-input-builder.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 589 | <code>- `electron/ailis-context-manager.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 590 | <code>- `electron/ailis-context-compiler.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 591 | <code>- `electron/codex-model-bridge.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>Changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 595 | <code>1. Avoid persona-to-TaskAgent handoff when the model chooses a direct outcome.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 596 | <code>2. Audit whether tool schemas are duplicated in both the context package and</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>   provider tool payload; remove only confirmed duplication.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>3. Keep all official tools required by the scenario visible. Do not hide tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 599 | <code>   to manufacture a higher score.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>4. Cache invariant tool schemas where the provider supports prompt caching.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 601 | <code>5. Stop work as soon as model-audited evidence is sufficient.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 602 | <code>6. Use parallel calls only for independent reads; preserve ordering for state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 603 | <code>   dependencies and mutations.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 604 | <code>7. Keep full observations in artifacts and send compact evidence references</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 605 | <code>   back to the model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 607 | <code>### Workstream F: Observability</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 608 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 609 | <code>Add per-turn and per-scenario fields:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 612 | <code>model_selected_outcome</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 613 | <code>outcome_source</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 614 | <code>handoff_used</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 615 | <code>official_tool_calls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 616 | <code>internal_tool_calls</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 617 | <code>successful_work_steps</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 618 | <code>evidence_refs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 619 | <code>missing_fields</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 620 | <code>argument_provenance</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 621 | <code>required_fact_status</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 622 | <code>required_capability_status</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 623 | <code>clock_visibility</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 624 | <code>prompt_schema_bytes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>prompt_context_bytes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>ailis_calls_and_tokens</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 627 | <code>user_simulator_calls_and_tokens</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 628 | <code>duration_ms</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 629 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>Do not store hidden reasoning. Store only structured decisions, public</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 632 | <code>summaries, tool arguments, observations, references, and provider usage.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>## 7. Implementation Batches</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 636 | <code>### V4.0: Protocol hardening</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>Deliver:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 640 | <code>- Clean memory-disabled benchmark sessions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 641 | <code>- Model-visible versus trace-only metadata separation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 642 | <code>- Suite-wide removal of the model-visible host clock.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 643 | <code>- Prompt leakage audit.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 644 | <code>- New source-file and mtime fingerprint tooling.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>Exit gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 647 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 648 | <code>- Existing deterministic tests pass.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 649 | <code>- Official ToolSandbox routing tests pass.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 650 | <code>- Prompt snapshots contain no host clock or evaluation-only fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 651 | <code>- RapidAPI exclusion remains before execution.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>### V4.1: Model-owned execution outcome</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>Deliver:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>- `executionPolicy: model_decides`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 658 | <code>- Structured final outcome.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 659 | <code>- Conditional execution-evidence gate.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 660 | <code>- Model-owned required-fact and capability status.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 661 | <code>- Direct-answer and clarification tests.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 663 | <code>Exit gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>- The locked 45-scenario minefield cohort has no unsupported execution.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 666 | <code>- Real state mutation tests still require and record successful execution.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 667 | <code>- No new severe regression appears in the two locked sentinels.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>### V4.2: Argument and temporal grounding</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 671 | <code>Deliver:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>- Lossless schema path for required/enum/exact-match information.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 674 | <code>- Trace-side argument provenance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 675 | <code>- Generic categorical grounding fixtures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 676 | <code>- Read-only discovery strategy for absent value domains.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 677 | <code>- Current-time provenance and relative-time candidate records.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 678 | <code>- Clarification behavior for missing required semantic fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>Exit gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 682 | <code>- Exact-match fixtures pass without runtime rewriting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 683 | <code>- Scrambled-schema routing remains non-inferior.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 684 | <code>- The locked relationship regression sentinel returns to a full score in the</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 685 | <code>  targeted diagnostic phase.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>- The locked 18 half-score cohort has no result below 0.75.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 687 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 688 | <code>### V4.3: Recency and completion no-regression</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 690 | <code>Deliver:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 691 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 692 | <code>- Evidence-complete recency selection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 693 | <code>- Entity-name grounding for user-facing completion responses.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 694 | <code>- Sequential state-recovery completion checks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 695 | <code>- A locked replay of all 13 Stability V1 regressions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>Exit gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 699 | <code>- No severe regression remains in the 13-scenario sentinel cohort.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 700 | <code>- No sentinel is more than 0.10 below its frozen baseline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 701 | <code>- Full 64-scenario stability gates pass before expansion.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 703 | <code>### V4.4: Efficiency</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 704 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 705 | <code>Deliver:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 707 | <code>- Removed confirmed prompt/schema duplication.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 708 | <code>- Reduced unnecessary handoffs and tool rounds.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 709 | <code>- Paired cost report on a frozen scenario cohort.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>Exit gate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>- All quality and stability gates still pass.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 714 | <code>- Resource targets in Section 9 are met or the remaining gap is documented.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>## 8. Validation Protocol</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>### Phase 0: Static and deterministic gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>Before any paid or long official run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>1. Run syntax, Python compile, unit, gateway, routing, and diff checks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>2. Scan production source for every frozen diagnostic and future holdout</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>   scenario name.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>3. Audit model inputs for expected answers, evaluator outputs, similarities,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>   scenario IDs, and benchmark-only metadata.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>4. Verify provider/model pinning and absence of fallback.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>5. Verify memory isolation and unique scenario sessions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>6. Compute and freeze the complete V4 source and source-mtime fingerprints.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>Any content or mtime drift after freeze stops the run. Results after the drift</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 732 | <code>are quarantined and never mixed into the frozen report.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>### Phase 1: Targeted diagnostics</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 736 | <code>Freeze one first-attempt diagnostic manifest containing:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 738 | <code>- The 45 V3 hard-zero minefield scenarios.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 739 | <code>- The 18 V3 exact-half-score scenarios.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 740 | <code>- The 28 V3 medium-score scenarios.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 741 | <code>- All 13 Stability V1 regressions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 742 | <code>- A deterministic exact-match categorical grounding slice.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 743 | <code>- Deterministic epistemic, identity, missing-field, and temporal fixtures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 744 | <code>- A deterministic scrambled-schema slice.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 746 | <code>This phase is targeted recovery only. It must be labeled as seen-task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>diagnostics and never as unseen generalization.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 749 | <code>Freeze the primary report before creating any retry batch.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 751 | <code>### Phase 2: Stability and no-regression</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>Run the unchanged 64-scenario deterministic stability sample first for a</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>direct paired comparison. If it passes, expand to all affordable members of</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 755 | <code>the 334-scenario original-positive population, preferably the full population.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>Report:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>- Valid-only and errors-as-zero means.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 760 | <code>- Paired deltas and deterministic bootstrap interval.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 761 | <code>- Improved, unchanged, regressed, and severe-regression counts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 762 | <code>- Score-band and robustness-stratum results.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 763 | <code>- Per-scenario call, token, turn, and duration deltas.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>This remains stability evidence, not unseen holdout evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>### Phase 3: New external holdout</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>Acquire a genuinely new official ToolSandbox expansion, independently authored</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 770 | <code>task set, or externally maintained compatible suite.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 771 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 772 | <code>Requirements:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>- At least 100 non-RapidAPI scenarios unless the external release is smaller.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 775 | <code>- Zero scenario or task-content overlap with the 728 known scenarios and V4</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 776 | <code>  development fixtures.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 777 | <code>- Scenario list, source, provider/model, clock, and manifests frozen before</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 778 | <code>  execution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 779 | <code>- One primary attempt per scenario.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 780 | <code>- Official or independently locked scoring with no score feedback to AILIS.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>If no suitable external set exists, V4 must not publish a new unseen</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 783 | <code>generalization claim. The honest result is targeted improvement plus</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 784 | <code>no-regression evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 785 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 786 | <code>### Phase 4: Optional 728 latest projection</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>After all primary reports freeze, a complete 728-scenario replay may be used</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 789 | <code>to produce a latest-version projection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 791 | <code>It must be labeled `latest-attempt projection` or `seen-suite replay`. It may</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 792 | <code>not be pooled with V3 holdout, targeted recovery, stability, or retry means.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>## 9. Proposed Preregistered Gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>These thresholds must be written into the V4 manifest before official</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 797 | <code>attempts begin.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>### 9.1 Targeted diagnostic gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 801 | <code>&#124; Gate &#124; Proposed threshold &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 802 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 803 | <code>&#124; Primary errors &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 804 | <code>&#124; Unsupported/minefield calls in locked 45 &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 805 | <code>&#124; Zero count in locked 45 &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 806 | <code>&#124; Mean of locked 45 &#124; &gt;= 0.90 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 807 | <code>&#124; Mean of locked 18 half-score cohort &#124; &gt;= 0.85 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 808 | <code>&#124; Scores below 0.75 in locked 18 &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 809 | <code>&#124; Mean improvement in locked 28 medium cohort &#124; &gt;= +0.10 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 810 | <code>&#124; Severe regressions in locked 13 sentinels &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 811 | <code>&#124; Worst locked-sentinel delta &#124; &gt;= -0.10 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 812 | <code>&#124; Exact-match grounding fixture pass rate &#124; 100% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 813 | <code>&#124; Epistemic/provenance fixture pass rate &#124; 100% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 814 | <code>&#124; Scenario-name or expected-answer source hits &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 816 | <code>These are seen-task engineering gates, not estimates of generalization. Their</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 817 | <code>purpose is to reject a patch that leaves a known mechanism broken before an</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 818 | <code>expensive stability or external evaluation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 820 | <code>### 9.2 Stability gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>&#124; Gate &#124; Proposed threshold &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 823 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 824 | <code>&#124; Overall valid-only paired delta &#124; &gt;= -0.02 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 825 | <code>&#124; Overall errors-as-zero paired delta &#124; &gt;= -0.02 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 826 | <code>&#124; Severe regressions &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 827 | <code>&#124; High baseline-band mean delta &#124; &gt;= -0.05 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 828 | <code>&#124; Perfect baseline-band mean delta &#124; &gt;= -0.05 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 829 | <code>&#124; Every robustness stratum with n &gt;= 4 &#124; mean delta &gt;= -0.10 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 830 | <code>&#124; Paired-bootstrap lower 95% bound &#124; &gt;= -0.05 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 831 | <code>&#124; Primary errors &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 833 | <code>These gates are deliberately stricter than Stability V1 because V4 directly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 834 | <code>targets its two severe regressions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 836 | <code>### 9.3 External holdout gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>&#124; Gate &#124; Proposed threshold &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 839 | <code>&#124; --- &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 840 | <code>&#124; Coverage &#124; 100% attempted &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 841 | <code>&#124; Error rate &#124; &lt;= 2% &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 842 | <code>&#124; Valid-only mean &#124; &gt;= 0.72 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 843 | <code>&#124; Errors-as-zero mean &#124; &gt;= 0.70 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 844 | <code>&#124; Provider/model violations &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 845 | <code>&#124; RapidAPI calls &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 846 | <code>&#124; Integrity/audit violations &#124; 0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 847 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 848 | <code>If the external suite has materially different difficulty or scoring, the</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 849 | <code>score thresholds may be recalibrated only before labels or results are</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 850 | <code>observed. The manifest must explain the calibration source.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 852 | <code>### 9.4 Efficiency gates</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 853 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 854 | <code>Use paired comparisons on the same frozen cohort.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 855 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 856 | <code>&#124; Metric &#124; V3 holdout reference &#124; V4 target &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 857 | <code>&#124; --- &#124; ---: &#124; ---: &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 858 | <code>&#124; Calls per scenario &#124; 10.89 &#124; &lt;= 8.0 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 859 | <code>&#124; Tokens per scenario &#124; 92,276 &#124; &lt;= 70,000 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 860 | <code>&#124; Duration per scenario &#124; 3.08 min &#124; &lt;= 2.3 min &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>Quality gates take precedence. If an efficiency target conflicts with</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 863 | <code>stability, retain the higher-quality configuration and document the cost gap.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>## 10. Artifact Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>Each V4 phase must produce:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 868 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 869 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 870 | <code>manifest.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 871 | <code>source-files.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 872 | <code>source-mtimes.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 873 | <code>prompt-boundary-audit.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 874 | <code>provider-model-audit.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 875 | <code>primary-progress.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 876 | <code>primary-report.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 877 | <code>primary-projection.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 878 | <code>primary-projection.sha256</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 879 | <code>retry-manifest.json        # only after primary freeze, if needed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 880 | <code>retry-report.md            # never replaces primary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 881 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 883 | <code>Reports must keep these views separate:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 885 | <code>- Targeted recovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 886 | <code>- Seen-suite diagnostics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 887 | <code>- Stability/no-regression.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 888 | <code>- New unseen holdout generalization.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 889 | <code>- Valid-only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 890 | <code>- Errors-as-zero.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 891 | <code>- Retry recovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 892 | <code>- Latest-attempt projection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>## 11. Rollback and Stop Rules</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>Stop and quarantine the active phase when:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 897 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 898 | <code>- Source content or mtime fingerprint changes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 899 | <code>- A duplicate controller or worker appears.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 900 | <code>- Provider, model, reasoning effort, or user simulator drifts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 901 | <code>- An expected answer, scenario ID, similarity, or evaluator result enters</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 902 | <code>  model-visible context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 903 | <code>- A mock, fallback, answer rewrite, or RapidAPI call is observed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 904 | <code>- OAuth, usage, or provider availability blocks valid scoring.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 905 | <code>- Primary-attempt uniqueness is violated.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>Rollback is by source commit and manifest, never by deleting evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 908 | <code>Historical attempts and reports remain immutable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 909 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 910 | <code>## 12. Definition of Done</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 911 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 912 | <code>V4 is complete only when:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>1. Protocol hardening, model-owned execution outcome, epistemic provenance,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 915 | <code>   and argument grounding are implemented without scenario-specific logic.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 916 | <code>2. All static, deterministic, routing, memory-isolation, and prompt-boundary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 917 | <code>   audits pass.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 918 | <code>3. The targeted diagnostic primary report passes its registered gates.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 919 | <code>4. The frozen stability primary report passes every stricter V4 gate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 920 | <code>5. Efficiency is measured on the same cohort and does not trade away quality.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 921 | <code>6. A new external holdout report is frozen, or the final report explicitly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 922 | <code>   states that no new unseen-generalization claim is available.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 923 | <code>7. Every result is linked to immutable source, mtime, scenario, manifest,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 924 | <code>   provider/model, and primary-projection hashes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>## 13. Immediate Next Implementation Batch</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 928 | <code>The first code batch should be narrow:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>1. Wait for the currently changing runtime worktree to stabilize.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 931 | <code>2. Create a dedicated `codex/` V4 branch from a clean pinned commit and record</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 932 | <code>   the pre-change deterministic baseline.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 933 | <code>3. Add failing protocol tests proving that ToolSandbox prompts contain no</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 934 | <code>   host clock, memory, scenario ID, evaluator data, or forced execution flag.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 935 | <code>4. Add model-contract tests for `direct_answer`, `clarification_needed`,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 936 | <code>   `executed`, and `blocked`, including source-reference validation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 937 | <code>5. Implement only V4.0 and V4.1; run deterministic tests and a synthetic local</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 938 | <code>   protocol probe before touching argument grounding.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 939 | <code>6. Add generic temporal, missing-field, categorical, identity, and capability</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 940 | <code>   fixtures with invented data that does not reproduce benchmark task text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 941 | <code>7. Implement V4.2 and rerun every deterministic gate.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 942 | <code>8. Review the diff for keyword, regex, task-type, scenario-name, fixed-date,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 943 | <code>   and fixed-value special cases before any official ToolSandbox attempt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 944 | <code>9. Freeze the 104-record seen-task diagnostic manifest (91 V3 scores below</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 945 | <code>   0.75 plus 13 stability regressions) only after the implementation diff,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 946 | <code>   source fingerprint, and tests are stable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 947 | <code>10. Run one first attempt per diagnostic scenario, freeze its primary report,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 948 | <code>    and make the full 64-scenario stability gate the next go/no-go decision.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 950 | <code>No new official benchmark run should begin from the current dirty worktree.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 952 | <code>## 14. Authoritative References</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 954 | <code>- [Apple Machine Learning Research: ToolSandbox](https://machinelearning.apple.com/research/toolsandbox-stateful-conversational-llm-benchmark)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 955 | <code>- [ToolSandbox paper and official model table](https://arxiv.org/html/2408.04682#S4)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 956 | <code>- [Apple ToolSandbox official repository](https://github.com/apple/ToolSandbox)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
