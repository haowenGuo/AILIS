"""微信支付 API v3 与支付宝 RSA2 的最小服务端适配边界。

支付密钥只从 Settings 读取，绝不从请求体读取，也不写入数据库。这个模块
只负责三件事：创建订单、验证/解密回调、把回调转换成统一的内部事件。
订单入账和 Token 发放仍由 AccountService 在数据库事务中完成。
"""

from __future__ import annotations

import base64
import json
import secrets
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Protocol
from urllib.parse import parse_qs

import httpx
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from backend.core.config import get_settings


settings = get_settings()


class PaymentProviderError(RuntimeError):
    """外部支付通道配置错误、签名错误或请求失败。"""


@dataclass(frozen=True)
class PaymentOrderRequest:
    order_no: str
    title: str
    amount_fen: int
    notify_url: str


@dataclass(frozen=True)
class PaymentOrderResult:
    provider: str
    order_no: str
    status: str
    qr_code: str = ""
    checkout_url: str = ""
    provider_trade_id: str = ""


@dataclass(frozen=True)
class PaymentNotification:
    provider: str
    order_no: str
    provider_trade_id: str
    amount_fen: int
    status: str
    provider_subscription_id: str = ""
    raw: dict[str, Any] | None = None


class PaymentProvider(Protocol):
    provider: str

    @property
    def ready(self) -> bool: ...

    async def create_order(self, request: PaymentOrderRequest) -> PaymentOrderResult: ...

    def parse_notification(
        self,
        raw_body: bytes,
        headers: dict[str, str],
    ) -> PaymentNotification: ...


def _secret_text(value: str, path: str) -> str:
    if value and value.strip():
        return value.replace("\\n", "\n").strip()
    if path and Path(path).is_file():
        return Path(path).read_text(encoding="utf-8")
    return ""


def _load_private_key(value: str, path: str):
    pem = _secret_text(value, path).encode("utf-8")
    if not pem:
        raise PaymentProviderError("支付私钥未配置")
    try:
        return serialization.load_pem_private_key(pem, password=None)
    except (ValueError, TypeError) as exc:
        raise PaymentProviderError("支付私钥格式无效") from exc


def _load_public_key(value: str, path: str):
    pem = _secret_text(value, path).encode("utf-8")
    if not pem:
        raise PaymentProviderError("支付平台公钥未配置")
    try:
        return serialization.load_pem_public_key(pem)
    except (ValueError, TypeError) as exc:
        raise PaymentProviderError("支付平台公钥格式无效") from exc


def _header(headers: dict[str, str], name: str) -> str:
    target = name.lower()
    for key, value in headers.items():
        if key.lower() == target:
            return str(value or "")
    return ""


def _verify_rsa_sha256(public_key, message: bytes, signature_b64: str) -> None:
    if not signature_b64:
        raise PaymentProviderError("支付回调缺少签名")
    try:
        signature = base64.b64decode(signature_b64, validate=True)
        public_key.verify(signature, message, padding.PKCS1v15(), hashes.SHA256())
    except Exception as exc:
        raise PaymentProviderError("支付回调签名验证失败") from exc


def _notify_url(path: str) -> str:
    base = settings.APP_PUBLIC_BASE_URL.rstrip("/")
    if not base:
        raise PaymentProviderError("APP_PUBLIC_BASE_URL 未配置")
    return f"{base}/{path.lstrip('/')}"


