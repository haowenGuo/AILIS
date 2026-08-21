<div align="center">
  <h1>AILIS Assistant</h1>
  <p><strong>开源桌面具身 AI 助手：集成 VRM 角色、实时语音、视觉上下文、记忆系统，以及接近 Codex 工作方式的 Agent Harness。</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.0-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=for-the-badge">
  </p>
  <p>
    <img alt="ToolSandbox 冻结 holdout 均值 71.51%" src="https://img.shields.io/badge/ToolSandbox_holdout-71.51%25-2563eb?style=for-the-badge">
    <img alt="AILIS-LUNA GAIA 165 题语义分 72.12%" src="https://img.shields.io/badge/AILIS--LUNA_GAIA_165-72.12%25-059669?style=for-the-badge">
    <img alt="AILIS TaskAgent A7 Terminal-Bench 2.1 pass at one 67.42%" src="https://img.shields.io/badge/Terminal--Bench_2.1-67.42%25-d97706?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

---

## 评测结果总览

AILIS 不只是角色演示，而是一套经过端到端评测的 Agent 系统。同一 Luna 模型下，AILIS 已达到与 Codex 同一量级的任务执行能力：GAIA 完整 165 题全面领先，Terminal-Bench 2.1 达到 67.42%。

### 核心成绩

| Benchmark | 核心能力 | AILIS 成绩 | 规模 | 模型 / 运行时 |
| --- | --- | ---: | ---: | --- |
| **GAIA public validation** | 通用研究、工具调用、多跳推理 | **119 / 165，72.12%** | L1-L3 全部 165 题 | `gpt-5.6-luna` medium |
| **Terminal-Bench 2.1** | 长程终端与代码任务 | **60 / 89，67.42% pass@1** | 完整 89 题 | TaskAgent A7，`gpt-5.6-luna` max，Harbor 0.20.0 |
| **Apple ToolSandbox** | 有状态工具执行 | **71.51%** frozen-holdout 均值 | 239 / 239 | production Agent + 官方 user simulator |
| **LongMemEval-S** | 长期记忆问答 | **358 / 500，71.60%** | 500 / 500 | BM25 phrase v2 + MMR 0.2，Luna Reader/Judge |
| **LoCoMo** | 对话记忆与多跳合成 | **24.69 token-F1** | 1,986 / 1,986 | BM25 phrase v2 + MMR 0.2 |
| **PersonaMem Balanced-140** | 偏好与 Persona 连续性 | **92 / 140，65.71%** | 140 / 140 | Ledger + BM25/MMR，Luna medium |

### 与 Codex 的同模型对照

| Benchmark | 相同模型 | AILIS | Codex | 对照结果 |
| --- | --- | ---: | ---: | --- |
| **GAIA，165 题** | `gpt-5.6-luna` medium | **72.12%** | 64.85% | **AILIS +7.27 pp** |
| **Terminal-Bench 2.1** | `gpt-5.6-luna` max | **67.42%** | 75.73% +/- 1.32% | AILIS 达到 Codex 分数的 **89.0%** |

#### GAIA 分级成绩

| GAIA 难度 | AILIS-Luna | Codex-Luna | AILIS 差值 |
| --- | ---: | ---: | ---: |
| L1 | **43 / 53，81.13%** | 41 / 53，77.36% | **+2 题，+3.77 pp** |
| L2 | **64 / 86，74.42%** | 57 / 86，66.28% | **+7 题，+8.14 pp** |
| L3 | **12 / 26，46.15%** | 9 / 26，34.62% | **+3 题，+11.54 pp** |
| **总计** | **119 / 165，72.12%** | **107 / 165，64.85%** | **+12 题，+7.27 pp** |

#### GAIA 效率对照

