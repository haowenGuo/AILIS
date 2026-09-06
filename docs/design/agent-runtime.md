# Agent 运行模型

一次用户交互可以包含多次模型请求和工具调用。AILIS 用 Session 表示连续上下文，用 run 表示一次执行，用 iteration 表示执行内的一轮模型决策。

## 请求与返回

桌面聊天服务向 Gateway 提交 sessionId、message、messageHistory、attachments、modelImageAttachments 和 context。主聊天请求带有 unified_agent 角色标识。模型设置由请求或宿主提供。

结果携带运行状态、可见文本和相关元数据。running、needs_approval、debug_paused、interrupted、blocked、completed 等状态表示不同执行阶段；调用方应读取状态，而不是仅判断是否返回文字。

## 运行生命周期

1. Gateway 解析请求，执行启用的输入阶段检查。
2. 主 Session 取得写入所有权，加载持久 checkpoint。
3. Runner 建立上下文并在模型决策前提交 checkpoint。
4. 模型返回回答或工具调用；工具结果以 observation 加入上下文。
5. 需要下一轮时，Runner 返回核心循环的专用继续信号。
6. 结束结果经过交付阶段检查，写入相应记录和最终 checkpoint。
7. 释放 Session 所有权。

core-loop.cjs 只处理继续信号和轮次计数。它将其他返回值原样交回调用者，预算与业务状态由 Runner 管理。

## Session 所有权

进程内 activeUnifiedTurns 管理每个 Session 的活动 run。普通追加文本可以进入活动 run 的输入队列；带附件、审批恢复、调试恢复等需要完整请求的情况等待当前运行结束。

跨进程使用独占文件锁，锁中包含 PID 和随机 owner token。锁文件位于 Session 文件旁边。释放时检查所有者；回收时检查原进程是否已不存在。这里保护的是一个 Session 的写入顺序。

Checkpoint 通过临时文件与 rename 提交，内容包括有序 items。应用崩溃后可以从已持久化状态恢复，但发生在最后一次提交之后的外部操作仍需核对。恢复执行应先检查未完成调用和产物，避免重复副作用。

## 上下文与模型循环

ContextManager 将消息、模型输出、工具调用和工具结果组织为上下文包。长期背景由 ContextCompiler 提供。Runner 根据模型能力生成请求，并记录输入与 usage 等信息。

工具调用结果与调用标识配对。模型下一轮读取观察，决定继续查询、采取行动或给出最终回复。运行时可对参数、权限或预算返回失败信息，使后续决策拥有明确依据。

统一主会话用 Session 身份生成稳定的 prompt cache key。缓存是否命中仍由实际请求内容和 provider 决定；测量方法见[观测](../engineering/measurement.md)。

## 交付

Gateway 负责主请求的最终交付、完成事件和记忆记录。若启用了要求交付前检查的门控，文本可能先缓冲再呈现；未启用该门控时，可通过文本增量事件流式显示。

UI 消费 displayText、speechText 及角色呈现信息。可见回答、播报文本和动作数据承担不同用途。

## 其他调用入口

显式 task、worker、subagent 等角色可直接复用 Runner，不自动取得主 Session 的所有权。主 Session 没有 checkpoint 时还存在一次性的兼容状态导入路径。接口调用者应明确角色和 Session，不依靠类名推测所有入口具有相同语义。

实现：[Gateway.runAgent / runUnifiedAgentTurn](../../electron/ailis-gateway.cjs)、[Runner](../../electron/agent-loop/runner.cjs)、[核心循环](../../electron/agent-loop/core-loop.cjs)、[Session store](../../electron/ailis-session-context-store.cjs)。受控场景：[统一 Agent 测试](../../tests/ailis-unified-agent.test.mjs)。
