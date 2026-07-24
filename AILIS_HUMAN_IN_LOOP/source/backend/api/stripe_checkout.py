from typing import Literal
from urllib.parse import urlencode

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from backend.api.account import require_app_user
from backend.core.config import get_settings
from backend.core.database import get_db
from backend.models.db_models import AppUser
from backend.services.account_service import AccountService, serialize_user

router = APIRouter()


class CheckoutSessionRequest(BaseModel):
    mode: Literal["payment", "subscription"] = "subscription"
    quantity: int = Field(default=1, ge=1, le=99)
    return_path: str = "/"


class PortalSessionRequest(BaseModel):
    return_path: str = "/"


def configure_stripe() -> None:
    settings = get_settings()
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Stripe secret key is not configured.")

    stripe.api_key = settings.STRIPE_SECRET_KEY
    stripe.api_version = settings.STRIPE_API_VERSION


def get_price_id(mode: str) -> str:
    settings = get_settings()
    if mode == "subscription":
        return settings.STRIPE_SUBSCRIPTION_PRICE_ID
    return settings.STRIPE_PAYMENT_PRICE_ID


def build_return_url(request: Request, return_path: str) -> str:
    settings = get_settings()
    if settings.STRIPE_RETURN_URL:
        return settings.STRIPE_RETURN_URL

    origin = request.headers.get("origin")
    if not origin:
        raise HTTPException(
            status_code=400,
            detail="Missing Origin header. Set STRIPE_RETURN_URL for non-browser clients.",
        )

    normalized_path = return_path.strip() or "/"
    if not normalized_path.startswith("/") or normalized_path.startswith("//"):
        normalized_path = "/"

    query = urlencode({"payment": "return", "session_id": "{CHECKOUT_SESSION_ID}"})
    separator = "&" if "?" in normalized_path else "?"
    return f"{origin.rstrip('/')}{normalized_path}{separator}{query}"


def build_plain_return_url(request: Request, return_path: str) -> str:
    settings = get_settings()
    if settings.STRIPE_CUSTOMER_PORTAL_RETURN_URL:
        return settings.STRIPE_CUSTOMER_PORTAL_RETURN_URL

    origin = request.headers.get("origin")
    if not origin:
        raise HTTPException(
            status_code=400,
            detail="Missing Origin header. Set STRIPE_CUSTOMER_PORTAL_RETURN_URL for non-browser clients.",
        )

    normalized_path = return_path.strip() or "/"
    if not normalized_path.startswith("/") or normalized_path.startswith("//"):
        normalized_path = "/"
    return f"{origin.rstrip('/')}{normalized_path}"


async def ensure_stripe_customer(user: AppUser, account_service: AccountService) -> str:
    if user.stripe_customer_id:
        return user.stripe_customer_id

    customer = await run_in_threadpool(
        stripe.Customer.create,
        email=user.email,
        name=user.display_name or user.email,
        metadata={"app_user_id": str(user.id)},
    )
    await account_service.set_stripe_customer(user, customer.id)
    return customer.id


@router.get("/stripe/config")
async def get_stripe_config():
    settings = get_settings()
    return {
        "publishableKey": settings.STRIPE_PUBLISHABLE_KEY,
        "apiVersion": settings.STRIPE_API_VERSION,
        "automaticTaxEnabled": settings.STRIPE_AUTOMATIC_TAX_ENABLED,
        "requiresAccount": True,
        "oneTimeMembershipDays": settings.APP_ONE_TIME_MEMBERSHIP_DAYS,
        "modes": {
            "payment": bool(settings.STRIPE_PAYMENT_PRICE_ID),
            "subscription": bool(settings.STRIPE_SUBSCRIPTION_PRICE_ID),
        },
        "configured": bool(settings.STRIPE_PUBLISHABLE_KEY and settings.STRIPE_SECRET_KEY),
    }


