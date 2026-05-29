import base64
import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import delete, desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import get_settings
from backend.models.edu_models import (
    EduClassroomSession,
    EduDiagnostic,
    EduPracticeAssignment,
    EduSession,
    EduUser,
)
from backend.services.edu_question_bank_service import (
    build_choice_label,
    get_question_bank,
    get_question_bank_source,
    get_questions_by_source_ids,
    pick_question,
)

settings = get_settings()


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _to_iso(value: datetime | None) -> str | None:
    return value.astimezone(timezone.utc).isoformat() if value else None


def _normalize_email(value: str) -> str:
    return (value or "").strip().lower()


def _normalize_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str) and value.strip():
        return [item.strip() for item in value.split(",") if item.strip()]
    return []


def _parse_delimited_list(value: str | list[str] | None) -> list[str]:
    if isinstance(value, list):
        return _normalize_list(value)
    if not value:
        return []
    normalized = str(value).replace("，", ",").replace("、", ",")
    return [item.strip() for item in normalized.split(",") if item.strip()]


def hash_password(password: str) -> str:
    pepper = settings.EDU_PASSWORD_PEPPER or ""
    salt = os.urandom(16)
    iterations = 200_000
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        f"{password}{pepper}".encode("utf-8"),
        salt,
        iterations,
    )
    return "pbkdf2_sha256${iterations}${salt_hex}${digest_hex}".format(
        iterations=iterations,
        salt_hex=base64.b64encode(salt).decode("ascii"),
        digest_hex=base64.b64encode(digest).decode("ascii"),
    )


def verify_password(password: str, encoded_password: str) -> bool:
    try:
        algorithm, iterations_raw, salt_raw, digest_raw = encoded_password.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        pepper = settings.EDU_PASSWORD_PEPPER or ""
        iterations = int(iterations_raw)
        salt = base64.b64decode(salt_raw.encode("ascii"))
        expected = base64.b64decode(digest_raw.encode("ascii"))
        actual = hashlib.pbkdf2_hmac(
            "sha256",
            f"{password}{pepper}".encode("utf-8"),
            salt,
            iterations,
        )
        return secrets.compare_digest(actual, expected)
    except Exception:  # noqa: BLE001
        return False


def create_session_token() -> str:
    return secrets.token_urlsafe(32)


def compute_diagnostic_result(input_data: dict[str, Any]) -> dict[str, Any]:
    baseline = int(input_data.get("baselineScore") or 0)
    confidence_level = int(input_data.get("confidenceLevel") or 0)
    homework_completion = int(input_data.get("homeworkCompletion") or 0)
    mistake_recovery = int(input_data.get("mistakeRecovery") or 0)
    weak_points = _parse_delimited_list(input_data.get("weakPoints"))

    normalized_score = round((baseline / 150) * 100) if baseline else 0
    confidence_score = max(
        0,
        min(
            100,
            round(
                normalized_score * 0.5
                + confidence_level * 8
                + homework_completion * 0.2
                + mistake_recovery * 0.14
                - len(weak_points) * 2
            ),
        ),
    )

    current_level = "基础巩固"
    if confidence_score >= 82:
        current_level = "拔高冲刺"
    elif confidence_score >= 66:
        current_level = "进阶提升"

    subject = input_data.get("subject") or "综合"
    if current_level == "拔高冲刺":
        mastery_summary = f"{subject} 当前具备较强的应试稳定性，适合压轴题与高阶题型训练。"
        recommended_path = ["进入拔高题单", "解锁押题进阶卷", "加入名校笔记复盘"]
    elif current_level == "进阶提升":
        mastery_summary = f"{subject} 基础框架较完整，建议围绕薄弱考点做中强度分层训练。"
        recommended_path = ["先做薄弱点专项包", "进入中高考技巧课", "完成错题二刷复测"]
    else:
        mastery_summary = f"{subject} 需要先补齐核心知识点，再进入系统刷题与错题二刷。"
        recommended_path = ["回到基础知识点课件", "开启低难度自适应卷", "同步家长端学习提醒"]

    return {
        "subject": subject,
        "gradeBand": input_data.get("gradeBand") or "",
        "baselineScore": baseline,
        "confidenceLevel": confidence_level,
        "homeworkCompletion": homework_completion,
        "mistakeRecovery": mistake_recovery,
        "weakPoints": weak_points,
        "currentLevel": current_level,
        "confidenceScore": confidence_score,
        "masterySummary": mastery_summary,
        "recommendedPath": recommended_path,
        "lastScore": confidence_score,
    }


