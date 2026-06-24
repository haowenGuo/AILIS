<div align="center">
  <h1>AILIS Assistant</h1>
  <p><strong>开源桌面具身 AI 助手：集成 VRM 角色、实时语音、视觉上下文、记忆系统，以及接近 Codex 工作方式的 Agent Harness。</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.6-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-059669?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

---

## AILIS 是什么

AILIS Assistant 是一个桌面优先的具身 AI 助手项目。它把 3D VRM 角色、Electron 桌面窗口、语音交互、截图视觉上下文、长期记忆，以及结构化 Agent Runtime 放在同一个系统里。

它不只是一个网页聊天机器人。AILIS 的目标是成为真正常驻桌面的个人 AI 助手：可以和用户自然交流，在得到许可时理解屏幕上下文，记住有价值的偏好，并通过可审计、可批准的工具完成实际任务。

## 项目定位

多数 AI 助手项目容易分成两种：一种有角色表现力，但没有稳定执行能力；另一种有自动化能力，却像开发者控制台。AILIS 希望同时保留两边的优势：

- 表层是有存在感、表情、动作、语音和关系感的角色体验。
- 底层是可规划、可路由、可审批、可记录证据、可恢复的 Agent Harness。
- 运行时优先本地桌面，让用户自己的设置、记忆、日志和模型配置留在自己机器上。

## 当前能力

- VRM 桌面角色，支持表情、动作、口型同步和对话气泡。
- Electron 桌宠窗口、聊天窗口、控制面板、托盘集成和本地持久化状态。
- OpenAI 兼容模型提供商配置，支持自定义 base URL 和本地模型工作流。
- 桌面 TTS worker、云端语音路径和可选本地语音识别 worker。
- 基于截图、窗口和区域捕获的权限感知视觉上下文。
- 记忆块、项目上下文、关系状态和轻量反思机制。
- 文件、代码、电脑操作、邮件、MCP 技能、Web/Search 和本地运行时工具层。
- 对文件、应用、账号或外部服务有影响的动作使用显式审批模型。
- 人类化体验评测、工具契约测试、Gateway 检查和 Agent 执行烟测。

## 架构概览

```text
用户 / 语音 / 屏幕
        |
        v
AILIS 桌面 UI
  - VRM 角色
  - 聊天窗口
  - 控制面板
        |
        v
Agent Harness
  - 规划器
  - 工具路由
  - 审批门禁
  - 证据日志
  - 恢复循环
        |
        v
运行时服务
  - 模型提供商
  - 语音 / ASR / TTS
  - 视觉捕获
  - 记忆存储
  - 本地工具 / MCP
        |
        v
验证体系
  - 测试
  - 评测
  - 烟测
```

## 仓库结构

```text
electron/   Electron 主进程、预加载桥、本地运行时服务和工具适配器
src/        桌宠、聊天、控制面板、语音、视觉 UI、气泡等渲染端应用
backend/    可选 FastAPI 后端、API schema、记忆服务和静态资源
Resources/  VRM 模型、VRMA 动作、参考音频和角色资源
docs/       架构、记忆、工具生态、评测和发布规划文档
evals/      人类化体验场景和长期陪伴评测数据
scripts/    运行时准备、验证、烟测、基准测试和打包脚本
tests/      Runtime、Memory、Tools、Contracts、Gateway、Agent 等测试
```

## 快速启动

安装依赖：

```bash
pnpm install
```

以开发模式启动桌面端：

```bash
pnpm desktop:dev
```

构建并启动桌面端：

```bash
pnpm desktop:start
```

打包 Windows 桌面应用：

```bash
pnpm desktop:package
```

可选后端启动：

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 模型与语音配置

AILIS 在应用层不绑定单一模型供应商。可以通过桌面控制面板或本地环境文件配置：

- OpenAI 兼容云端提供商。
- 本地 vLLM endpoint。
- Ollama 方向的本地工作流。
- 自定义 base URL、模型名、请求超时和私有 API Key。
- 可选本地 ASR 和桌面 TTS 运行时准备。

不要把真实 API Key、账号凭证、聊天记录、本地模型缓存、运行日志或生成的评测结果提交到仓库。

## 常用命令

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

完整 Gateway 验证较重，会运行更多 Runtime、契约、工具、记忆、Agent 和烟测检查：

```bash
pnpm ailis:validate-gateway
```

## 核心文档

- [具身 Agent 架构](docs/ailis-embodied-agent-architecture.md)
- [记忆架构 V2](docs/ailis-memory-architecture-v2.md)
- [人类化体验评测](docs/ailis-humanlike-eval.md)
- [工具生态驱动指南](docs/tool-ecosystem-driver-guide.md)

## 项目状态

当前发布线：`v1.0.6`。

AILIS 正在积极开发。它已经具备较完整的桌面运行时、Agent Harness、工具层和评测面，但仍应被视为 alpha 阶段产品/运行时，而不是生产级 Agent OS。近期重点是可靠性：更清晰的工具契约、更安全的审批、更稳定的记忆行为、更顺滑的本地模型配置，以及更高质量的端到端评测。

## 隐私与安全

AILIS 面向个人桌面使用，所以隐私和控制是架构的一部分：

- 视觉捕获需要权限意识，目的是理解上下文，不是静默操作。
- 会影响文件、应用、账号或外部服务的动作应经过显式审批。
- 本地记忆和运行时状态默认留在用户机器上。
- 密钥应放在本地配置中，绝不能进入源码仓库。

## 开源许可

AILIS 源代码采用 [Apache License 2.0](LICENSE) 开源。部分随包资源、第三方模型、动作和语音资源可能有独立许可；重新分发前请确认对应资源说明。
