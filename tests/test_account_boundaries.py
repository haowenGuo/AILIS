"""Focused regression checks for account and payment boundaries."""

import asyncio
import base64
import json
import tempfile
import time
from pathlib import Path
from datetime import timedelta
from urllib.parse import urlencode

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy import select

from backend.core.database import Base
from backend.models import db_models, edu_models  # noqa: F401
from backend.services.account_service import AccountService
from backend.services.account_service import hash_secret, verify_password
from backend.models.db_models import AppSession
from backend.services.payment_providers import AlipayProvider, WechatPayProvider
from backend.services.payment_providers import settings as payment_settings


def test_stripe_webhook_dict_activates_membership():
    async def run():
        with tempfile.TemporaryDirectory(prefix="ailis-account-test-") as temp_dir:
            database = Path(temp_dir) / "account.db"
            engine = create_async_engine(
                f"sqlite+aiosqlite:///{database}",
                connect_args={"check_same_thread": False},
            )
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
            async with session_factory() as session:
                service = AccountService(session)
                user = await service.create_user("stripe-dict@example.invalid", "correct-horse-battery")
                activated = await service.activate_membership_from_checkout({
                    "id": "cs_test_dict_boundary",
                    "metadata": {"app_user_id": str(user.id)},
                    "customer": "cus_test_boundary",
                    "subscription": "",
                    "mode": "payment",
                    "status": "complete",
                    "payment_status": "paid",
                })
                assert activated is not None
                assert activated.membership_status == "active"
                assert activated.membership_plan == "one_time"
                first_expiry = activated.membership_expires_at

                # Stripe 重试同一个 webhook 时，不能再次顺延一次性会员期限。
                retried = await service.activate_membership_from_checkout({
                    "id": "cs_test_dict_boundary",
                    "metadata": {"app_user_id": str(user.id)},
                    "customer": "cus_test_boundary",
                    "subscription": "",
                    "mode": "payment",
                    "status": "complete",
                    "payment_status": "paid",
                })
                assert retried is not None
                assert retried.membership_expires_at == first_expiry

            await engine.dispose()

    asyncio.run(run())


def test_account_session_and_csrf_flow():
    async def run():
        with tempfile.TemporaryDirectory(prefix="ailis-account-test-") as temp_dir:
            database = Path(temp_dir) / "account.db"
            engine = create_async_engine(
                f"sqlite+aiosqlite:///{database}",
                connect_args={"check_same_thread": False},
            )
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
            async with session_factory() as session:
                service = AccountService(session)
                user = await service.create_user("account-flow@example.invalid", "correct-horse-battery")
                assert verify_password("correct-horse-battery", user.password_hash)
                login_session = await service.create_session(user.id, user_agent="test", ip_address="127.0.0.1")
                record = await service.get_session_user(login_session["token"])
                assert record and record["user"].id == user.id
                assert record["session"].token == hash_secret(login_session["token"])
                assert await service.validate_csrf(login_session["token"], login_session["csrfToken"])
                assert not await service.validate_csrf(login_session["token"], "wrong-token")

                legacy = AppSession(
                    user_id=user.id,
                    token="legacy-plaintext-session",
                    expires_at=login_session["expiresAt"],
                )
                session.add(legacy)
                await session.commit()
                migrated = await service.get_session_user("legacy-plaintext-session")
                assert migrated and migrated["session"].token == hash_secret("legacy-plaintext-session")

            await engine.dispose()

    asyncio.run(run())


def test_paid_order_credits_tokens_once():
    async def run():
        with tempfile.TemporaryDirectory(prefix="ailis-payment-test-") as temp_dir:
            database = Path(temp_dir) / "payment.db"
            engine = create_async_engine(
                f"sqlite+aiosqlite:///{database}",
                connect_args={"check_same_thread": False},
            )
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
            async with session_factory() as session:
                service = AccountService(session)
                user = await service.create_user("payment-flow@example.invalid", "correct-horse-battery")
                await service.create_payment_order(
                    user_id=user.id,
                    order_no="AILIS_TEST_ORDER_001",
                    provider="wechat",
                    package_id="monthly",
                    amount_fen=990,
                    token_amount=100000,
                )
                paid = await service.credit_paid_order(
                    order_no="AILIS_TEST_ORDER_001",
                    provider_trade_id="wx_trade_001",
                    expected_provider="wechat",
                    expected_amount_fen=990,
                )
                retried = await service.credit_paid_order(
                    order_no="AILIS_TEST_ORDER_001",
                    provider_trade_id="wx_trade_001",
                    expected_provider="wechat",
                    expected_amount_fen=990,
                )
                assert paid and retried and retried.status == "paid"
                assert await service.get_token_balance(user.id) == 100000
                assert len(await service.list_token_ledger(user.id)) == 1
                charged = await service.charge_api_request(
                    user_id=user.id,
                    endpoint="model",
                    token_cost=250,
                    reference_id="request-001",
                )
                duplicate_charge = await service.charge_api_request(
                    user_id=user.id,
                    endpoint="model",
                    token_cost=250,
                    reference_id="request-001",
                )
                assert charged and duplicate_charge
                assert await service.get_token_balance(user.id) == 99750
                assert len(await service.list_token_ledger(user.id)) == 2
                assert await service.authorize_api_request(
                    user_id=user.id,
                    endpoint="model",
                    monthly_limit=100000,
                    token_cost=500,
                    reference_id="request-002",
                ) == ""
                assert await service.get_token_balance(user.id) == 99250
                assert await service.authorize_api_request(
                    user_id=user.id,
                    endpoint="model",
                    monthly_limit=1,
                    token_cost=1,
                    reference_id="request-003",
                ) == "quota"

            await engine.dispose()

    asyncio.run(run())


