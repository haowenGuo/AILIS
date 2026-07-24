# electron/skills/self_debugger/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：37
- SHA-256：`c1af99defbf2d27e1068e87a80c087e20c2c1c45a4768d98c2f17ee7e7c020aa`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/self_debugger/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: self_debugger</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: 自我排查 Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Dedicated self-debug loop for AILIS bugs with evidence collection, diagnosis, patch proposal, validation, and approved repair execution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 用户反馈 AILIS 自身 bug、工具异常、Agent Loop 不稳定、能力退化，或明确要求 AILIS 自己检查并修复问题时。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - self_debugger</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>  - capability_manager</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>  - tool_doctor</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  - AILIS 出 BUG</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>  - 自己检查代码</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>  - 自我修复</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>  - 修复 Agent Loop</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>  - 工具链异常</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code># 自我排查 Skill</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>这个 Skill 把“用户反馈 AILIS 有 bug”变成一条可恢复、可审计的修复协议。普通 Agent 仍然负责理解问题和写候选补丁，但自修复必须先进入 `self_debugger`，不要直接裸改项目。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>## 工作方式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>1. 用 `self_debugger.open_case` 或 `run_loop` 建立 debug case，记录用户反馈、影响能力、最近 runId 和 source hints。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>2. 用 `collect_evidence` 收集 transcript、audit log、相关源码片段、Tool Doctor 健康检查和 Capability Registry 快照。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>3. 用 `diagnose` 生成诊断包，明确缺失证据、疑似文件、验证命令和修复协议。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>4. 如果诊断证据足够，Agent 生成最小 unified diff，并用 `propose_patch` 登记 repair proposal。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>5. 用 `validate_patch` 走 Capability Manager 的 dry-run patch check；只有验证通过并获得确认后，才能用 `apply_patch`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>6. `apply_patch` 必须通过 Capability Manager 执行，验证失败要回滚，不能把未验证补丁标记为修复完成。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>## 边界</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>- 不凭感觉改核心代码；先收证据。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- 不跳过 `validate_patch`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- 不在未确认时应用补丁。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- 不把 transcript、密钥、原始日志完整暴露给用户；用户可见回复由 Persona Surface 做自然摘要。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- 自我修复失败时，要说明当前缺少什么证据或验证没有通过，并保留 case 方便继续。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
