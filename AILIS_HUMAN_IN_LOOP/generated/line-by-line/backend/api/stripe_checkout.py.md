# backend/api/stripe_checkout.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。
- 文件类型：`source-code`
- 原始行数：263
- SHA-256：`80f068ed0f83116fe73f4bf35132fca75569450b79ada797c0e942a0e39dea01`
- 可运行副本：[打开源文件](../../../../source/backend/api/stripe_checkout.py)
- 依赖：`typing`、`urllib.parse`、`stripe`、`fastapi`、`pydantic`、`sqlalchemy.ext.asyncio`、`starlette.concurrency`、`backend.api.account`、`backend.core.config`、`backend.core.database`、`backend.models.db_models`、`backend.services.account_service`
- 主要符号：`CheckoutSessionRequest`、`PortalSessionRequest`、`configure_stripe`、`get_price_id`、`build_return_url`、`build_plain_return_url`、`ensure_stripe_customer`、`get_stripe_config`、`create_checkout_session`、`create_customer_portal_session`、`get_checkout_session_status`、`stripe_webhook`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from typing import Literal</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from urllib.parse import urlencode</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import stripe</code> | 导入 Python 依赖 `stripe`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from fastapi import APIRouter, Depends, HTTPException, Request</code> | 导入 Python 依赖 `fastapi`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from pydantic import BaseModel, Field</code> | 导入 Python 依赖 `pydantic`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 8 | <code>from starlette.concurrency import run_in_threadpool</code> | 导入 Python 依赖 `starlette.concurrency`，供本模块调用其类型、函数或常量。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>from backend.api.account import require_app_user</code> | 导入 Python 依赖 `backend.api.account`，供本模块调用其类型、函数或常量。 |
| 11 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 12 | <code>from backend.core.database import get_db</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 13 | <code>from backend.models.db_models import AppUser</code> | 导入 Python 依赖 `backend.models.db_models`，供本模块调用其类型、函数或常量。 |
| 14 | <code>from backend.services.account_service import AccountService, serialize_user</code> | 导入 Python 依赖 `backend.services.account_service`，供本模块调用其类型、函数或常量。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>router = APIRouter()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>class CheckoutSessionRequest(BaseModel):</code> | 定义 Python 类 `CheckoutSessionRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 20 | <code>    mode: Literal["payment", "subscription"] = "subscription"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 21 | <code>    quantity: int = Field(default=1, ge=1, le=99)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 22 | <code>    return_path: str = "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>class PortalSessionRequest(BaseModel):</code> | 定义 Python 类 `PortalSessionRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 26 | <code>    return_path: str = "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>def configure_stripe() -&gt; None:</code> | 定义 Python 函数 `configure_stripe`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 30 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 31 | <code>    if not settings.STRIPE_SECRET_KEY:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 32 | <code>        raise HTTPException(status_code=503, detail="Stripe secret key is not configured.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>    stripe.api_key = settings.STRIPE_SECRET_KEY</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>    stripe.api_version = settings.STRIPE_API_VERSION</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>def get_price_id(mode: str) -&gt; str:</code> | 定义 Python 函数 `get_price_id`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 39 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 40 | <code>    if mode == "subscription":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 41 | <code>        return settings.STRIPE_SUBSCRIPTION_PRICE_ID</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 42 | <code>    return settings.STRIPE_PAYMENT_PRICE_ID</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>def build_return_url(request: Request, return_path: str) -&gt; str:</code> | 定义 Python 函数 `build_return_url`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 46 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 47 | <code>    if settings.STRIPE_RETURN_URL:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 48 | <code>        return settings.STRIPE_RETURN_URL</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>    origin = request.headers.get("origin")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 51 | <code>    if not origin:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 52 | <code>        raise HTTPException(</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 53 | <code>            status_code=400,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 54 | <code>            detail="Missing Origin header. Set STRIPE_RETURN_URL for non-browser clients.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 55 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    normalized_path = return_path.strip() or "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 58 | <code>    if not normalized_path.startswith("/") or normalized_path.startswith("//"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 59 | <code>        normalized_path = "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    query = urlencode({"payment": "return", "session_id": "{CHECKOUT_SESSION_ID}"})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 62 | <code>    separator = "&amp;" if "?" in normalized_path else "?"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 63 | <code>    return f"{origin.rstrip('/')}{normalized_path}{separator}{query}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>def build_plain_return_url(request: Request, return_path: str) -&gt; str:</code> | 定义 Python 函数 `build_plain_return_url`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 67 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 68 | <code>    if settings.STRIPE_CUSTOMER_PORTAL_RETURN_URL:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 69 | <code>        return settings.STRIPE_CUSTOMER_PORTAL_RETURN_URL</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>    origin = request.headers.get("origin")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 72 | <code>    if not origin:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 73 | <code>        raise HTTPException(</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 74 | <code>            status_code=400,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 75 | <code>            detail="Missing Origin header. Set STRIPE_CUSTOMER_PORTAL_RETURN_URL for non-browser clients.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 76 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    normalized_path = return_path.strip() or "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 79 | <code>    if not normalized_path.startswith("/") or normalized_path.startswith("//"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 80 | <code>        normalized_path = "/"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 81 | <code>    return f"{origin.rstrip('/')}{normalized_path}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>async def ensure_stripe_customer(user: AppUser, account_service: AccountService) -&gt; str:</code> | 定义 Python 函数 `ensure_stripe_customer`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 85 | <code>    if user.stripe_customer_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 86 | <code>        return user.stripe_customer_id</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>    customer = await run_in_threadpool(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 89 | <code>        stripe.Customer.create,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 90 | <code>        email=user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 91 | <code>        name=user.display_name or user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 92 | <code>        metadata={"app_user_id": str(user.id)},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 93 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    await account_service.set_stripe_customer(user, customer.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 95 | <code>    return customer.id</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>@router.get("/stripe/config")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 99 | <code>async def get_stripe_config():</code> | 定义 Python 函数 `get_stripe_config`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 100 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 101 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>        "publishableKey": settings.STRIPE_PUBLISHABLE_KEY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 103 | <code>        "apiVersion": settings.STRIPE_API_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 104 | <code>        "automaticTaxEnabled": settings.STRIPE_AUTOMATIC_TAX_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 105 | <code>        "requiresAccount": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 106 | <code>        "oneTimeMembershipDays": settings.APP_ONE_TIME_MEMBERSHIP_DAYS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 107 | <code>        "modes": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 108 | <code>            "payment": bool(settings.STRIPE_PAYMENT_PRICE_ID),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 109 | <code>            "subscription": bool(settings.STRIPE_SUBSCRIPTION_PRICE_ID),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 110 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>        "configured": bool(settings.STRIPE_PUBLISHABLE_KEY and settings.STRIPE_SECRET_KEY),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>@router.post("/stripe/checkout-session")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 116 | <code>async def create_checkout_session(</code> | 定义 Python 函数 `create_checkout_session`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 117 | <code>    payload: CheckoutSessionRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 118 | <code>    request: Request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 119 | <code>    user: AppUser = Depends(require_app_user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 120 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 121 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 122 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 123 | <code>    configure_stripe()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 124 | <code>    account_service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>    price_id = get_price_id(payload.mode)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 127 | <code>    if not price_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 128 | <code>        raise HTTPException(status_code=503, detail=f"Stripe price ID is not configured for {payload.mode}.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    customer_id = await ensure_stripe_customer(user, account_service)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 131 | <code>    metadata = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 132 | <code>        "app_user_id": str(user.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 133 | <code>        "membership_mode": payload.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 134 | <code>        "product": "ailis_membership",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 135 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>    session_params = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 137 | <code>        "ui_mode": "elements",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 138 | <code>        "mode": payload.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 139 | <code>        "customer": customer_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 140 | <code>        "client_reference_id": str(user.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 141 | <code>        "metadata": metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 142 | <code>        "line_items": [{"price": price_id, "quantity": payload.quantity}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 143 | <code>        "return_url": build_return_url(request, payload.return_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 144 | <code>        "billing_address_collection": "auto",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 145 | <code>        "automatic_tax": {"enabled": settings.STRIPE_AUTOMATIC_TAX_ENABLED},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 146 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>    if payload.mode == "subscription":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 148 | <code>        session_params["subscription_data"] = {"metadata": metadata}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 149 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 150 | <code>        session_params["payment_intent_data"] = {"metadata": metadata}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 153 | <code>        session = await run_in_threadpool(stripe.checkout.Session.create, **session_params)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 154 | <code>    except stripe.error.StripeError as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 155 | <code>        message = getattr(error, "user_message", None) or str(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 156 | <code>        raise HTTPException(status_code=400, detail=message) from error</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    await account_service.record_checkout_session(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 159 | <code>        user_id=user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 160 | <code>        stripe_session_id=session.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 161 | <code>        stripe_customer_id=customer_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 162 | <code>        mode=payload.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 163 | <code>        status=session.status or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 164 | <code>        payment_status=session.payment_status or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 165 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 168 | <code>        "id": session.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 169 | <code>        "clientSecret": session.client_secret,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 170 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>@router.post("/stripe/customer-portal")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 174 | <code>async def create_customer_portal_session(</code> | 定义 Python 函数 `create_customer_portal_session`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 175 | <code>    payload: PortalSessionRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 176 | <code>    request: Request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 177 | <code>    user: AppUser = Depends(require_app_user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 178 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 179 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 180 | <code>    configure_stripe()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 181 | <code>    account_service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 182 | <code>    customer_id = await ensure_stripe_customer(user, account_service)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 185 | <code>        portal_session = await run_in_threadpool(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 186 | <code>            stripe.billing_portal.Session.create,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 187 | <code>            customer=customer_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 188 | <code>            return_url=build_plain_return_url(request, payload.return_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 189 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    except stripe.error.StripeError as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 191 | <code>        message = getattr(error, "user_message", None) or str(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 192 | <code>        raise HTTPException(status_code=400, detail=message) from error</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>    return {"url": portal_session.url}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>@router.get("/stripe/session-status")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 198 | <code>async def get_checkout_session_status(</code> | 定义 Python 函数 `get_checkout_session_status`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 199 | <code>    session_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 200 | <code>    user: AppUser = Depends(require_app_user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 201 | <code>    db: AsyncSession = Depends(get_db),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 202 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 203 | <code>    configure_stripe()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 204 | <code>    account_service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 207 | <code>        session = await run_in_threadpool(stripe.checkout.Session.retrieve, session_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 208 | <code>    except stripe.error.StripeError as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 209 | <code>        message = getattr(error, "user_message", None) or str(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 210 | <code>        raise HTTPException(status_code=400, detail=message) from error</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>    metadata = getattr(session, "metadata", None) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 213 | <code>    session_user_id = metadata.get("app_user_id") or getattr(session, "client_reference_id", None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 214 | <code>    if str(session_user_id or "") != str(user.id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 215 | <code>        raise HTTPException(status_code=403, detail="这个支付会话不属于当前账号。")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>    updated_user = await account_service.activate_membership_from_checkout(session)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 220 | <code>        "id": session.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 221 | <code>        "mode": session.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 222 | <code>        "status": session.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 223 | <code>        "paymentStatus": session.payment_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 224 | <code>        "customerEmail": session.customer_details.email if session.customer_details else None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 225 | <code>        "user": serialize_user(updated_user or user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 226 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>@router.post("/stripe/webhook")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 230 | <code>async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):</code> | 定义 Python 函数 `stripe_webhook`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 231 | <code>    settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 232 | <code>    if not settings.STRIPE_WEBHOOK_SECRET:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 233 | <code>        raise HTTPException(status_code=503, detail="Stripe webhook secret is not configured.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>    configure_stripe()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 236 | <code>    payload = await request.body()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 237 | <code>    signature = request.headers.get("stripe-signature", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 238 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 239 | <code>        event = stripe.Webhook.construct_event(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 240 | <code>            payload=payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 241 | <code>            sig_header=signature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 242 | <code>            secret=settings.STRIPE_WEBHOOK_SECRET,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 243 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>    except ValueError as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 245 | <code>        raise HTTPException(status_code=400, detail="Invalid Stripe webhook payload.") from error</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 246 | <code>    except stripe.error.SignatureVerificationError as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 247 | <code>        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.") from error</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>    account_service = AccountService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 250 | <code>    event_type = event["type"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 251 | <code>    data_object = event["data"]["object"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>    if event_type == "checkout.session.completed":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 254 | <code>        await account_service.activate_membership_from_checkout(data_object)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 255 | <code>    elif event_type in {"customer.subscription.updated", "customer.subscription.deleted"}:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 256 | <code>        await account_service.update_subscription_membership(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 257 | <code>            stripe_customer_id=str(data_object.get("customer") or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 258 | <code>            stripe_subscription_id=str(data_object.get("id") or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 259 | <code>            status=str(data_object.get("status") or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 260 | <code>            current_period_end=data_object.get("current_period_end"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 261 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>    return {"received": True}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