| 指标，同一 165 题 | AILIS-Luna | Codex-Luna | AILIS 表现 |
| --- | ---: | ---: | ---: |
| 成绩 | **72.12%** | 64.85% | **+7.27 pp** |
| 平均任务时延 | **210.4s** | 255.9s | **快 17.8%** |
| P50 时延 | **140.1s** | 229.3s | **快 38.9%** |
| P95 时延 | **575.0s** | 584.7s | **快 1.7%** |
| 逻辑输入 Token | **31.04M** | 68.56M | **少 54.7%** |
| 输出 Token | **330.7K** | 497.0K | **少 33.5%** |

#### Terminal-Bench 2.1 性能对照

| Terminal-Bench 指标 | AILIS A7 | 官方 Codex-Luna Max | 差异 |
| --- | ---: | ---: | ---: |
| 成绩 | **60 / 89，67.42%** | **75.73% +/- 1.32%** | Codex 的 89.0% |
| 平均 trial 时长 | 1,088.0s | **457.3s** | AILIS 2.38x |
| 逻辑输入/题 | **2.569M** | 3.183M | **少 19.3%** |
| 缓存输入/题 | 1.270M | **3.093M** |  |
| 未缓存输入/题 | 1.299M | **89.9K** | AILIS 14.44x |
| 输出/题 | 23.95K | 23.89K | 基本一致 |
| 输入缓存率 | 49.44% | **97.17%** | -47.73 pp |
| 超时率 | 23.60% | **3.37%** | 当前优化目标 |

| A7 完整 89 题资源 | 结果 |
| --- | ---: |
| 模型 / 工具调用 | 4,273 / 4,306 |
| 逻辑 / 缓存 / 未缓存输入 | 228.63M / 113.02M / 115.61M |
| 输出 Token | 2.131M |
| 单次请求峰值 | 245,017 Token |
| Agent mean / P50 / P95 | 934.1s / 662.6s / 2,617.9s |

### 长期记忆与有状态任务性能

| 评测 | 成绩 | 检索性能 | 端到端时延 | 规模 / 资源 |
| --- | ---: | --- | --- | --- |
| **ToolSandbox frozen holdout** | **71.51%** 均值 | 有状态轨迹评分 | **3.08 分钟/场景** | 239 场景，2,602 次 LLM 调用，22.05M Token |
| **LongMemEval-S** | **71.60%** QA | Session R@8 93.53%；Turn R@8 83.31% | **P50 18.6s / P95 39.1s** | 500 / 500 完成 |
| **PersonaMem Balanced-140** | **65.71%** | Retrieval mean 1.15s；P95 1.78s | **P50 26.41s / P95 53.83s** | 140 / 140 完成；39 / 39 审计通过 |
| **LoCoMo** | **24.69 token-F1** | Session R@8 89.67%；Turn R@8 71.75% | **P50 12.72s / P95 30.44s** | 1,986 / 1,986 完成 |

[完整评测总表](docs/ailis-evaluation-master-scorecard-20260817.md) ·
[机器可读总表](evals/benchmark-catalog/ailis-evaluation-master-scorecard-20260817.json) ·
[Codex Terminal-Bench 官方成绩](https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/6/leaderboards/main/rows/e5f3feda-4629-46ba-963f-300dcf7c2a4c) ·
[GAIA 评测方法](docs/ailis-desktop-real-gaia-eval.md) ·
[A7 上下文基线](docs/ailis-a7-taskagent-context-baseline.md) ·
[长期记忆基线](docs/ailis-memory-bm25-mmr-baseline.md) ·
[ToolSandbox 协议与门禁](docs/ailis-toolsandbox-v4-optimization-plan.md)

## AILIS 是什么

AILIS Assistant 是一个桌面优先的具身 AI 助手项目。它把 3D VRM 角色、Electron 桌面窗口、语音交互、截图视觉上下文、长期记忆，以及结构化 Agent Runtime 放在同一个系统里。

它不只是一个网页聊天机器人。AILIS 的目标是成为真正常驻桌面的个人 AI 助手：可以和用户自然交流，在得到许可时理解屏幕上下文，记住有价值的偏好，并通过可审计、可批准的工具完成实际任务。

