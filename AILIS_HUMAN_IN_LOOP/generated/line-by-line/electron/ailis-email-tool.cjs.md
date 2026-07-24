# electron/ailis-email-tool.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：邮件工具：在账户与审批边界内读取或发送邮件。
- 文件类型：`source-code`
- 原始行数：1131
- SHA-256：`470f200d1342fe7b56f24dc155720909919c39548fc67ef9572ecd5f72df2288`
- 可运行副本：[打开源文件](../../../source/electron/ailis-email-tool.cjs)
- 依赖：`imapflow`、`nodemailer`、`mailparser`
- 主要符号：`nodemailer`、`DEFAULT_LIST_LIMIT`、`DEFAULT_BODY_CHARS`、`GMAIL_API_BASE`、`MICROSOFT_GRAPH_BASE`、`PROVIDERS`、`normalizeString`、`trimmed`、`normalizeBoolean`、`compactText`、`text`、`normalized`、`toArray`、`redactSecret`、`extractEmailAddress`、`match`、`inferProviderFromAccount`、`email`、`domain`、`cloneProvider`、`listProviderDetails`、`createTextResult`、`createErrorResult`、`resolveEnvSecret`、`upperProvider`、`env`、`emailEnv`、`secretEnv`、`matchedAccount`、`resolveContextEmailProfile`、`profiles`、`direct`、`requested`、`account`、`resolveDefaultProviderFromContext`、`explicit`、`profile`、`resolveAccessToken`、`resolveProviderConfig`、`explicitProvider`、`requestedAccount`、`inferredProvider`、`provider`、`envProfile`、`storedProfile`、`secret`、`authType`、`buildImapClient`、`imap`、`auth`、`buildSmtpTransport`、`smtp`、`buildSearchQuery`、`query`、`filter`、`since`、`before`、`from`、`to`、`subject`、`formatAddressList`、`normalizeEnvelope`、`envelope`、`withImapMailbox`、`client`、`lock`、`oauthConfig`、`tenant`、`actionOauthAuthorizeUrl`、`config`、`clientId`、`redirectUri`、`scopes`、`params`、`url`、`actionOauthToken`、`clientSecret`、`code`、`refreshToken`、`body`、`response`、`payload`、`fetchJsonWithBearer`、`actionGmailApi`、`accessToken`、`userId`、`threadId`、`result`、`actionOutlookGraph`、`mailbox`、`root`、`messageId`、`listMessages`、`limit`、`searchQuery`、`uids`、`selected`、`messages`、`readMessage`、`uid`、`found`、`parsed`、`details`、`buildMailOptions`、`cc`、`bcc`、`html`、`draftMessage`、`sendMessage`、`transport`、`info`、`mutateMessage`、`action`、`targetMailbox`、`executeEmailTool`、`providerId`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const { ImapFlow } = require('imapflow');</code> | 导入依赖 `imapflow`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 2 | <code>const nodemailer = require('nodemailer');</code> | 导入依赖 `nodemailer`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 3 | <code>const { simpleParser } = require('mailparser');</code> | 导入依赖 `mailparser`，使本文件可以复用外部模块能力。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const DEFAULT_LIST_LIMIT = 10;</code> | 声明局部标识符 `DEFAULT_LIST_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 6 | <code>const DEFAULT_BODY_CHARS = 4000;</code> | 声明局部标识符 `DEFAULT_BODY_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 7 | <code>const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';</code> | 声明局部标识符 `GMAIL_API_BASE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 8 | <code>const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0';</code> | 声明局部标识符 `MICROSOFT_GRAPH_BASE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>const PROVIDERS = Object.freeze({</code> | 声明局部标识符 `PROVIDERS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 11 | <code>    qq: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 12 | <code>        id: 'qq',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 13 | <code>        label: 'QQ Mail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 14 | <code>        domains: Object.freeze(['qq.com', 'vip.qq.com', 'foxmail.com']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 15 | <code>        imap: Object.freeze({ host: 'imap.qq.com', port: 993, secure: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 16 | <code>        smtp: Object.freeze({ host: 'smtp.qq.com', port: 465, secure: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 17 | <code>        secretLabel: 'QQ 邮箱授权码',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 18 | <code>        notes: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 19 | <code>            'QQ 邮箱第三方客户端通常使用 IMAP/SMTP 授权码，不是网页登录密码。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 20 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>    gmail: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 23 | <code>        id: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 24 | <code>        label: 'Gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 25 | <code>        domains: Object.freeze(['gmail.com', 'googlemail.com']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 26 | <code>        imap: Object.freeze({ host: 'imap.gmail.com', port: 993, secure: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 27 | <code>        smtp: Object.freeze({ host: 'smtp.gmail.com', port: 465, secure: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 28 | <code>        secretLabel: 'Google App Password 或 OAuth2 access token',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 29 | <code>        notes: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 30 | <code>            'Gmail 推荐 OAuth2；启用两步验证的个人账号也可用 App Password 走 IMAP/SMTP。'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 31 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>    outlook: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 34 | <code>        id: 'outlook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 35 | <code>        label: 'Outlook / Microsoft 365',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 36 | <code>        domains: Object.freeze(['outlook.com', 'hotmail.com', 'live.com', 'msn.com']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 37 | <code>        imap: Object.freeze({ host: 'outlook.office365.com', port: 993, secure: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 38 | <code>        smtp: Object.freeze({ host: 'smtp.office365.com', port: 587, secure: false, requireTLS: true }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 39 | <code>        secretLabel: 'OAuth2 access token，或账号允许时的应用专用密码',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 40 | <code>        notes: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 41 | <code>            'Microsoft 365/Exchange Online 现代推荐 OAuth2；很多组织账号已经禁用 Basic Auth。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 42 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 47 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 48 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 51 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>function normalizeBoolean(value, fallback = false) {</code> | 定义函数 `normalizeBoolean`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 55 | <code>    if (typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 59 | <code>        if (/^(true&#124;1&#124;yes&#124;on)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 61 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>        if (/^(false&#124;0&#124;no&#124;off)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 63 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>function compactText(value, maxChars = DEFAULT_BODY_CHARS) {</code> | 定义函数 `compactText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 70 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 71 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    const normalized = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 75 | <code>    return normalized.length &gt; maxChars ? `${normalized.slice(0, maxChars - 3)}...` : normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 76 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>function toArray(value) {</code> | 定义函数 `toArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 79 | <code>    if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 80 | <code>        return value.map((entry) =&gt; normalizeString(entry)).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>    const normalized = normalizeString(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 83 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 85 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>    return normalized</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 87 | <code>        .split(',')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 88 | <code>        .map((entry) =&gt; entry.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 89 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 90 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>function redactSecret(value) {</code> | 定义函数 `redactSecret`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 93 | <code>    const normalized = normalizeString(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 94 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 95 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 96 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    if (normalized.length &lt;= 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 98 | <code>        return '***';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>    return `${normalized.slice(0, 4)}...${normalized.slice(-4)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 101 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>function extractEmailAddress(value) {</code> | 定义函数 `extractEmailAddress`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 104 | <code>    const normalized = normalizeString(value).toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 105 | <code>    const match = normalized.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 106 | <code>    return match ? match[0] : normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>function inferProviderFromAccount(account) {</code> | 定义函数 `inferProviderFromAccount`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 110 | <code>    const email = extractEmailAddress(account);</code> | 声明局部标识符 `email`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 111 | <code>    const domain = email.split('@')[1] &#124;&#124; '';</code> | 声明局部标识符 `domain`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 112 | <code>    for (const provider of Object.values(PROVIDERS)) {</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 113 | <code>        if (provider.domains.includes(domain)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 114 | <code>            return provider.id;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 115 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>function cloneProvider(provider) {</code> | 定义函数 `cloneProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 121 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>        id: provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 123 | <code>        label: provider.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 124 | <code>        domains: [...provider.domains],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 125 | <code>        imap: { ...provider.imap },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 126 | <code>        smtp: { ...provider.smtp },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 127 | <code>        secretLabel: provider.secretLabel,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 128 | <code>        notes: [...provider.notes]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 129 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>function listProviderDetails() {</code> | 定义函数 `listProviderDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 133 | <code>    return Object.values(PROVIDERS).map((provider) =&gt; cloneProvider(provider));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>function createTextResult(text, details = {}) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 137 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>        content: text ? [{ type: 'text', text }] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 139 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 140 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>function createErrorResult(status, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 144 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 146 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 147 | <code>                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 148 | <code>                text: message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 149 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>        isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 152 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 153 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 154 | <code>            error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 155 | <code>            ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>function resolveEnvSecret(providerId, account) {</code> | 定义函数 `resolveEnvSecret`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 161 | <code>    const upperProvider = providerId.toUpperCase();</code> | 声明局部标识符 `upperProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 162 | <code>    const env = process.env;</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 163 | <code>    const emailEnv = env[`AILIS_EMAIL_${upperProvider}_ACCOUNT`];</code> | 声明局部标识符 `emailEnv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 164 | <code>    const secretEnv =</code> | 声明局部标识符 `secretEnv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 165 | <code>        env[`AILIS_EMAIL_${upperProvider}_SECRET`] &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 166 | <code>        env[`AILIS_EMAIL_${upperProvider}_PASSWORD`] &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 167 | <code>        env[`AILIS_EMAIL_${upperProvider}_APP_PASSWORD`] &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 168 | <code>        env[`AILIS_EMAIL_${upperProvider}_AUTH_CODE`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 169 | <code>        '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>    const matchedAccount = normalizeString(account &#124;&#124; emailEnv);</code> | 声明局部标识符 `matchedAccount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 172 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>        account: matchedAccount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 174 | <code>        secret: normalizeString(secretEnv)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 175 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>function resolveContextEmailProfile(providerId, requestedAccount = '', context = {}) {</code> | 定义函数 `resolveContextEmailProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 179 | <code>    const profiles = context.emailProfiles &#124;&#124; context.emailAccounts &#124;&#124; context.emailCredentials &#124;&#124; {};</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 180 | <code>    if (!profiles &#124;&#124; typeof profiles !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 181 | <code>        return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    const direct = profiles[providerId] &#124;&#124; profiles[String(providerId &#124;&#124; '').toLowerCase()];</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 184 | <code>    const requested = extractEmailAddress(requestedAccount);</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 185 | <code>    if (direct &amp;&amp; typeof direct === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 186 | <code>        const account = extractEmailAddress(direct.account &#124;&#124; direct.email &#124;&#124; direct.username &#124;&#124; direct.user);</code> | 声明局部标识符 `account`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 187 | <code>        if (!requested &#124;&#124; !account &#124;&#124; requested === account) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>            return direct;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 189 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    for (const profile of Object.values(profiles)) {</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 192 | <code>        if (!profile &#124;&#124; typeof profile !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 194 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>        const account = extractEmailAddress(profile.account &#124;&#124; profile.email &#124;&#124; profile.username &#124;&#124; profile.user);</code> | 声明局部标识符 `account`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 196 | <code>        if (requested &amp;&amp; account === requested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 197 | <code>            return profile;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 198 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>function resolveDefaultProviderFromContext(context = {}) {</code> | 定义函数 `resolveDefaultProviderFromContext`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 204 | <code>    const explicit = normalizeString(context.emailProvider &#124;&#124; context.defaultEmailProvider).toLowerCase();</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 205 | <code>    if (explicit &amp;&amp; PROVIDERS[explicit]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 206 | <code>        return explicit;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 207 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    const profiles = context.emailProfiles &#124;&#124; context.emailAccounts &#124;&#124; context.emailCredentials &#124;&#124; {};</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 209 | <code>    if (!profiles &#124;&#124; typeof profiles !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>    for (const providerId of Object.keys(PROVIDERS)) {</code> | 声明局部标识符 `providerId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 213 | <code>        const profile = profiles[providerId];</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 214 | <code>        if (profile &amp;&amp; typeof profile === 'object' &amp;&amp; normalizeString(profile.account &#124;&#124; profile.email)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 215 | <code>            return providerId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>function resolveAccessToken(providerId, args = {}, context = {}) {</code> | 定义函数 `resolveAccessToken`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 222 | <code>    const upperProvider = providerId.toUpperCase();</code> | 声明局部标识符 `upperProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 223 | <code>    const profile = resolveContextEmailProfile(providerId, args.account &#124;&#124; args.email &#124;&#124; args.userId, context);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 224 | <code>    return normalizeString(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 225 | <code>        args.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 226 | <code>            args.token &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 227 | <code>            args.auth?.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 228 | <code>            profile.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 229 | <code>            profile.token &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 230 | <code>            profile.secret &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 231 | <code>            process.env[`AILIS_EMAIL_${upperProvider}_ACCESS_TOKEN`] &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 232 | <code>            process.env[`AILIS_EMAIL_${upperProvider}_SECRET`] &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 233 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 234 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>function resolveProviderConfig(args = {}, context = {}) {</code> | 定义函数 `resolveProviderConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 238 | <code>    const explicitProvider = normalizeString(args.provider &#124;&#124; args.service &#124;&#124; args.kind).toLowerCase();</code> | 声明局部标识符 `explicitProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 239 | <code>    const requestedAccount = normalizeString(args.account &#124;&#124; args.email &#124;&#124; args.username &#124;&#124; args.user);</code> | 声明局部标识符 `requestedAccount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 240 | <code>    const inferredProvider =</code> | 声明局部标识符 `inferredProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 241 | <code>        explicitProvider &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 242 | <code>        inferProviderFromAccount(requestedAccount) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 243 | <code>        resolveDefaultProviderFromContext(context) &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 244 | <code>        'qq';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 245 | <code>    const provider = PROVIDERS[inferredProvider];</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 246 | <code>    if (!provider) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 248 | <code>            error: createErrorResult('needs_config', `不支持的邮箱 provider：${inferredProvider}`, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 249 | <code>                supportedProviders: Object.keys(PROVIDERS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 250 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>    const envProfile = resolveEnvSecret(provider.id, requestedAccount);</code> | 声明局部标识符 `envProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 255 | <code>    const storedProfile = resolveContextEmailProfile(provider.id, requestedAccount &#124;&#124; envProfile.account, context);</code> | 声明局部标识符 `storedProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 256 | <code>    const account = normalizeString(</code> | 声明局部标识符 `account`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 257 | <code>        requestedAccount &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 258 | <code>            storedProfile.account &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 259 | <code>            storedProfile.email &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 260 | <code>            storedProfile.username &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 261 | <code>            storedProfile.user &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 262 | <code>            envProfile.account</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 263 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>    const secret = normalizeString(</code> | 声明局部标识符 `secret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 265 | <code>        args.secret &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 266 | <code>            args.password &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 267 | <code>            args.pass &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 268 | <code>            args.appPassword &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 269 | <code>            args.authCode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 270 | <code>            args.authorizationCode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 271 | <code>            args.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 272 | <code>            storedProfile.secret &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 273 | <code>            storedProfile.password &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 274 | <code>            storedProfile.pass &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 275 | <code>            storedProfile.appPassword &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 276 | <code>            storedProfile.authCode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 277 | <code>            storedProfile.authorizationCode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 278 | <code>            storedProfile.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 279 | <code>            envProfile.secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 280 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>    const authType = normalizeString(</code> | 声明局部标识符 `authType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 282 | <code>        args.authType &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 283 | <code>            args.auth?.type &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 284 | <code>            storedProfile.authType &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 285 | <code>            storedProfile.auth?.type &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 286 | <code>            (args.accessToken &#124;&#124; storedProfile.accessToken ? 'oauth2' : 'password'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 287 | <code>        'password'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 288 | <code>    ).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 290 | <code>    if (!account) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 292 | <code>            error: createErrorResult('needs_config', 'email 工具需要 account/email 参数，或在控制面板配置邮箱账号，或设置 AILIS_EMAIL_&lt;PROVIDER&gt;_ACCOUNT。', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 293 | <code>                provider: provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 294 | <code>                envAccount: `AILIS_EMAIL_${provider.id.toUpperCase()}_ACCOUNT`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 295 | <code>                desktopConfig: '控制面板 -&gt; 邮箱账号'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 296 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    if (!secret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 300 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 301 | <code>            error: createErrorResult(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 302 | <code>                'needs_config',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 303 | <code>                `email 工具需要 ${provider.secretLabel}。可以在控制面板保存，或在参数 secret/password/appPassword/authCode/accessToken 中传入，或设置 AILIS_EMAIL_${provider.id.toUpperCase()}_SECRET。`,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 304 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 305 | <code>                    provider: provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 306 | <code>                    account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 307 | <code>                    secretLabel: provider.secretLabel,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 308 | <code>                    envSecret: `AILIS_EMAIL_${provider.id.toUpperCase()}_SECRET`,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 309 | <code>                    desktopConfig: '控制面板 -&gt; 邮箱账号'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 310 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 316 | <code>        provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 317 | <code>        account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 318 | <code>        secret,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 319 | <code>        authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 320 | <code>        mailbox: normalizeString(args.mailbox, 'INBOX')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 321 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>function buildImapClient({ provider, account, secret, authType, args }) {</code> | 定义函数 `buildImapClient`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 325 | <code>    const imap = {</code> | 声明局部标识符 `imap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 326 | <code>        ...provider.imap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 327 | <code>        ...(args.imap &amp;&amp; typeof args.imap === 'object' ? args.imap : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 328 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>    const auth =</code> | 声明局部标识符 `auth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 330 | <code>        authType === 'oauth2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 331 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 332 | <code>                  user: account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 333 | <code>                  accessToken: secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 334 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 336 | <code>                  user: account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 337 | <code>                  pass: secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 338 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>    return new ImapFlow({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 340 | <code>        host: imap.host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 341 | <code>        port: Number(imap.port &#124;&#124; 993),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 342 | <code>        secure: imap.secure !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 343 | <code>        auth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 344 | <code>        logger: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 345 | <code>        tls: imap.rejectUnauthorized === false ? { rejectUnauthorized: false } : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 346 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>function buildSmtpTransport({ provider, account, secret, authType, args }) {</code> | 定义函数 `buildSmtpTransport`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 350 | <code>    const smtp = {</code> | 声明局部标识符 `smtp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 351 | <code>        ...provider.smtp,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 352 | <code>        ...(args.smtp &amp;&amp; typeof args.smtp === 'object' ? args.smtp : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 353 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    const auth =</code> | 声明局部标识符 `auth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 355 | <code>        authType === 'oauth2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 356 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 357 | <code>                  type: 'OAuth2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 358 | <code>                  user: account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 359 | <code>                  accessToken: secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 360 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 362 | <code>                  user: account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 363 | <code>                  pass: secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 364 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>    return nodemailer.createTransport({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 366 | <code>        host: smtp.host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 367 | <code>        port: Number(smtp.port &#124;&#124; 465),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 368 | <code>        secure: smtp.secure !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 369 | <code>        requireTLS: Boolean(smtp.requireTLS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 370 | <code>        auth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 371 | <code>        tls: smtp.rejectUnauthorized === false ? { rejectUnauthorized: false } : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 372 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>function buildSearchQuery(args = {}) {</code> | 定义函数 `buildSearchQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 376 | <code>    const query = {};</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 377 | <code>    const filter = normalizeString(args.filter &#124;&#124; args.query &#124;&#124; args.search).toLowerCase();</code> | 声明局部标识符 `filter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 378 | <code>    if (filter === 'unread' &#124;&#124; filter === 'unseen' &#124;&#124; args.unreadOnly === true &#124;&#124; args.unseenOnly === true &#124;&#124; args.onlyUnread === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 379 | <code>        query.seen = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 380 | <code>    } else if (filter === 'seen' &#124;&#124; filter === 'read' &#124;&#124; args.seenOnly === true &#124;&#124; args.onlyRead === true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 381 | <code>        query.seen = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 382 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>    const since = normalizeString(args.since &#124;&#124; args.after);</code> | 声明局部标识符 `since`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 384 | <code>    if (since) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 385 | <code>        query.since = new Date(since);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 386 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>    const before = normalizeString(args.before);</code> | 声明局部标识符 `before`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 388 | <code>    if (before) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>        query.before = new Date(before);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 390 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>    const from = normalizeString(args.from);</code> | 声明局部标识符 `from`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 392 | <code>    if (from) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 393 | <code>        query.from = from;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 394 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>    const to = normalizeString(args.to);</code> | 声明局部标识符 `to`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 396 | <code>    if (to) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 397 | <code>        query.to = to;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 398 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>    const subject = normalizeString(args.subject);</code> | 声明局部标识符 `subject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 400 | <code>    if (subject) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 401 | <code>        query.subject = subject;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 402 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    const text = normalizeString(args.text &#124;&#124; args.body);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 404 | <code>    if (text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 405 | <code>        query.body = text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 406 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>    return Object.keys(query).length ? query : { all: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 408 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>function formatAddressList(addresses) {</code> | 定义函数 `formatAddressList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 411 | <code>    if (!Array.isArray(addresses)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 412 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 413 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>    return addresses</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 415 | <code>        .map((entry) =&gt; entry?.name ? `${entry.name} &lt;${entry.address}&gt;` : entry?.address)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 416 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 417 | <code>        .join(', ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 418 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>function normalizeEnvelope(message) {</code> | 定义函数 `normalizeEnvelope`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 421 | <code>    const envelope = message.envelope &#124;&#124; {};</code> | 声明局部标识符 `envelope`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 422 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 423 | <code>        uid: message.uid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 424 | <code>        seq: message.seq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 425 | <code>        flags: Array.isArray(message.flags) ? message.flags : [...(message.flags &#124;&#124; [])],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 426 | <code>        subject: normalizeString(envelope.subject, '(无主题)'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 427 | <code>        from: formatAddressList(envelope.from),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 428 | <code>        to: formatAddressList(envelope.to),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 429 | <code>        date: envelope.date ? new Date(envelope.date).toISOString() : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 430 | <code>        messageId: normalizeString(envelope.messageId)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 431 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>async function withImapMailbox(config, args, action) {</code> | 定义函数 `withImapMailbox`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 435 | <code>    const client = buildImapClient({ ...config, args });</code> | 声明局部标识符 `client`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 436 | <code>    await client.connect();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 437 | <code>    let lock = null;</code> | 声明局部标识符 `lock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 438 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 439 | <code>        lock = await client.getMailboxLock(config.mailbox);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 440 | <code>        return await action(client);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 441 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 442 | <code>        if (lock) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 443 | <code>            lock.release();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 444 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>        await client.logout().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 446 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>function oauthConfig(providerId, args = {}) {</code> | 定义函数 `oauthConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 450 | <code>    const provider = normalizeString(providerId &#124;&#124; args.provider &#124;&#124; args.service, 'gmail').toLowerCase();</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 451 | <code>    if (provider === 'gmail' &#124;&#124; provider === 'google') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 452 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 453 | <code>            provider: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 454 | <code>            authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 455 | <code>            tokenUrl: 'https://oauth2.googleapis.com/token',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 456 | <code>            defaultScopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send']</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 457 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>    if (provider === 'outlook' &#124;&#124; provider === 'microsoft' &#124;&#124; provider === 'office365') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 460 | <code>        const tenant = normalizeString(args.tenant &#124;&#124; args.tenantId, 'common');</code> | 声明局部标识符 `tenant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 461 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 462 | <code>            provider: 'outlook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 463 | <code>            authorizeUrl: `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 464 | <code>            tokenUrl: `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 465 | <code>            defaultScopes: ['offline_access', 'User.Read', 'Mail.ReadWrite', 'Mail.Send']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 466 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 467 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 469 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>function actionOauthAuthorizeUrl(args = {}) {</code> | 定义函数 `actionOauthAuthorizeUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 472 | <code>    const config = oauthConfig(args.provider, args);</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 473 | <code>    if (!config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 474 | <code>        return createErrorResult('needs_config', 'oauth_authorize_url 只支持 gmail/outlook。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 475 | <code>            supportedProviders: ['gmail', 'outlook']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 476 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>    const clientId = normalizeString(args.clientId &#124;&#124; args.client_id);</code> | 声明局部标识符 `clientId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 479 | <code>    const redirectUri = normalizeString(args.redirectUri &#124;&#124; args.redirect_uri);</code> | 声明局部标识符 `redirectUri`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 480 | <code>    if (!clientId &#124;&#124; !redirectUri) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 481 | <code>        return createErrorResult('needs_config', 'oauth_authorize_url 需要 clientId 和 redirectUri。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 482 | <code>            provider: config.provider</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 483 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>    const scopes = toArray(args.scopes &#124;&#124; args.scope);</code> | 声明局部标识符 `scopes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 486 | <code>    const params = new URLSearchParams({</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 487 | <code>        client_id: clientId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 488 | <code>        redirect_uri: redirectUri,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 489 | <code>        response_type: 'code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 490 | <code>        scope: (scopes.length ? scopes : config.defaultScopes).join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 491 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 492 | <code>    if (config.provider === 'gmail') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 493 | <code>        params.set('access_type', 'offline');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 494 | <code>        params.set('prompt', 'consent');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 495 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>    if (args.state) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 497 | <code>        params.set('state', normalizeString(args.state));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 498 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>    const url = `${config.authorizeUrl}?${params.toString()}`;</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 500 | <code>    return createTextResult(url, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 501 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 502 | <code>        action: 'oauth_authorize_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 503 | <code>        provider: config.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 504 | <code>        url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 505 | <code>        scopes: scopes.length ? scopes : config.defaultScopes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 506 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>async function actionOauthToken(args = {}, grantType = 'authorization_code') {</code> | 定义函数 `actionOauthToken`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 510 | <code>    const config = oauthConfig(args.provider, args);</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 511 | <code>    if (!config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 512 | <code>        return createErrorResult('needs_config', `${grantType} 只支持 gmail/outlook。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 513 | <code>            supportedProviders: ['gmail', 'outlook']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 514 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>    const clientId = normalizeString(args.clientId &#124;&#124; args.client_id);</code> | 声明局部标识符 `clientId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 517 | <code>    const clientSecret = normalizeString(args.clientSecret &#124;&#124; args.client_secret);</code> | 声明局部标识符 `clientSecret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 518 | <code>    const redirectUri = normalizeString(args.redirectUri &#124;&#124; args.redirect_uri);</code> | 声明局部标识符 `redirectUri`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 519 | <code>    const code = normalizeString(args.code &#124;&#124; args.authorizationCode);</code> | 声明局部标识符 `code`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 520 | <code>    const refreshToken = normalizeString(args.refreshToken &#124;&#124; args.refresh_token);</code> | 声明局部标识符 `refreshToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 521 | <code>    if (!clientId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 522 | <code>        return createErrorResult('needs_config', `${grantType} 需要 clientId。`, { provider: config.provider });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>    if (grantType === 'authorization_code' &amp;&amp; (!code &#124;&#124; !redirectUri)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 525 | <code>        return createErrorResult('needs_config', 'oauth_exchange_code 需要 code 和 redirectUri。', { provider: config.provider });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 526 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>    if (grantType === 'refresh_token' &amp;&amp; !refreshToken) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 528 | <code>        return createErrorResult('needs_config', 'oauth_refresh 需要 refreshToken。', { provider: config.provider });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 529 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>    const scopes = toArray(args.scopes &#124;&#124; args.scope);</code> | 声明局部标识符 `scopes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 531 | <code>    const body = new URLSearchParams({</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 532 | <code>        client_id: clientId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 533 | <code>        grant_type: grantType</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 534 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>    if (clientSecret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 536 | <code>        body.set('client_secret', clientSecret);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 537 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>    if (grantType === 'authorization_code') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 539 | <code>        body.set('code', code);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 540 | <code>        body.set('redirect_uri', redirectUri);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 541 | <code>        if (args.codeVerifier &#124;&#124; args.code_verifier) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 542 | <code>            body.set('code_verifier', normalizeString(args.codeVerifier &#124;&#124; args.code_verifier));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 543 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 545 | <code>        body.set('refresh_token', refreshToken);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 546 | <code>        if (scopes.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 547 | <code>            body.set('scope', scopes.join(' '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 548 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 551 | <code>        return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 552 | <code>            action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 553 | <code>            provider: config.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 554 | <code>            tokenUrl: config.tokenUrl,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 555 | <code>            body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 556 | <code>                ...Object.fromEntries(body.entries()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 557 | <code>                client_secret: clientSecret ? redactSecret(clientSecret) : undefined,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 558 | <code>                refresh_token: refreshToken ? redactSecret(refreshToken) : undefined,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 559 | <code>                code: code ? redactSecret(code) : undefined</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 560 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>        }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 562 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 563 | <code>            action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 564 | <code>            provider: config.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 565 | <code>            dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 566 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>    const response = await fetch(config.tokenUrl, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 569 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 570 | <code>        headers: { 'content-type': 'application/x-www-form-urlencoded' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 571 | <code>        body</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 572 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    const payload = await response.json().catch(async () =&gt; ({ raw: await response.text().catch(() =&gt; '') }));</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 574 | <code>    if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 575 | <code>        return createErrorResult('provider_error', payload?.error_description &#124;&#124; payload?.error &#124;&#124; `OAuth token 请求失败：${response.status}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 576 | <code>            provider: config.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 577 | <code>            statusCode: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 578 | <code>            payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 579 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>    return createTextResult(JSON.stringify(payload, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 582 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 583 | <code>        action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 584 | <code>        provider: config.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 585 | <code>        tokenType: payload.token_type &#124;&#124; '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 586 | <code>        expiresIn: payload.expires_in &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 587 | <code>        scope: payload.scope &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 588 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 589 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>async function fetchJsonWithBearer(url, accessToken, init = {}) {</code> | 定义函数 `fetchJsonWithBearer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 592 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 593 | <code>        ...init,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 594 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 595 | <code>            authorization: `Bearer ${accessToken}`,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 596 | <code>            accept: 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 597 | <code>            ...(init.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 598 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 599 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>    const payload = await response.json().catch(async () =&gt; ({ raw: await response.text().catch(() =&gt; '') }));</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 601 | <code>    if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 602 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 603 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 604 | <code>            status: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 605 | <code>            payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 606 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 609 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 610 | <code>        status: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 611 | <code>        payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 612 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 614 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 615 | <code>async function actionGmailApi(args = {}, action = 'gmail_list_labels', context = {}) {</code> | 定义函数 `actionGmailApi`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 616 | <code>    const accessToken = resolveAccessToken('gmail', args, context);</code> | 声明局部标识符 `accessToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 617 | <code>    if (!accessToken) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 618 | <code>        return createErrorResult('needs_config', `${action} 需要 Gmail OAuth accessToken，或 AILIS_EMAIL_GMAIL_ACCESS_TOKEN。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 619 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 620 | <code>            provider: 'gmail'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 621 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>    const userId = encodeURIComponent(normalizeString(args.userId &#124;&#124; args.account &#124;&#124; args.email, 'me'));</code> | 声明局部标识符 `userId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 624 | <code>    let url = '';</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 625 | <code>    if (action === 'gmail_list_labels') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 626 | <code>        url = `${GMAIL_API_BASE}/users/${userId}/labels`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 627 | <code>    } else if (action === 'gmail_list_threads') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 628 | <code>        const params = new URLSearchParams();</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 629 | <code>        if (args.q &#124;&#124; args.query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 630 | <code>            params.set('q', normalizeString(args.q &#124;&#124; args.query));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 631 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>        for (const label of toArray(args.labelIds &#124;&#124; args.labels)) {</code> | 声明局部标识符 `label`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 633 | <code>            params.append('labelIds', label);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 634 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>        params.set('maxResults', String(Math.min(Math.max(Number(args.limit &#124;&#124; args.maxResults &#124;&#124; 10), 1), 100)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 636 | <code>        url = `${GMAIL_API_BASE}/users/${userId}/threads?${params.toString()}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 637 | <code>    } else if (action === 'gmail_get_thread') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 638 | <code>        const threadId = normalizeString(args.threadId &#124;&#124; args.id);</code> | 声明局部标识符 `threadId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 639 | <code>        if (!threadId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 640 | <code>            return createErrorResult('needs_config', 'gmail_get_thread 需要 threadId/id。', { action });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 641 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 642 | <code>        const params = new URLSearchParams({</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 643 | <code>            format: normalizeString(args.format, 'metadata')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 644 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>        url = `${GMAIL_API_BASE}/users/${userId}/threads/${encodeURIComponent(threadId)}?${params.toString()}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 646 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>    const result = await fetchJsonWithBearer(url, accessToken);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 648 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 649 | <code>        return createErrorResult('provider_error', result.payload?.error?.message &#124;&#124; `Gmail API 请求失败：${result.status}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 650 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 651 | <code>            provider: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 652 | <code>            statusCode: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 653 | <code>            payload: result.payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 654 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>    return createTextResult(JSON.stringify(result.payload, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 657 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 658 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 659 | <code>        provider: 'gmail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 660 | <code>        payload: result.payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 661 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>async function actionOutlookGraph(args = {}, action = 'outlook_graph_messages', context = {}) {</code> | 定义函数 `actionOutlookGraph`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 665 | <code>    const accessToken = resolveAccessToken('outlook', args, context);</code> | 声明局部标识符 `accessToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 666 | <code>    if (!accessToken) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 667 | <code>        return createErrorResult('needs_config', `${action} 需要 Outlook/Microsoft Graph accessToken，或 AILIS_EMAIL_OUTLOOK_ACCESS_TOKEN。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 668 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 669 | <code>            provider: 'outlook'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 670 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 671 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 672 | <code>    const mailbox = normalizeString(args.mailbox &#124;&#124; args.userId &#124;&#124; args.account);</code> | 声明局部标识符 `mailbox`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 673 | <code>    const root = mailbox ? `${MICROSOFT_GRAPH_BASE}/users/${encodeURIComponent(mailbox)}` : `${MICROSOFT_GRAPH_BASE}/me`;</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 674 | <code>    let url = '';</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 675 | <code>    if (action === 'outlook_graph_messages') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 676 | <code>        const params = new URLSearchParams({</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 677 | <code>            '$top': String(Math.min(Math.max(Number(args.limit &#124;&#124; args.top &#124;&#124; 10), 1), 100)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 678 | <code>            '$select': normalizeString(args.select, 'id,subject,from,toRecipients,receivedDateTime,isRead,conversationId')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 679 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>        if (args.filter) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 681 | <code>            params.set('$filter', normalizeString(args.filter));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 682 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 683 | <code>        if (args.search) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 684 | <code>            params.set('$search', normalizeString(args.search));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 685 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>        url = `${root}/messages?${params.toString()}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 687 | <code>    } else if (action === 'outlook_graph_folders') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 688 | <code>        url = `${root}/mailFolders`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 689 | <code>    } else if (action === 'outlook_graph_message') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 690 | <code>        const messageId = normalizeString(args.messageId &#124;&#124; args.id);</code> | 声明局部标识符 `messageId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 691 | <code>        if (!messageId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 692 | <code>            return createErrorResult('needs_config', 'outlook_graph_message 需要 messageId/id。', { action });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 693 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 694 | <code>        url = `${root}/messages/${encodeURIComponent(messageId)}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 695 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>    const result = await fetchJsonWithBearer(url, accessToken, args.search ? { headers: { ConsistencyLevel: 'eventual' } } : {});</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 697 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 698 | <code>        return createErrorResult('provider_error', result.payload?.error?.message &#124;&#124; `Microsoft Graph 请求失败：${result.status}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 699 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 700 | <code>            provider: 'outlook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 701 | <code>            statusCode: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 702 | <code>            payload: result.payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 703 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 704 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>    return createTextResult(JSON.stringify(result.payload, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 706 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 707 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 708 | <code>        provider: 'outlook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 709 | <code>        payload: result.payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 710 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>async function listMessages(config, args) {</code> | 定义函数 `listMessages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 714 | <code>    const limit = Math.min(Math.max(Number(args.limit &#124;&#124; DEFAULT_LIST_LIMIT), 1), 50);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 715 | <code>    const searchQuery = buildSearchQuery(args);</code> | 声明局部标识符 `searchQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 716 | <code>    return await withImapMailbox(config, args, async (client) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 717 | <code>        const uids = await client.search(searchQuery, { uid: true });</code> | 声明局部标识符 `uids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 718 | <code>        const selected = uids.slice(-limit).reverse();</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 719 | <code>        const messages = [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 720 | <code>        if (!selected.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 721 | <code>            return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 722 | <code>                JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 723 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 724 | <code>                        provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 725 | <code>                        account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 726 | <code>                        mailbox: config.mailbox,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 727 | <code>                        count: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 728 | <code>                        messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 729 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>                    null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 731 | <code>                    2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 732 | <code>                ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 734 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 735 | <code>                    action: 'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 736 | <code>                    provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 737 | <code>                    account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 738 | <code>                    mailbox: config.mailbox,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 739 | <code>                    count: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 740 | <code>                    messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 741 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 743 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>        for await (const message of client.fetch(selected, {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 745 | <code>            uid: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 746 | <code>            flags: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 747 | <code>            envelope: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 748 | <code>        }, { uid: true })) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 749 | <code>            messages.push(normalizeEnvelope(message));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 750 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 751 | <code>        messages.sort((a, b) =&gt; Number(b.uid &#124;&#124; 0) - Number(a.uid &#124;&#124; 0));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 752 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>            JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 754 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 755 | <code>                    provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 756 | <code>                    account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 757 | <code>                    mailbox: config.mailbox,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 758 | <code>                    count: messages.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 759 | <code>                    messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 760 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>                null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 762 | <code>                2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 763 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 765 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 766 | <code>                action: 'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 767 | <code>                provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 768 | <code>                account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 769 | <code>                mailbox: config.mailbox,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 770 | <code>                count: messages.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 771 | <code>                messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 772 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>async function readMessage(config, args) {</code> | 定义函数 `readMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 778 | <code>    const uid = Number(args.uid &#124;&#124; args.messageId &#124;&#124; args.id);</code> | 声明局部标识符 `uid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 779 | <code>    if (!Number.isFinite(uid) &#124;&#124; uid &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 780 | <code>        return createErrorResult('needs_config', '读取邮件需要 uid/messageId 参数。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 781 | <code>            action: 'read'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 782 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 783 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 784 | <code>    return await withImapMailbox(config, args, async (client) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 785 | <code>        let found = null;</code> | 声明局部标识符 `found`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 786 | <code>        for await (const message of client.fetch(`${uid}`, {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 787 | <code>            uid: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 788 | <code>            flags: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 789 | <code>            envelope: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 790 | <code>            source: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 791 | <code>        }, { uid: true })) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 792 | <code>            found = message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 793 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 794 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>        if (!found) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 796 | <code>            return createErrorResult('not_found', `没有找到 uid=${uid} 的邮件。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 797 | <code>                action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 798 | <code>                uid</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 799 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 800 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 801 | <code>        const parsed = found.source ? await simpleParser(found.source) : null;</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 802 | <code>        const details = {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 803 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 804 | <code>            action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 805 | <code>            provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 806 | <code>            account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 807 | <code>            mailbox: config.mailbox,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 808 | <code>            message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 809 | <code>                ...normalizeEnvelope(found),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 810 | <code>                text: compactText(parsed?.text &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 811 | <code>                html: compactText(parsed?.html &#124;&#124; '', Number(args.maxHtmlChars &#124;&#124; 1000)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 812 | <code>                attachments: Array.isArray(parsed?.attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 813 | <code>                    ? parsed.attachments.map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 814 | <code>                          filename: attachment.filename &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 815 | <code>                          contentType: attachment.contentType &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 816 | <code>                          size: attachment.size &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 817 | <code>                      }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>                    : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 819 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 821 | <code>        return createTextResult(JSON.stringify(details.message, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 822 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 823 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>function buildMailOptions(config, args) {</code> | 定义函数 `buildMailOptions`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 826 | <code>    const to = toArray(args.to &#124;&#124; args.target &#124;&#124; args.recipients);</code> | 声明局部标识符 `to`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 827 | <code>    const cc = toArray(args.cc);</code> | 声明局部标识符 `cc`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 828 | <code>    const bcc = toArray(args.bcc);</code> | 声明局部标识符 `bcc`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 829 | <code>    const subject = normalizeString(args.subject, '(无主题)');</code> | 声明局部标识符 `subject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 830 | <code>    const text = normalizeString(args.text &#124;&#124; args.body &#124;&#124; args.message &#124;&#124; args.content);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 831 | <code>    const html = normalizeString(args.html);</code> | 声明局部标识符 `html`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 832 | <code>    if (!to.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 833 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 834 | <code>            error: createErrorResult('needs_config', '发送/草拟邮件需要 to/target/recipients。', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 835 | <code>                action: normalizeString(args.action, 'send')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 836 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 839 | <code>    if (!text &amp;&amp; !html) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 840 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 841 | <code>            error: createErrorResult('needs_config', '发送/草拟邮件需要 text/body/message/content 或 html。', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 842 | <code>                action: normalizeString(args.action, 'send')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 843 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 847 | <code>        mail: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 848 | <code>            from: normalizeString(args.from, config.account),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 849 | <code>            to,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 850 | <code>            cc,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 851 | <code>            bcc,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 852 | <code>            subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 853 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 854 | <code>            html</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 855 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 859 | <code>async function draftMessage(config, args) {</code> | 定义函数 `draftMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 860 | <code>    const { mail, error } = buildMailOptions(config, args);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 861 | <code>    if (error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 862 | <code>        return error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 863 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 864 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 865 | <code>        JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 866 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 867 | <code>                provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 868 | <code>                account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 869 | <code>                draft: mail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 870 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 871 | <code>            null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 872 | <code>            2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 873 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 874 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 875 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 876 | <code>            action: 'draft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 877 | <code>            provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 878 | <code>            account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 879 | <code>            draft: mail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 880 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 881 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 882 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>async function sendMessage(config, args, context) {</code> | 定义函数 `sendMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 885 | <code>    const { mail, error } = buildMailOptions(config, args);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 886 | <code>    if (error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 887 | <code>        return error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 888 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 889 | <code>    if (normalizeBoolean(args.dryRun, false)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 890 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 891 | <code>            JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 892 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 893 | <code>                    provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 894 | <code>                    account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 895 | <code>                    dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 896 | <code>                    draft: mail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 897 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>                null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 899 | <code>                2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 900 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 902 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 903 | <code>                action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 904 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 905 | <code>                provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 906 | <code>                account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 907 | <code>                draft: mail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 908 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 909 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 911 | <code>    if (context.approved !== true &amp;&amp; args.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 912 | <code>        return createErrorResult('needs_approval', '发送邮件需要用户确认：context.approved=true。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 913 | <code>            action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 914 | <code>            provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 915 | <code>            account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 916 | <code>            draft: mail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 917 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 918 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 919 | <code>    const transport = buildSmtpTransport({ ...config, args });</code> | 声明局部标识符 `transport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 920 | <code>    const info = await transport.sendMail(mail);</code> | 声明局部标识符 `info`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 921 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 922 | <code>        JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 923 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 924 | <code>                provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 925 | <code>                account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 926 | <code>                accepted: info.accepted &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 927 | <code>                rejected: info.rejected &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 928 | <code>                messageId: info.messageId &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 929 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>            null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 931 | <code>            2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 932 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 933 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 934 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 935 | <code>            action: 'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 936 | <code>            provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 937 | <code>            account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 938 | <code>            accepted: info.accepted &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 939 | <code>            rejected: info.rejected &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 940 | <code>            messageId: info.messageId &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 941 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 942 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>async function mutateMessage(config, args, context) {</code> | 定义函数 `mutateMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 946 | <code>    const action = normalizeString(args.action).toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 947 | <code>    const uid = Number(args.uid &#124;&#124; args.messageId &#124;&#124; args.id);</code> | 声明局部标识符 `uid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 948 | <code>    if (!Number.isFinite(uid) &#124;&#124; uid &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 949 | <code>        return createErrorResult('needs_config', `${action} 需要 uid/messageId 参数。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 950 | <code>            action</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 951 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>    if (context.approved !== true &amp;&amp; args.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 954 | <code>        return createErrorResult('needs_approval', `${action} 是会修改邮箱状态的操作，需要用户确认：context.approved=true。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 955 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 956 | <code>            uid</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 957 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 958 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>    return await withImapMailbox(config, args, async (client) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 960 | <code>        if (action === 'mark_read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 961 | <code>            await client.messageFlagsAdd(`${uid}`, ['\\Seen'], { uid: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 962 | <code>        } else if (action === 'mark_unread') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 963 | <code>            await client.messageFlagsRemove(`${uid}`, ['\\Seen'], { uid: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 964 | <code>        } else if (action === 'delete') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 965 | <code>            await client.messageDelete(`${uid}`, { uid: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 966 | <code>        } else if (action === 'move') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 967 | <code>            const targetMailbox = normalizeString(args.targetMailbox &#124;&#124; args.toMailbox &#124;&#124; args.target);</code> | 声明局部标识符 `targetMailbox`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 968 | <code>            if (!targetMailbox) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 969 | <code>                return createErrorResult('needs_config', 'move 需要 targetMailbox/toMailbox 参数。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 970 | <code>                    action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 971 | <code>                    uid</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 972 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 974 | <code>            await client.messageMove(`${uid}`, targetMailbox, { uid: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 975 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 977 | <code>            JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 978 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 979 | <code>                    provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 980 | <code>                    account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 981 | <code>                    action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 982 | <code>                    uid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 983 | <code>                    status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 984 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 985 | <code>                null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 986 | <code>                2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 987 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 989 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 990 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 991 | <code>                provider: config.provider.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 992 | <code>                account: config.account,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 993 | <code>                uid</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 994 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 995 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 997 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 998 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 999 | <code>async function executeEmailTool(args = {}, context = {}) {</code> | 定义函数 `executeEmailTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1000 | <code>    const action = normalizeString(args.action &#124;&#124; args.intent &#124;&#124; args.operation, 'list').toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1001 | <code>    if (action === 'providers' &#124;&#124; action === 'provider_list' &#124;&#124; action === 'schema') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1002 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1003 | <code>            JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1004 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1005 | <code>                    providers: listProviderDetails(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1006 | <code>                    actions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1007 | <code>                        'providers',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1008 | <code>                        'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1009 | <code>                        'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1010 | <code>                        'draft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1011 | <code>                        'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1012 | <code>                        'mark_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1013 | <code>                        'mark_unread',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1014 | <code>                        'move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1015 | <code>                        'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1016 | <code>                        'oauth_authorize_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1017 | <code>                        'oauth_exchange_code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1018 | <code>                        'oauth_refresh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1019 | <code>                        'gmail_list_labels',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1020 | <code>                        'gmail_list_threads',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1021 | <code>                        'gmail_get_thread',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1022 | <code>                        'outlook_graph_messages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1023 | <code>                        'outlook_graph_message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1024 | <code>                        'outlook_graph_folders'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1025 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1027 | <code>                null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1028 | <code>                2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1029 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1030 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1031 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1032 | <code>                action: 'providers',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1033 | <code>                providers: listProviderDetails()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1034 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1036 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1038 | <code>    if (action === 'oauth_authorize_url' &#124;&#124; action === 'oauth_url') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1039 | <code>        return actionOauthAuthorizeUrl(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1040 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1041 | <code>    if (action === 'oauth_exchange_code' &#124;&#124; action === 'oauth_token') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1042 | <code>        return await actionOauthToken(args, 'authorization_code');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1043 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>    if (action === 'oauth_refresh' &#124;&#124; action === 'refresh_token') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1045 | <code>        return await actionOauthToken(args, 'refresh_token');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1046 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>    if (['gmail_list_labels', 'gmail_list_threads', 'gmail_get_thread'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1048 | <code>        return await actionGmailApi(args, action, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1049 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>    if (['outlook_graph_messages', 'outlook_graph_message', 'outlook_graph_folders'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1051 | <code>        return await actionOutlookGraph(args, action, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1052 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1053 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1054 | <code>    if (action === 'draft' &#124;&#124; action === 'compose') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1055 | <code>        const requestedAccount = normalizeString(args.account &#124;&#124; args.email &#124;&#124; args.username &#124;&#124; args.user);</code> | 声明局部标识符 `requestedAccount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1056 | <code>        const providerId = normalizeString(</code> | 声明局部标识符 `providerId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1057 | <code>            args.provider &#124;&#124; inferProviderFromAccount(requestedAccount) &#124;&#124; resolveDefaultProviderFromContext(context),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1058 | <code>            'qq'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1059 | <code>        ).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1060 | <code>        const provider = PROVIDERS[providerId] &#124;&#124; PROVIDERS.qq;</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1061 | <code>        const envProfile = resolveEnvSecret(provider.id, requestedAccount);</code> | 声明局部标识符 `envProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1062 | <code>        const storedProfile = resolveContextEmailProfile(provider.id, requestedAccount &#124;&#124; envProfile.account, context);</code> | 声明局部标识符 `storedProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1063 | <code>        return await draftMessage(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1064 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1065 | <code>                provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1066 | <code>                account: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1067 | <code>                    requestedAccount &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1068 | <code>                        storedProfile.account &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1069 | <code>                        storedProfile.email &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1070 | <code>                        envProfile.account &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1071 | <code>                        args.from &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1072 | <code>                        '未配置发件账号'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1073 | <code>                ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1074 | <code>                secret: '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1075 | <code>                authType: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1076 | <code>                mailbox: normalizeString(args.mailbox, 'INBOX')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1077 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>            args</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1079 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1080 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1081 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1082 | <code>    const config = resolveProviderConfig(args, context);</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1083 | <code>    if (config.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1084 | <code>        return config.error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1085 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1086 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1087 | <code>    if (action === 'list' &#124;&#124; action === 'search' &#124;&#124; action === 'inbox') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1088 | <code>        return await listMessages(config, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1089 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1090 | <code>    if (action === 'read' &#124;&#124; action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1091 | <code>        return await readMessage(config, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1092 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>    if (action === 'send') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1094 | <code>        return await sendMessage(config, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1095 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1096 | <code>    if (['mark_read', 'mark_unread', 'move', 'delete'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1097 | <code>        return await mutateMessage(config, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1098 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1100 | <code>    return createErrorResult('needs_config', `不支持的 email action：${action}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1101 | <code>        supportedActions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1102 | <code>            'providers',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1103 | <code>            'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1104 | <code>            'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1105 | <code>            'draft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1106 | <code>            'send',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1107 | <code>            'mark_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1108 | <code>            'mark_unread',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1109 | <code>            'move',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1110 | <code>            'delete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1111 | <code>            'oauth_authorize_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1112 | <code>            'oauth_exchange_code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1113 | <code>            'oauth_refresh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1114 | <code>            'gmail_list_labels',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1115 | <code>            'gmail_list_threads',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1116 | <code>            'gmail_get_thread',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1117 | <code>            'outlook_graph_messages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1118 | <code>            'outlook_graph_message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1119 | <code>            'outlook_graph_folders'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1120 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1122 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1124 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1125 | <code>    EMAIL_TOOL_ID: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1126 | <code>    PROVIDERS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1127 | <code>    executeEmailTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1128 | <code>    inferProviderFromAccount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1129 | <code>    listProviderDetails,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1130 | <code>    resolveProviderConfig</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“邮件工具：在账户与审批边界内读取或发送邮件。”这一文件职责。 |
| 1131 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
