# AIGL Assistant / HumanClaw

<p align="center">
  <strong>以 AIGL 为核心的桌面优先具身 AI 助手：VRM 角色、HumanClaw 任务执行、自然对话、长期记忆、视觉感知、语音交互和本地 Electron 运行时。</strong>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a>
</p>

---

## 这是什么项目

AIGL Assistant 是当前 AIGRIL 的主线项目。它已经不再只是早期 AIGril 的网页虚拟人或轻量桌宠，而是在向一个个人具身 Agent 系统演进：AIGL 以桌面角色的形式出现，能和用户对话，保留长期上下文，在授权时理解视觉信息，并通过 HumanClaw 运行时执行真实任务。

项目目标有两层：

- 表层体验要像 AIGL 这个角色在桌面上陪用户一起处理事情。
- 底层能力要像本地 Agent Harness 一样稳定，具备工具、权限、审计、记忆、恢复和测试。

一句话：AIGL Assistant 想让任务执行不再像操作开发者控制台，而是像和一个有能力的角色协作。

## 核心系统

| 系统 | 作用 |
| --- | --- |
| 具身桌面外壳 | Electron 窗口体系，包含 VRM 桌宠、聊天窗、控制面板和 Agent Analysis Lab。 |
| AIGL 角色运行时 | VRM 渲染、VRMA 动作、表情、对话气泡、口型、说话状态和风格化渲染。 |
| HumanClaw Gateway | 本地 HTTP/SSE Gateway，默认 `127.0.0.1:19777`，负责 health、工具列表、工具调用、审计、事件流和 agent run。 |
| HumanClaw Agent Runner | 以 LLM 为中心的 Agent Loop，负责对话/任务路由、规划、工具调用、审批恢复、中断和最终回复。 |
| 工具层 | 对齐 OpenClaw 的核心工具，以及 HumanClaw 本地 email、file、code、computer、vision、MCP、tool search、capability manager、artifact verifier。 |
| 人格记忆运行时 | 核心记忆块、用户/项目/关系状态、好感度、secret index、事件记忆、反思方向和控制面板查看。 |
| 视觉层 | 在权限约束下获取屏幕、活动窗口、聊天窗、桌宠窗、控制面板或选区截图，用作只读上下文理解。 |
| 语音层 | 本地 ASR worker，以及浏览器 speech、Kokoro、CosyVoice3、ElevenLabs 风格云 TTS 等多条语音路线。 |
| 控制面板 | 管理 LLM Provider、模型预设、语音、ASR、邮件账号、电脑控制模式、状态目录、记忆和 Gateway 状态。 |
| 评测与验证 | Humanlike eval、长期陪伴场景、HumanClaw 工具测试、Gateway smoke、面向 SWE-bench/GAIA/OSWorld 的脚本。 |

## 设计方向

AIGL Assistant 不是“聊天机器人加工具按钮”，也不是“Agent 平台套一层可爱皮肤”。它的架构边界是：

```text
LLM 负责理解意图。
Memory 负责连续性。
Harness 负责可靠执行。
Tools 负责观察和行动。
Persona Renderer 把运行时事件转成 AIGL 的表达。
Eval 负责发现可靠性、安全和拟人体验偏差。
```

重要原则：

- 表层保持低工具感，不把 `tool_call`、approval id、raw observation 直接丢给用户。
- 执行必须可审计：写文件、跑命令、邮件动作、外部副作用和隐私视觉都要经过策略和审批。
- 记忆用于人格连续性，不作为关键词触发器。
- 语义判断交给带上下文的模型，代码负责 schema、路径、审批、脱敏、超时、事件回放和持久化。
- 保留桌面角色体验，不把所有能力塌缩成控制面板。

## 任务执行链路

HumanClaw 通过本地 Gateway 和 Agent Loop 执行任务，而不是让渲染层直接调用工具。

运行链路：

```text
聊天 / 语音 / 附件
  -> HumanClaw Desktop Chat Service
  -> window.aigrilDesktop.gateway.runAgent()
  -> HumanClaw Agent Runner
  -> HumanClaw Gateway
  -> 本地工具 / OpenClaw 风格工具 / MCP 工具
  -> 结构化事件
  -> AIGL 风格进度与最终回复
```

当前工具面包括：

