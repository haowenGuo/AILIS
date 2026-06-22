from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.db_models import AppUser
from backend.services.account_service import (
    AccountService,
    current_period_key,
    has_active_membership,
    serialize_user,
    verify_password,
)

settings = get_settings()
router = APIRouter()


class AccountRegisterRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    displayName: str = Field(default="", max_length=120)


class AccountLoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


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
    user: AppUser | None,
    service: AccountService,
) -> AppUser | None:
    if not settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS:
        if user:
            await service.record_api_usage(user_id=user.id, endpoint=endpoint)
        return user
    if not user:
        raise HTTPException(status_code=401, detail="请先登录账号后使用模型和语音服务。")
    if not has_active_membership(user):
        raise HTTPException(status_code=402, detail="当前账号还不是会员，请完成付款后使用模型和语音服务。")

    limit = int(monthly_limit or 0)
    if limit > 0:
        used = await service.count_period_usage(user.id, [endpoint])
        if used >= limit:
            raise HTTPException(status_code=429, detail=f"本月 {endpoint} 用量已达上限。")

    await service.record_api_usage(user_id=user.id, endpoint=endpoint)
    return user


async def require_model_api_member(
    user: AppUser | None = Depends(get_current_app_user),
    service: AccountService = Depends(get_account_service),
) -> AppUser | None:
    return await _require_member_with_usage(
        endpoint="model",
        monthly_limit=settings.APP_MONTHLY_MODEL_CALL_LIMIT,
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
    return payload


@router.get("/account/status")
async def account_status():
    return {
        "authEnabled": True,
        "sessionCookieName": settings.APP_SESSION_COOKIE_NAME,
        "sessionCookieSameSite": _cookie_samesite(),
        "sessionCookieSecure": settings.APP_SESSION_COOKIE_SECURE,
        "membershipRequiredForAiApis": settings.APP_REQUIRE_MEMBERSHIP_FOR_AI_APIS,
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
    service: AccountService = Depends(get_account_service),
):
    email = payload.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="请输入有效邮箱。")
    if await service.get_user_by_email(email):
        raise HTTPException(status_code=409, detail="这个邮箱已经注册，请直接登录。")

    user = await service.create_user(
        email=email,
        password=payload.password,
        display_name=payload.displayName,
    )
    session = await service.create_session(user.id)
    set_session_cookie(response, session["token"], session["expiresAt"])
    return {
        "token": session["token"],
        "expiresAt": session["expiresAt"].isoformat(),
        "user": await serialize_current_user_with_usage(user, service),
    }


@router.post("/account/login")
async def account_login(
    payload: AccountLoginRequest,
    response: Response,
    service: AccountService = Depends(get_account_service),
):
    user = await service.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="邮箱或密码不正确。")

    session = await service.create_session(user.id)
    set_session_cookie(response, session["token"], session["expiresAt"])
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
):
    await service.delete_session(_extract_bearer_token(request))
    clear_session_cookie(response)
    return {"loggedOut": True}
