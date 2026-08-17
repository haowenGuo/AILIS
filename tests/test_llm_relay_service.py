import unittest

from backend.services.llm_relay_service import LlmRelayGuard, LlmRelayLimitError


class LlmRelayGuardTests(unittest.IsolatedAsyncioTestCase):
    async def test_limits_concurrency_per_signed_session(self):
        guard = LlmRelayGuard(requests_per_minute=10, max_concurrent=1)
        lease = guard.acquire("session-a")
        await lease.__aenter__()
        try:
            with self.assertRaises(LlmRelayLimitError) as raised:
                async with guard.acquire("session-a"):
                    pass
            self.assertEqual(raised.exception.reason, "concurrency_limit")
        finally:
            await lease.__aexit__(None, None, None)

    async def test_limits_requests_per_minute(self):
        guard = LlmRelayGuard(requests_per_minute=1, max_concurrent=2)
        async with guard.acquire("session-b"):
            pass
        with self.assertRaises(LlmRelayLimitError) as raised:
            async with guard.acquire("session-b"):
                pass
        self.assertEqual(raised.exception.reason, "rate_limit")


if __name__ == "__main__":
    unittest.main()
