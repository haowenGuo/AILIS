# 架构：一条主对话链，多个产品入口

[手册索引与源码基线](README.md)

## 产品边界

| 边界 | 入口 | 负责什么 | 不应混淆为 |
| --- | --- | --- | --- |
| 桌面主进程 | [electron/main.cjs](../electron/main.cjs) | 窗口、IPC、设置、本地 Gateway、系统与资源管理 | 浏览器页面本身 |
| 桌面渲染层 | [src/](../src)、五个桌面 HTML | 输入、聊天展示、控制面板、角色与语音 | 另一个替主 Agent 重写答案的模型 |
| Agent 核心 | [Gateway](../electron/ailis-gateway.cjs)、[agent-loop](../electron/agent-loop/index.cjs) | Session、模型决策、工具循环、审批、结果收尾 | 固定关键词任务路由器 |
| Hosted Node | [启动器](../scripts/start-ailis-hosted-runtime.cjs)、[租户管理器](../electron/ailis-hosted-runtime.cjs) | 为服务器租户复用 Gateway，管理状态与附件 | Electron 桌面的窗口／本机能力全量复制 |
| Python 服务 | [backend/main.py](../backend/main.py) | HTTP API、旧聊天与记忆、TTS、安全、Web 会话、托管代理、博客与教学 | 桌面主 Session 的唯一存储 |
| 网站／演示 | [index.html](../index.html)、[Test/index.html](../Test/index.html) | 网站与独立浏览器体验 | 默认桌面包都需要携带的运行页面 |

可审计的构建边界由 [runtime/production-entrypoints.json](../runtime/production-entrypoints.json) 定义。Hosted、演示和评测源码不进入桌面闭包，并不证明它们在其他入口下无用。

## 桌面一次主对话

```text
聊天／桌宠输入
  -> AILISChatService
  -> preload / main IPC
  -> Gateway.runAgent
  -> runUnifiedAgentTurn：取得 Session 单写锁、读 checkpoint
  -> AgentRunner.runMessage -> core loop
       上下文 -> 模型决策 -> 工具/审批 -> 观察 -> 下一轮
  -> Gateway 收尾：输出门控、可见结果、记忆与最终 checkpoint
  -> 原文显示 / 语音文本 / 角色呈现
```

对应代码：[聊天服务](../src/ailis-chat-service.js)、[preload](../electron/preload.cjs)、[核心循环](../electron/agent-loop/core-loop.cjs)、[Session 存储](../electron/ailis-session-context-store.cjs)。不同输入类型、被阻断和审批中的请求会提前返回，不能把流程图理解为每次都执行到最终回答。

## Agent 与 Harness 的分工

模型判断用户意图、选择工具、解释证据并形成回答。Harness 处理上下文装配、调用契约、预算、超时、权限、进程、MCP、输出引用和持久化。确定性代码可以拒绝不合法参数或未授权操作，但不能悄悄改写模型的任务。这是 [AGENTS.md](../AGENTS.md) 的工程约束，不代表现有所有兼容代码都已完成最终清理。

人格、用户偏好、关系信息和长期记忆以显式背景数据进入主 Agent。它们不是另一个模型接管结果的理由；称呼方向和人格设置仍需要测试，统一入口本身不能保证回答质量。

## 四种数据不要混在一起

| 数据 | 主要实现 | 作用 |
| --- | --- | --- |
| 可见聊天记录 | [chat-history-store](../electron/ailis-chat-history-store.cjs) | UI 展示和可见对话保存 |
| 模型连续执行状态 | [session-context-store](../electron/ailis-session-context-store.cjs)、[ContextManager](../electron/ailis-context-manager.cjs) | 消息、工具调用与结果、恢复用 checkpoint |
| 长期背景记忆 | [memory-store](../electron/ailis-memory-store.cjs)、[ContextCompiler](../electron/ailis-context-compiler.cjs) | 有预算的画像、项目、相关记忆和引用 |
| 工具证据与大内容 | [output-store](../electron/ailis-output-store.cjs)、[context-artifact-store](../electron/ailis-context-artifact-store.cjs) | 可回读工件与受限模型视图 |

清空一类存储不能推导为其他三类也已清空。详见 [记忆](memory.md) 与 [工具](tools.md)。

## 兼容代码为什么还在

`TaskAgent`、`persona`、`handoff_task`、`task_route` 等名字仍见于显式任务协议、旧调用者兼容、迁移和测试。主对话通过 `unified_agent` 进入统一路径；显式 `task`、`worker`、`subagent` 等角色不走同一主 Session 包装。不能只看到旧名字就断言主链仍是双模型，也不能把“统一了主链”说成这些模块都已删除。

Python 后端的旧 `/api/chat` 和压缩服务也是独立实现。修改桌面 Gateway 不会自动改写后端聊天策略。[Agent 与 Session](agent-session.md) 描述实际入口条件与恢复语义。

## 外部边界和当前限制

- Provider、外部 MCP、可选 OpenClaw SDK、模型权重、操作系统和网络不是第一方源码闭包的一部分。
- 独立 Git 工作树不隔离系统资源。共享状态目录、端口或发布输出仍可发生冲突。
- [预算与压缩](memory.md) 已有实现，但当前统一模式和 provider 压缩触发范围存在差异；不能承诺自动高缓存率或永不超上下文。
- 工具完成、主 Agent 完成、成功通过测试是三个不同事实；[评估](evaluation.md)规定各自口径。
