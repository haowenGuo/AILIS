from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.db_models import Conversation
from typing import List, Tuple
from datetime import datetime, timedelta


class MemoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_message(self, session_id: str, role: str, content: str):
        msg = Conversation(
            session_id=session_id,
            role=role,
            content=content,
            created_at=datetime.utcnow()  # 确保有更新时间
        )
        self.db.add(msg)
        await self.db.commit()

    async def get_context(self, session_id: str, limit: int = 8) -> List[Tuple[str, str]]:
        """获取最近 N 条消息，不做任何压缩"""
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.session_id == session_id)
            .order_by(Conversation.created_at.desc())
            .limit(limit)
        )
        messages = result.scalars().all()
        messages.reverse()  # 旧 -> 新
        return [(m.role, m.content) for m in messages]

    # 新增：清理过期会话的方法
    async def cleanup_expired_sessions(self, expire_seconds: int):
        """删除超过一定时间未活跃的会话"""
        cutoff = datetime.utcnow() - timedelta(seconds=expire_seconds)
        # 这里需要根据你的数据模型调整，假设 Conversation 有 session_id 的关联表
        # 或者直接删除旧消息
        await self.db.execute(
            delete(Conversation).where(Conversation.created_at < cutoff)
        )
        await self.db.commit()
