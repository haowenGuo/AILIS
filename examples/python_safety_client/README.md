# Python Safety API 示例客户端

这是独立 HTTP 示例，不是桌面统一 Agent 的执行核心。接口在 [backend/AISafety.py](../../backend/AISafety.py)定义，客户端实现是 [client.py](src/ailis_safety_client/client.py)，命令行入口是 [cli.py](src/ailis_safety_client/cli.py)。

## 安装与明确目标

在本目录准备虚拟环境：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install -e .
$env:AILIS_SAFETY_BASE_URL = 'http://127.0.0.1:8000'
.\.venv\Scripts\python.exe -m ailis_safety_client.cli --help
```

客户端源码仍有旧在线地址 fallback；为避免把内容发到意外目标，应在导入模块前设置环境变量，或显式传 `base_url`。它使用 `trust_env=False`，不自动遵循 httpx 的环境代理；也没有通用认证或重试策略。

## 真实调用

确认 [后端](../../docs/backend-and-hosted.md) 已启动且目标获授权后：

```powershell
.\.venv\Scripts\python.exe -m ailis_safety_client.cli check --content 'Please summarize a birthday greeting.'
```

`check` 调用 `/api/safety/check`；`legacy` 调用 `/api/handle`；`batch --file <文本文件>` 使用异步客户端。CLI 不带参数会运行默认联网 demo，不是只打印帮助。

同步类 `AISafetyClient`、异步类 `AISafetyAsyncClient` 与响应模型只提供小型集成范例。HTTP 错误可转为 `AISafetyClientError`；风险标签转换是示例策略，不是安全保证。真实请求会传送待审文本，并可能触发后端模型费用。
