# AILIS 架构：一个主 Agent

[文档中心](README.zh-CN.md) · [English](architecture.md)

范围：未发布的统一工作树，不是较早的公开 1.4.1 标签。

## 执行链与所有权

```text
桌面聊天 / 托管租户
    -> Gateway.runAgent
    -> runUnifiedAgentTurn：取得 Session 写锁、恢复检查点
    -> AgentRunner：上下文 -> 模型 -> 工具 -> 观察结果
    -> 最终输出校验 -> 一次可见答复与记忆记录
    -> 保存 Session 检查点、释放写锁
```

模型负责语义理解、工具选择和最终内容；Harness 负责契约、权限、预算、生命周期与证据保存。人物、语音与表情是表现层，不再由另一个语言模型改写主 Agent 的答案。

| 边界 | 实现 |
| --- | --- |
| 桌面对话 | [ailis-chat-service.js](../src/ailis-chat-service.js) |
| 托管租户隔离 | [ailis-hosted-runtime.cjs](../electron/ailis-hosted-runtime.cjs) |
| 主调度和安全校验 | [ailis-gateway.cjs](../electron/ailis-gateway.cjs) |
| 执行循环 | [agent-loop/](../electron/agent-loop/) |
| Session 持久化与写锁 | [ailis-session-context-store.cjs](../electron/ailis-session-context-store.cjs) |
| 上下文与记忆投影 | [context manager](../electron/ailis-context-manager.cjs)、[compiler](../electron/ailis-context-compiler.cjs) |
| 工具派发与 code-mode worker | [tool runtime](../electron/ailis-tool-runtime.cjs)、[code-mode runtime](../electron/ailis-code-mode-runtime.cjs) |

## 兼容代码不等于当前主链

主链不自动调用 `task_route`、`handoff_task` 或人物草稿/重写模型。显式兼容委派、Task Harness API 与旧检查点读取仍有用途，必须迁移调用者后才能删除。没有 Gateway 的浏览器/演示回退模式也不等于完整执行 Agent。

本轮移除了不再被调用的 `runTaskAgentControlledPersonaTurn` 调度和私有草稿方法，以及未接入的 Kokoro/VITS JavaScript 适配器、角色调试原型。现用 ElevenLabs/CosyVoice3 和角色模块保留。

## 已知边界

离线回归不能证明真实回答质量、模型服务缓存率或已安装应用行为。统一上下文模式的语义压缩触发仍需独立核验，不能套用旧 A7 压缩成绩。历史脚本和适配器也可能有独立入口，不能按主链未引用就一律删除。
