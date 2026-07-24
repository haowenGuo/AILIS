# scripts/toolsandbox/run_ailis_toolsandbox.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：1199
- SHA-256：`7c2ea790ee5bbefb5f8947d8b981c89dc80b91d4876c04fc1208fb453f421c50`
- 可运行副本：[打开源文件](../../../../source/scripts/toolsandbox/run_ailis_toolsandbox.py)
- 依赖：`__future__`、`argparse`、`datetime`、`json`、`os`、`subprocess`、`sys`、`time`、`traceback`、`uuid`、`collections`、`pathlib`、`typing`、`tool_sandbox.common.execution_context`、`tool_sandbox.common.message_conversion`、`tool_sandbox.common.tool_conversion`、`tool_sandbox.common.tool_discovery`、`tool_sandbox.roles.base_role`、`tool_sandbox.roles.execution_environment`、`tool_sandbox.roles.openai_api_user`、`tool_sandbox.scenarios`
- 主要符号：`parse_args`、`append_jsonl`、`write_json`、`load_or_create_benchmark_clock`、`_FrozenDatetimeModule`、`__init__`、`FrozenDateTime`、`now`、`today`、`__getattr__`、`install_benchmark_clock`、`restore_benchmark_clock`、`benchmark_runtime_environment_override`、`retry_error_scenario_names`、`retry_failure_scenario_names`、`load_or_create_retry_failure_manifest`、`retry_batch_metrics`、`call_count`、`usage_summary`、`CodexJsonlClient`、`start`、`_send`、`_read`、`infer`、`close`、`CodexToolSandboxUser`、`respond`、`metrics`、`teardown`、`AILISToolSandboxAgent`、`_read_protocol_message`、`_agent_tool_specs`、`_start`、`_execute_official_tool`、`AutoEndUser`、`latest_user_task`、`summarize_ailis_audit`、`base_scenario_name`、`requires_rapid_api`、`exclude_rapid_api_scenarios`、`load_latest_progress`、`classify_fatal_provider_error`、`build_summary`、`main`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from __future__ import annotations</code> | 导入 Python 依赖 `__future__`，供本模块调用其类型、函数或常量。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>import argparse</code> | 导入 Python 依赖 `argparse`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import datetime as datetime_module</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 6 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 7 | <code>import subprocess</code> | 导入 Python 依赖 `subprocess`，供本模块调用其类型、函数或常量。 |
| 8 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 9 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 10 | <code>import traceback</code> | 导入 Python 依赖 `traceback`，供本模块调用其类型、函数或常量。 |
| 11 | <code>import uuid</code> | 导入 Python 依赖 `uuid`，供本模块调用其类型、函数或常量。 |
| 12 | <code>from collections import defaultdict</code> | 导入 Python 依赖 `collections`，供本模块调用其类型、函数或常量。 |
| 13 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 14 | <code>from typing import Any, Optional</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>from tool_sandbox.common.execution_context import DatabaseNamespace, RoleType</code> | 导入 Python 依赖 `tool_sandbox.common.execution_context`，供本模块调用其类型、函数或常量。 |
| 17 | <code>from tool_sandbox.common.message_conversion import Message</code> | 导入 Python 依赖 `tool_sandbox.common.message_conversion`，供本模块调用其类型、函数或常量。 |
| 18 | <code>from tool_sandbox.common.tool_conversion import convert_to_openai_tool, convert_to_openai_tools</code> | 导入 Python 依赖 `tool_sandbox.common.tool_conversion`，供本模块调用其类型、函数或常量。 |
| 19 | <code>from tool_sandbox.common.tool_discovery import ToolBackend</code> | 导入 Python 依赖 `tool_sandbox.common.tool_discovery`，供本模块调用其类型、函数或常量。 |
| 20 | <code>from tool_sandbox.roles.base_role import BaseRole</code> | 导入 Python 依赖 `tool_sandbox.roles.base_role`，供本模块调用其类型、函数或常量。 |
| 21 | <code>from tool_sandbox.roles.execution_environment import ExecutionEnvironment</code> | 导入 Python 依赖 `tool_sandbox.roles.execution_environment`，供本模块调用其类型、函数或常量。 |
| 22 | <code>from tool_sandbox.roles.openai_api_user import OpenAIAPIUser</code> | 导入 Python 依赖 `tool_sandbox.roles.openai_api_user`，供本模块调用其类型、函数或常量。 |
| 23 | <code>from tool_sandbox.scenarios import named_scenarios</code> | 导入 Python 依赖 `tool_sandbox.scenarios`，供本模块调用其类型、函数或常量。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>PROTOCOL_PREFIX = "@@AILIS_TOOL_SANDBOX@@"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 27 | <code>CODEX_PROTOCOL_PREFIX = "@@AILIS_CODEX_PROVIDER@@"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 28 | <code>RAPID_API_TOOLS = {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 29 | <code>    "search_lat_lon",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>    "search_location_around_lat_lon",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 31 | <code>    "search_weather_around_lat_lon",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 32 | <code>    "search_stock",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>    "convert_currency",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>AUGMENTATION_SUFFIXES = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 36 | <code>    "_3_distraction_tools_tool_description_scrambled",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>    "_3_distraction_tools_arg_description_scrambled",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>    "_3_distraction_tools_arg_type_scrambled",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 39 | <code>    "_3_distraction_tools_tool_name_scrambled",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 40 | <code>    "_10_distraction_tools",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>    "_3_distraction_tools",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>    "_all_tools",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>DEFAULT_SMOKE_SCENARIOS = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>    "cellular_off",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 46 | <code>    "get_cellular",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 47 | <code>    "wifi_off",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>    "search_phone_number_with_name",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>    "send_message_with_phone_number_and_content",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>def parse_args() -&gt; argparse.Namespace:</code> | 定义 Python 函数 `parse_args`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 54 | <code>    parser = argparse.ArgumentParser(description="Evaluate the full AILIS production chain on Apple ToolSandbox.")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>    parser.add_argument("--project-root", default=r"F:\AILIS_self_evolution_runtime")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>    parser.add_argument("--output-dir", default=r"F:\AILIS_self_evolution_runtime\eval-results\toolsandbox-smoke")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>    parser.add_argument("--run-id", default=f"ailis-toolsandbox-{time.strftime('%Y%m%d-%H%M%S')}")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>        "--benchmark-clock",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>        help="ISO-8601 clock anchor used consistently by scenarios, tools, and AILIS.",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    parser.add_argument("--scenario", action="append", dest="scenarios")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>    parser.add_argument("--all", action="store_true", help="Run all official named scenarios.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 64 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 65 | <code>        "--exclude-rapid-api",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 66 | <code>        action="store_true",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>        help="Exclude scenarios requiring RapidAPI before progress and completion accounting.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>    parser.add_argument("--resume", action="store_true", help="Skip scenarios already completed in progress.jsonl.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 70 | <code>    parser.add_argument("--retry-errors", action="store_true", help="Retry prior error or blocked records when resuming.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>        "--retry-errors-only",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>        action="store_true",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 74 | <code>        help="Retry only scenarios whose latest progress record is an error.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 77 | <code>        "--retry-failures-only",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 78 | <code>        action="store_true",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>        help="Retry only scenarios whose latest record is an error or has official similarity &lt;= 0.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>        "--retry-batch-id",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>        help="Stable retry batch identifier used to preserve the original failure cohort across resumes.",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 84 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>    parser.add_argument("--max-scenarios", type=int)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 86 | <code>    parser.add_argument("--max-agent-steps", type=int, default=7)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>    parser.add_argument("--provider", choices=["desktop", "codex-model-bridge"], default="codex-model-bridge")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 88 | <code>    parser.add_argument("--codex-model", default=os.environ.get("AILIS_CODEX_MODEL", "gpt-5.5"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 89 | <code>    parser.add_argument(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 90 | <code>        "--codex-reasoning-effort",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>        default=os.environ.get("AILIS_CODEX_REASONING_EFFORT", "low"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    parser.add_argument("--llm-timeout-ms", type=int, default=180000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>    return parser.parse_args()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>def append_jsonl(path: Path, value: dict[str, Any]) -&gt; None:</code> | 定义 Python 函数 `append_jsonl`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>    with path.open("a", encoding="utf-8") as handle:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 99 | <code>        handle.write(json.dumps(value, ensure_ascii=False) + "\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>def write_json(path: Path, value: dict[str, Any]) -&gt; None:</code> | 定义 Python 函数 `write_json`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>def load_or_create_benchmark_clock(</code> | 定义 Python 函数 `load_or_create_benchmark_clock`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 107 | <code>    clock_path: Path, requested_anchor: Optional[str] = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>) -&gt; dict[str, str]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>    if clock_path.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 110 | <code>        value = json.loads(clock_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>        anchor = datetime_module.datetime.fromisoformat(value["anchorLocalIso"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>        if anchor.tzinfo is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 113 | <code>            raise ValueError("Persisted ToolSandbox benchmark clock must include a UTC offset.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 114 | <code>        return value</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    anchor = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>        datetime_module.datetime.fromisoformat(requested_anchor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>        if requested_anchor</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 119 | <code>        else datetime_module.datetime.now().astimezone()</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 120 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    if anchor.tzinfo is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 122 | <code>        raise ValueError("ToolSandbox benchmark clock must include a UTC offset.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 123 | <code>    value = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>        "model": "ailis_toolsandbox_clock.v1",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>        "anchorLocalIso": anchor.isoformat(timespec="seconds"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>        "source": "explicit" if requested_anchor else "run_start",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    write_json(clock_path, value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>    return value</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>class _FrozenDatetimeModule:</code> | 定义 Python 类 `_FrozenDatetimeModule`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>    def __init__(self, anchor: datetime_module.datetime) -&gt; None:</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 134 | <code>        real_datetime = datetime_module.datetime</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>        class FrozenDateTime(real_datetime):</code> | 定义 Python 类 `FrozenDateTime`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>            @classmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 138 | <code>            def now(cls, tz=None):</code> | 定义 Python 函数 `now`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>                value = real_datetime.fromtimestamp(anchor.timestamp(), tz)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>                return cls(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 141 | <code>                    value.year,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>                    value.month,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 143 | <code>                    value.day,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 144 | <code>                    value.hour,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>                    value.minute,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>                    value.second,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 147 | <code>                    value.microsecond,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>                    value.tzinfo,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 149 | <code>                    fold=value.fold,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 150 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>            @classmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>            def today(cls):</code> | 定义 Python 函数 `today`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>                return cls.now()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>        self.datetime = FrozenDateTime</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    def __getattr__(self, name: str) -&gt; Any:</code> | 定义 Python 函数 `__getattr__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>        return getattr(datetime_module, name)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>def install_benchmark_clock(</code> | 定义 Python 函数 `install_benchmark_clock`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 163 | <code>    anchor: datetime_module.datetime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>) -&gt; list[tuple[Any, Any]]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>    frozen_module = _FrozenDatetimeModule(anchor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>    patched: list[tuple[Any, Any]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 167 | <code>    for module_name, module in list(sys.modules.items()):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 168 | <code>        if not module_name.startswith("tool_sandbox.") or module is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 169 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>        if getattr(module, "datetime", None) is datetime_module:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 171 | <code>            patched.append((module, datetime_module))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>            setattr(module, "datetime", frozen_module)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>    return patched</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>def restore_benchmark_clock(patched: list[tuple[Any, Any]]) -&gt; None:</code> | 定义 Python 函数 `restore_benchmark_clock`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>    for module, original in patched:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 178 | <code>        setattr(module, "datetime", original)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>def benchmark_runtime_environment_override(clock: dict[str, str]) -&gt; dict[str, str]:</code> | 定义 Python 函数 `benchmark_runtime_environment_override`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>    anchor = datetime_module.datetime.fromisoformat(clock["anchorLocalIso"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>    offset = anchor.strftime("%z")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>    utc_offset = f"{offset[:3]}:{offset[3:]}" if offset else ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 186 | <code>        "source": "toolsandbox_benchmark_clock",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>        "current_date": anchor.strftime("%Y-%m-%d"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>        "current_time": anchor.strftime("%H:%M:%S"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>        "current_datetime": anchor.isoformat(timespec="seconds"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>        "utc_offset": utc_offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 191 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>def retry_error_scenario_names(</code> | 定义 Python 函数 `retry_error_scenario_names`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>    selected: list[str], latest: dict[str, dict[str, Any]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>) -&gt; set[str]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 197 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 198 | <code>        name for name in selected if latest.get(name, {}).get("status") == "error"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>def retry_failure_scenario_names(</code> | 定义 Python 函数 `retry_failure_scenario_names`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>    selected: list[str], latest: dict[str, dict[str, Any]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>) -&gt; set[str]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>    failures: set[str] = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>    for name in selected:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 207 | <code>        record = latest.get(name, {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>        similarity = record.get("similarity")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>        if record.get("status") == "error":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 210 | <code>            failures.add(name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>        elif isinstance(similarity, (int, float)) and float(similarity) &lt;= 0:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>            failures.add(name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>    return failures</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>def load_or_create_retry_failure_manifest(</code> | 定义 Python 函数 `load_or_create_retry_failure_manifest`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 217 | <code>    *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 218 | <code>    output_root: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>    batch_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>    selected: list[str],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 221 | <code>    latest: dict[str, dict[str, Any]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 223 | <code>    normalized_batch_id = batch_id.strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>    if not normalized_batch_id or any(</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 225 | <code>        character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>        for character in normalized_batch_id</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 227 | <code>    ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>        raise ValueError("retry batch id must contain only letters, digits, dot, underscore, or hyphen")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 229 | <code>    batch_root = output_root / "retry-batches"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>    batch_root.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>    manifest_path = batch_root / f"{normalized_batch_id}.manifest.json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 232 | <code>    if manifest_path.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 233 | <code>        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 234 | <code>        manifest["manifestPath"] = str(manifest_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>        return manifest</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>    failure_names = retry_failure_scenario_names(selected, latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>    scenario_names = [name for name in selected if name in failure_names]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 239 | <code>    baseline = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 240 | <code>        name: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>            "status": latest.get(name, {}).get("status"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 242 | <code>            "similarity": latest.get(name, {}).get("similarity"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 243 | <code>            "attempt": int(latest.get(name, {}).get("attempt") or 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 244 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>        for name in scenario_names</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    manifest = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 248 | <code>        "schema": "ailis.toolsandbox.retry_batch.v1",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>        "batchId": normalized_batch_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>        "createdAt": datetime_module.datetime.now().astimezone().isoformat(timespec="seconds"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>        "selection": "latest status=error or official similarity&lt;=0",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>        "target": len(scenario_names),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>        "scenarios": scenario_names,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 254 | <code>        "baseline": baseline,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    write_json(manifest_path, manifest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>    manifest["manifestPath"] = str(manifest_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>    return manifest</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>def retry_batch_metrics(</code> | 定义 Python 函数 `retry_batch_metrics`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 262 | <code>    manifest: Optional[dict[str, Any]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 263 | <code>    latest: dict[str, dict[str, Any]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>) -&gt; Optional[dict[str, Any]]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>    if not manifest:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 266 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 267 | <code>    scenario_names = [str(name) for name in manifest.get("scenarios") or []]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 268 | <code>    baseline = manifest.get("baseline") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 269 | <code>    processed: list[tuple[str, dict[str, Any], dict[str, Any]]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 270 | <code>    for name in scenario_names:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 271 | <code>        baseline_record = baseline.get(name) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 272 | <code>        current_record = latest.get(name) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 273 | <code>        if int(current_record.get("attempt") or 0) &gt; int(baseline_record.get("attempt") or 0):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 274 | <code>            processed.append((name, baseline_record, current_record))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>    scored = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>        item for item in processed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>        if isinstance(item[2].get("similarity"), (int, float))</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 279 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>    paired = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 281 | <code>        item for item in scored</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 282 | <code>        if isinstance(item[1].get("similarity"), (int, float))</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 283 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>    def call_count(metrics: dict[str, Any]) -&gt; int:</code> | 定义 Python 函数 `call_count`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>        if isinstance(metrics.get("llmCalls"), (int, float)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 287 | <code>            return int(metrics["llmCalls"])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 288 | <code>        calls = metrics.get("calls")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>        if isinstance(calls, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 290 | <code>            return len(calls)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 291 | <code>        if isinstance(calls, (int, float)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 292 | <code>            return int(calls)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 293 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 296 | <code>        "batchId": manifest.get("batchId"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 297 | <code>        "manifestPath": manifest.get("manifestPath"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>        "target": len(scenario_names),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 299 | <code>        "processed": len(processed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 300 | <code>        "scored": len(scored),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 301 | <code>        "errors": sum(item[2].get("status") == "error" for item in processed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 302 | <code>        "improved": sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>            isinstance(item[1].get("similarity"), (int, float))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 304 | <code>            and float(item[2].get("similarity")) &gt; float(item[1].get("similarity"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>            for item in scored</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 306 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>        "recoveredErrors": sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 308 | <code>            item[1].get("status") == "error" for item in scored</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 309 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>        "stillZero": sum(float(item[2]["similarity"]) &lt;= 0 for item in scored),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 311 | <code>        "averageSimilarity": (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 312 | <code>            sum(float(item[2]["similarity"]) for item in scored) / len(scored)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>            if scored else 0</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 314 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>        "pairedAverageDelta": (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 316 | <code>            sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 317 | <code>                float(item[2]["similarity"]) - float(item[1]["similarity"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 318 | <code>                for item in paired</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 319 | <code>            ) / len(paired)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 320 | <code>            if paired else 0</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 321 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>        "totalCalls": sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>            call_count(item[2].get("ailisMetrics") or {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 324 | <code>            + call_count(item[2].get("userSimulatorMetrics") or {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 325 | <code>            for item in processed</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 326 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>        "totalTokens": sum(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 328 | <code>            int((item[2].get("ailisMetrics") or {}).get("totalTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 329 | <code>            + int((item[2].get("userSimulatorMetrics") or {}).get("totalTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 330 | <code>            for item in processed</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 331 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>        "durationMs": sum(int(item[2].get("durationMs") or 0) for item in processed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>def usage_summary(usage: Optional[dict[str, Any]]) -&gt; dict[str, int]:</code> | 定义 Python 函数 `usage_summary`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 337 | <code>    usage = usage or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 338 | <code>    prompt = int(usage.get("prompt_tokens") or usage.get("promptTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 339 | <code>    completion = int(usage.get("completion_tokens") or usage.get("completionTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 340 | <code>    total = int(usage.get("total_tokens") or usage.get("totalTokens") or prompt + completion)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 341 | <code>    return {"promptTokens": prompt, "completionTokens": completion, "totalTokens": total}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>class CodexJsonlClient:</code> | 定义 Python 类 `CodexJsonlClient`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 345 | <code>    def __init__(</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 346 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 347 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 348 | <code>        project_root: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 349 | <code>        output_dir: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 350 | <code>        model: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 351 | <code>        reasoning_effort: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 352 | <code>        timeout_ms: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 353 | <code>    ) -&gt; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 354 | <code>        self.project_root = project_root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 355 | <code>        self.output_dir = output_dir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 356 | <code>        self.model = model</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 357 | <code>        self.reasoning_effort = reasoning_effort</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 358 | <code>        self.timeout_ms = timeout_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 359 | <code>        self.process: Optional[subprocess.Popen[str]] = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 360 | <code>        self.stderr_handle = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>    def start(self) -&gt; None:</code> | 定义 Python 函数 `start`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 363 | <code>        if self.process is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 364 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 365 | <code>        self.output_dir.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 366 | <code>        self.stderr_handle = (self.output_dir / "codex-user-simulator.stderr.log").open(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 367 | <code>            "a", encoding="utf-8"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 368 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>        script = self.project_root / "scripts" / "toolsandbox" / "codex-provider-jsonl.mjs"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 370 | <code>        self.process = subprocess.Popen(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 371 | <code>            ["node", str(script)],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 372 | <code>            cwd=str(self.project_root),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>            env=os.environ.copy(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 374 | <code>            stdin=subprocess.PIPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 375 | <code>            stdout=subprocess.PIPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 376 | <code>            stderr=self.stderr_handle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 377 | <code>            text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 378 | <code>            encoding="utf-8",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 379 | <code>            bufsize=1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 380 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>    def _send(self, payload: dict[str, Any]) -&gt; None:</code> | 定义 Python 函数 `_send`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 383 | <code>        self.start()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 384 | <code>        assert self.process is not None and self.process.stdin is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 385 | <code>        self.process.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 386 | <code>        self.process.stdin.flush()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>    def _read(self) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_read`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 389 | <code>        assert self.process is not None and self.process.stdout is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 390 | <code>        while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 391 | <code>            line = self.process.stdout.readline()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 392 | <code>            if line == "":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 393 | <code>                raise RuntimeError(</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 394 | <code>                    f"Codex user-simulator bridge exited with code {self.process.poll()}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 395 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>            if line.startswith(CODEX_PROTOCOL_PREFIX):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 397 | <code>                return json.loads(line[len(CODEX_PROTOCOL_PREFIX) :])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>    def infer(</code> | 定义 Python 函数 `infer`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 400 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 401 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 402 | <code>        messages: list[dict[str, Any]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 403 | <code>        tools: list[dict[str, Any]],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 404 | <code>    ) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 405 | <code>        request_id = str(uuid.uuid4())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 406 | <code>        self._send(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 407 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 408 | <code>                "type": "infer",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 409 | <code>                "requestId": request_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 410 | <code>                "model": self.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 411 | <code>                "reasoningEffort": self.reasoning_effort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 412 | <code>                "timeoutMs": self.timeout_ms,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 413 | <code>                "messages": messages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 414 | <code>                "tools": tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 415 | <code>                "toolChoice": "auto",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 416 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>        while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 419 | <code>            response = self._read()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 420 | <code>            if response.get("type") == "inference_result" and response.get("requestId") == request_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 421 | <code>                if response.get("ok") is not True:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 422 | <code>                    raise RuntimeError(</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 423 | <code>                        f"Codex user simulator failed: {response.get('code')}: {response.get('error')}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 424 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>                return response</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 426 | <code>            if response.get("type") == "fatal_error":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 427 | <code>                raise RuntimeError(response.get("error", "Codex user simulator bridge failed"))</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>    def close(self) -&gt; None:</code> | 定义 Python 函数 `close`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 430 | <code>        if self.process is not None and self.process.poll() is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 431 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 432 | <code>                self._send({"type": "shutdown", "requestId": str(uuid.uuid4())})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 433 | <code>                self.process.wait(timeout=10)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 434 | <code>            except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 435 | <code>                self.process.terminate()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 436 | <code>        if self.process is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 437 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 438 | <code>                self.process.wait(timeout=10)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 439 | <code>            except subprocess.TimeoutExpired:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 440 | <code>                self.process.kill()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 441 | <code>        if self.stderr_handle is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 442 | <code>            self.stderr_handle.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>class CodexToolSandboxUser(BaseRole):</code> | 定义 Python 类 `CodexToolSandboxUser`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 446 | <code>    role_type = RoleType.USER</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>    def __init__(</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 449 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 450 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 451 | <code>        project_root: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 452 | <code>        output_dir: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 453 | <code>        model: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 454 | <code>        reasoning_effort: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 455 | <code>        timeout_ms: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 456 | <code>    ) -&gt; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 457 | <code>        self.client = CodexJsonlClient(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 458 | <code>            project_root=project_root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 459 | <code>            output_dir=output_dir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 460 | <code>            model=model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 461 | <code>            reasoning_effort=reasoning_effort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 462 | <code>            timeout_ms=timeout_ms,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 463 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>        self.calls: list[dict[str, Any]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 466 | <code>    def respond(self, ending_index: Optional[int] = None) -&gt; None:</code> | 定义 Python 函数 `respond`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 467 | <code>        messages = self.get_messages(ending_index=ending_index)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 468 | <code>        self.messages_validation(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 469 | <code>        messages = self.filter_messages(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 470 | <code>        if messages[-1].sender == RoleType.SYSTEM:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 471 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 472 | <code>        available_tools = self.get_available_tools()</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 473 | <code>        tools = (</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 474 | <code>            [convert_to_openai_tool(tool) for tool in available_tools.values()]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 475 | <code>            if messages[-1].sender == RoleType.AGENT</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 476 | <code>            else []</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 477 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>        result = self.client.infer(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 479 | <code>            messages=OpenAIAPIUser.to_openai_messages(messages),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 480 | <code>            tools=tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 481 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>        self.calls.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 483 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 484 | <code>                "provider": result.get("provider"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 485 | <code>                "model": result.get("model"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 486 | <code>                "usage": usage_summary(result.get("usage")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 487 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>        tool_calls = result.get("toolCalls") if isinstance(result.get("toolCalls"), list) else []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 490 | <code>        if not tool_calls:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 491 | <code>            self.add_messages(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 492 | <code>                [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 493 | <code>                    Message(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 494 | <code>                        sender=RoleType.USER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 495 | <code>                        recipient=RoleType.AGENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 496 | <code>                        content=str(result.get("content") or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 497 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 501 | <code>        response_messages: list[Message] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 502 | <code>        for index, call in enumerate(tool_calls, start=1):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 503 | <code>            name = str(call.get("name") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 504 | <code>            if name not in available_tools:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 505 | <code>                raise RuntimeError(f"Codex user simulator selected unavailable tool: {name}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 506 | <code>            args = call.get("arguments") if isinstance(call.get("arguments"), dict) else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 507 | <code>            tool_call_id = str(call.get("id") or f"user_call_{uuid.uuid4().hex}_{index}")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 508 | <code>            # User-facing tools are intentionally not scrambled by ToolSandbox.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 509 | <code>            execution_name = name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 510 | <code>            code = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 511 | <code>                f"{tool_call_id}_parameters = {args!r}\n"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 512 | <code>                f"{tool_call_id}_response = {execution_name}(**{tool_call_id}_parameters)\n"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 513 | <code>                f"print(repr({tool_call_id}_response))"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 514 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>            response_messages.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 516 | <code>                Message(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 517 | <code>                    sender=RoleType.USER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 518 | <code>                    recipient=RoleType.EXECUTION_ENVIRONMENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 519 | <code>                    content=code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 520 | <code>                    openai_tool_call_id=tool_call_id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 521 | <code>                    openai_function_name=name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 522 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>        self.add_messages(response_messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 526 | <code>    def metrics(self) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `metrics`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 527 | <code>        totals = {"promptTokens": 0, "completionTokens": 0, "totalTokens": 0}</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 528 | <code>        for call in self.calls:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 529 | <code>            for key in totals:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 530 | <code>                totals[key] += int(call["usage"].get(key) or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 531 | <code>        return {"llmCalls": len(self.calls), **totals, "calls": self.calls}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>    def teardown(self) -&gt; None:</code> | 定义 Python 函数 `teardown`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 534 | <code>        self.client.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>class AILISToolSandboxAgent(BaseRole):</code> | 定义 Python 类 `AILISToolSandboxAgent`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 538 | <code>    role_type = RoleType.AGENT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>    def __init__(</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 541 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 542 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 543 | <code>        project_root: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 544 | <code>        output_dir: Path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 545 | <code>        run_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 546 | <code>        scenario_name: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 547 | <code>        original_task: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 548 | <code>        max_agent_steps: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 549 | <code>        provider: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 550 | <code>        codex_model: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 551 | <code>        codex_reasoning_effort: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 552 | <code>        llm_timeout_ms: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 553 | <code>        runtime_environment_override: dict[str, str],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 554 | <code>    ) -&gt; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 555 | <code>        self.project_root = project_root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 556 | <code>        self.output_dir = output_dir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 557 | <code>        self.run_id = run_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 558 | <code>        self.scenario_name = scenario_name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 559 | <code>        self.original_task = original_task</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 560 | <code>        self.max_agent_steps = max_agent_steps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 561 | <code>        self.provider = provider</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 562 | <code>        self.codex_model = codex_model</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 563 | <code>        self.codex_reasoning_effort = codex_reasoning_effort</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 564 | <code>        self.llm_timeout_ms = llm_timeout_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 565 | <code>        self.runtime_environment_override = runtime_environment_override</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 566 | <code>        self.process: Optional[subprocess.Popen[str]] = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 567 | <code>        self.stderr_handle = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 568 | <code>        self.turn = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 569 | <code>        self.last_result: dict[str, Any] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 570 | <code>        self.initialized: dict[str, Any] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>    def _send(self, payload: dict[str, Any]) -&gt; None:</code> | 定义 Python 函数 `_send`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 573 | <code>        if self.process is None or self.process.stdin is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 574 | <code>            raise RuntimeError("AILIS ToolSandbox bridge is not running")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 575 | <code>        self.process.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 576 | <code>        self.process.stdin.flush()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 577 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 578 | <code>    def _read_protocol_message(self) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_read_protocol_message`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 579 | <code>        if self.process is None or self.process.stdout is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 580 | <code>            raise RuntimeError("AILIS ToolSandbox bridge is not running")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 581 | <code>        while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 582 | <code>            line = self.process.stdout.readline()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 583 | <code>            if line == "":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 584 | <code>                code = self.process.poll()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 585 | <code>                raise RuntimeError(f"AILIS ToolSandbox bridge exited unexpectedly with code {code}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 586 | <code>            if line.startswith(PROTOCOL_PREFIX):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 587 | <code>                return json.loads(line[len(PROTOCOL_PREFIX) :])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>    def _agent_tool_specs(self) -&gt; list[dict[str, Any]]:</code> | 定义 Python 函数 `_agent_tool_specs`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 590 | <code>        tools = self.get_available_tools()</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 591 | <code>        converted = convert_to_openai_tools(tools)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 592 | <code>        return [entry["function"] for entry in converted]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>    def _start(self) -&gt; None:</code> | 定义 Python 函数 `_start`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 595 | <code>        self.output_dir.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 596 | <code>        stderr_path = self.output_dir / "ailis-bridge.stderr.log"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 597 | <code>        self.stderr_handle = stderr_path.open("a", encoding="utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 598 | <code>        bridge_path = self.project_root / "scripts" / "toolsandbox" / "ailis-toolsandbox-bridge.mjs"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 599 | <code>        env = os.environ.copy()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 600 | <code>        env["AILIS_PROJECT_ROOT"] = str(self.project_root)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 601 | <code>        self.process = subprocess.Popen(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 602 | <code>            ["node", str(bridge_path)],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 603 | <code>            cwd=str(self.project_root),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 604 | <code>            env=env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 605 | <code>            stdin=subprocess.PIPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 606 | <code>            stdout=subprocess.PIPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 607 | <code>            stderr=self.stderr_handle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 608 | <code>            text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 609 | <code>            encoding="utf-8",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 610 | <code>            bufsize=1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 611 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>        request_id = str(uuid.uuid4())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 613 | <code>        self._send(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 614 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 615 | <code>                "type": "initialize",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 616 | <code>                "requestId": request_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 617 | <code>                "outputDir": str(self.output_dir),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 618 | <code>                "runId": self.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 619 | <code>                "scenarioName": self.scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 620 | <code>                "sessionId": f"toolsandbox-{self.run_id}-{self.scenario_name}",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 621 | <code>                "originalTask": self.original_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 622 | <code>                "maxAgentSteps": self.max_agent_steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 623 | <code>                "provider": self.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 624 | <code>                "codexModel": self.codex_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 625 | <code>                "codexReasoningEffort": self.codex_reasoning_effort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 626 | <code>                "llmTimeoutMs": self.llm_timeout_ms,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 627 | <code>                "runtimeEnvironmentOverride": self.runtime_environment_override,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 628 | <code>                "tools": self._agent_tool_specs(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 629 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 630 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 631 | <code>        while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 632 | <code>            message = self._read_protocol_message()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 633 | <code>            if message.get("type") == "initialized" and message.get("requestId") == request_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 634 | <code>                self.initialized = message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 635 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 636 | <code>            if message.get("type") == "bridge_error":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 637 | <code>                raise RuntimeError(message.get("error", "AILIS bridge initialization failed"))</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>    def _execute_official_tool(self, request: dict[str, Any]) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_execute_official_tool`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 640 | <code>        name = str(request.get("name", ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 641 | <code>        args = request.get("args") if isinstance(request.get("args"), dict) else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 642 | <code>        context = __import__("tool_sandbox.common.execution_context", fromlist=["get_current_context"]).get_current_context()</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 643 | <code>        execution_name = context.get_execution_facing_tool_name(name)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 644 | <code>        tool_call_id = f"call_{uuid.uuid4().hex}"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 645 | <code>        code = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 646 | <code>            f"{tool_call_id}_parameters = {args!r}\n"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 647 | <code>            f"{tool_call_id}_response = {execution_name}(**{tool_call_id}_parameters)\n"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 648 | <code>            f"print(repr({tool_call_id}_response))"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 649 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>        call_message = Message(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 651 | <code>            sender=RoleType.AGENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 652 | <code>            recipient=RoleType.EXECUTION_ENVIRONMENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 653 | <code>            content=code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 654 | <code>            openai_tool_call_id=tool_call_id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 655 | <code>            openai_function_name=name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 656 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 657 | <code>        self.add_messages([call_message])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 658 | <code>        ExecutionEnvironment().respond()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 659 | <code>        response = self.get_messages()[-1]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 660 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 661 | <code>            "ok": response.tool_call_exception is None,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 662 | <code>            "content": response.content or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 663 | <code>            "error": response.tool_call_exception,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 664 | <code>            "toolTrace": response.tool_trace,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 665 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>    def respond(self, ending_index: Optional[int] = None) -&gt; None:</code> | 定义 Python 函数 `respond`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 668 | <code>        messages = self.get_messages(ending_index=ending_index)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 669 | <code>        self.messages_validation(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 670 | <code>        if messages[-1].sender == RoleType.SYSTEM:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 671 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 672 | <code>        if self.process is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 673 | <code>            self._start()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 674 | <code>        self.turn += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 675 | <code>        request_id = str(uuid.uuid4())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 676 | <code>        self._send(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 677 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 678 | <code>                "type": "run",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 679 | <code>                "requestId": request_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 680 | <code>                "turn": self.turn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 681 | <code>                "message": messages[-1].content or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 682 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 683 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>        while True:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 685 | <code>            response = self._read_protocol_message()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 686 | <code>            if response.get("type") == "tool_call":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 687 | <code>                result = self._execute_official_tool(response)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 688 | <code>                self._send(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 689 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 690 | <code>                        "type": "tool_result",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 691 | <code>                        "requestId": response.get("requestId"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 692 | <code>                        "result": result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 693 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 694 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 696 | <code>            if response.get("type") == "bridge_error":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 697 | <code>                raise RuntimeError(response.get("error", "AILIS bridge failed"))</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 698 | <code>            if response.get("type") == "run_result" and response.get("requestId") == request_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 699 | <code>                self.last_result = response</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 700 | <code>                self.add_messages(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 701 | <code>                    [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 702 | <code>                        Message(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 703 | <code>                            sender=RoleType.AGENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 704 | <code>                            recipient=RoleType.USER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 705 | <code>                            content=str(response.get("text") or "AILIS completed the requested action."),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 706 | <code>                        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 707 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>    def teardown(self) -&gt; None:</code> | 定义 Python 函数 `teardown`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 712 | <code>        if self.process is not None and self.process.poll() is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 713 | <code>            request_id = str(uuid.uuid4())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 714 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 715 | <code>                self._send({"type": "shutdown", "requestId": request_id})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 716 | <code>                deadline = time.time() + 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 717 | <code>                while time.time() &lt; deadline:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 718 | <code>                    message = self._read_protocol_message()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 719 | <code>                    if message.get("type") == "shutdown_complete":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 720 | <code>                        break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 721 | <code>            except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 722 | <code>                pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 723 | <code>            finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 724 | <code>                if self.process.poll() is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 725 | <code>                    self.process.terminate()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 726 | <code>        if self.process is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 727 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 728 | <code>                self.process.wait(timeout=10)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 729 | <code>            except subprocess.TimeoutExpired:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 730 | <code>                self.process.kill()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 731 | <code>        if self.stderr_handle is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 732 | <code>            self.stderr_handle.close()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>class AutoEndUser(BaseRole):</code> | 定义 Python 类 `AutoEndUser`，封装相关状态、协议和方法。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 736 | <code>    role_type = RoleType.USER</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 738 | <code>    def respond(self, ending_index: Optional[int] = None) -&gt; None:</code> | 定义 Python 函数 `respond`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 739 | <code>        messages = self.get_messages(ending_index=ending_index)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 740 | <code>        self.messages_validation(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 741 | <code>        if messages[-1].sender == RoleType.SYSTEM:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 742 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 743 | <code>        self.add_messages(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 744 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 745 | <code>                Message(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 746 | <code>                    sender=RoleType.USER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 747 | <code>                    recipient=RoleType.EXECUTION_ENVIRONMENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 748 | <code>                    content="end_conversation()",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 749 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 750 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 751 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>        ExecutionEnvironment().respond()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>def latest_user_task(scenario: Any) -&gt; str:</code> | 定义 Python 函数 `latest_user_task`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 756 | <code>    database = scenario.starting_context.get_database(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 757 | <code>        DatabaseNamespace.SANDBOX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 758 | <code>        get_all_history_snapshots=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 759 | <code>        drop_sandbox_message_index=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 760 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>    rows = database.filter(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 762 | <code>        (database["sender"] == RoleType.USER) &amp; (database["recipient"] == RoleType.AGENT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 763 | <code>    ).to_dicts()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 764 | <code>    if not rows:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 765 | <code>        raise RuntimeError("Scenario has no USER -&gt; AGENT task message")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 766 | <code>    return str(rows[-1]["content"])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>def summarize_ailis_audit(scenario_output: Path) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `summarize_ailis_audit`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 770 | <code>    transcript_root = scenario_output / "ailis-audit" / "transcripts"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 771 | <code>    llm_events: dict[str, dict[str, Any]] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 772 | <code>    tool_events: dict[str, dict[str, Any]] = {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 773 | <code>    if transcript_root.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 774 | <code>        for transcript_path in transcript_root.rglob("*.jsonl"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 775 | <code>            for line in transcript_path.read_text(encoding="utf-8").splitlines():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 776 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 777 | <code>                    event = json.loads(line)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 778 | <code>                except json.JSONDecodeError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 779 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 780 | <code>                event_id = str(event.get("id") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 781 | <code>                if event.get("type") == "agent.llm_call" and event_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 782 | <code>                    llm_events[event_id] = event</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 783 | <code>                elif event.get("type") == "tool.call" and event_id:</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 784 | <code>                    tool_events[event_id] = event</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 785 | <code>    prompt_tokens = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 786 | <code>    completion_tokens = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 787 | <code>    total_tokens = 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 788 | <code>    providers: set[str] = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 789 | <code>    models: set[str] = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 790 | <code>    for event in llm_events.values():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 791 | <code>        payload = event.get("payload", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 792 | <code>        usage = payload.get("usage", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 793 | <code>        prompt_tokens += int(usage.get("promptTokens") or usage.get("prompt_tokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 794 | <code>        completion_tokens += int(usage.get("completionTokens") or usage.get("completion_tokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 795 | <code>        total_tokens += int(usage.get("totalTokens") or usage.get("total_tokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 796 | <code>        if payload.get("provider"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 797 | <code>            providers.add(str(payload["provider"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 798 | <code>        if payload.get("model"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 799 | <code>            models.add(str(payload["model"]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 800 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 801 | <code>        "llmCalls": len(llm_events),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 802 | <code>        "promptTokens": prompt_tokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 803 | <code>        "completionTokens": completion_tokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 804 | <code>        "totalTokens": total_tokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 805 | <code>        "providers": sorted(providers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 806 | <code>        "models": sorted(models),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 807 | <code>        "toolCalls": len(tool_events),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 808 | <code>        "toolNames": [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 809 | <code>            str(event.get("payload", {}).get("tool") or event.get("payload", {}).get("toolName") or "")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 810 | <code>            for event in tool_events.values()</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 811 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>def base_scenario_name(scenario_name: str) -&gt; str:</code> | 定义 Python 函数 `base_scenario_name`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 816 | <code>    for suffix in AUGMENTATION_SUFFIXES:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 817 | <code>        if scenario_name.endswith(suffix):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 818 | <code>            return scenario_name[: -len(suffix)]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 819 | <code>    return scenario_name</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>def requires_rapid_api(</code> | 定义 Python 函数 `requires_rapid_api`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 823 | <code>    scenario_name: str, scenarios: dict[str, Any]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 824 | <code>) -&gt; bool:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 825 | <code>    base_name = base_scenario_name(scenario_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 826 | <code>    base = scenarios.get(base_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 827 | <code>    if base is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 828 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 829 | <code>    return bool(RAPID_API_TOOLS.intersection(base.starting_context.tool_allow_list or []))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 832 | <code>def exclude_rapid_api_scenarios(</code> | 定义 Python 函数 `exclude_rapid_api_scenarios`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 833 | <code>    selected: list[str], scenarios: dict[str, Any]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 834 | <code>) -&gt; list[str]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 835 | <code>    return [</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 836 | <code>        name for name in selected if not requires_rapid_api(name, scenarios)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 837 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 839 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 840 | <code>def load_latest_progress(path: Path) -&gt; dict[str, dict[str, Any]]:</code> | 定义 Python 函数 `load_latest_progress`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 841 | <code>    latest: dict[str, dict[str, Any]] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 842 | <code>    if not path.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 843 | <code>        return latest</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 844 | <code>    for line in path.read_text(encoding="utf-8").splitlines():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 845 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 846 | <code>            record = json.loads(line)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 847 | <code>        except json.JSONDecodeError:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 848 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 849 | <code>        scenario = str(record.get("scenario") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 850 | <code>        if scenario:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 851 | <code>            latest[scenario] = record</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 852 | <code>    return latest</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 853 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>def classify_fatal_provider_error(error_text: str) -&gt; Optional[str]:</code> | 定义 Python 函数 `classify_fatal_provider_error`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 856 | <code>    normalized = error_text.lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 857 | <code>    checks = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 858 | <code>        "codex_usage_limited": ("codex_usage_limited", "usage or rate limit", "quota"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 859 | <code>        "codex_auth_required": ("codex_auth_required", "not logged in", "oauth credentials"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 860 | <code>        "codex_not_found": ("codex_not_found", "codex cli javascript entrypoint was not found"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 861 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>    for code, needles in checks.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 863 | <code>        if any(needle in normalized for needle in needles):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 864 | <code>            return code</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 865 | <code>    return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>def build_summary(</code> | 定义 Python 函数 `build_summary`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 869 | <code>    *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 870 | <code>    args: argparse.Namespace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 871 | <code>    selected: list[str],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 872 | <code>    latest: dict[str, dict[str, Any]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 873 | <code>) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 874 | <code>    results = [latest[name] for name in selected if name in latest]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 875 | <code>    scored = [item for item in results if isinstance(item.get("similarity"), (int, float))]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 876 | <code>    by_category: dict[str, list[dict[str, Any]]] = defaultdict(list)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 877 | <code>    for item in scored:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 878 | <code>        for category in item.get("categories") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 879 | <code>            by_category[str(category)].append(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 880 | <code>    category_results = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 881 | <code>        category: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 882 | <code>            "count": len(items),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 883 | <code>            "averageSimilarity": sum(float(item["similarity"]) for item in items) / len(items),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 884 | <code>            "averageTurnCount": sum(float(item.get("turnCount") or 0) for item in items) / len(items),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 885 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 886 | <code>        for category, items in sorted(by_category.items())</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 887 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>    usage = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 889 | <code>        "agentPromptTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 890 | <code>        "agentCompletionTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 891 | <code>        "agentTotalTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 892 | <code>        "userSimulatorPromptTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 893 | <code>        "userSimulatorCompletionTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 894 | <code>        "userSimulatorTotalTokens": 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 895 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 896 | <code>    for item in results:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 897 | <code>        agent_metrics = item.get("ailisMetrics") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 898 | <code>        user_metrics = item.get("userSimulatorMetrics") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 899 | <code>        usage["agentPromptTokens"] += int(agent_metrics.get("promptTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 900 | <code>        usage["agentCompletionTokens"] += int(agent_metrics.get("completionTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 901 | <code>        usage["agentTotalTokens"] += int(agent_metrics.get("totalTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 902 | <code>        usage["userSimulatorPromptTokens"] += int(user_metrics.get("promptTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 903 | <code>        usage["userSimulatorCompletionTokens"] += int(user_metrics.get("completionTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 904 | <code>        usage["userSimulatorTotalTokens"] += int(user_metrics.get("totalTokens") or 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 905 | <code>    usage["totalTokens"] = usage["agentTotalTokens"] + usage["userSimulatorTotalTokens"]</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 906 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 907 | <code>        "runId": args.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 908 | <code>        "benchmark": "Apple ToolSandbox",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 909 | <code>        "protocol": "AILIS production Persona -&gt; persistent TaskAgent -&gt; official ToolSandbox tools -&gt; Persona output",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 910 | <code>        "provider": args.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 911 | <code>        "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 912 | <code>        "reasoningEffort": args.codex_reasoning_effort if args.provider == "codex-model-bridge" else None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 913 | <code>        "benchmarkClock": getattr(args, "benchmark_clock_record", None),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 914 | <code>        "userSimulator": (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 915 | <code>            "official on-policy role/messages/tools driven by codex-model-bridge"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 916 | <code>            if args.provider == "codex-model-bridge"</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 917 | <code>            else "deterministic end-after-first-response"</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 918 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 919 | <code>        "selected": len(selected),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 920 | <code>        "recorded": len(results),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 921 | <code>        "completed": len(scored),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 922 | <code>        "errors": sum(item.get("status") == "error" for item in results),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 923 | <code>        "blockedEnvironment": sum(item.get("status") == "blocked_environment" for item in results),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 924 | <code>        "fatalProviderErrors": sum(bool(item.get("fatalProviderError")) for item in results),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 925 | <code>        "averageSimilarity": sum(float(item["similarity"]) for item in scored) / len(scored) if scored else 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 926 | <code>        "perfect": sum(item.get("similarity") == 1 for item in scored),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 927 | <code>        "usage": usage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 928 | <code>        "categoryAggregatedResults": category_results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 929 | <code>        "results": results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 930 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>def main() -&gt; int:</code> | 定义 Python 函数 `main`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 934 | <code>    args = parse_args()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 935 | <code>    if args.retry_errors_only:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 936 | <code>        args.resume = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 937 | <code>        args.retry_errors = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 938 | <code>    if args.retry_failures_only:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 939 | <code>        if not args.retry_batch_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 940 | <code>            raise ValueError("--retry-failures-only requires --retry-batch-id")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 941 | <code>        args.resume = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 942 | <code>        args.retry_errors = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 943 | <code>    project_root = Path(args.project_root).resolve()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 944 | <code>    output_root = Path(args.output_dir).resolve() / args.run_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 945 | <code>    output_root.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 946 | <code>    progress_path = output_root / "progress.jsonl"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 947 | <code>    state_path = output_root / "state.json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 948 | <code>    summary_path = output_root / "summary.json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 949 | <code>    benchmark_clock = load_or_create_benchmark_clock(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 950 | <code>        output_root / "benchmark-clock.json", args.benchmark_clock</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 951 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>    benchmark_clock_anchor = datetime_module.datetime.fromisoformat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 953 | <code>        benchmark_clock["anchorLocalIso"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 954 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 955 | <code>    install_benchmark_clock(benchmark_clock_anchor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 956 | <code>    runtime_environment_override = benchmark_runtime_environment_override(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 957 | <code>        benchmark_clock</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 958 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>    args.benchmark_clock_record = benchmark_clock</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 960 | <code>    scenarios = named_scenarios(preferred_tool_backend=ToolBackend.DEFAULT)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 961 | <code>    selected = list(scenarios) if args.all else (args.scenarios or DEFAULT_SMOKE_SCENARIOS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 962 | <code>    if args.exclude_rapid_api:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 963 | <code>        selected = exclude_rapid_api_scenarios(selected, scenarios)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 964 | <code>    if args.max_scenarios is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 965 | <code>        selected = selected[: max(0, args.max_scenarios)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 966 | <code>    missing = [name for name in selected if name not in scenarios]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 967 | <code>    if missing:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 968 | <code>        raise KeyError(f"Unknown ToolSandbox scenarios: {missing}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>    latest = load_latest_progress(progress_path) if args.resume else {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 971 | <code>    retry_error_names = retry_error_scenario_names(selected, latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 972 | <code>    retry_manifest = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 973 | <code>        load_or_create_retry_failure_manifest(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 974 | <code>            output_root=output_root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 975 | <code>            batch_id=args.retry_batch_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 976 | <code>            selected=selected,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 977 | <code>            latest=latest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 978 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 979 | <code>        if args.retry_failures_only else None</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 980 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 981 | <code>    retry_names = set(retry_manifest.get("scenarios") or []) if retry_manifest else set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 982 | <code>    official_indexes = {name: index for index, name in enumerate(selected, start=1)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 983 | <code>    run_selected = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 984 | <code>        [name for name in selected if name in retry_names]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 985 | <code>        if retry_manifest else selected</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 986 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>    initial_retry_metrics = retry_batch_metrics(retry_manifest, latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 988 | <code>    write_json(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 989 | <code>        state_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 990 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 991 | <code>            "runId": args.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 992 | <code>            "status": "running",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 993 | <code>            "provider": args.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 994 | <code>            "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 995 | <code>            "benchmarkClock": benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 996 | <code>            "selected": len(selected),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 997 | <code>            "completed": sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 998 | <code>                isinstance(latest.get(name, {}).get("similarity"), (int, float)) for name in selected</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 999 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1000 | <code>            "selectionMode": "retry_failures_only" if retry_manifest else "registry",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1001 | <code>            "retryBatch": initial_retry_metrics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1002 | <code>            "currentScenario": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1003 | <code>            "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1004 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    for scenario_name in run_selected:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1007 | <code>        index = official_indexes[scenario_name]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1008 | <code>        if args.retry_errors_only and scenario_name not in retry_error_names:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1009 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1010 | <code>        prior = latest.get(scenario_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1011 | <code>        if retry_manifest:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1012 | <code>            baseline_attempt = int(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1013 | <code>                (retry_manifest.get("baseline", {}).get(scenario_name) or {}).get("attempt") or 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1014 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1015 | <code>            if int((prior or {}).get("attempt") or 0) &gt; baseline_attempt:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1016 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1017 | <code>        if args.resume and prior:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1018 | <code>            if (</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1019 | <code>                isinstance(prior.get("similarity"), (int, float))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1020 | <code>                and not retry_manifest</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1021 | <code>            ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1022 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1023 | <code>            if prior.get("status") == "error" and not args.retry_errors:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1024 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1025 | <code>            if prior.get("status") == "blocked_environment" and "RAPID_API_KEY" not in os.environ:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1026 | <code>                continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1027 | <code>        scenario = scenarios[scenario_name]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1028 | <code>        original_task = latest_user_task(scenario)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1029 | <code>        categories = [str(category) for category in scenario.categories]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1030 | <code>        if requires_rapid_api(scenario_name, scenarios) and "RAPID_API_KEY" not in os.environ:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1031 | <code>            record = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1032 | <code>                "index": index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1033 | <code>                "attempt": int((prior or {}).get("attempt") or 0) + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1034 | <code>                "scenario": scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1035 | <code>                "baseScenario": base_scenario_name(scenario_name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1036 | <code>                "task": original_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1037 | <code>                "categories": categories,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1038 | <code>                "status": "blocked_environment",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1039 | <code>                "error": "RAPID_API_KEY is required by an official necessary tool for this scenario.",</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1040 | <code>                "durationMs": 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1041 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1042 | <code>            latest[scenario_name] = record</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1043 | <code>            append_jsonl(progress_path, record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1044 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1045 | <code>        attempt = int((prior or {}).get("attempt") or 0) + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1046 | <code>        scenario_output = output_root / "scenarios" / scenario_name / f"attempt-{attempt:03d}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1047 | <code>        agent = AILISToolSandboxAgent(</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1048 | <code>            project_root=project_root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1049 | <code>            output_dir=scenario_output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1050 | <code>            run_id=args.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1051 | <code>            scenario_name=scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1052 | <code>            original_task=original_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1053 | <code>            max_agent_steps=args.max_agent_steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1054 | <code>            provider=args.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1055 | <code>            codex_model=args.codex_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1056 | <code>            codex_reasoning_effort=args.codex_reasoning_effort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1057 | <code>            llm_timeout_ms=args.llm_timeout_ms,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1058 | <code>            runtime_environment_override=runtime_environment_override,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1059 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1060 | <code>        user: BaseRole</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1061 | <code>        if args.provider == "codex-model-bridge":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1062 | <code>            user = CodexToolSandboxUser(</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1063 | <code>                project_root=project_root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1064 | <code>                output_dir=scenario_output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1065 | <code>                model=args.codex_model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1066 | <code>                reasoning_effort=args.codex_reasoning_effort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1067 | <code>                timeout_ms=args.llm_timeout_ms,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1068 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1069 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1070 | <code>            user = AutoEndUser()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1071 | <code>        write_json(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1072 | <code>            state_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1073 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1074 | <code>                "runId": args.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1075 | <code>                "status": "running",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1076 | <code>                "provider": args.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1077 | <code>                "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1078 | <code>                "benchmarkClock": benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1079 | <code>                "selected": len(selected),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1080 | <code>                "completed": sum(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1081 | <code>                    isinstance(latest.get(name, {}).get("similarity"), (int, float))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1082 | <code>                    for name in selected</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 1083 | <code>                ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>                "selectionMode": "retry_failures_only" if retry_manifest else "registry",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1085 | <code>                "retryBatch": retry_batch_metrics(retry_manifest, latest),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1086 | <code>                "currentIndex": index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1087 | <code>                "currentScenario": scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1088 | <code>                "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1089 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1090 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>        started_at = time.time()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1092 | <code>        record: dict[str, Any]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1093 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1094 | <code>            result = scenario.play_and_evaluate(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1095 | <code>                roles={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1096 | <code>                    RoleType.AGENT: agent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1097 | <code>                    RoleType.USER: user,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1098 | <code>                    RoleType.EXECUTION_ENVIRONMENT: ExecutionEnvironment(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1099 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1100 | <code>                output_directory=scenario_output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1101 | <code>                scenario_name=scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1102 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1103 | <code>            evaluation = result.evaluation_result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1104 | <code>            record = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1105 | <code>                "index": index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1106 | <code>                "attempt": attempt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1107 | <code>                "scenario": scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1108 | <code>                "baseScenario": base_scenario_name(scenario_name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1109 | <code>                "task": original_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1110 | <code>                "categories": categories,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1111 | <code>                "status": "completed",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1112 | <code>                "similarity": evaluation.similarity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1113 | <code>                "milestoneSimilarity": evaluation.milestone_similarity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1114 | <code>                "minefieldSimilarity": evaluation.minefield_similarity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1115 | <code>                "turnCount": evaluation.turn_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1116 | <code>                "durationMs": round((time.time() - started_at) * 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1117 | <code>                "outputDir": str(scenario_output),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1118 | <code>                "ailis": agent.last_result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1119 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1120 | <code>        except Exception as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1121 | <code>            error_traceback = traceback.format_exc()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1122 | <code>            fatal_provider_error = classify_fatal_provider_error(f"{error!r}\n{error_traceback}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1123 | <code>            record = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1124 | <code>                "index": index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1125 | <code>                "attempt": attempt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1126 | <code>                "scenario": scenario_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1127 | <code>                "baseScenario": base_scenario_name(scenario_name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1128 | <code>                "task": original_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1129 | <code>                "categories": categories,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1130 | <code>                "status": "error",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1131 | <code>                "error": repr(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1132 | <code>                "traceback": error_traceback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1133 | <code>                "fatalProviderError": fatal_provider_error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1134 | <code>                "durationMs": round((time.time() - started_at) * 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1135 | <code>                "outputDir": str(scenario_output),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1136 | <code>                "ailis": agent.last_result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1137 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1138 | <code>        finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 1139 | <code>            agent.teardown()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1140 | <code>            if isinstance(user, CodexToolSandboxUser):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1141 | <code>                user.teardown()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1142 | <code>        record["ailisMetrics"] = summarize_ailis_audit(scenario_output)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1143 | <code>        record["userSimulatorMetrics"] = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1144 | <code>            user.metrics() if isinstance(user, CodexToolSandboxUser) else {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1145 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1146 | <code>        latest[scenario_name] = record</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1147 | <code>        append_jsonl(progress_path, record)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1148 | <code>        print(json.dumps(record, ensure_ascii=False), flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1149 | <code>        if record.get("fatalProviderError"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1150 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1152 | <code>    summary = build_summary(args=args, selected=selected, latest=latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1153 | <code>    summary["selectionMode"] = "retry_failures_only" if retry_manifest else "registry"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1154 | <code>    summary["retryBatch"] = retry_batch_metrics(retry_manifest, latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1155 | <code>    write_json(summary_path, summary)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1156 | <code>    retry_batch_completed = bool(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1157 | <code>        summary.get("retryBatch")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1158 | <code>        and summary["retryBatch"]["processed"] &gt;= summary["retryBatch"]["target"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1159 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1160 | <code>    final_status = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1161 | <code>        "retry_batch_completed"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1162 | <code>        if retry_manifest and retry_batch_completed</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1163 | <code>        else "completed"</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1164 | <code>        if summary["completed"] == len(selected)</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1165 | <code>        else "provider_blocked"</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1166 | <code>        if summary["fatalProviderErrors"]</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1167 | <code>        else "blocked_or_incomplete"</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 1168 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1169 | <code>    write_json(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1170 | <code>        state_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1171 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1172 | <code>            "runId": args.run_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1173 | <code>            "status": final_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1174 | <code>            "provider": args.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1175 | <code>            "model": args.codex_model if args.provider == "codex-model-bridge" else "desktop-configured",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1176 | <code>            "benchmarkClock": benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1177 | <code>            "selected": len(selected),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1178 | <code>            "completed": summary["completed"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1179 | <code>            "errors": summary["errors"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1180 | <code>            "blockedEnvironment": summary["blockedEnvironment"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1181 | <code>            "fatalProviderErrors": summary["fatalProviderErrors"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1182 | <code>            "selectionMode": summary["selectionMode"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1183 | <code>            "retryBatch": summary["retryBatch"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1184 | <code>            "currentScenario": None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1185 | <code>            "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1186 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1187 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1188 | <code>    print(json.dumps(summary, ensure_ascii=False), flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1189 | <code>    if retry_manifest and retry_batch_completed:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1190 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1191 | <code>    if summary["completed"] == len(selected):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1192 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1193 | <code>    if summary["fatalProviderErrors"]:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1194 | <code>        return 3</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1195 | <code>    return 2 if summary["blockedEnvironment"] else 1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 1196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1198 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 1199 | <code>    sys.exit(main())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
