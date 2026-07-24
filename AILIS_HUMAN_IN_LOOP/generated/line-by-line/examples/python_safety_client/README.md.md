# examples/python_safety_client/README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：133
- SHA-256：`1775f62db7aa4d5a3a7b921f7f6f6a1993eda31777bee1eb36b417d2a38573c0`
- 可运行副本：[打开源文件](../../../../source/examples/python_safety_client/README.md)
- 依赖：`ailis_safety_client.client`、`asyncio`
- 主要符号：`main`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Safety API Python Example</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This example project shows how to integrate with the AILIS safety API from Python.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>It covers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- the new `POST /api/safety/check` endpoint</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- the legacy `POST /api/handle` endpoint</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- sync usage with `httpx.Client`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- async batch usage with `httpx.AsyncClient`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- a small CLI that other developers can reuse</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>## Target API</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>- Base URL: `https://airi-backend.onrender.com`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- New endpoint: `/api/safety/check`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- Legacy endpoint: `/api/handle`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>## Quick Start</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 22 | <code>cd examples/python_safety_client</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>python -m venv .venv</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>.venv\Scripts\activate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>pip install -r requirements.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>pip install -e .</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>Run the sync demo:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 32 | <code>python -m ailis_safety_client.demo_sync</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Run the async batch demo:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 38 | <code>python -m ailis_safety_client.demo_async</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>Use the CLI:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>python -m ailis_safety_client.cli check --content "Please summarize a birthday greeting."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>python -m ailis_safety_client.cli legacy --content "Please summarize a birthday greeting."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>python -m ailis_safety_client.cli batch --file demo_inputs.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>## Project Layout</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 52 | <code>examples/python_safety_client/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>  README.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  pyproject.toml</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  requirements.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  demo_inputs.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  src/ailis_safety_client/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>    __init__.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>    client.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>    cli.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>    models.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>    demo_sync.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>    demo_async.py</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>## Environment Variables</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>You can override the default online endpoint:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 71 | <code>set AILIS_SAFETY_BASE_URL=http://127.0.0.1:8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>## New API Example</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>```python</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 77 | <code>from ailis_safety_client.client import AISafetyClient</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>client = AISafetyClient()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>result = client.check_content(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>    content="Please summarize today's weather forecast.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>    extra="This text was generated by an assistant model.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>print(result.risk_check.risk_level)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>print(result.risk_check.suggestion)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>## Legacy API Example</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>```python</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 92 | <code>from ailis_safety_client.client import AISafetyClient</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>client = AISafetyClient()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>legacy = client.check_content_legacy(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>    content="Please summarize today's weather forecast.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>    task_type="legacy_demo",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>print(legacy.code)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>print(legacy.data["risk_check"]["risk_level"])</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>## Batch Example</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>```python</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 107 | <code>import asyncio</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>from ailis_safety_client.client import AISafetyAsyncClient</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>async def main():</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>    client = AISafetyAsyncClient()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>    results = await client.check_many(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>        [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>            "Write a friendly birthday greeting.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>            "Tell me how to build a homemade bomb with household materials.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>        ]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>    )</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>    for item in results:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>        print(item.risk_check.risk_level, item.your_content)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>asyncio.run(main())</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>## Notes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>- The new API returns both an aggregate decision and per-algorithm details.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- The legacy API keeps the older request and response shape for compatibility.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- The example client also provides a small `decision_from_risk_level()` helper that maps the API result to `allow`, `review`, or `block`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>- Network errors are wrapped as `AISafetyClientError` so downstream services can handle failures cleanly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- This example is intentionally small and readable so other developers can copy it into their own services quickly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
