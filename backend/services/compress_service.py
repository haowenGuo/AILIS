import asyncio
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.core.database import AsyncSessionLocal
from backend.core.config import get_settings
from backend.models.db_models import Conversation
from backend.services.llm_service import LLMService

settings = get_settings()

# ---------------- 从 chat.py 移过来的配置 ----------------
TIMER_CHECK_INTERVAL = settings.COMPRESS_INTERVAL or 60
SESSION_MSG_THRESHOLD = settings.SESSION_MSG_THRESHOLD or 20
KEEP_LATEST_MSG_COUNT = settings.KEEP_LATEST_MSG_COUNT or 8

timer_task: asyncio.Task | None = None


# ---------------- 压缩核心逻辑 ----------------
def _build_compress_prompt(old_history) -> str:
    if not old_history:
        return "没有之前的聊天内容，无需压缩。"

    history_text = ""
    for msg in old_history:
        if msg.role == "system" and "【之前的聊天摘要】" in msg.content:
            history_text += f"之前的聊天总结：{msg.content}\n"
        else:
            speaker = "你" if msg.role == "assistant" else "我"
            history_text += f"{speaker}：{msg.content}\n"

    return f"""请把下面的聊天内容压缩成简洁摘要，只保留和“我”的核心互动内容，不要遗漏重要的小事哦～
如果没有内容，就回复“没有之前的聊天啦～”

聊天内容：
{history_text}

请直接给出压缩后的摘要，不要加任何多余的话！
"""


async def _compress_single_session(db: AsyncSession, session_id: str, llm_svc: LLMService):
    """压缩单个会话（原子操作，避免事务污染）"""
    # 1. 查询消息
    result = await db.execute(
        select(Conversation)
        .where(Conversation.session_id == session_id)
        .order_by(Conversation.created_at.asc())
    )
    messages = result.scalars().all()

    if len(messages) <= SESSION_MSG_THRESHOLD:
        return

    # 2. 拆分历史
    latest_messages = messages[-KEEP_LATEST_MSG_COUNT:]
    old_history = messages[:-KEEP_LATEST_MSG_COUNT]

    # 3. 生成摘要
    compress_prompt = _build_compress_prompt(old_history)
    print("compress_prompt", compress_prompt)

    try:
        summary = await llm_svc.generate_non_stream(
            prompt=compress_prompt,
            system_prompt="你是AIGL的记忆助手，负责把旧的聊天内容压缩成简洁的摘要。"
                          "语气要像普通可爱的女孩子，只保留核心聊天内容，",
            temperature=0.3,
            max_tokens=8000
        )
        print("summary", summary)
    except Exception as e:
        print(f"⚠️  会话{session_id}压缩失败: {str(e)}")
        return

    summary = (summary or "").strip()
    if not summary:
        print(f"⚠️  会话{session_id}压缩结果为空，跳过本次压缩，避免误删历史消息")
        return

    # 4. 数据库原子更新
    try:
        old_msg_ids = [msg.id for msg in old_history]
        await db.execute(delete(Conversation).where(Conversation.id.in_(old_msg_ids)))

        summary_msg = Conversation(
            session_id=session_id,
            role="system",
            content=f"【之前的聊天摘要】{summary.strip()}"
        )
        db.add(summary_msg)
        await db.commit()
        print(f"✅ 会话{session_id}压缩完成，删除{len(old_msg_ids)}条旧消息")
    except Exception as e:
        await db.rollback()
        print(f"⚠️  会话{session_id}数据库更新失败: {str(e)}")


async def _get_session_ids_to_check(db: AsyncSession) -> List[str]:
    """
    直接从数据库里找所有会话，避免依赖进程内 active_sessions 导致漏检。
    """
    result = await db.execute(
        select(Conversation.session_id)
        .where(Conversation.session_id.is_not(None))
        .distinct()
    )
    return [session_id for session_id in result.scalars().all() if session_id]


async def timer_task_runner():
    """定时器循环本体"""
    llm_svc = LLMService()
    while True:
        try:
            # 每次循环获取新的 DB Session
            async with AsyncSessionLocal() as db:
                session_ids = await _get_session_ids_to_check(db)

                if not session_ids:
                    await asyncio.sleep(TIMER_CHECK_INTERVAL)
                    continue

                for session_id in session_ids:
                    await _compress_single_session(db, session_id, llm_svc)

            await asyncio.sleep(TIMER_CHECK_INTERVAL)
        except asyncio.CancelledError:
            print("🛑 记忆压缩计时器已停止")
            break
        except Exception as e:
            print(f"⚠️  计时器任务异常：{str(e)}")
            await asyncio.sleep(TIMER_CHECK_INTERVAL)
