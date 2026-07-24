# backend/services/llm_service.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端服务层：实现模型、记忆、聊天或业务服务逻辑。
- 文件类型：`source-code`
- 原始行数：150
- SHA-256：`659dc5fbad64086770585bcf3afcb5d8654aa9502e4e93b2306ca53c3b557f95`
- 可运行副本：[打开源文件](../../../../source/backend/services/llm_service.py)
- 依赖：`langchain_openai`、`langchain_core.messages`、`backend.core.config`
- 主要符号：`LLMService`、`__init__`、`_create_llm`、`_extract_text`、`_is_truncated_empty_response`、`generate_non_stream`、`generate_response`、`generate_stream_response`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from langchain_openai import ChatOpenAI</code> | 导入 Python 依赖 `langchain_openai`，供本模块调用其类型、函数或常量。 |
| 2 | <code>from langchain_core.messages import HumanMessage, SystemMessage, AIMessage  # ✅ 新路径</code> | 导入 Python 依赖 `langchain_core.messages`，供本模块调用其类型、函数或常量。 |
| 3 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>class LLMService:</code> | 定义 Python 类 `LLMService`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 9 | <code>    def __init__(self):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 10 | <code>        # 初始化大模型客户端</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 11 | <code>        self.llm = self._create_llm()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>    def _create_llm(self, temperature: float = 0.7, max_tokens: int = 8000):</code> | 定义 Python 函数 `_create_llm`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 14 | <code>        return ChatOpenAI(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 15 | <code>            base_url=settings.LLM_API_BASE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 16 | <code>            api_key=settings.LLM_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 17 | <code>            model=settings.LLM_MODEL_NAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 18 | <code>            temperature=temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 19 | <code>            max_tokens=max_tokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 20 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>    def _extract_text(self, response) -&gt; str:</code> | 定义 Python 函数 `_extract_text`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 23 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 24 | <code>        兼容不同 OpenAI 兼容服务的返回格式，尽量稳定提取文本内容。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 25 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 26 | <code>        content = getattr(response, "content", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>        if isinstance(content, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 29 | <code>            return content.strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>        if isinstance(content, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 32 | <code>            text_parts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 33 | <code>            for item in content:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 34 | <code>                if isinstance(item, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 35 | <code>                    text_parts.append(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 36 | <code>                elif isinstance(item, dict):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 37 | <code>                    if item.get("type") == "text" and item.get("text"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 38 | <code>                        text_parts.append(item["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 39 | <code>                    elif item.get("type") == "output_text" and item.get("text"):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 40 | <code>                        text_parts.append(item["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 41 | <code>            return "".join(text_parts).strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>        additional_kwargs = getattr(response, "additional_kwargs", {}) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 44 | <code>        for key in ("text", "output_text"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 45 | <code>            value = additional_kwargs.get(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 46 | <code>            if isinstance(value, str) and value.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 47 | <code>                return value.strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>    def _is_truncated_empty_response(self, response) -&gt; bool:</code> | 定义 Python 函数 `_is_truncated_empty_response`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 52 | <code>        metadata = getattr(response, "response_metadata", {}) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 53 | <code>        finish_reason = metadata.get("finish_reason")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 54 | <code>        return finish_reason == "length" and not self._extract_text(response)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>    async def generate_non_stream(</code> | 定义 Python 函数 `generate_non_stream`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 57 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 58 | <code>        prompt: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 59 | <code>        system_prompt: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 60 | <code>        temperature: float = 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 61 | <code>        max_tokens: int = 300</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 62 | <code>    ) -&gt; str:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 63 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 64 | <code>        通用非流式调用，用于摘要、压缩等不需要携带聊天人设的场景</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 65 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 66 | <code>        llm = self._create_llm(temperature=temperature, max_tokens=max_tokens)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 67 | <code>        messages = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 68 | <code>        if system_prompt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 69 | <code>            messages.append(SystemMessage(content=system_prompt))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 70 | <code>        messages.append(HumanMessage(content=prompt))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>        response = await llm.ainvoke(messages)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 73 | <code>        text = self._extract_text(response)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>        if not text and self._is_truncated_empty_response(response):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 76 | <code>            retry_max_tokens = max(max_tokens * 2, 800)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 77 | <code>            print(f"[LLM Retry] 摘要结果被长度截断，重试一次: max_tokens={retry_max_tokens}")</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 78 | <code>            retry_llm = self._create_llm(temperature=temperature, max_tokens=retry_max_tokens)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 79 | <code>            response = await retry_llm.ainvoke(messages)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 80 | <code>            text = self._extract_text(response)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>        if not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 83 | <code>            print(f"[LLM Empty Response] 摘要模型返回空内容: {response}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 84 | <code>        return text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    async def generate_response(self, context_messages: list, rag_context: str = "") -&gt; str:</code> | 定义 Python 函数 `generate_response`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 87 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 88 | <code>        核心生成逻辑</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 89 | <code>        :param context_messages: 历史消息列表 [(role, content), ...]</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 90 | <code>        :param rag_context: RAG检索到的上下文</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 91 | <code>        :return: 生成的回复文本</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 92 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>        # 1. 构建 System Prompt</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 95 | <code>        system_prompt = settings.SYSTEM_PROMPT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>        # 2. 如果有RAG内容，注入到System Prompt中</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 98 | <code>        if rag_context:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 99 | <code>            system_prompt += f"\n\n【知识库参考资料】\n{rag_context}\n请根据以上资料回答用户问题。"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>        # 3. 构建 LangChain 消息格式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 102 | <code>        messages = [SystemMessage(content=system_prompt)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>        # 4. 添加历史消息</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 105 | <code>        for role, content in context_messages:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 106 | <code>            if role == "system":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 107 | <code>                messages.append(SystemMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 108 | <code>            elif role == "user":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 109 | <code>                messages.append(HumanMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 110 | <code>            elif role == "assistant":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 111 | <code>                messages.append(AIMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>        # 5. 调用大模型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 114 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 115 | <code>            response = await self.llm.ainvoke(messages)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 116 | <code>            text = self._extract_text(response)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 117 | <code>            return text or "ε=(´ο｀*)))，我刚刚发了会儿呆，你再跟我说一次吧~"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 118 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 119 | <code>            print(f"[LLM Error] 调用失败: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 120 | <code>            return "ε=(´ο｀*)))，我的大脑暂时短路了~"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>    async def generate_stream_response(self, context_messages: list, rag_context: str = ""):</code> | 定义 Python 函数 `generate_stream_response`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 123 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 124 | <code>        流式生成回复，逐Token返回</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 125 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 126 | <code>        # 1. 构建 System Prompt</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 127 | <code>        system_prompt = settings.SYSTEM_PROMPT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 128 | <code>        if rag_context:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 129 | <code>            system_prompt += f"\n\n【知识库参考资料】\n{rag_context}\n请根据以上资料回答用户问题。"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>        # 2. 构建消息格式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 132 | <code>        messages = [SystemMessage(content=system_prompt)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 133 | <code>        for role, content in context_messages:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 134 | <code>            if role == "system":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 135 | <code>                messages.append(SystemMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 136 | <code>            elif role == "user":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 137 | <code>                messages.append(HumanMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 138 | <code>            elif role == "assistant":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 139 | <code>                messages.append(AIMessage(content=content))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 140 | <code>        print(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 141 | <code>        # 3. 流式调用大模型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 142 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 143 | <code>            # 开启流式模式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 144 | <code>            stream = self.llm.astream(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 145 | <code>            async for chunk in stream:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 146 | <code>                if chunk.content:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 147 | <code>                    yield chunk.content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 148 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 149 | <code>            print(f"[LLM Stream Error] 调用失败: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 150 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
