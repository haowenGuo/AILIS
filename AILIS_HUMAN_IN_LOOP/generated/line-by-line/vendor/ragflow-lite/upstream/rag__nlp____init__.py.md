# vendor/ragflow-lite/upstream/rag__nlp____init__.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：1627
- SHA-256：`438e34c846089355534946d6e9cf3366160aa1e900a2ddc646c3c91466b3d303`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/rag__nlp____init__.py)
- 依赖：`logging`、`random`、`collections`、`common.token_utils`、`re`、`copy`、`roman_numbers`、`word2number`、`cn2an`、`PIL`、`chardet`、`.`、`deepdoc.parser`、`deepdoc.parser.pdf_parser`、`rag.utils.lazy_image`
- 主要符号：`find_codec`、`has_qbullet`、`index_int`、`qbullets_category`、`random_choices`、`not_bullet`、`bullets_category`、`is_english`、`is_chinese`、`tokenize`、`split_with_pattern`、`tokenize_chunks`、`doc_tokenize_chunks_with_images`、`tokenize_chunks_with_images`、`tokenize_table`、`attach_media_context`、`is_image_chunk`、`is_table_chunk`、`is_text_chunk`、`get_text`、`split_sentences`、`get_bounds_by_page`、`trim_to_tokens`、`find_mid_sentence_index`、`collect_context_from_sentences`、`extract_position`、`append_context2table_image4pdf`、`upper_context`、`lower_context`、`add_positions`、`remove_contents_table`、`get`、`make_colon_as_title`、`title_frequency`、`not_title`、`tree_merge`、`get_level`、`hierarchical_merge`、`binary_search`、`naive_merge`、`add_chunk`、`naive_merge_with_images`、`docx_question_level`、`concat_img`、`_build_cks`、`_add_context`、`take_sentences_from_end`、`take_sentences_from_start`、`_merge_cks`、`naive_merge_docx`、`extract_between`、`get_delimiters`、`Node`、`__init__`、`add_child`、`get_children`、`get_texts`、`set_texts`、`add_text`、`clear_text`、`__repr__`、`build_tree`、`get_tree`、`_dfs`

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
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 18 | <code>import random</code> | 导入 Python 依赖 `random`，供本模块调用其类型、函数或常量。 |
| 19 | <code>from collections import Counter, defaultdict</code> | 导入 Python 依赖 `collections`，供本模块调用其类型、函数或常量。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>from common.token_utils import num_tokens_from_string</code> | 导入 Python 依赖 `common.token_utils`，供本模块调用其类型、函数或常量。 |
| 22 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 23 | <code>import copy</code> | 导入 Python 依赖 `copy`，供本模块调用其类型、函数或常量。 |
| 24 | <code>import roman_numbers as r</code> | 导入 Python 依赖 `roman_numbers`，供本模块调用其类型、函数或常量。 |
| 25 | <code>from word2number import w2n</code> | 导入 Python 依赖 `word2number`，供本模块调用其类型、函数或常量。 |
| 26 | <code>from cn2an import cn2an</code> | 导入 Python 依赖 `cn2an`，供本模块调用其类型、函数或常量。 |
| 27 | <code>from PIL import Image</code> | 导入 Python 依赖 `PIL`，供本模块调用其类型、函数或常量。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>import chardet</code> | 导入 Python 依赖 `chardet`，供本模块调用其类型、函数或常量。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>__all__ = ['rag_tokenizer']</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>all_codecs = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 34 | <code>    'utf-8', 'gb2312', 'gbk', 'utf_16', 'ascii', 'big5', 'big5hkscs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 35 | <code>    'cp037', 'cp273', 'cp424', 'cp437',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 36 | <code>    'cp500', 'cp720', 'cp737', 'cp775', 'cp850', 'cp852', 'cp855', 'cp856', 'cp857',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 37 | <code>    'cp858', 'cp860', 'cp861', 'cp862', 'cp863', 'cp864', 'cp865', 'cp866', 'cp869',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 38 | <code>    'cp874', 'cp875', 'cp932', 'cp949', 'cp950', 'cp1006', 'cp1026', 'cp1125',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 39 | <code>    'cp1140', 'cp1250', 'cp1251', 'cp1252', 'cp1253', 'cp1254', 'cp1255', 'cp1256',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 40 | <code>    'cp1257', 'cp1258', 'euc_jp', 'euc_jis_2004', 'euc_jisx0213', 'euc_kr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 41 | <code>    'gb18030', 'hz', 'iso2022_jp', 'iso2022_jp_1', 'iso2022_jp_2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 42 | <code>    'iso2022_jp_2004', 'iso2022_jp_3', 'iso2022_jp_ext', 'iso2022_kr', 'latin_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 43 | <code>    'iso8859_2', 'iso8859_3', 'iso8859_4', 'iso8859_5', 'iso8859_6', 'iso8859_7',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 44 | <code>    'iso8859_8', 'iso8859_9', 'iso8859_10', 'iso8859_11', 'iso8859_13',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 45 | <code>    'iso8859_14', 'iso8859_15', 'iso8859_16', 'johab', 'koi8_r', 'koi8_t', 'koi8_u',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 46 | <code>    'kz1048', 'mac_cyrillic', 'mac_greek', 'mac_iceland', 'mac_latin2', 'mac_roman',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 47 | <code>    'mac_turkish', 'ptcp154', 'shift_jis', 'shift_jis_2004', 'shift_jisx0213',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 48 | <code>    'utf_32', 'utf_32_be', 'utf_32_le', 'utf_16_be', 'utf_16_le', 'utf_7', 'windows-1250', 'windows-1251',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 49 | <code>    'windows-1252', 'windows-1253', 'windows-1254', 'windows-1255', 'windows-1256',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 50 | <code>    'windows-1257', 'windows-1258', 'latin-2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 51 | <code>]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>def find_codec(blob):</code> | 定义 Python 函数 `find_codec`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>    detected = chardet.detect(blob[:1024])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 56 | <code>    if detected['confidence'] &gt; 0.5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 57 | <code>        if detected['encoding'] == "ascii":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 58 | <code>            return "utf-8"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>    for c in all_codecs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 61 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 62 | <code>            blob[:1024].decode(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 63 | <code>            return c</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 64 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 65 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 66 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 67 | <code>            blob.decode(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 68 | <code>            return c</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 69 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 70 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>    return "utf-8"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>QUESTION_PATTERN = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 76 | <code>    r"第([零一二三四五六七八九十百0-9]+)问",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 77 | <code>    r"第([零一二三四五六七八九十百0-9]+)条",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 78 | <code>    r"[\(（]([零一二三四五六七八九十百]+)[\)）]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 79 | <code>    r"第([0-9]+)问",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 80 | <code>    r"第([0-9]+)条",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 81 | <code>    r"([0-9]{1,2})[\. 、]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 82 | <code>    r"([零一二三四五六七八九十百]+)[ 、]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 83 | <code>    r"[\(（]([0-9]{1,2})[\)）]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 84 | <code>    r"QUESTION (ONE&#124;TWO&#124;THREE&#124;FOUR&#124;FIVE&#124;SIX&#124;SEVEN&#124;EIGHT&#124;NINE&#124;TEN)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 85 | <code>    r"QUESTION (I+V?&#124;VI*&#124;XI&#124;IX&#124;X)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 86 | <code>    r"QUESTION ([0-9]+)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 87 | <code>]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>def has_qbullet(reg, box, last_box, last_index, last_bull, bull_x0_list):</code> | 定义 Python 函数 `has_qbullet`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 91 | <code>    section, last_section = box['text'], last_box['text']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 92 | <code>    q_reg = r'(\w&#124;\W)*?(?:？&#124;\?&#124;\n&#124;$)+'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 93 | <code>    full_reg = reg + q_reg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 94 | <code>    has_bull = re.match(full_reg, section)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 95 | <code>    index_str = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 96 | <code>    if has_bull:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 97 | <code>        if 'x0' not in last_box:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 98 | <code>            last_box['x0'] = box['x0']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>        if 'top' not in last_box:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 100 | <code>            last_box['top'] = box['top']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 101 | <code>        if last_bull and box['x0'] - last_box['x0'] &gt; 10:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 102 | <code>            return None, last_index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 103 | <code>        if not last_bull and box['x0'] &gt;= last_box['x0'] and box['top'] - last_box['top'] &lt; 20:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 104 | <code>            return None, last_index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 105 | <code>        avg_bull_x0 = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>        if bull_x0_list:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 107 | <code>            avg_bull_x0 = sum(bull_x0_list) / len(bull_x0_list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 109 | <code>            avg_bull_x0 = box['x0']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 110 | <code>        if box['x0'] - avg_bull_x0 &gt; 10:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 111 | <code>            return None, last_index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 112 | <code>        index_str = has_bull.group(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 113 | <code>        index = index_int(index_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 114 | <code>        if last_section[-1] == ':' or last_section[-1] == '：':</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 115 | <code>            return None, last_index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 116 | <code>        if not last_index or index &gt;= last_index:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 117 | <code>            bull_x0_list.append(box['x0'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 118 | <code>            return has_bull, index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 119 | <code>        if section[-1] == '?' or section[-1] == '？':</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 120 | <code>            bull_x0_list.append(box['x0'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 121 | <code>            return has_bull, index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 122 | <code>        if box['layout_type'] == 'title':</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 123 | <code>            bull_x0_list.append(box['x0'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 124 | <code>            return has_bull, index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 125 | <code>        pure_section = section.lstrip(re.match(reg, section).group()).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 126 | <code>        ask_reg = r'(what&#124;when&#124;where&#124;how&#124;why&#124;which&#124;who&#124;whose&#124;为什么&#124;为啥&#124;哪)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 127 | <code>        if re.match(ask_reg, pure_section):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 128 | <code>            bull_x0_list.append(box['x0'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 129 | <code>            return has_bull, index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 130 | <code>    return None, last_index</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>def index_int(index_str):</code> | 定义 Python 函数 `index_int`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 134 | <code>    res = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 135 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 136 | <code>        res = int(index_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 137 | <code>    except ValueError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 138 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 139 | <code>            res = w2n.word_to_num(index_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 140 | <code>        except ValueError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 141 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 142 | <code>                res = cn2an(index_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>            except ValueError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 144 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 145 | <code>                    res = r.number(index_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 146 | <code>                except ValueError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 147 | <code>                    return -1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 148 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>def qbullets_category(sections):</code> | 定义 Python 函数 `qbullets_category`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 152 | <code>    global QUESTION_PATTERN</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 153 | <code>    hits = [0] * len(QUESTION_PATTERN)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 154 | <code>    for i, pro in enumerate(QUESTION_PATTERN):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 155 | <code>        for sec in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 156 | <code>            if re.match(pro, sec) and not not_bullet(sec):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 157 | <code>                hits[i] += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 158 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 159 | <code>    maximum = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>    res = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>    for i, h in enumerate(hits):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 162 | <code>        if h &lt;= maximum:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 163 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 164 | <code>        res = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 165 | <code>        maximum = h</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>    return res, QUESTION_PATTERN[res]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>BULLET_PATTERN = [[</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 170 | <code>    r"第[零一二三四五六七八九十百0-9]+(分?编&#124;部分)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 171 | <code>    r"第[零一二三四五六七八九十百0-9]+章",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 172 | <code>    r"第[零一二三四五六七八九十百0-9]+节",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 173 | <code>    r"第[零一二三四五六七八九十百0-9]+条",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 174 | <code>    r"[\(（][零一二三四五六七八九十百]+[\)）]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 175 | <code>], [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 176 | <code>    r"第[0-9]+章",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 177 | <code>    r"第[0-9]+节",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 178 | <code>    r"[0-9]{,2}[\. 、]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 179 | <code>    r"[0-9]{,2}\.[0-9]{,2}[^a-zA-Z/%~-]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 180 | <code>    r"[0-9]{,2}\.[0-9]{,2}\.[0-9]{,2}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 181 | <code>    r"[0-9]{,2}\.[0-9]{,2}\.[0-9]{,2}\.[0-9]{,2}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 182 | <code>], [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 183 | <code>    r"第[零一二三四五六七八九十百0-9]+章",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 184 | <code>    r"第[零一二三四五六七八九十百0-9]+节",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 185 | <code>    r"[零一二三四五六七八九十百]+[ 、]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 186 | <code>    r"[\(（][零一二三四五六七八九十百]+[\)）]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 187 | <code>    r"[\(（][0-9]{,2}[\)）]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>], [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 189 | <code>    r"PART (ONE&#124;TWO&#124;THREE&#124;FOUR&#124;FIVE&#124;SIX&#124;SEVEN&#124;EIGHT&#124;NINE&#124;TEN)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 190 | <code>    r"Chapter (I+V?&#124;VI*&#124;XI&#124;IX&#124;X)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 191 | <code>    r"Section [0-9]+",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 192 | <code>    r"Article [0-9]+"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 193 | <code>], [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 194 | <code>    r"^#[^#]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 195 | <code>    r"^##[^#]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 196 | <code>    r"^###.*",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 197 | <code>    r"^####.*",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 198 | <code>    r"^#####.*",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 199 | <code>    r"^######.*",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 200 | <code>]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>def random_choices(arr, k):</code> | 定义 Python 函数 `random_choices`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 205 | <code>    k = min(len(arr), k)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 206 | <code>    return random.choices(arr, k=k)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>def not_bullet(line):</code> | 定义 Python 函数 `not_bullet`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 210 | <code>    patt = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 211 | <code>        r"0", r"[0-9]+ +[0-9~个只-]", r"[0-9]+\.{2,}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 212 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>    return any([re.match(r, line) for r in patt])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>def bullets_category(sections):</code> | 定义 Python 函数 `bullets_category`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 217 | <code>    global BULLET_PATTERN</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 218 | <code>    hits = [0] * len(BULLET_PATTERN)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 219 | <code>    for i, pro in enumerate(BULLET_PATTERN):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 220 | <code>        for sec in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 221 | <code>            sec = sec.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 222 | <code>            for p in pro:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 223 | <code>                if re.match(p, sec) and not not_bullet(sec):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 224 | <code>                    hits[i] += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 225 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 226 | <code>    maximum = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 227 | <code>    res = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 228 | <code>    for i, h in enumerate(hits):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 229 | <code>        if h &lt;= maximum:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 230 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 231 | <code>        res = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 232 | <code>        maximum = h</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 233 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>def is_english(texts):</code> | 定义 Python 函数 `is_english`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 237 | <code>    if not texts:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 238 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>    pattern = re.compile(r"[`a-zA-Z0-9\s.,':;/\"?&lt;&gt;!\(\)\-]+")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>    if isinstance(texts, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 243 | <code>        texts = [texts]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 244 | <code>    elif isinstance(texts, list):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 245 | <code>        texts = [t for t in texts if isinstance(t, str) and t.strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 247 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>    if not texts:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 250 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>    eng = sum(1 for t in texts if pattern.fullmatch(t.strip()))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 253 | <code>    return (eng / len(texts)) &gt; 0.8</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>def is_chinese(text):</code> | 定义 Python 函数 `is_chinese`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 257 | <code>    if not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 258 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 259 | <code>    chinese = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 260 | <code>    for ch in text:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 261 | <code>        if '\u4e00' &lt;= ch &lt;= '\u9fff':</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 262 | <code>            chinese += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 263 | <code>    if chinese / len(text) &gt; 0.2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 264 | <code>        return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 265 | <code>    return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>def tokenize(d, txt, eng):</code> | 定义 Python 函数 `tokenize`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 269 | <code>    from . import rag_tokenizer</code> | 导入 Python 依赖 `.`，供本模块调用其类型、函数或常量。 |
| 270 | <code>    d["content_with_weight"] = txt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 271 | <code>    t = re.sub(r"&lt;/?(table&#124;td&#124;caption&#124;tr&#124;th)( [^&lt;&gt;]{0,12})?&gt;", " ", txt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 272 | <code>    d["content_ltks"] = rag_tokenizer.tokenize(t)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 273 | <code>    d["content_sm_ltks"] = rag_tokenizer.fine_grained_tokenize(d["content_ltks"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>def split_with_pattern(d, pattern: str, content: str, eng) -&gt; list:</code> | 定义 Python 函数 `split_with_pattern`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 277 | <code>    docs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>    # Validate and compile regex pattern before use</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 280 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 281 | <code>        compiled_pattern = re.compile(r"(%s)" % pattern, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 282 | <code>    except re.error as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 283 | <code>        logging.warning(f"Invalid delimiter regex pattern '{pattern}': {e}. Falling back to no split.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 284 | <code>        # Fallback: return content as single chunk</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 285 | <code>        dd = copy.deepcopy(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 286 | <code>        tokenize(dd, content, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 287 | <code>        return [dd]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>    txts = [txt for txt in compiled_pattern.split(content)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 290 | <code>    for j in range(0, len(txts), 2):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 291 | <code>        txt = txts[j]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 292 | <code>        if not txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 293 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 294 | <code>        if j + 1 &lt; len(txts):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 295 | <code>            txt += txts[j + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 296 | <code>        dd = copy.deepcopy(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 297 | <code>        tokenize(dd, txt, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 298 | <code>        docs.append(dd)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 299 | <code>    return docs</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>def tokenize_chunks(chunks, doc, eng, pdf_parser=None, child_delimiters_pattern=None):</code> | 定义 Python 函数 `tokenize_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 303 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 304 | <code>    # wrap up as es documents</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 305 | <code>    for ii, ck in enumerate(chunks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 306 | <code>        if len(ck.strip()) == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 307 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 308 | <code>        logging.debug("-- {}".format(ck))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 309 | <code>        d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 310 | <code>        if pdf_parser:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 311 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 312 | <code>                d["image"], poss = pdf_parser.crop(ck, need_position=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 313 | <code>                add_positions(d, poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 314 | <code>                ck = pdf_parser.remove_tag(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 315 | <code>            except NotImplementedError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 316 | <code>                pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 317 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 318 | <code>            add_positions(d, [[ii] * 5])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>        if child_delimiters_pattern:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 321 | <code>            d["mom_with_weight"] = ck</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 322 | <code>            res.extend(split_with_pattern(d, child_delimiters_pattern, ck, eng))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 323 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>        tokenize(d, ck, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 326 | <code>        res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 327 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>def doc_tokenize_chunks_with_images(chunks, doc, eng, child_delimiters_pattern=None, batch_size=10):</code> | 定义 Python 函数 `doc_tokenize_chunks_with_images`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 331 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 332 | <code>    for ii, ck in enumerate(chunks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 333 | <code>        text = ck.get("context_above", "") + ck.get("text") + ck.get("context_below", "")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 334 | <code>        if len(text.strip()) == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 335 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 336 | <code>        logging.debug("-- {}".format(ck))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 337 | <code>        d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 338 | <code>        if ck.get("image"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 339 | <code>            d["image"] = ck.get("image")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 340 | <code>        add_positions(d, [[ii] * 5])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>        if ck.get("ck_type") == "text":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 343 | <code>            if child_delimiters_pattern:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 344 | <code>                d["mom_with_weight"] = text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 345 | <code>                res.extend(split_with_pattern(d, child_delimiters_pattern, text, eng))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 346 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 347 | <code>        elif ck.get("ck_type") == "image":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 348 | <code>            d["doc_type_kwd"] = "image"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 349 | <code>        elif ck.get("ck_type") == "table":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 350 | <code>            d["doc_type_kwd"] = "table"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 351 | <code>        tokenize(d, text, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 352 | <code>        res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 353 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>def tokenize_chunks_with_images(chunks, doc, eng, images, child_delimiters_pattern=None):</code> | 定义 Python 函数 `tokenize_chunks_with_images`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 357 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 358 | <code>    # wrap up as es documents</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 359 | <code>    for ii, (ck, image) in enumerate(zip(chunks, images)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 360 | <code>        if len(ck.strip()) == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 361 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 362 | <code>        logging.debug("-- {}".format(ck))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 363 | <code>        d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 364 | <code>        d["image"] = image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 365 | <code>        add_positions(d, [[ii] * 5])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 366 | <code>        if child_delimiters_pattern:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 367 | <code>            d["mom_with_weight"] = ck</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 368 | <code>            res.extend(split_with_pattern(d, child_delimiters_pattern, ck, eng))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 369 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 370 | <code>        tokenize(d, ck, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 371 | <code>        res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 372 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>def tokenize_table(tbls, doc, eng, batch_size=10):</code> | 定义 Python 函数 `tokenize_table`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 376 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 377 | <code>    # add tables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 378 | <code>    for (img, rows), poss in tbls:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 379 | <code>        if not rows:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 380 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 381 | <code>        if isinstance(rows, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 382 | <code>            d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 383 | <code>            tokenize(d, rows, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 384 | <code>            d["content_with_weight"] = rows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 385 | <code>            d["doc_type_kwd"] = "table"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 386 | <code>            if img:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 387 | <code>                d["image"] = img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 388 | <code>                if d["content_with_weight"].find("&lt;tr&gt;") &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 389 | <code>                    d["doc_type_kwd"] = "image"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 390 | <code>            if poss:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 391 | <code>                add_positions(d, poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 392 | <code>            res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 393 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 394 | <code>        de = "; " if eng else "； "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 395 | <code>        for i in range(0, len(rows), batch_size):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 396 | <code>            d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 397 | <code>            r = de.join(rows[i:i + batch_size])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 398 | <code>            tokenize(d, r, eng)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 399 | <code>            d["doc_type_kwd"] = "table"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 400 | <code>            if img:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 401 | <code>                d["image"] = img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 402 | <code>                if d["content_with_weight"].find("&lt;tr&gt;") &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 403 | <code>                    d["doc_type_kwd"] = "image"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 404 | <code>            add_positions(d, poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 405 | <code>            res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 406 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>def attach_media_context(chunks, table_context_size=0, image_context_size=0):</code> | 定义 Python 函数 `attach_media_context`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 410 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 411 | <code>    Attach surrounding text chunk content to media chunks (table/image).</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 412 | <code>    Best-effort ordering: if positional info exists on any chunk, use it to</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 413 | <code>    order chunks before collecting context; otherwise keep original order.</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 414 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 415 | <code>    from . import rag_tokenizer</code> | 导入 Python 依赖 `.`，供本模块调用其类型、函数或常量。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>    if not chunks or (table_context_size &lt;= 0 and image_context_size &lt;= 0):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 418 | <code>        return chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>    def is_image_chunk(ck):</code> | 定义 Python 函数 `is_image_chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 421 | <code>        if ck.get("doc_type_kwd") == "image":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 422 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>        text_val = ck.get("content_with_weight") if isinstance(ck.get("content_with_weight"), str) else ck.get("text")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 425 | <code>        has_text = isinstance(text_val, str) and text_val.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 426 | <code>        return bool(ck.get("image")) and not has_text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 428 | <code>    def is_table_chunk(ck):</code> | 定义 Python 函数 `is_table_chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 429 | <code>        return ck.get("doc_type_kwd") == "table"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>    def is_text_chunk(ck):</code> | 定义 Python 函数 `is_text_chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 432 | <code>        return not is_image_chunk(ck) and not is_table_chunk(ck)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>    def get_text(ck):</code> | 定义 Python 函数 `get_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 435 | <code>        if isinstance(ck.get("content_with_weight"), str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 436 | <code>            return ck["content_with_weight"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 437 | <code>        if isinstance(ck.get("text"), str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 438 | <code>            return ck["text"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 439 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>    def split_sentences(text):</code> | 定义 Python 函数 `split_sentences`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 442 | <code>        pattern = r"([.。！？!?；;：:\n])"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 443 | <code>        parts = re.split(pattern, text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 444 | <code>        sentences = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 445 | <code>        buf = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 446 | <code>        for p in parts:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 447 | <code>            if not p:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 448 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 449 | <code>            if re.fullmatch(pattern, p):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 450 | <code>                buf += p</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 451 | <code>                sentences.append(buf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 452 | <code>                buf = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 453 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 454 | <code>                buf += p</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 455 | <code>        if buf:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 456 | <code>            sentences.append(buf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 457 | <code>        return sentences</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>    def get_bounds_by_page(ck):</code> | 定义 Python 函数 `get_bounds_by_page`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 460 | <code>        bounds = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 461 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 462 | <code>            if ck.get("position_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 463 | <code>                for pos in ck["position_int"]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 464 | <code>                    if not pos or len(pos) &lt; 5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 465 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 466 | <code>                    pn, _, _, top, bottom = pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 467 | <code>                    if pn is None or top is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 468 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 469 | <code>                    top_val = float(top)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 470 | <code>                    bottom_val = float(bottom) if bottom is not None else top_val</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 471 | <code>                    if bottom_val &lt; top_val:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 472 | <code>                        top_val, bottom_val = bottom_val, top_val</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 473 | <code>                    pn = int(pn)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 474 | <code>                    if pn in bounds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 475 | <code>                        bounds[pn] = (min(bounds[pn][0], top_val), max(bounds[pn][1], bottom_val))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 476 | <code>                    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 477 | <code>                        bounds[pn] = (top_val, bottom_val)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 478 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 479 | <code>                pn = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 480 | <code>                if ck.get("page_num_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 481 | <code>                    pn = ck["page_num_int"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 482 | <code>                elif ck.get("page_number") is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 483 | <code>                    pn = ck.get("page_number")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 484 | <code>                if pn is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 485 | <code>                    return bounds</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 486 | <code>                top = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 487 | <code>                if ck.get("top_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 488 | <code>                    top = ck["top_int"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 489 | <code>                elif ck.get("top") is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 490 | <code>                    top = ck.get("top")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 491 | <code>                if top is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 492 | <code>                    return bounds</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 493 | <code>                bottom = ck.get("bottom")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 494 | <code>                pn = int(pn)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 495 | <code>                top_val = float(top)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 496 | <code>                bottom_val = float(bottom) if bottom is not None else top_val</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 497 | <code>                if bottom_val &lt; top_val:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 498 | <code>                    top_val, bottom_val = bottom_val, top_val</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 499 | <code>                bounds[pn] = (top_val, bottom_val)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 500 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 501 | <code>            return {}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 502 | <code>        return bounds</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>    def trim_to_tokens(text, token_budget, from_tail=False):</code> | 定义 Python 函数 `trim_to_tokens`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 505 | <code>        if token_budget &lt;= 0 or not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 506 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 507 | <code>        sentences = split_sentences(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 508 | <code>        if not sentences:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 509 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>        collected = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 512 | <code>        remaining = token_budget</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 513 | <code>        seq = reversed(sentences) if from_tail else sentences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 514 | <code>        for s in seq:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 515 | <code>            tks = num_tokens_from_string(s)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 516 | <code>            if tks &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 517 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 518 | <code>            if tks &gt; remaining:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 519 | <code>                collected.append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 520 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 521 | <code>            collected.append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 522 | <code>            remaining -= tks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>        if from_tail:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 525 | <code>            collected = list(reversed(collected))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 526 | <code>        return "".join(collected)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>    def find_mid_sentence_index(sentences):</code> | 定义 Python 函数 `find_mid_sentence_index`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 529 | <code>        if not sentences:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 530 | <code>            return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 531 | <code>        total = sum(max(0, num_tokens_from_string(s)) for s in sentences)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 532 | <code>        if total &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 533 | <code>            return max(0, len(sentences) // 2)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 534 | <code>        target = total / 2.0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 535 | <code>        best_idx = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 536 | <code>        best_diff = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 537 | <code>        cum = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 538 | <code>        for i, s in enumerate(sentences):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 539 | <code>            cum += max(0, num_tokens_from_string(s))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 540 | <code>            diff = abs(cum - target)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 541 | <code>            if best_diff is None or diff &lt; best_diff:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 542 | <code>                best_diff = diff</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 543 | <code>                best_idx = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 544 | <code>        return best_idx</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>    def collect_context_from_sentences(sentences, boundary_idx, token_budget):</code> | 定义 Python 函数 `collect_context_from_sentences`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 547 | <code>        prev_ctx = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 548 | <code>        remaining_prev = token_budget</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 549 | <code>        for s in reversed(sentences[:boundary_idx + 1]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 550 | <code>            if remaining_prev &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 551 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 552 | <code>            tks = num_tokens_from_string(s)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 553 | <code>            if tks &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 554 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 555 | <code>            if tks &gt; remaining_prev:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 556 | <code>                s = trim_to_tokens(s, remaining_prev, from_tail=True)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 557 | <code>                tks = num_tokens_from_string(s)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 558 | <code>            prev_ctx.append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 559 | <code>            remaining_prev -= tks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 560 | <code>        prev_ctx.reverse()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>        next_ctx = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 563 | <code>        remaining_next = token_budget</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 564 | <code>        for s in sentences[boundary_idx + 1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 565 | <code>            if remaining_next &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 566 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 567 | <code>            tks = num_tokens_from_string(s)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 568 | <code>            if tks &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 569 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 570 | <code>            if tks &gt; remaining_next:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 571 | <code>                s = trim_to_tokens(s, remaining_next, from_tail=False)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 572 | <code>                tks = num_tokens_from_string(s)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 573 | <code>            next_ctx.append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 574 | <code>            remaining_next -= tks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 575 | <code>        return prev_ctx, next_ctx</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 577 | <code>    def extract_position(ck):</code> | 定义 Python 函数 `extract_position`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 578 | <code>        pn = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 579 | <code>        top = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 580 | <code>        left = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 581 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 582 | <code>            if ck.get("page_num_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 583 | <code>                pn = ck["page_num_int"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 584 | <code>            elif ck.get("page_number") is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 585 | <code>                pn = ck.get("page_number")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>            if ck.get("top_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 588 | <code>                top = ck["top_int"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 589 | <code>            elif ck.get("top") is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 590 | <code>                top = ck.get("top")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 592 | <code>            if ck.get("position_int"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 593 | <code>                left = ck["position_int"][0][1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 594 | <code>            elif ck.get("x0") is not None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 595 | <code>                left = ck.get("x0")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 596 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 597 | <code>            pn = top = left = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 598 | <code>        return pn, top, left</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 600 | <code>    indexed = list(enumerate(chunks))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 601 | <code>    positioned_indices = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 602 | <code>    unpositioned_indices = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 603 | <code>    for idx, ck in indexed:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 604 | <code>        pn, top, left = extract_position(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 605 | <code>        if pn is not None and top is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 606 | <code>            positioned_indices.append((idx, pn, top, left if left is not None else 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 607 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 608 | <code>            unpositioned_indices.append(idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 610 | <code>    if positioned_indices:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 611 | <code>        positioned_indices.sort(key=lambda x: (int(x[1]), int(x[2]), int(x[3]), x[0]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 612 | <code>        ordered_indices = [i for i, _, _, _ in positioned_indices] + unpositioned_indices</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 613 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 614 | <code>        ordered_indices = [idx for idx, _ in indexed]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 615 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 616 | <code>    text_bounds = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 617 | <code>    for idx, ck in indexed:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 618 | <code>        if not is_text_chunk(ck):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 619 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 620 | <code>        bounds = get_bounds_by_page(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 621 | <code>        if bounds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 622 | <code>            text_bounds.append((idx, bounds))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>    for sorted_pos, idx in enumerate(ordered_indices):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 625 | <code>        ck = chunks[idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 626 | <code>        token_budget = image_context_size if is_image_chunk(ck) else table_context_size if is_table_chunk(ck) else 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 627 | <code>        if token_budget &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 628 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>        prev_ctx = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 631 | <code>        next_ctx = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 632 | <code>        media_bounds = get_bounds_by_page(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 633 | <code>        best_idx = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 634 | <code>        best_dist = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 635 | <code>        candidate_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 636 | <code>        if media_bounds and text_bounds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 637 | <code>            for text_idx, bounds in text_bounds:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 638 | <code>                for pn, (t_top, t_bottom) in bounds.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 639 | <code>                    if pn not in media_bounds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 640 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 641 | <code>                    m_top, m_bottom = media_bounds[pn]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 642 | <code>                    if m_bottom &lt; t_top or m_top &gt; t_bottom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 643 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 644 | <code>                    candidate_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 645 | <code>                    m_mid = (m_top + m_bottom) / 2.0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 646 | <code>                    t_mid = (t_top + t_bottom) / 2.0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 647 | <code>                    dist = abs(m_mid - t_mid)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 648 | <code>                    if best_dist is None or dist &lt; best_dist:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 649 | <code>                        best_dist = dist</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 650 | <code>                        best_idx = text_idx</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 651 | <code>        if best_idx is None and media_bounds:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 652 | <code>            media_page = min(media_bounds.keys())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 653 | <code>            page_order = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 654 | <code>            for ordered_idx in ordered_indices:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 655 | <code>                pn, _, _ = extract_position(chunks[ordered_idx])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 656 | <code>                if pn == media_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 657 | <code>                    page_order.append(ordered_idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 658 | <code>            if page_order and idx in page_order:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 659 | <code>                pos_in_page = page_order.index(idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 660 | <code>                if pos_in_page == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 661 | <code>                    for neighbor in page_order[pos_in_page + 1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 662 | <code>                        if is_text_chunk(chunks[neighbor]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 663 | <code>                            best_idx = neighbor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 664 | <code>                            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 665 | <code>                elif pos_in_page == len(page_order) - 1:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 666 | <code>                    for neighbor in reversed(page_order[:pos_in_page]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 667 | <code>                        if is_text_chunk(chunks[neighbor]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 668 | <code>                            best_idx = neighbor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 669 | <code>                            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 670 | <code>        if best_idx is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 671 | <code>            base_text = get_text(chunks[best_idx])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 672 | <code>            sentences = split_sentences(base_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 673 | <code>            if sentences:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 674 | <code>                boundary_idx = find_mid_sentence_index(sentences)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 675 | <code>                prev_ctx, next_ctx = collect_context_from_sentences(sentences, boundary_idx, token_budget)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 677 | <code>        if not prev_ctx and not next_ctx:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 678 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>        self_text = get_text(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 681 | <code>        pieces = [*prev_ctx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 682 | <code>        if self_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 683 | <code>            pieces.append(self_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 684 | <code>        pieces.extend(next_ctx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 685 | <code>        combined = "\n".join(pieces)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>        original = ck.get("content_with_weight")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 688 | <code>        if "content_with_weight" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 689 | <code>            ck["content_with_weight"] = combined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 690 | <code>        elif "text" in ck:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 691 | <code>            original = ck.get("text")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 692 | <code>            ck["text"] = combined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>        if combined != original:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 695 | <code>            if "content_ltks" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 696 | <code>                ck["content_ltks"] = rag_tokenizer.tokenize(combined)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 697 | <code>            if "content_sm_ltks" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 698 | <code>                ck["content_sm_ltks"] = rag_tokenizer.fine_grained_tokenize(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 699 | <code>                    ck.get("content_ltks", rag_tokenizer.tokenize(combined)))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 701 | <code>    if positioned_indices:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 702 | <code>        chunks[:] = [chunks[i] for i in ordered_indices]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>    return chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 707 | <code>def append_context2table_image4pdf(sections: list, tabls: list, table_context_size=0, return_context=False):</code> | 定义 Python 函数 `append_context2table_image4pdf`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 708 | <code>    from deepdoc.parser import PdfParser</code> | 导入 Python 依赖 `deepdoc.parser`，供本模块调用其类型、函数或常量。 |
| 709 | <code>    if table_context_size &lt;=0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 710 | <code>        return [] if return_context else tabls</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 712 | <code>    page_bucket = defaultdict(list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 713 | <code>    for i, item in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 714 | <code>        if isinstance(item, (tuple, list)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 715 | <code>            if len(item) &gt; 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 716 | <code>                txt, _sec_id, poss = item[0], item[1], item[2]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 717 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 718 | <code>                txt = item[0] if item else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 719 | <code>                poss = item[1] if len(item) &gt; 1 else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 720 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 721 | <code>            txt = item</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 722 | <code>            poss = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 723 | <code>        # Normal: (text, "@@...##") from naive parser -&gt; poss is a position tag string.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 724 | <code>        # Manual: (text, sec_id, poss_list) -&gt; poss is a list of (page, left, right, top, bottom).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 725 | <code>        # Paper: (text_with_@@tag, layoutno) -&gt; poss is layoutno; parse from txt when it contains @@ tags.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 726 | <code>        if isinstance(poss, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 727 | <code>            poss = poss</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 728 | <code>        elif isinstance(poss, str):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 729 | <code>            if "@@" not in poss and isinstance(txt, str) and "@@" in txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 730 | <code>                poss = txt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 731 | <code>            poss = PdfParser.extract_positions(poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 732 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 733 | <code>            if isinstance(txt, str) and "@@" in txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 734 | <code>                poss = PdfParser.extract_positions(txt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 735 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 736 | <code>                poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 737 | <code>        if isinstance(txt, str) and "@@" in txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 738 | <code>            txt = re.sub(r"@@[0-9-]+\t[0-9.\t]+##", "", txt).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 739 | <code>        for page, left, right, top, bottom in poss:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 740 | <code>            if isinstance(page, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 741 | <code>                page = page[0] if page else 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 742 | <code>            page_bucket[page].append(((left, right, top, bottom), txt))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 744 | <code>    def upper_context(page, i):</code> | 定义 Python 函数 `upper_context`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 745 | <code>        txt = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 746 | <code>        if page not in page_bucket:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 747 | <code>            i = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 748 | <code>        while num_tokens_from_string(txt) &lt; table_context_size:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 749 | <code>            if i &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 750 | <code>                page -= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 751 | <code>                if page &lt; 0 or page not in page_bucket:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 752 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 753 | <code>                i = len(page_bucket[page]) -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 754 | <code>            blks = page_bucket[page]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 755 | <code>            (_, _, _, _), cnt = blks[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 756 | <code>            txts = re.split(r"([。!?？；！\n]&#124;\. )", cnt, flags=re.DOTALL)[::-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 757 | <code>            for j in range(0, len(txts), 2):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 758 | <code>                txt = (txts[j+1] if j+1&lt;len(txts) else "") + txts[j] + txt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 759 | <code>                if num_tokens_from_string(txt) &gt; table_context_size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 760 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 761 | <code>            i -= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 762 | <code>        return txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 764 | <code>    def lower_context(page, i):</code> | 定义 Python 函数 `lower_context`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 765 | <code>        txt = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 766 | <code>        if page not in page_bucket:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 767 | <code>            return txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 768 | <code>        while num_tokens_from_string(txt) &lt; table_context_size:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 769 | <code>            if i &gt;= len(page_bucket[page]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 770 | <code>                page += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 771 | <code>                if page not in page_bucket:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 772 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 773 | <code>                i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 774 | <code>            blks = page_bucket[page]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 775 | <code>            (_, _, _, _), cnt = blks[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 776 | <code>            txts = re.split(r"([。!?？；！\n]&#124;\. )", cnt, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 777 | <code>            for j in range(0, len(txts), 2):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 778 | <code>                txt += txts[j] + (txts[j+1] if j+1&lt;len(txts) else "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 779 | <code>                if num_tokens_from_string(txt) &gt; table_context_size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 780 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 781 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 782 | <code>        return txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 783 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 784 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 785 | <code>    contexts = []</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 786 | <code>    for (img, tb), poss in tabls:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 787 | <code>        page, left, right, top, bott = poss[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 788 | <code>        _page, _left, _right, _top, _bott = poss[-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 789 | <code>        if isinstance(tb, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 790 | <code>            tb = "\n".join(tb)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 793 | <code>        blks = page_bucket.get(page, [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 794 | <code>        _tb = tb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 795 | <code>        while i &lt; len(blks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 796 | <code>            if i + 1 &gt;= len(blks):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 797 | <code>                if _page &gt; page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 798 | <code>                    page += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 799 | <code>                    i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 800 | <code>                    blks = page_bucket.get(page, [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 801 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 802 | <code>                upper = upper_context(page, i)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 803 | <code>                lower = lower_context(page + 1, 0)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 804 | <code>                tb = upper + tb + lower</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 805 | <code>                contexts.append((upper.strip(), lower.strip()))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 806 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 807 | <code>            (_, _, t, b), txt = blks[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 808 | <code>            if b &gt; top:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 809 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 810 | <code>            (_, _, _t, _b), _txt = blks[i+1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 811 | <code>            if _t &lt; _bott:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 812 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 813 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>            upper = upper_context(page, i)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 816 | <code>            lower = lower_context(page, i)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 817 | <code>            tb = upper + tb + lower</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 818 | <code>            contexts.append((upper.strip(), lower.strip()))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 819 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>        if _tb == tb:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 822 | <code>            upper = upper_context(page, -1)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 823 | <code>            lower = lower_context(page + 1, 0)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 824 | <code>            tb = upper + tb + lower</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 825 | <code>            contexts.append((upper.strip(), lower.strip()))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 826 | <code>        if len(contexts) &lt; len(res) + 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 827 | <code>            contexts.append(("", ""))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 828 | <code>        res.append(((img, tb), poss))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 829 | <code>    return contexts if return_context else res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 832 | <code>def add_positions(d, poss):</code> | 定义 Python 函数 `add_positions`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 833 | <code>    if not poss:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 834 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 835 | <code>    page_num_int = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 836 | <code>    position_int = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 837 | <code>    top_int = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 838 | <code>    for pn, left, right, top, bottom in poss:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 839 | <code>        page_num_int.append(int(pn + 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 840 | <code>        top_int.append(int(top))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 841 | <code>        position_int.append((int(pn + 1), int(left), int(right), int(top), int(bottom)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 842 | <code>    d["page_num_int"] = page_num_int</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 843 | <code>    d["position_int"] = position_int</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 844 | <code>    d["top_int"] = top_int</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>def remove_contents_table(sections, eng=False):</code> | 定义 Python 函数 `remove_contents_table`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 848 | <code>    i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 849 | <code>    while i &lt; len(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 850 | <code>        def get(i):</code> | 定义 Python 函数 `get`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 851 | <code>            nonlocal sections</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 852 | <code>            return (sections[i] if isinstance(sections[i],</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 853 | <code>                                              type("")) else sections[i][0]).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>        if not re.match(r"(contents&#124;目录&#124;目次&#124;table of contents&#124;致谢&#124;acknowledge)$",</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 856 | <code>                        re.sub(r"( &#124; &#124;\u3000)+", "", get(i).split("@@")[0], flags=re.IGNORECASE)):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 857 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 858 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 859 | <code>        sections.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 860 | <code>        if i &gt;= len(sections):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 861 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 862 | <code>        prefix = get(i)[:3] if not eng else " ".join(get(i).split()[:2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 863 | <code>        while not prefix:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 864 | <code>            sections.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 865 | <code>            if i &gt;= len(sections):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 866 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 867 | <code>            prefix = get(i)[:3] if not eng else " ".join(get(i).split()[:2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 868 | <code>        sections.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 869 | <code>        if i &gt;= len(sections) or not prefix:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 870 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 871 | <code>        for j in range(i, min(i + 128, len(sections))):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 872 | <code>            if not re.match(prefix, get(j)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 873 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 874 | <code>            for _ in range(i, j):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 875 | <code>                sections.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 876 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 879 | <code>def make_colon_as_title(sections):</code> | 定义 Python 函数 `make_colon_as_title`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 880 | <code>    if not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 881 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 882 | <code>    if isinstance(sections[0], type("")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 883 | <code>        return sections</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 884 | <code>    i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 885 | <code>    while i &lt; len(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 886 | <code>        txt, layout = sections[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 887 | <code>        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 888 | <code>        txt = txt.split("@")[0].strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 889 | <code>        if not txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 890 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 891 | <code>        if txt[-1] not in ":：":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 892 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 893 | <code>        txt = txt[::-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 894 | <code>        arr = re.split(r"([。？！!?;；]&#124; \.)", txt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 895 | <code>        if len(arr) &lt; 2 or len(arr[1]) &lt; 32:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 896 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 897 | <code>        sections.insert(i - 1, (arr[0][::-1], "title"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 898 | <code>        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 899 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>def title_frequency(bull, sections):</code> | 定义 Python 函数 `title_frequency`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 902 | <code>    bullets_size = len(BULLET_PATTERN[bull])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 903 | <code>    levels = [bullets_size + 1 for _ in range(len(sections))]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 904 | <code>    if not sections or bull &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 905 | <code>        return bullets_size + 1, levels</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>    for i, (txt, layout) in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 908 | <code>        for j, p in enumerate(BULLET_PATTERN[bull]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 909 | <code>            if re.match(p, txt.strip()) and not not_bullet(txt):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 910 | <code>                levels[i] = j</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 911 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 912 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 913 | <code>            if re.search(r"(title&#124;head)", layout) and not not_title(txt.split("@")[0]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 914 | <code>                levels[i] = bullets_size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 915 | <code>    most_level = bullets_size + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 916 | <code>    for level, c in sorted(Counter(levels).items(), key=lambda x: x[1] * -1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 917 | <code>        if level &lt;= bullets_size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 918 | <code>            most_level = level</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 919 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 920 | <code>    return most_level, levels</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 923 | <code>def not_title(txt):</code> | 定义 Python 函数 `not_title`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 924 | <code>    if re.match(r"第[零一二三四五六七八九十百0-9]+条", txt):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 925 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 926 | <code>    if len(txt.split()) &gt; 12 or (txt.find(" ") &lt; 0 and len(txt) &gt;= 32):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 927 | <code>        return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 928 | <code>    return re.search(r"[,;，。；！!]", txt)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>def tree_merge(bull, sections, depth):</code> | 定义 Python 函数 `tree_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 932 | <code>    if not sections or bull &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 933 | <code>        return sections</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 934 | <code>    if isinstance(sections[0], type("")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 935 | <code>        sections = [(s, "") for s in sections]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 937 | <code>    # filter out position information in pdf sections</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 938 | <code>    sections = [(t, o) for t, o in sections if</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 939 | <code>                t and len(t.split("@")[0].strip()) &gt; 1 and not re.match(r"[0-9]+$", t.split("@")[0].strip())]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 940 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 941 | <code>    def get_level(bull, section):</code> | 定义 Python 函数 `get_level`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 942 | <code>        text, layout = section</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 943 | <code>        text = re.sub(r"\u3000", " ", text).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>        for i, title in enumerate(BULLET_PATTERN[bull]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 946 | <code>            if re.match(title, text.strip()):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 947 | <code>                return i + 1, text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 948 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 949 | <code>            if re.search(r"(title&#124;head)", layout) and not not_title(text):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 950 | <code>                return len(BULLET_PATTERN[bull]) + 1, text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 951 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 952 | <code>                return len(BULLET_PATTERN[bull]) + 2, text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 954 | <code>    level_set = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 955 | <code>    lines = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 956 | <code>    for section in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 957 | <code>        level, text = get_level(bull, section)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 958 | <code>        if not text.strip("\n"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 959 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>        lines.append((level, text))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 962 | <code>        level_set.add(level)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>    sorted_levels = sorted(list(level_set))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>    if depth &lt;= len(sorted_levels):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 967 | <code>        target_level = sorted_levels[depth - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 968 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 969 | <code>        target_level = sorted_levels[-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 970 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 971 | <code>    if target_level == len(BULLET_PATTERN[bull]) + 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 972 | <code>        target_level = sorted_levels[-2] if len(sorted_levels) &gt; 1 else sorted_levels[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>    root = Node(level=0, depth=target_level, texts=[])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 975 | <code>    root.build_tree(lines)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 977 | <code>    return [element for element in root.get_tree() if element]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 979 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 980 | <code>def hierarchical_merge(bull, sections, depth):</code> | 定义 Python 函数 `hierarchical_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 981 | <code>    if not sections or bull &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 982 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 983 | <code>    if isinstance(sections[0], type("")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 984 | <code>        sections = [(s, "") for s in sections]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 985 | <code>    sections = [(t, o) for t, o in sections if</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 986 | <code>                t and len(t.split("@")[0].strip()) &gt; 1 and not re.match(r"[0-9]+$", t.split("@")[0].strip())]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 987 | <code>    bullets_size = len(BULLET_PATTERN[bull])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 988 | <code>    levels = [[] for _ in range(bullets_size + 2)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 989 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 990 | <code>    for i, (txt, layout) in enumerate(sections):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 991 | <code>        for j, p in enumerate(BULLET_PATTERN[bull]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 992 | <code>            if re.match(p, txt.strip()):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 993 | <code>                levels[j].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 994 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 995 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 996 | <code>            if re.search(r"(title&#124;head)", layout) and not not_title(txt):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 997 | <code>                levels[bullets_size].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 998 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 999 | <code>                levels[bullets_size + 1].append(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1000 | <code>    sections = [t for t, _ in sections]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1001 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1002 | <code>    # for s in sections: print("--", s)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1003 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1004 | <code>    def binary_search(arr, target):</code> | 定义 Python 函数 `binary_search`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1005 | <code>        if not arr:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1006 | <code>            return -1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1007 | <code>        if target &gt; arr[-1]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1008 | <code>            return len(arr) - 1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1009 | <code>        if target &lt; arr[0]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1010 | <code>            return -1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1011 | <code>        s, e = 0, len(arr)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1012 | <code>        while e - s &gt; 1:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1013 | <code>            i = (e + s) // 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1014 | <code>            if target &gt; arr[i]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1015 | <code>                s = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1016 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1017 | <code>            elif target &lt; arr[i]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1018 | <code>                e = i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1019 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1020 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1021 | <code>                assert False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1022 | <code>        return s</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1023 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1024 | <code>    cks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1025 | <code>    readed = [False] * len(sections)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1026 | <code>    levels = levels[::-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1027 | <code>    for i, arr in enumerate(levels[:depth]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1028 | <code>        for j in arr:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1029 | <code>            if readed[j]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1030 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1031 | <code>            readed[j] = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1032 | <code>            cks.append([j])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1033 | <code>            if i + 1 == len(levels) - 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1034 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1035 | <code>            for ii in range(i + 1, len(levels)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1036 | <code>                jj = binary_search(levels[ii], j)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1037 | <code>                if jj &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1038 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1039 | <code>                if levels[ii][jj] &gt; cks[-1][-1]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1040 | <code>                    cks[-1].pop(-1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1041 | <code>                cks[-1].append(levels[ii][jj])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1042 | <code>            for ii in cks[-1]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1043 | <code>                readed[ii] = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>    if not cks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1046 | <code>        return cks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1048 | <code>    for i in range(len(cks)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1049 | <code>        cks[i] = [sections[j] for j in cks[i][::-1]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1050 | <code>        logging.debug("\n* ".join(cks[i]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1051 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1052 | <code>    res = [[]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1053 | <code>    num = [0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1054 | <code>    for ck in cks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1055 | <code>        if len(ck) == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1056 | <code>            n = num_tokens_from_string(re.sub(r"@@[0-9]+.*", "", ck[0]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1057 | <code>            if n + num[-1] &lt; 218:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1058 | <code>                res[-1].append(ck[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1059 | <code>                num[-1] += n</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1060 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1061 | <code>            res.append(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1062 | <code>            num.append(n)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1063 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1064 | <code>        res.append(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1065 | <code>        num.append(218)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1066 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1067 | <code>    return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1069 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1070 | <code>def naive_merge(sections: str &#124; list, chunk_token_num=128, delimiter="\n。；！？", overlapped_percent=0):</code> | 定义 Python 函数 `naive_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1071 | <code>    from deepdoc.parser.pdf_parser import RAGFlowPdfParser</code> | 导入 Python 依赖 `deepdoc.parser.pdf_parser`，供本模块调用其类型、函数或常量。 |
| 1072 | <code>    if not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1073 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1074 | <code>    if isinstance(sections, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1075 | <code>        sections = [sections]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1076 | <code>    if isinstance(sections[0], str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1077 | <code>        sections = [(s, "") for s in sections]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1078 | <code>    cks = [""]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1079 | <code>    tk_nums = [0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1080 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1081 | <code>    def add_chunk(t, pos):</code> | 定义 Python 函数 `add_chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1082 | <code>        nonlocal cks, tk_nums, delimiter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1083 | <code>        tnum = num_tokens_from_string(t)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1084 | <code>        if not pos:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1085 | <code>            pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1086 | <code>        if tnum &lt; 8:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1087 | <code>            pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1088 | <code>        # Ensure that the length of the merged chunk does not exceed chunk_token_num</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1089 | <code>        if cks[-1] == "" or tk_nums[-1] &gt; chunk_token_num * (100 - overlapped_percent) / 100.:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1090 | <code>            if cks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1091 | <code>                overlapped = RAGFlowPdfParser.remove_tag(cks[-1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1092 | <code>                t = overlapped[int(len(overlapped) * (100 - overlapped_percent) / 100.):] + t</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1093 | <code>                # Recount with the overlap prefix included, else chunks overshoot chunk_token_num.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1094 | <code>                tnum = num_tokens_from_string(t)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1095 | <code>            if t.find(pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1096 | <code>                t += pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1097 | <code>            cks.append(t)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1098 | <code>            tk_nums.append(tnum)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1099 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1100 | <code>            if cks[-1].find(pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1101 | <code>                t += pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1102 | <code>            cks[-1] += t</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1103 | <code>            tk_nums[-1] += tnum</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1105 | <code>    custom_delimiters = [m.group(1) for m in re.finditer(r"`([^`]+)`", delimiter)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1106 | <code>    has_custom = bool(custom_delimiters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1107 | <code>    if has_custom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1108 | <code>        # Custom delimiters ignore chunk_token_num: each segment is its own chunk.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1109 | <code>        custom_pattern = "&#124;".join(re.escape(t) for t in sorted(set(custom_delimiters), key=len, reverse=True))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1110 | <code>        cks, tk_nums = [], []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1111 | <code>        for sec, pos in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1112 | <code>            split_sec = re.split(r"(%s)" % custom_pattern, sec, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1113 | <code>            for sub_sec in split_sec:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1114 | <code>                if re.fullmatch(custom_pattern, sub_sec or ""):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1115 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1116 | <code>                text = "\n" + sub_sec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1117 | <code>                local_pos = pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1118 | <code>                if num_tokens_from_string(text) &lt; 8:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1119 | <code>                    local_pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1120 | <code>                if local_pos and text.find(local_pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1121 | <code>                    text += local_pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1122 | <code>                cks.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1123 | <code>                tk_nums.append(num_tokens_from_string(text))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1124 | <code>        return cks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1126 | <code>    # Split oversized sections at sentence delimiters; add_chunk re-merges to size.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1127 | <code>    dels = get_delimiters(delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1128 | <code>    for sec, pos in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1129 | <code>        if not dels or num_tokens_from_string(sec) &lt; chunk_token_num:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1130 | <code>            add_chunk("\n" + sec, pos)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1131 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1132 | <code>        for sub_sec in re.split(r"(%s)" % dels, sec, flags=re.DOTALL):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1133 | <code>            if not sub_sec or re.fullmatch(dels, sub_sec):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1134 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1135 | <code>            add_chunk("\n" + sub_sec, pos)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1137 | <code>    logging.debug("naive_merge: %d sections -&gt; %d chunks (delimiter=%r)", len(sections), len(cks), delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1138 | <code>    return cks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1141 | <code>def naive_merge_with_images(texts, images, chunk_token_num=128, delimiter="\n。；！？", overlapped_percent=0):</code> | 定义 Python 函数 `naive_merge_with_images`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1142 | <code>    from deepdoc.parser.pdf_parser import RAGFlowPdfParser</code> | 导入 Python 依赖 `deepdoc.parser.pdf_parser`，供本模块调用其类型、函数或常量。 |
| 1143 | <code>    if not texts or len(texts) != len(images):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1144 | <code>        return [], []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1145 | <code>    cks = [""]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1146 | <code>    result_images = [None]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1147 | <code>    tk_nums = [0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1149 | <code>    def add_chunk(t, image, pos=""):</code> | 定义 Python 函数 `add_chunk`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1150 | <code>        nonlocal cks, result_images, tk_nums, delimiter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1151 | <code>        tnum = num_tokens_from_string(t)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1152 | <code>        if not pos:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1153 | <code>            pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1154 | <code>        if tnum &lt; 8:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1155 | <code>            pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1156 | <code>        # Ensure that the length of the merged chunk does not exceed chunk_token_num</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1157 | <code>        if cks[-1] == "" or tk_nums[-1] &gt; chunk_token_num * (100 - overlapped_percent) / 100.:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1158 | <code>            if cks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1159 | <code>                overlapped = RAGFlowPdfParser.remove_tag(cks[-1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1160 | <code>                t = overlapped[int(len(overlapped) * (100 - overlapped_percent) / 100.):] + t</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1161 | <code>                # Recount with the overlap prefix included, else chunks overshoot chunk_token_num.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1162 | <code>                tnum = num_tokens_from_string(t)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1163 | <code>            if t.find(pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1164 | <code>                t += pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1165 | <code>            cks.append(t)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1166 | <code>            result_images.append(image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1167 | <code>            tk_nums.append(tnum)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1168 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1169 | <code>            if cks[-1].find(pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1170 | <code>                t += pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1171 | <code>            cks[-1] += t</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1172 | <code>            if result_images[-1] is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1173 | <code>                result_images[-1] = image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1174 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1175 | <code>                result_images[-1] = concat_img(result_images[-1], image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1176 | <code>            tk_nums[-1] += tnum</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1178 | <code>    custom_delimiters = [m.group(1) for m in re.finditer(r"`([^`]+)`", delimiter)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1179 | <code>    has_custom = bool(custom_delimiters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1180 | <code>    if has_custom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1181 | <code>        # Custom delimiters ignore chunk_token_num: each segment is its own chunk.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1182 | <code>        custom_pattern = "&#124;".join(re.escape(t) for t in sorted(set(custom_delimiters), key=len, reverse=True))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1183 | <code>        cks, result_images, tk_nums = [], [], []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1184 | <code>        for text, image in zip(texts, images):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1185 | <code>            text_str = text[0] if isinstance(text, tuple) else text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1186 | <code>            if text_str is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1187 | <code>                text_str = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1188 | <code>            text_pos = text[1] if isinstance(text, tuple) and len(text) &gt; 1 else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1189 | <code>            split_sec = re.split(r"(%s)" % custom_pattern, text_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1190 | <code>            for sub_sec in split_sec:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1191 | <code>                if re.fullmatch(custom_pattern, sub_sec or ""):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1192 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1193 | <code>                text_seg = "\n" + sub_sec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1194 | <code>                local_pos = text_pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1195 | <code>                if num_tokens_from_string(text_seg) &lt; 8:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1196 | <code>                    local_pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1197 | <code>                if local_pos and text_seg.find(local_pos) &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1198 | <code>                    text_seg += local_pos</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1199 | <code>                cks.append(text_seg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1200 | <code>                result_images.append(image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1201 | <code>                tk_nums.append(num_tokens_from_string(text_seg))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1202 | <code>        return cks, result_images</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1204 | <code>    # Split oversized sections at sentence delimiters; the section's image rides</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1205 | <code>    # along on every piece (concat_img dedupes when pieces re-merge into a chunk).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1206 | <code>    dels = get_delimiters(delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1207 | <code>    for text, image in zip(texts, images):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1208 | <code>        # if text is tuple, unpack it</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1209 | <code>        if isinstance(text, tuple):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1210 | <code>            text_str = text[0] if text[0] is not None else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1211 | <code>            text_pos = text[1] if len(text) &gt; 1 else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1212 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1213 | <code>            text_str = text or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1214 | <code>            text_pos = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1215 | <code>        if not dels or num_tokens_from_string(text_str) &lt; chunk_token_num:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1216 | <code>            add_chunk("\n" + text_str, image, text_pos)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1217 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1218 | <code>        for sub_sec in re.split(r"(%s)" % dels, text_str, flags=re.DOTALL):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1219 | <code>            if not sub_sec or re.fullmatch(dels, sub_sec):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1220 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1221 | <code>            add_chunk("\n" + sub_sec, image, text_pos)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1223 | <code>    logging.debug("naive_merge_with_images: %d texts -&gt; %d chunks (delimiter=%r)", len(texts), len(cks), delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1224 | <code>    return cks, result_images</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1227 | <code>def docx_question_level(p, bull=-1):</code> | 定义 Python 函数 `docx_question_level`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1228 | <code>    txt = re.sub(r"\u3000", " ", p.text).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1229 | <code>    if hasattr(p.style, 'name') and p.style.name and p.style.name.startswith('Heading'):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1230 | <code>        # Heading styles are usually "Heading N", but the base "Heading" style,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1231 | <code>        # custom "Heading"-prefixed styles, or "HeadingN" (no space) have no</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1232 | <code>        # space-separated trailing integer. Extract the level digits safely and</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1233 | <code>        # fall back to the top heading level instead of raising ValueError (#16163).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1234 | <code>        m = re.search(r"\d+", p.style.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1235 | <code>        return (int(m.group()) if m else 1), txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1236 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1237 | <code>        if bull &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1238 | <code>            return 0, txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1239 | <code>        for j, title in enumerate(BULLET_PATTERN[bull]):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1240 | <code>            if re.match(title, txt):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1241 | <code>                return j + 1, txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1242 | <code>    return len(BULLET_PATTERN[bull]) + 1, txt</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1245 | <code>def concat_img(img1, img2):</code> | 定义 Python 函数 `concat_img`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1246 | <code>    from rag.utils.lazy_image import ensure_pil_image, LazyImage</code> | 导入 Python 依赖 `rag.utils.lazy_image`，供本模块调用其类型、函数或常量。 |
| 1247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1248 | <code>    # Same image must not stack with itself (the LazyImage branch would otherwise</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1249 | <code>    # concatenate its blob list); mirrors the PIL branch's same-reference guard.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1250 | <code>    if img1 is img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1251 | <code>        return img1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1253 | <code>    if (img1 is None or isinstance(img1, LazyImage)) and \</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1254 | <code>       (img2 is None or isinstance(img2, LazyImage)):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1255 | <code>        if img1 and not img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1256 | <code>            return img1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1257 | <code>        if not img1 and img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1258 | <code>            return img2</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1259 | <code>        if not img1 and not img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1260 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1261 | <code>        return LazyImage.merge(img1, img2)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1263 | <code>    img1 = ensure_pil_image(img1) or img1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1264 | <code>    img2 = ensure_pil_image(img2) or img2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1265 | <code>    if img1 and not img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1266 | <code>        return img1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1267 | <code>    if not img1 and img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1268 | <code>        return img2</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1269 | <code>    if not img1 and not img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1270 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1272 | <code>    if img1 is img2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1273 | <code>        return img1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1275 | <code>    if isinstance(img1, Image.Image) and isinstance(img2, Image.Image):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1276 | <code>        pixel_data1 = img1.tobytes()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1277 | <code>        pixel_data2 = img2.tobytes()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1278 | <code>        if pixel_data1 == pixel_data2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1279 | <code>            return img1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1281 | <code>    width1, height1 = img1.size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1282 | <code>    width2, height2 = img2.size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1284 | <code>    new_width = max(width1, width2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1285 | <code>    new_height = height1 + height2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1286 | <code>    new_image = Image.new('RGB', (new_width, new_height))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1288 | <code>    new_image.paste(img1, (0, 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1289 | <code>    new_image.paste(img2, (0, height1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1290 | <code>    return new_image</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1292 | <code>def _build_cks(sections, delimiter):</code> | 定义 Python 函数 `_build_cks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1293 | <code>    cks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1294 | <code>    tables = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1295 | <code>    images = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1297 | <code>    # extract custom delimiters wrapped by backticks: `##`, `---`, etc.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1298 | <code>    custom_delimiters = [m.group(1) for m in re.finditer(r"`([^`]+)`", delimiter)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1299 | <code>    has_custom = bool(custom_delimiters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1301 | <code>    if has_custom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1302 | <code>        # escape delimiters and build alternation pattern, longest first</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1303 | <code>        custom_pattern = "&#124;".join(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1304 | <code>            re.escape(t) for t in sorted(set(custom_delimiters), key=len, reverse=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1305 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1306 | <code>        # capture delimiters so they appear in re.split results</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1307 | <code>        pattern = r"(%s)" % custom_pattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1309 | <code>    seg = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1310 | <code>    for text, image, table in sections:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1311 | <code>        # normalize text: ensure string and prepend newline for continuity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1312 | <code>        if not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1313 | <code>            text = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1314 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1315 | <code>            text = "\n" + str(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1317 | <code>        if table:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1318 | <code>            # table chunk</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1319 | <code>            ck_text = text + str(table)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1320 | <code>            idx = len(cks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1321 | <code>            cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1322 | <code>                "text": ck_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1323 | <code>                "image": image,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1324 | <code>                "ck_type": "table",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1325 | <code>                "tk_nums": num_tokens_from_string(ck_text),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1326 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>            tables.append(idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1328 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1330 | <code>        if image:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1331 | <code>            # image chunk (text kept as-is for context)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1332 | <code>            idx = len(cks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1333 | <code>            cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1334 | <code>                "text": text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1335 | <code>                "image": image,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1336 | <code>                "ck_type": "image",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1337 | <code>                "tk_nums": num_tokens_from_string(text),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1338 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1339 | <code>            images.append(idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1340 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1342 | <code>        # pure text chunk(s)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1343 | <code>        if has_custom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1344 | <code>            split_sec = re.split(pattern, text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1345 | <code>            for sub_sec in split_sec:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1346 | <code>                # ① empty or whitespace-only segment → flush current buffer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1347 | <code>                if not sub_sec or not sub_sec.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1348 | <code>                    if seg and seg.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1349 | <code>                        s = seg.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1350 | <code>                        cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1351 | <code>                            "text": s,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1352 | <code>                            "image": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1353 | <code>                            "ck_type": "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1354 | <code>                            "tk_nums": num_tokens_from_string(s),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1355 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1356 | <code>                    seg = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1357 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1359 | <code>                # ② matched custom delimiter (allow surrounding whitespace)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1360 | <code>                if re.fullmatch(custom_pattern, sub_sec.strip()):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1361 | <code>                    if seg and seg.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1362 | <code>                        s = seg.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1363 | <code>                        cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1364 | <code>                            "text": s,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1365 | <code>                            "image": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1366 | <code>                            "ck_type": "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1367 | <code>                            "tk_nums": num_tokens_from_string(s),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1368 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1369 | <code>                    seg = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1370 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1372 | <code>                # ③ normal text content → accumulate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1373 | <code>                seg += sub_sec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1374 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1376 | <code>            if text and text.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1377 | <code>                t = text.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1378 | <code>                cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1379 | <code>                    "text": t,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1380 | <code>                    "image": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1381 | <code>                    "ck_type": "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1382 | <code>                    "tk_nums": num_tokens_from_string(t),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1383 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1385 | <code>    # final flush after loop (only when custom delimiters are used)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1386 | <code>    if has_custom and seg and seg.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1387 | <code>        s = seg.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1388 | <code>        cks.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1389 | <code>            "text": s,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1390 | <code>            "image": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1391 | <code>            "ck_type": "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1392 | <code>            "tk_nums": num_tokens_from_string(s),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1393 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1395 | <code>    return cks, tables, images, has_custom</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1398 | <code>def _add_context(cks, idx, context_size):</code> | 定义 Python 函数 `_add_context`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1399 | <code>    if cks[idx]["ck_type"] not in ("image", "table"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1400 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1402 | <code>    prev = idx - 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1403 | <code>    after = idx + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1404 | <code>    remain_above = context_size</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1405 | <code>    remain_below = context_size</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1407 | <code>    cks[idx]["context_above"] = ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1408 | <code>    cks[idx]["context_below"] = ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1410 | <code>    split_pat = r"([。!?？；！\n]&#124;\. )"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1412 | <code>    picked_above = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1413 | <code>    picked_below = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1415 | <code>    def take_sentences_from_end(cnt, need_tokens):</code> | 定义 Python 函数 `take_sentences_from_end`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1416 | <code>        txts = re.split(split_pat, cnt, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1417 | <code>        sents = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1418 | <code>        for j in range(0, len(txts), 2):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1419 | <code>            sents.append(txts[j] + (txts[j + 1] if j + 1 &lt; len(txts) else ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1420 | <code>        acc = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1421 | <code>        for s in reversed(sents):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1422 | <code>            acc = s + acc</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1423 | <code>            if num_tokens_from_string(acc) &gt;= need_tokens:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1424 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1425 | <code>        return acc</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1427 | <code>    def take_sentences_from_start(cnt, need_tokens):</code> | 定义 Python 函数 `take_sentences_from_start`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1428 | <code>        txts = re.split(split_pat, cnt, flags=re.DOTALL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1429 | <code>        acc = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1430 | <code>        for j in range(0, len(txts), 2):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1431 | <code>            acc += txts[j] + (txts[j + 1] if j + 1 &lt; len(txts) else "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1432 | <code>            if num_tokens_from_string(acc) &gt;= need_tokens:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1433 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1434 | <code>        return acc</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1436 | <code>    # above</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1437 | <code>    parts_above = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1438 | <code>    while prev &gt;= 0 and remain_above &gt; 0:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1439 | <code>        if cks[prev]["ck_type"] == "text":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1440 | <code>            tk = cks[prev]["tk_nums"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1441 | <code>            if tk &gt;= remain_above:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1442 | <code>                piece = take_sentences_from_end(cks[prev]["text"], remain_above)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1443 | <code>                parts_above.insert(0, piece)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1444 | <code>                picked_above.append((prev, "tail", remain_above, tk, piece[:80]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1445 | <code>                remain_above = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1446 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1447 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1448 | <code>                parts_above.insert(0, cks[prev]["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1449 | <code>                picked_above.append((prev, "full", remain_above, tk, (cks[prev]["text"] or "")[:80]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1450 | <code>                remain_above -= tk</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1451 | <code>        prev -= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1453 | <code>    # below</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1454 | <code>    parts_below = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1455 | <code>    while after &lt; len(cks) and remain_below &gt; 0:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1456 | <code>        if cks[after]["ck_type"] == "text":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1457 | <code>            tk = cks[after]["tk_nums"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1458 | <code>            if tk &gt;= remain_below:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1459 | <code>                piece = take_sentences_from_start(cks[after]["text"], remain_below)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1460 | <code>                parts_below.append(piece)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1461 | <code>                picked_below.append((after, "head", remain_below, tk, piece[:80]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1462 | <code>                remain_below = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1463 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1464 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1465 | <code>                parts_below.append(cks[after]["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1466 | <code>                picked_below.append((after, "full", remain_below, tk, (cks[after]["text"] or "")[:80]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1467 | <code>                remain_below -= tk</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1468 | <code>        after += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1470 | <code>    cks[idx]["context_above"] = "".join(parts_above) if parts_above else ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1471 | <code>    cks[idx]["context_below"] = "".join(parts_below) if parts_below else ""</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1474 | <code>def _merge_cks(cks, chunk_token_num, has_custom):</code> | 定义 Python 函数 `_merge_cks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1475 | <code>    merged = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1476 | <code>    image_idxs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1477 | <code>    prev_text_ck = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1479 | <code>    for i in range(len(cks)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1480 | <code>        ck_type = cks[i]["ck_type"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1482 | <code>        if ck_type != "text":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1483 | <code>            merged.append(cks[i])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1484 | <code>            if ck_type == "image":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1485 | <code>                image_idxs.append(len(merged) - 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1486 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1488 | <code>        if prev_text_ck&lt;0 or merged[prev_text_ck]["tk_nums"] &gt;= chunk_token_num or has_custom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1489 | <code>            merged.append(cks[i])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1490 | <code>            prev_text_ck = len(merged) - 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1491 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1493 | <code>        merged[prev_text_ck]["text"] = (merged[prev_text_ck].get("text") or "") + (cks[i].get("text") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1494 | <code>        merged[prev_text_ck]["tk_nums"] = merged[prev_text_ck].get("tk_nums", 0) + cks[i].get("tk_nums", 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1496 | <code>    return merged, image_idxs</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1499 | <code>def naive_merge_docx(</code> | 定义 Python 函数 `naive_merge_docx`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1500 | <code>    sections,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1501 | <code>    chunk_token_num = 128,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1502 | <code>    delimiter="\n。；！？",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1503 | <code>    table_context_size=0,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1504 | <code>    image_context_size=0,):</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1506 | <code>    if not sections:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1507 | <code>        return [], []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1509 | <code>    cks, tables, images, has_custom = _build_cks(sections, delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1511 | <code>    if table_context_size &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1512 | <code>        for i in tables:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1513 | <code>            _add_context(cks, i, table_context_size)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1515 | <code>    if image_context_size &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1516 | <code>        for i in images:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1517 | <code>            _add_context(cks, i, image_context_size)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1519 | <code>    merged_cks, merged_image_idx = _merge_cks(cks, chunk_token_num, has_custom)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1521 | <code>    return merged_cks, merged_image_idx</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1524 | <code>def extract_between(text: str, start_tag: str, end_tag: str) -&gt; list[str]:</code> | 定义 Python 函数 `extract_between`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1525 | <code>    pattern = re.escape(start_tag) + r"(.*?)" + re.escape(end_tag)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1526 | <code>    return re.findall(pattern, text, flags=re.DOTALL)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1529 | <code>def get_delimiters(delimiters: str):</code> | 定义 Python 函数 `get_delimiters`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1530 | <code>    dels = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1531 | <code>    s = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1532 | <code>    for m in re.finditer(r"`([^`]+)`", delimiters, re.I):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1533 | <code>        f, t = m.span()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1534 | <code>        dels.append(m.group(1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1535 | <code>        dels.extend(list(delimiters[s: f]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1536 | <code>        s = t</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1537 | <code>    if s &lt; len(delimiters):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1538 | <code>        dels.extend(list(delimiters[s:]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1540 | <code>    dels.sort(key=lambda x: -len(x))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1541 | <code>    dels = [re.escape(d) for d in dels if d]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1542 | <code>    dels = [d for d in dels if d]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1543 | <code>    dels_pattern = "&#124;".join(dels)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1545 | <code>    return dels_pattern</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1548 | <code>class Node:</code> | 定义 Python 类 `Node`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1549 | <code>    def __init__(self, level, depth=-1, texts=None):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1550 | <code>        self.level = level</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1551 | <code>        self.depth = depth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1552 | <code>        self.texts = texts or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1553 | <code>        self.children = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1555 | <code>    def add_child(self, child_node):</code> | 定义 Python 函数 `add_child`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1556 | <code>        self.children.append(child_node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1558 | <code>    def get_children(self):</code> | 定义 Python 函数 `get_children`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1559 | <code>        return self.children</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1561 | <code>    def get_level(self):</code> | 定义 Python 函数 `get_level`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1562 | <code>        return self.level</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1564 | <code>    def get_texts(self):</code> | 定义 Python 函数 `get_texts`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1565 | <code>        return self.texts</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1567 | <code>    def set_texts(self, texts):</code> | 定义 Python 函数 `set_texts`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1568 | <code>        self.texts = texts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1569 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1570 | <code>    def add_text(self, text):</code> | 定义 Python 函数 `add_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1571 | <code>        self.texts.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1573 | <code>    def clear_text(self):</code> | 定义 Python 函数 `clear_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1574 | <code>        self.texts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1576 | <code>    def __repr__(self):</code> | 定义 Python 函数 `__repr__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1577 | <code>        return f"Node(level={self.level}, texts={self.texts}, children={len(self.children)})"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>    def build_tree(self, lines):</code> | 定义 Python 函数 `build_tree`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1580 | <code>        stack = [self]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1581 | <code>        for level, text in lines:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1582 | <code>            if self.depth != -1 and level &gt; self.depth:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1583 | <code>                # Beyond target depth: merge content into the current leaf instead of creating deeper nodes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1584 | <code>                stack[-1].add_text(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1585 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1587 | <code>            # Move up until we find the proper parent whose level is strictly smaller than current</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1588 | <code>            while len(stack) &gt; 1 and level &lt;= stack[-1].get_level():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1589 | <code>                stack.pop()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1591 | <code>            node = Node(level=level, texts=[text])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1592 | <code>            # Attach as child of current parent and descend</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1593 | <code>            stack[-1].add_child(node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1594 | <code>            stack.append(node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1596 | <code>        return self</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1598 | <code>    def get_tree(self):</code> | 定义 Python 函数 `get_tree`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1599 | <code>        tree_list = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1600 | <code>        self._dfs(self, tree_list, [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1601 | <code>        return tree_list</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1603 | <code>    def _dfs(self, node, tree_list, titles):</code> | 定义 Python 函数 `_dfs`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1604 | <code>        level = node.get_level()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1605 | <code>        texts = node.get_texts()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1606 | <code>        child = node.get_children()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1608 | <code>        if level == 0 and texts:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1609 | <code>            tree_list.append("\n".join(titles + texts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1611 | <code>        # Titles within configured depth are accumulated into the current path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1612 | <code>        if 1 &lt;= level &lt;= self.depth:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1613 | <code>            path_titles = titles + texts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1614 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1615 | <code>            path_titles = titles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1617 | <code>        # Body outside the depth limit becomes its own chunk under the current title path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1618 | <code>        if level &gt; self.depth and texts:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1619 | <code>            tree_list.append("\n".join(path_titles + texts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1621 | <code>        # A leaf title within depth emits its title path as a chunk (header-only section)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1622 | <code>        elif not child and (1 &lt;= level &lt;= self.depth):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1623 | <code>            tree_list.append("\n".join(path_titles))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1625 | <code>        # Recurse into children with the updated title path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1626 | <code>        for c in child:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1627 | <code>            self._dfs(c, tree_list, path_titles)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
