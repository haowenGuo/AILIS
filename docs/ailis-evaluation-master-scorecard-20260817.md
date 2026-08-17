# AILIS 全量评测数据总表

生成日期：2026-08-17

这份文档统一整理目前本机可追溯的 AILIS 评测，包括 GAIA、Terminal-Bench 2.1、OSWorld、SWE-bench Pro、Apple ToolSandbox、LongMemEval-S、LoCoMo、PersonaMem，以及内部可靠性评测。

## 1. 统计原则

为了避免“看起来分数很多，但彼此不能比较”，本文使用四个证据等级：

1. **正式/冻结成绩**：任务集合固定、结果完整、评分器有效、无基础设施 invalid 混入。
2. **完整本地诊断**：完整任务集，但属于 public validation、本地 judge 或单轮运行，不能冒充官方 leaderboard。
3. **样本/开发成绩**：smoke、mini、focused、partial，只用于定位能力，不能外推总体分数。
4. **无成绩**：只有数据、环境、preflight 或 harness selftest，没有真实任务质量分。

不同 benchmark 的指标也不能直接求平均：ToolSandbox 是连续轨迹相似度，GAIA 是答案正确率，LoCoMo 是 token F1，Terminal-Bench 和 SWE-bench 是 verifier pass rate。

## 2. 当前总览

| Benchmark | 当前 AILIS 结果 | 规模 | 模型/协议 | 证据等级 |
|---|---:|---:|---|---|
| Apple ToolSandbox | **71.51%** 连续质量均值 | 239/239 frozen holdout，0 errors | production Agent + 官方 on-policy user simulator | **正式冻结主成绩** |
| GAIA public validation | **119/165，72.12%** | L1-L3 全部 165 题 | AILIS + Luna medium，完整可见回答语义评分 | **完整本地诊断** |
| Terminal-Bench 2.1 | **60/89，67.42%** | 完整 89 题 pass@1 | TaskAgent A7 + Luna Max，Harbor 0.20.0 | **完整单轮成绩** |
| SWE-bench Pro | **6/11，54.55%** | 固定 smoke-11 | AILIS TaskAgent + Luna medium，官方 verifier | 样本成绩 |
| OSWorld | **9/15，60.00%** | 计划 36 题中已评分 15 题 | AILIS + Luna medium，官方 per-task evaluator | **未完成开发批次** |
| LongMemEval-S | **358/500，71.60%** | 500/500 完成 | BM25 phrase v2 + MMR；Luna Reader/Judge | 完整本地协议 |
| PersonaMem Balanced-140 | **92/140，65.71%** | 140/140 完成 | Ledger + BM25/MMR + Luna medium | 内部工程集 |
| LoCoMo | **24.69 token-F1** | 1986/1986 完成 | BM25 phrase v2 + MMR | 完整本地协议 |
| Humanlike longitudinal | **78.46/100** | 171 judged checkpoints | 内部 companion judge | 内部产品质量 |

### 可以对外采用的主张

- ToolSandbox：冻结 holdout 均值 `71.51%`。
- GAIA：完整 public validation 本地语义分 `119/165 (72.12%)`，但不是 private test leaderboard。
- Terminal-Bench：A7 单轮完整 `60/89 (67.42%)`，尚未完成 k=5 稳定性协议。

### 不能对外扩大的主张

- OSWorld 尚无完整 `test_small`、完整 36 题或 OSWorld-Verified 总分。
- SWE-bench Pro 只有 11 题固定样本，不能称为 731 题全榜分数。
- LongMemEval-S 使用本地 Luna Judge，不能直接与不同 judge 的 leaderboard 排名比较。

## 3. GAIA

### 3.1 当前同模型完整对照

AILIS 和 native Codex 使用相同 `gpt-5.6-luna` medium、相同 165 个 public-validation task ID，以及相同的完整可见回答语义评分器。

