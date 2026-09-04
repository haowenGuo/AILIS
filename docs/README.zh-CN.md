# AILIS 文档中心

[English](README.md) · [项目首页](../README.zh-CN.md)

## 先确认你读的是哪个版本

这组核心文档描述 `codex/code-consolidation-20260904` 工作树中的**未发布统一 Agent 源码**，精简前基线为 `1442cc5`。包版本仍是 `1.4.1`，不能只靠这个版本号判断架构。公开标签 `659bf61` 及其[发布说明](releases/v1.4.1.md)描述较早的双链实现。本工作树尚未替换已安装应用。

## 当前主链

一个主 Agent 持有一个持久 Session，负责对话、工具执行和最终答复。人物风格与关系偏好是上下文配置，不是另一个改写答案的模型。

| 文档 | 内容 |
| --- | --- |
| [系统架构](architecture.zh-CN.md) | 真实入口、执行链、状态所有权、兼容边界 |
| [Agent 运行时](taskagent.zh-CN.md) | 统一生命周期、工具协议、检查点恢复 |
| [记忆系统](memory.zh-CN.md) | 会话执行历史与长期记忆的区别 |
| [工具参考](tools.zh-CN.md) | 工具契约；具体适配器仍需对照源码 |
| [快速开始](getting-started.zh-CN.md) | 构建和启动参考；运行时资源包另行准备 |
| [评测记录](evaluation.zh-CN.md) | 历史测量，不是本轮精简后的新成绩 |

保留 `taskagent.md` 系列文件名是为了兼容旧链接，内容已改为统一主 Agent。

## 历史与证据

- [历史架构目录](history/architecture/README.md)：旧 v0/V1/V2 与双角色设计。
- [统一 Session 实施记录](unified-agent-session.md)：原始迁移、测试及当时的边界。
- [A7 上下文基线](ailis-a7-taskagent-context-baseline.md)、[评测总表](ailis-evaluation-master-scorecard-20260817.md)：冻结实验。
- [发布历史](releases/)：保留每个已发布版本当时的事实。

本批重写的是中英文索引、架构、运行时、记忆共 8 页。其他研究、模块和运维文档不能仅因仍在仓库里就视为最新契约。
