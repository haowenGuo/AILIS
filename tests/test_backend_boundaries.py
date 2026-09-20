import asyncio
from pathlib import Path

from backend.core.config import Settings
from backend.infrastructure.object_storage import LocalObjectStorage
from backend.infrastructure.redis_state import InMemoryStateStore
from backend.services.llm_relay_service import LlmRelayGuard, LlmRelayLimitError


def test_default_state_store_keeps_local_behavior():
    store = InMemoryStateStore()
    guard = LlmRelayGuard(
        requests_per_minute=1,
        max_concurrent=1,
        state_store=store,
        namespace="test",
    )

    async def run():
        async with guard.acquire("session-a"):
            try:
                async with guard.acquire("session-a"):
                    raise AssertionError("second request should be rejected")
            except LlmRelayLimitError as error:
                assert error.reason == "rate_limit"

    asyncio.run(run())


def test_local_object_storage_rejects_path_escape(tmp_path: Path):
    storage = LocalObjectStorage(tmp_path)

    async def run():
        await storage.put_bytes("a/b.txt", b"ok")
        assert await storage.get_bytes("a/b.txt") == b"ok"
        try:
            await storage.put_bytes("../outside.txt", b"no")
        except ValueError:
            return
        raise AssertionError("path traversal was accepted")

    asyncio.run(run())


def test_postgres_pool_settings_are_explicit():
    settings = Settings(DATABASE_URL="postgresql+asyncpg://db/app")
    assert settings.DATABASE_POOL_SIZE == 10
    assert settings.DATABASE_MAX_OVERFLOW == 20