def _serialize_user(user: EduUser | None) -> dict[str, Any] | None:
    if not user:
        return None
    return {
        "id": user.id,
        "role": user.role,
        "fullName": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "vipLevel": user.vip_level,
        "grade": user.grade,
        "schoolName": user.school_name,
        "className": user.class_name,
        "targetExam": user.target_exam,
        "learningPreference": user.learning_preference,
        "favoriteSubjects": user.favorite_subjects or [],
        "weakSubjects": user.weak_subjects or [],
        "goalSummary": user.goal_summary,
        "parentName": user.parent_name,
        "parentPhone": user.parent_phone,
        "parentNoticeOptIn": user.parent_notice_opt_in,
        "agreementAccepted": user.agreement_accepted,
        "teacherTitle": user.teacher_title,
        "managedSubjects": user.managed_subjects or [],
        "managedGrades": user.managed_grades or [],
        "createdAt": _to_iso(user.created_at),
    }


async def ensure_admin_account(db: AsyncSession) -> EduUser | None:
    if not settings.EDU_SEED_ADMIN:
        return None

    email = _normalize_email(settings.EDU_ADMIN_EMAIL or "")
    password = (settings.EDU_ADMIN_PASSWORD or "").strip()
    if not password:
        password = "Admin@123456"

    if not email:
        print("⚠️ 教学管理员未创建：请配置 EDU_ADMIN_EMAIL。")
        return None

    stmt = select(EduUser).where(EduUser.email == email).limit(1)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing:
        return existing

    phone = settings.EDU_ADMIN_PHONE or "13800000000"
    admin = EduUser(
        full_name="系统管理员",
        email=email,
        password_hash=hash_password(password),
        phone=phone,
        role="admin",
        vip_level="至尊会员",
        grade="全学段",
        school_name=settings.EDU_ADMIN_SCHOOL_NAME or "仿真人教学教室",
        class_name="管理端",
        target_exam="中高考",
        learning_preference="管理后台",
        favorite_subjects=["语文", "数学", "英语", "物理", "化学"],
        weak_subjects=[],
        goal_summary="用于教学平台首发部署、演示、排障和教师端管理。",
        parent_name="系统",
        parent_phone=phone,
        parent_notice_opt_in=False,
        agreement_accepted=True,
        teacher_title="平台管理员",
        managed_subjects=["语文", "数学", "英语", "物理", "化学"],
        managed_grades=["初中", "高中"],
    )
    db.add(admin)
    await db.commit()
    await db.refresh(admin)
    print(f"✅ 教学管理员已创建：{email}")
    return admin


def _serialize_diagnostic(item: EduDiagnostic) -> dict[str, Any]:
    return {
        "id": item.id,
        "userId": item.user_id,
        "subject": item.subject,
        "gradeBand": item.grade_band,
        "baselineScore": item.baseline_score,
        "confidenceLevel": item.confidence_level,
        "homeworkCompletion": item.homework_completion,
        "mistakeRecovery": item.mistake_recovery,
        "weakPoints": item.weak_points or [],
        "currentLevel": item.current_level,
        "confidenceScore": item.confidence_score,
        "masterySummary": item.mastery_summary,
        "recommendedPath": item.recommended_path or [],
        "lastScore": item.last_score,
        "createdAt": _to_iso(item.created_at),
        "updatedAt": _to_iso(item.updated_at),
    }


def _serialize_assignment(item: EduPracticeAssignment) -> dict[str, Any]:
    return {
        "id": item.id,
        "teacherUserId": item.teacher_user_id,
        "studentUserId": item.student_user_id,
        "title": item.title,
        "subject": item.subject,
        "notes": item.notes,
        "questionCount": item.question_count,
        "source": {
            "dataset": item.source_dataset,
            "config": item.source_config,
            "split": item.source_split,
        },
        "questions": item.questions_json or [],
        "createdAt": _to_iso(item.created_at),
    }


