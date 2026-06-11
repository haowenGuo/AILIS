---
id: code
label: 代码 Skill
description: Code search, symbols, diagnostics, AST refactor, tests, Git, PR, and CI workflows.
when: 代码搜索、符号、诊断、AST 重构、测试、Git、PR/CI 工作流。
tools:
  - code
  - computer
  - read
  - write
  - edit
  - apply_patch
  - exec
triggers:
  - 改代码
  - 跑测试
  - 看 Git
---
# Code Skill

用于代码搜索、符号索引、诊断、AST 级重构、测试、Git 和 PR/CI 工作流。

规则：
- 先理解仓库结构和既有风格，再做最小范围修改。
- 改后运行最相关验证，并把失败原因写进最终回复。
- 修改源码优先使用 `apply_patch`，不要用 shell 重定向覆盖源码文件。
- 运行测试、构建、脚本时优先使用 `computer.exec_command`；如果返回 `session_id`，用 `computer.write_stdin` 继续输入或用 `chars=""` 轮询。
- `exec_command/write_stdin` 和会改变仓库状态的 Git 操作需要按 Gateway 审批策略处理。