class WechatPayProvider:
    provider = "wechat"

    @property
    def ready(self) -> bool:
        return bool(
            settings.APP_WECHAT_PAY_APP_ID
            and settings.APP_WECHAT_PAY_MCH_ID
            and settings.APP_WECHAT_PAY_SERIAL_NO
            and settings.APP_WECHAT_PAY_PLATFORM_SERIAL_NO
            and len(settings.APP_WECHAT_PAY_API_V3_KEY.encode("utf-8")) == 32
            and _secret_text(
                settings.APP_WECHAT_PAY_PRIVATE_KEY_PEM,
                settings.APP_WECHAT_PAY_PRIVATE_KEY_PATH,
            )
            and _secret_text(
                settings.APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM,
                settings.APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PATH,
            )
        )

    def _private_key(self):
        return _load_private_key(
            settings.APP_WECHAT_PAY_PRIVATE_KEY_PEM,
            settings.APP_WECHAT_PAY_PRIVATE_KEY_PATH,
        )

    def _platform_key(self):
        return _load_public_key(
            settings.APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PEM,
            settings.APP_WECHAT_PAY_PLATFORM_PUBLIC_KEY_PATH,
        )

    def _authorization(self, method: str, path: str, body: str) -> dict[str, str]:
        timestamp = str(int(time.time()))
        nonce = secrets.token_urlsafe(16)
        message = f"{method}\n{path}\n{timestamp}\n{nonce}\n{body}\n".encode("utf-8")
        signature = self._private_key().sign(
            message,
            padding.PKCS1v15(),
            hashes.SHA256(),
        )
        signature_b64 = base64.b64encode(signature).decode("ascii")
        token = (
            'WECHATPAY2-SHA256-RSA2048 '
            f'mchid="{settings.APP_WECHAT_PAY_MCH_ID}",'
            f'nonce_str="{nonce}",'
            f'signature="{signature_b64}",'
            f'timestamp="{timestamp}",'
            f'serial_no="{settings.APP_WECHAT_PAY_SERIAL_NO}"'
        )
        return {
            "Authorization": token,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Wechatpay-Serial": settings.APP_WECHAT_PAY_PLATFORM_SERIAL_NO,
        }

    def _verify_message(self, body: bytes, headers: dict[str, str]) -> None:
        serial = _header(headers, "Wechatpay-Serial")
        configured_serial = settings.APP_WECHAT_PAY_PLATFORM_SERIAL_NO.strip()
        if not configured_serial or serial != configured_serial:
            raise PaymentProviderError("微信支付响应平台证书序列号不匹配")
        timestamp = _header(headers, "Wechatpay-Timestamp")
        nonce = _header(headers, "Wechatpay-Nonce")
        signature = _header(headers, "Wechatpay-Signature")
        if not timestamp or not nonce or not signature:
            raise PaymentProviderError("微信支付报文缺少验签头")
        try:
            recent = abs(time.time() - int(timestamp)) <= 300
        except ValueError as exc:
            raise PaymentProviderError("微信支付报文时间戳无效") from exc
        if not recent:
            raise PaymentProviderError("微信支付报文已过期")
        message = f"{timestamp}\n{nonce}\n".encode("utf-8") + body + b"\n"
        _verify_rsa_sha256(self._platform_key(), message, signature)

    def _verify_response(self, response: httpx.Response) -> None:
        self._verify_message(response.content, dict(response.headers))

    async def create_order(self, request: PaymentOrderRequest) -> PaymentOrderResult:
        if not self.ready:
            raise PaymentProviderError("微信支付通道尚未完成 API v3 配置")
        path = "/v3/pay/transactions/native"
        payload = {
            "appid": settings.APP_WECHAT_PAY_APP_ID,
            "mchid": settings.APP_WECHAT_PAY_MCH_ID,
            "description": request.title[:127],
            "out_trade_no": request.order_no,
            "notify_url": request.notify_url,
            "amount": {"total": int(request.amount_fen), "currency": "CNY"},
        }
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        headers = self._authorization("POST", path, body)
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    f"{settings.APP_WECHAT_PAY_API_BASE.rstrip('/')}{path}",
                    headers=headers,
                    content=body.encode("utf-8"),
                )
        except httpx.RequestError as exc:
            raise PaymentProviderError("微信支付下单网络请求失败") from exc
        if response.status_code >= 400:
            raise PaymentProviderError(f"微信支付下单失败：HTTP {response.status_code}")
        self._verify_response(response)
        data = response.json()
        code_url = str(data.get("code_url") or "")
        if not code_url:
            raise PaymentProviderError("微信支付下单响应缺少 code_url")
        return PaymentOrderResult(
            provider=self.provider,
            order_no=request.order_no,
            status="pending",
            qr_code=code_url,
        )

    def parse_notification(
        self,
        raw_body: bytes,
        headers: dict[str, str],
    ) -> PaymentNotification:
        self._verify_message(raw_body, headers)
        try:
            envelope = json.loads(raw_body.decode("utf-8"))
            resource = envelope["resource"]
            if resource.get("algorithm") != "AEAD_AES_256_GCM":
                raise PaymentProviderError("微信支付回调使用了不支持的加密算法")
            key = settings.APP_WECHAT_PAY_API_V3_KEY.encode("utf-8")
            plaintext = AESGCM(key).decrypt(
                resource["nonce"].encode("utf-8"),
                base64.b64decode(resource["ciphertext"]),
                resource.get("associated_data", "").encode("utf-8"),
            )
            data = json.loads(plaintext.decode("utf-8"))
        except PaymentProviderError:
            raise
        except Exception as exc:
            raise PaymentProviderError("微信支付回调解密失败") from exc
        if data.get("appid") != settings.APP_WECHAT_PAY_APP_ID:
            raise PaymentProviderError("微信支付回调 appid 不匹配")
        if data.get("mchid") != settings.APP_WECHAT_PAY_MCH_ID:
            raise PaymentProviderError("微信支付回调 mchid 不匹配")
        trade_state = str(data.get("trade_state") or "")
        amount_data = data.get("amount") or {}
        amount = amount_data.get("total")
        if type(amount) is not int or amount <= 0 or amount_data.get("currency", "CNY") != "CNY":
            raise PaymentProviderError("微信支付回调金额或币种无效")
        return PaymentNotification(
            provider=self.provider,
            order_no=str(data.get("out_trade_no") or ""),
            provider_trade_id=str(data.get("transaction_id") or ""),
            amount_fen=amount,
            status="paid" if trade_state == "SUCCESS" else trade_state.lower() or "pending",
            raw=data,
        )