@router.post("/stripe/checkout-session")
async def create_checkout_session(
    payload: CheckoutSessionRequest,
    request: Request,
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    settings = get_settings()
    configure_stripe()
    account_service = AccountService(db)

    price_id = get_price_id(payload.mode)
    if not price_id:
        raise HTTPException(status_code=503, detail=f"Stripe price ID is not configured for {payload.mode}.")

    customer_id = await ensure_stripe_customer(user, account_service)
    metadata = {
        "app_user_id": str(user.id),
        "membership_mode": payload.mode,
        "product": "ailis_membership",
    }
    session_params = {
        "ui_mode": "elements",
        "mode": payload.mode,
        "customer": customer_id,
        "client_reference_id": str(user.id),
        "metadata": metadata,
        "line_items": [{"price": price_id, "quantity": payload.quantity}],
        "return_url": build_return_url(request, payload.return_path),
        "billing_address_collection": "auto",
        "automatic_tax": {"enabled": settings.STRIPE_AUTOMATIC_TAX_ENABLED},
    }
    if payload.mode == "subscription":
        session_params["subscription_data"] = {"metadata": metadata}
    else:
        session_params["payment_intent_data"] = {"metadata": metadata}

    try:
        session = await run_in_threadpool(stripe.checkout.Session.create, **session_params)
    except stripe.error.StripeError as error:
        message = getattr(error, "user_message", None) or str(error)
        raise HTTPException(status_code=400, detail=message) from error

    await account_service.record_checkout_session(
        user_id=user.id,
        stripe_session_id=session.id,
        stripe_customer_id=customer_id,
        mode=payload.mode,
        status=session.status or "",
        payment_status=session.payment_status or "",
    )

    return {
        "id": session.id,
        "clientSecret": session.client_secret,
    }


@router.post("/stripe/customer-portal")
async def create_customer_portal_session(
    payload: PortalSessionRequest,
    request: Request,
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    configure_stripe()
    account_service = AccountService(db)
    customer_id = await ensure_stripe_customer(user, account_service)

    try:
        portal_session = await run_in_threadpool(
            stripe.billing_portal.Session.create,
            customer=customer_id,
            return_url=build_plain_return_url(request, payload.return_path),
        )
    except stripe.error.StripeError as error:
        message = getattr(error, "user_message", None) or str(error)
        raise HTTPException(status_code=400, detail=message) from error

    return {"url": portal_session.url}


@router.get("/stripe/session-status")
async def get_checkout_session_status(
    session_id: str,
    user: AppUser = Depends(require_app_user),
    db: AsyncSession = Depends(get_db),
):
    configure_stripe()
    account_service = AccountService(db)

    try:
        session = await run_in_threadpool(stripe.checkout.Session.retrieve, session_id)
    except stripe.error.StripeError as error:
        message = getattr(error, "user_message", None) or str(error)
        raise HTTPException(status_code=400, detail=message) from error

    metadata = getattr(session, "metadata", None) or {}
    session_user_id = metadata.get("app_user_id") or getattr(session, "client_reference_id", None)
    if str(session_user_id or "") != str(user.id):
        raise HTTPException(status_code=403, detail="这个支付会话不属于当前账号。")

    updated_user = await account_service.activate_membership_from_checkout(session)

    return {
        "id": session.id,
        "mode": session.mode,
        "status": session.status,
        "paymentStatus": session.payment_status,
        "customerEmail": session.customer_details.email if session.customer_details else None,
        "user": serialize_user(updated_user or user),
    }


@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    settings = get_settings()
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Stripe webhook secret is not configured.")

    configure_stripe()
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=settings.STRIPE_WEBHOOK_SECRET,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook payload.") from error
    except stripe.error.SignatureVerificationError as error:
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.") from error

    account_service = AccountService(db)
    event_type = event["type"]
    data_object = event["data"]["object"]

    if event_type == "checkout.session.completed":
        await account_service.activate_membership_from_checkout(data_object)
    elif event_type in {"customer.subscription.updated", "customer.subscription.deleted"}:
        await account_service.update_subscription_membership(
            stripe_customer_id=str(data_object.get("customer") or ""),
            stripe_subscription_id=str(data_object.get("id") or ""),
            status=str(data_object.get("status") or ""),
            current_period_end=data_object.get("current_period_end"),
        )

    return {"received": True}
