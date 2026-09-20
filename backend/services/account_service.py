import base64
import hashlib
import json
import os
import secrets
from collections.abc import Mapping
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from backend.core.config import get_settings
from backend.models.db_models import (
    AppAccountToken,
    AppAdminAuditLog,
    AppApiUsage,
    AppLoginThrottle,
    AppPayment,
    AppPaymentOrder,
    AppMembershipSubscription,
    AppSession,
    AppSessionMeta,
    AppTokenAccount,
    AppTokenLedger,
    AppUser,
    AppUserSecurity,
)

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


def create_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def hash_secret(value: str) -> str:
    return hashlib.sha256((value or "").encode("utf-8")).hexdigest()


def stripe_value(payload, key: str, default=None):
    """Read a field from either a StripeObject or a webhook dictionary."""
    if isinstance(payload, Mapping):
        return payload.get(key, default)
    return getattr(payload, key, default)


def serialize_session(session: AppSession, meta: AppSessionMeta | None = None, current: bool = False) -> dict:
    return {
        "id": session.id,
        "current": bool(current),
        "createdAt": to_iso(session.created_at),
        "expiresAt": to_iso(session.expires_at),
        "lastSeenAt": to_iso(meta.last_seen_at if meta else None),
        "deviceLabel": (meta.device_label if meta else "") or "Unknown device",
        "userAgent": (meta.user_agent if meta else "") or None,
        "ipAddress": (meta.ip_address if meta else "") or None,
    }


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


def serialize_token_ledger(entry: AppTokenLedger) -> dict:
    return {
        "id": entry.id,
        "delta": int(entry.delta),
        "balanceAfter": int(entry.balance_after),
        "entryType": entry.entry_type,
        "source": entry.source,
        "referenceId": entry.reference_id or None,
        "note": entry.note or "",
        "createdAt": to_iso(entry.created_at),
    }


def serialize_payment_order(order: AppPaymentOrder) -> dict:
    return {
        "id": order.id,
        "orderNo": order.order_no,
        "provider": order.provider,
        "planId": order.package_id,
        "packageId": order.package_id,
        "amountFen": int(order.amount_fen),
        "periodTokenQuota": int(order.token_amount),
        "tokenAmount": int(order.token_amount),
        "status": order.status,
        "providerTradeId": order.provider_trade_id or None,
        "paidAt": to_iso(order.paid_at),
        "createdAt": to_iso(order.created_at),
        "updatedAt": to_iso(order.updated_at),
    }


