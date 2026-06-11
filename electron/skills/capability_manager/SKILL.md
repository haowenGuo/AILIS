---
id: capability_manager
label: 能力安装与自修复 Skill
description: Capability registry, installer, skill auto-authoring, rollback, and approved repair execution.
when: 用户要求安装新能力、接入 MCP/Skill、修复工具链、或让 AIGL 自我迭代能力时。
tools:
  - capability_manager
  - tool_doctor
  - mcp_bridge
triggers:
  - 安装某个功能
  - 接入 MCP
  - 新增 Skill
  - 修复工具
  - 自我迭代能力
---

# 能力安装与自修复 Skill

这个 Skill 负责让 AIGL 把“我缺少某个功能”变成可验证的能力生命周期，而不是直接靠提示词硬猜。

## 工作方式

1. 先用 `capability_manager.registry` 或 `refresh_registry` 查看已有能力。
2. 如果能力缺失，先用 `search_tool_candidates` 搜索核心工具目录和 MCP Registry 候选；命中外部 MCP 后用 `plan_mcp_candidate` 转成安装计划。
3. `smoke_mcp_candidate` 只能在用户确认或完全控制模式允许后执行，用于临时启动/连接 MCP 并确认 initialize、tools/list、direct spec 生成都通过。
4. 对新工具 schema 先走 contract intake：`list_contract_sources` 查看来源，`compile_contract`/`lint_contract` 单个检查，`intake_contracts` 批量入库。缺 `required`、`whenNotToUse`、示例、错误恢复或 smoke profile 的 contract 不要暴露给 Agent。
5. 如用户要求直接批量暴露外部工具，先用 `configure_external_auth_profile` 配置只保存 envVar 引用的授权 profile，再用 `bulk_expose_external_tools` 导入 Composio/OpenAPI/MCP Registry/MCP specs。OpenAPI 用 `enableOpenApiAdapter`，Composio 用 `enableComposioAdapter`，并传入 `authProfileId`。
6. 执行外部工具统一用 `execute_exposed_external_tool`；验收用 `smoke_exposed_external_tool`。必须区分 `callable=true` 和 `callable=false`：live MCP direct spec、已配置 openapi_http adapter、已配置 composio_rest_v3 adapter 可执行；contract/candidate 只能用于规划、安装、适配或请求授权。写型 OpenAPI 和 Composio 默认需要审批。
6. 用户确认或完全控制模式允许后，再用 `install_capability` 执行计划。
7. 安装 MCP 后必须健康检查、导入 tool schema，并自动生成对应 `SKILL.md`；不通过 contract lint 和 smoke test 的 MCP 不允许标记为 verified。
8. 任务完成后可用 `record_tool_outcome` 记录任务到工具的成败，下一次用 `recommend_tools` 优先加载验证过的工具。
9. 修复补丁必须先 `execute_repair` dry-run/patch check，确认后应用，验证失败要回滚。

## 边界

- 不静默安装未知来源代码。
- 不跳过验证把能力标记为可用。
- 不把内部安装日志原样暴露给普通用户，要由 Persona Surface 做自然解释。
- 密钥类配置允许本地保存，但输出和报告必须脱敏。
