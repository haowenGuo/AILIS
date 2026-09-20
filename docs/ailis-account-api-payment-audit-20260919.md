# AILIS 用户、API 与支付系统审计

审计日期：2026-09-19；部署状态更新：2026-09-20

本报告区分本地实现、已部署代码与线上配置状态。线上检查为只读，不包含用户数据、密钥或支付凭据。

## 2026-09-20 部署记录

支付协议修复已部署到 `150.109.13.189` 的 `/opt/ailis/source`，发布标识为 `payment-protocol-20260920-v1`。
本次只替换三个文件：`backend/services/payment_providers.py`、`backend/api/token_payments.py`、`backend/services/account_service.py`。
没有修改前端、模型转发策略、价格计划、数据库结构或收费开关。

| 验证项 | 结果 |
| --- | --- |
| 本地协议与 Relay 回归 | 16/16 通过 |
| 服务器隔离回归 | 21/21 通过：14 项支付协议、5 组账户边界、2 项 Relay；使用临时密钥、隔离数据库和模拟平台响应 |
| 原版本与依赖核对 | 三个原文件匹配前次部署；六个关联依赖文件与本地一致 |
| 备份 | 原代码、配置及 SQLite 在线快照已保存；快照 `integrity_check=ok` |
| 服务切换 | 仅重启 `ailis.service`，随后 `/healthz` 返回 `status=ok` |
| 部署后复核 | 三个修复文件与本地 SHA256 一致；六个依赖未变；配置与备份字节一致；服务 `active/running`、`NRestarts=0` |
| 公网冒烟 | 11/11 符合预期；账户状态和页面 200，匿名订单/二维码/余额 401，关闭中的两条支付通知路由 503 |
| 收费状态 | 微信、支付宝、会员门禁、Token 余额门禁均关闭，会员计划为空 |
| 真实支付 | 未测试，尚无商户凭据；离线测试通过不等于生产收款已经开通 |

备份目录：`/opt/ailis/runtime-data/deploy-backups/payment-protocol-20260920-v1`，包含旧文件与新文件 SHA256 清单。
如需回滚此发布，恢复该目录中的三个源文件并重启服务；本次没有数据库迁移，不应为代码回滚覆盖生产数据库、丢弃新数据。
部署前 SFTP 上传曾被连接中断，失败发生在替换生产文件之前；改为单次打包传输并核验内容哈希后完成发布。
服务启动时间为 2026-09-20 00:17:22 CST；检查时自此次启动起未发现 traceback 或 `ERROR:` 日志行。
公网冒烟针对已知 IP 站点跳过了 TLS 证书验证，只验证路由与状态，不代表域名证书部署已经验收。
机器可读核验记录保存在本地 `tmp/payment-protocol-release-20260920-verification.json`，不含用户信息或凭据。

## 续查更正（2026-09-19，当时仅本地修复）

前次“适配器和用户闭环已完成”的结论过早：原离线签名测试由同一实现生成和验证签名，
未能发现与真实平台协议不一致的问题。此次用独立构造的报文与签名重放确认并修复：

- 微信订单号原为 37 字符，超过 Native 接口的 32 字符限制；改为完整的 32 字符 UUID。
- 支付宝签名/验签错误地 URL 编码参数；现使用原始值签名，发送表单时才编码。
- 支付宝下单响应原来未验签；现对原始响应 JSON 片段验签并核对订单号。
- 微信缺少验签头可能跳过校验；现严格检查签名、公钥 ID 和报文时间，并在请求中指定微信支付公钥 ID。
- 支付通知响应改为支付宝纯文本 `success`、微信空包体 HTTP 204；只有入账提交后才确认成功。
- 已付款订单的重复回调仍核对通道、金额、交易号；用户提前续费保留剩余会员天数。
- 下单网络错误进入已存在的订单失败处理路径，返回 502，且不增加额度。

修复前新增 11 项协议回归中 9 项失败；修复后 11 项全部通过，随后扩展篡改响应、未付款通知和网络超时测试，最终 14/14 通过。
这些是临时密钥、隔离数据库和模拟 HTTP 平台测试，尚无真实商户联调。
原有 5 组账户/支付边界及 2 项 LLM Relay 回归也通过。

