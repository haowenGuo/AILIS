import asyncio
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass


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
    ):
        self.requests_per_minute = max(1, int(requests_per_minute))
        self.max_concurrent = max(1, int(max_concurrent))
        self._lock = asyncio.Lock()
        self._sessions: dict[str, _SessionWindow] = {}

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
