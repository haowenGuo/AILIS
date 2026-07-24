# backend/api/edu.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。
- 文件类型：`source-code`
- 原始行数：553
- SHA-256：`fc3e1683a564d7add4458a5ed0ebbcbbf70d8deecb616134e395ff2e6f74256f`
- 可运行副本：[打开源文件](../../../../source/backend/api/edu.py)
- 依赖：`datetime`、`pathlib`、`fastapi`、`fastapi.responses`、`sqlalchemy.ext.asyncio`、`backend.api.edu_schemas`、`backend.core.config`、`backend.core.database`、`backend.models.edu_models`、`backend.services.edu_platform_service`
- 主要符号：`_ok`、`_json_ok`、`_set_session_cookie`、`_clear_session_cookie`、`get_platform_service`、`get_current_user`、`require_student`、`require_teacher`、`edu_index`、`edu_status`、`edu_me`、`register_student`、`register_teacher`、`login`、`logout`、`student_overview`、`student_diagnostics`、`upsert_student_diagnostic`、`student_assignments`、`student_classrooms`、`start_classroom`、`respond_classroom`、`complete_classroom`、`teacher_overview`、`teacher_students`、`teacher_student_detail`、`teacher_question_bank`、`teacher_assignments`、`teacher_classroom_sessions`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from datetime import datetime, timezone</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response</code> | 导入 Python 依赖 `fastapi`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from fastapi.responses import FileResponse, JSONResponse</code> | 导入 Python 依赖 `fastapi.responses`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>from backend.api.edu_schemas import (</code> | 导入 Python 依赖 `backend.api.edu_schemas`，供本模块调用其类型、函数或常量。 |
| 9 | <code>    AssignmentCreateRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 10 | <code>    ClassroomRespondRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 11 | <code>    ClassroomStartRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 12 | <code>    DiagnosticUpsertRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 13 | <code>    LoginRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 14 | <code>    StudentRegisterRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 15 | <code>    TeacherRegisterRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 16 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 17 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 18 | <code>from backend.core.database import get_db</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 19 | <code>from backend.models.edu_models import EduUser</code> | 导入 Python 依赖 `backend.models.edu_models`，供本模块调用其类型、函数或常量。 |
| 20 | <code>from backend.services.edu_platform_service import (</code> | 导入 Python 依赖 `backend.services.edu_platform_service`，供本模块调用其类型、函数或常量。 |
| 21 | <code>    EduPlatformService,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 22 | <code>    compute_diagnostic_result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 23 | <code>    hash_password,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 24 | <code>    serialize_assignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 25 | <code>    serialize_classroom_session,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 26 | <code>    serialize_diagnostic,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 27 | <code>    verify_password,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 28 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 31 | <code>router = APIRouter()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 32 | <code>_static_root = Path(__file__).resolve().parent.parent / "static" / "edu"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>def _ok(data, meta=None):</code> | 定义 Python 函数 `_ok`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 36 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 37 | <code>        "ok": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 38 | <code>        "data": data,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 39 | <code>        "meta": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 40 | <code>            "timestamp": datetime.now(timezone.utc).isoformat(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 41 | <code>            **(meta or {}),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 42 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>def _json_ok(data, meta=None):</code> | 定义 Python 函数 `_json_ok`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 47 | <code>    return JSONResponse(_ok(data, meta))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>def _set_session_cookie(response: Response, token: str) -&gt; None:</code> | 定义 Python 函数 `_set_session_cookie`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 51 | <code>    response.set_cookie(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 52 | <code>        key=settings.EDU_SESSION_COOKIE_NAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 53 | <code>        value=token,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 54 | <code>        httponly=True,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 55 | <code>        samesite="lax",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 56 | <code>        secure=not settings.DEBUG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 57 | <code>        max_age=max(int(settings.EDU_SESSION_TTL_DAYS or 14), 1) * 24 * 60 * 60,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 58 | <code>        path="/",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 59 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>def _clear_session_cookie(response: Response) -&gt; None:</code> | 定义 Python 函数 `_clear_session_cookie`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 63 | <code>    response.delete_cookie(settings.EDU_SESSION_COOKIE_NAME, path="/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>async def get_platform_service(db: AsyncSession = Depends(get_db)) -&gt; EduPlatformService:</code> | 定义 Python 函数 `get_platform_service`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 67 | <code>    return EduPlatformService(db)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>async def get_current_user(</code> | 定义 Python 函数 `get_current_user`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 71 | <code>    request: Request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 72 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 73 | <code>) -&gt; EduUser &#124; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 74 | <code>    session = await service.get_session_user(request.cookies.get(settings.EDU_SESSION_COOKIE_NAME))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 75 | <code>    return session["user"] if session else None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>async def require_student(user: EduUser &#124; None = Depends(get_current_user)) -&gt; EduUser:</code> | 定义 Python 函数 `require_student`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 79 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 80 | <code>        raise HTTPException(status_code=401, detail="请先登录学生账号。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 81 | <code>    if user.role not in {"student", "admin"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 82 | <code>        raise HTTPException(status_code=403, detail="当前接口仅允许学生端访问。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 83 | <code>    return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>async def require_teacher(user: EduUser &#124; None = Depends(get_current_user)) -&gt; EduUser:</code> | 定义 Python 函数 `require_teacher`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 87 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 88 | <code>        raise HTTPException(status_code=401, detail="请先登录教师账号。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 89 | <code>    if user.role not in {"teacher", "admin"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 90 | <code>        raise HTTPException(status_code=403, detail="当前接口仅允许教师端访问。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 91 | <code>    return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>@router.get("/edu", include_in_schema=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 95 | <code>async def edu_index():</code> | 定义 Python 函数 `edu_index`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 96 | <code>    return FileResponse(_static_root / "index.html")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>@router.get("/api/edu/system/status")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 100 | <code>async def edu_status(service: EduPlatformService = Depends(get_platform_service)):</code> | 定义 Python 函数 `edu_status`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 101 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 103 | <code>            "appName": settings.EDU_APP_NAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 104 | <code>            "questionBankSource": await service.get_question_bank_source(),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 105 | <code>            "modules": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 106 | <code>                "用户准入与权限管理",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 107 | <code>                "仿真课堂互动",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 108 | <code>                "学情画像",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 109 | <code>                "个性化适配",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 110 | <code>                "教师端角色",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 111 | <code>                "真实题库派题",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 112 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>            "routeGroups": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 114 | <code>                "public": ["/edu", "/api/edu/system/status", "/api/edu/me"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 115 | <code>                "auth": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 116 | <code>                    "/api/edu/auth/register/student",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 117 | <code>                    "/api/edu/auth/register/teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 118 | <code>                    "/api/edu/auth/login",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 119 | <code>                    "/api/edu/auth/logout",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 120 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>                "student": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 122 | <code>                    "/api/edu/student/overview",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 123 | <code>                    "/api/edu/student/diagnostics",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 124 | <code>                    "/api/edu/student/practice-assignments",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 125 | <code>                    "/api/edu/student/classroom-sessions",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 126 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>                "teacher": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 128 | <code>                    "/api/edu/teacher/overview",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 129 | <code>                    "/api/edu/teacher/students",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 130 | <code>                    "/api/edu/teacher/question-bank",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 131 | <code>                    "/api/edu/teacher/assignments",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 132 | <code>                    "/api/edu/teacher/classroom-sessions",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 133 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>@router.get("/api/edu/me")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 140 | <code>async def edu_me(</code> | 定义 Python 函数 `edu_me`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 141 | <code>    user: EduUser &#124; None = Depends(get_current_user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 142 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 143 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 144 | <code>        return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 145 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 146 | <code>                "user": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 147 | <code>                "homePath": "/edu",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 148 | <code>                "navigation": ["login", "student-register", "teacher-register"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 149 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    if user.role == "admin":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 152 | <code>        navigation = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 153 | <code>            "dashboard",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 154 | <code>            "classroom",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 155 | <code>            "diagnostics",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 156 | <code>            "practice",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 157 | <code>            "teacher-dashboard",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 158 | <code>            "teacher-classroom",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 159 | <code>            "teacher-question-bank",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 160 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>    elif user.role == "student":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 162 | <code>        navigation = ["dashboard", "classroom", "diagnostics", "practice"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 163 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 164 | <code>        navigation = ["teacher-dashboard", "teacher-classroom", "teacher-question-bank"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 167 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 168 | <code>            "user": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 169 | <code>                "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 170 | <code>                "role": user.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 171 | <code>                "fullName": user.full_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 172 | <code>                "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 173 | <code>                "vipLevel": user.vip_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 174 | <code>                "grade": user.grade,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 175 | <code>                "managedSubjects": user.managed_subjects or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 176 | <code>                "managedGrades": user.managed_grades or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 177 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>            "homePath": "/edu",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 179 | <code>            "navigation": navigation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 180 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>@router.post("/api/edu/auth/register/student")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 185 | <code>async def register_student(</code> | 定义 Python 函数 `register_student`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 186 | <code>    payload: StudentRegisterRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 187 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 188 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 189 | <code>    if payload.password != payload.confirmPassword:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 190 | <code>        raise HTTPException(status_code=400, detail="两次输入的密码不一致。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 191 | <code>    if not payload.agreementAccepted:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 192 | <code>        raise HTTPException(status_code=400, detail="请先勾选并确认学习服务自愿协议书。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 193 | <code>    if await service.get_user_by_email(payload.email):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 194 | <code>        raise HTTPException(status_code=409, detail="该邮箱已完成注册，请直接登录。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>    user = await service.create_user(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 197 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 198 | <code>            **payload.model_dump(),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 199 | <code>            "passwordHash": hash_password(payload.password),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 200 | <code>            "role": "student",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 201 | <code>            "vipLevel": "基础会员",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 202 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>    session = await service.create_session(user.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 205 | <code>    result = _json_ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 206 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 207 | <code>            "user": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 208 | <code>                "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 209 | <code>                "role": user.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 210 | <code>                "fullName": user.full_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 211 | <code>                "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 212 | <code>                "grade": user.grade,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 213 | <code>                "vipLevel": user.vip_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 214 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>        {"message": "学生档案已创建，并已自动登录。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 217 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    _set_session_cookie(result, session["token"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 219 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>@router.post("/api/edu/auth/register/teacher")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 223 | <code>async def register_teacher(</code> | 定义 Python 函数 `register_teacher`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 224 | <code>    payload: TeacherRegisterRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 225 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 226 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 227 | <code>    if payload.password != payload.confirmPassword:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 228 | <code>        raise HTTPException(status_code=400, detail="两次输入的密码不一致。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 229 | <code>    if payload.inviteCode != settings.EDU_TEACHER_INVITE_CODE:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 230 | <code>        raise HTTPException(status_code=403, detail="教师邀请码不正确。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 231 | <code>    if await service.get_user_by_email(payload.email):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 232 | <code>        raise HTTPException(status_code=409, detail="该教师邮箱已存在，请直接登录。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>    managed_subjects = payload.managedSubjects or ["数学"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 235 | <code>    managed_grades = payload.managedGrades or ["初三"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 236 | <code>    user = await service.create_user(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 237 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 238 | <code>            "fullName": payload.fullName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 239 | <code>            "email": payload.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 240 | <code>            "passwordHash": hash_password(payload.password),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 241 | <code>            "phone": payload.phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 242 | <code>            "role": "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 243 | <code>            "vipLevel": "教师端",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 244 | <code>            "grade": managed_grades[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 245 | <code>            "schoolName": payload.schoolName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 246 | <code>            "className": payload.className or "教研组",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 247 | <code>            "targetExam": "教学管理",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 248 | <code>            "learningPreference": "班级管理 + 派题",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 249 | <code>            "favoriteSubjects": managed_subjects,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 250 | <code>            "weakSubjects": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 251 | <code>            "goalSummary": "教师端权限已开通",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 252 | <code>            "parentName": payload.fullName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 253 | <code>            "parentPhone": payload.phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 254 | <code>            "parentNoticeOptIn": False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 255 | <code>            "agreementAccepted": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 256 | <code>            "teacherTitle": payload.teacherTitle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 257 | <code>            "managedSubjects": managed_subjects,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 258 | <code>            "managedGrades": managed_grades,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>    session = await service.create_session(user.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 262 | <code>    result = _json_ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 263 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 264 | <code>            "user": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 265 | <code>                "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 266 | <code>                "role": user.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 267 | <code>                "fullName": user.full_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 268 | <code>                "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 269 | <code>                "managedSubjects": user.managed_subjects or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 270 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>        {"message": "教师端角色已接入，并已自动登录。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 273 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>    _set_session_cookie(result, session["token"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 275 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>@router.post("/api/edu/auth/login")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 279 | <code>async def login(</code> | 定义 Python 函数 `login`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 280 | <code>    payload: LoginRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 281 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 282 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 283 | <code>    user = await service.get_user_by_email(payload.email)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 284 | <code>    if not user or not verify_password(payload.password, user.password_hash):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 285 | <code>        raise HTTPException(status_code=401, detail="邮箱或密码不正确。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 286 | <code>    session = await service.create_session(user.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 287 | <code>    result = _json_ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 288 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 289 | <code>            "user": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 290 | <code>                "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 291 | <code>                "role": user.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 292 | <code>                "fullName": user.full_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 293 | <code>                "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 294 | <code>                "vipLevel": user.vip_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 295 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>        {"message": "登录成功。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 298 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    _set_session_cookie(result, session["token"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 300 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>@router.post("/api/edu/auth/logout")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 304 | <code>async def logout(</code> | 定义 Python 函数 `logout`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 305 | <code>    request: Request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 306 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 307 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 308 | <code>    await service.delete_session(request.cookies.get(settings.EDU_SESSION_COOKIE_NAME))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 309 | <code>    result = _json_ok({"loggedOut": True})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 310 | <code>    _clear_session_cookie(result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 311 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>@router.get("/api/edu/student/overview")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 315 | <code>async def student_overview(</code> | 定义 Python 函数 `student_overview`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 316 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 317 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 318 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 319 | <code>    return _json_ok(await service.build_student_overview(student))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>@router.get("/api/edu/student/diagnostics")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 323 | <code>async def student_diagnostics(</code> | 定义 Python 函数 `student_diagnostics`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 324 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 325 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 326 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 327 | <code>    diagnostics = await service.get_diagnostics_by_user(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 328 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 329 | <code>        [serialize_diagnostic(item) for item in diagnostics],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 330 | <code>        {"count": len(diagnostics)},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 331 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>@router.post("/api/edu/student/diagnostics")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 335 | <code>async def upsert_student_diagnostic(</code> | 定义 Python 函数 `upsert_student_diagnostic`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 336 | <code>    payload: DiagnosticUpsertRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 337 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 338 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 339 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 340 | <code>    result = compute_diagnostic_result(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 341 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 342 | <code>            **payload.model_dump(),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 343 | <code>            "gradeBand": payload.gradeBand or student.grade,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 344 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    saved = await service.upsert_diagnostic(student.id, result)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 347 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 348 | <code>        serialize_diagnostic(saved),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 349 | <code>        {"message": f"{saved.subject} 学情画像已更新。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 350 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>@router.get("/api/edu/student/practice-assignments")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 354 | <code>async def student_assignments(</code> | 定义 Python 函数 `student_assignments`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 355 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 356 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 357 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 358 | <code>    assignments = await service.list_assignments_for_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 359 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 360 | <code>        [serialize_assignment(item) for item in assignments],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 361 | <code>        {"count": len(assignments)},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 362 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>@router.get("/api/edu/student/classroom-sessions")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 366 | <code>async def student_classrooms(</code> | 定义 Python 函数 `student_classrooms`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 367 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 368 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 369 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 370 | <code>    sessions = await service.list_classroom_sessions_by_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 371 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 372 | <code>        [serialize_classroom_session(item) for item in sessions],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 373 | <code>        {"count": len(sessions)},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 374 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>@router.post("/api/edu/student/classroom-sessions")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 378 | <code>async def start_classroom(</code> | 定义 Python 函数 `start_classroom`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 379 | <code>    payload: ClassroomStartRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 380 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 381 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 382 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 383 | <code>    diagnostics = await service.get_diagnostics_by_user(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 384 | <code>    session_draft = await service.create_simulated_classroom_session(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 385 | <code>        student=student,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 386 | <code>        diagnostics=diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 387 | <code>        subject=(payload.subject or "数学").strip(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 388 | <code>        topic=(payload.topic or "").strip(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 389 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>    session = await service.create_classroom_session(session_draft)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 391 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 392 | <code>        serialize_classroom_session(session),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 393 | <code>        {"message": f"{session.subject} 仿真课堂已开启。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 394 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 397 | <code>@router.post("/api/edu/student/classroom-sessions/{session_id}/respond")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 398 | <code>async def respond_classroom(</code> | 定义 Python 函数 `respond_classroom`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 399 | <code>    session_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 400 | <code>    payload: ClassroomRespondRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 401 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 402 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 403 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 404 | <code>    session = await service.get_classroom_session_by_id(session_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 405 | <code>    if not session or session.student_user_id != student.id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 406 | <code>        raise HTTPException(status_code=404, detail="课堂不存在或无权限访问。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 407 | <code>    updated = await service.handle_classroom_turn(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 408 | <code>        session=session,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 409 | <code>        student=student,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 410 | <code>        selected_choice_index=payload.selectedChoiceIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 411 | <code>        free_text=payload.freeText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 412 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>    saved = await service.update_classroom_session(session.id, updated)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 414 | <code>    return _json_ok(serialize_classroom_session(saved))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>@router.post("/api/edu/student/classroom-sessions/{session_id}/complete")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 418 | <code>async def complete_classroom(</code> | 定义 Python 函数 `complete_classroom`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 419 | <code>    session_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 420 | <code>    student: EduUser = Depends(require_student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 421 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 422 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 423 | <code>    session = await service.get_classroom_session_by_id(session_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 424 | <code>    if not session or session.student_user_id != student.id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 425 | <code>        raise HTTPException(status_code=404, detail="课堂不存在或无权限访问。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 426 | <code>    current = serialize_classroom_session(session)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 427 | <code>    transcript = list(current.get("transcript") or [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 428 | <code>    transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 429 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 430 | <code>            "role": "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 431 | <code>            "text": (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 432 | <code>                f"本节 {session.subject} 仿真课堂已手动结束。你累计作答 {session.attempted_count} 次，"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 433 | <code>                f"答对 {session.correct_count} 题，建议接着复盘课堂记录。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 434 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>            "createdAt": datetime.now(timezone.utc).isoformat(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 436 | <code>            "type": "manual-summary",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 437 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 439 | <code>    saved = await service.update_classroom_session(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 440 | <code>        session.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 441 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 442 | <code>            **current,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 443 | <code>            "status": "completed",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 444 | <code>            "currentQuestionId": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 445 | <code>            "currentQuestion": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 446 | <code>            "transcript": transcript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 447 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 450 | <code>        serialize_classroom_session(saved),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 451 | <code>        {"message": "仿真课堂已结束，课堂记录已保留。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 452 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>@router.get("/api/edu/teacher/overview")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 456 | <code>async def teacher_overview(</code> | 定义 Python 函数 `teacher_overview`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 457 | <code>    teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 458 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 459 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 460 | <code>    return _json_ok(await service.build_teacher_overview(teacher))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>@router.get("/api/edu/teacher/students")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 464 | <code>async def teacher_students(</code> | 定义 Python 函数 `teacher_students`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 465 | <code>    _teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 466 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 467 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 468 | <code>    cards = await service.build_teacher_student_cards()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 469 | <code>    return _json_ok(cards, {"count": len(cards)})</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>@router.get("/api/edu/teacher/students/{student_id}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 473 | <code>async def teacher_student_detail(</code> | 定义 Python 函数 `teacher_student_detail`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 474 | <code>    student_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 475 | <code>    _teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 476 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 477 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 478 | <code>    detail = await service.build_teacher_student_detail(student_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 479 | <code>    if not detail:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 480 | <code>        raise HTTPException(status_code=404, detail="学生不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 481 | <code>    return _json_ok(detail)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>@router.get("/api/edu/teacher/question-bank")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 485 | <code>async def teacher_question_bank(</code> | 定义 Python 函数 `teacher_question_bank`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 486 | <code>    subject: str = Query(default="数学"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 487 | <code>    query: str = Query(default=""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 488 | <code>    limit: int = Query(default=12, ge=1, le=30),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 489 | <code>    _teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 490 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 491 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 492 | <code>    return _json_ok(await service.search_question_bank(subject=subject, query=query, limit=limit))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>@router.post("/api/edu/teacher/assignments")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 496 | <code>async def teacher_assignments(</code> | 定义 Python 函数 `teacher_assignments`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 497 | <code>    payload: AssignmentCreateRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 498 | <code>    teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 499 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 500 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 501 | <code>    student = await service.get_user_by_id(payload.studentId)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 502 | <code>    if not student or student.role != "student":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 503 | <code>        raise HTTPException(status_code=404, detail="目标学生不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 504 | <code>    if not payload.questionIds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 505 | <code>        raise HTTPException(status_code=400, detail="请至少勾选 1 道真题。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>    questions = await service.get_questions_by_source_ids(payload.questionIds)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 508 | <code>    if not questions:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 509 | <code>        raise HTTPException(status_code=404, detail="没有找到所选题目，请重新检索。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 510 | <code>    source = await service.get_question_bank_source()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 511 | <code>    title = payload.title.strip() or f"{student.full_name} · {payload.subject.strip() or '综合'}真题练习包"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 513 | <code>    assignment = await service.create_practice_assignment(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 514 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 515 | <code>            "teacherUserId": teacher.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 516 | <code>            "studentUserId": student.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 517 | <code>            "title": title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 518 | <code>            "subject": payload.subject.strip() or "综合",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 519 | <code>            "notes": payload.notes.strip(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 520 | <code>            "sourceDataset": source["dataset"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 521 | <code>            "sourceConfig": source["config"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 522 | <code>            "sourceSplit": source["split"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 523 | <code>            "questionCount": len(questions),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 524 | <code>            "questions": questions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 525 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 528 | <code>        serialize_assignment(assignment),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 529 | <code>        {"message": f"已向 {student.full_name} 派发 {len(questions)} 道{assignment.subject}真题。"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 530 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>@router.get("/api/edu/teacher/classroom-sessions")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 534 | <code>async def teacher_classroom_sessions(</code> | 定义 Python 函数 `teacher_classroom_sessions`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 535 | <code>    limit: int = Query(default=30, ge=1, le=100),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 536 | <code>    _teacher: EduUser = Depends(require_teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 537 | <code>    service: EduPlatformService = Depends(get_platform_service),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 538 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 539 | <code>    students = await service.list_users_by_role("student")</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 540 | <code>    student_name_by_id = {item.id: item.full_name for item in students}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 541 | <code>    sessions = await service.list_recent_classroom_sessions(limit)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 542 | <code>    decorated = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 543 | <code>    for item in sessions:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 544 | <code>        payload = serialize_classroom_session(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 545 | <code>        payload["studentName"] = student_name_by_id.get(item.student_user_id, f"学生 {item.student_user_id}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 546 | <code>        decorated.append(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 547 | <code>    return _json_ok(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 548 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 549 | <code>            "sessions": decorated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 550 | <code>            "activeCount": sum(1 for item in decorated if item.get("status") == "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 551 | <code>            "completedCount": sum(1 for item in decorated if item.get("status") == "completed"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 552 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
