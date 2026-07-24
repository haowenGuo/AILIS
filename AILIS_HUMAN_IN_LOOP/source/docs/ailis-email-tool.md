# AILIS Email Tool

AILIS 自带一个本地 `email` 工具，用 IMAP 读取邮箱、用 SMTP 发送邮件。它不是 OpenClaw 的 `message` channel，而是适合个人桌面助手的轻量邮箱管理基座。

## 支持范围

第一版内置 3 类邮箱预设：

| Provider | IMAP | SMTP | 密钥类型 |
| --- | --- | --- | --- |
| `qq` | `imap.qq.com:993` | `smtp.qq.com:465` | QQ 邮箱授权码 |
| `gmail` | `imap.gmail.com:993` | `smtp.gmail.com:465` | App Password 或 OAuth2 access token |
| `outlook` | `outlook.office365.com:993` | `smtp.office365.com:587` | OAuth2 access token，账号允许时可用应用专用密码 |

重要：不要把网页登录密码直接发给 Agent。QQ 通常用授权码；Gmail 推荐 OAuth2，也支持 App Password；Outlook/Microsoft 365 推荐 OAuth2，很多组织账号已经禁用 Basic Auth。

## 工具接口

统一工具名：`email`

动作：

- `providers`：列出支持的邮箱预设
- `list` / `search`：读取邮件列表
- `read`：按 IMAP UID 读取邮件正文和附件元数据
- `draft`：生成邮件草稿，不发出
- `send`：发送邮件，需要审批
- `mark_read` / `mark_unread`：修改已读状态，需要审批
- `move`：移动邮件，需要审批
- `delete`：删除邮件，需要审批

## 通过 Gateway 调用

列出 Provider：

```json
{
  "tool": "email",
  "args": {
    "action": "providers"
  }
}
```

查看 QQ 收件箱：

```json
{
  "tool": "email",
  "args": {
    "action": "list",
    "provider": "qq",
    "account": "you@qq.com",
    "secret": "QQ邮箱授权码",
    "limit": 10
  }
}
```

读取某封邮件：

```json
{
  "tool": "email",
  "args": {
    "action": "read",
    "provider": "gmail",
    "account": "you@gmail.com",
    "secret": "Google App Password 或 OAuth2 token",
    "uid": 123
  }
}
```

草拟邮件：

```json
{
  "tool": "email",
  "args": {
    "action": "draft",
    "to": "friend@example.com",
    "subject": "周报",
    "text": "这是草稿内容"
  }
}
```

发送邮件：

```json
{
  "tool": "email",
  "args": {
    "action": "send",
    "provider": "outlook",
    "account": "you@outlook.com",
    "secret": "OAuth2 access token 或应用专用密码",
    "to": "friend@example.com",
    "subject": "你好",
    "text": "正文"
  },
  "context": {
    "approved": true
  }
}
```

没有 `context.approved=true` 时，`send/delete/move/mark_*` 会返回 `needs_approval`。

## 环境变量

为了避免把密钥写进聊天记录，建议先用环境变量：

```powershell
$env:AILIS_EMAIL_QQ_ACCOUNT="you@qq.com"
$env:AILIS_EMAIL_QQ_SECRET="QQ邮箱授权码"
$env:AILIS_EMAIL_GMAIL_ACCOUNT="you@gmail.com"
$env:AILIS_EMAIL_GMAIL_SECRET="Google App Password 或 OAuth2 token"
$env:AILIS_EMAIL_OUTLOOK_ACCOUNT="you@outlook.com"
$env:AILIS_EMAIL_OUTLOOK_SECRET="OAuth2 access token 或应用专用密码"
```

之后 Agent 里可以直接说：

```text
查看今天的邮件
查看未读邮件
读取邮件 123
草拟邮件给 friend@example.com 主题 周报 内容 今天进展如下...
```

## 安全策略

- Gateway 审计会脱敏 `secret/password/token/pass/authCode` 等字段。
- 邮件发送、删除、移动、标记已读/未读都需要审批。
- 草拟邮件不会触网，也不需要密钥。
- 第一版不保存邮箱密钥；桌面控制面板后续可以接系统密钥库或 Electron `safeStorage`。

## 官方接入资料

- Gmail IMAP/SMTP: https://support.google.com/mail/answer/7126229
- Gmail API / OAuth: https://developers.google.com/gmail/api/auth/about-auth
- Microsoft IMAP/POP/SMTP OAuth: https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth
- QQ 邮箱授权码获取参考: https://consumer.huawei.com/cn/support/content/zh-cn15872097/
- Nodemailer SMTP client: https://nodemailer.com/smtp/
- ImapFlow IMAP client: https://imapflow.com/
