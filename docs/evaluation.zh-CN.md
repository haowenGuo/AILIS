# AILIS 评测成绩

[文档中心](README.zh-CN.md) · [English](evaluation.md) · [完整数据总表](ailis-evaluation-master-scorecard-20260817.md)

AILIS 按端到端 Agent 系统评测：模型、Harness、上下文、记忆、工具、环境和 Verifier 共同决定最终成绩。

## Agent Benchmark

| Benchmark | AILIS | Codex，同模型 |
| :--- | ---: | ---: |
| **GAIA public validation** | **119 / 165 · 72.12%** | 107 / 165 · 64.85% |
| **Terminal-Bench 2.1** | 60 / 89 · 67.42% | **75.73% ± 1.32%** |

GAIA 两边使用相同 165 个 task ID、Luna medium、完整可见答案和同一个语义评分器。Terminal-Bench 使用 Luna Max 与相同 89 题；AILIS 是一轮完整 pass@1，Codex 官网成绩聚合五轮。

### GAIA 分级成绩

| 难度 | AILIS + Luna | Codex + Luna | 差值 |
| :--- | ---: | ---: | ---: |
| L1 | **43 / 53 · 81.13%** | 41 / 53 · 77.36% | +3.77 pp |
| L2 | **64 / 86 · 74.42%** | 57 / 86 · 66.28% | +8.14 pp |
| L3 | **12 / 26 · 46.15%** | 9 / 26 · 34.62% | +11.54 pp |
| **总计** | **119 / 165 · 72.12%** | 107 / 165 · 64.85% | **+7.27 pp** |

### 执行效率

| GAIA，165 题 | AILIS + Luna | Codex + Luna |
| :--- | ---: | ---: |
| 逻辑输入 / 输出 Token | **31.04M / 330.7K** | 68.56M / 497.0K |
| 平均任务时间 | **210.4s** | 255.9s |
| P50 / P95 | **140.1s / 575.0s** | 229.3s / 584.7s |
| 工具事件 | 3,628 | **1,959** |

| Terminal-Bench，89 题 | AILIS A7 | 官方 Codex + Luna Max |
| :--- | ---: | ---: |
| 成绩 | 67.42% | **75.73% ± 1.32%** |
| 平均 Trial 时间 | 1,088.0s | **457.3s** |
| 每题逻辑输入 | **2.569M** | 3.183M |
| 每题缓存输入 | 1.270M | **3.093M** |
| 每题未缓存输入 | 1.299M | **89.9K** |
| 输入缓存率 | 49.44% | **97.17%** |
| 每题输出 | 23.95K | 23.89K |

AILIS 已进入同一档通用任务执行能力，并在两套评测上使用更少的逻辑输入 Token。最大的已测效率差距是稳定前缀复用：Terminal-Bench 每题未缓存输入仍是 Codex 的 14.44 倍，同时对应更长 Trial 和更高超时压力。

## 长期记忆与有状态任务

| 评测 | 成绩 |
| :--- | ---: |
| **Apple ToolSandbox** | **71.51%** frozen holdout 均值 |
| **LongMemEval-S** | **358 / 500 · 71.60%** QA accuracy |
| **PersonaMem Balanced-140** | **92 / 140 · 65.71%** |
| **LoCoMo** | **24.69 token-F1** |

LongMemEval-S 500 题全部完成，0 generation/Judge failure。LoCoMo 1,986 题全部完成；其召回率较高但答案 F1 偏低，说明多跳证据合并仍是记忆系统的主要瓶颈。

## 证据

- [完整成绩与协议数据](ailis-evaluation-master-scorecard-20260817.md)
- [TaskAgent A7 上下文基线](ailis-a7-taskagent-context-baseline.md)
- [GAIA 评测方法](ailis-desktop-real-gaia-eval.md)
- [记忆检索基线](ailis-memory-bm25-mmr-baseline.md)
- [Codex 官方 Terminal-Bench 记录](https://hub.harborframework.com/datasets/terminal-bench/terminal-bench-2-1/6/leaderboards/main/rows/e5f3feda-4629-46ba-963f-300dcf7c2a4c)

GAIA 为 public validation 评测，不是 private-test 排行榜提交。不同 Benchmark 的指标分别呈现，不合成缺乏意义的总分。
