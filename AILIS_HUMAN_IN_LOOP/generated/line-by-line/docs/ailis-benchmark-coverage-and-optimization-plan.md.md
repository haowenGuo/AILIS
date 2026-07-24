# docs/ailis-benchmark-coverage-and-optimization-plan.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：222
- SHA-256：`d442ac3136f7d40d4d6850ca9796398158b121ac8ec5a5112ddcffd29b6d2d46`
- 可运行副本：[打开源文件](../../../source/docs/ailis-benchmark-coverage-and-optimization-plan.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Benchmark Coverage And Optimization Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Date: 2026-07-16</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 目标</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>AILIS 不能继续靠主观试用和单点修补来判断能力。后续优化应改成 benchmark-first loop：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>1. 用固定任务复现失败或性能瓶颈。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>2. 记录完整执行链路：任务结果、轮次、工具、LLM 等待、token、上下文大小、错误恢复。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>3. 把失败归因到通用子系统，而不是写死某个任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>4. 修通用能力，再 rerun benchmark，看分数、耗时、token、失败类型是否改善。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>## 当前本地 Bench 状态</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>&#124; 方向 &#124; 本地已有 &#124; 本轮检查结果 &#124; 当前缺口 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 17 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 18 | <code>&#124; Artifact / 大文件 &#124; `eval:artifact-tools:run` &#124; 10/10 passed，覆盖 XLSX/PDF/DOCX/PPTX/CSV/Image &#124; 缺更大压力集：长 PDF、扫描 PDF、复杂 DOCX/PPTX、超大 CSV/JSON、多文件引用 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 19 | <code>&#124; 人设/好感度/记忆风格 &#124; `eval:ailis-humanlike:validate` &#124; 1000 条 scenarios 结构验证通过 &#124; 缺真实 LLM judge、长期 Raw Memory Ledger 抽取质量评分、用户偏好漂移检测 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 20 | <code>&#124; 工具执行/权限/Transcript &#124; `ailis:benchmark-execution` &#124; 通过：代码修复、PTY 会话、安全阻断、transcript &#124; 缺真实模型闭环任务、Windows/macOS/Linux 跨平台命令稳定性矩阵 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 21 | <code>&#124; OSWorld/桌面 GUI &#124; `bench:osworld:readiness` &#124; officialRunReady=false &#124; 缺 OSWorld repo 和 Python 依赖；还没形成桌面 GUI score &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 22 | <code>&#124; GAIA &#124; `bench:gaia:official:*` &#124; 已有脚本和历史报告 &#124; 需要恢复 official/lite 固定小集，做日常 no-visual 与 visual 分层 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 23 | <code>&#124; SWE-bench Lite &#124; `bench:swebench-lite:*` &#124; 有本地 sample JSONL &#124; 缺稳定 wheelhouse、隔离执行环境、持续跑小样本 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 24 | <code>&#124; 速度/成本 &#124; `scripts/run-ailis-speed-bench.mjs` &#124; 本轮 120s timeout；partial report 显示第 1 个任务 `max_steps_reached`，LLM wait 102s / tool 8.1s / max prompt 12.9k tokens &#124; 需要拆成 smoke/standard/longrun 三档；当前默认任务太重，不适合作为日常回归门 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>### 本轮速度 Bench 诊断</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>`run-ailis-speed-bench.mjs` 的 partial report：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>- Task: `playwright_waiting_comparison`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- Status: `max_steps_reached`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Duration: 110.7s</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- Steps: 5</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- Output file: missing</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- Prompt budget count: 12</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- Max approx input tokens: 12,933</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- Model wait: 102.1s</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Tool time: 8.1s</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>这说明当前性能瓶颈主要不是工具慢，而是 Agent Loop 在较大上下文和真实模型调用里没有及时收敛。优化优先级应是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>1. 降低每轮上下文体积。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>2. 增加证据足够后的收敛策略。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>3. 把速度 bench 拆成短任务，不要一上来跑联网文档调研长任务。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>4. 对本地小模型启用更激进的 memory/context compaction。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>## 外部 Benchmark Catalog</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>### P0：最应该接入或恢复的核心 Bench</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>&#124; Bench &#124; 适合测什么 &#124; AILIS 用法 &#124; 主要指标 &#124; 来源 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 53 | <code>&#124; GAIA &#124; 通用助理、搜索、文件、多步推理 &#124; 保留 L1/L2 lite 小集 + official validation 分层；用于验证工具链真实任务能力 &#124; accuracy、steps、tool failures、time、token &#124; [GAIA dataset](https://huggingface.co/datasets/gaia-benchmark/GAIA) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 54 | <code>&#124; SWE-bench Lite &#124; 真实代码修复 &#124; 先跑 3-10 个固定样本，不追 leaderboard，关注 patch/test loop 是否可靠 &#124; resolved rate、test pass、time、tool count &#124; [SWE-bench](https://www.swebench.com/), [GitHub](https://github.com/SWE-bench/SWE-bench) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 55 | <code>&#124; OSWorld &#124; 桌面 GUI 操作 &#124; 用 readiness + deterministic smoke；官方环境准备好后跑小集 &#124; task success、GUI step count、recovery failures &#124; [OSWorld GitHub](https://github.com/xlang-ai/OSWorld) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 56 | <code>&#124; WebArena / BrowserGym &#124; 浏览器真实网页任务 &#124; Browser/search/web_fetch 能力成熟后接入；先用小型网页任务 &#124; success rate、navigation/tool steps、browser latency &#124; [WebArena GitHub](https://github.com/web-arena-x/webarena), [BrowserGym GitHub](https://github.com/ServiceNow/BrowserGym) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 57 | <code>&#124; AppWorld &#124; API 工具调用和状态变更 &#124; 对 AILIS tool schema、tool_result 消费、最终状态验证很有价值 &#124; task success、API call correctness、state diff &#124; [AppWorld GitHub](https://github.com/StonyBrookNLP/appworld) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 58 | <code>&#124; BFCL &#124; 函数调用 / tool calling &#124; 用来评估云端模型、本地模型、AILIS tool schema 是否能稳定选工具和填参数 &#124; AST/exec accuracy、parallel/multi-turn score &#124; [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 59 | <code>&#124; Terminal-Bench &#124; 终端任务与命令行能力 &#124; 替代“拍脑袋测命令行”；对 Windows/Linux shell 适配很重要 &#124; task success、test pass、shell errors &#124; [Terminal-Bench GitHub](https://github.com/laude-institute/terminal-bench) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>### P1：补足 AILIS 产品特性的 Bench</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>&#124; Bench / 数据 &#124; 适合测什么 &#124; AILIS 用法 &#124; 来源 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 64 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 65 | <code>&#124; WorkArena &#124; 企业浏览器工作流，ServiceNow 类任务 &#124; 测“网页工作台 + 表单 + 多步骤业务流” &#124; [WorkArena GitHub](https://github.com/ServiceNow/WorkArena) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>&#124; tau-bench &#124; tool/API 交互中的状态一致性 &#124; 测 Agent 是否正确调用工具、遵守用户目标、不乱改状态 &#124; [tau-bench GitHub](https://github.com/sierra-research/tau-bench) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 67 | <code>&#124; LongBench &#124; 长上下文理解 &#124; 测 context compiler 和 artifact summary 是否压缩后仍保留证据 &#124; [LongBench GitHub](https://github.com/THUDM/LongBench) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 68 | <code>&#124; RAGBench &#124; RAG / 检索增强问答 &#124; 测 artifact/text/document search 的证据引用质量 &#124; [RAGBench GitHub](https://github.com/rungalileo/ragbench) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 69 | <code>&#124; LoCoMo &#124; 长期对话记忆 &#124; 测 Raw Memory Ledger -&gt; 用户画像 -&gt; prompt 注入是否真的有效 &#124; [LoCoMo GitHub](https://github.com/snap-research/locomo) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 70 | <code>&#124; LongMemEval &#124; 长期记忆检索与跨会话问答 &#124; 测 AILIS 是否能从历史经历中找回关键偏好和事实 &#124; [LongMemEval GitHub](https://github.com/xiaowu0162/LongMemEval) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 71 | <code>&#124; Common Voice &#124; 多语言 ASR &#124; 测中文/英文/日文/韩文 ASR pipeline 和本地模型可用性 &#124; [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 72 | <code>&#124; LibriSpeech &#124; 英文 ASR 基准 &#124; 测 ASR 基础 WER 和延迟 &#124; [LibriSpeech](https://www.openslr.org/12) &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>### P2：可选但有价值</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>&#124; Bench &#124; 价值 &#124; 何时接入 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 77 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 78 | <code>&#124; MLE-bench &#124; 数据科学/机器学习竞赛型 Agent &#124; 等代码执行、文件处理、Python 环境稳定后 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 79 | <code>&#124; MiniWoB++ &#124; 轻量网页交互 &#124; Browser tooling 早期 smoke &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 80 | <code>&#124; AndroidWorld &#124; 手机 GUI Agent &#124; 未来 Android 版 AILIS 再接 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 81 | <code>&#124; OmniAct / GUI 多模态任务 &#124; 多模态屏幕理解和动作规划 &#124; 等视觉输入和 GUI action 层稳定后 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>## AILIS 还差什么</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>### 1. 统一 Benchmark Harness</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>现在每类 bench 都有自己的脚本，结果格式不统一。需要一个统一报告层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>- `benchmark_id`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- `task_id`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- `category`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- `model/provider`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- `success`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- `score`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>- `duration_ms`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- `llm_wait_ms`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- `tool_wait_ms`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- `prompt_tokens/input_chars`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- `completion_tokens`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- `agent_steps`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- `tool_calls`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- `failed_tool_calls`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `loop_stop_reason`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `final_answer`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- `evidence_refs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `artifact/output paths`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- `failure_taxonomy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>### 2. Failure Taxonomy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>所有 bench 失败都应归类，至少包括：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>- `model_quality`: 模型没理解/没收敛。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>- `context_overload`: 上下文过大、证据被压缩丢失。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 115 | <code>- `tool_selection`: 选错工具或幻想工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>- `tool_contract`: 参数/schema/返回结构不清。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 117 | <code>- `tool_runtime`: 工具本身异常或平台不兼容。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- `environment`: Python/Ollama/网络/权限/依赖缺失。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>- `verification_gap`: 没验收或验收证据不足。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- `ui_runtime`: 控制面板/窗口/渲染/启动慢。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `voice_runtime`: ASR/TTS 缺模型、冷启动、延迟或音频失败。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>### 3. 速度 Bench 要拆档</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>当前 speed bench 默认任务太重。建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>- Smoke: 3 个 5-20 秒任务，只测 gateway/tool/context/compiler 是否健康。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- Standard: 5-10 个 1-3 分钟真实任务，测 Agent Loop 性能。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- Longrun: GAIA/Web/SWE 等长任务，用于 nightly 或手动跑。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>### 4. 本地模型专用 Bench</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>本地 Ollama 小模型和商业模型不能用同一套上下文策略。需要专门测：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>- 闲聊是否不进 50 轮 Agent Loop。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- 1-2 步任务是否能及时 final。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- 压缩 memory context 后是否还能保持人设和用户偏好。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- token 输入量、首 token 延迟、tokens/sec、总耗时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>### 5. 安装/启动 Bench</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>AILIS 是桌面产品，必须有非 LLM bench：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>- 安装包是否能安装/卸载。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>- 首屏控制面板打开耗时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>- 冷启动耗时。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 147 | <code>- 模型/语音 runtime 是否阻塞 UI。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 148 | <code>- 资源占用：内存、进程数、磁盘写入。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 149 | <code>- SmartScreen/签名状态只记录，不作为代码失败。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>## 推荐的优化顺序</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>### P0：先把已有 Bench 修成日常可用</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>1. 修 `run-ailis-speed-bench.mjs`：加 `--mode smoke&#124;standard&#124;longrun`、`--task-limit`、`--timeout-ms`、partial summary。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>2. 给所有 bench 输出统一 summary JSON。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>3. 把 OSWorld readiness blocker 变成可操作的安装提示，但不要自动大修用户系统。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>4. 建立 `pnpm bench:ailis:smoke`：只跑快、稳、无外部 API 或低成本 API 的门禁。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>### P1：围绕当前痛点扩展数据</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>1. 长文本/Artifact：增加真实大 XLSX/PDF/DOCX/PPTX/CSV/JSON 压力集。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>2. 记忆：把 Raw Memory Ledger 日级抽取做成 eval，比较抽取前后用户画像准确率。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>3. 本地模型：建立 Ollama/Qwen/Dolphin 等模型的小模型收敛测试。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>4. 语音：ASR WER + TTS cold/warm latency + failure reason。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>### P2：接入外部标准</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>1. GAIA L1 fixed smoke。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>2. SWE-bench Lite fixed 3/10 sample。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>3. OSWorld deterministic smoke。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>4. BFCL small tool-calling subset。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>5. AppWorld/tau-bench small stateful tool subset。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>## 最小日常回归组合</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>建议新增一个“每天都能跑”的组合，不依赖巨大环境：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>&#124; Gate &#124; 内容 &#124; 目标 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 180 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 181 | <code>&#124; `bench:ailis:smoke` &#124; execution + artifact + humanlike validate + speed smoke &#124; 5 分钟内发现大回归 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 182 | <code>&#124; `bench:ailis:agent-smoke` &#124; 3 个真实 LLM 小任务 &#124; 测 Agent Loop 是否会乱循环 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 183 | <code>&#124; `bench:ailis:local-model-smoke` &#124; 3 个 Ollama 小任务 &#124; 测小模型压缩策略 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 184 | <code>&#124; `bench:ailis:installer-smoke` &#124; 安装、启动、卸载、便携启动 &#124; 防安装包炸 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 185 | <code>&#124; `bench:ailis:nightly` &#124; GAIA/SWE/OSWorld/Web/Artifact stress &#124; 长跑，找深层瓶颈 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>## 性能优化指标</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>不要只看“任务成功”。每个任务至少记录：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>- 成功率</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 192 | <code>- 总耗时</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 193 | <code>- LLM 等待时间</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 194 | <code>- 工具执行时间</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>- 首轮 prompt 字符数 / token 估算</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 196 | <code>- 最大 prompt 字符数 / token 估算</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>- Agent loop 轮数</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>- 工具调用次数</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- 失败工具次数</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- 最终停止原因</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>- 输出是否通过验收</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>如果 AILIS 性能要变好，最核心的曲线应该是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>- `success_rate` 上升。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 206 | <code>- `max_prompt_tokens` 下降或稳定。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 207 | <code>- `model_wait_ms / duration_ms` 下降。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 208 | <code>- `max_steps_reached` 减少。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>- `verification_gap` 减少。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- `tool_selection` 错误减少。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>## 直接结论</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>AILIS 现在不是完全没有 benchmark；相反，已经有一批内部 eval。真正缺的是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>1. 统一结果格式。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>2. 可复跑的外部标准数据准备。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>3. 速度/成本指标。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>4. 失败归因。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>5. 小模型、本地 runtime、安装/启动、语音这些产品关键路径的专门 bench。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>下一步最值得做的是先修 `run-ailis-speed-bench.mjs` 和统一 benchmark summary。因为本轮已经看到一个清晰瓶颈：真实任务里 110 秒几乎都花在 LLM 等待和大 prompt 上，最后还 `max_steps_reached`，这正是 AILIS 当前体验不稳的核心风险之一。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