def _serialize_classroom_session(item: EduClassroomSession) -> dict[str, Any]:
    return {
        "id": item.id,
        "studentUserId": item.student_user_id,
        "teacherUserId": item.teacher_user_id,
        "subject": item.subject,
        "topic": item.topic,
        "status": item.status,
        "focusSummary": item.focus_summary,
        "attendanceState": item.attendance_state,
        "currentQuestionId": item.current_question_id,
        "currentQuestion": item.current_question_json,
        "usedQuestionIds": item.used_question_ids or [],
        "transcript": item.transcript_json or [],
        "attemptedCount": item.attempted_count,
        "correctCount": item.correct_count,
        "createdAt": _to_iso(item.created_at),
        "updatedAt": _to_iso(item.updated_at),
    }


def _sort_by_date_desc(items: list[dict[str, Any]], field: str) -> list[dict[str, Any]]:
    return sorted(items, key=lambda item: item.get(field) or "", reverse=True)


def _build_breakdown(items: list[Any], selector) -> dict[str, int]:
    result: dict[str, int] = {}
    for item in items:
        key = selector(item) or "未分类"
        result[key] = result.get(key, 0) + 1
    return result


def _sum_by(items: list[Any], selector) -> int:
    return sum(int(selector(item) or 0) for item in items)


def _build_focus_summary(student: EduUser, diagnostics: list[EduDiagnostic], subject: str) -> str:
    diagnostic = next((item for item in diagnostics if item.subject == subject), None)
    if diagnostic:
        weak_points = "、".join(diagnostic.weak_points or []) or "基础稳定性"
        return f"{subject}当前层级：{diagnostic.current_level}；重点补弱：{weak_points}。"
    if subject in (student.weak_subjects or []):
        return f"{subject}已在学生档案中标记为薄弱学科，本节课以基础巩固和课堂追问为主。"
    return f"{subject}当前暂无专属画像，本节课先通过真题互动建立课堂节奏与初步判断。"


