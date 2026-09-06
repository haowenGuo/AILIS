# AILIS

AILIS 是带 VRM 角色、文本／语音交互、工具和持久记忆的桌面 Agent。当前桌面主对话由**一个 Agent 在一个持久 Session 中负责对话、执行和最终回答**。人格是配置，不是“任务做完后再由 Persona 模型改写”的第二出口。

[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 先确认代码身份

包版本为 **1.4.1**，本套文档在 2026-09-06 对照独立精简工作树的源码 `00b3244d67a6c63906f674a1b4c3746e4c362d78` 重写。另一个工作树、安装包和线上程序不会因为版本号相同就自动相同。

```powershell
git rev-parse HEAD
git status --short
```

## 从源码启动

仓库指定 pnpm 10.33.0，已记录本地验证使用 Node 22.17.1。在仓库根执行：

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

`pnpm desktop:start` 会构建桌面前端后启动 Electron，不会替换已安装程序。启动前确认控制面板中的模型、凭据和状态目录；依赖安装、应用启动与模型请求均不是只读操作。

## 当前能力边界

- 桌面：控制面板、聊天、桌宠、Agent Lab、屏幕区域选择。
- Agent：模型决策、工具调用、审批、可回读输出、Session 锁和 checkpoint。
- 记忆：长期画像、相关记忆检索和有预算的背景上下文。
- 可选能力：语音、视觉、MCP、电脑／文件／邮件工具和资产包，依赖各自配置。
- 独立产品：Hosted Node、Python API、网站与浏览器演示，不是所有代码都进入桌面包。

## 只维护一套当前手册

从 [文档索引](docs/README.md) 进入：

| 使用 | 理解与开发 |
| --- | --- |
| [启动](docs/getting-started.md)、[配置与隔离](docs/configuration.md) | [架构](docs/architecture.md)、[Agent／Session](docs/agent-session.md) |
| [语音与角色](docs/voice-and-avatar.md)、[排错](docs/troubleshooting.md) | [工具](docs/tools.md)、[记忆与压缩](docs/memory.md) |
| [后端与 Hosted](docs/backend-and-hosted.md) | [开发](docs/development.md)、[构建与打包](docs/production-runtime.md) |
| [评估口径](docs/evaluation.md) | [生成的桌面依赖清单](docs/generated/desktop-runtime.md) |

旧版本说明、研究稿和成绩战报退出当前手册，但保留在 Git 和本地迁移备份中。[恢复方式](docs/README.md)不要求覆盖当前工作区。

## 不夸大当前状态

统一 Agent 不等于必然高缓存率；源码有压缩代码不等于所有入口都已接入；打包成功不等于全部功能 E2E 通过。当前限制均在手册单列，旧评测成绩不充当本版实测成绩。

本地文件、记忆和日志可能含隐私；模型和工具可能把所需内容发给配置的外部服务。记忆 secret 的 Base64 只是编码，不是加密。公开日志前脱敏，使用新状态目录做实验。

## 贡献与许可

参见 [贡献约定](CONTRIBUTING.md)、[工程规则](AGENTS.md) 和 [LICENSE](LICENSE)。第三方代码、模型、声音与动作分别遵守其原有许可，不能把代码 MIT 许可扩展成全部资源都可再分发。
