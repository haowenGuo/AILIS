# vendor/ragflow-lite/upstream/deepdoc__parser__pdf_parser.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：2079
- SHA-256：`079eeafd1b03b0a35def71221113a03090d522ec67fa153310de7f830ba52ceb`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/deepdoc__parser__pdf_parser.py)
- 依赖：`asyncio`、`logging`、`math`、`os`、`random`、`re`、`sys`、`threading`、`unicodedata`、`collections`、`copy`、`io`、`timeit`、`numpy`、`pdfplumber`、`xgboost`、`huggingface_hub`、`PIL`、`pypdf`、`sklearn.cluster`、`sklearn.metrics`、`common.constants`、`common.file_utils`、`deepdoc.vision`、`rag.nlp`、`rag.prompts.generator`、`deepdoc.parser.utils`、`common`、`common.misc_utils`、`rag.app.picture`
- 主要符号：`RAGFlowPdfParser`、`__init__`、`__char_width`、`__height`、`_x_dis`、`_y_dis`、`_match_proj`、`_updown_concat_features`、`sort_X_by_page`、`_has_color`、`_is_garbled_char`、`_is_garbled_text`、`_has_subset_font_prefix`、`_is_garbled_by_font_encoding`、`_evaluate_table_orientation`、`_table_transformer_job`、`gather`、`_ocr_rotated_tables`、`_table_region`、`_collect_table_boxes`、`_restore_boxes`、`_map_rotated_point`、`_insert_ocr_boxes`、`__ocr`、`_layouts_rec`、`_assign_column`、`_text_merge`、`end_with`、`start_with`、`_naive_vertical_merge`、`_final_reading_order_merge`、`_concat_downward`、`dfs`、`_filter_forpages`、`_merge_with_same_bullet`、`_extract_table_figure`、`x_overlapped`、`nearest`、`cropout`、`local_page_index`、`proj_match`、`_line_tag`、`__filterout_scraps`、`width`、`height`、`usefull`、`total_page_number`、`__images__`、`__img_ocr`、`__img_ocr_launcher`、`__ocr_preprocess`、`wrapper`、`__call__`、`parse_into_bboxes`、`_parse_loaded_window_into_bboxes`、`insert_table_figures`、`min_rectangle_distance`、`_offset_position_tag`、`_replace`、`_to_global_boxes`、`remove_tag`、`extract_positions`、`crop`、`get_position`、`PlainParser`、`VisionParser`

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
| 17 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 18 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 19 | <code>import math</code> | 导入 Python 依赖 `math`，供本模块调用其类型、函数或常量。 |
| 20 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 21 | <code>import random</code> | 导入 Python 依赖 `random`，供本模块调用其类型、函数或常量。 |
| 22 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 23 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 24 | <code>import threading</code> | 导入 Python 依赖 `threading`，供本模块调用其类型、函数或常量。 |
| 25 | <code>import unicodedata</code> | 导入 Python 依赖 `unicodedata`，供本模块调用其类型、函数或常量。 |
| 26 | <code>from collections import Counter, defaultdict</code> | 导入 Python 依赖 `collections`，供本模块调用其类型、函数或常量。 |
| 27 | <code>from copy import deepcopy</code> | 导入 Python 依赖 `copy`，供本模块调用其类型、函数或常量。 |
| 28 | <code>from io import BytesIO</code> | 导入 Python 依赖 `io`，供本模块调用其类型、函数或常量。 |
| 29 | <code>from timeit import default_timer as timer</code> | 导入 Python 依赖 `timeit`，供本模块调用其类型、函数或常量。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>import numpy as np</code> | 导入 Python 依赖 `numpy`，供本模块调用其类型、函数或常量。 |
| 32 | <code>import pdfplumber</code> | 导入 Python 依赖 `pdfplumber`，供本模块调用其类型、函数或常量。 |
| 33 | <code>import xgboost as xgb</code> | 导入 Python 依赖 `xgboost`，供本模块调用其类型、函数或常量。 |
| 34 | <code>from huggingface_hub import snapshot_download</code> | 导入 Python 依赖 `huggingface_hub`，供本模块调用其类型、函数或常量。 |
| 35 | <code>from PIL import Image</code> | 导入 Python 依赖 `PIL`，供本模块调用其类型、函数或常量。 |
| 36 | <code>from pypdf import PdfReader as pdf2_read</code> | 导入 Python 依赖 `pypdf`，供本模块调用其类型、函数或常量。 |
| 37 | <code>from sklearn.cluster import KMeans</code> | 导入 Python 依赖 `sklearn.cluster`，供本模块调用其类型、函数或常量。 |
| 38 | <code>from sklearn.metrics import silhouette_score</code> | 导入 Python 依赖 `sklearn.metrics`，供本模块调用其类型、函数或常量。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>from common.constants import MAXIMUM_PAGE_NUMBER</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 41 | <code>from common.file_utils import get_project_base_directory</code> | 导入 Python 依赖 `common.file_utils`，供本模块调用其类型、函数或常量。 |
| 42 | <code>from deepdoc.vision import OCR, AscendLayoutRecognizer, LayoutRecognizer, Recognizer, TableStructureRecognizer</code> | 导入 Python 依赖 `deepdoc.vision`，供本模块调用其类型、函数或常量。 |
| 43 | <code>from rag.nlp import rag_tokenizer</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 44 | <code>from rag.prompts.generator import vision_llm_describe_prompt</code> | 导入 Python 依赖 `rag.prompts.generator`，供本模块调用其类型、函数或常量。 |
| 45 | <code>from deepdoc.parser.utils import extract_pdf_outlines</code> | 导入 Python 依赖 `deepdoc.parser.utils`，供本模块调用其类型、函数或常量。 |
| 46 | <code>from common import settings</code> | 导入 Python 依赖 `common`，供本模块调用其类型、函数或常量。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>from common.misc_utils import thread_pool_exec</code> | 导入 Python 依赖 `common.misc_utils`，供本模块调用其类型、函数或常量。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>LOCK_KEY_pdfplumber = "global_shared_lock_pdfplumber"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 53 | <code>if LOCK_KEY_pdfplumber not in sys.modules:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 54 | <code>    sys.modules[LOCK_KEY_pdfplumber] = threading.Lock()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>class RAGFlowPdfParser:</code> | 定义 Python 类 `RAGFlowPdfParser`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 58 | <code>    def __init__(self, **kwargs):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 59 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 60 | <code>        If you have trouble downloading HuggingFace models, -_^ this might help!!</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>        For Linux:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 63 | <code>        export HF_ENDPOINT=https://hf-mirror.com</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>        For Windows:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 66 | <code>        Good luck</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 67 | <code>        ^_-</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>        self.ocr = OCR()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 72 | <code>        self.parallel_limiter = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 73 | <code>        if settings.PARALLEL_DEVICES &gt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 74 | <code>            self.parallel_limiter = [asyncio.Semaphore(1) for _ in range(settings.PARALLEL_DEVICES)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>        layout_recognizer_type = os.getenv("LAYOUT_RECOGNIZER_TYPE", "onnx").lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 77 | <code>        if layout_recognizer_type not in ["onnx", "ascend"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 78 | <code>            raise RuntimeError("Unsupported layout recognizer type.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>        if hasattr(self, "model_species"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 81 | <code>            recognizer_domain = "layout." + self.model_species</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 82 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 83 | <code>            recognizer_domain = "layout"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>        if layout_recognizer_type == "ascend":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 86 | <code>            logging.debug("Using Ascend LayoutRecognizer")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 87 | <code>            self.layouter = AscendLayoutRecognizer(recognizer_domain)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 88 | <code>        else:  # onnx</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 89 | <code>            logging.debug("Using Onnx LayoutRecognizer")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 90 | <code>            self.layouter = LayoutRecognizer(recognizer_domain)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 91 | <code>        self.tbl_det = TableStructureRecognizer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>        self.updown_cnt_mdl = xgb.Booster()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 94 | <code>        # xgboost model is very small; using CPU explicitly</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 95 | <code>        self.updown_cnt_mdl.set_param({"device": "cpu"})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 96 | <code>        logging.info("updown_cnt_mdl initialized on CPU")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 97 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 98 | <code>            model_dir = os.path.join(get_project_base_directory(), "rag/res/deepdoc")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>            self.updown_cnt_mdl.load_model(os.path.join(model_dir, "updown_concat_xgb.model"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 100 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 101 | <code>            model_dir = snapshot_download(repo_id="InfiniFlow/text_concat_xgb_v1.0", local_dir=os.path.join(get_project_base_directory(), "rag/res/deepdoc"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 102 | <code>            self.updown_cnt_mdl.load_model(os.path.join(model_dir, "updown_concat_xgb.model"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>        self.page_from = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 105 | <code>        self.column_num = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>    def __char_width(self, c):</code> | 定义 Python 函数 `__char_width`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>        return (c["x1"] - c["x0"]) // max(len(c["text"]), 1)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>    def __height(self, c):</code> | 定义 Python 函数 `__height`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 111 | <code>        return c["bottom"] - c["top"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>    def _x_dis(self, a, b):</code> | 定义 Python 函数 `_x_dis`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 114 | <code>        return min(abs(a["x1"] - b["x0"]), abs(a["x0"] - b["x1"]), abs(a["x0"] + a["x1"] - b["x0"] - b["x1"]) / 2)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    def _y_dis(self, a, b):</code> | 定义 Python 函数 `_y_dis`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 117 | <code>        return (b["top"] + b["bottom"] - a["top"] - a["bottom"]) / 2</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>    def _match_proj(self, b):</code> | 定义 Python 函数 `_match_proj`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 120 | <code>        proj_patt = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 121 | <code>            r"第[零一二三四五六七八九十百]+章",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 122 | <code>            r"第[零一二三四五六七八九十百]+[条节]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 123 | <code>            r"[零一二三四五六七八九十百]+[、是 　]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 124 | <code>            r"[\(（][零一二三四五六七八九十百]+[）\)]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 125 | <code>            r"[\(（][0-9]+[）\)]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 126 | <code>            r"[0-9]+(、&#124;\.[　 ]&#124;）&#124;\.[^0-9./a-zA-Z_%&gt;&lt;-]{4,})",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 127 | <code>            r"[0-9]+\.[0-9.]+(、&#124;\.[ 　])",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 128 | <code>            r"[⚫•➢①② ]",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 129 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>        return any([re.match(p, b["text"]) for p in proj_patt])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>    def _updown_concat_features(self, up, down):</code> | 定义 Python 函数 `_updown_concat_features`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 133 | <code>        w = max(self.__char_width(up), self.__char_width(down))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 134 | <code>        h = max(self.__height(up), self.__height(down))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 135 | <code>        y_dis = self._y_dis(up, down)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 136 | <code>        LEN = 6</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 137 | <code>        tks_down = rag_tokenizer.tokenize(down["text"][:LEN]).split()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 138 | <code>        tks_up = rag_tokenizer.tokenize(up["text"][-LEN:]).split()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 139 | <code>        tks_all = up["text"][-LEN:].strip() + (" " if re.match(r"[a-zA-Z0-9]+", up["text"][-1] + down["text"][0]) else "") + down["text"][:LEN].strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 140 | <code>        tks_all = rag_tokenizer.tokenize(tks_all).split()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 141 | <code>        fea = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 142 | <code>            up.get("R", -1) == down.get("R", -1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>            y_dis / h,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 144 | <code>            down["page_number"] - up["page_number"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 145 | <code>            up["layout_type"] == down["layout_type"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 146 | <code>            up["layout_type"] == "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 147 | <code>            down["layout_type"] == "text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 148 | <code>            up["layout_type"] == "table",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 149 | <code>            down["layout_type"] == "table",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 150 | <code>            True if re.search(r"([。？！；!?;+)）]&#124;[a-z]\.)$", up["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 151 | <code>            True if re.search(r"[，：‘“、0-9（+-]$", up["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 152 | <code>            True if re.search(r"(^.?[/,?;:\]，。；：’”？！》】）-])", down["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 153 | <code>            True if re.match(r"[\(（][^\(\)（）]+[）\)]$", up["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 154 | <code>            True if re.search(r"[，,][^。.]+$", up["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 155 | <code>            True if re.search(r"[，,][^。.]+$", up["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 156 | <code>            True if re.search(r"[\(（][^\)）]+$", up["text"]) and re.search(r"[\)）]", down["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 157 | <code>            self._match_proj(down),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 158 | <code>            True if re.match(r"[A-Z]", down["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 159 | <code>            True if re.match(r"[A-Z]", up["text"][-1]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>            True if re.match(r"[a-z0-9]", up["text"][-1]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>            True if re.match(r"[0-9.%,-]+$", down["text"]) else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 162 | <code>            up["text"].strip()[-2:] == down["text"].strip()[-2:] if len(up["text"].strip()) &gt; 1 and len(down["text"].strip()) &gt; 1 else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 163 | <code>            up["x0"] &gt; down["x1"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 164 | <code>            abs(self.__height(up) - self.__height(down)) / min(self.__height(up), self.__height(down)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 165 | <code>            self._x_dis(up, down) / max(w, 0.000001),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>            (len(up["text"]) - len(down["text"])) / max(len(up["text"]), len(down["text"])),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 167 | <code>            len(tks_all) - len(tks_up) - len(tks_down),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 168 | <code>            len(tks_down) - len(tks_up),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 169 | <code>            tks_down[-1] == tks_up[-1] if tks_down and tks_up else False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 170 | <code>            max(down["in_row"], up["in_row"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 171 | <code>            abs(down["in_row"] - up["in_row"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 172 | <code>            len(tks_down) == 1 and rag_tokenizer.tag(tks_down[0]).find("n") &gt;= 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 173 | <code>            len(tks_up) == 1 and rag_tokenizer.tag(tks_up[0]).find("n") &gt;= 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 174 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>        return fea</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 178 | <code>    def sort_X_by_page(arr, threshold):</code> | 定义 Python 函数 `sort_X_by_page`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 179 | <code>        # sort using y1 first and then x1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 180 | <code>        arr = sorted(arr, key=lambda r: (r["page_number"], r["x0"], r["top"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 181 | <code>        for i in range(len(arr) - 1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 182 | <code>            for j in range(i, -1, -1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 183 | <code>                # restore the order using th</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 184 | <code>                if abs(arr[j + 1]["x0"] - arr[j]["x0"]) &lt; threshold and arr[j + 1]["top"] &lt; arr[j]["top"] and arr[j + 1]["page_number"] == arr[j]["page_number"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 185 | <code>                    tmp = arr[j]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 186 | <code>                    arr[j] = arr[j + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 187 | <code>                    arr[j + 1] = tmp</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>        return arr</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>    def _has_color(self, o):</code> | 定义 Python 函数 `_has_color`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 191 | <code>        if o.get("ncs", "") == "DeviceGray":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 192 | <code>            if o["stroking_color"] and o["stroking_color"][0] == 1 and o["non_stroking_color"] and o["non_stroking_color"][0] == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 193 | <code>                if re.match(r"[a-zT_\[\]\(\)-]+", o.get("text", "")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 194 | <code>                    return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 195 | <code>        return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>    # CID pattern regex for unmapped font characters from pdfminer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 198 | <code>    _CID_PATTERN = re.compile(r"\(cid\s*:\s*\d+\s*\)")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 201 | <code>    def _is_garbled_char(ch):</code> | 定义 Python 函数 `_is_garbled_char`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 202 | <code>        """Check if a single character is garbled (unmappable from PDF font encoding).</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>        A character is considered garbled if it falls into Unicode Private Use Areas</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 205 | <code>        or certain replacement/control character ranges that typically indicate</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 206 | <code>        pdfminer failed to map a CID to a valid Unicode codepoint.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 207 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 208 | <code>        if not ch:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 209 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 210 | <code>        cp = ord(ch)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 211 | <code>        if 0xE000 &lt;= cp &lt;= 0xF8FF:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 212 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 213 | <code>        if 0xF0000 &lt;= cp &lt;= 0xFFFFF:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 214 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 215 | <code>        if 0x100000 &lt;= cp &lt;= 0x10FFFF:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 216 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 217 | <code>        if cp == 0xFFFD:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 218 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 219 | <code>        if cp &lt; 0x20 and ch not in ('\t', '\n', '\r'):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 220 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 221 | <code>        if 0x80 &lt;= cp &lt;= 0x9F:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 222 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 223 | <code>        cat = unicodedata.category(ch)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 224 | <code>        if cat in ("Cn", "Cs"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 225 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 226 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 229 | <code>    def _is_garbled_text(text, threshold=0.5):</code> | 定义 Python 函数 `_is_garbled_text`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 230 | <code>        """Check if a text string contains too many garbled characters.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>        Examines each character and determines if the overall proportion</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 233 | <code>        of garbled characters exceeds the given threshold. Also detects</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 234 | <code>        pdfminer's CID placeholder patterns like '(cid:123)'.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 235 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 236 | <code>        if not text or not text.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 237 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 238 | <code>        if RAGFlowPdfParser._CID_PATTERN.search(text):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 239 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 240 | <code>        garbled_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 241 | <code>        total = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 242 | <code>        for ch in text:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 243 | <code>            if ch.isspace():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 244 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 245 | <code>            total += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>            if RAGFlowPdfParser._is_garbled_char(ch):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 247 | <code>                garbled_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 248 | <code>        if total == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 249 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 250 | <code>        return garbled_count / total &gt;= threshold</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 253 | <code>    def _has_subset_font_prefix(fontname):</code> | 定义 Python 函数 `_has_subset_font_prefix`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 254 | <code>        """Check if a font name has a subset prefix (e.g. 'DY1+ZLQDm1-1').</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>        PDF subset fonts use a 6-letter uppercase tag followed by '+' before</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 257 | <code>        the actual font name. Some tools use shorter tags (e.g. 'DY1+').</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 258 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 259 | <code>        if not fontname:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 260 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 261 | <code>        return bool(re.match(r"^[A-Z0-9]{2,6}\+", fontname))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 264 | <code>    def _is_garbled_by_font_encoding(page_chars, min_chars=20):</code> | 定义 Python 函数 `_is_garbled_by_font_encoding`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 265 | <code>        """Detect garbled text caused by broken font encoding mappings.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>        Some PDFs (especially older Chinese standards) embed custom fonts that</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 268 | <code>        map CJK glyphs to ASCII codepoints. The extracted text appears as</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 269 | <code>        random ASCII punctuation/symbols instead of actual CJK characters.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>        Detection strategy: if a significant proportion of characters come from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 272 | <code>        subset-embedded fonts and the page produces overwhelmingly ASCII</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 273 | <code>        (punctuation, digits, symbols) with virtually no CJK/Hangul/Kana</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 274 | <code>        characters, the page is likely garbled due to broken font encoding.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 275 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 276 | <code>        if not page_chars or len(page_chars) &lt; min_chars:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 277 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>        subset_font_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 280 | <code>        total_non_space = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 281 | <code>        ascii_punct_sym = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 282 | <code>        cjk_like = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>        for c in page_chars:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 285 | <code>            text = c.get("text", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 286 | <code>            fontname = c.get("fontname", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 287 | <code>            if not text or text.isspace():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 288 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 289 | <code>            total_non_space += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>            if RAGFlowPdfParser._has_subset_font_prefix(fontname):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 292 | <code>                subset_font_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>            cp = ord(text[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 295 | <code>            if (0x2E80 &lt;= cp &lt;= 0x9FFF or 0xF900 &lt;= cp &lt;= 0xFAFF</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 296 | <code>                    or 0x20000 &lt;= cp &lt;= 0x2FA1F</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 297 | <code>                    or 0xAC00 &lt;= cp &lt;= 0xD7AF</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 298 | <code>                    or 0x3040 &lt;= cp &lt;= 0x30FF):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 299 | <code>                cjk_like += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 300 | <code>            elif (0x21 &lt;= cp &lt;= 0x2F or 0x3A &lt;= cp &lt;= 0x40</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 301 | <code>                    or 0x5B &lt;= cp &lt;= 0x60 or 0x7B &lt;= cp &lt;= 0x7E):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 302 | <code>                ascii_punct_sym += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>        if total_non_space &lt; min_chars:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 305 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>        subset_ratio = subset_font_count / total_non_space</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 308 | <code>        if subset_ratio &lt; 0.3:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 309 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>        cjk_ratio = cjk_like / total_non_space</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 312 | <code>        punct_ratio = ascii_punct_sym / total_non_space</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 313 | <code>        if cjk_ratio &lt; 0.05 and punct_ratio &gt; 0.4:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 314 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>    def _evaluate_table_orientation(self, table_img, sample_ratio=0.3):</code> | 定义 Python 函数 `_evaluate_table_orientation`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 319 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 320 | <code>        Evaluate the best rotation orientation for a table image.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>        Tests 4 rotation angles (0°, 90°, 180°, 270°) and uses OCR</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 323 | <code>        confidence scores to determine the best orientation.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>        Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 326 | <code>            table_img: PIL Image object of the table region</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 327 | <code>            sample_ratio: Sampling ratio for quick evaluation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>        Returns:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 330 | <code>            tuple: (best_angle, best_img, confidence_scores)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 331 | <code>                - best_angle: Best rotation angle (0, 90, 180, 270)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 332 | <code>                - best_img: Image rotated to best orientation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 333 | <code>                - confidence_scores: Dict of scores for each angle</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 334 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>        rotations = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 337 | <code>            (0, "original"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 338 | <code>            (90, "rotate_90"),  # clockwise 90°</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 339 | <code>            (180, "rotate_180"),  # 180°</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 340 | <code>            (270, "rotate_270"),  # clockwise 270° (counter-clockwise 90°)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 341 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>        results = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 344 | <code>        best_score = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 345 | <code>        best_angle = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 346 | <code>        best_img = table_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 347 | <code>        score_0 = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>        for angle, name in rotations:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 350 | <code>            # Rotate image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 351 | <code>            if angle == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 352 | <code>                rotated_img = table_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 353 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 354 | <code>                # PIL's rotate is counter-clockwise, use negative angle for clockwise</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 355 | <code>                rotated_img = table_img.rotate(-angle, expand=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>            # Convert to numpy array for OCR</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 358 | <code>            img_array = np.array(rotated_img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>            # Perform OCR detection and recognition</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 361 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 362 | <code>                ocr_results = self.ocr(img_array)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>                if ocr_results:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 365 | <code>                    # Calculate average confidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 366 | <code>                    scores = [conf for _, (_, conf) in ocr_results]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 367 | <code>                    avg_score = sum(scores) / len(scores) if scores else 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 368 | <code>                    total_regions = len(scores)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>                    # Combined score: considers both average confidence and number of regions</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 371 | <code>                    # More regions + higher confidence = better orientation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 372 | <code>                    combined_score = avg_score * (1 + 0.1 * min(total_regions, 50) / 50)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 373 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 374 | <code>                    avg_score = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 375 | <code>                    total_regions = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 376 | <code>                    combined_score = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 379 | <code>                logging.warning(f"OCR failed for angle {angle}: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 380 | <code>                avg_score = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 381 | <code>                total_regions = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 382 | <code>                combined_score = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>            results[angle] = {"avg_confidence": avg_score, "total_regions": total_regions, "combined_score": combined_score}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 385 | <code>            if angle == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 386 | <code>                score_0 = combined_score</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>            logging.debug(f"Table orientation {angle}°: avg_conf={avg_score:.4f}, regions={total_regions}, combined={combined_score:.4f}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 390 | <code>            if combined_score &gt; best_score:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 391 | <code>                best_score = combined_score</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 392 | <code>                best_angle = angle</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 393 | <code>                best_img = rotated_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>        # Absolute threshold rule:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 396 | <code>        # Only choose non-0° if it exceeds 0° by more than 0.2 and 0° score is below 0.8.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 397 | <code>        if best_angle != 0 and score_0 is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 398 | <code>            if not (best_score - score_0 &gt; 0.2 and score_0 &lt; 0.8):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 399 | <code>                best_angle = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 400 | <code>                best_img = table_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 401 | <code>                best_score = score_0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>        results[best_angle] = results.get(best_angle, {"avg_confidence": 0, "total_regions": 0, "combined_score": 0})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>        logging.info(f"Best table orientation: {best_angle}° (score={best_score:.4f})")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>        return best_angle, best_img, results</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>    def _table_transformer_job(self, ZM, auto_rotate=True):</code> | 定义 Python 函数 `_table_transformer_job`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 410 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 411 | <code>        Process table structure recognition.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>        When auto_rotate=True, the complete workflow:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 414 | <code>        1. Evaluate table orientation and select the best rotation angle</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 415 | <code>        2. Use rotated image for table structure recognition (TSR)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 416 | <code>        3. Re-OCR the rotated image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 417 | <code>        4. Match new OCR results with TSR cell coordinates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>        Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 420 | <code>            ZM: Zoom factor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 421 | <code>            auto_rotate: Whether to enable auto orientation correction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 422 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 423 | <code>        logging.debug("Table processing...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 424 | <code>        imgs, pos = [], []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 425 | <code>        tbcnt = [0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 426 | <code>        MARGIN = 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 427 | <code>        self.tb_cpns = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 428 | <code>        self.table_rotations = {}  # Store rotation info for each table</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 429 | <code>        self.rotated_table_imgs = {}  # Store rotated table images</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>        assert len(self.page_layout) == len(self.page_images)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>        # Collect layout info for all tables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 434 | <code>        table_layouts = []  # [(page, table_layout, left, top, right, bott), ...]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>        table_index = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 437 | <code>        for p, tbls in enumerate(self.page_layout):  # for page</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 438 | <code>            tbls = [f for f in tbls if f["type"] == "table"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 439 | <code>            tbcnt.append(len(tbls))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 440 | <code>            if not tbls:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 441 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 442 | <code>            for tb in tbls:  # for table</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 443 | <code>                left, top, right, bott = tb["x0"] - MARGIN, tb["top"] - MARGIN, tb["x1"] + MARGIN, tb["bottom"] + MARGIN</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 444 | <code>                left *= ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 445 | <code>                top *= ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 446 | <code>                right *= ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 447 | <code>                bott *= ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 448 | <code>                pos.append((left, top, p, table_index))  # Add page and table_index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>                # Record table layout info</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 451 | <code>                table_layouts.append({"page": p, "table_index": table_index, "layout": tb, "coords": (left, top, right, bott)})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>                # Crop table image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 454 | <code>                table_img = self.page_images[p].crop((left, top, right, bott))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>                if auto_rotate:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 457 | <code>                    # Evaluate table orientation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 458 | <code>                    logging.debug(f"Evaluating orientation for table {table_index} on page {p}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 459 | <code>                    best_angle, rotated_img, rotation_scores = self._evaluate_table_orientation(table_img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>                    # Store rotation info</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 462 | <code>                    self.table_rotations[table_index] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 463 | <code>                        "page": p,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 464 | <code>                        "original_pos": (left, top, right, bott),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 465 | <code>                        "best_angle": best_angle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 466 | <code>                        "scores": rotation_scores,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 467 | <code>                        "rotated_size": rotated_img.size,  # (width, height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 468 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 470 | <code>                    # Store the rotated image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 471 | <code>                    self.rotated_table_imgs[table_index] = rotated_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 472 | <code>                    imgs.append(rotated_img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 475 | <code>                    imgs.append(table_img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 476 | <code>                    self.table_rotations[table_index] = {"page": p, "original_pos": (left, top, right, bott), "best_angle": 0, "scores": {}, "rotated_size": table_img.size}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 477 | <code>                    self.rotated_table_imgs[table_index] = table_img</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>                table_index += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>        assert len(self.page_images) == len(tbcnt) - 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 482 | <code>        if not imgs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 483 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>        # Perform table structure recognition (TSR)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 486 | <code>        recos = self.tbl_det(imgs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>        # If tables were rotated, re-OCR the rotated images and replace table boxes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 489 | <code>        if auto_rotate:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 490 | <code>            self._ocr_rotated_tables(ZM, table_layouts, recos, tbcnt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>        # Process TSR results (keep original logic but handle rotated coordinates)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 493 | <code>        tbcnt = np.cumsum(tbcnt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 494 | <code>        for i in range(len(tbcnt) - 1):  # for page</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 495 | <code>            pg = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 496 | <code>            for j, tb_items in enumerate(recos[tbcnt[i] : tbcnt[i + 1]]):  # for table</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 497 | <code>                poss = pos[tbcnt[i] : tbcnt[i + 1]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 498 | <code>                for it in tb_items:  # for table components</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 499 | <code>                    # TSR coordinates are relative to rotated image, need to record</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 500 | <code>                    it["x0_rotated"] = it["x0"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 501 | <code>                    it["x1_rotated"] = it["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 502 | <code>                    it["top_rotated"] = it["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 503 | <code>                    it["bottom_rotated"] = it["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>                    # For rotated tables, coordinate transformation to page space requires rotation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 506 | <code>                    # Since we already re-OCR'd on rotated image, keep simple processing here</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 507 | <code>                    it["pn"] = poss[j][2]  # page number</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 508 | <code>                    it["layoutno"] = j</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 509 | <code>                    it["table_index"] = poss[j][3]  # table index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 510 | <code>                    pg.append(it)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 511 | <code>            self.tb_cpns.extend(pg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 513 | <code>        def gather(kwd, fzy=10, ption=0.6):</code> | 定义 Python 函数 `gather`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 514 | <code>            eles = Recognizer.sort_Y_firstly([r for r in self.tb_cpns if re.match(kwd, r["label"])], fzy)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 515 | <code>            eles = Recognizer.layouts_cleanup(self.boxes, eles, 5, ption)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 516 | <code>            return Recognizer.sort_Y_firstly(eles, 0)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>        # add R,H,C,SP tag to boxes within table layout</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 519 | <code>        headers = gather(r".*header$")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 520 | <code>        rows = gather(r".* (row&#124;header)")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 521 | <code>        spans = gather(r".*spanning")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 522 | <code>        clmns = sorted([r for r in self.tb_cpns if re.match(r"table column$", r["label"])], key=lambda x: (x["pn"], x["layoutno"], x["x0_rotated"] if "x0_rotated" in x else x["x0"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 523 | <code>        clmns = Recognizer.layouts_cleanup(self.boxes, clmns, 5, 0.5)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>        for b in self.boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 526 | <code>            if b.get("layout_type", "") != "table":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 527 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 528 | <code>            ii = Recognizer.find_overlapped_with_threshold(b, rows, thr=0.3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 529 | <code>            if ii is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 530 | <code>                b["R"] = ii</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 531 | <code>                b["R_top"] = rows[ii]["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 532 | <code>                b["R_bott"] = rows[ii]["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 534 | <code>            ii = Recognizer.find_overlapped_with_threshold(b, headers, thr=0.3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 535 | <code>            if ii is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 536 | <code>                b["H_top"] = headers[ii]["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 537 | <code>                b["H_bott"] = headers[ii]["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 538 | <code>                b["H_left"] = headers[ii]["x0"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 539 | <code>                b["H_right"] = headers[ii]["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 540 | <code>                b["H"] = ii</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 542 | <code>            ii = Recognizer.find_horizontally_tightest_fit(b, clmns)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 543 | <code>            if ii is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 544 | <code>                b["C"] = ii</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 545 | <code>                b["C_left"] = clmns[ii]["x0"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 546 | <code>                b["C_right"] = clmns[ii]["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>            ii = Recognizer.find_overlapped_with_threshold(b, spans, thr=0.3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 549 | <code>            if ii is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 550 | <code>                b["H_top"] = spans[ii]["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 551 | <code>                b["H_bott"] = spans[ii]["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 552 | <code>                b["H_left"] = spans[ii]["x0"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 553 | <code>                b["H_right"] = spans[ii]["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 554 | <code>                b["SP"] = ii</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>    def _ocr_rotated_tables(self, ZM, table_layouts, tsr_results, tbcnt):</code> | 定义 Python 函数 `_ocr_rotated_tables`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 557 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 558 | <code>        Re-OCR rotated table images and update self.boxes.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>        Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 561 | <code>            ZM: Zoom factor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 562 | <code>            table_layouts: List of table layout info</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 563 | <code>            tsr_results: TSR recognition results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 564 | <code>            tbcnt: Cumulative table count per page</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 565 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 566 | <code>        tbcnt = np.cumsum(tbcnt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>        def _table_region(layout, page_index):</code> | 定义 Python 函数 `_table_region`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 569 | <code>            table_x0 = layout["x0"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 570 | <code>            table_top = layout["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 571 | <code>            table_x1 = layout["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 572 | <code>            table_bottom = layout["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 573 | <code>            table_top_cum = table_top + self.page_cum_height[page_index]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 574 | <code>            table_bottom_cum = table_bottom + self.page_cum_height[page_index]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 575 | <code>            return table_x0, table_top, table_x1, table_bottom, table_top_cum, table_bottom_cum</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 577 | <code>        def _collect_table_boxes(page_index, table_x0, table_x1, table_top_cum, table_bottom_cum):</code> | 定义 Python 函数 `_collect_table_boxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 578 | <code>            indices = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 579 | <code>                i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 580 | <code>                for i, b in enumerate(self.boxes)</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 581 | <code>                if (</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 582 | <code>                    b.get("page_number") == page_index + self.page_from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 583 | <code>                    and b.get("layout_type") == "table"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 584 | <code>                    and b["x0"] &gt;= table_x0 - 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 585 | <code>                    and b["x1"] &lt;= table_x1 + 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 586 | <code>                    and b["top"] &gt;= table_top_cum - 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 587 | <code>                    and b["bottom"] &lt;= table_bottom_cum + 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 588 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 589 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>            original_boxes = [self.boxes[i] for i in indices]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 591 | <code>            insert_at = indices[0] if indices else len(self.boxes)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 592 | <code>            for i in reversed(indices):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 593 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 594 | <code>            return original_boxes, insert_at</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>        def _restore_boxes(original_boxes, insert_at):</code> | 定义 Python 函数 `_restore_boxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 597 | <code>            for b in original_boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 598 | <code>                self.boxes.insert(insert_at, b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 599 | <code>                insert_at += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 600 | <code>            return insert_at</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>        def _map_rotated_point(x, y, angle, width, height):</code> | 定义 Python 函数 `_map_rotated_point`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 603 | <code>            # Map a point from rotated image coords back to original image coords.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 604 | <code>            if angle == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 605 | <code>                return x, y</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 606 | <code>            if angle == 90:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 607 | <code>                # clockwise 90: original-&gt;rotated (x', y') = (y, width - x)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 608 | <code>                # inverse:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 609 | <code>                return width - y, x</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 610 | <code>            if angle == 180:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 611 | <code>                return width - x, height - y</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 612 | <code>            if angle == 270:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 613 | <code>                # clockwise 270: original-&gt;rotated (x', y') = (height - y, x)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 614 | <code>                # inverse:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 615 | <code>                return y, height - x</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 616 | <code>            return x, y</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>        def _insert_ocr_boxes(ocr_results, page_index, table_x0, table_top, insert_at, table_index, best_angle, table_w_px, table_h_px):</code> | 定义 Python 函数 `_insert_ocr_boxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 619 | <code>            added = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 620 | <code>            for bbox, (text, conf) in ocr_results:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 621 | <code>                if conf &lt; 0.5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 622 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 623 | <code>                mapped = [_map_rotated_point(p[0], p[1], best_angle, table_w_px, table_h_px) for p in bbox]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 624 | <code>                x_coords = [p[0] for p in mapped]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 625 | <code>                y_coords = [p[1] for p in mapped]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 626 | <code>                box_x0 = min(x_coords) / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 627 | <code>                box_x1 = max(x_coords) / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 628 | <code>                box_top = min(y_coords) / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 629 | <code>                box_bottom = max(y_coords) / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 630 | <code>                new_box = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 631 | <code>                    "text": text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 632 | <code>                    "x0": box_x0 + table_x0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 633 | <code>                    "x1": box_x1 + table_x0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 634 | <code>                    "top": box_top + table_top + self.page_cum_height[page_index],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 635 | <code>                    "bottom": box_bottom + table_top + self.page_cum_height[page_index],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 636 | <code>                    "page_number": page_index + self.page_from,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 637 | <code>                    "layout_type": "table",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 638 | <code>                    "layoutno": f"table-{table_index}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 639 | <code>                    "_rotated": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 640 | <code>                    "_rotation_angle": best_angle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 641 | <code>                    "_table_index": table_index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 642 | <code>                    "_rotated_x0": box_x0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 643 | <code>                    "_rotated_x1": box_x1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 644 | <code>                    "_rotated_top": box_top,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 645 | <code>                    "_rotated_bottom": box_bottom,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 646 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>                self.boxes.insert(insert_at, new_box)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 648 | <code>                insert_at += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 649 | <code>                added += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 650 | <code>            return added</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>        for tbl_info in table_layouts:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 653 | <code>            table_index = tbl_info["table_index"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 654 | <code>            page = tbl_info["page"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 655 | <code>            layout = tbl_info["layout"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 656 | <code>            left, top, right, bott = tbl_info["coords"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>            rotation_info = self.table_rotations.get(table_index, {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 659 | <code>            best_angle = rotation_info.get("best_angle", 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 661 | <code>            # Get the rotated table image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 662 | <code>            rotated_img = self.rotated_table_imgs.get(table_index)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 663 | <code>            if rotated_img is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 664 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 666 | <code>            # If no rotation, keep original OCR boxes untouched.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 667 | <code>            if best_angle == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 668 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>            # Table region is defined by layout's x0, top, x1, bottom (page-local coords)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 671 | <code>            table_x0, table_top, table_x1, table_bottom, table_top_cum, table_bottom_cum = _table_region(layout, page)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 672 | <code>            original_boxes, insert_at = _collect_table_boxes(page, table_x0, table_x1, table_top_cum, table_bottom_cum)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>            logging.info(f"Re-OCR table {table_index} on page {page} with rotation {best_angle}°")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 676 | <code>            # Perform OCR on rotated image</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 677 | <code>            img_array = np.array(rotated_img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 678 | <code>            ocr_results = self.ocr(img_array)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>            if not ocr_results:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 681 | <code>                logging.warning(f"No OCR results for rotated table {table_index}, restoring originals")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 682 | <code>                _restore_boxes(original_boxes, insert_at)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 683 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>            # Add new OCR results to self.boxes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 686 | <code>            # OCR coordinates are relative to rotated image, map back to original table coords</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 687 | <code>            table_w_px = right - left</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 688 | <code>            table_h_px = bott - top</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 689 | <code>            added = _insert_ocr_boxes(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 690 | <code>                ocr_results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 691 | <code>                page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 692 | <code>                table_x0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 693 | <code>                table_top,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 694 | <code>                insert_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 695 | <code>                table_index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 696 | <code>                best_angle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 697 | <code>                table_w_px,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 698 | <code>                table_h_px,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 699 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 701 | <code>            logging.info(f"Added {added} OCR results from rotated table {table_index}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 703 | <code>    def __ocr(self, pagenum, img, chars, ZM=3, device_id: int &#124; None = None):</code> | 定义 Python 函数 `__ocr`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 704 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 705 | <code>        bxs = self.ocr.detect(np.array(img), device_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 706 | <code>        logging.info(f"__ocr detecting boxes of an image cost ({timer() - start}s)")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 709 | <code>        if not bxs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 710 | <code>            self.boxes.append([])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 711 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 712 | <code>        bxs = [(line[0], line[1][0]) for line in bxs]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 713 | <code>        bxs = Recognizer.sort_Y_firstly(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 714 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 715 | <code>                {"x0": b[0][0] / ZM, "x1": b[1][0] / ZM, "top": b[0][1] / ZM, "text": "", "txt": t, "bottom": b[-1][1] / ZM, "chars": [], "page_number": pagenum}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 716 | <code>                for b, t in bxs</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 717 | <code>                if b[0][0] &lt;= b[1][0] and b[0][1] &lt;= b[-1][1]</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 718 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>            self.mean_height[pagenum - 1] / 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 720 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>        # merge chars in the same rect</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 723 | <code>        for c in chars:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 724 | <code>            ii = Recognizer.find_overlapped(c, bxs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 725 | <code>            if ii is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 726 | <code>                self.lefted_chars.append(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 727 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 728 | <code>            ch = c["bottom"] - c["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 729 | <code>            bh = bxs[ii]["bottom"] - bxs[ii]["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 730 | <code>            if abs(ch - bh) / max(ch, bh) &gt;= 0.7 and c["text"] != " ":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 731 | <code>                self.lefted_chars.append(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 732 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 733 | <code>            bxs[ii]["chars"].append(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>        for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 736 | <code>            if not b["chars"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 737 | <code>                del b["chars"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 738 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 739 | <code>            box_chars = b["chars"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 740 | <code>            m_ht = np.mean([c["height"] for c in box_chars])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 741 | <code>            garbled_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 742 | <code>            total_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 743 | <code>            for c in Recognizer.sort_Y_firstly(box_chars, m_ht):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 744 | <code>                if c["text"] == " " and b["text"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 745 | <code>                    if re.match(r"[0-9a-zA-Zа-яА-Я,.?;:!%%]", b["text"][-1]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 746 | <code>                        b["text"] += " "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 747 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 748 | <code>                    b["text"] += c["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 749 | <code>                    for ch in c["text"]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 750 | <code>                        if not ch.isspace():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 751 | <code>                            total_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 752 | <code>                            if self._is_garbled_char(ch):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 753 | <code>                                garbled_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 754 | <code>            del b["chars"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 755 | <code>            # If the majority of characters from pdfplumber are garbled,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 756 | <code>            # clear the text so OCR recognition will be used as fallback.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 757 | <code>            # Strategy 1: PUA / unmapped CID characters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 758 | <code>            if total_count &gt; 0 and garbled_count / total_count &gt;= 0.5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 759 | <code>                logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 760 | <code>                    "Page %d: detected garbled pdfplumber text (garbled=%d/%d), falling back to OCR for box at (%.1f, %.1f)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 761 | <code>                    pagenum, garbled_count, total_count, b["x0"], b["top"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 762 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>                b["text"] = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 764 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 765 | <code>            # Strategy 2: font-encoding garbling — all chars are ASCII</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 766 | <code>            # punctuation from subset fonts (no CJK output)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 767 | <code>            if total_count &gt; 0 and self._is_garbled_by_font_encoding(box_chars, min_chars=5):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 768 | <code>                logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 769 | <code>                    "Page %d: detected font-encoding garbled text (%d chars), falling back to OCR for box at (%.1f, %.1f)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 770 | <code>                    pagenum, total_count, b["x0"], b["top"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 771 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 772 | <code>                b["text"] = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>        logging.info(f"__ocr sorting {len(chars)} chars cost {timer() - start}s")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 775 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 776 | <code>        boxes_to_reg = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 777 | <code>        img_np = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 778 | <code>        for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 779 | <code>            if not b["text"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 780 | <code>                if img_np is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 781 | <code>                    img_np = np.asarray(img)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 782 | <code>                left, right, top, bott = b["x0"] * ZM, b["x1"] * ZM, b["top"] * ZM, b["bottom"] * ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 783 | <code>                b["box_image"] = self.ocr.get_rotate_crop_image(img_np, np.array([[left, top], [right, top], [right, bott], [left, bott]], dtype=np.float32))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 784 | <code>                boxes_to_reg.append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 785 | <code>            del b["txt"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 786 | <code>        texts = self.ocr.recognize_batch([b["box_image"] for b in boxes_to_reg], device_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 787 | <code>        for i in range(len(boxes_to_reg)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 788 | <code>            boxes_to_reg[i]["text"] = texts[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 789 | <code>            del boxes_to_reg[i]["box_image"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 790 | <code>        logging.info(f"__ocr recognize {len(bxs)} boxes cost {timer() - start}s")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 791 | <code>        bxs = [b for b in bxs if b["text"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 792 | <code>        if self.mean_height[pagenum - 1] == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 793 | <code>            self.mean_height[pagenum - 1] = np.median([b["bottom"] - b["top"] for b in bxs])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 794 | <code>        self.boxes.append(bxs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>    def _layouts_rec(self, ZM, drop=True):</code> | 定义 Python 函数 `_layouts_rec`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 797 | <code>        assert len(self.page_images) == len(self.boxes)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 798 | <code>        self.boxes, self.page_layout = self.layouter(self.page_images, self.boxes, ZM, drop=drop)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 799 | <code>        # cumlative Y</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 800 | <code>        for i in range(len(self.boxes)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 801 | <code>            self.boxes[i]["top"] += self.page_cum_height[self.boxes[i]["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 802 | <code>            self.boxes[i]["bottom"] += self.page_cum_height[self.boxes[i]["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>    def _assign_column(self, boxes, zoomin=3):</code> | 定义 Python 函数 `_assign_column`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 805 | <code>        if not boxes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 806 | <code>            return boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 807 | <code>        if all("col_id" in b for b in boxes):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 808 | <code>            return boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>        by_page = defaultdict(list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 811 | <code>        for b in boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 812 | <code>            by_page[b["page_number"]].append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>        page_cols = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 816 | <code>        for pg, bxs in by_page.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 817 | <code>            if not bxs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 818 | <code>                page_cols[pg] = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 819 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>            x0s_raw = np.array([b["x0"] for b in bxs], dtype=float)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>            min_x0 = np.min(x0s_raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 824 | <code>            max_x1 = np.max([b["x1"] for b in bxs])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 825 | <code>            width = max_x1 - min_x0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 827 | <code>            INDENT_TOL = width * 0.12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 828 | <code>            x0s = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 829 | <code>            for x in x0s_raw:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 830 | <code>                if abs(x - min_x0) &lt; INDENT_TOL:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 831 | <code>                    x0s.append([min_x0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 832 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 833 | <code>                    x0s.append([x])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 834 | <code>            x0s = np.array(x0s, dtype=float)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 836 | <code>            max_try = min(4, len(bxs))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 837 | <code>            if max_try &lt; 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 838 | <code>                max_try = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 839 | <code>            best_k = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 840 | <code>            best_score = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>            for k in range(1, max_try + 1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 843 | <code>                km = KMeans(n_clusters=k, n_init="auto")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 844 | <code>                labels = km.fit_predict(x0s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 846 | <code>                centers = np.sort(km.cluster_centers_.flatten())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 847 | <code>                if len(centers) &gt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 848 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 849 | <code>                        score = silhouette_score(x0s, labels)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 850 | <code>                    except ValueError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 851 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 852 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 853 | <code>                    score = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 854 | <code>                if score &gt; best_score:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 855 | <code>                    best_score = score</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 856 | <code>                    best_k = k</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 857 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 858 | <code>            page_cols[pg] = best_k</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 859 | <code>            logging.info(f"[Page {pg}] best_score={best_score:.2f}, best_k={best_k}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>        global_cols = Counter(page_cols.values()).most_common(1)[0][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 862 | <code>        logging.info(f"Global column_num decided by majority: {global_cols}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 863 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 864 | <code>        for pg, bxs in by_page.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 865 | <code>            if not bxs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 866 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 867 | <code>            k = page_cols[pg]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 868 | <code>            if len(bxs) &lt; k:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 869 | <code>                k = 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 870 | <code>            x0s = np.array([[b["x0"]] for b in bxs], dtype=float)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 871 | <code>            km = KMeans(n_clusters=k, n_init="auto")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 872 | <code>            labels = km.fit_predict(x0s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>            centers = km.cluster_centers_.flatten()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 875 | <code>            order = np.argsort(centers)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 876 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 877 | <code>            remap = {orig: new for new, orig in enumerate(order)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 879 | <code>            for b, lb in zip(bxs, labels):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 880 | <code>                b["col_id"] = remap[lb]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 881 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 882 | <code>            grouped = defaultdict(list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 883 | <code>            for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 884 | <code>                grouped[b["col_id"]].append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 885 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 886 | <code>        return boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>    def _text_merge(self, zoomin=3):</code> | 定义 Python 函数 `_text_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 889 | <code>        # merge adjusted boxes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 890 | <code>        bxs = self._assign_column(self.boxes, zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>        def end_with(b, txt):</code> | 定义 Python 函数 `end_with`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 893 | <code>            txt = txt.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 894 | <code>            tt = b.get("text", "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 895 | <code>            return tt and tt.find(txt) == len(tt) - len(txt)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 897 | <code>        def start_with(b, txts):</code> | 定义 Python 函数 `start_with`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 898 | <code>            tt = b.get("text", "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 899 | <code>            return tt and any([tt.find(t.strip()) == 0 for t in txts])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>        # horizontally merge adjacent box with the same layout</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 902 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 903 | <code>        while i &lt; len(bxs) - 1:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 904 | <code>            b = bxs[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 905 | <code>            b_ = bxs[i + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>            if b["page_number"] != b_["page_number"] or b.get("col_id") != b_.get("col_id"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 908 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 909 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>            if b.get("layoutno", "0") != b_.get("layoutno", "1") or b.get("layout_type", "") in ["table", "figure", "equation"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 912 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 913 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>            if abs(self._y_dis(b, b_)) &lt; self.mean_height[bxs[i]["page_number"] - 1] / 3:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 916 | <code>                # merge</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 917 | <code>                bxs[i]["x1"] = b_["x1"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 918 | <code>                bxs[i]["top"] = (b["top"] + b_["top"]) / 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 919 | <code>                bxs[i]["bottom"] = (b["bottom"] + b_["bottom"]) / 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 920 | <code>                bxs[i]["text"] += b_["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 921 | <code>                bxs.pop(i + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 922 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 923 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 924 | <code>        self.boxes = bxs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>    def _naive_vertical_merge(self, zoomin=3):</code> | 定义 Python 函数 `_naive_vertical_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 927 | <code>        # bxs = self._assign_column(self.boxes, zoomin)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 928 | <code>        bxs = self.boxes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>        grouped = defaultdict(list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 931 | <code>        for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 932 | <code>            # grouped[(b["page_number"], b.get("col_id", 0))].append(b)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 933 | <code>            grouped[(b["page_number"], "x")].append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>        merged_boxes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 936 | <code>        for (pg, col), bxs in grouped.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 937 | <code>            bxs = sorted(bxs, key=lambda x: (x["top"], x["x0"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 938 | <code>            if not bxs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 939 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 940 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 941 | <code>            mh = self.mean_height[pg - 1] if self.mean_height else np.median([b["bottom"] - b["top"] for b in bxs]) or 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>            i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 944 | <code>            while i + 1 &lt; len(bxs):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 945 | <code>                b = bxs[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 946 | <code>                b_ = bxs[i + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 947 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 948 | <code>                if b["page_number"] &lt; b_["page_number"] and re.match(r"[0-9  •一—-]+$", b["text"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 949 | <code>                    bxs.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 950 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 952 | <code>                if not b["text"].strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 953 | <code>                    bxs.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 954 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 956 | <code>                if not b["text"].strip() or b.get("layoutno") != b_.get("layoutno"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 957 | <code>                    i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 958 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 959 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 960 | <code>                if b_["top"] - b["bottom"] &gt; mh * 1.5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 961 | <code>                    i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 962 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>                overlap = max(0, min(b["x1"], b_["x1"]) - max(b["x0"], b_["x0"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 965 | <code>                if overlap / max(1, min(b["x1"] - b["x0"], b_["x1"] - b_["x0"])) &lt; 0.3:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 966 | <code>                    i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 967 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 968 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 969 | <code>                concatting_feats = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 970 | <code>                    b["text"].strip()[-1] in ",;:'\"，、‘“；：-",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 971 | <code>                    len(b["text"].strip()) &gt; 1 and b["text"].strip()[-2] in ",;:'\"，‘“、；：",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 972 | <code>                    b_["text"].strip() and b_["text"].strip()[0] in "。；？！?”）),，、：",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 973 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 974 | <code>                # features for not concating</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 975 | <code>                feats = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 976 | <code>                    b.get("layoutno", 0) != b_.get("layoutno", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 977 | <code>                    b["text"].strip()[-1] in "。？！?",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 978 | <code>                    self.is_english and b["text"].strip()[-1] in ".!?",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 979 | <code>                    b["page_number"] == b_["page_number"] and b_["top"] - b["bottom"] &gt; self.mean_height[b["page_number"] - 1] * 1.5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 980 | <code>                    b["page_number"] &lt; b_["page_number"] and abs(b["x0"] - b_["x0"]) &gt; self.mean_width[b["page_number"] - 1] * 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 981 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 982 | <code>                # split features</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 983 | <code>                detach_feats = [b["x1"] &lt; b_["x0"], b["x0"] &gt; b_["x1"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 984 | <code>                if (any(feats) and not any(concatting_feats)) or any(detach_feats):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 985 | <code>                    logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 986 | <code>                        "{} {} {} {}".format(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 987 | <code>                            b["text"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 988 | <code>                            b_["text"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 989 | <code>                            any(feats),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 990 | <code>                            any(concatting_feats),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 991 | <code>                        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 993 | <code>                    i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 994 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 995 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 996 | <code>                b["text"] = (b["text"].rstrip() + " " + b_["text"].lstrip()).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 997 | <code>                b["bottom"] = b_["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 998 | <code>                b["x0"] = min(b["x0"], b_["x0"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 999 | <code>                b["x1"] = max(b["x1"], b_["x1"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1000 | <code>                bxs.pop(i + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1001 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1002 | <code>            merged_boxes.extend(bxs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1003 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1004 | <code>        # self.boxes = sorted(merged_boxes, key=lambda x: (x["page_number"], x.get("col_id", 0), x["top"]))</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1005 | <code>        self.boxes = merged_boxes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1007 | <code>    def _final_reading_order_merge(self, zoomin=3):</code> | 定义 Python 函数 `_final_reading_order_merge`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1008 | <code>        if not self.boxes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1009 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1010 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1011 | <code>        self.boxes = self._assign_column(self.boxes, zoomin=zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1013 | <code>        pages = defaultdict(lambda: defaultdict(list))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1014 | <code>        for b in self.boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1015 | <code>            pg = b["page_number"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1016 | <code>            col = b.get("col_id", 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1017 | <code>            pages[pg][col].append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>        for pg in pages:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1020 | <code>            for col in pages[pg]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1021 | <code>                pages[pg][col].sort(key=lambda x: (x["top"], x["x0"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1023 | <code>        new_boxes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1024 | <code>        for pg in sorted(pages.keys()):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1025 | <code>            for col in sorted(pages[pg].keys()):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1026 | <code>                new_boxes.extend(pages[pg][col])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1028 | <code>        self.boxes = new_boxes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1029 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1030 | <code>    def _concat_downward(self, concat_between_pages=True):</code> | 定义 Python 函数 `_concat_downward`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1031 | <code>        self.boxes = Recognizer.sort_Y_firstly(self.boxes, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1032 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1033 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1034 | <code>        # count boxes in the same row as a feature</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1035 | <code>        for i in range(len(self.boxes)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1036 | <code>            mh = self.mean_height[self.boxes[i]["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1037 | <code>            self.boxes[i]["in_row"] = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1038 | <code>            j = max(0, i - 12)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1039 | <code>            while j &lt; min(i + 12, len(self.boxes)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1040 | <code>                if j == i:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1041 | <code>                    j += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1042 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1043 | <code>                ydis = self._y_dis(self.boxes[i], self.boxes[j]) / mh</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1044 | <code>                if abs(ydis) &lt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1045 | <code>                    self.boxes[i]["in_row"] += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1046 | <code>                elif ydis &gt; 0:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1047 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1048 | <code>                j += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1049 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1050 | <code>        # concat between rows</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1051 | <code>        boxes = deepcopy(self.boxes)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1052 | <code>        blocks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1053 | <code>        while boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1054 | <code>            chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1055 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1056 | <code>            def dfs(up, dp):</code> | 定义 Python 函数 `dfs`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1057 | <code>                chunks.append(up)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1058 | <code>                i = dp</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1059 | <code>                while i &lt; min(dp + 12, len(boxes)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1060 | <code>                    ydis = self._y_dis(up, boxes[i])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1061 | <code>                    smpg = up["page_number"] == boxes[i]["page_number"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1062 | <code>                    mh = self.mean_height[up["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1063 | <code>                    mw = self.mean_width[up["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1064 | <code>                    if smpg and ydis &gt; mh * 4:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1065 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1066 | <code>                    if not smpg and ydis &gt; mh * 16:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1067 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1068 | <code>                    down = boxes[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1069 | <code>                    if not concat_between_pages and down["page_number"] &gt; up["page_number"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1070 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1071 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1072 | <code>                    if up.get("R", "") != down.get("R", "") and up["text"][-1] != "，":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1073 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1074 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1075 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1076 | <code>                    if re.match(r"[0-9]{2,3}/[0-9]{3}$", up["text"]) or re.match(r"[0-9]{2,3}/[0-9]{3}$", down["text"]) or not down["text"].strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1077 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1078 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1080 | <code>                    if not down["text"].strip() or not up["text"].strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1081 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1082 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1084 | <code>                    if up["x1"] &lt; down["x0"] - 10 * mw or up["x0"] &gt; down["x1"] + 10 * mw:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1085 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1086 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1087 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1088 | <code>                    if i - dp &lt; 5 and up.get("layout_type") == "text":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1089 | <code>                        if up.get("layoutno", "1") == down.get("layoutno", "2"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1090 | <code>                            dfs(down, i + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1091 | <code>                            boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1092 | <code>                            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1093 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1094 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1096 | <code>                    fea = self._updown_concat_features(up, down)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1097 | <code>                    if self.updown_cnt_mdl.predict(xgb.DMatrix([fea]))[0] &lt;= 0.5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1098 | <code>                        i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1099 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1100 | <code>                    dfs(down, i + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1101 | <code>                    boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1102 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1104 | <code>            dfs(boxes[0], 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1105 | <code>            boxes.pop(0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1106 | <code>            if chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1107 | <code>                blocks.append(chunks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1109 | <code>        # concat within each block</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1110 | <code>        boxes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1111 | <code>        for b in blocks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1112 | <code>            if len(b) == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1113 | <code>                boxes.append(b[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1114 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1115 | <code>            t = b[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1116 | <code>            for c in b[1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1117 | <code>                t["text"] = t["text"].strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1118 | <code>                c["text"] = c["text"].strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1119 | <code>                if not c["text"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1120 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1121 | <code>                if t["text"] and re.match(r"[0-9\.a-zA-Z]+$", t["text"][-1] + c["text"][-1]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1122 | <code>                    t["text"] += " "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1123 | <code>                t["text"] += c["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1124 | <code>                t["x0"] = min(t["x0"], c["x0"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1125 | <code>                t["x1"] = max(t["x1"], c["x1"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1126 | <code>                t["page_number"] = min(t["page_number"], c["page_number"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1127 | <code>                t["bottom"] = c["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1128 | <code>                if not t["layout_type"] and c["layout_type"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1129 | <code>                    t["layout_type"] = c["layout_type"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1130 | <code>            boxes.append(t)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1132 | <code>        self.boxes = Recognizer.sort_Y_firstly(boxes, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1134 | <code>    def _filter_forpages(self):</code> | 定义 Python 函数 `_filter_forpages`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1135 | <code>        if not self.boxes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1136 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1137 | <code>        findit = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1138 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1139 | <code>        while i &lt; len(self.boxes):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1140 | <code>            if not re.match(r"(contents&#124;目录&#124;目次&#124;table of contents&#124;致谢&#124;acknowledge)$", re.sub(r"( &#124; &#124;\u3000)+", "", self.boxes[i]["text"].lower())):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1141 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1142 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1143 | <code>            findit = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1144 | <code>            eng = re.match(r"[0-9a-zA-Z :'.-]{5,}", self.boxes[i]["text"].strip())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1145 | <code>            self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1146 | <code>            if i &gt;= len(self.boxes):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1147 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1148 | <code>            prefix = self.boxes[i]["text"].strip()[:3] if not eng else " ".join(self.boxes[i]["text"].strip().split()[:2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1149 | <code>            while not prefix:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1150 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1151 | <code>                if i &gt;= len(self.boxes):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1152 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1153 | <code>                prefix = self.boxes[i]["text"].strip()[:3] if not eng else " ".join(self.boxes[i]["text"].strip().split()[:2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1154 | <code>            self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1155 | <code>            if i &gt;= len(self.boxes) or not prefix:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1156 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1157 | <code>            for j in range(i, min(i + 128, len(self.boxes))):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1158 | <code>                if not re.match(prefix, self.boxes[j]["text"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1159 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1160 | <code>                for k in range(i, j):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1161 | <code>                    self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1162 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1163 | <code>        if findit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1164 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1166 | <code>        page_dirty = [0] * len(self.page_images)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1167 | <code>        for b in self.boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1168 | <code>            if re.search(r"(··&#124;··&#124;··)", b["text"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1169 | <code>                page_dirty[b["page_number"] - 1] += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1170 | <code>        page_dirty = set([i + 1 for i, t in enumerate(page_dirty) if t &gt; 3])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1171 | <code>        if not page_dirty:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1172 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1173 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1174 | <code>        while i &lt; len(self.boxes):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1175 | <code>            if self.boxes[i]["page_number"] in page_dirty:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1176 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1177 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1178 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1180 | <code>    def _merge_with_same_bullet(self):</code> | 定义 Python 函数 `_merge_with_same_bullet`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1181 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1182 | <code>        while i + 1 &lt; len(self.boxes):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1183 | <code>            b = self.boxes[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1184 | <code>            b_ = self.boxes[i + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1185 | <code>            if not b["text"].strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1186 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1187 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1188 | <code>            if not b_["text"].strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1189 | <code>                self.boxes.pop(i + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1190 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1192 | <code>            if (</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1193 | <code>                b["text"].strip()[0] != b_["text"].strip()[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1194 | <code>                or b["text"].strip()[0].lower() in set("qwertyuopasdfghjklzxcvbnm")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1195 | <code>                or rag_tokenizer.is_chinese(b["text"].strip()[0])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1196 | <code>                or b["top"] &gt; b_["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1197 | <code>            ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1198 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1199 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1200 | <code>            b_["text"] = b["text"] + "\n" + b_["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1201 | <code>            b_["x0"] = min(b["x0"], b_["x0"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1202 | <code>            b_["x1"] = max(b["x1"], b_["x1"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1203 | <code>            b_["top"] = b["top"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1204 | <code>            self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1206 | <code>    def _extract_table_figure(self, need_image, ZM, return_html, need_position, separate_tables_figures=False):</code> | 定义 Python 函数 `_extract_table_figure`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1207 | <code>        tables = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1208 | <code>        figures = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1209 | <code>        # extract figure and table boxes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1210 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1211 | <code>        lst_lout_no = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1212 | <code>        nomerge_lout_no = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1213 | <code>        while i &lt; len(self.boxes):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1214 | <code>            if "layoutno" not in self.boxes[i]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1215 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1216 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1217 | <code>            lout_no = str(self.boxes[i]["page_number"]) + "-" + str(self.boxes[i]["layoutno"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1218 | <code>            if TableStructureRecognizer.is_caption(self.boxes[i]) or self.boxes[i]["layout_type"] in ["table caption", "title", "figure caption", "reference"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1219 | <code>                nomerge_lout_no.append(lst_lout_no)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1220 | <code>            if self.boxes[i]["layout_type"] == "table":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1221 | <code>                if re.match(r"(数据&#124;资料&#124;图表)*来源[:： ]", self.boxes[i]["text"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1222 | <code>                    self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1223 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1224 | <code>                if lout_no not in tables:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1225 | <code>                    tables[lout_no] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1226 | <code>                tables[lout_no].append(self.boxes[i])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1227 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1228 | <code>                lst_lout_no = lout_no</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1229 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1230 | <code>            if need_image and self.boxes[i]["layout_type"] == "figure":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1231 | <code>                if re.match(r"(数据&#124;资料&#124;图表)*来源[:： ]", self.boxes[i]["text"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1232 | <code>                    self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1233 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1234 | <code>                if lout_no not in figures:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1235 | <code>                    figures[lout_no] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1236 | <code>                figures[lout_no].append(self.boxes[i])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1237 | <code>                self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1238 | <code>                lst_lout_no = lout_no</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1239 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1240 | <code>            i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>        # merge table on different pages</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1243 | <code>        nomerge_lout_no = set(nomerge_lout_no)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1244 | <code>        tbls = sorted([(k, bxs) for k, bxs in tables.items()], key=lambda x: (x[1][0]["top"], x[1][0]["x0"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1246 | <code>        i = len(tbls) - 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1247 | <code>        while i - 1 &gt;= 0:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1248 | <code>            k0, bxs0 = tbls[i - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1249 | <code>            k, bxs = tbls[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1250 | <code>            i -= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1251 | <code>            if k0 in nomerge_lout_no:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1252 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1253 | <code>            if bxs[0]["page_number"] == bxs0[0]["page_number"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1254 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1255 | <code>            if bxs[0]["page_number"] - bxs0[0]["page_number"] &gt; 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1256 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1257 | <code>            mh = self.mean_height[bxs[0]["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1258 | <code>            if self._y_dis(bxs0[-1], bxs[0]) &gt; mh * 23:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1259 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1260 | <code>            tables[k0].extend(tables[k])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1261 | <code>            del tables[k]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1263 | <code>        def x_overlapped(a, b):</code> | 定义 Python 函数 `x_overlapped`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1264 | <code>            return not any([a["x1"] &lt; b["x0"], a["x0"] &gt; b["x1"]])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>        # find captions and pop out</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1267 | <code>        i = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1268 | <code>        while i &lt; len(self.boxes):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1269 | <code>            c = self.boxes[i]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1270 | <code>            # mh = self.mean_height[c["page_number"]-1]</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1271 | <code>            if not TableStructureRecognizer.is_caption(c):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1272 | <code>                i += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1273 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1275 | <code>            # find the nearest layouts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1276 | <code>            def nearest(tbls):</code> | 定义 Python 函数 `nearest`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1277 | <code>                nonlocal c</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1278 | <code>                mink = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1279 | <code>                minv = 1000000000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1280 | <code>                for k, bxs in tbls.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1281 | <code>                    for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1282 | <code>                        if b.get("layout_type", "").find("caption") &gt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1283 | <code>                            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1284 | <code>                        y_dis = self._y_dis(c, b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1285 | <code>                        x_dis = self._x_dis(c, b) if not x_overlapped(c, b) else 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1286 | <code>                        dis = y_dis * y_dis + x_dis * x_dis</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1287 | <code>                        if dis &lt; minv:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1288 | <code>                            mink = k</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1289 | <code>                            minv = dis</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1290 | <code>                return mink, minv</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1292 | <code>            tk, tv = nearest(tables)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1293 | <code>            fk, fv = nearest(figures)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1294 | <code>            # if min(tv, fv) &gt; 2000:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1295 | <code>            #    i += 1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1296 | <code>            #    continue</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1297 | <code>            if tv &lt; fv and tk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1298 | <code>                tables[tk].insert(0, c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1299 | <code>                logging.debug("TABLE:" + self.boxes[i]["text"] + "; Cap: " + tk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1300 | <code>            elif fk:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1301 | <code>                figures[fk].insert(0, c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1302 | <code>                logging.debug("FIGURE:" + self.boxes[i]["text"] + "; Cap: " + tk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1303 | <code>            self.boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1305 | <code>        def cropout(bxs, ltype, poss):</code> | 定义 Python 函数 `cropout`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1306 | <code>            nonlocal ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1307 | <code>            max_page_index = len(self.page_images) - 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1309 | <code>            def local_page_index(page_number):</code> | 定义 Python 函数 `local_page_index`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1310 | <code>                idx = page_number - 1 if page_number &gt; 0 else 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1311 | <code>                if idx &gt; max_page_index and self.page_from:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1312 | <code>                    idx = page_number - 1 - self.page_from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1313 | <code>                return idx</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1315 | <code>            pn = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1316 | <code>            for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1317 | <code>                idx = local_page_index(b["page_number"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1318 | <code>                if 0 &lt;= idx &lt;= max_page_index:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1319 | <code>                    pn.add(idx)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1320 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1321 | <code>                    logging.warning(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1322 | <code>                        "Skip out-of-range page_number %s (page_from=%s, pages=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1323 | <code>                        b.get("page_number"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1324 | <code>                        self.page_from,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1325 | <code>                        len(self.page_images),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1326 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1328 | <code>            if not pn:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1329 | <code>                return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1331 | <code>            if len(pn) &lt; 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1332 | <code>                pn = list(pn)[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1333 | <code>                ht = self.page_cum_height[pn]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1334 | <code>                b = {"x0": np.min([b["x0"] for b in bxs]), "top": np.min([b["top"] for b in bxs]) - ht, "x1": np.max([b["x1"] for b in bxs]), "bottom": np.max([b["bottom"] for b in bxs]) - ht}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1335 | <code>                louts = [layout for layout in self.page_layout[pn] if layout["type"] == ltype]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1336 | <code>                ii = Recognizer.find_overlapped(b, louts, naive=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1337 | <code>                if ii is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1338 | <code>                    b = louts[ii]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1339 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1340 | <code>                    logging.warning(f"Missing layout match: {pn + 1},%s" % (bxs[0].get("layoutno", "")))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1342 | <code>                left, top, right, bott = b["x0"], b["top"], b["x1"], b["bottom"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1343 | <code>                if right &lt; left:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1344 | <code>                    right = left + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1345 | <code>                poss.append((pn + self.page_from, left, right, top, bott))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1346 | <code>                return self.page_images[pn].crop((left * ZM, top * ZM, right * ZM, bott * ZM))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1347 | <code>            pn = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1348 | <code>            for b in bxs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1349 | <code>                p = local_page_index(b["page_number"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1350 | <code>                if 0 &lt;= p &lt;= max_page_index:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1351 | <code>                    if p not in pn:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1352 | <code>                        pn[p] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1353 | <code>                    pn[p].append(b)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1354 | <code>            pn = sorted(pn.items(), key=lambda x: x[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1355 | <code>            imgs = [cropout(arr, ltype, poss) for p, arr in pn]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1356 | <code>            imgs = [img for img in imgs if img is not None]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1357 | <code>            if not imgs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1358 | <code>                return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1359 | <code>            pic = Image.new("RGB", (int(np.max([i.size[0] for i in imgs])), int(np.sum([m.size[1] for m in imgs]))), (245, 245, 245))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1360 | <code>            height = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1361 | <code>            for img in imgs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1362 | <code>                pic.paste(img, (0, int(height)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1363 | <code>                height += img.size[1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1364 | <code>            return pic</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1366 | <code>        res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1367 | <code>        positions = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1368 | <code>        figure_results = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1369 | <code>        figure_positions = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1370 | <code>        # crop figure out and add caption</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1371 | <code>        for k, bxs in figures.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1372 | <code>            txt = "\n".join([b["text"] for b in bxs])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1373 | <code>            if not txt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1374 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1376 | <code>            poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1378 | <code>            if separate_tables_figures:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1379 | <code>                img = cropout(bxs, "figure", poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1380 | <code>                if img is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1381 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1382 | <code>                figure_results.append((img, [txt]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1383 | <code>                figure_positions.append(poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1384 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1385 | <code>                img = cropout(bxs, "figure", poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1386 | <code>                if img is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1387 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1388 | <code>                res.append((img, [txt]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1389 | <code>                positions.append(poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1391 | <code>        for k, bxs in tables.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1392 | <code>            if not bxs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1393 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1394 | <code>            bxs = Recognizer.sort_Y_firstly(bxs, np.mean([(b["bottom"] - b["top"]) / 2 for b in bxs]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1396 | <code>            poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1398 | <code>            img = cropout(bxs, "table", poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1399 | <code>            if img is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1400 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1401 | <code>            res.append((img, self.tbl_det.construct_table(bxs, html=return_html, is_english=self.is_english)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1402 | <code>            positions.append(poss)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1404 | <code>        if separate_tables_figures:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1405 | <code>            assert len(positions) + len(figure_positions) == len(res) + len(figure_results)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1406 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1407 | <code>                return list(zip(res, positions)), list(zip(figure_results, figure_positions))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1408 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1409 | <code>                return res, figure_results</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1410 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1411 | <code>            assert len(positions) == len(res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1412 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1413 | <code>                return list(zip(res, positions))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1414 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1415 | <code>                return res</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1417 | <code>    def proj_match(self, line):</code> | 定义 Python 函数 `proj_match`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1418 | <code>        if len(line) &lt;= 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1419 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1420 | <code>        if re.match(r"[0-9 ().,%%+/-]+$", line):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1421 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1422 | <code>        for p, j in [</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1423 | <code>            (r"第[零一二三四五六七八九十百]+章", 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1424 | <code>            (r"第[零一二三四五六七八九十百]+[条节]", 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1425 | <code>            (r"[零一二三四五六七八九十百]+[、 　]", 3),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1426 | <code>            (r"[\(（][零一二三四五六七八九十百]+[）\)]", 4),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1427 | <code>            (r"[0-9]+(、&#124;\.[　 ]&#124;\.[^0-9])", 5),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1428 | <code>            (r"[0-9]+\.[0-9]+(、&#124;[. 　]&#124;[^0-9])", 6),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1429 | <code>            (r"[0-9]+\.[0-9]+\.[0-9]+(、&#124;[ 　]&#124;[^0-9])", 7),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1430 | <code>            (r"[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(、&#124;[ 　]&#124;[^0-9])", 8),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1431 | <code>            (r".{,48}[：:?？]$", 9),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1432 | <code>            (r"[0-9]+）", 10),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1433 | <code>            (r"[\(（][0-9]+[）\)]", 11),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1434 | <code>            (r"[零一二三四五六七八九十百]+是", 12),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1435 | <code>            (r"[⚫•➢✓]", 12),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1436 | <code>        ]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1437 | <code>            if re.match(p, line):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1438 | <code>                return j</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1439 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1441 | <code>    def _line_tag(self, bx, ZM):</code> | 定义 Python 函数 `_line_tag`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1442 | <code>        pn = [bx["page_number"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1443 | <code>        top = bx["top"] - self.page_cum_height[pn[0] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1444 | <code>        bott = bx["bottom"] - self.page_cum_height[pn[0] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1445 | <code>        page_images_cnt = len(self.page_images)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1446 | <code>        if pn[-1] - 1 &gt;= page_images_cnt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1447 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1448 | <code>        while bott * ZM &gt; self.page_images[pn[-1] - 1].size[1]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1449 | <code>            bott -= self.page_images[pn[-1] - 1].size[1] / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1450 | <code>            pn.append(pn[-1] + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1451 | <code>            if pn[-1] - 1 &gt;= page_images_cnt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1452 | <code>                return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1454 | <code>        return "@@{}\t{:.1f}\t{:.1f}\t{:.1f}\t{:.1f}##".format("-".join([str(p) for p in pn]), bx["x0"], bx["x1"], top, bott)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1456 | <code>    def __filterout_scraps(self, boxes, ZM):</code> | 定义 Python 函数 `__filterout_scraps`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1457 | <code>        def width(b):</code> | 定义 Python 函数 `width`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1458 | <code>            return b["x1"] - b["x0"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1460 | <code>        def height(b):</code> | 定义 Python 函数 `height`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1461 | <code>            return b["bottom"] - b["top"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1463 | <code>        def usefull(b):</code> | 定义 Python 函数 `usefull`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1464 | <code>            if b.get("layout_type"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1465 | <code>                return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1466 | <code>            if width(b) &gt; self.page_images[b["page_number"] - 1].size[0] / ZM / 3:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1467 | <code>                return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1468 | <code>            if b["bottom"] - b["top"] &gt; self.mean_height[b["page_number"] - 1]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1469 | <code>                return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1470 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1472 | <code>        res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1473 | <code>        while boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1474 | <code>            lines = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1475 | <code>            widths = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1476 | <code>            pw = self.page_images[boxes[0]["page_number"] - 1].size[0] / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1477 | <code>            mh = self.mean_height[boxes[0]["page_number"] - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1478 | <code>            mj = self.proj_match(boxes[0]["text"]) or boxes[0].get("layout_type", "") == "title"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1480 | <code>            def dfs(line, st):</code> | 定义 Python 函数 `dfs`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1481 | <code>                nonlocal mh, pw, lines, widths</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1482 | <code>                lines.append(line)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1483 | <code>                widths.append(width(line))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1484 | <code>                mmj = self.proj_match(line["text"]) or line.get("layout_type", "") == "title"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1485 | <code>                for i in range(st + 1, min(st + 20, len(boxes))):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1486 | <code>                    if (boxes[i]["page_number"] - line["page_number"]) &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1487 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1488 | <code>                    if not mmj and self._y_dis(line, boxes[i]) &gt;= 3 * mh and height(line) &lt; 1.5 * mh:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1489 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1491 | <code>                    if not usefull(boxes[i]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1492 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1493 | <code>                    if mmj or (self._x_dis(boxes[i], line) &lt; pw / 10):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1494 | <code>                        # and abs(width(boxes[i])-width_mean)/max(width(boxes[i]),width_mean)&lt;0.5):</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1495 | <code>                        # concat following</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1496 | <code>                        dfs(boxes[i], i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1497 | <code>                        boxes.pop(i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1498 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1500 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1501 | <code>                if usefull(boxes[0]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1502 | <code>                    dfs(boxes[0], 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1503 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1504 | <code>                    logging.debug("WASTE: " + boxes[0]["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1505 | <code>            except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1506 | <code>                pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1507 | <code>            boxes.pop(0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1508 | <code>            mw = np.mean(widths)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1509 | <code>            if mj or mw / pw &gt;= 0.35 or mw &gt; 200:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1510 | <code>                res.append("\n".join([c["text"] + self._line_tag(c, ZM) for c in lines]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1511 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1512 | <code>                logging.debug("REMOVED: " + "&lt;&lt;".join([c["text"] for c in lines]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1514 | <code>        return "\n\n".join(res)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1516 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1517 | <code>    def total_page_number(fnm, binary=None):</code> | 定义 Python 函数 `total_page_number`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1518 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1519 | <code>            with sys.modules[LOCK_KEY_pdfplumber]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1520 | <code>                pdf = pdfplumber.open(fnm) if not binary else pdfplumber.open(BytesIO(binary))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1521 | <code>            total_page = len(pdf.pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1522 | <code>            pdf.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1523 | <code>            return total_page</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1524 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1525 | <code>            logging.exception("total_page_number")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1527 | <code>    def __images__(self, fnm, zoomin=3, page_from=0, page_to=MAXIMUM_PAGE_NUMBER, callback=None):</code> | 定义 Python 函数 `__images__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1528 | <code>        self.lefted_chars = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1529 | <code>        self.mean_height = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1530 | <code>        self.mean_width = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1531 | <code>        self.boxes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1532 | <code>        self.garbages = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1533 | <code>        self.page_cum_height = [0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1534 | <code>        self.page_layout = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1535 | <code>        self.page_from = page_from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1536 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1537 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1538 | <code>            with sys.modules[LOCK_KEY_pdfplumber]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1539 | <code>                with pdfplumber.open(fnm) if isinstance(fnm, str) else pdfplumber.open(BytesIO(fnm)) as pdf:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1540 | <code>                    self.pdf = pdf</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1541 | <code>                    self.page_images = [p.to_image(resolution=72 * zoomin, antialias=True).annotated for i, p in enumerate(self.pdf.pages[page_from:page_to])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1543 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1544 | <code>                        self.page_chars = [[c for c in page.dedupe_chars().chars if self._has_color(c)] for page in self.pdf.pages[page_from:page_to]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1545 | <code>                    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1546 | <code>                        logging.warning(f"Failed to extract characters for pages {page_from}-{page_to}: {str(e)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1547 | <code>                        self.page_chars = [[] for _ in range(len(self.page_images))]  # If failed to extract, using empty list instead.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1549 | <code>                    # Detect garbled pages and clear their chars so the OCR</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1550 | <code>                    # path will be used instead. Two detection strategies:</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1551 | <code>                    # 1) PUA / unmapped CID characters (threshold=0.3)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1552 | <code>                    # 2) Font-encoding garbling: subset fonts mapping CJK to ASCII</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1553 | <code>                    for pi, page_ch in enumerate(self.page_chars):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1554 | <code>                        if not page_ch:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1555 | <code>                            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1556 | <code>                        # Strategy 1: PUA / CID garbling</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1557 | <code>                        sample = page_ch if len(page_ch) &lt;= 200 else page_ch[:200]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1558 | <code>                        sample_text = "".join(c.get("text", "") for c in sample)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1559 | <code>                        if self._is_garbled_text(sample_text, threshold=0.3):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1560 | <code>                            logging.warning(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1561 | <code>                                "Page %d: pdfplumber extracted mostly garbled characters (%d chars), "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1562 | <code>                                "clearing to use OCR fallback.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1563 | <code>                                page_from + pi + 1, len(page_ch),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1564 | <code>                            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>                            self.page_chars[pi] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1566 | <code>                            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1567 | <code>                        # Strategy 2: font-encoding garbling (CJK mapped to ASCII)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1568 | <code>                        if self._is_garbled_by_font_encoding(page_ch):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1569 | <code>                            logging.warning(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1570 | <code>                                "Page %d: detected font-encoding garbled text "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1571 | <code>                                "(subset fonts with no CJK output, %d chars), "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1572 | <code>                                "clearing to use OCR fallback.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1573 | <code>                                page_from + pi + 1, len(page_ch),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1574 | <code>                            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1575 | <code>                            self.page_chars[pi] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1577 | <code>                    self.total_page = len(self.pdf.pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1580 | <code>            logging.exception(f"RAGFlowPdfParser __images__, exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1581 | <code>        logging.info(f"__images__ dedupe_chars cost {timer() - start}s")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1583 | <code>        logging.debug("Images converted.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1584 | <code>        self.is_english = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1585 | <code>            re.search(r"[ a-zA-Z0-9,/¸;:'\[\]\(\)!@#$%^&amp;*\"?&lt;&gt;._-]{30,}", "".join(random.choices([c["text"] for c in self.page_chars[i]], k=min(100, len(self.page_chars[i])))))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1586 | <code>            for i in range(len(self.page_chars))</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1587 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1588 | <code>        if sum([1 if e else 0 for e in self.is_english]) &gt; len(self.page_images) / 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1589 | <code>            self.is_english = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1590 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1591 | <code>            self.is_english = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1593 | <code>        async def __img_ocr(i, id, img, chars, limiter):</code> | 定义 Python 函数 `__img_ocr`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1594 | <code>            j = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1595 | <code>            while j + 1 &lt; len(chars):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1596 | <code>                if (</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1597 | <code>                    chars[j]["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1598 | <code>                    and chars[j + 1]["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1599 | <code>                    and re.match(r"[0-9a-zA-Z,.:;!%]+", chars[j]["text"] + chars[j + 1]["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1600 | <code>                    and chars[j + 1]["x0"] - chars[j]["x1"] &gt;= min(chars[j + 1]["width"], chars[j]["width"]) / 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1601 | <code>                ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1602 | <code>                    chars[j]["text"] += " "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1603 | <code>                j += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1605 | <code>            if limiter:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1606 | <code>                async with limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1607 | <code>                    await thread_pool_exec(self.__ocr, i + 1, img, chars, zoomin, id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1608 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1609 | <code>                self.__ocr(i + 1, img, chars, zoomin, id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1611 | <code>            if callback and i % 6 == 5:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1612 | <code>                callback((i + 1) * 0.6 / len(self.page_images))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1614 | <code>        async def __img_ocr_launcher():</code> | 定义 Python 函数 `__img_ocr_launcher`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1615 | <code>            def __ocr_preprocess():</code> | 定义 Python 函数 `__ocr_preprocess`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1616 | <code>                chars = self.page_chars[i] if not self.is_english else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1617 | <code>                self.mean_height.append(np.median(sorted([c["height"] for c in chars])) if chars else 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1618 | <code>                self.mean_width.append(np.median(sorted([c["width"] for c in chars])) if chars else 8)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1619 | <code>                self.page_cum_height.append(img.size[1] / zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1620 | <code>                return chars</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1622 | <code>            if self.parallel_limiter:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1623 | <code>                tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1625 | <code>                for i, img in enumerate(self.page_images):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1626 | <code>                    chars = __ocr_preprocess()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1628 | <code>                    semaphore = self.parallel_limiter[i % settings.PARALLEL_DEVICES]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1630 | <code>                    async def wrapper(i=i, img=img, chars=chars, semaphore=semaphore):</code> | 定义 Python 函数 `wrapper`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1631 | <code>                        await __img_ocr(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1632 | <code>                            i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1633 | <code>                            i % settings.PARALLEL_DEVICES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1634 | <code>                            img,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1635 | <code>                            chars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1636 | <code>                            semaphore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1637 | <code>                        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1639 | <code>                    tasks.append(asyncio.create_task(wrapper()))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1640 | <code>                    await asyncio.sleep(0)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1642 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1643 | <code>                    await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1644 | <code>                except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1645 | <code>                    logging.error(f"Error in OCR: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1646 | <code>                    for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1647 | <code>                        t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1648 | <code>                    await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1649 | <code>                    raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1651 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1652 | <code>                for i, img in enumerate(self.page_images):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1653 | <code>                    chars = __ocr_preprocess()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1654 | <code>                    await __img_ocr(i, 0, img, chars, None)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1656 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1658 | <code>        asyncio.run(__img_ocr_launcher())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1660 | <code>        logging.info(f"__images__ {len(self.page_images)} pages cost {timer() - start}s")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1662 | <code>        if not self.is_english and not any([c for c in self.page_chars]) and self.boxes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1663 | <code>            bxes = [b for bxs in self.boxes for b in bxs]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1664 | <code>            self.is_english = re.search(r"[ \na-zA-Z0-9,/¸;:'\[\]\(\)!@#$%^&amp;*\"?&lt;&gt;._-]{30,}", "".join([b["text"] for b in random.choices(bxes, k=min(30, len(bxes)))]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1666 | <code>        logging.debug(f"Is it English: {self.is_english}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1668 | <code>        self.page_cum_height = np.cumsum(self.page_cum_height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1669 | <code>        assert len(self.page_cum_height) == len(self.page_images) + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1670 | <code>        if len(self.boxes) == 0 and zoomin &lt; 9:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1671 | <code>            self.__images__(fnm, zoomin * 3, page_from, page_to, callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1673 | <code>    def __call__(self, fnm, need_image=True, zoomin=3, return_html=False, auto_rotate_tables=None):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1674 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1675 | <code>        Parse a PDF file.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1677 | <code>        Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1678 | <code>            fnm: PDF file path or binary content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1679 | <code>            need_image: Whether to extract images</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1680 | <code>            zoomin: Zoom factor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1681 | <code>            return_html: Whether to return tables in HTML format</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1682 | <code>            auto_rotate_tables: Whether to enable auto orientation correction for tables.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1683 | <code>                               None: Use TABLE_AUTO_ROTATE env var setting (default: True)</code> | 声明局部标识符 `setting`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1684 | <code>                               True: Enable auto orientation correction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1685 | <code>                               False: Disable auto orientation correction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1686 | <code>        """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1687 | <code>        if auto_rotate_tables is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1688 | <code>            auto_rotate_tables = os.getenv("TABLE_AUTO_ROTATE", "true").lower() in ("true", "1", "yes")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1690 | <code>        self.outlines = extract_pdf_outlines(fnm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1691 | <code>        self.__images__(fnm, zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1692 | <code>        self._layouts_rec(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1693 | <code>        self._table_transformer_job(zoomin, auto_rotate=auto_rotate_tables)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1694 | <code>        self._text_merge()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1695 | <code>        self._concat_downward()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1696 | <code>        self._filter_forpages()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1697 | <code>        tbls = self._extract_table_figure(need_image, zoomin, return_html, False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1698 | <code>        return self.__filterout_scraps(deepcopy(self.boxes), zoomin), tbls</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1700 | <code>    def parse_into_bboxes(self, fnm, callback=None, zoomin=3, from_page=0, to_page=MAXIMUM_PAGE_NUMBER):</code> | 定义 Python 函数 `parse_into_bboxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1701 | <code>        self.outlines = extract_pdf_outlines(fnm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1702 | <code>        batch_size = max(1, int(os.getenv("PDF_PARSER_PAGE_BATCH_SIZE", "50")))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1703 | <code>        if isinstance(fnm, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1704 | <code>            total_pages = self.total_page_number(fnm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1705 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1706 | <code>            total_pages = self.total_page_number(fnm, binary=fnm)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1708 | <code>        if total_pages is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1709 | <code>            effective_to_page = to_page</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1710 | <code>            logging.warning(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1711 | <code>                "parse_into_bboxes: total_page_number returned None; using caller-supplied to_page=%s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1712 | <code>                to_page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1713 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1714 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1715 | <code>            effective_to_page = min(to_page, total_pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1717 | <code>        if effective_to_page - from_page &lt;= batch_size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1718 | <code>            self.__images__(fnm, zoomin, page_from=from_page, page_to=effective_to_page, callback=callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1719 | <code>            return self._parse_loaded_window_into_bboxes(zoomin, callback=callback)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1721 | <code>        logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1722 | <code>            "parse_into_bboxes uses chunk mode: from_page=%s, effective_to_page=%s, batch_size=%s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1723 | <code>            from_page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1724 | <code>            effective_to_page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1725 | <code>            batch_size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1726 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1727 | <code>        all_boxes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1728 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1729 | <code>        for page_from in range(from_page, effective_to_page, batch_size):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1730 | <code>            page_to = min(page_from + batch_size, effective_to_page)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1731 | <code>            self.__images__(fnm, zoomin, page_from=page_from, page_to=page_to, callback=None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1732 | <code>            chunk_boxes = self._parse_loaded_window_into_bboxes(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1733 | <code>            all_boxes.extend(self._to_global_boxes(chunk_boxes))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1734 | <code>            if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1735 | <code>                callback((page_to - from_page) / max(1, effective_to_page - from_page), f"Structured: {page_to}/{effective_to_page} pages")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1737 | <code>        logging.info("parse_into_bboxes chunk mode cost %.2fs", timer() - start)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1738 | <code>        return all_boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1740 | <code>    def _parse_loaded_window_into_bboxes(self, zoomin=3, callback=None):</code> | 定义 Python 函数 `_parse_loaded_window_into_bboxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1741 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1742 | <code>        self._layouts_rec(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1743 | <code>        if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1744 | <code>            callback(0.63, "Layout analysis ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1746 | <code>        auto_rotate_tables = os.getenv("TABLE_AUTO_ROTATE", "true").lower() in ("true", "1", "yes")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1748 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1749 | <code>        self._table_transformer_job(zoomin, auto_rotate=auto_rotate_tables)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1750 | <code>        if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1751 | <code>            callback(0.83, "Table analysis ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1753 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1754 | <code>        self._text_merge()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1755 | <code>        self._concat_downward()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1756 | <code>        self._naive_vertical_merge(zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1757 | <code>        if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1758 | <code>            callback(0.92, "Text merged ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1760 | <code>        start = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1761 | <code>        tbls, figs = self._extract_table_figure(True, zoomin, True, True, True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1763 | <code>        def insert_table_figures(tbls_or_figs, layout_type):</code> | 定义 Python 函数 `insert_table_figures`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1764 | <code>            def min_rectangle_distance(rect1, rect2):</code> | 定义 Python 函数 `min_rectangle_distance`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1765 | <code>                pn1, left1, right1, top1, bottom1 = rect1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1766 | <code>                pn2, left2, right2, top2, bottom2 = rect2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1767 | <code>                if right1 &gt;= left2 and right2 &gt;= left1 and bottom1 &gt;= top2 and bottom2 &gt;= top1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1768 | <code>                    return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1769 | <code>                if right1 &lt; left2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1770 | <code>                    dx = left2 - right1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1771 | <code>                elif right2 &lt; left1:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1772 | <code>                    dx = left1 - right2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1773 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1774 | <code>                    dx = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1775 | <code>                if bottom1 &lt; top2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1776 | <code>                    dy = top2 - bottom1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1777 | <code>                elif bottom2 &lt; top1:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1778 | <code>                    dy = top1 - bottom2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1779 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1780 | <code>                    dy = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1781 | <code>                return math.sqrt(dx * dx + dy * dy)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1783 | <code>            for (img, txt), poss in tbls_or_figs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1784 | <code>                local_poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1785 | <code>                for pn, left, right, top, bott in poss:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1786 | <code>                    local_pn = pn - self.page_from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1787 | <code>                    if 0 &lt;= local_pn &lt; len(self.page_cum_height) - 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1788 | <code>                        local_poss.append((local_pn, left, right, top, bott))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1789 | <code>                    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1790 | <code>                        logging.debug(f"Skip out-of-range table/figure position pn={pn}, page_from={self.page_from}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1791 | <code>                if not local_poss:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1792 | <code>                    logging.debug("No valid local positions for table/figure; skip insertion.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1793 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1795 | <code>                if isinstance(txt, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1796 | <code>                    txt = "\n".join(txt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1797 | <code>                pn, left, right, top, bott = local_poss[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1798 | <code>                insert_at = len(self.boxes)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1799 | <code>                bboxes = [(i, (b["page_number"], b["x0"], b["x1"], b["top"], b["bottom"])) for i, b in enumerate(self.boxes)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1800 | <code>                if bboxes:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1801 | <code>                    dists = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1802 | <code>                        (min_rectangle_distance((cand_pn, cand_left, cand_right, cand_top + self.page_cum_height[cand_pn], cand_bott + self.page_cum_height[cand_pn]), rect), i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1803 | <code>                        for i, rect in bboxes</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1804 | <code>                        for cand_pn, cand_left, cand_right, cand_top, cand_bott in local_poss</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1805 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1806 | <code>                    if dists:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1807 | <code>                        nearest_bbox_idx = int(np.argmin([dist for dist, _ in dists]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1808 | <code>                        insert_at, _ = bboxes[dists[nearest_bbox_idx][-1]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1809 | <code>                        if self.boxes[insert_at]["bottom"] &lt; top + self.page_cum_height[pn]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1810 | <code>                            insert_at += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1811 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1812 | <code>                    logging.debug("No text boxes available; append %s block directly.", layout_type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1813 | <code>                self.boxes.insert(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1814 | <code>                    insert_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1815 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1816 | <code>                        "page_number": pn + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1817 | <code>                        "x0": left,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1818 | <code>                        "x1": right,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1819 | <code>                        "top": top + self.page_cum_height[pn],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1820 | <code>                        "bottom": bott + self.page_cum_height[pn],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1821 | <code>                        "layout_type": layout_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1822 | <code>                        "text": txt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1823 | <code>                        "image": img,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1824 | <code>                        "positions": [[pn + 1, int(left), int(right), int(top), int(bott)]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1825 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1826 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1828 | <code>        for b in self.boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1829 | <code>            b["position_tag"] = self._line_tag(b, zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1830 | <code>            b["image"] = self.crop(b["position_tag"], zoomin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1831 | <code>            b["positions"] = [[pos[0][-1] + 1, *pos[1:]] for pos in RAGFlowPdfParser.extract_positions(b["position_tag"])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1833 | <code>        insert_table_figures(tbls, "table")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1834 | <code>        insert_table_figures(figs, "figure")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1835 | <code>        if callback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1836 | <code>            callback(1, "Structured ({:.2f}s)".format(timer() - start))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1837 | <code>        return deepcopy(self.boxes)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1839 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1840 | <code>    def _offset_position_tag(text, page_offset):</code> | 定义 Python 函数 `_offset_position_tag`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1841 | <code>        if not text or page_offset &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1842 | <code>            return text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1844 | <code>        def _replace(match):</code> | 定义 Python 函数 `_replace`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1845 | <code>            pages = [str(int(p) + page_offset) for p in match.group(1).split("-")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1846 | <code>            return f"@@{'-'.join(pages)}\t"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1847 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1848 | <code>        return re.sub(r"@@([0-9-]+)\t", _replace, text)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1850 | <code>    def _to_global_boxes(self, boxes):</code> | 定义 Python 函数 `_to_global_boxes`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1851 | <code>        if self.page_from &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1852 | <code>            return boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1853 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1854 | <code>        for box in boxes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1855 | <code>            box["page_number"] = int(box.get("page_number", 1)) + self.page_from</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1856 | <code>            if isinstance(box.get("position_tag"), str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1857 | <code>                box["position_tag"] = self._offset_position_tag(box["position_tag"], self.page_from)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1858 | <code>            if isinstance(box.get("positions"), list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1859 | <code>                box["positions"] = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1860 | <code>                    [int(pos[0]) + self.page_from, *pos[1:]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1861 | <code>                    if isinstance(pos, list) and len(pos) &gt; 0 and isinstance(pos[0], (int, float))</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1862 | <code>                    else pos</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1863 | <code>                    for pos in box["positions"]</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1864 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1865 | <code>        return boxes</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1867 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1868 | <code>    def remove_tag(txt):</code> | 定义 Python 函数 `remove_tag`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1869 | <code>        return re.sub(r"@@[\t0-9.-]+?##", "", txt)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1871 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1872 | <code>    def extract_positions(txt):</code> | 定义 Python 函数 `extract_positions`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1873 | <code>        poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1874 | <code>        for tag in re.findall(r"@@[0-9-]+\t[0-9.\t]+##", txt):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1875 | <code>            pn, left, right, top, bottom = tag.strip("#").strip("@").split("\t")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1876 | <code>            left, right, top, bottom = float(left), float(right), float(top), float(bottom)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1877 | <code>            poss.append(([int(p) - 1 for p in pn.split("-")], left, right, top, bottom))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1878 | <code>        return poss</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1880 | <code>    def crop(self, text, ZM=3, need_position=False):</code> | 定义 Python 函数 `crop`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1881 | <code>        imgs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1882 | <code>        poss = self.extract_positions(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1883 | <code>        if not poss:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1884 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1885 | <code>                return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1886 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1888 | <code>        if not getattr(self, "page_images", None):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1889 | <code>            logging.warning("crop called without page images; skipping image generation.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1890 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1891 | <code>                return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1892 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1894 | <code>        page_count = len(self.page_images)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1896 | <code>        filtered_poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1897 | <code>        for pns, left, right, top, bottom in poss:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1898 | <code>            if not pns:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1899 | <code>                logging.warning("Empty page index list in crop; skipping this position.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1900 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1901 | <code>            valid_pns = [p for p in pns if 0 &lt;= p &lt; page_count]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1902 | <code>            if not valid_pns:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1903 | <code>                logging.warning(f"All page indices {pns} out of range for {page_count} pages; skipping.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1904 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1905 | <code>            filtered_poss.append((valid_pns, left, right, top, bottom))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1907 | <code>        poss = filtered_poss</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1908 | <code>        if not poss:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1909 | <code>            logging.warning("No valid positions after filtering; skip cropping.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1910 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1911 | <code>                return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1912 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1914 | <code>        max_width = max(np.max([right - left for (_, left, right, _, _) in poss]), 6)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1915 | <code>        GAP = 6</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1916 | <code>        pos = poss[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1917 | <code>        first_page_idx = pos[0][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1918 | <code>        poss.insert(0, ([first_page_idx], pos[1], pos[2], max(0, pos[3] - 120), max(pos[3] - GAP, 0)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1919 | <code>        pos = poss[-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1920 | <code>        last_page_idx = pos[0][-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1921 | <code>        if not (0 &lt;= last_page_idx &lt; page_count):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1922 | <code>            logging.warning(f"Last page index {last_page_idx} out of range for {page_count} pages; skipping crop.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1923 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1924 | <code>                return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1925 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1926 | <code>        last_page_height = self.page_images[last_page_idx].size[1] / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1927 | <code>        poss.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1928 | <code>            (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1929 | <code>                [last_page_idx],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1930 | <code>                pos[1],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1931 | <code>                pos[2],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1932 | <code>                min(last_page_height, pos[4] + GAP),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1933 | <code>                min(last_page_height, pos[4] + 120),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1934 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1935 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1937 | <code>        positions = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1938 | <code>        for ii, (pns, left, right, top, bottom) in enumerate(poss):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1939 | <code>            if 0 &lt; ii &lt; len(poss) - 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1940 | <code>                right = max(left + 10, right)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1941 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1942 | <code>                right = left + max_width</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1943 | <code>            bottom *= ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1944 | <code>            for pn in pns[1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1945 | <code>                if 0 &lt;= pn - 1 &lt; page_count:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1946 | <code>                    bottom += self.page_images[pn - 1].size[1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1947 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1948 | <code>                    logging.warning(f"Page index {pn}-1 out of range for {page_count} pages during crop; skipping height accumulation.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1950 | <code>            if not (0 &lt;= pns[0] &lt; page_count):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1951 | <code>                logging.warning(f"Base page index {pns[0]} out of range for {page_count} pages during crop; skipping this segment.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1952 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1954 | <code>            imgs.append(self.page_images[pns[0]].crop((left * ZM, top * ZM, right * ZM, min(bottom, self.page_images[pns[0]].size[1]))))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1955 | <code>            if 0 &lt; ii &lt; len(poss) - 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1956 | <code>                positions.append((pns[0] + self.page_from, left, right, top, min(bottom, self.page_images[pns[0]].size[1]) / ZM))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1957 | <code>            bottom -= self.page_images[pns[0]].size[1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1958 | <code>            for pn in pns[1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1959 | <code>                if not (0 &lt;= pn &lt; page_count):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1960 | <code>                    logging.warning(f"Page index {pn} out of range for {page_count} pages during crop; skipping this page.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1961 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1962 | <code>                imgs.append(self.page_images[pn].crop((left * ZM, 0, right * ZM, min(bottom, self.page_images[pn].size[1]))))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1963 | <code>                if 0 &lt; ii &lt; len(poss) - 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1964 | <code>                    positions.append((pn + self.page_from, left, right, 0, min(bottom, self.page_images[pn].size[1]) / ZM))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1965 | <code>                bottom -= self.page_images[pn].size[1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1966 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1967 | <code>        if not imgs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1968 | <code>            if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1969 | <code>                return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1970 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1971 | <code>        height = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1972 | <code>        for img in imgs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1973 | <code>            height += img.size[1] + GAP</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1974 | <code>        height = int(height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1975 | <code>        width = int(np.max([i.size[0] for i in imgs]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1976 | <code>        pic = Image.new("RGB", (width, height), (245, 245, 245))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1977 | <code>        height = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1978 | <code>        for ii, img in enumerate(imgs):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1979 | <code>            if ii == 0 or ii + 1 == len(imgs):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1980 | <code>                img = img.convert("RGBA")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1981 | <code>                overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1982 | <code>                overlay.putalpha(128)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1983 | <code>                img = Image.alpha_composite(img, overlay).convert("RGB")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1984 | <code>            pic.paste(img, (0, int(height)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1985 | <code>            height += img.size[1] + GAP</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1987 | <code>        if need_position:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1988 | <code>            return pic, positions</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1989 | <code>        return pic</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1990 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1991 | <code>    def get_position(self, bx, ZM):</code> | 定义 Python 函数 `get_position`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1992 | <code>        poss = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1993 | <code>        pn = bx["page_number"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1994 | <code>        top = bx["top"] - self.page_cum_height[pn - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1995 | <code>        bott = bx["bottom"] - self.page_cum_height[pn - 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1996 | <code>        poss.append((pn, bx["x0"], bx["x1"], top, min(bott, self.page_images[pn - 1].size[1] / ZM)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1997 | <code>        while bott * ZM &gt; self.page_images[pn - 1].size[1]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1998 | <code>            bott -= self.page_images[pn - 1].size[1] / ZM</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1999 | <code>            top = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2000 | <code>            pn += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2001 | <code>            poss.append((pn, bx["x0"], bx["x1"], top, min(bott, self.page_images[pn - 1].size[1] / ZM)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2002 | <code>        return poss</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2003 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2005 | <code>class PlainParser:</code> | 定义 Python 类 `PlainParser`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2006 | <code>    def __call__(self, filename, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, **kwargs):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2007 | <code>        lines = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2008 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2009 | <code>            self.pdf = pdf2_read(filename if isinstance(filename, str) else BytesIO(filename))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2010 | <code>            for page in self.pdf.pages[from_page:to_page]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 2011 | <code>                lines.extend([t for t in page.extract_text().split("\n")])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2012 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2013 | <code>            logging.exception("Outlines exception")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2014 | <code>        self.outlines = extract_pdf_outlines(filename)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2016 | <code>        return [(line, "") for line in lines], []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2018 | <code>    def crop(self, ck, need_position):</code> | 定义 Python 函数 `crop`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2019 | <code>        raise NotImplementedError</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 2020 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2021 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2022 | <code>    def remove_tag(txt):</code> | 定义 Python 函数 `remove_tag`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2023 | <code>        raise NotImplementedError</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 2024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>class VisionParser(RAGFlowPdfParser):</code> | 定义 Python 类 `VisionParser`，封装相关状态、协议和方法。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2027 | <code>    def __init__(self, vision_model, *args, **kwargs):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2028 | <code>        super().__init__(*args, **kwargs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2029 | <code>        self.vision_model = vision_model</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2030 | <code>        self.outlines = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2032 | <code>    def __images__(self, fnm, zoomin=3, page_from=0, page_to=MAXIMUM_PAGE_NUMBER, callback=None):</code> | 定义 Python 函数 `__images__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2033 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2034 | <code>            with sys.modules[LOCK_KEY_pdfplumber]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2035 | <code>                self.pdf = pdfplumber.open(fnm) if isinstance(fnm, str) else pdfplumber.open(BytesIO(fnm))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2036 | <code>                self.page_images = [p.to_image(resolution=72 * zoomin).annotated for i, p in enumerate(self.pdf.pages[page_from:page_to])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2037 | <code>                self.total_page = len(self.pdf.pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2038 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2039 | <code>            self.page_images = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2040 | <code>            self.total_page = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2041 | <code>            logging.exception("VisionParser __images__")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2043 | <code>    def __call__(self, filename, from_page=0, to_page=MAXIMUM_PAGE_NUMBER, **kwargs):</code> | 定义 Python 函数 `__call__`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2044 | <code>        callback = kwargs.get("callback", lambda prog, msg: None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2045 | <code>        zoomin = kwargs.get("zoomin", 3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2046 | <code>        self.__images__(fnm=filename, zoomin=zoomin, page_from=from_page, page_to=to_page, callback=callback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2048 | <code>        total_pdf_pages = self.total_page</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2049 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2050 | <code>        start_page = max(0, from_page)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2051 | <code>        end_page = min(to_page, total_pdf_pages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2052 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2053 | <code>        all_docs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2055 | <code>        for idx, img_binary in enumerate(self.page_images or []):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 2056 | <code>            pdf_page_num = from_page + idx  # 0-based</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2057 | <code>            if pdf_page_num &lt; start_page or pdf_page_num &gt;= end_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2058 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2059 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2060 | <code>            from rag.app.picture import vision_llm_chunk as picture_vision_llm_chunk</code> | 导入 Python 依赖 `rag.app.picture`，供本模块调用其类型、函数或常量。 |
| 2061 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2062 | <code>            text = picture_vision_llm_chunk(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2063 | <code>                binary=img_binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2064 | <code>                vision_model=self.vision_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2065 | <code>                prompt=vision_llm_describe_prompt(page=pdf_page_num + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2066 | <code>                callback=callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2067 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2069 | <code>            if kwargs.get("callback"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2070 | <code>                kwargs["callback"](idx * 1.0 / len(self.page_images), f"Processed: {idx + 1}/{len(self.page_images)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2071 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2072 | <code>            if text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2073 | <code>                width, height = self.page_images[idx].size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2074 | <code>                all_docs.append((text, f"@@{pdf_page_num + 1}\t{0.0:.1f}\t{width / zoomin:.1f}\t{0.0:.1f}\t{height / zoomin:.1f}##"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 2075 | <code>        return all_docs, []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2076 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2077 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2078 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2079 | <code>    pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
