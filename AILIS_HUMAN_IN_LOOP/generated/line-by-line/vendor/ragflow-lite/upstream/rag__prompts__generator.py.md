# vendor/ragflow-lite/upstream/rag__prompts__generator.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：1011
- SHA-256：`edb297d2c2c070d8e3edd3b366d9bcb4ab57784e6a827fff3b24bc4d23d4faf8`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/rag__prompts__generator.py)
- 依赖：`asyncio`、`datetime`、`json`、`logging`、`re`、`copy`、`typing`、`jinja2.sandbox`、`json_repair`、`common.misc_utils`、`rag.nlp`、`rag.prompts.template`、`common.constants`、`common.token_utils`、`api.db.services.llm_service`、`api.db.joint_services.tenant_model_service`、`rag.graphrag.utils`、`numpy`
- 主要符号：`get_value`、`chunks_format`、`message_fit_in`、`count`、`trim_content`、`kb_prompt`、`draw_node`、`memory_prompt`、`citation_prompt`、`citation_plus`、`keyword_extraction`、`question_proposal`、`full_question`、`cross_languages`、`content_tagging`、`vision_llm_describe_prompt`、`vision_llm_figure_describe_prompt`、`vision_llm_figure_describe_prompt_with_context`、`tool_schema`、`with`、`form_history`、`analyze_task_async`、`next_step_async`、`reflect_async`、`form_message`、`structured_output_prompt`、`tool_call_summary`、`rank_memories_async`、`gen_meta_filter`、`gen_json`、`detect_table_of_contents`、`extract_table_of_contents`、`toc_index_extractor`、`table_of_contents_index`、`dfs`、`check_if_toc_transformation_is_complete`、`toc_transformer`、`clean_toc`、`assign_toc_levels`、`gen_toc_from_text`、`split_chunks`、`run_toc_from_text`、`relevant_chunks_with_toc`、`gen_metadata`、`sufficiency_check`、`multi_queries_gen`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2 | <code>#  Copyright 2024 The InfiniFlow Authors. All Rights Reserved.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 3 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 4 | <code>#  Licensed under the Apache License, Version 2.0 (the "License");</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 5 | <code>#  you may not use this file except in compliance with the License.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 6 | <code>#  You may obtain a copy of the License at</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 7 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 8 | <code>#      http://www.apache.org/licenses/LICENSE-2.0</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 9 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 10 | <code>#  Unless required by applicable law or agreed to in writing, software</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 11 | <code>#  distributed under the License is distributed on an "AS IS" BASIS,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 12 | <code>#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 13 | <code>#  See the License for the specific language governing permissions and</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 14 | <code>#  limitations under the License.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 15 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 16 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 17 | <code>import datetime</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 18 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 19 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 20 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 21 | <code>from copy import deepcopy</code> | 导入 Python 依赖 `copy`，供本模块调用其类型、函数或常量。 |
| 22 | <code>from typing import Tuple</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 23 | <code>from jinja2.sandbox import SandboxedEnvironment</code> | 导入 Python 依赖 `jinja2.sandbox`，供本模块调用其类型、函数或常量。 |
| 24 | <code>import json_repair</code> | 导入 Python 依赖 `json_repair`，供本模块调用其类型、函数或常量。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>from common.misc_utils import hash_str2int</code> | 导入 Python 依赖 `common.misc_utils`，供本模块调用其类型、函数或常量。 |
| 27 | <code>from rag.nlp import rag_tokenizer</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 28 | <code>from rag.prompts.template import load_prompt</code> | 导入 Python 依赖 `rag.prompts.template`，供本模块调用其类型、函数或常量。 |
| 29 | <code>from common.constants import TAG_FLD</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 30 | <code>from common.token_utils import encoder, num_tokens_from_string</code> | 导入 Python 依赖 `common.token_utils`，供本模块调用其类型、函数或常量。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>STOP_TOKEN = "&lt;&#124;STOP&#124;&gt;"</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 33 | <code>COMPLETE_TASK = "complete_task"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 34 | <code>INPUT_UTILIZATION = 0.5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>def get_value(d, k1, k2):</code> | 定义 Python 函数 `get_value`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 38 | <code>    return d.get(k1, d.get(k2))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>def chunks_format(reference):</code> | 定义 Python 函数 `chunks_format`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 42 | <code>    if not reference or not isinstance(reference, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 43 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 44 | <code>    raw_chunks = reference.get("chunks", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 45 | <code>    if not isinstance(raw_chunks, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 46 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 47 | <code>    return [</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 48 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 49 | <code>            "id": get_value(chunk, "chunk_id", "id"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 50 | <code>            "content": get_value(chunk, "content", "content_with_weight"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 51 | <code>            "document_id": get_value(chunk, "doc_id", "document_id"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 52 | <code>            "document_name": get_value(chunk, "docnm_kwd", "document_name"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 53 | <code>            "dataset_id": get_value(chunk, "kb_id", "dataset_id"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 54 | <code>            "image_id": get_value(chunk, "image_id", "img_id"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>            "positions": get_value(chunk, "positions", "position_int"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 56 | <code>            "url": chunk.get("url"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 57 | <code>            "similarity": chunk.get("similarity"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 58 | <code>            "vector_similarity": chunk.get("vector_similarity"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 59 | <code>            "term_similarity": chunk.get("term_similarity"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 60 | <code>            "row_id": chunk.get("row_id"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 61 | <code>            "doc_type": get_value(chunk, "doc_type_kwd", "doc_type"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 62 | <code>            "document_metadata": chunk.get("document_metadata"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 63 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>        for chunk in raw_chunks</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 65 | <code>        if isinstance(chunk, dict)</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 66 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>def message_fit_in(msg, max_length=4000):</code> | 定义 Python 函数 `message_fit_in`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 70 | <code>    def count():</code> | 定义 Python 函数 `count`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 71 | <code>        nonlocal msg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 72 | <code>        tks_cnts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 73 | <code>        for m in msg:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 74 | <code>            tks_cnts.append({"role": m["role"], "count": num_tokens_from_string(m["content"])})</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 75 | <code>        total = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 76 | <code>        for m in tks_cnts:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 77 | <code>            total += m["count"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 78 | <code>        return total</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    def trim_content(content, limit):</code> | 定义 Python 函数 `trim_content`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 81 | <code>        limit = max(0, limit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 82 | <code>        return encoder.decode(encoder.encode(content)[:limit])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>    c = count()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 85 | <code>    if c &lt; max_length:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 86 | <code>        return c, msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>    msg_ = [m for m in msg if m["role"] == "system"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 89 | <code>    if len(msg) &gt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 90 | <code>        msg_.append(msg[-1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 91 | <code>    msg = msg_</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 92 | <code>    c = count()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 93 | <code>    if c &lt; max_length:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 94 | <code>        return c, msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>    ll = num_tokens_from_string(msg_[0]["content"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 97 | <code>    ll2 = num_tokens_from_string(msg_[-1]["content"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 98 | <code>    total = ll + ll2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>    if total &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 100 | <code>        # Don't include the per-message role list in cleartext: CodeQL</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 101 | <code>        # flags this as clear-text-logging-sensitive-data because msg</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 102 | <code>        # carries user-controlled conversation content. The token</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 103 | <code>        # counts already capture what this debug line needs to convey.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 104 | <code>        # codeql[py/clear-text-logging-sensitive-data] False positive:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 105 | <code>        # only token counts and limits are logged; the message contents</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>        # were intentionally dropped from this debug call (see prior</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 107 | <code>        # commit) because they carried user content.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>        logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 109 | <code>            "message_fit_in degenerate token counts total=%s max_length=%s ll=%s ll2=%s",</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 110 | <code>            total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 111 | <code>            max_length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 112 | <code>            ll,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 113 | <code>            ll2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 114 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>        return 0, msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>    if len(msg) == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 118 | <code>        msg[0]["content"] = trim_content(msg[0]["content"], max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 119 | <code>        return count(), msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>    if ll / total &gt; 0.8:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 122 | <code>        preserved_last = min(ll2, max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 123 | <code>        msg[-1]["content"] = trim_content(msg_[-1]["content"], preserved_last)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 124 | <code>        remaining = max(0, max_length - preserved_last)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 125 | <code>        msg[0]["content"] = trim_content(msg_[0]["content"], remaining)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 126 | <code>        return count(), msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>    preserved_system = min(ll, max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 129 | <code>    msg[0]["content"] = trim_content(msg_[0]["content"], preserved_system)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 130 | <code>    remaining = max(0, max_length - preserved_system)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 131 | <code>    msg[-1]["content"] = trim_content(msg_[-1]["content"], remaining)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 132 | <code>    return count(), msg</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>def kb_prompt(kbinfos, max_tokens, hash_id=False):</code> | 定义 Python 函数 `kb_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 136 | <code>    knowledges = [get_value(ck, "content", "content_with_weight") for ck in kbinfos["chunks"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 137 | <code>    kwlg_len = len(knowledges)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 138 | <code>    used_token_count = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 139 | <code>    chunks_num = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 140 | <code>    for i, c in enumerate(knowledges):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 141 | <code>        if not c:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 142 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>        used_token_count += num_tokens_from_string(c)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 144 | <code>        chunks_num += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 145 | <code>        if max_tokens * 0.97 &lt; used_token_count:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 146 | <code>            knowledges = knowledges[:i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 147 | <code>            logging.warning(f"Not all the retrieval into prompt: {len(knowledges)}/{kwlg_len}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 148 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>    def draw_node(k, line):</code> | 定义 Python 函数 `draw_node`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 151 | <code>        if line is not None and not isinstance(line, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 152 | <code>            line = str(line)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 153 | <code>        if not line:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 154 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 155 | <code>        return f"\n├── {k}: " + re.sub(r"\n+", " ", line, flags=re.DOTALL)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>    knowledges = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 158 | <code>    for i, ck in enumerate(kbinfos["chunks"][:chunks_num]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 159 | <code>        cnt = "\nID: {}".format(i if not hash_id else hash_str2int(get_value(ck, "id", "chunk_id"), 500))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>        cnt += draw_node("Title", get_value(ck, "docnm_kwd", "document_name"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>        cnt += draw_node("URL", ck.get('url', ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 162 | <code>        meta = ck.get("document_metadata") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 163 | <code>        for k, v in meta.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 164 | <code>            cnt += draw_node(k, v)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 165 | <code>        cnt += "\n└── Content:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>        cnt += get_value(ck, "content", "content_with_weight")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 167 | <code>        knowledges.append(cnt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>    return knowledges</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>def memory_prompt(message_list, max_tokens):</code> | 定义 Python 函数 `memory_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 173 | <code>    used_token_count = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 174 | <code>    content_list = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 175 | <code>    for message in message_list:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 176 | <code>        current_content_tokens = num_tokens_from_string(message["content"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 177 | <code>        if used_token_count + current_content_tokens &gt; max_tokens * 0.97:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 178 | <code>            logging.warning(f"Not all the retrieval into prompt: {len(content_list)}/{len(message_list)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 179 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 180 | <code>        content_list.append(message["content"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 181 | <code>        used_token_count += current_content_tokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 182 | <code>    return content_list</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>CITATION_PROMPT_TEMPLATE = load_prompt("citation_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 186 | <code>CITATION_PLUS_TEMPLATE = load_prompt("citation_plus")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 187 | <code>CONTENT_TAGGING_PROMPT_TEMPLATE = load_prompt("content_tagging_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>CROSS_LANGUAGES_SYS_PROMPT_TEMPLATE = load_prompt("cross_languages_sys_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 189 | <code>CROSS_LANGUAGES_USER_PROMPT_TEMPLATE = load_prompt("cross_languages_user_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 190 | <code>FULL_QUESTION_PROMPT_TEMPLATE = load_prompt("full_question_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 191 | <code>KEYWORD_PROMPT_TEMPLATE = load_prompt("keyword_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 192 | <code>QUESTION_PROMPT_TEMPLATE = load_prompt("question_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 193 | <code>VISION_LLM_DESCRIBE_PROMPT = load_prompt("vision_llm_describe_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 194 | <code>VISION_LLM_FIGURE_DESCRIBE_PROMPT = load_prompt("vision_llm_figure_describe_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 195 | <code>VISION_LLM_FIGURE_DESCRIBE_PROMPT_WITH_CONTEXT = load_prompt("vision_llm_figure_describe_prompt_with_context")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 196 | <code>STRUCTURED_OUTPUT_PROMPT = load_prompt("structured_output_prompt")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>ANALYZE_TASK_SYSTEM = load_prompt("analyze_task_system")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 199 | <code>ANALYZE_TASK_USER = load_prompt("analyze_task_user")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 200 | <code>NEXT_STEP = load_prompt("next_step")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 201 | <code>REFLECT = load_prompt("reflect")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 202 | <code>SUMMARY4MEMORY = load_prompt("summary4memory")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 203 | <code>RANK_MEMORY = load_prompt("rank_memory")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 204 | <code>META_FILTER = load_prompt("meta_filter")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 205 | <code>ASK_SUMMARY = load_prompt("ask_summary")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>PROMPT_JINJA_ENV = SandboxedEnvironment(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 208 | <code>    autoescape=False, trim_blocks=True, lstrip_blocks=True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 209 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>def citation_prompt(user_defined_prompts: dict = {}) -&gt; str:</code> | 定义 Python 函数 `citation_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 213 | <code>    template = PROMPT_JINJA_ENV.from_string(user_defined_prompts.get("citation_guidelines", CITATION_PROMPT_TEMPLATE))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 214 | <code>    return template.render() + "\n\nIMPORTANT: The example IDs above (45, 46, 78, etc.) are illustrative only. Use the actual chunk IDs from the provided knowledge blocks."</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>def citation_plus(sources: str) -&gt; str:</code> | 定义 Python 函数 `citation_plus`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 218 | <code>    template = PROMPT_JINJA_ENV.from_string(CITATION_PLUS_TEMPLATE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 219 | <code>    return template.render(example=citation_prompt(), sources=sources)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>async def keyword_extraction(chat_mdl, content, topn=3):</code> | 定义 Python 函数 `keyword_extraction`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 223 | <code>    template = PROMPT_JINJA_ENV.from_string(KEYWORD_PROMPT_TEMPLATE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 224 | <code>    rendered_prompt = template.render(content=content, topn=topn)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>    msg = [{"role": "system", "content": rendered_prompt}, {"role": "user", "content": "Output: "}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 227 | <code>    _, msg = message_fit_in(msg, chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 228 | <code>    kwd = await chat_mdl.async_chat(rendered_prompt, msg[1:], {"temperature": 0.2})</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 229 | <code>    if isinstance(kwd, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 230 | <code>        kwd = kwd[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 231 | <code>    kwd = re.sub(r"^.*&lt;/think&gt;", "", kwd, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 232 | <code>    if kwd.find("**ERROR**") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 233 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 234 | <code>    return kwd</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>async def question_proposal(chat_mdl, content, topn=3):</code> | 定义 Python 函数 `question_proposal`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 238 | <code>    template = PROMPT_JINJA_ENV.from_string(QUESTION_PROMPT_TEMPLATE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 239 | <code>    rendered_prompt = template.render(content=content, topn=topn)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>    msg = [{"role": "system", "content": rendered_prompt}, {"role": "user", "content": "Output: "}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 242 | <code>    _, msg = message_fit_in(msg, chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 243 | <code>    kwd = await chat_mdl.async_chat(rendered_prompt, msg[1:], {"temperature": 0.2})</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 244 | <code>    if isinstance(kwd, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 245 | <code>        kwd = kwd[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>    kwd = re.sub(r"^.*&lt;/think&gt;", "", kwd, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 247 | <code>    if kwd.find("**ERROR**") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 248 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 249 | <code>    return kwd</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>async def full_question(tenant_id=None, llm_id=None, messages=[], language=None, chat_mdl=None):</code> | 定义 Python 函数 `full_question`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 253 | <code>    from common.constants import LLMType</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 254 | <code>    from api.db.services.llm_service import LLMBundle</code> | 导入 Python 依赖 `api.db.services.llm_service`，供本模块调用其类型、函数或常量。 |
| 255 | <code>    from api.db.joint_services.tenant_model_service import get_model_config_from_provider_instance, get_model_type_by_name</code> | 导入 Python 依赖 `api.db.joint_services.tenant_model_service`，供本模块调用其类型、函数或常量。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>    if not chat_mdl:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 258 | <code>        model_types = get_model_type_by_name(tenant_id, llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 259 | <code>        if "image2text" in model_types:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 260 | <code>            chat_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.IMAGE2TEXT, llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 261 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 262 | <code>            chat_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.CHAT, llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 263 | <code>        chat_mdl = LLMBundle(tenant_id, chat_model_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 264 | <code>    conv = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 265 | <code>    for m in messages:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 266 | <code>        if m["role"] not in ["user", "assistant"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 267 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 268 | <code>        conv.append("{}: {}".format(m["role"].upper(), m["content"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 269 | <code>    conversation = "\n".join(conv)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 270 | <code>    today = datetime.date.today().isoformat()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 271 | <code>    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 272 | <code>    tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>    template = PROMPT_JINJA_ENV.from_string(FULL_QUESTION_PROMPT_TEMPLATE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 275 | <code>    rendered_prompt = template.render(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 276 | <code>        today=today,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 277 | <code>        yesterday=yesterday,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 278 | <code>        tomorrow=tomorrow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 279 | <code>        conversation=conversation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 280 | <code>        language=language,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 281 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>    ans = await chat_mdl.async_chat(rendered_prompt, [{"role": "user", "content": "Output: "}])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 284 | <code>    ans = re.sub(r"^.*&lt;/think&gt;", "", ans, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 285 | <code>    return ans if ans.find("**ERROR**") &lt; 0 else messages[-1]["content"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>async def cross_languages(tenant_id, llm_id, query, languages=[]):</code> | 定义 Python 函数 `cross_languages`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 289 | <code>    from common.constants import LLMType</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 290 | <code>    from api.db.services.llm_service import LLMBundle</code> | 导入 Python 依赖 `api.db.services.llm_service`，供本模块调用其类型、函数或常量。 |
| 291 | <code>    from api.db.joint_services.tenant_model_service import get_model_config_from_provider_instance, get_tenant_default_model_by_type, get_model_type_by_name</code> | 导入 Python 依赖 `api.db.joint_services.tenant_model_service`，供本模块调用其类型、函数或常量。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>    if llm_id and "image2text" in get_model_type_by_name(tenant_id, llm_id) :</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 294 | <code>        chat_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.IMAGE2TEXT, llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 295 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 296 | <code>        if not llm_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 297 | <code>            chat_model_config = get_tenant_default_model_by_type(tenant_id, LLMType.CHAT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 298 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 299 | <code>            chat_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.CHAT, llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 300 | <code>    chat_mdl = LLMBundle(tenant_id, chat_model_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 301 | <code>    rendered_sys_prompt = PROMPT_JINJA_ENV.from_string(CROSS_LANGUAGES_SYS_PROMPT_TEMPLATE).render()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 302 | <code>    rendered_user_prompt = PROMPT_JINJA_ENV.from_string(CROSS_LANGUAGES_USER_PROMPT_TEMPLATE).render(query=query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 303 | <code>                                                                                                     languages=languages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>    ans = await chat_mdl.async_chat(rendered_sys_prompt, [{"role": "user", "content": rendered_user_prompt}],</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 306 | <code>                                    {"temperature": 0.2})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 307 | <code>    if ans.find("**ERROR**") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 308 | <code>        logging.info("[cross_languages] LLM returned error, falling back to original query")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 309 | <code>        return query</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 310 | <code>    ans = re.sub(r"^.*\*\*ERROR\*\*", "", ans, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 311 | <code>    result = "\n".join([a for a in re.sub(r"(^Output:&#124;\n+)", "", ans, flags=re.DOTALL).split("===") if a.strip()])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 312 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>async def content_tagging(chat_mdl, content, all_tags, examples, topn=3):</code> | 定义 Python 函数 `content_tagging`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 316 | <code>    template = PROMPT_JINJA_ENV.from_string(CONTENT_TAGGING_PROMPT_TEMPLATE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>    for ex in examples:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 319 | <code>        ex["tags_json"] = json.dumps(ex[TAG_FLD], indent=2, ensure_ascii=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>    rendered_prompt = template.render(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 322 | <code>        topn=topn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 323 | <code>        all_tags=all_tags,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 324 | <code>        examples=examples,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 325 | <code>        content=content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 326 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>    msg = [{"role": "system", "content": rendered_prompt}, {"role": "user", "content": "Output: "}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 329 | <code>    _, msg = message_fit_in(msg, chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 330 | <code>    kwd = await chat_mdl.async_chat(rendered_prompt, msg[1:], {"temperature": 0.5})</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 331 | <code>    if isinstance(kwd, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 332 | <code>        kwd = kwd[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 333 | <code>    kwd = re.sub(r"^.*&lt;/think&gt;", "", kwd, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 334 | <code>    if kwd.find("**ERROR**") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 335 | <code>        raise Exception(kwd)</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 338 | <code>        obj = json_repair.loads(kwd)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 339 | <code>    except json_repair.JSONDecodeError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 340 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 341 | <code>            result = kwd.replace(rendered_prompt[:-1], "").replace("user", "").replace("model", "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 342 | <code>            result = "{" + result.split("{")[1].split("}")[0] + "}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 343 | <code>            obj = json_repair.loads(result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 344 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 345 | <code>            logging.exception(f"JSON parsing error: {result} -&gt; {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 346 | <code>            raise e</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 347 | <code>    res = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 348 | <code>    for k, v in obj.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 349 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 350 | <code>            if int(v) &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 351 | <code>                res[str(k)] = int(v)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 352 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 353 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 354 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>def vision_llm_describe_prompt(page=None) -&gt; str:</code> | 定义 Python 函数 `vision_llm_describe_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 358 | <code>    template = PROMPT_JINJA_ENV.from_string(VISION_LLM_DESCRIBE_PROMPT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>    return template.render(page=page)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>def vision_llm_figure_describe_prompt() -&gt; str:</code> | 定义 Python 函数 `vision_llm_figure_describe_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 364 | <code>    template = PROMPT_JINJA_ENV.from_string(VISION_LLM_FIGURE_DESCRIBE_PROMPT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 365 | <code>    return template.render()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>def vision_llm_figure_describe_prompt_with_context(context_above: str, context_below: str) -&gt; str:</code> | 定义 Python 函数 `vision_llm_figure_describe_prompt_with_context`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 369 | <code>    template = PROMPT_JINJA_ENV.from_string(VISION_LLM_FIGURE_DESCRIBE_PROMPT_WITH_CONTEXT)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 370 | <code>    return template.render(context_above=context_above, context_below=context_below)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 373 | <code>def tool_schema(tools_description: list[dict], complete_task=False):</code> | 定义 Python 函数 `tool_schema`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 374 | <code>    if not tools_description:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 375 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 376 | <code>    desc = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 377 | <code>    if complete_task:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 378 | <code>        desc[COMPLETE_TASK] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 379 | <code>            "type": "function",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 380 | <code>            "function": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 381 | <code>                "name": COMPLETE_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 382 | <code>                "description": "When you have the final answer and are ready to complete the task, call this function with your answer",</code> | 定义函数 `with`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 383 | <code>                "parameters": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 384 | <code>                    "type": "object",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 385 | <code>                    "properties": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 386 | <code>                        "answer": {"type": "string", "description": "The final answer to the user's question"}},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 387 | <code>                    "required": ["answer"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 388 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 389 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>    for idx, tool in enumerate(tools_description):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 392 | <code>        name = tool["function"]["name"]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 393 | <code>        desc[name] = tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>    return "\n\n".join([f"## {i + 1}. {fnm}\n{json.dumps(des, ensure_ascii=False, indent=4)}" for i, (fnm, des) in</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 396 | <code>                        enumerate(desc.items())])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>def form_history(history, limit=-6):</code> | 定义 Python 函数 `form_history`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 400 | <code>    context = ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 401 | <code>    for h in history[limit:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 402 | <code>        if h["role"] == "system":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 403 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 404 | <code>        role = "USER"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 405 | <code>        if h["role"].upper() != role:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 406 | <code>            role = "AGENT"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 407 | <code>        context += f"\n{role}: {h['content'][:2048] + ('...' if len(h['content']) &gt; 2048 else '')}"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 408 | <code>    return context</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>async def analyze_task_async(chat_mdl, prompt, task_name, tools_description: list[dict],</code> | 定义 Python 函数 `analyze_task_async`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 412 | <code>                             user_defined_prompts: dict = {}):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 413 | <code>    tools_desc = tool_schema(tools_description)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 414 | <code>    context = ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>    if user_defined_prompts.get("task_analysis"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 417 | <code>        template = PROMPT_JINJA_ENV.from_string(user_defined_prompts["task_analysis"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 418 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 419 | <code>        template = PROMPT_JINJA_ENV.from_string(ANALYZE_TASK_SYSTEM + "\n\n" + ANALYZE_TASK_USER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 420 | <code>    context = template.render(task=task_name, context=context, agent_prompt=prompt, tools_desc=tools_desc)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 421 | <code>    kwd = await chat_mdl.async_chat(context, [{"role": "user", "content": "Please analyze it."}])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 422 | <code>    if isinstance(kwd, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 423 | <code>        kwd = kwd[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 424 | <code>    kwd = re.sub(r"^.*&lt;/think&gt;", "", kwd, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 425 | <code>    if kwd.find("**ERROR**") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 426 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 427 | <code>    return kwd</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>async def next_step_async(chat_mdl, history: list, tools_description: list[dict], task_desc,</code> | 定义 Python 函数 `next_step_async`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 431 | <code>                          user_defined_prompts: dict = {}):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 432 | <code>    if not tools_description:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 433 | <code>        return "", 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 434 | <code>    desc = tool_schema(tools_description)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 435 | <code>    template = PROMPT_JINJA_ENV.from_string(user_defined_prompts.get("plan_generation", NEXT_STEP))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 436 | <code>    user_prompt = "\nWhat's the next tool to call? If ready OR IMPOSSIBLE TO BE READY, then call `complete_task`."</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 437 | <code>    hist = deepcopy(history)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 438 | <code>    if hist[-1]["role"] == "user":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 439 | <code>        hist[-1]["content"] += user_prompt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 440 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 441 | <code>        hist.append({"role": "user", "content": user_prompt})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 442 | <code>    json_str = await chat_mdl.async_chat(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 443 | <code>        template.render(task_analysis=task_desc, desc=desc, today=datetime.datetime.now().strftime("%Y-%m-%d")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 444 | <code>        hist[1:],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 445 | <code>        stop=["&lt;&#124;stop&#124;&gt;"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 446 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>    tk_cnt = num_tokens_from_string(json_str)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 448 | <code>    json_str = re.sub(r"^.*&lt;/think&gt;", "", json_str, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 449 | <code>    return json_str, tk_cnt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>async def reflect_async(chat_mdl, history: list[dict], tool_call_res: list[Tuple], user_defined_prompts: dict = {}):</code> | 定义 Python 函数 `reflect_async`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 453 | <code>    tool_calls = [{"name": p[0], "result": p[1]} for p in tool_call_res]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 454 | <code>    goal = history[1]["content"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 455 | <code>    template = PROMPT_JINJA_ENV.from_string(user_defined_prompts.get("reflection", REFLECT))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 456 | <code>    user_prompt = template.render(goal=goal, tool_calls=tool_calls)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 457 | <code>    hist = deepcopy(history)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 458 | <code>    if hist[-1]["role"] == "user":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 459 | <code>        hist[-1]["content"] += user_prompt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 460 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 461 | <code>        hist.append({"role": "user", "content": user_prompt})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 462 | <code>    _, msg = message_fit_in(hist, chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 463 | <code>    ans = await chat_mdl.async_chat(msg[0]["content"], msg[1:])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 464 | <code>    ans = re.sub(r"^.*&lt;/think&gt;", "", ans, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 465 | <code>    return """</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 466 | <code>**Observation**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 467 | <code>{}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>**Reflection**</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 470 | <code>{}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 471 | <code>    """.format(json.dumps(tool_calls, ensure_ascii=False, indent=2), ans)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>def form_message(system_prompt, user_prompt):</code> | 定义 Python 函数 `form_message`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 475 | <code>    return [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>def structured_output_prompt(schema=None) -&gt; str:</code> | 定义 Python 函数 `structured_output_prompt`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 479 | <code>    template = PROMPT_JINJA_ENV.from_string(STRUCTURED_OUTPUT_PROMPT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 480 | <code>    return template.render(schema=schema)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 483 | <code>async def tool_call_summary(chat_mdl, name: str, params: dict, result: str, user_defined_prompts: dict = {}) -&gt; str:</code> | 定义 Python 函数 `tool_call_summary`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 484 | <code>    template = PROMPT_JINJA_ENV.from_string(SUMMARY4MEMORY)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 485 | <code>    system_prompt = template.render(name=name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 486 | <code>                                    params=json.dumps(params, ensure_ascii=False, indent=2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 487 | <code>                                    result=result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 488 | <code>    user_prompt = "→ Summary: "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 489 | <code>    _, msg = message_fit_in(form_message(system_prompt, user_prompt), chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 490 | <code>    ans = await chat_mdl.async_chat(msg[0]["content"], msg[1:])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 491 | <code>    return re.sub(r"^.*&lt;/think&gt;", "", ans, flags=re.DOTALL)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>async def rank_memories_async(chat_mdl, goal: str, sub_goal: str, tool_call_summaries: list[str],</code> | 定义 Python 函数 `rank_memories_async`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 495 | <code>                              user_defined_prompts: dict = {}):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 496 | <code>    template = PROMPT_JINJA_ENV.from_string(RANK_MEMORY)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 497 | <code>    system_prompt = template.render(goal=goal, sub_goal=sub_goal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 498 | <code>                                    results=[{"i": i, "content": s} for i, s in enumerate(tool_call_summaries)])</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 499 | <code>    user_prompt = " → rank: "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 500 | <code>    _, msg = message_fit_in(form_message(system_prompt, user_prompt), chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 501 | <code>    ans = await chat_mdl.async_chat(msg[0]["content"], msg[1:], stop="&lt;&#124;stop&#124;&gt;")</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 502 | <code>    return re.sub(r"^.*&lt;/think&gt;", "", ans, flags=re.DOTALL)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>async def gen_meta_filter(chat_mdl, meta_data: dict, query: str, constraints: dict = None) -&gt; dict:</code> | 定义 Python 函数 `gen_meta_filter`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 506 | <code>    """Generate metadata filter conditions from a user query using an LLM.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>    Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 509 | <code>        chat_mdl: LLM bundle for generating filters</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 510 | <code>        meta_data: Dict of {key: set of values} - e.g. {"character": {"Caocao", "Liubei"}, "year": {2026}}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 511 | <code>        query: User question (e.g. "Caocao in 2026")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 512 | <code>        constraints: Optional dict of {key: operator} to constrain which op to use for a key</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>    Returns:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 515 | <code>        Dict with "logic" ("and"/"or") and "conditions" list.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 516 | <code>        Example return value:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 517 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 518 | <code>                "logic": "and",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 519 | <code>                "conditions": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 520 | <code>                    {"key": "year", "value": "2026", "op": "="},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 521 | <code>                    {"key": "character", "value": "Caocao", "op": "="}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 522 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>    The LLM is prompted with the available metadata keys and values, and is asked to</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 526 | <code>    generate filter conditions that match the user's query semantics.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 527 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 528 | <code>    meta_data_structure = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 529 | <code>    for key, values in meta_data.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 530 | <code>        meta_data_structure[key] = list(values.keys()) if isinstance(values, dict) else values</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>    sys_prompt = PROMPT_JINJA_ENV.from_string(META_FILTER).render(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 533 | <code>        current_date=datetime.datetime.today().strftime('%Y-%m-%d'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 534 | <code>        metadata_keys=json.dumps(meta_data_structure),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 535 | <code>        user_question=query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 536 | <code>        constraints=json.dumps(constraints) if constraints else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 537 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>    user_prompt = "Generate filters:"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 539 | <code>    ans = await chat_mdl.async_chat(sys_prompt, [{"role": "user", "content": user_prompt}])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 540 | <code>    ans = re.sub(r"(^.*&lt;/think&gt;&#124;```json\n&#124;```\n*$)", "", ans, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 541 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 542 | <code>        ans = json_repair.loads(ans)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 543 | <code>        assert isinstance(ans, dict), ans</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 544 | <code>        assert "conditions" in ans and isinstance(ans["conditions"], list), ans</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 545 | <code>        return ans</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 546 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 547 | <code>        logging.exception(f"Loading json failure: {ans}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>    return {"conditions": []}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 552 | <code>async def gen_json(system_prompt: str, user_prompt: str, chat_mdl, gen_conf={}, max_retry=2):</code> | 定义 Python 函数 `gen_json`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 553 | <code>    from rag.graphrag.utils import get_llm_cache, set_llm_cache</code> | 导入 Python 依赖 `rag.graphrag.utils`，供本模块调用其类型、函数或常量。 |
| 554 | <code>    cached = get_llm_cache(chat_mdl.llm_name, system_prompt, user_prompt, gen_conf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 555 | <code>    if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 556 | <code>        return json_repair.loads(cached)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 557 | <code>    _, msg = message_fit_in(form_message(system_prompt, user_prompt), chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 558 | <code>    err = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 559 | <code>    ans = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 560 | <code>    for _ in range(max_retry):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 561 | <code>        if ans and err:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 562 | <code>            msg[-1]["content"] += f"\nGenerated JSON is as following:\n{ans}\nBut exception while loading:\n{err}\nPlease reconsider and correct it."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 563 | <code>        ans = await chat_mdl.async_chat(msg[0]["content"], msg[1:], gen_conf=gen_conf)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 564 | <code>        ans = re.sub(r"(^.*&lt;/think&gt;&#124;```json\n&#124;```\n*$)", "", ans, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 565 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 566 | <code>            res = json_repair.loads(ans)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 567 | <code>            set_llm_cache(chat_mdl.llm_name, system_prompt, ans, user_prompt, gen_conf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 568 | <code>            return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 569 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 570 | <code>            logging.exception(f"Loading json failure: {ans}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 571 | <code>            err += str(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>TOC_DETECTION = load_prompt("toc_detection")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 577 | <code>async def detect_table_of_contents(page_1024: list[str], chat_mdl):</code> | 定义 Python 函数 `detect_table_of_contents`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 578 | <code>    toc_secs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 579 | <code>    for i, sec in enumerate(page_1024[:22]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 580 | <code>        ans = await gen_json(PROMPT_JINJA_ENV.from_string(TOC_DETECTION).render(page_txt=sec), "Only JSON please.",</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 581 | <code>                             chat_mdl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 582 | <code>        if toc_secs and not ans["exists"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 583 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 584 | <code>        toc_secs.append(sec)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 585 | <code>    return toc_secs</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 588 | <code>TOC_EXTRACTION = load_prompt("toc_extraction")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 589 | <code>TOC_EXTRACTION_CONTINUE = load_prompt("toc_extraction_continue")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 592 | <code>async def extract_table_of_contents(toc_pages, chat_mdl):</code> | 定义 Python 函数 `extract_table_of_contents`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 593 | <code>    if not toc_pages:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 594 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>    return await gen_json(PROMPT_JINJA_ENV.from_string(TOC_EXTRACTION).render(toc_page="\n".join(toc_pages)),</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 597 | <code>                          "Only JSON please.", chat_mdl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 600 | <code>async def toc_index_extractor(toc: list[dict], content: str, chat_mdl):</code> | 定义 Python 函数 `toc_index_extractor`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 601 | <code>    tob_extractor_prompt = """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 602 | <code>    You are given a table of contents in a json format and several pages of a document, your job is to add the physical_index to the table of contents in the json format.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>    The provided pages contains tags like &lt;physical_index_X&gt; and &lt;physical_index_X&gt; to indicate the physical location of the page X.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 606 | <code>    The structure variable is the numeric system which represents the index of the hierarchy section in the table of contents. For example, the first section has structure index 1, the first subsection has structure index 1.1, the second subsection has structure index 1.2, etc.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>    The response should be in the following JSON format:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 609 | <code>    [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 610 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 611 | <code>            "structure": &lt;structure index, "x.x.x" or None&gt; (string),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 612 | <code>            "title": &lt;title of the section&gt;,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 613 | <code>            "physical_index": "&lt;physical_index_X&gt;" (keep the format)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 614 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 615 | <code>        ...</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 616 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>    Only add the physical_index to the sections that are in the provided pages.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 619 | <code>    If the title of the section are not in the provided pages, do not add the physical_index to it.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 620 | <code>    Directly return the final JSON structure. Do not output anything else."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 622 | <code>    prompt = tob_extractor_prompt + '\nTable of contents:\n' + json.dumps(toc, ensure_ascii=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 623 | <code>                                                                          indent=2) + '\nDocument pages:\n' + content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 624 | <code>    return await gen_json(prompt, "Only JSON please.", chat_mdl)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 627 | <code>TOC_INDEX = load_prompt("toc_index")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>async def table_of_contents_index(toc_arr: list[dict], sections: list[str], chat_mdl):</code> | 定义 Python 函数 `table_of_contents_index`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 631 | <code>    if not toc_arr or not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 632 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>    toc_map = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 635 | <code>    for i, it in enumerate(toc_arr):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 636 | <code>        k1 = (it["structure"] + it["title"]).replace(" ", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 637 | <code>        k2 = it["title"].strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 638 | <code>        if k1 not in toc_map:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 639 | <code>            toc_map[k1] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 640 | <code>        if k2 not in toc_map:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 641 | <code>            toc_map[k2] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 642 | <code>        toc_map[k1].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 643 | <code>        toc_map[k2].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>    for it in toc_arr:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 646 | <code>        it["indices"] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 647 | <code>    for i, sec in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 648 | <code>        sec = sec.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 649 | <code>        if sec.replace(" ", "") in toc_map:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 650 | <code>            for j in toc_map[sec.replace(" ", "")]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 651 | <code>                toc_arr[j]["indices"].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>    all_pathes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>    def dfs(start, path):</code> | 定义 Python 函数 `dfs`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 656 | <code>        nonlocal all_pathes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 657 | <code>        if start &gt;= len(toc_arr):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 658 | <code>            if path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 659 | <code>                all_pathes.append(path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 660 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 661 | <code>        if not toc_arr[start]["indices"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 662 | <code>            dfs(start + 1, path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 663 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 664 | <code>        added = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 665 | <code>        for j in toc_arr[start]["indices"]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 666 | <code>            if path and j &lt; path[-1][0]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 667 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 668 | <code>            _path = deepcopy(path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 669 | <code>            _path.append((j, start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 670 | <code>            added = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 671 | <code>            dfs(start + 1, _path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 672 | <code>        if not added and path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 673 | <code>            all_pathes.append(path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>    dfs(0, [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 676 | <code>    path = max(all_pathes, key=lambda x: len(x))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 677 | <code>    for it in toc_arr:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 678 | <code>        it["indices"] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 679 | <code>    for j, i in path:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 680 | <code>        toc_arr[i]["indices"] = [j]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 681 | <code>    print(json.dumps(toc_arr, ensure_ascii=False, indent=2))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>    i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 684 | <code>    while i &lt; len(toc_arr):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 685 | <code>        it = toc_arr[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 686 | <code>        if it["indices"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 687 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 688 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 690 | <code>        if i &gt; 0 and toc_arr[i - 1]["indices"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 691 | <code>            st_i = toc_arr[i - 1]["indices"][-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 692 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 693 | <code>            st_i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 694 | <code>        e = i + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 695 | <code>        while e &lt; len(toc_arr) and not toc_arr[e]["indices"]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 696 | <code>            e += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 697 | <code>        if e &gt;= len(toc_arr):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 698 | <code>            e = len(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 699 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 700 | <code>            e = toc_arr[e]["indices"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 702 | <code>        for j in range(st_i, min(e + 1, len(sections))):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 703 | <code>            ans = await gen_json(PROMPT_JINJA_ENV.from_string(TOC_INDEX).render(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 704 | <code>                structure=it["structure"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 705 | <code>                title=it["title"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 706 | <code>                text=sections[j]), "Only JSON please.", chat_mdl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 707 | <code>            if ans["exist"] == "yes":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 708 | <code>                it["indices"].append(j)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 709 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>    return toc_arr</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>async def check_if_toc_transformation_is_complete(content, toc, chat_mdl):</code> | 定义 Python 函数 `check_if_toc_transformation_is_complete`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 717 | <code>    prompt = """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 718 | <code>    You are given a raw table of contents and a  table of contents.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 719 | <code>    Your job is to check if the  table of contents is complete.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 721 | <code>    Reply format:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 722 | <code>    {{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 723 | <code>        "thinking": &lt;why do you think the cleaned table of contents is complete or not&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 724 | <code>        "completed": "yes" or "no"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 725 | <code>    }}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 726 | <code>    Directly return the final JSON structure. Do not output anything else."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 728 | <code>    prompt = prompt + '\n Raw Table of contents:\n' + content + '\n Cleaned Table of contents:\n' + toc</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 729 | <code>    response = await gen_json(prompt, "Only JSON please.", chat_mdl)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 730 | <code>    return response['completed']</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>async def toc_transformer(toc_pages, chat_mdl):</code> | 定义 Python 函数 `toc_transformer`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 734 | <code>    init_prompt = """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 735 | <code>    You are given a table of contents, You job is to transform the whole table of content into a JSON format included table_of_contents.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 737 | <code>    The `structure` is the numeric system which represents the index of the hierarchy section in the table of contents. For example, the first section has structure index 1, the first subsection has structure index 1.1, the second subsection has structure index 1.2, etc.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 738 | <code>    The `title` is a short phrase or a several-words term.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 740 | <code>    The response should be in the following JSON format:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 741 | <code>    [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 742 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 743 | <code>            "structure": &lt;structure index, "x.x.x" or None&gt; (string),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 744 | <code>            "title": &lt;title of the section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 745 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 746 | <code>        ...</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 747 | <code>    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>    You should transform the full table of contents in one go.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 749 | <code>    Directly return the final JSON structure, do not output anything else. """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 751 | <code>    toc_content = "\n".join(toc_pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 752 | <code>    prompt = init_prompt + '\n Given table of contents\n:' + toc_content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 754 | <code>    def clean_toc(arr):</code> | 定义 Python 函数 `clean_toc`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 755 | <code>        for a in arr:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 756 | <code>            a["title"] = re.sub(r"[.·….]{2,}", "", a["title"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 758 | <code>    last_complete = await gen_json(prompt, "Only JSON please.", chat_mdl)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 759 | <code>    if_complete = await check_if_toc_transformation_is_complete(toc_content,</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 760 | <code>                                                                json.dumps(last_complete, ensure_ascii=False, indent=2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 761 | <code>                                                                chat_mdl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 762 | <code>    clean_toc(last_complete)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 763 | <code>    if if_complete == "yes":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 764 | <code>        return last_complete</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>    while not (if_complete == "yes"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 767 | <code>        prompt = f"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 768 | <code>        Your task is to continue the table of contents json structure, directly output the remaining part of the json structure.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 769 | <code>        The response should be in the following JSON format:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>        The raw table of contents json structure is:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 772 | <code>        {toc_content}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>        The incomplete transformed table of contents json structure is:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 775 | <code>        {json.dumps(last_complete[-24:], ensure_ascii=False, indent=2)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>        Please continue the json structure, directly output the remaining part of the json structure."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 778 | <code>        new_complete = await gen_json(prompt, "Only JSON please.", chat_mdl)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 779 | <code>        if not new_complete or str(last_complete).find(str(new_complete)) &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 780 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 781 | <code>        clean_toc(new_complete)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 782 | <code>        last_complete.extend(new_complete)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 783 | <code>        if_complete = await check_if_toc_transformation_is_complete(toc_content,</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 784 | <code>                                                                    json.dumps(last_complete, ensure_ascii=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 785 | <code>                                                                               indent=2), chat_mdl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 787 | <code>    return last_complete</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>TOC_LEVELS = load_prompt("assign_toc_levels")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 793 | <code>async def assign_toc_levels(toc_secs, chat_mdl, gen_conf={"temperature": 0.2}):</code> | 定义 Python 函数 `assign_toc_levels`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 794 | <code>    if not toc_secs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 795 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 796 | <code>    return await gen_json(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 797 | <code>        PROMPT_JINJA_ENV.from_string(TOC_LEVELS).render(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 798 | <code>        str(toc_secs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 799 | <code>        chat_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 800 | <code>        gen_conf</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 801 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>TOC_FROM_TEXT_SYSTEM = load_prompt("toc_from_text_system")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 805 | <code>TOC_FROM_TEXT_USER = load_prompt("toc_from_text_user")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code># Generate TOC from text chunks with text llms</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 809 | <code>async def gen_toc_from_text(txt_info: dict, chat_mdl, callback=None):</code> | 定义 Python 函数 `gen_toc_from_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 810 | <code>    if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 811 | <code>        callback(msg="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 812 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 813 | <code>        ans = await gen_json(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 814 | <code>            PROMPT_JINJA_ENV.from_string(TOC_FROM_TEXT_SYSTEM).render(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 815 | <code>            PROMPT_JINJA_ENV.from_string(TOC_FROM_TEXT_USER).render(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 816 | <code>                text="\n".join([json.dumps(d, ensure_ascii=False) for d in txt_info["chunks"]])),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 817 | <code>            chat_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 818 | <code>            gen_conf={"temperature": 0.0, "top_p": 0.9}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 819 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>        txt_info["toc"] = ans if ans and not isinstance(ans, str) else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 821 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 822 | <code>        logging.exception(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>def split_chunks(chunks, max_length: int):</code> | 定义 Python 函数 `split_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 826 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 827 | <code>    Pack chunks into batches according to max_length, returning [{"id": idx, "text": chunk_text}, ...].</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 828 | <code>    Do not split a single chunk, even if it exceeds max_length.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 829 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>    result = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 832 | <code>    batch, batch_tokens = [], 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>    for idx, chunk in enumerate(chunks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 835 | <code>        t = num_tokens_from_string(chunk)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 836 | <code>        if batch_tokens + t &gt; max_length:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 837 | <code>            result.append(batch)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 838 | <code>            batch, batch_tokens = [], 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 839 | <code>        batch.append({idx: chunk})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 840 | <code>        batch_tokens += t</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 841 | <code>    if batch:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 842 | <code>        result.append(batch)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 843 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 846 | <code>async def run_toc_from_text(chunks, chat_mdl, callback=None):</code> | 定义 Python 函数 `run_toc_from_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 847 | <code>    input_budget = int(chat_mdl.max_length * INPUT_UTILIZATION) - num_tokens_from_string(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 848 | <code>        TOC_FROM_TEXT_USER + TOC_FROM_TEXT_SYSTEM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 849 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 851 | <code>    input_budget = 1024 if input_budget &gt; 1024 else input_budget</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 852 | <code>    chunk_sections = split_chunks(chunks, input_budget)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 853 | <code>    titles = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>    chunks_res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 856 | <code>    tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 857 | <code>    for i, chunk in enumerate(chunk_sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 858 | <code>        if not chunk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 859 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 860 | <code>        chunks_res.append({"chunks": chunk})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 861 | <code>        tasks.append(asyncio.create_task(gen_toc_from_text(chunks_res[-1], chat_mdl, callback)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 862 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 863 | <code>        await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 864 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 865 | <code>        logging.error(f"Error generating TOC: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 866 | <code>        for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 867 | <code>            t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 868 | <code>        await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 869 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 871 | <code>    for chunk in chunks_res:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 872 | <code>        titles.extend(chunk.get("toc", []))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>    # Filter out entries with title == -1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 875 | <code>    prune = len(titles) &gt; 512</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 876 | <code>    max_len = 12 if prune else 22</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 877 | <code>    filtered = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 878 | <code>    for x in titles:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 879 | <code>        if not isinstance(x, dict) or not x.get("title") or x["title"] == "-1":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 880 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 881 | <code>        if len(rag_tokenizer.tokenize(x["title"]).split(" ")) &gt; max_len:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 882 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 883 | <code>        if re.match(r"[0-9,.()/ -]+$", x["title"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 884 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 885 | <code>        filtered.append(x)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 887 | <code>    logging.info(f"\n\nFiltered TOC sections:\n{filtered}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 888 | <code>    if not filtered:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 889 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 890 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 891 | <code>    # Generate initial level (level/title)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 892 | <code>    raw_structure = [x.get("title", "") for x in filtered]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>    # Assign hierarchy levels using LLM</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 895 | <code>    toc_with_levels = await assign_toc_levels(raw_structure, chat_mdl, {"temperature": 0.0, "top_p": 0.9})</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 896 | <code>    if not toc_with_levels:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 897 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>    # Normalize TOC items to ensure consistent dict format</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 900 | <code>    normalized_levels = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 901 | <code>    for item in toc_with_levels:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 902 | <code>        if isinstance(item, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 903 | <code>            # Already in correct format</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 904 | <code>            normalized_levels.append(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 905 | <code>        elif isinstance(item, (list, tuple)) and len(item) &gt;= 2:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 906 | <code>            # Convert ["level", "title"] or similar to dict</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 907 | <code>            normalized_levels.append({"level": str(item[0]), "title": str(item[1])})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 908 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 909 | <code>            logging.warning(f"Unexpected TOC item format (type={type(item).__name__}), skipping: {item}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>    toc_with_levels = normalized_levels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 912 | <code>    if not toc_with_levels:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 913 | <code>        logging.warning("No valid TOC items after normalization.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 914 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 916 | <code>    # Merge structure and content (by index)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 917 | <code>    prune = len(toc_with_levels) &gt; 512</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 918 | <code>    max_lvl = "0"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 919 | <code>    sorted_list = sorted([t.get("level", "0") for t in toc_with_levels if isinstance(t, dict)])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 920 | <code>    if sorted_list:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 921 | <code>        max_lvl = sorted_list[-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 922 | <code>    merged = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 923 | <code>    for _, (toc_item, src_item) in enumerate(zip(toc_with_levels, filtered)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 924 | <code>        if prune and toc_item.get("level", "0") &gt;= max_lvl:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 925 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 926 | <code>        merged.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 927 | <code>            "level": toc_item.get("level", "0"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 928 | <code>            "title": toc_item.get("title", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 929 | <code>            "chunk_id": src_item.get("chunk_id", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 930 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 932 | <code>    return merged</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>TOC_RELEVANCE_SYSTEM = load_prompt("toc_relevance_system")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 936 | <code>TOC_RELEVANCE_USER = load_prompt("toc_relevance_user")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 937 | <code>async def relevant_chunks_with_toc(query: str, toc: list[dict], chat_mdl, topn: int = 6):</code> | 定义 Python 函数 `relevant_chunks_with_toc`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 938 | <code>    import numpy as np</code> | 导入 Python 依赖 `numpy`，供本模块调用其类型、函数或常量。 |
| 939 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 940 | <code>        ans = await gen_json(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 941 | <code>            PROMPT_JINJA_ENV.from_string(TOC_RELEVANCE_SYSTEM).render(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 942 | <code>            PROMPT_JINJA_ENV.from_string(TOC_RELEVANCE_USER).render(query=query, toc_json="[\n%s\n]\n" % "\n".join(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 943 | <code>                [json.dumps({"level": d["level"], "title": d["title"]}, ensure_ascii=False) for d in toc])),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 944 | <code>            chat_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 945 | <code>            gen_conf={"temperature": 0.0, "top_p": 0.9}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 946 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 947 | <code>        id2score = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 948 | <code>        for ti, sc in zip(toc, ans):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 949 | <code>            if not isinstance(sc, dict) or sc.get("score", -1) &lt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 950 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 951 | <code>            for id in ti.get("ids", []):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 952 | <code>                if id not in id2score:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 953 | <code>                    id2score[id] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 954 | <code>                id2score[id].append(sc["score"] / 5.)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 955 | <code>        for id in id2score.keys():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 956 | <code>            id2score[id] = np.mean(id2score[id])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 957 | <code>        return [(id, sc) for id, sc in list(id2score.items()) if sc &gt;= 0.3][:topn]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 958 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 959 | <code>        logging.exception(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 960 | <code>    return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 961 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 962 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 963 | <code>META_DATA = load_prompt("meta_data")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 964 | <code>async def gen_metadata(chat_mdl, schema: dict, content: str):</code> | 定义 Python 函数 `gen_metadata`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 965 | <code>    if not schema:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 966 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 967 | <code>    if "properties" not in schema:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 968 | <code>        logging.warning("gen_metadata: schema has no 'properties' key: %s", schema)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 969 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 970 | <code>    template = PROMPT_JINJA_ENV.from_string(META_DATA)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 971 | <code>    for k, desc in schema["properties"].items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 972 | <code>        if "enum" in desc and not desc.get("enum"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 973 | <code>            del desc["enum"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 974 | <code>        if desc.get("enum"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 975 | <code>            desc["description"] += "\n** Extracted values must strictly match the given list specified by `enum`. **"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 976 | <code>    system_prompt = template.render(content=content, schema=schema)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 977 | <code>    user_prompt = "Output: "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 978 | <code>    _, msg = message_fit_in(form_message(system_prompt, user_prompt), chat_mdl.max_length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 979 | <code>    ans = await chat_mdl.async_chat(msg[0]["content"], msg[1:])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 980 | <code>    return re.sub(r"^.*&lt;/think&gt;", "", ans, flags=re.DOTALL)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 983 | <code>SUFFICIENCY_CHECK = load_prompt("sufficiency_check")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 984 | <code>async def sufficiency_check(chat_mdl, question: str, ret_content: str):</code> | 定义 Python 函数 `sufficiency_check`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 985 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 986 | <code>        return await gen_json(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 987 | <code>            PROMPT_JINJA_ENV.from_string(SUFFICIENCY_CHECK).render(question=question, retrieved_docs=ret_content),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 988 | <code>            "Output:\n",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 989 | <code>            chat_mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 990 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 991 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 992 | <code>        logging.exception(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 993 | <code>    return {}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 995 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 996 | <code>MULTI_QUERIES_GEN = load_prompt("multi_queries_gen")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 997 | <code>async def multi_queries_gen(chat_mdl, question: str, query:str, missing_infos:list[str], ret_content: str):</code> | 定义 Python 函数 `multi_queries_gen`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 998 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 999 | <code>        return await gen_json(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1000 | <code>            PROMPT_JINJA_ENV.from_string(MULTI_QUERIES_GEN).render(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1001 | <code>                original_question=question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1002 | <code>                original_query=query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1003 | <code>                missing_info="\n - ".join(missing_infos),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1004 | <code>                retrieved_docs=ret_content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1005 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>            "Output:\n",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1007 | <code>            chat_mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1008 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1009 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1010 | <code>        logging.exception(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1011 | <code>    return {}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
