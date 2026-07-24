# electron/skills/email/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：22
- SHA-256：`3745e3a549e53b4fd586258b485c924173cb98f1e7af3952afd947ab4b2821f9`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/email/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: email</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: 邮箱 Skill</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Read, search, draft, and send mail through configured QQ, Gmail, and Outlook providers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 检查、读取、搜索、整理、草拟、发送 QQ/Gmail/Outlook 邮件。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - email</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  - 查邮件</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>  - 未读邮件</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>  - 帮我写邮件</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code># Email Skill</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>邮箱任务必须优先使用 `email` 工具，不要用 computer.exec、浏览器或系统邮件客户端替代。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>- 检查新邮件或未读邮件：使用 `action=list`，通常加 `filter=unread` 和 `limit=10`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- 搜索邮件：使用 `action=search`，再根据结果 `read/get` 具体邮件。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- 发送、标记、移动、删除属于外部副作用，需要走 Gateway 审批策略。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- 如果工具返回 `needs_config`，不要臆造 IMAP/OAuth 信息，提示用户去控制面板配置。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- 不要发明 `check_new/open_mail/browser_email` 这类 action。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
