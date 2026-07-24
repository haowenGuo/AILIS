# backend/services/tts_service.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。
- 文件类型：`source-code`
- 原始行数：175
- SHA-256：`24459a4f4a2831a86833347809e507137afbdef9dbac5c8d85980418182c978c`
- 可运行副本：[打开源文件](../../../../source/backend/services/tts_service.py)
- 依赖：`asyncio`、`json`、`dataclasses`、`typing`、`urllib.error`、`urllib.parse`、`urllib.request`、`backend.core.config`
- 主要符号：`TTSAlignmentResult`、`TTSResult`、`ElevenLabsTTSServiceError`、`ElevenLabsTTSService`、`__init__`、`synthesize`、`_build_payload`、`_build_request_url`、`_post_with_timestamps`、`_extract_error_message`、`_parse_alignment`、`_guess_mime_type`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 3 | <code>from dataclasses import dataclass</code> | 导入 Python 依赖 `dataclasses`，供本模块调用其类型、函数或常量。 |
| 4 | <code>from typing import Any</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from urllib.error import HTTPError, URLError</code> | 导入 Python 依赖 `urllib.error`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from urllib.parse import quote, urlencode</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from urllib.request import Request, urlopen</code> | 导入 Python 依赖 `urllib.request`，供本模块调用其类型、函数或常量。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>@dataclass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 16 | <code>class TTSAlignmentResult:</code> | 定义 Python 类 `TTSAlignmentResult`，封装相关状态、协议和方法。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 17 | <code>    characters: list[str]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 18 | <code>    character_start_times_seconds: list[float]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 19 | <code>    character_end_times_seconds: list[float]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>@dataclass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 23 | <code>class TTSResult:</code> | 定义 Python 类 `TTSResult`，封装相关状态、协议和方法。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 24 | <code>    audio_base64: str</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 25 | <code>    audio_format: str</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 26 | <code>    mime_type: str</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 27 | <code>    alignment: TTSAlignmentResult &#124; None = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 28 | <code>    normalized_alignment: TTSAlignmentResult &#124; None = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>class ElevenLabsTTSServiceError(RuntimeError):</code> | 定义 Python 类 `ElevenLabsTTSServiceError`，封装相关状态、协议和方法。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 32 | <code>    pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>class ElevenLabsTTSService:</code> | 定义 Python 类 `ElevenLabsTTSService`，封装相关状态、协议和方法。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 36 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 37 | <code>    使用 ElevenLabs 的 with-timestamps 接口一次性返回音频与字符级时间戳。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>    这样做的好处：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 40 | <code>    1. 后端仍然只调用一次 ElevenLabs，满足“整段文本一次性送入”的要求</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 41 | <code>    2. 前端拿到 alignment 后，可以把文字显示节奏与声音更自然地对齐</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 42 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    def __init__(self):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 45 | <code>        self.api_base = settings.ELEVENLABS_API_BASE.rstrip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 46 | <code>        self.api_key = settings.ELEVENLABS_API_KEY</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 47 | <code>        self.voice_id = settings.ELEVENLABS_VOICE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 48 | <code>        self.model_id = settings.ELEVENLABS_MODEL_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 49 | <code>        self.output_format = settings.ELEVENLABS_OUTPUT_FORMAT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 50 | <code>        self.language_code = settings.ELEVENLABS_LANGUAGE_CODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 51 | <code>        self.timeout_seconds = settings.ELEVENLABS_TIMEOUT_SECONDS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 52 | <code>        self.enable_logging = settings.ELEVENLABS_ENABLE_LOGGING</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 53 | <code>        self.optimize_streaming_latency = settings.ELEVENLABS_OPTIMIZE_STREAMING_LATENCY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>        if not self.api_key:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 56 | <code>            raise ElevenLabsTTSServiceError("缺少 ELEVENLABS_API_KEY 配置")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 57 | <code>        if not self.voice_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 58 | <code>            raise ElevenLabsTTSServiceError("缺少 ELEVENLABS_VOICE_ID 配置")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>    async def synthesize(self, text: str) -&gt; TTSResult:</code> | 定义 Python 函数 `synthesize`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 61 | <code>        clean_text = (text or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 62 | <code>        if not clean_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 63 | <code>            raise ElevenLabsTTSServiceError("TTS 输入文本不能为空")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>        payload = self._build_payload(clean_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 66 | <code>        response_json = await asyncio.to_thread(self._post_with_timestamps, payload)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>        audio_base64 = response_json.get("audio_base64", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 69 | <code>        if not audio_base64:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 70 | <code>            raise ElevenLabsTTSServiceError("ElevenLabs 返回的音频为空")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>        return TTSResult(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 73 | <code>            audio_base64=audio_base64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 74 | <code>            audio_format=self.output_format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 75 | <code>            mime_type=self._guess_mime_type(self.output_format),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 76 | <code>            alignment=self._parse_alignment(response_json.get("alignment")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 77 | <code>            normalized_alignment=self._parse_alignment(response_json.get("normalized_alignment"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 78 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    def _build_payload(self, text: str) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_build_payload`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 81 | <code>        payload: dict[str, Any] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 82 | <code>            "text": text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 83 | <code>            "model_id": self.model_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 84 | <code>            "voice_settings": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 85 | <code>                "stability": settings.ELEVENLABS_STABILITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 86 | <code>                "similarity_boost": settings.ELEVENLABS_SIMILARITY_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 87 | <code>                "style": settings.ELEVENLABS_STYLE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 88 | <code>                "speed": settings.ELEVENLABS_SPEED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 89 | <code>                "use_speaker_boost": settings.ELEVENLABS_USE_SPEAKER_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 90 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>        if self.language_code:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 94 | <code>            payload["language_code"] = self.language_code</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>        return payload</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>    def _build_request_url(self) -&gt; str:</code> | 定义 Python 函数 `_build_request_url`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 99 | <code>        query: dict[str, Any] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 100 | <code>            "output_format": self.output_format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 101 | <code>            "enable_logging": str(self.enable_logging).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 102 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>        if self.optimize_streaming_latency is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 105 | <code>            query["optimize_streaming_latency"] = self.optimize_streaming_latency</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 108 | <code>            f"{self.api_base}/v1/text-to-speech/{quote(self.voice_id)}/with-timestamps"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 109 | <code>            f"?{urlencode(query)}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 110 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>    def _post_with_timestamps(self, payload: dict[str, Any]) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_post_with_timestamps`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 113 | <code>        request = Request(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 114 | <code>            url=self._build_request_url(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 115 | <code>            data=json.dumps(payload).encode("utf-8"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 116 | <code>            headers={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 117 | <code>                "Content-Type": "application/json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 118 | <code>                "Accept": "application/json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 119 | <code>                "xi-api-key": self.api_key,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 120 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>            method="POST"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 122 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 125 | <code>            with urlopen(request, timeout=self.timeout_seconds) as response:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 126 | <code>                raw = response.read().decode("utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 127 | <code>                return json.loads(raw)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 128 | <code>        except HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 129 | <code>            error_text = exc.read().decode("utf-8", errors="ignore")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 130 | <code>            raise ElevenLabsTTSServiceError(</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 131 | <code>                f"HTTP {exc.code}: {self._extract_error_message(error_text)}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 132 | <code>            ) from exc</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 133 | <code>        except URLError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 134 | <code>            raise ElevenLabsTTSServiceError(f"网络请求失败: {exc.reason}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 135 | <code>        except json.JSONDecodeError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 136 | <code>            raise ElevenLabsTTSServiceError("ElevenLabs 返回了无法解析的 JSON") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 139 | <code>    def _extract_error_message(error_text: str) -&gt; str:</code> | 定义 Python 函数 `_extract_error_message`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 140 | <code>        if not error_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 141 | <code>            return "未知错误"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 142 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 143 | <code>            payload = json.loads(error_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 144 | <code>        except json.JSONDecodeError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 145 | <code>            return error_text.strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>        detail = payload.get("detail")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 148 | <code>        if isinstance(detail, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 149 | <code>            return detail.get("message") or json.dumps(detail, ensure_ascii=False)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 150 | <code>        if isinstance(detail, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 151 | <code>            return detail</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 152 | <code>        return payload.get("message") or error_text.strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 155 | <code>    def _parse_alignment(payload: Any) -&gt; TTSAlignmentResult &#124; None:</code> | 定义 Python 函数 `_parse_alignment`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 156 | <code>        if not isinstance(payload, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 157 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>        return TTSAlignmentResult(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 160 | <code>            characters=payload.get("characters") or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 161 | <code>            character_start_times_seconds=payload.get("character_start_times_seconds") or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 162 | <code>            character_end_times_seconds=payload.get("character_end_times_seconds") or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 163 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 166 | <code>    def _guess_mime_type(output_format: str) -&gt; str:</code> | 定义 Python 函数 `_guess_mime_type`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 167 | <code>        if output_format.startswith("mp3"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 168 | <code>            return "audio/mpeg"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 169 | <code>        if output_format.startswith("wav"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 170 | <code>            return "audio/wav"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 171 | <code>        if output_format.startswith("pcm"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 172 | <code>            return "audio/pcm"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 173 | <code>        if output_format.startswith("ulaw") or output_format.startswith("mulaw") or output_format.startswith("alaw"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 174 | <code>            return "audio/basic"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 175 | <code>        return "application/octet-stream"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