| Level | AILIS-LUNA | Codex-LUNA | AILIS 差值 |
|---|---:|---:|---:|
| L1 | **43/53，81.13%** | 41/53，77.36% | +2，+3.77 pp |
| L2 | **64/86，74.42%** | 57/86，66.28% | +7，+8.14 pp |
| L3 | **12/26，46.15%** | 9/26，34.62% | +3，+11.54 pp |
| **总计** | **119/165，72.12%** | **107/165，64.85%** | **+12，+7.27 pp** |

这组是目前最公平的 GAIA Harness 对照。它说明 AILIS 在相同模型下有系统增益，但 L3 绝对正确率仍只有 `46.15%`。

### 3.2 为什么还存在 102/165 与 106/165

同一批答案最初由 exact/visible scorer 评分：

| 系统 | exact/visible scorer | 统一语义 scorer |
|---|---:|---:|
| AILIS A6/LUNA | 102/165，61.82% | **119/165，72.12%** |
| native Codex/LUNA | 106/165，64.24% | **107/165，64.85%** |

AILIS 增加的 17 题主要来自“完整回答语义正确，但 exact-answer extractor 或格式不完全匹配”。因此 `72.12%` 是评分口径升级后的当前主分，不是又执行了一次并凭空多答对 17 题。

### 3.3 AILIS-LUNA 与 Codex-LUNA 资源

| 指标 | AILIS A6 exact run | Codex Luna exact run | 说明 |
|---|---:|---:|---|
| 任务 | 165 | 165 | 同一 manifest |
| exact correct | 102 | 106 | 语义重评分别为 119、107 |
| 输入 Token | 31.04M | 68.56M | AILIS transport 未报告缓存 |
| 缓存输入 | 0（遥测缺失） | 60.88M | AILIS 的 0 不能解释成真正无缓存 |
| 输出 Token | 330.7K | 497.0K |  |
| 总 Token | 31.37M | 69.06M gross | Codex effective token 为 8.18M |
| 未缓存输入 | 不可得 | 7.69M |  |
| 缓存率 | 不可得 | 88.79% |  |
| 模型调用 | 1,881 | 未统一披露 | AILIS 来自 accepted result events |
| 工具完成事件 / 调用 | 3,628 events | 1,959 calls | 两边埋点定义不同，不能直接比倍率 |
| 平均时延 | 210.4s | 255.9s |  |
| P50 / P95 | 140.1s / 575.0s | 229.3s / 584.7s |  |
| capability timeout | accepted 集不含 invalid | 4/165 |  |

### 3.4 GAIA L1 双轮正式门禁演进

固定任务为相同 53 道 L1，每个版本两轮。

| 版本 | 两轮得分 | 均值 | 稳定通过 | 稳定失败 | Response OK | 平均延迟 | P95 | 总 Token | 门禁 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 冻结基线 `6afc0ae` | 41、43 | 79.25% | 38 | 7 | 101/106 | 236.1s | 723.4s | 16.61M | 参考 |
| P0 `8ebc1e5` | 47、50 | **91.51%** | **46** | **2** | 102/106 | **181.6s** | **539.2s** | **14.92M** | **PASS** |
| P1 `7ba2cf7` | 48、48 | 90.57% | 44 | 1 | **105/106** | 197.8s | 709.2s | 16.03M | FAIL |
| P1.1 `e135213` | 45、42 | 82.08% | 41 | 7 | 104/106 | 260.2s | 754.3s | 15.49M | FAIL |

P0 是最清晰的成功样板：确定性路径/附件/子进程修复同时提高正确率、降低 Token 和延迟，而且没有让冻结基线稳定正确题双轮都失败。P1/P1.1 则表现出典型“局部恢复、全局回退”。

### 3.5 固定 mini20 跨级筛选

样本固定为 L1 8、L2 8、L3 4；只用于筛选，不能用于版本晋升。

