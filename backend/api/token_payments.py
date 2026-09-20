"""国内会员订阅的最小边界。

会员计划由服务端配置，用户扫码购买一个会员周期，验签后的支付回调
完成额度入账。当前为手动续费，不包含钱包签约或自动周期扣款。
"""

import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.account import require_app_user
from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.db_models import AppUser
from backend.services.account_service import (
    AccountService,
    serialize_payment_order,
    serialize_subscription,
    serialize_token_ledger,
)
from backend.services.payment_providers import (
    PaymentOrderRequest,
    PaymentProviderError,
    create_payment_provider,
    provider_ready,
)

router = APIRouter()
settings = get_settings()


class CreateSubscriptionOrderRequest(BaseModel):
    provider: Literal["wechat", "alipay"]
    planId: str | None = Field(default=None, min_length=1, max_length=64)
    # 兼容已经打开过旧账户页的浏览器缓存；新页面只发送 planId。
    packageId: str | None = Field(default=None, min_length=1, max_length=64)

    @property
    def selected_plan_id(self) -> str:
        return (self.planId or self.packageId or "").strip()


def _membership_plans() -> list[dict]:
    """只从服务端读取会员计划，避免客户端篡改价格或周期额度。

    APP_TOKEN_PACKAGES_JSON 只作为旧部署的兼容回退，不再是新的对外语义。
    """
    try:
        raw = json.loads(
            settings.APP_MEMBERSHIP_PLANS_JSON
            or settings.APP_TOKEN_PACKAGES_JSON
            or "[]"
        )
    except (TypeError, ValueError):
        return []
    if not isinstance(raw, list):
        return []

    plans = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        plan_id = str(item.get("id") or item.get("planId") or "").strip()
        title = str(item.get("title") or plan_id).strip()
        try:
            period_tokens = int(
                item.get("monthlyTokens")
                or item.get("periodTokens")
                or item.get("tokens")
                or 0
            )
            amount_fen = int(item.get("amountFen") or 0)
        except (TypeError, ValueError):
            continue
        if not plan_id or period_tokens <= 0 or amount_fen <= 0:
            continue
        plans.append({
            "id": plan_id,
            "title": title,
            "monthlyTokens": period_tokens,
            "periodTokens": period_tokens,
            "amountFen": amount_fen,
            "interval": str(item.get("interval") or "month").strip().lower(),
            "currency": settings.APP_PAYMENT_CURRENCY,
        })
    return plans


def _provider_config(provider: str, enabled: bool, notify_path: str) -> dict:
    ready = bool(enabled and provider_ready(provider))
    return {
        "id": provider,
        "enabled": bool(enabled),
        "ready": ready,
        "status": "ready" if ready else ("disabled" if not enabled else "config_incomplete"),
        "notifyPath": notify_path,
    }


def _notify_url(path: str) -> str:
    base = settings.APP_PUBLIC_BASE_URL.rstrip("/")
    if not base:
        raise PaymentProviderError("APP_PUBLIC_BASE_URL 未配置")
    return f"{base}/{path.lstrip('/')}"


@router.get("/payments/config")
async def payment_config():
    """返回前端需要的订阅计划、通道和当前接入状态，不暴露任何密钥。"""
    plans = _membership_plans()
    return {
        "currency": settings.APP_PAYMENT_CURRENCY,
        "billing": "subscription",
        "providers": {
            "wechat": _provider_config(
                "wechat",
                settings.APP_WECHAT_PAY_ENABLED,
                settings.APP_WECHAT_PAY_NOTIFY_PATH,
            ),
            "alipay": _provider_config(
                "alipay",
                settings.APP_ALIPAY_ENABLED,
                settings.APP_ALIPAY_NOTIFY_PATH,
            ),
        },
        "plans": plans,
        # 兼容旧客户端；新客户端不再读取 packages。
        "packages": [
            {**plan, "tokens": plan["periodTokens"]}
            for plan in plans
        ],
    }