## 项目定位

多数 AI 助手项目容易分成两种：一种有角色表现力，但没有稳定执行能力；另一种有自动化能力，却像开发者控制台。AILIS 希望同时保留两边的优势：

- 表层是有存在感、表情、动作、语音和关系感的角色体验。
- 底层是可规划、可路由、可审批、可记录证据、可恢复的 Agent Harness。
- 运行时优先本地桌面，让用户自己的设置、记忆、日志和模型配置留在自己机器上。

## 当前能力

- VRM 桌面角色，支持表情、动作、口型同步和对话气泡。
- Electron 桌宠窗口、聊天窗口、控制面板、托盘集成和本地持久化状态。
- OpenAI 兼容模型提供商配置，支持自定义 base URL 和本地模型工作流。
- 桌面 TTS worker、云端语音路径和可选本地语音识别 worker。
- 基于截图、窗口和区域捕获的权限感知视觉上下文。
- 记忆块、项目上下文、关系状态和轻量反思机制；默认采用经过评测的
  [`BM25 phrase v2 + MMR 0.2`](docs/ailis-memory-bm25-mmr-baseline.md) 本地检索基线，
  默认路径不加载 dense 模型，也不调用检索时 Query Planner。
- 文件、代码、电脑操作、邮件、MCP 技能、Web/Search 和本地运行时工具层。
- 对文件、应用、账号或外部服务有影响的动作使用显式审批模型。
- 在 Agent 执行链路中接入 EMBER-Harness 阶段门控，对不可信输入、工具调用、工具返回和最终输出进行检查。
- 人类化体验评测、工具契约测试、Gateway 检查和 Agent 执行烟测。

## GAIA：通用 Agent 能力

### 同模型完整 165 题对照

当前对照在 GAIA public validation 的全部 165 题上运行 AILIS-Luna 与 native Codex-Luna。两边都使用 `gpt-5.6-luna` medium、相同 manifest 和完整用户可见回答，并由同一个语义评分器判断答案是否与参考答案等价。

| 难度 | AILIS-Luna | Codex-Luna | AILIS 领先 |
| --- | ---: | ---: | ---: |
| L1 | **43 / 53，81.13%** | 41 / 53，77.36% | **+2 题，+3.77 pp** |
| L2 | **64 / 86，74.42%** | 57 / 86，66.28% | **+7 题，+8.14 pp** |
| L3 | **12 / 26，46.15%** | 9 / 26，34.62% | **+3 题，+11.54 pp** |
| **全部** | **119 / 165，72.12%** | **107 / 165，64.85%** | **+12 题，+7.27 pp** |

语义评分读取完整用户可见回答，不要求与金标准逐字一致，也不只依赖短答案抽取器。在该受控协议下，AILIS 在三个难度层级都领先 Codex；但 L3 绝对正确率仍只有 46.15%，是当前最明确的通用能力短板。

这是一组 public validation 上的本地系统诊断，不是 GAIA 私有 test leaderboard 的官方提交。后续优化会优先处理通用 L3 失败机制，例如长链路上下文连续性、可重放原始资源、多来源关系合并和本地计算；不会增加 GAIA 题目提示、站点硬路由或预期答案逻辑。

## TaskAgent A7 上下文基线

TaskAgent A7 现已成为 `main` 上的上下文管理基线。其冻结的
Terminal-Bench 2.1 来源运行取得 **60 / 89（67.42%）**，A6 对照为
**53 / 89（59.55%）**。本次主线落地只保留通用机制：工具层已经控制
边界的结果继续留在 canonical history 中；Luna 使用 272k 输入窗口；
语义压缩在 244.8k 才启动，而不是由少量工具结果触发。

这是开发基线，不是稳定发布声明。来源运行修正了 18 道 A6 失败题，
同时回退了 11 道 A6 正确题，而且目前只有一轮完整结果。详见
[A7 上下文基线](docs/ailis-a7-taskagent-context-baseline.md)和
[机器可读来源](evals/terminal-bench-2.1/A7_BASELINE.json)。