| 排名 | 系统 | 总分 | L1 | L2 | L3 | Response OK | 平均时延 | Token |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | Codex | **16/20** | 8/8 | 5/8 | 3/4 | 19/20 | 153.2s | 1.24M |
| 2 | P1 | 14/20 | 8/8 | 4/8 | 2/4 | 19/20 | 368.7s | 4.22M |
| 3 | P6 | 13/20 | 7/8 | 4/8 | 2/4 | 20/20 | 266.3s | 4.65M |
| 4 | P0 | 12/20 | 7/8 | 2/8 | 3/4 | 20/20 | 348.5s | 4.43M |
| 4 | P5 | 12/20 | 7/8 | 4/8 | 1/4 | 19/20 | 301.1s | 4.63M |
| 4 | P8 | 12/20 | 7/8 | 3/8 | 2/4 | 20/20 | 280.5s | 4.38M |
| 7 | P2 | 11/20 | 7/8 | 3/8 | 1/4 | 20/20 | 351.4s | 4.11M |
| 7 | P7 | 11/20 | 6/8 | 4/8 | 1/4 | 18/20 | 399.4s | 4.24M |
| 9 | P1.1 | 10/20 | 7/8 | 2/8 | 1/4 | 20/20 | 388.2s | 4.17M |
| 9 | P3.1 | 10/20 | 7/8 | 1/8 | 2/4 | 19/20 | 308.4s | 4.03M |
| 9 | P10 | 10/20 | 6/8 | 2/8 | 2/4 | 19/20 | 414.2s | 4.49M |
| 12 | P9 | 9/20 | 6/8 | 2/8 | 1/4 | 20/20 | 301.5s | 4.38M |
| 12 | P4 | 9/20 | 7/8 | 2/8 | 0/4 | 20/20 | 238.9s | 3.32M |

### 3.6 validation165 重要历史版本

| 版本/协议 | 成绩 | L1/L2/L3 | Token | 平均时延 | P95 | 结论 |
|---|---:|---:|---:|---:|---:|---|
| 原始 P1，严格审计 | 105/165，63.64% | 46/50/9 | 33.07M | 337.8s | 826.0s | 早期质量参照 |
| 同期 Codex，严格审计 | 130/165，78.79% | 46/64/20 | 11.74M | 198.7s | 597.4s | 非 Luna 同模型对照 |
| native transport `a4baea3` | 96/165，58.18% visible | 41/46/9 | 15.00M | 542.9s | 912.1s | Token 降但质量、延迟回退 |
| batched web `de756a4` | 102/165，61.82% visible | 42/49/11 | 13.92M | 150.0s | 330.0s | 效率型工程基线 |
| A4 `b6f6dc0` | 106/165，64.24% 保守 | 41/56/9 | 13.43M/164 | 113.7s | 237.4s | 164/165，全球门禁 FAIL |
| A6 natural termination | 102/165 exact；119/165 semantic | 38/50/14 exact | 31.37M | 210.4s | 575.0s | 当前语义主分来源 |
| P1 + Luna unchanged finalization | 54/165 exact | 24/28/2 | 41.23M | 277.0s | 未汇总 | final prompt collapse 的强负面证据 |
| native Codex + Luna | 106/165 exact；107/165 semantic | 42/56/8 exact | 69.06M gross / 8.18M effective | 255.9s | 584.7s | 当前公平对照 |

## 4. Terminal-Bench 2.1

### 4.1 A6 -> A7

| 指标 | A6 | A7 | 变化 |
|---|---:|---:|---:|
| 成绩 | 53/89，59.55% | **60/89，67.42%** | **+7，+7.87 pp** |
| A6 错题修正 | - | 18 |  |
| A6 对题回退 | - | 11 |  |
| Semantic compaction | 20 | **4** | -80% |
| 峰值请求 prompt | 67,381 | **245,017** | 保留更多真实工具反馈 |
| infrastructure invalid | - | 0 | 当前 A7 正式分 |

A7 是当前 TaskAgent context baseline：保留工具层已经控界的 canonical output，只在约 244.8k token 压力下语义压缩，不再因为工具结果超过 6 条就压缩，也不再把旧输出统一截到 900 字符。

### 4.2 A7 资源

