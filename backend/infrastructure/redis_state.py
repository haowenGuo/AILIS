"""Small async state adapter used by distributed-capable services.

The default backend is process-local so existing development deployments keep
the same behavior. Production can set REDIS_URL and select the Redis backend.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol


class AsyncStateStore(Protocol):
    async def get(self, key: str) -> str | None: ...

    async def set(self, key: str, value: str, *, ttl_seconds: int | None = None) -> None: ...

    async def delete(self, key: str) -> None: ...

    async def close(self) -> None: ...


@dataclass
class _MemoryValue:
    value: str
    expires_at: float | None = None


class InMemoryStateStore:
    """Compatibility backend for local development and single-process use."""

    def __init__(self) -> None:
        self._values: dict[str, _MemoryValue] = {}

    async def get(self, key: str) -> str | None:
        import time

        item = self._values.get(key)
        if item is None:
            return None
        if item.expires_at is not None and item.expires_at <= time.monotonic():
            self._values.pop(key, None)
            return None
        return item.value

    async def set(self, key: str, value: str, *, ttl_seconds: int | None = None) -> None:
        import time

        self._values[key] = _MemoryValue(
            value=value,
            expires_at=(time.monotonic() + ttl_seconds) if ttl_seconds else None,
        )

    async def delete(self, key: str) -> None:
        self._values.pop(key, None)

    async def close(self) -> None:
        self._values.clear()


class RedisStateStore:
    """Redis adapter loaded lazily so Redis remains optional for local runs."""

    def __init__(self, url: str) -> None:
        if not url.strip():
            raise ValueError("REDIS_URL is required for the Redis state backend")
        try:
            from redis.asyncio import Redis
        except ImportError as error:  # pragma: no cover - depends on deployment extras
            raise RuntimeError("Install the redis package to use REDIS_URL") from error
        self._client = Redis.from_url(url, decode_responses=True)

    async def get(self, key: str) -> str | None:
        return await self._client.get(key)

    async def set(self, key: str, value: str, *, ttl_seconds: int | None = None) -> None:
        await self._client.set(key, value, ex=ttl_seconds)

    async def delete(self, key: str) -> None:
        await self._client.delete(key)

    async def close(self) -> None:
        await self._client.aclose()

    async def eval(self, script: str, keys: list[str], args: list[Any]) -> Any:
        return await self._client.eval(script, len(keys), *(keys + args))


def create_state_store(*, backend: str, redis_url: str) -> AsyncStateStore:
    if backend.strip().lower() == "redis":
        return RedisStateStore(redis_url)
    return InMemoryStateStore()

