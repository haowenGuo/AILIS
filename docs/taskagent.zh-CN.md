# TaskAgent Runtime

[文档中心](README.zh-CN.md) · [English](taskagent.md) · [系统架构](architecture.zh-CN.md) · [A7 基线](ailis-a7-taskagent-context-baseline.md)

TaskAgent 是 AILIS 的任务执行链。它与 Persona 共享产品 Session，但拥有独立且持久的 Thread、规范模型历史、工具调用、检查点与可选长期 Goal。

## 为什么要分离

Persona 负责自然对话与人物表现，TaskAgent 负责把事情做完。这个边界让任务执行保持专注，同时允许 AILIS 用一致的人物语气汇报进度和结果。

TaskAgent 不是每条消息新建一次的临时 Agent。一个产品 Session 保留一条持久 TaskAgent Thread；每次请求创建新 Turn，或 steer 正在运行的 Turn。

## 生命周期

```text
Session
  -> 持久 TaskAgent Thread
       -> Turn A：用户任务
       -> Turn B：追问或另一项任务
       -> Turn C：继续活动 Goal
```

Harness 遵循以下规则：

1. Thread 空闲时，新请求创建新 Turn。
2. Turn 运行中时，新输入进入队列并 steer 该 Turn。
3. 已完成 Turn 保留在规范历史中，但不会继续充当活动目标。
4. 可选 Goal 能跨 Turn，并可更新、阻塞、完成或清除。
5. 工具审批绑定到具体 Turn 与动作；自然语言消息不会暗中批准无关旧命令。

## Agent 的一轮

生产 Loop 位于 [`electron/agent-loop/core-loop.cjs`](../electron/agent-loop/core-loop.cjs)。每一轮都执行相同的五阶段流程：

```text
Context
  -> 模型决策
  -> 动作或结束
  -> 工具执行
  -> Observation 写入规范历史
```

模型可以在同一次响应中发出多个函数调用。运行时保留全部调用，按工具安全元数据安排执行，再按照原始 `call_id` 回填全部输出，之后才进入下一次模型请求。

## 规范上下文

`ContextManager` 管理有序的模型可见对象，而不是每一步重新拼一套临时 transcript。它保存：

- developer 与 user 消息；
- assistant response items；
- function、custom-tool 与 tool-search 调用；
- 通过 call ID 配对的输出；
- 用户允许加入上下文的图片；
- 语义压缩检查点；
- Token 使用与上下文预算元数据。

A7 基线把经过边界控制的工具输出保留在规范历史中，只在有效上下文预算进入硬压力区后启动语义压缩。它不会在最后一轮用独立的“四步摘要 Prompt”替换原历史。

## 检查点与恢复

Turn 完成时，Harness 把下一份 `ContextManager` 检查点写入持久 Thread。恢复会保持对象顺序、调用配对、引用上下文与 Token 元数据。检查点只记录“执行到哪里”，不决定用户下一步想做什么。

传输失败可以从最近规范状态重试。工具或模型失败会作为 Observation 留在历史中，模型可以换策略而不丢失已经完成的工作。

## 自然结束

当模型返回最终响应，并且没有待处理工具或用户输入时，TaskAgent 自然结束。Runtime 仍保留可配置步数预算和循环保护，但不会额外创建一轮丢弃历史的强制终局对话。

TaskAgent 返回给 Persona 的结果包包含任务状态、答案、证据与工件引用、验证状态、进度摘要，以及当前 Thread/Turn 身份。Persona 再将它组织成面向用户的表达。

## 主要源码

| 文件 | 职责 |
| --- | --- |
| `electron/ailis-task-agent-harness.cjs` | Thread、Turn、Goal、steering、检查点、结果包 |
| `electron/agent-loop/core-loop.cjs` | 最小生产循环控制 |
| `electron/agent-loop/runner.cjs` | 上下文、模型、工具、Observation、恢复与结果 |
| `electron/ailis-context-manager.cjs` | 规范历史、预算、压缩与检查点 |
| `electron/ailis-model-input-builder.cjs` | 规范对象与 Provider 请求投影 |
| `electron/ailis-response-model.cjs` | ResponseItem 构造与标准化 |

实测上下文行为与冻结回归证据见 [TaskAgent A7 上下文基线](ailis-a7-taskagent-context-baseline.md)。
