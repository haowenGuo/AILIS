# vendor/ragflow-lite/upstream/rag__svr__task_executor.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：1926
- SHA-256：`f4cba671227f7a1a12463daece5061db755fc83fa47d7d4b960f7872e2ee3cc2`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/rag__svr__task_executor.py)
- 依赖：`argparse`、`time`、`rag.svr.task_executor_refactor.task_manager`、`rag.svr.task_executor_refactor.recording_context`、`os`、`common.misc_utils`、`asyncio`、`socket`、`random`、`sys`、`threading`、`api.db`、`api.db.services.knowledgebase_service`、`api.db.services.pipeline_operation_log_service`、`api.db.joint_services.memory_message_service`、`common.connection_utils`、`common.metadata_utils`、`rag.utils.base64_image`、`rag.utils.raptor_utils`、`common.log_utils`、`common.config_utils`、`rag.graphrag.utils`、`rag.prompts.generator`、`logging`、`datetime`、`json`、`xxhash`、`copy`、`re`、`functools`、`multiprocessing.context`、`timeit`、`signal`、`exceptiongroup`、`faulthandler`、`numpy`、`peewee`、`common.constants`、`api.db.services.document_service`、`api.db.services.doc_metadata_service`、`api.db.services.llm_service`、`api.db.services.task_service`、`api.db.services.file2document_service`、`api.db.joint_services.tenant_model_service`、`common.versions`、`api.db.db_models`、`rag.app`、`rag.nlp`、`rag.raptor`、`common.token_utils`、`rag.utils.redis_conn`、`common.signal_utils`、`common.exceptions`、`rag.svr.task_executor_limiter`、`common`、`rag.utils.table_es_metadata`、`common.float_utils`、`api.db.services.canvas_service`、`rag.flow.pipeline`、`common.doc_store.doc_store_base`、`rag.graphrag.general.index`
- 主要符号：`signal_handler`、`set_progress`、`collect`、`get_storage_binary`、`build_chunks`、`upload_to_minio`、`doc_keyword_extraction`、`doc_question_proposal`、`gen_metadata_task`、`doc_content_tagging`、`build_TOC`、`init_kb`、`embedding`、`batch_encode`、`run_dataflow`、`get_raptor_chunk_field_map`、`search_fields`、`get_raptor_chunk_methods`、`has_raptor_chunks`、`delete_raptor_chunks`、`run_raptor_for_kb`、`schedule_raptor_cleanup`、`skip_raptor_doc`、`generate`、`delete_image`、`insert_chunks`、`for`、`do_handle_task`、`_maybe_insert_chunks`、`handle_task`、`get_server_ip`、`report_status`、`task_manager`、`main`

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
| 15 | <code>import argparse</code> | 导入 Python 依赖 `argparse`，供本模块调用其类型、函数或常量。 |
| 16 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>from rag.svr.task_executor_refactor.task_manager import TaskManager</code> | 导入 Python 依赖 `rag.svr.task_executor_refactor.task_manager`，供本模块调用其类型、函数或常量。 |
| 19 | <code>from rag.svr.task_executor_refactor.recording_context import timed_with_recording, get_recording_context, RecordingContext, set_recording_context, NullRecordingContext</code> | 导入 Python 依赖 `rag.svr.task_executor_refactor.recording_context`，供本模块调用其类型、函数或常量。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>start_ts = time.time()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code># LiteLLM fetches a model cost map from GitHub during import unless this is set.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 24 | <code># Parser pods should not block startup on external network access.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 25 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>os.environ.setdefault("LITELLM_LOCAL_MODEL_COST_MAP", "True")  # no internet, save about 10s</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>from common.misc_utils import thread_pool_exec</code> | 导入 Python 依赖 `common.misc_utils`，供本模块调用其类型、函数或常量。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 32 | <code>import socket</code> | 导入 Python 依赖 `socket`，供本模块调用其类型、函数或常量。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code># from beartype import BeartypeConf</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 35 | <code># from beartype.claw import beartype_all  # &lt;-- you didn't sign up for this</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 36 | <code># beartype_all(conf=BeartypeConf(violation_type=UserWarning))    # &lt;-- emit warnings from all code</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 37 | <code>import random</code> | 导入 Python 依赖 `random`，供本模块调用其类型、函数或常量。 |
| 38 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 39 | <code>import threading</code> | 导入 Python 依赖 `threading`，供本模块调用其类型、函数或常量。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>from api.db import PIPELINE_SPECIAL_PROGRESS_FREEZE_TASK_TYPES</code> | 导入 Python 依赖 `api.db`，供本模块调用其类型、函数或常量。 |
| 42 | <code>from api.db.services.knowledgebase_service import KnowledgebaseService</code> | 导入 Python 依赖 `api.db.services.knowledgebase_service`，供本模块调用其类型、函数或常量。 |
| 43 | <code>from api.db.services.pipeline_operation_log_service import PipelineOperationLogService</code> | 导入 Python 依赖 `api.db.services.pipeline_operation_log_service`，供本模块调用其类型、函数或常量。 |
| 44 | <code>from api.db.joint_services.memory_message_service import handle_save_to_memory_task</code> | 导入 Python 依赖 `api.db.joint_services.memory_message_service`，供本模块调用其类型、函数或常量。 |
| 45 | <code>from common.connection_utils import timeout</code> | 导入 Python 依赖 `common.connection_utils`，供本模块调用其类型、函数或常量。 |
| 46 | <code>from common.metadata_utils import turn2jsonschema, update_metadata_to</code> | 导入 Python 依赖 `common.metadata_utils`，供本模块调用其类型、函数或常量。 |
| 47 | <code>from rag.utils.base64_image import image2id</code> | 导入 Python 依赖 `rag.utils.base64_image`，供本模块调用其类型、函数或常量。 |
| 48 | <code>from rag.utils.raptor_utils import (</code> | 导入 Python 依赖 `rag.utils.raptor_utils`，供本模块调用其类型、函数或常量。 |
| 49 | <code>    collect_raptor_chunk_ids,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 50 | <code>    collect_raptor_methods,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 51 | <code>    get_raptor_clustering_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 52 | <code>    get_raptor_tree_builder,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 53 | <code>    get_skip_reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 54 | <code>    make_raptor_summary_chunk_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>    should_skip_raptor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 56 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>from common.log_utils import init_root_logger</code> | 导入 Python 依赖 `common.log_utils`，供本模块调用其类型、函数或常量。 |
| 58 | <code>from common.config_utils import show_configs</code> | 导入 Python 依赖 `common.config_utils`，供本模块调用其类型、函数或常量。 |
| 59 | <code>from rag.graphrag.utils import get_llm_cache, set_llm_cache, get_tags_from_cache, set_tags_to_cache</code> | 导入 Python 依赖 `rag.graphrag.utils`，供本模块调用其类型、函数或常量。 |
| 60 | <code>from rag.prompts.generator import keyword_extraction, question_proposal, content_tagging, run_toc_from_text, gen_metadata</code> | 导入 Python 依赖 `rag.prompts.generator`，供本模块调用其类型、函数或常量。 |
| 61 | <code>import logging</code> | 导入 Python 依赖 `logging`，供本模块调用其类型、函数或常量。 |
| 62 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 63 | <code>from datetime import datetime</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 64 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 65 | <code>import xxhash</code> | 导入 Python 依赖 `xxhash`，供本模块调用其类型、函数或常量。 |
| 66 | <code>import copy</code> | 导入 Python 依赖 `copy`，供本模块调用其类型、函数或常量。 |
| 67 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 68 | <code>from functools import partial</code> | 导入 Python 依赖 `functools`，供本模块调用其类型、函数或常量。 |
| 69 | <code>from multiprocessing.context import TimeoutError</code> | 导入 Python 依赖 `multiprocessing.context`，供本模块调用其类型、函数或常量。 |
| 70 | <code>from timeit import default_timer as timer</code> | 导入 Python 依赖 `timeit`，供本模块调用其类型、函数或常量。 |
| 71 | <code>import signal</code> | 导入 Python 依赖 `signal`，供本模块调用其类型、函数或常量。 |
| 72 | <code>import exceptiongroup</code> | 导入 Python 依赖 `exceptiongroup`，供本模块调用其类型、函数或常量。 |
| 73 | <code>import faulthandler</code> | 导入 Python 依赖 `faulthandler`，供本模块调用其类型、函数或常量。 |
| 74 | <code>import numpy as np</code> | 导入 Python 依赖 `numpy`，供本模块调用其类型、函数或常量。 |
| 75 | <code>from peewee import DoesNotExist</code> | 导入 Python 依赖 `peewee`，供本模块调用其类型、函数或常量。 |
| 76 | <code>from common.constants import LLMType, ParserType, PipelineTaskType</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 77 | <code>from api.db.services.document_service import DocumentService</code> | 导入 Python 依赖 `api.db.services.document_service`，供本模块调用其类型、函数或常量。 |
| 78 | <code>from api.db.services.doc_metadata_service import DocMetadataService</code> | 导入 Python 依赖 `api.db.services.doc_metadata_service`，供本模块调用其类型、函数或常量。 |
| 79 | <code>from api.db.services.llm_service import LLMBundle</code> | 导入 Python 依赖 `api.db.services.llm_service`，供本模块调用其类型、函数或常量。 |
| 80 | <code>from api.db.services.task_service import TaskService, has_canceled, CANVAS_DEBUG_DOC_ID, GRAPH_RAPTOR_FAKE_DOC_ID</code> | 导入 Python 依赖 `api.db.services.task_service`，供本模块调用其类型、函数或常量。 |
| 81 | <code>from api.db.services.file2document_service import File2DocumentService</code> | 导入 Python 依赖 `api.db.services.file2document_service`，供本模块调用其类型、函数或常量。 |
| 82 | <code>from api.db.joint_services.tenant_model_service import get_tenant_default_model_by_type, get_model_config_from_provider_instance</code> | 导入 Python 依赖 `api.db.joint_services.tenant_model_service`，供本模块调用其类型、函数或常量。 |
| 83 | <code>from common.versions import get_ragflow_version</code> | 导入 Python 依赖 `common.versions`，供本模块调用其类型、函数或常量。 |
| 84 | <code>from api.db.db_models import close_connection</code> | 导入 Python 依赖 `api.db.db_models`，供本模块调用其类型、函数或常量。 |
| 85 | <code>from rag.app import laws, paper, presentation, manual, qa, table, book, resume, picture, naive, one, audio, email, tag</code> | 导入 Python 依赖 `rag.app`，供本模块调用其类型、函数或常量。 |
| 86 | <code>from rag.nlp import search, rag_tokenizer, add_positions</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 87 | <code>from rag.raptor import (</code> | 导入 Python 依赖 `rag.raptor`，供本模块调用其类型、函数或常量。 |
| 88 | <code>    RAPTOR_TREE_BUILDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 89 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>from common.token_utils import num_tokens_from_string, truncate</code> | 导入 Python 依赖 `common.token_utils`，供本模块调用其类型、函数或常量。 |
| 91 | <code>from rag.utils.redis_conn import REDIS_CONN, RedisDistributedLock</code> | 导入 Python 依赖 `rag.utils.redis_conn`，供本模块调用其类型、函数或常量。 |
| 92 | <code>from rag.graphrag.utils import chat_limiter</code> | 导入 Python 依赖 `rag.graphrag.utils`，供本模块调用其类型、函数或常量。 |
| 93 | <code>from common.signal_utils import start_tracemalloc_and_snapshot, stop_tracemalloc</code> | 导入 Python 依赖 `common.signal_utils`，供本模块调用其类型、函数或常量。 |
| 94 | <code>from common.exceptions import TaskCanceledException</code> | 导入 Python 依赖 `common.exceptions`，供本模块调用其类型、函数或常量。 |
| 95 | <code>from rag.svr.task_executor_limiter import (</code> | 导入 Python 依赖 `rag.svr.task_executor_limiter`，供本模块调用其类型、函数或常量。 |
| 96 | <code>    task_limiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 97 | <code>    chunk_limiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 98 | <code>    embed_limiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 99 | <code>    minio_limiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 100 | <code>    kg_limiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 101 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>from common import settings</code> | 导入 Python 依赖 `common`，供本模块调用其类型、函数或常量。 |
| 103 | <code>from common.constants import PAGERANK_FLD, TAG_FLD, SVR_CONSUMER_GROUP_NAME</code> | 导入 Python 依赖 `common.constants`，供本模块调用其类型、函数或常量。 |
| 104 | <code>from rag.utils.table_es_metadata import (</code> | 导入 Python 依赖 `rag.utils.table_es_metadata`，供本模块调用其类型、函数或常量。 |
| 105 | <code>    aggregate_table_doc_metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 106 | <code>    merge_table_parser_config_from_kb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 107 | <code>    table_parser_strip_doc_metadata_keys,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 108 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>from rag.nlp import search as nlp_search</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>BATCH_SIZE = 64</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>FACTORY = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 115 | <code>    "general": naive,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 116 | <code>    ParserType.NAIVE.value: naive,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 117 | <code>    ParserType.PAPER.value: paper,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 118 | <code>    ParserType.BOOK.value: book,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 119 | <code>    ParserType.PRESENTATION.value: presentation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 120 | <code>    ParserType.MANUAL.value: manual,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 121 | <code>    ParserType.LAWS.value: laws,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 122 | <code>    ParserType.QA.value: qa,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 123 | <code>    ParserType.TABLE.value: table,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 124 | <code>    ParserType.RESUME.value: resume,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 125 | <code>    ParserType.PICTURE.value: picture,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 126 | <code>    ParserType.ONE.value: one,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 127 | <code>    ParserType.AUDIO.value: audio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 128 | <code>    ParserType.EMAIL.value: email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 129 | <code>    ParserType.KG.value: naive,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 130 | <code>    ParserType.TAG.value: tag,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 131 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>TASK_TYPE_TO_PIPELINE_TASK_TYPE = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 134 | <code>    "dataflow": PipelineTaskType.PARSE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 135 | <code>    "raptor": PipelineTaskType.RAPTOR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 136 | <code>    "graphrag": PipelineTaskType.GRAPH_RAG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 137 | <code>    "mindmap": PipelineTaskType.MINDMAP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 138 | <code>    "memory": PipelineTaskType.MEMORY,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 139 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>UNACKED_ITERATOR = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 142 | <code># Task type and executor index (consistent with SAAS version)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 143 | <code>TASK_TYPE = "common"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 144 | <code>TE_IDX = "0"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>BOOT_AT = datetime.now().astimezone().isoformat(timespec="milliseconds")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 147 | <code>PENDING_TASKS = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 148 | <code>LAG_TASKS = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 149 | <code>DONE_TASKS = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 150 | <code>FAILED_TASKS = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>CURRENT_TASKS = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>WORKER_HEARTBEAT_TIMEOUT = int(os.environ.get("WORKER_HEARTBEAT_TIMEOUT", "120"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 155 | <code>stop_event = threading.Event()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>def signal_handler(sig, frame):</code> | 定义 Python 函数 `signal_handler`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 159 | <code>    logging.info("Received interrupt signal, shutting down...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 160 | <code>    stop_event.set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 161 | <code>    time.sleep(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 162 | <code>    sys.exit(0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>def set_progress(task_id, from_page=0, to_page=-1, prog=None, msg="Processing..."):</code> | 定义 Python 函数 `set_progress`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 166 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 167 | <code>        if prog is not None and prog &lt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 168 | <code>            msg = "[ERROR]" + msg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 169 | <code>        cancel = has_canceled(task_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>        if cancel:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 172 | <code>            msg += " [Canceled]"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 173 | <code>            prog = -1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>        if to_page &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 176 | <code>            if msg:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 177 | <code>                if from_page &lt; to_page:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 178 | <code>                    msg = f"Page({from_page + 1}~{to_page + 1}): " + msg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 179 | <code>        if msg:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 180 | <code>            msg = datetime.now().strftime("%H:%M:%S") + " " + msg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 181 | <code>        d = {"progress_msg": msg}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 182 | <code>        if prog is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 183 | <code>            d["progress"] = prog</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>        TaskService.update_progress(task_id, d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>        close_connection()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 188 | <code>        if cancel:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 189 | <code>            raise TaskCanceledException(msg)</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 190 | <code>        logging.info(f"set_progress({task_id}), progress: {prog}, progress_msg: {msg}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 191 | <code>    except TaskCanceledException:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 192 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 193 | <code>    except DoesNotExist:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 194 | <code>        logging.warning(f"set_progress({task_id}) got exception DoesNotExist")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 195 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 196 | <code>        logging.exception(f"set_progress({task_id}), progress: {prog}, progress_msg: {msg}, got exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>async def collect():</code> | 定义 Python 函数 `collect`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 200 | <code>    global CONSUMER_NAME, DONE_TASKS, FAILED_TASKS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 201 | <code>    global UNACKED_ITERATOR</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    svr_queue_names = settings.get_svr_queue_names(TASK_TYPE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>    redis_msg = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 206 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 207 | <code>        if not UNACKED_ITERATOR:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 208 | <code>            UNACKED_ITERATOR = REDIS_CONN.get_unacked_iterator(svr_queue_names, SVR_CONSUMER_GROUP_NAME, CONSUMER_NAME)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 209 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 210 | <code>            redis_msg = next(UNACKED_ITERATOR)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 211 | <code>        except StopIteration:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 212 | <code>            for svr_queue_name in svr_queue_names:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 213 | <code>                redis_msg = REDIS_CONN.queue_consumer(svr_queue_name, SVR_CONSUMER_GROUP_NAME, CONSUMER_NAME)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 214 | <code>                if redis_msg:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 215 | <code>                    break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 216 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 217 | <code>        logging.exception(f"collect got exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 218 | <code>        return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>    if not redis_msg:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 221 | <code>        return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 222 | <code>    msg = redis_msg.get_message()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 223 | <code>    if not msg:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 224 | <code>        logging.error(f"collect got empty message of {redis_msg.get_msg_id()}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 225 | <code>        redis_msg.ack()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 226 | <code>        return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    canceled = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 229 | <code>    if msg.get("doc_id", "") in [GRAPH_RAPTOR_FAKE_DOC_ID, CANVAS_DEBUG_DOC_ID]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 230 | <code>        task = msg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 231 | <code>        if task["task_type"] in PIPELINE_SPECIAL_PROGRESS_FREEZE_TASK_TYPES:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 232 | <code>            task = TaskService.get_task(msg["id"], msg["doc_ids"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 233 | <code>            if task:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 234 | <code>                task["doc_id"] = msg["doc_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 235 | <code>                task["doc_ids"] = msg.get("doc_ids", []) or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 236 | <code>    elif msg.get("task_type") == PipelineTaskType.MEMORY.lower():</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 237 | <code>        _, task_obj = TaskService.get_by_id(msg["id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 238 | <code>        task = task_obj.to_dict()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 239 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 240 | <code>        task = TaskService.get_task(msg["id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>    if task:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 243 | <code>        canceled = has_canceled(task["id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 244 | <code>    if not task or canceled:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 245 | <code>        state = "is unknown" if not task else "has been cancelled"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 246 | <code>        FAILED_TASKS += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 247 | <code>        logging.warning(f"collect task {msg['id']} {state}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 248 | <code>        redis_msg.ack()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 249 | <code>        return None, None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>    task_type = msg.get("task_type", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 252 | <code>    task["task_type"] = task_type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 253 | <code>    if task_type[:8] == "dataflow":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 254 | <code>        task["tenant_id"] = msg["tenant_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 255 | <code>        task["dataflow_id"] = msg["dataflow_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 256 | <code>        task["kb_id"] = msg.get("kb_id", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 257 | <code>    if task_type[:6] == "memory":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 258 | <code>        task["memory_id"] = msg["memory_id"]</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 259 | <code>        if msg.get("tenant_id"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 260 | <code>            task["tenant_id"] = msg["tenant_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 261 | <code>        task["source_id"] = msg["source_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 262 | <code>        task["message_dict"] = msg["message_dict"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 263 | <code>    return redis_msg, task</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>async def get_storage_binary(bucket, name):</code> | 定义 Python 函数 `get_storage_binary`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 267 | <code>    return await thread_pool_exec(settings.STORAGE_IMPL.get, bucket, name)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>@timed_with_recording</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 271 | <code>@timeout(60 * 80, 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 272 | <code>async def build_chunks(task, progress_callback):</code> | 定义 Python 函数 `build_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 273 | <code>    if task["size"] &gt; settings.DOC_MAXIMUM_SIZE:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 274 | <code>        set_progress(task["id"], prog=-1, msg="File size exceeds( &lt;= %dMb )" % (int(settings.DOC_MAXIMUM_SIZE / 1024 / 1024)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 275 | <code>        get_recording_context().record("file_size_exceeded", True)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 276 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 277 | <code>    get_recording_context().record("file_size_exceeded", False)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 278 | <code>    get_recording_context().record("parser_id", task["parser_id"])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>    chunker = FACTORY[task["parser_id"].lower()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 281 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 282 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 283 | <code>        bucket, name = File2DocumentService.get_storage_address(doc_id=task["doc_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 284 | <code>        binary = await get_storage_binary(bucket, name)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 285 | <code>        if binary is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 286 | <code>            raise FileNotFoundError(f"File not found: storage returned no content for {bucket}/{name}.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 287 | <code>        logging.info("From minio({}) {}/{}".format(timer() - st, task["location"], task["name"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 288 | <code>    except TimeoutError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 289 | <code>        progress_callback(-1, "Internal server error: Fetch file from minio timeout. Could you try it again.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 290 | <code>        logging.exception("Minio {}/{} got timeout: Fetch file from minio timeout.".format(task["location"], task["name"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 291 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 292 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 293 | <code>        if re.search("(No such file&#124;not found)", str(e)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 294 | <code>            progress_callback(-1, "Can not find file &lt;%s&gt; from minio. Could you try it again?" % task["name"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 295 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 296 | <code>            progress_callback(-1, "Get file from minio: %s" % str(e).replace("'", ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 297 | <code>        logging.exception("Chunking {}/{} got exception".format(task["location"], task["name"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 298 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>    # Table parser column roles / mode are stored on the dataset (KB) parser_config;</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 301 | <code>    # chunk tasks carry document-level parser_config only — merge KB keys so manual roles apply.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 302 | <code>    parser_config_for_chunk = merge_table_parser_config_from_kb(task)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 303 | <code>    if task.get("parser_id", "").lower() == "table" and task.get("kb_parser_config"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 304 | <code>        logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 305 | <code>            "[TASK_EXECUTOR_DEBUG] table parser: merged KB keys into parser_config for chunk; "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 306 | <code>            f"mode={parser_config_for_chunk.get('table_column_mode')}, "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 307 | <code>            f"roles_keys={list((parser_config_for_chunk.get('table_column_roles') or {}).keys())}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 308 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>    # Record chunk configuration for comparison</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 311 | <code>    from common.float_utils import normalize_overlapped_percent</code> | 导入 Python 依赖 `common.float_utils`，供本模块调用其类型、函数或常量。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>    chunk_config = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 314 | <code>        "parser_id": task["parser_id"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 315 | <code>        "chunk_token_num": parser_config_for_chunk.get("chunk_token_num", 128),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 316 | <code>        "overlapped_percent": normalize_overlapped_percent(parser_config_for_chunk.get("overlapped_percent", 0)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 317 | <code>        "delimiter": parser_config_for_chunk.get("delimiter", "\n!?。；！？"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 318 | <code>        "from_page": task["from_page"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 319 | <code>        "to_page": task["to_page"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 320 | <code>        "language": task["language"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 321 | <code>        "layout_recognizer": parser_config_for_chunk.get("layout_recognizer"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    get_recording_context().record("chunk_config", chunk_config)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 324 | <code>    get_recording_context().record("parser_config_after_merge", parser_config_for_chunk)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 327 | <code>        async with chunk_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 328 | <code>            task_language = task.get("language") or "Chinese"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 329 | <code>            cks = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 330 | <code>                chunker.chunk,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 331 | <code>                task["name"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 332 | <code>                binary=binary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 333 | <code>                from_page=task["from_page"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 334 | <code>                to_page=task["to_page"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 335 | <code>                lang=task_language,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 336 | <code>                callback=progress_callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 337 | <code>                kb_id=task["kb_id"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 338 | <code>                parser_config=parser_config_for_chunk,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 339 | <code>                tenant_id=task["tenant_id"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 340 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>        logging.info("Chunking({}) {}/{} done".format(timer() - st, task["location"], task["name"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 342 | <code>    except TaskCanceledException:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 343 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 344 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 345 | <code>        progress_callback(-1, "Internal server error while chunking: %s" % str(e).replace("'", ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 346 | <code>        logging.exception("Chunking {}/{} got exception".format(task["location"], task["name"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 347 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>    # Record raw chunks for comparison</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 350 | <code>    get_recording_context().record("raw_chunks", cks)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>    # Extract and persist PDF outline if the parser attached it.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 353 | <code>    outline_data = cks[0].get("__outline__") if cks else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 354 | <code>    get_recording_context().record("outline_data", outline_data)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>    if cks and cks[0].get("__outline__"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 357 | <code>        outline = cks[0].pop("__outline__")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 358 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 359 | <code>            ret = DocMetadataService.update_document_metadata(task["doc_id"], update_metadata_to({"outline": outline}, DocMetadataService.get_document_metadata(task["doc_id"]) or {}))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 360 | <code>            get_recording_context().save_func_return_value("DocMetadataService.update_document_metadata", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 361 | <code>            logging.info("Persisted PDF outline (%d entries) for doc %s", len(outline), task["doc_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 362 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 363 | <code>            logging.warning("Failed to persist PDF outline for doc %s: %s", task["doc_id"], e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>    docs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 366 | <code>    doc = {"doc_id": task["doc_id"], "kb_id": str(task["kb_id"])}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 367 | <code>    if task["pagerank"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 368 | <code>        doc[PAGERANK_FLD] = int(task["pagerank"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 369 | <code>    st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>    @timeout(60)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 372 | <code>    async def upload_to_minio(document, chunk):</code> | 定义 Python 函数 `upload_to_minio`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 373 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 374 | <code>            d = copy.deepcopy(document)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 375 | <code>            d.update(chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 376 | <code>            d["id"] = xxhash.xxh64((chunk["content_with_weight"] + str(d["doc_id"])).encode("utf-8", "surrogatepass")).hexdigest()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 377 | <code>            d["create_time"] = str(datetime.now()).replace("T", " ")[:19]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 378 | <code>            d["create_timestamp_flt"] = datetime.now().timestamp()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 380 | <code>            if d.get("img_id"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 381 | <code>                docs.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 382 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>            if not d.get("image"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 385 | <code>                _ = d.pop("image", None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 386 | <code>                d["img_id"] = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 387 | <code>                docs.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 388 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 389 | <code>            await image2id(d, partial(settings.STORAGE_IMPL.put, tenant_id=task["tenant_id"]), d["id"], task["kb_id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 390 | <code>            docs.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 391 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 392 | <code>            logging.exception("Saving image of chunk {}/{}/{} got exception".format(task["location"], task["name"], d["id"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 393 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>    tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 396 | <code>    for ck in cks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 397 | <code>        tasks.append(asyncio.create_task(upload_to_minio(doc, ck)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 398 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 399 | <code>        await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 400 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 401 | <code>        logging.error(f"MINIO PUT({task['name']}) got exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 402 | <code>        for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 403 | <code>            t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 404 | <code>        await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 405 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>    el = timer() - st</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 408 | <code>    logging.info("MINIO PUT({}) cost {:.3f} s".format(task["name"], el))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>    # Record docs after MinIO upload</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 411 | <code>    get_recording_context().record("docs_after_prep", docs)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>    if task["parser_config"].get("auto_keywords", 0):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 414 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 415 | <code>        progress_callback(msg="Start to generate keywords for every chunk ...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 416 | <code>        chat_model_config = get_model_config_from_provider_instance(task["tenant_id"], LLMType.CHAT, task["llm_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 417 | <code>        chat_mdl = LLMBundle(task["tenant_id"], chat_model_config, lang=task["language"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>        async def doc_keyword_extraction(chat_mdl, d, topn):</code> | 定义 Python 函数 `doc_keyword_extraction`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 420 | <code>            cached = get_llm_cache(chat_mdl.llm_name, d["content_with_weight"], "keywords", {"topn": topn})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 421 | <code>            if not cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 422 | <code>                if has_canceled(task["id"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 423 | <code>                    progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 424 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 425 | <code>                async with chat_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 426 | <code>                    cached = await keyword_extraction(chat_mdl, d["content_with_weight"], topn)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 427 | <code>                set_llm_cache(chat_mdl.llm_name, d["content_with_weight"], cached, "keywords", {"topn": topn})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 428 | <code>            if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 429 | <code>                d["important_kwd"] = [k for k in re.split(r"[,，;；、\r\n]+", cached) if k.strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 430 | <code>                d["important_tks"] = rag_tokenizer.tokenize(" ".join(d["important_kwd"]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 431 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>        tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 434 | <code>        for d in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 435 | <code>            tasks.append(asyncio.create_task(doc_keyword_extraction(chat_mdl, d, task["parser_config"]["auto_keywords"])))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 436 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 437 | <code>            await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 438 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 439 | <code>            logging.error("Error in doc_keyword_extraction: {}".format(e))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 440 | <code>            for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 441 | <code>                t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 442 | <code>            await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 443 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 444 | <code>        progress_callback(msg="Keywords generation {} chunks completed in {:.2f}s".format(len(docs), timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>    # Record keywords extraction count</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 447 | <code>    keywords = [d for d in docs if d.get("important_kwd")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 448 | <code>    get_recording_context().record("keywords_extracted", keywords)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>    if task["parser_config"].get("auto_questions", 0):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 451 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 452 | <code>        progress_callback(msg="Start to generate questions for every chunk ...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 453 | <code>        chat_model_config = get_model_config_from_provider_instance(task["tenant_id"], LLMType.CHAT, task["llm_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 454 | <code>        chat_mdl = LLMBundle(task["tenant_id"], chat_model_config, lang=task["language"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>        async def doc_question_proposal(chat_mdl, d, topn):</code> | 定义 Python 函数 `doc_question_proposal`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 457 | <code>            cached = get_llm_cache(chat_mdl.llm_name, d["content_with_weight"], "question", {"topn": topn})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 458 | <code>            if not cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 459 | <code>                if has_canceled(task["id"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 460 | <code>                    progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 461 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 462 | <code>                async with chat_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 463 | <code>                    cached = await question_proposal(chat_mdl, d["content_with_weight"], topn)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 464 | <code>                set_llm_cache(chat_mdl.llm_name, d["content_with_weight"], cached, "question", {"topn": topn})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 465 | <code>            if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 466 | <code>                d["question_kwd"] = cached.split("\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 467 | <code>                d["question_tks"] = rag_tokenizer.tokenize("\n".join(d["question_kwd"]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>        tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 470 | <code>        for d in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 471 | <code>            tasks.append(asyncio.create_task(doc_question_proposal(chat_mdl, d, task["parser_config"]["auto_questions"])))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 472 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 473 | <code>            await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 474 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 475 | <code>            logging.error("Error in doc_question_proposal", exc_info=e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 476 | <code>            for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 477 | <code>                t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 478 | <code>            await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 479 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 480 | <code>        progress_callback(msg="Question generation {} chunks completed in {:.2f}s".format(len(docs), timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>    # Record question generation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 483 | <code>    questions = [d for d in docs if d.get("question_kwd")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 484 | <code>    get_recording_context().record("questions_generated", questions)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>    if task["parser_config"].get("enable_metadata", False) and (task["parser_config"].get("metadata") or task["parser_config"].get("built_in_metadata")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 487 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 488 | <code>        progress_callback(msg="Start to generate meta-data for every chunk ...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 489 | <code>        chat_model_config = get_model_config_from_provider_instance(task["tenant_id"], LLMType.CHAT, task["llm_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 490 | <code>        chat_mdl = LLMBundle(task["tenant_id"], chat_model_config, lang=task["language"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>        async def gen_metadata_task(chat_mdl, d):</code> | 定义 Python 函数 `gen_metadata_task`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 493 | <code>            metadata_conf = task["parser_config"].get("metadata", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 494 | <code>            built_in_metadata = list(task["parser_config"].get("built_in_metadata") or [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 495 | <code>            if isinstance(metadata_conf, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 496 | <code>                if not isinstance(metadata_conf.get("properties"), dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 497 | <code>                    metadata_conf = {"type": "object", "properties": {}}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 498 | <code>                if built_in_metadata:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 499 | <code>                    metadata_conf = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 500 | <code>                        **metadata_conf,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 501 | <code>                        "properties": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 502 | <code>                            **metadata_conf.get("properties", {}),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 503 | <code>                            **turn2jsonschema(built_in_metadata).get("properties", {}),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 504 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>            elif isinstance(metadata_conf, list):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 507 | <code>                metadata_conf = metadata_conf + built_in_metadata</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 508 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 509 | <code>                metadata_conf = built_in_metadata</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 510 | <code>            cached = get_llm_cache(chat_mdl.llm_name, d["content_with_weight"], "metadata", metadata_conf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 511 | <code>            if not cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 512 | <code>                if has_canceled(task["id"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 513 | <code>                    progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 514 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 515 | <code>                async with chat_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 516 | <code>                    cached = await gen_metadata(chat_mdl, turn2jsonschema(metadata_conf), d["content_with_weight"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 517 | <code>                set_llm_cache(chat_mdl.llm_name, d["content_with_weight"], cached, "metadata", metadata_conf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 518 | <code>            if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 519 | <code>                d["metadata_obj"] = cached</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>        tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 522 | <code>        for d in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 523 | <code>            tasks.append(asyncio.create_task(gen_metadata_task(chat_mdl, d)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 524 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 525 | <code>            await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 526 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 527 | <code>            logging.error("Error in doc_question_proposal", exc_info=e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 528 | <code>            for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 529 | <code>                t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 530 | <code>            await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 531 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 532 | <code>        metadata = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 533 | <code>        for doc in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 534 | <code>            metadata = update_metadata_to(metadata, doc["metadata_obj"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 535 | <code>            del doc["metadata_obj"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 536 | <code>        if metadata:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 537 | <code>            existing_meta = DocMetadataService.get_document_metadata(task["doc_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 538 | <code>            existing_meta = existing_meta if isinstance(existing_meta, dict) else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 539 | <code>            metadata = update_metadata_to(metadata, existing_meta)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 540 | <code>            ret = DocMetadataService.update_document_metadata(task["doc_id"], metadata)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 541 | <code>            get_recording_context().save_func_return_value("DocMetadataService.update_document_metadata", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 542 | <code>        progress_callback(msg="Question generation {} chunks completed in {:.2f}s".format(len(docs), timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 544 | <code>    # Record metadata generation count</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 545 | <code>    metadata_list = [d for d in docs if d.get("metadata_obj")]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 546 | <code>    get_recording_context().record("metadata_list_generated", metadata_list)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>    if task["kb_parser_config"].get("tag_kb_ids", []):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 549 | <code>        progress_callback(msg="Start to tag for every chunk ...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 550 | <code>        kb_ids = task["kb_parser_config"]["tag_kb_ids"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 551 | <code>        tenant_id = task["tenant_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 552 | <code>        topn_tags = task["kb_parser_config"].get("topn_tags", 3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 553 | <code>        S = 1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 554 | <code>        st = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 555 | <code>        examples = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 556 | <code>        all_tags = get_tags_from_cache(kb_ids)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 557 | <code>        if not all_tags:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 558 | <code>            all_tags = settings.retriever.all_tags_in_portion(tenant_id, kb_ids, S)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 559 | <code>            set_tags_to_cache(kb_ids, all_tags)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 560 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 561 | <code>            all_tags = json.loads(all_tags)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 562 | <code>        chat_model_config = get_model_config_from_provider_instance(tenant_id, LLMType.CHAT, task["llm_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 563 | <code>        chat_mdl = LLMBundle(task["tenant_id"], chat_model_config, lang=task["language"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>        docs_to_tag = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 566 | <code>        for d in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 567 | <code>            task_canceled = has_canceled(task["id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 568 | <code>            if task_canceled:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 569 | <code>                progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 570 | <code>                return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 571 | <code>            if settings.retriever.tag_content(tenant_id, kb_ids, d, all_tags, topn_tags=topn_tags, S=S) and len(d[TAG_FLD]) &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 572 | <code>                examples.append({"content": d["content_with_weight"], TAG_FLD: d[TAG_FLD]})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 573 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 574 | <code>                docs_to_tag.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>        async def doc_content_tagging(chat_mdl, d, topn_tags):</code> | 定义 Python 函数 `doc_content_tagging`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 577 | <code>            cached = get_llm_cache(chat_mdl.llm_name, d["content_with_weight"], all_tags, {"topn": topn_tags})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 578 | <code>            if not cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 579 | <code>                if has_canceled(task["id"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 580 | <code>                    progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 581 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 582 | <code>                picked_examples = random.choices(examples, k=2) if len(examples) &gt; 2 else examples</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 583 | <code>                if not picked_examples:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 584 | <code>                    picked_examples.append({"content": "This is an example", TAG_FLD: {"example": 1}})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 585 | <code>                async with chat_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 586 | <code>                    cached = await content_tagging(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 587 | <code>                        chat_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 588 | <code>                        d["content_with_weight"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 589 | <code>                        all_tags,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 590 | <code>                        picked_examples,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 591 | <code>                        topn_tags,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 592 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>                if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 594 | <code>                    cached = json.dumps(cached)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 595 | <code>            if cached:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 596 | <code>                set_llm_cache(chat_mdl.llm_name, d["content_with_weight"], cached, all_tags, {"topn": topn_tags})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 597 | <code>                d[TAG_FLD] = json.loads(cached)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>        tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 600 | <code>        for d in docs_to_tag:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 601 | <code>            tasks.append(asyncio.create_task(doc_content_tagging(chat_mdl, d, topn_tags)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 602 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 603 | <code>            await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 604 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 605 | <code>            logging.error("Error tagging docs: {}".format(e))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 606 | <code>            for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 607 | <code>                t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 608 | <code>            await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 609 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 610 | <code>        progress_callback(msg="Tagging {} chunks completed in {:.2f}s".format(len(docs), timer() - st))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 611 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 612 | <code>    # Record tags applied</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 613 | <code>    tags_applied = [d for d in docs if d.get(TAG_FLD)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 614 | <code>    get_recording_context().record("tags_applied", tags_applied)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 615 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 616 | <code>    # Record final chunks for comparison</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 617 | <code>    get_recording_context().record("final_chunks", docs)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 618 | <code>    final_chunk_ids = [c.get("id") for c in docs if isinstance(c, dict) and "id" in c]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 619 | <code>    get_recording_context().record("final_chunk_ids_count", len(final_chunk_ids))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>    return docs</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>@timed_with_recording</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 625 | <code>def build_TOC(task, docs, progress_callback):</code> | 定义 Python 函数 `build_TOC`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 626 | <code>    progress_callback(msg="Start to generate table of content ...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 627 | <code>    chat_model_config = get_model_config_from_provider_instance(task["tenant_id"], LLMType.CHAT, task["llm_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 628 | <code>    chat_mdl = LLMBundle(task["tenant_id"], chat_model_config, lang=task["language"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 629 | <code>    docs = sorted(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 630 | <code>        docs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 631 | <code>        key=lambda d: (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 632 | <code>            d.get("page_num_int", 0)[0] if isinstance(d.get("page_num_int", 0), list) else d.get("page_num_int", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 633 | <code>            d.get("top_int", 0)[0] if isinstance(d.get("top_int", 0), list) else d.get("top_int", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 634 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>    toc: list[dict] = asyncio.run(run_toc_from_text([d["content_with_weight"] for d in docs], chat_mdl, progress_callback))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 637 | <code>    logging.info("------------ T O C -------------\n" + json.dumps(toc, ensure_ascii=False, indent="  "))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 638 | <code>    for ii, item in enumerate(toc):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 639 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 640 | <code>            chunk_val = item.pop("chunk_id", None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 641 | <code>            if chunk_val is None or str(chunk_val).strip() == "":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 642 | <code>                logging.warning(f"Index {ii}: chunk_id is missing or empty. Skipping.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 643 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 644 | <code>            curr_idx = int(chunk_val)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 645 | <code>            if curr_idx &gt;= len(docs):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 646 | <code>                logging.error(f"Index {ii}: chunk_id {curr_idx} exceeds docs length {len(docs)}.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 647 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 648 | <code>            item["ids"] = [docs[curr_idx]["id"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 649 | <code>            if ii + 1 &lt; len(toc):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 650 | <code>                next_chunk_val = toc[ii + 1].get("chunk_id", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 651 | <code>                if str(next_chunk_val).strip() != "":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 652 | <code>                    next_idx = int(next_chunk_val)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 653 | <code>                    for jj in range(curr_idx + 1, min(next_idx + 1, len(docs))):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 654 | <code>                        item["ids"].append(docs[jj]["id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 655 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 656 | <code>                    logging.warning(f"Index {ii + 1}: next chunk_id is empty, range fill skipped.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 657 | <code>        except (ValueError, TypeError) as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 658 | <code>            logging.error(f"Index {ii}: Data conversion error - {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 659 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 660 | <code>            logging.exception(f"Index {ii}: Unexpected error - {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 662 | <code>    if toc:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 663 | <code>        d = copy.deepcopy(docs[-1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 664 | <code>        d["content_with_weight"] = json.dumps(toc, ensure_ascii=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 665 | <code>        d["toc_kwd"] = "toc"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 666 | <code>        d["available_int"] = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 667 | <code>        d["page_num_int"] = [100000000]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 668 | <code>        d["id"] = xxhash.xxh64((d["content_with_weight"] + str(d["doc_id"])).encode("utf-8", "surrogatepass")).hexdigest()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 669 | <code>        return d</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 670 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>def init_kb(row, vector_size: int):</code> | 定义 Python 函数 `init_kb`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 674 | <code>    idxnm = search.index_name(row["tenant_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 675 | <code>    parser_id = row.get("parser_id", None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 676 | <code>    return settings.docStoreConn.create_idx(idxnm, row.get("kb_id", ""), vector_size, parser_id)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 677 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>@timed_with_recording</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 680 | <code>async def embedding(docs, mdl, parser_config=None, callback=None):</code> | 定义 Python 函数 `embedding`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 681 | <code>    if parser_config is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 682 | <code>        parser_config = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 683 | <code>    tts, cnts = [], []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 684 | <code>    for d in docs:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 685 | <code>        tts.append(d.get("docnm_kwd", "Title"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 686 | <code>        c = "\n".join(d.get("question_kwd", []))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 687 | <code>        if not c:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 688 | <code>            c = d["content_with_weight"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 689 | <code>        c = re.sub(r"&lt;/?(table&#124;td&#124;caption&#124;tr&#124;th)( [^&lt;&gt;]{0,12})?&gt;", " ", c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 690 | <code>        if not c.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 691 | <code>            logging.debug("embedding(): normalized whitespace-only chunk to placeholder 'None' (len=%d)", len(c))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 692 | <code>            c = "None"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 693 | <code>        cnts.append(c)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 695 | <code>    tk_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 696 | <code>    if len(tts) == len(cnts):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 697 | <code>        vts, c = await thread_pool_exec(mdl.encode, tts[0:1])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 698 | <code>        tts = np.tile(vts[0], (len(cnts), 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 699 | <code>        tk_count += c</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 701 | <code>    @timeout(60)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 702 | <code>    def batch_encode(txts):</code> | 定义 Python 函数 `batch_encode`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 703 | <code>        nonlocal mdl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 704 | <code>        return mdl.encode([truncate(c, mdl.max_length - 10) for c in txts])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 706 | <code>    cnts_batches = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 707 | <code>    for i in range(0, len(cnts), settings.EMBEDDING_BATCH_SIZE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 708 | <code>        async with embed_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 709 | <code>            vts, c = await thread_pool_exec(batch_encode, cnts[i : i + settings.EMBEDDING_BATCH_SIZE])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 710 | <code>        cnts_batches.append(vts)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 711 | <code>        tk_count += c</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 712 | <code>        callback(prog=0.7 + 0.2 * (i + 1) / len(cnts), msg="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 713 | <code>    cnts = np.vstack(cnts_batches) if cnts_batches else np.array([])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 714 | <code>    filename_embd_weight = parser_config.get("filename_embd_weight", 0.1)  # due to the db support none value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 715 | <code>    if not filename_embd_weight:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 716 | <code>        filename_embd_weight = 0.1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 717 | <code>    title_w = float(filename_embd_weight)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 718 | <code>    if tts.ndim == 2 and cnts.ndim == 2 and tts.shape == cnts.shape:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 719 | <code>        vects = title_w * tts + (1 - title_w) * cnts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 720 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 721 | <code>        vects = cnts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 723 | <code>    assert len(vects) == len(docs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 724 | <code>    vector_size = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 725 | <code>    for i, d in enumerate(docs):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 726 | <code>        v = vects[i].tolist()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 727 | <code>        vector_size = len(v)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 728 | <code>        d["q_%d_vec" % len(v)] = v</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 729 | <code>    return tk_count, vector_size</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>@timed_with_recording</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 733 | <code>async def run_dataflow(task: dict):</code> | 定义 Python 函数 `run_dataflow`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 734 | <code>    from api.db.services.canvas_service import UserCanvasService</code> | 导入 Python 依赖 `api.db.services.canvas_service`，供本模块调用其类型、函数或常量。 |
| 735 | <code>    from rag.flow.pipeline import Pipeline</code> | 导入 Python 依赖 `rag.flow.pipeline`，供本模块调用其类型、函数或常量。 |
| 736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 737 | <code>    task_start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 738 | <code>    dataflow_id = task["dataflow_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 739 | <code>    doc_id = task["doc_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 740 | <code>    task_id = task["id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 741 | <code>    task_dataset_id = task["kb_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>    if task["task_type"] == "dataflow":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 744 | <code>        e, cvs = UserCanvasService.get_by_id(dataflow_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 745 | <code>        assert e, "User pipeline not found."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 746 | <code>        dsl = cvs.dsl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 747 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 748 | <code>        e, pipeline_log = PipelineOperationLogService.get_by_id(dataflow_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 749 | <code>        assert e, "Pipeline log not found."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 750 | <code>        dsl = pipeline_log.dsl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 751 | <code>        dataflow_id = pipeline_log.pipeline_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 752 | <code>    pipeline = Pipeline(dsl, tenant_id=task["tenant_id"], doc_id=doc_id, task_id=task_id, flow_id=dataflow_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 753 | <code>    chunks = await pipeline.run(file=task["file"]) if task.get("file") else await pipeline.run()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 754 | <code>    if doc_id == CANVAS_DEBUG_DOC_ID:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 755 | <code>        get_recording_context().record("dataflow_debug_result", "canvas_debug_mode")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 756 | <code>        get_recording_context().record("dataflow_chunks", chunks)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 757 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>    if not chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 760 | <code>        get_recording_context().record("pipeline_output_count", 0)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 761 | <code>        get_recording_context().record("pipeline_output_type", "empty")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 762 | <code>        ret = PipelineOperationLogService.create(document_id=doc_id, pipeline_id=dataflow_id, task_type=PipelineTaskType.PARSE, dsl=str(pipeline))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 763 | <code>        get_recording_context().save_func_return_value("PipelineOperationLogService.create", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 764 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>    embedding_token_consumption = chunks.get("embedding_token_consumption", 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 767 | <code>    # The output key may exist with an empty payload; check presence, not truthiness.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 768 | <code>    if "chunks" in chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 769 | <code>        chunks = copy.deepcopy(chunks["chunks"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 770 | <code>        output_type = "chunks"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 771 | <code>    elif "json" in chunks:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 772 | <code>        chunks = copy.deepcopy(chunks["json"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 773 | <code>        output_type = "json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 774 | <code>    elif "markdown" in chunks:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 775 | <code>        chunks = [{"text": [chunks["markdown"]]}] if chunks["markdown"] else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 776 | <code>        output_type = "markdown"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 777 | <code>    elif "text" in chunks:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 778 | <code>        chunks = [{"text": [chunks["text"]]}] if chunks["text"] else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 779 | <code>        output_type = "text"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 780 | <code>    elif "html" in chunks:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 781 | <code>        chunks = [{"text": [chunks["html"]]}] if chunks["html"] else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 782 | <code>        output_type = "html"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 783 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 784 | <code>        chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 785 | <code>        output_type = "empty"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 787 | <code>    get_recording_context().record("pipeline_output_type", output_type)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 788 | <code>    get_recording_context().record("pipeline_output_count", len(chunks))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>    # An empty normalized payload means "nothing parsed", so stop before embedding/indexing.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 791 | <code>    if not chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 792 | <code>        ret = PipelineOperationLogService.create(document_id=doc_id, pipeline_id=dataflow_id, task_type=PipelineTaskType.PARSE, dsl=str(pipeline))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 793 | <code>        get_recording_context().save_func_return_value("PipelineOperationLogService.create", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 794 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>    keys = [k for o in chunks for k in list(o.keys())]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 797 | <code>    if not any([re.match(r"q_[0-9]+_vec", k) for k in keys]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 798 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 799 | <code>            set_progress(task_id, prog=0.82, msg="\n-------------------------------------\nStart to embedding...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 800 | <code>            e, kb = KnowledgebaseService.get_by_id(task["kb_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 801 | <code>            embedding_id = kb.embd_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 802 | <code>            embd_model_config = get_model_config_from_provider_instance(task["tenant_id"], LLMType.EMBEDDING, embedding_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 803 | <code>            embedding_model = LLMBundle(task["tenant_id"], embd_model_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 805 | <code>            @timeout(60)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 806 | <code>            def batch_encode(txts):</code> | 定义 Python 函数 `batch_encode`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 807 | <code>                nonlocal embedding_model</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 808 | <code>                return embedding_model.encode([truncate(c, embedding_model.max_length - 10) for c in txts])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>            vects_batches = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 811 | <code>            texts = [o.get("questions", o.get("summary", o["text"])) for o in chunks]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 812 | <code>            delta = 0.20 / (len(texts) // settings.EMBEDDING_BATCH_SIZE + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 813 | <code>            prog = 0.8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 814 | <code>            for i in range(0, len(texts), settings.EMBEDDING_BATCH_SIZE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 815 | <code>                async with embed_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 816 | <code>                    vts, c = await thread_pool_exec(batch_encode, texts[i : i + settings.EMBEDDING_BATCH_SIZE])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 817 | <code>                vects_batches.append(vts)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 818 | <code>                embedding_token_consumption += c</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 819 | <code>                prog += delta</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 820 | <code>                if i % (len(texts) // settings.EMBEDDING_BATCH_SIZE / 100 + 1) == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 821 | <code>                    set_progress(task_id, prog=prog, msg=f"{i + 1} / {len(texts) // settings.EMBEDDING_BATCH_SIZE}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 822 | <code>            vects = np.vstack(vects_batches) if vects_batches else np.array([])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 823 | <code>            get_recording_context().record("embedding_token_consumption", embedding_token_consumption)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 824 | <code>            get_recording_context().record("vector_size", len(vects[0]) if len(vects) &gt; 0 else 0)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 826 | <code>            assert len(vects) == len(chunks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 827 | <code>            for i, ck in enumerate(chunks):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 828 | <code>                v = vects[i].tolist()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 829 | <code>                ck["q_%d_vec" % len(v)] = v</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 830 | <code>        except TaskCanceledException:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 831 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 832 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 833 | <code>            set_progress(task_id, prog=-1, msg=f"[ERROR]: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 834 | <code>            ret = PipelineOperationLogService.create(document_id=doc_id, pipeline_id=dataflow_id, task_type=PipelineTaskType.PARSE, dsl=str(pipeline))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 835 | <code>            get_recording_context().save_func_return_value("PipelineOperationLogService.create", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 836 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>    metadata = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 839 | <code>    for ck in chunks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 840 | <code>        ck["doc_id"] = doc_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 841 | <code>        ck["kb_id"] = [str(task["kb_id"])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 842 | <code>        ck["docnm_kwd"] = task["name"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 843 | <code>        ck["create_time"] = str(datetime.now()).replace("T", " ")[:19]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 844 | <code>        ck["create_timestamp_flt"] = datetime.now().timestamp()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 845 | <code>        if not ck.get("id"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 846 | <code>            ck["id"] = xxhash.xxh64((ck["text"] + str(ck["doc_id"])).encode("utf-8")).hexdigest()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 847 | <code>        if "questions" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 848 | <code>            if "question_tks" not in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 849 | <code>                ck["question_kwd"] = ck["questions"].split("\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 850 | <code>                ck["question_tks"] = rag_tokenizer.tokenize(str(ck["questions"]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 851 | <code>            del ck["questions"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 852 | <code>        if "keywords" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 853 | <code>            if "important_tks" not in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 854 | <code>                ck["important_kwd"] = [k for k in re.split(r"[,，;；、\r\n]+", ck["keywords"]) if k.strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 855 | <code>                ck["important_tks"] = rag_tokenizer.tokenize(str(ck["keywords"]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 856 | <code>            del ck["keywords"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 857 | <code>        if "summary" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 858 | <code>            if "content_ltks" not in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 859 | <code>                ck["content_ltks"] = rag_tokenizer.tokenize(str(ck["summary"]))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 860 | <code>                ck["content_sm_ltks"] = rag_tokenizer.fine_grained_tokenize(ck["content_ltks"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 861 | <code>            del ck["summary"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 862 | <code>        if "metadata" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 863 | <code>            metadata = update_metadata_to(metadata, ck["metadata"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 864 | <code>            del ck["metadata"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 865 | <code>        if "content_with_weight" not in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 866 | <code>            ck["content_with_weight"] = ck["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 867 | <code>        del ck["text"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 868 | <code>        if "positions" in ck:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 869 | <code>            add_positions(ck, ck["positions"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 870 | <code>            del ck["positions"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 872 | <code>    if metadata:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 873 | <code>        existing_meta = DocMetadataService.get_document_metadata(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 874 | <code>        existing_meta = existing_meta if isinstance(existing_meta, dict) else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 875 | <code>        metadata = update_metadata_to(metadata, existing_meta)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 876 | <code>        get_recording_context().record("run_dataflow_metadata", metadata)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 877 | <code>        ret = DocMetadataService.update_document_metadata(doc_id, metadata)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 878 | <code>        get_recording_context().save_func_return_value("DocMetadataService.update_document_metadata", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>    start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 881 | <code>    set_progress(task_id, prog=0.82, msg="[DOC Engine]:\nStart to index...")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 882 | <code>    e = await insert_chunks(task_id, task["tenant_id"], task["kb_id"], chunks, partial(set_progress, task_id, 0, 100000000))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 883 | <code>    if not e:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 884 | <code>        ret = PipelineOperationLogService.create(document_id=doc_id, pipeline_id=dataflow_id, task_type=PipelineTaskType.PARSE, dsl=str(pipeline))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 885 | <code>        get_recording_context().save_func_return_value("PipelineOperationLogService.create", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 886 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>    time_cost = timer() - start_ts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 889 | <code>    task_time_cost = timer() - task_start_ts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 890 | <code>    set_progress(task_id, prog=1.0, msg="Indexing done ({:.2f}s). Task done ({:.2f}s)".format(time_cost, task_time_cost))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 891 | <code>    ret = DocumentService.increment_chunk_num(doc_id, task_dataset_id, embedding_token_consumption, len(chunks), task_time_cost)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 892 | <code>    get_recording_context().save_func_return_value("DocumentService.increment_chunk_num", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 893 | <code>    logging.info("[Done], chunks({}), token({}), elapsed:{:.2f}".format(len(chunks), embedding_token_consumption, task_time_cost))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 894 | <code>    get_recording_context().record("dataflow_chunks", chunks)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 895 | <code>    ret = PipelineOperationLogService.create(document_id=doc_id, pipeline_id=dataflow_id, task_type=PipelineTaskType.PARSE, dsl=str(pipeline))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 896 | <code>    get_recording_context().save_func_return_value("PipelineOperationLogService.create", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 897 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>RAPTOR_METHOD_SEARCH_LIMIT = 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>async def get_raptor_chunk_field_map(doc_id: str, tenant_id: str, kb_id: str) -&gt; dict:</code> | 定义 Python 函数 `get_raptor_chunk_field_map`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 903 | <code>    """Return stored RAPTOR marker fields for a document."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 904 | <code>    from common.doc_store.doc_store_base import OrderByExpr</code> | 导入 Python 依赖 `common.doc_store.doc_store_base`，供本模块调用其类型、函数或常量。 |
| 905 | <code>    from rag.nlp import search as nlp_search</code> | 导入 Python 依赖 `rag.nlp`，供本模块调用其类型、函数或常量。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>    async def search_fields(fields: list[str], condition: dict, order_by=None):</code> | 定义 Python 函数 `search_fields`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 908 | <code>        """Search chunk fields in the current knowledge base."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 909 | <code>        res = await thread_pool_exec(settings.docStoreConn.search, fields, [], condition, [], order_by or OrderByExpr(), 0, RAPTOR_METHOD_SEARCH_LIMIT, nlp_search.index_name(tenant_id), [kb_id])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 910 | <code>        return settings.docStoreConn.get_fields(res, fields)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 911 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 912 | <code>    primary = await search_fields(["raptor_kwd", "extra"], {"doc_id": doc_id, "raptor_kwd": ["raptor"]})</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 913 | <code>    if collect_raptor_chunk_ids(primary):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 914 | <code>        return primary</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 916 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 917 | <code>        return await search_fields(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 918 | <code>            ["raptor_kwd", "extra"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 919 | <code>            {"doc_id": doc_id},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 920 | <code>            OrderByExpr().desc("create_timestamp_flt"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 921 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 922 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 923 | <code>        logging.debug("RAPTOR fallback method lookup with extra field failed for doc %s", doc_id, exc_info=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 924 | <code>        return primary</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>async def get_raptor_chunk_methods(doc_id: str, tenant_id: str, kb_id: str) -&gt; set[str]:</code> | 定义 Python 函数 `get_raptor_chunk_methods`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 928 | <code>    """Return the RAPTOR tree builders already stored for doc_id.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>    Queries directly for raptor_kwd="raptor" rows so a non-RAPTOR leading</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 931 | <code>    chunk cannot produce a false-negative result. Legacy summary chunks that</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 932 | <code>    do not have method metadata are treated as the original RAPTOR builder.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 933 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 934 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 935 | <code>        field_map = await get_raptor_chunk_field_map(doc_id, tenant_id, kb_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 936 | <code>        methods = collect_raptor_methods(field_map)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 937 | <code>        if methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 938 | <code>            logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 939 | <code>                "Checkpoint hit: RAPTOR chunks for doc %s (tenant=%s kb=%s methods=%s) already exist",</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 940 | <code>                doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 941 | <code>                tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 942 | <code>                kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 943 | <code>                sorted(methods),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 944 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 946 | <code>            logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 947 | <code>                "Checkpoint miss: no RAPTOR chunks for doc %s (tenant=%s kb=%s)",</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 948 | <code>                doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 949 | <code>                tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 950 | <code>                kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 951 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>        return methods</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 953 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 954 | <code>        logging.exception("Failed to check RAPTOR chunks for doc %s", doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 955 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 958 | <code>async def has_raptor_chunks(doc_id: str, tenant_id: str, kb_id: str, tree_builder: str = RAPTOR_TREE_BUILDER) -&gt; bool:</code> | 定义 Python 函数 `has_raptor_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 959 | <code>    """Return whether doc_id already has summaries for tree_builder."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 960 | <code>    methods = await get_raptor_chunk_methods(doc_id, tenant_id, kb_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 961 | <code>    return tree_builder in methods</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 962 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>async def delete_raptor_chunks(doc_id: str, tenant_id: str, kb_id: str, keep_method: str &#124; None = None):</code> | 定义 Python 函数 `delete_raptor_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 965 | <code>    """Delete RAPTOR summaries for doc_id, optionally preserving one method."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 966 | <code>    if keep_method is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 967 | <code>        logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 968 | <code>            "delete_raptor_chunks: removing all RAPTOR summaries (doc=%s tenant=%s kb=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 969 | <code>            doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 970 | <code>            tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 971 | <code>            kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 972 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>        ret = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 974 | <code>            settings.docStoreConn.delete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 975 | <code>            {"doc_id": doc_id, "raptor_kwd": ["raptor"]},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 976 | <code>            nlp_search.index_name(tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 977 | <code>            kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 978 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 979 | <code>        get_recording_context().save_func_return_value("docStoreConn.delete", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 980 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 982 | <code>    field_map = await get_raptor_chunk_field_map(doc_id, tenant_id, kb_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 983 | <code>    chunk_ids = collect_raptor_chunk_ids(field_map, exclude_methods={keep_method})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 984 | <code>    if not chunk_ids:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 985 | <code>        logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 986 | <code>            "delete_raptor_chunks: no stale RAPTOR chunks to remove (doc=%s tenant=%s kb=%s keep=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 987 | <code>            doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 988 | <code>            tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 989 | <code>            kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 990 | <code>            keep_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 991 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 993 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 994 | <code>    logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 995 | <code>        "delete_raptor_chunks: removing %d stale RAPTOR chunks (doc=%s tenant=%s kb=%s keep=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 996 | <code>        len(chunk_ids),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 997 | <code>        doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 998 | <code>        tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 999 | <code>        kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1000 | <code>        keep_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1001 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>    ret = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1003 | <code>        settings.docStoreConn.delete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1004 | <code>        {"id": list(chunk_ids)},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1005 | <code>        nlp_search.index_name(tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1006 | <code>        kb_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1007 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1008 | <code>    get_recording_context().save_func_return_value("docStoreConn.delete", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1009 | <code>    return len(chunk_ids)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1010 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>@timeout(3600)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1013 | <code>async def run_raptor_for_kb(row, kb_parser_config, chat_mdl, embd_mdl, vector_size, callback=None, doc_ids=[]):</code> | 定义 Python 函数 `run_raptor_for_kb`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1014 | <code>    """Generate RAPTOR summaries for selected documents in a knowledge base."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1015 | <code>    fake_doc_id = GRAPH_RAPTOR_FAKE_DOC_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1017 | <code>    raptor_config = kb_parser_config.get("raptor", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1018 | <code>    raptor_ext_config = raptor_config.get("ext") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1019 | <code>    tree_builder = get_raptor_tree_builder(raptor_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1020 | <code>    clustering_method = get_raptor_clustering_method(raptor_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1021 | <code>    vctr_nm = "q_%d_vec" % vector_size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1023 | <code>    res = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1024 | <code>    tk_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1025 | <code>    cleanup_raptor_chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1026 | <code>    max_errors = int(os.environ.get("RAPTOR_MAX_ERRORS", 3))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1027 | <code>    doc_info_by_id = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1028 | <code>    for doc_id in set(doc_ids):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1029 | <code>        ok, source_doc = DocumentService.get_by_id(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1030 | <code>        if not ok or not source_doc:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1031 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1032 | <code>        doc_info_by_id[doc_id] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1033 | <code>            "name": getattr(source_doc, "name", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1034 | <code>            "type": getattr(source_doc, "type", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1035 | <code>            "parser_id": getattr(source_doc, "parser_id", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1036 | <code>            "parser_config": getattr(source_doc, "parser_config", {}) or {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1037 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1038 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1039 | <code>    def schedule_raptor_cleanup(doc_id: str, keep_method: str &#124; None = None):</code> | 定义 Python 函数 `schedule_raptor_cleanup`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1040 | <code>        """Queue stale RAPTOR summaries for deletion after successful insert."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1041 | <code>        cleanup_plan = (doc_id, keep_method)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1042 | <code>        if cleanup_plan not in cleanup_raptor_chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1043 | <code>            cleanup_raptor_chunks.append(cleanup_plan)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>    def skip_raptor_doc(doc_id: str) -&gt; bool:</code> | 定义 Python 函数 `skip_raptor_doc`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1046 | <code>        """Return whether RAPTOR should be skipped for this source document."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1047 | <code>        doc_info = doc_info_by_id.get(doc_id, {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1048 | <code>        file_type = doc_info.get("type") or row.get("type", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1049 | <code>        parser_id = doc_info.get("parser_id") or row.get("parser_id", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1050 | <code>        parser_config = doc_info.get("parser_config") or row.get("parser_config", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1051 | <code>        if should_skip_raptor(file_type, parser_id, parser_config, raptor_config):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1052 | <code>            skip_reason = get_skip_reason(file_type, parser_id, parser_config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1053 | <code>            doc_name = doc_info.get("name") or doc_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1054 | <code>            logging.info("Skipping Raptor for document %s: %s", doc_name, skip_reason)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1055 | <code>            callback(msg=f"[RAPTOR] doc:{doc_id} skipped: {skip_reason}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1056 | <code>            return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1057 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>    async def generate(chunks, did):</code> | 定义 Python 函数 `generate`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1060 | <code>        """Run RAPTOR and append generated summary chunks for one doc id."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1061 | <code>        nonlocal tk_count, res</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1062 | <code>        logging.info("RAPTOR: using tree_builder=%s clustering_method=%s for doc %s", tree_builder, clustering_method, did)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1063 | <code>        from rag.raptor import RecursiveAbstractiveProcessing4TreeOrganizedRetrieval as Raptor  # Lazy load, save around 8s</code> | 导入 Python 依赖 `rag.raptor`，供本模块调用其类型、函数或常量。 |
| 1064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1065 | <code>        raptor = Raptor(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1066 | <code>            raptor_config.get("max_cluster", 64),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1067 | <code>            chat_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1068 | <code>            embd_mdl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1069 | <code>            raptor_config["prompt"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1070 | <code>            raptor_config["max_token"],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1071 | <code>            raptor_config["threshold"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1072 | <code>            max_errors=max_errors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1073 | <code>            tree_builder=tree_builder,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1074 | <code>            clustering_method=clustering_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1075 | <code>            psi_exact_max_leaves=raptor_ext_config.get("psi_exact_max_leaves", 4096),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1076 | <code>            psi_bucket_size=raptor_ext_config.get("psi_bucket_size", 1024),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1077 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>        original_length = len(chunks)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1079 | <code>        chunks, layers = await raptor(chunks, kb_parser_config["raptor"]["random_seed"], callback, row["id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1080 | <code>        effective_doc_name = row["name"] if did == fake_doc_id else doc_info_by_id.get(did, {}).get("name") or row["name"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1081 | <code>        doc = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1082 | <code>            "doc_id": did,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1083 | <code>            "kb_id": [str(row["kb_id"])],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1084 | <code>            "docnm_kwd": effective_doc_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1085 | <code>            "title_tks": rag_tokenizer.tokenize(effective_doc_name),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1086 | <code>            "raptor_kwd": "raptor",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1087 | <code>            "extra": {"raptor_method": tree_builder},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1088 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1089 | <code>        if row["pagerank"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1090 | <code>            doc[PAGERANK_FLD] = int(row["pagerank"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1091 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1092 | <code>        # Build index→layer mapping from RAPTOR layer boundaries.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1093 | <code>        # layers is [(start, end), ...] where layer 0 is the original chunks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1094 | <code>        # and layer 1+ are summary layers. We skip layer 0 (original chunks).</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1095 | <code>        chunk_layer = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1096 | <code>        for layer_idx, (layer_start, layer_end) in enumerate(layers):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1097 | <code>            if layer_idx == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1098 | <code>                continue  # layer 0 = original input chunks, not summaries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1099 | <code>            for ci in range(layer_start, layer_end):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1100 | <code>                chunk_layer[ci] = layer_idx</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1102 | <code>        for idx, (content, vctr) in enumerate(chunks[original_length:], start=original_length):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1103 | <code>            d = copy.deepcopy(doc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1104 | <code>            d["id"] = make_raptor_summary_chunk_id(content, did)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1105 | <code>            d["create_time"] = str(datetime.now()).replace("T", " ")[:19]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1106 | <code>            d["create_timestamp_flt"] = datetime.now().timestamp()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1107 | <code>            d[vctr_nm] = vctr.tolist()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1108 | <code>            d["content_with_weight"] = content</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1109 | <code>            d["content_ltks"] = rag_tokenizer.tokenize(content)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1110 | <code>            d["content_sm_ltks"] = rag_tokenizer.fine_grained_tokenize(d["content_ltks"])</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1111 | <code>            d["raptor_layer_int"] = chunk_layer.get(idx, 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1112 | <code>            res.append(d)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1113 | <code>            tk_count += num_tokens_from_string(content)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1115 | <code>    if raptor_config.get("scope", "file") == "file":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1116 | <code>        dataset_methods = await get_raptor_chunk_methods(fake_doc_id, row["tenant_id"], row["kb_id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1117 | <code>        remove_dataset_summaries = bool(dataset_methods)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1118 | <code>        has_file_level_target = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1119 | <code>        if dataset_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1120 | <code>            callback(msg="[RAPTOR] will remove dataset-level summaries after file-level summaries are available.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1122 | <code>        for x, doc_id in enumerate(doc_ids):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1123 | <code>            if skip_raptor_doc(doc_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1124 | <code>                callback(prog=(x + 1.0) / len(doc_ids))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1125 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1126 | <code>            # CHECKPOINT: skip docs that already have RAPTOR chunks in the doc store</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1127 | <code>            existing_methods = await get_raptor_chunk_methods(doc_id, row["tenant_id"], row["kb_id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1128 | <code>            if tree_builder in existing_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1129 | <code>                has_file_level_target = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1130 | <code>                if existing_methods != {tree_builder}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1131 | <code>                    schedule_raptor_cleanup(doc_id, tree_builder)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1132 | <code>                    callback(msg=f"[RAPTOR] doc:{doc_id} will remove old RAPTOR summaries after insert.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1133 | <code>                callback(msg=f"[RAPTOR] doc:{doc_id} already has {tree_builder} RAPTOR chunks, skipping.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1134 | <code>                callback(prog=(x + 1.0) / len(doc_ids))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1135 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1136 | <code>            if existing_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1137 | <code>                callback(msg=f"[RAPTOR] doc:{doc_id} will migrate RAPTOR summaries to {tree_builder} after insert.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1139 | <code>            chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1140 | <code>            skipped_chunks = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1141 | <code>            for d in settings.retriever.chunk_list(doc_id, row["tenant_id"], [str(row["kb_id"])], fields=["content_with_weight", vctr_nm], sort_by_position=True):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1142 | <code>                # Skip chunks that don't have the required vector field (may have been indexed with different embedding model)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1143 | <code>                if vctr_nm not in d or d[vctr_nm] is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1144 | <code>                    skipped_chunks += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1145 | <code>                    logging.warning(f"RAPTOR: Chunk missing vector field '{vctr_nm}' in doc {doc_id}, skipping")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1146 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1147 | <code>                chunks.append((d["content_with_weight"], np.array(d[vctr_nm])))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1149 | <code>            if skipped_chunks &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1150 | <code>                callback(msg=f"[WARN] Skipped {skipped_chunks} chunks without vector field '{vctr_nm}' for doc {doc_id}. Consider re-parsing the document with the current embedding model.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1152 | <code>            if not chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1153 | <code>                logging.warning(f"RAPTOR: No valid chunks with vectors found for doc {doc_id}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1154 | <code>                callback(msg=f"[WARN] No valid chunks with vectors found for doc {doc_id}, skipping")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1155 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1157 | <code>            before_generate = len(res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1158 | <code>            await generate(chunks, doc_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1159 | <code>            if len(res) &gt; before_generate:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1160 | <code>                has_file_level_target = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1161 | <code>                if existing_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1162 | <code>                    schedule_raptor_cleanup(doc_id, tree_builder)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1163 | <code>            callback(prog=(x + 1.0) / len(doc_ids))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1165 | <code>        if remove_dataset_summaries:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1166 | <code>            if has_file_level_target:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1167 | <code>                schedule_raptor_cleanup(fake_doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1168 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1169 | <code>                callback(msg="[RAPTOR] kept dataset-level summaries because no file-level summaries were built.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1170 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1171 | <code>        migrated_file_docs = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1172 | <code>        file_cleanup_doc_ids = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1173 | <code>        skipped_doc_ids = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1174 | <code>        for doc_id in set(doc_ids):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1175 | <code>            if skip_raptor_doc(doc_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1176 | <code>                skipped_doc_ids.add(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1177 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1178 | <code>            existing_methods = await get_raptor_chunk_methods(doc_id, row["tenant_id"], row["kb_id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1179 | <code>            if existing_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1180 | <code>                file_cleanup_doc_ids.append(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1181 | <code>                migrated_file_docs += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1182 | <code>        if migrated_file_docs:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1183 | <code>            callback(msg=f"[RAPTOR] will remove file-level summaries for {migrated_file_docs} docs after dataset-level build succeeds.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1185 | <code>        existing_methods = await get_raptor_chunk_methods(fake_doc_id, row["tenant_id"], row["kb_id"])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1186 | <code>        if tree_builder in existing_methods:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1187 | <code>            if existing_methods != {tree_builder}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1188 | <code>                schedule_raptor_cleanup(fake_doc_id, tree_builder)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1189 | <code>                callback(msg="[RAPTOR] will remove old dataset-level RAPTOR summaries after insert.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1190 | <code>            for doc_id in file_cleanup_doc_ids:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1191 | <code>                schedule_raptor_cleanup(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1192 | <code>            callback(msg=f"[RAPTOR] dataset-level {tree_builder} summaries already exist, skipping.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1193 | <code>            return res, tk_count, cleanup_raptor_chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1194 | <code>        migrate_dataset_summaries = bool(existing_methods)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1195 | <code>        if migrate_dataset_summaries:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1196 | <code>            callback(msg=f"[RAPTOR] will migrate dataset-level RAPTOR summaries to {tree_builder} after insert.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1198 | <code>        chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1199 | <code>        skipped_chunks = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1200 | <code>        for doc_id in doc_ids:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1201 | <code>            if doc_id in skipped_doc_ids:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1202 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1203 | <code>            for d in settings.retriever.chunk_list(doc_id, row["tenant_id"], [str(row["kb_id"])], fields=["content_with_weight", vctr_nm], sort_by_position=True):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1204 | <code>                # Skip chunks that don't have the required vector field</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1205 | <code>                if vctr_nm not in d or d[vctr_nm] is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1206 | <code>                    skipped_chunks += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1207 | <code>                    logging.warning(f"RAPTOR: Chunk missing vector field '{vctr_nm}' in doc {doc_id}, skipping")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1208 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1209 | <code>                chunks.append((d["content_with_weight"], np.array(d[vctr_nm])))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1211 | <code>        if skipped_chunks &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1212 | <code>            callback(msg=f"[WARN] Skipped {skipped_chunks} chunks without vector field '{vctr_nm}'. Consider re-parsing documents with the current embedding model.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1214 | <code>        if not chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1215 | <code>            if skipped_doc_ids and len(skipped_doc_ids) == len(set(doc_ids)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1216 | <code>                callback(msg="[RAPTOR] all documents were skipped by RAPTOR auto-disable rules.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1217 | <code>                return res, tk_count, cleanup_raptor_chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1218 | <code>            logging.error(f"RAPTOR: No valid chunks with vectors found in any document for kb {row['kb_id']}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1219 | <code>            callback(msg=f"[ERROR] No valid chunks with vectors found. Please ensure documents are parsed with the current embedding model (vector size: {vector_size}).")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1220 | <code>            return res, tk_count, cleanup_raptor_chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1222 | <code>        before_generate = len(res)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1223 | <code>        await generate(chunks, fake_doc_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1224 | <code>        if len(res) &gt; before_generate:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1225 | <code>            for doc_id in file_cleanup_doc_ids:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1226 | <code>                schedule_raptor_cleanup(doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1227 | <code>            if migrate_dataset_summaries:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1228 | <code>                schedule_raptor_cleanup(fake_doc_id, tree_builder)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1230 | <code>    return res, tk_count, cleanup_raptor_chunks</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1233 | <code>async def delete_image(kb_id, chunk_id):</code> | 定义 Python 函数 `delete_image`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1234 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1235 | <code>        async with minio_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1236 | <code>            settings.STORAGE_IMPL.delete(kb_id, chunk_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1237 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1238 | <code>        logging.exception(f"Deleting image of chunk {chunk_id} got exception")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1239 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>@timed_with_recording</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1243 | <code>async def insert_chunks(task_id, task_tenant_id, task_dataset_id, chunks, progress_callback):</code> | 定义 Python 函数 `insert_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1244 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1245 | <code>    Insert chunks into document store (Elasticsearch OR Infinity).</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1247 | <code>    Args:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1248 | <code>        task_id: Task identifier</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1249 | <code>        task_tenant_id: Tenant ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1250 | <code>        task_dataset_id: Dataset/knowledge base ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1251 | <code>        chunks: List of chunk dictionaries to insert</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1252 | <code>        progress_callback: Callback function for progress updates</code> | 定义函数 `for`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1253 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1254 | <code>    mothers = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1255 | <code>    mother_ids = set([])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1256 | <code>    for ck in chunks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1257 | <code>        mom = ck.get("mom") or ck.get("mom_with_weight") or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1258 | <code>        if not mom:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1259 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1260 | <code>        id = xxhash.xxh64(mom.encode("utf-8")).hexdigest()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1261 | <code>        ck["mom_id"] = id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1262 | <code>        if id in mother_ids:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1263 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1264 | <code>        mother_ids.add(id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1265 | <code>        mom_ck = copy.deepcopy(ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1266 | <code>        mom_ck["id"] = id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1267 | <code>        mom_ck["content_with_weight"] = mom</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1268 | <code>        mom_ck["available_int"] = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1269 | <code>        flds = list(mom_ck.keys())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1270 | <code>        for fld in flds:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1271 | <code>            if fld not in ["id", "content_with_weight", "doc_id", "docnm_kwd", "kb_id", "available_int", "position_int", "create_timestamp_flt", "page_num_int", "top_int"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1272 | <code>                del mom_ck[fld]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1273 | <code>        mothers.append(mom_ck)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1275 | <code>    for b in range(0, len(mothers), settings.DOC_BULK_SIZE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1276 | <code>        ret = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1277 | <code>            settings.docStoreConn.insert,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1278 | <code>            mothers[b : b + settings.DOC_BULK_SIZE],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1279 | <code>            search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1280 | <code>            task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1281 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1282 | <code>        get_recording_context().save_func_return_value("docStoreConn.insert", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1283 | <code>        task_canceled = has_canceled(task_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1284 | <code>        if task_canceled:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1285 | <code>            progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1286 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1288 | <code>    for b in range(0, len(chunks), settings.DOC_BULK_SIZE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1289 | <code>        doc_store_result = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1290 | <code>            settings.docStoreConn.insert,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1291 | <code>            chunks[b : b + settings.DOC_BULK_SIZE],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1292 | <code>            search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1293 | <code>            task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1294 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1295 | <code>        get_recording_context().save_func_return_value("docStoreConn.insert", doc_store_result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1296 | <code>        task_canceled = has_canceled(task_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1297 | <code>        if task_canceled:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1298 | <code>            # Roll back partial RAPTOR summary inserts so the next run is not</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1299 | <code>            # mistaken for a completed checkpoint by get_raptor_chunk_methods.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1300 | <code>            raptor_ids_to_rollback = [c["id"] for c in chunks[: b + settings.DOC_BULK_SIZE] if c.get("raptor_kwd") == "raptor"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1301 | <code>            if raptor_ids_to_rollback:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1302 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1303 | <code>                    ret = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1304 | <code>                        settings.docStoreConn.delete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1305 | <code>                        {"id": raptor_ids_to_rollback},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1306 | <code>                        search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1307 | <code>                        task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1308 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1309 | <code>                    get_recording_context().save_func_return_value("docStoreConn.delete", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1310 | <code>                    logging.info(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1311 | <code>                        "insert_chunks: rolled back %d partial RAPTOR chunks after cancellation (task=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1312 | <code>                        len(raptor_ids_to_rollback),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1313 | <code>                        task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1314 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1315 | <code>                except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1316 | <code>                    logging.exception(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1317 | <code>                        "insert_chunks: failed to roll back partial RAPTOR chunks after cancellation (task=%s)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1318 | <code>                        task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1319 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1320 | <code>            progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1321 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1322 | <code>        if b % 128 == 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1323 | <code>            progress_callback(prog=0.8 + 0.1 * (b + 1) / len(chunks), msg="")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1324 | <code>        if doc_store_result:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1325 | <code>            error_message = f"Insert chunk error: {doc_store_result}, please check log file and Elasticsearch/Infinity status!"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1326 | <code>            progress_callback(-1, msg=error_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1327 | <code>            raise Exception(error_message)</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1328 | <code>        chunk_ids = [chunk["id"] for chunk in chunks[: b + settings.DOC_BULK_SIZE]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1329 | <code>        chunk_ids_str = " ".join(chunk_ids)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1330 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1331 | <code>            TaskService.update_chunk_ids(task_id, chunk_ids_str)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1332 | <code>            get_recording_context().save_func_return_value("TaskService.update_chunk_ids", None)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1333 | <code>        except DoesNotExist:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1334 | <code>            logging.warning(f"do_handle_task update_chunk_ids failed since task {task_id} is unknown.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1335 | <code>            doc_store_result = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1336 | <code>                settings.docStoreConn.delete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1337 | <code>                {"id": chunk_ids},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1338 | <code>                search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1339 | <code>                task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1340 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1341 | <code>            get_recording_context().save_func_return_value("docStoreConn.delete", doc_store_result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1342 | <code>            tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1343 | <code>            for chunk_id in chunk_ids:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1344 | <code>                tasks.append(asyncio.create_task(delete_image(task_dataset_id, chunk_id)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1345 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1346 | <code>                await asyncio.gather(*tasks, return_exceptions=False)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1347 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1348 | <code>                logging.error(f"delete_image failed: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1349 | <code>                for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1350 | <code>                    t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1351 | <code>                await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1352 | <code>                raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1353 | <code>            progress_callback(-1, msg=f"Chunk updates failed since task {task_id} is unknown.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1354 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1355 | <code>    return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1358 | <code>@timeout(60 * 60 * 3, 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1359 | <code>async def do_handle_task(task):</code> | 定义 Python 函数 `do_handle_task`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1360 | <code>    task_type = task.get("task_type", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1362 | <code>    if task_type == "memory":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1363 | <code>        result = await handle_save_to_memory_task(task)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1364 | <code>        get_recording_context().save_func_return_value("handle_save_to_memory_task", result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1365 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1367 | <code>    if task_type == "dataflow" and task.get("doc_id", "") == CANVAS_DEBUG_DOC_ID:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1368 | <code>        await run_dataflow(task)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1369 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1371 | <code>    task_id = task["id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1372 | <code>    task_from_page = task["from_page"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1373 | <code>    task_to_page = task["to_page"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1374 | <code>    task_tenant_id = task["tenant_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1375 | <code>    task_embedding_id = task["embd_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1376 | <code>    task_language = task.get("language") or "Chinese"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1377 | <code>    if not task.get("language"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1378 | <code>        logging.warning("Task %s has no language set, falling back to Chinese", task_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1379 | <code>    doc_task_llm_id = task["parser_config"].get("llm_id") or task["llm_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1380 | <code>    kb_task_llm_id = task["kb_parser_config"].get("llm_id") or task["llm_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1381 | <code>    task["llm_id"] = kb_task_llm_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1382 | <code>    task_dataset_id = task["kb_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1383 | <code>    task_doc_id = task["doc_id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1384 | <code>    task_document_name = task["name"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1385 | <code>    task_parser_config = task["parser_config"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1386 | <code>    task_start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1387 | <code>    toc_thread = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1388 | <code>    raptor_cleanup_chunks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1390 | <code>    # prepare the progress callback function</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1391 | <code>    progress_callback = partial(set_progress, task_id, task_from_page, task_to_page)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1393 | <code>    task_canceled = has_canceled(task_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1394 | <code>    if task_canceled:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1395 | <code>        progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1396 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1398 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1399 | <code>        # bind embedding model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1400 | <code>        if task_embedding_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1401 | <code>            embd_model_config = get_model_config_from_provider_instance(task_tenant_id, LLMType.EMBEDDING, task_embedding_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1402 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1403 | <code>            embd_model_config = get_tenant_default_model_by_type(task_tenant_id, LLMType.EMBEDDING)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1404 | <code>        embedding_model = LLMBundle(task_tenant_id, embd_model_config, lang=task_language)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1405 | <code>        vts, _ = embedding_model.encode(["ok"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1406 | <code>        vector_size = len(vts[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1407 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1408 | <code>        error_message = f"Fail to bind embedding model: {str(e)}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1409 | <code>        progress_callback(-1, msg=error_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1410 | <code>        logging.exception(error_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1411 | <code>        raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1413 | <code>    init_kb(task, vector_size)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1415 | <code>    if task_type[: len("dataflow")] == "dataflow":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1416 | <code>        await run_dataflow(task)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1417 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1419 | <code>    if task_type == "raptor":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1420 | <code>        ok, kb = KnowledgebaseService.get_by_id(task_dataset_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1421 | <code>        if not ok:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1422 | <code>            progress_callback(prog=-1.0, msg="Cannot found valid dataset for RAPTOR task")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1423 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1425 | <code>        kb_parser_config = kb.parser_config</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1426 | <code>        if not kb_parser_config.get("raptor", {}).get("use_raptor", False):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1427 | <code>            kb_parser_config.update(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1428 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1429 | <code>                    "raptor": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1430 | <code>                        "use_raptor": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1431 | <code>                        "prompt": "Please summarize the following paragraphs. Be careful with the numbers, do not make things up. Paragraphs as following:\n      {cluster_content}\nThe above is the content you need to summarize.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1432 | <code>                        "max_token": 256,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1433 | <code>                        "threshold": 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1434 | <code>                        "max_cluster": 64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1435 | <code>                        "random_seed": 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1436 | <code>                        "scope": "file",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1437 | <code>                        "clustering_method": "gmm",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1438 | <code>                        "tree_builder": "raptor",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1439 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1441 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1442 | <code>            update_result = KnowledgebaseService.update_by_id(kb.id, {"parser_config": kb_parser_config})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1443 | <code>            get_recording_context().save_func_return_value("KnowledgebaseService.update_by_id", update_result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1444 | <code>            if not update_result:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1445 | <code>                progress_callback(prog=-1.0, msg="Internal error: Invalid RAPTOR configuration")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1446 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1448 | <code>        # bind LLM for raptor</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1449 | <code>        chat_model_config = get_model_config_from_provider_instance(task_tenant_id, LLMType.CHAT, kb_task_llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1450 | <code>        chat_model = LLMBundle(task_tenant_id, chat_model_config, lang=task_language)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1451 | <code>        # run RAPTOR</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1452 | <code>        async with kg_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1453 | <code>            chunks, token_count, raptor_cleanup_chunks = await run_raptor_for_kb(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1454 | <code>                row=task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1455 | <code>                kb_parser_config=kb_parser_config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1456 | <code>                chat_mdl=chat_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1457 | <code>                embd_mdl=embedding_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1458 | <code>                vector_size=vector_size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1459 | <code>                callback=progress_callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1460 | <code>                doc_ids=task.get("doc_ids", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1461 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1462 | <code>        get_recording_context().record("raptor_chunks", chunks)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1463 | <code>        get_recording_context().record("raptor_token_count", token_count)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1464 | <code>        if fake_doc_ids := task.get("doc_ids", []):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1465 | <code>            task_doc_id = fake_doc_ids[0]  # use the first document ID to represent this task for logging purposes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1466 | <code>    # Either using graphrag or Standard chunking methods</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1467 | <code>    elif task_type == "graphrag":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1468 | <code>        ok, kb = KnowledgebaseService.get_by_id(task_dataset_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1469 | <code>        if not ok:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1470 | <code>            progress_callback(prog=-1.0, msg="Cannot found valid dataset for GraphRAG task")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1471 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1473 | <code>        kb_parser_config = kb.parser_config</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1474 | <code>        if not kb_parser_config.get("graphrag", {}).get("use_graphrag", False):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1475 | <code>            kb_parser_config.update(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1476 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1477 | <code>                    "graphrag": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1478 | <code>                        "use_graphrag": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1479 | <code>                        "entity_types": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1480 | <code>                            "organization",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1481 | <code>                            "person",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1482 | <code>                            "geo",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1483 | <code>                            "event",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1484 | <code>                            "category",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1485 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1486 | <code>                        "method": "light",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1487 | <code>                        "batch_chunk_token_size": 4096,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1488 | <code>                        "retry_attempts": 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1489 | <code>                        "retry_backoff_seconds": 2.0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1490 | <code>                        "retry_backoff_max_seconds": 60.0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1491 | <code>                        "build_subgraph_timeout_per_chunk_seconds": 300,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1492 | <code>                        "build_subgraph_min_timeout_seconds": 600,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1493 | <code>                        "merge_timeout_seconds": 180,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1494 | <code>                        "resolution_timeout_seconds": 1800,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1495 | <code>                        "community_timeout_seconds": 1800,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1496 | <code>                        "lock_acquire_timeout_seconds": 600,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1497 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1498 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1499 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1500 | <code>            update_result = KnowledgebaseService.update_by_id(kb.id, {"parser_config": kb_parser_config})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1501 | <code>            get_recording_context().save_func_return_value("KnowledgebaseService.update_by_id", update_result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1502 | <code>            if not update_result:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1503 | <code>                progress_callback(prog=-1.0, msg="Internal error: Invalid GraphRAG configuration")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1504 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1506 | <code>        graphrag_conf = kb_parser_config.get("graphrag", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1507 | <code>        start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1508 | <code>        chat_model_config = get_model_config_from_provider_instance(task_tenant_id, LLMType.CHAT, kb_task_llm_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1509 | <code>        chat_model = LLMBundle(task_tenant_id, chat_model_config, lang=task_language)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1510 | <code>        with_resolution = graphrag_conf.get("resolution", False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1511 | <code>        with_community = graphrag_conf.get("community", False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1512 | <code>        async with kg_limiter:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1513 | <code>            # await run_graphrag(task, task_language, with_resolution, with_community, chat_model, embedding_model, progress_callback)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1514 | <code>            from rag.graphrag.general.index import run_graphrag_for_kb  # Lazy load, save around 2s</code> | 导入 Python 依赖 `rag.graphrag.general.index`，供本模块调用其类型、函数或常量。 |
| 1515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1516 | <code>            result = await run_graphrag_for_kb(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1517 | <code>                row=task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1518 | <code>                doc_ids=task.get("doc_ids", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1519 | <code>                language=task_language,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1520 | <code>                kb_parser_config=kb_parser_config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1521 | <code>                chat_model=chat_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1522 | <code>                embedding_model=embedding_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1523 | <code>                callback=progress_callback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1524 | <code>                with_resolution=with_resolution,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1525 | <code>                with_community=with_community,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1526 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1527 | <code>            logging.info(f"GraphRAG task result for task {task}:\n{result}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1528 | <code>        get_recording_context().record("graphrag_result", result)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1529 | <code>        progress_callback(prog=1.0, msg="Knowledge Graph done ({:.2f}s)".format(timer() - start_ts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1530 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1531 | <code>    elif task_type == "mindmap":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1532 | <code>        progress_callback(1, "place holder")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1533 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1534 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1535 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1536 | <code>        # Standard chunking methods</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1537 | <code>        task["llm_id"] = doc_task_llm_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1538 | <code>        start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1539 | <code>        chunks = await build_chunks(task, progress_callback)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1540 | <code>        get_recording_context().record("chunks", chunks)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1541 | <code>        # Record chunk_ids_count for comparison</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1542 | <code>        chunk_ids = [c.get("id") for c in chunks if isinstance(c, dict) and "id" in c]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1543 | <code>        get_recording_context().record("chunk_ids_count", len(chunk_ids))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1544 | <code>        # Record chunks array for content comparison (first, middle, last, random)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1545 | <code>        logging.info("Build document {}: {:.2f}s".format(task_document_name, timer() - start_ts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1546 | <code>        if not chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1547 | <code>            progress_callback(1.0, msg=f"No chunk built from {task_document_name}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1548 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1549 | <code>        progress_callback(msg="Generate {} chunks".format(len(chunks)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1550 | <code>        start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1551 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1552 | <code>            token_count, vector_size = await embedding(chunks, embedding_model, task_parser_config, progress_callback)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1553 | <code>        except TaskCanceledException:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1554 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1555 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1556 | <code>            error_message = "Generate embedding error:{}".format(str(e))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1557 | <code>            progress_callback(-1, error_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1558 | <code>            logging.exception(error_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1559 | <code>            token_count = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1560 | <code>            raise</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 1561 | <code>        get_recording_context().record("token_count", token_count)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1562 | <code>        get_recording_context().record("vector_size", vector_size)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1563 | <code>        progress_message = "Embedding chunks ({:.2f}s)".format(timer() - start_ts)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1564 | <code>        logging.info(progress_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1565 | <code>        progress_callback(msg=progress_message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1566 | <code>        if task["parser_id"].lower() == "naive" and task["parser_config"].get("toc_extraction", False):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1567 | <code>            toc_thread = asyncio.create_task(asyncio.to_thread(build_TOC, task, chunks, progress_callback))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1569 | <code>    chunk_count = len(set([chunk["id"] for chunk in chunks]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1570 | <code>    start_ts = timer()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1572 | <code>    async def _maybe_insert_chunks(_chunks):</code> | 定义 Python 函数 `_maybe_insert_chunks`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1573 | <code>        if has_canceled(task_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1574 | <code>            progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1575 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1576 | <code>        insert_result = await insert_chunks(task_id, task_tenant_id, task_dataset_id, _chunks, progress_callback)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1577 | <code>        return bool(insert_result)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1580 | <code>        if not await _maybe_insert_chunks(chunks):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1581 | <code>            get_recording_context().record("insertion_result", "failed")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1582 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1583 | <code>        get_recording_context().record("insertion_result", "success")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1584 | <code>        if has_canceled(task_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1585 | <code>            progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1586 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1588 | <code>        if raptor_cleanup_chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1589 | <code>            cleaned_chunks = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1590 | <code>            for cleanup_doc_id, keep_method in raptor_cleanup_chunks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1591 | <code>                ret = await delete_raptor_chunks(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1592 | <code>                    cleanup_doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1593 | <code>                    task_tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1594 | <code>                    task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1595 | <code>                    keep_method=keep_method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1596 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1597 | <code>                cleaned_chunks += ret</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1598 | <code>                get_recording_context().save_func_return_value("delete_raptor_chunks", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1600 | <code>            if cleaned_chunks:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1601 | <code>                progress_callback(msg=f"Cleaned up {cleaned_chunks} stale RAPTOR chunks.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1603 | <code>        logging.info("Indexing doc({}), page({}-{}), chunks({}), elapsed: {:.2f}".format(task_document_name, task_from_page, task_to_page, len(chunks), timer() - start_ts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1605 | <code>        ret = DocumentService.increment_chunk_num(task_doc_id, task_dataset_id, token_count, chunk_count, 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1606 | <code>        get_recording_context().save_func_return_value("DocumentService.increment_chunk_num", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1608 | <code>        # Table parser: push metadata/both column values to document-level metadata for UI / chat filters</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1609 | <code>        if task.get("parser_id", "").lower() == "table":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1610 | <code>            eff_pc = merge_table_parser_config_from_kb(task)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1611 | <code>            logging.debug(f"[TABLE_META_DEBUG] table post-index: table_column_mode={eff_pc.get('table_column_mode')!r}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1612 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1613 | <code>                agg = aggregate_table_doc_metadata(chunks, task)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1614 | <code>                logging.debug(f"[TABLE_META_DEBUG] aggregated metadata: {agg}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1615 | <code>                strip_keys = table_parser_strip_doc_metadata_keys(eff_pc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1616 | <code>                existing = DocMetadataService.get_document_metadata(task_doc_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1617 | <code>                existing = existing if isinstance(existing, dict) else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1618 | <code>                preserved = {k: v for k, v in existing.items() if k not in strip_keys}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1619 | <code>                merged = update_metadata_to(dict(preserved), agg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1620 | <code>                logging.debug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1621 | <code>                    f"[TABLE_META_DEBUG] calling update_document_metadata for doc_id={task_doc_id}, "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1622 | <code>                    f"meta_fields keys={list(merged.keys())}, "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1623 | <code>                    f"table_strip_key_count={len(strip_keys)}, agg_keys={list(agg.keys())}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1624 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1625 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1626 | <code>                    ret = DocMetadataService.update_document_metadata(task_doc_id, merged)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1627 | <code>                    get_recording_context().save_func_return_value("DocMetadataService.update_document_metadata", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1628 | <code>                    logging.debug("[TABLE_META_DEBUG] update_document_metadata succeeded")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1629 | <code>                except Exception as ue:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1630 | <code>                    logging.error(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1631 | <code>                        "update_document_metadata failed (table parser, doc_id=%s): %s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1632 | <code>                        task_doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1633 | <code>                        ue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1634 | <code>                        exc_info=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1635 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1636 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1637 | <code>                logging.exception(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1638 | <code>                    "Table parser document metadata aggregation failed (doc_id=%s): %s",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1639 | <code>                    task_doc_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1640 | <code>                    e,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1641 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1643 | <code>        progress_callback(msg="Indexing done ({:.2f}s).".format(timer() - start_ts))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1645 | <code>        if toc_thread:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1646 | <code>            d = await toc_thread</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1647 | <code>            if d:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1648 | <code>                get_recording_context().record("toc_chunk", [d])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1649 | <code>                if not await _maybe_insert_chunks([d]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1650 | <code>                    get_recording_context().record("toc_inserted", False)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1651 | <code>                    return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1652 | <code>                get_recording_context().record("toc_inserted", True)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1653 | <code>                ret = DocumentService.increment_chunk_num(task_doc_id, task_dataset_id, 0, 1, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1654 | <code>                get_recording_context().save_func_return_value("DocumentService.increment_chunk_num", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1656 | <code>        if has_canceled(task_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1657 | <code>            progress_callback(-1, msg="Task has been canceled.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1658 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1660 | <code>        task_time_cost = timer() - task_start_ts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1661 | <code>        get_recording_context().record("task_status", "completed")</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1662 | <code>        progress_callback(prog=1.0, msg="Task done ({:.2f}s)".format(task_time_cost))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1663 | <code>        logging.info("Chunk doc({}), page({}-{}), chunks({}), token({}), elapsed:{:.2f}".format(task_document_name, task_from_page, task_to_page, len(chunks), token_count, task_time_cost))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1665 | <code>    finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1666 | <code>        if toc_thread is not None and not toc_thread.done():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1667 | <code>            toc_thread.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1668 | <code>        if has_canceled(task_id):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1669 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1670 | <code>                exists = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1671 | <code>                    settings.docStoreConn.index_exist,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1672 | <code>                    search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1673 | <code>                    task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1674 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1675 | <code>                if exists:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1676 | <code>                    ret = await thread_pool_exec(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1677 | <code>                        settings.docStoreConn.delete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1678 | <code>                        {"doc_id": task_doc_id},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1679 | <code>                        search.index_name(task_tenant_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1680 | <code>                        task_dataset_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1681 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1682 | <code>                    get_recording_context().save_func_return_value("docStoreConn.delete", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1683 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1684 | <code>                logging.exception(f"Remove doc({task_doc_id}) from docStore failed when task({task_id}) canceled, exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1687 | <code>async def handle_task():</code> | 定义 Python 函数 `handle_task`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1688 | <code>    global DONE_TASKS, FAILED_TASKS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1689 | <code>    redis_msg, task = await collect()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1690 | <code>    if not task:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1691 | <code>        await asyncio.sleep(5)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1692 | <code>        return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1694 | <code>    task_type = task["task_type"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1695 | <code>    pipeline_task_type = TASK_TYPE_TO_PIPELINE_TASK_TYPE.get(task_type, PipelineTaskType.PARSE) or PipelineTaskType.PARSE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1696 | <code>    task_id = task["id"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1697 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1698 | <code>        CURRENT_TASKS[task["id"]] = copy.deepcopy(task)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1699 | <code>        run_mode = os.environ.get("TE_RUN_MODE", "0")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1700 | <code>        logging.info(f"TE_RUN_MODE is {run_mode}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1702 | <code>        # Check if dry-run comparison is enabled via environment variable</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1703 | <code>        if run_mode == "1":  # dry run mode - compare</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1704 | <code>            set_recording_context(RecordingContext())</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1705 | <code>            await do_handle_task(task)  # original execution</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1706 | <code>            # dry run mode</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1707 | <code>            logging.info(f"-----dry run task:{task_id}, {task.get('name', '')}, doc id:{task.get('doc_id', '')}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1708 | <code>            await TaskManager.dry_run_task(task, get_recording_context(), chat_limiter, minio_limiter, chunk_limiter, embed_limiter, kg_limiter, set_progress, has_canceled)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1709 | <code>        elif run_mode == "0":  # use refactor-ed version</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1710 | <code>            # switch to refactor-ed version</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1711 | <code>            logging.info(f"-----run refactor-ed task executor:{task_id}, {task.get('name', '')}, doc id:{task.get('doc_id', '')}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1712 | <code>            set_recording_context(NullRecordingContext())</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1713 | <code>            await TaskManager.run_refactored_task(task, chat_limiter, minio_limiter, chunk_limiter, embed_limiter, kg_limiter, set_progress, has_canceled)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1714 | <code>        else:  # original version</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1715 | <code>            logging.info(f"-----run original task executor:{task_id}, {task.get('name', '')}, doc id:{task.get('doc_id', '')}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1716 | <code>            set_recording_context(NullRecordingContext())</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1717 | <code>            await do_handle_task(task)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1719 | <code>        DONE_TASKS += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1720 | <code>        CURRENT_TASKS.pop(task_id, None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1721 | <code>        logging.info(f"handle_task done for task {json.dumps(task)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1722 | <code>    except TaskCanceledException as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1723 | <code>        DONE_TASKS += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1724 | <code>        CURRENT_TASKS.pop(task_id, None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1725 | <code>        logging.info(f"handle_task canceled for task {task_id}: {getattr(e, 'msg', str(e))}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1726 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1727 | <code>        FAILED_TASKS += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1728 | <code>        CURRENT_TASKS.pop(task_id, None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1729 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1730 | <code>            err_msg = str(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1731 | <code>            while isinstance(e, exceptiongroup.ExceptionGroup):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1732 | <code>                e = e.exceptions[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1733 | <code>                err_msg += " -- " + str(e)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1734 | <code>            set_progress(task_id, prog=-1, msg=f"[Exception]: {err_msg}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1735 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1736 | <code>            logging.exception(f"[Exception]: {str(e)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1737 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1738 | <code>        logging.exception(f"handle_task got exception for task {json.dumps(task)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1739 | <code>    finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1740 | <code>        if not task.get("dataflow_id", ""):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1741 | <code>            referred_document_id = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1742 | <code>            if task_type in ["graphrag", "raptor", "mindmap"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1743 | <code>                referred_document_id = task["doc_ids"][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1744 | <code>            ret = PipelineOperationLogService.record_pipeline_operation(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1745 | <code>                document_id=task["doc_id"], pipeline_id="", task_type=pipeline_task_type, task_id=task_id, referred_document_id=referred_document_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1746 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1747 | <code>            get_recording_context().save_func_return_value("PipelineOperationLogService.record_pipeline_operation", ret)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1749 | <code>    redis_msg.ack()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1751 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1752 | <code>async def get_server_ip() -&gt; str:</code> | 定义 Python 函数 `get_server_ip`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1753 | <code>    # get ip by udp</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1754 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1755 | <code>        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1756 | <code>            s.connect(("8.8.8.8", 80))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1757 | <code>            return s.getsockname()[0]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1758 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1759 | <code>        logging.error(str(e))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1760 | <code>        return "Unknown"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1761 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1763 | <code>async def report_status():</code> | 定义 Python 函数 `report_status`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1764 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1765 | <code>    Periodically reports the executor's heartbeat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1766 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1767 | <code>    global PENDING_TASKS, LAG_TASKS, DONE_TASKS, FAILED_TASKS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1769 | <code>    ip_address = await get_server_ip()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1770 | <code>    pid = os.getpid()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1771 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1772 | <code>    # Register the executor in Redis</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1773 | <code>    REDIS_CONN.sadd("TASKEXE", CONSUMER_NAME)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1774 | <code>    redis_lock = RedisDistributedLock("clean_task_executor", lock_value=CONSUMER_NAME, timeout=60)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1776 | <code>    while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1777 | <code>        now = datetime.now()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1778 | <code>        now_ts = now.timestamp()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1780 | <code>        group_info = REDIS_CONN.queue_info(settings.get_svr_queue_name(0), SVR_CONSUMER_GROUP_NAME) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1781 | <code>        PENDING_TASKS = int(group_info.get("pending", 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1782 | <code>        LAG_TASKS = int(group_info.get("lag", 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1783 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1784 | <code>        current = copy.deepcopy(CURRENT_TASKS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1785 | <code>        heartbeat = json.dumps(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1786 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1787 | <code>                "ip_address": ip_address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1788 | <code>                "pid": pid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1789 | <code>                "name": CONSUMER_NAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1790 | <code>                "now": now.astimezone().isoformat(timespec="milliseconds"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1791 | <code>                "boot_at": BOOT_AT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1792 | <code>                "pending": PENDING_TASKS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1793 | <code>                "lag": LAG_TASKS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1794 | <code>                "done": DONE_TASKS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1795 | <code>                "failed": FAILED_TASKS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1796 | <code>                "current": current,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1797 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1798 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1800 | <code>        # Report heartbeat to Redis</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1801 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1802 | <code>            REDIS_CONN.zadd(CONSUMER_NAME, heartbeat, now_ts)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1803 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1804 | <code>            logging.warning(f"Failed to report heartbeat: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1805 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1806 | <code>            logging.debug(f"{CONSUMER_NAME} reported heartbeat: {heartbeat}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1807 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1809 | <code>        # Clean up own expired heartbeat</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1810 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1811 | <code>            REDIS_CONN.zremrangebyscore(CONSUMER_NAME, 0, now_ts - 60 * 30)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1812 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1813 | <code>            logging.warning(f"Failed to clean heartbeat: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1815 | <code>        # Clean other executors</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1816 | <code>        lock_acquired = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1817 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1818 | <code>            lock_acquired = redis_lock.acquire()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1819 | <code>        except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1820 | <code>            logging.warning(f"Failed to acquire Redis lock: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1821 | <code>        if lock_acquired:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1822 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1823 | <code>                task_executors = REDIS_CONN.smembers("TASKEXE") or set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1824 | <code>                for worker_name in task_executors:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1825 | <code>                    if worker_name == CONSUMER_NAME:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1826 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1827 | <code>                    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1828 | <code>                        last_heartbeat = REDIS_CONN.REDIS.zrevrange(worker_name, 0, 0, withscores=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1829 | <code>                    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1830 | <code>                        logging.warning(f"Failed to read zset for {worker_name}: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1831 | <code>                        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1833 | <code>                    if not last_heartbeat or now_ts - last_heartbeat[0][1] &gt; WORKER_HEARTBEAT_TIMEOUT:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1834 | <code>                        logging.info(f"{worker_name} expired, removed")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1835 | <code>                        REDIS_CONN.srem("TASKEXE", worker_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1836 | <code>                        REDIS_CONN.delete(worker_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1837 | <code>            except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1838 | <code>                logging.warning(f"Failed to clean other executors: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1839 | <code>            finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1840 | <code>                redis_lock.release()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1841 | <code>        await asyncio.sleep(30)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1844 | <code>async def task_manager():</code> | 定义 Python 函数 `task_manager`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1845 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1846 | <code>        await handle_task()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1847 | <code>    finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1848 | <code>        task_limiter.release()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1851 | <code>async def main():</code> | 定义 Python 函数 `main`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1852 | <code>    # Stagger executor startup to prevent connection storm to Infinity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1853 | <code>    # Extract worker number from CONSUMER_NAME (e.g., "task_executor_abc123_5" -&gt; 5)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1854 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1855 | <code>        worker_num = int(CONSUMER_NAME.rsplit("_", 1)[-1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1856 | <code>        # Add random delay: base delay + worker_num * 2.0s + random jitter</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1857 | <code>        # This spreads out connection attempts over several seconds</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1858 | <code>        startup_delay = worker_num * 2.0 + random.uniform(0, 0.5)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1859 | <code>        if startup_delay &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1860 | <code>            logging.info(f"Staggering startup by {startup_delay:.2f}s to prevent connection storm")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1861 | <code>            await asyncio.sleep(startup_delay)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1862 | <code>    except (ValueError, IndexError):</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1863 | <code>        pass  # Non-standard consumer name, skip delay</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1865 | <code>    logging.info(r"""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1866 | <code>    ____                      __  _</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1867 | <code>   /  _/___  ____ ____  _____/ /_(_)___  ____     ________  ______   _____  _____</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1868 | <code>   / // __ \/ __ `/ _ \/ ___/ __/ / __ \/ __ \   / ___/ _ \/ ___/ &#124; / / _ \/ ___/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1869 | <code> _/ // / / / /_/ /  __(__  ) /_/ / /_/ / / / /  (__  )  __/ /   &#124; &#124;/ /  __/ /</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1870 | <code>/___/_/ /_/\__, /\___/____/\__/_/\____/_/ /_/  /____/\___/_/    &#124;___/\___/_/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1871 | <code>          /____/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1872 | <code>    """)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1873 | <code>    logging.info(f"RAGFlow ingestion version: {get_ragflow_version()}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1874 | <code>    logging.info(f"ENABLE_DRY_RUN_COMPARISON: {os.environ.get('ENABLE_DRY_RUN_COMPARISON', '0')}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1875 | <code>    show_configs()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1876 | <code>    settings.init_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1877 | <code>    settings.check_and_install_torch()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1878 | <code>    logging.info(f"default embedding config: {settings.EMBEDDING_CFG}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1879 | <code>    settings.print_rag_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1880 | <code>    if sys.platform != "win32":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1881 | <code>        signal.signal(signal.SIGUSR1, start_tracemalloc_and_snapshot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1882 | <code>        signal.signal(signal.SIGUSR2, stop_tracemalloc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1883 | <code>    TRACE_MALLOC_ENABLED = int(os.environ.get("TRACE_MALLOC_ENABLED", "0"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1884 | <code>    if TRACE_MALLOC_ENABLED:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1885 | <code>        start_tracemalloc_and_snapshot(None, None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1887 | <code>    signal.signal(signal.SIGINT, signal_handler)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1888 | <code>    signal.signal(signal.SIGTERM, signal_handler)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1890 | <code>    report_task = asyncio.create_task(report_status())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1891 | <code>    tasks = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1892 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1893 | <code>    logging.info(f"RAGFlow ingestion is ready after {time.time() - start_ts}s initialization.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1894 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1895 | <code>        while not stop_event.is_set():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1896 | <code>            await task_limiter.acquire()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1897 | <code>            t = asyncio.create_task(task_manager())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1898 | <code>            tasks.append(t)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1899 | <code>    finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1900 | <code>        for t in tasks:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1901 | <code>            t.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1902 | <code>        await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1903 | <code>        report_task.cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1904 | <code>        await asyncio.gather(report_task, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1905 | <code>    logging.error("BUG!!! You should not reach here!!!")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1908 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1909 | <code>    # Parse command line arguments (consistent with SAAS version)</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1910 | <code>    parser = argparse.ArgumentParser(description="Task Executor")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1911 | <code>    parser.add_argument("-i", "--index", type=str, default="0")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1912 | <code>    parser.add_argument("-t", "--type", type=str, default="common", help="[common, graphrag, raptor, resume]")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1913 | <code>    args = parser.parse_args()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1915 | <code>    # Update global variables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1916 | <code>    TASK_TYPE = args.type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1917 | <code>    TE_IDX = args.index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1918 | <code>    CONSUMER_NAME = f"task_executor_{TASK_TYPE}_{TE_IDX}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1920 | <code>    faulthandler.enable()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1921 | <code>    init_root_logger(CONSUMER_NAME)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1922 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1923 | <code>        asyncio.run(main())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1924 | <code>    except Exception as e:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1925 | <code>        logging.exception(f"Unhandled exception: {e}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 1926 | <code>        sys.exit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
