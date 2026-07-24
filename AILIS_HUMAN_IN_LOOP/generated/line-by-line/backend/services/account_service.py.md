# backend/services/account_service.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端服务层：实现模型、记忆、聊天或业务服务逻辑。
- 文件类型：`source-code`
- 原始行数：423
- SHA-256：`6b728a6600669e2084d6a785f4e094d670b327879887489c5ed3a4a65c5c7347`
- 可运行副本：[打开源文件](../../../../source/backend/services/account_service.py)
- 依赖：`base64`、`hashlib`、`json`、`os`、`secrets`、`datetime`、`sqlalchemy`、`sqlalchemy.ext.asyncio`、`backend.core.config`、`backend.models.db_models`
- 主要符号：`now_utc`、`normalize_email`、`ensure_aware_utc`、`to_iso`、`current_period_key`、`hash_password`、`verify_password`、`create_session_token`、`has_active_membership`、`serialize_user`、`serialize_payment`、`AccountService`、`__init__`、`get_user_by_email`、`get_user_by_id`、`list_users`、`create_user`、`create_session`、`get_session_user`、`delete_session`、`list_payments`、`set_membership`、`add_admin_audit_log`、`count_period_usage`、`record_api_usage`、`set_stripe_customer`、`record_checkout_session`、`activate_membership_from_checkout`、`update_subscription_membership`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import base64</code> | 导入 Python 依赖 `base64`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import hashlib</code> | 导入 Python 依赖 `hashlib`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import secrets</code> | 导入 Python 依赖 `secrets`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from datetime import datetime, timedelta, timezone</code> | 导入 Python 依赖 `datetime`，供本模块调用其类型、函数或常量。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>from sqlalchemy import delete, func, select</code> | 导入 Python 依赖 `sqlalchemy`，供本模块调用其类型、函数或常量。 |
| 9 | <code>from sqlalchemy.ext.asyncio import AsyncSession</code> | 导入 Python 依赖 `sqlalchemy.ext.asyncio`，供本模块调用其类型、函数或常量。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 12 | <code>from backend.models.db_models import AppAdminAuditLog, AppApiUsage, AppPayment, AppSession, AppUser</code> | 导入 Python 依赖 `backend.models.db_models`，供本模块调用其类型、函数或常量。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>def now_utc() -&gt; datetime:</code> | 定义 Python 函数 `now_utc`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 18 | <code>    return datetime.now(timezone.utc)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>def normalize_email(value: str) -&gt; str:</code> | 定义 Python 函数 `normalize_email`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 22 | <code>    return (value or "").strip().lower()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>def ensure_aware_utc(value: datetime &#124; None) -&gt; datetime &#124; None:</code> | 定义 Python 函数 `ensure_aware_utc`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 26 | <code>    if not value:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 27 | <code>        return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 28 | <code>    if value.tzinfo is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 29 | <code>        return value.replace(tzinfo=timezone.utc)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 30 | <code>    return value.astimezone(timezone.utc)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>def to_iso(value: datetime &#124; None) -&gt; str &#124; None:</code> | 定义 Python 函数 `to_iso`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 34 | <code>    normalized = ensure_aware_utc(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 35 | <code>    return normalized.isoformat() if normalized else None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>def current_period_key(value: datetime &#124; None = None) -&gt; str:</code> | 定义 Python 函数 `current_period_key`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 39 | <code>    timestamp = ensure_aware_utc(value) or now_utc()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 40 | <code>    return timestamp.strftime("%Y-%m")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>def hash_password(password: str) -&gt; str:</code> | 定义 Python 函数 `hash_password`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 44 | <code>    pepper = settings.APP_PASSWORD_PEPPER or ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 45 | <code>    salt = os.urandom(16)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 46 | <code>    iterations = 200_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 47 | <code>    digest = hashlib.pbkdf2_hmac(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 48 | <code>        "sha256",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 49 | <code>        f"{password}{pepper}".encode("utf-8"),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 50 | <code>        salt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 51 | <code>        iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 52 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    return "pbkdf2_sha256${iterations}${salt}${digest}".format(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 54 | <code>        iterations=iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 55 | <code>        salt=base64.b64encode(salt).decode("ascii"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 56 | <code>        digest=base64.b64encode(digest).decode("ascii"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 57 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>def verify_password(password: str, encoded_password: str) -&gt; bool:</code> | 定义 Python 函数 `verify_password`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 61 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 62 | <code>        algorithm, iterations_raw, salt_raw, digest_raw = encoded_password.split("$", 3)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 63 | <code>        if algorithm != "pbkdf2_sha256":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 64 | <code>            return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 65 | <code>        pepper = settings.APP_PASSWORD_PEPPER or ""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 66 | <code>        iterations = int(iterations_raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 67 | <code>        salt = base64.b64decode(salt_raw.encode("ascii"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 68 | <code>        expected = base64.b64decode(digest_raw.encode("ascii"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 69 | <code>        actual = hashlib.pbkdf2_hmac(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 70 | <code>            "sha256",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 71 | <code>            f"{password}{pepper}".encode("utf-8"),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 72 | <code>            salt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 73 | <code>            iterations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 74 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>        return secrets.compare_digest(actual, expected)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 76 | <code>    except Exception:  # noqa: BLE001</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 77 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>def create_session_token() -&gt; str:</code> | 定义 Python 函数 `create_session_token`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 81 | <code>    return secrets.token_urlsafe(32)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>def has_active_membership(user: AppUser &#124; None) -&gt; bool:</code> | 定义 Python 函数 `has_active_membership`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 85 | <code>    if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 86 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 87 | <code>    if user.membership_status not in {"active", "trialing"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 88 | <code>        return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 89 | <code>    expires_at = ensure_aware_utc(user.membership_expires_at)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 90 | <code>    return expires_at is None or expires_at &gt; now_utc()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>def serialize_user(user: AppUser) -&gt; dict:</code> | 定义 Python 函数 `serialize_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 94 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 95 | <code>        "id": user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 96 | <code>        "email": user.email,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 97 | <code>        "displayName": user.display_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 98 | <code>        "stripeCustomerId": user.stripe_customer_id or None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 99 | <code>        "membership": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 100 | <code>            "status": user.membership_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 101 | <code>            "plan": user.membership_plan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 102 | <code>            "expiresAt": to_iso(user.membership_expires_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 103 | <code>            "active": has_active_membership(user),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 104 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>        "createdAt": to_iso(user.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 106 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>def serialize_payment(payment: AppPayment) -&gt; dict:</code> | 定义 Python 函数 `serialize_payment`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 110 | <code>    return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 111 | <code>        "id": payment.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 112 | <code>        "userId": payment.user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 113 | <code>        "stripeSessionId": payment.stripe_session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 114 | <code>        "stripeCustomerId": payment.stripe_customer_id or None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 115 | <code>        "stripeSubscriptionId": payment.stripe_subscription_id or None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 116 | <code>        "mode": payment.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 117 | <code>        "status": payment.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 118 | <code>        "paymentStatus": payment.payment_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 119 | <code>        "createdAt": to_iso(payment.created_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 120 | <code>        "updatedAt": to_iso(payment.updated_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>class AccountService:</code> | 定义 Python 类 `AccountService`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 125 | <code>    def __init__(self, db: AsyncSession):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 126 | <code>        self.db = db</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>    async def get_user_by_email(self, email: str) -&gt; AppUser &#124; None:</code> | 定义 Python 函数 `get_user_by_email`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 129 | <code>        stmt = select(AppUser).where(AppUser.email == normalize_email(email)).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 130 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 131 | <code>        return result.scalar_one_or_none()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>    async def get_user_by_id(self, user_id: int) -&gt; AppUser &#124; None:</code> | 定义 Python 函数 `get_user_by_id`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 134 | <code>        stmt = select(AppUser).where(AppUser.id == int(user_id)).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 135 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 136 | <code>        return result.scalar_one_or_none()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>    async def list_users(self, query: str = "", limit: int = 50, offset: int = 0) -&gt; list[AppUser]:</code> | 定义 Python 函数 `list_users`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 139 | <code>        stmt = select(AppUser).order_by(AppUser.created_at.desc())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 140 | <code>        normalized_query = normalize_email(query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 141 | <code>        if normalized_query:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 142 | <code>            pattern = f"%{normalized_query}%"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 143 | <code>            stmt = stmt.where(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 144 | <code>                (AppUser.email.ilike(pattern))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 145 | <code>                &#124; (AppUser.display_name.ilike(pattern))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 146 | <code>                &#124; (AppUser.stripe_customer_id.ilike(pattern))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 147 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>        stmt = stmt.offset(max(int(offset or 0), 0)).limit(min(max(int(limit or 50), 1), 200))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 149 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 150 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>    async def create_user(self, email: str, password: str, display_name: str = "") -&gt; AppUser:</code> | 定义 Python 函数 `create_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 153 | <code>        user = AppUser(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 154 | <code>            email=normalize_email(email),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 155 | <code>            display_name=(display_name or "").strip() or normalize_email(email).split("@")[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 156 | <code>            password_hash=hash_password(password),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 157 | <code>            membership_status="free",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 158 | <code>            membership_plan="free",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 159 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>        self.db.add(user)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 161 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 162 | <code>        await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 163 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>    async def create_session(self, user_id: int) -&gt; dict:</code> | 定义 Python 函数 `create_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 166 | <code>        expires_at = now_utc() + timedelta(days=max(int(settings.APP_SESSION_TTL_DAYS or 30), 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 167 | <code>        session = AppSession(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 168 | <code>            user_id=int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 169 | <code>            token=create_session_token(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 170 | <code>            expires_at=expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 171 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>        self.db.add(session)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 173 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 174 | <code>        return {"token": session.token, "expiresAt": expires_at}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>    async def get_session_user(self, token: str &#124; None) -&gt; dict &#124; None:</code> | 定义 Python 函数 `get_session_user`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 177 | <code>        if not token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 178 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 179 | <code>        stmt = select(AppSession).where(AppSession.token == token).limit(1)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 180 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 181 | <code>        session = result.scalar_one_or_none()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 182 | <code>        if not session:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 183 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 184 | <code>        expires_at = ensure_aware_utc(session.expires_at)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 185 | <code>        if not expires_at or expires_at &lt;= now_utc():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 186 | <code>            await self.db.delete(session)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 187 | <code>            await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 188 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 189 | <code>        user = await self.get_user_by_id(session.user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 190 | <code>        if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 191 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 192 | <code>        return {"token": session.token, "expiresAt": expires_at, "user": user}</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>    async def delete_session(self, token: str &#124; None) -&gt; None:</code> | 定义 Python 函数 `delete_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 195 | <code>        if not token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 196 | <code>            return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 197 | <code>        await self.db.execute(delete(AppSession).where(AppSession.token == token))</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 198 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>    async def list_payments(self, user_id: int, limit: int = 50) -&gt; list[AppPayment]:</code> | 定义 Python 函数 `list_payments`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 201 | <code>        stmt = (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 202 | <code>            select(AppPayment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 203 | <code>            .where(AppPayment.user_id == int(user_id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 204 | <code>            .order_by(AppPayment.created_at.desc())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 205 | <code>            .limit(min(max(int(limit or 50), 1), 200))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 206 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 208 | <code>        return list(result.scalars().all())</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>    async def set_membership(</code> | 定义 Python 函数 `set_membership`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 211 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 212 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 213 | <code>        user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 214 | <code>        status: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 215 | <code>        plan: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 216 | <code>        expires_at: datetime &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 217 | <code>        admin_user_id: int &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 218 | <code>        reason: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 219 | <code>    ) -&gt; AppUser &#124; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 220 | <code>        user = await self.get_user_by_id(user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 221 | <code>        if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 222 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>        user.membership_status = (status or "free").strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 225 | <code>        user.membership_plan = (plan or "free").strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 226 | <code>        user.membership_expires_at = ensure_aware_utc(expires_at)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 227 | <code>        await self.add_admin_audit_log(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 228 | <code>            admin_user_id=admin_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 229 | <code>            target_user_id=user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 230 | <code>            action="membership.update",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 231 | <code>            detail={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 232 | <code>                "status": user.membership_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 233 | <code>                "plan": user.membership_plan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 234 | <code>                "expiresAt": to_iso(user.membership_expires_at),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 235 | <code>                "reason": reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 236 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>            commit=False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 238 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 240 | <code>        await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 241 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>    async def add_admin_audit_log(</code> | 定义 Python 函数 `add_admin_audit_log`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 244 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 245 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 246 | <code>        admin_user_id: int &#124; None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 247 | <code>        target_user_id: int &#124; None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 248 | <code>        action: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 249 | <code>        detail: dict &#124; str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 250 | <code>        commit: bool = True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 251 | <code>    ) -&gt; AppAdminAuditLog:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 252 | <code>        if isinstance(detail, str):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 253 | <code>            detail_text = detail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 254 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 255 | <code>            detail_text = json.dumps(detail, ensure_ascii=False, sort_keys=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 256 | <code>        log = AppAdminAuditLog(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 257 | <code>            admin_user_id=admin_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 258 | <code>            target_user_id=target_user_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 259 | <code>            action=action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 260 | <code>            detail=detail_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 261 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>        self.db.add(log)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 263 | <code>        if commit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 264 | <code>            await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 265 | <code>            await self.db.refresh(log)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 266 | <code>        return log</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>    async def count_period_usage(self, user_id: int, endpoints: list[str], period_key: str &#124; None = None) -&gt; int:</code> | 定义 Python 函数 `count_period_usage`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 269 | <code>        period = period_key or current_period_key()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 270 | <code>        stmt = select(func.coalesce(func.sum(AppApiUsage.units), 0)).where(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 271 | <code>            AppApiUsage.user_id == int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 272 | <code>            AppApiUsage.period_key == period,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 273 | <code>            AppApiUsage.endpoint.in_(endpoints),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 274 | <code>            AppApiUsage.status == "accepted",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 275 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>        result = await self.db.execute(stmt)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 277 | <code>        return int(result.scalar_one() or 0)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>    async def record_api_usage(</code> | 定义 Python 函数 `record_api_usage`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 280 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 281 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 282 | <code>        user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 283 | <code>        endpoint: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 284 | <code>        units: int = 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 285 | <code>        status: str = "accepted",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 286 | <code>        period_key: str &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 287 | <code>    ) -&gt; AppApiUsage:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 288 | <code>        usage = AppApiUsage(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 289 | <code>            user_id=int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 290 | <code>            endpoint=endpoint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 291 | <code>            units=max(int(units or 1), 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 292 | <code>            status=status or "accepted",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 293 | <code>            period_key=period_key or current_period_key(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 294 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>        self.db.add(usage)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 296 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 297 | <code>        await self.db.refresh(usage)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 298 | <code>        return usage</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>    async def set_stripe_customer(self, user: AppUser, stripe_customer_id: str) -&gt; AppUser:</code> | 定义 Python 函数 `set_stripe_customer`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 301 | <code>        user.stripe_customer_id = stripe_customer_id or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 302 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 303 | <code>        await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 304 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>    async def record_checkout_session(</code> | 定义 Python 函数 `record_checkout_session`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 307 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 308 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 309 | <code>        user_id: int,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 310 | <code>        stripe_session_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 311 | <code>        mode: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 312 | <code>        status: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 313 | <code>        payment_status: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 314 | <code>        stripe_customer_id: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 315 | <code>        stripe_subscription_id: str = "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 316 | <code>    ) -&gt; AppPayment:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 317 | <code>        stmt = select(AppPayment).where(AppPayment.stripe_session_id == stripe_session_id).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 318 | <code>        existing = (await self.db.execute(stmt)).scalar_one_or_none()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 319 | <code>        if existing:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 320 | <code>            existing.status = status or existing.status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 321 | <code>            existing.payment_status = payment_status or existing.payment_status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 322 | <code>            existing.stripe_customer_id = stripe_customer_id or existing.stripe_customer_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 323 | <code>            existing.stripe_subscription_id = stripe_subscription_id or existing.stripe_subscription_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 324 | <code>            await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 325 | <code>            await self.db.refresh(existing)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 326 | <code>            return existing</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>        payment = AppPayment(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 329 | <code>            user_id=int(user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 330 | <code>            stripe_session_id=stripe_session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 331 | <code>            stripe_customer_id=stripe_customer_id or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 332 | <code>            stripe_subscription_id=stripe_subscription_id or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 333 | <code>            mode=mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 334 | <code>            status=status or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 335 | <code>            payment_status=payment_status or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 336 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>        self.db.add(payment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 338 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 339 | <code>        await self.db.refresh(payment)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 340 | <code>        return payment</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>    async def activate_membership_from_checkout(self, stripe_session) -&gt; AppUser &#124; None:</code> | 定义 Python 函数 `activate_membership_from_checkout`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 343 | <code>        user_id = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 344 | <code>        metadata = getattr(stripe_session, "metadata", None) or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 345 | <code>        if metadata.get("app_user_id"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 346 | <code>            user_id = int(metadata["app_user_id"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 347 | <code>        elif getattr(stripe_session, "client_reference_id", None):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 348 | <code>            user_id = int(stripe_session.client_reference_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>        if not user_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 351 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>        user = await self.get_user_by_id(user_id)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 354 | <code>        if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 355 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>        customer_id = str(getattr(stripe_session, "customer", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 358 | <code>        subscription_id = str(getattr(stripe_session, "subscription", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 359 | <code>        mode = str(getattr(stripe_session, "mode", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 360 | <code>        status = str(getattr(stripe_session, "status", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 361 | <code>        payment_status = str(getattr(stripe_session, "payment_status", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>        await self.record_checkout_session(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 364 | <code>            user_id=user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 365 | <code>            stripe_session_id=str(stripe_session.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 366 | <code>            stripe_customer_id=customer_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 367 | <code>            stripe_subscription_id=subscription_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 368 | <code>            mode=mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 369 | <code>            status=status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 370 | <code>            payment_status=payment_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 371 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 373 | <code>        if customer_id:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 374 | <code>            user.stripe_customer_id = customer_id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>        if status == "complete" and payment_status in {"paid", "no_payment_required"}:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 377 | <code>            user.membership_status = "active"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 378 | <code>            if mode == "subscription":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 379 | <code>                user.membership_plan = "subscription"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 380 | <code>                user.membership_expires_at = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 381 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 382 | <code>                user.membership_plan = "one_time"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 383 | <code>                user.membership_expires_at = now_utc() + timedelta(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 384 | <code>                    days=max(int(settings.APP_ONE_TIME_MEMBERSHIP_DAYS or 30), 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 385 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>            await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 387 | <code>            await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>    async def update_subscription_membership(</code> | 定义 Python 函数 `update_subscription_membership`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 392 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 393 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 394 | <code>        stripe_customer_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 395 | <code>        stripe_subscription_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 396 | <code>        status: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 397 | <code>        current_period_end: int &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 398 | <code>    ) -&gt; AppUser &#124; None:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 399 | <code>        stmt = select(AppUser).where(AppUser.stripe_customer_id == stripe_customer_id).limit(1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 400 | <code>        user = (await self.db.execute(stmt)).scalar_one_or_none()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 401 | <code>        if not user:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 402 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>        active_statuses = {"active", "trialing"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 405 | <code>        user.membership_status = "active" if status in active_statuses else status or "canceled"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 406 | <code>        user.membership_plan = "subscription" if status in active_statuses else user.membership_plan</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 407 | <code>        if current_period_end:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 408 | <code>            user.membership_expires_at = datetime.fromtimestamp(int(current_period_end), timezone.utc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 409 | <code>        elif status in active_statuses:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 410 | <code>            user.membership_expires_at = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>        await self.record_checkout_session(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 413 | <code>            user_id=user.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 414 | <code>            stripe_session_id=f"subscription:{stripe_subscription_id}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 415 | <code>            stripe_customer_id=stripe_customer_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 416 | <code>            stripe_subscription_id=stripe_subscription_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 417 | <code>            mode="subscription",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 418 | <code>            status=status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 419 | <code>            payment_status="",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 420 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>        await self.db.commit()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 422 | <code>        await self.db.refresh(user)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 423 | <code>        return user</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
