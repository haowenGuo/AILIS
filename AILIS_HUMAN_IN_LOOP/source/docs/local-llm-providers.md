# AILIS Local LLM Setup

AILIS now supports two local model providers:

- `Ollama 本地`: native Ollama `/api/chat`.
- `vLLM 本地 / 局域网`: OpenAI-compatible vLLM `/v1/chat/completions`.

The most important rule: the control panel `API Base` is the service root that AILIS expands internally.

| Provider | Control panel preset | API Base | Model | API Key |
| --- | --- | --- | --- | --- |
| Ollama | `Ollama 本地` | `http://127.0.0.1:11434` | output of `ollama list`, for example `llama3.2` | empty |
| vLLM | `vLLM 本地 / 局域网` | `http://127.0.0.1:8000/v1` | id returned by `/v1/models` | empty unless vLLM auth is enabled |

Do not put `/api/chat` into the Ollama base URL. Do not put `/chat/completions` into the vLLM base URL unless you are intentionally using a full advanced endpoint.

## Ollama

Use Ollama when you want the simplest local/offline setup.

### 1. Start Ollama

```powershell
ollama serve
```

If Ollama Desktop is already running, this service may already be active.

### 2. Pull a model

```powershell
ollama pull llama3.2
```

Other useful model names:

```powershell
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b
ollama pull llama3.1:8b
```

Check the exact model names:

```powershell
ollama list
```

AILIS `高级模型 ID` must match one of those names exactly.

### 3. Test Ollama outside AILIS

```powershell
$body = @{
  model = "llama3.2"
  messages = @(@{ role = "user"; content = "Say OK." })
  stream = $false
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri "http://127.0.0.1:11434/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

If this fails, fix Ollama first before testing AILIS.

### 4. Fill AILIS

- 服务商: `Ollama 本地`
- 模型: choose `llama3.2`, or select custom and type the exact `ollama list` name
- API Key: leave empty
- 高级 Provider: `ollama`
- 高级 API Base: `http://127.0.0.1:11434`
- 高级模型 ID: `llama3.2`

Click `测试连接`. AILIS will call `http://127.0.0.1:11434/api/chat`.

## vLLM

Use vLLM when you have a GPU server, WSL2/Linux box, or LAN machine serving a model with OpenAI-compatible endpoints.

### 1. One-click path for non-technical users

If the user does not know vLLM, start here:

```powershell
pnpm llm:vllm:oneclick
```

For ModelScope / 魔塔:

```powershell
pnpm llm:vllm:oneclick:modelscope
```

What this does:

- On Windows, it automatically uses WSL because vLLM is normally deployed in Linux/WSL environments.
- If no WSL distribution exists, it prints the one-time setup command: `wsl --install -d Ubuntu`.
- Inside WSL/Linux, it creates `.ailis-runtime/vllm-venv`.
- It installs or upgrades `vllm`.
- For Hugging Face, it installs `huggingface_hub`.
- For ModelScope, it sets `VLLM_USE_MODELSCOPE=True` and installs `modelscope`.
- It starts vLLM in the background and waits for `/v1/models`.
- It prints the AILIS `API Base` and `Model ID`.

After it reports ready, fill AILIS:

```text
服务商: vLLM 本地 / 局域网
API Base: http://127.0.0.1:8000/v1
模型 ID: Qwen/Qwen2.5-7B-Instruct
API Key: 留空
```

If Windows says no WSL distribution exists, run this once:

```powershell
wsl --install -d Ubuntu
```

After Ubuntu finishes setup, run `pnpm llm:vllm:oneclick` again.

### 2. Automatic vLLM helper for advanced users

AILIS provides a helper script that selects Hugging Face or ModelScope, lets vLLM download/cache the model, starts the OpenAI-compatible server, and prints the exact AILIS fields to use.

Hugging Face:

```powershell
pnpm llm:vllm:serve:hf
```

ModelScope:

```powershell
pnpm llm:vllm:serve:modelscope
```

Custom model:

```powershell
pnpm llm:vllm:serve -- -Source hf -Model Qwen/Qwen2.5-7B-Instruct -HostName 127.0.0.1 -Port 8000
```

Custom ModelScope model:

```powershell
pnpm llm:vllm:serve -- -Source modelscope -Model Qwen/Qwen2.5-7B-Instruct -HostName 127.0.0.1 -Port 8000
```

Detached mode with readiness polling:

```powershell
pnpm llm:vllm:serve -- -Source hf -Model Qwen/Qwen2.5-7B-Instruct -Detached -WaitReady
```

Useful deployment parameters:

