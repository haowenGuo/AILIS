# backend/api/vivix.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。
- 文件类型：`source-code`
- 原始行数：112
- SHA-256：`0c05cac2ee077d5b283324368c0f115a66f8ec5cb45bd81a1421752d3fba4521`
- 可运行副本：[打开源文件](../../../../source/backend/api/vivix.py)
- 依赖：`asyncio`、`json`、`pathlib`、`urllib.error`、`urllib.request`、`fastapi`、`fastapi.responses`、`backend.core.config`
- 主要符号：`_ensure_static_root`、`_resolve_asset`、`_build_ark_url`、`_perform_ark_request`、`vivix_redirect`、`vivix_static`、`vivix_create_seedance_task`、`vivix_get_seedance_task`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import asyncio</code> | 导入 Python 依赖 `asyncio`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 3 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 4 | <code>from urllib.error import HTTPError, URLError</code> | 导入 Python 依赖 `urllib.error`，供本模块调用其类型、函数或常量。 |
| 5 | <code>from urllib.request import Request, urlopen</code> | 导入 Python 依赖 `urllib.request`，供本模块调用其类型、函数或常量。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>from fastapi import APIRouter, HTTPException</code> | 导入 Python 依赖 `fastapi`，供本模块调用其类型、函数或常量。 |
| 8 | <code>from fastapi.responses import FileResponse, RedirectResponse, Response</code> | 导入 Python 依赖 `fastapi.responses`，供本模块调用其类型、函数或常量。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>from backend.core.config import get_settings</code> | 导入 Python 依赖 `backend.core.config`，供本模块调用其类型、函数或常量。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>settings = get_settings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 14 | <code>router = APIRouter()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 15 | <code>_static_root = Path(__file__).resolve().parent.parent / "static" / "vivix"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>def _ensure_static_root() -&gt; None:</code> | 定义 Python 函数 `_ensure_static_root`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 19 | <code>    if not _static_root.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 20 | <code>        raise HTTPException(status_code=503, detail="Vivix frontend assets are not deployed yet.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>def _resolve_asset(asset_path: str) -&gt; Path:</code> | 定义 Python 函数 `_resolve_asset`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 24 | <code>    candidate = (_static_root / asset_path).resolve()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 25 | <code>    root = _static_root.resolve()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>    if candidate == root:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 28 | <code>        return root / "index.html"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>    if root not in candidate.parents:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 31 | <code>        raise HTTPException(status_code=403, detail="Invalid Vivix asset path.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>    if candidate.exists() and candidate.is_file():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 34 | <code>        return candidate</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>    # SPA fallback for non-file-like routes.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 37 | <code>    if "." not in Path(asset_path).name:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 38 | <code>        return root / "index.html"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>    raise HTTPException(status_code=404, detail="Vivix asset not found.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>def _build_ark_url(path: str) -&gt; str:</code> | 定义 Python 函数 `_build_ark_url`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 44 | <code>    base = settings.LLM_API_BASE.rstrip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 45 | <code>    return f"{base}/contents/generations{path}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>def _perform_ark_request(method: str, path: str, payload: dict &#124; None = None) -&gt; tuple[int, bytes, str]:</code> | 定义 Python 函数 `_perform_ark_request`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 49 | <code>    if not settings.LLM_API_KEY:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 50 | <code>        raise HTTPException(status_code=500, detail="LLM_API_KEY is missing on the AILIS backend.")</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>    data = None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 53 | <code>    headers = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 54 | <code>        "Accept": "application/json",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 55 | <code>        "Authorization": f"Bearer {settings.LLM_API_KEY}",</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 56 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>    if payload is not None:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 59 | <code>        data = json.dumps(payload).encode("utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 60 | <code>        headers["Content-Type"] = "application/json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>    request = Request(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 63 | <code>        url=_build_ark_url(path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 64 | <code>        data=data,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 65 | <code>        headers=headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 66 | <code>        method=method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 67 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>    try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 70 | <code>        with urlopen(request, timeout=180) as response:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 71 | <code>            content_type = response.headers.get("Content-Type", "application/json; charset=utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 72 | <code>            return response.status, response.read(), content_type</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 73 | <code>    except HTTPError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 74 | <code>        content_type = exc.headers.get("Content-Type", "application/json; charset=utf-8")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 75 | <code>        return exc.code, exc.read(), content_type</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 76 | <code>    except URLError as exc:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 77 | <code>        raise HTTPException(status_code=502, detail=f"Vivix Seedance proxy network error: {exc.reason}") from exc</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>@router.get("/vivix", include_in_schema=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 81 | <code>async def vivix_redirect():</code> | 定义 Python 函数 `vivix_redirect`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 82 | <code>    return RedirectResponse(url="/vivix/")</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>@router.get("/vivix/{asset_path:path}", include_in_schema=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 86 | <code>async def vivix_static(asset_path: str):</code> | 定义 Python 函数 `vivix_static`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 87 | <code>    _ensure_static_root()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 88 | <code>    normalized = asset_path.strip("/")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 89 | <code>    target = _resolve_asset(normalized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 90 | <code>    return FileResponse(target)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>@router.post("/api/vivix/seedance/tasks")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 94 | <code>async def vivix_create_seedance_task(payload: dict):</code> | 定义 Python 函数 `vivix_create_seedance_task`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 95 | <code>    status_code, content, content_type = await asyncio.to_thread(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 96 | <code>        _perform_ark_request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 97 | <code>        "POST",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 98 | <code>        "/tasks",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 99 | <code>        payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 100 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>    return Response(content=content, status_code=status_code, media_type=content_type)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>@router.get("/api/vivix/seedance/tasks/{task_id}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 105 | <code>async def vivix_get_seedance_task(task_id: str):</code> | 定义 Python 函数 `vivix_get_seedance_task`；其缩进块实现具体业务或工具行为。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 106 | <code>    status_code, content, content_type = await asyncio.to_thread(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 107 | <code>        _perform_ark_request,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 108 | <code>        "GET",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 109 | <code>        f"/tasks/{task_id}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 110 | <code>        None,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。”这一文件职责。 |
| 111 | <code>    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    return Response(content=content, status_code=status_code, media_type=content_type)</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
