# 历史手工 smoke 数据说明

该目录保留手工文件任务的输入数据，不是当前代码的官方基准成绩，也不是正在运行的评测任务：

- [daily_temp_sf_high.csv](terminal-02-temperatures/daily_temp_sf_high.csv) 与 [daily_temp_sf_low.csv](terminal-02-temperatures/daily_temp_sf_low.csv)：日期与温度处理样例。
- [access_log](terminal-03-access-log/access_log)：日志统计样例。

本次文档整理没有改输入数据。原先混在说明中的历史任务文本、答案和硬编码 `F:\AILIS\main` 路径已退出当前手册；完整原稿可只读查看：

```powershell
git show 00b3244:manual-tests/benchmark-smoke-20260826/README.md
```

若要重新做手工 smoke，把所需输入复制到明确的 scratch 目录，以当前实际路径提问，并独立核验产物。不要写进另一个工作树，不把答案提前放进受测 Session，不把 Windows 改写版或几条记忆问答计为官方 Terminal-Bench／GAIA／LoCoMo 分数。

真实测试另存代码身份、输入、工具结果和验收证据；规则见 [评估手册](../../docs/evaluation.md)。
