from pathlib import Path

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.core.config import get_settings

settings = get_settings()
Path(settings.DATA_DIR).mkdir(parents=True, exist_ok=True)

# 1. 创建异步引擎 (必须显式导入 create_async_engine)
engine = create_async_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG,
    pool_pre_ping=True,
    **(
        {
            "pool_size": max(1, settings.DATABASE_POOL_SIZE),
            "max_overflow": max(0, settings.DATABASE_MAX_OVERFLOW),
            "pool_timeout": max(1, settings.DATABASE_POOL_TIMEOUT_SECONDS),
            "pool_recycle": max(60, settings.DATABASE_POOL_RECYCLE_SECONDS),
        }
        if "sqlite" not in settings.DATABASE_URL
        else {}
    ),
)

# 2. 创建会话工厂
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# 3. 基类
Base = declarative_base()


async def init_db():
    """初始化数据库表"""
    if not settings.DATABASE_AUTO_CREATE:
        return
    async with engine.begin() as conn:
        # 创建所有表
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """依赖注入：获取数据库会话"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
