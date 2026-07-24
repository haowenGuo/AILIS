# examples/python_safety_client/src/ailis_safety_client/client.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：193
- SHA-256：`bc2644858e6897a596199b012f895d1e173dc70ee3fdc6098455bec8f66f38c1`
- 可运行副本：[打开源文件](../../../../../../source/examples/python_safety_client/src/ailis_safety_client/client.py)
- 依赖：`__future__`、`asyncio`、`os`、`sys`、`pathlib`、`typing`、`httpx`、`models`、`.models`
- 主要符号：`AISafetyClientError`、`AISafetyClient`、`keeps`、`__init__`、`check_content`、`check_content_legacy`、`should_block`、`decision_from_risk_level`、`cleaned_risk_types`、`AISafetyAsyncClient`、`check_many`、`check_many_safe`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from __future__ import annotations</code> | 导入 Python 依赖 `__future__`，供本模块调用其类型、函数或常量。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from typing import Iterable</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>import httpx</code> | 导入 Python 依赖 `httpx`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>if __package__ in {None, ""}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 12 | <code>    CURRENT_DIR = Path(__file__).resolve().parent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>    if str(CURRENT_DIR) not in sys.path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 14 | <code>        sys.path.insert(0, str(CURRENT_DIR))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>    from models import LegacySafetyResponse, SafetyCheckResponse</code> | 导入 Python 依赖 `models`，供本模块调用其类型、函数或常量。 |
| 16 | <code>else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 17 | <code>    from .models import LegacySafetyResponse, SafetyCheckResponse</code> | 导入 Python 依赖 `.models`，供本模块调用其类型、函数或常量。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>DEFAULT_BASE_URL = os.getenv("AILIS_SAFETY_BASE_URL", "https://airi-backend.onrender.com")</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 21 | <code>PLACEHOLDER_RISK_TYPES = {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 22 | <code>    "无",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>    "none",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>    "unknown",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>    "no risk",</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 26 | <code>    "未识别",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>    "未识别风险类型",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>    "无明确风险类型",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 29 | <code>    "未命中任何指定风险类型",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>class AISafetyClientError(RuntimeError):</code> | 定义 Python 类 `AISafetyClientError`，封装相关状态、协议和方法。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 34 | <code>    """Raised when the example client cannot reach or parse the API response."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>class AISafetyClient:</code> | 定义 Python 类 `AISafetyClient`，封装相关状态、协议和方法。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 38 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 39 | <code>    Small sync client for the AILIS safety API.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>    This class keeps the example simple on purpose:</code> | 定义类 `keeps`，把相关状态与行为收拢为一个运行时对象。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 42 | <code>    - no custom auth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>    - no retries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>    - response models are plain dataclasses</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>    def __init__(self, base_url: str = DEFAULT_BASE_URL, timeout: float = 60.0) -&gt; None:</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>        self.base_url = base_url.rstrip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 49 | <code>        self.timeout = timeout</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 50 | <code>        self.trust_env = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>    def check_content(</code> | 定义 Python 函数 `check_content`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 53 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>        content: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 55 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>        task_type: str = "content_safety_check",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 57 | <code>        extra: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 58 | <code>    ) -&gt; SafetyCheckResponse:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 59 | <code>        payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 60 | <code>            "content": content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 61 | <code>            "task_type": task_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 62 | <code>            "extra": extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 63 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 65 | <code>            with httpx.Client(timeout=self.timeout, trust_env=self.trust_env) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 66 | <code>                response = client.post(f"{self.base_url}/api/safety/check", json=payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 67 | <code>                response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 68 | <code>                return SafetyCheckResponse.from_dict(response.json())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 69 | <code>        except httpx.HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 70 | <code>            raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>    def check_content_legacy(</code> | 定义 Python 函数 `check_content_legacy`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>        content: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 75 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 76 | <code>        task_type: str = "content_safety_check",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 77 | <code>        extra: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 78 | <code>    ) -&gt; LegacySafetyResponse:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>        payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>            "task_type": task_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>            "params": {"content": content},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>            "extra": extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 85 | <code>            with httpx.Client(timeout=self.timeout, trust_env=self.trust_env) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 86 | <code>                response = client.post(f"{self.base_url}/api/handle", json=payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 87 | <code>                response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 88 | <code>                return LegacySafetyResponse.from_dict(response.json())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 89 | <code>        except httpx.HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 90 | <code>            raise AISafetyClientError(f"Failed to call /api/handle: {exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>    def should_block(risk_level: str) -&gt; bool:</code> | 定义 Python 函数 `should_block`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>        return risk_level in {"中风险", "高风险"}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 97 | <code>    def decision_from_risk_level(risk_level: str) -&gt; str:</code> | 定义 Python 函数 `decision_from_risk_level`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>        if risk_level == "高风险":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 99 | <code>            return "block"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 100 | <code>        if risk_level == "中风险":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 101 | <code>            return "review"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>        return "allow"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 105 | <code>    def cleaned_risk_types(risk_types: Iterable[str]) -&gt; list[str]:</code> | 定义 Python 函数 `cleaned_risk_types`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>        return [</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 107 | <code>            item</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 108 | <code>            for item in risk_types</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 109 | <code>            if item and item not in PLACEHOLDER_RISK_TYPES</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 110 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>class AISafetyAsyncClient:</code> | 定义 Python 类 `AISafetyAsyncClient`，封装相关状态、协议和方法。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 114 | <code>    """Async client for higher-throughput moderation tasks."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    def __init__(self, base_url: str = DEFAULT_BASE_URL, timeout: float = 60.0) -&gt; None:</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 117 | <code>        self.base_url = base_url.rstrip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>        self.timeout = timeout</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 119 | <code>        self.trust_env = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 122 | <code>    def decision_from_risk_level(risk_level: str) -&gt; str:</code> | 定义 Python 函数 `decision_from_risk_level`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 123 | <code>        return AISafetyClient.decision_from_risk_level(risk_level)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    @staticmethod</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 126 | <code>    def cleaned_risk_types(risk_types: Iterable[str]) -&gt; list[str]:</code> | 定义 Python 函数 `cleaned_risk_types`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 127 | <code>        return AISafetyClient.cleaned_risk_types(risk_types)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>    async def check_content(</code> | 定义 Python 函数 `check_content`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 130 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 131 | <code>        content: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 132 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 133 | <code>        task_type: str = "content_safety_check",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>        extra: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 135 | <code>        client: httpx.AsyncClient &#124; None = None,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 136 | <code>    ) -&gt; SafetyCheckResponse:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 137 | <code>        payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 138 | <code>            "content": content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 139 | <code>            "task_type": task_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 140 | <code>            "extra": extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 141 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>        if client is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 143 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 144 | <code>                response = await client.post(f"{self.base_url}/api/safety/check", json=payload)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>                response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 146 | <code>                return SafetyCheckResponse.from_dict(response.json())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 147 | <code>            except httpx.HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 148 | <code>                raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 151 | <code>            async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as internal_client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 152 | <code>                response = await internal_client.post(f"{self.base_url}/api/safety/check", json=payload)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 153 | <code>                response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 154 | <code>                return SafetyCheckResponse.from_dict(response.json())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 155 | <code>        except httpx.HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 156 | <code>            raise AISafetyClientError(f"Failed to call /api/safety/check: {exc}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    async def check_many(</code> | 定义 Python 函数 `check_many`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 160 | <code>        contents: Iterable[str],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 161 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 162 | <code>        task_type: str = "content_safety_check",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 163 | <code>        extra: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 164 | <code>    ) -&gt; list[SafetyCheckResponse]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 165 | <code>        async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 166 | <code>            tasks = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 167 | <code>                self.check_content(content, task_type=task_type, extra=extra, client=client)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 168 | <code>                for content in contents</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 169 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>            return list(await asyncio.gather(*tasks))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    async def check_many_safe(</code> | 定义 Python 函数 `check_many_safe`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 173 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 174 | <code>        contents: Iterable[str],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 175 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 176 | <code>        task_type: str = "content_safety_check",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 177 | <code>        extra: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 178 | <code>    ) -&gt; list[tuple[str, SafetyCheckResponse &#124; None, str &#124; None]]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 179 | <code>        input_items = list(contents)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 180 | <code>        async with httpx.AsyncClient(timeout=self.timeout, trust_env=self.trust_env) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 181 | <code>            tasks = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>                self.check_content(content, task_type=task_type, extra=extra, client=client)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>                for content in input_items</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 184 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>            gathered = await asyncio.gather(*tasks, return_exceptions=True)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>        normalized_results: list[tuple[str, SafetyCheckResponse &#124; None, str &#124; None]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 188 | <code>        for original_content, item in zip(input_items, gathered):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 189 | <code>            if isinstance(item, Exception):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 190 | <code>                normalized_results.append((original_content, None, str(item)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 191 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 192 | <code>                normalized_results.append((original_content, item, None))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 193 | <code>        return normalized_results</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