用户目前只有个人账号；申请路径与配置说明见 [支付开通说明](ailis-payment-onboarding.md)。
微信 APIv3 没有独立沙箱，原文中的“微信沙箱验收”需更正为“离线测试后小额真实联调”。
下方表格保留 2026-09-19 的线上快照；新协议修复的部署状态以上方 2026-09-20 记录为准。

## 结论

| 子系统 | 本地实现 | 线上状态 | 结论 |
| --- | --- | --- | --- |
| 用户系统 | 注册、登录、登出、资料、密码修改、会话管理、CSRF、邮箱验证、密码重置 | 新版会话哈希、邮件接口和会话管理代码已上线 | 线上路由可用；邮件仍等待 SMTP |
| API 访问控制 | 模型/TTS 统一依赖、会员门禁、月度额度、可选 Token 余额扣减、幂等流水 | `membershipRequiredForAiApis=false`，`tokenBalanceRequiredForAiApis=false`，月度限制为 0 | 线上仍保持免费开放，扣费开关尚未启用 |
| Token 账户 | 余额、流水、支付入账、重复回调幂等、请求扣费 | 新版代码已上线；线上当前没有用户/余额数据 | 代码已接通，需启用配置后产生真实账本 |
| 微信/支付宝 | 微信 Native 下单、V3 签名/回调解密；支付宝 RSA2 下单/回调验签；二维码展示和订单轮询 | provider 与账户页已上线；当时为 `disabled`，计划为空 | 已提供下单与通知入账路径；未完成真实平台联调，查单补偿、退款对账仍待实现，不能收款 |
| Stripe | Checkout 回调幂等和支付入账修复 | 未配置，`configured=false` | 当前不提供 Stripe 支付 |
| 数据库 | SQLite/PostgreSQL 边界、连接池、迁移演练 | 线上仍使用 SQLite | 小规模可用；启用并发扣费前应切 PostgreSQL |

## 线上只读证据

检查目标：`https://150.109.13.189`

| 检查项 | 结果 |
| --- | --- |
| `/healthz` | HTTP 200，`status=ok` |
| `/api/account/status` | HTTP 200；会员门禁关闭，月度模型/TTS 限制为 0 |
| `/api/payments/config` | HTTP 200；微信、支付宝均为 `enabled=false`、`ready=false`、`status=disabled`，计划为空 |
| `/api/account/me` | HTTP 200；匿名请求返回 `user=null` |
| `/api/payments/orders` | HTTP 401；匿名请求被拒绝 |
| `/api/payments/qrcode` | HTTP 401；匿名请求被拒绝；本地已验证登录后返回 `image/svg+xml` |
| `/api/llm/status` | HTTP 200（临时 Relay 会话）；上游 `configured=true`，未发起模型请求 |
| `/api/llm/v1/chat/completions` | 路由存在；仍受 Relay 会话、大小、并发和速率限制保护 |
| `/account.html`、`/account.js` | 新账户页 release 已切换；包含二维码展示、订单状态轮询 |
| `/api/stripe/config` | HTTP 200；`configured=false`，支付和订阅模式均关闭 |
| 线上代码 | 新版 `token_payments.py`、`payment_providers.py`、`email_service.py` 已部署；已完成 import/compile smoke |
| 线上数据库 | 20 张 AILIS 业务表；当前 `app_users`、`app_token_accounts`、`app_token_ledger`、`app_payment_orders` 均为 0 行，`conversations` 有 25 行 |

线上 systemd 服务仍是单个 Uvicorn worker，约束为 `MemoryMax=1G`、`CPUQuota=100%`。这不是本次功能失败原因，但意味着线上 SQLite 和单进程配置不适合直接承载高并发支付扣费。

## 本地已验证内容

本地工作区 `F:\AILIS\main` 已完成以下边界实现：

- 会话只在数据库保存哈希；旧明文会话第一次使用时迁移为哈希。
- 注册竞态、登录失败限流、CSRF、会话撤销和其它会话撤销。
- 邮箱验证与密码重置使用一次性哈希 Token，并避免密码重置接口枚举账号。
- 支付订单由服务端计划决定金额和额度，客户端不能提交任意金额。
- 支付回调按 provider、金额、订单号校验，并且重复回调不会重复发放额度或延长会员期。
- Token 余额和流水在同一数据库事务中处理；API 扣费使用幂等键避免重试重复扣费。
- 微信支付 V3 AES-256-GCM 回调、RSA 请求/回调校验，以及支付宝 RSA2 回调校验均有离线边界测试。
- Redis 分布式限流、对象存储 Local/S3 边界、LLM Gateway 连接边界已有独立演练。

