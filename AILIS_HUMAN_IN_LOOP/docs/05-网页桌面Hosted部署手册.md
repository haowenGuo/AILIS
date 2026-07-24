# 05｜网页、桌面与 Hosted 部署手册

## 1. 四种运行形态

| 形态 | UI 所在 | Agent/Memory/Tool 所在 | 适用 |
| --- | --- | --- | --- |
| Vite 开发网页 | 本机浏览器 | Hosted/后端或受限浏览器能力 | 前端开发 |
| Electron 桌面 | Electron renderer | 本机 Electron 主进程 | 完整桌面与本地工具 |
| 静态网页 + Hosted Runtime | GitHub Pages/阿里云 | Node 服务器 | 网页体验版完整 Agent |
| FastAPI 后端模式 | 浏览器/客户端 | `backend/` Python 服务 | 兼容/独立后端场景 |

“去掉 Electron 变成网页”只去掉 UI 宿主，不能把 Node/OS 能力直接搬进浏览器。
完整能力应留在 Hosted Runtime，以 API/SSE 连接。

## 2. 本地安装

以仓库 lockfile 为准：

```powershell
pnpm install --frozen-lockfile
```

若只做阅读，`AILIS_HUMAN_IN_LOOP/source/` 不要求安装；若要运行/测试，应在正式仓库
根目录安装，以免在固定快照中产生 `node_modules`。

## 3. Web 开发与构建

```powershell
pnpm dev
pnpm build
pnpm preview
```

- `dev` 启动 Vite。
- `build` 执行 Vite 并复制静态资产。
- `preview` 验证生产构建行为。

构建时重点确认：

- Vite `base` 与 GitHub Pages 子路径 `/AILIS/` 是否一致；
- `Test/` 页面使用的是相对路径还是根路径；
- VRM、VRMA、图片、模型和 worker 文件是否进入产物；
- Hosted API URL 是否从安全配置读取；
- cache-bust/version 是否让浏览器拿到新 JS；
- CSP/CORS/HTTPS 是否允许 API、SSE、音频和模型资源。

## 4. Electron 开发与发行

```powershell
pnpm desktop:dev
pnpm desktop:start
pnpm desktop:package:win
```

- `desktop:dev` 同时启动 Vite 和 Electron。
- `desktop:start` 先构建再启动。
- Windows 默认 package 走 lite profile。
- voice profile 会先准备离线语音运行时。

发行包由 `electron-builder.yml` / `electron-builder.voice.yml` 定义。审查：

- `main` 与 preload 是否打包；
- asar/unpacked 资源路径；
- VRM/voice/model 大文件；
- runtime pack 是内置、旁加载还是首次下载；
- Windows 协议、图标、安装器和 portable 行为；
- state/data 目录是否与安装目录分离。

## 5. Hosted Runtime

开发入口：

```powershell
pnpm ailis:hosted-runtime
```

真实启动参数、端口和环境变量以
`scripts/start-ailis-hosted-runtime.cjs` 及部署脚本为准。Hosted 需要装配与桌面一致的：

- System TaskAgent Harness；
- Agent Runner；
- Context/Memory/Prompt；
- Gateway 与允许的 server tools；
- Persona Renderer；
- session/run/event 持久化；
- health/readiness 和 HTTP/SSE 边界。

服务器不能假定拥有桌面窗口、Web Speech 或本地用户 workspace；这些能力必须由
Hosted adapter 明确实现或声明 unsupported。

## 6. GitHub Pages

体验地址对应仓库的 Pages 子路径。更新流程要分别处理：

1. `main`：源码与文档真源；
2. Pages 发布分支/Action：静态构建产物；
3. Hosted API：服务器运行时代码；
4. 浏览器缓存：确认资源指纹或 cache-bust。

只 push `main` 不保证 Pages 自动更新，除非仓库 Action 明确从 main 构建部署。
验证时在 DevTools Network 看实际 JS 响应 URL、status、content hash 和 API base。

## 7. 阿里云 Hosted

一个完整更新通常分两部分：

- 静态站点：HTML/CSS/JS/VRM 资源；
- Hosted Runtime：Node 服务、环境变量、state 路径、反向代理和进程管理。

部署后至少验证：

```text
GET 页面                 → 200
GET 静态 JS/VRM          → 200 且版本正确
GET health               → 200
GET/POST runtime status  → ready
真实 chat turn           → progress + final
真实 tool smoke          → 按 Hosted 权限成功
TTS                       → 选定 voice 实际发声
口型                      → speaking 开始/停止，无残留
```

反向代理 SSE 时要关闭不当缓冲并设置足够超时，否则页面看似“卡住”但 Agent 仍在服务器跑。

## 8. Node Hosted 与 Python Backend 的选择

不要同时修改两套后端后只验证其中一套。确认依据：

- 网页 `apiBase` 指向何处；
- health 响应标识哪个 runtime；
- 服务器进程命令；
- reverse proxy upstream；
- 日志中的 route 和版本；
- chat service 实际选择的 runtime kind。

当前完整 TaskAgent/Memory/Tool 迁移的主路径应以 Hosted Node 核心为准；Python 后端按
实际部署需求保留。

## 9. 运行时组件包

`package.json` 提供：

- `ailis:web-runtime:prepare`
- `ailis:asr-runtime:prepare`
- `ailis:voice-runtime:prepare`
- `ailis:runtime-packs:manifest`
- `ailis:runtime-packs:build:*`

manifest 描述组件与依赖，prepare/build 负责下载、整理或打包。必须校验来源、版本、
哈希、解压目标和 readiness，不要把一个空目录当作安装成功。

## 10. LLM、Voice 与 ASR

LLM 可连接云端 OpenAI-compatible provider、本地 vLLM/Ollama 等；voice 可走 server、
CosyVoice3 或浏览器 native；ASR 是独立组件。三者状态要分开展示。

生产配置原则：

- API Key 只放服务器安全环境/secret store，不进静态 bundle。
- 浏览器 native TTS 的 voice id 是终端本地偏好，不应当成服务器统一语音。
- provider base URL、model、timeout 和 fallback 要可诊断。
- 本地 runtime 启动/下载要有明确进度和失败状态。

## 11. Memory 与服务器状态

Hosted 多用户时，不能简单把所有 session 写进同一个无隔离目录。至少明确：

- tenant/user/session 标识；
- state 根目录；
- memory/raw ledger/task harness 的隔离键；
- 文件权限、备份、保留和删除策略；
- 服务器重启后的恢复；
- 日志/ledger 的敏感信息脱敏。

学习副本不包含任何真实运行时 state。

## 12. 安全检查

- CORS 只允许实际前端 origin。
- HTTPS/WSS/SSE 全程加密。
- API 不信任浏览器传来的 `approved=true` 或任意 workspace path。
- 静态页面不包含 server API key。
- Tool permission profile 在服务器重算。
- 上传文件隔离、限大小、限类型并清理。
- SSRF、路径穿越、命令注入和 prompt injection 有边界。
- rate limit、run budget、timeout 和取消都生效。
- health 不泄露 secret、绝对敏感路径或完整配置。

## 13. 发布前核对

1. `git status` 只含预期文件。
2. 目标测试和生产 build 通过。
3. commit 推到正确 AILIS remote 的 `main`。
4. Pages 构建/分支真的更新。
5. Hosted 服务更新到同一源码版本并重启成功。
6. 前端返回的版本与服务器版本可见。
7. 清缓存/无痕窗口验证。
8. 桌面与移动布局各测一次。
9. 聊天、TTS、口型、工具、审批、Memory 各做真实 smoke。
10. 保留可回滚的上一版本和部署日志。
