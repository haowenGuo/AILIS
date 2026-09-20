"""Stable LLM Gateway boundary used by HTTP APIs and future gateway workers."""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any, Protocol

from backend.services.hosted_agent_service import HostedAgentRuntimeClient


class LlmGateway(Protocol):
    async def health(self) -> dict[str, Any]: ...

    async def llm_status(self) -> dict[str, Any]: ...

    async def run_llm_completion(self, payload: dict[str, Any]) -> dict[str, Any]: ...

    def stream_llm_completion(self, payload: dict[str, Any]) -> AsyncIterator[bytes]: ...

    async def aclose(self) -> None: ...


def create_llm_gateway() -> HostedAgentRuntimeClient:
    """Return the current hosted-runtime adapter behind the stable boundary."""
    return HostedAgentRuntimeClient()

