---
id: self_evolution
label: 自我进化 Skill
description: Conversation-driven self-evolution loop for AILIS preference learning, tool bottleneck analysis, capability proposals, and gated self-improvement.
when: 用户要求 AILIS 优化自己、持续学习偏好、修复 Tool/MCP/Skill、拉取新能力、或改进前端/人物渲染体验时。
tools:
  - self_evolution
  - self_debugger
  - capability_manager
  - tool_doctor
triggers:
  - 优化你自己
  - 记住我的偏好
  - 自我进化
  - 自我迭代
  - 修复工具
  - 接入新的 MCP
  - 改进人物渲染
---

# 自我进化 Skill

这个 Skill 让 AILIS 通过对话和任务执行来优化自己，而不是要求用户去控制面板里手动找入口。

## 工作方式

1. 用 `self_evolution.analyze` 汇总近期长期偏好、工具健康瓶颈、MCP/Skill/外部能力缺口，生成可审查的提案。
2. 将提案解释成人类容易理解的版本：发现了什么、证据是什么、风险多高、推荐下一步是什么。
3. 如果用户要采纳某个提案，先用 `mark_proposal` 记录审批或拒绝，再用 `apply_proposal` 执行。
4. 偏好类提案只写入长期记忆；工具/MCP/前端/代码/人物渲染类提案必须进入 `self_debugger` 或 `capability_manager` 的证据、验证、回滚流程。
5. 应用失败或权限不足时，要保留提案和审计记录，向用户说明当前卡点和可继续的下一步。

## 边界

- 不把用户引导去控制面板打开自我进化中心。
- 不把 proposal JSON 原样回复给用户。
- 不绕过审批应用提案。
- 不直接裸改自身代码、前端或渲染资源；必须先有提案、证据、验证和回滚路径。
- 不把密钥、完整 transcript 或原始日志暴露给用户；只输出脱敏摘要。
