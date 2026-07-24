# backend/api/admin.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。
- 文件类型：`source-code`
- 原始行数：121
- SHA-256：`9aa3e07c1bc0f8c6978587703c0ce7cacf877b70530a25bd6c26d0adbfe4fbd5`
- 可运行副本：[打开源文件](../../../../source/backend/api/admin.py)
- 依赖：`datetime`、`typing`、`fastapi`、`pydantic`、`sqlalchemy.ext.asyncio`、`backend.api.account`、`backend.core.database`、`backend.models.db_models`、`backend.services.account_service`
- 主要符号：`MembershipUpdateRequest`、`admin_list_users`、`admin_get_user`、`admin_get_user_payments`、`admin_update_membership`、`admin_revoke_membership`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from datetime import datetime</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from typing import Literal</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>from fastapi import APIRouter, Depends, HTTPException, Query</code> | 导入 Python 依赖 `fastapi`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from pydantic import BaseModel, Field</code> | 导入 Python 依赖 `pydantic`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>from backend.api.account import require_app_admin</code> | 导入 Python 依赖 `backend.api.account`，供本模块调用其类型、函数或常量。 |
| 9 | <code>from backend.core.database import get_db</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 10 | <code>from backend.models.db_models import AppUser</code> | 导入 Python 依赖 `backend.models.db_models`，供本模块调用其类型、函数或常量。 |
| 11 | <code>from backend.services.account_service import AccountService, serialize_payment, serialize_user</code> | 导入 Python 依赖 `backend.services.account_service`，供本模块调用其类型、函数或常量。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>router = APIRouter()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>class MembershipUpdateRequest(BaseModel):</code> | 定义 Python 类 `MembershipUpdateRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 17 | <code>    status: Literal["free", "active", "trialing", "past_due", "canceled", "revoked"] = "active"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 18 | <code>    plan: str = Field(default="manual", max_length=32)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 19 | <code>    expiresAt: datetime &#124; None = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 20 | <code>    reason: str = Field(default="", max_length=500)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>@router.get("/admin/users")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 24 | <code>async def admin_list_users(</code> | 定义 Python 函数 `admin_list_users`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 25 | <code>    query: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 26 | <code>    limit: int = Query(default=50, ge=1, le=200),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 27 | <code>    offset: int = Query(default=0, ge=0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 28 | <code>    admin: AppUser = Depends(require_app_admin),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 29 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 30 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 31 | <code>    service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 32 | <code>    users = await service.list_users(query=query, limit=limit, offset=offset)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 33 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 34 | <code>        "admin": admin.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 35 | <code>        "users": [serialize_user(user) for user in users],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 36 | <code>        "limit": limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 37 | <code>        "offset": offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 38 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>@router.get("/admin/users/{user_id}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 42 | <code>async def admin_get_user(</code> | 定义 Python 函数 `admin_get_user`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 43 | <code>    user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 44 | <code>    admin: AppUser = Depends(require_app_admin),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 45 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 46 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 47 | <code>    service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 48 | <code>    user = await service.get_user_by_id(user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 49 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 50 | <code>        raise HTTPException(status_code=404, detail="用户不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 51 | <code>    payments = await service.list_payments(user_id=user.id, limit=20)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 52 | <code>    period_usage = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 53 | <code>        "model": await service.count_period_usage(user.id, ["model"]),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 54 | <code>        "tts": await service.count_period_usage(user.id, ["tts"]),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 57 | <code>        "admin": admin.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 58 | <code>        "user": serialize_user(user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 59 | <code>        "usage": period_usage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 60 | <code>        "payments": [serialize_payment(payment) for payment in payments],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>@router.get("/admin/users/{user_id}/payments")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 65 | <code>async def admin_get_user_payments(</code> | 定义 Python 函数 `admin_get_user_payments`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 66 | <code>    user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 67 | <code>    limit: int = Query(default=50, ge=1, le=200),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 68 | <code>    admin: AppUser = Depends(require_app_admin),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 69 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 70 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 71 | <code>    service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 72 | <code>    user = await service.get_user_by_id(user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 73 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 74 | <code>        raise HTTPException(status_code=404, detail="用户不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 75 | <code>    payments = await service.list_payments(user_id=user.id, limit=limit)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 76 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 77 | <code>        "admin": admin.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 78 | <code>        "userId": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 79 | <code>        "payments": [serialize_payment(payment) for payment in payments],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 80 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>@router.patch("/admin/users/{user_id}/membership")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 84 | <code>async def admin_update_membership(</code> | 定义 Python 函数 `admin_update_membership`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 85 | <code>    user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 86 | <code>    payload: MembershipUpdateRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 87 | <code>    admin: AppUser = Depends(require_app_admin),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 88 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 89 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 90 | <code>    service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 91 | <code>    user = await service.set_membership(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 92 | <code>        user_id=user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 93 | <code>        status=payload.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 94 | <code>        plan=payload.plan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 95 | <code>        expires_at=payload.expiresAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 96 | <code>        admin_user_id=admin.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 97 | <code>        reason=payload.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 98 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 100 | <code>        raise HTTPException(status_code=404, detail="用户不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 101 | <code>    return {"user": serialize_user(user)}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>@router.post("/admin/users/{user_id}/membership/revoke")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 105 | <code>async def admin_revoke_membership(</code> | 定义 Python 函数 `admin_revoke_membership`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 106 | <code>    user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 107 | <code>    admin: AppUser = Depends(require_app_admin),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 108 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 109 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 110 | <code>    service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 111 | <code>    user = await service.set_membership(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 112 | <code>        user_id=user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 113 | <code>        status="revoked",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 114 | <code>        plan="manual",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 115 | <code>        expires_at=datetime.utcnow(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 116 | <code>        admin_user_id=admin.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 117 | <code>        reason="manual revoke",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 118 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 120 | <code>        raise HTTPException(status_code=404, detail="用户不存在。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 121 | <code>    return {"user": serialize_user(user)}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
