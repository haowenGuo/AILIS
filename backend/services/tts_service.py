import asyncio
import base64
import hashlib
import json
import os
import time
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

import edge_tts

from backend.core.config import get_settings


settings = get_settings()

@dataclass
class TTSAlignmentResult:
    characters: list[str]
    character_start_times_seconds: list[float]
    character_end_times_seconds: list[float]


@dataclass
class TTSResult:
    audio_base64: str
    audio_format: str
    mime_type: str
    alignment: TTSAlignmentResult | None = None
    normalized_alignment: TTSAlignmentResult | None = None
    provider: str = ""
    voice: str = ""
    cache_hit: bool = False


class TTSServiceError(RuntimeError):
    pass


class EdgeTTSServiceError(TTSServiceError):
    pass


class EdgeTTSService:
    """Microsoft Edge neural TTS with a bounded persistent MP3 cache."""

    _cache_locks: dict[str, asyncio.Lock] = {}
    _last_prune_at = 0.0

    def __init__(
        self,
        *,
        cache_dir: str | Path | None = None,
        communicator_factory=None,
        voice: str | None = None,
        rate: str | None = None,
        pitch: str | None = None,
        volume: str | None = None,
        timeout_seconds: int | None = None,
        max_text_chars: int | None = None,
        cache_max_bytes: int | None = None,
        cache_ttl_seconds: int | None = None,
    ):
        configured_cache_dir = cache_dir or settings.EDGE_TTS_CACHE_DIR
        self.cache_dir = Path(configured_cache_dir or Path(settings.DATA_DIR) / "tts-cache")
        self.communicator_factory = communicator_factory or edge_tts.Communicate
        self.voice = (voice or settings.EDGE_TTS_VOICE).strip()
        self.rate = (rate or settings.EDGE_TTS_RATE).strip()
        self.pitch = (pitch or settings.EDGE_TTS_PITCH).strip()
        self.volume = (volume or settings.EDGE_TTS_VOLUME).strip()
        self.timeout_seconds = max(1, int(timeout_seconds or settings.EDGE_TTS_TIMEOUT_SECONDS))
        self.max_text_chars = max(1, int(max_text_chars or settings.EDGE_TTS_MAX_TEXT_CHARS))
        self.cache_max_bytes = max(0, int(
            settings.EDGE_TTS_CACHE_MAX_BYTES if cache_max_bytes is None else cache_max_bytes
        ))
        self.cache_ttl_seconds = max(0, int(
            settings.EDGE_TTS_CACHE_TTL_SECONDS if cache_ttl_seconds is None else cache_ttl_seconds
        ))

        if not self.voice:
            raise EdgeTTSServiceError("缺少 EDGE_TTS_VOICE 配置")

    async def synthesize(self, text: str) -> TTSResult:
        clean_text = " ".join((text or "").split())
        if not clean_text:
            raise EdgeTTSServiceError("TTS 输入文本不能为空")
        if len(clean_text) > self.max_text_chars:
            raise EdgeTTSServiceError(
                f"TTS 输入文本超过 {self.max_text_chars} 字符限制"
            )

        cache_key = self._build_cache_key(clean_text)
        cache_path = self.cache_dir / cache_key[:2] / f"{cache_key}.mp3"
        cached = await self._read_cache(cache_path)
        if cached:
            return self._build_result(cached, cache_hit=True)

        lock = self._cache_locks.setdefault(cache_key, asyncio.Lock())
        async with lock:
            cached = await self._read_cache(cache_path)
            if cached:
                return self._build_result(cached, cache_hit=True)

            audio = await self._synthesize_and_cache(clean_text, cache_path)
            self._schedule_cache_prune()
            return self._build_result(audio, cache_hit=False)

    def _build_cache_key(self, text: str) -> str:
        payload = json.dumps(
            {
                "engine": "edge-tts-v1",
                "pitch": self.pitch,
                "rate": self.rate,
                "text": text,
                "voice": self.voice,
                "volume": self.volume,
            },
            ensure_ascii=False,
            separators=(",", ":"),
            sort_keys=True,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    async def _read_cache(self, cache_path: Path) -> bytes | None:
        def read() -> bytes | None:
            try:
                payload = cache_path.read_bytes()
                if not payload:
                    cache_path.unlink(missing_ok=True)
                    return None
                os.utime(cache_path, None)
                return payload
            except FileNotFoundError:
                return None
            except OSError:
                return None

        return await asyncio.to_thread(read)

    async def _synthesize_and_cache(self, text: str, cache_path: Path) -> bytes:
        await asyncio.to_thread(cache_path.parent.mkdir, parents=True, exist_ok=True)
        temp_path = cache_path.with_name(f".{cache_path.name}.{uuid.uuid4().hex}.tmp")
        communicator = self.communicator_factory(
            text,
            voice=self.voice,
            rate=self.rate,
            pitch=self.pitch,
            volume=self.volume,
        )

        try:
            await asyncio.wait_for(
                communicator.save(str(temp_path)),
                timeout=self.timeout_seconds,
            )
            audio = await asyncio.to_thread(temp_path.read_bytes)
            if not audio:
                raise EdgeTTSServiceError("Edge TTS 返回的音频为空")
            await asyncio.to_thread(os.replace, temp_path, cache_path)
            return audio
        except TimeoutError as exc:
            raise EdgeTTSServiceError(
                f"Edge TTS 请求超时（{self.timeout_seconds}s）"
            ) from exc
        except EdgeTTSServiceError:
            raise
        except Exception as exc:
            raise EdgeTTSServiceError(f"Edge TTS 请求失败: {exc}") from exc
        finally:
            await asyncio.to_thread(temp_path.unlink, missing_ok=True)

    def _build_result(self, audio: bytes, *, cache_hit: bool) -> TTSResult:
        return TTSResult(
            audio_base64=base64.b64encode(audio).decode("ascii"),
            audio_format="mp3",
            mime_type="audio/mpeg",
            provider="edge",
            voice=self.voice,
            cache_hit=cache_hit,
        )

    def _schedule_cache_prune(self) -> None:
        now = time.monotonic()
        if now - type(self)._last_prune_at < 3600:
            return
        type(self)._last_prune_at = now
        asyncio.create_task(asyncio.to_thread(self._prune_cache))

    def _prune_cache(self) -> None:
        try:
            files = [path for path in self.cache_dir.rglob("*.mp3") if path.is_file()]
        except OSError:
            return

        now = time.time()
        entries: list[tuple[Path, float, int]] = []
        for path in files:
            try:
                stat = path.stat()
            except OSError:
                continue
            if self.cache_ttl_seconds and now - stat.st_mtime > self.cache_ttl_seconds:
                path.unlink(missing_ok=True)
                continue
            entries.append((path, stat.st_mtime, stat.st_size))

        if not self.cache_max_bytes:
            return
        total_bytes = sum(size for _, _, size in entries)
        for path, _, size in sorted(entries, key=lambda entry: entry[1]):
            if total_bytes <= self.cache_max_bytes:
                break
            try:
                path.unlink(missing_ok=True)
                total_bytes -= size
            except OSError:
                continue


class ElevenLabsTTSServiceError(TTSServiceError):
    pass


class ElevenLabsTTSService:
    """
    使用 ElevenLabs 的 with-timestamps 接口一次性返回音频与字符级时间戳。

    这样做的好处：
    1. 后端仍然只调用一次 ElevenLabs，满足“整段文本一次性送入”的要求
    2. 前端拿到 alignment 后，可以把文字显示节奏与声音更自然地对齐
    """

    def __init__(self):
        self.api_base = settings.ELEVENLABS_API_BASE.rstrip("/")
        self.api_key = settings.ELEVENLABS_API_KEY
        self.voice_id = settings.ELEVENLABS_VOICE_ID
        self.model_id = settings.ELEVENLABS_MODEL_ID
        self.output_format = settings.ELEVENLABS_OUTPUT_FORMAT
        self.language_code = settings.ELEVENLABS_LANGUAGE_CODE
        self.timeout_seconds = settings.ELEVENLABS_TIMEOUT_SECONDS
        self.enable_logging = settings.ELEVENLABS_ENABLE_LOGGING
        self.optimize_streaming_latency = settings.ELEVENLABS_OPTIMIZE_STREAMING_LATENCY

        if not self.api_key:
            raise ElevenLabsTTSServiceError("缺少 ELEVENLABS_API_KEY 配置")
        if not self.voice_id:
            raise ElevenLabsTTSServiceError("缺少 ELEVENLABS_VOICE_ID 配置")

    async def synthesize(self, text: str) -> TTSResult:
        clean_text = (text or "").strip()
        if not clean_text:
            raise ElevenLabsTTSServiceError("TTS 输入文本不能为空")

        payload = self._build_payload(clean_text)
        response_json = await asyncio.to_thread(self._post_with_timestamps, payload)

        audio_base64 = response_json.get("audio_base64", "")
        if not audio_base64:
            raise ElevenLabsTTSServiceError("ElevenLabs 返回的音频为空")

        return TTSResult(
            audio_base64=audio_base64,
            audio_format=self.output_format,
            mime_type=self._guess_mime_type(self.output_format),
            alignment=self._parse_alignment(response_json.get("alignment")),
            normalized_alignment=self._parse_alignment(response_json.get("normalized_alignment"))
        )

    def _build_payload(self, text: str) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "text": text,
            "model_id": self.model_id,
            "voice_settings": {
                "stability": settings.ELEVENLABS_STABILITY,
                "similarity_boost": settings.ELEVENLABS_SIMILARITY_BOOST,
                "style": settings.ELEVENLABS_STYLE,
                "speed": settings.ELEVENLABS_SPEED,
                "use_speaker_boost": settings.ELEVENLABS_USE_SPEAKER_BOOST,
            },
        }

        if self.language_code:
            payload["language_code"] = self.language_code

        return payload

    def _build_request_url(self) -> str:
        query: dict[str, Any] = {
            "output_format": self.output_format,
            "enable_logging": str(self.enable_logging).lower()
        }

        if self.optimize_streaming_latency is not None:
            query["optimize_streaming_latency"] = self.optimize_streaming_latency

        return (
            f"{self.api_base}/v1/text-to-speech/{quote(self.voice_id)}/with-timestamps"
            f"?{urlencode(query)}"
        )

    def _post_with_timestamps(self, payload: dict[str, Any]) -> dict[str, Any]:
        request = Request(
            url=self._build_request_url(),
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "xi-api-key": self.api_key,
            },
            method="POST"
        )

        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                raw = response.read().decode("utf-8")
                return json.loads(raw)
        except HTTPError as exc:
            error_text = exc.read().decode("utf-8", errors="ignore")
            raise ElevenLabsTTSServiceError(
                f"HTTP {exc.code}: {self._extract_error_message(error_text)}"
            ) from exc
        except URLError as exc:
            raise ElevenLabsTTSServiceError(f"网络请求失败: {exc.reason}") from exc
        except json.JSONDecodeError as exc:
            raise ElevenLabsTTSServiceError("ElevenLabs 返回了无法解析的 JSON") from exc

    @staticmethod
    def _extract_error_message(error_text: str) -> str:
        if not error_text:
            return "未知错误"
        try:
            payload = json.loads(error_text)
        except json.JSONDecodeError:
            return error_text.strip()

        detail = payload.get("detail")
        if isinstance(detail, dict):
            return detail.get("message") or json.dumps(detail, ensure_ascii=False)
        if isinstance(detail, str):
            return detail
        return payload.get("message") or error_text.strip()

    @staticmethod
    def _parse_alignment(payload: Any) -> TTSAlignmentResult | None:
        if not isinstance(payload, dict):
            return None

        return TTSAlignmentResult(
            characters=payload.get("characters") or [],
            character_start_times_seconds=payload.get("character_start_times_seconds") or [],
            character_end_times_seconds=payload.get("character_end_times_seconds") or [],
        )

    @staticmethod
    def _guess_mime_type(output_format: str) -> str:
        if output_format.startswith("mp3"):
            return "audio/mpeg"
        if output_format.startswith("wav"):
            return "audio/wav"
        if output_format.startswith("pcm"):
            return "audio/pcm"
        if output_format.startswith("ulaw") or output_format.startswith("mulaw") or output_format.startswith("alaw"):
            return "audio/basic"
        return "application/octet-stream"


def create_tts_service():
    provider = (settings.TTS_PROVIDER or "edge").strip().lower()
    if provider == "edge":
        return EdgeTTSService()
    if provider in {"elevenlabs", "eleven-labs", "eleven_labs"}:
        return ElevenLabsTTSService()
    raise TTSServiceError(f"不支持的 TTS_PROVIDER: {provider}")
