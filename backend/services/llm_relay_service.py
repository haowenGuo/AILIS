import asyncio
import hashlib
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass

from backend.infrastructure.redis_state import AsyncStateStore, RedisStateStore


class LlmRelayLimitError(RuntimeError):
    def __init__(self, reason: str, retry_after: int = 1):
        super().__init__(reason)
        self.reason = reason
        self.retry_after = max(1, int(retry_after))


@dataclass
class _SessionWindow:
    started_at: float
    requests: int = 0
    in_flight: int = 0
    last_seen_at: float = 0


class LlmRelayGuard:
    def __init__(
        self,
        *,
        requests_per_minute: int = 30,
        max_concurrent: int = 2,
        state_store: AsyncStateStore | None = None,
        namespace: str = "default",
    ):
        self.requests_per_minute = max(1, int(requests_per_minute))
        self.max_concurrent = max(1, int(max_concurrent))
        self._lock = asyncio.Lock()
        self._sessions: dict[str, _SessionWindow] = {}
        self._state_store = state_store
        self._namespace = namespace

    @property
    def distributed(self) -> bool:
        return isinstance(self._state_store, RedisStateStore)

    def _cleanup(self, now: float) -> None:
        expired = [
            session_id
            for session_id, window in self._sessions.items()
            if window.in_flight == 0 and now - window.last_seen_at > 10 * 60
        ]
        for session_id in expired:
            self._sessions.pop(session_id, None)

    @asynccontextmanager
    async def acquire(self, session_id: str):
        if self.distributed:
            await self._acquire_redis(session_id)
            try:
                yield
            finally:
                await self._release_redis(session_id)
            return

        now = time.monotonic()
        async with self._lock:
            self._cleanup(now)
            window = self._sessions.get(session_id)
            if not window or now - window.started_at >= 60:
                window = _SessionWindow(started_at=now, last_seen_at=now)
                self._sessions[session_id] = window
            if window.requests >= self.requests_per_minute:
                retry_after = max(1, int(60 - (now - window.started_at)))
                raise LlmRelayLimitError("rate_limit", retry_after)
            if window.in_flight >= self.max_concurrent:
                raise LlmRelayLimitError("concurrency_limit", 2)
            window.requests += 1
            window.in_flight += 1
            window.last_seen_at = now

        try:
            yield
        finally:
            async with self._lock:
                current = self._sessions.get(session_id)
                if current:
                    current.in_flight = max(0, current.in_flight - 1)
                    current.last_seen_at = time.monotonic()

    async def _acquire_redis(self, session_id: str) -> None:
        """Atomically reserve rate and concurrency slots in Redis."""
        assert isinstance(self._state_store, RedisStateStore)
        now = time.time()
        bucket = int(now // 60)
        scope = hashlib.sha256(session_id.encode("utf-8")).hexdigest()[:32]
        prefix = f"ailis:relay:{self._namespace}:{scope}"
        rate_key = f"{prefix}:rate:{bucket}"
        inflight_key = f"{prefix}:inflight"
        script = """
        local rate_count = tonumber(redis.call('GET', KEYS[1]) or '0')
        local inflight = tonumber(redis.call('GET', KEYS[2]) or '0')
        if rate_count >= tonumber(ARGV[1]) then return {0, 0} end
        if inflight >= tonumber(ARGV[2]) then return {0, 1} end
        rate_count = redis.call('INCR', KEYS[1])
        redis.call('EXPIRE', KEYS[1], 61)
        redis.call('INCR', KEYS[2])
        redis.call('EXPIRE', KEYS[2], 900)
        return {1, 0}
        """
        result = await self._state_store.eval(
            script,
            [rate_key, inflight_key],
            [self.requests_per_minute, self.max_concurrent],
        )
        allowed = bool(result and int(result[0]) == 1)
        if allowed:
            return
        reason = "concurrency_limit" if result and int(result[1]) == 1 else "rate_limit"
        retry_after = 2 if reason == "concurrency_limit" else max(1, int(60 - (now % 60)))
        raise LlmRelayLimitError(reason, retry_after)

    async def _release_redis(self, session_id: str) -> None:
        assert isinstance(self._state_store, RedisStateStore)
        scope = hashlib.sha256(session_id.encode("utf-8")).hexdigest()[:32]
        key = f"ailis:relay:{self._namespace}:{scope}:inflight"
        script = """
        local current = tonumber(redis.call('GET', KEYS[1]) or '0')
        if current > 0 then redis.call('DECR', KEYS[1]) end
        return 1
        """
        await self._state_store.eval(script, [key], [])
