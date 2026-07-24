from sqlalchemy import Column, Integer, String, Text, DateTime, func
from backend.core.database import Base


class Conversation(Base):
    """会话表：存储长期记忆"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, comment="会话ID，前端可传，默认default")
    role = Column(String, comment="角色: user / assistant")
    content = Column(Text, comment="消息内容")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Document(Base):
    """RAG文档表：存储上传的知识库文档"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, comment="文件名")
    content = Column(Text, comment="文档内容")
    chunk_id = Column(String, comment="向量库中的Chunk ID")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
