# backend/core/database.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`source-code`
- 原始行数：37
- SHA-256：`d7a10a76f6703f0929d33d0ccf8b32e2f314d10cc8adfe7903ad62e649939e42`
- 可运行副本：[打开源文件](../../../../source/backend/core/database.py)
- 依赖：`pathlib`、`sqlalchemy.ext.asyncio`、`sqlalchemy.orm`、`backend.core.config`
- 主要符号：`init_db`、`get_db`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 4 | <code>from sqlalchemy.orm import declarative_base</code> | 导入 Python 依赖 `sqlalchemy.orm`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>Path(settings.DATA_DIR).mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code># 1. 创建异步引擎 (必须显式导入 create_async_engine)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 11 | <code>engine = create_async_engine(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 12 | <code>    settings.DATABASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 13 | <code>    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 14 | <code>    echo=settings.DEBUG</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 15 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code># 2. 创建会话工厂</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 18 | <code>AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code># 3. 基类</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 21 | <code>Base = declarative_base()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>async def init_db():</code> | 定义 Python 函数 `init_db`；其缩进块实现具体业务或工具行为。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 25 | <code>    """初始化数据库表"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 26 | <code>    async with engine.begin() as conn:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 27 | <code>        # 创建所有表</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 28 | <code>        await conn.run_sync(Base.metadata.create_all)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>async def get_db():</code> | 定义 Python 函数 `get_db`；其缩进块实现具体业务或工具行为。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 32 | <code>    """依赖注入：获取数据库会话"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 33 | <code>    async with AsyncSessionLocal() as session:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 34 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 35 | <code>            yield session</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 36 | <code>        finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 37 | <code>            await session.close()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
