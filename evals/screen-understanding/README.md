# 截图理解评测

驱动：[run-ailis-screen-understanding-eval.mjs](../../scripts/run-ailis-screen-understanding-eval.mjs)。评估从已保存截图理解应用、活动、状态、可见问题和置信度；不评估点击、任务规划或最终操作完成。

它只读源截图，但会请求视觉／评审模型、消耗额度并写结果，因此不能简称“无副作用只读测试”。默认源是旧 OSWorld run 的目录，不保证新 checkout 自带这些文件。

## 先看参数

```powershell
node scripts/run-ailis-screen-understanding-eval.mjs --help
```

实际评测前明确 `--source-run`、`--output-dir` 和 `--state-path`；状态文件可含模型凭据，不公开复制。默认评测视觉路径使用 Codex bridge；`--use-configured-vision` 切换为配置的视觉模型。默认开启主模型 judge，`--no-judge` 关闭，不应再引用固定某个 judge 品牌的旧说明。

默认 20 个样本、并发 2；并发被限制到 1–4。`--limit`、`--only-id`、`--samples-per-domain` 用于选择样本，`--max-attempts` 限为 1–2 次基础设施尝试。真实请求前取得相应授权，不因 help 能运行就自动开跑。

## 输出与解释

输出包括样本配置与结果、`report.json` 和 `summary.json`。应用／活动／状态、可用性和 hallucination 汇总来自 judge；未评审时不应假造分数。模型失败、缺数据和无有效评审要分别报告。

这些是截图描述的辅助模型评分，不是 OSWorld 官方任务完成率。通用质量、usage、缓存和时延口径见 [评估手册](../../docs/evaluation.md)。
