# AILIS Humanlike Experience Eval

这套 Eval 用来评估 AILIS 是否像一个长期陪伴型私人助手，而不是只评估回答对错。

## 评估对象

- 普通对话回复文本。
- 语音文本、TTS 风格、表情、动作、气泡文字。
- 视觉理解后的自然回复。
- 记忆和好感度对表达的影响。

## 核心指标

| 指标 | 含义 |
| --- | --- |
| `persona_consistency` | 人设一致性，是否一直像 AILIS |
| `naturalness` | 语气自然度，避免过度卖萌、过度解释、过度工具化 |
| `memory_usefulness` | 记忆使用质量，合理使用偏好，不暴露内部好感度 |
| `emotional_fit` | 情绪响应，疲惫、烦躁、开心、求助时是否合适 |
| `multimodal_sync` | 多模态同步感，语音、表情、动作、口唇、气泡是否一致 |
| `low_tool_feeling` | 低工具感，用户是否感觉是 AILIS 在帮忙 |
| `relationship_stage_fit` | 关系阶段匹配度，亲密感是否符合好感度 |
| `task_completion` | 任务完成能力，从用户角度看当前请求是否被完成、推进，或诚实说明卡点和下一步 |

## 好感度规则

| 好感度 | 期望 |
| --- | --- |
| 40-60 | 温和、熟悉但不过分亲密 |
| 61-79 | 更熟悉、更自然、更有陪伴感 |
| 80-100 | 允许明显亲密、主动、轻微撒娇、更多默契表达 |

任何阶段都不能影响安全、隐私、事实准确性、工具审批和基础帮助质量。

## 数据集

种子集在：

```text
evals/ailis-humanlike/scenarios.jsonl
```

1000 条正式数据集的覆盖规划在：

```text
evals/ailis-humanlike/dataset-plan.json
```

每条样例包含：

- `id`
- `category`
- `affinity_score`
- `user_message`
- `memory_context`
- `expected_behavior`
- `anti_patterns`
- `modalities`

后续扩到 1000 条时，建议按这些桶采样：

- 情绪陪伴
- 长期记忆
- 人设一致性
- 低工具感
- 视觉理解
- 多模态同步
- 关系阶段匹配
- 任务开场体验

目标分布：

| 类别 | 目标数量 |
| --- | ---: |
| `emotional_response` | 160 |
| `memory_use` | 150 |
| `relationship_stage` | 140 |
| `low_tool_feeling` | 130 |
| `multimodal_sync` | 120 |
| `vision_experience` | 100 |
| `task_helpfulness` | 100 |
| `correction` | 60 |
| `safety_privacy_boundary` | 40 |

好感度覆盖：

| 好感度 | 目标比例 | 体验要求 |
| --- | ---: | --- |
| 0-39 | 10% | 克制、认真、快速修正 |
| 40-60 | 35% | 温和、熟悉但不过分亲密 |
| 61-79 | 30% | 更熟悉、更自然、更有陪伴感 |
| 80-100 | 25% | 允许明显亲密、主动、轻微撒娇、更多默契表达 |

每条样例都必须有 `expected_behavior` 和 `anti_patterns`。这是 Judge 稳定性的核心：同一个候选回复被重复评估时，Judge 应优先对齐这些显式标准，而不是按个人偏好漂移。

## Judge 规则

规则实现位置：

```text
electron/ailis-humanlike-eval.cjs
```

核心原则：

- Judge 只根据 `scenario`、`candidate_response` 和 rubric 打分。
- 每个指标 1-5 分，最后按权重汇总成 0-100。
- Judge 的主视角是用户体验，不是 Agent Loop 调试。工具执行摘要只作为事实证据，用来判断“我看过/做完了”这类说法是否有依据。
- 好感度 80-100 的明显亲密、主动、轻微撒娇是产品目标，不应被默认扣分。
- 任何阶段都不能牺牲安全、隐私、事实准确性和工具审批。
- `task_completion` 不是只看工具是否成功。普通陪伴请求也要判断是否真的安抚、总结、建议或收束；复杂任务则看是否完成、推进、请求确认或诚实停住。
- 如果回复暴露内部好感度、memory_context、tool_call、raw observation，触发硬失败。
- 如果视觉或记忆内容没有依据却说得很确定，触发硬失败或重扣。
- 如果没有提供语音、表情、动作等信息，`multimodal_sync` 最多 3 分，除非场景不涉及多模态。

## 由当前 Codex 会话担任强 Judge

当前桌面会话里的 Codex 可以作为强 Judge 做人工确认级评估，但工程上不能假装本地脚本能直接调用“这个聊天窗口里的我”。可靠做法是使用 Judge Packet：

1. Runner 导出标准 Judge Packet。
2. 把 packet 交给当前 Codex 会话评审。
3. Codex 只返回一行 JSON judgment，不输出解释性 Markdown。
4. Runner 再导入 JSONL judgment，生成统一 summary。