class AlipayProvider:
    provider = "alipay"

    @property
    def ready(self) -> bool:
        return bool(
            settings.APP_ALIPAY_APP_ID
            and _secret_text(settings.APP_ALIPAY_PRIVATE_KEY_PEM, settings.APP_ALIPAY_PRIVATE_KEY_PATH)
            and _secret_text(settings.APP_ALIPAY_PUBLIC_KEY_PEM, settings.APP_ALIPAY_PUBLIC_KEY_PATH)
        )

    def _private_key(self):
        return _load_private_key(settings.APP_ALIPAY_PRIVATE_KEY_PEM, settings.APP_ALIPAY_PRIVATE_KEY_PATH)

    def _public_key(self):
        return _load_public_key(settings.APP_ALIPAY_PUBLIC_KEY_PEM, settings.APP_ALIPAY_PUBLIC_KEY_PATH)

    def _sign_params(self, params: dict[str, str]) -> str:
        # Sign raw values; httpx applies form encoding only when sending the request.
        canonical = "&".join(
            f"{key}={value}"
            for key, value in sorted(params.items())
            if key != "sign" and value is not None and value != ""
        )
        signature = self._private_key().sign(
            canonical.encode("utf-8"),
            padding.PKCS1v15(),
            hashes.SHA256(),
        )
        return base64.b64encode(signature).decode("ascii")

    def _verified_response(self, raw: str) -> dict[str, Any]:
        # Decode top-level values while retaining the original signed JSON bytes.
        # Re-serializing the object would change whitespace, escapes, or key order.
        decoder = json.JSONDecoder()
        values, originals = {}, {}
        try:
            text = raw.strip()
            if not text.startswith("{"):
                raise ValueError("not an object")
            position = 1
            while True:
                position += len(text[position:]) - len(text[position:].lstrip())
                key, position = decoder.raw_decode(text, position)
                if not isinstance(key, str) or key in values:
                    raise ValueError("invalid or duplicate field")
                position += len(text[position:]) - len(text[position:].lstrip())
                if text[position] != ":":
                    raise ValueError("missing colon")
                position += 1
                position += len(text[position:]) - len(text[position:].lstrip())
                start = position
                values[key], position = decoder.raw_decode(text, position)
                originals[key] = text[start:position]
                position += len(text[position:]) - len(text[position:].lstrip())
                if text[position:] == "}":
                    break
                if text[position] != ",":
                    raise ValueError("invalid separator")
                position += 1
            name = "alipay_trade_precreate_response"
            data = values[name]
            signature = values["sign"]
            if not isinstance(data, dict) or not isinstance(signature, str):
                raise ValueError("invalid response fields")
        except (ValueError, KeyError, IndexError) as exc:
            raise PaymentProviderError("支付宝下单响应缺少有效的签名数据") from exc
        _verify_rsa_sha256(self._public_key(), originals[name].encode("utf-8"), signature)
        return data

    async def create_order(self, request: PaymentOrderRequest) -> PaymentOrderResult:
        if not self.ready:
            raise PaymentProviderError("支付宝通道尚未完成 RSA2 配置")
        params = {
            "app_id": settings.APP_ALIPAY_APP_ID,
            "method": "alipay.trade.precreate",
            "format": "JSON",
            "charset": "utf-8",
            "sign_type": "RSA2",
            "timestamp": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S"),
            "version": "1.0",
            "notify_url": request.notify_url,
            "biz_content": json.dumps({
                "out_trade_no": request.order_no,
                "total_amount": f"{Decimal(request.amount_fen) / Decimal(100):.2f}",
                "subject": request.title[:256],
            }, ensure_ascii=False, separators=(",", ":")),
        }
        params["sign"] = self._sign_params(params)
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(settings.APP_ALIPAY_GATEWAY, data=params)
        except httpx.RequestError as exc:
            raise PaymentProviderError("支付宝下单网络请求失败") from exc
        if response.status_code >= 400:
            raise PaymentProviderError(f"支付宝下单失败：HTTP {response.status_code}")
        data = self._verified_response(response.text)
        if str(data.get("code")) != "10000" or not data.get("qr_code"):
            raise PaymentProviderError(f"支付宝下单失败：{data.get('sub_msg') or data.get('msg') or '未知错误'}")
        if data.get("out_trade_no") != request.order_no:
            raise PaymentProviderError("支付宝下单响应订单号不匹配")
        return PaymentOrderResult(
            provider=self.provider,
            order_no=request.order_no,
            status="pending",
            qr_code=str(data["qr_code"]),
        )

    def parse_notification(
        self,
        raw_body: bytes,
        headers: dict[str, str],
    ) -> PaymentNotification:
        del headers
        try:
            fields = parse_qs(raw_body.decode("utf-8"), keep_blank_values=True)
        except UnicodeDecodeError as exc:
            raise PaymentProviderError("支付宝回调编码无效") from exc
        if any(len(items) != 1 for items in fields.values()):
            raise PaymentProviderError("支付宝回调含重复参数")
        values = {key: items[0] for key, items in fields.items()}
        signature = values.pop("sign", "")
        if values.pop("sign_type", "RSA2") != "RSA2":
            raise PaymentProviderError("支付宝回调签名类型不支持")
        if not signature:
            raise PaymentProviderError("支付宝回调缺少签名")
        canonical = "&".join(
            f"{key}={value}"
            for key, value in sorted(values.items())
            if value is not None and value != ""
        )
        _verify_rsa_sha256(self._public_key(), canonical.encode("utf-8"), signature)
        if values.get("app_id") != settings.APP_ALIPAY_APP_ID:
            raise PaymentProviderError("支付宝回调 app_id 不匹配")
        try:
            amount = Decimal(values.get("total_amount", "0")) * 100
            if not amount.is_finite() or amount <= 0 or amount != amount.to_integral_value():
                raise ValueError("invalid amount")
            amount_fen = int(amount)
        except (InvalidOperation, ValueError) as exc:
            raise PaymentProviderError("支付宝回调金额无效") from exc
        trade_status = values.get("trade_status", "")
        return PaymentNotification(
            provider=self.provider,
            order_no=values.get("out_trade_no", ""),
            provider_trade_id=values.get("trade_no", ""),
            amount_fen=amount_fen,
            status="paid" if trade_status in {"TRADE_SUCCESS", "TRADE_FINISHED"} else trade_status.lower() or "pending",
            raw=values,
        )


def create_payment_provider(provider: str) -> PaymentProvider:
    if provider == "wechat":
        return WechatPayProvider()
    if provider == "alipay":
        return AlipayProvider()
    raise PaymentProviderError(f"不支持的支付通道：{provider}")


def provider_ready(provider: str) -> bool:
    return create_payment_provider(provider).ready