def serialize_subscription(subscription: AppMembershipSubscription) -> dict:
    return {
        "id": subscription.id,
        "provider": subscription.provider,
        "planId": subscription.plan_id,
        "status": subscription.status,
        "providerSubscriptionId": subscription.provider_subscription_id or None,
        "currentPeriodStart": to_iso(subscription.current_period_start),
        "currentPeriodEnd": to_iso(subscription.current_period_end),
        "periodTokenQuota": int(subscription.period_token_quota or 0),
        "createdAt": to_iso(subscription.created_at),
        "updatedAt": to_iso(subscription.updated_at),
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
        await self.ensure_token_account(user.id)
        await self.ensure_user_security(user.id)
        return user

    async def ensure_user_security(self, user_id: int) -> AppUserSecurity:
        stmt = select(AppUserSecurity).where(AppUserSecurity.user_id == int(user_id)).limit(1)
        security = (await self.db.execute(stmt)).scalar_one_or_none()
        if security:
            return security
        security = AppUserSecurity(user_id=int(user_id))
        self.db.add(security)
        try:
            await self.db.commit()
            await self.db.refresh(security)
            return security
        except IntegrityError:
            await self.db.rollback()
            existing = (
                await self.db.execute(
                    select(AppUserSecurity).where(AppUserSecurity.user_id == int(user_id)).limit(1)
                )
            ).scalar_one_or_none()
            if existing:
                return existing
            raise

    async def update_profile(self, user_id: int, display_name: str) -> AppUser | None:
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        user.display_name = (display_name or "").strip()[:120]
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user or not verify_password(current_password, user.password_hash):
            return False
        user.password_hash = hash_password(new_password)
        security = await self.ensure_user_security(user.id)
        security.password_changed_at = now_utc()
        await self.db.commit()
        return True

    async def ensure_token_account(self, user_id: int) -> AppTokenAccount:
        stmt = select(AppTokenAccount).where(AppTokenAccount.user_id == int(user_id)).limit(1)
        account = (await self.db.execute(stmt)).scalar_one_or_none()
        if account:
            return account

        account = AppTokenAccount(user_id=int(user_id), balance=0)
        self.db.add(account)
        try:
            await self.db.commit()
            await self.db.refresh(account)
            return account
        except IntegrityError:
            await self.db.rollback()
            existing = (
                await self.db.execute(
                    select(AppTokenAccount).where(AppTokenAccount.user_id == int(user_id)).limit(1)
                )
            ).scalar_one_or_none()
            if existing:
                return existing
            raise

    async def get_token_balance(self, user_id: int) -> int:
        account = await self.ensure_token_account(user_id)
        return int(account.balance or 0)

    async def list_token_ledger(self, user_id: int, limit: int = 50) -> list[AppTokenLedger]:
        stmt = (
            select(AppTokenLedger)
            .where(AppTokenLedger.user_id == int(user_id))
            .order_by(AppTokenLedger.created_at.desc())
            .limit(min(max(int(limit or 50), 1), 200))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def list_payment_orders(self, user_id: int, limit: int = 50) -> list[AppPaymentOrder]:
        stmt = (
            select(AppPaymentOrder)
            .where(AppPaymentOrder.user_id == int(user_id))
            .order_by(AppPaymentOrder.created_at.desc())
            .limit(min(max(int(limit or 50), 1), 200))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_current_subscription(self, user_id: int) -> AppMembershipSubscription | None:
        stmt = (
            select(AppMembershipSubscription)
            .where(
                AppMembershipSubscription.user_id == int(user_id),
                AppMembershipSubscription.status.in_(["pending", "active", "trialing", "past_due"]),
            )
            .order_by(AppMembershipSubscription.updated_at.desc())
            .limit(1)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_sessions(self, user_id: int) -> list[tuple[AppSession, AppSessionMeta | None]]:
        stmt = select(AppSession).where(
            AppSession.user_id == int(user_id),
            AppSession.expires_at > now_utc(),
        ).order_by(AppSession.created_at.desc())
        sessions = list((await self.db.execute(stmt)).scalars().all())
        if not sessions:
            return []
        meta_stmt = select(AppSessionMeta).where(AppSessionMeta.session_id.in_([item.id for item in sessions]))
        metas = {item.session_id: item for item in (await self.db.execute(meta_stmt)).scalars().all()}
        return [(session, metas.get(session.id)) for session in sessions]

    async def revoke_session(self, user_id: int, session_id: int) -> bool:
        stmt = select(AppSession).where(AppSession.id == int(session_id), AppSession.user_id == int(user_id)).limit(1)
        session = (await self.db.execute(stmt)).scalar_one_or_none()
        if not session:
            return False
        await self.db.execute(delete(AppSessionMeta).where(AppSessionMeta.session_id == session.id))
        await self.db.delete(session)
        await self.db.commit()
        return True

    async def revoke_other_sessions(self, user_id: int, current_session_id: int | None) -> int:
        stmt = select(AppSession).where(AppSession.user_id == int(user_id))
        if current_session_id:
            stmt = stmt.where(AppSession.id != int(current_session_id))
        sessions = list((await self.db.execute(stmt)).scalars().all())
        if not sessions:
            return 0
        ids = [item.id for item in sessions]
        await self.db.execute(delete(AppSessionMeta).where(AppSessionMeta.session_id.in_(ids)))
        await self.db.execute(delete(AppSession).where(AppSession.id.in_(ids)))
        await self.db.commit()
        return len(ids)

    async def issue_account_token(self, user_id: int, purpose: str, ttl: timedelta) -> str:
        await self.db.execute(
            delete(AppAccountToken).where(
                AppAccountToken.user_id == int(user_id),
                AppAccountToken.purpose == purpose,
                AppAccountToken.used_at.is_(None),
            )
        )
        raw_token = secrets.token_urlsafe(32)
        token = AppAccountToken(
            user_id=int(user_id),
            purpose=purpose,
            token_hash=hash_secret(raw_token),
            expires_at=now_utc() + ttl,
        )
        self.db.add(token)
        await self.db.commit()
        return raw_token

    async def consume_account_token(self, raw_token: str, purpose: str) -> AppAccountToken | None:
        stmt = (
            select(AppAccountToken)
            .where(
                AppAccountToken.token_hash == hash_secret(raw_token),
                AppAccountToken.purpose == purpose,
                AppAccountToken.used_at.is_(None),
            )
            .with_for_update()
            .limit(1)
        )
        token = (await self.db.execute(stmt)).scalar_one_or_none()
        if not token or ensure_aware_utc(token.expires_at) <= now_utc():
            return None
        token.used_at = now_utc()
        await self.db.commit()
        return token

    async def mark_email_verified(self, user_id: int) -> bool:
        security = await self.ensure_user_security(user_id)
        security.email_verified_at = now_utc()
        await self.db.commit()
        return True

    async def reset_password_with_token(self, raw_token: str, new_password: str) -> bool:
        token = await self.consume_account_token(raw_token, "password_reset")
        if not token:
            return False
        user = await self.get_user_by_id(token.user_id)
        if not user:
            return False
        user.password_hash = hash_password(new_password)
        security = await self.ensure_user_security(user.id)
        security.password_changed_at = now_utc()
        sessions = list((await self.db.execute(
            select(AppSession).where(AppSession.user_id == user.id)
        )).scalars().all())
        if sessions:
            session_ids = [item.id for item in sessions]
            await self.db.execute(delete(AppSessionMeta).where(AppSessionMeta.session_id.in_(session_ids)))
            await self.db.execute(delete(AppSession).where(AppSession.id.in_(session_ids)))
        await self.db.commit()
        return True

    def _login_throttle_key(self, email: str, ip_address: str = "") -> str:
        return hash_secret(f"{normalize_email(email)}|{(ip_address or '').strip()}")

    async def is_login_blocked(self, email: str, ip_address: str = "") -> int:
        key_hash = self._login_throttle_key(email, ip_address)
        stmt = select(AppLoginThrottle).where(AppLoginThrottle.key_hash == key_hash).limit(1)
        throttle = (await self.db.execute(stmt)).scalar_one_or_none()
        blocked_until = ensure_aware_utc(throttle.blocked_until) if throttle else None
        if blocked_until and blocked_until > now_utc():
            return max(int((blocked_until - now_utc()).total_seconds()), 1)
        return 0

    async def record_login_failure(self, email: str, ip_address: str = "") -> int:
        now = now_utc()
        key_hash = self._login_throttle_key(email, ip_address)
        stmt = select(AppLoginThrottle).where(AppLoginThrottle.key_hash == key_hash).limit(1)
        throttle = (await self.db.execute(stmt)).scalar_one_or_none()
        window = timedelta(minutes=max(int(settings.APP_LOGIN_WINDOW_MINUTES or 15), 1))
        if not throttle or now - ensure_aware_utc(throttle.window_started_at) >= window:
            if not throttle:
                throttle = AppLoginThrottle(key_hash=key_hash, window_started_at=now)
                self.db.add(throttle)
            throttle.window_started_at = now
            throttle.failed_count = 0
            throttle.blocked_until = None
        throttle.failed_count += 1
        if throttle.failed_count >= max(int(settings.APP_LOGIN_MAX_FAILURES or 8), 1):
            throttle.blocked_until = now + timedelta(minutes=max(int(settings.APP_LOGIN_LOCK_MINUTES or 15), 1))
        await self.db.commit()
        return max(int((ensure_aware_utc(throttle.blocked_until) - now).total_seconds()), 0) if throttle.blocked_until else 0

    async def clear_login_failures(self, email: str, ip_address: str = "") -> None:
        await self.db.execute(delete(AppLoginThrottle).where(AppLoginThrottle.key_hash == self._login_throttle_key(email, ip_address)))
        await self.db.commit()

    async def create_payment_order(
        self,
        *,
        user_id: int,
        order_no: str,
        provider: str,
        package_id: str,
        amount_fen: int,
        token_amount: int,
    ) -> AppPaymentOrder:
        order = AppPaymentOrder(
            order_no=order_no,
            user_id=int(user_id),
            provider=provider,
            package_id=package_id,
            amount_fen=max(int(amount_fen), 0),
            token_amount=max(int(token_amount), 0),
            status="created",
        )
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def credit_paid_order(
        self,
        *,
        order_no: str,
        provider_trade_id: str,
        notify_payload: str = "",
        provider_subscription_id: str = "",
        period_start: datetime | None = None,
        period_end: datetime | None = None,
        expected_provider: str = "",
        expected_amount_fen: int | None = None,
    ) -> AppPaymentOrder | None:
        stmt = (
            select(AppPaymentOrder)
            .where(AppPaymentOrder.order_no == order_no)
            .with_for_update()
            .limit(1)
        )
        order = (await self.db.execute(stmt)).scalar_one_or_none()
        if not order:
            return None
        if expected_provider and order.provider != expected_provider:
            raise ValueError("支付通道与订单不匹配")
        if expected_amount_fen is not None and int(order.amount_fen) != int(expected_amount_fen):
            raise ValueError("支付金额与订单不匹配")
        if order.status == "paid":
            if provider_trade_id and order.provider_trade_id != provider_trade_id:
                raise ValueError("支付交易号与订单不匹配")
            return order

        account_stmt = (
            select(AppTokenAccount)
            .where(AppTokenAccount.user_id == int(order.user_id))
            .with_for_update()
            .limit(1)
        )
        account = (await self.db.execute(account_stmt)).scalar_one_or_none()
        if not account:
            account = await self.ensure_token_account(order.user_id)
            account = (
                await self.db.execute(
                    select(AppTokenAccount)
                    .where(AppTokenAccount.user_id == int(order.user_id))
                    .with_for_update()
                    .limit(1)
                )
            ).scalar_one()
        account.balance = int(account.balance or 0) + int(order.token_amount or 0)
        ledger = AppTokenLedger(
            user_id=order.user_id,
            delta=int(order.token_amount or 0),
            balance_after=int(account.balance),
            entry_type="recharge",
            source=order.provider,
            reference_id=order.order_no,
            idempotency_key=f"payment:{order.order_no}",
            note=f"{order.provider} 会员订阅本周期 Token 额度",
        )
        self.db.add(ledger)

        user = await self.get_user_by_id(order.user_id)
        if user:
            start = ensure_aware_utc(period_start) or now_utc()
            # 手动续费保留尚未用完的会员天数；平台明确提供周期时仍以平台为准。
            prior_end = ensure_aware_utc(user.membership_expires_at)
            if period_start is None and period_end is None and prior_end and prior_end > start:
                start = prior_end
            end = ensure_aware_utc(period_end) or (start + timedelta(days=30))
            user.membership_status = "active"
            user.membership_plan = order.package_id
            user.membership_expires_at = end

            subscription_stmt = (
                select(AppMembershipSubscription)
                .where(
                    AppMembershipSubscription.user_id == order.user_id,
                    AppMembershipSubscription.plan_id == order.package_id,
                    AppMembershipSubscription.status.in_(["pending", "active", "trialing"]),
                )
                .order_by(AppMembershipSubscription.updated_at.desc())
                .limit(1)
            )
            subscription = (await self.db.execute(subscription_stmt)).scalar_one_or_none()
            if not subscription:
                subscription = AppMembershipSubscription(
                    user_id=order.user_id,
                    provider=order.provider,
                    plan_id=order.package_id,
                )
                self.db.add(subscription)
            subscription.provider = order.provider
            subscription.status = "active"
            subscription.provider_subscription_id = provider_subscription_id or subscription.provider_subscription_id
            subscription.current_period_start = start
            subscription.current_period_end = end
            subscription.period_token_quota = int(order.token_amount or 0)

        order.status = "paid"
        order.provider_trade_id = provider_trade_id or order.provider_trade_id
        order.notify_payload = notify_payload[:20000]
        order.paid_at = now_utc()
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def mark_payment_order_failed(self, order_no: str, detail: str = "") -> bool:
        stmt = (
            select(AppPaymentOrder)
            .where(AppPaymentOrder.order_no == order_no)
            .with_for_update()
            .limit(1)
        )
        order = (await self.db.execute(stmt)).scalar_one_or_none()
        if not order or order.status == "paid":
            return False
        order.status = "failed"
        if detail:
            order.notify_payload = detail[:20000]
        await self.db.commit()
        return True

    async def mark_payment_order_pending(self, order_no: str, provider_trade_id: str = "") -> bool:
        stmt = (
            select(AppPaymentOrder)
            .where(AppPaymentOrder.order_no == order_no)
            .with_for_update()
            .limit(1)
        )
        order = (await self.db.execute(stmt)).scalar_one_or_none()
        if not order or order.status == "paid":
            return False
        order.status = "pending"
        if provider_trade_id:
            order.provider_trade_id = provider_trade_id
        await self.db.commit()
        return True

    async def create_session(
        self,
        user_id: int,
        *,
        user_agent: str = "",
        ip_address: str = "",
    ) -> dict:
        expires_at = now_utc() + timedelta(days=max(int(settings.APP_SESSION_TTL_DAYS or 30), 1))
        csrf_token = create_csrf_token()
        raw_session_token = create_session_token()
        session = AppSession(
            user_id=int(user_id),
            token=hash_secret(raw_session_token),
            expires_at=expires_at,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        self.db.add(AppSessionMeta(
            session_id=session.id,
            csrf_token_hash=hash_secret(csrf_token),
            device_label=(user_agent or "").split(" ", 1)[0][:120],
            user_agent=(user_agent or "")[:500],
            ip_address=(ip_address or "")[:64],
            last_seen_at=now_utc(),
        ))
        await self.db.commit()
        return {
            "token": raw_session_token,
            "csrfToken": csrf_token,
            "sessionId": session.id,
            "expiresAt": expires_at,
        }

    async def get_session_record(self, token: str | None) -> dict | None:
        if not token:
            return None
        raw_token = str(token).strip()
        token_hash = hash_secret(raw_token)
        stmt = select(AppSession).where(AppSession.token == token_hash).limit(1)
        session = (await self.db.execute(stmt)).scalar_one_or_none()
        legacy_token = False
        if not session:
            # 兼容升级前明文会话；成功使用一次后立即迁移为摘要。
            session = (
                await self.db.execute(
                    select(AppSession).where(AppSession.token == raw_token).limit(1)
                )
            ).scalar_one_or_none()
            legacy_token = bool(session)
        if not session:
            return None
        expires_at = ensure_aware_utc(session.expires_at)
        if not expires_at or expires_at <= now_utc():
            await self.db.execute(delete(AppSessionMeta).where(AppSessionMeta.session_id == session.id))
            await self.db.delete(session)
            await self.db.commit()
            return None
        user = await self.get_user_by_id(session.user_id)
        if not user:
            return None
        meta_stmt = select(AppSessionMeta).where(AppSessionMeta.session_id == session.id).limit(1)
        meta = (await self.db.execute(meta_stmt)).scalar_one_or_none()
        if legacy_token:
            session.token = token_hash
            await self.db.commit()
        return {"token": raw_token, "expiresAt": expires_at, "session": session, "meta": meta, "user": user}

    async def get_session_user(self, token: str | None) -> dict | None:
        return await self.get_session_record(token)

    async def validate_csrf(self, session_token: str | None, csrf_token: str | None) -> bool:
        record = await self.get_session_record(session_token)
        if not record or not csrf_token:
            return False
        meta = record.get("meta")
        return bool(meta and secrets.compare_digest(meta.csrf_token_hash, hash_secret(csrf_token)))

    async def delete_session(self, token: str | None) -> None:
        if not token:
            return
        record = await self.get_session_record(token)
        if record:
            await self.db.execute(delete(AppSessionMeta).where(AppSessionMeta.session_id == record["session"].id))
            await self.db.execute(delete(AppSession).where(AppSession.id == record["session"].id))
        else:
            await self.db.execute(
                delete(AppSession).where(
                    AppSession.token.in_([str(token).strip(), hash_secret(str(token).strip())])
                )
            )
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

    async def charge_api_request(
        self,
        *,
        user_id: int,
        endpoint: str,
        token_cost: int,
        reference_id: str,
    ) -> AppTokenAccount | None:
        """在一个事务中扣减 Token 并记录 API 用量。

        reference_id 是本次请求的幂等键。模型请求失败后的退款策略由上层
        重试/账务系统决定；这里先保证不会出现“记了用量但没有扣余额”或
        “重复回调重复扣余额”的中间状态。
        """
        cost = max(int(token_cost or 0), 0)
        if cost == 0:
            await self.record_api_usage(user_id=user_id, endpoint=endpoint, units=0)
            return await self.ensure_token_account(user_id)

        idempotency_key = f"api:{endpoint}:{reference_id}"
        existing_stmt = select(AppTokenLedger).where(
            AppTokenLedger.idempotency_key == idempotency_key,
        ).limit(1)
        existing = (await self.db.execute(existing_stmt)).scalar_one_or_none()
        if existing:
            return await self.ensure_token_account(user_id)

        account_stmt = (
            select(AppTokenAccount)
            .where(AppTokenAccount.user_id == int(user_id))
            .with_for_update()
            .limit(1)
        )
        account = (await self.db.execute(account_stmt)).scalar_one_or_none()
        if not account or int(account.balance or 0) < cost:
            return None

        account.balance = int(account.balance) - cost
        self.db.add(AppTokenLedger(
            user_id=int(user_id),
            delta=-cost,
            balance_after=int(account.balance),
            entry_type="usage",
            source="api",
            reference_id=reference_id,
            idempotency_key=idempotency_key,
            note=f"{endpoint} API 调用",
        ))
        self.db.add(AppApiUsage(
            user_id=int(user_id),
            endpoint=endpoint,
            units=cost,
            status="accepted",
            period_key=current_period_key(),
        ))
        await self.db.commit()
        await self.db.refresh(account)
        return account

    async def authorize_api_request(
        self,
        *,
        user_id: int,
        endpoint: str,
        monthly_limit: int,
        token_cost: int,
        reference_id: str,
    ) -> str:
        """串行化同一用户的额度检查、Token 扣减和用量写入。

        返回空字符串表示成功，``quota`` 表示月度额度不足，``balance``
        表示 Token 余额不足。用户行锁让多个 API 进程不会同时通过同一个
        count-then-insert 检查。
        """
        user_stmt = (
            select(AppUser)
            .where(AppUser.id == int(user_id))
            .with_for_update()
            .limit(1)
        )
        user = (await self.db.execute(user_stmt)).scalar_one_or_none()
        if not user:
            return "missing"

        period = current_period_key()
        used_stmt = select(func.coalesce(func.sum(AppApiUsage.units), 0)).where(
            AppApiUsage.user_id == int(user_id),
            AppApiUsage.period_key == period,
            AppApiUsage.endpoint == endpoint,
            AppApiUsage.status == "accepted",
        )
        used = int((await self.db.execute(used_stmt)).scalar_one() or 0)
        if int(monthly_limit or 0) > 0 and used >= int(monthly_limit):
            await self.db.rollback()
            return "quota"

        cost = max(int(token_cost or 0), 0)
        idempotency_key = f"api:{endpoint}:{reference_id}"
        if cost > 0:
            existing = (
                await self.db.execute(
                    select(AppTokenLedger)
                    .where(AppTokenLedger.idempotency_key == idempotency_key)
                    .limit(1)
                )
            ).scalar_one_or_none()
            if existing:
                await self.db.rollback()
                return ""

            account = (
                await self.db.execute(
                    select(AppTokenAccount)
                    .where(AppTokenAccount.user_id == int(user_id))
                    .with_for_update()
                    .limit(1)
                )
            ).scalar_one_or_none()
            if not account:
                account = AppTokenAccount(user_id=int(user_id), balance=0)
                self.db.add(account)
                await self.db.flush()
            if int(account.balance or 0) < cost:
                await self.db.rollback()
                return "balance"
            account.balance = int(account.balance) - cost
            self.db.add(AppTokenLedger(
                user_id=int(user_id),
                delta=-cost,
                balance_after=int(account.balance),
                entry_type="usage",
                source="api",
                reference_id=reference_id,
                idempotency_key=idempotency_key,
                note=f"{endpoint} API 调用",
            ))

        self.db.add(AppApiUsage(
            user_id=int(user_id),
            endpoint=endpoint,
            units=cost if cost > 0 else 1,
            status="accepted",
            period_key=period,
        ))
        await self.db.commit()
        return ""

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
        commit: bool = True,
    ) -> AppPayment:
        stmt = (
            select(AppPayment)
            .where(AppPayment.stripe_session_id == stripe_session_id)
            .with_for_update()
            .limit(1)
        )
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            existing.status = status or existing.status
            existing.payment_status = payment_status or existing.payment_status
            existing.stripe_customer_id = stripe_customer_id or existing.stripe_customer_id
            existing.stripe_subscription_id = stripe_subscription_id or existing.stripe_subscription_id
            if commit:
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
        if commit:
            await self.db.commit()
            await self.db.refresh(payment)
        return payment

    async def activate_membership_from_checkout(self, stripe_session) -> AppUser | None:
        user_id = None
        metadata = stripe_value(stripe_session, "metadata", {}) or {}
        if metadata.get("app_user_id"):
            user_id = int(metadata["app_user_id"])
        elif stripe_value(stripe_session, "client_reference_id", None):
            user_id = int(stripe_value(stripe_session, "client_reference_id"))

        if not user_id:
            return None

        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        customer_id = str(stripe_value(stripe_session, "customer", "") or "")
        subscription_id = str(stripe_value(stripe_session, "subscription", "") or "")
        mode = str(stripe_value(stripe_session, "mode", "") or "")
        status = str(stripe_value(stripe_session, "status", "") or "")
        payment_status = str(stripe_value(stripe_session, "payment_status", "") or "")
        session_id = str(stripe_value(stripe_session, "id", "") or "")
        if not session_id:
            return None

        payment_stmt = (
            select(AppPayment)
            .where(AppPayment.stripe_session_id == session_id)
            .with_for_update()
            .limit(1)
        )
        payment = (await self.db.execute(payment_stmt)).scalar_one_or_none()
        # Stripe 会重试 webhook；fulfilled 是本地已完成权益发放的幂等标记。
        if payment and payment.status == "fulfilled":
            return user

        payment = await self.record_checkout_session(
            user_id=user.id,
            stripe_session_id=session_id,
            stripe_customer_id=customer_id,
            stripe_subscription_id=subscription_id,
            mode=mode,
            status=status,
            payment_status=payment_status,
            commit=False,
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
            payment.status = "fulfilled"
            await self.db.commit()
            await self.db.refresh(user)
        else:
            await self.db.commit()

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
