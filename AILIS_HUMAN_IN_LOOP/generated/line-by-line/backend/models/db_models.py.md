# backend/models/db_models.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端数据模型：定义 API 和持久化使用的结构化对象。
- 文件类型：`source-code`
- 原始行数：24
- SHA-256：`4fab4d9db98bb45e56fb781300c75d79ed1d02a8ce0f1978ab2db5ec4583204a`
- 可运行副本：[打开源文件](../../../../source/backend/models/db_models.py)
- 依赖：`sqlalchemy`、`backend.core.database`
- 主要符号：`Conversation`、`Document`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from sqlalchemy import Column, Integer, String, Text, DateTime, func</code> | 导入 Python 依赖 `sqlalchemy`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from backend.core.database import Base</code> | 导入 Python 依赖 `backend.core.database`，供本模块调用其类型、函数或常量。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>class Conversation(Base):</code> | 定义 Python 类 `Conversation`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 6 | <code>    """会话表：存储长期记忆"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 7 | <code>    __tablename__ = "conversations"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>    id = Column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 10 | <code>    session_id = Column(String, index=True, comment="会话ID，前端可传，默认default")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 11 | <code>    role = Column(String, comment="角色: user / assistant")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 12 | <code>    content = Column(Text, comment="消息内容")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 13 | <code>    created_at = Column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>class Document(Base):</code> | 定义 Python 类 `Document`，封装相关状态、协议和方法。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 17 | <code>    """RAG文档表：存储上传的知识库文档"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 18 | <code>    __tablename__ = "documents"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>    id = Column(Integer, primary_key=True, index=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 21 | <code>    filename = Column(String, comment="文件名")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 22 | <code>    content = Column(Text, comment="文档内容")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 23 | <code>    chunk_id = Column(String, comment="向量库中的Chunk ID")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
| 24 | <code>    created_at = Column(DateTime(timezone=True), server_default=func.now())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端数据模型：定义 API 和持久化使用的结构化对象。”这一文件职责。 |