def test_domestic_payment_crypto_boundaries():
    def private_pem(key):
        return key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption(),
        ).decode()

    def public_pem(key):
        return key.public_key().public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        ).decode()

    old = {
        name: getattr(payment_settings, name)
        for name in (
            "APP_WECHAT_PAY_APP_ID",
            "APP_WECHAT_PAY_MCH_ID",
            "APP_WECHAT_PAY_SERIAL_NO",
            "APP_WECHAT_PAY_PLATFORM_SERIAL_NO",
            "APP_WECHAT_PAY_PRIVATE_KEY_PEM",
            "APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM",
            "APP_WECHAT_PAY_API_V3_KEY",
            "APP_ALIPAY_APP_ID",
            "APP_ALIPAY_PRIVATE_KEY_PEM",
            "APP_ALIPAY_PUBLIC_KEY_PEM",
        )
    }
    merchant_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    platform_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    api_v3_key = "0123456789abcdef0123456789abcdef"
    try:
        payment_settings.APP_WECHAT_PAY_APP_ID = "wx_test_app"
        payment_settings.APP_WECHAT_PAY_MCH_ID = "mch_test"
        payment_settings.APP_WECHAT_PAY_SERIAL_NO = "serial_test"
        payment_settings.APP_WECHAT_PAY_PLATFORM_SERIAL_NO = "platform_serial_test"
        payment_settings.APP_WECHAT_PAY_PRIVATE_KEY_PEM = private_pem(merchant_key)
        payment_settings.APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM = public_pem(platform_key)
        payment_settings.APP_WECHAT_PAY_API_V3_KEY = api_v3_key

        wx_data = {
            "appid": "wx_test_app",
            "mchid": "mch_test",
            "out_trade_no": "AILIS_TEST_ORDER_001",
            "transaction_id": "wx_transaction_001",
            "trade_state": "SUCCESS",
            "amount": {"total": 990},
        }
        wx_nonce = "0123456789ab"
        wx_aad = "test-aad"
        wx_ciphertext = AESGCM(api_v3_key.encode()).encrypt(
            wx_nonce.encode(),
            json.dumps(wx_data, separators=(",", ":")).encode(),
            wx_aad.encode(),
        )
        wx_body = json.dumps({
            "resource": {
                "algorithm": "AEAD_AES_256_GCM",
                "nonce": wx_nonce,
                "associated_data": wx_aad,
                "ciphertext": base64.b64encode(wx_ciphertext).decode(),
            },
        }, separators=(",", ":")).encode()
        wx_timestamp = str(int(time.time()))
        wx_message = f"{wx_timestamp}\nnonce-test\n{wx_body.decode()}\n".encode()
        wx_signature = base64.b64encode(platform_key.sign(
            wx_message,
            padding.PKCS1v15(),
            hashes.SHA256(),
        )).decode()
        wx_event = WechatPayProvider().parse_notification(wx_body, {
            "Wechatpay-Serial": "platform_serial_test",
            "Wechatpay-Timestamp": wx_timestamp,
            "Wechatpay-Nonce": "nonce-test",
            "Wechatpay-Signature": wx_signature,
        })
        assert wx_event.status == "paid"
        assert wx_event.amount_fen == 990

        payment_settings.APP_ALIPAY_APP_ID = "alipay_test_app"
        payment_settings.APP_ALIPAY_PRIVATE_KEY_PEM = private_pem(merchant_key)
        payment_settings.APP_ALIPAY_PUBLIC_KEY_PEM = public_pem(merchant_key)
        alipay_values = {
            "app_id": "alipay_test_app",
            "out_trade_no": "AILIS_TEST_ORDER_002",
            "trade_no": "ali_trade_001",
            "total_amount": "9.90",
            "trade_status": "TRADE_SUCCESS",
        }
        alipay_signature = AlipayProvider()._sign_params(alipay_values)
        alipay_body = urlencode({**alipay_values, "sign": alipay_signature}).encode()
        ali_event = AlipayProvider().parse_notification(alipay_body, {})
        assert ali_event.status == "paid"
        assert ali_event.amount_fen == 990
    finally:
        for name, value in old.items():
            setattr(payment_settings, name, value)


def test_email_verification_and_password_reset_tokens():
    async def run():
        with tempfile.TemporaryDirectory(prefix="ailis-account-token-test-") as temp_dir:
            database = Path(temp_dir) / "account.db"
            engine = create_async_engine(
                f"sqlite+aiosqlite:///{database}",
                connect_args={"check_same_thread": False},
            )
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
            async with session_factory() as session:
                service = AccountService(session)
                user = await service.create_user("token-flow@example.invalid", "old-password-123")
                verify_token = await service.issue_account_token(
                    user.id, "email_verification", timedelta(hours=1)
                )
                consumed = await service.consume_account_token(verify_token, "email_verification")
                assert consumed and consumed.user_id == user.id
                await service.mark_email_verified(user.id)

                reset_token = await service.issue_account_token(
                    user.id, "password_reset", timedelta(minutes=10)
                )
                assert await service.reset_password_with_token(reset_token, "new-password-123")
                refreshed = await service.get_user_by_id(user.id)
                assert refreshed and verify_password("new-password-123", refreshed.password_hash)
                assert not await service.reset_password_with_token(reset_token, "third-password-123")

            await engine.dispose()

    asyncio.run(run())
