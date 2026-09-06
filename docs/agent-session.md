# 主 Agent、执行循环和 Session

[手册索引与源码基线](README.md) · [架构](architecture.md) · [记忆](memory.md)

## 先找入口，不按旧类名猜架构

桌面主聊天由 [AILISChatService](../src/ailis-chat-service.js) 发出主 Agent 请求。[Gateway.runAgent](../electron/ailis-gateway.cjs) 检查角色和上下文标志，主请求进入 `runUnifiedAgentTurn`。该函数显式设置：

```text
agentRole = unified_agent
contextMode = unified
unifiedAgent = true
agentLoop = llm
planner = llm
taskAgentRoutingOwned = false
taskAgentRoutePending = false
personaRenderOnly = false
personaDraft = false
```

`runAgent` 并不是“任意参数都自动进入统一主 Session”：显式 child/task/worker 角色和其他调用入口仍有不同路径。排错必须保留真实请求的 role、sessionId、runId 和 context，而不是只记录“调用了 runAgent”。

## 一个 Session 的持久化契约

[AILISSessionContextStore](../electron/ailis-session-context-store.cjs) 保存到：

```text
<auditDir>/session-context/sessions/<sha256(sessionId)>.json
```

文件包含 Session 身份、checkpoint 和元数据。checkpoint 的核心是有序 `items`；[response-model](../electron/ailis-response-model.cjs) 与 [ContextManager](../electron/ailis-context-manager.cjs) 负责消息、调用、输出等结构。聊天面板的一段文本不是这个执行账本的完整替代。

统一路径在每次模型决策前等待 checkpoint 提交，结束时再次提交最终 checkpoint。写入通过唯一临时文件加 rename 完成。不能把落盘失败吞掉后宣称安全恢复；执行中断仍可能留下未配对调用或尚未持久化的最后一步观察，恢复时必须核验证据，不能假定副作用没有发生。

## 单写与并发

- 进程内 `activeUnifiedTurns` 按 Session 管理当前写者。
- 同 Session 的普通追加文本可通过 `enqueueRunInput` 转向正在执行的任务；接受时返回 `steerAccepted`，不提交一个伪造的最终回答。
- 带附件、主动消息、审批恢复、调试恢复以及不能入队的请求等待当前 promise，再进入该 Session。
- 文件系统独占锁包含 PID 和 owner token。只在确认旧 PID 不存在时恢复；PID 仍活着、锁内容无效或不能确认时拒绝争抢。
- 释放锁要核对 owner token；另一进程不能随意删除活跃写者的锁。

不同 Session 可独立执行，但仍共享主机、外部账户、工具服务和磁盘。这个锁不是对整台电脑的任务调度锁。

## 旧状态迁移

当且仅当新 Session checkpoint 不存在时，Gateway 尝试导入旧 TaskAgent checkpoint，找不到才退回旧 Persona checkpoint。二者不拼接成一份“更完整”历史，旧存储不会成为新主轮次的并行写者。

读取旧兼容格式、保留旧字段名，和重新启用 Persona／TaskAgent 双出口不是同一件事。迁移相关实现仍在 [Gateway](../electron/ailis-gateway.cjs) 和 [persona-context-store](../electron/ailis-persona-context-store.cjs)。

## 执行循环阅读顺序

1. [core-loop.cjs](../electron/agent-loop/core-loop.cjs)：循环如何继续、结束和传播状态。
2. [runner.cjs](../electron/agent-loop/runner.cjs) 的 `runMessage` 和 `runIteration`：装配上下文、调模型、执行工具、形成 observation。
3. [tool-runtime](../electron/ailis-tool-runtime.cjs) 与 [tool-contracts](../electron/ailis-tool-contracts.cjs)：调用验证、执行分派和输出归一。
4. Gateway 的 `finalize`：门控、事件、可见结果与最终状态。

`update_plan` 只更新进度清单；清单全打勾不代表文件确实写入、工具成功或任务通过验收。审批中、运行中、失败、被门控阻断与完成必须分开报告。

## 最终回答和安全门控

主 Agent 的回答经过确定性呈现与输出门控，而不是再交给 Persona 模型改写。若结果被输出门控阻断，最终 checkpoint 会追加“未交付”的背景说明，避免后续轮次误认成功。

是否可以提前流式显示文字取决于 Gateway 的门控设置。不能同时承诺“任何文字即时显示”和“所有文字交付前都已通过最终审核”。依据是 `streamBeforeFinalGate` 和 `shouldRunEmberHarness`。

## 本地验证

```powershell
node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs
```

这些是受控测试，不覆盖每个真实模型、全部桌面交互或进程崩溃时的外部副作用。压缩和缓存的已知限制见 [记忆](memory.md)；观测口径见 [评估](evaluation.md)。