def _build_entry(role: str, text: str, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    payload = {
        "role": role,
        "text": text,
        "createdAt": _now_utc().isoformat(),
    }
    if extra:
        payload.update(extra)
    return payload


def _build_question_prompt(question: dict[str, Any]) -> str:
    return f"请先完成这道{question.get('subject') or '综合'}真题。题干：{question.get('stem') or ''}"


def _build_correct_feedback(question: dict[str, Any], focus_summary: str) -> str:
    return (
        f"回答正确。标准答案是 {build_choice_label(int(question.get('answerIndex', 0)))}："
        f"{question.get('answerText') or ''}。{focus_summary} 这一步说明你已经抓住了当前题目的核心判断点。"
    )


def _build_wrong_feedback(question: dict[str, Any], selected_choice_index: int, focus_summary: str) -> str:
    choices = question.get("choices") or []
    selected_text = choices[selected_choice_index] if 0 <= selected_choice_index < len(choices) else "未命名选项"
    return (
        f"这题先别急着往下走。你选了 {build_choice_label(selected_choice_index)}：{selected_text}，"
        f"但正确答案不是这一项。{focus_summary} 请重新看题干中的限制条件，再做一次判断。"
    )


def _build_student_utterance(
    question: dict[str, Any],
    selected_choice_index: int | None,
    free_text: str,
) -> str:
    parts: list[str] = []
    choices = question.get("choices") or []
    if selected_choice_index is not None:
        label = build_choice_label(selected_choice_index)
        value = choices[selected_choice_index] if 0 <= selected_choice_index < len(choices) else "未命名选项"
        parts.append(f"我选择 {label}：{value}")
    if free_text.strip():
        parts.append(f"我想补充：{free_text.strip()}")
    return "；".join(parts)


class EduPlatformService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> EduUser | None:
        stmt = select(EduUser).where(EduUser.email == _normalize_email(email)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> EduUser | None:
        stmt = select(EduUser).where(EduUser.id == int(user_id)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_users_by_role(self, role: str) -> list[EduUser]:
        stmt = select(EduUser).where(EduUser.role == role).order_by(EduUser.created_at.asc())
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_user(self, payload: dict[str, Any]) -> EduUser:
        user = EduUser(
            full_name=payload["fullName"],
            email=_normalize_email(payload["email"]),
            password_hash=payload["passwordHash"],
            phone=payload["phone"],
            role=payload.get("role", "student"),
            vip_level=payload.get("vipLevel", "基础会员"),
            grade=payload["grade"],
            school_name=payload["schoolName"],
            class_name=payload["className"],
            target_exam=payload["targetExam"],
            learning_preference=payload["learningPreference"],
            favorite_subjects=_normalize_list(payload.get("favoriteSubjects")),
            weak_subjects=_normalize_list(payload.get("weakSubjects")),
            goal_summary=payload.get("goalSummary", ""),
            parent_name=payload["parentName"],
            parent_phone=payload["parentPhone"],
            parent_notice_opt_in=bool(payload.get("parentNoticeOptIn", True)),
            agreement_accepted=bool(payload.get("agreementAccepted", False)),
            teacher_title=payload.get("teacherTitle", ""),
            managed_subjects=_normalize_list(payload.get("managedSubjects")),
            managed_grades=_normalize_list(payload.get("managedGrades")),
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def create_session(self, user_id: int) -> dict[str, Any]:
        expires_at = _now_utc() + timedelta(days=max(int(settings.EDU_SESSION_TTL_DAYS or 14), 1))
        session = EduSession(
            user_id=int(user_id),
            token=create_session_token(),
            expires_at=expires_at,
        )
        self.db.add(session)
        await self.db.commit()
        return {
            "token": session.token,
            "expiresAt": expires_at,
        }

    async def get_session_user(self, token: str | None) -> dict[str, Any] | None:
        if not token:
            return None
        stmt = select(EduSession).where(EduSession.token == token).limit(1)
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()
        if not session:
            return None
        expires_at = session.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at <= _now_utc():
            await self.db.delete(session)
            await self.db.commit()
            return None
        user = await self.get_user_by_id(session.user_id)
        if not user:
            return None
        return {
            "token": session.token,
            "expiresAt": expires_at,
            "user": user,
        }

    async def delete_session(self, token: str | None) -> None:
        if not token:
            return
        await self.db.execute(delete(EduSession).where(EduSession.token == token))
        await self.db.commit()

    async def list_sessions_by_user(self, user_id: int) -> list[EduSession]:
        stmt = select(EduSession).where(EduSession.user_id == int(user_id))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def upsert_diagnostic(self, user_id: int, result: dict[str, Any]) -> EduDiagnostic:
        stmt = (
            select(EduDiagnostic)
            .where(EduDiagnostic.user_id == int(user_id), EduDiagnostic.subject == result["subject"])
            .limit(1)
        )
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            existing.grade_band = result["gradeBand"]
            existing.baseline_score = result["baselineScore"]
            existing.confidence_level = result["confidenceLevel"]
            existing.homework_completion = result["homeworkCompletion"]
            existing.mistake_recovery = result["mistakeRecovery"]
            existing.weak_points = result["weakPoints"]
            existing.current_level = result["currentLevel"]
            existing.confidence_score = result["confidenceScore"]
            existing.mastery_summary = result["masterySummary"]
            existing.recommended_path = result["recommendedPath"]
            existing.last_score = result["lastScore"]
            existing.updated_at = _now_utc()
            target = existing
        else:
            target = EduDiagnostic(
                user_id=int(user_id),
                subject=result["subject"],
                grade_band=result["gradeBand"],
                baseline_score=result["baselineScore"],
                confidence_level=result["confidenceLevel"],
                homework_completion=result["homeworkCompletion"],
                mistake_recovery=result["mistakeRecovery"],
                weak_points=result["weakPoints"],
                current_level=result["currentLevel"],
                confidence_score=result["confidenceScore"],
                mastery_summary=result["masterySummary"],
                recommended_path=result["recommendedPath"],
                last_score=result["lastScore"],
                updated_at=_now_utc(),
            )
            self.db.add(target)
        await self.db.commit()
        await self.db.refresh(target)
        return target

    async def get_diagnostics_by_user(self, user_id: int) -> list[EduDiagnostic]:
        stmt = (
            select(EduDiagnostic)
            .where(EduDiagnostic.user_id == int(user_id))
            .order_by(desc(EduDiagnostic.updated_at))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_practice_assignment(self, payload: dict[str, Any]) -> EduPracticeAssignment:
        assignment = EduPracticeAssignment(
            teacher_user_id=int(payload["teacherUserId"]),
            student_user_id=int(payload["studentUserId"]),
            title=payload["title"],
            subject=payload["subject"],
            notes=payload.get("notes", ""),
            source_dataset=payload["sourceDataset"],
            source_config=payload["sourceConfig"],
            source_split=payload["sourceSplit"],
            question_count=int(payload.get("questionCount", 0)),
            questions_json=payload.get("questions", []),
        )
        self.db.add(assignment)
        await self.db.commit()
        await self.db.refresh(assignment)
        return assignment

    async def list_assignments_by_teacher(self, teacher_user_id: int) -> list[EduPracticeAssignment]:
        stmt = (
            select(EduPracticeAssignment)
            .where(EduPracticeAssignment.teacher_user_id == int(teacher_user_id))
            .order_by(desc(EduPracticeAssignment.created_at))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def list_assignments_for_student(self, student_user_id: int) -> list[EduPracticeAssignment]:
        stmt = (
            select(EduPracticeAssignment)
            .where(EduPracticeAssignment.student_user_id == int(student_user_id))
            .order_by(desc(EduPracticeAssignment.created_at))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_classroom_session(self, payload: dict[str, Any]) -> EduClassroomSession:
        session = EduClassroomSession(
            student_user_id=int(payload["studentUserId"]),
            teacher_user_id=payload.get("teacherUserId"),
            subject=payload["subject"],
            topic=payload.get("topic", ""),
            status=payload.get("status", "active"),
            focus_summary=payload.get("focusSummary", ""),
            attendance_state=payload.get("attendanceState", "pending"),
            current_question_id=payload.get("currentQuestionId", ""),
            current_question_json=payload.get("currentQuestion"),
            used_question_ids=payload.get("usedQuestionIds", []),
            transcript_json=payload.get("transcript", []),
            attempted_count=int(payload.get("attemptedCount", 0)),
            correct_count=int(payload.get("correctCount", 0)),
            updated_at=_now_utc(),
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_classroom_session_by_id(self, session_id: int) -> EduClassroomSession | None:
        stmt = select(EduClassroomSession).where(EduClassroomSession.id == int(session_id)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def update_classroom_session(
        self,
        session_id: int,
        updates: dict[str, Any],
    ) -> EduClassroomSession | None:
        session = await self.get_classroom_session_by_id(session_id)
        if not session:
            return None
        mapping = {
            "teacherUserId": "teacher_user_id",
            "subject": "subject",
            "topic": "topic",
            "status": "status",
            "focusSummary": "focus_summary",
            "attendanceState": "attendance_state",
            "currentQuestionId": "current_question_id",
            "currentQuestion": "current_question_json",
            "usedQuestionIds": "used_question_ids",
            "transcript": "transcript_json",
            "attemptedCount": "attempted_count",
            "correctCount": "correct_count",
        }
        for key, attr in mapping.items():
            if key in updates:
                setattr(session, attr, updates[key])
        session.updated_at = _now_utc()
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def list_classroom_sessions_by_student(self, student_user_id: int) -> list[EduClassroomSession]:
        stmt = (
            select(EduClassroomSession)
            .where(EduClassroomSession.student_user_id == int(student_user_id))
            .order_by(desc(EduClassroomSession.updated_at))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def list_recent_classroom_sessions(self, limit: int = 20) -> list[EduClassroomSession]:
        stmt = select(EduClassroomSession).order_by(desc(EduClassroomSession.updated_at)).limit(int(limit))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_simulated_classroom_session(
        self,
        *,
        student: EduUser,
        diagnostics: list[EduDiagnostic],
        subject: str,
        topic: str,
        teacher_user_id: int | None = None,
    ) -> dict[str, Any]:
        question = await pick_question(subject, [])
        focus_summary = _build_focus_summary(student, diagnostics, subject)
        transcript = [
            _build_entry(
                "system",
                f"人脸识别完成，已完成 {student.full_name} 同学课堂报到，签到状态已同步。",
                {"type": "attendance"},
            ),
            _build_entry(
                "teacher",
                f"{student.full_name} 同学，欢迎进入 {subject} 仿真课堂。{focus_summary}",
                {"type": "greeting"},
            ),
        ]
        if topic:
            transcript.append(
                _build_entry(
                    "teacher",
                    f"本节课堂主题：{topic}。我会边讲边问，按你的作答情况即时调整。",
                    {"type": "topic"},
                )
            )
        if question:
            transcript.append(
                _build_entry(
                    "teacher",
                    _build_question_prompt(question),
                    {"type": "question", "questionId": question["sourceId"]},
                )
            )
        return {
            "studentUserId": student.id,
            "teacherUserId": teacher_user_id,
            "subject": subject,
            "topic": topic or "",
            "status": "active" if question else "completed",
            "focusSummary": focus_summary,
            "attendanceState": "reported",
            "currentQuestionId": question["sourceId"] if question else "",
            "currentQuestion": question,
            "usedQuestionIds": [question["sourceId"]] if question else [],
            "transcript": transcript,
            "attemptedCount": 0,
            "correctCount": 0,
        }

    async def handle_classroom_turn(
        self,
        *,
        session: EduClassroomSession,
        student: EduUser,
        selected_choice_index: int | None,
        free_text: str,
    ) -> dict[str, Any]:
        data = _serialize_classroom_session(session)
        transcript = list(data.get("transcript") or [])
        current_question = data.get("currentQuestion")
        trimmed_text = (free_text or "").strip()
        has_choice = selected_choice_index is not None

        if data.get("status") != "active" or not current_question:
            transcript.append(
                _build_entry(
                    "teacher",
                    "这节仿真课堂已经结束了。可以重新开启一节新的课堂继续练习。",
                    {"type": "session-ended"},
                )
            )
            data["transcript"] = transcript
            return data

        if not has_choice and not trimmed_text:
            transcript.append(
                _build_entry(
                    "teacher",
                    "请先回答当前题目，或者直接把你的疑问发给我。",
                    {"type": "nudge"},
                )
            )
            data["transcript"] = transcript
            return data

        transcript.append(
            _build_entry(
                "student",
                _build_student_utterance(current_question, selected_choice_index, trimmed_text),
                {"type": "student-turn"},
            )
        )

        if trimmed_text:
            transcript.append(
                _build_entry(
                    "teacher",
                    (
                        f"收到你的追问。结合这道题和你当前的课堂状态，我先提醒你：{data.get('focusSummary') or ''} "
                        "先把题干中的关键词圈出来，再逐项排除，最后再确认答案。"
                    ),
                    {"type": "hint"},
                )
            )

        if has_choice:
            attempted_count = int(data.get("attemptedCount") or 0) + 1
            data["attemptedCount"] = attempted_count
            if int(selected_choice_index) == int(current_question.get("answerIndex", -1)):
                correct_count = int(data.get("correctCount") or 0) + 1
                data["correctCount"] = correct_count
                transcript.append(
                    _build_entry(
                        "teacher",
                        _build_correct_feedback(current_question, data.get("focusSummary") or ""),
                        {"type": "feedback-correct"},
                    )
                )
                next_question = await pick_question(
                    data.get("subject") or "综合",
                    [*(data.get("usedQuestionIds") or []), current_question.get("sourceId")],
                )
                if next_question:
                    data["currentQuestionId"] = next_question["sourceId"]
                    data["currentQuestion"] = next_question
                    data["usedQuestionIds"] = [*(data.get("usedQuestionIds") or []), next_question["sourceId"]]
                    transcript.append(
                        _build_entry(
                            "teacher",
                            f"继续下一题。{_build_question_prompt(next_question)}",
                            {"type": "question", "questionId": next_question["sourceId"]},
                        )
                    )
                else:
                    data["currentQuestionId"] = ""
                    data["currentQuestion"] = None
                    data["status"] = "completed"
                    transcript.append(
                        _build_entry(
                            "teacher",
                            (
                                f"本节 {data.get('subject') or '综合'} 仿真课堂先到这里。你一共作答 "
                                f"{data.get('attemptedCount')} 次，答对 {data.get('correctCount')} 题，"
                                "建议回到学情画像和错题复盘继续巩固。"
                            ),
                            {"type": "summary"},
                        )
                    )
            else:
                transcript.append(
                    _build_entry(
                        "teacher",
                        _build_wrong_feedback(
                            current_question,
                            int(selected_choice_index),
                            data.get("focusSummary") or "",
                        ),
                        {"type": "feedback-wrong"},
                    )
                )

        data["transcript"] = transcript
        return data

    async def build_student_overview(self, student: EduUser) -> dict[str, Any]:
        diagnostics = await self.get_diagnostics_by_user(student.id)
        assignments = await self.list_assignments_for_student(student.id)
        classroom_sessions = await self.list_classroom_sessions_by_student(student.id)

        serialized_diagnostics = [_serialize_diagnostic(item) for item in diagnostics]
        serialized_assignments = _sort_by_date_desc(
            [_serialize_assignment(item) for item in assignments],
            "createdAt",
        )
        serialized_classrooms = _sort_by_date_desc(
            [_serialize_classroom_session(item) for item in classroom_sessions],
            "updatedAt",
        )

        active_classroom = next(
            (item for item in serialized_classrooms if item.get("status") == "active"),
            serialized_classrooms[0] if serialized_classrooms else None,
        )

        personalized_plan = []
        if diagnostics:
            weakest = sorted(diagnostics, key=lambda item: item.confidence_score)[0]
            personalized_plan = [
                f"优先补强 {weakest.subject}，当前层级为 {weakest.current_level}",
                *[str(item) for item in weakest.recommended_path[:3]],
            ]
        else:
            personalized_plan = ["先完成至少 1 份学情画像", "进入仿真课堂做首轮真题互动", "再进入教师派发练习巩固"]

        return {
            "student": _serialize_user(student),
            "metrics": {
                "diagnosticsCount": len(diagnostics),
                "assignmentCount": len(assignments),
                "classroomCount": len(classroom_sessions),
                "activeClassroomCount": sum(1 for item in classroom_sessions if item.status == "active"),
                "completedClassroomCount": sum(1 for item in classroom_sessions if item.status == "completed"),
                "attemptedCount": _sum_by(classroom_sessions, lambda item: item.attempted_count),
                "correctCount": _sum_by(classroom_sessions, lambda item: item.correct_count),
            },
            "learning": {
                "diagnosticSnapshots": [
                    {
                        "subject": item["subject"],
                        "currentLevel": item["currentLevel"],
                        "confidenceScore": item["confidenceScore"],
                        "weakPoints": item["weakPoints"][:3],
                    }
                    for item in serialized_diagnostics[:6]
                ],
                "diagnostics": serialized_diagnostics,
                "personalizedPlan": personalized_plan,
            },
            "assignments": {
                "bySubject": _build_breakdown(assignments, lambda item: item.subject),
                "recent": serialized_assignments[:8],
            },
            "classrooms": {
                "bySubject": _build_breakdown(classroom_sessions, lambda item: item.subject),
                "activeSession": active_classroom,
                "recent": serialized_classrooms[:8],
            },
        }

    async def build_teacher_student_cards(self) -> list[dict[str, Any]]:
        students = await self.list_users_by_role("student")
        cards: list[dict[str, Any]] = []
        for student in students:
            diagnostics = await self.get_diagnostics_by_user(student.id)
            assignments = await self.list_assignments_for_student(student.id)
            cards.append(
                {
                    **(_serialize_user(student) or {}),
                    "diagnosticCount": len(diagnostics),
                    "assignmentsCount": len(assignments),
                    "topWeakness": (
                        sorted(diagnostics, key=lambda item: item.confidence_score)[0].subject
                        if diagnostics
                        else ((student.weak_subjects or ["待诊断"])[0])
                    ),
                }
            )
        cards.sort(key=lambda item: item.get("assignmentsCount", 0), reverse=True)
        return cards

    async def build_teacher_overview(self, teacher: EduUser) -> dict[str, Any]:
        students = await self.list_users_by_role("student")
        teacher_assignments = await self.list_assignments_by_teacher(teacher.id)
        classroom_sessions = await self.list_recent_classroom_sessions(30)
        question_bank = await get_question_bank()

        serialized_assignments = [_serialize_assignment(item) for item in teacher_assignments]
        serialized_classrooms = [_serialize_classroom_session(item) for item in classroom_sessions]
        return {
            "teacher": _serialize_user(teacher),
            "metrics": {
                "studentCount": len(students),
                "assignmentCount": len(teacher_assignments),
                "classroomCount": len(classroom_sessions),
                "activeClassroomCount": sum(1 for item in classroom_sessions if item.status == "active"),
                "completedClassroomCount": sum(1 for item in classroom_sessions if item.status == "completed"),
                "questionBankTotal": int((question_bank.get("stats") or {}).get("total") or 0),
            },
            "students": {
                "byGrade": _build_breakdown(students, lambda item: item.grade),
                "weakSubjectTags": _build_breakdown(
                    [subject for student in students for subject in (student.weak_subjects or [])],
                    lambda item: item,
                ),
            },
            "questionBank": {
                "source": question_bank.get("source"),
                "warning": question_bank.get("warning") or "",
                "stats": question_bank.get("stats") or {"total": 0, "subjectBreakdown": {}},
            },
            "recentAssignments": _sort_by_date_desc(serialized_assignments, "createdAt")[:10],
            "recentClassrooms": _sort_by_date_desc(serialized_classrooms, "updatedAt")[:10],
        }

    async def build_teacher_student_detail(self, student_id: int) -> dict[str, Any] | None:
        student = await self.get_user_by_id(student_id)
        if not student or student.role != "student":
            return None
        diagnostics = await self.get_diagnostics_by_user(student.id)
        assignments = await self.list_assignments_for_student(student.id)
        classrooms = await self.list_classroom_sessions_by_student(student.id)

        recent_activity = [
            *[
                {
                    "type": "assignment",
                    "label": item.title,
                    "subject": item.subject,
                    "createdAt": _to_iso(item.created_at),
                }
                for item in assignments
            ],
            *[
                {
                    "type": "classroom",
                    "label": item.topic or f"{item.subject} 仿真课堂",
                    "subject": item.subject,
                    "status": item.status,
                    "createdAt": _to_iso(item.updated_at or item.created_at),
                }
                for item in classrooms
            ],
        ]
        recent_activity = _sort_by_date_desc(recent_activity, "createdAt")[:12]

        return {
            "student": _serialize_user(student),
            "metrics": {
                "diagnosticsCount": len(diagnostics),
                "assignmentCount": len(assignments),
                "classroomCount": len(classrooms),
                "activeClassroomCount": sum(1 for item in classrooms if item.status == "active"),
                "attemptedCount": _sum_by(classrooms, lambda item: item.attempted_count),
                "correctCount": _sum_by(classrooms, lambda item: item.correct_count),
            },
            "diagnostics": [_serialize_diagnostic(item) for item in diagnostics],
            "assignments": [_serialize_assignment(item) for item in assignments],
            "classrooms": [_serialize_classroom_session(item) for item in classrooms],
            "recentActivity": recent_activity,
        }

    async def search_question_bank(self, *, subject: str, query: str, limit: int) -> dict[str, Any]:
        from backend.services.edu_question_bank_service import search_question_bank

        return await search_question_bank(subject=subject, query=query, limit=limit)

    async def get_question_bank_source(self) -> dict[str, Any]:
        return get_question_bank_source()

    async def get_questions_by_source_ids(self, source_ids: list[str]) -> list[dict[str, Any]]:
        return await get_questions_by_source_ids(source_ids)


serialize_user = _serialize_user
serialize_diagnostic = _serialize_diagnostic
serialize_assignment = _serialize_assignment
serialize_classroom_session = _serialize_classroom_session
