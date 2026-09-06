# 服务端运行

AILIS 提供 Python HTTP 服务和 Node Hosted Runtime。服务端可以复用 Agent 能力，并为浏览器客户端提供接口。

## 进程与职责

FastAPI 入口为 backend.main:app，负责聊天、TTS、安全、博客、教学、Vivix、Hosted Agent 与模型 relay 路由。它使用自己的配置和数据库。

Hosted Node 管理租户的 Gateway、状态目录、附件和事件。客户端通过 HTTP 提交任务，也可以接收事件流。Python 的 Hosted API 可以作为它的前置服务。

## 本地启动 Python

在仓库根创建独立虚拟环境并安装依赖：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

配置由 backend/core/config.py 定义，读取环境变量及 backend/.env、启动目录 .env。启动生命周期会初始化数据库、教学管理员和压缩定时任务。

/docs 提供运行实例的 API 页面，/healthz 提供基础 HTTP 健康响应。模型连接、业务数据库读写和工具能力需要各自验证。

## 配置 Hosted Node

| 环境变量 | 用途 |
| --- | --- |
| AILIS_HOSTED_RUNTIME_HOST / PORT | 地址与端口；默认 127.0.0.1:18777 |
| AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN | 内部请求认证 |
| AILIS_HOSTED_DATA_ROOT | 租户数据根 |
| AILIS_HOSTED_MAX_ACTIVE_TENANTS | 活跃租户限制 |
| AILIS_HOSTED_IDLE_TTL_MS | 空闲回收时间 |
| AILIS_HOSTED_ATTACHMENT_MAX_BYTES | 单附件上限 |
| AILIS_HOSTED_TENANT_ATTACHMENT_MAX_BYTES | 租户附件上限 |
| AILIS_HOSTED_ATTACHMENT_TTL_MS | 附件保留期 |

配置完成后执行 pnpm ailis:hosted-runtime。Python 代理的 AILIS_HOSTED_RUNTIME_URL 和内部 token 需要与 Node 对齐。

Node 提供 /tenant/status、/events/recent、/attachments/upload、/agent/run、/agent/interrupt，以及模型相关接口。运行时按租户建立数据位置和 Gateway；模型设置来自服务请求和服务配置。

## 安全边界

生产部署需要明确监听范围、认证、TLS、代理、限流、工具权限和数据保留期。Node 的内部 token 为空时认证函数直接放行，因此只能在受控环境中使用这一状态；/health 位于认证检查之前。

Python 的 DEBUG、会话与管理员配置应按部署环境设置。租户目录独立不等于系统进程或工具权限完全隔离，仍需限定运行用户和文件访问范围。

## 运维检查

先检查进程与端口，再依次检查代理、认证、模型、附件和工具。日志关联 tenant、Session、run ID，并在导出前脱敏。停止服务前确认活动任务和备份策略，数据迁移应在对应写者停止后进行。

源码：[FastAPI](../../backend/main.py)、[Python 配置](../../backend/core/config.py)、[Hosted API](../../backend/api/hosted_agent.py)、[Node HTTP](../../scripts/start-ailis-hosted-runtime.cjs)、[租户管理](../../electron/ailis-hosted-runtime.cjs)。
