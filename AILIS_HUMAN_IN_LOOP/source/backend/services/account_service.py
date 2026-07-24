import base64
import hashlib
import json
import os
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import get_settings
from backend.models.db_models import AppAdminAuditLog, AppApiUsage, AppPayment, AppSession, AppUser

settings = get_settings()


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def normalize_email(value: str) -> str:
    return (value or "").strip().lower()


def ensure_aware_utc(value: datetime | None) -> datetime | None:
    if not value:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def to_iso(value: datetime | None) -> str | None:
    normalized = ensure_aware_utc(value)
    return normalized.isoformat() if normalized else None


def current_period_key(value: datetime | None = None) -> str:
    timestamp = ensure_aware_utc(value) or now_utc()
    return timestamp.strftime("%Y-%m")


def hash_password(password: str) -> str:
    pepper = settings.APP_PASSWORD_PEPPER or ""
    salt = os.urandom(16)
    iterations = 200_000
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        f"{password}{pepper}".encode("utf-8"),
        salt,
        iterations,
    )
    return "pbkdf2_sha256${iterations}${salt}${digest}".format(
        iterations=iterations,
        salt=base64.b64encode(salt).decode("ascii"),
        digest=base64.b64encode(digest).decode("ascii"),
    )


def verify_password(password: str, encoded_password: str) -> bool:
    try:
        algorithm, iterations_raw, salt_raw, digest_raw = encoded_password.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        pepper = settings.APP_PASSWORD_PEPPER or ""
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


def has_active_membership(user: AppUser | None) -> bool:
    if not user:
        return False
    if user.membership_status not in {"active", "trialing"}:
        return False
    expires_at = ensure_aware_utc(user.membership_expires_at)
    return expires_at is None or expires_at > now_utc()


def serialize_user(user: AppUser) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "displayName": user.display_name,
        "stripeCustomerId": user.stripe_customer_id or None,
        "membership": {
            "status": user.membership_status,
            "plan": user.membership_plan,
            "expiresAt": to_iso(user.membership_expires_at),
            "active": has_active_membership(user),
        },
        "createdAt": to_iso(user.created_at),
    }


def serialize_payment(payment: AppPayment) -> dict:
    return {
        "id": payment.id,
        "userId": payment.user_id,
        "stripeSessionId": payment.stripe_session_id,
        "stripeCustomerId": payment.stripe_customer_id or None,
        "stripeSubscriptionId": payment.stripe_subscription_id or None,
        "mode": payment.mode,
        "status": payment.status,
        "paymentStatus": payment.payment_status,
        "createdAt": to_iso(payment.created_at),
        "updatedAt": to_iso(payment.updated_at),
    }


