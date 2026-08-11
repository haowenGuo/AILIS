# AILIS Benchmark Coverage And Optimization Plan

Date: 2026-07-16

## 目标

AILIS 不能继续靠主观试用和单点修补来判断能力。后续优化应改成 benchmark-first loop：

1. 用固定任务复现失败或性能瓶颈。
2. 记录完整执行链路：任务结果、轮次、工具、LLM 等待、token、上下文大小、错误恢复。
3. 把失败归因到通用子系统，而不是写死某个任务。
4. 修通用能力，再 rerun benchmark，看分数、耗时、token、失败类型是否改善。

## 当前本地 Bench 状态

| 方向 | 本地已有 | 本轮检查结果 | 当前缺口 |
| --- | --- | --- | --- |
| Artifact / 大文件 | `eval:artifact-tools:run` | 10/10 passed，覆盖 XLSX/PDF/DOCX/PPTX/CSV/Image | 缺更大压力集：长 PDF、扫描 PDF、复杂 DOCX/PPTX、超大 CSV/JSON、多文件引用 |
| 人设/好感度/记忆风格 | `eval:ailis-humanlike:validate` | 1000 条 scenarios 结构验证通过 | 缺真实 LLM judge、长期 Raw Memory Ledger 抽取质量评分、用户偏好漂移检测 |
| 工具执行/权限/Transcript | `ailis:benchmark-execution` | 通过：代码修复、PTY 会话、安全阻断、transcript | 缺真实模型闭环任务、Windows/macOS/Linux 跨平台命令稳定性矩阵 |
| OSWorld/桌面 GUI | `bench:osworld:readiness`、`bench:osworld:ailis:test-small:wsl` | officialRunReady=true；生产 TaskAgent 干净链路首题官方 evaluator=1.0（8 个 GUI 动作） | 需要跑完 39 题 test_small，再扩展 361 题 Verified-compatible 本地集；本地结果不能冒充官方 verified leaderboard 分数 |
| GAIA | `bench:gaia:official:*` | 已有脚本和历史报告 | 需要恢复 official/lite 固定小集，做日常 no-visual 与 visual 分层 |
| SWE-bench Lite | `bench:swebench-lite:*` | 有本地 sample JSONL | 缺稳定 wheelhouse、隔离执行环境、持续跑小样本 |
| 速度/成本 | `scripts/run-ailis-speed-bench.mjs` | 本轮 120s timeout；partial report 显示第 1 个任务 `max_steps_reached`，LLM wait 102s / tool 8.1s / max prompt 12.9k tokens | 需要拆成 smoke/standard/longrun 三档；当前默认任务太重，不适合作为日常回归门 |

### 本轮速度 Bench 诊断

`run-ailis-speed-bench.mjs` 的 partial report：

- Task: `playwright_waiting_comparison`
- Status: `max_steps_reached`
- Duration: 110.7s
- Steps: 5
- Output file: missing
- Prompt budget count: 12
- Max approx input tokens: 12,933
- Model wait: 102.1s
- Tool time: 8.1s

这说明当前性能瓶颈主要不是工具慢，而是 Agent Loop 在较大上下文和真实模型调用里没有及时收敛。优化优先级应是：

1. 降低每轮上下文体积。
2. 增加证据足够后的收敛策略。
3. 把速度 bench 拆成短任务，不要一上来跑联网文档调研长任务。
4. 对本地小模型启用更激进的 memory/context compaction。

## 外部 Benchmark Catalog

### P0：最应该接入或恢复的核心 Bench

