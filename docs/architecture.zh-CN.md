# AILIS 系统架构

[文档中心](README.zh-CN.md) · [English](architecture.md) · [TaskAgent](taskagent.zh-CN.md) · [工具](tools.zh-CN.md)

AILIS 把可见的桌面陪伴体验与通用 Agent Runtime 组合成同一个产品。人物、对话、记忆和任务执行彼此协作，但在运行时拥有明确边界：人物表现不会削弱任务能力，工具内部细节也不会直接泄漏给用户。

## 运行时分层

| 层 | 职责 | 主要代码 |
| --- | --- | --- |
| 桌面体验 | VRM 渲染、聊天、控制面板、语音、表情、动作与审批界面 | `src/`、`electron/main.cjs`、`electron/preload.cjs` |
| Gateway | Session、模型访问、工具注册、策略、事件、审计与平台适配 | `electron/ailis-gateway.cjs` |
| Persona Runtime | 自然对话、关系上下文与面向用户的表达 | `electron/agent-loop/runner.cjs`、人物表现相关模块 |
| TaskAgent Harness | 持久 Thread/Turn、用户 steering、Goal、检查点与紧凑任务结果 | `electron/ailis-task-agent-harness.cjs` |
| Agent Loop | 上下文投影、模型决策、工具调用、Observation、恢复与结束 | `electron/agent-loop/` |
| 上下文与协议 | 规范 ResponseItems、Token 预算、压缩、调用配对与检查点 | `electron/ailis-context-manager.cjs`、`electron/ailis-model-input-builder.cjs` |
| 工具运行时 | 契约、发现、验证、执行、审批与标准化输出 | `electron/ailis-tool-contracts.cjs`、`electron/ailis-tool-executor.cjs` |
| 记忆运行时 | Persona blocks、事件、项目上下文、关系状态、检索与 Prompt 投影 | `electron/ailis-memory-store.cjs`、`electron/ailis-context-compiler.cjs` |

## 一次用户请求

```text
用户输入
  -> 桌面端提交当前 Session 与用户允许的上下文
  -> Gateway 新建或 steer 当前 Turn
  -> Persona 直接对话，或原样委派任务
  -> TaskAgent 恢复 Thread 检查点
  -> Agent Loop 构建规范模型输入
  -> 模型继续推理、调用工具或自然结束
  -> 工具结果通过同一 call_id 回填历史
  -> TaskAgent 持久化新检查点并返回紧凑结果
  -> Persona 用文字、语音、表情和动作呈现结果
```

Persona 不会偷偷改写出第二个任务。TaskAgent 接收不可变任务信封，完成后把证据、工件、状态和结果包交回同一条外层对话。

## 状态模型

- **Session**：长期关系与对话边界。
- **Thread**：Session 内持久存在的 TaskAgent 执行历史。
- **Turn**：一次用户请求，或对当前工作的明确继续。
- **Goal**：可跨 Turn 的可选长期目标；它不是第一条 Prompt，可以替换或完成。
- **Checkpoint**：可重放执行快照，不等于目标或审批。
- **Approval**：绑定到具体 Turn 与具体工具动作的结构化授权。

这种拆分避免已完成任务把后续消息永久锁定到旧目标。

## 上下文模型

AILIS 使用规范 response items 保存模型可见历史，包括角色消息、函数调用、函数输出、工具发现事件、图片与压缩历史项。旧对象保持顺序和调用配对。上下文只在接近模型有效预算时按预算压缩，不再额外构造“强制最终回答 Prompt”。

v1.4.1 运行时采用稳定追加式历史、独立 Persona 上下文与受治理的 code-mode 工具，并在回退压缩中保留附件上下文。详见[当前版本说明](releases/v1.4.1.md)。[A7 上下文基线](ailis-a7-taskagent-context-baseline.md)记录的是历史受测机制，不代表本版重新评测的结果。

## 模型与本机执行

当前公开版本通过 AILIS Cloud 连接模型。Persona 编排、TaskAgent 状态、本机记忆、审批，以及电脑、文件、代码和工件工具仍由桌面端执行；只有当前请求所需的模型可见上下文会发送到模型服务。

## 可靠性边界

- 有外部影响的工具必须经过策略与审批。
- 工具调用与结果会标准化，并通过 call ID 配对。
- TaskAgent 检查点支持恢复后继续规范历史。
- 进度、工具事件和结果统一进入 Gateway 事件流。
- Benchmark 与产品共用 Agent 实现，Adapter 只负责环境传输。

继续阅读 [TaskAgent Runtime](taskagent.zh-CN.md)、[记忆系统](memory.zh-CN.md) 或 [工具运行时](tools.zh-CN.md)。
