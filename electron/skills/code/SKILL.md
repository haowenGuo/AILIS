---
id: code
label: 代码 Skill
description: Code search, symbols, diagnostics, AST refactor, tests, Git, PR, and CI workflows.
when: 代码搜索、符号、诊断、AST 重构、测试、Git、PR/CI 工作流。
tools:
  - code
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
- 优先使用结构化 `code` 工具；需要兼容路径时才用 `read/write/edit/apply_patch/exec`。
- `exec` 和会改变仓库状态的 Git 操作需要按 Gateway 审批策略处理。