| 指标 | A7 完整 89 题 |
|---|---:|
| 模型调用 | 4,273 |
| 工具调用 | 4,306 |
| 逻辑输入 Token | 228.63M，2.569M/题 |
| 缓存输入 Token | 113.02M，1.270M/题 |
| 未缓存输入 Token | 115.61M，1.299M/题 |
| 输出 Token | 2.131M，23.95K/题 |
| 输入缓存率 | 49.44% |
| 语义压缩 | 4 |
| 峰值 prompt | 245,017 Token |
| Agent 平均 / P50 / P95 | 934.1s / 662.6s / 2617.9s |
| 完整 trial 平均 | 1088.0s |
| AgentTimeoutError | 21/89，23.60% |

### 4.3 A7 与官方 Codex + Luna Max

| 指标 | AILIS A7 | 官方 Codex + Luna Max | 差异 |
|---|---:|---:|---:|
| 成绩 | 67.42% | **75.73% +/- 1.32%** | -8.31 pp |
| 运行数 | 89 | 445（5 x 89） | 单轮 vs k=5 |
| 平均 trial | 1088.0s | **457.3s** | AILIS 2.38x |
| 逻辑输入/题 | 2.569M | 3.183M | Codex 反而更多 |
| 缓存输入/题 | 1.270M | 3.093M |  |
| 未缓存输入/题 | 1.299M | **89.9K** | AILIS 14.44x |
| 输出/题 | 23.95K | 23.89K | 基本相同 |
| 缓存率 | 49.44% | **97.17%** | -47.73 pp |
| timeout | 21/89，23.60% | 15/445，3.37% | AILIS 约 7.0x |

结论不是“A7 给模型的数据太多”。Codex 每题逻辑输入更多，但稳定 canonical prefix 使绝大多数成为缓存命中。AILIS 的主要结构性成本仍是未缓存 prefill 和超时。

## 5. OSWorld

### 5.1 最新已评分开发批次

目录目标是 comparable-36，但目前只有 15 个 per-task official summary。因此这是 `9/15` partial，不是 36 题总分。

| Domain | 正确/任务 | 正确率 |
|---|---:|---:|
| Chrome | 3/4 | 75% |
| LibreOffice Calc | 1/1 | 100% |
| Multi-apps | 4/8 | 50% |
| OS | 1/2 | 50% |
| **总计** | **9/15** | **60%** |

- 15/15 都有官方 per-task evaluator score。
- runner error 为 0。
- 平均任务时长 264.47 秒。
- 主要弱项是跨应用和 OS 级任务，不是单一 Chrome 设置任务。

### 5.2 其他 OSWorld 证据

| 运行 | 结果 | 说明 |
|---|---:|---|
| Clean Chrome smoke | 1/1，score 1.0 | 8 GUI actions，205.214s，Luna medium |
| Development gate smoke | 1/1，score 1.0 | 单题环境/执行验证 |
| Historical small run | 2/4，50% | 样本太小，只作早期信号 |
| Readiness | 15/15 required actions present | 工具覆盖，不是任务分数 |

当前不能宣称“OSWorld 60% 正式成绩”，更准确的表达是“15 个已完成开发任务 9/15，完整批次仍未完成”。

## 6. SWE-bench Pro

### 6.1 最新固定 smoke-11

11 个唯一 instance 均有 ScaleAI 官方 verifier 布尔结果，合计：

| 结果 | 数值 |
|---|---:|
| Resolved | **6/11** |
| Resolve rate | **54.55%** |
| 模型 | `gpt-5.6-luna`, medium |
| Agent | AILIS TaskAgent，clean production pass@1 |
| 资源 | 分片记录不完整，不能可靠合并总 Token/时延 |

目录名中的 `codex-model-bridge` 是 Luna 的调用 transport，不代表使用 native Codex Agent。工具选择、上下文、轮次和 patch 生成仍由 AILIS TaskAgent 完成。

### 6.2 历史 smoke

