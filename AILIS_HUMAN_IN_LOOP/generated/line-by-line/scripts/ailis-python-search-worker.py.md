# scripts/ailis-python-search-worker.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：322
- SHA-256：`ceb803c6a045fc0cdb85975ef3e570fc54c9935e463ce8fa28d66d066eb4af2e`
- 可运行副本：[打开源文件](../../../source/scripts/ailis-python-search-worker.py)
- 依赖：`json`、`os`、`re`、`sys`、`time`、`urllib.parse`、`requests`、`bs4`
- 主要符号：`norm`、`clean_text`、`normalize_base_url`、`unwrap_redirect_url`、`normalize_url`、`dedupe_results`、`request_text`、`search_searxng`、`search_wikipedia`、`search_firecrawl`、`search_bing`、`search_duckduckgo_lite`、`search_yahoo`、`main`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>#!/usr/bin/env python3</code> | Shebang：指定直接执行该脚本时使用的解释器。 |
| 2 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import re</code> | 导入 Python 依赖 `re`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import sys</code> | 导入 Python 依赖 `sys`，供本模块调用其类型、函数或常量。 |
| 6 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from urllib.parse import parse_qs, quote_plus, unquote, urljoin, urlparse</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>import requests</code> | 导入 Python 依赖 `requests`，供本模块调用其类型、函数或常量。 |
| 10 | <code>from bs4 import BeautifulSoup</code> | 导入 Python 依赖 `bs4`，供本模块调用其类型、函数或常量。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>USER_AGENT = "AILISResearchMCP/0.1 (+local python search worker)"</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>def norm(value):</code> | 定义 Python 函数 `norm`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 17 | <code>    return str(value or "").strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>def clean_text(value):</code> | 定义 Python 函数 `clean_text`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 21 | <code>    return re.sub(r"\s+", " ", norm(value)).strip()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>def normalize_base_url(value):</code> | 定义 Python 函数 `normalize_base_url`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 25 | <code>    return norm(value).rstrip("/")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>def unwrap_redirect_url(url):</code> | 定义 Python 函数 `unwrap_redirect_url`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 29 | <code>    text = norm(url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>    if not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 31 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 32 | <code>    parsed = urlparse(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>    if parsed.netloc.endswith("bing.com") and parsed.path.startswith("/ck/a"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 34 | <code>        qs = parse_qs(parsed.query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 35 | <code>        for key in ("u", "url"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 36 | <code>            if qs.get(key):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 37 | <code>                candidate = qs[key][0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>                if candidate.startswith("a1"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 39 | <code>                    candidate = candidate[2:]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 40 | <code>                try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 41 | <code>                    return unquote(candidate)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 42 | <code>                except Exception:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 43 | <code>                    return candidate</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 44 | <code>    if "duckduckgo.com" in parsed.netloc and parsed.path.startswith("/l/"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 45 | <code>        qs = parse_qs(parsed.query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 46 | <code>        if qs.get("uddg"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 47 | <code>            return unquote(qs["uddg"][0])</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 48 | <code>    if "search.yahoo.com" in parsed.netloc and "/RU=" in parsed.path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 49 | <code>        match = re.search(r"/RU=([^/]+)", parsed.path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>        if match:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 51 | <code>            return unquote(match.group(1))</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 52 | <code>    return text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>def normalize_url(url, base=""):</code> | 定义 Python 函数 `normalize_url`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>    text = unwrap_redirect_url(norm(url))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>    if not text:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 58 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 59 | <code>    if base and text.startswith("/"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 60 | <code>        text = urljoin(base, text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>    if not re.match(r"^https?://", text, re.I):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 62 | <code>        return ""</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 63 | <code>    return text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>def dedupe_results(results, limit):</code> | 定义 Python 函数 `dedupe_results`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>    seen = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>    for item in results:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 70 | <code>        title = clean_text(item.get("title"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>        url = normalize_url(item.get("url"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>        snippet = clean_text(item.get("snippet"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>        if not title or not url:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 74 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>        key = re.sub(r"[#?].*$", "", url).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 76 | <code>        if key in seen:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 77 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 78 | <code>        seen.add(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>            "title": title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 81 | <code>            "url": url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>            "snippet": snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>            "sourceEngines": item.get("sourceEngines") or ["python_search"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 84 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>        if len(rows) &gt;= limit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 86 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>    return rows</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>def request_text(url, timeout):</code> | 定义 Python 函数 `request_text`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>    response = requests.get(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>        url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>        timeout=timeout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>        headers={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 95 | <code>            "User-Agent": USER_AGENT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 96 | <code>            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 97 | <code>            "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.5",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>    return response.status_code, response.text</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>def search_searxng(query, limit, timeout, base_url):</code> | 定义 Python 函数 `search_searxng`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>    base = normalize_base_url(base_url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 105 | <code>    if not base:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 106 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 107 | <code>    response = requests.get(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>        f"{base}/search",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>        timeout=timeout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>        params={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>            "q": query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>            "format": "json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>            "language": "auto",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 114 | <code>            "safesearch": "0",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>            "pageno": "1",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>    payload = response.json()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>    for item in payload.get("results") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 123 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>            "title": item.get("title") or item.get("pretty_url") or item.get("url"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>            "url": item.get("url"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>            "snippet": item.get("content") or item.get("snippet") or item.get("description") or "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>            "sourceEngines": item.get("engines") or [item.get("engine") or "searxng"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 128 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>def search_wikipedia(query, limit, timeout, api_url):</code> | 定义 Python 函数 `search_wikipedia`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>    response = requests.get(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 134 | <code>        norm(api_url) or "https://en.wikipedia.org/w/api.php",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 135 | <code>        timeout=timeout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>        params={</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>            "action": "query",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 138 | <code>            "list": "search",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>            "srsearch": query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>            "format": "json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 141 | <code>            "utf8": "1",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>            "srlimit": limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 143 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>    response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 147 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>    for item in (response.json().get("query") or {}).get("search") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 149 | <code>        title = clean_text(item.get("title"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 150 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>            "title": title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>            "url": f"https://en.wikipedia.org/wiki/{quote_plus(title.replace(' ', '_'), safe='_()')}",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 153 | <code>            "snippet": BeautifulSoup(norm(item.get("snippet")), "html.parser").get_text(" ", strip=True),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>            "sourceEngines": ["wikipedia_api_python"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>def search_firecrawl(query, limit, timeout, base_url, api_key="", enable_cloud=False):</code> | 定义 Python 函数 `search_firecrawl`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>    base = normalize_base_url(base_url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    if not base and enable_cloud and api_key:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 162 | <code>        base = "https://api.firecrawl.dev"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 163 | <code>    if not base:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 164 | <code>        return []</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 165 | <code>    headers = {"User-Agent": USER_AGENT, "Accept": "application/json", "Content-Type": "application/json"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>    if api_key:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 167 | <code>        headers["Authorization"] = f"Bearer {api_key}"</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 168 | <code>    response = requests.post(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 169 | <code>        f"{base}/v1/search",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>        timeout=timeout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>        headers=headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>        json={"query": query, "limit": limit},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 175 | <code>    payload = response.json()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 176 | <code>    source_rows = payload.get("data") if isinstance(payload.get("data"), list) else payload.get("results") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>    for item in source_rows:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 179 | <code>        metadata = item.get("metadata") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 180 | <code>        markdown = clean_text(item.get("markdown") or item.get("content") or item.get("text"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 181 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>            "title": item.get("title") or metadata.get("title") or item.get("url") or item.get("link"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>            "url": item.get("url") or item.get("link"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>            "snippet": item.get("description") or item.get("snippet") or metadata.get("description") or markdown[:500],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>            "sourceEngines": ["firecrawl"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>def search_bing(query, limit, timeout):</code> | 定义 Python 函数 `search_bing`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 191 | <code>    status, html = request_text(f"https://www.bing.com/search?q={quote_plus(query)}", timeout)</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 192 | <code>    if status &gt;= 400:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 193 | <code>        raise RuntimeError(f"HTTP {status}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 194 | <code>    soup = BeautifulSoup(html, "html.parser")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>    for block in soup.select("li.b_algo"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 197 | <code>        link = block.select_one("h2 a")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>        if not link:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 199 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 200 | <code>        snippet = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 201 | <code>        caption = block.select_one(".b_caption p") or block.select_one("p")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 202 | <code>        if caption:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 203 | <code>            snippet = caption.get_text(" ", strip=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>            "title": link.get_text(" ", strip=True),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>            "url": link.get("href"),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>            "snippet": snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>            "sourceEngines": ["bing_html_python"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>def search_duckduckgo_lite(query, limit, timeout):</code> | 定义 Python 函数 `search_duckduckgo_lite`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>    status, html = request_text(f"https://lite.duckduckgo.com/lite/?q={quote_plus(query)}", timeout)</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 215 | <code>    if status &gt;= 400:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 216 | <code>        raise RuntimeError(f"HTTP {status}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 217 | <code>    soup = BeautifulSoup(html, "html.parser")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 218 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>    for link in soup.select("a.result-link, a[href]"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 220 | <code>        title = link.get_text(" ", strip=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 221 | <code>        href = normalize_url(link.get("href"), "https://lite.duckduckgo.com")</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 222 | <code>        if not title or not href or "duckduckgo.com" in urlparse(href).netloc:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 223 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>        snippet = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 225 | <code>        row = link.find_parent("tr")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>        if row:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 227 | <code>            next_row = row.find_next_sibling("tr")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>            if next_row:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 229 | <code>                snippet = next_row.get_text(" ", strip=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>            "title": title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 232 | <code>            "url": href,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 233 | <code>            "snippet": snippet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 234 | <code>            "sourceEngines": ["duckduckgo_lite_python"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>def search_yahoo(query, limit, timeout):</code> | 定义 Python 函数 `search_yahoo`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 240 | <code>    status, html = request_text(f"https://search.yahoo.com/search?p={quote_plus(query)}", timeout)</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 241 | <code>    if status &gt;= 400:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 242 | <code>        raise RuntimeError(f"HTTP {status}")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 243 | <code>    soup = BeautifulSoup(html, "html.parser")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 244 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>    for block in soup.select("div.algo, div.dd"):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 246 | <code>        link = block.select_one("h3 a, a")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 247 | <code>        if not link:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 248 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>        href = normalize_url(link.get("href"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>        host = urlparse(href).netloc.lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>        if not href or host.endswith("yahoo.com") or host.endswith("search.yahoo.com"):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 252 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>        snippet_node = block.select_one(".compText, p")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 254 | <code>        rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>            "title": link.get_text(" ", strip=True),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>            "url": href,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>            "snippet": snippet_node.get_text(" ", strip=True) if snippet_node else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>            "sourceEngines": ["yahoo_html_python"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    return dedupe_results(rows, limit)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>def main():</code> | 定义 Python 函数 `main`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>    raw_payload = sys.argv[1] if len(sys.argv) &gt; 1 else sys.stdin.read() or "{}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>    payload = json.loads(raw_payload.lstrip("\ufeff"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 266 | <code>    query = clean_text(payload.get("query"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 267 | <code>    limit = max(1, min(int(payload.get("maxResults") or payload.get("limit") or 8), 12))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 268 | <code>    timeout = max(3.0, min(float(payload.get("timeoutSeconds") or 8), 30.0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 269 | <code>    if not query:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 270 | <code>        print(json.dumps({"ok": False, "errorCode": "missing_query", "error": "query is required"}))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>        return 2</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>    searxng_url = normalize_base_url(payload.get("searxngUrl") or os.environ.get("AILIS_SEARXNG_URL") or os.environ.get("SEARXNG_URL"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 274 | <code>    firecrawl_url = normalize_base_url(payload.get("firecrawlUrl") or os.environ.get("AILIS_FIRECRAWL_URL") or os.environ.get("FIRECRAWL_BASE_URL"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>    wikipedia_search_url = norm(payload.get("wikipediaSearchUrl")) or "https://en.wikipedia.org/w/api.php"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 276 | <code>    firecrawl_key = norm(os.environ.get("FIRECRAWL_API_KEY"))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 277 | <code>    firecrawl_cloud = norm(payload.get("allowFirecrawlCloud") or os.environ.get("AILIS_ENABLE_FIRECRAWL_CLOUD")).lower() in {"1", "true", "yes", "on"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>    provider = norm(payload.get("provider")).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>    providers = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 281 | <code>    if provider == "wikipedia":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 282 | <code>        providers.append(("wikipedia_api_python", True, lambda: search_wikipedia(query, limit, timeout, wikipedia_search_url)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 283 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 284 | <code>        if searxng_url:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 285 | <code>            providers.append(("searxng_json_python", True, lambda: search_searxng(query, limit, timeout, searxng_url)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>        if firecrawl_url or (firecrawl_cloud and firecrawl_key):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 287 | <code>            providers.append(("firecrawl_search_python", True, lambda: search_firecrawl(query, limit, timeout, firecrawl_url, firecrawl_key, firecrawl_cloud)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 288 | <code>        providers.extend([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>            ("bing_html_python", False, lambda: search_bing(query, limit, timeout)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 290 | <code>            ("yahoo_html_python", False, lambda: search_yahoo(query, limit, timeout)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 291 | <code>            ("duckduckgo_lite_python", False, lambda: search_duckduckgo_lite(query, limit, timeout)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 292 | <code>        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>    attempts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 295 | <code>    merged = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 296 | <code>    started = time.time()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 297 | <code>    for name, configured_provider, fn in providers:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 298 | <code>        try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 299 | <code>            rows = fn()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 300 | <code>            attempts.append({"backend": name, "ok": bool(rows), "count": len(rows)})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 301 | <code>            merged.extend(rows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 302 | <code>            merged = dedupe_results(merged, limit * 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>            if rows:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 304 | <code>                break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>        except Exception as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 306 | <code>            attempts.append({"backend": name, "ok": False, "errorCode": exc.__class__.__name__, "error": str(exc)[:1000]})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>    results = dedupe_results(merged, limit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 309 | <code>    print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 310 | <code>        "ok": bool(results),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 311 | <code>        "backend": "python_search",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 312 | <code>        "durationMs": int((time.time() - started) * 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>        "attempts": attempts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 314 | <code>        "results": results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 315 | <code>        "errorCode": "" if results else "no_results",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 316 | <code>        "error": "" if results else "Python search worker found no results",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 317 | <code>    }, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 318 | <code>    return 0 if results else 1</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 322 | <code>    raise SystemExit(main())</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
