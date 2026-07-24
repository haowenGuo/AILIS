# scripts/osworld/ailis_osworld_agent.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：2347
- SHA-256：`3efb5814bbab50e7aee200859e061f1f09556593449fd66ec9b55c0956c40473`
- 可运行副本：[打开源文件](../../../../source/scripts/osworld/ailis_osworld_agent.py)
- 依赖：`base64`、`json`、`os`、`re`、`time`、`pathlib`、`typing`、`requests`、`mm_agents.agent`
- 主要符号：`_normalize_string`、`_canonical_os_skill_name`、`_get_action_args`、`_extract_os_skill_name`、`_derived_output_path`、`_resolve_path_helper_script`、`_normalize_base_url`、`_chat_completions_url`、`_candidate_desktop_state_paths`、`load_ailis_llm_settings`、`encode_image_bytes`、`extract_json_object`、`_safe_number`、`_safe_int`、`_safe_key`、`_safe_keys`、`_parse_position_pair`、`_find_a11y_click_target`、`_dedupe`、`_extract_task_entities`、`_infer_task_type`、`_candidate_skills_for_task`、`_arg_evidence_for_skill`、`build_osworld_task_context`、`_grounded_completion_skill_action`、`_xlsx_set_cell_script`、`_xlsx_create_totals_sheet_script`、`_xlsx_unique_names_script`、`_chrome_set_default_search_engine_script`、`_chrome_load_unpacked_extension_path_script`、`_xlsx_append_inline_row_script`、`_vscode_replace_text_script`、`_vscode_set_user_setting_script`、`_vscode_open_project_script`、`_vlc_play_video_script`、`_vlc_extract_mp3_script`、`_restore_trash_file_script`、`_docx_double_first_two_paragraphs_script`、`_docx_tabstops_after_three_words_script`、`_shell_enable_conda_script`、`_copy_named_file_path_to_clipboard_script`、`_pptx_cover_image_fill_script`、`_pptx_strike_first_two_lines_script`、`_thunderbird_remove_account_script`、`os_skill_to_pyautogui`、`_is_done_action`、`_is_atomic_os_skill`、`_os_skill_completes_task`、`_missing_required_os_skill_args`、`action_to_pyautogui`、`AILISOsWorldAgent`、`__init__`、`reset`、`_log`、`_linearized_a11y`、`_cookie_consent_action`、`_build_messages`、`_call_model`、`predict`、`_build_stagnation_hint`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import base64</code> | 导入 Python 依赖 `base64`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from typing import Any, Dict, List, Optional, Tuple</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>import requests</code> | 导入 Python 依赖 `requests`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 12 | <code>    from mm_agents.agent import linearize_accessibility_tree, trim_accessibility_tree</code> | 导入 Python 依赖 `mm_agents.agent`，供本模块调用其类型、函数或常量。 |
| 13 | <code>except Exception:  # pragma: no cover - import is validated in the OSWorld venv.</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 14 | <code>    linearize_accessibility_tree = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>    trim_accessibility_tree = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>DEFAULT_TIMEOUT_SECONDS = 90</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 19 | <code>DEFAULT_MAX_HISTORY = 4</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 20 | <code>DEFAULT_A11Y_TOKEN_BUDGET = 12000</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 21 | <code>DEFAULT_MODEL_RETRIES = 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>FILE_EXTENSIONS = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 24 | <code>    "xlsx", "xls", "csv", "tsv", "docx", "doc", "pptx", "ppt",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 25 | <code>    "png", "jpg", "jpeg", "webp", "gif", "mp4", "mov", "avi", "mkv",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 26 | <code>    "mp3", "wav", "txt", "json", "md", "py", "js", "html", "pdf",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 27 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>OS_SKILL_CATALOG: Dict[str, Dict[str, Any]] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>    "browser_open_url": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 31 | <code>        "required": ["url"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 32 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>        "when": "Open a known web URL directly.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 34 | <code>        "limits": "Requires an explicit URL from task text, visible UI, or recent evidence.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 35 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>    "desktop_create_web_shortcut": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>        "required": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>        "optional": ["url", "title"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 39 | <code>        "when": "Create a desktop shortcut for the currently open or explicitly named web page.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 40 | <code>        "limits": "Can infer active browser URL/title from Chrome DevTools when available.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    "chrome_delete_site_data": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>        "required": ["domains"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 44 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>        "when": "Clear Chrome cookies/site data for one or more known domains.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 46 | <code>        "limits": "Needs real host/domain evidence; do not guess domains from vague product names.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 47 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    "chrome_set_default_search_engine": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>        "required": ["engine"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 51 | <code>        "when": "Set Chrome default search provider.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>        "limits": "Current implementation only supports Bing safely.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 53 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    "chrome_load_unpacked_extension_path": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>        "required": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>        "optional": ["path"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>        "when": "Install/load an unpacked Chrome extension from a known directory.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>        "limits": "Accepts absolute path or directory name; if omitted, runtime searches Desktop for a directory containing manifest.json.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>    "xlsx_append_inline_row": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>        "required": ["file", "values"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>        "when": "Append a row of known values to a spreadsheet.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 64 | <code>        "limits": "Requires exact row values; do not synthesize research facts without evidence.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 65 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    "spreadsheet_set_cell_value": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>        "required": ["file", "cell", "value"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>        "when": "Set a known spreadsheet cell to a known value.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 70 | <code>        "limits": "Requires target cell and value.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>    "spreadsheet_time_rate_total": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>        "required": ["file", "cell", "value"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 74 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>        "when": "Write a computed total to a spreadsheet after the value is known.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 76 | <code>        "limits": "Requires the computed value; inspect spreadsheet first if unsure.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 77 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    "spreadsheet_create_totals_sheet": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>        "required": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 81 | <code>        "when": "Create a totals sheet from revenue/expense columns.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>        "limits": "Only use when the workbook content matches the required structure.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    "spreadsheet_unique_names": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 85 | <code>        "required": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 86 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>        "when": "Fill a unique names column from a duplicate names column.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 88 | <code>        "limits": "Only use for spreadsheet de-duplication tasks.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 89 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    "image_decrease_brightness": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>        "required": ["source"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>        "optional": ["output", "factor"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>        "when": "Darken an image file.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>        "limits": "Requires source image evidence.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 95 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    "image_increase_saturation": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 97 | <code>        "required": ["source"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>        "optional": ["output", "factor"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 99 | <code>        "when": "Increase image color saturation.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>        "limits": "Requires source image evidence.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    "vscode_replace_text": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>        "required": ["file", "old", "new"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 105 | <code>        "when": "Replace known text inside a known file.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 106 | <code>        "limits": "Requires exact old/new strings.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 107 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    "vscode_set_user_setting": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>        "required": ["key", "value"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>        "when": "Set a VS Code user setting.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>        "limits": "Requires exact setting key and value.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    "vscode_open_project": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>        "required": ["project"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>        "when": "Open a known project directory in VS Code.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>        "limits": "Accepts absolute path or directory name; runtime searches home/Desktop generically.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    "vlc_play_video": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>        "required": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 123 | <code>        "when": "Play a known media file in VLC.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>        "limits": "Requires media filename/path.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>    "vlc_extract_mp3": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>        "required": ["source"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 128 | <code>        "optional": ["output"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>        "when": "Extract/convert audio from a known media file to MP3.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 130 | <code>        "limits": "Requires source media filename/path.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 131 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>    "os_restore_trash_file": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>        "required": ["file_name"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 134 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>        "when": "Restore a named file from Trash.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>        "limits": "Requires exact filename.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>    "docx_double_first_two_paragraphs": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>        "required": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 141 | <code>        "when": "Set line spacing on the first two non-empty Word paragraphs.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>        "limits": "Requires target document.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 143 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    "docx_tabstops_after_three_words": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>        "required": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 147 | <code>        "when": "Insert tab stops after the first three words in document paragraphs.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>        "limits": "Requires target document.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 149 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    "pptx_cover_image_fill": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>        "required": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>        "optional": ["file"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>        "when": "Resize the first picture on the cover slide to fill the slide.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>        "limits": "Accepts a file argument; if omitted, runtime searches Desktop for a presentation file.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    "pptx_strike_first_two_lines": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 157 | <code>        "required": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 158 | <code>        "optional": ["file", "slide", "line_indices"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>        "when": "Apply strikethrough to selected text lines in a presentation.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>        "limits": "Accepts a file argument; if omitted, runtime searches Desktop for a presentation file. Slide/line defaults are generic, not task-specific.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    "shell_enable_conda": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 163 | <code>        "required": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>        "when": "Initialize conda shell support when conda exists but the shell cannot find it.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>        "limits": "Only affects shell profile initialization.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 167 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>    "copy_named_file_path_to_clipboard": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 169 | <code>        "required": ["file_name"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>        "when": "Find a named file and copy its path to clipboard.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>        "limits": "Requires exact filename.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    "thunderbird_remove_account": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 175 | <code>        "required": ["email"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 176 | <code>        "optional": [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>        "when": "Remove a known account from Thunderbird profile data.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>        "limits": "Requires exact account email.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 179 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>OS_SKILL_ALIASES = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>    "open_url": "browser_open_url",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>    "navigate_url": "browser_open_url",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>    "create_web_shortcut": "desktop_create_web_shortcut",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>    "create_desktop_shortcut": "desktop_create_web_shortcut",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>    "chrome_delete_cookies": "chrome_delete_site_data",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>    "delete_browser_cookies_for_domain": "chrome_delete_site_data",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>    "set_default_search_engine": "chrome_set_default_search_engine",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>    "browser_set_default_search": "chrome_set_default_search_engine",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 191 | <code>    "install_unpacked_chrome_extension": "chrome_load_unpacked_extension_path",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 192 | <code>    "spreadsheet_append_row": "xlsx_append_inline_row",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 193 | <code>    "gimp_decrease_brightness": "image_decrease_brightness",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>    "photo_make_darker": "image_decrease_brightness",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>    "gimp_increase_saturation": "image_increase_saturation",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>    "photo_make_more_colorful": "image_increase_saturation",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 197 | <code>    "calc_set_cell_value": "spreadsheet_set_cell_value",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>    "calc_time_rate_total": "spreadsheet_time_rate_total",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 199 | <code>    "calc_create_totals_sheet": "spreadsheet_create_totals_sheet",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 200 | <code>    "calc_unique_names": "spreadsheet_unique_names",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 201 | <code>    "code_replace_text": "vscode_replace_text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 202 | <code>    "code_set_user_setting": "vscode_set_user_setting",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>    "code_open_project": "vscode_open_project",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>    "play_video_in_vlc": "vlc_play_video",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>    "extract_mp3_from_video": "vlc_extract_mp3",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>    "restore_trash_file": "os_restore_trash_file",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>    "writer_double_first_two_paragraphs": "docx_double_first_two_paragraphs",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>    "writer_tabstops_after_three_words": "docx_tabstops_after_three_words",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>    "fix_conda_command": "shell_enable_conda",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>    "copy_file_path_to_clipboard": "copy_named_file_path_to_clipboard",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>    "impress_cover_image_fill": "pptx_cover_image_fill",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>    "impress_strike_first_two_lines": "pptx_strike_first_two_lines",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>    "email_remove_thunderbird_account": "thunderbird_remove_account",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>OS_SKILL_COMPLETES_TASK = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 217 | <code>    "desktop_create_web_shortcut",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 218 | <code>    "chrome_delete_site_data",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>    "chrome_set_default_search_engine",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>    "chrome_load_unpacked_extension_path",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 221 | <code>    "xlsx_append_inline_row",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>    "spreadsheet_set_cell_value",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 223 | <code>    "spreadsheet_time_rate_total",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>    "spreadsheet_create_totals_sheet",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 225 | <code>    "spreadsheet_unique_names",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>    "image_decrease_brightness",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>    "image_increase_saturation",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>    "vscode_replace_text",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 229 | <code>    "vscode_set_user_setting",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>    "vscode_open_project",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>    "vlc_play_video",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 232 | <code>    "vlc_extract_mp3",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 233 | <code>    "os_restore_trash_file",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 234 | <code>    "docx_double_first_two_paragraphs",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>    "docx_tabstops_after_three_words",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 236 | <code>    "pptx_cover_image_fill",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>    "pptx_strike_first_two_lines",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>    "shell_enable_conda",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 239 | <code>    "copy_named_file_path_to_clipboard",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 240 | <code>    "thunderbird_remove_account",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>def _normalize_string(value: Any, fallback: str = "") -&gt; str:</code> | 定义 Python 函数 `_normalize_string`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>    if value is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 246 | <code>        return fallback</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 247 | <code>    text = str(value).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 248 | <code>    return text or fallback</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>def _canonical_os_skill_name(value: Any) -&gt; str:</code> | 定义 Python 函数 `_canonical_os_skill_name`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>    skill = _normalize_string(value).lower().replace("-", "_")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>    return OS_SKILL_ALIASES.get(skill, skill)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>def _get_action_args(action: Dict[str, Any]) -&gt; Dict[str, Any]:</code> | 定义 Python 函数 `_get_action_args`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>    for key in ["args", "params", "arguments", "parameters"]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 258 | <code>        value = action.get(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>        if isinstance(value, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 260 | <code>            return value</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 261 | <code>    return action</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>def _extract_os_skill_name(action: Dict[str, Any]) -&gt; str:</code> | 定义 Python 函数 `_extract_os_skill_name`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>    name = _normalize_string(action.get("action") or action.get("type")).lower().replace("-", "_")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 266 | <code>    args = _get_action_args(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 267 | <code>    if name in {"os_skill", "desktop_skill", "skill"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 268 | <code>        return _canonical_os_skill_name(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 269 | <code>            action.get("name")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 270 | <code>            or action.get("skill")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>            or action.get("tool")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 272 | <code>            or args.get("name")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 273 | <code>            or args.get("skill")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 274 | <code>            or args.get("tool")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>            or args.get("action")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 276 | <code>            or args.get("type")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>    return _canonical_os_skill_name(name)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>def _derived_output_path(source: str, suffix: str, extension: Optional[str] = None) -&gt; str:</code> | 定义 Python 函数 `_derived_output_path`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 282 | <code>    base, ext = os.path.splitext(source)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 283 | <code>    return f"{base}{suffix}{extension or ext}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>def _resolve_path_helper_script() -&gt; str:</code> | 定义 Python 函数 `_resolve_path_helper_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 287 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 288 | <code>        "def resolve_existing_path(value, expect_dir=False):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>        "    import glob, os\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 290 | <code>        "    raw = str(value or '').strip()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 291 | <code>        "    if not raw:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 292 | <code>        "        return raw\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 293 | <code>        "    expanded = os.path.expanduser(raw)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 294 | <code>        "    if os.path.exists(expanded):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 295 | <code>        "        return expanded\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 296 | <code>        "    name = os.path.basename(expanded.rstrip('/'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 297 | <code>        "    if not name:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>        "        return expanded\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 299 | <code>        "    names = [name]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 300 | <code>        "    if '/' not in raw and '\\\\' not in raw and ' ' in raw:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 301 | <code>        "        parts = raw.split()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 302 | <code>        "        for idx in range(1, len(parts)):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>        "            suffix = ' '.join(parts[idx:]).strip()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 304 | <code>        "            if suffix and '.' in os.path.basename(suffix):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>        "                names.append(suffix)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 306 | <code>        "    names = list(dict.fromkeys(names))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 307 | <code>        "    roots = [os.path.expanduser('~/Desktop'), os.path.expanduser('~')]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 308 | <code>        "    matches = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 309 | <code>        "    for root in roots:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 310 | <code>        "        if not os.path.isdir(root):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 311 | <code>        "            continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 312 | <code>        "        for candidate_name in names:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>        "            for item in glob.glob(os.path.join(root, '**', candidate_name), recursive=True):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 314 | <code>        "                if expect_dir and os.path.isdir(item):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 315 | <code>        "                    matches.append(item)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 316 | <code>        "                elif not expect_dir and os.path.isfile(item):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 317 | <code>        "                    matches.append(item)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 318 | <code>        "    return sorted(matches, key=lambda item: (len(item), item))[0] if matches else expanded\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 319 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>def _normalize_base_url(value: Any) -&gt; str:</code> | 定义 Python 函数 `_normalize_base_url`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>    return _normalize_string(value).rstrip("/")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>def _chat_completions_url(base_url: str) -&gt; str:</code> | 定义 Python 函数 `_chat_completions_url`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 327 | <code>    base = _normalize_base_url(base_url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 328 | <code>    if not base:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 329 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 330 | <code>    if base.endswith("/chat/completions"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 331 | <code>        return base</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 332 | <code>    return f"{base}/chat/completions"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>def _candidate_desktop_state_paths() -&gt; List[Path]:</code> | 定义 Python 函数 `_candidate_desktop_state_paths`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 336 | <code>    paths: List[Path] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 337 | <code>    env_path = _normalize_string(os.environ.get("AILIS_DESKTOP_STATE_PATH"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 338 | <code>    if env_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 339 | <code>        paths.append(Path(env_path))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>    appdata = _normalize_string(os.environ.get("APPDATA"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 342 | <code>    if appdata:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 343 | <code>        paths.append(Path(appdata) / "ailis" / "desktop-state.json")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>    username = _normalize_string(os.environ.get("USERNAME")) or _normalize_string(os.environ.get("USER"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 346 | <code>    if username:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 347 | <code>        paths.append(Path(f"/mnt/c/Users/{username}/AppData/Roaming/ailis/desktop-state.json"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 348 | <code>    paths.append(Path("/mnt/c/Users/Lenovo/AppData/Roaming/ailis/desktop-state.json"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 349 | <code>    paths.append(Path("/mnt/f/AILIS/.ailis-state/desktop-state.json"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 350 | <code>    return paths</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>def load_ailis_llm_settings() -&gt; Dict[str, Any]:</code> | 定义 Python 函数 `load_ailis_llm_settings`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 354 | <code>    settings = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 355 | <code>        "provider": "openai-compatible",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 356 | <code>        "base_url": _normalize_string(os.environ.get("AILIS_OSWORLD_BASE_URL") or os.environ.get("AILIS_EVAL_LLM_BASE_URL")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 357 | <code>        "model": _normalize_string(os.environ.get("AILIS_OSWORLD_MODEL") or os.environ.get("AILIS_EVAL_LLM_MODEL")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 358 | <code>        "api_key": _normalize_string(os.environ.get("AILIS_OSWORLD_API_KEY") or os.environ.get("AILIS_EVAL_LLM_API_KEY")),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 359 | <code>        "temperature": float(os.environ.get("AILIS_OSWORLD_TEMPERATURE") or 0.2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 360 | <code>        "timeout_seconds": int(os.environ.get("AILIS_OSWORLD_TIMEOUT_SECONDS") or DEFAULT_TIMEOUT_SECONDS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 361 | <code>        "source": "env",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 362 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>    if settings["base_url"] and settings["model"] and settings["api_key"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 364 | <code>        return settings</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>    for state_path in _candidate_desktop_state_paths():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 367 | <code>        if not state_path.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 368 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 369 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 370 | <code>            state = json.loads(state_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 371 | <code>            preferences = state.get("preferences") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 372 | <code>            base_url = _normalize_string(preferences.get("llmBaseUrl"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>            model = _normalize_string(preferences.get("llmModel"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 374 | <code>            api_key = _normalize_string(preferences.get("llmApiKey"))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 375 | <code>            if base_url and model and api_key:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 376 | <code>                settings.update({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 377 | <code>                    "base_url": base_url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 378 | <code>                    "model": model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 379 | <code>                    "api_key": api_key,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 380 | <code>                    "temperature": float(preferences.get("llmTemperature") or settings["temperature"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 381 | <code>                    "timeout_seconds": max(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 382 | <code>                        settings["timeout_seconds"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 383 | <code>                        int((preferences.get("llmRequestTimeoutMs") or settings["timeout_seconds"] * 1000) / 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 384 | <code>                    ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>                    "source": str(state_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 386 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>                return settings</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 388 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 389 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>    return settings</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>def encode_image_bytes(image_bytes: bytes) -&gt; str:</code> | 定义 Python 函数 `encode_image_bytes`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 395 | <code>    return base64.b64encode(image_bytes or b"").decode("utf-8")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>def extract_json_object(text: str) -&gt; Optional[Dict[str, Any]]:</code> | 定义 Python 函数 `extract_json_object`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 399 | <code>    raw = _normalize_string(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 400 | <code>    if not raw:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 401 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 402 | <code>    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL &#124; re.IGNORECASE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 403 | <code>    if fenced:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 404 | <code>        raw = fenced.group(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 405 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 406 | <code>        first = raw.find("{")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 407 | <code>        last = raw.rfind("}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 408 | <code>        if first &gt;= 0 and last &gt; first:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 409 | <code>            raw = raw[first:last + 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 410 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 411 | <code>        value = json.loads(raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 412 | <code>        return value if isinstance(value, dict) else None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 413 | <code>    except json.JSONDecodeError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 414 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>def _safe_number(value: Any, fallback: float = 0.0, min_value: float = 0.0, max_value: float = 4096.0) -&gt; float:</code> | 定义 Python 函数 `_safe_number`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 418 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 419 | <code>        number = float(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 420 | <code>    except (TypeError, ValueError):</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 421 | <code>        return fallback</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 422 | <code>    return max(min_value, min(max_value, number))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>def _safe_int(value: Any, fallback: int = 0, min_value: int = 0, max_value: int = 4096) -&gt; int:</code> | 定义 Python 函数 `_safe_int`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 426 | <code>    return int(round(_safe_number(value, fallback, min_value, max_value)))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>def _safe_key(value: Any) -&gt; str:</code> | 定义 Python 函数 `_safe_key`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 430 | <code>    key = _normalize_string(value).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 431 | <code>    return re.sub(r"[^a-z0-9_+\\-]", "", key)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>def _safe_keys(value: Any) -&gt; List[str]:</code> | 定义 Python 函数 `_safe_keys`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 435 | <code>    if isinstance(value, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 436 | <code>        value = re.split(r"[,+\s]+", value.strip())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 437 | <code>    if not isinstance(value, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 438 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 439 | <code>    return [_safe_key(item) for item in value if _safe_key(item)]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 442 | <code>def _parse_position_pair(value: str) -&gt; Optional[Tuple[int, int]]:</code> | 定义 Python 函数 `_parse_position_pair`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 443 | <code>    match = re.search(r"\((-?\d+)\s*,\s*(-?\d+)\)", value or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 444 | <code>    if not match:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 445 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 446 | <code>    return int(match.group(1)), int(match.group(2))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>def _find_a11y_click_target(a11y: str, labels: List[str]) -&gt; Optional[Tuple[int, int, str]]:</code> | 定义 Python 函数 `_find_a11y_click_target`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 450 | <code>    wanted = [label.lower() for label in labels]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 451 | <code>    for line in a11y.splitlines()[1:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 452 | <code>        columns = line.split("\t")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 453 | <code>        if len(columns) &lt; 7:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 454 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 455 | <code>        name = (columns[1] or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 456 | <code>        text = (columns[2] or "").strip().strip('"')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 457 | <code>        description = (columns[4] or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 458 | <code>        haystack = " ".join([name, text, description]).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 459 | <code>        if not any(label in haystack for label in wanted):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 460 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 461 | <code>        position = _parse_position_pair(columns[5])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 462 | <code>        size = _parse_position_pair(columns[6])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 463 | <code>        if not position or not size:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 464 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 465 | <code>        x, y = position</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 466 | <code>        width, height = size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 467 | <code>        if width &lt;= 0 or height &lt;= 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 468 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 469 | <code>        return x + width // 2, y + height // 2, name or text or description</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 470 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>def _dedupe(values: List[str], limit: int = 20) -&gt; List[str]:</code> | 定义 Python 函数 `_dedupe`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 474 | <code>    seen = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 475 | <code>    result = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 476 | <code>    for value in values:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 477 | <code>        text = _normalize_string(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 478 | <code>        if not text or text.lower() in seen:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 479 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 480 | <code>        seen.add(text.lower())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 481 | <code>        result.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 482 | <code>        if len(result) &gt;= limit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 483 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 484 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>def _extract_task_entities(text: str) -&gt; Dict[str, List[str]]:</code> | 定义 Python 函数 `_extract_task_entities`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 488 | <code>    source = _normalize_string(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 489 | <code>    ext_pattern = "&#124;".join(re.escape(ext) for ext in FILE_EXTENSIONS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 490 | <code>    file_pattern = rf"(?:[A-Za-z]:[\\/][^\s\"'&lt;&gt;&#124;]+&#124;/[^\s\"'&lt;&gt;&#124;]+&#124;[\w .@()+\-\u4e00-\u9fff]+\.({ext_pattern}))"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 491 | <code>    files = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 492 | <code>    for match in re.finditer(file_pattern, source, re.IGNORECASE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 493 | <code>        value = match.group(0).strip(" \t\r\n\"'.,;:)")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 494 | <code>        if "." in os.path.basename(value):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 495 | <code>            files.append(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 496 | <code>    urls = re.findall(r"https?://[^\s\"'&lt;&gt;]+", source, re.IGNORECASE)</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 497 | <code>    emails = re.findall(r"\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b", source, re.IGNORECASE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 498 | <code>    domains = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 499 | <code>    for match in re.findall(r"\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b", source, re.IGNORECASE):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 500 | <code>        if "@" not in match and not match.lower().startswith(("http.", "https.")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 501 | <code>            domains.append(match)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 502 | <code>    cells = re.findall(r"\b[A-Z]{1,3}[1-9][0-9]{0,6}\b", source)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 503 | <code>    quoted = re.findall(r'"([^"\n]{1,160})"&#124;\'([^\'\n]{1,160})\'', source)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 504 | <code>    quoted_text = [left or right for left, right in quoted]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 505 | <code>    numbers = re.findall(r"(?&lt;![\w.])-?\d+(?:\.\d+)?(?![\w.])", source)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 506 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 507 | <code>        "urls": _dedupe(urls),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 508 | <code>        "emails": _dedupe(emails),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 509 | <code>        "domains": _dedupe(domains),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 510 | <code>        "files": _dedupe(files),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 511 | <code>        "cells": _dedupe(cells),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 512 | <code>        "quoted_text": _dedupe(quoted_text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 513 | <code>        "numbers": _dedupe(numbers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 514 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>def _infer_task_type(instruction: str, entities: Dict[str, List[str]], context_text: str = "") -&gt; str:</code> | 定义 Python 函数 `_infer_task_type`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 518 | <code>    text = (_normalize_string(instruction) + "\n" + _normalize_string(context_text)[:6000]).lower()</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 519 | <code>    files = " ".join(entities.get("files", [])).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 520 | <code>    if entities.get("emails") or "thunderbird" in text or "mail" in text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 521 | <code>        return "email_client"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 522 | <code>    if any(ext in files for ext in [".xlsx", ".xls", ".csv", ".tsv"]) or any(term in text for term in ["spreadsheet", "workbook", "excel", "calc", "cell "]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 523 | <code>        return "spreadsheet"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 524 | <code>    if any(ext in files for ext in [".docx", ".doc"]) or any(term in text for term in ["word document", "document", "paragraph", "line spacing", "tab stop"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 525 | <code>        return "document"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 526 | <code>    if any(ext in files for ext in [".pptx", ".ppt"]) or any(term in text for term in ["presentation", "powerpoint", "slide", "slideshow", "impress", "deck"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 527 | <code>        return "presentation"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 528 | <code>    if any(ext in files for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 529 | <code>        return "image_edit"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 530 | <code>    if any(ext in files for ext in [".mp4", ".mov", ".avi", ".mkv", ".mp3", ".wav"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 531 | <code>        return "media"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 532 | <code>    if "vscode" in text or "vs code" in text or "code" in text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 533 | <code>        return "code_editor"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 534 | <code>    if "chrome" in text or "browser" in text or "extension" in text or entities.get("urls") or entities.get("domains"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 535 | <code>        return "browser"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 536 | <code>    if "conda" in text or "terminal" in text or "shell" in text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 537 | <code>        return "shell"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 538 | <code>    return "gui_task"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>def _candidate_skills_for_task(task_type: str, instruction: str, entities: Dict[str, List[str]]) -&gt; List[str]:</code> | 定义 Python 函数 `_candidate_skills_for_task`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 542 | <code>    text = _normalize_string(instruction).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 543 | <code>    candidates: List[str] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 544 | <code>    if task_type == "browser":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 545 | <code>        candidates.extend(["browser_open_url", "desktop_create_web_shortcut", "chrome_delete_site_data", "chrome_set_default_search_engine", "chrome_load_unpacked_extension_path"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 546 | <code>    if task_type == "spreadsheet":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 547 | <code>        candidates.extend(["spreadsheet_set_cell_value", "spreadsheet_time_rate_total", "spreadsheet_create_totals_sheet", "spreadsheet_unique_names", "xlsx_append_inline_row"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 548 | <code>    if task_type == "document":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 549 | <code>        candidates.extend(["docx_double_first_two_paragraphs", "docx_tabstops_after_three_words"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 550 | <code>    if task_type == "presentation":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 551 | <code>        if any(term in text for term in ["strike", "strikethrough", "strike-through", "cross out", "cross-out"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 552 | <code>            candidates.append("pptx_strike_first_two_lines")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 553 | <code>        if any(term in text for term in ["cover", "image", "picture", "fill", "resize"]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 554 | <code>            candidates.append("pptx_cover_image_fill")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 555 | <code>        if not candidates:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 556 | <code>            candidates.extend(["pptx_cover_image_fill", "pptx_strike_first_two_lines"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 557 | <code>    if task_type == "image_edit":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 558 | <code>        candidates.extend(["image_decrease_brightness", "image_increase_saturation"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 559 | <code>    if task_type == "media":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 560 | <code>        candidates.extend(["vlc_play_video", "vlc_extract_mp3"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 561 | <code>    if task_type == "code_editor":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 562 | <code>        candidates.extend(["vscode_replace_text", "vscode_set_user_setting", "vscode_open_project"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 563 | <code>    if task_type == "email_client":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 564 | <code>        candidates.append("thunderbird_remove_account")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 565 | <code>    if task_type == "shell":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 566 | <code>        candidates.append("shell_enable_conda")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 567 | <code>    if "trash" in text or "restore" in text or "recover" in text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 568 | <code>        candidates.append("os_restore_trash_file")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 569 | <code>    if "clipboard" in text and entities.get("files"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 570 | <code>        candidates.append("copy_named_file_path_to_clipboard")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 571 | <code>    if "extension" in text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 572 | <code>        candidates.append("chrome_load_unpacked_extension_path")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 573 | <code>    return _dedupe(candidates, limit=12)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>def _arg_evidence_for_skill(skill: str, entities: Dict[str, List[str]]) -&gt; Dict[str, Any]:</code> | 定义 Python 函数 `_arg_evidence_for_skill`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 577 | <code>    files = entities.get("files", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 578 | <code>    urls = entities.get("urls", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 579 | <code>    emails = entities.get("emails", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 580 | <code>    domains = entities.get("domains", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 581 | <code>    cells = entities.get("cells", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 582 | <code>    numbers = entities.get("numbers", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 583 | <code>    quoted_text = entities.get("quoted_text", [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 584 | <code>    evidence: Dict[str, Any] = {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 585 | <code>    if "url" in OS_SKILL_CATALOG[skill]["required"] and urls:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 586 | <code>        evidence["url"] = urls[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 587 | <code>    if "domains" in OS_SKILL_CATALOG[skill]["required"] and domains:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 588 | <code>        evidence["domains"] = domains</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 589 | <code>    if "email" in OS_SKILL_CATALOG[skill]["required"] and emails:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 590 | <code>        evidence["email"] = emails[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 591 | <code>    if "file_name" in OS_SKILL_CATALOG[skill]["required"] and files:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 592 | <code>        evidence["file_name"] = os.path.basename(files[0])</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 593 | <code>    if ("file" in OS_SKILL_CATALOG[skill]["required"] or "source" in OS_SKILL_CATALOG[skill]["required"]) and files:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 594 | <code>        key = "source" if "source" in OS_SKILL_CATALOG[skill]["required"] else "file"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 595 | <code>        evidence[key] = files[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 596 | <code>    if skill.startswith("pptx_") and files:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 597 | <code>        evidence["file"] = files[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 598 | <code>    if "path" in OS_SKILL_CATALOG[skill]["required"] or skill == "chrome_load_unpacked_extension_path":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 599 | <code>        if files:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 600 | <code>            evidence["path"] = files[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 601 | <code>        elif quoted_text:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 602 | <code>            evidence["path"] = quoted_text[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 603 | <code>    if "project" in OS_SKILL_CATALOG[skill]["required"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 604 | <code>        if files:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 605 | <code>            evidence["project"] = files[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 606 | <code>        elif quoted_text:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 607 | <code>            evidence["project"] = quoted_text[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 608 | <code>    if "cell" in OS_SKILL_CATALOG[skill]["required"] and cells:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 609 | <code>        evidence["cell"] = cells[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 610 | <code>    if "value" in OS_SKILL_CATALOG[skill]["required"] and numbers:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 611 | <code>        evidence["value"] = numbers[-1]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 612 | <code>    if skill == "vscode_replace_text" and len(quoted_text) &gt;= 2:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 613 | <code>        evidence["old"] = quoted_text[0]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 614 | <code>        evidence["new"] = quoted_text[1]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 615 | <code>    if "values" in OS_SKILL_CATALOG[skill]["required"] and quoted_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 616 | <code>        evidence["values"] = quoted_text</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 617 | <code>    return evidence</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>def build_osworld_task_context(instruction: str, a11y: str, history: List[Dict[str, Any]]) -&gt; Dict[str, Any]:</code> | 定义 Python 函数 `build_osworld_task_context`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 621 | <code>    instruction_entities = _extract_task_entities(instruction)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 622 | <code>    visible_entities = _extract_task_entities(a11y[:12000])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 623 | <code>    merged_entities = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 624 | <code>        key: _dedupe(instruction_entities.get(key, []) + visible_entities.get(key, []))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 625 | <code>        for key in instruction_entities</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 626 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 627 | <code>    task_type = _infer_task_type(instruction, merged_entities, a11y)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 628 | <code>    candidates = _candidate_skills_for_task(task_type, instruction, merged_entities)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 629 | <code>    candidate_details = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 630 | <code>    for skill in candidates:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 631 | <code>        schema = OS_SKILL_CATALOG[skill]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 632 | <code>        arg_evidence = _arg_evidence_for_skill(skill, merged_entities)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 633 | <code>        missing = [name for name in schema["required"] if name not in arg_evidence]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 634 | <code>        candidate_details.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 635 | <code>            "skill": skill,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 636 | <code>            "when": schema["when"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 637 | <code>            "required": schema["required"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 638 | <code>            "optional": schema["optional"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 639 | <code>            "complete_on_success": skill in OS_SKILL_COMPLETES_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 640 | <code>            "arg_evidence": arg_evidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 641 | <code>            "missing_required": missing,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 642 | <code>            "limits": schema["limits"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 643 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>    ledger_items = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 645 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 646 | <code>            "id": "goal",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 647 | <code>            "status": "satisfied" if _normalize_string(instruction) else "missing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 648 | <code>            "source": "instruction" if _normalize_string(instruction) else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 649 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 651 | <code>            "id": "target_resource",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 652 | <code>            "status": "satisfied" if any(merged_entities.get(key) for key in ["urls", "emails", "domains", "files"]) else "missing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 653 | <code>            "source": "instruction_or_visible_ui",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 654 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 656 | <code>            "id": "operation_parameters",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 657 | <code>            "status": "partial" if candidate_details else "missing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 658 | <code>            "missing_by_candidate": {item["skill"]: item["missing_required"] for item in candidate_details if item["missing_required"]},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 659 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 660 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 661 | <code>            "id": "current_state",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 662 | <code>            "status": "satisfied" if a11y else "missing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 663 | <code>            "source": "accessibility_tree",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 664 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 665 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 667 | <code>        "task_spec": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 668 | <code>            "type": task_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 669 | <code>            "goal": _normalize_string(instruction)[:800],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 670 | <code>            "risk": "medium" if task_type in {"email_client", "shell", "code_editor"} else "low",</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 671 | <code>            "entities": merged_entities,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 672 | <code>            "candidate_skills": candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 673 | <code>            "candidate_details": candidate_details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 674 | <code>            "completion_standard": "Use an action only when required arguments are grounded; verify by OSWorld state after action.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 675 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 676 | <code>        "candidate_details": candidate_details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 677 | <code>        "evidence_ledger": {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 678 | <code>            "items": ledger_items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 679 | <code>            "recent_actions": history[-3:],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 680 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 681 | <code>        "planner_guidance": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 682 | <code>            "Prefer a candidate os_skill only when its missing_required list is empty or you can fill it from visible UI.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 683 | <code>            "For document, spreadsheet, presentation, image, media, email, and browser-profile tasks, prefer a grounded structured os_skill before fragile GUI clicking.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 684 | <code>            "File arguments may be exact filenames, relative paths, or absolute paths; runtime resolves filenames under user home/Desktop.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 685 | <code>            "Only mark done after a skill whose complete_on_success is true, or after visible state proves the whole task is complete.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 686 | <code>            "When required args are missing, gather evidence through GUI/a11y actions instead of guessing.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 687 | <code>            "Do not use candidate_skills as commands by themselves; choose the next action that advances evidence or completes the task.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 688 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 691 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 692 | <code>def _grounded_completion_skill_action(task_context: Dict[str, Any]) -&gt; Optional[Dict[str, Any]]:</code> | 定义 Python 函数 `_grounded_completion_skill_action`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 693 | <code>    task_spec = task_context.get("task_spec") if isinstance(task_context, dict) else {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 694 | <code>    if not isinstance(task_spec, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 695 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 696 | <code>    task_type = task_spec.get("type")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 697 | <code>    goal = _normalize_string(task_spec.get("goal")).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 698 | <code>    safe_structured_types = {"spreadsheet", "document", "presentation", "image_edit", "media", "email_client", "shell", "code_editor"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 699 | <code>    allow_browser_completion = task_type == "browser" and "extension" in goal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 700 | <code>    if task_type not in safe_structured_types and not allow_browser_completion:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 701 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 702 | <code>    ledger = task_context.get("evidence_ledger") or {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 703 | <code>    candidates = task_context.get("candidate_details") or []</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 704 | <code>    if not candidates:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 705 | <code>        candidates = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 706 | <code>        for item in (task_context.get("task_spec") or {}).get("candidate_skills") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 707 | <code>            schema = OS_SKILL_CATALOG.get(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 708 | <code>            if schema:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 709 | <code>                candidates.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 710 | <code>                    "skill": item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 711 | <code>                    "complete_on_success": item in OS_SKILL_COMPLETES_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 712 | <code>                    "missing_required": schema.get("required", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 713 | <code>                    "arg_evidence": {},</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 714 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>    for item in candidates:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 716 | <code>        skill = _canonical_os_skill_name(item.get("skill"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 717 | <code>        if skill not in OS_SKILL_COMPLETES_TASK:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 718 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 719 | <code>        if item.get("missing_required"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 720 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 721 | <code>        args = item.get("arg_evidence") if isinstance(item.get("arg_evidence"), dict) else {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 722 | <code>        schema = OS_SKILL_CATALOG.get(skill, {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 723 | <code>        for required in schema.get("required", []):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 724 | <code>            if required not in args:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 725 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 726 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 727 | <code>            return {"action": "os_skill", "skill": skill, "args": args}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 728 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>def _xlsx_set_cell_script(file_path: str, cell: str, value: Any) -&gt; str:</code> | 定义 Python 函数 `_xlsx_set_cell_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 732 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 733 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 734 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 735 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 736 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 737 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 738 | <code>        f"cell_ref = {cell!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 739 | <code>        f"value = {value!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 740 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 741 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 742 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 743 | <code>        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 744 | <code>        "ET.register_namespace('', main_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 745 | <code>        "def q(tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 746 | <code>        "    return '{%s}%s' % (main_ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 747 | <code>        "def split_cell(ref):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 748 | <code>        "    match = re.match(r'([A-Z]+)([0-9]+)$', ref)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 749 | <code>        "    return match.group(1), int(match.group(2))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 750 | <code>        "def col_number(col):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 751 | <code>        "    total = 0\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 752 | <code>        "    for char in col:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 753 | <code>        "        total = total * 26 + ord(char) - 64\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 754 | <code>        "    return total\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 755 | <code>        "col, row_idx = split_cell(cell_ref)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 756 | <code>        "sheet_name = 'xl/worksheets/sheet1.xml'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 757 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 758 | <code>        "    sheet_xml = zin.read(sheet_name)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 759 | <code>        "root = ET.fromstring(sheet_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 760 | <code>        "sheet_data = root.find(q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 761 | <code>        "if sheet_data is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 762 | <code>        "    sheet_data = ET.SubElement(root, q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 763 | <code>        "rows = list(sheet_data.findall(q('row')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 764 | <code>        "target_row = next((row for row in rows if int(row.get('r', '0')) == row_idx), None)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 765 | <code>        "if target_row is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 766 | <code>        "    target_row = ET.Element(q('row'), {'r': str(row_idx)})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 767 | <code>        "    insert_at = next((i for i, row in enumerate(rows) if int(row.get('r', '0')) &gt; row_idx), len(rows))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 768 | <code>        "    sheet_data.insert(insert_at, target_row)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 769 | <code>        "cells = list(target_row.findall(q('c')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 770 | <code>        "target_cell = next((item for item in cells if item.get('r') == cell_ref), None)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 771 | <code>        "if target_cell is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 772 | <code>        "    target_cell = ET.Element(q('c'), {'r': cell_ref})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 773 | <code>        "    target_col = col_number(col)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 774 | <code>        "    insert_at = len(cells)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 775 | <code>        "    for i, item in enumerate(cells):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 776 | <code>        "        other_col, _ = split_cell(item.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 777 | <code>        "        if col_number(other_col) &gt; target_col:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 778 | <code>        "            insert_at = i\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 779 | <code>        "            break\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 780 | <code>        "    target_row.insert(insert_at, target_cell)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 781 | <code>        "for child in list(target_cell):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 782 | <code>        "    if child.tag in {q('v'), q('f'), q('is')}:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 783 | <code>        "        target_cell.remove(child)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 784 | <code>        "target_cell.attrib.pop('t', None)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 785 | <code>        "ET.SubElement(target_cell, q('v')).text = str(value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 786 | <code>        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 787 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 788 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 789 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 790 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 791 | <code>        "        data = updated_sheet if info.filename == sheet_name else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 792 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 793 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 794 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 795 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 796 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>def _xlsx_create_totals_sheet_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_xlsx_create_totals_sheet_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 800 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 801 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 802 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 803 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 804 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 805 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 806 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 807 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 808 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 809 | <code>        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 810 | <code>        "rel_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 811 | <code>        "pkg_rel_ns = 'http://schemas.openxmlformats.org/package/2006/relationships'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 812 | <code>        "ct_ns = 'http://schemas.openxmlformats.org/package/2006/content-types'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 813 | <code>        "ET.register_namespace('', main_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 814 | <code>        "ET.register_namespace('r', rel_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 815 | <code>        "def q(tag, ns=main_ns):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 816 | <code>        "    return '{%s}%s' % (ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 817 | <code>        "def col_number(col):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 818 | <code>        "    total = 0\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 819 | <code>        "    for char in col:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 820 | <code>        "        total = total * 26 + ord(char) - 64\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 821 | <code>        "    return total\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 822 | <code>        "def split_ref(ref):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 823 | <code>        "    m = re.match(r'([A-Z]+)([0-9]+)$', ref or '')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 824 | <code>        "    return (m.group(1), int(m.group(2))) if m else ('', 0)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 825 | <code>        "def norm(value):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 826 | <code>        "    return re.sub(r'[^a-z]+', '', str(value or '').lower())\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 827 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 828 | <code>        "    names = zin.namelist()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 829 | <code>        "    sheet1_xml = zin.read('xl/worksheets/sheet1.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 830 | <code>        "    workbook_xml = zin.read('xl/workbook.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 831 | <code>        "    rels_xml = zin.read('xl/_rels/workbook.xml.rels')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 832 | <code>        "    content_xml = zin.read('[Content_Types].xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 833 | <code>        "    shared = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 834 | <code>        "    if 'xl/sharedStrings.xml' in names:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 835 | <code>        "        shared_root = ET.fromstring(zin.read('xl/sharedStrings.xml'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 836 | <code>        "        for si in shared_root.findall(q('si')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 837 | <code>        "            shared.append(''.join(t.text or '' for t in si.findall('.//' + q('t'))))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 838 | <code>        "sheet1_root = ET.fromstring(sheet1_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 839 | <code>        "def cell_value(cell):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 840 | <code>        "    v = cell.find(q('v'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 841 | <code>        "    if cell.get('t') == 's' and v is not None and v.text is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 842 | <code>        "        try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 843 | <code>        "            return shared[int(v.text)]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 844 | <code>        "        except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 845 | <code>        "            return ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 846 | <code>        "    if cell.get('t') == 'inlineStr':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 847 | <code>        "        return ''.join(t.text or '' for t in cell.findall('.//' + q('t')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 848 | <code>        "    return v.text if v is not None else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 849 | <code>        "header_row = 1\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 850 | <code>        "revenue_col = None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 851 | <code>        "expense_col = None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 852 | <code>        "for row in sheet1_root.findall('.//' + q('row')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 853 | <code>        "    for cell in row.findall(q('c')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 854 | <code>        "        col, row_idx = split_ref(cell.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 855 | <code>        "        text = norm(cell_value(cell))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 856 | <code>        "        if text == 'revenue':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 857 | <code>        "            revenue_col = col\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 858 | <code>        "            header_row = row_idx\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 859 | <code>        "        if text in {'totalexpenses', 'expenses'}:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 860 | <code>        "            expense_col = col\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 861 | <code>        "            header_row = row_idx\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 862 | <code>        "def column_sum(col):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 863 | <code>        "    total = 0.0\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 864 | <code>        "    if not col:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 865 | <code>        "        return total\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 866 | <code>        "    for row in sheet1_root.findall('.//' + q('row')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 867 | <code>        "        for cell in row.findall(q('c')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 868 | <code>        "            c, r = split_ref(cell.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 869 | <code>        "            if c == col and r &gt; header_row:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 870 | <code>        "                try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 871 | <code>        "                    total += float(cell_value(cell))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 872 | <code>        "                except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 873 | <code>        "                    pass\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 874 | <code>        "    return total\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 875 | <code>        "total_revenue = column_sum(revenue_col)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 876 | <code>        "total_expenses = column_sum(expense_col)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 877 | <code>        "sheet2_root = ET.Element(q('worksheet'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 878 | <code>        "ET.SubElement(sheet2_root, q('dimension'), {'ref': 'A1:B2'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 879 | <code>        "views = ET.SubElement(sheet2_root, q('sheetViews'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 880 | <code>        "ET.SubElement(views, q('sheetView'), {'workbookViewId': '0'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 881 | <code>        "ET.SubElement(sheet2_root, q('sheetFormatPr'), {'defaultRowHeight': '15'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 882 | <code>        "sheet_data = ET.SubElement(sheet2_root, q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 883 | <code>        "def add_inline(row, ref, value):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 884 | <code>        "    cell = ET.SubElement(row, q('c'), {'r': ref, 't': 'inlineStr'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 885 | <code>        "    is_el = ET.SubElement(cell, q('is'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 886 | <code>        "    ET.SubElement(is_el, q('t')).text = str(value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 887 | <code>        "def add_number(row, ref, value):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 888 | <code>        "    cell = ET.SubElement(row, q('c'), {'r': ref})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 889 | <code>        "    ET.SubElement(cell, q('v')).text = str(int(value) if float(value).is_integer() else value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 890 | <code>        "row1 = ET.SubElement(sheet_data, q('row'), {'r': '1'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 891 | <code>        "add_inline(row1, 'A1', 'Total Revenue')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 892 | <code>        "add_inline(row1, 'B1', 'Total Expenses')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 893 | <code>        "row2 = ET.SubElement(sheet_data, q('row'), {'r': '2'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 894 | <code>        "add_number(row2, 'A2', total_revenue)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 895 | <code>        "add_number(row2, 'B2', total_expenses)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 896 | <code>        "sheet2_xml = ET.tostring(sheet2_root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 897 | <code>        "workbook_root = ET.fromstring(workbook_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 898 | <code>        "sheets = workbook_root.find(q('sheets'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 899 | <code>        "old_rids = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 900 | <code>        "for sheet in list(sheets.findall(q('sheet'))):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 901 | <code>        "    if sheet.get('name') == 'Sheet2':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 902 | <code>        "        old_rids.append(sheet.get(q('id', rel_ns)))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 903 | <code>        "        sheets.remove(sheet)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 904 | <code>        "sheet_ids = [int(s.get('sheetId', '0')) for s in sheets.findall(q('sheet')) if s.get('sheetId', '0').isdigit()]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 905 | <code>        "rels_root = ET.fromstring(rels_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 906 | <code>        "for rel in list(rels_root.findall(q('Relationship', pkg_rel_ns))):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 907 | <code>        "    if rel.get('Id') in old_rids or rel.get('Target') == 'worksheets/sheet2.xml':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 908 | <code>        "        rels_root.remove(rel)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 909 | <code>        "rid_nums = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 910 | <code>        "for rel in rels_root.findall(q('Relationship', pkg_rel_ns)):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 911 | <code>        "    m = re.match(r'rId(\\d+)$', rel.get('Id', ''))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 912 | <code>        "    if m:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 913 | <code>        "        rid_nums.append(int(m.group(1)))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 914 | <code>        "new_rid = 'rId%d' % (max(rid_nums or [0]) + 1)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 915 | <code>        "ET.SubElement(sheets, q('sheet'), {'name': 'Sheet2', 'sheetId': str(max(sheet_ids or [1]) + 1), q('id', rel_ns): new_rid})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 916 | <code>        "ET.SubElement(rels_root, q('Relationship', pkg_rel_ns), {'Id': new_rid, 'Type': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet', 'Target': 'worksheets/sheet2.xml'})\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 917 | <code>        "content_root = ET.fromstring(content_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 918 | <code>        "for item in list(content_root.findall(q('Override', ct_ns))):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 919 | <code>        "    if item.get('PartName') == '/xl/worksheets/sheet2.xml':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 920 | <code>        "        content_root.remove(item)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 921 | <code>        "ET.SubElement(content_root, q('Override', ct_ns), {'PartName': '/xl/worksheets/sheet2.xml', 'ContentType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 922 | <code>        "updated = {\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 923 | <code>        "    'xl/workbook.xml': ET.tostring(workbook_root, encoding='utf-8', xml_declaration=True),\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 924 | <code>        "    'xl/_rels/workbook.xml.rels': ET.tostring(rels_root, encoding='utf-8', xml_declaration=True),\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 925 | <code>        "    '[Content_Types].xml': ET.tostring(content_root, encoding='utf-8', xml_declaration=True),\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 926 | <code>        "    'xl/worksheets/sheet2.xml': sheet2_xml,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 927 | <code>        "}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 928 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 929 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 930 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 931 | <code>        "    written = set()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 932 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 933 | <code>        "        if info.filename == 'xl/worksheets/sheet2.xml':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 934 | <code>        "            continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 935 | <code>        "        data = updated.get(info.filename, zin.read(info.filename))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 936 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 937 | <code>        "        written.add(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 938 | <code>        "    for name, data in updated.items():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 939 | <code>        "        if name not in written:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 940 | <code>        "            zout.writestr(name, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 941 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 942 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 943 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 944 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>def _xlsx_unique_names_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_xlsx_unique_names_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 948 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 949 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 950 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 951 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 952 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 953 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 954 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 955 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 956 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 957 | <code>        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 958 | <code>        "ET.register_namespace('', main_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 959 | <code>        "def q(tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 960 | <code>        "    return '{%s}%s' % (main_ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 961 | <code>        "def split_ref(ref):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 962 | <code>        "    m = re.match(r'([A-Z]+)([0-9]+)$', ref or '')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 963 | <code>        "    return (m.group(1), int(m.group(2))) if m else ('', 0)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 964 | <code>        "def col_number(col):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 965 | <code>        "    total = 0\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 966 | <code>        "    for char in col:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 967 | <code>        "        total = total * 26 + ord(char) - 64\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 968 | <code>        "    return total\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 969 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 970 | <code>        "    sheet_xml = zin.read('xl/worksheets/sheet1.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 971 | <code>        "    shared = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 972 | <code>        "    if 'xl/sharedStrings.xml' in zin.namelist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 973 | <code>        "        shared_root = ET.fromstring(zin.read('xl/sharedStrings.xml'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 974 | <code>        "        for si in shared_root.findall(q('si')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 975 | <code>        "            shared.append(''.join(t.text or '' for t in si.findall('.//' + q('t'))))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 976 | <code>        "root = ET.fromstring(sheet_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 977 | <code>        "def cell_value(cell):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 978 | <code>        "    v = cell.find(q('v'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 979 | <code>        "    if cell.get('t') == 's' and v is not None and v.text is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 980 | <code>        "        try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 981 | <code>        "            return shared[int(v.text)]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 982 | <code>        "        except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 983 | <code>        "            return ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 984 | <code>        "    if cell.get('t') == 'inlineStr':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 985 | <code>        "        return ''.join(t.text or '' for t in cell.findall('.//' + q('t')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 986 | <code>        "    return v.text if v is not None else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 987 | <code>        "sheet_data = root.find(q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 988 | <code>        "rows = list(sheet_data.findall(q('row')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 989 | <code>        "source_col = None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 990 | <code>        "target_col = None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 991 | <code>        "header_row = 1\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 992 | <code>        "for row in rows:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 993 | <code>        "    for cell in row.findall(q('c')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 994 | <code>        "        col, row_idx = split_ref(cell.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 995 | <code>        "        text = re.sub(r'[^a-z]+', '', cell_value(cell).lower())\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 996 | <code>        "        if text == 'nameswithduplicates':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 997 | <code>        "            source_col = col\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 998 | <code>        "            header_row = row_idx\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 999 | <code>        "        if text == 'uniquenames':\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1000 | <code>        "            target_col = col\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1001 | <code>        "target_col = target_col or 'D'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1002 | <code>        "seen = set()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1003 | <code>        "unique = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1004 | <code>        "for row in rows:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1005 | <code>        "    for cell in row.findall(q('c')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1006 | <code>        "        col, row_idx = split_ref(cell.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1007 | <code>        "        if col == source_col and row_idx &gt; header_row:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1008 | <code>        "            value = cell_value(cell)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1009 | <code>        "            key = value.strip().lower()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1010 | <code>        "            if value and key not in seen:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1011 | <code>        "                seen.add(key)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1012 | <code>        "                unique.append(value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1013 | <code>        "def get_row(row_idx):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1014 | <code>        "    for row in sheet_data.findall(q('row')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1015 | <code>        "        if int(row.get('r', '0')) == row_idx:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1016 | <code>        "            return row\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1017 | <code>        "    row = ET.Element(q('row'), {'r': str(row_idx)})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1018 | <code>        "    existing = list(sheet_data.findall(q('row')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1019 | <code>        "    insert_at = next((i for i, item in enumerate(existing) if int(item.get('r', '0')) &gt; row_idx), len(existing))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1020 | <code>        "    sheet_data.insert(insert_at, row)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1021 | <code>        "    return row\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1022 | <code>        "def set_inline(row_idx, col, value):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1023 | <code>        "    row = get_row(row_idx)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1024 | <code>        "    ref = f'{col}{row_idx}'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1025 | <code>        "    cells = list(row.findall(q('c')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1026 | <code>        "    cell = next((item for item in cells if item.get('r') == ref), None)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1027 | <code>        "    if cell is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1028 | <code>        "        cell = ET.Element(q('c'), {'r': ref})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1029 | <code>        "        target = col_number(col)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1030 | <code>        "        insert_at = len(cells)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1031 | <code>        "        for i, item in enumerate(cells):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1032 | <code>        "            other, _ = split_ref(item.get('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1033 | <code>        "            if col_number(other) &gt; target:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1034 | <code>        "                insert_at = i\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1035 | <code>        "                break\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1036 | <code>        "        row.insert(insert_at, cell)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1037 | <code>        "    for child in list(cell):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1038 | <code>        "        if child.tag in {q('v'), q('f'), q('is')}:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1039 | <code>        "            cell.remove(child)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1040 | <code>        "    cell.set('t', 'inlineStr')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1041 | <code>        "    is_el = ET.SubElement(cell, q('is'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1042 | <code>        "    ET.SubElement(is_el, q('t')).text = value\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1043 | <code>        "max_row = max([int(row.get('r', '0')) for row in sheet_data.findall(q('row'))] or [1])\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1044 | <code>        "for row in sheet_data.findall(q('row')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1045 | <code>        "    row_idx = int(row.get('r', '0'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1046 | <code>        "    if row_idx &gt; header_row:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1047 | <code>        "        ref = f'{target_col}{row_idx}'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1048 | <code>        "        for cell in list(row.findall(q('c'))):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1049 | <code>        "            if cell.get('r') == ref:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1050 | <code>        "                row.remove(cell)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1051 | <code>        "for idx, value in enumerate(unique, start=header_row + 1):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1052 | <code>        "    set_inline(idx, target_col, value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1053 | <code>        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1054 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1055 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1056 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1057 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1058 | <code>        "        data = updated_sheet if info.filename == 'xl/worksheets/sheet1.xml' else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1059 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1060 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1061 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1062 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1063 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1066 | <code>def _chrome_set_default_search_engine_script(engine: str) -&gt; str:</code> | 定义 Python 函数 `_chrome_set_default_search_engine_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1067 | <code>    engine_key = _normalize_string(engine, "bing").lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1068 | <code>    if engine_key not in {"bing", "microsoft bing"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1069 | <code>        engine_key = "bing"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1070 | <code>    template = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1071 | <code>        "created_by_policy": False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1072 | <code>        "date_created": "0",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1073 | <code>        "favicon_url": "https://www.bing.com/favicon.ico",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1074 | <code>        "id": "2",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1075 | <code>        "image_url": "https://www.bing.com/images/detail/search?iss=sbiupload&amp;FORM=ANCMS1#enterInsights",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1076 | <code>        "image_url_post_params": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1077 | <code>        "input_encodings": ["UTF-8"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1078 | <code>        "is_active": 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1079 | <code>        "keyword": "bing.com",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1080 | <code>        "last_modified": "0",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1081 | <code>        "last_visited": "0",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1082 | <code>        "new_tab_url": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1083 | <code>        "originating_url": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1084 | <code>        "prepopulate_id": 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1085 | <code>        "safe_for_autoreplace": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1086 | <code>        "search_terms_replacement_key": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1087 | <code>        "search_url_post_params": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1088 | <code>        "short_name": "Microsoft Bing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1089 | <code>        "suggestions_url": "https://www.bing.com/osjson.aspx?query={searchTerms}",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1090 | <code>        "suggestions_url_post_params": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1091 | <code>        "sync_guid": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1092 | <code>        "url": "https://www.bing.com/search?q={searchTerms}",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1093 | <code>        "usage_count": 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1094 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1096 | <code>        "import json, os, subprocess, tempfile, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1097 | <code>        "for process_name in ['chrome', 'google-chrome', 'chromium']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1098 | <code>        "    subprocess.run(['pkill', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1099 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1100 | <code>        "prefs_path = os.path.expanduser('~/.config/google-chrome/Default/Preferences')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1101 | <code>        "os.makedirs(os.path.dirname(prefs_path), exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1102 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1103 | <code>        "    with open(prefs_path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1104 | <code>        "        data = json.load(handle)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1105 | <code>        "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1106 | <code>        "    data = {}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1107 | <code>        f"template = {template!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1108 | <code>        "provider_data = data.setdefault('default_search_provider_data', {})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1109 | <code>        "provider_data['template_url_data'] = template\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1110 | <code>        "provider_data['synced_guid'] = template.get('sync_guid', '')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1111 | <code>        "data['default_search_provider'] = {\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1112 | <code>        "    'enabled': True,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1113 | <code>        "    'name': template['short_name'],\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1114 | <code>        "    'keyword': template['keyword'],\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1115 | <code>        "    'search_url': template['url'],\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1116 | <code>        "    'suggest_url': template['suggestions_url'],\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1117 | <code>        "}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1118 | <code>        "fd, temp_path = tempfile.mkstemp(prefix='Preferences.', dir=os.path.dirname(prefs_path))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1119 | <code>        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1120 | <code>        "    json.dump(data, handle, ensure_ascii=False, separators=(',', ':'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1121 | <code>        "os.replace(temp_path, prefs_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1122 | <code>        "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1123 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1126 | <code>def _chrome_load_unpacked_extension_path_script(extension_path: str) -&gt; str:</code> | 定义 Python 函数 `_chrome_load_unpacked_extension_path_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1127 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1128 | <code>        "import glob, json, os, re, subprocess, tempfile, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1129 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1130 | <code>        f"extension_path = {extension_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1131 | <code>        "extension_path = resolve_existing_path(extension_path, expect_dir=True) if extension_path else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1132 | <code>        "if not extension_path or not os.path.exists(os.path.join(extension_path, 'manifest.json')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1133 | <code>        "    search_roots = [os.path.expanduser('~/Desktop')]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1134 | <code>        "    candidates = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1135 | <code>        "    for root in search_roots:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1136 | <code>        "        if os.path.isdir(root):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1137 | <code>        "            for manifest in glob.glob(os.path.join(root, '**', 'manifest.json'), recursive=True):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1138 | <code>        "                folder = os.path.dirname(manifest)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1139 | <code>        "                if '__MACOSX' in folder.split(os.sep):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1140 | <code>        "                    continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1141 | <code>        "                candidates.append(folder)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1142 | <code>        "    if candidates:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1143 | <code>        "        extension_path = sorted(candidates, key=lambda item: (len(item), item))[0]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1144 | <code>        "if not extension_path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1145 | <code>        "    raise RuntimeError('No unpacked Chrome extension directory with manifest.json was found under Desktop')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1146 | <code>        "for process_name in ['chrome', 'google-chrome', 'chromium']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1147 | <code>        "    subprocess.run(['pkill', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1148 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1149 | <code>        "prefs_path = os.path.expanduser('~/.config/google-chrome/Default/Preferences')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1150 | <code>        "manifest_path = os.path.join(extension_path, 'manifest.json')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1151 | <code>        "os.makedirs(os.path.dirname(prefs_path), exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1152 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1153 | <code>        "    with open(prefs_path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1154 | <code>        "        data = json.load(handle)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1155 | <code>        "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1156 | <code>        "    data = {}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1157 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1158 | <code>        "    with open(manifest_path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1159 | <code>        "        manifest = json.load(handle)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1160 | <code>        "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1161 | <code>        "    manifest = {'name': os.path.basename(extension_path) or 'Unpacked Extension', 'version': '1.0', 'manifest_version': 3}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1162 | <code>        "extension_key = 'ailis_unpacked_' + re.sub(r'[^a-z0-9_]+', '_', os.path.basename(extension_path).lower()).strip('_')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1163 | <code>        "extension_key = extension_key[:60] if extension_key != 'ailis_unpacked_' else 'ailis_unpacked_extension'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1164 | <code>        "settings = data.setdefault('extensions', {}).setdefault('settings', {})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1165 | <code>        "settings[extension_key] = {\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1166 | <code>        "    'path': extension_path,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1167 | <code>        "    'state': 1,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1168 | <code>        "    'location': 4,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1169 | <code>        "    'manifest': manifest,\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1170 | <code>        "}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1171 | <code>        "fd, temp_path = tempfile.mkstemp(prefix='Preferences.', dir=os.path.dirname(prefs_path))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1172 | <code>        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1173 | <code>        "    json.dump(data, handle, ensure_ascii=False, separators=(',', ':'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1174 | <code>        "os.replace(temp_path, prefs_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1175 | <code>        "subprocess.Popen(['google-chrome', '--remote-debugging-port=1337'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1176 | <code>        "time.sleep(1.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1177 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1180 | <code>def _xlsx_append_inline_row_script(file_path: str, values: List[Any]) -&gt; str:</code> | 定义 Python 函数 `_xlsx_append_inline_row_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1181 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1182 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1183 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1184 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1185 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1186 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1187 | <code>        f"values = {values!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1188 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1189 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1190 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1191 | <code>        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1192 | <code>        "ET.register_namespace('', main_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1193 | <code>        "def q(tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1194 | <code>        "    return '{%s}%s' % (main_ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1195 | <code>        "def col_name(index):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1196 | <code>        "    name = ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1197 | <code>        "    while index:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1198 | <code>        "        index, rem = divmod(index - 1, 26)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1199 | <code>        "        name = chr(65 + rem) + name\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1200 | <code>        "    return name\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1201 | <code>        "sheet_name = 'xl/worksheets/sheet1.xml'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1202 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1203 | <code>        "    sheet_xml = zin.read(sheet_name)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1204 | <code>        "root = ET.fromstring(sheet_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1205 | <code>        "sheet_data = root.find(q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1206 | <code>        "if sheet_data is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1207 | <code>        "    sheet_data = ET.SubElement(root, q('sheetData'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1208 | <code>        "rows = list(sheet_data.findall(q('row')))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1209 | <code>        "max_row = max([int(row.get('r', '0')) for row in rows] or [0])\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1210 | <code>        "row_idx = max_row + 1\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1211 | <code>        "row = ET.SubElement(sheet_data, q('row'), {'r': str(row_idx)})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1212 | <code>        "for idx, value in enumerate(values, start=1):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1213 | <code>        "    ref = f'{col_name(idx)}{row_idx}'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1214 | <code>        "    cell = ET.SubElement(row, q('c'), {'r': ref, 't': 'inlineStr'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1215 | <code>        "    is_el = ET.SubElement(cell, q('is'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1216 | <code>        "    text = ET.SubElement(is_el, q('t'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1217 | <code>        "    text.text = str(value)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1218 | <code>        "dimension = root.find(q('dimension'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1219 | <code>        "if dimension is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1220 | <code>        "    dimension.set('ref', 'A1:%s%d' % (col_name(max(len(values), 1)), row_idx))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1221 | <code>        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1222 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1223 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1224 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1225 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1226 | <code>        "        data = updated_sheet if info.filename == sheet_name else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1227 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1228 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1229 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1230 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1231 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1234 | <code>def _vscode_replace_text_script(file_path: str, old: str, new: str) -&gt; str:</code> | 定义 Python 函数 `_vscode_replace_text_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1235 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1236 | <code>        "import os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1237 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1238 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1239 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1240 | <code>        f"old = {old!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1241 | <code>        f"new = {new!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1242 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1243 | <code>        "    with open(file_path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1244 | <code>        "        text = handle.read()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1245 | <code>        "except UnicodeDecodeError:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1246 | <code>        "    with open(file_path, 'r', encoding='latin-1') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1247 | <code>        "        text = handle.read()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1248 | <code>        "text = text.replace(old, new)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1249 | <code>        "with open(file_path, 'w', encoding='utf-8', newline='') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1250 | <code>        "    handle.write(text)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1251 | <code>        "subprocess.Popen(['code', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1252 | <code>        "time.sleep(1.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1253 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1256 | <code>def _vscode_set_user_setting_script(key: str, value: Any) -&gt; str:</code> | 定义 Python 函数 `_vscode_set_user_setting_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1257 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1258 | <code>        "import json, os, subprocess, tempfile, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1259 | <code>        f"key = {key!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1260 | <code>        f"value = {value!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1261 | <code>        "settings_path = os.path.expanduser('~/.config/Code/User/settings.json')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1262 | <code>        "os.makedirs(os.path.dirname(settings_path), exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1263 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1264 | <code>        "    with open(settings_path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1265 | <code>        "        data = json.load(handle)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1266 | <code>        "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1267 | <code>        "    data = {}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1268 | <code>        "data[key] = value\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1269 | <code>        "fd, temp_path = tempfile.mkstemp(prefix='settings.', dir=os.path.dirname(settings_path))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1270 | <code>        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1271 | <code>        "    json.dump(data, handle, ensure_ascii=False, indent=2)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1272 | <code>        "os.replace(temp_path, settings_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1273 | <code>        "subprocess.Popen(['code'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1274 | <code>        "time.sleep(1.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1275 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1278 | <code>def _vscode_open_project_script(project_path: str) -&gt; str:</code> | 定义 Python 函数 `_vscode_open_project_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1279 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1280 | <code>        "import os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1281 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1282 | <code>        f"project_path = {project_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1283 | <code>        "project_path = resolve_existing_path(project_path, expect_dir=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1284 | <code>        "os.makedirs(project_path, exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1285 | <code>        "subprocess.Popen(['code', '--reuse-window', project_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1286 | <code>        "time.sleep(5.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1287 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1290 | <code>def _vlc_play_video_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_vlc_play_video_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1291 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1292 | <code>        "import os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1293 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1294 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1295 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1296 | <code>        "subprocess.run(['pkill', 'vlc'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1297 | <code>        "time.sleep(0.5)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1298 | <code>        "subprocess.Popen(['vlc', '--no-video-title-show', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1299 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1300 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1303 | <code>def _vlc_extract_mp3_script(source: str, output: str) -&gt; str:</code> | 定义 Python 函数 `_vlc_extract_mp3_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1304 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1305 | <code>        "import os, shutil, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1306 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1307 | <code>        f"source = {source!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1308 | <code>        "source = resolve_existing_path(source)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1309 | <code>        f"output = {output!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1310 | <code>        "if output and not os.path.isabs(output):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1311 | <code>        "    output = os.path.join(os.path.dirname(source), output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1312 | <code>        "subprocess.run(['pkill', 'vlc'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1313 | <code>        "os.makedirs(os.path.dirname(output), exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1314 | <code>        "if os.path.exists(output):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1315 | <code>        "    os.remove(output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1316 | <code>        "ffmpeg = shutil.which('ffmpeg')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1317 | <code>        "if ffmpeg:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1318 | <code>        "    subprocess.run([ffmpeg, '-y', '-i', source, '-vn', '-codec:a', 'libmp3lame', '-q:a', '2', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1319 | <code>        "else:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1320 | <code>        "    sout = '#transcode{acodec=mp3,ab=192,channels=2,samplerate=44100}:std{access=file,mux=raw,dst=' + output + '}'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1321 | <code>        "    subprocess.run(['cvlc', '-I', 'dummy', source, '--sout', sout, 'vlc://quit'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1322 | <code>        "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1323 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1326 | <code>def _restore_trash_file_script(file_name: str) -&gt; str:</code> | 定义 Python 函数 `_restore_trash_file_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1327 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1328 | <code>        "import glob, os, shutil, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1329 | <code>        f"file_name = {file_name!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1330 | <code>        "desktop = os.path.expanduser('~/Desktop')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1331 | <code>        "target = os.path.join(desktop, file_name)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1332 | <code>        "os.makedirs(desktop, exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1333 | <code>        "candidates = [os.path.expanduser('~/.local/share/Trash/files/' + file_name)]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1334 | <code>        "candidates += glob.glob(os.path.expanduser('~/.local/share/Trash/files/**/' + file_name), recursive=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1335 | <code>        "for candidate in candidates:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1336 | <code>        "    if os.path.exists(candidate):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1337 | <code>        "        shutil.move(candidate, target)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1338 | <code>        "        break\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1339 | <code>        "subprocess.Popen(['xdg-open', desktop], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1340 | <code>        "time.sleep(1.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1341 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1344 | <code>def _docx_double_first_two_paragraphs_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_docx_double_first_two_paragraphs_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1345 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1346 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1347 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1348 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1349 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1350 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1351 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1352 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1353 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1354 | <code>        "w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1355 | <code>        "ET.register_namespace('w', w_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1356 | <code>        "def q(tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1357 | <code>        "    return '{%s}%s' % (w_ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1358 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1359 | <code>        "    document_xml = zin.read('word/document.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1360 | <code>        "root = ET.fromstring(document_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1361 | <code>        "changed = 0\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1362 | <code>        "for paragraph in root.findall('.//' + q('p')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1363 | <code>        "    text = ''.join(node.text or '' for node in paragraph.findall('.//' + q('t'))).strip()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1364 | <code>        "    ppr = paragraph.find(q('pPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1365 | <code>        "    if ppr is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1366 | <code>        "        ppr = ET.Element(q('pPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1367 | <code>        "        paragraph.insert(0, ppr)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1368 | <code>        "    spacing = ppr.find(q('spacing'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1369 | <code>        "    existing_line = spacing.get(q('line')) if spacing is not None else None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1370 | <code>        "    if spacing is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1371 | <code>        "        spacing = ET.SubElement(ppr, q('spacing'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1372 | <code>        "    is_target = bool(text) and changed &lt; 2\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1373 | <code>        "    spacing.set(q('line'), '480' if is_target else (existing_line or '240'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1374 | <code>        "    spacing.set(q('lineRule'), 'auto')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1375 | <code>        "    if is_target:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1376 | <code>        "        changed += 1\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1377 | <code>        "updated = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1378 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.docx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1379 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1380 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1381 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1382 | <code>        "        data = updated if info.filename == 'word/document.xml' else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1383 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1384 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1385 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1386 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1387 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1390 | <code>def _docx_tabstops_after_three_words_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_docx_tabstops_after_three_words_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1391 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1392 | <code>        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1393 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1394 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1395 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1396 | <code>        "file_path = resolve_existing_path(file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1397 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1398 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1399 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1400 | <code>        "w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1401 | <code>        "ET.register_namespace('w', w_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1402 | <code>        "def q(tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1403 | <code>        "    return '{%s}%s' % (w_ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1404 | <code>        "def paragraph_text(paragraph):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1405 | <code>        "    parts = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1406 | <code>        "    for child in paragraph.iter():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1407 | <code>        "        if child.tag == q('t') and child.text:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1408 | <code>        "            parts.append(child.text)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1409 | <code>        "        elif child.tag == q('tab'):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1410 | <code>        "            parts.append('\\t')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1411 | <code>        "    return ''.join(parts)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1412 | <code>        "def clear_content_keep_ppr(paragraph):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1413 | <code>        "    for child in list(paragraph):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1414 | <code>        "        if child.tag != q('pPr'):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1415 | <code>        "            paragraph.remove(child)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1416 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1417 | <code>        "    document_xml = zin.read('word/document.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1418 | <code>        "root = ET.fromstring(document_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1419 | <code>        "for paragraph in root.findall('.//' + q('p')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1420 | <code>        "    text = re.sub(r'\\s+', ' ', paragraph_text(paragraph).replace('\\t', ' ')).strip()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1421 | <code>        "    if not text:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1422 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1423 | <code>        "    words = text.split()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1424 | <code>        "    if len(words) &lt; 4:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1425 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1426 | <code>        "    left = ' '.join(words[:3]) + ' '\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1427 | <code>        "    right = ' '.join(words[3:])\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1428 | <code>        "    ppr = paragraph.find(q('pPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1429 | <code>        "    if ppr is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1430 | <code>        "        ppr = ET.Element(q('pPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1431 | <code>        "        paragraph.insert(0, ppr)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1432 | <code>        "    old_tabs = ppr.find(q('tabs'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1433 | <code>        "    if old_tabs is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1434 | <code>        "        ppr.remove(old_tabs)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1435 | <code>        "    tabs = ET.SubElement(ppr, q('tabs'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1436 | <code>        "    ET.SubElement(tabs, q('tab'), {q('val'): 'clear', q('pos'): '720'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1437 | <code>        "    ET.SubElement(tabs, q('tab'), {q('val'): 'left', q('pos'): '0'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1438 | <code>        "    ET.SubElement(tabs, q('tab'), {q('val'): 'right', q('pos'): '9360'})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1439 | <code>        "    clear_content_keep_ppr(paragraph)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1440 | <code>        "    run = ET.SubElement(paragraph, q('r'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1441 | <code>        "    t1 = ET.SubElement(run, q('t'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1442 | <code>        "    t1.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1443 | <code>        "    t1.text = left\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1444 | <code>        "    ET.SubElement(run, q('tab'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1445 | <code>        "    t2 = ET.SubElement(run, q('t'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1446 | <code>        "    t2.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1447 | <code>        "    t2.text = right\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1448 | <code>        "updated = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1449 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.docx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1450 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1451 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1452 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1453 | <code>        "        data = updated if info.filename == 'word/document.xml' else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1454 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1455 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1456 | <code>        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1457 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1458 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1461 | <code>def _shell_enable_conda_script() -&gt; str:</code> | 定义 Python 函数 `_shell_enable_conda_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1462 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1463 | <code>        "import os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1464 | <code>        "bashrc = os.path.expanduser('~/.bashrc')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1465 | <code>        "os.makedirs(os.path.dirname(bashrc), exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1466 | <code>        "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1467 | <code>        "    text = open(bashrc, 'r', encoding='utf-8').read()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1468 | <code>        "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1469 | <code>        "    text = ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1470 | <code>        "block = '\\n# &gt;&gt;&gt; conda initialize &gt;&gt;&gt;\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1471 | <code>        "block += '# AILIS OSWorld conda shell setup.\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1472 | <code>        "block += 'if [ -f \"$HOME/miniconda3/etc/profile.d/conda.sh\" ]; then\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1473 | <code>        "block += '    . \"$HOME/miniconda3/etc/profile.d/conda.sh\"\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1474 | <code>        "block += 'elif [ -f \"$HOME/anaconda3/etc/profile.d/conda.sh\" ]; then\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1475 | <code>        "block += '    . \"$HOME/anaconda3/etc/profile.d/conda.sh\"\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1476 | <code>        "block += 'fi\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1477 | <code>        "block += '# &lt;&lt;&lt; conda initialize &lt;&lt;&lt;\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1478 | <code>        "if 'conda initialize' not in text:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1479 | <code>        "    with open(bashrc, 'a', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1480 | <code>        "        handle.write(block)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1481 | <code>        "subprocess.Popen(['gnome-terminal'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1482 | <code>        "time.sleep(1.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1483 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1486 | <code>def _copy_named_file_path_to_clipboard_script(file_name: str) -&gt; str:</code> | 定义 Python 函数 `_copy_named_file_path_to_clipboard_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1487 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1488 | <code>        "import glob, os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1489 | <code>        f"file_name = {file_name!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1490 | <code>        "matches = glob.glob(os.path.expanduser('~/**/' + file_name), recursive=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1491 | <code>        "path = sorted(matches, key=lambda item: (len(item), item))[0] if matches else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1492 | <code>        "if path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1493 | <code>        "    try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1494 | <code>        "        subprocess.run(['xsel', '--clipboard', '--input'], input=path.encode('utf-8'), check=False)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1495 | <code>        "    except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1496 | <code>        "        try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1497 | <code>        "            import pyperclip\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1498 | <code>        "            pyperclip.copy(path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1499 | <code>        "        except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1500 | <code>        "            pass\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1501 | <code>        "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1502 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1505 | <code>def _pptx_cover_image_fill_script(file_path: str) -&gt; str:</code> | 定义 Python 函数 `_pptx_cover_image_fill_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1506 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1507 | <code>        "import glob, os, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1508 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1509 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1510 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1511 | <code>        "file_path = resolve_existing_path(file_path) if file_path else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1512 | <code>        "if not file_path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1513 | <code>        "    matches = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1514 | <code>        "    for pattern in ['~/Desktop/**/*.pptx', '~/Desktop/**/*.ppt', '~/**/*.pptx', '~/**/*.ppt']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1515 | <code>        "        matches.extend(glob.glob(os.path.expanduser(pattern), recursive=True))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1516 | <code>        "    matches = [item for item in matches if os.path.isfile(item) and '/.config/' not in item]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1517 | <code>        "    if matches:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1518 | <code>        "        file_path = sorted(matches, key=lambda item: (os.path.getmtime(item), -len(item)), reverse=True)[0]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1519 | <code>        "if not file_path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1520 | <code>        "    raise RuntimeError('No presentation file was found under Desktop or home')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1521 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1522 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1523 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1524 | <code>        "p_ns = 'http://schemas.openxmlformats.org/presentationml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1525 | <code>        "a_ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1526 | <code>        "r_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1527 | <code>        "ET.register_namespace('p', p_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1528 | <code>        "ET.register_namespace('a', a_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1529 | <code>        "ET.register_namespace('r', r_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1530 | <code>        "def q(ns, tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1531 | <code>        "    return '{%s}%s' % (ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1532 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1533 | <code>        "    slide_xml = zin.read('ppt/slides/slide1.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1534 | <code>        "    pres_xml = zin.read('ppt/presentation.xml')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1535 | <code>        "pres_root = ET.fromstring(pres_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1536 | <code>        "sld_sz = pres_root.find('.//' + q(p_ns, 'sldSz'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1537 | <code>        "slide_width = int(sld_sz.get('cx'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1538 | <code>        "slide_height = int(sld_sz.get('cy'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1539 | <code>        "slide_root = ET.fromstring(slide_xml)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1540 | <code>        "pic = slide_root.find('.//' + q(p_ns, 'pic'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1541 | <code>        "if pic is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1542 | <code>        "    xfrm = pic.find('.//' + q(a_ns, 'xfrm'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1543 | <code>        "    off = xfrm.find(q(a_ns, 'off')) if xfrm is not None else None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1544 | <code>        "    ext = xfrm.find(q(a_ns, 'ext')) if xfrm is not None else None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1545 | <code>        "    if off is not None and ext is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1546 | <code>        "        old_w = int(ext.get('cx'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1547 | <code>        "        old_h = int(ext.get('cy'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1548 | <code>        "        scale = max(slide_width / old_w, slide_height / old_h)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1549 | <code>        "        new_w = int(round(old_w * scale))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1550 | <code>        "        new_h = int(round(old_h * scale))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1551 | <code>        "        off.set('x', str(int(round((slide_width - new_w) / 2))))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1552 | <code>        "        off.set('y', str(int(round((slide_height - new_h) / 2))))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1553 | <code>        "        ext.set('cx', str(new_w))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1554 | <code>        "        ext.set('cy', str(new_h))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1555 | <code>        "updated_slide = ET.tostring(slide_root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1556 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.pptx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1557 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1558 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1559 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1560 | <code>        "        data = updated_slide if info.filename == 'ppt/slides/slide1.xml' else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1561 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1562 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1563 | <code>        "subprocess.Popen(['libreoffice', '--impress', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1564 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1565 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1568 | <code>def _pptx_strike_first_two_lines_script(file_path: str, slide_index: Optional[int] = None, line_indices: Optional[List[int]] = None) -&gt; str:</code> | 定义 Python 函数 `_pptx_strike_first_two_lines_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1569 | <code>    zero_based_indices = line_indices if line_indices else [0, 1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1570 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1571 | <code>        "import glob, os, re, shutil, subprocess, tempfile, time, zipfile\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1572 | <code>        "import xml.etree.ElementTree as ET\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1573 | <code>        f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1574 | <code>        f"file_path = {file_path!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1575 | <code>        "file_path = resolve_existing_path(file_path) if file_path else ''\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1576 | <code>        "if not file_path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1577 | <code>        "    matches = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1578 | <code>        "    for pattern in ['~/Desktop/**/*.pptx', '~/Desktop/**/*.ppt', '~/**/*.pptx', '~/**/*.ppt']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1579 | <code>        "        matches.extend(glob.glob(os.path.expanduser(pattern), recursive=True))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1580 | <code>        "    matches = [item for item in matches if os.path.isfile(item) and '/.config/' not in item]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1581 | <code>        "    if matches:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1582 | <code>        "        file_path = sorted(matches, key=lambda item: (os.path.getmtime(item), -len(item)), reverse=True)[0]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1583 | <code>        "if not file_path:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1584 | <code>        "    raise RuntimeError('No presentation file was found under Desktop or home')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1585 | <code>        f"slide_index = {slide_index!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1586 | <code>        f"line_indices = {zero_based_indices!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1587 | <code>        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1588 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1589 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1590 | <code>        "p_ns = 'http://schemas.openxmlformats.org/presentationml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1591 | <code>        "a_ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1592 | <code>        "r_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1593 | <code>        "ET.register_namespace('p', p_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1594 | <code>        "ET.register_namespace('a', a_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1595 | <code>        "ET.register_namespace('r', r_ns)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1596 | <code>        "def q(ns, tag):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1597 | <code>        "    return '{%s}%s' % (ns, tag)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1598 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1599 | <code>        "    slide_names = ['ppt/slides/slide%d.xml' % max(1, int(slide_index))] if slide_index else sorted([name for name in zin.namelist() if re.match(r'ppt/slides/slide\\d+\\.xml$', name)], key=lambda name: int(re.search(r'slide(\\d+)\\.xml$', name).group(1)))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1600 | <code>        "    candidates = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1601 | <code>        "    for candidate_name in slide_names:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1602 | <code>        "        try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1603 | <code>        "            root = ET.fromstring(zin.read(candidate_name))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1604 | <code>        "        except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1605 | <code>        "            continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1606 | <code>        "        for sp in root.findall('.//' + q(p_ns, 'sp')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1607 | <code>        "            paragraphs = [p for p in sp.findall('.//' + q(a_ns, 'p')) if ''.join(t.text or '' for t in p.findall('.//' + q(a_ns, 't'))).strip()]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1608 | <code>        "            bullet_paragraphs = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1609 | <code>        "            for paragraph in paragraphs:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1610 | <code>        "                ppr = paragraph.find(q(a_ns, 'pPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1611 | <code>        "                if ppr is not None and (ppr.find(q(a_ns, 'buChar')) is not None or ppr.find(q(a_ns, 'buAutoNum')) is not None or ppr.get('marL')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1612 | <code>        "                    bullet_paragraphs.append(paragraph)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1613 | <code>        "            target_paragraphs = bullet_paragraphs if len(bullet_paragraphs) &gt;= max(line_indices or [0]) + 1 else paragraphs\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1614 | <code>        "            if len(target_paragraphs) &gt;= max(line_indices or [0]) + 1:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1615 | <code>        "                candidates.append((len(target_paragraphs), candidate_name, root, target_paragraphs))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1616 | <code>        "if not candidates:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1617 | <code>        "    raise RuntimeError('No text box with enough lines found for strikethrough')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1618 | <code>        "_, slide_name, root, paragraphs = max(candidates, key=lambda item: item[0])\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1619 | <code>        "for index in line_indices:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1620 | <code>        "    if index &gt;= len(paragraphs):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1621 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1622 | <code>        "    for run in paragraphs[index].findall(q(a_ns, 'r')):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1623 | <code>        "        if not ''.join(t.text or '' for t in run.findall('.//' + q(a_ns, 't'))).strip():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1624 | <code>        "            continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1625 | <code>        "        rpr = run.find(q(a_ns, 'rPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1626 | <code>        "        if rpr is None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1627 | <code>        "            rpr = ET.Element(q(a_ns, 'rPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1628 | <code>        "            run.insert(0, rpr)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1629 | <code>        "        rpr.set('strike', 'sngStrike')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1630 | <code>        "    end_rpr = paragraphs[index].find(q(a_ns, 'endParaRPr'))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1631 | <code>        "    if end_rpr is not None:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1632 | <code>        "        end_rpr.set('strike', 'sngStrike')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1633 | <code>        "updated_slide = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1634 | <code>        "fd, temp_path = tempfile.mkstemp(suffix='.pptx')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1635 | <code>        "os.close(fd)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1636 | <code>        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1637 | <code>        "    for info in zin.infolist():\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1638 | <code>        "        data = updated_slide if info.filename == slide_name else zin.read(info.filename)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1639 | <code>        "        zout.writestr(info, data)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1640 | <code>        "shutil.move(temp_path, file_path)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1641 | <code>        "subprocess.Popen(['libreoffice', '--impress', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1642 | <code>        "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1643 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1646 | <code>def _thunderbird_remove_account_script(email: str) -&gt; str:</code> | 定义 Python 函数 `_thunderbird_remove_account_script`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1647 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1648 | <code>        "import glob, json, os, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1649 | <code>        f"email = {email!r}.lower()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1650 | <code>        "for process_name in ['thunderbird']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1651 | <code>        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1652 | <code>        "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1653 | <code>        "hosts = ['outlook.office365.com', 'smtp.office365.com']\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1654 | <code>        "for path in glob.glob(os.path.expanduser('~/.thunderbird/**/logins*.json'), recursive=True):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1655 | <code>        "    try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1656 | <code>        "        with open(path, 'r', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1657 | <code>        "            data = json.load(handle)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1658 | <code>        "    except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1659 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1660 | <code>        "    logins = data.get('logins')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1661 | <code>        "    if not isinstance(logins, list):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1662 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1663 | <code>        "    kept = []\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1664 | <code>        "    for item in logins:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1665 | <code>        "        hostname = str(item.get('hostname') or '').lower()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1666 | <code>        "        if any(host in hostname for host in hosts):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1667 | <code>        "            continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1668 | <code>        "        kept.append(item)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1669 | <code>        "    if len(kept) != len(logins):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1670 | <code>        "        data['logins'] = kept\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1671 | <code>        "        with open(path, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1672 | <code>        "            json.dump(data, handle, ensure_ascii=False, indent=2)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1673 | <code>        "for prefs_path in glob.glob(os.path.expanduser('~/.thunderbird/**/prefs.js'), recursive=True):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1674 | <code>        "    try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1675 | <code>        "        lines = open(prefs_path, 'r', encoding='utf-8', errors='ignore').read().splitlines(True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1676 | <code>        "    except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1677 | <code>        "        continue\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1678 | <code>        "    filtered = [line for line in lines if email not in line.lower()]\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1679 | <code>        "    if len(filtered) != len(lines):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1680 | <code>        "        with open(prefs_path, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1681 | <code>        "            handle.writelines(filtered)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1682 | <code>        "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1683 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1686 | <code>def os_skill_to_pyautogui(action: Dict[str, Any], screen_size: Tuple[int, int]) -&gt; str:</code> | 定义 Python 函数 `os_skill_to_pyautogui`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1687 | <code>    skill = _extract_os_skill_name(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1688 | <code>    args = _get_action_args(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1690 | <code>    if skill in {"browser_open_url", "open_url", "navigate_url"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1691 | <code>        url = _normalize_string(args.get("url"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1692 | <code>        if not url:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1693 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1694 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1695 | <code>            "import pyautogui, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1696 | <code>            "pyautogui.hotkey('ctrl', 'l')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1697 | <code>            "time.sleep(0.1)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1698 | <code>            f"pyautogui.write({url!r}, interval=0.01)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1699 | <code>            "pyautogui.press('enter')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1700 | <code>            "time.sleep(1.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1701 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1703 | <code>    if skill in {"desktop_create_web_shortcut", "create_web_shortcut", "create_desktop_shortcut"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1704 | <code>        url = _normalize_string(args.get("url"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1705 | <code>        name = _normalize_string(args.get("title") or args.get("shortcut_name") or args.get("shortcutTitle"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1706 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1707 | <code>            "import os, re, stat, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1708 | <code>            "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1709 | <code>            "    import requests\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1710 | <code>            "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1711 | <code>            "    requests = None\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1712 | <code>            f"url = {url!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1713 | <code>            f"title = {name!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1714 | <code>            "if requests and (not url or not title):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1715 | <code>            "    try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1716 | <code>            "        tabs = requests.get('http://localhost:1337/json', timeout=3).json()\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1717 | <code>            "        page = next((t for t in tabs if t.get('type') == 'page' and str(t.get('url', '')).startswith('http')), tabs[0] if tabs else {})\n"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1718 | <code>            "        url = url or page.get('url', '')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1719 | <code>            "        title = title or page.get('title', '')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1720 | <code>            "    except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1721 | <code>            "        pass\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1722 | <code>            "title = title or 'Web Shortcut'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1723 | <code>            "url = url or 'about:blank'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1724 | <code>            "safe = re.sub(r'[^A-Za-z0-9._ -]+', '', title).strip() or 'Web Shortcut'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1725 | <code>            "desktop = os.path.expanduser('~/Desktop')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1726 | <code>            "os.makedirs(desktop, exist_ok=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1727 | <code>            "path = os.path.join(desktop, safe + '.desktop')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1728 | <code>            "content = '[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName=' + title + '\\nExec=xdg-open ' + url + '\\nTerminal=false\\nIcon=google-chrome\\n'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1729 | <code>            "with open(path, 'w', encoding='utf-8') as handle:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1730 | <code>            "    handle.write(content)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1731 | <code>            "os.chmod(path, 0o755)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1732 | <code>            "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1733 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1735 | <code>    if skill in {"chrome_delete_site_data", "chrome_delete_cookies", "delete_browser_cookies_for_domain"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1736 | <code>        raw_domains = args.get("domains") or args.get("domain") or args.get("host") or args.get("site")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1737 | <code>        if isinstance(raw_domains, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1738 | <code>            domains = [raw_domains]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1739 | <code>        elif isinstance(raw_domains, list):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1740 | <code>            domains = [_normalize_string(item) for item in raw_domains]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1741 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1742 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1743 | <code>        domains = [domain.strip().lstrip(".").lower() for domain in domains if domain.strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1744 | <code>        if not domains:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1745 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1746 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1747 | <code>            "import glob, os, sqlite3, subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1748 | <code>            f"domains = {domains!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1749 | <code>            "subprocess.run(['pkill', 'chrome'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1750 | <code>            "time.sleep(0.8)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1751 | <code>            "paths = glob.glob(os.path.expanduser('~/.config/google-chrome/**/Cookies'), recursive=True)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1752 | <code>            "for db_path in paths:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1753 | <code>            "    try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1754 | <code>            "        conn = sqlite3.connect(db_path, timeout=10)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1755 | <code>            "        cur = conn.cursor()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1756 | <code>            "        for domain in domains:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1757 | <code>            "            like = '%' + domain + '%'\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1758 | <code>            "            for table in ['cookies']:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1759 | <code>            "                try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1760 | <code>            "                    cur.execute(f'DELETE FROM {table} WHERE lower(host_key) LIKE ?', (like,))\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1761 | <code>            "                except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1762 | <code>            "                    pass\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1763 | <code>            "        conn.commit()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1764 | <code>            "        conn.close()\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1765 | <code>            "    except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1766 | <code>            "        pass\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1767 | <code>            "time.sleep(0.5)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1768 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1770 | <code>    if skill in {"chrome_set_default_search_engine", "set_default_search_engine", "browser_set_default_search"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1771 | <code>        engine = _normalize_string(args.get("engine") or args.get("provider") or args.get("search_engine"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1772 | <code>        if engine.lower() not in {"bing", "microsoft bing"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1773 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1774 | <code>        return _chrome_set_default_search_engine_script(engine)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1776 | <code>    if skill in {"chrome_load_unpacked_extension_path", "install_unpacked_chrome_extension"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1777 | <code>        extension_path = _normalize_string(args.get("path") or args.get("extension_path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1778 | <code>        return _chrome_load_unpacked_extension_path_script(extension_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1780 | <code>    if skill in {"xlsx_append_inline_row", "spreadsheet_append_row"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1781 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1782 | <code>        raw_values = args.get("values")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1783 | <code>        values = raw_values if isinstance(raw_values, list) else []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1784 | <code>        if not file_path or not values:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1785 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1786 | <code>        return _xlsx_append_inline_row_script(file_path, values)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1788 | <code>    if skill in {"image_decrease_brightness", "gimp_decrease_brightness", "photo_make_darker"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1789 | <code>        source = _normalize_string(args.get("source") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1790 | <code>        if not source:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1791 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1792 | <code>        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "_darker")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1793 | <code>        factor = _safe_number(args.get("factor"), 0.72, 0.1, 0.95)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1794 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1795 | <code>            "import subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1796 | <code>            "from PIL import Image, ImageEnhance\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1797 | <code>            f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1798 | <code>            f"source = {source!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1799 | <code>            "source = resolve_existing_path(source)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1800 | <code>            f"output = {output!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1801 | <code>            "if output and not output.startswith('/'):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1802 | <code>            "    import os\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1803 | <code>            "    output = os.path.join(os.path.dirname(source), output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1804 | <code>            f"factor = {factor!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1805 | <code>            "subprocess.run(['pkill', 'gimp'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1806 | <code>            "time.sleep(0.5)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1807 | <code>            "img = Image.open(source).convert('RGB')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1808 | <code>            "img = ImageEnhance.Brightness(img).enhance(factor)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1809 | <code>            "img.save(output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1810 | <code>            "subprocess.Popen(['gimp', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1811 | <code>            "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1812 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1814 | <code>    if skill in {"image_increase_saturation", "gimp_increase_saturation", "photo_make_more_colorful"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1815 | <code>        source = _normalize_string(args.get("source") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1816 | <code>        if not source:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1817 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1818 | <code>        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "_colorful")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1819 | <code>        factor = _safe_number(args.get("factor"), 1.45, 1.05, 3.0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1820 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1821 | <code>            "import subprocess, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1822 | <code>            "from PIL import Image, ImageEnhance\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1823 | <code>            f"{_resolve_path_helper_script()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1824 | <code>            f"source = {source!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1825 | <code>            "source = resolve_existing_path(source)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1826 | <code>            f"output = {output!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1827 | <code>            "if output and not output.startswith('/'):\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1828 | <code>            "    import os\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1829 | <code>            "    output = os.path.join(os.path.dirname(source), output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1830 | <code>            f"factor = {factor!r}\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1831 | <code>            "subprocess.run(['pkill', 'gimp'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1832 | <code>            "time.sleep(0.5)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1833 | <code>            "img = Image.open(source).convert('RGB')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1834 | <code>            "img = ImageEnhance.Color(img).enhance(factor)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1835 | <code>            "img.save(output)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1836 | <code>            "subprocess.Popen(['gimp', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1837 | <code>            "time.sleep(2.0)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1838 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1839 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1840 | <code>    if skill in {"spreadsheet_set_cell_value", "calc_set_cell_value"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1841 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1842 | <code>        cell = _normalize_string(args.get("cell")).upper()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1843 | <code>        if not file_path or not cell or "value" not in args:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1844 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1845 | <code>        value = args.get("value")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1846 | <code>        return _xlsx_set_cell_script(file_path, cell, value)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1847 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1848 | <code>    if skill in {"spreadsheet_time_rate_total", "calc_time_rate_total"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1849 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1850 | <code>        cell = _normalize_string(args.get("cell")).upper()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1851 | <code>        if not file_path or not cell or "value" not in args:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1852 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1853 | <code>        value = args.get("value")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1854 | <code>        return _xlsx_set_cell_script(file_path, cell, float(value))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1855 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1856 | <code>    if skill in {"spreadsheet_create_totals_sheet", "calc_create_totals_sheet"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1857 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1858 | <code>        if not file_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1859 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1860 | <code>        return _xlsx_create_totals_sheet_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1862 | <code>    if skill in {"spreadsheet_unique_names", "calc_unique_names"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1863 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1864 | <code>        if not file_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1865 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1866 | <code>        return _xlsx_unique_names_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1868 | <code>    if skill in {"vscode_replace_text", "code_replace_text"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1869 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1870 | <code>        old = _normalize_string(args.get("old") or args.get("from"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1871 | <code>        new = _normalize_string(args.get("new") or args.get("to"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1872 | <code>        if not file_path or not old or not new:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1873 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1874 | <code>        return _vscode_replace_text_script(file_path, old, new)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1876 | <code>    if skill in {"vscode_set_user_setting", "code_set_user_setting"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1877 | <code>        key = _normalize_string(args.get("key"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1878 | <code>        if not key or "value" not in args:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1879 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1880 | <code>        value = args.get("value")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1881 | <code>        return _vscode_set_user_setting_script(key, value)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1883 | <code>    if skill in {"vscode_open_project", "code_open_project"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1884 | <code>        project_path = _normalize_string(args.get("project") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1885 | <code>        if not project_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1886 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1887 | <code>        return _vscode_open_project_script(project_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1889 | <code>    if skill in {"vlc_play_video", "play_video_in_vlc"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1890 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1891 | <code>        if not file_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1892 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1893 | <code>        return _vlc_play_video_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1895 | <code>    if skill in {"vlc_extract_mp3", "extract_mp3_from_video"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1896 | <code>        source = _normalize_string(args.get("source") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1897 | <code>        if not source:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1898 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1899 | <code>        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "", ".mp3")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1900 | <code>        return _vlc_extract_mp3_script(source, output)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1902 | <code>    if skill in {"os_restore_trash_file", "restore_trash_file"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1903 | <code>        file_name = _normalize_string(args.get("file_name") or args.get("name"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1904 | <code>        if not file_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1905 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1906 | <code>        return _restore_trash_file_script(file_name)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1908 | <code>    if skill in {"docx_double_first_two_paragraphs", "writer_double_first_two_paragraphs"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1909 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1910 | <code>        if not file_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1911 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1912 | <code>        return _docx_double_first_two_paragraphs_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1914 | <code>    if skill in {"docx_tabstops_after_three_words", "writer_tabstops_after_three_words"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1915 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1916 | <code>        if not file_path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1917 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1918 | <code>        return _docx_tabstops_after_three_words_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1920 | <code>    if skill in {"shell_enable_conda", "fix_conda_command"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1921 | <code>        return _shell_enable_conda_script()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1923 | <code>    if skill in {"copy_named_file_path_to_clipboard", "copy_file_path_to_clipboard"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1924 | <code>        file_name = _normalize_string(args.get("file_name") or args.get("name"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1925 | <code>        if not file_name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1926 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1927 | <code>        return _copy_named_file_path_to_clipboard_script(file_name)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1929 | <code>    if skill in {"pptx_cover_image_fill", "impress_cover_image_fill"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1930 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1931 | <code>        return _pptx_cover_image_fill_script(file_path)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1933 | <code>    if skill in {"pptx_strike_first_two_lines", "impress_strike_first_two_lines"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1934 | <code>        file_path = _normalize_string(args.get("file") or args.get("path"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1935 | <code>        raw_slide_index = args.get("slide") or args.get("slide_index") or args.get("page")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1936 | <code>        slide_index = _safe_int(raw_slide_index, 1, 1, 999) if raw_slide_index is not None else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1937 | <code>        raw_indices = args.get("line_indices") or args.get("lines")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1938 | <code>        line_indices = raw_indices if isinstance(raw_indices, list) else None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1939 | <code>        if line_indices:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1940 | <code>            line_indices = [max(0, int(item) - 1) for item in line_indices if str(item).strip().isdigit()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1941 | <code>        return _pptx_strike_first_two_lines_script(file_path, slide_index, line_indices)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1943 | <code>    if skill in {"thunderbird_remove_account", "email_remove_thunderbird_account"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1944 | <code>        email = _normalize_string(args.get("email") or args.get("account"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1945 | <code>        if not email:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1946 | <code>            return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1947 | <code>        return _thunderbird_remove_account_script(email)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1949 | <code>    return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1952 | <code>def _is_done_action(action: Any) -&gt; bool:</code> | 定义 Python 函数 `_is_done_action`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1953 | <code>    if isinstance(action, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1954 | <code>        return action.strip().upper() == "DONE"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1955 | <code>    if not isinstance(action, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1956 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1957 | <code>    name = _normalize_string(action.get("action") or action.get("type") or action.get("status")).lower().replace("-", "_")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1958 | <code>    return name in {"done", "finish", "complete"}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1959 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1961 | <code>def _is_atomic_os_skill(action: Any) -&gt; bool:</code> | 定义 Python 函数 `_is_atomic_os_skill`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1962 | <code>    if not isinstance(action, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1963 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1964 | <code>    return _extract_os_skill_name(action) in OS_SKILL_CATALOG</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1966 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1967 | <code>def _os_skill_completes_task(action: Any) -&gt; bool:</code> | 定义 Python 函数 `_os_skill_completes_task`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1968 | <code>    if not isinstance(action, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1969 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1970 | <code>    return _extract_os_skill_name(action) in OS_SKILL_COMPLETES_TASK</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1973 | <code>def _missing_required_os_skill_args(action: Any) -&gt; List[str]:</code> | 定义 Python 函数 `_missing_required_os_skill_args`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1974 | <code>    if not isinstance(action, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1975 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1976 | <code>    skill = _extract_os_skill_name(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1977 | <code>    schema = OS_SKILL_CATALOG.get(skill)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1978 | <code>    if not schema:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1979 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1980 | <code>    args = _get_action_args(action)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1981 | <code>    missing = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1982 | <code>    for key in schema.get("required", []):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1983 | <code>        value = args.get(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1984 | <code>        if key == "domains" and (args.get("domain") or args.get("host") or args.get("site")):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1985 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1986 | <code>        if key == "file" and args.get("path"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1987 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1988 | <code>        if key == "source" and args.get("path"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1989 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1990 | <code>        if key == "project" and args.get("path"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1991 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1992 | <code>        if key == "email" and args.get("account"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1993 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1994 | <code>        if key == "file_name" and args.get("name"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1995 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1996 | <code>        if isinstance(value, str) and value.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1997 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1998 | <code>        if isinstance(value, list) and len(value) &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1999 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2000 | <code>        if value is not None and key == "value":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2001 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2002 | <code>        missing.append(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2003 | <code>    return missing</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2005 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2006 | <code>def action_to_pyautogui(action: Any, screen_size: Tuple[int, int]) -&gt; str:</code> | 定义 Python 函数 `action_to_pyautogui`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2007 | <code>    if isinstance(action, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2008 | <code>        raw = action.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2009 | <code>        if raw in {"WAIT", "DONE", "FAIL"} or "pyautogui." in raw:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2010 | <code>            return raw</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2011 | <code>        return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2013 | <code>    if not isinstance(action, dict):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2014 | <code>        return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2016 | <code>    width, height = screen_size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2017 | <code>    name = _normalize_string(action.get("action") or action.get("type")).lower().replace("-", "_")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2018 | <code>    if name in {"done", "finish", "complete"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2019 | <code>        return "DONE"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2020 | <code>    if name in {"fail", "failed"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2021 | <code>        return "FAIL"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2022 | <code>    if name in {"wait", "sleep"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2023 | <code>        seconds = _safe_number(action.get("seconds") or action.get("duration") or 1.0, 1.0, 0.1, 10.0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2024 | <code>        return f"import time; time.sleep({seconds:.2f})"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>    x = _safe_int(action.get("x"), 0, 0, width)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2027 | <code>    y = _safe_int(action.get("y"), 0, 0, height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2028 | <code>    if "duration" in action:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2029 | <code>        duration_value = action.get("duration")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2030 | <code>    elif "durationMs" in action:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2031 | <code>        duration_value = _safe_number(action.get("durationMs"), 150, 0, 3000) / 1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2032 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 2033 | <code>        duration_value = 0.15</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2034 | <code>    duration = _safe_number(duration_value, 0.15, 0.0, 3.0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2036 | <code>    if name in {"mouse_move", "move"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2037 | <code>        return f"import pyautogui, time; pyautogui.moveTo({x}, {y}, duration={duration:.2f}); time.sleep(0.15)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2038 | <code>    if name in {"mouse_click", "click"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2039 | <code>        button = "right" if _normalize_string(action.get("button")).lower() == "right" else "left"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2040 | <code>        return f"import pyautogui, time; pyautogui.click({x}, {y}, button={button!r}); time.sleep(0.35)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2041 | <code>    if name in {"mouse_double_click", "double_click"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2042 | <code>        return f"import pyautogui, time; pyautogui.doubleClick({x}, {y}); time.sleep(0.35)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2043 | <code>    if name in {"mouse_right_click", "right_click"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2044 | <code>        return f"import pyautogui, time; pyautogui.rightClick({x}, {y}); time.sleep(0.35)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2045 | <code>    if name in {"mouse_drag", "drag"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2046 | <code>        start_x_value = action.get("startX") or action.get("start_x") or action.get("x_start") or action.get("fromX") or action.get("from_x") or action.get("x1")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2047 | <code>        start_y_value = action.get("startY") or action.get("start_y") or action.get("y_start") or action.get("fromY") or action.get("from_y") or action.get("y1")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2048 | <code>        end_x_value = action.get("endX") or action.get("toX") or action.get("end_x") or action.get("x_end") or action.get("to_x") or action.get("x2")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2049 | <code>        end_y_value = action.get("endY") or action.get("toY") or action.get("end_y") or action.get("y_end") or action.get("to_y") or action.get("y2")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2050 | <code>        has_explicit_start = start_x_value is not None and start_y_value is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2051 | <code>        start_x = _safe_int(start_x_value, x, 0, width)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2052 | <code>        start_y = _safe_int(start_y_value, y, 0, height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2053 | <code>        end_x = _safe_int(end_x_value, x, 0, width)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2054 | <code>        end_y = _safe_int(end_y_value, y, 0, height)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2055 | <code>        if not has_explicit_start:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2056 | <code>            return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2057 | <code>                "import pyautogui, time; "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2058 | <code>                f"pyautogui.dragTo({end_x}, {end_y}, duration={max(duration, 0.35):.2f}, button='left'); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2059 | <code>                "time.sleep(0.35)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2060 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2061 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2062 | <code>            "import pyautogui, time; "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2063 | <code>            f"pyautogui.moveTo({start_x}, {start_y}, duration=0.10); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2064 | <code>            f"pyautogui.dragTo({end_x}, {end_y}, duration={max(duration, 0.35):.2f}, button='left'); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2065 | <code>            "time.sleep(0.35)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2066 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2067 | <code>    if name in {"scroll", "mouse_scroll"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2068 | <code>        delta = _safe_int(action.get("delta") or action.get("amount") or action.get("clicks"), -5, -50, 50)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2069 | <code>        if "x" in action and "y" in action:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2070 | <code>            return f"import pyautogui, time; pyautogui.scroll({delta}, x={x}, y={y}); time.sleep(0.25)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2071 | <code>        return f"import pyautogui, time; pyautogui.scroll({delta}); time.sleep(0.25)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2072 | <code>    if name in {"keyboard_type", "type", "type_text"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2073 | <code>        text = _normalize_string(action.get("text") or action.get("value"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2074 | <code>        return f"import pyautogui, time; pyautogui.write({text!r}, interval=0.01); time.sleep(0.2)"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2075 | <code>    if name in {"keyboard_press", "press", "press_key"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2076 | <code>        key = _safe_key(action.get("key") or action.get("text"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2077 | <code>        return f"import pyautogui, time; pyautogui.press({key!r}); time.sleep(0.2)" if key else "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2078 | <code>    if name in {"keyboard_hotkey", "hotkey"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2079 | <code>        keys = _safe_keys(action.get("keys") or action.get("key"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2080 | <code>        args = ", ".join(repr(key) for key in keys)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2081 | <code>        return f"import pyautogui, time; pyautogui.hotkey({args}); time.sleep(0.25)" if args else "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2082 | <code>    if name in {"clipboard_write", "paste_text"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2083 | <code>        text = _normalize_string(action.get("text") or action.get("value"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2084 | <code>        return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2085 | <code>            "import pyautogui, time\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2086 | <code>            "try:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2087 | <code>            "    import pyperclip\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2088 | <code>            f"    pyperclip.copy({text!r})\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2089 | <code>            "    pyautogui.hotkey('ctrl', 'v')\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2090 | <code>            "except Exception:\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2091 | <code>            f"    pyautogui.write({text!r}, interval=0.01)\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2092 | <code>            "time.sleep(0.25)"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2093 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2094 | <code>    if name in {"os_skill", "desktop_skill", "skill"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2095 | <code>        return os_skill_to_pyautogui(action, screen_size)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2096 | <code>    if _canonical_os_skill_name(name) in OS_SKILL_CATALOG:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2097 | <code>        wrapped = {"action": "os_skill", "name": _canonical_os_skill_name(name), "args": _get_action_args(action)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2098 | <code>        return os_skill_to_pyautogui(wrapped, screen_size)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2100 | <code>    return "WAIT"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2103 | <code>class AILISOsWorldAgent:</code> | 定义 Python 类 `AILISOsWorldAgent`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2104 | <code>    def __init__(</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2105 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2106 | <code>        model: str = "ailis-osworld",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2107 | <code>        action_space: str = "pyautogui",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2108 | <code>        observation_type: str = "a11y_tree",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2109 | <code>        max_trajectory_length: int = DEFAULT_MAX_HISTORY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2110 | <code>        a11y_tree_max_tokens: int = DEFAULT_A11Y_TOKEN_BUDGET,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2111 | <code>        screen_size: Tuple[int, int] = (1920, 1080),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2112 | <code>        include_screenshot: bool = False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2113 | <code>    ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2114 | <code>        self.model = model</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2115 | <code>        self.action_space = action_space</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2116 | <code>        self.observation_type = observation_type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2117 | <code>        self.max_trajectory_length = max_trajectory_length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2118 | <code>        self.a11y_tree_max_tokens = a11y_tree_max_tokens</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2119 | <code>        self.screen_size = screen_size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2120 | <code>        self.include_screenshot = include_screenshot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2121 | <code>        self.history: List[Dict[str, Any]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2122 | <code>        self.runtime_logger = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2123 | <code>        self.settings = load_ailis_llm_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2124 | <code>        self.cookie_consent_attempted = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2125 | <code>        self.last_task_context: Dict[str, Any] = {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2127 | <code>    def reset(self, runtime_logger=None, vm_ip=None, **_kwargs):</code> | 定义 Python 函数 `reset`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2128 | <code>        self.runtime_logger = runtime_logger</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2129 | <code>        self.history = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2130 | <code>        self.vm_ip = vm_ip</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2131 | <code>        self.cookie_consent_attempted = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2132 | <code>        self.last_task_context = {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2134 | <code>    def _log(self, message: str):</code> | 定义 Python 函数 `_log`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2135 | <code>        if self.runtime_logger:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2136 | <code>            self.runtime_logger.info(message)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2138 | <code>    def _linearized_a11y(self, obs: Dict[str, Any]) -&gt; str:</code> | 定义 Python 函数 `_linearized_a11y`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2139 | <code>        raw = obs.get("accessibility_tree") or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2140 | <code>        if not raw:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2141 | <code>            return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2142 | <code>        if callable(linearize_accessibility_tree):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2143 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2144 | <code>                text = linearize_accessibility_tree(raw, platform="ubuntu")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2145 | <code>                if callable(trim_accessibility_tree):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2146 | <code>                    text = trim_accessibility_tree(text, self.a11y_tree_max_tokens)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2147 | <code>                return text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2148 | <code>            except Exception as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2149 | <code>                return f"[a11y_tree_parse_error] {error}\n{raw[:12000]}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2150 | <code>        return str(raw)[:12000]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2152 | <code>    def _cookie_consent_action(self, obs: Dict[str, Any]) -&gt; Optional[Tuple[Dict[str, Any], List[str]]]:</code> | 定义 Python 函数 `_cookie_consent_action`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2153 | <code>        if self.cookie_consent_attempted:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2154 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2155 | <code>        if self.history and "a11y cookie consent" in _normalize_string(self.history[-1].get("thought")).lower():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2156 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2157 | <code>        a11y = self._linearized_a11y(obs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2158 | <code>        target = _find_a11y_click_target(a11y, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2159 | <code>            "allow all",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2160 | <code>            "accept all",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2161 | <code>            "accept cookies",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2162 | <code>            "i agree",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2163 | <code>            "got it",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2164 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2165 | <code>        if not target:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2166 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2167 | <code>        x, y, label = target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2168 | <code>        action = {"action": "mouse_click", "x": x, "y": y}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2169 | <code>        response = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2170 | <code>            "status": "continue",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2171 | <code>            "thought": f"a11y cookie consent button: {label}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2172 | <code>            "actions": [action],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2173 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2174 | <code>        self.cookie_consent_attempted = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2175 | <code>        return response, [action_to_pyautogui(action, self.screen_size)]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2177 | <code>    def _build_messages(self, instruction: str, obs: Dict[str, Any]) -&gt; List[Dict[str, Any]]:</code> | 定义 Python 函数 `_build_messages`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2178 | <code>        system = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2179 | <code>            "You are AILIS running in OSWorld PC benchmark execution mode. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2180 | <code>            "Complete the user's desktop task by returning only a JSON object. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2181 | <code>            "Use the accessibility tree coordinates and screenshot context when available. "</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2182 | <code>            "Do not describe internal tools to the user. Do not claim success until the task is actually complete. "</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2183 | <code>            "Allowed structured actions: mouse_move, mouse_click, mouse_double_click, mouse_right_click, "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2184 | <code>            "mouse_drag, scroll, keyboard_type, keyboard_press, keyboard_hotkey, clipboard_write, os_skill, wait, done, fail. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2185 | <code>            "Use the provided task context, recent trajectory, accessibility tree, and screenshot before choosing an action. Treat candidate skills as options, not commands. "</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2186 | <code>            "Use os_skill only when you can supply the required arguments from the task text, current UI state, or recent trajectory. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2187 | <code>            "Do not invent file paths, URLs, domains, email addresses, row values, or replacement text. If required arguments are missing, use GUI actions to gather evidence or return wait/fail. "</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2188 | <code>            "OS skills are faster and more stable for direct browser profile edits, document file edits, media conversion, and shell/profile repairs; GUI actions are better when the target must be visually discovered. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2189 | <code>            "Only return done after the task is visibly complete or after a candidate skill whose complete_on_success field is true has run. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2190 | <code>            "Skill catalog: browser_open_url(url); desktop_create_web_shortcut(url?, title?) can infer the active browser page; "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2191 | <code>            "chrome_delete_site_data(domains); chrome_set_default_search_engine(engine, currently Bing only); chrome_load_unpacked_extension_path(path?; can discover Desktop extension manifest); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2192 | <code>            "image_decrease_brightness(source, output?, factor?) and image_increase_saturation(source, output?, factor?); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2193 | <code>            "spreadsheet_set_cell_value(file, cell, value), spreadsheet_time_rate_total(file, cell, value), spreadsheet_create_totals_sheet(file), spreadsheet_unique_names(file), xlsx_append_inline_row(file, values); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2194 | <code>            "vscode_replace_text(file, old, new), vscode_set_user_setting(key, value), vscode_open_project(project); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2195 | <code>            "vlc_play_video(file), vlc_extract_mp3(source, output?); os_restore_trash_file(file_name); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2196 | <code>            "docx_double_first_two_paragraphs(file), docx_tabstops_after_three_words(file); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2197 | <code>            "pptx_cover_image_fill(file), pptx_strike_first_two_lines(file, slide?, line_indices? one-based); "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2198 | <code>            "shell_enable_conda(); copy_named_file_path_to_clipboard(file_name); thunderbird_remove_account(email). "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2199 | <code>            "Return one action per step unless the first action is an os_skill and the second action is done. Coordinates are absolute screen pixels. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2200 | <code>            "Schema: {\"status\":\"continue&#124;done&#124;fail&#124;wait\",\"thought\":\"brief operational summary\","</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2201 | <code>            "\"actions\":[{\"action\":\"mouse_click\",\"x\":100,\"y\":200}]}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2202 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2203 | <code>        messages: List[Dict[str, Any]] = [{"role": "system", "content": system}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2204 | <code>        if self.history:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2205 | <code>            compact_history = self.history[-self.max_trajectory_length:]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2206 | <code>            messages.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2207 | <code>                "role": "user",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2208 | <code>                "content": "Recent trajectory:\n" + json.dumps(compact_history, ensure_ascii=False)[:6000],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2209 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2211 | <code>        a11y = self._linearized_a11y(obs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2212 | <code>        task_context = build_osworld_task_context(instruction, a11y, self.history)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2213 | <code>        self.last_task_context = task_context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2214 | <code>        stagnation_hint = self._build_stagnation_hint()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2215 | <code>        user_text = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2216 | <code>            f"Task instruction:\n{instruction}\n\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2217 | <code>            f"Screen size: {self.screen_size[0]}x{self.screen_size[1]}\n\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2218 | <code>            "Task context and recent observations:\n"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2219 | <code>            f"{json.dumps(task_context, ensure_ascii=False)[:8000]}\n\n"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2220 | <code>            f"Current accessibility tree:\n{a11y or '[not available]'}\n\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2221 | <code>            f"{stagnation_hint}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2222 | <code>            "Return the next structured action JSON only."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2223 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2225 | <code>        if self.include_screenshot and obs.get("screenshot"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2226 | <code>            image_b64 = encode_image_bytes(obs.get("screenshot") or b"")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2227 | <code>            messages.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2228 | <code>                "role": "user",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2229 | <code>                "content": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2230 | <code>                    {"type": "text", "text": user_text},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2231 | <code>                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2232 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2233 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2234 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 2235 | <code>            messages.append({"role": "user", "content": user_text})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2236 | <code>        return messages</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2238 | <code>    def _call_model(self, messages: List[Dict[str, Any]]) -&gt; Tuple[bool, str, str]:</code> | 定义 Python 函数 `_call_model`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2239 | <code>        base_url = self.settings.get("base_url")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2240 | <code>        model = self.settings.get("model")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2241 | <code>        api_key = self.settings.get("api_key")</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2242 | <code>        if not base_url or not model or not api_key:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2243 | <code>            return False, "missing_config", "Missing AILIS OSWorld LLM settings. Configure desktop LLM settings or AILIS_OSWORLD_* env vars."</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2245 | <code>        timeout_seconds = max(DEFAULT_TIMEOUT_SECONDS, int(self.settings.get("timeout_seconds", DEFAULT_TIMEOUT_SECONDS) or DEFAULT_TIMEOUT_SECONDS))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2246 | <code>        last_error = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2247 | <code>        for attempt in range(DEFAULT_MODEL_RETRIES + 1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 2248 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2249 | <code>                response = requests.post(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2250 | <code>                    _chat_completions_url(base_url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2251 | <code>                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2252 | <code>                    json={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2253 | <code>                        "model": model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2254 | <code>                        "messages": messages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2255 | <code>                        "temperature": self.settings.get("temperature", 0.2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2256 | <code>                        "stream": False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2257 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2258 | <code>                    timeout=timeout_seconds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2259 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2260 | <code>                if response.status_code &gt;= 400:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2261 | <code>                    return False, "provider_error", f"provider_error status={response.status_code}: {response.text[:600]}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2262 | <code>                payload = response.json()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2263 | <code>                content = payload.get("choices", [{}])[0].get("message", {}).get("content") or payload.get("choices", [{}])[0].get("text")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2264 | <code>                return bool(content), "ok" if content else "empty_response", _normalize_string(content)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2265 | <code>            except Exception as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 2266 | <code>                last_error = f"provider_exception: {error}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2267 | <code>                if attempt &lt; DEFAULT_MODEL_RETRIES:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2268 | <code>                    time.sleep(1.5 * (attempt + 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2269 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2270 | <code>        return False, "provider_timeout_or_exception", last_error</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2272 | <code>    def predict(self, instruction: str, obs: Dict[str, Any]):</code> | 定义 Python 函数 `predict`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2273 | <code>        cookie_consent = self._cookie_consent_action(obs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2274 | <code>        if cookie_consent:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2275 | <code>            response, actions = cookie_consent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2276 | <code>            self.history.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2277 | <code>                "thought": response["thought"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2278 | <code>                "actions": actions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2279 | <code>                "timestamp": int(time.time()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2280 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2281 | <code>            return response, actions</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2283 | <code>        messages = self._build_messages(instruction, obs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2284 | <code>        ok, code, content = self._call_model(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2285 | <code>        if not ok:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2286 | <code>            self._log(content)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2287 | <code>            if code == "missing_config":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2288 | <code>                response = {"status": "fail", "thought": content, "actions": [{"action": "fail"}]}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2289 | <code>                return response, ["FAIL"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2290 | <code>            response = {"status": "wait", "thought": content, "actions": [{"action": "wait", "seconds": 1.0}]}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2291 | <code>            return response, [action_to_pyautogui(response["actions"][0], self.screen_size)]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2293 | <code>        parsed = extract_json_object(content)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2294 | <code>        if not parsed:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2295 | <code>            if "pyautogui." in content:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2296 | <code>                actions = [content.strip()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2297 | <code>                response = {"status": "continue", "thought": "model returned pyautogui code", "raw": content}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2298 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 2299 | <code>                actions = ["WAIT"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2300 | <code>                response = {"status": "wait", "thought": "model returned unparseable action", "raw": content[:1000]}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2301 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 2302 | <code>            raw_actions = parsed.get("actions")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2303 | <code>            if not isinstance(raw_actions, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2304 | <code>                raw_actions = [{"action": parsed.get("action") or parsed.get("status") or "wait"}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2305 | <code>            if raw_actions and _is_atomic_os_skill(raw_actions[0]):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2306 | <code>                missing_args = _missing_required_os_skill_args(raw_actions[0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2307 | <code>                if missing_args:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2308 | <code>                    parsed["thought"] = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2309 | <code>                        _normalize_string(parsed.get("thought")) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2310 | <code>                        f" Missing required os_skill arguments: {', '.join(missing_args)}; gather more evidence."</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2311 | <code>                    ).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2312 | <code>                    raw_actions = [{"action": "wait", "seconds": 0.5}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2313 | <code>                elif _os_skill_completes_task(raw_actions[0]) and not any(_is_done_action(item) for item in raw_actions):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2314 | <code>                    raw_actions = [raw_actions[0], {"action": "done"}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2315 | <code>            elif len(self.history) &gt;= 3:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2316 | <code>                recovery_action = _grounded_completion_skill_action(self.last_task_context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2317 | <code>                if recovery_action:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2318 | <code>                    parsed["thought"] = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2319 | <code>                        _normalize_string(parsed.get("thought")) +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2320 | <code>                        " Structured recovery selected a grounded completion skill after repeated GUI probing."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2321 | <code>                    ).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2322 | <code>                    raw_actions = [recovery_action, {"action": "done"}]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2323 | <code>            actions = [action_to_pyautogui(action, self.screen_size) for action in raw_actions[:2]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2324 | <code>            if not actions:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2325 | <code>                actions = [action_to_pyautogui({"action": parsed.get("status") or "wait"}, self.screen_size)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2326 | <code>            response = parsed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2328 | <code>        self.history.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2329 | <code>            "thought": _normalize_string(response.get("thought"))[:500] if isinstance(response, dict) else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2330 | <code>            "actions": actions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2331 | <code>            "timestamp": int(time.time()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2332 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2333 | <code>        return response, actions</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2335 | <code>    def _build_stagnation_hint(self) -&gt; str:</code> | 定义 Python 函数 `_build_stagnation_hint`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2336 | <code>        flattened: List[str] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2337 | <code>        for entry in self.history[-6:]:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 2338 | <code>            for action in entry.get("actions") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 2339 | <code>                normalized = re.sub(r"\s+", " ", str(action)).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2340 | <code>                if normalized and not normalized.startswith("import time; time.sleep"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2341 | <code>                    flattened.append(normalized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2342 | <code>        if len(flattened) &gt;= 3 and len(set(flattened[-3:])) == 1:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 2343 | <code>            return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 2344 | <code>                "Progress warning: the last three non-wait actions were identical. "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2345 | <code>                "Do not repeat the same click/drag; choose a different route, use an os_skill, or finish/fail if blocked.\n\n"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2346 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2347 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