- `read`、`write`、`edit`、`apply_patch`、`exec`、`update_plan`、`tool_search`、权限请求等核心工具。
- email、file manager、computer/runtime state、code inspection、artifact verifier、vision capture 等 HumanClaw 本地工具。
- MCP bridge 和 capability manager，用于发现、接入和暴露外部工具。
- run、tool start/finish、approval、failure、analysis 的审计日志和 SSE 事件流。

## 桌面体验

打包产品名是 `HumanClaw`。

- 无边框置顶 VRM 桌宠窗口。
- 独立聊天窗，支持日常对话和任务请求。
- 控制面板管理 Provider、语音、记忆、邮件、Gateway 状态和权限。
- Agent Analysis Lab 用于查看、分析和继续 agent run。
- 默认本地状态目录为 `.humanclaw-state`。
- Windows 安装包和便携版通过 Electron Builder 生成。

## 仓库结构

```text
electron/   主进程、HumanClaw Gateway、Agent Runner、工具、记忆、TTS/ASR worker
src/        桌宠、聊天、控制面板、视觉 UI、语音、气泡、角色运行时等渲染端应用
backend/    可选 FastAPI 后端、schema、历史服务、education/Vivix/static assets
Resources/  AIGL VRM 模型、VRMA 动作、动作摄入资源、参考语音素材
docs/       架构、记忆、Gateway、OpenClaw 对齐、评测、benchmark 和工具文档
tests/      HumanClaw runtime、工具、记忆、Gateway、eval、provider、UI helper 测试
scripts/    smoke、validation、benchmark、eval 生成和构建辅助脚本
evals/      AIGL humanlike 与工程评测样例
release/    桌面端 release metadata 和打包产物
```

核心设计文档：

- [具身 Agent 架构](docs/aigl-embodied-agent-architecture.md)
- [记忆架构 V2](docs/aigl-memory-architecture-v2.md)
- [HumanClaw Gateway v0](docs/humanclaw-gateway-v0.md)
- [HumanClaw Agent Runner v0](docs/humanclaw-agent-runner-v0.md)
- [工具生态驱动手册](docs/tool-ecosystem-driver-guide.md)
- [Humanlike Eval](docs/aigl-humanlike-eval.md)
- [OpenClaw From Zero](docs/openclaw-from-zero.md)

## 本地开发

安装依赖：

```bash
pnpm install
```

开发模式启动桌面端：

```bash
pnpm desktop:dev
```

构建并启动桌面端：

```bash
pnpm desktop:start
```

打包 Windows 桌面端：

```bash
pnpm desktop:package:win
```

可选后端：

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 配置

大部分桌面设置都在 HumanClaw 控制面板中完成。项目支持 OpenAI-compatible Provider 和多种模型预设，也支持自定义 base URL、模型名、超时和本地凭据。

API Key、邮箱凭据、记忆状态、下载的语音模型、运行日志、eval 输出和临时 run 状态都属于本机运行数据，不应提交到 Git。

## 验证

常用聚焦检查：

```bash
pnpm test:humanclaw-gateway
pnpm test:humanclaw-agent
pnpm test:humanclaw-runtime
pnpm test:humanclaw-tool-contracts
pnpm test:humanclaw-memory
pnpm test:aigl-humanlike-eval
```

完整 Gateway 验证：

```bash
pnpm humanclaw:validate-gateway
```

拟人体验评测：

```bash
pnpm eval:aigl-humanlike:validate
pnpm eval:aigl-humanlike:generate
pnpm eval:aigl-humanlike:report
pnpm eval:aigl-humanlike:long-term:validate
```

## 隐私与安全

AIGL Assistant 是私人桌面助手，可以在用户本机保存记忆、凭据、本地路径和项目上下文，因此这些内容必须留在本地运行状态里，而不是进入源码仓库。

默认安全策略包括工作区路径守卫、secret 脱敏、高风险动作审批、外部副作用默认 dry-run、工具调用审计。视觉是感知层：截图用于帮助 AIGL 理解上下文，不代表允许它自动点击、输入、购买、发送或提交。

## 当前状态

当前主线是 HumanClaw `1.0.4`，处于活跃开发中。优先级是保持已有桌面运行时稳定，同时继续优化 Gateway 启动可靠性、任务执行、记忆质量、语音/视觉体验、工具合约和评测覆盖。
