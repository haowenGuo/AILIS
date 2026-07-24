# backend/services/edu_platform_service.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端服务层：实现模型、记忆、聊天或业务服务逻辑。
- 文件类型：`source-code`
- 原始行数：976
- SHA-256：`9f6f6a72610c816556dcb2d9bac3616fb751daab7d23b46eb1d0e2e4e9f22cf3`
- 可运行副本：[打开源文件](../../../../source/backend/services/edu_platform_service.py)
- 依赖：`base64`、`hashlib`、`os`、`secrets`、`datetime`、`typing`、`sqlalchemy`、`sqlalchemy.ext.asyncio`、`backend.core.config`、`backend.models.edu_models`、`backend.services.edu_question_bank_service`
- 主要符号：`_now_utc`、`_to_iso`、`_normalize_email`、`_normalize_list`、`_parse_delimited_list`、`hash_password`、`verify_password`、`create_session_token`、`compute_diagnostic_result`、`_serialize_user`、`ensure_admin_account`、`_serialize_diagnostic`、`_serialize_assignment`、`_serialize_classroom_session`、`_sort_by_date_desc`、`_build_breakdown`、`_sum_by`、`_build_focus_summary`、`_build_entry`、`_build_question_prompt`、`_build_correct_feedback`、`_build_wrong_feedback`、`_build_student_utterance`、`EduPlatformService`、`__init__`、`get_user_by_email`、`get_user_by_id`、`list_users_by_role`、`create_user`、`create_session`、`get_session_user`、`delete_session`、`list_sessions_by_user`、`upsert_diagnostic`、`get_diagnostics_by_user`、`create_practice_assignment`、`list_assignments_by_teacher`、`list_assignments_for_student`、`create_classroom_session`、`get_classroom_session_by_id`、`update_classroom_session`、`list_classroom_sessions_by_student`、`list_recent_classroom_sessions`、`create_simulated_classroom_session`、`handle_classroom_turn`、`build_student_overview`、`build_teacher_student_cards`、`build_teacher_overview`、`build_teacher_student_detail`、`search_question_bank`、`get_question_bank_source`、`get_questions_by_source_ids`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import base64</code> | 导入 Python 依赖 `base64`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import hashlib</code> | 导入 Python 依赖 `hashlib`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import secrets</code> | 导入 Python 依赖 `secrets`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from datetime import datetime, timedelta, timezone</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from typing import Any</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>from sqlalchemy import delete, desc, select</code> | 导入 Python 依赖 `sqlalchemy`，供本模块调用其类型、函数或常量。 |
| 9 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 12 | <code>from backend.models.edu_models import (</code> | 导入 Python 依赖 `backend.models.edu_models`，供本模块调用其类型、函数或常量。 |
| 13 | <code>    EduClassroomSession,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 14 | <code>    EduDiagnostic,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 15 | <code>    EduPracticeAssignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 16 | <code>    EduSession,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 17 | <code>    EduUser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 18 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>from backend.services.edu_question_bank_service import (</code> | 导入 Python 依赖 `backend.services.edu_question_bank_service`，供本模块调用其类型、函数或常量。 |
| 20 | <code>    build_choice_label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 21 | <code>    get_question_bank,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 22 | <code>    get_question_bank_source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 23 | <code>    get_questions_by_source_ids,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 24 | <code>    pick_question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 25 | <code>)</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>def _now_utc() -&gt; datetime:</code> | 定义 Python 函数 `_now_utc`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 31 | <code>    return datetime.now(timezone.utc)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>def _to_iso(value: datetime &#124; None) -&gt; str &#124; None:</code> | 定义 Python 函数 `_to_iso`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 35 | <code>    return value.astimezone(timezone.utc).isoformat() if value else None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>def _normalize_email(value: str) -&gt; str:</code> | 定义 Python 函数 `_normalize_email`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 39 | <code>    return (value or "").strip().lower()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>def _normalize_list(value: Any) -&gt; list[str]:</code> | 定义 Python 函数 `_normalize_list`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 43 | <code>    if isinstance(value, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 44 | <code>        return [str(item).strip() for item in value if str(item).strip()]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 45 | <code>    if isinstance(value, str) and value.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 46 | <code>        return [item.strip() for item in value.split(",") if item.strip()]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 47 | <code>    return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>def _parse_delimited_list(value: str &#124; list[str] &#124; None) -&gt; list[str]:</code> | 定义 Python 函数 `_parse_delimited_list`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 51 | <code>    if isinstance(value, list):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 52 | <code>        return _normalize_list(value)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 53 | <code>    if not value:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 54 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 55 | <code>    normalized = str(value).replace("，", ",").replace("、", ",")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 56 | <code>    return [item.strip() for item in normalized.split(",") if item.strip()]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>def hash_password(password: str) -&gt; str:</code> | 定义 Python 函数 `hash_password`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 60 | <code>    pepper = settings.EDU_PASSWORD_PEPPER or ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 61 | <code>    salt = os.urandom(16)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 62 | <code>    iterations = 200_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 63 | <code>    digest = hashlib.pbkdf2_hmac(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 64 | <code>        "sha256",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 65 | <code>        f"{password}{pepper}".encode("utf-8"),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 66 | <code>        salt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 67 | <code>        iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 68 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>    return "pbkdf2_sha256${iterations}${salt_hex}${digest_hex}".format(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 70 | <code>        iterations=iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 71 | <code>        salt_hex=base64.b64encode(salt).decode("ascii"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 72 | <code>        digest_hex=base64.b64encode(digest).decode("ascii"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 73 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>def verify_password(password: str, encoded_password: str) -&gt; bool:</code> | 定义 Python 函数 `verify_password`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 77 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 78 | <code>        algorithm, iterations_raw, salt_raw, digest_raw = encoded_password.split("$", 3)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 79 | <code>        if algorithm != "pbkdf2_sha256":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 80 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 81 | <code>        pepper = settings.EDU_PASSWORD_PEPPER or ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 82 | <code>        iterations = int(iterations_raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 83 | <code>        salt = base64.b64decode(salt_raw.encode("ascii"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 84 | <code>        expected = base64.b64decode(digest_raw.encode("ascii"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 85 | <code>        actual = hashlib.pbkdf2_hmac(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 86 | <code>            "sha256",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 87 | <code>            f"{password}{pepper}".encode("utf-8"),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 88 | <code>            salt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 89 | <code>            iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 90 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>        return secrets.compare_digest(actual, expected)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 92 | <code>    except Exception:  # noqa: BLE001</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 93 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>def create_session_token() -&gt; str:</code> | 定义 Python 函数 `create_session_token`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 97 | <code>    return secrets.token_urlsafe(32)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>def compute_diagnostic_result(input_data: dict[str, Any]) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `compute_diagnostic_result`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 101 | <code>    baseline = int(input_data.get("baselineScore") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 102 | <code>    confidence_level = int(input_data.get("confidenceLevel") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 103 | <code>    homework_completion = int(input_data.get("homeworkCompletion") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 104 | <code>    mistake_recovery = int(input_data.get("mistakeRecovery") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 105 | <code>    weak_points = _parse_delimited_list(input_data.get("weakPoints"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>    normalized_score = round((baseline / 150) * 100) if baseline else 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 108 | <code>    confidence_score = max(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 109 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 110 | <code>        min(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 111 | <code>            100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 112 | <code>            round(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 113 | <code>                normalized_score * 0.5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 114 | <code>                + confidence_level * 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 115 | <code>                + homework_completion * 0.2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 116 | <code>                + mistake_recovery * 0.14</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 117 | <code>                - len(weak_points) * 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 118 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>    current_level = "基础巩固"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 123 | <code>    if confidence_score &gt;= 82:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 124 | <code>        current_level = "拔高冲刺"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 125 | <code>    elif confidence_score &gt;= 66:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 126 | <code>        current_level = "进阶提升"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>    subject = input_data.get("subject") or "综合"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 129 | <code>    if current_level == "拔高冲刺":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 130 | <code>        mastery_summary = f"{subject} 当前具备较强的应试稳定性，适合压轴题与高阶题型训练。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 131 | <code>        recommended_path = ["进入拔高题单", "解锁押题进阶卷", "加入名校笔记复盘"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 132 | <code>    elif current_level == "进阶提升":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 133 | <code>        mastery_summary = f"{subject} 基础框架较完整，建议围绕薄弱考点做中强度分层训练。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 134 | <code>        recommended_path = ["先做薄弱点专项包", "进入中高考技巧课", "完成错题二刷复测"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 135 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 136 | <code>        mastery_summary = f"{subject} 需要先补齐核心知识点，再进入系统刷题与错题二刷。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 137 | <code>        recommended_path = ["回到基础知识点课件", "开启低难度自适应卷", "同步家长端学习提醒"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 140 | <code>        "subject": subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 141 | <code>        "gradeBand": input_data.get("gradeBand") or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 142 | <code>        "baselineScore": baseline,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 143 | <code>        "confidenceLevel": confidence_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 144 | <code>        "homeworkCompletion": homework_completion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 145 | <code>        "mistakeRecovery": mistake_recovery,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 146 | <code>        "weakPoints": weak_points,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 147 | <code>        "currentLevel": current_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 148 | <code>        "confidenceScore": confidence_score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 149 | <code>        "masterySummary": mastery_summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 150 | <code>        "recommendedPath": recommended_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 151 | <code>        "lastScore": confidence_score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 152 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>def _serialize_user(user: EduUser &#124; None) -&gt; dict[str, Any] &#124; None:</code> | 定义 Python 函数 `_serialize_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 156 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 157 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 158 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 159 | <code>        "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 160 | <code>        "role": user.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 161 | <code>        "fullName": user.full_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 162 | <code>        "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 163 | <code>        "phone": user.phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 164 | <code>        "vipLevel": user.vip_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 165 | <code>        "grade": user.grade,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 166 | <code>        "schoolName": user.school_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 167 | <code>        "className": user.class_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 168 | <code>        "targetExam": user.target_exam,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 169 | <code>        "learningPreference": user.learning_preference,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 170 | <code>        "favoriteSubjects": user.favorite_subjects or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 171 | <code>        "weakSubjects": user.weak_subjects or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 172 | <code>        "goalSummary": user.goal_summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 173 | <code>        "parentName": user.parent_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 174 | <code>        "parentPhone": user.parent_phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 175 | <code>        "parentNoticeOptIn": user.parent_notice_opt_in,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 176 | <code>        "agreementAccepted": user.agreement_accepted,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 177 | <code>        "teacherTitle": user.teacher_title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 178 | <code>        "managedSubjects": user.managed_subjects or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 179 | <code>        "managedGrades": user.managed_grades or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 180 | <code>        "createdAt": _to_iso(user.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 181 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>async def ensure_admin_account(db: AsyncSession) -&gt; EduUser &#124; None:</code> | 定义 Python 函数 `ensure_admin_account`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 185 | <code>    if not settings.EDU_SEED_ADMIN:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 186 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>    email = _normalize_email(settings.EDU_ADMIN_EMAIL or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 189 | <code>    password = (settings.EDU_ADMIN_PASSWORD or "").strip()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 190 | <code>    if not password:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 191 | <code>        password = "Admin@123456"</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>    if not email:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 194 | <code>        print("⚠️ 教学管理员未创建：请配置 EDU_ADMIN_EMAIL。")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 195 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>    stmt = select(EduUser).where(EduUser.email == email).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 198 | <code>    result = await db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 199 | <code>    existing = result.scalar_one_or_none()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 200 | <code>    if existing:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 201 | <code>        return existing</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    phone = settings.EDU_ADMIN_PHONE or "13800000000"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 204 | <code>    admin = EduUser(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 205 | <code>        full_name="系统管理员",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 206 | <code>        email=email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 207 | <code>        password_hash=hash_password(password),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 208 | <code>        phone=phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 209 | <code>        role="admin",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 210 | <code>        vip_level="至尊会员",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 211 | <code>        grade="全学段",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 212 | <code>        school_name=settings.EDU_ADMIN_SCHOOL_NAME or "仿真人教学教室",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 213 | <code>        class_name="管理端",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 214 | <code>        target_exam="中高考",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 215 | <code>        learning_preference="管理后台",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 216 | <code>        favorite_subjects=["语文", "数学", "英语", "物理", "化学"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 217 | <code>        weak_subjects=[],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 218 | <code>        goal_summary="用于教学平台首发部署、演示、排障和教师端管理。",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 219 | <code>        parent_name="系统",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 220 | <code>        parent_phone=phone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 221 | <code>        parent_notice_opt_in=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 222 | <code>        agreement_accepted=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 223 | <code>        teacher_title="平台管理员",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 224 | <code>        managed_subjects=["语文", "数学", "英语", "物理", "化学"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 225 | <code>        managed_grades=["初中", "高中"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 226 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>    db.add(admin)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 228 | <code>    await db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 229 | <code>    await db.refresh(admin)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 230 | <code>    print(f"✅ 教学管理员已创建：{email}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 231 | <code>    return admin</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>def _serialize_diagnostic(item: EduDiagnostic) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_serialize_diagnostic`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 235 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 236 | <code>        "id": item.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 237 | <code>        "userId": item.user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 238 | <code>        "subject": item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 239 | <code>        "gradeBand": item.grade_band,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 240 | <code>        "baselineScore": item.baseline_score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 241 | <code>        "confidenceLevel": item.confidence_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 242 | <code>        "homeworkCompletion": item.homework_completion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 243 | <code>        "mistakeRecovery": item.mistake_recovery,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 244 | <code>        "weakPoints": item.weak_points or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 245 | <code>        "currentLevel": item.current_level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 246 | <code>        "confidenceScore": item.confidence_score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 247 | <code>        "masterySummary": item.mastery_summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 248 | <code>        "recommendedPath": item.recommended_path or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 249 | <code>        "lastScore": item.last_score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 250 | <code>        "createdAt": _to_iso(item.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 251 | <code>        "updatedAt": _to_iso(item.updated_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>def _serialize_assignment(item: EduPracticeAssignment) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_serialize_assignment`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 256 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 257 | <code>        "id": item.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 258 | <code>        "teacherUserId": item.teacher_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 259 | <code>        "studentUserId": item.student_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 260 | <code>        "title": item.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 261 | <code>        "subject": item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 262 | <code>        "notes": item.notes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 263 | <code>        "questionCount": item.question_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 264 | <code>        "source": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 265 | <code>            "dataset": item.source_dataset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 266 | <code>            "config": item.source_config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 267 | <code>            "split": item.source_split,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 268 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>        "questions": item.questions_json or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 270 | <code>        "createdAt": _to_iso(item.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>def _serialize_classroom_session(item: EduClassroomSession) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_serialize_classroom_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 275 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 276 | <code>        "id": item.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 277 | <code>        "studentUserId": item.student_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 278 | <code>        "teacherUserId": item.teacher_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 279 | <code>        "subject": item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 280 | <code>        "topic": item.topic,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 281 | <code>        "status": item.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 282 | <code>        "focusSummary": item.focus_summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 283 | <code>        "attendanceState": item.attendance_state,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 284 | <code>        "currentQuestionId": item.current_question_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 285 | <code>        "currentQuestion": item.current_question_json,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 286 | <code>        "usedQuestionIds": item.used_question_ids or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 287 | <code>        "transcript": item.transcript_json or [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 288 | <code>        "attemptedCount": item.attempted_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 289 | <code>        "correctCount": item.correct_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 290 | <code>        "createdAt": _to_iso(item.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 291 | <code>        "updatedAt": _to_iso(item.updated_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 292 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>def _sort_by_date_desc(items: list[dict[str, Any]], field: str) -&gt; list[dict[str, Any]]:</code> | 定义 Python 函数 `_sort_by_date_desc`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 296 | <code>    return sorted(items, key=lambda item: item.get(field) or "", reverse=True)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>def _build_breakdown(items: list[Any], selector) -&gt; dict[str, int]:</code> | 定义 Python 函数 `_build_breakdown`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 300 | <code>    result: dict[str, int] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 301 | <code>    for item in items:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 302 | <code>        key = selector(item) or "未分类"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 303 | <code>        result[key] = result.get(key, 0) + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 304 | <code>    return result</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>def _sum_by(items: list[Any], selector) -&gt; int:</code> | 定义 Python 函数 `_sum_by`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 308 | <code>    return sum(int(selector(item) or 0) for item in items)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>def _build_focus_summary(student: EduUser, diagnostics: list[EduDiagnostic], subject: str) -&gt; str:</code> | 定义 Python 函数 `_build_focus_summary`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 312 | <code>    diagnostic = next((item for item in diagnostics if item.subject == subject), None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 313 | <code>    if diagnostic:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 314 | <code>        weak_points = "、".join(diagnostic.weak_points or []) or "基础稳定性"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 315 | <code>        return f"{subject}当前层级：{diagnostic.current_level}；重点补弱：{weak_points}。"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 316 | <code>    if subject in (student.weak_subjects or []):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 317 | <code>        return f"{subject}已在学生档案中标记为薄弱学科，本节课以基础巩固和课堂追问为主。"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 318 | <code>    return f"{subject}当前暂无专属画像，本节课先通过真题互动建立课堂节奏与初步判断。"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>def _build_entry(role: str, text: str, extra: dict[str, Any] &#124; None = None) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `_build_entry`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 322 | <code>    payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 323 | <code>        "role": role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 324 | <code>        "text": text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 325 | <code>        "createdAt": _now_utc().isoformat(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 326 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>    if extra:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 328 | <code>        payload.update(extra)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 329 | <code>    return payload</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>def _build_question_prompt(question: dict[str, Any]) -&gt; str:</code> | 定义 Python 函数 `_build_question_prompt`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 333 | <code>    return f"请先完成这道{question.get('subject') or '综合'}真题。题干：{question.get('stem') or ''}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>def _build_correct_feedback(question: dict[str, Any], focus_summary: str) -&gt; str:</code> | 定义 Python 函数 `_build_correct_feedback`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 337 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 338 | <code>        f"回答正确。标准答案是 {build_choice_label(int(question.get('answerIndex', 0)))}："</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 339 | <code>        f"{question.get('answerText') or ''}。{focus_summary} 这一步说明你已经抓住了当前题目的核心判断点。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 340 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>def _build_wrong_feedback(question: dict[str, Any], selected_choice_index: int, focus_summary: str) -&gt; str:</code> | 定义 Python 函数 `_build_wrong_feedback`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 344 | <code>    choices = question.get("choices") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 345 | <code>    selected_text = choices[selected_choice_index] if 0 &lt;= selected_choice_index &lt; len(choices) else "未命名选项"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 346 | <code>    return (</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 347 | <code>        f"这题先别急着往下走。你选了 {build_choice_label(selected_choice_index)}：{selected_text}，"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 348 | <code>        f"但正确答案不是这一项。{focus_summary} 请重新看题干中的限制条件，再做一次判断。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 349 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>def _build_student_utterance(</code> | 定义 Python 函数 `_build_student_utterance`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 353 | <code>    question: dict[str, Any],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 354 | <code>    selected_choice_index: int &#124; None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 355 | <code>    free_text: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 356 | <code>) -&gt; str:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 357 | <code>    parts: list[str] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 358 | <code>    choices = question.get("choices") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 359 | <code>    if selected_choice_index is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 360 | <code>        label = build_choice_label(selected_choice_index)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 361 | <code>        value = choices[selected_choice_index] if 0 &lt;= selected_choice_index &lt; len(choices) else "未命名选项"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 362 | <code>        parts.append(f"我选择 {label}：{value}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 363 | <code>    if free_text.strip():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 364 | <code>        parts.append(f"我想补充：{free_text.strip()}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 365 | <code>    return "；".join(parts)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>class EduPlatformService:</code> | 定义 Python 类 `EduPlatformService`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 369 | <code>    def __init__(self, db: AsyncSession):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 370 | <code>        self.db = db</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>    async def get_user_by_email(self, email: str) -&gt; EduUser &#124; None:</code> | 定义 Python 函数 `get_user_by_email`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 373 | <code>        stmt = select(EduUser).where(EduUser.email == _normalize_email(email)).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 374 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 375 | <code>        return result.scalar_one_or_none()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>    async def get_user_by_id(self, user_id: int) -&gt; EduUser &#124; None:</code> | 定义 Python 函数 `get_user_by_id`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 378 | <code>        stmt = select(EduUser).where(EduUser.id == int(user_id)).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 379 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 380 | <code>        return result.scalar_one_or_none()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>    async def list_users_by_role(self, role: str) -&gt; list[EduUser]:</code> | 定义 Python 函数 `list_users_by_role`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 383 | <code>        stmt = select(EduUser).where(EduUser.role == role).order_by(EduUser.created_at.asc())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 384 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 385 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>    async def create_user(self, payload: dict[str, Any]) -&gt; EduUser:</code> | 定义 Python 函数 `create_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 388 | <code>        user = EduUser(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 389 | <code>            full_name=payload["fullName"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 390 | <code>            email=_normalize_email(payload["email"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 391 | <code>            password_hash=payload["passwordHash"],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 392 | <code>            phone=payload["phone"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 393 | <code>            role=payload.get("role", "student"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 394 | <code>            vip_level=payload.get("vipLevel", "基础会员"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 395 | <code>            grade=payload["grade"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 396 | <code>            school_name=payload["schoolName"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 397 | <code>            class_name=payload["className"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 398 | <code>            target_exam=payload["targetExam"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 399 | <code>            learning_preference=payload["learningPreference"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 400 | <code>            favorite_subjects=_normalize_list(payload.get("favoriteSubjects")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 401 | <code>            weak_subjects=_normalize_list(payload.get("weakSubjects")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 402 | <code>            goal_summary=payload.get("goalSummary", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 403 | <code>            parent_name=payload["parentName"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 404 | <code>            parent_phone=payload["parentPhone"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 405 | <code>            parent_notice_opt_in=bool(payload.get("parentNoticeOptIn", True)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 406 | <code>            agreement_accepted=bool(payload.get("agreementAccepted", False)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 407 | <code>            teacher_title=payload.get("teacherTitle", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 408 | <code>            managed_subjects=_normalize_list(payload.get("managedSubjects")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 409 | <code>            managed_grades=_normalize_list(payload.get("managedGrades")),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 410 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>        self.db.add(user)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 412 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 413 | <code>        await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 414 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>    async def create_session(self, user_id: int) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `create_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 417 | <code>        expires_at = _now_utc() + timedelta(days=max(int(settings.EDU_SESSION_TTL_DAYS or 14), 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 418 | <code>        session = EduSession(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 419 | <code>            user_id=int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 420 | <code>            token=create_session_token(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 421 | <code>            expires_at=expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 422 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>        self.db.add(session)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 424 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 425 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 426 | <code>            "token": session.token,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 427 | <code>            "expiresAt": expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 428 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>    async def get_session_user(self, token: str &#124; None) -&gt; dict[str, Any] &#124; None:</code> | 定义 Python 函数 `get_session_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 431 | <code>        if not token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 432 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 433 | <code>        stmt = select(EduSession).where(EduSession.token == token).limit(1)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 434 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 435 | <code>        session = result.scalar_one_or_none()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 436 | <code>        if not session:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 437 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 438 | <code>        expires_at = session.expires_at</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 439 | <code>        if expires_at.tzinfo is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 440 | <code>            expires_at = expires_at.replace(tzinfo=timezone.utc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 441 | <code>        if expires_at &lt;= _now_utc():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 442 | <code>            await self.db.delete(session)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 443 | <code>            await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 444 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 445 | <code>        user = await self.get_user_by_id(session.user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 446 | <code>        if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 447 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 448 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 449 | <code>            "token": session.token,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 450 | <code>            "expiresAt": expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 451 | <code>            "user": user,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 452 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 454 | <code>    async def delete_session(self, token: str &#124; None) -&gt; None:</code> | 定义 Python 函数 `delete_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 455 | <code>        if not token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 456 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 457 | <code>        await self.db.execute(delete(EduSession).where(EduSession.token == token))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 458 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>    async def list_sessions_by_user(self, user_id: int) -&gt; list[EduSession]:</code> | 定义 Python 函数 `list_sessions_by_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 461 | <code>        stmt = select(EduSession).where(EduSession.user_id == int(user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 462 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 463 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>    async def upsert_diagnostic(self, user_id: int, result: dict[str, Any]) -&gt; EduDiagnostic:</code> | 定义 Python 函数 `upsert_diagnostic`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 466 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 467 | <code>            select(EduDiagnostic)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 468 | <code>            .where(EduDiagnostic.user_id == int(user_id), EduDiagnostic.subject == result["subject"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 469 | <code>            .limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 470 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>        existing = (await self.db.execute(stmt)).scalar_one_or_none()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 472 | <code>        if existing:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 473 | <code>            existing.grade_band = result["gradeBand"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 474 | <code>            existing.baseline_score = result["baselineScore"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 475 | <code>            existing.confidence_level = result["confidenceLevel"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 476 | <code>            existing.homework_completion = result["homeworkCompletion"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 477 | <code>            existing.mistake_recovery = result["mistakeRecovery"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 478 | <code>            existing.weak_points = result["weakPoints"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 479 | <code>            existing.current_level = result["currentLevel"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 480 | <code>            existing.confidence_score = result["confidenceScore"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 481 | <code>            existing.mastery_summary = result["masterySummary"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 482 | <code>            existing.recommended_path = result["recommendedPath"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 483 | <code>            existing.last_score = result["lastScore"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 484 | <code>            existing.updated_at = _now_utc()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 485 | <code>            target = existing</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 486 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 487 | <code>            target = EduDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 488 | <code>                user_id=int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 489 | <code>                subject=result["subject"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 490 | <code>                grade_band=result["gradeBand"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 491 | <code>                baseline_score=result["baselineScore"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 492 | <code>                confidence_level=result["confidenceLevel"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 493 | <code>                homework_completion=result["homeworkCompletion"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 494 | <code>                mistake_recovery=result["mistakeRecovery"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 495 | <code>                weak_points=result["weakPoints"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 496 | <code>                current_level=result["currentLevel"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 497 | <code>                confidence_score=result["confidenceScore"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 498 | <code>                mastery_summary=result["masterySummary"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 499 | <code>                recommended_path=result["recommendedPath"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 500 | <code>                last_score=result["lastScore"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 501 | <code>                updated_at=_now_utc(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 502 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>            self.db.add(target)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 504 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 505 | <code>        await self.db.refresh(target)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 506 | <code>        return target</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>    async def get_diagnostics_by_user(self, user_id: int) -&gt; list[EduDiagnostic]:</code> | 定义 Python 函数 `get_diagnostics_by_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 509 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 510 | <code>            select(EduDiagnostic)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 511 | <code>            .where(EduDiagnostic.user_id == int(user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 512 | <code>            .order_by(desc(EduDiagnostic.updated_at))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 513 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 515 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>    async def create_practice_assignment(self, payload: dict[str, Any]) -&gt; EduPracticeAssignment:</code> | 定义 Python 函数 `create_practice_assignment`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 518 | <code>        assignment = EduPracticeAssignment(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 519 | <code>            teacher_user_id=int(payload["teacherUserId"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 520 | <code>            student_user_id=int(payload["studentUserId"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 521 | <code>            title=payload["title"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 522 | <code>            subject=payload["subject"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 523 | <code>            notes=payload.get("notes", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 524 | <code>            source_dataset=payload["sourceDataset"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 525 | <code>            source_config=payload["sourceConfig"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 526 | <code>            source_split=payload["sourceSplit"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 527 | <code>            question_count=int(payload.get("questionCount", 0)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 528 | <code>            questions_json=payload.get("questions", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 529 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>        self.db.add(assignment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 531 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 532 | <code>        await self.db.refresh(assignment)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 533 | <code>        return assignment</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>    async def list_assignments_by_teacher(self, teacher_user_id: int) -&gt; list[EduPracticeAssignment]:</code> | 定义 Python 函数 `list_assignments_by_teacher`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 536 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 537 | <code>            select(EduPracticeAssignment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 538 | <code>            .where(EduPracticeAssignment.teacher_user_id == int(teacher_user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 539 | <code>            .order_by(desc(EduPracticeAssignment.created_at))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 540 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 542 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 544 | <code>    async def list_assignments_for_student(self, student_user_id: int) -&gt; list[EduPracticeAssignment]:</code> | 定义 Python 函数 `list_assignments_for_student`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 545 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 546 | <code>            select(EduPracticeAssignment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 547 | <code>            .where(EduPracticeAssignment.student_user_id == int(student_user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 548 | <code>            .order_by(desc(EduPracticeAssignment.created_at))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 549 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 551 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 553 | <code>    async def create_classroom_session(self, payload: dict[str, Any]) -&gt; EduClassroomSession:</code> | 定义 Python 函数 `create_classroom_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 554 | <code>        session = EduClassroomSession(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 555 | <code>            student_user_id=int(payload["studentUserId"]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 556 | <code>            teacher_user_id=payload.get("teacherUserId"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 557 | <code>            subject=payload["subject"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 558 | <code>            topic=payload.get("topic", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 559 | <code>            status=payload.get("status", "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 560 | <code>            focus_summary=payload.get("focusSummary", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 561 | <code>            attendance_state=payload.get("attendanceState", "pending"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 562 | <code>            current_question_id=payload.get("currentQuestionId", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 563 | <code>            current_question_json=payload.get("currentQuestion"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 564 | <code>            used_question_ids=payload.get("usedQuestionIds", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 565 | <code>            transcript_json=payload.get("transcript", []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 566 | <code>            attempted_count=int(payload.get("attemptedCount", 0)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 567 | <code>            correct_count=int(payload.get("correctCount", 0)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 568 | <code>            updated_at=_now_utc(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 569 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>        self.db.add(session)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 571 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 572 | <code>        await self.db.refresh(session)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 573 | <code>        return session</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>    async def get_classroom_session_by_id(self, session_id: int) -&gt; EduClassroomSession &#124; None:</code> | 定义 Python 函数 `get_classroom_session_by_id`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 576 | <code>        stmt = select(EduClassroomSession).where(EduClassroomSession.id == int(session_id)).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 577 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 578 | <code>        return result.scalar_one_or_none()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>    async def update_classroom_session(</code> | 定义 Python 函数 `update_classroom_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 581 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 582 | <code>        session_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 583 | <code>        updates: dict[str, Any],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 584 | <code>    ) -&gt; EduClassroomSession &#124; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 585 | <code>        session = await self.get_classroom_session_by_id(session_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 586 | <code>        if not session:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 587 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 588 | <code>        mapping = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 589 | <code>            "teacherUserId": "teacher_user_id",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 590 | <code>            "subject": "subject",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 591 | <code>            "topic": "topic",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 592 | <code>            "status": "status",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 593 | <code>            "focusSummary": "focus_summary",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 594 | <code>            "attendanceState": "attendance_state",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 595 | <code>            "currentQuestionId": "current_question_id",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 596 | <code>            "currentQuestion": "current_question_json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 597 | <code>            "usedQuestionIds": "used_question_ids",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 598 | <code>            "transcript": "transcript_json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 599 | <code>            "attemptedCount": "attempted_count",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 600 | <code>            "correctCount": "correct_count",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 601 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>        for key, attr in mapping.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 603 | <code>            if key in updates:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 604 | <code>                setattr(session, attr, updates[key])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 605 | <code>        session.updated_at = _now_utc()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 606 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 607 | <code>        await self.db.refresh(session)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 608 | <code>        return session</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 610 | <code>    async def list_classroom_sessions_by_student(self, student_user_id: int) -&gt; list[EduClassroomSession]:</code> | 定义 Python 函数 `list_classroom_sessions_by_student`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 611 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 612 | <code>            select(EduClassroomSession)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 613 | <code>            .where(EduClassroomSession.student_user_id == int(student_user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 614 | <code>            .order_by(desc(EduClassroomSession.updated_at))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 615 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 617 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>    async def list_recent_classroom_sessions(self, limit: int = 20) -&gt; list[EduClassroomSession]:</code> | 定义 Python 函数 `list_recent_classroom_sessions`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 620 | <code>        stmt = select(EduClassroomSession).order_by(desc(EduClassroomSession.updated_at)).limit(int(limit))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 621 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 622 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>    async def create_simulated_classroom_session(</code> | 定义 Python 函数 `create_simulated_classroom_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 625 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 626 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 627 | <code>        student: EduUser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 628 | <code>        diagnostics: list[EduDiagnostic],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 629 | <code>        subject: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 630 | <code>        topic: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 631 | <code>        teacher_user_id: int &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 632 | <code>    ) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 633 | <code>        question = await pick_question(subject, [])</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 634 | <code>        focus_summary = _build_focus_summary(student, diagnostics, subject)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 635 | <code>        transcript = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 636 | <code>            _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 637 | <code>                "system",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 638 | <code>                f"人脸识别完成，已完成 {student.full_name} 同学课堂报到，签到状态已同步。",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 639 | <code>                {"type": "attendance"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 640 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>            _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 642 | <code>                "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 643 | <code>                f"{student.full_name} 同学，欢迎进入 {subject} 仿真课堂。{focus_summary}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 644 | <code>                {"type": "greeting"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 645 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>        if topic:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 648 | <code>            transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 649 | <code>                _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 650 | <code>                    "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 651 | <code>                    f"本节课堂主题：{topic}。我会边讲边问，按你的作答情况即时调整。",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 652 | <code>                    {"type": "topic"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 653 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>        if question:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 656 | <code>            transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 657 | <code>                _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 658 | <code>                    "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 659 | <code>                    _build_question_prompt(question),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 660 | <code>                    {"type": "question", "questionId": question["sourceId"]},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 661 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 664 | <code>            "studentUserId": student.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 665 | <code>            "teacherUserId": teacher_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 666 | <code>            "subject": subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 667 | <code>            "topic": topic or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 668 | <code>            "status": "active" if question else "completed",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 669 | <code>            "focusSummary": focus_summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 670 | <code>            "attendanceState": "reported",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 671 | <code>            "currentQuestionId": question["sourceId"] if question else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 672 | <code>            "currentQuestion": question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 673 | <code>            "usedQuestionIds": [question["sourceId"]] if question else [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 674 | <code>            "transcript": transcript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 675 | <code>            "attemptedCount": 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 676 | <code>            "correctCount": 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 677 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>    async def handle_classroom_turn(</code> | 定义 Python 函数 `handle_classroom_turn`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 680 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 681 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 682 | <code>        session: EduClassroomSession,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 683 | <code>        student: EduUser,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 684 | <code>        selected_choice_index: int &#124; None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 685 | <code>        free_text: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 686 | <code>    ) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 687 | <code>        data = _serialize_classroom_session(session)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 688 | <code>        transcript = list(data.get("transcript") or [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 689 | <code>        current_question = data.get("currentQuestion")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 690 | <code>        trimmed_text = (free_text or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 691 | <code>        has_choice = selected_choice_index is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>        if data.get("status") != "active" or not current_question:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 694 | <code>            transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 695 | <code>                _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 696 | <code>                    "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 697 | <code>                    "这节仿真课堂已经结束了。可以重新开启一节新的课堂继续练习。",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 698 | <code>                    {"type": "session-ended"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 699 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 701 | <code>            data["transcript"] = transcript</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 702 | <code>            return data</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>        if not has_choice and not trimmed_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 705 | <code>            transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 706 | <code>                _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 707 | <code>                    "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 708 | <code>                    "请先回答当前题目，或者直接把你的疑问发给我。",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 709 | <code>                    {"type": "nudge"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 710 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>            data["transcript"] = transcript</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 713 | <code>            return data</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>        transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 716 | <code>            _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 717 | <code>                "student",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 718 | <code>                _build_student_utterance(current_question, selected_choice_index, trimmed_text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 719 | <code>                {"type": "student-turn"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 720 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 723 | <code>        if trimmed_text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 724 | <code>            transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 725 | <code>                _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 726 | <code>                    "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 727 | <code>                    (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 728 | <code>                        f"收到你的追问。结合这道题和你当前的课堂状态，我先提醒你：{data.get('focusSummary') or ''} "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 729 | <code>                        "先把题干中的关键词圈出来，再逐项排除，最后再确认答案。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 730 | <code>                    ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>                    {"type": "hint"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 732 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>        if has_choice:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 736 | <code>            attempted_count = int(data.get("attemptedCount") or 0) + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 737 | <code>            data["attemptedCount"] = attempted_count</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 738 | <code>            if int(selected_choice_index) == int(current_question.get("answerIndex", -1)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 739 | <code>                correct_count = int(data.get("correctCount") or 0) + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 740 | <code>                data["correctCount"] = correct_count</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 741 | <code>                transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 742 | <code>                    _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 743 | <code>                        "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 744 | <code>                        _build_correct_feedback(current_question, data.get("focusSummary") or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 745 | <code>                        {"type": "feedback-correct"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 746 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 747 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>                next_question = await pick_question(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 749 | <code>                    data.get("subject") or "综合",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 750 | <code>                    [*(data.get("usedQuestionIds") or []), current_question.get("sourceId")],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 751 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>                if next_question:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 753 | <code>                    data["currentQuestionId"] = next_question["sourceId"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 754 | <code>                    data["currentQuestion"] = next_question</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 755 | <code>                    data["usedQuestionIds"] = [*(data.get("usedQuestionIds") or []), next_question["sourceId"]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 756 | <code>                    transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 757 | <code>                        _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 758 | <code>                            "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 759 | <code>                            f"继续下一题。{_build_question_prompt(next_question)}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 760 | <code>                            {"type": "question", "questionId": next_question["sourceId"]},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 761 | <code>                        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 764 | <code>                    data["currentQuestionId"] = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 765 | <code>                    data["currentQuestion"] = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 766 | <code>                    data["status"] = "completed"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 767 | <code>                    transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 768 | <code>                        _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 769 | <code>                            "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 770 | <code>                            (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 771 | <code>                                f"本节 {data.get('subject') or '综合'} 仿真课堂先到这里。你一共作答 "</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 772 | <code>                                f"{data.get('attemptedCount')} 次，答对 {data.get('correctCount')} 题，"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 773 | <code>                                "建议回到学情画像和错题复盘继续巩固。"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 774 | <code>                            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>                            {"type": "summary"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 776 | <code>                        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 779 | <code>                transcript.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 780 | <code>                    _build_entry(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 781 | <code>                        "teacher",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 782 | <code>                        _build_wrong_feedback(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 783 | <code>                            current_question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 784 | <code>                            int(selected_choice_index),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 785 | <code>                            data.get("focusSummary") or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 786 | <code>                        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>                        {"type": "feedback-wrong"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 788 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 791 | <code>        data["transcript"] = transcript</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 792 | <code>        return data</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>    async def build_student_overview(self, student: EduUser) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `build_student_overview`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 795 | <code>        diagnostics = await self.get_diagnostics_by_user(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 796 | <code>        assignments = await self.list_assignments_for_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 797 | <code>        classroom_sessions = await self.list_classroom_sessions_by_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>        serialized_diagnostics = [_serialize_diagnostic(item) for item in diagnostics]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 800 | <code>        serialized_assignments = _sort_by_date_desc(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 801 | <code>            [_serialize_assignment(item) for item in assignments],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 802 | <code>            "createdAt",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 803 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>        serialized_classrooms = _sort_by_date_desc(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 805 | <code>            [_serialize_classroom_session(item) for item in classroom_sessions],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 806 | <code>            "updatedAt",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 807 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 809 | <code>        active_classroom = next(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 810 | <code>            (item for item in serialized_classrooms if item.get("status") == "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 811 | <code>            serialized_classrooms[0] if serialized_classrooms else None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 812 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>        personalized_plan = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 815 | <code>        if diagnostics:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 816 | <code>            weakest = sorted(diagnostics, key=lambda item: item.confidence_score)[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 817 | <code>            personalized_plan = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 818 | <code>                f"优先补强 {weakest.subject}，当前层级为 {weakest.current_level}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 819 | <code>                *[str(item) for item in weakest.recommended_path[:3]],</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 820 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 821 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 822 | <code>            personalized_plan = ["先完成至少 1 份学情画像", "进入仿真课堂做首轮真题互动", "再进入教师派发练习巩固"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 824 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 825 | <code>            "student": _serialize_user(student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 826 | <code>            "metrics": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 827 | <code>                "diagnosticsCount": len(diagnostics),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 828 | <code>                "assignmentCount": len(assignments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 829 | <code>                "classroomCount": len(classroom_sessions),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 830 | <code>                "activeClassroomCount": sum(1 for item in classroom_sessions if item.status == "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 831 | <code>                "completedClassroomCount": sum(1 for item in classroom_sessions if item.status == "completed"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 832 | <code>                "attemptedCount": _sum_by(classroom_sessions, lambda item: item.attempted_count),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 833 | <code>                "correctCount": _sum_by(classroom_sessions, lambda item: item.correct_count),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 834 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>            "learning": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 836 | <code>                "diagnosticSnapshots": [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 837 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 838 | <code>                        "subject": item["subject"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 839 | <code>                        "currentLevel": item["currentLevel"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 840 | <code>                        "confidenceScore": item["confidenceScore"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 841 | <code>                        "weakPoints": item["weakPoints"][:3],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 842 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 843 | <code>                    for item in serialized_diagnostics[:6]</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 844 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>                "diagnostics": serialized_diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 846 | <code>                "personalizedPlan": personalized_plan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 847 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>            "assignments": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 849 | <code>                "bySubject": _build_breakdown(assignments, lambda item: item.subject),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 850 | <code>                "recent": serialized_assignments[:8],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 851 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>            "classrooms": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 853 | <code>                "bySubject": _build_breakdown(classroom_sessions, lambda item: item.subject),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 854 | <code>                "activeSession": active_classroom,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 855 | <code>                "recent": serialized_classrooms[:8],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 856 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 859 | <code>    async def build_teacher_student_cards(self) -&gt; list[dict[str, Any]]:</code> | 定义 Python 函数 `build_teacher_student_cards`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 860 | <code>        students = await self.list_users_by_role("student")</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 861 | <code>        cards: list[dict[str, Any]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 862 | <code>        for student in students:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 863 | <code>            diagnostics = await self.get_diagnostics_by_user(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 864 | <code>            assignments = await self.list_assignments_for_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 865 | <code>            cards.append(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 866 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 867 | <code>                    **(_serialize_user(student) or {}),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 868 | <code>                    "diagnosticCount": len(diagnostics),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 869 | <code>                    "assignmentsCount": len(assignments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 870 | <code>                    "topWeakness": (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 871 | <code>                        sorted(diagnostics, key=lambda item: item.confidence_score)[0].subject</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 872 | <code>                        if diagnostics</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 873 | <code>                        else ((student.weak_subjects or ["待诊断"])[0])</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 874 | <code>                    ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 875 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 876 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 877 | <code>        cards.sort(key=lambda item: item.get("assignmentsCount", 0), reverse=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 878 | <code>        return cards</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>    async def build_teacher_overview(self, teacher: EduUser) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `build_teacher_overview`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 881 | <code>        students = await self.list_users_by_role("student")</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 882 | <code>        teacher_assignments = await self.list_assignments_by_teacher(teacher.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 883 | <code>        classroom_sessions = await self.list_recent_classroom_sessions(30)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 884 | <code>        question_bank = await get_question_bank()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 885 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 886 | <code>        serialized_assignments = [_serialize_assignment(item) for item in teacher_assignments]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 887 | <code>        serialized_classrooms = [_serialize_classroom_session(item) for item in classroom_sessions]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 888 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 889 | <code>            "teacher": _serialize_user(teacher),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 890 | <code>            "metrics": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 891 | <code>                "studentCount": len(students),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 892 | <code>                "assignmentCount": len(teacher_assignments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 893 | <code>                "classroomCount": len(classroom_sessions),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 894 | <code>                "activeClassroomCount": sum(1 for item in classroom_sessions if item.status == "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 895 | <code>                "completedClassroomCount": sum(1 for item in classroom_sessions if item.status == "completed"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 896 | <code>                "questionBankTotal": int((question_bank.get("stats") or {}).get("total") or 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 897 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>            "students": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 899 | <code>                "byGrade": _build_breakdown(students, lambda item: item.grade),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 900 | <code>                "weakSubjectTags": _build_breakdown(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 901 | <code>                    [subject for student in students for subject in (student.weak_subjects or [])],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 902 | <code>                    lambda item: item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 903 | <code>                ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 904 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>            "questionBank": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 906 | <code>                "source": question_bank.get("source"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 907 | <code>                "warning": question_bank.get("warning") or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 908 | <code>                "stats": question_bank.get("stats") or {"total": 0, "subjectBreakdown": {}},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 909 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>            "recentAssignments": _sort_by_date_desc(serialized_assignments, "createdAt")[:10],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 911 | <code>            "recentClassrooms": _sort_by_date_desc(serialized_classrooms, "updatedAt")[:10],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 912 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>    async def build_teacher_student_detail(self, student_id: int) -&gt; dict[str, Any] &#124; None:</code> | 定义 Python 函数 `build_teacher_student_detail`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 915 | <code>        student = await self.get_user_by_id(student_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 916 | <code>        if not student or student.role != "student":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 917 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 918 | <code>        diagnostics = await self.get_diagnostics_by_user(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 919 | <code>        assignments = await self.list_assignments_for_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 920 | <code>        classrooms = await self.list_classroom_sessions_by_student(student.id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 922 | <code>        recent_activity = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 923 | <code>            *[</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 924 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 925 | <code>                    "type": "assignment",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 926 | <code>                    "label": item.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 927 | <code>                    "subject": item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 928 | <code>                    "createdAt": _to_iso(item.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 929 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>                for item in assignments</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 931 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>            *[</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 933 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 934 | <code>                    "type": "classroom",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 935 | <code>                    "label": item.topic or f"{item.subject} 仿真课堂",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 936 | <code>                    "subject": item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 937 | <code>                    "status": item.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 938 | <code>                    "createdAt": _to_iso(item.updated_at or item.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 939 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 940 | <code>                for item in classrooms</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 941 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 942 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>        recent_activity = _sort_by_date_desc(recent_activity, "createdAt")[:12]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 946 | <code>            "student": _serialize_user(student),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 947 | <code>            "metrics": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 948 | <code>                "diagnosticsCount": len(diagnostics),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 949 | <code>                "assignmentCount": len(assignments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 950 | <code>                "classroomCount": len(classrooms),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 951 | <code>                "activeClassroomCount": sum(1 for item in classrooms if item.status == "active"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 952 | <code>                "attemptedCount": _sum_by(classrooms, lambda item: item.attempted_count),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 953 | <code>                "correctCount": _sum_by(classrooms, lambda item: item.correct_count),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 954 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 955 | <code>            "diagnostics": [_serialize_diagnostic(item) for item in diagnostics],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 956 | <code>            "assignments": [_serialize_assignment(item) for item in assignments],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 957 | <code>            "classrooms": [_serialize_classroom_session(item) for item in classrooms],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 958 | <code>            "recentActivity": recent_activity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 959 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>    async def search_question_bank(self, *, subject: str, query: str, limit: int) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `search_question_bank`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 962 | <code>        from backend.services.edu_question_bank_service import search_question_bank</code> | 导入 Python 依赖 `backend.services.edu_question_bank_service`，供本模块调用其类型、函数或常量。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>        return await search_question_bank(subject=subject, query=query, limit=limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>    async def get_question_bank_source(self) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `get_question_bank_source`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 967 | <code>        return get_question_bank_source()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 968 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 969 | <code>    async def get_questions_by_source_ids(self, source_ids: list[str]) -&gt; list[dict[str, Any]]:</code> | 定义 Python 函数 `get_questions_by_source_ids`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 970 | <code>        return await get_questions_by_source_ids(source_ids)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 973 | <code>serialize_user = _serialize_user</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 974 | <code>serialize_diagnostic = _serialize_diagnostic</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 975 | <code>serialize_assignment = _serialize_assignment</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 976 | <code>serialize_classroom_session = _serialize_classroom_session</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
