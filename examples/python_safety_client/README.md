# Python Safety 客户端

该示例通过 HTTP 调用安全检查接口，提供同步 AISafetyClient、异步 AISafetyAsyncClient 和命令行入口。

## 安装

在本目录建立虚拟环境：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install -e .
$env:AILIS_SAFETY_BASE_URL = 'http://127.0.0.1:8000'
.\.venv\Scripts\python.exe -m ailis_safety_client.cli --help
```

应在导入模块前设置目标地址，或创建客户端时显式传 base_url。默认地址由源码给定；trust_env=False 表示客户端不自动采用 httpx 环境代理。

## 接口

check_content 调用 /api/safety/check，check_content_legacy 调用 /api/handle。客户端解析响应并提供风险字段辅助方法，HTTP 错误转换为客户端异常。

CLI 的 check、legacy、batch 会发送待审文本。先确认服务地址、数据范围及可能的模型费用，再使用真实输入。

实现：[client.py](src/ailis_safety_client/client.py)、[cli.py](src/ailis_safety_client/cli.py)、[API](../../backend/AISafety.py)。