- `-Source hf|modelscope`: choose Hugging Face or ModelScope.
- `-Model`: Hugging Face or ModelScope model id.
- `-ServedModelName`: optional stable model name exposed by `/v1/models`; use this as AILIS model ID.
- `-HostName`: `127.0.0.1` for same machine, `0.0.0.0` for LAN serving.
- `-Port`: default `8000`.
- `-DownloadDir`: optional model cache directory.
- `-TensorParallelSize`: use multiple GPUs.
- `-GpuMemoryUtilization`: default `0.9`.
- `-MaxModelLen`: reduce this if GPU memory is tight.
- `-DType`: default `auto`; common values are `float16` or `bfloat16`.
- `-Quantization`: pass vLLM quantization mode if the model supports it.
- `-TrustRemoteCode`: only enable for model repositories you trust.
- `-DryRun`: print the command without starting vLLM.

The one-click helper installs Python packages inside the project runtime venv. It intentionally does not install CUDA, NVIDIA drivers, or Windows WSL itself without explicit user action because those steps may require admin permission or reboot.

### 3. Manual vLLM start

Recommended modern command:

```powershell
vllm serve Qwen/Qwen2.5-7B-Instruct --host 127.0.0.1 --port 8000
```

If your installed vLLM version uses the older entrypoint:

```powershell
python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --host 127.0.0.1 --port 8000
```

For another machine on the LAN:

```powershell
vllm serve Qwen/Qwen2.5-7B-Instruct --host 0.0.0.0 --port 8000
```

Then AILIS should use:

```text
http://<server-ip>:8000/v1
```

If you set a served name:

```powershell
vllm serve Qwen/Qwen2.5-7B-Instruct --served-model-name ailis-local --host 127.0.0.1 --port 8000
```

then AILIS `高级模型 ID` must be `ailis-local`.

### 4. Check model id

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/v1/models" -Method Get
```

Use the returned model `id` as AILIS model ID.

### 5. Test vLLM outside AILIS

```powershell
$body = @{
  model = "Qwen/Qwen2.5-7B-Instruct"
  messages = @(@{ role = "user"; content = "Say OK." })
  temperature = 0.7
  stream = $false
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/v1/chat/completions" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

If this fails, check vLLM logs, GPU memory, model download, firewall, and the model id.

### 6. Fill AILIS

- 服务商: `vLLM 本地 / 局域网`
- 模型: choose the same model id shown by `/v1/models`
- API Key: leave empty by default
- 高级 Provider: `vllm`
- 高级 API Base: `http://127.0.0.1:8000/v1`
- 高级模型 ID: `Qwen/Qwen2.5-7B-Instruct` or your `--served-model-name`

Click `测试连接`. AILIS will call `{API Base}/chat/completions`.

## Authentication

Ollama usually has no API key.

vLLM usually has no API key in local development. If your gateway requires one, set an environment variable before launching AILIS:

```powershell
$env:VLLM_API_KEY = "replace-with-local-vllm-key"
```

AILIS intentionally does not reuse saved cloud API keys for local providers.

## Common Problems

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `needs_config` | model or API Base is empty | select a local preset or fill both fields |
| connection refused | local server is not running or wrong port | start Ollama/vLLM and test with PowerShell first |
| `No WSL distro found` | Windows has WSL command but no Ubuntu/Linux distro | run `wsl --install -d Ubuntu`, finish Ubuntu setup, then rerun one-click |
| `python3 was not found` | WSL/Linux does not have Python | install Python 3.10+ in the WSL distro |
| pip install fails | network, CUDA wheel, or Python version issue | try ModelScope source in China, check Python 3.10+, and keep terminal error text |
| CUDA/GPU error | NVIDIA driver, CUDA runtime, or WSL GPU pass-through is unavailable | check `nvidia-smi` inside WSL/Linux |
| out of memory | model is too large for GPU memory | use a smaller model or add `--max-model-len 4096` / lower `--gpu-memory-utilization` |
| empty response | model loaded but did not return text | try another model or lower temperature |
| 404 on vLLM | API Base missing `/v1`, or full path is wrong | use `http://127.0.0.1:8000/v1` |
| model not found | AILIS model ID does not match server model id | use `ollama list` or `/v1/models` |
| works in terminal but not AILIS | service is in WSL/Docker/LAN and `127.0.0.1` points to the wrong machine | use the reachable host IP and open firewall |

## Recommended Defaults

For a quick local sanity check:

- Ollama: `llama3.2`, timeout `25000ms`, temperature `0.8`.
- vLLM: `Qwen/Qwen2.5-7B-Instruct`, timeout `25000ms`, temperature `0.7`.

For agent/tool workflows, prefer a stronger instruction-following model and test JSON output in the control panel before using it for long runs.
