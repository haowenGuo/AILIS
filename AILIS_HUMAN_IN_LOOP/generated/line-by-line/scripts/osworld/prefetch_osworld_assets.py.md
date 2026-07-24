# scripts/osworld/prefetch_osworld_assets.py 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：121
- SHA-256：`50d9af15ac6cb93ae07c41f57bc68e3a84275f7eb525784c1eb3129937bdf3b3`
- 可运行副本：[打开源文件](../../../../source/scripts/osworld/prefetch_osworld_assets.py)
- 依赖：`argparse`、`json`、`os`、`time`、`uuid`、`pathlib`、`typing`、`urllib.parse`、`requests`
- 主要符号：`parse_args`、`cache_name`、`mirror_urls`、`iter_examples`、`collect_downloads`、`download_one`、`main`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import argparse</code> | 导入 Python 依赖 `argparse`，供本模块调用其类型、函数或常量。 |
| 2 | <code>import json</code> | 导入 Python 依赖 `json`，供本模块调用其类型、函数或常量。 |
| 3 | <code>import os</code> | 导入 Python 依赖 `os`，供本模块调用其类型、函数或常量。 |
| 4 | <code>import time</code> | 导入 Python 依赖 `time`，供本模块调用其类型、函数或常量。 |
| 5 | <code>import uuid</code> | 导入 Python 依赖 `uuid`，供本模块调用其类型、函数或常量。 |
| 6 | <code>from pathlib import Path</code> | 导入 Python 依赖 `pathlib`，供本模块调用其类型、函数或常量。 |
| 7 | <code>from typing import Dict, Iterable, List</code> | 导入 Python 依赖 `typing`，供本模块调用其类型、函数或常量。 |
| 8 | <code>from urllib.parse import urlparse</code> | 导入 Python 依赖 `urllib.parse`，供本模块调用其类型、函数或常量。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>import requests</code> | 导入 Python 依赖 `requests`，供本模块调用其类型、函数或常量。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>def parse_args() -&gt; argparse.Namespace:</code> | 定义 Python 函数 `parse_args`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>    parser = argparse.ArgumentParser(description="Prefetch OSWorld task assets into OSWorld's setup cache.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>    parser.add_argument("--osworld-dir", default="/mnt/f/AILIS/build-cache/OSWorld")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 16 | <code>    parser.add_argument("--test-all-meta-path", default="evaluation_examples/test_small.json")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 17 | <code>    parser.add_argument("--test-config-base-dir", default="evaluation_examples")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 18 | <code>    parser.add_argument("--cache-dir", default="cache")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 19 | <code>    parser.add_argument("--limit", type=int, default=0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 20 | <code>    parser.add_argument("--timeout", type=int, default=30)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 21 | <code>    parser.add_argument("--retries", type=int, default=1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>    return parser.parse_args()</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>def cache_name(url: str, target_path: str) -&gt; str:</code> | 定义 Python 函数 `cache_name`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 26 | <code>    return f"{uuid.uuid5(uuid.NAMESPACE_URL, url)}_{os.path.basename(target_path)}"</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>def mirror_urls(url: str) -&gt; List[str]:</code> | 定义 Python 函数 `mirror_urls`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>    if "https://huggingface.co/" in url:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 31 | <code>        return [url.replace("https://huggingface.co/", "https://hf-mirror.com/"), url]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 32 | <code>    return [url]</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>def iter_examples(osworld_dir: Path, meta_path: Path, base_dir: Path, limit: int) -&gt; Iterable[Dict]:</code> | 定义 Python 函数 `iter_examples`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 36 | <code>    meta = json.loads(meta_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>    count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>    for domain, ids in meta.items():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 39 | <code>        for example_id in ids:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 40 | <code>            example_path = osworld_dir / base_dir / "examples" / domain / f"{example_id}.json"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>            yield json.loads(example_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>            count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>            if limit and count &gt;= limit:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 44 | <code>                return</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>def collect_downloads(example: Dict) -&gt; List[Dict[str, str]]:</code> | 定义 Python 函数 `collect_downloads`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>    downloads: List[Dict[str, str]] = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>    for step in example.get("config") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 50 | <code>        if step.get("type") != "download":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 51 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>        for item in (step.get("parameters") or {}).get("files") or []:</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 53 | <code>            url = item.get("url")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 54 | <code>            path = item.get("path")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>            if url and path:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 56 | <code>                downloads.append({"url": url, "path": path, "example_id": example.get("id", "")})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>    return downloads</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>def download_one(url: str, target: Path, timeout: int, retries: int) -&gt; bool:</code> | 定义 Python 函数 `download_one`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>    target.parent.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>    temp = target.with_suffix(target.suffix + ".part")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>    for candidate in mirror_urls(url):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 64 | <code>        for attempt in range(max(1, retries)):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 65 | <code>            try:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 66 | <code>                with requests.get(candidate, stream=True, timeout=(10, timeout)) as response:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>                    response.raise_for_status()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>                    with temp.open("wb") as handle:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>                        for chunk in response.iter_content(chunk_size=1024 * 1024):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 70 | <code>                            if chunk:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 71 | <code>                                handle.write(chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>                temp.replace(target)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>                return True</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 74 | <code>            except Exception as error:</code> | Python 异常控制：界定可能失败的操作、错误处理或必做清理。 |
| 75 | <code>                if temp.exists():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 76 | <code>                    temp.unlink()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 77 | <code>                if attempt + 1 &gt;= max(1, retries):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 78 | <code>                    print(f"download failed: {candidate} :: {error}", flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>                else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 80 | <code>                    time.sleep(1.5 * (attempt + 1))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 81 | <code>    return False</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>def main() -&gt; int:</code> | 定义 Python 函数 `main`；其缩进块实现具体业务或工具行为。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 85 | <code>    args = parse_args()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 86 | <code>    osworld_dir = Path(args.osworld_dir)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>    meta_path = Path(args.test_all_meta_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 88 | <code>    if not meta_path.is_absolute():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 89 | <code>        meta_path = osworld_dir / meta_path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 90 | <code>    base_dir = Path(args.test_config_base_dir)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>    cache_dir = Path(args.cache_dir)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>    if not cache_dir.is_absolute():</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 93 | <code>        cache_dir = osworld_dir / cache_dir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>    downloads: Dict[str, Dict[str, str]] = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 96 | <code>    for example in iter_examples(osworld_dir, meta_path, base_dir, args.limit):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 97 | <code>        for item in collect_downloads(example):</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 98 | <code>            downloads[item["url"]] = item</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>    print(f"osworld asset prefetch: {len(downloads)} files", flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    ok = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 102 | <code>    skipped = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>    failed = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>    for item in downloads.values():</code> | Python 循环：按集合元素或条件重复执行后续缩进块。 |
| 105 | <code>        target = cache_dir / item["example_id"] / cache_name(item["url"], item["path"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 106 | <code>        if target.exists() and target.stat().st_size &gt; 0:</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 107 | <code>            skipped += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>            print(f"cached {item['example_id']}: {target.name}", flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>        print(f"prefetch {item['example_id']}: {urlparse(item['url']).path.rsplit('/', 1)[-1]}", flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>        if download_one(item["url"], target, args.timeout, args.retries):</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 112 | <code>            ok += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 114 | <code>            failed += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    print(json.dumps({"ok": ok, "skipped": skipped, "failed": failed, "cache_dir": str(cache_dir)}, ensure_ascii=False), flush=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>    return 0 if failed == 0 else 2</code> | Python 返回语句：结束当前函数并把结果交还调用方。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>if __name__ == "__main__":</code> | Python 条件分支：只有条件成立时才执行后续缩进块。 |
| 121 | <code>    raise SystemExit(main())</code> | Python 抛错语句：终止当前正常路径并向上层报告失败原因。 |
