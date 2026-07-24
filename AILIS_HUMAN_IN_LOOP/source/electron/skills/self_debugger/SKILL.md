---
id: self_debugger
label: 自我排查 Skill
description: Dedicated self-debug loop for AILIS bugs with evidence collection, diagnosis, patch proposal, validation, and approved repair execution.
when: 用户反馈 AILIS 自身 bug、工具异常、Agent Loop 不稳定、能力退化，或明确要求 AILIS 自己检查并修复问题时。
tools:
  - self_debugger
  - capability_manager
  - tool_doctor
triggers:
  - AILIS 出 BUG
  - 自己检查代码
  - 自我修复
  - 修复 Agent Loop
  - 工具链异常
---

# 自我排查 Skill

这个 Skill 把“用户反馈 AILIS 有 bug”变成一条可恢复、可审计的修复协议。普通 Agent 仍然负责理解问题和写候选补丁，但自修复必须先进入 `self_debugger`，不要直接裸改项目。

## 工作方式

1. 用 `self_debugger.open_case` 或 `run_loop` 建立 debug case，记录用户反馈、影响能力、最近 runId 和 source hints。
2. 用 `collect_evidence` 收集 transcript、audit log、相关源码片段、Tool Doctor 健康检查和 Capability Registry 快照。
3. 用 `diagnose` 生成诊断包，明确缺失证据、疑似文件、验证命令和修复协议。
4. 如果诊断证据足够，Agent 生成最小 unified diff，并用 `propose_patch` 登记 repair proposal。
5. 用 `validate_patch` 走 Capability Manager 的 dry-run patch check；只有验证通过并获得确认后，才能用 `apply_patch`。
6. `apply_patch` 必须通过 Capability Manager 执行，验证失败要回滚，不能把未验证补丁标记为修复完成。

## 边界

- 不凭感觉改核心代码；先收证据。
- 不跳过 `validate_patch`。
- 不在未确认时应用补丁。
- 不把 transcript、密钥、原始日志完整暴露给用户；用户可见回复由 Persona Surface 做自然摘要。
- 自我修复失败时，要说明当前缺少什么证据或验证没有通过，并保留 case 方便继续。