| 运行 | 结果 | 额外信息 |
|---|---:|---|
| DeepSeek V4 Flash，NodeBB | 0/1 | 297/300 selected tests 通过；232 turns；10.74M prompt + 84.6K completion；9.64M cached |
| AILIS + Luna medium smoke-3 | 1/3，33.33% | 524/531 official tests；107 turns；2.410M total token；1698.6s |
| AILIS + Luna medium smoke-11 | 6/11，54.55% | 最新固定小样本 |

这项目前只能说明 AILIS 已具备真实仓库修复和官方容器验证能力。11 题置信区间很宽，尚不足以判断全榜软件工程能力。

## 7. Apple ToolSandbox

ToolSandbox 返回 `0..1` 连续轨迹相似度，不是简单 pass/fail。

| 证据 | 结果 | 解释 |
|---|---:|---|
| 非 RapidAPI 认证覆盖 | 728/728 | 完整性，不是准确率 |
| Frozen V3 holdout | **71.51% mean** | 239/239 scored，0 errors，主分 |
| Holdout non-zero | 194/239，81.17% | 非零不等于任务完全成功 |
| Holdout perfect | 91/239，38.08% | 完全分 |
| Holdout hard zero | 45/239，18.83% | 长尾失败 |
| Targeted recovery | 81.49% mean | 155/155，选择条件诊断，不能当无偏主分 |
| Stability sample | 75.01% -> 88.31% | 64 题配对 +13.29 pp；29 improved / 22 unchanged / 13 regressed |

Frozen holdout 资源：

- 2,602 次 AILIS + user-simulator 模型调用。
- 22,053,949 Token，约 92,276/场景。
- 2,259 official interaction turns。
- 累计 44,179,549ms，约 3.08 分钟/场景。

## 8. 长期记忆与检索

### 8.1 LongMemEval-S

| 指标 | 结果 |
|---|---:|
| 完成 | 500/500，0 generation/judge failures |
| QA accuracy | **71.60%（358/500）** |
| Session R@8 | 93.53% |
| Turn R@8 | 83.31% |
| E2E P50 / P95 | 18.6s / 39.1s |

分类型：single-session user 94.29%，multi-session 57.14%，preference 63.33%，temporal 74.44%，knowledge update 80.77%，assistant history 62.50%。最大短板是 multi-session join，而不是单次事实召回。

### 8.2 PersonaMem Balanced-140

| 指标 | 结果 |
|---|---:|
| 正确 | **92/140，65.71%** |
| Retrieval mean / P95 | 1.15s / 1.78s |
| E2E P50 / P95 | 26.41s / 53.83s |
| Ledger/slice/write-chain audits | 39/39 |

### 8.3 LoCoMo

| 指标 | 结果 |
|---|---:|
| 完成 | 1986/1986 |
| Released token F1 | **24.69%** |
| Session R@8 / Turn R@8 | 89.67% / 71.75% |
| E2E P50 / P95 | 12.72s / 30.44s |

分类 token F1：multi-hop 16.61%，temporal 31.80%，open-domain 12.84%，single-hop 28.06%，adversarial 20.85%。高 retrieval recall 与低 answer F1 同时存在，说明剩余瓶颈在多跳证据合并、拒绝无支撑答案和简洁答案构造。

## 9. 内部可靠性与产品质量

| Eval | 结果 | 性质 |
|---|---:|---|
| Humanlike dataset validation | 1000/1000 valid | 数据覆盖，不是模型质量 |
| Humanlike longitudinal | 78.46/100；pass 61.4%；16 hard fails | 171 checkpoints 内部产品分 |
| Tool-feel smoke | 81.37/100；pass 83.3% | 6 checkpoints smoke |
| Artifact tools | 10/10 | deterministic runtime regression |
| Execution bench | code repair/process session/safety/transcript 全部 true | harness regression |
| DeepSeek reasoning replay | 9/30 -> **30/30**；provider error 21 -> 0 | 协议修复验证 |
| DeepSeek 36-turn stress | **36/36 turns；101/101 effective checks** | 0 reasoning protocol errors |