本次回归结果：

```text
python -m compileall -q backend                         PASS
account/payment boundary tests (5 groups)               PASS
FastAPI account/payment route smoke                     PASS
payment QR SVG endpoint (authenticated local smoke)     PASS
tests.test_llm_relay_service (2 tests)                  PASS
production SQLite snapshot -> PostgreSQL -> restore     PASS (20 tables / 25 rows)
production snapshot rollback                            PASS (digest unchanged)
git diff --check                                         PASS
```

真实线上快照的 canonical digest 为
`db027ee3d81dab7fee494e513d090f4c08a236c6272d6740bc198d428192d595`；迁移、`pg_dump` 恢复和回滚前后完全一致，生产数据库未被修改。

## 当前风险

### 1. 支付商户配置尚未进入线上

代码已部署并通过公网回归，但线上仍没有真实商户号、证书、私钥、平台公钥、API v3 密钥、公开回调地址和会员计划，因此支付保持 `disabled` 是正确的安全状态。

### 2. LLM Relay 当前是匿名免费策略

线上 `/api/llm/session` 可以在未登录时建立临时 Relay 会话，`/api/llm/status` 返回上游已配置。这与当前
`APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS=false`、`APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS=false` 的免费试用策略一致，
不是账号认证失效。如果正式计费要求每次模型/TTS 调用都绑定账号和余额，应先完成 PostgreSQL 切换、支付沙箱验收，
再开启会员或 Token 门禁。

### 3. 线上 SQLite 不适合作为并发扣费账本

代码中的 PostgreSQL `FOR UPDATE` 在 SQLite 上不会提供同等行锁语义。线上如果直接打开 Token 扣费，多个并发请求可能争用同一余额。因此上线顺序应是：

1. 先完成 PostgreSQL 迁移、恢复校验和回滚演练。
2. 将 `DATABASE_URL` 切换到 PostgreSQL，并验证 API/支付账本。
3. 再设置 `APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS=true`。

### 4. 支付仍缺真实商户配置

代码本身不能替代商户号、证书、私钥、平台公钥、API v3 密钥、回调公网地址和会员计划。缺任何一项都必须保持 disabled/config-incomplete，不能伪造“已支付”。

### 5. 用户系统的邮件功能仍依赖 SMTP

邮箱验证和密码重置接口已实现，但线上没有 SMTP 和公开站点地址时会返回配置未就绪，密码重置仍保持不枚举账号的 accepted 响应。

## 上线前配置清单

只在服务器安全环境中填写，不要提交到 Git：

- `APP_PUBLIC_BASE_URL`
- `APP_MEMBERSHIP_PLANS_JSON`
- 微信：`APP_WECHAT_PAY_ENABLED`、App ID、商户号、证书序列号、商户私钥、平台证书/公钥、API v3 密钥
- 支付宝：`APP_ALIPAY_ENABLED`、App ID、应用私钥、支付宝公钥
- 邮件：`APP_EMAIL_PUBLIC_BASE_URL`、SMTP 主机、端口、账号、密码、发件人
- 计费开关：确认 PostgreSQL 和账本演练通过后，再启用 `APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS`

## 建议的切线上顺序

1. 复制线上 SQLite 数据库到隔离目录，做完整 digest 和可恢复备份。
2. 在临时 PostgreSQL 中执行迁移、恢复、应用启动和回滚演练；保留旧 SQLite，不直接改生产。
3. 先部署代码但保持支付 disabled、Token 扣费 disabled，执行健康、注册、登录、余额查询和旧 API 回归。
4. 注入支付和 SMTP 配置，调用 `/api/payments/config`，确认 provider 为 `ready`、计划非空。
5. 使用支付宝沙箱、微信离线协议测试及开通后的小额真实联调，完成下单、回调、重复回调和金额篡改测试。
6. 最后开启 Token 余额门禁；持续观察支付订单、Token 流水、API 用量和错误率。
7. 代码验证失败时恢复上一版 source；数据库恢复应单独停写、确认迁移边界和新增数据处理方案，不能用旧快照直接覆盖仍有新写入的生产库。

本次已部署后端边界代码；部署前已备份 source、配置和数据库，线上数据库没有写入业务数据，支付也没有被误开启。
