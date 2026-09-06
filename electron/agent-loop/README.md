# Agent Loop 阅读入口

本目录是当前 Agent 执行核心，不是第二个人格模型。完整行为和源码基线见 [Agent 与 Session](../../docs/agent-session.md)。

| 文件 | 职责 |
| --- | --- |
| [index.cjs](index.cjs) | 公共导出边界 |
| [core-loop.cjs](core-loop.cjs) | 生产循环控制、继续／结束和状态传播 |
| [runner.cjs](runner.cjs) | `runMessage`、`runIteration`、上下文、模型决策、工具、审批、观察与结果 |

从 core loop 看轮次，再沿 Runner 的 runIteration 看业务。主对话由 Gateway 的 `runUnifiedAgentTurn` 包装，持久 Session、迁移、单写锁与最终提交不全在本目录。

```powershell
node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs
```

在仓库根运行；测试通过只说明这些受控场景。显式任务接口仍复用内核，旧角色名不能用来推断主对话仍是 Persona／TaskAgent 双出口。压缩触发差异和 usage 缺失问题见 [记忆](../../docs/memory.md) 与 [评估](../../docs/evaluation.md)。
