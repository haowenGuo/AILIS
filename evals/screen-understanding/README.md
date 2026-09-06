# 截图理解评测

该驱动从保存的截图评估应用、活动和界面状态理解，并可调用评审模型分析结果。

在仓库根查看参数：

```powershell
node scripts/run-ailis-screen-understanding-eval.mjs --help
```

运行前指定 --source-run、--output-dir 和 --state-path。--use-configured-vision 使用配置的视觉模型；--no-judge 关闭评审。默认 limit=20、concurrency=2、maxAttempts=2，并发范围为 1–4，尝试范围为 1–2。

执行会读取截图、请求模型并写报告，需准备数据与服务额度。结果包含样本记录、report.json 和 summary.json。

它测量截图理解，不执行点击或完整电脑任务。报告应区分模型请求失败、数据缺失和有效评审。

实现：[驱动](../../scripts/run-ailis-screen-understanding-eval.mjs)。评估口径：[运行观测](../../docs/engineering/measurement.md)。
