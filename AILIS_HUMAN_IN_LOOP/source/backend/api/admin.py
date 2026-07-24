from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.account import require_app_admin
from backend.core.database import get_db
from backend.models.db_models import AppUser
from backend.services.account_service import AccountService, serialize_payment, serialize_user

router = APIRouter()


class MembershipUpdateRequest(BaseModel):
    status: Literal["free", "active", "trialing", "past_due", "canceled", "revoked"] = "active"
    plan: str = Field(default="manual", max_length=32)
    expiresAt: datetime | None = None
    reason: str = Field(default="", max_length=500)


@router.get("/admin/users")
async def admin_list_users(
    query: str = "",
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    admin: AppUser = Depends(require_app_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AccountService(db)
    users = await service.list_users(query=query, limit=limit, offset=offset)
    return {
        "admin": admin.email,
        "users": [serialize_user(user) for user in users],
        "limit": limit,
        "offset": offset,
    }


@router.get("/admin/users/{user_id}")
async def admin_get_user(
    user_id: int,
    admin: AppUser = Depends(require_app_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AccountService(db)
    user = await service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在。")
    payments = await service.list_payments(user_id=user.id, limit=20)
    period_usage = {
        "model": await service.count_period_usage(user.id, ["model"]),
        "tts": await service.count_period_usage(user.id, ["tts"]),
    }
    return {
        "admin": admin.email,
        "user": serialize_user(user),
        "usage": period_usage,
        "payments": [serialize_payment(payment) for payment in payments],
    }


@router.get("/admin/users/{user_id}/payments")
async def admin_get_user_payments(
    user_id: int,
    limit: int = Query(default=50, ge=1, le=200),
    admin: AppUser = Depends(require_app_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AccountService(db)
    user = await service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在。")
    payments = await service.list_payments(user_id=user.id, limit=limit)
    return {
        "admin": admin.email,
        "userId": user.id,
        "payments": [serialize_payment(payment) for payment in payments],
    }


@router.patch("/admin/users/{user_id}/membership")
async def admin_update_membership(
    user_id: int,
    payload: MembershipUpdateRequest,
    admin: AppUser = Depends(require_app_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AccountService(db)
    user = await service.set_membership(
        user_id=user_id,
        status=payload.status,
        plan=payload.plan,
        expires_at=payload.expiresAt,
        admin_user_id=admin.id,
        reason=payload.reason,
    )
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在。")
    return {"user": serialize_user(user)}


@router.post("/admin/users/{user_id}/membership/revoke")
async def admin_revoke_membership(
    user_id: int,
    admin: AppUser = Depends(require_app_admin),
    db: AsyncSession = Depends(get_db),
):
    service = AccountService(db)
    user = await service.set_membership(
        user_id=user_id,
        status="revoked",
        plan="manual",
        expires_at=datetime.utcnow(),
        admin_user_id=admin.id,
        reason="manual revoke",
    )
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在。")
    return {"user": serialize_user(user)}
