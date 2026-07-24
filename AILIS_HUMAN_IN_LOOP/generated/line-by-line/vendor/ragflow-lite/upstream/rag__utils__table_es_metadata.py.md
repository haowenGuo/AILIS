# vendor/ragflow-lite/upstream/rag__utils__table_es_metadata.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：278
- SHA-256：`97c0423c70839c9701d37d761cdaa92bbb7aac4064442dd33359ab45acc628f4`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/rag__utils__table_es_metadata.py)
- 依赖：`logging`、`common`、`common.metadata_utils`、`api.db.services.knowledgebase_service`
- 主要符号：`_knowledgebase_service_cls`、`merge_table_parser_config_from_kb`、`table_parser_strip_doc_metadata_keys`、`_field_map_typed_key_for_column`、`_probe_es_typed_key_for_column`、`_resolve_es_chunk_field_key`、`_value_to_meta_string`、`_es_raw_field_key_from_typed`、`_es_field_value_to_doc_metadata`、`aggregate_table_doc_metadata`

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
| 17 | <code>"""Table manual-mode ES field resolution and document metadata aggregation (lightweight; used by task_executor)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>from common import settings</code> | 导入 Python 依赖 `common`，供本模块调用其类型、函数或常量。 |
| 22 | <code>from common.metadata_utils import dedupe_list</code> | 导入 Python 依赖 `common.metadata_utils`，供本模块调用其类型、函数或常量。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>def _knowledgebase_service_cls():</code> | 定义 Python 函数 `_knowledgebase_service_cls`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 26 | <code>    """Lazy import for KnowledgebaseService (used by aggregate; mockable in unit tests)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 27 | <code>    from api.db.services.knowledgebase_service import KnowledgebaseService</code> | 导入 Python 依赖 `api.db.services.knowledgebase_service`，供本模块调用其类型、函数或常量。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>    return KnowledgebaseService</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>def merge_table_parser_config_from_kb(task: dict) -&gt; dict:</code> | 定义 Python 函数 `merge_table_parser_config_from_kb`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 33 | <code>    """Merge dataset-level table parser keys into document parser_config (see build_chunks)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 34 | <code>    pc = task.get("parser_config") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 35 | <code>    if task.get("parser_id", "").lower() != "table" or not task.get("kb_parser_config"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 36 | <code>        return pc</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 37 | <code>    out = dict(pc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 38 | <code>    kb_pc = task["kb_parser_config"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 39 | <code>    for _k in ("table_column_mode", "table_column_roles", "table_column_names"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 40 | <code>        if _k in kb_pc:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 41 | <code>            out[_k] = kb_pc[_k]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 42 | <code>    return out</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>def table_parser_strip_doc_metadata_keys(eff_parser_config: dict) -&gt; frozenset[str]:</code> | 定义 Python 函数 `table_parser_strip_doc_metadata_keys`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 46 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 47 | <code>    Table manual mode stores per-column values under document metadata keys equal to the</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 48 | <code>    CSV column name. On reparse, strip these keys from existing metadata before merging</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 49 | <code>    a fresh aggregate so columns switched to indexing-only (or removed) do not persist.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 50 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 51 | <code>    names = eff_parser_config.get("table_column_names")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 52 | <code>    if names:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 53 | <code>        return frozenset(str(n).strip() for n in names if n is not None and str(n).strip())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 54 | <code>    roles = eff_parser_config.get("table_column_roles") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>    return frozenset(str(k).strip() for k in roles if k is not None and str(k).strip())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>def _field_map_typed_key_for_column(field_map: dict, col: str) -&gt; str &#124; None:</code> | 定义 Python 函数 `_field_map_typed_key_for_column`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 59 | <code>    """Map CSV column name to ES typed field key (field_map: typed_key -&gt; display name)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 60 | <code>    if not field_map or not col:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 61 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 62 | <code>    col_s = str(col).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 63 | <code>    col_norm = col_s.replace("_", " ").strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 64 | <code>    for tk, disp in field_map.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 65 | <code>        disp_s = str(disp).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 66 | <code>        if disp_s.lower() == col_norm or disp_s.lower() == col_s.lower():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 67 | <code>            return tk</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 68 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>def _probe_es_typed_key_for_column(col: str, sample_chunk: dict) -&gt; str &#124; None:</code> | 定义 Python 函数 `_probe_es_typed_key_for_column`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 72 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 73 | <code>    When field_map is missing/stale, try to infer the ES field key present on a chunk.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 74 | <code>    Table chunks use normalized/pinyin keys of the form &lt;normalized_base&gt;&lt;suffix&gt;, where suffix is</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 75 | <code>    one of: _raw, _tks, _dt, _long, _flt, _kwd (see rag/app/table.py).</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 76 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 77 | <code>    if not col or not isinstance(sample_chunk, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 78 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 79 | <code>    base_raw = str(col).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 80 | <code>    if not base_raw:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 81 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 82 | <code>    base_norm = base_raw.replace("_", " ").strip().lower().replace(" ", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 83 | <code>    suffixes = ("_tks", "_raw", "_dt", "_long", "_flt", "_kwd")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 84 | <code>    for key in sample_chunk.keys():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 85 | <code>        key_s = str(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 86 | <code>        if not key_s:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 87 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 88 | <code>        key_norm = key_s.strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 89 | <code>        if key_norm == base_raw.lower() or key_norm.replace("_", "").replace(" ", "") == base_norm:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 90 | <code>            return key_s</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 91 | <code>    for key in sample_chunk.keys():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 92 | <code>        key_s = str(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 93 | <code>        if not key_s:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 94 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 95 | <code>        key_lower = key_s.lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 96 | <code>        for sfx in suffixes:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 97 | <code>            if key_lower.endswith(sfx):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 98 | <code>                core = key_lower[: -len(sfx)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>                core_norm = core.replace("_", "").replace(" ", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 100 | <code>                if core_norm == base_norm:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 101 | <code>                    return key_s</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>def _resolve_es_chunk_field_key(col: str, field_map: dict, sample_chunk: dict &#124; None) -&gt; tuple[str &#124; None, str]:</code> | 定义 Python 函数 `_resolve_es_chunk_field_key`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>    """Prefer field_map when key exists on chunk; else probe by suffix (matches table.py naming)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 107 | <code>    tk_fm = _field_map_typed_key_for_column(field_map, col) if field_map else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>    if sample_chunk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 109 | <code>        if tk_fm and tk_fm in sample_chunk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 110 | <code>            return tk_fm, "field_map"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 111 | <code>        probed = _probe_es_typed_key_for_column(col, sample_chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 112 | <code>        if probed:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 113 | <code>            return probed, "probe" if not tk_fm else "probe_field_map_mismatch"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 114 | <code>        if tk_fm:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 115 | <code>            return tk_fm, "field_map_absent_on_chunk"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 116 | <code>    if tk_fm:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 117 | <code>        return tk_fm, "field_map"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 118 | <code>    return None, "none"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>def _value_to_meta_string(val) -&gt; str &#124; None:</code> | 定义 Python 函数 `_value_to_meta_string`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 122 | <code>    """Normalize chunk field values for DocMetadataService (strings / list of strings only)."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 123 | <code>    if val is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 124 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 125 | <code>    if isinstance(val, bool):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 126 | <code>        return str(val).lower()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 127 | <code>    if isinstance(val, (int, float)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 128 | <code>        return str(val)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 129 | <code>    if isinstance(val, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 130 | <code>        s = val.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 131 | <code>        return s if s else None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 132 | <code>    return str(val)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>def _es_raw_field_key_from_typed(tk: str &#124; None) -&gt; str &#124; None:</code> | 定义 Python 函数 `_es_raw_field_key_from_typed`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 136 | <code>    """ES text columns use *_tks (tokenized); raw display value is stored as {same_base}_raw (see rag/app/table.py)."""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 137 | <code>    if not tk or not tk.endswith("_tks"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 138 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 139 | <code>    return tk[: -len("_tks")] + "_raw"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>def _es_field_value_to_doc_metadata(val, *, from_tks_fallback: bool) -&gt; str &#124; None:</code> | 定义 Python 函数 `_es_field_value_to_doc_metadata`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>    """Prefer raw strings; for legacy *_tks tokenized fields, normalize list/str to a single display string."""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 144 | <code>    if val is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 145 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 146 | <code>    if from_tks_fallback and isinstance(val, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 147 | <code>        parts = [str(x).strip() for x in val if x is not None and str(x).strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 148 | <code>        if not parts:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 149 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 150 | <code>        return " ".join(parts)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 151 | <code>    return _value_to_meta_string(val)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>def aggregate_table_doc_metadata(chunks: list, task: dict) -&gt; dict:</code> | 定义 Python 函数 `aggregate_table_doc_metadata`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 155 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 156 | <code>    Collect unique values per metadata/both column across chunks for document-level metadata.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 157 | <code>    Works for both table_column_mode == manual and auto (where all columns default to "both").</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 158 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 159 | <code>    logging.debug(f"[TABLE_META_DEBUG] aggregate_table_doc_metadata called with {len(chunks)} chunks")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>    eff = merge_table_parser_config_from_kb(task)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>    mode = eff.get("table_column_mode") or "auto"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 162 | <code>    if mode not in ("manual", "auto"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 163 | <code>        logging.debug(f"[TABLE_META_DEBUG] skip aggregate: table_column_mode={mode!r}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 164 | <code>        return {}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 165 | <code>    roles = eff.get("table_column_roles") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>    table_column_names = eff.get("table_column_names") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 167 | <code>    # Reload table_column_names from KB if empty (chunk() writes them during parse,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 168 | <code>    # but the task snapshot may be stale)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 169 | <code>    if not table_column_names:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 170 | <code>        kb_id = task.get("kb_id")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 171 | <code>        if kb_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 172 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 173 | <code>                KBS = _knowledgebase_service_cls()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 174 | <code>                ok, kb = KBS.get_by_id(kb_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 175 | <code>                if ok and kb:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 176 | <code>                    fresh_names = (kb.parser_config or {}).get("table_column_names") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 177 | <code>                    if fresh_names:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 178 | <code>                        table_column_names = fresh_names</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 179 | <code>                        logging.debug(f"[TABLE_META_DEBUG] reloaded table_column_names from DB: {fresh_names}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 180 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 181 | <code>                logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 182 | <code>                    "[TABLE_META_DEBUG] failed to reload table_column_names from DB: %s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 183 | <code>                    e,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 184 | <code>                    exc_info=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 185 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    if table_column_names:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 187 | <code>        meta_cols = [col for col in table_column_names if roles.get(col, "both") in ("metadata", "both")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 189 | <code>        meta_cols = [c for c, r in roles.items() if r in ("metadata", "both")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 190 | <code>    if not meta_cols:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 191 | <code>        logging.debug(f"[TABLE_META_DEBUG] skip aggregate: no metadata/both columns (table_column_names_present={bool(table_column_names)})")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 192 | <code>        return {}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 193 | <code>    fm = (task.get("kb_parser_config") or {}).get("field_map") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 194 | <code>    kb_id = task.get("kb_id")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 195 | <code>    if not fm and kb_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 196 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 197 | <code>            KBS = _knowledgebase_service_cls()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 198 | <code>            ok, kb = KBS.get_by_id(kb_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 199 | <code>            if ok and kb:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 200 | <code>                fresh_pc = kb.parser_config or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 201 | <code>                reloaded = fresh_pc.get("field_map") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 202 | <code>                if reloaded:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 203 | <code>                    fm = reloaded</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 204 | <code>                    logging.debug(f"[TABLE_META_DEBUG] reloaded field_map from DB: {len(fm)} entries")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 205 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 206 | <code>                    logging.debug("[TABLE_META_DEBUG] KB reload: parser_config has no field_map yet; will use ES key probe on chunk dicts if applicable")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 207 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 208 | <code>            logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 209 | <code>                "[TABLE_META_DEBUG] failed to reload field_map from DB: %s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 210 | <code>                e,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 211 | <code>                exc_info=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 212 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>    if not fm and not (settings.DOC_ENGINE_INFINITY or settings.DOC_ENGINE_OCEANBASE):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 214 | <code>        logging.debug(f"[TABLE_META_DEBUG] field_map empty on task snapshot — will use ES key probe on chunk dicts; kb_parser_config keys={list((task.get('kb_parser_config') or {}).keys())}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 215 | <code>    logging.debug(f"[TABLE_META_DEBUG] meta_cols={meta_cols}, field_map entries={len(fm)}, infinity={settings.DOC_ENGINE_INFINITY}, oceanbase={settings.DOC_ENGINE_OCEANBASE}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 216 | <code>    sample_ck = next((c for c in chunks if isinstance(c, dict)), None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 217 | <code>    if sample_ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 218 | <code>        sk = [k for k in sample_ck.keys() if not (str(k).startswith("q_") and str(k).endswith("_vec"))][:50]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 219 | <code>        logging.debug(f"[TABLE_META_DEBUG] first chunk non-vector keys (sample): {sk}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>    es_col_keys: dict[str, tuple[str &#124; None, str]] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 222 | <code>    if not (settings.DOC_ENGINE_INFINITY or settings.DOC_ENGINE_OCEANBASE):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 223 | <code>        for col in meta_cols:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 224 | <code>            tk, src = _resolve_es_chunk_field_key(col, fm, sample_ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 225 | <code>            es_col_keys[col] = (tk, src)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 226 | <code>            logging.debug(f"[TABLE_META_DEBUG] column '{col}' -&gt; ES key {tk!r} (source={src})")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    acc: dict[str, list] = {c: [] for c in meta_cols}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>    for i, ck in enumerate(chunks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 231 | <code>        if not isinstance(ck, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 232 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 233 | <code>        if settings.DOC_ENGINE_INFINITY or settings.DOC_ENGINE_OCEANBASE:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 234 | <code>            cd = ck.get("chunk_data")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 235 | <code>            if not isinstance(cd, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 236 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 237 | <code>            for col in meta_cols:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 238 | <code>                if col not in cd:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 239 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 240 | <code>                s = _value_to_meta_string(cd[col])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 241 | <code>                if s is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 242 | <code>                    acc[col].append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 243 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 244 | <code>            for col in meta_cols:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 245 | <code>                tk, _src = es_col_keys.get(col, (None, "none"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>                if not tk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 247 | <code>                    if i == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 248 | <code>                        logging.debug(f"[TABLE_META_DEBUG] no resolved ES key for column '{col}'")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 249 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 250 | <code>                raw_k = _es_raw_field_key_from_typed(tk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 251 | <code>                val = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 252 | <code>                from_tks = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 253 | <code>                if raw_k and raw_k in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 254 | <code>                    val = ck[raw_k]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 255 | <code>                elif tk in ck:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 256 | <code>                    val = ck[tk]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 257 | <code>                    from_tks = tk.endswith("_tks")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 258 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 259 | <code>                    if i == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 260 | <code>                        logging.debug(f"[TABLE_META_DEBUG] chunk missing ES field {tk!r}{' and ' + raw_k + ' (raw)' if raw_k else ''} for column '{col}'")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 261 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 262 | <code>                s = _es_field_value_to_doc_metadata(val, from_tks_fallback=from_tks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 263 | <code>                if s is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 264 | <code>                    acc[col].append(s)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>    for col, vals in acc.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 267 | <code>        logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 268 | <code>            "[TABLE_META_DEBUG] Column '%s' values found (count=%d)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 269 | <code>            col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 270 | <code>            len(vals),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 271 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>    out = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 274 | <code>    for col, vals in acc.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 275 | <code>        if vals:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 276 | <code>            out[col] = dedupe_list(vals)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 277 | <code>    logging.debug(f"[TABLE_META_DEBUG] aggregated metadata dict keys={list(out.keys())}, sizes={[len(v) for v in out.values()]}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 278 | <code>    return out</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
