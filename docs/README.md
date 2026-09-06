# AILIS 当前代码手册

这套手册描述 `package.json` 标记为 **1.4.1** 的独立精简工作树，源码基线为 `00b3244d67a6c63906f674a1b4c3746e4c362d78`，核对日期为 2026-09-06。版本号不是代码身份：同为 1.4.1 的安装包、主仓和工作树可能不同。排错先记录 commit、工作区改动和实际启动路径。

AILIS 的桌面主链是 **一个主 Agent 负责对话、工具执行和最终回答，一个持久 Session 保存其上下文**。人格是该 Agent 的配置；不是“Persona 先聊、TaskAgent 后做、Persona 再改写”的默认双模型流水线。兼容接口和独立后端仍存在，不能据此把所有入口说成同一套实现。

## 按问题阅读

| 要做什么 | 当前说明 | 核心代码依据 |
| --- | --- | --- |
| 从源码启动 | [入门](getting-started.md) | [package.json](../package.json) |
| 理解产品边界与数据流 | [架构](architecture.md) | [入口清单](../runtime/production-entrypoints.json) |
| 理解一轮执行、锁、恢复和兼容路径 | [Agent 与 Session](agent-session.md) | [Gateway](../electron/ailis-gateway.cjs) |
| 配置模型、目录和权限 | [配置](configuration.md) | [桌面设置](../electron/store.cjs) |
| 理解工具、MCP、附件和输出契约 | [工具](tools.md) | [工具注册表](../electron/ailis-tool-runtime.cjs) |
| 排查记忆与上下文 | [记忆](memory.md) | [ContextCompiler](../electron/ailis-context-compiler.cjs) |
| 配置语音、视觉与角色资源 | [语音和角色](voice-and-avatar.md) | [渲染边界](../src/rendering/index.js) |
| 改代码、验证和维护文档 | [开发](development.md) | [工程约束](../AGENTS.md) |
| 评估质量、token、缓存和时延 | [评估](evaluation.md) | [Agent Runner](../electron/agent-loop/runner.cjs) |
| 区分源仓、运行子集与安装包 | [构建与运行依赖](production-runtime.md) | [闭包生成器](../scripts/production-closure.cjs) |
| 启动独立服务或准备部署 | [后端与 Hosted](backend-and-hosted.md) | [FastAPI 入口](../backend/main.py) |
| 查常见故障 | [排错](troubleshooting.md) | 上述对应模块与测试 |

[桌面依赖清单](generated/desktop-runtime.md)由 `pnpm audit:production` 自动生成，不手工维护第二份文件列表。

## 哪些材料不再放在现行手册里

旧版本发布说明、启动宣传稿、研究摘录、评测战报和已过期重构计划从现行 `docs/` 移除。它们保留在 Git 基线 `00b3244`；本次迁移另有本地备份 `tmp/doc-rewrite-20260906/originals/`，清单为同目录 `manifest.json`。备份不是程序运行依赖，也不参与打包。

查看任意旧稿而不覆盖当前文件，例如：

```powershell
git show 00b3244:docs/releases/v1.4.1.md
git show 00b3244:docs/code-consolidation.md
```

以下 Markdown 不属于本次说明文档重写范围：`AGENTS.md`、会被加载的 prompt／SKILL、第三方出处与许可证、博客内容及其 authoring kit、练习数据集说明。它们有工程约束、运行输入、内容或溯源用途，不应因为后缀是 `.md` 就改成产品手册。

## 可信度边界

- 源码链接证明“当前实现是什么”，不证明某个在线服务现在可用。
- 历史得分、缓存率和测试结果不能自动归属于当前代码；本手册不复用旧成绩作为当前版本指标。
- 本次重写不修改程序、提示词、用户数据或部署；没有进行新的真实模型评测。
- 后续代码改变时，在同一变更中更新对应手册页，并重新生成依赖清单。不要再追加一篇重复描述主架构的日期稿。
