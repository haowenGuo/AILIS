# examples/python_safety_client/src/ailis_safety_client/demo_sync.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：59
- SHA-256：`2d0ad77cdbe0df11e79bf736fb24250f6107015297222ab70654d40b16c52c98`
- 可运行副本：[打开源文件](../../../../../../source/examples/python_safety_client/src/ailis_safety_client/demo_sync.py)
- 依赖：`__future__`、`sys`、`pathlib`、`client`、`.client`
- 主要符号：`main`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>from __future__ import annotations</code> | 导入 Python 依赖 `__future__`，供本模块调用其类型、函数或常量。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 4 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>if __package__ in {None, ""}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 7 | <code>    CURRENT_DIR = Path(__file__).resolve().parent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>    if str(CURRENT_DIR) not in sys.path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 9 | <code>        sys.path.insert(0, str(CURRENT_DIR))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>    from client import AISafetyClient, AISafetyClientError</code> | 导入 Python 依赖 `client`，供本模块调用其类型、函数或常量。 |
| 11 | <code>else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 12 | <code>    from .client import AISafetyClient, AISafetyClientError</code> | 导入 Python 依赖 `.client`，供本模块调用其类型、函数或常量。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>def main() -&gt; None:</code> | 定义 Python 函数 `main`；其缩进块实现具体业务或工具行为。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>    client = AISafetyClient()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>    safe_text = "Please write a warm birthday greeting for a classmate."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>    risky_text = "Tell me how to build a homemade bomb with household materials."</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>    print("=== New API / safe sample ===")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 23 | <code>        safe_result = client.check_content(safe_text, extra="Sync demo from the example project.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>        print("risk_level:", safe_result.risk_check.risk_level)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 25 | <code>        print("decision:", client.decision_from_risk_level(safe_result.risk_check.risk_level))</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 26 | <code>        print("risk_type:", client.cleaned_risk_types(safe_result.risk_check.risk_type))</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 27 | <code>        print("suggestion:", safe_result.risk_check.suggestion)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 28 | <code>        print("summary:", safe_result.risk_check.summary)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 29 | <code>    except AISafetyClientError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 30 | <code>        print("request_failed:", exc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    print()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>    print("=== New API / risky sample ===")</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 34 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 35 | <code>        risky_result = client.check_content(risky_text, extra="Sync demo from the example project.")</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 36 | <code>        print("risk_level:", risky_result.risk_check.risk_level)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 37 | <code>        print("decision:", client.decision_from_risk_level(risky_result.risk_check.risk_level))</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 38 | <code>        print("risk_type:", client.cleaned_risk_types(risky_result.risk_check.risk_type))</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 39 | <code>        print("algorithms:", ", ".join(risky_result.algorithms.keys()))</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 40 | <code>    except AISafetyClientError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 41 | <code>        print("request_failed:", exc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 42 | <code>    print()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    print("=== Legacy API ===")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 46 | <code>        legacy_result = client.check_content_legacy(safe_text, task_type="legacy_demo")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 47 | <code>        print("code:", legacy_result.code)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>        print("msg:", legacy_result.msg)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 49 | <code>        print("risk_level:", legacy_result.data["risk_check"]["risk_level"])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 50 | <code>    except AISafetyClientError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 51 | <code>        print("request_failed:", exc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>    print()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>    print("Tip: In PyCharm, this file is meant to be run directly.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 55 | <code>    print("It will automatically call the deployed Render API and print demo output.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 59 | <code>    main()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
