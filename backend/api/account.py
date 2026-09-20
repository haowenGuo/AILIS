from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
import uuid
from datetime import timedelta
from urllib.parse import quote
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.db_models import AppUser
from backend.services.account_service import (
    AccountService,
    current_period_key,
    has_active_membership,
    serialize_session,
    serialize_user,
    verify_password,
)
from backend.services.email_service import EmailDeliveryError, EmailService

settings = get_settings()
router = APIRouter()


class AccountRegisterRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    displayName: str = Field(default="", max_length=120)


class AccountLoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class AccountProfileRequest(BaseModel):
    displayName: str = Field(default="", max_length=120)


class AccountPasswordRequest(BaseModel):
    currentPassword: str = Field(..., min_length=1, max_length=128)
    newPassword: str = Field(..., min_length=8, max_length=128)


class AccountTokenRequest(BaseModel):
    token: str = Field(..., min_length=20, max_length=256)


class PasswordResetRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)


class PasswordResetConfirmRequest(AccountTokenRequest):
    newPassword: str = Field(..., min_length=8, max_length=128)


def _cookie_samesite() -> str:
    value = (settings.APP_SESSION_COOKIE_SAMESITE or "lax").strip().lower()
    return value if value in {"lax", "strict", "none"} else "lax"


def set_session_cookie(response: Response, token: str, expires_at) -> None:
    cookie_args = {
        "key": settings.APP_SESSION_COOKIE_NAME,
        "value": token,
        "httponly": True,
        "secure": settings.APP_SESSION_COOKIE_SECURE,
        "samesite": _cookie_samesite(),
        "path": "/",
        "expires": expires_at,
    }
    if settings.APP_SESSION_COOKIE_DOMAIN:
        cookie_args["domain"] = settings.APP_SESSION_COOKIE_DOMAIN
    response.set_cookie(**cookie_args)


def clear_session_cookie(response: Response) -> None:
    cookie_args = {
        "key": settings.APP_SESSION_COOKIE_NAME,
        "path": "/",
        "httponly": True,
        "secure": settings.APP_SESSION_COOKIE_SECURE,
        "samesite": _cookie_samesite(),
    }
    if settings.APP_SESSION_COOKIE_DOMAIN:
        cookie_args["domain"] = settings.APP_SESSION_COOKIE_DOMAIN
    response.delete_cookie(**cookie_args)
    response.delete_cookie(
        key=settings.APP_CSRF_COOKIE_NAME,
        path="/",
        secure=settings.APP_SESSION_COOKIE_SECURE,
        samesite=_cookie_samesite(),
    )


def set_csrf_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.APP_CSRF_COOKIE_NAME,
        value=token,
        httponly=False,
        secure=settings.APP_SESSION_COOKIE_SECURE,
        samesite=_cookie_samesite(),
        path="/",
    )


def _extract_bearer_token(request: Request) -> str | None:
    auth_header = request.headers.get("authorization") or ""
    if auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return request.cookies.get(settings.APP_SESSION_COOKIE_NAME)


async def get_account_service(db: AsyncSession = Depends(get_db)) -> AccountService:
    return AccountService(db)


async def get_current_app_user(
    request: Request,
    service: AccountService = Depends(get_account_service),
) -> AppUser | None:
    session = await service.get_session_user(_extract_bearer_token(request))
    return session["user"] if session else None


async def get_current_app_session(
    request: Request,
    service: AccountService = Depends(get_account_service),
) -> dict | None:
    return await service.get_session_user(_extract_bearer_token(request))


async def require_csrf(
    request: Request,
    service: AccountService = Depends(get_account_service),
) -> None:
    """只保护 Cookie 会话的写操作；Bearer 客户端已经具备显式授权头。"""
    session_token = request.cookies.get(settings.APP_SESSION_COOKIE_NAME)
    # 没有 Cookie 会话时，可能是 Bearer 客户端，交给显式 Authorization 认证。
    if not session_token:
        return
    # 旧会话没有 CSRF 元数据时不能继续放行写操作；重新登录会生成新 CSRF Cookie。
    if not request.cookies.get(settings.APP_CSRF_COOKIE_NAME):
        raise HTTPException(status_code=403, detail="会话需要刷新，请重新登录后重试。")
    csrf_token = request.headers.get("x-csrf-token")
    if not await service.validate_csrf(session_token, csrf_token):
        raise HTTPException(status_code=403, detail="CSRF 校验失败，请刷新页面后重试。")