| Bench | 适合测什么 | AILIS 用法 | 主要指标 | 来源 |
| --- | --- | --- | --- | --- |
| GAIA | 通用助理、搜索、文件、多步推理 | 保留 L1/L2 lite 小集 + official validation 分层；用于验证工具链真实任务能力 | accuracy、steps、tool failures、time、token | [GAIA dataset](https://huggingface.co/datasets/gaia-benchmark/GAIA) |
| SWE-bench Lite | 真实代码修复 | 先跑 3-10 个固定样本，不追 leaderboard，关注 patch/test loop 是否可靠 | resolved rate、test pass、time、tool count | [SWE-bench](https://www.swebench.com/), [GitHub](https://github.com/SWE-bench/SWE-bench) |
| OSWorld | 桌面 GUI 操作 | 用 readiness + deterministic smoke；官方环境准备好后跑小集 | task success、GUI step count、recovery failures | [OSWorld GitHub](https://github.com/xlang-ai/OSWorld) |
| WebArena / BrowserGym | 浏览器真实网页任务 | Browser/search/web_fetch 能力成熟后接入；先用小型网页任务 | success rate、navigation/tool steps、browser latency | [WebArena GitHub](https://github.com/web-arena-x/webarena), [BrowserGym GitHub](https://github.com/ServiceNow/BrowserGym) |
| AppWorld | API 工具调用和状态变更 | 对 AILIS tool schema、tool_result 消费、最终状态验证很有价值 | task success、API call correctness、state diff | [AppWorld GitHub](https://github.com/StonyBrookNLP/appworld) |
| BFCL | 函数调用 / tool calling | 用来评估云端模型、本地模型、AILIS tool schema 是否能稳定选工具和填参数 | AST/exec accuracy、parallel/multi-turn score | [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) |
| Terminal-Bench | 终端任务与命令行能力 | 替代“拍脑袋测命令行”；对 Windows/Linux shell 适配很重要 | task success、test pass、shell errors | [Terminal-Bench GitHub](https://github.com/laude-institute/terminal-bench) |

### P1：补足 AILIS 产品特性的 Bench

| Bench / 数据 | 适合测什么 | AILIS 用法 | 来源 |
| --- | --- | --- | --- |
| WorkArena | 企业浏览器工作流，ServiceNow 类任务 | 测“网页工作台 + 表单 + 多步骤业务流” | [WorkArena GitHub](https://github.com/ServiceNow/WorkArena) |
| tau-bench | tool/API 交互中的状态一致性 | 测 Agent 是否正确调用工具、遵守用户目标、不乱改状态 | [tau-bench GitHub](https://github.com/sierra-research/tau-bench) |
| LongBench | 长上下文理解 | 测 context compiler 和 artifact summary 是否压缩后仍保留证据 | [LongBench GitHub](https://github.com/THUDM/LongBench) |
| RAGBench | RAG / 检索增强问答 | 测 artifact/text/document search 的证据引用质量 | [RAGBench GitHub](https://github.com/rungalileo/ragbench) |
| LoCoMo | 长期对话记忆 | 测 Raw Memory Ledger -> 用户画像 -> prompt 注入是否真的有效 | [LoCoMo GitHub](https://github.com/snap-research/locomo) |
| LongMemEval | 长期记忆检索与跨会话问答 | 测 AILIS 是否能从历史经历中找回关键偏好和事实 | [LongMemEval GitHub](https://github.com/xiaowu0162/LongMemEval) |
| Common Voice | 多语言 ASR | 测中文/英文/日文/韩文 ASR pipeline 和本地模型可用性 | [Mozilla Common Voice](https://commonvoice.mozilla.org/en/datasets) |
| LibriSpeech | 英文 ASR 基准 | 测 ASR 基础 WER 和延迟 | [LibriSpeech](https://www.openslr.org/12) |

### P2：可选但有价值

| Bench | 价值 | 何时接入 |
| --- | --- | --- |
| MLE-bench | 数据科学/机器学习竞赛型 Agent | 等代码执行、文件处理、Python 环境稳定后 |
| MiniWoB++ | 轻量网页交互 | Browser tooling 早期 smoke |
| AndroidWorld | 手机 GUI Agent | 未来 Android 版 AILIS 再接 |
| OmniAct / GUI 多模态任务 | 多模态屏幕理解和动作规划 | 等视觉输入和 GUI action 层稳定后 |

## AILIS 还差什么

### 1. 统一 Benchmark Harness

现在每类 bench 都有自己的脚本，结果格式不统一。需要一个统一报告层：

- `benchmark_id`
- `task_id`
- `category`
- `model/provider`
- `success`
- `score`
- `duration_ms`
- `llm_wait_ms`
- `tool_wait_ms`
- `prompt_tokens/input_chars`
- `completion_tokens`
- `agent_steps`
- `tool_calls`
- `failed_tool_calls`
- `loop_stop_reason`
- `final_answer`
- `evidence_refs`
- `artifact/output paths`
- `failure_taxonomy`

### 2. Failure Taxonomy

所有 bench 失败都应归类，至少包括：

- `model_quality`: 模型没理解/没收敛。
- `context_overload`: 上下文过大、证据被压缩丢失。
- `tool_selection`: 选错工具或幻想工具。
- `tool_contract`: 参数/schema/返回结构不清。
- `tool_runtime`: 工具本身异常或平台不兼容。
- `environment`: Python/Ollama/网络/权限/依赖缺失。
- `verification_gap`: 没验收或验收证据不足。
- `ui_runtime`: 控制面板/窗口/渲染/启动慢。
- `voice_runtime`: ASR/TTS 缺模型、冷启动、延迟或音频失败。

### 3. 速度 Bench 要拆档

当前 speed bench 默认任务太重。建议：

- Smoke: 3 个 5-20 秒任务，只测 gateway/tool/context/compiler 是否健康。
- Standard: 5-10 个 1-3 分钟真实任务，测 Agent Loop 性能。
- Longrun: GAIA/Web/SWE 等长任务，用于 nightly 或手动跑。

### 4. 本地模型专用 Bench

本地 Ollama 小模型和商业模型不能用同一套上下文策略。需要专门测：

- 闲聊是否不进 50 轮 Agent Loop。
- 1-2 步任务是否能及时 final。
- 压缩 memory context 后是否还能保持人设和用户偏好。
- token 输入量、首 token 延迟、tokens/sec、总耗时。

### 5. 安装/启动 Bench

AILIS 是桌面产品，必须有非 LLM bench：

- 安装包是否能安装/卸载。
- 首屏控制面板打开耗时。
- 冷启动耗时。
- 模型/语音 runtime 是否阻塞 UI。
- 资源占用：内存、进程数、磁盘写入。
- SmartScreen/签名状态只记录，不作为代码失败。

## 推荐的优化顺序

### P0：先把已有 Bench 修成日常可用

1. 修 `run-ailis-speed-bench.mjs`：加 `--mode smoke|standard|longrun`、`--task-limit`、`--timeout-ms`、partial summary。
2. 给所有 bench 输出统一 summary JSON。
3. 把 OSWorld readiness blocker 变成可操作的安装提示，但不要自动大修用户系统。
4. 建立 `pnpm bench:ailis:smoke`：只跑快、稳、无外部 API 或低成本 API 的门禁。

### P1：围绕当前痛点扩展数据

1. 长文本/Artifact：增加真实大 XLSX/PDF/DOCX/PPTX/CSV/JSON 压力集。
2. 记忆：把 Raw Memory Ledger 日级抽取做成 eval，比较抽取前后用户画像准确率。
3. 本地模型：建立 Ollama/Qwen/Dolphin 等模型的小模型收敛测试。
4. 语音：ASR WER + TTS cold/warm latency + failure reason。

### P2：接入外部标准

1. GAIA L1 fixed smoke。
2. SWE-bench Lite fixed 3/10 sample。
3. OSWorld deterministic smoke。
4. BFCL small tool-calling subset。
5. AppWorld/tau-bench small stateful tool subset。

## 最小日常回归组合

建议新增一个“每天都能跑”的组合，不依赖巨大环境：

| Gate | 内容 | 目标 |
| --- | --- | --- |
| `bench:ailis:smoke` | execution + artifact + humanlike validate + speed smoke | 5 分钟内发现大回归 |
| `bench:ailis:agent-smoke` | 3 个真实 LLM 小任务 | 测 Agent Loop 是否会乱循环 |
| `bench:ailis:local-model-smoke` | 3 个 Ollama 小任务 | 测小模型压缩策略 |
| `bench:ailis:installer-smoke` | 安装、启动、卸载、便携启动 | 防安装包炸 |
| `bench:ailis:nightly` | GAIA/SWE/OSWorld/Web/Artifact stress | 长跑，找深层瓶颈 |

## 性能优化指标

不要只看“任务成功”。每个任务至少记录：

- 成功率
- 总耗时
- LLM 等待时间
- 工具执行时间
- 首轮 prompt 字符数 / token 估算
- 最大 prompt 字符数 / token 估算
- Agent loop 轮数
- 工具调用次数
- 失败工具次数
- 最终停止原因
- 输出是否通过验收

如果 AILIS 性能要变好，最核心的曲线应该是：

- `success_rate` 上升。
- `max_prompt_tokens` 下降或稳定。
- `model_wait_ms / duration_ms` 下降。
- `max_steps_reached` 减少。
- `verification_gap` 减少。
- `tool_selection` 错误减少。

## 直接结论

AILIS 现在不是完全没有 benchmark；相反，已经有一批内部 eval。真正缺的是：

1. 统一结果格式。
2. 可复跑的外部标准数据准备。
3. 速度/成本指标。
4. 失败归因。
5. 小模型、本地 runtime、安装/启动、语音这些产品关键路径的专门 bench。

下一步最值得做的是先修 `run-ailis-speed-bench.mjs` 和统一 benchmark summary。因为本轮已经看到一个清晰瓶颈：真实任务里 110 秒几乎都花在 LLM 等待和大 prompt 上，最后还 `max_steps_reached`，这正是 AILIS 当前体验不稳的核心风险之一。
