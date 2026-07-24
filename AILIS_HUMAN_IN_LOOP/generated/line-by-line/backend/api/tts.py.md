# backend/api/tts.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。
- 文件类型：`source-code`
- 原始行数：140
- SHA-256：`7ed087e8700a261bf1793838ebb69aba981702ecbcf7085fd4db5bd5cc043ceb`
- 可运行副本：[打开源文件](../../../../source/backend/api/tts.py)
- 依赖：`fastapi`、`sqlalchemy.ext.asyncio`、`backend.api.schemas`、`backend.core.database`、`backend.services.conversation_service`、`backend.services.reply_markup_service`、`backend.services.tts_service`
- 主要符号：`_to_pydantic_alignment`、`_estimate_duration_seconds`、`chat_tts_endpoint`、`tts_synthesize_endpoint`、`chat_text_endpoint`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from fastapi import APIRouter, Depends, HTTPException</code> | 导入 Python 依赖 `fastapi`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>from backend.api.schemas import (</code> | 导入 Python 依赖 `backend.api.schemas`，供本模块调用其类型、函数或常量。 |
| 5 | <code>    ChatRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 6 | <code>    ChatTextResponse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 7 | <code>    ChatTTSResponse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 8 | <code>    TTSAlignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 9 | <code>    TTSSynthesizeRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 10 | <code>    TTSSynthesizeResponse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 11 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 12 | <code>from backend.core.database import get_db</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 13 | <code>from backend.services.conversation_service import ConversationService</code> | 导入 Python 依赖 `backend.services.conversation_service`，供本模块调用其类型、函数或常量。 |
| 14 | <code>from backend.services.reply_markup_service import parse_reply_markup</code> | 导入 Python 依赖 `backend.services.reply_markup_service`，供本模块调用其类型、函数或常量。 |
| 15 | <code>from backend.services.tts_service import ElevenLabsTTSService, ElevenLabsTTSServiceError</code> | 导入 Python 依赖 `backend.services.tts_service`，供本模块调用其类型、函数或常量。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>router = APIRouter()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>def _to_pydantic_alignment(alignment) -&gt; TTSAlignment &#124; None:</code> | 定义 Python 函数 `_to_pydantic_alignment`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 22 | <code>    if alignment is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 23 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>    return TTSAlignment(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 26 | <code>        characters=alignment.characters,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 27 | <code>        character_start_times_seconds=alignment.character_start_times_seconds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 28 | <code>        character_end_times_seconds=alignment.character_end_times_seconds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 29 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>def _estimate_duration_seconds(alignment) -&gt; float &#124; None:</code> | 定义 Python 函数 `_estimate_duration_seconds`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 33 | <code>    if alignment is None or not alignment.character_end_times_seconds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 34 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 35 | <code>    return max(alignment.character_end_times_seconds)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>@router.post("/chat/tts", response_model=ChatTTSResponse)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 39 | <code>async def chat_tts_endpoint(</code> | 定义 Python 函数 `chat_tts_endpoint`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 40 | <code>    request: ChatRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 41 | <code>    db: AsyncSession = Depends(get_db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 42 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 43 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 44 | <code>    一次性完成：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 45 | <code>    1. 生成最终回复文本</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 46 | <code>    2. 解析动作 / 表情控制标签</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 47 | <code>    3. 调 ElevenLabs 生成音频与时间戳</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    这个接口专门服务“完整文本 + 完整音频”场景，避免影响原有流式 /chat。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 50 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 51 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 52 | <code>        conversation_service = ConversationService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 53 | <code>        turn = await conversation_service.generate_complete_reply(request)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 54 | <code>    except ValueError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 55 | <code>        raise HTTPException(status_code=400, detail=str(exc)) from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    parsed_reply = parse_reply_markup(turn.assistant_reply)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 58 | <code>    if not parsed_reply.speech_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 59 | <code>        raise HTTPException(status_code=502, detail="AI 回复为空，无法生成语音")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 62 | <code>        tts_service = ElevenLabsTTSService()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 63 | <code>        tts_result = await tts_service.synthesize(parsed_reply.speech_text)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 64 | <code>    except ElevenLabsTTSServiceError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 65 | <code>        print(f"[TTS Error] ElevenLabs 语音生成失败: {exc}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 66 | <code>        raise HTTPException(status_code=502, detail=f"ElevenLabs 语音生成失败：{exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>    return ChatTTSResponse(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 69 | <code>        session_id=turn.session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 70 | <code>        raw_text=parsed_reply.raw_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 71 | <code>        display_text=parsed_reply.display_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 72 | <code>        speech_text=parsed_reply.speech_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 73 | <code>        audio_base64=tts_result.audio_base64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 74 | <code>        audio_format=tts_result.audio_format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 75 | <code>        mime_type=tts_result.mime_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 76 | <code>        action=parsed_reply.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 77 | <code>        expression=parsed_reply.expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 78 | <code>        alignment=_to_pydantic_alignment(tts_result.alignment),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 79 | <code>        normalized_alignment=_to_pydantic_alignment(tts_result.normalized_alignment),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 80 | <code>        duration_hint_seconds=_estimate_duration_seconds(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 81 | <code>            tts_result.normalized_alignment or tts_result.alignment</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 82 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>@router.post("/tts/synthesize", response_model=TTSSynthesizeResponse)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 87 | <code>async def tts_synthesize_endpoint(request: TTSSynthesizeRequest):</code> | 定义 Python 函数 `tts_synthesize_endpoint`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 88 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 89 | <code>    仅负责把已有文本交给 ElevenLabs 合成音频。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>    桌面端 AILIS 的回复由本地 Agent Loop 产生，因此不能复用 /chat/tts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 92 | <code>    的“生成回复 + 合成音频”一体流程，否则会绕开任务执行结果。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 93 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 94 | <code>    clean_text = (request.text or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 95 | <code>    if not clean_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 96 | <code>        raise HTTPException(status_code=400, detail="TTS 输入文本不能为空")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 99 | <code>        tts_service = ElevenLabsTTSService()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 100 | <code>        tts_result = await tts_service.synthesize(clean_text)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 101 | <code>    except ElevenLabsTTSServiceError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 102 | <code>        print(f"[TTS Error] ElevenLabs 语音生成失败: {exc}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 103 | <code>        raise HTTPException(status_code=502, detail=f"ElevenLabs 语音生成失败：{exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>    return TTSSynthesizeResponse(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 106 | <code>        audio_base64=tts_result.audio_base64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 107 | <code>        audio_format=tts_result.audio_format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 108 | <code>        mime_type=tts_result.mime_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 109 | <code>        alignment=_to_pydantic_alignment(tts_result.alignment),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 110 | <code>        normalized_alignment=_to_pydantic_alignment(tts_result.normalized_alignment),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 111 | <code>        duration_hint_seconds=_estimate_duration_seconds(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 112 | <code>            tts_result.normalized_alignment or tts_result.alignment</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 113 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>@router.post("/chat/text", response_model=ChatTextResponse)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 118 | <code>async def chat_text_endpoint(</code> | 定义 Python 函数 `chat_text_endpoint`；其缩进块实现具体业务或工具行为。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 119 | <code>    request: ChatRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 120 | <code>    db: AsyncSession = Depends(get_db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 121 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 122 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 123 | <code>    TTS 不可用时的降级接口：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 124 | <code>    仍然生成完整文本，并保留动作/表情控制标签解析结果。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 125 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 126 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 127 | <code>        conversation_service = ConversationService(db)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 128 | <code>        turn = await conversation_service.generate_complete_reply(request)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 129 | <code>    except ValueError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 130 | <code>        raise HTTPException(status_code=400, detail=str(exc)) from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>    parsed_reply = parse_reply_markup(turn.assistant_reply)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 133 | <code>    return ChatTextResponse(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 134 | <code>        session_id=turn.session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 135 | <code>        raw_text=parsed_reply.raw_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 136 | <code>        display_text=parsed_reply.display_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 137 | <code>        speech_text=parsed_reply.speech_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 138 | <code>        action=parsed_reply.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 139 | <code>        expression=parsed_reply.expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。”这一文件职责。 |
| 140 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
