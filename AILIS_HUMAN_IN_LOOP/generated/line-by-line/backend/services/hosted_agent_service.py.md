# backend/services/hosted_agent_service.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：后端服务层：实现模型、记忆、聊天或业务服务逻辑。
- 文件类型：`source-code`
- 原始行数：193
- SHA-256：`1d50270e661b4f2de94eeab5fa420eb478d326dc319c693e8fb941495554433f`
- 可运行副本：[打开源文件](../../../../source/backend/services/hosted_agent_service.py)
- 依赖：`base64`、`hashlib`、`hmac`、`json`、`time`、`uuid`、`dataclasses`、`collections.abc`、`typing`、`urllib.parse`、`httpx`、`backend.core.config`
- 主要符号：`_base64url_encode`、`_base64url_decode`、`HostedWebSession`、`HostedWebSessionService`、`__init__`、`configured`、`_signature`、`issue`、`verify`、`HostedAgentRuntimeClient`、`_headers`、`_stream_headers`、`_request`、`health`、`tenant_status`、`recent_events`、`run_agent`、`stream_agent`、`interrupt`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import base64</code> | 导入 Python 依赖 `base64`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import hashlib</code> | 导入 Python 依赖 `hashlib`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import hmac</code> | 导入 Python 依赖 `hmac`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 6 | <code>import uuid</code> | 导入 Python 依赖 `uuid`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from dataclasses import dataclass</code> | 导入 Python 依赖 `dataclasses`，供本模块调用其类型、函数或常量。 |
| 8 | <code>from collections.abc import AsyncIterator</code> | 导入 Python 依赖 `collections.abc`，供本模块调用其类型、函数或常量。 |
| 9 | <code>from typing import Any</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 10 | <code>from urllib.parse import urlencode</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>import httpx</code> | 导入 Python 依赖 `httpx`，供本模块调用其类型、函数或常量。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>def _base64url_encode(value: bytes) -&gt; str:</code> | 定义 Python 函数 `_base64url_encode`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 21 | <code>    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>def _base64url_decode(value: str) -&gt; bytes:</code> | 定义 Python 函数 `_base64url_decode`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 25 | <code>    padding = "=" * (-len(value) % 4)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 26 | <code>    return base64.urlsafe_b64decode(f"{value}{padding}")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>@dataclass(frozen=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 30 | <code>class HostedWebSession:</code> | 定义 Python 类 `HostedWebSession`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 31 | <code>    session_id: str</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 32 | <code>    tenant_id: str</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 33 | <code>    token: str</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 34 | <code>    issued_at: int</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 35 | <code>    expires_at: int</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>class HostedWebSessionService:</code> | 定义 Python 类 `HostedWebSessionService`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 39 | <code>    def __init__(self, secret: str &#124; None = None, ttl_days: int &#124; None = None):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 40 | <code>        self.secret = (secret if secret is not None else settings.AILIS_WEB_SESSION_SECRET).strip()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 41 | <code>        self.ttl_seconds = max(1, int(ttl_days or settings.AILIS_WEB_SESSION_TTL_DAYS)) * 86400</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>    @property</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 44 | <code>    def configured(self) -&gt; bool:</code> | 定义 Python 函数 `configured`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 45 | <code>        return len(self.secret) &gt;= 24</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>    def _signature(self, encoded_payload: str) -&gt; str:</code> | 定义 Python 函数 `_signature`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 48 | <code>        digest = hmac.new(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 49 | <code>            self.secret.encode("utf-8"),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 50 | <code>            encoded_payload.encode("ascii"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 51 | <code>            hashlib.sha256,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 52 | <code>        ).digest()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 53 | <code>        return _base64url_encode(digest)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>    def issue(self, now: int &#124; None = None) -&gt; HostedWebSession:</code> | 定义 Python 函数 `issue`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 56 | <code>        if not self.configured:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 57 | <code>            raise RuntimeError("AILIS_WEB_SESSION_SECRET is not configured")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 58 | <code>        issued_at = int(now or time.time())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 59 | <code>        expires_at = issued_at + self.ttl_seconds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 60 | <code>        session_id = uuid.uuid4().hex</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 61 | <code>        payload = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 62 | <code>            "v": 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 63 | <code>            "sid": session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 64 | <code>            "iat": issued_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 65 | <code>            "exp": expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 66 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>        encoded = _base64url_encode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 68 | <code>            json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 69 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>        token = f"{encoded}.{self._signature(encoded)}"</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 71 | <code>        return HostedWebSession(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 72 | <code>            session_id=session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 73 | <code>            tenant_id=f"web:{session_id}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 74 | <code>            token=token,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 75 | <code>            issued_at=issued_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 76 | <code>            expires_at=expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 77 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>    def verify(self, token: str, now: int &#124; None = None) -&gt; HostedWebSession &#124; None:</code> | 定义 Python 函数 `verify`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 80 | <code>        if not self.configured or not token or "." not in token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 81 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 82 | <code>        encoded, signature = token.split(".", 1)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 83 | <code>        if not hmac.compare_digest(signature, self._signature(encoded)):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 84 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 85 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 86 | <code>            payload = json.loads(_base64url_decode(encoded))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 87 | <code>            session_id = str(payload.get("sid") or "").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 88 | <code>            issued_at = int(payload.get("iat") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 89 | <code>            expires_at = int(payload.get("exp") or 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 90 | <code>        except (ValueError, TypeError, json.JSONDecodeError):</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 91 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 92 | <code>        if payload.get("v") != 1 or not session_id or expires_at &lt;= int(now or time.time()):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 93 | <code>            return None</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 94 | <code>        return HostedWebSession(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 95 | <code>            session_id=session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 96 | <code>            tenant_id=f"web:{session_id}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 97 | <code>            token=token,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 98 | <code>            issued_at=issued_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 99 | <code>            expires_at=expires_at,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 100 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>class HostedAgentRuntimeClient:</code> | 定义 Python 类 `HostedAgentRuntimeClient`，封装相关状态、协议和方法。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 104 | <code>    def __init__(self):</code> | 定义 Python 函数 `__init__`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 105 | <code>        self.base_url = settings.AILIS_HOSTED_RUNTIME_URL.rstrip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 106 | <code>        self.internal_token = settings.AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 107 | <code>        self.timeout = httpx.Timeout(</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 108 | <code>            max(30, settings.AILIS_HOSTED_RUNTIME_TIMEOUT_SECONDS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 109 | <code>            connect=10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 110 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>    def _headers(self) -&gt; dict[str, str]:</code> | 定义 Python 函数 `_headers`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 113 | <code>        headers = {"accept": "application/json"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 114 | <code>        if self.internal_token:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 115 | <code>            headers["x-ailis-internal-token"] = self.internal_token</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 116 | <code>        return headers</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>    def _stream_headers(self) -&gt; dict[str, str]:</code> | 定义 Python 函数 `_stream_headers`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 119 | <code>        return {</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 120 | <code>            **self._headers(),</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 121 | <code>            "accept": "text/event-stream",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 122 | <code>            "content-type": "application/json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 123 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    async def _request(</code> | 定义 Python 函数 `_request`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 126 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 127 | <code>        method: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 128 | <code>        path: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 129 | <code>        *,</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 130 | <code>        payload: dict[str, Any] &#124; None = None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 131 | <code>        timeout: httpx.Timeout &#124; float &#124; None = None,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 132 | <code>    ) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 133 | <code>        async with httpx.AsyncClient(timeout=timeout or self.timeout) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 134 | <code>            response = await client.request(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 135 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 136 | <code>                f"{self.base_url}{path}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 137 | <code>                headers=self._headers(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 138 | <code>                json=payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 139 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>        response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 141 | <code>        return response.json()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>    async def health(self) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `health`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 144 | <code>        return await self._request("GET", "/health", timeout=10)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>    async def tenant_status(self, tenant_id: str) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `tenant_status`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 147 | <code>        query = urlencode({"tenantId": tenant_id})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 148 | <code>        return await self._request("GET", f"/tenant/status?{query}", timeout=30)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>    async def recent_events(</code> | 定义 Python 函数 `recent_events`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 151 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 152 | <code>        tenant_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 153 | <code>        cursor: int = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 154 | <code>        limit: int = 100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 155 | <code>    ) -&gt; dict[str, Any]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 156 | <code>        query = urlencode({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 157 | <code>            "tenantId": tenant_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 158 | <code>            "cursor": max(0, cursor),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 159 | <code>            "limit": max(1, min(limit, 500)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 160 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>        return await self._request("GET", f"/events/recent?{query}", timeout=30)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>    async def run_agent(self, tenant_id: str, payload: dict[str, Any]) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `run_agent`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 164 | <code>        return await self._request(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 165 | <code>            "POST",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 166 | <code>            "/agent/run",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 167 | <code>            payload={"tenantId": tenant_id, "payload": payload},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 168 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>    async def stream_agent(</code> | 定义 Python 函数 `stream_agent`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 171 | <code>        self,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 172 | <code>        tenant_id: str,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 173 | <code>        payload: dict[str, Any],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 174 | <code>    ) -&gt; AsyncIterator[bytes]:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 175 | <code>        async with httpx.AsyncClient(timeout=self.timeout) as client:</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 176 | <code>            async with client.stream(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 177 | <code>                "POST",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 178 | <code>                f"{self.base_url}/agent/run",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 179 | <code>                headers=self._stream_headers(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 180 | <code>                json={"tenantId": tenant_id, "payload": payload},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 181 | <code>            ) as response:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 182 | <code>                response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 183 | <code>                async for chunk in response.aiter_bytes():</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 184 | <code>                    if chunk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 185 | <code>                        yield chunk</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>    async def interrupt(self, tenant_id: str, payload: dict[str, Any]) -&gt; dict[str, Any]:</code> | 定义 Python 函数 `interrupt`；其缩进块实现具体业务或工具行为。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 188 | <code>        return await self._request(</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 189 | <code>            "POST",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 190 | <code>            "/agent/interrupt",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 191 | <code>            payload={"tenantId": tenant_id, "payload": payload},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 192 | <code>            timeout=30,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“后端服务层：实现模型、记忆、聊天或业务服务逻辑。”这一文件职责。 |
| 193 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
