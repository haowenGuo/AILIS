import asyncio
import base64
import tempfile
import unittest
from pathlib import Path

from backend.services.tts_service import EdgeTTSService, EdgeTTSServiceError


class FakeCommunicator:
    calls = []

    def __init__(self, text, **settings):
        self.text = text
        self.settings = settings
        type(self).calls.append((text, settings))

    async def save(self, output_path):
        await asyncio.sleep(0.01)
        Path(output_path).write_bytes(f"audio:{self.text}".encode("utf-8"))


class EdgeTTSCacheTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        FakeCommunicator.calls = []
        self.temp_dir = tempfile.TemporaryDirectory()
        self.service = EdgeTTSService(
            cache_dir=self.temp_dir.name,
            communicator_factory=FakeCommunicator,
            voice="zh-CN-XiaoyiNeural",
            rate="-8%",
            pitch="+12Hz",
            volume="-2%",
            cache_max_bytes=0,
            cache_ttl_seconds=0,
        )

    async def asyncTearDown(self):
        self.temp_dir.cleanup()

    async def test_second_request_reads_persistent_cache(self):
        first = await self.service.synthesize("欢迎回来呀。")
        second = await self.service.synthesize("欢迎回来呀。")

        self.assertFalse(first.cache_hit)
        self.assertTrue(second.cache_hit)
        self.assertEqual(first.audio_base64, second.audio_base64)
        self.assertEqual(base64.b64decode(first.audio_base64), "audio:欢迎回来呀。".encode())
        self.assertEqual(len(FakeCommunicator.calls), 1)
        self.assertEqual(first.provider, "edge")
        self.assertEqual(first.voice, "zh-CN-XiaoyiNeural")

    async def test_concurrent_identical_requests_only_synthesize_once(self):
        results = await asyncio.gather(*[
            self.service.synthesize("今天也辛苦了。")
            for _ in range(4)
        ])

        self.assertEqual(len(FakeCommunicator.calls), 1)
        self.assertEqual(sum(result.cache_hit for result in results), 3)
        self.assertEqual(len({result.audio_base64 for result in results}), 1)

    async def test_rejects_oversized_text_before_network_call(self):
        service = EdgeTTSService(
            cache_dir=self.temp_dir.name,
            communicator_factory=FakeCommunicator,
            max_text_chars=4,
            cache_max_bytes=0,
            cache_ttl_seconds=0,
        )

        with self.assertRaisesRegex(EdgeTTSServiceError, "超过 4 字符"):
            await service.synthesize("一二三四五")
        self.assertEqual(FakeCommunicator.calls, [])


if __name__ == "__main__":
    unittest.main()
