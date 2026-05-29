from fastapi import APIRouter, Depends, HTTPException
from starlette.background import BackgroundTask
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.schemas import ChatRequest
from backend.core.database import AsyncSessionLocal, get_db
from backend.services.llm_service import LLMService
from backend.services.memory_service import MemoryService
from backend.services.rag_service import RAGService
from backend.core.config import get_settings

settings = get_settings()
router = APIRouter()

@router.post("/chat")
async def chat_endpoint(
        request: ChatRequest,
        db: AsyncSession = Depends(get_db)
):
    """
    安全流式版：流式输出完，再统一存数据库
    记忆压缩由后台计时器异步执行，完全不影响接口响应速度
    """
    # 1. 初始化服务
    llm_svc = LLMService()
    memory_svc = MemoryService(db)
    rag_svc = RAGService()

    # 2. 参数校验
    if not request.messages and not request.is_auto_chat:
        raise HTTPException(status_code=400, detail="消息列表不能为空")

    session_id = (request.session_id or "default").strip() or "default"

    latest_user_msg = ""

    # 3. 提取用户消息
    if not request.is_auto_chat:
        if request.messages:
            latest_user_msg = request.messages[-1].content
        else:
            raise HTTPException(status_code=400, detail="普通对话模式下消息列表不能为空")

    if request.is_auto_chat:
        latest_user_msg += "\n发呆。"

    # 4. 存储用户消息
    await memory_svc.add_message(session_id, "user", latest_user_msg)

    # 5. 获取上下文（MemoryService 现在只负责纯读取，不做压缩）
    context = await memory_svc.get_context(session_id, limit=settings.MAX_SHORT_TERM_MEMORY)
    rag_context = await rag_svc.query(latest_user_msg) if latest_user_msg else ""
    print("context", context)
    print("rag_context", rag_context)
    # 6. 流式响应生成器
    full_ai_reply = ""

    async def event_generator():
        nonlocal full_ai_reply
        try:
            async for chunk in llm_svc.generate_stream_response(context, rag_context):
                if not chunk:
                    continue
                full_ai_reply += chunk
                yield f"data:{chunk}\n\n"
        except Exception as e:
            print(f"[LLM Stream Error] 调用失败: {e}")
            yield f"event:error\ndata:[ERROR] 对话失败：{str(e)}\n\n"

    async def save_ai_message_task():
        if full_ai_reply and not full_ai_reply.startswith("[ERROR]"):
            try:
                async with AsyncSessionLocal() as new_db:
                    new_memory_svc = MemoryService(new_db)
                    await new_memory_svc.add_message(
                        session_id, "assistant", full_ai_reply
                    )
                print(f"✅ 已保存AI回复: {full_ai_reply[:20]}...")
            except Exception as e:
                print(f"❌ 保存AI消息失败: {str(e)}")

    # 7. 返回流式响应，确保流结束后再保存 AI 回复
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
        background=BackgroundTask(save_ai_message_task)
    )