async def require_app_user(user: AppUser | None = Depends(get_current_app_user)) -> AppUser:
    if not user:
        raise HTTPException(status_code=401, detail="请先登录账号。")
    return user


async def require_ai_api_member(
    user: AppUser | None = Depends(get_current_app_user),
) -> AppUser | None:
    if not settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS:
        return user
    if not user:
        raise HTTPException(status_code=401, detail="请先登录账号后使用模型和语音服务。")
    if not has_active_membership(user):
        raise HTTPException(status_code=402, detail="当前账号还不是会员，请完成付款后使用模型和语音服务。")
    return user


async def require_app_admin(user: AppUser = Depends(require_app_user)) -> AppUser:
    admin_emails = settings.get_app_admin_emails()
    if not admin_emails or user.email.lower() not in admin_emails:
        raise HTTPException(status_code=403, detail="当前账号没有后台管理权限。")
    return user


async def _require_member_with_usage(
    endpoint: str,
    monthly_limit: int,
    token_cost: int,
    user: AppUser | None,
    service: AccountService,
) -> AppUser | None:
    if not settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS and not settings.APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS:
        if user:
            await service.record_api_usage(user_id=user.id, endpoint=endpoint)
        return user
    if not user:
        raise HTTPException(status_code=401, detail="请先登录账号后使用模型和语音服务。")
    if settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS and not has_active_membership(user):
        raise HTTPException(status_code=402, detail="当前账号还不是会员，请完成付款后使用模型和语音服务。")

    result = await service.authorize_api_request(
        user_id=user.id,
        endpoint=endpoint,
        monthly_limit=int(monthly_limit or 0),
        token_cost=int(token_cost or 0) if settings.APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS else 0,
        reference_id=uuid.uuid4().hex,
    )
    if result == "quota":
        raise HTTPException(status_code=429, detail=f"本月 {endpoint} 用量已达上限。")
    if result == "balance":
        raise HTTPException(status_code=402, detail="Token 余额不足，请先充值。")
    if result == "missing":
        raise HTTPException(status_code=401, detail="账号不存在或已被删除。")
    return user


async def require_model_api_member(
    user: AppUser | None = Depends(get_current_app_user),
    service: AccountService = Depends(get_account_service),
) -> AppUser | None:
    return await _require_member_with_usage(
        endpoint="model",
        monthly_limit=settings.APP_MONTHLY_MODEL_CALL_LIMIT,
        token_cost=settings.APP_MODEL_API_TOKEN_COST,
        user=user,
        service=service,
    )


async def require_tts_api_member(
    user: AppUser | None = Depends(get_current_app_user),
    service: AccountService = Depends(get_account_service),
) -> AppUser | None:
    return await _require_member_with_usage(
        endpoint="tts",
        monthly_limit=settings.APP_MONTHLY_TTS_CALL_LIMIT,
        token_cost=settings.APP_TTS_API_TOKEN_COST,
        user=user,
        service=service,
    )


async def serialize_current_user_with_usage(
    user: AppUser,
    service: AccountService,
) -> dict:
    payload = serialize_user(user)
    period = current_period_key()
    payload["usage"] = {
        "period": period,
        "model": {
            "used": await service.count_period_usage(user.id, ["model"], period),
            "limit": settings.APP_MONTHLY_MODEL_CALL_LIMIT,
        },
        "tts": {
            "used": await service.count_period_usage(user.id, ["tts"], period),
            "limit": settings.APP_MONTHLY_TTS_CALL_LIMIT,
        },
    }
    payload["tokens"] = {
        "balance": await service.get_token_balance(user.id),
        "unit": "token",
    }
    return payload


