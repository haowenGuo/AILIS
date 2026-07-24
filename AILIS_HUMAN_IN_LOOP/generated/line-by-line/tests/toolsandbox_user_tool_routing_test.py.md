# tests/toolsandbox_user_tool_routing_test.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：190
- SHA-256：`4dc0523da897e15e7e46012df65bada0c9b965d334aceedf97e7847ed77ebeb4`
- 可运行副本：[打开源文件](../../../source/tests/toolsandbox_user_tool_routing_test.py)
- 依赖：`datetime`、`sys`、`tempfile`、`types`、`pathlib`、`unittest`、`unittest.mock`、`tool_sandbox.common.execution_context`、`scripts.toolsandbox.run_ailis_toolsandbox`、`tool_sandbox.common.utils`、`tool_sandbox.tools.utilities`
- 主要符号：`FakeClient`、`infer`、`CodexToolSandboxUserRoutingTest`、`test_user_tool_name_bypasses_agent_scrambling_map`、`test_latest_progress_keeps_only_the_latest_error_for_retry_selection`、`test_failure_retry_selection_and_batch_metrics_use_only_new_attempts`、`test_benchmark_clock_is_persisted_and_controls_official_time_tools`、`test_rapid_api_scenarios_are_excluded_before_completion_accounting`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import datetime</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 3 | <code>from tempfile import TemporaryDirectory</code> | 导入 Python 依赖 `tempfile`，供本模块调用其类型、函数或常量。 |
| 4 | <code>from types import SimpleNamespace</code> | 导入 Python 依赖 `types`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from unittest import TestCase, main</code> | 导入 Python 依赖 `unittest`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from unittest.mock import patch</code> | 导入 Python 依赖 `unittest.mock`，供本模块调用其类型、函数或常量。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>from tool_sandbox.common.execution_context import RoleType</code> | 导入 Python 依赖 `tool_sandbox.common.execution_context`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>sys.path.insert(0, str(Path(__file__).resolve().parents[1]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>from scripts.toolsandbox.run_ailis_toolsandbox import (</code> | 导入 Python 依赖 `scripts.toolsandbox.run_ailis_toolsandbox`，供本模块调用其类型、函数或常量。 |
| 14 | <code>    CodexToolSandboxUser,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    benchmark_runtime_environment_override,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    exclude_rapid_api_scenarios,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    install_benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    load_latest_progress,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    load_or_create_benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    restore_benchmark_clock,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    retry_batch_metrics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    retry_error_scenario_names,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    retry_failure_scenario_names,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 24 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>class FakeClient:</code> | 定义 Python 类 `FakeClient`，封装相关状态、协议和方法。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    def infer(self, *, messages, tools):</code> | 定义 Python 函数 `infer`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 30 | <code>            "provider": "codex-model-bridge",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 31 | <code>            "model": "gpt-5.5",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 32 | <code>            "usage": {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 33 | <code>            "toolCalls": [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 34 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 35 | <code>                    "id": "user_call",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 36 | <code>                    "name": "end_conversation",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 37 | <code>                    "arguments": {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 38 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>class CodexToolSandboxUserRoutingTest(TestCase):</code> | 定义 Python 类 `CodexToolSandboxUserRoutingTest`，封装相关状态、协议和方法。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    def test_user_tool_name_bypasses_agent_scrambling_map(self):</code> | 定义 Python 函数 `test_user_tool_name_bypasses_agent_scrambling_map`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        user = object.__new__(CodexToolSandboxUser)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        user.client = FakeClient()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        user.calls = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        user.get_messages = lambda ending_index=None: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            SimpleNamespace(sender=RoleType.AGENT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>        user.messages_validation = lambda messages: None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        user.filter_messages = lambda messages: messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        user.get_available_tools = lambda: {"end_conversation": object()}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        captured = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 55 | <code>        user.add_messages = captured.extend</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>        with (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 58 | <code>            patch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                "scripts.toolsandbox.run_ailis_toolsandbox.convert_to_openai_tool",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 60 | <code>                return_value={"type": "function"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 61 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>            patch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                "scripts.toolsandbox.run_ailis_toolsandbox.OpenAIAPIUser.to_openai_messages",</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 64 | <code>                return_value=[],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 65 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>        ):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 67 | <code>            user.respond()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>        self.assertEqual(len(captured), 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        self.assertEqual(captured[0].openai_function_name, "end_conversation")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        self.assertIn(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 72 | <code>            "user_call_response = end_conversation(**user_call_parameters)",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 73 | <code>            captured[0].content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>    def test_latest_progress_keeps_only_the_latest_error_for_retry_selection(self):</code> | 定义 Python 函数 `test_latest_progress_keeps_only_the_latest_error_for_retry_selection`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        with TemporaryDirectory() as temp_dir:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 78 | <code>            progress_path = Path(temp_dir) / "progress.jsonl"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 79 | <code>            progress_path.write_text(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 80 | <code>                "\n".join(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 81 | <code>                    [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 82 | <code>                        '{"scenario":"fixed","status":"error"}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 83 | <code>                        '{"scenario":"fixed","status":"completed","similarity":1}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 84 | <code>                        '{"scenario":"retry","status":"error"}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 85 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>                + "\n",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 88 | <code>                encoding="utf-8",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 89 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>            latest = load_latest_progress(progress_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 92 | <code>            retry_error_names = retry_error_scenario_names(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 93 | <code>                ["fixed", "retry"], latest</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 94 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>        self.assertEqual(retry_error_names, {"retry"})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>    def test_failure_retry_selection_and_batch_metrics_use_only_new_attempts(self):</code> | 定义 Python 函数 `test_failure_retry_selection_and_batch_metrics_use_only_new_attempts`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        selected = ["positive", "zero", "error", "blocked"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        latest = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 101 | <code>            "positive": {"status": "completed", "similarity": 0.5, "attempt": 1},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 102 | <code>            "zero": {"status": "completed", "similarity": 0, "attempt": 1},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 103 | <code>            "error": {"status": "error", "attempt": 2},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 104 | <code>            "blocked": {"status": "blocked_environment", "attempt": 1},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>        self.assertEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 107 | <code>            retry_failure_scenario_names(selected, latest),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            {"zero", "error"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>        manifest = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            "batchId": "remediation-1",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 113 | <code>            "manifestPath": "retry-batches/remediation-1.manifest.json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 114 | <code>            "scenarios": ["zero", "error"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            "baseline": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 116 | <code>                "zero": {"status": "completed", "similarity": 0, "attempt": 1},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                "error": {"status": "error", "similarity": None, "attempt": 2},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>        latest["zero"] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 121 | <code>            "status": "completed",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 122 | <code>            "similarity": 0.75,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 123 | <code>            "attempt": 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 124 | <code>            "durationMs": 100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 125 | <code>            "ailisMetrics": {"calls": 2, "totalTokens": 10},</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 126 | <code>            "userSimulatorMetrics": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 127 | <code>                "calls": [{"id": "user-1"}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 128 | <code>                "totalTokens": 5,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 129 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        metrics = retry_batch_metrics(manifest, latest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        self.assertEqual(metrics["target"], 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        self.assertEqual(metrics["processed"], 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        self.assertEqual(metrics["scored"], 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 135 | <code>        self.assertEqual(metrics["improved"], 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        self.assertEqual(metrics["recoveredErrors"], 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        self.assertEqual(metrics["averageSimilarity"], 0.75)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        self.assertEqual(metrics["totalCalls"], 3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        self.assertEqual(metrics["totalTokens"], 15)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>    def test_benchmark_clock_is_persisted_and_controls_official_time_tools(self):</code> | 定义 Python 函数 `test_benchmark_clock_is_persisted_and_controls_official_time_tools`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        anchor_text = "2026-07-17T06:06:27+08:00"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        with TemporaryDirectory() as temp_dir:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 144 | <code>            clock_path = Path(temp_dir) / "benchmark-clock.json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 145 | <code>            clock = load_or_create_benchmark_clock(clock_path, anchor_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 146 | <code>            reloaded = load_or_create_benchmark_clock(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                clock_path, "2026-08-01T12:00:00+08:00"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>        self.assertEqual(clock, reloaded)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        override = benchmark_runtime_environment_override(clock)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        self.assertEqual(override["current_date"], "2026-07-17")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        self.assertEqual(override["current_time"], "06:06:27")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        self.assertEqual(override["utc_offset"], "+08:00")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>        anchor = datetime.datetime.fromisoformat(anchor_text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 157 | <code>        patched = install_benchmark_clock(anchor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 158 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 159 | <code>            from tool_sandbox.common.utils import get_tomorrow_datetime</code> | 导入 Python 依赖 `tool_sandbox.common.utils`，供本模块调用其类型、函数或常量。 |
| 160 | <code>            from tool_sandbox.tools.utilities import get_current_timestamp</code> | 导入 Python 依赖 `tool_sandbox.tools.utilities`，供本模块调用其类型、函数或常量。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>            self.assertEqual(get_current_timestamp(), anchor.timestamp())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 163 | <code>            self.assertEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 164 | <code>                get_tomorrow_datetime(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 165 | <code>                datetime.datetime(2026, 7, 18, 6, 6, 27),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 166 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>        finally:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 168 | <code>            restore_benchmark_clock(patched)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>    def test_rapid_api_scenarios_are_excluded_before_completion_accounting(self):</code> | 定义 Python 函数 `test_rapid_api_scenarios_are_excluded_before_completion_accounting`；其缩进块实现具体业务或工具行为。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        scenarios = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            "offline": SimpleNamespace(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                starting_context=SimpleNamespace(tool_allow_list=["add_reminder"])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 174 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>            "paid": SimpleNamespace(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                starting_context=SimpleNamespace(tool_allow_list=["search_weather_around_lat_lon"])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 177 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>            "paid_3_distraction_tools": SimpleNamespace(</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                starting_context=SimpleNamespace(tool_allow_list=[])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 180 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>        self.assertEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 184 | <code>            exclude_rapid_api_scenarios(list(scenarios), scenarios),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 185 | <code>            ["offline"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
| 186 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 190 | <code>    main()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 toolsandbox_user_tool_routing_test 的契约与回归行为。”这一文件职责。 |
