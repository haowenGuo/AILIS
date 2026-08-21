# AILIS 文档中心

<p align="center">
  <strong>构建、理解并评测 AILIS 桌面具身 Agent。</strong>
</p>

<p align="center">
  <a href="../README.zh-CN.md">项目首页</a> ·
  <a href="README.md">English</a> ·
  <a href="getting-started.zh-CN.md">快速开始</a> ·
  <a href="evaluation.zh-CN.md">评测成绩</a>
</p>

下面的页面描述当前 `v1.4.0` 代码和已接受的 A7 TaskAgent 上下文基线。仓库仍保留设计研究与实验记录以便追溯，但它们不代表当前产品实现。

## 从这里开始

| | 文档 | 内容 |
| :---: | --- | --- |
| 01 | **[快速开始](getting-started.zh-CN.md)** | 安装依赖、启动桌面端、准备语音、验证与打包。 |
| 02 | **[系统架构](architecture.zh-CN.md)** | 桌面体验、Gateway、Persona、TaskAgent、Agent Loop、工具、记忆与模型服务。 |
| 03 | **[TaskAgent Runtime](taskagent.zh-CN.md)** | Thread/Turn 生命周期、规范上下文、工具、审批、检查点与自然结束。 |
| 04 | **[记忆系统](memory.zh-CN.md)** | 持久记忆分层、BM25/MMR 检索、上下文投影、隐私与边界。 |
| 05 | **[工具运行时](tools.zh-CN.md)** | 内置工具、契约、按需发现、执行策略、工件与审计事件。 |
| 06 | **[评测成绩](evaluation.zh-CN.md)** | GAIA、Terminal-Bench、ToolSandbox、长期记忆与 Codex 同模型对照。 |

## 当前执行链

```text
桌面 UI 与具身角色
        |
        v
AILIS Gateway  ->  审批、事件、审计、模型中继
        |
        +------> Persona Runtime  -> 对话与人物表现
        |
        +------> TaskAgent Harness
                    |
                    v
              Agent Loop + ContextManager
                    |
                    v
              工具运行时与平台适配器

Memory Runtime 与持久状态同时支持 Persona 和 TaskAgent 两条链路。
```

生产 Agent Loop 位于 [`electron/agent-loop/`](../electron/agent-loop/)。旧路径 `electron/ailis-agent-runner.cjs` 现在只是兼容入口，不再承载实现。

## 工程参考

- [TaskAgent A7 上下文基线](ailis-a7-taskagent-context-baseline.md)
- [核心 Loop 阅读指南](ailis-core-loop-reading-guide.zh-CN.md)
- [完整评测数据总表](ailis-evaluation-master-scorecard-20260817.md)
- [记忆检索基线](ailis-memory-bm25-mmr-baseline.md)
- [发布构建系统](ailis-release-build-system.md)
- [版本与实验登记](ailis-version-registry.md)
- [Harness 架构审计](ailis-harness-architecture-audit-roadmap.md)
- [代码重构审计](ailis-codebase-refactor-audit.md)

## 文档状态

只有“从这里开始”中的页面作为当前实现的公开说明持续维护。文件名中包含 `v0`、`plan`、`research`、`migration`、`analysis` 或具体实验日期的页面属于工程记录，可能描述旧实现、被否决方案或冻结实验。

版本历史见 [`docs/releases/`](releases/) 与 [GitHub Releases](https://github.com/haowenGuo/AILIS/releases)。
