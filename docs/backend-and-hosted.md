# Python 后端与 Hosted Node

[手册索引与源码基线](README.md) · [部署脚本说明](../deploy/README.md)

## 两个服务，不是同一个进程

| 服务 | 入口 | 默认本地监听／存储 |
| --- | --- | --- |
| FastAPI | [backend/main.py](../backend/main.py) | 手动 uvicorn 示例使用 127.0.0.1:8000；默认数据在 `backend/data/` |
| Hosted Node | [start-ailis-hosted-runtime.cjs](../scripts/start-ailis-hosted-runtime.cjs) | 127.0.0.1:18777；默认 `.ailis-state/hosted/` |

FastAPI 提供 HTTP API 和 Web 会话，可代理到 Hosted Node。Hosted 管理器按租户派生独立状态与附件目录并复用 AILIS Gateway；不是为每个租户启动一个 Electron 桌面。

桌面配置直连模型时，不必启动全部 Python 业务。反之，浏览器 Hosted 请求依赖相应服务与会话，静态 Vite 预览不会自动提供它们。

## Python 启动与副作用

从仓库根准备单独虚拟环境：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

依赖安装可能下载模型／原生库的相关依赖。配置定义在 [backend/core/config.py](../backend/core/config.py)，读取 `backend/.env` 与启动目录 `.env`。自行设置所需模型、数据库与服务凭据，别提交这些文件。

启动 lifespan 会初始化数据库、尝试初始化教学管理员并启动聊天压缩定时任务。因此启动服务不是只读健康检查。`/healthz` 返回 ok 也只证明对应 HTTP 路由响应，不证明模型、数据库业务或 Hosted 全链可用。

## API 分组

[main.py](../backend/main.py)注册聊天、TTS、安全、博客、教学、Vivix、Hosted Agent 和 LLM relay 路由。当前接口详情由运行实例 `/docs` 与各 [backend/api/](../backend/api) 文件决定。

旧聊天及其数据库记忆／压缩服务仍独立存在；它们不是桌面 `session-context` 的另一个写者，也不能把它们的提示格式和短期记忆阈值当成桌面统一 Agent 配置。Python `SYSTEM_PROMPT` 的旧动作标签尤其不能用来解释全部桌面角色行为。

## Hosted 设置

Node 环境变量由 [启动器](../scripts/start-ailis-hosted-runtime.cjs) 与 [管理器](../electron/ailis-hosted-runtime.cjs)读取：

| 名称 | 用途 |
| --- | --- |
| `AILIS_HOSTED_RUNTIME_HOST`／`AILIS_HOSTED_RUNTIME_PORT` | 监听地址与端口 |
| `AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN` | 内部请求头 `x-ailis-internal-token` 校验 |
| `AILIS_HOSTED_DATA_ROOT` | 租户数据根，隔离实验须单独指定 |
| `AILIS_HOSTED_MAX_ACTIVE_TENANTS`／`AILIS_HOSTED_IDLE_TTL_MS` | 活跃租户数和空闲回收 |
| `AILIS_HOSTED_ATTACHMENT_MAX_BYTES`／`AILIS_HOSTED_TENANT_ATTACHMENT_MAX_BYTES` | 单附件和租户附件限额 |
| `AILIS_HOSTED_ATTACHMENT_TTL_MS` | 附件保留期 |

Python 侧的 `AILIS_HOSTED_RUNTIME_URL`、`AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN` 等必须与 Node 对齐。主模型配置还需检查服务实际传入的 llmSettings，不要假定它自动继承某个正在运行的桌面窗口。

在受控环境、配置完成后用 `pnpm ailis:hosted-runtime` 启动 Node；该命令会创建服务和持久状态，不属于离线 lint。

## 公开暴露前的安全边界

- Node 内部 token 为空时，`authorize` 直接放行；`/health` 还在鉴权前处理。不要把默认本机服务原样暴露公网。
- 配置 HTTPS、访问控制、内部凭据、限流和合适的代理边界；不要依赖前端隐藏按钮保护 API。
- Python 默认 DEBUG=true，含教学开发默认值；发布前检查管理员初始化、密码／会话 secret、CORS 和 relay 限额。
- 租户目录用哈希命名不等于容器隔离或访问控制已经充分；仍需审查工具能力、运行用户与文件权限。
- 附件、聊天、模型请求与服务器日志可能含隐私；明确保留期、备份和删除路径。

## 已知部署衔接差异

旧 Web 发布脚本和域名 Nginx 模板面向 `Test/index.html` 演示入口。默认 `pnpm build` 现已不含它。要部署网站首页或演示，先决定产品入口并核对产物／路由，不要照搬旧“一键上线”说明。详见 [deploy/README](../deploy/README.md)。
