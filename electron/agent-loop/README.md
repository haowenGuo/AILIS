# AILIS Agent Loop

这里是 Agent 执行链的规范代码边界。

- `core-loop.cjs`：最小、真实、带完整中文注释的生产 Agent Loop。**第一次先读它。**
- `index.cjs`：稳定公共入口。
- `runner.cjs`：每一轮的具体业务，包括上下文、LLM 决策、工具执行、Observation、审批恢复和最终结果组装。

建议按下面顺序阅读：

1. 完整阅读 `core-loop.cjs`，先掌握轮次怎样继续和结束。
2. 在 `runner.cjs` 中搜索 `const runIteration = async`，它是交给 Core Loop 的“一整轮业务”。
3. 顺着 `Round 1/5` 到 `Round 5/5` 的注释，理解一轮怎样完成 Context → Decision → Action → Observation。
4. 最后再看 `runMessage()`，理解新任务、审批恢复和调试恢复怎样进入同一个 Loop。

`core-loop.cjs` 是生产代码，由 `runner.cjs` 直接调用。主对话使用统一 Agent；显式任务 API 仍复用同一内核。旧转发入口已删除，测试也直接使用 `index.cjs`。

只运行 Core Loop 的三个最小测试：

```powershell
node --test tests/ailis-core-loop.test.mjs
```

完整的中文阅读路线见 [`../../docs/ailis-core-loop-reading-guide.zh-CN.md`](../../docs/ailis-core-loop-reading-guide.zh-CN.md)。
