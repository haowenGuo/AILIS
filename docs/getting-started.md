# 从源码启动

[手册索引与源码基线](README.md) · [配置](configuration.md) · [排错](troubleshooting.md)

## 先确认你要启动哪一份代码

在准备使用的仓库根目录执行：

```powershell
Get-Location
git rev-parse --short HEAD
git status --short
node --version
pnpm --version
```

本手册对应独立工作树的 `00b3244` 源码，不代表另一个工作树或已安装的程序已更新。`package.json` 中的 1.4.1 不足以区分它们。独立工作树隔离源码，但相同用户目录、模型账户、端口、Docker 和构建输出仍可能共享。

## 桌面开发

依赖来源是 [package.json](../package.json) 和 [pnpm-lock.yaml](../pnpm-lock.yaml)。仓库指定 `pnpm@10.33.0`，本地已有验证使用 Node 22.17.1；这是验证组合，不是完整的最低版本兼容承诺。

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

安装会下载依赖并可能运行依赖安装步骤。`desktop:dev` 同时启动 Vite 和 Electron，等待本机 5173 端口后载入页面。`dev` 默认监听 `0.0.0.0`；仅在受信网络开发，不把开发服务器当成公开服务。

若只想验证已构建的桌面入口：

```powershell
pnpm desktop:start
```

它先执行 `build:desktop`，再启动 Electron，不会自动生成或替换已安装的安装包。启动会读写桌面设置与状态，不属于只读检查；多版本并测前请先隔离 [状态目录](configuration.md)。

## 第一次实际对话

1. 打开控制面板，确认主模型的 provider、base URL、model、凭据和超时。桌面默认选择 AILIS Cloud，但能否使用取决于服务与账户；源码也支持其他 provider。
2. 先用文本、关闭不需要的语音和自动聊天，完成一次短问答。模型连接测试会发请求，可能计费。
3. 再用单独的测试目录尝试读文件、运行一个无副作用命令，并检查工具结果是否真的返回成功。
4. 最后启用视觉、ASR、TTS 或外部工具包，逐项确认其依赖。不要把某个可选组件失败误判为主 Agent 完全不可用。

对话可用不等于全部工具可用，也不等于离线可用。模型、网络、MCP、Python 和语音资源有各自的依赖与费用边界。

## 浏览器与桌面不是同一入口

| 命令 | 构建范围 | 用途 |
| --- | --- | --- |
| `pnpm build:desktop` | Agent Lab、控制面板、桌宠、聊天、区域选择五个页面 | Electron 打包前置构建 |
| `pnpm build` | 桌面页面加网站首页 | 网站静态产物；不含 `Test/` |
| `pnpm build:demo` | 加入独立 `Test/index.html` 演示页 | 浏览器演示／兼容旧演示部署链 |
| `pnpm preview` | 服务当前 `dist/` | 静态预览，不会创建 Electron IPC 或本地 Agent |

这些命令共用 `dist/`；后一次构建会改变前一次的产物。桌面打包前必须重新执行 `build:desktop`。依据：[Vite 配置](../vite.config.js)、[生产入口清单](../runtime/production-entrypoints.json)。

## 可选组件

- 本地 ASR：`pnpm ailis:asr-runtime:prepare`。
- 本地 CosyVoice3：`pnpm ailis:voice-runtime:prepare`。
- 本地网页工具运行依赖：`pnpm ailis:web-runtime:prepare`。
- Python FastAPI 与 Hosted Node 服务：见 [后端与 Hosted](backend-and-hosted.md)，不是所有桌面对话的启动前提。

准备命令可能下载大模型和运行时，消耗大量磁盘；先阅读脚本和 [资源包清单](../installer/ailis-runtime-components.json)。不要为了试一次文本对话就执行 `release:all`。

## 最小离线检查

在依赖已经安装的前提下：

```powershell
pnpm audit:production
pnpm test:production
node --test tests/ailis-core-loop.test.mjs tests/ailis-unified-agent.test.mjs
```

这些检查不等于真实模型、桌面 UI、语音或所有扩展工具的端到端验收。`ailis:validate-gateway` 是较大的组合入口，含 smoke 和环境检查，不应当作无副作用的“连接诊断”直接执行。
