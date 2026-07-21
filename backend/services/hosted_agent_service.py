import base64
import hashlib
import hmac
import json
import time
import uuid
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

import httpx

from backend.core.config import get_settings


settings = get_settings()


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")


@dataclass(frozen=True)
class HostedWebSession:
    session_id: str
    tenant_id: str
    token: str
    issued_at: int
    expires_at: int


class HostedWebSessionService:
    def __init__(self, secret: str | None = None, ttl_days: int | None = None):
        self.secret = (secret if secret is not None else settings.AILIS_WEB_SESSION_SECRET).strip()
        self.ttl_seconds = max(1, int(ttl_days or settings.AILIS_WEB_SESSION_TTL_DAYS)) * 86400

    @property
    def configured(self) -> bool:
        return len(self.secret) >= 24

    def _signature(self, encoded_payload: str) -> str:
        digest = hmac.new(
            self.secret.encode("utf-8"),
            encoded_payload.encode("ascii"),
            hashlib.sha256,
        ).digest()
        return _base64url_encode(digest)

    def issue(self, now: int | None = None) -> HostedWebSession:
        if not self.configured:
            raise RuntimeError("AILIS_WEB_SESSION_SECRET is not configured")
        issued_at = int(now or time.time())
        expires_at = issued_at + self.ttl_seconds
        session_id = uuid.uuid4().hex
        payload = {
            "v": 1,
            "sid": session_id,
            "iat": issued_at,
            "exp": expires_at,
        }
        encoded = _base64url_encode(
            json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
        )
        token = f"{encoded}.{self._signature(encoded)}"
        return HostedWebSession(
            session_id=session_id,
            tenant_id=f"web:{session_id}",
            token=token,
            issued_at=issued_at,
            expires_at=expires_at,
        )

    def verify(self, token: str, now: int | None = None) -> HostedWebSession | None:
        if not self.configured or not token or "." not in token:
            return None
        encoded, signature = token.split(".", 1)
        if not hmac.compare_digest(signature, self._signature(encoded)):
            return None
        try:
            payload = json.loads(_base64url_decode(encoded))
            session_id = str(payload.get("sid") or "").strip()
            issued_at = int(payload.get("iat") or 0)
            expires_at = int(payload.get("exp") or 0)
        except (ValueError, TypeError, json.JSONDecodeError):
            return None
        if payload.get("v") != 1 or not session_id or expires_at <= int(now or time.time()):
            return None
        return HostedWebSession(
            session_id=session_id,
            tenant_id=f"web:{session_id}",
            token=token,
            issued_at=issued_at,
            expires_at=expires_at,
        )


class HostedAgentRuntimeClient:
    def __init__(self):
        self.base_url = settings.AILIS_HOSTED_RUNTIME_URL.rstrip("/")
        self.internal_token = settings.AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN
        self.timeout = httpx.Timeout(
            max(30, settings.AILIS_HOSTED_RUNTIME_TIMEOUT_SECONDS),
            connect=10,
        )

    def _headers(self) -> dict[str, str]:
        headers = {"accept": "application/json"}
        if self.internal_token:
            headers["x-ailis-internal-token"] = self.internal_token
        return headers

    async def _request(
        self,
        method: str,
        path: str,
        *,
        payload: dict[str, Any] | None = None,
        timeout: httpx.Timeout | float | None = None,
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=timeout or self.timeout) as client:
            response = await client.request(
                method,
                f"{self.base_url}{path}",
                headers=self._headers(),
                json=payload,
            )
        response.raise_for_status()
        return response.json()

    async def health(self) -> dict[str, Any]:
        return await self._request("GET", "/health", timeout=10)

    async def tenant_status(self, tenant_id: str) -> dict[str, Any]:
        query = urlencode({"tenantId": tenant_id})
        return await self._request("GET", f"/tenant/status?{query}", timeout=30)

    async def recent_events(
        self,
        tenant_id: str,
        cursor: int = 0,
        limit: int = 100,
    ) -> dict[str, Any]:
        query = urlencode({
            "tenantId": tenant_id,
            "cursor": max(0, cursor),
            "limit": max(1, min(limit, 500)),
        })
        return await self._request("GET", f"/events/recent?{query}", timeout=30)

    async def run_agent(self, tenant_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/agent/run",
            payload={"tenantId": tenant_id, "payload": payload},
        )

    async def interrupt(self, tenant_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/agent/interrupt",
            payload={"tenantId": tenant_id, "payload": payload},
            timeout=30,
        )
