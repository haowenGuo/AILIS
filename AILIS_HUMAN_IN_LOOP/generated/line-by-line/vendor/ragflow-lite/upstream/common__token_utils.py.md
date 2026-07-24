# vendor/ragflow-lite/upstream/common__token_utils.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。
- 文件类型：`source-code`
- 原始行数：103
- SHA-256：`80bd0108ba4e051b1954f4750137a0c034cd15b87ff6a29d5928a404ddf2d0d3`
- 可运行副本：[打开源文件](../../../../../source/vendor/ragflow-lite/upstream/common__token_utils.py)
- 依赖：`hashlib`、`os`、`shutil`、`tiktoken`、`common.file_utils`
- 主要符号：`_ensure_tiktoken_cache`、`num_tokens_from_string`、`total_token_count_from_response`、`truncate`

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
| 17 | <code>import hashlib</code> | 导入 Python 依赖 `hashlib`，供本模块调用其类型、函数或常量。 |
| 18 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 19 | <code>import shutil</code> | 导入 Python 依赖 `shutil`，供本模块调用其类型、函数或常量。 |
| 20 | <code>import tiktoken</code> | 导入 Python 依赖 `tiktoken`，供本模块调用其类型、函数或常量。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>from common.file_utils import get_project_base_directory</code> | 导入 Python 依赖 `common.file_utils`，供本模块调用其类型、函数或常量。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>def _ensure_tiktoken_cache() -&gt; str:</code> | 定义 Python 函数 `_ensure_tiktoken_cache`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 26 | <code>    cache_dir = get_project_base_directory()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 27 | <code>    os.environ["TIKTOKEN_CACHE_DIR"] = cache_dir</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>    bundled_encoding_path = get_project_base_directory("ragflow_deps", "cl100k_base.tiktoken")</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 30 | <code>    encoding_url = "https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 31 | <code>    cached_encoding_path = os.path.join(cache_dir, hashlib.sha1(encoding_url.encode()).hexdigest())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>    if os.path.exists(bundled_encoding_path) and not os.path.exists(cached_encoding_path):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 34 | <code>        shutil.copyfile(bundled_encoding_path, cached_encoding_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>    return cache_dir</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>tiktoken_cache_dir = _ensure_tiktoken_cache()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 40 | <code>os.environ["TIKTOKEN_CACHE_DIR"] = tiktoken_cache_dir</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 41 | <code># encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 42 | <code>encoder = tiktoken.get_encoding("cl100k_base")</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>def num_tokens_from_string(string: str) -&gt; int:</code> | 定义 Python 函数 `num_tokens_from_string`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 46 | <code>    """Returns the number of tokens in a text string."""</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 47 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 48 | <code>        code_list = encoder.encode(string)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 49 | <code>        return len(code_list)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 50 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 51 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>def total_token_count_from_response(resp):</code> | 定义 Python 函数 `total_token_count_from_response`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 54 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 55 | <code>    Extract token count from LLM response in various formats.</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    Handles None responses and different response structures from various LLM providers.</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 58 | <code>    Returns 0 if token count cannot be determined.</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 59 | <code>    """</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 60 | <code>    if resp is None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 61 | <code>        return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 64 | <code>        if hasattr(resp, "usage") and hasattr(resp.usage, "total_tokens"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 65 | <code>            return resp.usage.total_tokens</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 66 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 67 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 70 | <code>        if hasattr(resp, "usage_metadata") and hasattr(resp.usage_metadata, "total_tokens"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 71 | <code>            return resp.usage_metadata.total_tokens</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 72 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 73 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 76 | <code>        if hasattr(resp, "meta") and hasattr(resp.meta, "billed_units") and hasattr(resp.meta.billed_units, "input_tokens"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 77 | <code>            return resp.meta.billed_units.input_tokens</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 78 | <code>    except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 79 | <code>        pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    if isinstance(resp, dict) and 'usage' in resp and 'total_tokens' in resp['usage']:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 82 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 83 | <code>            return resp["usage"]["total_tokens"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 84 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 85 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>    if isinstance(resp, dict) and 'usage' in resp and 'input_tokens' in resp['usage'] and 'output_tokens' in resp['usage']:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 88 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 89 | <code>            return resp["usage"]["input_tokens"] + resp["usage"]["output_tokens"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 90 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 91 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>    if isinstance(resp, dict) and 'meta' in resp and 'tokens' in resp['meta'] and 'input_tokens' in resp['meta']['tokens'] and 'output_tokens' in resp['meta']['tokens']:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 94 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 95 | <code>            return resp["meta"]["tokens"]["input_tokens"] + resp["meta"]["tokens"]["output_tokens"]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 96 | <code>        except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 97 | <code>            pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 98 | <code>    return 0</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>def truncate(string: str, max_len: int) -&gt; str:</code> | 定义 Python 函数 `truncate`；其缩进块实现具体业务或工具行为。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 102 | <code>    """Returns truncated text if the length of text exceed max_len."""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。”这一文件职责。 |
| 103 | <code>    return encoder.decode(encoder.encode(string)[:max_len])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
