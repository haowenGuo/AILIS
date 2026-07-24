# backend/core/config.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`source-code`
- 原始行数：132
- SHA-256：`d57ed2b1aa05796d708581ea74b48882b3d809417d387df056f955d965e573e6`
- 可运行副本：[打开源文件](../../../../source/backend/core/config.py)
- 依赖：`functools`、`pathlib`、`typing`、`pydantic_settings`
- 主要符号：`Settings`、`Config`、`get_cors_allow_origins`、`get_settings`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from functools import lru_cache</code> | 导入 Python 依赖 `functools`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 3 | <code>from typing import Optional</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>from pydantic_settings import BaseSettings</code> | 导入 Python 依赖 `pydantic_settings`，供本模块调用其类型、函数或常量。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>BACKEND_DIR = Path(__file__).resolve().parent.parent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>DATA_DIR = BACKEND_DIR / "data"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 9 | <code>DEFAULT_DATABASE_URL = f"sqlite+aiosqlite:///{(DATA_DIR / 'app.db').as_posix()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 10 | <code>DEFAULT_CHROMA_PERSIST_DIR = (DATA_DIR / "chroma").as_posix()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>class Settings(BaseSettings):</code> | 定义 Python 类 `Settings`，封装相关状态、协议和方法。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 14 | <code>    """应用全局配置，通过 .env 文件加载"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>    # 服务配置</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 17 | <code>    APP_NAME: str = "AILIS Backend"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 18 | <code>    DEBUG: bool = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 19 | <code>    CORS_ALLOW_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://haowenguo.github.io"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>    # 数据库配置 (默认SQLite，生产环境建议换 PostgreSQL)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 22 | <code>    DATA_DIR: str = str(DATA_DIR)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 23 | <code>    DATABASE_URL: str = DEFAULT_DATABASE_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 24 | <code>    CHROMA_PERSIST_DIR: str = DEFAULT_CHROMA_PERSIST_DIR</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>    # ================= 教学子系统配置 =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 27 | <code>    EDU_APP_NAME: str = "仿真教学平台"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 28 | <code>    EDU_SESSION_COOKIE_NAME: str = "simteach_session"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 29 | <code>    EDU_SESSION_TTL_DAYS: int = 14</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 30 | <code>    EDU_TEACHER_INVITE_CODE: str = "teacher-demo"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 31 | <code>    EDU_PASSWORD_PEPPER: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 32 | <code>    EDU_SEED_ADMIN: bool = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 33 | <code>    EDU_ADMIN_EMAIL: str = "admin@simclass.local"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 34 | <code>    EDU_ADMIN_PASSWORD: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>    EDU_ADMIN_PHONE: str = "13800000000"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 36 | <code>    EDU_ADMIN_SCHOOL_NAME: str = "仿真人教学教室"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 37 | <code>    EDU_HF_DATASET_VIEWER_URL: str = "https://datasets-server.huggingface.co"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 38 | <code>    EDU_HF_QUESTION_DATASET: str = "SeaLLMs/SeaExam"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 39 | <code>    EDU_HF_QUESTION_CONFIG: str = "m3exam-chinese"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 40 | <code>    EDU_HF_QUESTION_SPLIT: str = "test"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 41 | <code>    EDU_QUESTION_BANK_CACHE_TTL_SECONDS: int = 900</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>    # ================= 大模型配置 (核心) =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 44 | <code>    # 支持 OpenAI 兼容接口 (如 DeepSeek, 通义千问, 火山引擎等)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 45 | <code>    LLM_API_BASE: str = "https://api.deepseek.com"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 46 | <code>    LLM_API_KEY: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 47 | <code>    LLM_MODEL_NAME: str = "deepseek-chat"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    # ================= Hosted AILIS Agent Runtime =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 50 | <code>    AILIS_HOSTED_RUNTIME_ENABLED: bool = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 51 | <code>    AILIS_HOSTED_RUNTIME_URL: str = "http://127.0.0.1:18777"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 52 | <code>    AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 53 | <code>    AILIS_HOSTED_RUNTIME_TIMEOUT_SECONDS: int = 360</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 54 | <code>    AILIS_WEB_SESSION_SECRET: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 55 | <code>    AILIS_WEB_SESSION_TTL_DAYS: int = 180</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    # ================= AI Safety 配置 =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 58 | <code>    # 默认复用主对话模型；如需单独切换内容安全审核模型，可单独覆盖下面三个字段</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 59 | <code>    SAFETY_API_BASE: str = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 60 | <code>    SAFETY_API_KEY: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 61 | <code>    SAFETY_MODEL_NAME: str = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>    # Embedding 模型配置 (用于RAG向量化)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 64 | <code>    EMBEDDING_MODEL: str = "text-embedding-3-small"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>    # ================= 系统 Prompt =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 67 | <code>    # 虚拟人设定，之前放在前端，现在收归后端</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 68 | <code>    SYSTEM_PROMPT: str = """你是可爱的虚拟助手，名字固定为AILIS，身份是普通女孩子，具备人工智能（AI）、编程（coding）、网络搜索、信息查询、邮件管理、命令行控制等专业能力，可以以普通女生的视角与用户轻松互动，也可以完成任务执行和计算机管理的功能。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 69 | <code>    性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，和生活化语气拉近与用户的距离，偶尔会有小撒娇、小俏皮的表达，但不夸张、不刻意。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>    虚拟形象控制指令规范（必严格遵循）：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 72 | <code>    1. 指令仅用于控制虚拟形象的动作和表情，需放在回复的最开头，不得插入句子中间或结尾；</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 73 | <code>    2. 动作指令格式：[action:动作名]，可使用的动作仅包括：[action:wave]（挥手）、[action:angry]（生气）、[action:surprised]（惊讶）、[action:dance]（跳舞），不新增其他动作；</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 74 | <code>    3. 表情指令格式：[expression:表情名]，可使用的表情仅包括：[expression:happy]（开心）、[expression:sad]（难过）、[expression:surprised]（惊讶）、[expression:relaxed]（轻松）、[expression:blinkRight]（俏皮眨眼睛），不新增其他表情；</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 75 | <code>    4. 每次回复可根据语境选择是否添加指令，最多添加1个动作指令+1个表情指令，不堆砌指令；无合适语境时，可不添加指令，仅用文字互动。"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>    # ================= 记忆与RAG配置 =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 78 | <code>    MAX_SHORT_TERM_MEMORY: int = 10  # 短期记忆保留的轮数</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 79 | <code>    ENABLE_LONG_TERM_MEMORY: bool = True</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 80 | <code>    ENABLE_RAG: bool = False  # 默认关闭RAG，需要时开启</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 81 | <code>    SESSION_MSG_THRESHOLD: int = 10  # 触发压缩的消息条数</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 82 | <code>    KEEP_LATEST_MSG_COUNT: int = 4  # 压缩后保留的最新消息数</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 83 | <code>    COMPRESS_INTERVAL: int = 60  # 压缩检测间隔(秒)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 84 | <code>    SESSION_EXPIRE_SECONDS: int = 3600  # 会话过期时间(1小时)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    # ================= ElevenLabs TTS 配置 =================</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 87 | <code>    ELEVENLABS_API_BASE: str = "https://api.elevenlabs.io"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 88 | <code>    ELEVENLABS_API_KEY: str = ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 89 | <code>    ELEVENLABS_VOICE_ID: str = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 90 | <code>    ELEVENLABS_MODEL_ID: str = "eleven_multilingual_v2"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 91 | <code>    ELEVENLABS_OUTPUT_FORMAT: str = "mp3_44100_128"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 92 | <code>    ELEVENLABS_LANGUAGE_CODE: Optional[str] = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 93 | <code>    ELEVENLABS_TIMEOUT_SECONDS: int = 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 94 | <code>    ELEVENLABS_ENABLE_LOGGING: bool = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 95 | <code>    ELEVENLABS_OPTIMIZE_STREAMING_LATENCY: Optional[int] = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 96 | <code>    ELEVENLABS_STABILITY: float = 0.45</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 97 | <code>    ELEVENLABS_SIMILARITY_BOOST: float = 0.8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 98 | <code>    ELEVENLABS_STYLE: float = 0.15</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 99 | <code>    ELEVENLABS_SPEED: float = 1.0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 100 | <code>    ELEVENLABS_USE_SPEAKER_BOOST: bool = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>    class Config:</code> | 定义 Python 类 `Config`，封装相关状态、协议和方法。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 103 | <code>        # 同时兼容两种启动方式：</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 104 | <code>        # 1. 在 backend 目录内启动：python main.py</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 105 | <code>        # 2. 在项目根目录启动：uvicorn backend.main:app</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 106 | <code>        env_file = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 107 | <code>            str(BACKEND_DIR / ".env"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 108 | <code>            ".env",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 109 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>    def get_cors_allow_origins(self) -&gt; list[str]:</code> | 定义 Python 函数 `get_cors_allow_origins`；其缩进块实现具体业务或工具行为。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 112 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 113 | <code>        将逗号分隔的环境变量解析为 CORS 白名单。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 114 | <code>        保留 '*' 作为显式的全开放模式，方便本地快速调试。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 115 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 116 | <code>        raw_value = (self.CORS_ALLOW_ORIGINS or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 117 | <code>        if not raw_value:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 118 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 119 | <code>        if raw_value == "*":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 120 | <code>            return ["*"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>        return [</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 123 | <code>            origin.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 124 | <code>            for origin in raw_value.split(",")</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 125 | <code>            if origin.strip()</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 126 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>@lru_cache()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 130 | <code>def get_settings():</code> | 定义 Python 函数 `get_settings`；其缩进块实现具体业务或工具行为。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 131 | <code>    """获取单例配置对象"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 132 | <code>    return Settings()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
