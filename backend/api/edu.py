from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.edu_schemas import (
    AssignmentCreateRequest,
    ClassroomRespondRequest,
    ClassroomStartRequest,
    DiagnosticUpsertRequest,
    LoginRequest,
    StudentRegisterRequest,
    TeacherRegisterRequest,
)
from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.edu_models import EduUser
from backend.services.edu_platform_service import (
    EduPlatformService,
    compute_diagnostic_result,
    hash_password,
    serialize_assignment,
    serialize_classroom_session,
    serialize_diagnostic,
    verify_password,
)

settings = get_settings()
router = APIRouter()
_static_root = Path(__file__).resolve().parent.parent / "static" / "edu"


def _ok(data, meta=None):
    return {
        "ok": True,
        "data": data,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **(meta or {}),
        },
    }


def _json_ok(data, meta=None):
    return JSONResponse(_ok(data, meta))


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.EDU_SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=not settings.DEBUG,
        max_age=max(int(settings.EDU_SESSION_TTL_DAYS or 14), 1) * 24 * 60 * 60,
        path="/",
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(settings.EDU_SESSION_COOKIE_NAME, path="/")


async def get_platform_service(db: AsyncSession = Depends(get_db)) -> EduPlatformService:
    return EduPlatformService(db)


async def get_current_user(
    request: Request,
    service: EduPlatformService = Depends(get_platform_service),
) -> EduUser | None:
    session = await service.get_session_user(request.cookies.get(settings.EDU_SESSION_COOKIE_NAME))
    return session["user"] if session else None


async def require_student(user: EduUser | None = Depends(get_current_user)) -> EduUser:
    if not user:
        raise HTTPException(status_code=401, detail="请先登录学生账号。")
    if user.role not in {"student", "admin"}:
        raise HTTPException(status_code=403, detail="当前接口仅允许学生端访问。")
    return user


async def require_teacher(user: EduUser | None = Depends(get_current_user)) -> EduUser:
    if not user:
        raise HTTPException(status_code=401, detail="请先登录教师账号。")
    if user.role not in {"teacher", "admin"}:
        raise HTTPException(status_code=403, detail="当前接口仅允许教师端访问。")
    return user


@router.get("/edu", include_in_schema=False)
async def edu_index():
    return FileResponse(_static_root / "index.html")


@router.get("/api/edu/system/status")
async def edu_status(service: EduPlatformService = Depends(get_platform_service)):
    return _json_ok(
        {
            "appName": settings.EDU_APP_NAME,
            "questionBankSource": await service.get_question_bank_source(),
            "modules": [
                "用户准入与权限管理",
                "仿真课堂互动",
                "学情画像",
                "个性化适配",
                "教师端角色",
                "真实题库派题",
            ],
            "routeGroups": {
                "public": ["/edu", "/api/edu/system/status", "/api/edu/me"],
                "auth": [
                    "/api/edu/auth/register/student",
                    "/api/edu/auth/register/teacher",
                    "/api/edu/auth/login",
                    "/api/edu/auth/logout",
                ],
                "student": [
                    "/api/edu/student/overview",
                    "/api/edu/student/diagnostics",
                    "/api/edu/student/practice-assignments",
                    "/api/edu/student/classroom-sessions",
                ],
                "teacher": [
                    "/api/edu/teacher/overview",
                    "/api/edu/teacher/students",
                    "/api/edu/teacher/question-bank",
                    "/api/edu/teacher/assignments",
                    "/api/edu/teacher/classroom-sessions",
                ],
            },
        }
    )


