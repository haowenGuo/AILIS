from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path
from typing import Iterable

import httpx

if __package__ in {None, ""}:
    CURRENT_DIR = Path(__file__).resolve().parent
    if str(CURRENT_DIR) not in sys.path:
        sys.path.insert(0, str(CURRENT_DIR))
    from models import LegacySafetyResponse, SafetyCheckResponse
else:
    from .models import LegacySafetyResponse, SafetyCheckResponse


DEFAULT_BASE_URL = os.getenv("AIGRIL_SAFETY_BASE_URL", "https://airi-backend.onrender.com")
PLACEHOLDER_RISK_TYPES = {
    "无",
    "none",
    "unknown",
    "no risk",
    "未识别",
    "未识别风险类型",
    "无明确风险类型",
    "未命中任何指定风险类型",
}


class AISafetyClientError(RuntimeError):
    """Raised when the example client cannot reach or parse the API response."""


class AISafetyClient:
    """
    Small sync client for the AIGril safety API.

    This class keeps the example simple on purpose:
    - no custom auth
    - no retries
    - response models are plain dataclasses
    """

    def __init__(self, base_url: str = DEFAULT_BASE_URL, timeout: float = 60.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.trust_env = False

    def check_content(
        self,
        content: str,
        *,
        task_type: str = "content_safety_check",
        extra: str | None = None,
    ) -> SafetyCheckResponse:
        payload = {
            "content": content,
            "task_type": task_type,
            "extra": extra,
        }
        try:
            with httpx.Client(timeout=self.timeout, trust_env=self.trust_env) as client:
                response = client.post(f"{self.base_url}/api/safety/check", json=payload)
                response.raise_for_status()
                return SafetyCheckResponse.from_dict(response.json())
        except httpx.HTTPError as exc:
            raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc

    def check_content_legacy(
        self,
        content: str,
        *,
        task_type: str = "content_safety_check",
        extra: str | None = None,
    ) -> LegacySafetyResponse:
        payload = {
            "task_type": task_type,
            "params": {"content": content},
            "extra": extra,
        }
        try:
            with httpx.Client(timeout=self.timeout, trust_env=self.trust_env) as client:
                response = client.post(f"{self.base_url}/api/handle", json=payload)
                response.raise_for_status()
                return LegacySafetyResponse.from_dict(response.json())
        except httpx.HTTPError as exc:
            raise AISafetyClientError(f"Failed to call /api/handle: {exc}") from exc

    @staticmethod
    def should_block(risk_level: str) -> bool:
        return risk_level in {"中风险", "高风险"}

    @staticmethod
    def decision_from_risk_level(risk_level: str) -> str:
        if risk_level == "高风险":
            return "block"
        if risk_level == "中风险":
            return "review"
        return "allow"

    @staticmethod
    def cleaned_risk_types(risk_types: Iterable[str]) -> list[str]:
        return [
            item
            for item in risk_types
            if item and item not in PLACEHOLDER_RISK_TYPES
        ]


class AISafetyAsyncClient:
    """Async client for higher-throughput moderation tasks."""

    def __init__(self, base_url: str = DEFAULT_BASE_URL, timeout: float = 60.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.trust_env = False

    @staticmethod
    def decision_from_risk_level(risk_level: str) -> str:
        return AISafetyClient.decision_from_risk_level(risk_level)

    @staticmethod
    def cleaned_risk_types(risk_types: Iterable[str]) -> list[str]:
        return AISafetyClient.cleaned_risk_types(risk_types)

    async def check_content(
        self,
        content: str,
        *,
        task_type: str = "content_safety_check",
        extra: str | None = None,
        client: httpx.AsyncClient | None = None,
    ) -> SafetyCheckResponse:
        payload = {
            "content": content,
            "task_type": task_type,
            "extra": extra,
        }
        if client is not None:
            try:
                response = await client.post(f"{self.base_url}/api/safety/check", json=payload)
                response.raise_for_status()
                return SafetyCheckResponse.from_dict(response.json())
            except httpx.HTTPError as exc:
                raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc

        try:
            async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as internal_client:
                response = await internal_client.post(f"{self.base_url}/api/safety/check", json=payload)
                response.raise_for_status()
                return SafetyCheckResponse.from_dict(response.json())
        except httpx.HTTPError as exc:
            raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc

    async def check_many(
        self,
        contents: Iterable[str],
        *,
        task_type: str = "content_safety_check",
        extra: str | None = None,
    ) -> list[SafetyCheckResponse]:
        async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as client:
            tasks = [
                self.check_content(content, task_type=task_type, extra=extra, client=client)
                for content in contents
            ]
            return list(await asyncio.gather(*tasks))

    async def check_many_safe(
        self,
        contents: Iterable[str],
        *,
        task_type: str = "content_safety_check",
        extra: str | None = None,
    ) -> list[tuple[str, SafetyCheckResponse | None, str | None]]:
        input_items = list(contents)
        async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as client:
            tasks = [
                self.check_content(content, task_type=task_type, extra=extra, client=client)
                for content in input_items
            ]
            gathered = await asyncio.gather(*tasks, return_exceptions=True)

        normalized_results: list[tuple[str, SafetyCheckResponse | None, str | None]] = []
        for original_content, item in zip(input_items, gathered):
            if isinstance(item, Exception):
                normalized_results.append((original_content, None, str(item)))
            else:
                normalized_results.append((original_content, item, None))
        return normalized_results
