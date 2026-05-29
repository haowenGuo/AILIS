from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage  # ✅ 新路径
from backend.core.config import get_settings

settings = get_settings()


class LLMService:
    def __init__(self):
        # 初始化大模型客户端
        self.llm = self._create_llm()

    def _create_llm(self, temperature: float = 0.7, max_tokens: int = 8000):
        return ChatOpenAI(
            base_url=settings.LLM_API_BASE,
            api_key=settings.LLM_API_KEY,
            model=settings.LLM_MODEL_NAME,
            temperature=temperature,
            max_tokens=max_tokens
        )

    def _extract_text(self, response) -> str:
        """
        兼容不同 OpenAI 兼容服务的返回格式，尽量稳定提取文本内容。
        """
        content = getattr(response, "content", "")

        if isinstance(content, str):
            return content.strip()

        if isinstance(content, list):
            text_parts = []
            for item in content:
                if isinstance(item, str):
                    text_parts.append(item)
                elif isinstance(item, dict):
                    if item.get("type") == "text" and item.get("text"):
                        text_parts.append(item["text"])
                    elif item.get("type") == "output_text" and item.get("text"):
                        text_parts.append(item["text"])
            return "".join(text_parts).strip()

        additional_kwargs = getattr(response, "additional_kwargs", {}) or {}
        for key in ("text", "output_text"):
            value = additional_kwargs.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

        return ""

    def _is_truncated_empty_response(self, response) -> bool:
        metadata = getattr(response, "response_metadata", {}) or {}
        finish_reason = metadata.get("finish_reason")
        return finish_reason == "length" and not self._extract_text(response)

    async def generate_non_stream(
        self,
        prompt: str,
        system_prompt: str = "",
        temperature: float = 0.7,
        max_tokens: int = 300
    ) -> str:
        """
        通用非流式调用，用于摘要、压缩等不需要携带聊天人设的场景
        """
        llm = self._create_llm(temperature=temperature, max_tokens=max_tokens)
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        response = await llm.ainvoke(messages)
        text = self._extract_text(response)

        if not text and self._is_truncated_empty_response(response):
            retry_max_tokens = max(max_tokens * 2, 800)
            print(f"[LLM Retry] 摘要结果被长度截断，重试一次: max_tokens={retry_max_tokens}")
            retry_llm = self._create_llm(temperature=temperature, max_tokens=retry_max_tokens)
            response = await retry_llm.ainvoke(messages)
            text = self._extract_text(response)

        if not text:
            print(f"[LLM Empty Response] 摘要模型返回空内容: {response}")
        return text

    async def generate_response(self, context_messages: list, rag_context: str = "") -> str:
        """
        核心生成逻辑
        :param context_messages: 历史消息列表 [(role, content), ...]
        :param rag_context: RAG检索到的上下文
        :return: 生成的回复文本
        """

        # 1. 构建 System Prompt
        system_prompt = settings.SYSTEM_PROMPT

        # 2. 如果有RAG内容，注入到System Prompt中
        if rag_context:
            system_prompt += f"\n\n【知识库参考资料】\n{rag_context}\n请根据以上资料回答用户问题。"

        # 3. 构建 LangChain 消息格式
        messages = [SystemMessage(content=system_prompt)]

        # 4. 添加历史消息
        for role, content in context_messages:
            if role == "system":
                messages.append(SystemMessage(content=content))
            elif role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))

        # 5. 调用大模型
        try:
            response = await self.llm.ainvoke(messages)
            text = self._extract_text(response)
            return text or "ε=(´ο｀*)))，我刚刚发了会儿呆，你再跟我说一次吧~"
        except Exception as e:
            print(f"[LLM Error] 调用失败: {e}")
            return "ε=(´ο｀*)))，我的大脑暂时短路了~"

    async def generate_stream_response(self, context_messages: list, rag_context: str = ""):
        """
        流式生成回复，逐Token返回
        """
        # 1. 构建 System Prompt
        system_prompt = settings.SYSTEM_PROMPT
        if rag_context:
            system_prompt += f"\n\n【知识库参考资料】\n{rag_context}\n请根据以上资料回答用户问题。"

        # 2. 构建消息格式
        messages = [SystemMessage(content=system_prompt)]
        for role, content in context_messages:
            if role == "system":
                messages.append(SystemMessage(content=content))
            elif role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))
        print(messages)
        # 3. 流式调用大模型
        try:
            # 开启流式模式
            stream = self.llm.astream(messages)
            async for chunk in stream:
                if chunk.content:
                    yield chunk.content
        except Exception as e:
            print(f"[LLM Stream Error] 调用失败: {e}")
            yield "ε=(´ο｀*)))，我的大脑暂时短路了~"
