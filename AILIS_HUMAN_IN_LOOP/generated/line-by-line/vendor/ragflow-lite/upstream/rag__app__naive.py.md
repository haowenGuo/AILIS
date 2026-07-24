# vendor/ragflow-lite/upstream/rag__app__naive.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：1216
- SHA-256：`8924cb79e890be13c578b581bd7dacd846eaca3dafb5221cef411eee3dbbdd3c`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/rag__app__naive.py)
- 依赖：`logging`、`re`、`os`、`functools`、`io`、`timeit`、`docx`、`docx.opc.pkgreader`、`docx.table`、`docx.text.paragraph`、`docx.opc.oxml`、`markdown`、`PIL`、`common.token_utils`、`common.constants`、`api.db.services.llm_service`、`api.db.joint_services.tenant_model_service`、`rag.utils.file_utils`、`deepdoc.parser`、`deepdoc.parser.figure_parser`、`deepdoc.parser.pdf_parser`、`deepdoc.parser.docling_parser`、`deepdoc.parser.tcadp_parser`、`common.float_utils`、`common.parser_config_utils`、`common.text_utils`、`rag.nlp`、`base64`、`uuid`、`mammoth`、`markdownify`、`bs4`、`requests`、`pathlib`、`urllib.parse`、`common.ssrf_guard`、`tika`、`sys`
- 主要符号：`_is_short_header`、`_normalize_section_text_for_rtl_presentation_forms`、`by_deepdoc`、`by_mineru`、`by_docling`、`by_opendataloader`、`by_tcadp`、`by_paddleocr`、`by_plaintext`、`Docx`、`__init__`、`__clean`、`__get_nearest_title`、`__call__`、`flush_last_image`、`to_markdown`、`uses`、`_convert_image_to_base64`、`Pdf`、`Markdown`、`md_to_html`、`get_hyperlink_urls`、`extract_image_urls_with_lines`、`load_images_from_urls`、`load_from_xml_v2`、`chunk`、`dummy`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>#</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2 | <code>#  Copyright 2025 The InfiniFlow Authors. All Rights Reserved.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
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
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 18 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 19 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 20 | <code>from functools import reduce</code> | 导入 Python 依赖 `functools`，供本模块调用其类型、函数或常量。 |
| 21 | <code>from io import BytesIO</code> | 导入 Python 依赖 `io`，供本模块调用其类型、函数或常量。 |
| 22 | <code>from timeit import default_timer as timer</code> | 导入 Python 依赖 `timeit`，供本模块调用其类型、函数或常量。 |
| 23 | <code>from docx import Document</code> | 导入 Python 依赖 `docx`，供本模块调用其类型、函数或常量。 |
| 24 | <code>from docx.opc.pkgreader import _SerializedRelationships, _SerializedRelationship</code> | 导入 Python 依赖 `docx.opc.pkgreader`，供本模块调用其类型、函数或常量。 |
| 25 | <code>from docx.table import Table as DocxTable</code> | 导入 Python 依赖 `docx.table`，供本模块调用其类型、函数或常量。 |
| 26 | <code>from docx.text.paragraph import Paragraph</code> | 导入 Python 依赖 `docx.text.paragraph`，供本模块调用其类型、函数或常量。 |
| 27 | <code>from docx.opc.oxml import parse_xml</code> | 导入 Python 依赖 `docx.opc.oxml`，供本模块调用其类型、函数或常量。 |
| 28 | <code>from markdown import markdown</code> | 导入 Python 依赖 `markdown`，供本模块调用其类型、函数或常量。 |
| 29 | <code>from PIL import Image</code> | 导入 Python 依赖 `PIL`，供本模块调用其类型、函数或常量。 |
| 30 | <code>from common.token_utils import num_tokens_from_string</code> | 导入 Python 依赖 `common.token_utils`，供本模块调用其类型、函数或常量。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>from common.constants import LLMType, MAXIMUM_PAGE_NUMBER</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 33 | <code>from api.db.services.llm_service import LLMBundle</code> | 导入 Python 依赖 `api.db.services.llm_service`，供本模块调用其类型、函数或常量。 |
| 34 | <code>from api.db.joint_services.tenant_model_service import (</code> | 导入 Python 依赖 `api.db.joint_services.tenant_model_service`，供本模块调用其类型、函数或常量。 |
| 35 | <code>    ensure_mineru_from_env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 36 | <code>    ensure_opendataloader_from_env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 37 | <code>    ensure_paddleocr_from_env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 38 | <code>    get_first_provider_model_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 39 | <code>    get_model_config_from_provider_instance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 40 | <code>    get_tenant_default_model_by_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 41 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>from rag.utils.file_utils import extract_embed_file, extract_links_from_pdf, extract_links_from_docx, extract_html</code> | 导入 Python 依赖 `rag.utils.file_utils`，供本模块调用其类型、函数或常量。 |
| 43 | <code>from deepdoc.parser import DocxParser, EpubParser, ExcelParser, HtmlParser, JsonParser, MarkdownElementExtractor, MarkdownParser, PdfParser, TxtParser</code> | 导入 Python 依赖 `deepdoc.parser`，供本模块调用其类型、函数或常量。 |
| 44 | <code>from deepdoc.parser.figure_parser import VisionFigureParser, vision_figure_parser_docx_wrapper_naive, vision_figure_parser_pdf_wrapper</code> | 导入 Python 依赖 `deepdoc.parser.figure_parser`，供本模块调用其类型、函数或常量。 |
| 45 | <code>from deepdoc.parser.pdf_parser import PlainParser, VisionParser</code> | 导入 Python 依赖 `deepdoc.parser.pdf_parser`，供本模块调用其类型、函数或常量。 |
| 46 | <code>from deepdoc.parser.docling_parser import DoclingParser</code> | 导入 Python 依赖 `deepdoc.parser.docling_parser`，供本模块调用其类型、函数或常量。 |
| 47 | <code>from deepdoc.parser.tcadp_parser import TCADPParser</code> | 导入 Python 依赖 `deepdoc.parser.tcadp_parser`，供本模块调用其类型、函数或常量。 |
| 48 | <code>from common.float_utils import normalize_overlapped_percent</code> | 导入 Python 依赖 `common.float_utils`，供本模块调用其类型、函数或常量。 |
| 49 | <code>from common.parser_config_utils import normalize_layout_recognizer</code> | 导入 Python 依赖 `common.parser_config_utils`，供本模块调用其类型、函数或常量。 |
| 50 | <code>from common.text_utils import normalize_arabic_presentation_forms</code> | 导入 Python 依赖 `common.text_utils`，供本模块调用其类型、函数或常量。 |
| 51 | <code>from rag.nlp import (</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 52 | <code>    concat_img,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 53 | <code>    find_codec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 54 | <code>    naive_merge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>    naive_merge_with_images,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 56 | <code>    naive_merge_docx,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 57 | <code>    rag_tokenizer,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 58 | <code>    tokenize_chunks,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 59 | <code>    doc_tokenize_chunks_with_images,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 60 | <code>    tokenize_table,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 61 | <code>    append_context2table_image4pdf,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 62 | <code>    tokenize_chunks_with_images,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 63 | <code>)  # noqa: F401</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>def _is_short_header(text, max_tokens=50):</code> | 定义 Python 函数 `_is_short_header`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 67 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 68 | <code>    Check if text is a short markdown header.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 71 | <code>        text: The text to check</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 72 | <code>        max_tokens: Maximum tokens for a header to be considered "short"</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>    Returns:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 75 | <code>        bool: True if text is a short markdown header, False otherwise</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 76 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 77 | <code>    if not text or not text.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 78 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    # Check if it matches markdown header pattern: 1-6 # followed by space</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 81 | <code>    if not re.match(r"^#{1,6}\s+", text.strip()):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 82 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>    # Check if token count is below threshold</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 85 | <code>    return num_tokens_from_string(text) &lt; max_tokens</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>def _normalize_section_text_for_rtl_presentation_forms(sections):</code> | 定义 Python 函数 `_normalize_section_text_for_rtl_presentation_forms`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 89 | <code>    if not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 90 | <code>        return sections</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    normalized_sections = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 93 | <code>    for section in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 94 | <code>        if isinstance(section, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 95 | <code>            if not section:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 96 | <code>                normalized_sections.append(section)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 97 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 98 | <code>            text = section[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>            normalized_text = normalize_arabic_presentation_forms(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 100 | <code>            normalized_sections.append((normalized_text, *section[1:]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 101 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 102 | <code>        if isinstance(section, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 103 | <code>            if not section:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 104 | <code>                normalized_sections.append(section)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 105 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>            text = section[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 107 | <code>            normalized_text = normalize_arabic_presentation_forms(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>            normalized_sections.append([normalized_text, *section[1:]])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 109 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 110 | <code>        normalized_sections.append(normalize_arabic_presentation_forms(section))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>    return normalized_sections</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>def by_deepdoc(filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, lang="Chinese", callback=None, pdf_cls=None, **kwargs):</code> | 定义 Python 函数 `by_deepdoc`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 116 | <code>    callback = callback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 117 | <code>    binary = binary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 118 | <code>    pdf_parser = pdf_cls() if pdf_cls else Pdf()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 119 | <code>    sections, tables = pdf_parser(filename if not binary else binary, from_page=from_page, to_page=to_page, callback=callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>    tables = vision_figure_parser_pdf_wrapper(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 122 | <code>        tbls=tables,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 123 | <code>        sections=sections,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 124 | <code>        callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 125 | <code>        **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 126 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>    return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>def by_mineru(</code> | 定义 Python 函数 `by_mineru`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 131 | <code>    filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 132 | <code>    binary=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 133 | <code>    from_page=0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 134 | <code>    to_page=MAXIMUM_PAGE_NUMBER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 135 | <code>    lang="Chinese",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 136 | <code>    callback=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 137 | <code>    pdf_cls=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 138 | <code>    parse_method: str = "raw",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 139 | <code>    mineru_llm_name: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 140 | <code>    tenant_id: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 141 | <code>    **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 142 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>    pdf_parser = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 144 | <code>    if tenant_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 145 | <code>        if not mineru_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 146 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 147 | <code>                mineru_llm_name = get_first_provider_model_name(tenant_id, "MinerU", LLMType.OCR) or ensure_mineru_from_env(tenant_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 148 | <code>            except Exception as e:  # best-effort fallback</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 149 | <code>                logging.warning(f"fallback to env mineru: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>        if mineru_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 152 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 153 | <code>                ocr_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.OCR, mineru_llm_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 154 | <code>                ocr_model = LLMBundle(tenant_id=tenant_id, model_config=ocr_model_config, lang=lang)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 155 | <code>                pdf_parser = ocr_model.mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>                # Closes #14869: when the tenant has an IMAGE2TEXT model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 158 | <code>                # configured, let the MinerU parser enrich image chunks with</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 159 | <code>                # VLM-generated semantic descriptions (parity with deepdoc's</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>                # VisionFigureParser). Best-effort — fall back silently if</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>                # no vision model is available.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 162 | <code>                if "vision_model" not in kwargs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 163 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 164 | <code>                        vision_model_config = get_tenant_default_model_by_type(tenant_id, LLMType.IMAGE2TEXT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 165 | <code>                        kwargs["vision_model"] = LLMBundle(tenant_id=tenant_id, model_config=vision_model_config, lang=lang)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>                    except Exception as vlm_err:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 167 | <code>                        logging.info(f"[MinerU] no IMAGE2TEXT model for tenant; skipping image VLM enhancement: {vlm_err}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>                sections, tables = pdf_parser.parse_pdf(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 170 | <code>                    filepath=filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 171 | <code>                    binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 172 | <code>                    callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 173 | <code>                    parse_method=parse_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 174 | <code>                    lang=lang,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 175 | <code>                    **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 176 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>                return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 178 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 179 | <code>                logging.error(f"Failed to parse pdf via LLMBundle MinerU ({mineru_llm_name}): {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>    if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 182 | <code>        callback(-1, "MinerU not found.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 183 | <code>    return None, None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>def by_docling(filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, lang="Chinese", callback=None, pdf_cls=None, **kwargs):</code> | 定义 Python 函数 `by_docling`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 187 | <code>    pdf_parser = DoclingParser()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>    parse_method = kwargs.get("parse_method", "raw")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>    if not pdf_parser.check_installation():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 191 | <code>        if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 192 | <code>            callback(-1, "Docling not found.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 193 | <code>        return None, None, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>    sections, tables = pdf_parser.parse_pdf(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 196 | <code>        filepath=filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 197 | <code>        binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 198 | <code>        callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 199 | <code>        output_dir=os.environ.get("DOCLING_OUTPUT_DIR", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 200 | <code>        delete_output=bool(int(os.environ.get("DOCLING_DELETE_OUTPUT", 1))),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 201 | <code>        docling_server_url=os.environ.get("DOCLING_SERVER_URL", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 202 | <code>        parse_method=parse_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 203 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>    return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>def by_opendataloader(</code> | 定义 Python 函数 `by_opendataloader`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 208 | <code>    filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 209 | <code>    binary=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 210 | <code>    from_page=0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 211 | <code>    to_page=MAXIMUM_PAGE_NUMBER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 212 | <code>    lang="Chinese",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 213 | <code>    callback=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 214 | <code>    pdf_cls=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 215 | <code>    parse_method: str = "raw",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 216 | <code>    opendataloader_llm_name: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 217 | <code>    tenant_id: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 218 | <code>    **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 219 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 220 | <code>    if tenant_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 221 | <code>        if not opendataloader_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 222 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 223 | <code>                opendataloader_llm_name = get_first_provider_model_name(tenant_id, "OpenDataLoader", LLMType.OCR) or ensure_opendataloader_from_env(tenant_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 224 | <code>            except Exception as e:  # best-effort fallback</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 225 | <code>                logging.warning(f"fallback to env opendataloader: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>        if opendataloader_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 228 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 229 | <code>                ocr_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.OCR, opendataloader_llm_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 230 | <code>                ocr_model = LLMBundle(tenant_id=tenant_id, model_config=ocr_model_config, lang=lang)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 231 | <code>                pdf_parser = ocr_model.mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 232 | <code>                parse_options = {k: kwargs[k] for k in ("hybrid", "image_output", "sanitize") if k in kwargs}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 233 | <code>                sections, tables = pdf_parser.parse_pdf(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 234 | <code>                    filepath=filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 235 | <code>                    binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 236 | <code>                    callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 237 | <code>                    parse_method=parse_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 238 | <code>                    **parse_options,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 239 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>                return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 241 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 242 | <code>                logging.error(f"Failed to parse pdf via LLMBundle OpenDataLoader ({opendataloader_llm_name}): {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>    if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 245 | <code>        callback(-1, "OpenDataLoader not found.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>    return None, None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>def by_tcadp(filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, lang="Chinese", callback=None, pdf_cls=None, **kwargs):</code> | 定义 Python 函数 `by_tcadp`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 250 | <code>    tcadp_parser = TCADPParser()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>    if not tcadp_parser.check_installation():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 253 | <code>        callback(-1, "TCADP parser not available. Please check Tencent Cloud API configuration.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 254 | <code>        return None, None, tcadp_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>    sections, tables = tcadp_parser.parse_pdf(filepath=filename, binary=binary, callback=callback, output_dir=os.environ.get("TCADP_OUTPUT_DIR", ""), file_type="PDF")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 257 | <code>    return sections, tables, tcadp_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>def by_paddleocr(</code> | 定义 Python 函数 `by_paddleocr`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 261 | <code>    filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 262 | <code>    binary=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 263 | <code>    from_page=0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 264 | <code>    to_page=MAXIMUM_PAGE_NUMBER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 265 | <code>    lang="Chinese",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 266 | <code>    callback=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 267 | <code>    pdf_cls=None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 268 | <code>    parse_method: str = "raw",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 269 | <code>    paddleocr_llm_name: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 270 | <code>    tenant_id: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 271 | <code>    **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 272 | <code>):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 273 | <code>    pdf_parser = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 274 | <code>    if tenant_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 275 | <code>        if not paddleocr_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 276 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 277 | <code>                paddleocr_llm_name = get_first_provider_model_name(tenant_id, "PaddleOCR", LLMType.OCR) or ensure_paddleocr_from_env(tenant_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 278 | <code>            except Exception as e:  # best-effort fallback</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 279 | <code>                logging.warning(f"fallback to env paddleocr: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>        if paddleocr_llm_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 282 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 283 | <code>                ocr_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.OCR, paddleocr_llm_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 284 | <code>                ocr_model = LLMBundle(tenant_id=tenant_id, model_config=ocr_model_config, lang=lang)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 285 | <code>                pdf_parser = ocr_model.mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 286 | <code>                sections, tables = pdf_parser.parse_pdf(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 287 | <code>                    filepath=filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 288 | <code>                    binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 289 | <code>                    callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 290 | <code>                    parse_method=parse_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 291 | <code>                    **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 292 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>                return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 294 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 295 | <code>                logging.error(f"Failed to parse pdf via LLMBundle PaddleOCR ({paddleocr_llm_name}): {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>        return None, None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>    if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 300 | <code>        callback(-1, "PaddleOCR not found.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 301 | <code>    return None, None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>def by_plaintext(filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, callback=None, **kwargs):</code> | 定义 Python 函数 `by_plaintext`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 305 | <code>    layout_recognizer = (kwargs.get("layout_recognizer") or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 306 | <code>    if (not layout_recognizer) or (layout_recognizer == "Plain Text"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 307 | <code>        pdf_parser = PlainParser()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 308 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 309 | <code>        tenant_id = kwargs.get("tenant_id")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 310 | <code>        if not tenant_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 311 | <code>            raise ValueError("tenant_id is required when using vision layout recognizer")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 312 | <code>        vision_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.IMAGE2TEXT, layout_recognizer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 313 | <code>        vision_model = LLMBundle(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 314 | <code>            tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 315 | <code>            model_config=vision_model_config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 316 | <code>            lang=kwargs.get("lang", "Chinese"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 317 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>        pdf_parser = VisionParser(vision_model=vision_model, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>    sections, tables = pdf_parser(filename if not binary else binary, from_page=from_page, to_page=to_page, callback=callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 321 | <code>    return sections, tables, pdf_parser</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>PARSERS = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 325 | <code>    "deepdoc": by_deepdoc,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 326 | <code>    "mineru": by_mineru,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 327 | <code>    "docling": by_docling,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 328 | <code>    "opendataloader": by_opendataloader,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 329 | <code>    "tcadp parser": by_tcadp,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 330 | <code>    "paddleocr": by_paddleocr,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 331 | <code>    "plaintext": by_plaintext,  # default</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 332 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>class Docx(DocxParser):</code> | 定义 Python 类 `Docx`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 336 | <code>    def __init__(self):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 337 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>    def __clean(self, line):</code> | 定义 Python 函数 `__clean`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 340 | <code>        line = re.sub(r"\u3000", " ", line).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 341 | <code>        return line</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>    def __get_nearest_title(self, table_index, filename):</code> | 定义 Python 函数 `__get_nearest_title`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 344 | <code>        """Get the hierarchical title structure before the table"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 345 | <code>        import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 346 | <code>        from docx.text.paragraph import Paragraph</code> | 导入 Python 依赖 `docx.text.paragraph`，供本模块调用其类型、函数或常量。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>        titles = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 349 | <code>        blocks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>        # Get document name from filename parameter</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 352 | <code>        doc_name = re.sub(r"\.[a-zA-Z]+$", "", filename)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 353 | <code>        if not doc_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 354 | <code>            doc_name = "Untitled Document"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>        # Collect all document blocks while maintaining document order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 357 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 358 | <code>            # Iterate through all paragraphs and tables in document order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 359 | <code>            for i, block in enumerate(self.doc._element.body):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 360 | <code>                if block.tag.endswith("p"):  # Paragraph</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 361 | <code>                    p = Paragraph(block, self.doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 362 | <code>                    blocks.append(("p", i, p))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 363 | <code>                elif block.tag.endswith("tbl"):  # Table</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 364 | <code>                    blocks.append(("t", i, None))  # Table object will be retrieved later</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 365 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 366 | <code>            logging.error(f"Error collecting blocks: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 367 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>        # Find the target table position</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 370 | <code>        target_table_pos = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 371 | <code>        table_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 372 | <code>        for i, (block_type, pos, _) in enumerate(blocks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 373 | <code>            if block_type == "t":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 374 | <code>                if table_count == table_index:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 375 | <code>                    target_table_pos = pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 376 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 377 | <code>                table_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>        if target_table_pos == -1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 380 | <code>            return ""  # Target table not found</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>        # Find the nearest heading paragraph in reverse order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 383 | <code>        nearest_title = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 384 | <code>        for i in range(len(blocks) - 1, -1, -1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 385 | <code>            block_type, pos, block = blocks[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 386 | <code>            if pos &gt;= target_table_pos:  # Skip blocks after the table</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 387 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>            if block_type != "p":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 390 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>            if block.style and block.style.name and re.search(r"Heading\s*(\d+)", block.style.name, re.I):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 393 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 394 | <code>                    level_match = re.search(r"(\d+)", block.style.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 395 | <code>                    if level_match:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 396 | <code>                        level = int(level_match.group(1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 397 | <code>                        if level &lt;= 7:  # Support up to 7 heading levels</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 398 | <code>                            title_text = block.text.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 399 | <code>                            if title_text:  # Avoid empty titles</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 400 | <code>                                nearest_title = (level, title_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 401 | <code>                                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 402 | <code>                except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 403 | <code>                    logging.error(f"Error parsing heading level: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>        if nearest_title:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 406 | <code>            # Add current title</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 407 | <code>            titles.append(nearest_title)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 408 | <code>            current_level = nearest_title[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>            # Find all parent headings, allowing cross-level search</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 411 | <code>            while current_level &gt; 1:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 412 | <code>                found = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 413 | <code>                for i in range(len(blocks) - 1, -1, -1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 414 | <code>                    block_type, pos, block = blocks[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 415 | <code>                    if pos &gt;= target_table_pos:  # Skip blocks after the table</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 416 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>                    if block_type != "p":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 419 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>                    if block.style and re.search(r"Heading\s*(\d+)", block.style.name, re.I):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 422 | <code>                        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 423 | <code>                            level_match = re.search(r"(\d+)", block.style.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 424 | <code>                            if level_match:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 425 | <code>                                level = int(level_match.group(1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 426 | <code>                                # Find any heading with a higher level</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 427 | <code>                                if level &lt; current_level:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 428 | <code>                                    title_text = block.text.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 429 | <code>                                    if title_text:  # Avoid empty titles</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 430 | <code>                                        titles.append((level, title_text))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 431 | <code>                                        current_level = level</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 432 | <code>                                        found = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 433 | <code>                                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 434 | <code>                        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 435 | <code>                            logging.error(f"Error parsing parent heading: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>                if not found:  # Break if no parent heading is found</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 438 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>            # Sort by level (ascending, from highest to lowest)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 441 | <code>            titles.sort(key=lambda x: x[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 442 | <code>            # Organize titles (from highest to lowest)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 443 | <code>            hierarchy = [doc_name] + [t[1] for t in titles]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 444 | <code>            return " &gt; ".join(hierarchy)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>    def __call__(self, filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 449 | <code>        self.doc = Document(filename) if not binary else Document(BytesIO(binary))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 450 | <code>        pn = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 451 | <code>        lines = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 452 | <code>        last_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 453 | <code>        table_idx = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>        def flush_last_image():</code> | 定义 Python 函数 `flush_last_image`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 456 | <code>            nonlocal last_image, lines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 457 | <code>            if last_image is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 458 | <code>                lines.append({"text": "", "image": last_image, "table": None, "style": "Image"})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 459 | <code>                last_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>        for block in self.doc._element.body:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 462 | <code>            if pn &gt; to_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 463 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>            if block.tag.endswith("p"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 466 | <code>                p = Paragraph(block, self.doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>                if from_page &lt;= pn &lt; to_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 469 | <code>                    text = p.text.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 470 | <code>                    style_name = p.style.name if p.style else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>                    if text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 473 | <code>                        if style_name == "Caption":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 474 | <code>                            former_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>                            if lines and lines[-1].get("image") and lines[-1].get("style") != "Caption":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 477 | <code>                                former_image = lines[-1].get("image")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 478 | <code>                                lines.pop()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>                            elif last_image is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 481 | <code>                                former_image = last_image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 482 | <code>                                last_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>                            lines.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 485 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 486 | <code>                                    "text": self.__clean(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 487 | <code>                                    "image": former_image if former_image else None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 488 | <code>                                    "table": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 489 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 490 | <code>                            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>                        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 493 | <code>                            flush_last_image()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 494 | <code>                            lines.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 495 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 496 | <code>                                    "text": self.__clean(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 497 | <code>                                    "image": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 498 | <code>                                    "table": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 499 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>                            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 502 | <code>                            current_image = self.get_picture(self.doc, p)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 503 | <code>                            if current_image is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 504 | <code>                                lines.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 505 | <code>                                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 506 | <code>                                        "text": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 507 | <code>                                        "image": current_image,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 508 | <code>                                        "table": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 509 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 510 | <code>                                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 512 | <code>                    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 513 | <code>                        current_image = self.get_picture(self.doc, p)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 514 | <code>                        if current_image is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 515 | <code>                            last_image = current_image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>                for run in p.runs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 518 | <code>                    xml = run._element.xml</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 519 | <code>                    if "lastRenderedPageBreak" in xml:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 520 | <code>                        pn += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 521 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 522 | <code>                    if "w:br" in xml and 'type="page"' in xml:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 523 | <code>                        pn += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>            elif block.tag.endswith("tbl"):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 526 | <code>                if pn &lt; from_page or pn &gt; to_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 527 | <code>                    table_idx += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 528 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>                flush_last_image()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 531 | <code>                tb = DocxTable(block, self.doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 532 | <code>                title = self.__get_nearest_title(table_idx, filename)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 533 | <code>                html = "&lt;table&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 534 | <code>                if title:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 535 | <code>                    html += f"&lt;caption&gt;Table Location: {title}&lt;/caption&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 536 | <code>                for r in tb.rows:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 537 | <code>                    html += "&lt;tr&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 538 | <code>                    col_idx = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 539 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 540 | <code>                        while col_idx &lt; len(r.cells):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 541 | <code>                            span = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 542 | <code>                            c = r.cells[col_idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 543 | <code>                            for j in range(col_idx + 1, len(r.cells)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 544 | <code>                                if c.text == r.cells[j].text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 545 | <code>                                    span += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 546 | <code>                                    col_idx = j</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 547 | <code>                                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 548 | <code>                                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 549 | <code>                            col_idx += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 550 | <code>                            html += f"&lt;td&gt;{c.text}&lt;/td&gt;" if span == 1 else f"&lt;td colspan='{span}'&gt;{c.text}&lt;/td&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 551 | <code>                    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 552 | <code>                        logging.warning(f"Error parsing table, ignore: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 553 | <code>                    html += "&lt;/tr&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 554 | <code>                html += "&lt;/table&gt;"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 555 | <code>                lines.append({"text": "", "image": None, "table": html})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 556 | <code>                table_idx += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 558 | <code>        flush_last_image()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 559 | <code>        new_line = [(line.get("text"), line.get("image"), line.get("table")) for line in lines]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>        return new_line</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 562 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 563 | <code>    def to_markdown(self, filename=None, binary=None, inline_images: bool = True):</code> | 定义 Python 函数 `to_markdown`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 564 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 565 | <code>        This function uses mammoth, licensed under the BSD 2-Clause License.</code> | 定义函数 `uses`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 566 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>        import base64</code> | 导入 Python 依赖 `base64`，供本模块调用其类型、函数或常量。 |
| 569 | <code>        import uuid</code> | 导入 Python 依赖 `uuid`，供本模块调用其类型、函数或常量。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>        import mammoth</code> | 导入 Python 依赖 `mammoth`，供本模块调用其类型、函数或常量。 |
| 572 | <code>        from markdownify import markdownify</code> | 导入 Python 依赖 `markdownify`，供本模块调用其类型、函数或常量。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>        docx_file = BytesIO(binary) if binary else open(filename, "rb")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>        def _convert_image_to_base64(image):</code> | 定义 Python 函数 `_convert_image_to_base64`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 577 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 578 | <code>                with image.open() as image_file:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 579 | <code>                    image_bytes = image_file.read()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 580 | <code>                encoded = base64.b64encode(image_bytes).decode("utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 581 | <code>                base64_url = f"data:{image.content_type};base64,{encoded}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 583 | <code>                alt_name = "image"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 584 | <code>                alt_name = f"img_{uuid.uuid4().hex[:8]}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 586 | <code>                return {"src": base64_url, "alt": alt_name}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 587 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 588 | <code>                logging.warning(f"Failed to convert image to base64: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 589 | <code>                return {"src": "", "alt": "image"}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 592 | <code>            if inline_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 593 | <code>                result = mammoth.convert_to_html(docx_file, convert_image=mammoth.images.img_element(_convert_image_to_base64))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 594 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 595 | <code>                result = mammoth.convert_to_html(docx_file)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>            html = result.value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>            markdown_text = markdownify(html)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 600 | <code>            return markdown_text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>        finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 603 | <code>            if not binary:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 604 | <code>                docx_file.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 607 | <code>class Pdf(PdfParser):</code> | 定义 Python 类 `Pdf`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 608 | <code>    def __init__(self):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 609 | <code>        super().__init__()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>    def __call__(self, filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, zoomin=3, callback=None, separate_tables_figures=False):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 612 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 613 | <code>        first_start = start</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 614 | <code>        callback(msg="OCR started")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 615 | <code>        self.__images__(filename if not binary else binary, zoomin, from_page, to_page, callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 616 | <code>        callback(msg="OCR finished ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 617 | <code>        logging.info("OCR({}~{}): {:.2f}s".format(from_page, to_page, timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 620 | <code>        self._layouts_rec(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 621 | <code>        callback(0.63, "Layout analysis ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 623 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 624 | <code>        self._table_transformer_job(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 625 | <code>        callback(0.65, "Table analysis ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 627 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 628 | <code>        self._text_merge(zoomin=zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 629 | <code>        callback(0.67, "Text merged ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>        if separate_tables_figures:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 632 | <code>            tbls, figures = self._extract_table_figure(True, zoomin, True, True, True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 633 | <code>            self._concat_downward()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 634 | <code>            logging.info("layouts cost: {}s".format(timer() - first_start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 635 | <code>            return [(b["text"], self._line_tag(b, zoomin)) for b in self.boxes], tbls, figures</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 636 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 637 | <code>            tbls = self._extract_table_figure(True, zoomin, True, True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 638 | <code>            self._naive_vertical_merge()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 639 | <code>            self._concat_downward()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 640 | <code>            # self._final_reading_order_merge()</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 641 | <code>            # self._filter_forpages()</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 642 | <code>            logging.info("layouts cost: {}s".format(timer() - first_start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 643 | <code>            return [(b["text"], self._line_tag(b, zoomin)) for b in self.boxes], tbls</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code># Maximum number of HTTP redirects followed when fetching a remote image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 647 | <code># referenced by a markdown document (each hop is SSRF-validated).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 648 | <code>MAX_IMAGE_REDIRECTS = 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 651 | <code>class Markdown(MarkdownParser):</code> | 定义 Python 类 `Markdown`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 652 | <code>    def md_to_html(self, sections):</code> | 定义 Python 函数 `md_to_html`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 653 | <code>        if not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 654 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 655 | <code>        if isinstance(sections, type("")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 656 | <code>            text = sections</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 657 | <code>        elif isinstance(sections[0], type("")):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 658 | <code>            text = sections[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 659 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 660 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 662 | <code>        from bs4 import BeautifulSoup</code> | 导入 Python 依赖 `bs4`，供本模块调用其类型、函数或常量。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>        html_content = markdown(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 665 | <code>        soup = BeautifulSoup(html_content, "html.parser")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 666 | <code>        return soup</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 668 | <code>    def get_hyperlink_urls(self, soup):</code> | 定义 Python 函数 `get_hyperlink_urls`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 669 | <code>        if soup:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 670 | <code>            return set([a.get("href") for a in soup.find_all("a") if a.get("href")])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 671 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>    def extract_image_urls_with_lines(self, text):</code> | 定义 Python 函数 `extract_image_urls_with_lines`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 674 | <code>        md_img_re = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 675 | <code>        html_img_re = re.compile(r'src=["\\\']([^"\\\'&gt;\\s]+)', re.IGNORECASE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 676 | <code>        urls = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 677 | <code>        seen = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 678 | <code>        lines = text.splitlines()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 679 | <code>        for idx, line in enumerate(lines):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 680 | <code>            for url in md_img_re.findall(line):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 681 | <code>                if (url, idx) not in seen:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 682 | <code>                    urls.append({"url": url, "line": idx})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 683 | <code>                    seen.add((url, idx))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 684 | <code>            for url in html_img_re.findall(line):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 685 | <code>                if (url, idx) not in seen:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 686 | <code>                    urls.append({"url": url, "line": idx})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 687 | <code>                    seen.add((url, idx))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>        # cross-line</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 690 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 691 | <code>            from bs4 import BeautifulSoup</code> | 导入 Python 依赖 `bs4`，供本模块调用其类型、函数或常量。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>            soup = BeautifulSoup(text, "html.parser")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 694 | <code>            newline_offsets = [m.start() for m in re.finditer(r"\n", text)] + [len(text)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 695 | <code>            for img_tag in soup.find_all("img"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 696 | <code>                src = img_tag.get("src")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 697 | <code>                if not src:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 698 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>                tag_str = str(img_tag)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 701 | <code>                pos = text.find(tag_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 702 | <code>                if pos == -1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 703 | <code>                    # fallback</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 704 | <code>                    pos = max(text.find(src), 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 705 | <code>                line_no = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 706 | <code>                for i, off in enumerate(newline_offsets):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 707 | <code>                    if pos &lt;= off:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 708 | <code>                        line_no = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 709 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 710 | <code>                if (src, line_no) not in seen:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 711 | <code>                    urls.append({"url": src, "line": line_no})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 712 | <code>                    seen.add((src, line_no))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 713 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 714 | <code>            logging.error("Failed to extract image urls: {}".format(e))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 715 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>        return urls</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>    def load_images_from_urls(self, urls, cache=None):</code> | 定义 Python 函数 `load_images_from_urls`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 720 | <code>        import requests</code> | 导入 Python 依赖 `requests`，供本模块调用其类型、函数或常量。 |
| 721 | <code>        from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 722 | <code>        from urllib.parse import urljoin</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>        from common.ssrf_guard import assert_url_is_safe, pin_dns</code> | 导入 Python 依赖 `common.ssrf_guard`，供本模块调用其类型、函数或常量。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>        cache = cache or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 727 | <code>        images = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 728 | <code>        for url in urls:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 729 | <code>            if url in cache:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 730 | <code>                if cache[url]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 731 | <code>                    images.append(cache[url])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 732 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 733 | <code>            img_obj = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 734 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 735 | <code>                if url.startswith(("http://", "https://")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 736 | <code>                    # SSRF guard: image references come from the (untrusted) uploaded</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 737 | <code>                    # document, so validate and DNS-pin every hop before connecting.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 738 | <code>                    # Otherwise a markdown image like ![x](http://169.254.169.254/...)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 739 | <code>                    # would make the server fetch internal services / cloud metadata.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 740 | <code>                    # Redirects are followed manually so each hop is re-validated,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 741 | <code>                    # mirroring common/data_source/rss_connector.py.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 742 | <code>                    current_hostname, current_ip = assert_url_is_safe(url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 743 | <code>                    current_url = url</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 744 | <code>                    response = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 745 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 746 | <code>                        for _ in range(MAX_IMAGE_REDIRECTS + 1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 747 | <code>                            # Release the previous hop before opening the next: with</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 748 | <code>                            # stream=True the connection isn't returned to the pool</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 749 | <code>                            # until the body is read or the response is closed.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 750 | <code>                            if response is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 751 | <code>                                response.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 752 | <code>                            with pin_dns(current_hostname, current_ip):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 753 | <code>                                response = requests.get(current_url, stream=True, timeout=30, allow_redirects=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 754 | <code>                            if response.status_code not in (301, 302, 303, 307, 308):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 755 | <code>                                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 756 | <code>                            location = response.headers.get("Location")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 757 | <code>                            if not location:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 758 | <code>                                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 759 | <code>                            current_url = urljoin(current_url, location)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 760 | <code>                            current_hostname, current_ip = assert_url_is_safe(current_url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 761 | <code>                        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 762 | <code>                            raise ValueError(f"Exceeded {MAX_IMAGE_REDIRECTS} redirects fetching {url!r}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 763 | <code>                        if response.status_code == 200 and response.headers.get("Content-Type", "").startswith("image/"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 764 | <code>                            img_obj = Image.open(BytesIO(response.content)).convert("RGB")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 765 | <code>                    finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 766 | <code>                        # Always release the final/streamed response, including the</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 767 | <code>                        # non-image and redirect-cap paths where the body is unread.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 768 | <code>                        if response is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 769 | <code>                            response.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 770 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 771 | <code>                    local_path = Path(url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 772 | <code>                    if local_path.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 773 | <code>                        img_obj = Image.open(url).convert("RGB")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 774 | <code>                    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 775 | <code>                        logging.warning(f"Local image file not found: {url}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 776 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 777 | <code>                logging.error(f"Failed to download/open image from {url}: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 778 | <code>            cache[url] = img_obj</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 779 | <code>            if img_obj:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 780 | <code>                images.append(img_obj)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 781 | <code>        return images, cache</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 783 | <code>    def __call__(self, filename, binary=None, separate_tables=True, delimiter=None, return_section_images=False):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 784 | <code>        """Parse markdown into text sections and optional standalone table chunks."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 785 | <code>        if binary:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 786 | <code>            encoding = find_codec(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 787 | <code>            txt = binary.decode(encoding, errors="ignore")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 788 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 789 | <code>            with open(filename, "r") as f:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 790 | <code>                txt = f.read()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>        remainder, tables = self.extract_tables_and_remainder(f"{txt}\n", separate_tables=separate_tables)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 793 | <code>        parsing_text = remainder if separate_tables else txt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 794 | <code>        extractor = MarkdownElementExtractor(parsing_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 795 | <code>        image_refs = self.extract_image_urls_with_lines(parsing_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 796 | <code>        element_sections = extractor.extract_elements(delimiter, include_meta=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 798 | <code>        sections = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 799 | <code>        section_images = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 800 | <code>        image_cache = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 801 | <code>        for element in element_sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 802 | <code>            content = element["content"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 803 | <code>            start_line = element["start_line"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 804 | <code>            end_line = element["end_line"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 805 | <code>            urls_in_section = [ref["url"] for ref in image_refs if start_line &lt;= ref["line"] &lt;= end_line]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 806 | <code>            imgs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 807 | <code>            if urls_in_section:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 808 | <code>                imgs, image_cache = self.load_images_from_urls(urls_in_section, image_cache)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 809 | <code>            combined_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 810 | <code>            if imgs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 811 | <code>                combined_image = reduce(concat_img, imgs) if len(imgs) &gt; 1 else imgs[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 812 | <code>            sections.append((content, ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 813 | <code>            section_images.append(combined_image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>        tbls = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 816 | <code>        for table in tables:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 817 | <code>            tbls.append(((None, markdown(table, extensions=["markdown.extensions.tables"])), ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 818 | <code>        if return_section_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 819 | <code>            return sections, tbls, section_images</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 820 | <code>        return sections, tbls</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>def load_from_xml_v2(baseURI, rels_item_xml):</code> | 定义 Python 函数 `load_from_xml_v2`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 824 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 825 | <code>    Return &#124;_SerializedRelationships&#124; instance loaded with the</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 826 | <code>    relationships contained in *rels_item_xml*. Returns an empty</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 827 | <code>    collection if *rels_item_xml* is &#124;None&#124;.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 828 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 829 | <code>    srels = _SerializedRelationships()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 830 | <code>    if rels_item_xml is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 831 | <code>        rels_elm = parse_xml(rels_item_xml)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 832 | <code>        for rel_elm in rels_elm.Relationship_lst:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 833 | <code>            if rel_elm.target_ref in ("../NULL", "NULL") or rel_elm.target_ref.startswith("#"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 834 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 835 | <code>            srels._srels.append(_SerializedRelationship(baseURI, rel_elm))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 836 | <code>    return srels</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 839 | <code>def chunk(filename, binary=None, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, lang="Chinese", callback=None, **kwargs):</code> | 定义 Python 函数 `chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 840 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 841 | <code>    Supported file formats are docx, pdf, excel, txt.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 842 | <code>    This method apply the naive ways to chunk files.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 843 | <code>    Successive text will be sliced into pieces using 'delimiter'.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 844 | <code>    Next, these successive pieces are merge into chunks whose token number is no more than 'Max token number'.</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 845 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 846 | <code>    urls = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 847 | <code>    url_res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>    lang = lang or "Chinese"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 850 | <code>    is_english = lang.lower() == "english"  # is_english(cks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 851 | <code>    parser_config = kwargs.get("parser_config", {"chunk_token_num": 512, "delimiter": "\n!?。；！？", "layout_recognize": "DeepDOC", "analyze_hyperlink": True})</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 853 | <code>    child_deli = (parser_config.get("children_delimiter") or "").encode("utf-8").decode("unicode_escape").encode("latin1").decode("utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 854 | <code>    cust_child_deli = re.findall(r"`([^`]+)`", child_deli)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 855 | <code>    child_deli = "&#124;".join(re.sub(r"`([^`]+)`", "", child_deli))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 856 | <code>    if cust_child_deli:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 857 | <code>        cust_child_deli = sorted(set(cust_child_deli), key=lambda x: -len(x))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 858 | <code>        cust_child_deli = "&#124;".join(re.escape(t) for t in cust_child_deli if t)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 859 | <code>        child_deli += cust_child_deli</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>    is_markdown = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 862 | <code>    table_context_size = max(0, int(parser_config.get("table_context_size", 0) or 0))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 863 | <code>    image_context_size = max(0, int(parser_config.get("image_context_size", 0) or 0))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>    doc = {"docnm_kwd": filename, "title_tks": rag_tokenizer.tokenize(re.sub(r"\.[a-zA-Z]+$", "", filename))}</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 866 | <code>    doc["title_sm_tks"] = rag_tokenizer.fine_grained_tokenize(doc["title_tks"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 867 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 868 | <code>    pdf_parser = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 869 | <code>    section_images = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 871 | <code>    is_root = kwargs.get("is_root", True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 872 | <code>    embed_res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 873 | <code>    if is_root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 874 | <code>        # Only extract embedded files at the root call</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 875 | <code>        embeds = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 876 | <code>        if binary is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 877 | <code>            embeds = extract_embed_file(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 878 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 879 | <code>            raise Exception("Embedding extraction from file path is not supported.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>        # Recursively chunk each embedded file and collect results</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 882 | <code>        for embed_filename, embed_bytes in embeds:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 883 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 884 | <code>                sub_res = chunk(embed_filename, binary=embed_bytes, lang=lang, callback=callback, is_root=False, **kwargs) or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 885 | <code>                embed_res.extend(sub_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 886 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 887 | <code>                error_msg = f"Failed to chunk embed {embed_filename}: {e}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 888 | <code>                logging.error(error_msg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 889 | <code>                if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 890 | <code>                    callback(0.05, error_msg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 891 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 892 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 893 | <code>    if re.search(r"\.docx$", filename, re.IGNORECASE):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 894 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 895 | <code>        if parser_config.get("analyze_hyperlink", False) and is_root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 896 | <code>            urls = extract_links_from_docx(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 897 | <code>            for index, url in enumerate(urls):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 898 | <code>                html_bytes, metadata = extract_html(url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 899 | <code>                if not html_bytes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 900 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 901 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 902 | <code>                    sub_url_res = chunk(url, html_bytes, callback=callback, lang=lang, is_root=False, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 903 | <code>                except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 904 | <code>                    logging.info(f"Failed to chunk url in registered file type {url}: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 905 | <code>                    sub_url_res = chunk(f"{index}.html", html_bytes, callback=callback, lang=lang, is_root=False, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 906 | <code>                url_res.extend(sub_url_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 908 | <code>        # fix "There is no item named 'word/NULL' in the archive", referring to https://github.com/python-openxml/python-docx/issues/1105#issuecomment-1298075246</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 909 | <code>        _SerializedRelationships.load_from_xml = load_from_xml_v2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>        # sections = (text, image, tables)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 912 | <code>        sections = Docx()(filename, binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 913 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>        # chunks list[dict]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 916 | <code>        # images list - index of image chunk in chunks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 917 | <code>        chunks, images = naive_merge_docx(sections, int(parser_config.get("chunk_token_num", 128)), parser_config.get("delimiter", "\n!?。；！？"), table_context_size, image_context_size)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 918 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 919 | <code>        vision_figure_parser_docx_wrapper_naive(chunks=chunks, idx_lst=images, callback=callback, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 921 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 922 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 924 | <code>        res.extend(doc_tokenize_chunks_with_images(chunks, doc, is_english, child_delimiters_pattern=child_deli))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 925 | <code>        logging.info("naive_merge({}): {}".format(filename, timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 926 | <code>        res.extend(embed_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 927 | <code>        res.extend(url_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 928 | <code>        return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>    elif re.search(r"\.pdf$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 931 | <code>        layout_recognizer, parser_model_name = normalize_layout_recognizer(parser_config.get("layout_recognize", "DeepDOC"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 932 | <code>        opendataloader_llm_name = kwargs.pop("opendataloader_llm_name", None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 933 | <code>        if layout_recognizer == "OpenDataLoader" and parser_model_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 934 | <code>            opendataloader_llm_name = parser_model_name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 936 | <code>        if parser_config.get("analyze_hyperlink", False) and is_root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 937 | <code>            urls = extract_links_from_pdf(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 939 | <code>        if isinstance(layout_recognizer, bool):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 940 | <code>            layout_recognizer = "DeepDOC" if layout_recognizer else "PlainText"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>        name = layout_recognizer.strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 943 | <code>        parser = PARSERS.get(name, by_plaintext)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 944 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 945 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 946 | <code>        sections, tables, pdf_parser = parser(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 947 | <code>            filename=filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 948 | <code>            binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 949 | <code>            from_page=from_page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 950 | <code>            to_page=to_page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 951 | <code>            lang=lang,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 952 | <code>            callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 953 | <code>            layout_recognizer=layout_recognizer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 954 | <code>            mineru_llm_name=parser_model_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 955 | <code>            paddleocr_llm_name=parser_model_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 956 | <code>            opendataloader_llm_name=opendataloader_llm_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 957 | <code>            **kwargs,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 958 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>        if not sections and not tables:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 962 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>        if table_context_size or image_context_size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 965 | <code>            tables = append_context2table_image4pdf(sections, tables, image_context_size)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 966 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 967 | <code>        if name in ["tcadp", "docling", "mineru", "paddleocr", "opendataloader"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 968 | <code>            if int(parser_config.get("chunk_token_num", 0)) &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 969 | <code>                parser_config["chunk_token_num"] = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 970 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 971 | <code>        res = tokenize_table(tables, doc, is_english)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 972 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>    elif re.search(r"\.(csv&#124;xlsx?)$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 975 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 977 | <code>        # Check if tcadp_parser is selected for spreadsheet files</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 978 | <code>        layout_recognizer = parser_config.get("layout_recognize", "DeepDOC")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 979 | <code>        if layout_recognizer == "TCADP Parser":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 980 | <code>            table_result_type = parser_config.get("table_result_type", "1")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 981 | <code>            markdown_image_response_type = parser_config.get("markdown_image_response_type", "1")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 982 | <code>            tcadp_parser = TCADPParser(table_result_type=table_result_type, markdown_image_response_type=markdown_image_response_type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 983 | <code>            if not tcadp_parser.check_installation():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 984 | <code>                callback(-1, "TCADP parser not available. Please check Tencent Cloud API configuration.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 985 | <code>                return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 987 | <code>            # Determine file type based on extension</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 988 | <code>            file_type = "XLSX" if re.search(r"\.xlsx?$", filename, re.IGNORECASE) else "CSV"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 989 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 990 | <code>            sections, tables = tcadp_parser.parse_pdf(filepath=filename, binary=binary, callback=callback, output_dir=os.environ.get("TCADP_OUTPUT_DIR", ""), file_type=file_type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 991 | <code>            sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 992 | <code>            parser_config["chunk_token_num"] = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 993 | <code>            res = tokenize_table(tables, doc, is_english)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 994 | <code>            callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 995 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 996 | <code>            # Default DeepDOC parser</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 997 | <code>            excel_parser = ExcelParser()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 998 | <code>            if parser_config.get("html4excel"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 999 | <code>                sections = [(_, "") for _ in excel_parser.html(binary, 12) if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1000 | <code>                parser_config["chunk_token_num"] = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1001 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1002 | <code>                sections = [(_, "") for _ in excel_parser(binary) if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1003 | <code>            sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>    elif re.search(r"\.(txt&#124;py&#124;js&#124;java&#124;c&#124;cpp&#124;h&#124;php&#124;go&#124;ts&#124;sh&#124;cs&#124;kt&#124;sql)$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1006 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1007 | <code>        sections = TxtParser()(filename, binary, parser_config.get("chunk_token_num", 128), parser_config.get("delimiter", "\n!?;。；！？"))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1008 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1009 | <code>        print("\n", "-"*150, "\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1010 | <code>        print(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1011 | <code>        print("\n", "-"*150, "\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1012 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1014 | <code>    elif re.search(r"\.(md&#124;markdown&#124;mdx)$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1015 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1016 | <code>        markdown_parser = Markdown(int(parser_config.get("chunk_token_num", 128)))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1017 | <code>        sections, tables, section_images = markdown_parser(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1018 | <code>            filename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1019 | <code>            binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1020 | <code>            separate_tables=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1021 | <code>            delimiter=parser_config.get("delimiter", "\n!?;。；！？"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1022 | <code>            return_section_images=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1023 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1024 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1026 | <code>        is_markdown = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1028 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1029 | <code>            vision_model_config = get_tenant_default_model_by_type(kwargs["tenant_id"], LLMType.IMAGE2TEXT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1030 | <code>            vision_model = LLMBundle(kwargs["tenant_id"], vision_model_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1031 | <code>            callback(0.2, "Visual model detected. Attempting to enhance figure extraction...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1032 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1033 | <code>            logging.warning(f"Failed to detect figure extraction: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1034 | <code>            vision_model = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>        if vision_model:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1037 | <code>            # Process images for each section</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1038 | <code>            for idx, (section_text, _) in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1039 | <code>                images = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1040 | <code>                if section_images and len(section_images) &gt; idx and section_images[idx] is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1041 | <code>                    images.append(section_images[idx])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1043 | <code>                if images and len(images) &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1044 | <code>                    # If multiple images found, combine them using concat_img</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1045 | <code>                    combined_image = reduce(concat_img, images) if len(images) &gt; 1 else images[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1046 | <code>                    if section_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1047 | <code>                        section_images[idx] = combined_image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1048 | <code>                    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1049 | <code>                        section_images = [None] * len(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1050 | <code>                        section_images[idx] = combined_image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1051 | <code>                    markdown_vision_parser = VisionFigureParser(vision_model=vision_model, figures_data=[((combined_image, ["markdown image"]), [(0, 0, 0, 0, 0)])], **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1052 | <code>                    boosted_figures = markdown_vision_parser(callback=callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1053 | <code>                    sections[idx] = (section_text + "\n\n" + "\n\n".join([fig[0][1] for fig in boosted_figures]), sections[idx][1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1056 | <code>            logging.warning("No visual model detected. Skipping figure parsing enhancement.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1057 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1058 | <code>        if parser_config.get("hyperlink_urls", False) and is_root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1059 | <code>            for idx, (section_text, _) in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1060 | <code>                soup = markdown_parser.md_to_html(section_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1061 | <code>                hyperlink_urls = markdown_parser.get_hyperlink_urls(soup)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1062 | <code>                urls.update(hyperlink_urls)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1063 | <code>        res = tokenize_table(tables, doc, is_english)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1064 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1066 | <code>    elif re.search(r"\.(htm&#124;html)$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1067 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1068 | <code>        chunk_token_num = int(parser_config.get("chunk_token_num", 128))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1069 | <code>        sections = HtmlParser()(filename, binary, chunk_token_num)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1070 | <code>        sections = [(_, "") for _ in sections if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1071 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1072 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1073 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1074 | <code>    elif re.search(r"\.epub$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1075 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1076 | <code>        chunk_token_num = int(parser_config.get("chunk_token_num", 128))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1077 | <code>        sections = EpubParser()(filename, binary, chunk_token_num)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1078 | <code>        sections = [(_, "") for _ in sections if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1079 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1080 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1081 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1082 | <code>    elif re.search(r"\.(json&#124;jsonl&#124;ldjson)$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1083 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1084 | <code>        chunk_token_num = int(parser_config.get("chunk_token_num", 128))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1085 | <code>        sections = JsonParser(chunk_token_num)(binary)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1086 | <code>        sections = [(_, "") for _ in sections if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1087 | <code>        sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1088 | <code>        callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1089 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1090 | <code>    elif re.search(r"\.doc$", filename, re.IGNORECASE):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1091 | <code>        callback(0.1, "Start to parse.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1094 | <code>            from tika import parser as tika_parser</code> | 导入 Python 依赖 `tika`，供本模块调用其类型、函数或常量。 |
| 1095 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1096 | <code>            callback(0.8, f"tika not available: {e}. Unsupported .doc parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1097 | <code>            logging.warning(f"tika not available: {e}. Unsupported .doc parsing for {filename}.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1098 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1100 | <code>        binary = BytesIO(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1101 | <code>        doc_parsed = tika_parser.from_buffer(binary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1102 | <code>        if doc_parsed.get("content", None) is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1103 | <code>            sections = doc_parsed["content"].split("\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1104 | <code>            sections = [(_, "") for _ in sections if _]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1105 | <code>            sections = _normalize_section_text_for_rtl_presentation_forms(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1106 | <code>            callback(0.8, "Finish parsing.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1107 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1108 | <code>            error_msg = f"tika.parser got empty content from {filename}."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1109 | <code>            callback(0.8, error_msg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1110 | <code>            logging.warning(error_msg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1111 | <code>            return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1112 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1113 | <code>        raise NotImplementedError("file type not supported yet(pdf, xlsx, doc, docx, txt supported)")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1115 | <code>    st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1116 | <code>    overlapped_percent = normalize_overlapped_percent(parser_config.get("overlapped_percent", 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1118 | <code>    if is_markdown:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1119 | <code>        merged_chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1120 | <code>        merged_images = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1121 | <code>        chunk_limit = max(0, int(parser_config.get("chunk_token_num", 128)))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1123 | <code>        current_text = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1124 | <code>        current_tokens = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1125 | <code>        current_image = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1127 | <code>        for idx, sec in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1128 | <code>            text = sec[0] if isinstance(sec, tuple) else sec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1129 | <code>            sec_tokens = num_tokens_from_string(text)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1130 | <code>            sec_image = section_images[idx] if section_images and idx &lt; len(section_images) else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1132 | <code>            # Don't finalize chunk if current_text is a short header (force merge with next section)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1133 | <code>            if current_text and not _is_short_header(current_text) and current_tokens + sec_tokens &gt; chunk_limit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1134 | <code>                merged_chunks.append(current_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1135 | <code>                merged_images.append(current_image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1136 | <code>                overlap_part = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1137 | <code>                if overlapped_percent &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1138 | <code>                    overlap_len = int(len(current_text) * overlapped_percent / 100)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1139 | <code>                    if overlap_len &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1140 | <code>                        overlap_part = current_text[-overlap_len:]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1141 | <code>                current_text = overlap_part</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1142 | <code>                current_tokens = num_tokens_from_string(current_text)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1143 | <code>                current_image = current_image if overlap_part else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1145 | <code>            if current_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1146 | <code>                current_text += "\n" + text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1147 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1148 | <code>                current_text = text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1149 | <code>            current_tokens += sec_tokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1151 | <code>            if sec_image:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1152 | <code>                current_image = concat_img(current_image, sec_image) if current_image else sec_image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1154 | <code>        if current_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1155 | <code>            merged_chunks.append(current_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1156 | <code>            merged_images.append(current_image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1158 | <code>        chunks = merged_chunks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1159 | <code>        has_images = merged_images and any(img is not None for img in merged_images)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1161 | <code>        if has_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1162 | <code>            res.extend(tokenize_chunks_with_images(chunks, doc, is_english, merged_images, child_delimiters_pattern=child_deli))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1163 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1164 | <code>            res.extend(tokenize_chunks(chunks, doc, is_english, pdf_parser, child_delimiters_pattern=child_deli))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1165 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1166 | <code>        if section_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1167 | <code>            if all(image is None for image in section_images):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1168 | <code>                section_images = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1170 | <code>        if section_images:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1171 | <code>            chunks, images = naive_merge_with_images(sections, section_images, int(parser_config.get("chunk_token_num", 128)), parser_config.get("delimiter", "\n!?。；！？"), overlapped_percent)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1172 | <code>            res.extend(tokenize_chunks_with_images(chunks, doc, is_english, images, child_delimiters_pattern=child_deli))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1173 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1174 | <code>            chunks = naive_merge(sections, int(parser_config.get("chunk_token_num", 128)), parser_config.get("delimiter", "\n!?。；！？"), overlapped_percent)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1176 | <code>            res.extend(tokenize_chunks(chunks, doc, is_english, pdf_parser, child_delimiters_pattern=child_deli))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1178 | <code>    if urls and parser_config.get("analyze_hyperlink", False) and is_root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1179 | <code>        for index, url in enumerate(urls):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1180 | <code>            html_bytes, metadata = extract_html(url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1181 | <code>            if not html_bytes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1182 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1183 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1184 | <code>                sub_url_res = chunk(url, html_bytes, callback=callback, lang=lang, is_root=False, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1185 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1186 | <code>                logging.info(f"Failed to chunk url in registered file type {url}: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1187 | <code>                sub_url_res = chunk(f"{index}.html", html_bytes, callback=callback, lang=lang, is_root=False, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1188 | <code>            url_res.extend(sub_url_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1190 | <code>    logging.info("naive_merge({}): {}".format(filename, timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1192 | <code>    if embed_res:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1193 | <code>        res.extend(embed_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1194 | <code>    if url_res:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1195 | <code>        res.extend(url_res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1196 | <code>    # if table_context_size or image_context_size:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1197 | <code>    #    attach_media_context(res, table_context_size, image_context_size)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1199 | <code>    # Attach PDF outline as transient metadata on the first chunk.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1200 | <code>    # task_executor.py will extract and persist it as document metadata.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1201 | <code>    if res and pdf_parser and getattr(pdf_parser, "outlines", None):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1202 | <code>        res[0]["__outline__"] = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1203 | <code>            {"title": title, "depth": depth}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1204 | <code>            for title, depth, *_ in pdf_parser.outlines</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1205 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1207 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1210 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1211 | <code>    import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 1212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1213 | <code>    def dummy(prog=None, msg=""):</code> | 定义 Python 函数 `dummy`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1214 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>    chunk(sys.argv[1], from_page=0, to_page=10, callback=dummy)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
