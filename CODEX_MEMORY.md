# 当前工作树说明

本文件是状态入口，不是自动执行任务清单。

- 文档对应的程序基线：`00b3244d67a6c63906f674a1b4c3746e4c362d78`，package 1.4.1。
- 本次整理位置：独立分支 `codex/code-consolidation-20260904`；不代表其他工作树或已安装版本已同步。
- 当前技术正文：[docs/README.md](docs/README.md)。主链是一套统一 Agent／持久 Session；兼容路径见 [Session 手册](docs/agent-session.md)。
- 构建和可达性依据：[runtime/production-entrypoints.json](runtime/production-entrypoints.json) 与 [生产运行说明](docs/production-runtime.md)。
- 旧部署任务、旧 benchmark 计划和旧架构指令已从本文件移除；需要历史证据时用 `git show 00b3244:CODEX_MEMORY.md` 查阅，不把它当当前授权。
- 本次文档原稿本地备份在 `tmp/doc-rewrite-20260906/originals/`，清单和核验报告在其父目录；该目录不属于发布产物。

接手任何新任务时，以当前用户请求、实际目录、Git 状态和代码为准。这里不授权启动评测、清空状态、操作其他工作树、推送或部署。
