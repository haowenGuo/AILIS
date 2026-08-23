# AILIS 快速开始

[文档中心](README.zh-CN.md) · [English](getting-started.md) · [系统架构](architecture.zh-CN.md)

本页集中说明桌面开发、当前模型连接、语音运行时、可选后端、打包和基础验证。产品介绍请返回[项目首页](../README.zh-CN.md)。

## 环境准备

- Node.js
- pnpm 10.33，仓库已通过 `packageManager` 固定版本
- 桌面开发需要可运行 Electron 的 Windows 或 Linux 环境

## 启动桌面端

安装依赖并启动开发模式：

```bash
pnpm install
pnpm desktop:dev
```

构建后启动：

```bash
pnpm desktop:start
```

构建 Windows 安装包与便携版：

```bash
pnpm desktop:package
```

## 模型连接

当前发布版使用 AILIS Cloud 连接模型服务，用户无需填写 API Key 即可开始对话。Persona 编排、记忆存储、TaskAgent、审批以及电脑和文件工具仍在用户电脑上运行；完成当前请求所需的模型上下文通过 AILIS 托管服务发送。

### 独立视觉模型

如果主模型不支持图片输入，可在桌面控制面板的“模型账号 → 视觉模型”中单独启用一个多模态模型。AILIS 只在 TaskAgent 需要查看桌面时截图；视觉模型将截图转换为文字观察，再交给主模型规划后续操作。视觉模型 Key 与主模型 Key 分开保存。

开发环境也可以使用独立环境变量覆盖本机配置，密钥不要写入仓库：

```powershell
$env:AILIS_VISION_ENABLED="true"
$env:AILIS_VISION_PROVIDER="openai-compatible"
$env:AILIS_VISION_BASE_URL="https://provider.example/v1"
$env:AILIS_VISION_MODEL="your-vision-model"
$env:AILIS_VISION_API_KEY="<local-secret>"
$env:AILIS_VISION_REQUEST_TIMEOUT_MS="60000"
```

使用本地 Ollama 时，Provider 设为 `ollama`，Base URL 通常为 `http://127.0.0.1:11434`，模型必须明确支持图片输入。控制面板的“测试视觉”会发送一张最小测试图片验证真实能力，测试结果不会显示 API Key。

## 语音运行时

准备可选桌面语音运行时：

```bash
pnpm ailis:voice-runtime:prepare
```

仅准备 ASR：

```bash
pnpm ailis:asr-runtime:prepare
```

语音资源体积较大，普通开发和文字交互不要求预先安装完整语音包。

## 可选后端

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 基础验证

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

完整 Gateway 验证会运行更多 Runtime、契约、工具、记忆、Agent 和烟测检查：

```bash
pnpm ailis:validate-gateway
```

## 仓库结构

```text
electron/   Electron 主进程、预加载桥、本地运行时服务和工具适配器
src/        桌宠、聊天、控制面板、语音、视觉 UI 与气泡
backend/    可选 FastAPI 后端、API schema、记忆服务和静态资源
Resources/  VRM 模型、VRMA 动作、参考音频和角色资源
docs/       架构、记忆、工具、评测与发布文档
scripts/    运行时准备、验证、基准测试和打包脚本
tests/      Runtime、Memory、Tools、Gateway 与 Agent 测试
```

## 密钥与本地数据

不要把 API Key、账号凭证、聊天记录、运行日志或生成的评测结果提交到仓库。模型可见的对话上下文、工具结果，以及用户允许加入当前请求的图片或文件内容，可能发送给当前模型服务。工具实际执行和持久化记忆数据库默认保留在本机。

## 继续阅读

- 通过[系统架构](architecture.zh-CN.md)理解当前 Runtime。
- 在 [TaskAgent Runtime](taskagent.zh-CN.md) 中跟踪完整执行链。
- 通过[工具运行时](tools.zh-CN.md)了解当前能力。
- 在[评测成绩](evaluation.zh-CN.md)中查看质量与效率数据。