@router.get("/account/status")
async def account_status():
    return {
        "authEnabled": True,
        "sessionCookieName": settings.APP_SESSION_COOKIE_NAME,
        "sessionCookieSameSite": _cookie_samesite(),
        "sessionCookieSecure": settings.APP_SESSION_COOKIE_SECURE,
        "membershipRequiredForAiApis": settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS,
        "tokenBalanceRequiredForAiApis": settings.APP_REQUIRE_TOKEN_BALANCE_FOR_AI_APIS,
        "modelApiTokenCost": settings.APP_MODEL_API_TOKEN_COST,
        "ttsApiTokenCost": settings.APP_TTS_API_TOKEN_COST,
        "oneTimeMembershipDays": settings.APP_ONE_TIME_MEMBERSHIP_DAYS,
        "monthlyModelCallLimit": settings.APP_MONTHLY_MODEL_CALL_LIMIT,
        "monthlyTtsCallLimit": settings.APP_MONTHLY_TTS_CALL_LIMIT,
    }


@router.get("/account/me")
async def account_me(
    user: AppUser | None = Depends(get_current_app_user),
    service: AccountService = Depends(get_account_service),
):
    return {"user": await serialize_current_user_with_usage(user, service) if user else None}


@router.post("/account/register")
async def account_register(
    payload: AccountRegisterRequest,
    response: Response,
    request: Request,
    service: AccountService = Depends(get_account_service),
):
    email = payload.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="请输入有效邮箱。")
    if await service.get_user_by_email(email):
        raise HTTPException(status_code=409, detail="这个邮箱已经注册，请直接登录。")

    try:
        user = await service.create_user(
            email=email,
            password=payload.password,
            display_name=payload.displayName,
        )
    except IntegrityError as exc:
        await service.db.rollback()
        raise HTTPException(status_code=409, detail="这个邮箱已经注册，请直接登录。") from exc
    session = await service.create_session(
        user.id,
        user_agent=request.headers.get("user-agent", ""),
        ip_address=request.client.host if request.client else "",
    )
    set_session_cookie(response, session["token"], session["expiresAt"])
    set_csrf_cookie(response, session["csrfToken"])
    return {
        "token": session["token"],
        "expiresAt": session["expiresAt"].isoformat(),
        "user": await serialize_current_user_with_usage(user, service),
    }


@router.post("/account/login")
async def account_login(
    payload: AccountLoginRequest,
    response: Response,
    request: Request,
    service: AccountService = Depends(get_account_service),
):
    ip_address = request.client.host if request.client else ""
    blocked_seconds = await service.is_login_blocked(payload.email, ip_address)
    if blocked_seconds:
        raise HTTPException(status_code=429, detail="登录失败次数过多，请稍后再试。")

    user = await service.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        await service.record_login_failure(payload.email, ip_address)
        raise HTTPException(status_code=401, detail="邮箱或密码不正确。")

    await service.clear_login_failures(payload.email, ip_address)
    session = await service.create_session(
        user.id,
        user_agent=request.headers.get("user-agent", ""),
        ip_address=ip_address,
    )
    set_session_cookie(response, session["token"], session["expiresAt"])
    set_csrf_cookie(response, session["csrfToken"])
    return {
        "token": session["token"],
        "expiresAt": session["expiresAt"].isoformat(),
        "user": await serialize_current_user_with_usage(user, service),
    }


@router.post("/account/logout")
async def account_logout(
    request: Request,
    response: Response,
    service: AccountService = Depends(get_account_service),
    _csrf: None = Depends(require_csrf),
):
    await service.delete_session(_extract_bearer_token(request))
    clear_session_cookie(response)
    return {"loggedOut": True}


@router.post("/account/email-verification/request")
async def account_email_verification_request(
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
):
    security = await service.ensure_user_security(user.id)
    if security.email_verified_at:
        return {"sent": False, "verified": True}
    email_service = EmailService()
    if not email_service.ready or not settings.APP_EMAIL_PUBLIC_BASE_URL:
        raise HTTPException(status_code=503, detail="账户邮件服务尚未配置。")
    raw_token = await service.issue_account_token(
        user.id,
        "email_verification",
        timedelta(hours=max(int(settings.APP_EMAIL_VERIFICATION_TTL_HOURS or 24), 1)),
    )
    link = f"{settings.APP_EMAIL_PUBLIC_BASE_URL.rstrip('/')}/verify-email?token={quote(raw_token)}"
    try:
        await email_service.send(
            recipient=user.email,
            subject="验证你的 AILIS 邮箱",
            text=f"请打开以下链接完成邮箱验证：\n\n{link}\n\n链接将在 {settings.APP_EMAIL_VERIFICATION_TTL_HOURS} 小时后失效。",
        )
    except EmailDeliveryError as exc:
        raise HTTPException(status_code=503, detail="账户邮件暂时发送失败，请稍后重试。") from exc
    return {"sent": True, "verified": False}


