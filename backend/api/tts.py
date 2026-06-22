from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.schemas import (
    ChatRequest,
    ChatTextResponse,
    ChatTTSResponse,
    TTSAlignment,
    TTSSynthesizeRequest,
    TTSSynthesizeResponse,
)
from backend.core.database import get_db
from backend.services.conversation_service import ConversationService
from backend.services.reply_markup_service import parse_reply_markup
from backend.services.tts_service import ElevenLabsTTSService, ElevenLabsTTSServiceError


router = APIRouter()


def _to_pydantic_alignment(alignment) -> TTSAlignment | None:
    if alignment is None:
        return None

    return TTSAlignment(
        characters=alignment.characters,
        character_start_times_seconds=alignment.character_start_times_seconds,
        character_end_times_seconds=alignment.character_end_times_seconds
    )


def _estimate_duration_seconds(alignment) -> float | None:
    if alignment is None or not alignment.character_end_times_seconds:
        return None
    return max(alignment.character_end_times_seconds)


@router.post("/chat/tts", response_model=ChatTTSResponse)
async def chat_tts_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    一次性完成：
    1. 生成最终回复文本
    2. 解析动作 / 表情控制标签
    3. 调 ElevenLabs 生成音频与时间戳

    这个接口专门服务“完整文本 + 完整音频”场景，避免影响原有流式 /chat。
    """
    try:
        conversation_service = ConversationService(db)
        turn = await conversation_service.generate_complete_reply(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    parsed_reply = parse_reply_markup(turn.assistant_reply)
    if not parsed_reply.speech_text:
        raise HTTPException(status_code=502, detail="AI 回复为空，无法生成语音")

    try:
        tts_service = ElevenLabsTTSService()
        tts_result = await tts_service.synthesize(parsed_reply.speech_text)
    except ElevenLabsTTSServiceError as exc:
        print(f"[TTS Error] ElevenLabs 语音生成失败: {exc}")
        raise HTTPException(status_code=502, detail=f"ElevenLabs 语音生成失败：{exc}") from exc

    return ChatTTSResponse(
        session_id=turn.session_id,
        raw_text=parsed_reply.raw_text,
        display_text=parsed_reply.display_text,
        speech_text=parsed_reply.speech_text,
        audio_base64=tts_result.audio_base64,
        audio_format=tts_result.audio_format,
        mime_type=tts_result.mime_type,
        action=parsed_reply.action,
        expression=parsed_reply.expression,
        alignment=_to_pydantic_alignment(tts_result.alignment),
        normalized_alignment=_to_pydantic_alignment(tts_result.normalized_alignment),
        duration_hint_seconds=_estimate_duration_seconds(
            tts_result.normalized_alignment or tts_result.alignment
        ),
    )


@router.post("/tts/synthesize", response_model=TTSSynthesizeResponse)
async def tts_synthesize_endpoint(request: TTSSynthesizeRequest):
    """
    仅负责把已有文本交给 ElevenLabs 合成音频。

    桌面端 AILIS 的回复由本地 Agent Loop 产生，因此不能复用 /chat/tts
    的“生成回复 + 合成音频”一体流程，否则会绕开任务执行结果。
    """
    clean_text = (request.text or "").strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="TTS 输入文本不能为空")

    try:
        tts_service = ElevenLabsTTSService()
        tts_result = await tts_service.synthesize(clean_text)
    except ElevenLabsTTSServiceError as exc:
        print(f"[TTS Error] ElevenLabs 语音生成失败: {exc}")
        raise HTTPException(status_code=502, detail=f"ElevenLabs 语音生成失败：{exc}") from exc

    return TTSSynthesizeResponse(
        audio_base64=tts_result.audio_base64,
        audio_format=tts_result.audio_format,
        mime_type=tts_result.mime_type,
        alignment=_to_pydantic_alignment(tts_result.alignment),
        normalized_alignment=_to_pydantic_alignment(tts_result.normalized_alignment),
        duration_hint_seconds=_estimate_duration_seconds(
            tts_result.normalized_alignment or tts_result.alignment
        ),
    )


@router.post("/chat/text", response_model=ChatTextResponse)
async def chat_text_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    TTS 不可用时的降级接口：
    仍然生成完整文本，并保留动作/表情控制标签解析结果。
    """
    try:
        conversation_service = ConversationService(db)
        turn = await conversation_service.generate_complete_reply(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    parsed_reply = parse_reply_markup(turn.assistant_reply)
    return ChatTextResponse(
        session_id=turn.session_id,
        raw_text=parsed_reply.raw_text,
        display_text=parsed_reply.display_text,
        speech_text=parsed_reply.speech_text,
        action=parsed_reply.action,
        expression=parsed_reply.expression,
    )
