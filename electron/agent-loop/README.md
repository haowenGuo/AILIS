# Agent 执行内核

本目录实现模型决策与工具观察之间的循环。

| 文件 | 职责 |
| --- | --- |
| [index.cjs](index.cjs) | 公共导出 |
| [core-loop.cjs](core-loop.cjs) | 轮次计数与继续信号 |
| [runner.cjs](runner.cjs) | 输入构造、模型请求、工具、审批、观察和运行结果 |

主 Session 的所有权与持久化由目录外的 Gateway 和 Session store 协调。阅读内核时，从 runCoreAgentLoop 的调用开始，沿 Runner 的 runIteration 查看每一轮。

在仓库根执行核心测试：

```powershell
node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs
```

完整说明：[Agent 运行模型](../../docs/design/agent-runtime.md)。