### 早期 GAIA Level 1 运行

当前严格逐题记忆隔离协议冻结在提交 `6afc0ae`。第一轮完整成绩为 **41 / 53（77.36%）**；规定的第二轮尚未计入最终均值和稳定率。第一轮在完成 46 行后遇到 Windows 非正常重启，恢复过程沿用同一个 run ID，跳过全部已完成题目，只执行剩余 7 题；没有重试、替换或重新计分任何失败题。

<p align="center">
  <img alt="AILIS GAIA Level 1 validation 历史诊断结果：81.13%、90.57%，均值 85.85%" src="docs/assets/benchmarks/gaia-l1-validation-20260719.svg">
</p>

AILIS 在同一个固定代码提交上，对 GAIA 2023 Level 1 的 53 道公开 validation 题进行了两次完整运行。Codex ChatGPT OAuth bridge 只提供 `gpt-5.5` 大模型，Agent Harness、上下文管理、工具执行和答案出口均由 AILIS 负责。

| 指标 | 结果 |
| --- | ---: |
| 第一次运行 | 43 / 53，**81.13%** |
| 第二次运行 | 48 / 53，**90.57%** |
| 两次均值 | 45.5 / 53，**85.85%** |
| 稳定通过 | 40 / 53 题两次都正确 |
| 结果一致率 | 42 / 53，**79.25%** |

这些数字目前只保留为历史诊断结果，不再作为严谨的可复现主成绩。事后审计发现，隔离 workspace 并没有禁用同一轮不同题目之间的持久语义记忆检索，因此存在题间污染风险，不能再称为“独立运行”。评测入口现已显式设置 `memoryPolicy: disabled`；必须在新协议下重新全量运行，才能发布替代主成绩。

这属于公开 validation split 上的本地 `desktop-real` 可见答案评测，不是提交到私有 93 题 Level 1 test 排行榜的官方成绩。两轮都使用提交 `4f8f435`、独立 run ID 和隔离 workspace，并禁止 resume、逐题重试、失败题替换和成绩合并，但当时没有严格隔离逐题记忆。详细口径见 [GAIA 评测方法](docs/ailis-desktop-real-gaia-eval.md) 与 [Benchmark Scorecard](docs/ailis-demo-benchmark-scorecard.md)。

## ToolSandbox：有状态工具执行

<p align="center">
  <img alt="AILIS Apple ToolSandbox 离线评测：728/728 个非 RapidAPI 场景完成认证，冻结 holdout 均值 71.51%，定向修复均值 81.49%，稳定性样本均值 88.31%" src="docs/assets/benchmarks/apple-toolsandbox-offline-20260719.svg">
</p>

AILIS 通过正式生产 Agent 链路和官方 on-policy user simulator，完成了全部 **728 个非 RapidAPI** Apple ToolSandbox 场景的官方离线评分。其余 304 个依赖 RapidAPI 的场景不调用、不产生费用，也不进入任何指标。

ToolSandbox 为每个场景返回 `0` 到 `1` 的连续相似度分数，反映任务里程碑完成度和 minefield 规避情况。因此，它更适合被理解为“任务质量分”，而不是简单的二元成功率。这里同时公开多个口径，避免用一个数字掩盖差异：

| 证据口径 | 结果 | 正确解释 |
| --- | ---: | --- |
| 认证覆盖率 | **728 / 728，100%** | 表示评测完整性，不等于任务准确率 |
| 冻结 v3 主 holdout | **71.51%** 均值，239 / 239 有效，0 errors | 当前冻结源码的主要泛化估计 |
| Holdout 非零率 / 满分率 | **81.17% / 38.08%** | 239 个场景中 194 个非零、91 个满分 |
| 定向修复 | **81.49%** 均值，155 / 155 有效，0 零分 | 已分析失败队列的诊断结果，不是无偏全局分数 |
| 稳定性样本 | **75.01% -> 88.31%**，配对 **+13.29 个百分点** | 64 个原正分场景的独立无重大回退证据 |
| 稳定性结果 | 29 提升 / 22 持平 / 13 回退 | 含 2 个严重回退；全部预注册门禁通过 |