class AccountService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> AppUser | None:
        stmt = select(AppUser).where(AppUser.email == normalize_email(email)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> AppUser | None:
        stmt = select(AppUser).where(AppUser.id == int(user_id)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_users(self, query: str = "", limit: int = 50, offset: int = 0) -> list[AppUser]:
        stmt = select(AppUser).order_by(AppUser.created_at.desc())
        normalized_query = normalize_email(query)
        if normalized_query:
            pattern = f"%{normalized_query}%"
            stmt = stmt.where(
                (AppUser.email.ilike(pattern))
                | (AppUser.display_name.ilike(pattern))
                | (AppUser.stripe_customer_id.ilike(pattern))
            )
        stmt = stmt.offset(max(int(offset or 0), 0)).limit(min(max(int(limit or 50), 1), 200))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_user(self, email: str, password: str, display_name: str = "") -> AppUser:
        user = AppUser(
            email=normalize_email(email),
            display_name=(display_name or "").strip() or normalize_email(email).split("@")[0],
            password_hash=hash_password(password),
            membership_status="free",
            membership_plan="free",
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def create_session(self, user_id: int) -> dict:
        expires_at = now_utc() + timedelta(days=max(int(settings.APP_SESSION_TTL_DAYS or 30), 1))
        session = AppSession(
            user_id=int(user_id),
            token=create_session_token(),
            expires_at=expires_at,
        )
        self.db.add(session)
        await self.db.commit()
        return {"token": session.token, "expiresAt": expires_at}

    async def get_session_user(self, token: str | None) -> dict | None:
        if not token:
            return None
        stmt = select(AppSession).where(AppSession.token == token).limit(1)
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()
        if not session:
            return None
        expires_at = ensure_aware_utc(session.expires_at)
        if not expires_at or expires_at <= now_utc():
            await self.db.delete(session)
            await self.db.commit()
            return None
        user = await self.get_user_by_id(session.user_id)
        if not user:
            return None
        return {"token": session.token, "expiresAt": expires_at, "user": user}

    async def delete_session(self, token: str | None) -> None:
        if not token:
            return
        await self.db.execute(delete(AppSession).where(AppSession.token == token))
        await self.db.commit()

    async def list_payments(self, user_id: int, limit: int = 50) -> list[AppPayment]:
        stmt = (
            select(AppPayment)
            .where(AppPayment.user_id == int(user_id))
            .order_by(AppPayment.created_at.desc())
            .limit(min(max(int(limit or 50), 1), 200))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def set_membership(
        self,
        *,
        user_id: int,
        status: str,
        plan: str,
        expires_at: datetime | None = None,
        admin_user_id: int | None = None,
        reason: str = "",
    ) -> AppUser | None:
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.membership_status = (status or "free").strip().lower()
        user.membership_plan = (plan or "free").strip().lower()
        user.membership_expires_at = ensure_aware_utc(expires_at)
        await self.add_admin_audit_log(
            admin_user_id=admin_user_id,
            target_user_id=user.id,
            action="membership.update",
            detail={
                "status": user.membership_status,
                "plan": user.membership_plan,
                "expiresAt": to_iso(user.membership_expires_at),
                "reason": reason,
            },
            commit=False,
        )
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def add_admin_audit_log(
        self,
        *,
        admin_user_id: int | None,
        target_user_id: int | None,
        action: str,
        detail: dict | str = "",
        commit: bool = True,
    ) -> AppAdminAuditLog:
        if isinstance(detail, str):
            detail_text = detail
        else:
            detail_text = json.dumps(detail, ensure_ascii=False, sort_keys=True)
        log = AppAdminAuditLog(
            admin_user_id=admin_user_id,
            target_user_id=target_user_id,
            action=action,
            detail=detail_text,
        )
        self.db.add(log)
        if commit:
            await self.db.commit()
            await self.db.refresh(log)
        return log

    async def count_period_usage(self, user_id: int, endpoints: list[str], period_key: str | None = None) -> int:
        period = period_key or current_period_key()
        stmt = select(func.coalesce(func.sum(AppApiUsage.units), 0)).where(
            AppApiUsage.user_id == int(user_id),
            AppApiUsage.period_key == period,
            AppApiUsage.endpoint.in_(endpoints),
            AppApiUsage.status == "accepted",
        )
        result = await self.db.execute(stmt)
        return int(result.scalar_one() or 0)

    async def record_api_usage(
        self,
        *,
        user_id: int,
        endpoint: str,
        units: int = 1,
        status: str = "accepted",
        period_key: str | None = None,
    ) -> AppApiUsage:
        usage = AppApiUsage(
            user_id=int(user_id),
            endpoint=endpoint,
            units=max(int(units or 1), 1),
            status=status or "accepted",
            period_key=period_key or current_period_key(),
        )
        self.db.add(usage)
        await self.db.commit()
        await self.db.refresh(usage)
        return usage

    async def set_stripe_customer(self, user: AppUser, stripe_customer_id: str) -> AppUser:
        user.stripe_customer_id = stripe_customer_id or ""
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def record_checkout_session(
        self,
        *,
        user_id: int,
        stripe_session_id: str,
        mode: str,
        status: str = "",
        payment_status: str = "",
        stripe_customer_id: str = "",
        stripe_subscription_id: str = "",
    ) -> AppPayment:
        stmt = select(AppPayment).where(AppPayment.stripe_session_id == stripe_session_id).limit(1)
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            existing.status = status or existing.status
            existing.payment_status = payment_status or existing.payment_status
            existing.stripe_customer_id = stripe_customer_id or existing.stripe_customer_id
            existing.stripe_subscription_id = stripe_subscription_id or existing.stripe_subscription_id
            await self.db.commit()
            await self.db.refresh(existing)
            return existing

        payment = AppPayment(
            user_id=int(user_id),
            stripe_session_id=stripe_session_id,
            stripe_customer_id=stripe_customer_id or "",
            stripe_subscription_id=stripe_subscription_id or "",
            mode=mode,
            status=status or "",
            payment_status=payment_status or "",
        )
        self.db.add(payment)
        await self.db.commit()
        await self.db.refresh(payment)
        return payment

    async def activate_membership_from_checkout(self, stripe_session) -> AppUser | None:
        user_id = None
        metadata = getattr(stripe_session, "metadata", None) or {}
        if metadata.get("app_user_id"):
            user_id = int(metadata["app_user_id"])
        elif getattr(stripe_session, "client_reference_id", None):
            user_id = int(stripe_session.client_reference_id)

        if not user_id:
            return None

        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        customer_id = str(getattr(stripe_session, "customer", "") or "")
        subscription_id = str(getattr(stripe_session, "subscription", "") or "")
        mode = str(getattr(stripe_session, "mode", "") or "")
        status = str(getattr(stripe_session, "status", "") or "")
        payment_status = str(getattr(stripe_session, "payment_status", "") or "")

        await self.record_checkout_session(
            user_id=user.id,
            stripe_session_id=str(stripe_session.id),
            stripe_customer_id=customer_id,
            stripe_subscription_id=subscription_id,
            mode=mode,
            status=status,
            payment_status=payment_status,
        )

        if customer_id:
            user.stripe_customer_id = customer_id

        if status == "complete" and payment_status in {"paid", "no_payment_required"}:
            user.membership_status = "active"
            if mode == "subscription":
                user.membership_plan = "subscription"
                user.membership_expires_at = None
            else:
                user.membership_plan = "one_time"
                user.membership_expires_at = now_utc() + timedelta(
                    days=max(int(settings.APP_ONE_TIME_MEMBERSHIP_DAYS or 30), 1)
                )
            await self.db.commit()
            await self.db.refresh(user)

        return user

    async def update_subscription_membership(
        self,
        *,
        stripe_customer_id: str,
        stripe_subscription_id: str,
        status: str,
        current_period_end: int | None = None,
    ) -> AppUser | None:
        stmt = select(AppUser).where(AppUser.stripe_customer_id == stripe_customer_id).limit(1)
        user = (await self.db.execute(stmt)).scalar_one_or_none()
        if not user:
            return None

        active_statuses = {"active", "trialing"}
        user.membership_status = "active" if status in active_statuses else status or "canceled"
        user.membership_plan = "subscription" if status in active_statuses else user.membership_plan
        if current_period_end:
            user.membership_expires_at = datetime.fromtimestamp(int(current_period_end), timezone.utc)
        elif status in active_statuses:
            user.membership_expires_at = None

        await self.record_checkout_session(
            user_id=user.id,
            stripe_session_id=f"subscription:{stripe_subscription_id}",
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_subscription_id,
            mode="subscription",
            status=status,
            payment_status="",
        )
        await self.db.commit()
        await self.db.refresh(user)
        return user