@router.get("/api/edu/me")
async def edu_me(
    user: EduUser | None = Depends(get_current_user),
):
    if not user:
        return _json_ok(
            {
                "user": None,
                "homePath": "/edu",
                "navigation": ["login", "student-register", "teacher-register"],
            }
        )
    if user.role == "admin":
        navigation = [
            "dashboard",
            "classroom",
            "diagnostics",
            "practice",
            "teacher-dashboard",
            "teacher-classroom",
            "teacher-question-bank",
        ]
    elif user.role == "student":
        navigation = ["dashboard", "classroom", "diagnostics", "practice"]
    else:
        navigation = ["teacher-dashboard", "teacher-classroom", "teacher-question-bank"]

    return _json_ok(
        {
            "user": {
                "id": user.id,
                "role": user.role,
                "fullName": user.full_name,
                "email": user.email,
                "vipLevel": user.vip_level,
                "grade": user.grade,
                "managedSubjects": user.managed_subjects or [],
                "managedGrades": user.managed_grades or [],
            },
            "homePath": "/edu",
            "navigation": navigation,
        }
    )


@router.post("/api/edu/auth/register/student")
async def register_student(
    payload: StudentRegisterRequest,
    service: EduPlatformService = Depends(get_platform_service),
):
    if payload.password != payload.confirmPassword:
        raise HTTPException(status_code=400, detail="两次输入的密码不一致。")
    if not payload.agreementAccepted:
        raise HTTPException(status_code=400, detail="请先勾选并确认学习服务自愿协议书。")
    if await service.get_user_by_email(payload.email):
        raise HTTPException(status_code=409, detail="该邮箱已完成注册，请直接登录。")

    user = await service.create_user(
        {
            **payload.model_dump(),
            "passwordHash": hash_password(payload.password),
            "role": "student",
            "vipLevel": "基础会员",
        }
    )
    session = await service.create_session(user.id)
    result = _json_ok(
        {
            "user": {
                "id": user.id,
                "role": user.role,
                "fullName": user.full_name,
                "email": user.email,
                "grade": user.grade,
                "vipLevel": user.vip_level,
            }
        },
        {"message": "学生档案已创建，并已自动登录。"},
    )
    _set_session_cookie(result, session["token"])
    return result


@router.post("/api/edu/auth/register/teacher")
async def register_teacher(
    payload: TeacherRegisterRequest,
    service: EduPlatformService = Depends(get_platform_service),
):
    if payload.password != payload.confirmPassword:
        raise HTTPException(status_code=400, detail="两次输入的密码不一致。")
    if payload.inviteCode != settings.EDU_TEACHER_INVITE_CODE:
        raise HTTPException(status_code=403, detail="教师邀请码不正确。")
    if await service.get_user_by_email(payload.email):
        raise HTTPException(status_code=409, detail="该教师邮箱已存在，请直接登录。")

    managed_subjects = payload.managedSubjects or ["数学"]
    managed_grades = payload.managedGrades or ["初三"]
    user = await service.create_user(
        {
            "fullName": payload.fullName,
            "email": payload.email,
            "passwordHash": hash_password(payload.password),
            "phone": payload.phone,
            "role": "teacher",
            "vipLevel": "教师端",
            "grade": managed_grades[0],
            "schoolName": payload.schoolName,
            "className": payload.className or "教研组",
            "targetExam": "教学管理",
            "learningPreference": "班级管理 + 派题",
            "favoriteSubjects": managed_subjects,
            "weakSubjects": [],
            "goalSummary": "教师端权限已开通",
            "parentName": payload.fullName,
            "parentPhone": payload.phone,
            "parentNoticeOptIn": False,
            "agreementAccepted": True,
            "teacherTitle": payload.teacherTitle,
            "managedSubjects": managed_subjects,
            "managedGrades": managed_grades,
        }
    )
    session = await service.create_session(user.id)
    result = _json_ok(
        {
            "user": {
                "id": user.id,
                "role": user.role,
                "fullName": user.full_name,
                "email": user.email,
                "managedSubjects": user.managed_subjects or [],
            }
        },
        {"message": "教师端角色已接入，并已自动登录。"},
    )
    _set_session_cookie(result, session["token"])
    return result


