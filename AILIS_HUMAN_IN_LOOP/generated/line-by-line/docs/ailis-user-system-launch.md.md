# docs/ailis-user-system-launch.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：180
- SHA-256：`ffc9a4ce0ac1e1384808001a108be6f5c2c631aeaf79388937b8ffdf6915f8c9`
- 可运行副本：[打开源文件](../../../source/docs/ailis-user-system-launch.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS User System Launch Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This document defines the production user, membership, payment, and API-access system for AILIS.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>Do not store API keys, Stripe secrets, webhook secrets, or customer payment details in this file.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>## Product Boundary</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>AILIS has two layers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>- Open-source client/runtime: public download and source access.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- Cloud membership service: account login, paid membership, model API access, and TTS API access.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>The frontend can be static, but the following must live on the backend:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- User identity and sessions</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- Password hashing and secret pepper</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- Stripe Checkout Session creation</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- Stripe webhook verification</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- Membership status updates</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- Model API and TTS API access checks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- Usage logging, quota checks, and abuse controls</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>## Current Backend Surface</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>Implemented endpoints:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>- `GET /api/account/status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- `GET /api/account/me`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- `POST /api/account/register`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- `POST /api/account/login`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- `POST /api/account/logout`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- `GET /api/admin/users`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- `GET /api/admin/users/{user_id}`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- `GET /api/admin/users/{user_id}/payments`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- `PATCH /api/admin/users/{user_id}/membership`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `POST /api/admin/users/{user_id}/membership/revoke`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `GET /api/stripe/config`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `POST /api/stripe/checkout-session`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `POST /api/stripe/customer-portal`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `GET /api/stripe/session-status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `POST /api/stripe/webhook`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>Protected member APIs:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>- `POST /api/chat`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- `POST /api/chat/tts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- `POST /api/chat/text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>Current membership logic:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>- New accounts start as `free`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- `payment` Checkout mode grants a time-limited membership controlled by `APP_ONE_TIME_MEMBERSHIP_DAYS`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- `subscription` Checkout mode grants active subscription membership.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>- Stripe webhooks keep subscription status in sync after checkout.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>- Customer Portal lets logged-in users manage their Stripe subscription and payment method.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>- API usage is recorded monthly for model and TTS calls.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>## Required Production Features</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>### Identity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>- Email/password registration and login.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- Password hashing with `APP_PASSWORD_PEPPER`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- Login session expiration with `APP_SESSION_TTL_DAYS`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- `GET /api/account/me` for frontend account state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- Future: email verification, password reset, OAuth login, and session device management.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>### Membership</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>- Store `membership_status`, `membership_plan`, and `membership_expires_at`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- Store Stripe customer ID per user.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- Store every Checkout Session and subscription update.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- Gate model/TTS APIs through backend membership checks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- Future: customer self-service billing portal, plan upgrades/downgrades, refunds, coupons, trials.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>### API Entitlements</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>- Free accounts can log in but cannot call paid model/TTS endpoints when `APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS=true`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- Paid accounts can call model/TTS endpoints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- Future: usage ledger per user, monthly quotas, rate limits, abuse flags, and admin overrides.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>### Admin Operations</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>Minimum admin console/API before public launch:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>- Search users by email.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>- View user membership status and Stripe customer ID.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>- Manually revoke/grant membership for support cases.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- View recent payments and webhook events.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- Re-send or reconcile Stripe subscription state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- Disable abusive accounts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>Current admin API access is controlled by `APP_ADMIN_EMAILS`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>Register/login with one of those emails before calling `/api/admin/*`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>### Security</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>- Never put `STRIPE_SECRET_KEY`, model keys, or TTS keys in frontend code.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- Use HTTPS-only production domains.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- Set `CORS_ALLOW_ORIGINS` to exact frontend origins, not `*`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- Rotate any secret that has been pasted into chat or logs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- Separate test and live Stripe keys/prices/webhooks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- Keep `STRIPE_WEBHOOK_SECRET` configured in Render.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- Log high-level event IDs, not raw card/payment data.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>### Data</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>- Production database: Render Postgres.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- Local/demo database: SQLite is acceptable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>- Before public launch, add migrations instead of relying only on `Base.metadata.create_all`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>- Enable automated Postgres backups and test restore once.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>## Render Deployment Variables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>Set these on the Render backend service:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 118 | <code>APP_SESSION_COOKIE_NAME=ailis_session</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>APP_SESSION_TTL_DAYS=30</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>APP_SESSION_COOKIE_SECURE=true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>APP_SESSION_COOKIE_SAMESITE=lax</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>APP_SESSION_COOKIE_DOMAIN=</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>APP_PASSWORD_PEPPER=&lt;generated long random value&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS=true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>APP_ONE_TIME_MEMBERSHIP_DAYS=30</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>APP_ADMIN_EMAILS=owner@example.com,support@example.com</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>APP_MONTHLY_MODEL_CALL_LIMIT=300</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>APP_MONTHLY_TTS_CALL_LIMIT=100</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>CORS_ALLOW_ORIGINS=https://your-frontend-domain.example</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>DATABASE_URL=&lt;Render Postgres connection string&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>CHROMA_PERSIST_DIR=/opt/render/project/src/backend/data/chroma</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>LLM_API_BASE=&lt;model provider base URL&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>LLM_API_KEY=&lt;secret&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>LLM_MODEL_NAME=&lt;model name&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>ELEVENLABS_API_KEY=&lt;secret&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>ELEVENLABS_VOICE_ID=&lt;voice id&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>STRIPE_API_VERSION=2026-05-27.dahlia</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>STRIPE_PUBLISHABLE_KEY=&lt;pk_live_or_pk_test&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>STRIPE_SECRET_KEY=&lt;sk_live_or_sk_test&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>STRIPE_PAYMENT_PRICE_ID=&lt;one-time membership price&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>STRIPE_SUBSCRIPTION_PRICE_ID=&lt;monthly membership price&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>STRIPE_RETURN_URL=https://your-frontend-domain.example/about-ailis.html?payment=return&amp;session_id={CHECKOUT_SESSION_ID}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>STRIPE_CUSTOMER_PORTAL_RETURN_URL=https://your-frontend-domain.example/about-ailis.html</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>STRIPE_AUTOMATIC_TAX_ENABLED=false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>STRIPE_WEBHOOK_SECRET=&lt;whsec_...&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>Stripe webhook endpoint:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 155 | <code>https://your-render-backend-domain.example/api/stripe/webhook</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>Recommended webhook events:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>- `checkout.session.completed`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>- `customer.subscription.updated`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- `customer.subscription.deleted`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## Launch Checklist</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>- Render backend runs against Postgres, not SQLite.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- Frontend points to the production backend URL.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- `CORS_ALLOW_ORIGINS` includes only the production frontend domain.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- Account sessions use `HttpOnly` cookies.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- For best cookie reliability, put frontend and backend under the same site, for example `ailis.example` and `api.ailis.example`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- If frontend and backend remain cross-site, use `APP_SESSION_COOKIE_SAMESITE=none` and `APP_SESSION_COOKIE_SECURE=true`, then add CSRF protection before public launch.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- Stripe live prices are created and configured.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- Stripe live webhook is configured and verified.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>- Model/TTS keys are set only on Render.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>- Free account receives `402` on paid APIs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- Paid test account receives access to model/TTS APIs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- Logged-in Stripe customer can open the Customer Portal.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>- Admin email listed in `APP_ADMIN_EMAILS` can list users and adjust membership.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 179 | <code>- Admin/support path exists for user lookup and membership reconciliation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- Database backup and restore have been tested.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
