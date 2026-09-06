# 源码阅读地图

本手册按产品使用、系统原理和工程流程组织。下表给出正文的实现依据，供修改代码或核对行为时沿入口查阅。

运行时核对基线为提交 2f2c9e45145d935279b841b5d82ac7d36a0d5222，package 版本 1.4.1；代码核对日期为 2026-09-06。本文档随当前源码维护，安装实例的身份应另行核验。已有 v1.4.1 Release 安装包来自 659bf61，不包含后续统一 Agent 和生产构建改动；历史内容可从版本标签与 Git 提交查阅。

| 主题 | 入口与关键符号 | 对应正文 |
| --- | --- | --- |
| 窗口与设置 | [main](../../electron/main.cjs)：createPetWindow、createChatWindow、resolveAILISStateDir；[store](../../electron/store.cjs)：getDefaultState | [桌面](../guide/desktop.md)、[配置](../guide/configuration.md) |
| 页面接口 | [preload](../../electron/preload.cjs)：ailisDesktop；[聊天服务](../../src/ailis-chat-service.js)：fetchAssistantTurn | [系统](../design/system.md) |
| 主执行 | [Gateway](../../electron/ailis-gateway.cjs)：runAgent、runUnifiedAgentTurn | [Agent](../design/agent-runtime.md) |
| 模型循环 | [Runner](../../electron/agent-loop/runner.cjs)、[core-loop](../../electron/agent-loop/core-loop.cjs)：runCoreAgentLoop | [Agent](../design/agent-runtime.md) |
| 连续状态 | [Session store](../../electron/ailis-session-context-store.cjs)：acquireSession、commitCheckpoint；[ContextManager](../../electron/ailis-context-manager.cjs) | [数据](../design/data.md) |
| 长期背景 | [compiler](../../electron/ailis-context-compiler.cjs)：compile；[memory](../../electron/ailis-memory-store.cjs)：getContextSources；[retriever](../../electron/ailis-memory-lexical-retriever.cjs) | [数据](../design/data.md) |
| 工具 | [registry](../../electron/ailis-tool-runtime.cjs)、[contracts](../../electron/ailis-tool-contracts.cjs)、[MCP](../../electron/ailis-mcp-session.cjs) | [工具](../design/tool-system.md) |
| 内容引用 | [output store](../../electron/ailis-output-store.cjs)、[artifact tools](../../electron/ailis-artifact-tools-runtime.cjs)、[context artifacts](../../electron/ailis-context-artifact-store.cjs) | [工具](../design/tool-system.md) |
| 媒体 | [speech](../../src/speech-provider.js)、[rendering](../../src/rendering/index.js) | [媒体](../design/media.md) |
| 产品构建 | [Vite](../../vite.config.js)、[产品入口](../../runtime/production-entrypoints.json)、[closure](../../scripts/production-closure.cjs) | [发布](../engineering/distribution.md) |
| 安装包 | [release](../../scripts/build-ailis-release.mjs)、[probe](../../scripts/verify-production-package.cjs) | [发布](../engineering/distribution.md) |
| 服务 | [FastAPI](../../backend/main.py)、[Node](../../scripts/start-ailis-hosted-runtime.cjs)、[租户](../../electron/ailis-hosted-runtime.cjs) | [服务](../engineering/services.md) |
| 分析 | [Runner](../../electron/agent-loop/runner.cjs)：normalizeCostUsage；[Gateway](../../electron/ailis-gateway.cjs)：normalizeUsageForAnalysis | [观测](../engineering/measurement.md) |

## 如何更新手册

先查看生产调用点、分支条件和相关测试，再更新唯一对应章节。代码注释、功能名称和测试标题用于导航；行为结论需要以实现与断言为准。

使用说明写操作与结果，原理章节写职责与数据流，工程章节写流程与验证。具体缺陷与待验收项进入[实现状态](implementation-status.md)，不将历史事故作为产品章节的主线。

生成的依赖清单由审计命令更新。运行提示、Skill 正文、第三方许可和业务内容各有用途，不作为普通技术说明改写。
