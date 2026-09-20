from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Text, func
from backend.core.database import Base


class Conversation(Base):
    """会话表：存储长期记忆"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, comment="会话ID，前端可传，默认default")
    role = Column(String, comment="角色: user / assistant")
    content = Column(Text, comment="消息内容")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Document(Base):
    """RAG文档表：存储上传的知识库文档"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, comment="文件名")
    content = Column(Text, comment="文档内容")
    chunk_id = Column(String, comment="向量库中的Chunk ID")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AppUser(Base):
    """官网账号。

    账号、会话和付费状态属于官网账户域，与桌面端本地状态分开保存。
    密码只保存 PBKDF2 摘要，永远不保存明文。
    """

    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    display_name = Column(String(120), nullable=False, default="")
    password_hash = Column(String(512), nullable=False)
    stripe_customer_id = Column(String(255), index=True, nullable=False, default="")
    membership_status = Column(String(32), nullable=False, default="free")
    membership_plan = Column(String(64), nullable=False, default="free")
    membership_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppSession(Base):
    """官网登录会话，token 只通过 HttpOnly Cookie 或 Bearer 传递。"""

    __tablename__ = "app_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppUserSecurity(Base):
    """用户安全扩展，不把安全状态堆进账号主表。

    这样未来增加邮箱验证、二次验证或密码版本时，只扩展安全域，
    不需要改变 app_users 的核心身份结构。
    """

    __tablename__ = "app_user_security"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    password_changed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppAccountToken(Base):
    """邮箱验证、密码重置等一次性账户 Token。

    只保存 Token 摘要；原始 Token 只在生成时交给邮件发送适配器，
    不会落库，purpose 让同一套机制可以扩展更多账户流程。
    """

    __tablename__ = "app_account_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    purpose = Column(String(48), index=True, nullable=False)
    token_hash = Column(String(128), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppSessionMeta(Base):
    """会话安全元数据，与现有 app_sessions 解耦。

    旧会话表已经在线使用，因此不直接追加列；CSRF 摘要、设备和最近
    活动信息单独存放，新会话可以立即获得完整安全能力。
    """

    __tablename__ = "app_session_meta"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, unique=True, index=True, nullable=False)
    csrf_token_hash = Column(String(128), nullable=False, default="")
    device_label = Column(String(120), nullable=False, default="")
    user_agent = Column(String(500), nullable=False, default="")
    ip_address = Column(String(64), nullable=False, default="")
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppLoginThrottle(Base):
    """持久化登录失败窗口，避免多进程部署时每个进程各自限流。"""

    __tablename__ = "app_login_throttles"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(128), unique=True, index=True, nullable=False)
    failed_count = Column(Integer, nullable=False, default=0)
    window_started_at = Column(DateTime(timezone=True), nullable=False)
    blocked_until = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppPayment(Base):
    """Stripe Checkout/订阅事件的幂等本地记录。"""

    __tablename__ = "app_payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    stripe_session_id = Column(String(255), unique=True, index=True, nullable=False)
    stripe_customer_id = Column(String(255), index=True, nullable=False, default="")
    stripe_subscription_id = Column(String(255), index=True, nullable=False, default="")
    mode = Column(String(32), nullable=False, default="subscription")
    status = Column(String(64), nullable=False, default="")
    payment_status = Column(String(64), nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppApiUsage(Base):
    """按月记录模型和语音 API 用量，供会员额度与后台审计使用。"""

    __tablename__ = "app_api_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    endpoint = Column(String(64), index=True, nullable=False)
    units = Column(Integer, nullable=False, default=1)
    status = Column(String(32), nullable=False, default="accepted")
    period_key = Column(String(16), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppAdminAuditLog(Base):
    """会员状态和后台操作的最小审计日志。"""

    __tablename__ = "app_admin_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, nullable=True)
    target_user_id = Column(Integer, nullable=True)
    action = Column(String(120), nullable=False)
    detail = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppTokenAccount(Base):
    """用户 Token 账户。

    Token 余额单独放在这张表里，不给已有 app_users 表追加字段，
    这样旧数据库通过 create_all 初始化时也能平滑升级。
    """

    __tablename__ = "app_token_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    balance = Column(BigInteger, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppTokenLedger(Base):
    """Token 余额流水。

    idempotency_key 保证支付回调重试不会重复入账；delta 为正表示充值，
    为负表示未来的模型消费扣减。
    """

    __tablename__ = "app_token_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    delta = Column(BigInteger, nullable=False)
    balance_after = Column(BigInteger, nullable=False)
    entry_type = Column(String(32), nullable=False, default="adjustment")
    source = Column(String(32), nullable=False, default="system")
    reference_id = Column(String(255), nullable=False, default="")
    idempotency_key = Column(String(255), unique=True, index=True, nullable=False)
    note = Column(String(500), nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AppPaymentOrder(Base):
    """微信/支付宝会员订阅订单。

    package_id 指向服务端配置的会员计划；token_amount 是该计划本周期
    对应的 Token 额度。支付适配器验签前，订单永远不能进入 paid。
    """

    __tablename__ = "app_payment_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, index=True, nullable=False)
    provider = Column(String(16), index=True, nullable=False)
    package_id = Column(String(64), nullable=False)
    amount_fen = Column(Integer, nullable=False, default=0)
    token_amount = Column(BigInteger, nullable=False, default=0)
    status = Column(String(32), index=True, nullable=False, default="created")
    provider_trade_id = Column(String(255), index=True, nullable=False, default="")
    notify_payload = Column(Text, nullable=False, default="")
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class AppMembershipSubscription(Base):
    """用户当前及历史会员订阅状态。

    订阅状态与支付订单分开保存：订单记录每次付款，订阅记录当前周期、
    provider subscription id 和本周期 Token 额度。
    """

    __tablename__ = "app_membership_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    provider = Column(String(16), nullable=False)
    plan_id = Column(String(64), nullable=False)
    status = Column(String(32), index=True, nullable=False, default="pending")
    provider_subscription_id = Column(String(255), index=True, nullable=False, default="")
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    period_token_quota = Column(BigInteger, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
