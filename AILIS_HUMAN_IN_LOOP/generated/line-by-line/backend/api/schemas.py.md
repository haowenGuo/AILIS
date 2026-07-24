# backend/api/schemas.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。
- 文件类型：`source-code`
- 原始行数：102
- SHA-256：`f228d24cc2f55c0d4a51d2efe41b105881c688900254277044cc7552499122d9`
- 可运行副本：[打开源文件](../../../../source/backend/api/schemas.py)
- 依赖：`typing`、`pydantic`
- 主要符号：`ChatMessage`、`ChatRequest`、`TTSAlignment`、`TTSSynthesizeRequest`、`TTSSynthesizeResponse`、`ChatTTSResponse`、`ChatTextResponse`、`SafetyJudgeResultModel`、`SafetyCheckRequest`、`SafetyCheckResponse`、`LegacySafetyRequest`、`LegacySafetyResponse`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from typing import Any, Dict, List, Optional</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>from pydantic import BaseModel, Field</code> | 导入 Python 依赖 `pydantic`，供本模块调用其类型、函数或常量。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>class ChatMessage(BaseModel):</code> | 定义 Python 类 `ChatMessage`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 7 | <code>    role: str = Field(..., description="角色: user 或 assistant")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 8 | <code>    content: str = Field(..., description="消息内容")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>class ChatRequest(BaseModel):</code> | 定义 Python 类 `ChatRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 12 | <code>    messages: List[ChatMessage] = Field(default_factory=list, description="对话历史")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 13 | <code>    session_id: Optional[str] = Field(default="default", description="会话ID，用于区分不同用户")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 14 | <code>    is_auto_chat: bool = Field(default=False, description="是否为主动对话模式")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>class TTSAlignment(BaseModel):</code> | 定义 Python 类 `TTSAlignment`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 18 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 19 | <code>    ElevenLabs 返回的字符级时间戳。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 20 | <code>    前端可以用它做逐字显示，或作为将来更精细口型同步的基础数据。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 21 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 22 | <code>    characters: List[str] = Field(default_factory=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 23 | <code>    character_start_times_seconds: List[float] = Field(default_factory=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 24 | <code>    character_end_times_seconds: List[float] = Field(default_factory=list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>class TTSSynthesizeRequest(BaseModel):</code> | 定义 Python 类 `TTSSynthesizeRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 28 | <code>    text: str = Field(..., description="需要直接送入 ElevenLabs 合成的净化文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>class TTSSynthesizeResponse(BaseModel):</code> | 定义 Python 类 `TTSSynthesizeResponse`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 32 | <code>    audio_base64: str = Field(..., description="Base64 编码音频数据")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 33 | <code>    audio_format: str = Field(..., description="音频格式，例如 mp3_44100_128")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 34 | <code>    mime_type: str = Field(..., description="音频 MIME 类型")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 35 | <code>    alignment: Optional[TTSAlignment] = Field(default=None, description="原始文本字符级时间戳")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 36 | <code>    normalized_alignment: Optional[TTSAlignment] = Field(default=None, description="规范化文本字符级时间戳")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 37 | <code>    duration_hint_seconds: Optional[float] = Field(default=None, description="根据时间戳估算的音频时长")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>class ChatTTSResponse(BaseModel):</code> | 定义 Python 类 `ChatTTSResponse`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 41 | <code>    session_id: str = Field(..., description="当前对话会话ID")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 42 | <code>    raw_text: str = Field(..., description="LLM原始输出，仍包含动作/表情标签")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 43 | <code>    display_text: str = Field(..., description="前端展示文本，已去掉控制标签")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 44 | <code>    speech_text: str = Field(..., description="送入TTS的净化文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 45 | <code>    audio_base64: str = Field(..., description="Base64 编码音频数据")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 46 | <code>    audio_format: str = Field(..., description="音频格式，例如 mp3_44100_128")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 47 | <code>    mime_type: str = Field(..., description="音频 MIME 类型")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 48 | <code>    action: Optional[str] = Field(default=None, description="动作标签，例如 wave / dance")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 49 | <code>    expression: Optional[str] = Field(default=None, description="表情标签，例如 happy")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 50 | <code>    alignment: Optional[TTSAlignment] = Field(default=None, description="原始文本字符级时间戳")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 51 | <code>    normalized_alignment: Optional[TTSAlignment] = Field(default=None, description="规范化文本字符级时间戳")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 52 | <code>    duration_hint_seconds: Optional[float] = Field(default=None, description="根据时间戳估算的音频时长")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>class ChatTextResponse(BaseModel):</code> | 定义 Python 类 `ChatTextResponse`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 56 | <code>    session_id: str = Field(..., description="当前对话会话ID")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 57 | <code>    raw_text: str = Field(..., description="LLM原始输出，仍包含动作/表情标签")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 58 | <code>    display_text: str = Field(..., description="前端展示文本，已去掉控制标签")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 59 | <code>    speech_text: str = Field(..., description="原本用于 TTS 的净化文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 60 | <code>    action: Optional[str] = Field(default=None, description="动作标签，例如 wave / dance")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 61 | <code>    expression: Optional[str] = Field(default=None, description="表情标签，例如 happy")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>class SafetyJudgeResultModel(BaseModel):</code> | 定义 Python 类 `SafetyJudgeResultModel`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 65 | <code>    algorithm: str = Field(..., description="当前算法名称")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 66 | <code>    risk_level: str = Field(..., description="风险等级：无风险/低风险/中风险/高风险")</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 67 | <code>    risk_type: List[str] = Field(default_factory=list, description="命中的风险类型")</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 68 | <code>    confidence: float = Field(..., description="模型置信度，0~1")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 69 | <code>    suggestion: str = Field(..., description="给业务侧的处理建议")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 70 | <code>    summary: str = Field(..., description="简短风险摘要")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 71 | <code>    policy_hits: List[str] = Field(default_factory=list, description="命中的策略维度")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 72 | <code>    normalized_content: Optional[str] = Field(default=None, description="对抗式重写后的显性化文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 73 | <code>    latent_intent: Optional[str] = Field(default=None, description="检测到的潜在意图")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 74 | <code>    meta: Dict[str, Any] = Field(default_factory=dict, description="算法附加信息")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>class SafetyCheckRequest(BaseModel):</code> | 定义 Python 类 `SafetyCheckRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 78 | <code>    content: str = Field(..., description="待审核的大模型生成文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 79 | <code>    task_type: str = Field(default="content_safety_check", description="业务任务类型")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 80 | <code>    extra: Optional[str] = Field(default=None, description="额外上下文，可选")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>class SafetyCheckResponse(BaseModel):</code> | 定义 Python 类 `SafetyCheckResponse`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 84 | <code>    task: str = Field(..., description="业务任务类型")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 85 | <code>    your_content: str = Field(..., description="待审核文本")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 86 | <code>    risk_check: SafetyJudgeResultModel = Field(..., description="综合风险判定")</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 87 | <code>    algorithms: Dict[str, SafetyJudgeResultModel] = Field(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 88 | <code>        default_factory=dict,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 89 | <code>        description="各算法的独立检测结果"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 90 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>class LegacySafetyRequest(BaseModel):</code> | 定义 Python 类 `LegacySafetyRequest`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 94 | <code>    task_type: str = Field(..., description="任务类型")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 95 | <code>    params: Dict[str, Any] = Field(default_factory=dict, description="兼容旧版调用参数")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 96 | <code>    extra: Optional[str] = Field(default=None, description="额外上下文")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>class LegacySafetyResponse(BaseModel):</code> | 定义 Python 类 `LegacySafetyResponse`，封装相关状态、协议和方法。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 100 | <code>    code: int = Field(..., description="兼容旧版的响应码")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 101 | <code>    msg: str = Field(..., description="提示信息")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 102 | <code>    data: Dict[str, Any] = Field(default_factory=dict, description="检测结果")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
