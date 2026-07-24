from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class EduUser(Base):
    __tablename__ = "edu_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    phone: Mapped[str] = mapped_column(String(64), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="student", index=True)
    vip_level: Mapped[str] = mapped_column(String(64), nullable=False, default="基础会员")
    grade: Mapped[str] = mapped_column(String(64), nullable=False)
    school_name: Mapped[str] = mapped_column(String(255), nullable=False)
    class_name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_exam: Mapped[str] = mapped_column(String(64), nullable=False)
    learning_preference: Mapped[str] = mapped_column(String(128), nullable=False)
    favorite_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    weak_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    goal_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    parent_name: Mapped[str] = mapped_column(String(120), nullable=False)
    parent_phone: Mapped[str] = mapped_column(String(64), nullable=False)
    parent_notice_opt_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    agreement_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    teacher_title: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    managed_subjects: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    managed_grades: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class EduSession(Base):
    __tablename__ = "edu_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("edu_users.id", ondelete="CASCADE"), nullable=False)
    token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    expires_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class EduDiagnostic(Base):
    __tablename__ = "edu_diagnostics"
    __table_args__ = (UniqueConstraint("user_id", "subject", name="uq_edu_diagnostics_user_subject"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("edu_users.id", ondelete="CASCADE"), nullable=False, index=True)
    subject: Mapped[str] = mapped_column(String(64), nullable=False)
    grade_band: Mapped[str] = mapped_column(String(64), nullable=False)
    baseline_score: Mapped[int] = mapped_column(Integer, nullable=False)
    confidence_level: Mapped[int] = mapped_column(Integer, nullable=False)
    homework_completion: Mapped[int] = mapped_column(Integer, nullable=False)
    mistake_recovery: Mapped[int] = mapped_column(Integer, nullable=False)
    weak_points: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    current_level: Mapped[str] = mapped_column(String(64), nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)
    mastery_summary: Mapped[str] = mapped_column(Text, nullable=False)
    recommended_path: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    last_score: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class EduPracticeAssignment(Base):
    __tablename__ = "edu_practice_assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    teacher_user_id: Mapped[int] = mapped_column(
        ForeignKey("edu_users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_user_id: Mapped[int] = mapped_column(
        ForeignKey("edu_users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(64), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    source_dataset: Mapped[str] = mapped_column(String(255), nullable=False)
    source_config: Mapped[str] = mapped_column(String(255), nullable=False)
    source_split: Mapped[str] = mapped_column(String(255), nullable=False)
    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    questions_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class EduClassroomSession(Base):
    __tablename__ = "edu_classroom_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_user_id: Mapped[int] = mapped_column(
        ForeignKey("edu_users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    teacher_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("edu_users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    subject: Mapped[str] = mapped_column(String(64), nullable=False)
    topic: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="active")
    focus_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    attendance_state: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    current_question_id: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    current_question_json: Mapped[dict | None] = mapped_column(JSON, nullable=True, default=None)
    used_question_ids: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    transcript_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    attempted_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
