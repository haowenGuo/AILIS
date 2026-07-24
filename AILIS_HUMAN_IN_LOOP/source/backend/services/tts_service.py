import asyncio
import json
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

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


class ElevenLabsTTSServiceError(RuntimeError):
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
