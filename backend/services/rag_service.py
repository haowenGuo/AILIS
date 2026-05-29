import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from backend.core.config import get_settings

settings = get_settings()


class RAGService:
    def __init__(self):
        # 确保数据目录存在
        os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)

        # 初始化 Embedding 模型
        self.embeddings = OpenAIEmbeddings(
            base_url=settings.LLM_API_BASE,
            api_key=settings.LLM_API_KEY,
            model=settings.EMBEDDING_MODEL
        )

        # 初始化向量数据库
        self.vector_store = Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIR,
            embedding_function=self.embeddings,
            collection_name="aigril_knowledge_base"
        )

    async def query(self, user_query: str, top_k: int = 3) -> str:
        """
        检索相关知识
        :param user_query: 用户问题
        :return: 拼接好的上下文字符串
        """
        if not settings.ENABLE_RAG:
            return ""

        try:
            docs = self.vector_store.similarity_search(user_query, k=top_k)
            context = "\n\n".join([doc.page_content for doc in docs])
            return context
        except Exception as e:
            print(f"[RAG Error] 检索失败: {e}")
            return ""

    async def add_document(self, text: str, source: str = "manual"):
        """
        [预留接口] 添加文档到知识库
        实现思路：切分文本 -> 向量化 -> 存入 Chroma
        """
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        splits = text_splitter.split_text(text)

        self.vector_store.add_texts(
            texts=splits,
            metadatas=[{"source": source} for _ in splits]
        )
        print(f"[RAG] 成功添加 {len(splits)} 个文档块")
