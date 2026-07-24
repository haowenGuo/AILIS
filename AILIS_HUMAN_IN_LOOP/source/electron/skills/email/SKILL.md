---
id: email
label: 邮箱 Skill
description: Read, search, draft, and send mail through configured QQ, Gmail, and Outlook providers.
when: 检查、读取、搜索、整理、草拟、发送 QQ/Gmail/Outlook 邮件。
tools:
  - email
triggers:
  - 查邮件
  - 未读邮件
  - 帮我写邮件
---
# Email Skill

邮箱任务必须优先使用 `email` 工具，不要用 computer.exec、浏览器或系统邮件客户端替代。

规则：
- 检查新邮件或未读邮件：使用 `action=list`，通常加 `filter=unread` 和 `limit=10`。
- 搜索邮件：使用 `action=search`，再根据结果 `read/get` 具体邮件。
- 发送、标记、移动、删除属于外部副作用，需要走 Gateway 审批策略。
- 如果工具返回 `needs_config`，不要臆造 IMAP/OAuth 信息，提示用户去控制面板配置。
- 不要发明 `check_new/open_mail/browser_email` 这类 action。