@router.post("/account/email-verification/confirm")
async def account_email_verification_confirm(
    payload: AccountTokenRequest,
    service: AccountService = Depends(get_account_service),
):
    token = await service.consume_account_token(payload.token, "email_verification")
    if not token:
        raise HTTPException(status_code=400, detail="邮箱验证链接无效或已过期。")
    await service.mark_email_verified(token.user_id)
    return {"verified": True}


@router.post("/account/password-reset/request")
async def account_password_reset_request(
    payload: PasswordResetRequest,
    service: AccountService = Depends(get_account_service),
):
    # 无论邮箱是否存在都返回相同结果，避免账户枚举。
    user = await service.get_user_by_email(payload.email)
    email_service = EmailService()
    if user and email_service.ready and settings.APP_EMAIL_PUBLIC_BASE_URL:
        raw_token = await service.issue_account_token(
            user.id,
            "password_reset",
            timedelta(minutes=max(int(settings.APP_PASSWORD_RESET_TTL_MINUTES or 30), 1)),
        )
        link = f"{settings.APP_EMAIL_PUBLIC_BASE_URL.rstrip('/')}/reset-password?token={quote(raw_token)}"
        try:
            await email_service.send(
                recipient=user.email,
                subject="重置你的 AILIS 密码",
                text=f"请打开以下链接设置新密码：\n\n{link}\n\n链接将在 {settings.APP_PASSWORD_RESET_TTL_MINUTES} 分钟后失效。",
            )
        except EmailDeliveryError:
            pass
    return {"accepted": True}


@router.post("/account/password-reset/confirm")
async def account_password_reset_confirm(
    payload: PasswordResetConfirmRequest,
    service: AccountService = Depends(get_account_service),
):
    if not await service.reset_password_with_token(payload.token, payload.newPassword):
        raise HTTPException(status_code=400, detail="密码重置链接无效或已过期。")
    return {"reset": True}


@router.patch("/account/me")
async def account_update_profile(
    payload: AccountProfileRequest,
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
    _csrf: None = Depends(require_csrf),
):
    updated = await service.update_profile(user.id, payload.displayName)
    return {"user": await serialize_current_user_with_usage(updated, service)}


@router.post("/account/password")
async def account_change_password(
    payload: AccountPasswordRequest,
    request: Request,
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
    _csrf: None = Depends(require_csrf),
):
    if not await service.change_password(user.id, payload.currentPassword, payload.newPassword):
        raise HTTPException(status_code=400, detail="当前密码不正确。")
    session_record = await service.get_session_user(_extract_bearer_token(request))
    current_session_id = session_record["session"].id if session_record else None
    revoked = await service.revoke_other_sessions(user.id, current_session_id)
    return {"changed": True, "revokedSessions": revoked}


@router.get("/account/sessions")
async def account_sessions(
    request: Request,
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
):
    current = await service.get_session_user(_extract_bearer_token(request))
    current_id = current["session"].id if current else None
    sessions = await service.list_sessions(user.id)
    return {"sessions": [serialize_session(item, meta, item.id == current_id) for item, meta in sessions]}


@router.delete("/account/sessions/{session_id}")
async def account_revoke_session(
    session_id: int,
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
    _csrf: None = Depends(require_csrf),
):
    if not await service.revoke_session(user.id, session_id):
        raise HTTPException(status_code=404, detail="会话不存在。")
    return {"revoked": True, "sessionId": session_id}


@router.post("/account/sessions/revoke-others")
async def account_revoke_other_sessions(
    request: Request,
    user: AppUser = Depends(require_app_user),
    service: AccountService = Depends(get_account_service),
    _csrf: None = Depends(require_csrf),
):
    current = await service.get_session_user(_extract_bearer_token(request))
    current_id = current["session"].id if current else None
    revoked = await service.revoke_other_sessions(user.id, current_id)
    return {"revoked": revoked}
