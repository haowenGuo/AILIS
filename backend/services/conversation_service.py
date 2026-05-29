from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.schemas import ChatRequest
from backend.core.config import get_settings
from backend.services.llm_service import LLMService
from backend.services.memory_service import MemoryService
from backend.services.rag_service import RAGService

settings = get_settings()


@dataclass
class ConversationTurn:
    session_id: str
    latest_user_message: str
    assistant_reply: str
    rag_context: str


class ConversationService:
    """
    负责“从数据库取上下文 -> 调 LLM -> 存最终回复”的完整一轮对话。

    这里刻意不关心 TTS，这样文本对话和语音对话都能复用这条链路。
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.llm_svc = LLMService()
        self.memory_svc = MemoryService(db)
        self.rag_svc = RAGService()

    @staticmethod
    def _normalize_session_id(session_id: str | None) -> str:
        return (session_id or "default").strip() or "default"

    @staticmethod
    def _extract_latest_user_message(request: ChatRequest) -> str:
        if request.is_auto_chat:
            # 主动对话用一个极简触发词，让 LLM 自己生成搭话内容。
            return "发呆。"

        if not request.messages:
            raise ValueError("消息列表不能为空")

        latest_user_msg = request.messages[-1].content.strip()
        if not latest_user_msg:
            raise ValueError("最新用户消息不能为空")

        return latest_user_msg

    async def generate_complete_reply(self, request: ChatRequest) -> ConversationTurn:
        session_id = self._normalize_session_id(request.session_id)
        latest_user_msg = self._extract_latest_user_message(request)

        await self.memory_svc.add_message(session_id, "user", latest_user_msg)

        context = await self.memory_svc.get_context(
            session_id,
            limit=settings.MAX_SHORT_TERM_MEMORY
        )
        rag_context = await self.rag_svc.query(latest_user_msg) if latest_user_msg else ""
        assistant_reply = await self.llm_svc.generate_response(context, rag_context)

        await self.memory_svc.add_message(session_id, "assistant", assistant_reply)

        return ConversationTurn(
            session_id=session_id,
            latest_user_message=latest_user_msg,
            assistant_reply=assistant_reply,
            rag_context=rag_context
        )
