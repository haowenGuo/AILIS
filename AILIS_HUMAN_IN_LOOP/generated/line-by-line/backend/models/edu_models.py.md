# backend/models/edu_models.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端数据模型：定义 API 和持久化使用的结构化对象。
- 文件类型：`source-code`
- 原始行数：126
- SHA-256：`25ef48bab29ccf93e9508ef24291f6b1b5f5fa5521d089d39286ea0be6930a25`
- 可运行副本：[打开源文件](../../../../source/backend/models/edu_models.py)
- 依赖：`sqlalchemy`、`sqlalchemy.orm`、`backend.core.database`
- 主要符号：`EduUser`、`EduSession`、`EduDiagnostic`、`EduPracticeAssignment`、`EduClassroomSession`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint, func</code> | 导入 Python 依赖 `sqlalchemy`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from sqlalchemy.orm import Mapped, mapped_column</code> | 导入 Python 依赖 `sqlalchemy.orm`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>from backend.core.database import Base</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>class EduUser(Base):</code> | 定义 Python 类 `EduUser`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 8 | <code>    __tablename__ = "edu_users"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 11 | <code>    full_name: Mapped[str] = mapped_column(String(120), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 12 | <code>    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 13 | <code>    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 14 | <code>    phone: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 15 | <code>    role: Mapped[str] = mapped_column(String(32), nullable=False, default="student", index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 16 | <code>    vip_level: Mapped[str] = mapped_column(String(64), nullable=False, default="基础会员")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 17 | <code>    grade: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 18 | <code>    school_name: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 19 | <code>    class_name: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 20 | <code>    target_exam: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 21 | <code>    learning_preference: Mapped[str] = mapped_column(String(128), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 22 | <code>    favorite_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 23 | <code>    weak_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 24 | <code>    goal_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 25 | <code>    parent_name: Mapped[str] = mapped_column(String(120), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 26 | <code>    parent_phone: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 27 | <code>    parent_notice_opt_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 28 | <code>    agreement_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 29 | <code>    teacher_title: Mapped[str] = mapped_column(String(120), nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 30 | <code>    managed_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 31 | <code>    managed_grades: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 32 | <code>    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>class EduSession(Base):</code> | 定义 Python 类 `EduSession`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 36 | <code>    __tablename__ = "edu_sessions"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 39 | <code>    user_id: Mapped[int] = mapped_column(ForeignKey("edu_users.id", ondelete="CASCADE"), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 40 | <code>    token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 41 | <code>    expires_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 42 | <code>    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>class EduDiagnostic(Base):</code> | 定义 Python 类 `EduDiagnostic`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 46 | <code>    __tablename__ = "edu_diagnostics"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 47 | <code>    __table_args__ = (UniqueConstraint("user_id", "subject", name="uq_edu_diagnostics_user_subject"),)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 50 | <code>    user_id: Mapped[int] = mapped_column(ForeignKey("edu_users.id", ondelete="CASCADE"), nullable=False, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 51 | <code>    subject: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 52 | <code>    grade_band: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 53 | <code>    baseline_score: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 54 | <code>    confidence_level: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 55 | <code>    homework_completion: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 56 | <code>    mistake_recovery: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 57 | <code>    weak_points: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 58 | <code>    current_level: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 59 | <code>    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 60 | <code>    mastery_summary: Mapped[str] = mapped_column(Text, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 61 | <code>    recommended_path: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 62 | <code>    last_score: Mapped[int] = mapped_column(Integer, nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 63 | <code>    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 64 | <code>    updated_at: Mapped[DateTime] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 65 | <code>        DateTime(timezone=True),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 66 | <code>        server_default=func.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 67 | <code>        onupdate=func.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 68 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>class EduPracticeAssignment(Base):</code> | 定义 Python 类 `EduPracticeAssignment`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 72 | <code>    __tablename__ = "edu_practice_assignments"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 75 | <code>    teacher_user_id: Mapped[int] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 76 | <code>        ForeignKey("edu_users.id", ondelete="CASCADE"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 77 | <code>        nullable=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 78 | <code>        index=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 79 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>    student_user_id: Mapped[int] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 81 | <code>        ForeignKey("edu_users.id", ondelete="CASCADE"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 82 | <code>        nullable=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 83 | <code>        index=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 84 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>    title: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 86 | <code>    subject: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 87 | <code>    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 88 | <code>    source_dataset: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 89 | <code>    source_config: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 90 | <code>    source_split: Mapped[str] = mapped_column(String(255), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 91 | <code>    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 92 | <code>    questions_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 93 | <code>    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>class EduClassroomSession(Base):</code> | 定义 Python 类 `EduClassroomSession`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 97 | <code>    __tablename__ = "edu_classroom_sessions"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 100 | <code>    student_user_id: Mapped[int] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 101 | <code>        ForeignKey("edu_users.id", ondelete="CASCADE"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 102 | <code>        nullable=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 103 | <code>        index=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 104 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    teacher_user_id: Mapped[int &#124; None] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 106 | <code>        ForeignKey("edu_users.id", ondelete="SET NULL"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 107 | <code>        nullable=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 108 | <code>        index=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 109 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>    subject: Mapped[str] = mapped_column(String(64), nullable=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 111 | <code>    topic: Mapped[str] = mapped_column(String(255), nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 112 | <code>    status: Mapped[str] = mapped_column(String(32), nullable=False, default="active")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 113 | <code>    focus_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 114 | <code>    attendance_state: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 115 | <code>    current_question_id: Mapped[str] = mapped_column(String(255), nullable=False, default="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 116 | <code>    current_question_json: Mapped[dict &#124; None] = mapped_column(JSON, nullable=True, default=None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 117 | <code>    used_question_ids: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 118 | <code>    transcript_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 119 | <code>    attempted_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 120 | <code>    correct_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 121 | <code>    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 122 | <code>    updated_at: Mapped[DateTime] = mapped_column(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 123 | <code>        DateTime(timezone=True),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 124 | <code>        server_default=func.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 125 | <code>        onupdate=func.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 126 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
