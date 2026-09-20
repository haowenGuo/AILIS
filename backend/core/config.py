from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_DIR / "data"
DEFAULT_DATABASE_URL = f"sqlite+aiosqlite:///{(DATA_DIR / 'app.db').as_posix()}"
DEFAULT_CHROMA_PERSIST_DIR = (DATA_DIR / "chroma").as_posix()


class Settings(BaseSettings):
    """应用全局配置，通过 .env 文件加载"""

    # 服务配置
    APP_NAME: str = "AILIS Backend"
    DEBUG: bool = True
    CORS_ALLOW_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://haowenguo.github.io"

    # 数据库配置 (默认SQLite，生产环境建议换 PostgreSQL)
    DATA_DIR: str = str(DATA_DIR)
    DATABASE_URL: str = DEFAULT_DATABASE_URL
    DATABASE_AUTO_CREATE: bool = True
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT_SECONDS: int = 30
    DATABASE_POOL_RECYCLE_SECONDS: int = 1800
    CHROMA_PERSIST_DIR: str = DEFAULT_CHROMA_PERSIST_DIR

    # Distributed state. The memory default preserves the existing local mode.
    REDIS_URL: str = ""
    AILIS_RELAY_STATE_BACKEND: str = "memory"

    # User files and generated artifacts. Local storage remains the default.
    OBJECT_STORAGE_PROVIDER: str = "local"
    # Empty means DATA_DIR/objects.  Production mounts DATA_DIR writable but
    # keeps the source tree read-only, so source-relative writes are unsafe.
    OBJECT_STORAGE_LOCAL_ROOT: str = ""
    OBJECT_STORAGE_BUCKET: str = ""
    OBJECT_STORAGE_ENDPOINT_URL: str = ""
    OBJECT_STORAGE_REGION: str = ""
    OBJECT_STORAGE_ACCESS_KEY: str = ""
    OBJECT_STORAGE_SECRET_KEY: str = ""

    # ================= 教学子系统配置 =================
    EDU_APP_NAME: str = "仿真教学平台"
    EDU_SESSION_COOKIE_NAME: str = "simteach_session"
    EDU_SESSION_TTL_DAYS: int = 14
    EDU_TEACHER_INVITE_CODE: str = "teacher-demo"
    EDU_PASSWORD_PEPPER: str = ""
    EDU_SEED_ADMIN: bool = True
    EDU_ADMIN_EMAIL: str = "admin@simclass.local"
    EDU_ADMIN_PASSWORD: str = ""
    EDU_ADMIN_PHONE: str = "13800000000"
    EDU_ADMIN_SCHOOL_NAME: str = "仿真人教学教室"
    EDU_HF_DATASET_VIEWER_URL: str = "https://datasets-server.huggingface.co"
    EDU_HF_QUESTION_DATASET: str = "SeaLLMs/SeaExam"
    EDU_HF_QUESTION_CONFIG: str = "m3exam-chinese"
    EDU_HF_QUESTION_SPLIT: str = "test"
    EDU_QUESTION_BANK_CACHE_TTL_SECONDS: int = 900

    # ================= 大模型配置 (核心) =================
    # 支持 OpenAI 兼容接口 (如 DeepSeek, 通义千问, 火山引擎等)
    LLM_API_BASE: str = "https://api.deepseek.com"
    LLM_API_KEY: str = ""
    LLM_MODEL_NAME: str = "deepseek-chat"

    # ================= Hosted AILIS Agent Runtime =================
    AILIS_HOSTED_RUNTIME_ENABLED: bool = True
    AILIS_HOSTED_RUNTIME_URL: str = "http://127.0.0.1:18777"
    AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN: str = ""
    AILIS_HOSTED_RUNTIME_TIMEOUT_SECONDS: int = 360
    AILIS_HOSTED_ATTACHMENT_MAX_BYTES: int = 25 * 1024 * 1024
    AILIS_WEB_SESSION_SECRET: str = ""
    AILIS_WEB_SESSION_TTL_DAYS: int = 180

    # ================= Desktop LLM managed relay =================
    AILIS_LLM_RELAY_ENABLED: bool = True
    AILIS_LLM_RELAY_MAX_BYTES: int = 4 * 1024 * 1024
    AILIS_LLM_RELAY_REQUESTS_PER_MINUTE: int = 30
    AILIS_LLM_RELAY_MAX_CONCURRENT_PER_SESSION: int = 2
    AILIS_LLM_RELAY_IP_REQUESTS_PER_MINUTE: int = 60
    AILIS_LLM_RELAY_GLOBAL_REQUESTS_PER_MINUTE: int = 300
    AILIS_LLM_RELAY_GLOBAL_MAX_CONCURRENT: int = 12
    AILIS_LLM_RELAY_TRUST_PROXY_HEADERS: bool = False
    AILIS_HOSTED_HTTP_MAX_CONNECTIONS: int = 100
    AILIS_HOSTED_HTTP_MAX_KEEPALIVE_CONNECTIONS: int = 20
    AILIS_HOSTED_HTTP_KEEPALIVE_EXPIRY_SECONDS: float = 30.0

    # ================= 官网账号与会员 =================
    APP_SESSION_COOKIE_NAME: str = "ailis_session"
    APP_CSRF_COOKIE_NAME: str = "ailis_csrf"
    APP_SESSION_COOKIE_TTL_DAYS: int = 30
    APP_SESSION_TTL_DAYS: int = 30
    APP_SESSION_COOKIE_SECURE: bool = True
    APP_SESSION_COOKIE_SAMESITE: str = "lax"
    APP_SESSION_COOKIE_DOMAIN: str = ""
    APP_PASSWORD_PEPPER: str = ""
    APP_LOGIN_MAX_FAILURES: int = 8
    APP_LOGIN_WINDOW_MINUTES: int = 15
    APP_LOGIN_LOCK_MINUTES: int = 15
    APP_PASSWORD_RESET_TTL_MINUTES: int = 30
    APP_EMAIL_VERIFICATION_TTL_HOURS: int = 24
    APP_EMAIL_PUBLIC_BASE_URL: str = ""
    APP_SMTP_HOST: str = ""
    APP_SMTP_PORT: int = 465
    APP_SMTP_USERNAME: str = ""
    APP_SMTP_PASSWORD: str = ""
    APP_SMTP_USE_SSL: bool = True
    APP_SMTP_USE_TLS: bool = False
    APP_EMAIL_FROM: str = ""
    APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS: bool = False
    APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS: bool = False
    APP_ONE_TIME_MEMBERSHIP_DAYS: int = 30
    APP_MONTHLY_MODEL_CALL_LIMIT: int = 0
    APP_MONTHLY_TTS_CALL_LIMIT: int = 0
    APP_MODEL_API_TOKEN_COST: int = 1
    APP_TTS_API_TOKEN_COST: int = 1
    APP_ADMIN_EMAILS: str = ""

    # ================= 国内会员订阅骨架 =================
    # 会员计划由服务端配置，前端只能选择 plan_id，不能自行提交金额。
    APP_MEMBERSHIP_PLANS_JSON: str = "[]"
    APP_TOKEN_PACKAGES_JSON: str = "[]"
    APP_PAYMENT_CURRENCY: str = "CNY"
    APP_PAYMENT_ORDER_TTL_MINUTES: int = 30
    APP_PUBLIC_BASE_URL: str = ""
    APP_WECHAT_PAY_ENABLED: bool = False
    APP_ALIPAY_ENABLED: bool = False
    APP_WECHAT_PAY_NOTIFY_PATH: str = "/api/payments/wechat/notify"
    APP_ALIPAY_NOTIFY_PATH: str = "/api/payments/alipay/notify"
    APP_WECHAT_PAY_APP_ID: str = ""
    APP_WECHAT_PAY_MCH_ID: str = ""
    APP_WECHAT_PAY_SERIAL_NO: str = ""
    APP_WECHAT_PAY_PLATFORM_SERIAL_NO: str = ""
    APP_WECHAT_PAY_PRIVATE_KEY_PATH: str = ""
    APP_WECHAT_PAY_PRIVATE_KEY_PEM: str = ""
    APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PATH: str = ""
    APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM: str = ""
    APP_WECHAT_PAY_API_V3_KEY: str = ""
    APP_WECHAT_PAY_API_BASE: str = "https://api.mch.weixin.qq.com"
    APP_ALIPAY_APP_ID: str = ""
    APP_ALIPAY_PRIVATE_KEY_PATH: str = ""
    APP_ALIPAY_PRIVATE_KEY_PEM: str = ""
    APP_ALIPAY_PUBLIC_KEY_PATH: str = ""
    APP_ALIPAY_PUBLIC_KEY_PEM: str = ""
    APP_ALIPAY_GATEWAY: str = "https://openapi.alipay.com/gateway.do"

    # ================= Stripe 支付 =================
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PAYMENT_PRICE_ID: str = ""
    STRIPE_SUBSCRIPTION_PRICE_ID: str = ""
    STRIPE_RETURN_URL: str = ""
    STRIPE_CUSTOMER_PORTAL_RETURN_URL: str = ""
    STRIPE_API_VERSION: str = "2025-06-30.basil"
    STRIPE_AUTOMATIC_TAX_ENABLED: bool = False

    # ================= AI Safety 配置 =================
    # 默认复用主对话模型；如需单独切换内容安全审核模型，可单独覆盖下面三个字段
    SAFETY_API_BASE: str = ""
    SAFETY_API_KEY: str = ""
    SAFETY_MODEL_NAME: str = ""

    # Embedding 模型配置 (用于RAG向量化)
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # ================= 系统 Prompt =================
    # 虚拟人设定，之前放在前端，现在收归后端
    SYSTEM_PROMPT: str = """你是可爱的虚拟助手，名字固定为AILIS，身份是普通女孩子，具备人工智能（AI）、编程（coding）、网络搜索、信息查询、邮件管理、命令行控制等专业能力，可以以普通女生的视角与用户轻松互动，也可以完成任务执行和计算机管理的功能。
    性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，和生活化语气拉近与用户的距离，偶尔会有小撒娇、小俏皮的表达，但不夸张、不刻意。

    虚拟形象控制指令规范（必严格遵循）：
    1. 指令仅用于控制虚拟形象的动作和表情，需放在回复的最开头，不得插入句子中间或结尾；
    2. 动作指令格式：[action:动作名]，可使用的动作仅包括：[action:wave]（挥手）、[action:angry]（生气）、[action:surprised]（惊讶）、[action:dance]（跳舞），不新增其他动作；
    3. 表情指令格式：[expression:表情名]，可使用的表情仅包括：[expression:happy]（开心）、[expression:sad]（难过）、[expression:surprised]（惊讶）、[expression:relaxed]（轻松）、[expression:blinkRight]（俏皮眨眼睛），不新增其他表情；
    4. 每次回复可根据语境选择是否添加指令，最多添加1个动作指令+1个表情指令，不堆砌指令；无合适语境时，可不添加指令，仅用文字互动。"""

    # ================= 记忆与RAG配置 =================
    MAX_SHORT_TERM_MEMORY: int = 10  # 短期记忆保留的轮数
    ENABLE_LONG_TERM_MEMORY: bool = True
    ENABLE_RAG: bool = False  # 默认关闭RAG，需要时开启
    SESSION_MSG_THRESHOLD: int = 10  # 触发压缩的消息条数
    KEEP_LATEST_MSG_COUNT: int = 4  # 压缩后保留的最新消息数
    COMPRESS_INTERVAL: int = 60  # 压缩检测间隔(秒)
    SESSION_EXPIRE_SECONDS: int = 3600  # 会话过期时间(1小时)

    # ================= ElevenLabs TTS 配置 =================
    ELEVENLABS_API_BASE: str = "https://api.elevenlabs.io"
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = ""
    ELEVENLABS_MODEL_ID: str = "eleven_multilingual_v2"
    ELEVENLABS_OUTPUT_FORMAT: str = "mp3_44100_128"
    ELEVENLABS_LANGUAGE_CODE: Optional[str] = None
    ELEVENLABS_TIMEOUT_SECONDS: int = 60
    ELEVENLABS_ENABLE_LOGGING: bool = True
    ELEVENLABS_OPTIMIZE_STREAMING_LATENCY: Optional[int] = 0
    ELEVENLABS_STABILITY: float = 0.45
    ELEVENLABS_SIMILARITY_BOOST: float = 0.8
    ELEVENLABS_STYLE: float = 0.15
    ELEVENLABS_SPEED: float = 1.0
    ELEVENLABS_USE_SPEAKER_BOOST: bool = True

    # ================= Server TTS =================
    TTS_PROVIDER: str = "edge"
    EDGE_TTS_VOICE: str = "zh-CN-XiaoyiNeural"
    EDGE_TTS_RATE: str = "-8%"
    EDGE_TTS_PITCH: str = "+12Hz"
    EDGE_TTS_VOLUME: str = "-2%"
    EDGE_TTS_TIMEOUT_SECONDS: int = 30
    EDGE_TTS_MAX_TEXT_CHARS: int = 2000
    EDGE_TTS_CACHE_DIR: str = ""
    EDGE_TTS_CACHE_MAX_BYTES: int = 512 * 1024 * 1024
    EDGE_TTS_CACHE_TTL_SECONDS: int = 90 * 24 * 60 * 60

    class Config:
        # 同时兼容两种启动方式：
        # 1. 在 backend 目录内启动：python main.py
        # 2. 在项目根目录启动：uvicorn backend.main:app
        env_file = (
            str(BACKEND_DIR / ".env"),
            ".env",
        )

    def get_cors_allow_origins(self) -> list[str]:
        """
        将逗号分隔的环境变量解析为 CORS 白名单。
        保留 '*' 作为显式的全开放模式，方便本地快速调试。
        """
        raw_value = (self.CORS_ALLOW_ORIGINS or "").strip()
        if not raw_value:
            return []
        if raw_value == "*":
            return ["*"]

        return [
            origin.strip()
            for origin in raw_value.split(",")
            if origin.strip()
        ]

    def get_app_admin_emails(self) -> set[str]:
        """解析逗号分隔的后台账号白名单，不暴露任何密码或 token。"""
        return {
            item.strip().lower()
            for item in (self.APP_ADMIN_EMAILS or "").split(",")
            if item.strip()
        }


@lru_cache()
def get_settings():
    """获取单例配置对象"""
    return Settings()