导出 Judge Packet：

```powershell
pnpm eval:ailis-humanlike -- --responses evals/ailis-humanlike/example-responses.jsonl --export-judge-packets --limit 1
```

把输出的 `.judge-packets.jsonl` 交给强 Judge 后，保存为一行一个 JSON 对象的文件，例如：

```text
eval-results/ailis-humanlike/manual-judgments.jsonl
```

再导入汇总：

```powershell
pnpm eval:ailis-humanlike -- --responses evals/ailis-humanlike/example-responses.jsonl --judgments eval-results/ailis-humanlike/manual-judgments.jsonl
```

这样每次评估都留下三类证据：

- 输入：scenario + candidate response + Judge Packet
- 输出：Judge 返回的 JSON judgment
- 汇总：Runner 生成的 result JSONL 和 summary JSON

如果以后接 API Judge，则仍走同一套 rubric 和 parser，只是由 Runner 直接调用模型。

## 运行

生成 1000 条正式场景：

```powershell
pnpm eval:ailis-humanlike:generate
```

生成覆盖分析报告：

```powershell
pnpm eval:ailis-humanlike:report
```

只校验数据集：

```powershell
pnpm eval:ailis-humanlike:validate
```

生成并校验 30 天长程陪伴基准：

```powershell
pnpm eval:ailis-humanlike:longitudinal:generate
pnpm eval:ailis-humanlike:longitudinal:validate
```

这套长程基准在：

```text
evals/ailis-humanlike/longitudinal-companionship-30d.dataset.json
evals/ailis-humanlike/longitudinal-companionship-30d.scenarios.jsonl
```

`.dataset.json` 是产品侧长程陪伴原始数据，结构是 `case -> 第 N 天 -> 用户对话 1/2/3...`，适合人工检查和继续扩写。`.scenarios.jsonl` 是从原始数据派生出的 Eval runner 格式。

它包含 10 条长程样例，每条都是 30 天历史，每天 12 次用户对话，总计 3600 次用户输入。每天混合真实私人助手场景：情感陪伴、邮件、论文阅读、Word/表格脚本、GitHub 提交、视觉截图、ASR、TTS/口唇/气泡、多模态同步、Tool/MCP/Skill、审批与隐私、重启恢复和 max steps 表达。

真实 Agent 长程评估建议先跑单条烟测：

```powershell
pnpm eval:ailis-humanlike:longitudinal:real -- --limit 1
```

确认模型上下文、超时和费用都可接受后，再跑完整 10 条：

```powershell
pnpm eval:ailis-humanlike:longitudinal:real
```

更严格的全流程长程评估使用 Evaluation Agent，不再只评每条 30 天历史的最后一句，而是抽取邮件、论文、Word/表格、GitHub、视觉、ASR/多模态、记忆、隐私审批、Tool/MCP/Skill 和月末总结等 checkpoint 逐个生成候选回复，再用 LLM-as-judge 按完整指标评分：

```powershell
pnpm eval:ailis-humanlike:longitudinal-agent:validate
pnpm eval:ailis-humanlike:longitudinal-agent:smoke
pnpm eval:ailis-humanlike:longitudinal-agent
```

默认 `checkpoint-mode=critical`，用于覆盖每条 case 的关键任务节点；`--checkpoint-mode daily` 会每天抽 3 个 turn；`--checkpoint-mode all` 会评估全部 3600 个用户 turn。默认 `history-mode=full`，会把当前 checkpoint 前的长程历史送给 Agent，真正测试上下文承压能力。

评估已有回复：

```powershell
pnpm eval:ailis-humanlike -- --responses evals/ailis-humanlike/example-responses.jsonl --judge-base-url <base> --judge-model <model> --judge-api-key <key>
```

连接正在运行的 AILIS Gateway，生成真实 AILIS 回复后再评：

```powershell
pnpm eval:ailis-humanlike -- --generate-with-agent --gateway-url http://127.0.0.1:19777 --judge-base-url <base> --judge-model <model> --judge-api-key <key>
```

输出在：

```text
eval-results/ailis-humanlike/
```

原始 13 条种子样例保留在：

```text
evals/ailis-humanlike/scenarios.seed.jsonl
```

## 稳定性检查

建议每次改 Eval 后运行：

```powershell
node --check electron\ailis-humanlike-eval.cjs
node --check scripts\run-ailis-humanlike-eval.mjs
pnpm test:ailis-humanlike-eval
pnpm eval:ailis-humanlike:validate
```

评估有效性不只看平均分，还要看：

- `hard_fail_count` 是否为 0。
- `by_category` 是否暴露某类体验短板。
- `by_relationship_stage` 是否验证 40-60、61-79、80-100 三段亲密度差异。
- `metric_averages.memory_usefulness` 是否因为乱用记忆下降。
- `metric_averages.low_tool_feeling` 是否因为工具日志感下降。