对外最应采用的任务质量主分数是冻结 holdout 均值 **71.51%**。由于 v3 和稳定性 primary batch 都是 0 errors，`valid-only` 与 `errors-as-zero` 完全相同。定向修复与稳定性均值回答的是不同问题，不能与 holdout 分数求平均，也不能宣称为随机因果提升。V1、V2、raw 中间结果、跨漂移和 quarantine 结果均不进入主结论。

## 复现与审计

仓库会分别保存 benchmark 计划、逐题结果、进度流、审计事件、完整 transcript 和可读报告。GAIA 回归准入要求 baseline 和 candidate 各自至少完成两次相同任务集的全量运行：

```bash
pnpm bench:gaia:desktop-real:smoke
pnpm bench:gaia:desktop-real:l1
pnpm bench:gaia:compare -- \
  --baseline baseline-run-1.jsonl \
  --baseline baseline-run-2.jsonl \
  --candidate candidate-run-1.jsonl \
  --candidate candidate-run-2.jsonl \
  --expected-tasks 53 \
  --output eval-results/engineering/gaia-regression-gate.md
pnpm eval:ailis-humanlike:longitudinal-agent:validate
pnpm bench:osworld:readiness
```

默认 GAIA 门禁会拒绝任务缺失或替换、可见成功率下降、超时增加、P95 延迟增加超过 15%、平均 token 增加超过 10%，以及稳定正确题变为稳定错误。针对 benchmark 答案编写专用硬路由不属于可接受优化。

## 架构概览

```text
用户 / 语音 / 屏幕
        |
        v
AILIS 桌面 UI
  - VRM 角色
  - 聊天窗口
  - 控制面板
        |
        v
Agent Harness
  - 规划器
  - 工具路由
  - 审批门禁
  - EMBER-Harness 阶段门控
  - 证据日志
  - 恢复循环
        |
        v
运行时服务
  - 模型提供商
  - 语音 / ASR / TTS
  - 视觉捕获
  - 记忆存储
  - 本地工具 / MCP
        |
        v
验证体系
  - 测试
  - 评测
  - 烟测
```

## EMBER-Harness 阶段门控

AILIS 中接入了 EMBER-Harness，用于在智能体执行链路中做阶段级安全控制。它不是只在最后回答处做一次检查，而是在风险内容可能进入或传播的关键边界进行检查：

- 用户输入进入 Agent 上下文之前。
- 工具调用执行之前，尤其是可能产生副作用的操作。
- 工具返回结果重新进入模型上下文之前。
- 最终回答展示给用户之前。

每次检查都会形成可审计记录，包括阶段名称、边界位置、快照哈希、估算词元数、检查决策和可回退的稳定快照。控制面板可将本地安全判定设为“关闭 / 仅观察 / 启用拦截”；关闭时不会加载或下载模型。默认判定器使用量化多语言 DistilBERT ONNX 模型在本机运行，不调用生成式大模型，首次启用约下载 136 MB，缓存保存在持久化 AILIS 状态目录。该轻量模型适合识别显性毒性和仇恨风险，但不能替代细粒度的隐性偏见或刻板印象推理器。也可通过 `AILIS_EMBER_HARNESS`、`AILIS_EMBER_HARNESS_MODE`、`AILIS_EMBER_SAFETY_MODEL` 和阈值环境变量覆盖部署配置；运行状态可通过 `/ember-harness/status` 查看。

## 仓库结构

