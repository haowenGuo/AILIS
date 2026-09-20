"""Payment wire-protocol tests with independent signatures and an isolated ledger.

No merchant credentials, external requests, or production database are used.
"""

import base64
import json
import tempfile
import time
import unittest
from datetime import timedelta
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlencode

import httpx
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from backend.api import token_payments as routes
from backend.core.database import Base, get_db
from backend.models import db_models, edu_models  # noqa: F401
from backend.services.account_service import AccountService, ensure_aware_utc, now_utc
from backend.services import payment_providers as providers


def sign(key, message):
    return base64.b64encode(key.sign(message, padding.PKCS1v15(), hashes.SHA256())).decode()


def private_pem(key):
    return key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8,
                             serialization.NoEncryption()).decode()


def public_pem(key):
    return key.public_key().public_bytes(serialization.Encoding.PEM,
                                       serialization.PublicFormat.SubjectPublicKeyInfo).decode()


class DomesticPaymentProtocolTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.merchant = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        self.platform = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        self.config = patch.multiple(
            providers.settings,
            APP_PUBLIC_BASE_URL="https://ailis.example",
            APP_WECHAT_PAY_ENABLED=True,
            APP_WECHAT_PAY_APP_ID="wx_test",
            APP_WECHAT_PAY_MCH_ID="mch_test",
            APP_WECHAT_PAY_SERIAL_NO="merchant_serial",
            APP_WECHAT_PAY_PLATFORM_SERIAL_NO="PUB_KEY_ID_TEST",
            APP_WECHAT_PAY_PRIVATE_KEY_PEM=private_pem(self.merchant),
            APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM=public_pem(self.platform),
            APP_WECHAT_PAY_API_V3_KEY="0123456789abcdef0123456789abcdef",
            APP_WECHAT_PAY_API_BASE="https://wechat.example",
            APP_ALIPAY_ENABLED=True,
            APP_ALIPAY_APP_ID="ali_test",
            APP_ALIPAY_PRIVATE_KEY_PEM=private_pem(self.merchant),
            APP_ALIPAY_PUBLIC_KEY_PEM=public_pem(self.platform),
            APP_ALIPAY_GATEWAY="https://alipay.example/gateway.do",
            APP_MEMBERSHIP_PLANS_JSON=json.dumps([
                {"id": "monthly", "amountFen": 990, "monthlyTokens": 1000, "title": "Monthly"}
            ]),
        )
        self.config.start()
        self.addCleanup(self.config.stop)
        self.temp = tempfile.TemporaryDirectory(prefix="ailis-payment-protocol-")
        self.addCleanup(self.temp.cleanup)
        self.engine = create_async_engine(f"sqlite+aiosqlite:///{Path(self.temp.name) / 'test.db'}")
        self.addAsyncCleanup(self.engine.dispose)
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        self.sessions = async_sessionmaker(self.engine, expire_on_commit=False)
        async with self.sessions() as db:
            self.user = await AccountService(db).create_user("payments@example.invalid", "test-password-123")
        self.app = FastAPI()
        self.app.include_router(routes.router, prefix="/api")

        async def db_override():
            async with self.sessions() as db:
                yield db

        self.app.dependency_overrides[get_db] = db_override
        self.app.dependency_overrides[routes.require_app_user] = lambda: self.user
        self.client = httpx.AsyncClient(transport=httpx.ASGITransport(app=self.app), base_url="https://test")
        self.addAsyncCleanup(self.client.aclose)
        self.http_client = httpx.AsyncClient

    def mock_provider_http(self, handler):
        return patch.object(providers.httpx, "AsyncClient", side_effect=lambda **kwargs:
                            self.http_client(transport=httpx.MockTransport(handler), **kwargs))

    def wechat_headers(self, body):
        timestamp = str(int(time.time()))
        return {
            "Wechatpay-Serial": "PUB_KEY_ID_TEST",
            "Wechatpay-Timestamp": timestamp,
            "Wechatpay-Nonce": "test_nonce",
            "Wechatpay-Signature": sign(self.platform, timestamp.encode() + b"\ntest_nonce\n" + body + b"\n"),
        }

    def wechat_notification(self, order_no, amount=990):
        data = {"appid": "wx_test", "mchid": "mch_test", "out_trade_no": order_no,
                "transaction_id": "wx_trade_1", "trade_state": "SUCCESS",
                "amount": {"total": amount, "currency": "CNY"}}
        ciphertext = AESGCM(providers.settings.APP_WECHAT_PAY_API_V3_KEY.encode()).encrypt(
            b"0123456789ab", json.dumps(data).encode(), b"transaction")
        body = json.dumps({"resource": {"algorithm": "AEAD_AES_256_GCM", "nonce": "0123456789ab",
                                       "associated_data": "transaction",
                                       "ciphertext": base64.b64encode(ciphertext).decode()}}).encode()
        return body, self.wechat_headers(body)

    def alipay_notification(self, order_no, amount="9.90", status="TRADE_SUCCESS"):
        values = {"app_id": "ali_test", "out_trade_no": order_no, "trade_no": "ali_trade_1",
                  "total_amount": amount, "trade_status": status, "subject": "AILIS 月卡 + 额度&服务"}
        # The platform signs decoded values. Form URL encoding is a later transport step.
        message = "&".join(f"{key}={values[key]}" for key in sorted(values)).encode()
        return urlencode({**values, "sign_type": "RSA2", "sign": sign(self.platform, message)}).encode()

    async def order(self, provider):
        async with self.sessions() as db:
            return await AccountService(db).create_payment_order(
                user_id=self.user.id, order_no="test_order_001", provider=provider,
                package_id="monthly", amount_fen=990, token_amount=1000)

    async def balance(self):
        async with self.sessions() as db:
            return await AccountService(db).get_token_balance(self.user.id)

    async def test_wechat_order_fits_protocol_and_selects_verification_key(self):
        def handler(request):
            data = json.loads(request.content)
            self.assertLessEqual(len(data["out_trade_no"]), 32)
            self.assertEqual(request.headers.get("Wechatpay-Serial"), "PUB_KEY_ID_TEST")
            self.assertEqual(data["notify_url"], "https://ailis.example/api/payments/wechat/notify")
            body = b'{"code_url":"weixin://wxpay/test"}'
            return httpx.Response(200, content=body, headers=self.wechat_headers(body))
        with self.mock_provider_http(handler):
            response = await self.client.post("/api/payments/orders", json={"provider": "wechat", "planId": "monthly"})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["qrCode"], "weixin://wxpay/test")

    async def test_wechat_unsigned_order_response_rejected(self):
        with self.mock_provider_http(lambda _: httpx.Response(
            200, json={"code_url": "weixin://unverified"}, headers={"Wechatpay-Serial": "PUB_KEY_ID_TEST"}
        )):
            with self.assertRaises(providers.PaymentProviderError):
                await providers.WechatPayProvider().create_order(
                    providers.PaymentOrderRequest("test_order", "Monthly", 990, "https://test/notify"))

    async def test_wechat_callback_acknowledged_once(self):
        order = await self.order("wechat")
        body, headers = self.wechat_notification(order.order_no)
        for _ in range(2):
            response = await self.client.post("/api/payments/wechat/notify", content=body, headers=headers)
            self.assertEqual(response.status_code, 204, response.text)
            self.assertEqual(response.content, b"")
        self.assertEqual(await self.balance(), 1000)

    async def test_wechat_unknown_key_rejected(self):
        body, headers = self.wechat_notification("test_order")
        headers["Wechatpay-Serial"] = "PUB_KEY_ID_OTHER"
        with self.assertRaises(providers.PaymentProviderError):
            providers.WechatPayProvider().parse_notification(body, headers)

    async def test_wechat_stale_signature_rejected(self):
        body, headers = self.wechat_notification("test_order")
        headers["Wechatpay-Timestamp"] = "1720000000"
        headers["Wechatpay-Signature"] = sign(self.platform, b"1720000000\ntest_nonce\n" + body + b"\n")
        with self.assertRaises(providers.PaymentProviderError):
            providers.WechatPayProvider().parse_notification(body, headers)

    async def test_alipay_request_signature_and_signed_response(self):
        def handler(request):
            values = {key: value[0] for key, value in parse_qs(request.content.decode()).items()}
            signature = base64.b64decode(values.pop("sign"))
            message = "&".join(f"{key}={values[key]}" for key in sorted(values)).encode()
            self.merchant.public_key().verify(signature, message, padding.PKCS1v15(), hashes.SHA256())
            # Preserve non-canonical whitespace and Unicode escapes in the signed JSON object.
            data = json.dumps({"code": "10000", "out_trade_no": "test_order",
                               "qr_code": "https://qr.alipay.example/付款", "msg": 'a } \\" value'}, indent=2)
            body = '{"sign":' + json.dumps(sign(self.platform, data.encode())) + ',"alipay_trade_precreate_response":' + data + '}'
            return httpx.Response(200, content=body.encode())
        with self.mock_provider_http(handler):
            result = await providers.AlipayProvider().create_order(
                providers.PaymentOrderRequest("test_order", "AILIS 月卡 + 额度", 990, "https://test/notify"))
        self.assertIn("qr.alipay.example", result.qr_code)

    async def test_alipay_unsigned_response_rejected(self):
        with self.mock_provider_http(lambda _: httpx.Response(200, json={
            "alipay_trade_precreate_response": {"code": "10000", "qr_code": "https://unverified"}
        })):
            with self.assertRaises(providers.PaymentProviderError):
                await providers.AlipayProvider().create_order(
                    providers.PaymentOrderRequest("test_order", "Monthly", 990, "https://test/notify"))

    async def test_alipay_tampered_response_rejected(self):
        data = '{"code":"10000","out_trade_no":"test_order","qr_code":"https://valid"}'
        body = '{"alipay_trade_precreate_response":' + data.replace("https://valid", "https://changed")
        body += ',"sign":' + json.dumps(sign(self.platform, data.encode())) + '}'
        with self.mock_provider_http(lambda _: httpx.Response(200, content=body)):
            with self.assertRaises(providers.PaymentProviderError):
                await providers.AlipayProvider().create_order(
                    providers.PaymentOrderRequest("test_order", "Monthly", 990, "https://test/notify"))

    async def test_alipay_callback_returns_plain_success_and_credits_once(self):
        order = await self.order("alipay")
        for _ in range(2):
            response = await self.client.post("/api/payments/alipay/notify", content=self.alipay_notification(order.order_no))
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(response.text, "success")
            self.assertTrue(response.headers["content-type"].startswith("text/plain"))
        self.assertEqual(await self.balance(), 1000)

    async def test_alipay_unpaid_callback_acknowledges_without_credit(self):
        order = await self.order("alipay")
        response = await self.client.post("/api/payments/alipay/notify", content=self.alipay_notification(
            order.order_no, status="WAIT_BUYER_PAY"))
        self.assertEqual(response.text, "success")
        self.assertEqual(await self.balance(), 0)

    async def test_provider_timeout_records_failed_order_without_credit(self):
        def handler(request):
            raise httpx.ReadTimeout("test timeout", request=request)
        with self.mock_provider_http(handler):
            response = await self.client.post("/api/payments/orders", json={"provider": "wechat", "planId": "monthly"})
        self.assertEqual(response.status_code, 502)
        async with self.sessions() as db:
            orders = await AccountService(db).list_payment_orders(self.user.id)
            self.assertEqual([order.status for order in orders], ["failed"])
        self.assertEqual(await self.balance(), 0)

    async def test_bad_callback_never_credits(self):
        order = await self.order("wechat")
        body, headers = self.wechat_notification(order.order_no, amount=1)
        response = await self.client.post("/api/payments/wechat/notify", content=body, headers=headers)
        self.assertEqual(response.status_code, 400)
        headers["Wechatpay-Signature"] = "not-a-signature"
        response = await self.client.post("/api/payments/wechat/notify", content=body, headers=headers)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(await self.balance(), 0)

    async def test_duplicate_paid_order_still_checks_amount(self):
        order = await self.order("wechat")
        async with self.sessions() as db:
            service = AccountService(db)
            await service.credit_paid_order(order_no=order.order_no, provider_trade_id="wx_trade_1",
                                            expected_provider="wechat", expected_amount_fen=990)
            for provider, amount, trade in [("wechat", 1, "wx_trade_1"),
                                            ("alipay", 990, "wx_trade_1"),
                                            ("wechat", 990, "other_trade")]:
                with self.subTest(provider=provider, amount=amount, trade=trade):
                    with self.assertRaises(ValueError):
                        await service.credit_paid_order(order_no=order.order_no, provider_trade_id=trade,
                                                        expected_provider=provider, expected_amount_fen=amount)

    async def test_renewal_keeps_remaining_membership_days(self):
        order = await self.order("wechat")
        async with self.sessions() as db:
            service = AccountService(db)
            user = await service.get_user_by_id(self.user.id)
            previous_end = now_utc() + timedelta(days=20)
            user.membership_expires_at = previous_end
            user.membership_status = "active"
            await db.commit()
            await service.credit_paid_order(order_no=order.order_no, provider_trade_id="wx_trade_1",
                                            expected_provider="wechat", expected_amount_fen=990)
            self.assertEqual(ensure_aware_utc(user.membership_expires_at), previous_end + timedelta(days=30))


if __name__ == "__main__":
    unittest.main()
