# docs/local-llm-providers.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：285
- SHA-256：`5280a7373e34a9f006bab1b4ad669b66885a5a65c1b2c9b1ac06c1ac0fe339c2`
- 可运行副本：[打开源文件](../../../source/docs/local-llm-providers.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Local LLM Setup</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS now supports two local model providers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>- `Ollama 本地`: native Ollama `/api/chat`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 6 | <code>- `vLLM 本地 / 局域网`: OpenAI-compatible vLLM `/v1/chat/completions`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>The most important rule: the control panel `API Base` is the service root that AILIS expands internally.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>&#124; Provider &#124; Control panel preset &#124; API Base &#124; Model &#124; API Key &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 11 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 12 | <code>&#124; Ollama &#124; `Ollama 本地` &#124; `http://127.0.0.1:11434` &#124; output of `ollama list`, for example `llama3.2` &#124; empty &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 13 | <code>&#124; vLLM &#124; `vLLM 本地 / 局域网` &#124; `http://127.0.0.1:8000/v1` &#124; id returned by `/v1/models` &#124; empty unless vLLM auth is enabled &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>Do not put `/api/chat` into the Ollama base URL. Do not put `/chat/completions` into the vLLM base URL unless you are intentionally using a full advanced endpoint.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>## Ollama</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>Use Ollama when you want the simplest local/offline setup.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>### 1. Start Ollama</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 24 | <code>ollama serve</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>If Ollama Desktop is already running, this service may already be active.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>### 2. Pull a model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 32 | <code>ollama pull llama3.2</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Other useful model names:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 38 | <code>ollama pull qwen2.5:7b</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>ollama pull qwen2.5:14b</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>ollama pull llama3.1:8b</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>Check the exact model names:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 46 | <code>ollama list</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>AILIS `高级模型 ID` must match one of those names exactly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>### 3. Test Ollama outside AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>$body = @{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  model = "llama3.2"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  messages = @(@{ role = "user"; content = "Say OK." })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  stream = $false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>} &#124; ConvertTo-Json -Depth 5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>Invoke-RestMethod `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>  -Uri "http://127.0.0.1:11434/api/chat" `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>  -Method Post `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>  -ContentType "application/json" `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>  -Body $body</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>If this fails, fix Ollama first before testing AILIS.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>### 4. Fill AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>- 服务商: `Ollama 本地`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- 模型: choose `llama3.2`, or select custom and type the exact `ollama list` name</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- API Key: leave empty</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- 高级 Provider: `ollama`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- 高级 API Base: `http://127.0.0.1:11434`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- 高级模型 ID: `llama3.2`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>Click `测试连接`. AILIS will call `http://127.0.0.1:11434/api/chat`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>## vLLM</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>Use vLLM when you have a GPU server, WSL2/Linux box, or LAN machine serving a model with OpenAI-compatible endpoints.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>### 1. One-click path for non-technical users</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>If the user does not know vLLM, start here:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 89 | <code>pnpm llm:vllm:oneclick</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>For ModelScope / 魔塔:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 95 | <code>pnpm llm:vllm:oneclick:modelscope</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>What this does:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>- On Windows, it automatically uses WSL because vLLM is normally deployed in Linux/WSL environments.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- If no WSL distribution exists, it prints the one-time setup command: `wsl --install -d Ubuntu`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- Inside WSL/Linux, it creates `.ailis-runtime/vllm-venv`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- It installs or upgrades `vllm`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- For Hugging Face, it installs `huggingface_hub`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- For ModelScope, it sets `VLLM_USE_MODELSCOPE=True` and installs `modelscope`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- It starts vLLM in the background and waits for `/v1/models`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- It prints the AILIS `API Base` and `Model ID`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>After it reports ready, fill AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>服务商: vLLM 本地 / 局域网</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>API Base: http://127.0.0.1:8000/v1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>模型 ID: Qwen/Qwen2.5-7B-Instruct</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>API Key: 留空</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>If Windows says no WSL distribution exists, run this once:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 121 | <code>wsl --install -d Ubuntu</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>After Ubuntu finishes setup, run `pnpm llm:vllm:oneclick` again.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>### 2. Automatic vLLM helper for advanced users</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>AILIS provides a helper script that selects Hugging Face or ModelScope, lets vLLM download/cache the model, starts the OpenAI-compatible server, and prints the exact AILIS fields to use.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>Hugging Face:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 133 | <code>pnpm llm:vllm:serve:hf</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>ModelScope:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 139 | <code>pnpm llm:vllm:serve:modelscope</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>Custom model:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 145 | <code>pnpm llm:vllm:serve -- -Source hf -Model Qwen/Qwen2.5-7B-Instruct -HostName 127.0.0.1 -Port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>Custom ModelScope model:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 151 | <code>pnpm llm:vllm:serve -- -Source modelscope -Model Qwen/Qwen2.5-7B-Instruct -HostName 127.0.0.1 -Port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>Detached mode with readiness polling:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 157 | <code>pnpm llm:vllm:serve -- -Source hf -Model Qwen/Qwen2.5-7B-Instruct -Detached -WaitReady</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>Useful deployment parameters:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>- `-Source hf&#124;modelscope`: choose Hugging Face or ModelScope.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- `-Model`: Hugging Face or ModelScope model id.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- `-ServedModelName`: optional stable model name exposed by `/v1/models`; use this as AILIS model ID.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>- `-HostName`: `127.0.0.1` for same machine, `0.0.0.0` for LAN serving.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>- `-Port`: default `8000`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- `-DownloadDir`: optional model cache directory.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- `-TensorParallelSize`: use multiple GPUs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- `-GpuMemoryUtilization`: default `0.9`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- `-MaxModelLen`: reduce this if GPU memory is tight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- `-DType`: default `auto`; common values are `float16` or `bfloat16`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- `-Quantization`: pass vLLM quantization mode if the model supports it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- `-TrustRemoteCode`: only enable for model repositories you trust.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>- `-DryRun`: print the command without starting vLLM.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>The one-click helper installs Python packages inside the project runtime venv. It intentionally does not install CUDA, NVIDIA drivers, or Windows WSL itself without explicit user action because those steps may require admin permission or reboot.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>### 3. Manual vLLM start</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>Recommended modern command:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 183 | <code>vllm serve Qwen/Qwen2.5-7B-Instruct --host 127.0.0.1 --port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>If your installed vLLM version uses the older entrypoint:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 189 | <code>python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --host 127.0.0.1 --port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>For another machine on the LAN:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 195 | <code>vllm serve Qwen/Qwen2.5-7B-Instruct --host 0.0.0.0 --port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>Then AILIS should use:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 201 | <code>http://&lt;server-ip&gt;:8000/v1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>If you set a served name:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 207 | <code>vllm serve Qwen/Qwen2.5-7B-Instruct --served-model-name ailis-local --host 127.0.0.1 --port 8000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>then AILIS `高级模型 ID` must be `ailis-local`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>### 4. Check model id</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 215 | <code>Invoke-RestMethod -Uri "http://127.0.0.1:8000/v1/models" -Method Get</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>Use the returned model `id` as AILIS model ID.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>### 5. Test vLLM outside AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 223 | <code>$body = @{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>  model = "Qwen/Qwen2.5-7B-Instruct"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>  messages = @(@{ role = "user"; content = "Say OK." })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>  temperature = 0.7</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>  stream = $false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>} &#124; ConvertTo-Json -Depth 5</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>Invoke-RestMethod `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  -Uri "http://127.0.0.1:8000/v1/chat/completions" `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>  -Method Post `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>  -ContentType "application/json" `</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>  -Body $body</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>If this fails, check vLLM logs, GPU memory, model download, firewall, and the model id.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### 6. Fill AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>- 服务商: `vLLM 本地 / 局域网`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 242 | <code>- 模型: choose the same model id shown by `/v1/models`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 243 | <code>- API Key: leave empty by default</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- 高级 Provider: `vllm`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>- 高级 API Base: `http://127.0.0.1:8000/v1`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- 高级模型 ID: `Qwen/Qwen2.5-7B-Instruct` or your `--served-model-name`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>Click `测试连接`. AILIS will call `{API Base}/chat/completions`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>## Authentication</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>Ollama usually has no API key.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>vLLM usually has no API key in local development. If your gateway requires one, set an environment variable before launching AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 257 | <code>$env:VLLM_API_KEY = "replace-with-local-vllm-key"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>AILIS intentionally does not reuse saved cloud API keys for local providers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>## Common Problems</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>&#124; Symptom &#124; Likely cause &#124; Fix &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 265 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 266 | <code>&#124; `needs_config` &#124; model or API Base is empty &#124; select a local preset or fill both fields &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 267 | <code>&#124; connection refused &#124; local server is not running or wrong port &#124; start Ollama/vLLM and test with PowerShell first &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 268 | <code>&#124; `No WSL distro found` &#124; Windows has WSL command but no Ubuntu/Linux distro &#124; run `wsl --install -d Ubuntu`, finish Ubuntu setup, then rerun one-click &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 269 | <code>&#124; `python3 was not found` &#124; WSL/Linux does not have Python &#124; install Python 3.10+ in the WSL distro &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 270 | <code>&#124; pip install fails &#124; network, CUDA wheel, or Python version issue &#124; try ModelScope source in China, check Python 3.10+, and keep terminal error text &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 271 | <code>&#124; CUDA/GPU error &#124; NVIDIA driver, CUDA runtime, or WSL GPU pass-through is unavailable &#124; check `nvidia-smi` inside WSL/Linux &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 272 | <code>&#124; out of memory &#124; model is too large for GPU memory &#124; use a smaller model or add `--max-model-len 4096` / lower `--gpu-memory-utilization` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 273 | <code>&#124; empty response &#124; model loaded but did not return text &#124; try another model or lower temperature &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 274 | <code>&#124; 404 on vLLM &#124; API Base missing `/v1`, or full path is wrong &#124; use `http://127.0.0.1:8000/v1` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 275 | <code>&#124; model not found &#124; AILIS model ID does not match server model id &#124; use `ollama list` or `/v1/models` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 276 | <code>&#124; works in terminal but not AILIS &#124; service is in WSL/Docker/LAN and `127.0.0.1` points to the wrong machine &#124; use the reachable host IP and open firewall &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>## Recommended Defaults</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>For a quick local sanity check:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>- Ollama: `llama3.2`, timeout `25000ms`, temperature `0.8`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>- vLLM: `Qwen/Qwen2.5-7B-Instruct`, timeout `25000ms`, temperature `0.7`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>For agent/tool workflows, prefer a stronger instruction-following model and test JSON output in the control panel before using it for long runs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
