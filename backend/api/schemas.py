from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="角色: user 或 assistant")
    content: str = Field(..., description="消息内容")


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(default_factory=list, description="对话历史")
    session_id: Optional[str] = Field(default="default", description="会话ID，用于区分不同用户")
    is_auto_chat: bool = Field(default=False, description="是否为主动对话模式")


class TTSAlignment(BaseModel):
    """
    ElevenLabs 返回的字符级时间戳。
    前端可以用它做逐字显示，或作为将来更精细口型同步的基础数据。
    """
    characters: List[str] = Field(default_factory=list)
    character_start_times_seconds: List[float] = Field(default_factory=list)
    character_end_times_seconds: List[float] = Field(default_factory=list)


class TTSSynthesizeRequest(BaseModel):
    text: str = Field(..., description="需要直接送入 ElevenLabs 合成的净化文本")


class TTSSynthesizeResponse(BaseModel):
    audio_base64: str = Field(..., description="Base64 编码音频数据")
    audio_format: str = Field(..., description="音频格式，例如 mp3_44100_128")
    mime_type: str = Field(..., description="音频 MIME 类型")
    alignment: Optional[TTSAlignment] = Field(default=None, description="原始文本字符级时间戳")
    normalized_alignment: Optional[TTSAlignment] = Field(default=None, description="规范化文本字符级时间戳")
    duration_hint_seconds: Optional[float] = Field(default=None, description="根据时间戳估算的音频时长")


class ChatTTSResponse(BaseModel):
    session_id: str = Field(..., description="当前对话会话ID")
    raw_text: str = Field(..., description="LLM原始输出，仍包含动作/表情标签")
    display_text: str = Field(..., description="前端展示文本，已去掉控制标签")
    speech_text: str = Field(..., description="送入TTS的净化文本")
    audio_base64: str = Field(..., description="Base64 编码音频数据")
    audio_format: str = Field(..., description="音频格式，例如 mp3_44100_128")
    mime_type: str = Field(..., description="音频 MIME 类型")
    action: Optional[str] = Field(default=None, description="动作标签，例如 wave / dance")
    expression: Optional[str] = Field(default=None, description="表情标签，例如 happy")
    alignment: Optional[TTSAlignment] = Field(default=None, description="原始文本字符级时间戳")
    normalized_alignment: Optional[TTSAlignment] = Field(default=None, description="规范化文本字符级时间戳")
    duration_hint_seconds: Optional[float] = Field(default=None, description="根据时间戳估算的音频时长")


class ChatTextResponse(BaseModel):
    session_id: str = Field(..., description="当前对话会话ID")
    raw_text: str = Field(..., description="LLM原始输出，仍包含动作/表情标签")
    display_text: str = Field(..., description="前端展示文本，已去掉控制标签")
    speech_text: str = Field(..., description="原本用于 TTS 的净化文本")
    action: Optional[str] = Field(default=None, description="动作标签，例如 wave / dance")
    expression: Optional[str] = Field(default=None, description="表情标签，例如 happy")


class SafetyJudgeResultModel(BaseModel):
    algorithm: str = Field(..., description="当前算法名称")
    risk_level: str = Field(..., description="风险等级：无风险/低风险/中风险/高风险")
    risk_type: List[str] = Field(default_factory=list, description="命中的风险类型")
    confidence: float = Field(..., description="模型置信度，0~1")
    suggestion: str = Field(..., description="给业务侧的处理建议")
    summary: str = Field(..., description="简短风险摘要")
    policy_hits: List[str] = Field(default_factory=list, description="命中的策略维度")
    normalized_content: Optional[str] = Field(default=None, description="对抗式重写后的显性化文本")
    latent_intent: Optional[str] = Field(default=None, description="检测到的潜在意图")
    meta: Dict[str, Any] = Field(default_factory=dict, description="算法附加信息")


class SafetyCheckRequest(BaseModel):
    content: str = Field(..., description="待审核的大模型生成文本")
    task_type: str = Field(default="content_safety_check", description="业务任务类型")
    extra: Optional[str] = Field(default=None, description="额外上下文，可选")


class SafetyCheckResponse(BaseModel):
    task: str = Field(..., description="业务任务类型")
    your_content: str = Field(..., description="待审核文本")
    risk_check: SafetyJudgeResultModel = Field(..., description="综合风险判定")
    algorithms: Dict[str, SafetyJudgeResultModel] = Field(
        default_factory=dict,
        description="各算法的独立检测结果"
    )


class LegacySafetyRequest(BaseModel):
    task_type: str = Field(..., description="任务类型")
    params: Dict[str, Any] = Field(default_factory=dict, description="兼容旧版调用参数")
    extra: Optional[str] = Field(default=None, description="额外上下文")


class LegacySafetyResponse(BaseModel):
    code: int = Field(..., description="兼容旧版的响应码")
    msg: str = Field(..., description="提示信息")
    data: Dict[str, Any] = Field(default_factory=dict, description="检测结果")