@router.post("/api/edu/auth/login")
async def login(
    payload: LoginRequest,
    service: EduPlatformService = Depends(get_platform_service),
):
    user = await service.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="邮箱或密码不正确。")
    session = await service.create_session(user.id)
    result = _json_ok(
        {
            "user": {
                "id": user.id,
                "role": user.role,
                "fullName": user.full_name,
                "email": user.email,
                "vipLevel": user.vip_level,
            }
        },
        {"message": "登录成功。"},
    )
    _set_session_cookie(result, session["token"])
    return result


@router.post("/api/edu/auth/logout")
async def logout(
    request: Request,
    service: EduPlatformService = Depends(get_platform_service),
):
    await service.delete_session(request.cookies.get(settings.EDU_SESSION_COOKIE_NAME))
    result = _json_ok({"loggedOut": True})
    _clear_session_cookie(result)
    return result


@router.get("/api/edu/student/overview")
async def student_overview(
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    return _json_ok(await service.build_student_overview(student))


@router.get("/api/edu/student/diagnostics")
async def student_diagnostics(
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    diagnostics = await service.get_diagnostics_by_user(student.id)
    return _json_ok(
        [serialize_diagnostic(item) for item in diagnostics],
        {"count": len(diagnostics)},
    )


@router.post("/api/edu/student/diagnostics")
async def upsert_student_diagnostic(
    payload: DiagnosticUpsertRequest,
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    result = compute_diagnostic_result(
        {
            **payload.model_dump(),
            "gradeBand": payload.gradeBand or student.grade,
        }
    )
    saved = await service.upsert_diagnostic(student.id, result)
    return _json_ok(
        serialize_diagnostic(saved),
        {"message": f"{saved.subject} 学情画像已更新。"},
    )


@router.get("/api/edu/student/practice-assignments")
async def student_assignments(
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    assignments = await service.list_assignments_for_student(student.id)
    return _json_ok(
        [serialize_assignment(item) for item in assignments],
        {"count": len(assignments)},
    )


@router.get("/api/edu/student/classroom-sessions")
async def student_classrooms(
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    sessions = await service.list_classroom_sessions_by_student(student.id)
    return _json_ok(
        [serialize_classroom_session(item) for item in sessions],
        {"count": len(sessions)},
    )


@router.post("/api/edu/student/classroom-sessions")
async def start_classroom(
    payload: ClassroomStartRequest,
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    diagnostics = await service.get_diagnostics_by_user(student.id)
    session_draft = await service.create_simulated_classroom_session(
        student=student,
        diagnostics=diagnostics,
        subject=(payload.subject or "数学").strip(),
        topic=(payload.topic or "").strip(),
    )
    session = await service.create_classroom_session(session_draft)
    return _json_ok(
        serialize_classroom_session(session),
        {"message": f"{session.subject} 仿真课堂已开启。"},
    )


@router.post("/api/edu/student/classroom-sessions/{session_id}/respond")
async def respond_classroom(
    session_id: int,
    payload: ClassroomRespondRequest,
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    session = await service.get_classroom_session_by_id(session_id)
    if not session or session.student_user_id != student.id:
        raise HTTPException(status_code=404, detail="课堂不存在或无权限访问。")
    updated = await service.handle_classroom_turn(
        session=session,
        student=student,
        selected_choice_index=payload.selectedChoiceIndex,
        free_text=payload.freeText,
    )
    saved = await service.update_classroom_session(session.id, updated)
    return _json_ok(serialize_classroom_session(saved))


@router.post("/api/edu/student/classroom-sessions/{session_id}/complete")
async def complete_classroom(
    session_id: int,
    student: EduUser = Depends(require_student),
    service: EduPlatformService = Depends(get_platform_service),
):
    session = await service.get_classroom_session_by_id(session_id)
    if not session or session.student_user_id != student.id:
        raise HTTPException(status_code=404, detail="课堂不存在或无权限访问。")
    current = serialize_classroom_session(session)
    transcript = list(current.get("transcript") or [])
    transcript.append(
        {
            "role": "teacher",
            "text": (
                f"本节 {session.subject} 仿真课堂已手动结束。你累计作答 {session.attempted_count} 次，"
                f"答对 {session.correct_count} 题，建议接着复盘课堂记录。"
            ),
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "type": "manual-summary",
        }
    )
    saved = await service.update_classroom_session(
        session.id,
        {
            **current,
            "status": "completed",
            "currentQuestionId": "",
            "currentQuestion": None,
            "transcript": transcript,
        },
    )
    return _json_ok(
        serialize_classroom_session(saved),
        {"message": "仿真课堂已结束，课堂记录已保留。"},
    )


@router.get("/api/edu/teacher/overview")
async def teacher_overview(
    teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    return _json_ok(await service.build_teacher_overview(teacher))


@router.get("/api/edu/teacher/students")
async def teacher_students(
    _teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    cards = await service.build_teacher_student_cards()
    return _json_ok(cards, {"count": len(cards)})


@router.get("/api/edu/teacher/students/{student_id}")
async def teacher_student_detail(
    student_id: int,
    _teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    detail = await service.build_teacher_student_detail(student_id)
    if not detail:
        raise HTTPException(status_code=404, detail="学生不存在。")
    return _json_ok(detail)


@router.get("/api/edu/teacher/question-bank")
async def teacher_question_bank(
    subject: str = Query(default="数学"),
    query: str = Query(default=""),
    limit: int = Query(default=12, ge=1, le=30),
    _teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    return _json_ok(await service.search_question_bank(subject=subject, query=query, limit=limit))


@router.post("/api/edu/teacher/assignments")
async def teacher_assignments(
    payload: AssignmentCreateRequest,
    teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    student = await service.get_user_by_id(payload.studentId)
    if not student or student.role != "student":
        raise HTTPException(status_code=404, detail="目标学生不存在。")
    if not payload.questionIds:
        raise HTTPException(status_code=400, detail="请至少勾选 1 道真题。")

    questions = await service.get_questions_by_source_ids(payload.questionIds)
    if not questions:
        raise HTTPException(status_code=404, detail="没有找到所选题目，请重新检索。")
    source = await service.get_question_bank_source()
    title = payload.title.strip() or f"{student.full_name} · {payload.subject.strip() or '综合'}真题练习包"

    assignment = await service.create_practice_assignment(
        {
            "teacherUserId": teacher.id,
            "studentUserId": student.id,
            "title": title,
            "subject": payload.subject.strip() or "综合",
            "notes": payload.notes.strip(),
            "sourceDataset": source["dataset"],
            "sourceConfig": source["config"],
            "sourceSplit": source["split"],
            "questionCount": len(questions),
            "questions": questions,
        }
    )
    return _json_ok(
        serialize_assignment(assignment),
        {"message": f"已向 {student.full_name} 派发 {len(questions)} 道{assignment.subject}真题。"},
    )


@router.get("/api/edu/teacher/classroom-sessions")
async def teacher_classroom_sessions(
    limit: int = Query(default=30, ge=1, le=100),
    _teacher: EduUser = Depends(require_teacher),
    service: EduPlatformService = Depends(get_platform_service),
):
    students = await service.list_users_by_role("student")
    student_name_by_id = {item.id: item.full_name for item in students}
    sessions = await service.list_recent_classroom_sessions(limit)
    decorated = []
    for item in sessions:
        payload = serialize_classroom_session(item)
        payload["studentName"] = student_name_by_id.get(item.student_user_id, f"学生 {item.student_user_id}")
        decorated.append(payload)
    return _json_ok(
        {
            "sessions": decorated,
            "activeCount": sum(1 for item in decorated if item.get("status") == "active"),
            "completedCount": sum(1 for item in decorated if item.get("status") == "completed"),
        }
    )