DeepSeek 36-turn stress 的资源为 5,792,337 prompt Token、60,237 completion Token、1,116,626ms wall time。TaskAgent 执行正确不等于 Persona 最终呈现正确：该次验证另有 31/36 Persona/TaskAgent exact mismatch，说明最终呈现层仍应独立评分。

## 10. 尚无可报告成绩

| Benchmark | 当前状态 |
|---|---|
| BrowseComp-Plus | 830-query 数据/index/judge 环境未完成，没有正式分数 |
| SWE-bench Lite | 有样本和 1/1 harness selftest，但没有公开 benchmark run 分数 |
| WebArena | catalog entry，无本地分数 |
| BrowserGym | catalog entry，无本地分数 |
| AppWorld | catalog entry，无本地分数 |
| BFCL | catalog entry，无本地分数 |
| tau2-bench | catalog entry，无本地分数 |
| WorkArena | catalog entry，无本地分数 |

## 11. 综合判断

1. **当前最可信的通用任务信号是 GAIA 72.12% 与 Terminal-Bench 67.42%。** 前者显示同模型 Harness 增益，后者显示真实终端长任务仍落后 Codex 8.31 pp。
2. **Terminal-Bench 的核心结构差距仍是缓存与超时。** A7 输出量与 Codex 几乎相同，逻辑输入还更少，但未缓存输入/题高 14.44 倍，平均 trial 高 2.38 倍。
3. **OSWorld 证据不足。** 9/15 是有价值的开发信号，但不能代表完整桌面能力；multi-app 和 OS 各只有 50%。
4. **SWE-bench Pro 初步信号不差，但样本太小。** 6/11 必须通过固定更大样本或完整集验证，不能在 11 题上做过度优化。
5. **记忆系统的检索明显强于答案合成。** LongMemEval 71.60%，但 LoCoMo token F1 24.69%；通用改进方向应是多跳证据组合和 canonical state，而不是继续单纯提高 recall。
6. **局部正确不等于全局晋升。** GAIA P1.1 focused 3/3 后双轮均值仍从 P0 的 91.51% 跌到 82.08%；A7 修正 18 题同时回退 11 题。因此以后候选仍需“失败侧修复 + 正确侧控制 + 完整固定集”三段门禁。

## 12. 证据路径

- 当前主线总览：`README.md`
- A7：`evals/terminal-bench-2.1/A7_BASELINE.json`
- A7 说明：`docs/ailis-a7-taskagent-context-baseline.md`
- ToolSandbox：`docs/ailis-toolsandbox-v4-optimization-plan.md`
- 记忆：`docs/ailis-memory-bm25-mmr-baseline.md`
- OSWorld clean smoke：`evals/engineering/osworld-clean-task-agent-smoke.json`
- OSWorld partial：`eval-results/engineering/osworld-execution-control-comparable36-luna-medium-20260816-v1/`
- SWE-bench Pro：`eval-results/engineering/swebench-pro/ailis/`
- DeepSeek replay：`.ailis-state/manual-tests/DEEPSEEK_REASONING_REPLAY_VALIDATION_20260816.md`
- DeepSeek stress：`.ailis-state/manual-tests/DEEPSEEK_PROTOCOL_STRESS_36_VALIDATION_20260816.md`
- GAIA 历代：`F:/AILIS_self_evolution_runtime/eval-results/engineering/gaia-desktop-real/GAIA-ALL-VERSIONS-CODEX-COMPARATIVE-ANALYSIS-20260802.md`
- GAIA mini20：`F:/AILIS_self_evolution_runtime/eval-results/engineering/gaia-desktop-real/p0-p10-mini20-score-20260728/mini-score-results.md`
- Terminal A7/Codex：`F:/AILIS_self_evolution_runtime-terminal-bench-21-timeout-recovery/evals/terminal-bench-2.1/analysis/A7_CODEX_EXECUTION_CHAIN_OPTIMIZATION.md`

机器可读版本：`evals/benchmark-catalog/ailis-evaluation-master-scorecard-20260817.json`。