@router.get("/tokens/balance")
async def token_balance(
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    balance = await AccountService(db).get_token_balance(user.id)
    return {"balance": balance, "unit": "token"}


@router.get("/tokens/ledger")
async def token_ledger(
    limit: int = Query(default=50, ge=1, le=200),
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    entries = await AccountService(db).list_token_ledger(user.id, limit=limit)
    return {"entries": [serialize_token_ledger(entry) for entry in entries]}


@router.get("/payments/orders")
async def payment_orders(
    limit: int = Query(default=50, ge=1, le=200),
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    orders = await AccountService(db).list_payment_orders(user.id, limit=limit)
    return {"orders": [serialize_payment_order(order) for order in orders]}


@router.get("/payments/qrcode")
async def payment_qrcode(
    data: str = Query(..., min_length=1, max_length=4096),
    _user: AppUser = Depends(require_app_user),
):
    """把支付适配器返回的二维码内容渲染成同源 SVG。

    二维码内容来自服务端支付适配器，前端只拿到当前登录用户可见的 SVG，
    不需要把二维码内容交给第三方图片服务，也不会泄露订单信息。
    """
    try:
        import qrcode
        from qrcode.image.svg import SvgPathImage

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=8,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        image = qr.make_image(image_factory=SvgPathImage)
        svg = image.to_string(encoding="unicode")
    except Exception as exc:
        raise HTTPException(status_code=503, detail="二维码服务暂不可用。") from exc
    return Response(
        content=svg,
        media_type="image/svg+xml",
        headers={"Cache-Control": "private, no-store"},
    )


@router.get("/payments/subscription")
async def current_subscription(
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    subscription = await AccountService(db).get_current_subscription(user.id)
    return {"subscription": serialize_subscription(subscription) if subscription else None}


@router.post("/payments/orders")
async def create_subscription_order(
    payload: CreateSubscriptionOrderRequest,
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    """创建国内会员订阅订单，并返回二维码内容给前端展示。"""
    plan = next((item for item in _membership_plans() if item["id"] == payload.selected_plan_id), None)
    if not plan:
        raise HTTPException(status_code=503, detail="会员计划尚未配置。")

    enabled = settings.APP_WECHAT_PAY_ENABLED if payload.provider == "wechat" else settings.APP_ALIPAY_ENABLED
    if not enabled:
        raise HTTPException(status_code=503, detail=f"{payload.provider} 支付通道尚未配置。")
    if not provider_ready(payload.provider):
        raise HTTPException(status_code=503, detail=f"{payload.provider} 支付通道参数尚未配置完整。")

    # Native 支付订单号最多 32 字符；保留完整 UUID 的随机位。
    order_no = uuid.uuid4().hex.upper()
    service = AccountService(db)
    order = await service.create_payment_order(
        user_id=user.id,
        order_no=order_no,
        provider=payload.provider,
        package_id=plan["id"],
        amount_fen=plan["amountFen"],
        token_amount=plan["periodTokens"],
    )
    try:
        provider = create_payment_provider(payload.provider)
        result = await provider.create_order(PaymentOrderRequest(
            order_no=order.order_no,
            title=f"AILIS {plan['title']}",
            amount_fen=plan["amountFen"],
            notify_url=_notify_url(
                settings.APP_WECHAT_PAY_NOTIFY_PATH
                if payload.provider == "wechat"
                else settings.APP_ALIPAY_NOTIFY_PATH
            ),
        ))
        await service.mark_payment_order_pending(order.order_no, result.provider_trade_id)
    except (PaymentProviderError, ValueError) as exc:
        await service.mark_payment_order_failed(order.order_no, str(exc))
        raise HTTPException(status_code=502, detail=f"{payload.provider} 下单失败，请稍后重试。") from exc

    return {
        "orderNo": order.order_no,
        "provider": result.provider,
        "status": result.status,
        "qrCode": result.qr_code or None,
        "checkoutUrl": result.checkout_url or None,
        "expiresAt": (datetime.now(timezone.utc) + timedelta(
            minutes=max(int(settings.APP_PAYMENT_ORDER_TTL_MINUTES or 30), 1)
        )).isoformat(),
    }


@router.post("/payments/{provider}/notify")
async def payment_notify(
    provider: Literal["wechat", "alipay"],
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """验签并解密支付回调，再在数据库事务中幂等发放 Token。"""
    enabled = settings.APP_WECHAT_PAY_ENABLED if provider == "wechat" else settings.APP_ALIPAY_ENABLED
    if not enabled or not provider_ready(provider):
        raise HTTPException(status_code=503, detail="支付通道当前未启用。")
    raw_body = await request.body()
    try:
        event = create_payment_provider(provider).parse_notification(
            raw_body,
            dict(request.headers),
        )
    except PaymentProviderError as exc:
        raise HTTPException(status_code=400, detail="支付回调验签或解密失败。") from exc

    if not event.order_no:
        raise HTTPException(status_code=400, detail="支付回调缺少订单号。")
    if event.status != "paid":
        return _payment_acknowledgement(provider)
    if not event.provider_trade_id:
        raise HTTPException(status_code=400, detail="支付回调缺少平台交易号。")

    try:
        order = await AccountService(db).credit_paid_order(
            order_no=event.order_no,
            provider_trade_id=event.provider_trade_id,
            provider_subscription_id=event.provider_subscription_id,
            expected_provider=provider,
            expected_amount_fen=event.amount_fen,
            notify_payload=raw_body.decode("utf-8", errors="replace"),
        )
        if not order:
            raise HTTPException(status_code=400, detail="支付订单不存在。")
        return _payment_acknowledgement(provider)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="支付订单校验失败。") from exc


def _payment_acknowledgement(provider: str) -> Response:
    if provider == "alipay":
        return Response(content="success", media_type="text/plain")
    return Response(status_code=204)