```text
electron/   Electron 主进程、预加载桥、本地运行时服务和工具适配器
src/        桌宠、聊天、控制面板、语音、视觉 UI、气泡等渲染端应用
backend/    可选 FastAPI 后端、API schema、记忆服务和静态资源
Resources/  VRM 模型、VRMA 动作、参考音频和角色资源
docs/       架构、记忆、工具生态、评测和发布规划文档
evals/      人类化体验场景和长期陪伴评测数据
scripts/    运行时准备、验证、烟测、基准测试和打包脚本
tests/      Runtime、Memory、Tools、Contracts、Gateway、Agent 等测试
```

## 快速启动

安装依赖：

```bash
pnpm install
```

以开发模式启动桌面端：

```bash
pnpm desktop:dev
```

构建并启动桌面端：

```bash
pnpm desktop:start
```

打包 Windows 桌面应用：

```bash
pnpm desktop:package
```

可选后端启动：

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 模型与语音配置

全新安装默认使用 **AILIS Cloud**，用户无需申请或填写 API Key 即可开始对话。Persona 编排、记忆存储、TaskAgent、权限审批以及电脑/文件工具仍在用户电脑上运行；只有提供给模型的推理请求通过 AILIS 服务器中转，并使用短期签名会话和服务器持有的上游凭据。

AILIS 在应用层仍不绑定单一模型供应商。高级用户可以通过桌面控制面板或本地环境文件切换：

- AILIS Cloud 托管中转（默认；需要联网；无需用户 API Key）。
- OpenAI 兼容云端提供商。
- 本地 vLLM endpoint。
- Ollama 方向的本地工作流。
- 自定义 base URL、模型名、请求超时和私有 API Key。
- 可选本地 ASR 和桌面 TTS 运行时准备。

一轮对话中提供给模型的上下文、工具 schema/结果，以及经用户许可加入模型上下文的图片或文件内容，可能经过所选模型服务。工具实际执行和持久化记忆数据库不会迁移到 AILIS 服务器。需要离线或完全本地推理时，请切换到 Ollama 或其他本地 endpoint。

不要把真实 API Key、账号凭证、聊天记录、本地模型缓存、运行日志或生成的评测结果提交到仓库。

## 常用命令

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

完整 Gateway 验证较重，会运行更多 Runtime、契约、工具、记忆、Agent 和烟测检查：

```bash
pnpm ailis:validate-gateway
```

## 核心文档

- [完整文档导航](docs/README.md)
- [具身 Agent 架构](docs/ailis-embodied-agent-architecture.md)
- [System TaskAgent 架构](docs/ailis-system-taskagent-architecture.md)
- [Codex 多 Agent 数据流迁移](docs/ailis-codex-multi-agent-dataflow-migration.md)
- [记忆架构 V2](docs/ailis-memory-architecture-v2.md)
- [人类化体验评测](docs/ailis-humanlike-eval.md)
- [Benchmark 总览与 Scorecard](docs/ailis-demo-benchmark-scorecard.md)
- [工具生态驱动指南](docs/tool-ecosystem-driver-guide.md)

## 项目状态

当前发布线：`v1.4.0`。

AILIS 正在积极开发。它已经具备较完整的桌面运行时、Agent Harness、工具层和评测面，但仍应被视为 alpha 阶段产品/运行时，而不是生产级 Agent OS。近期重点是可靠性：更清晰的工具契约、更安全的审批、更稳定的记忆行为、更顺滑的本地模型配置，以及更高质量的端到端评测。

## 隐私与安全

AILIS 面向个人桌面使用，所以隐私和控制是架构的一部分：

- 视觉捕获需要权限意识，目的是理解上下文，不是静默操作。
- 会影响文件、应用、账号或外部服务的动作应经过显式审批。
- 本地记忆和运行时状态默认留在用户机器上。
- 密钥应放在本地配置中，绝不能进入源码仓库。

## 开源许可

AILIS 源代码采用 [MIT License](LICENSE) 开源。部分随包资源、第三方模型、动作和语音资源可能有独立许可；重新分发前请确认对应资源说明。
