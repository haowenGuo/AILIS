# 配置与运行隔离

[手册索引与源码基线](README.md) · [入门](getting-started.md)

## 配置源不是一份文件

| 配置层 | 依据 | 生效范围 |
| --- | --- | --- |
| 桌面持久设置 | [store.cjs](../electron/store.cjs) 的 `loadDesktopState`／`saveDesktopState` | Electron 用户目录中的 `desktop-state.json` |
| 桌面路径解析与 IPC | [main.cjs](../electron/main.cjs) | 工作目录、状态目录、本地运行时、控制面板设置 |
| 渲染层配置 | [src/config.js](../src/config.js) | 页面设置与桌面偏好映射，不应另造第二份权威凭据 |
| 模型传输适配 | [desktop-llm-provider.cjs](../electron/desktop-llm-provider.cjs) | provider URL、消息／工具格式、超时、usage |
| Python 服务环境 | [backend/core/config.py](../backend/core/config.py) | `backend/.env`、启动目录 `.env` 和环境变量 |
| 打包产品配置 | [release profiles](../installer/ailis-release-profiles.json) | 构建类型和输出目录，不是用户偏好 |

这里只读源码中的字段定义，不读取或展示你的真实配置与凭据。

## 主模型

控制面板对应字段包括 `llmProvider`、`llmBaseUrl`、`llmModel`、`llmApiKeyProfiles`、`llmTemperature` 和 `llmRequestTimeoutMs`。默认桌面 provider 为 `ailis-cloud`；这是代码默认值，不是在线可用性或免费服务承诺。

当前适配器有 OpenAI-compatible 聊天接口及多个预设、Responses、Anthropic、Gemini、Ollama、vLLM 和 Codex bridge 等传输分支。模型是否支持工具、图片、结构化输出、reasoning 或压缩，取决于具体 provider 和 model；不能因为 URL 能通就假定协议完全兼容。

本地服务配置示例：

| 选择 | 本地 URL 形式 | 仍需确认 |
| --- | --- | --- |
| Ollama | `http://127.0.0.1:11434` | 服务运行、模型已安装、实际工具／视觉能力 |
| vLLM | `http://127.0.0.1:8000/v1` | 模型、chat template、服务参数与硬件 |

这些地址来自适配器默认值，并不证明本机当前有服务。仓库的 `llm:vllm:*` 脚本可能准备环境、下载模型或启动后台进程；先读脚本参数再使用。

不要把已有 `/chat/completions` URL 和不匹配的 Responses provider 混用。切换 provider 后同时核对 URL、model 和凭据，不只改下拉框名称。

## 状态和工作目录

`main.cjs` 的实际规则：

| 数据 | 源码运行默认 | 已打包运行默认 |
| --- | --- | --- |
| 桌面偏好 | Electron `userData/desktop-state.json` | 同样由 Electron `userData` 决定 |
| Agent 状态 | 仓库根 `.ailis-state/` | `userData/.ailis-state/` |
| Gateway 工作目录 | 当前仓库根 | `userData/workspace/` |

`preferences.ailisStateDir` 可覆盖 Agent 状态目录；相对路径按源码根或打包后的 userData 解析。控制面板返回 `ailisResolvedStateDir` 供核对。它不会同时把桌面偏好、所有外部服务、系统临时目录都隔离。

多版本实验前记录：源码路径、commit、可执行文件路径、解析后的状态目录、Session、端口、输出目录。Git worktree 不会自动给每份程序创建独立 Windows 用户、模型账户或 Docker daemon。不要为“解决冲突”直接删除别人正在用的 Session 锁或终止无关进程。

## 视觉、语音和主动交互

- 独立视觉配置为 `visionLlmEnabled`、`visionLlmProvider`、`visionLlmBaseUrl`、`visionLlmModel` 等；默认未启用独立视觉模型。
- 桌面 `speechMode` 有 `off`、`server`、`cosyvoice3`，默认 `off`。
- `recognitionMode` 为 `fast-vad`、`auto-vad`、`continuous`、`manual`；模式不是识别模型是否安装的证明。
- `voiceRuntimeRoot` 影响可选语音资源定位；资源包不随默认 core 包完整提供。
- `autoChatEnabled` 默认 false，`autoChatMode` 默认 off。主动消息与画像整理可能有额外模型调用，评估费用时应单列。

配置细节见 [语音和角色](voice-and-avatar.md)。人格／称呼来自提示与背景偏好，不由 speechMode 决定。

## 权限、门控和隐私

`computerControlEnabled` 控制相关桌面能力。`emberHarnessMode` 为 off／observe／enforce，当前默认 off；不能把“有安全模块”写成“默认每次严格拦截”。运行时权限和审批还需结合请求上下文与工具实现检查。

桌面设置可能包含模型、邮箱和语音服务凭据；长期记忆中的 secret Base64 不是加密。不要提交 `desktop-state.json`、`.env`、用户状态、完整对话或携带凭据的调试日志。提交配置示例时只用占位值。

若审查者需要复现，提供脱敏 provider 类型、model、超时、代码身份和失败码即可；不要先整份复制用户目录。[记忆](memory.md)说明删除与脱敏的限制。
