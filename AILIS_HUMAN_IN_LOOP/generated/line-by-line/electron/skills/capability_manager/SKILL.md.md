# electron/skills/capability_manager/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：40
- SHA-256：`c9862a885823c023da1ec564d7fd24844923f369601bac11b752aa3ce52aa9a2`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/capability_manager/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: capability_manager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: 能力安装与自修复 Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Capability registry, installer, skill auto-authoring, rollback, and approved repair execution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 用户要求安装新能力、接入 MCP/Skill、修复工具链、或让 AILIS 自我迭代能力时。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - capability_manager</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>  - tool_doctor</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>  - mcp_bridge</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  - 安装某个功能</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>  - 接入 MCP</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>  - 新增 Skill</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>  - 修复工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>  - 自我迭代能力</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code># 能力安装与自修复 Skill</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>这个 Skill 负责让 AILIS 把“我缺少某个功能”变成可验证的能力生命周期，而不是直接靠提示词硬猜。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>## 工作方式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>1. 先用 `capability_manager.registry` 或 `refresh_registry` 查看已有能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>2. 如果能力缺失，先用 `search_tool_candidates` 搜索核心工具目录和 MCP Registry 候选；命中外部 MCP 后用 `plan_mcp_candidate` 转成安装计划。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>3. `smoke_mcp_candidate` 只能在用户确认或完全控制模式允许后执行，用于临时启动/连接 MCP 并确认 initialize、tools/list、direct spec 生成都通过。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>4. 对新工具 schema 先走 contract intake：`list_contract_sources` 查看来源，`compile_contract`/`lint_contract` 单个检查，`intake_contracts` 批量入库。缺 `required`、`whenNotToUse`、示例、错误恢复或 smoke profile 的 contract 不要暴露给 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>5. 如用户要求直接批量暴露外部工具，先用 `configure_external_auth_profile` 配置只保存 envVar 引用的授权 profile，再用 `bulk_expose_external_tools` 导入 Composio/OpenAPI/MCP Registry/MCP specs。OpenAPI 用 `enableOpenApiAdapter`，Composio 用 `enableComposioAdapter`，并传入 `authProfileId`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>6. 执行外部工具统一用 `execute_exposed_external_tool`；验收用 `smoke_exposed_external_tool`。必须区分 `callable=true` 和 `callable=false`：live MCP direct spec、已配置 openapi_http adapter、已配置 composio_rest_v3 adapter 可执行；contract/candidate 只能用于规划、安装、适配或请求授权。写型 OpenAPI 和 Composio 默认需要审批。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>6. 用户确认或完全控制模式允许后，再用 `install_capability` 执行计划。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>7. 安装 MCP 后必须健康检查、导入 tool schema，并自动生成对应 `SKILL.md`；不通过 contract lint 和 smoke test 的 MCP 不允许标记为 verified。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>8. 任务完成后可用 `record_tool_outcome` 记录任务到工具的成败，下一次用 `recommend_tools` 优先加载验证过的工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>9. 修复补丁必须先 `execute_repair` dry-run/patch check，确认后应用，验证失败要回滚。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>## 边界</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- 不静默安装未知来源代码。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- 不跳过验证把能力标记为可用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- 不把内部安装日志原样暴露给普通用户，要由 Persona Surface 做自然解释。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- 密钥类配置允许本地保存，但输出和报告必须脱敏。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
