# 配置应用

控制面板负责编辑设置，Electron 主进程负责保存和解析设置，模型适配器负责将它们转成请求。建议按“主模型 → 工具权限 → 可选媒体”的顺序配置。

## 主模型

| 字段 | 含义 |
| --- | --- |
| llmProvider | 使用哪一种服务协议或预设 |
| llmBaseUrl | 请求发送到的服务地址 |
| llmModel | 服务端识别的模型名称 |
| llmApiKeyProfiles | 保存的凭据配置 |
| llmTemperature | 采样温度，设置默认值 0.8 |
| llmRequestTimeoutMs | 模型请求超时，设置默认值 25000 毫秒 |

这些是设置层默认值；具体运行入口可以传入模型设置，provider 也可能调整支持的参数。默认 provider 是 ailis-cloud，实际使用前需要可用账户或改为自己的服务。

控制面板支持兼容聊天协议、Responses、Anthropic、Gemini、Ollama 以及若干预设和桥接方式。地址、模型和协议需要成组配置；模型的工具与图像能力由服务决定。

连接已有 vLLM 兼容服务时，可使用兼容聊天协议并显式填写服务地址，例如 http://127.0.0.1:8000/v1。Ollama 使用它自己的服务配置，默认地址为 http://127.0.0.1:11434。不要通过直接写入一个未受设置枚举支持的 provider 名称来配置服务；相关迁移行为见[实现记录](../reference/implementation-status.md)。

## 视觉、语音与主动消息

| 设置 | 作用与初始状态 |
| --- | --- |
| visionLlmEnabled | 是否启用独立视觉模型，默认 false |
| visionLlmProvider / visionLlmBaseUrl / visionLlmModel | 独立视觉请求的目标 |
| speechMode | off、server、cosyvoice3，默认 off |
| recognitionMode | fast-vad、auto-vad、continuous、manual，默认 auto-vad |
| voiceRuntimeRoot | 本地语音组件位置 |
| autoChatEnabled | 主动交互开关，默认 false |

视觉请求、语音合成和主动消息可能使用额外服务或额度。设备选择、识别策略和合成音色分别设置；只调整音色不会改变文本模型。

## 任务权限

computerControlEnabled 控制电脑操作能力，设置默认值为 true。工具调用还经过运行请求、工具实现和审批策略的检查。

emberHarnessMode 可取 off、observe、enforce，默认 off。它控制阶段门控的运行方式，不替代其他工具权限。测试写文件、命令、邮件等能力前，应明确它们可操作的目录和账户。

## 设置与工作数据的位置

| 数据 | 源码启动 | 安装包启动 |
| --- | --- | --- |
| desktop-state.json | Electron userData | Electron userData |
| Agent 状态默认目录 | 仓库下 .ailis-state | userData 下 .ailis-state |
| Gateway 默认工作目录 | 仓库根 | userData 下 workspace |

preferences.ailisStateDir 可以覆盖 Agent 状态目录。相对路径在源码运行时相对仓库根，打包运行时相对 userData。ailisResolvedStateDir 返回最终解析结果。

状态目录与工作目录是两个概念：前者保存运行数据，后者用于解析任务中的工作路径。多实例测试还要独立安排 userData、Session、服务端口和输出目录；应用主进程使用 Electron 单实例锁。

## 凭据与数据

设置文件可能含 API、邮箱和语音凭据。以本地操作系统权限保护设置和状态目录，分享配置时使用占位值。发送给模型的消息、附件及工具请求受所配置服务的数据处理规则约束。

数据保存与清除范围见[数据模型](../design/data.md)。

字段和默认值：[store.cjs](../../electron/store.cjs)。路径解析：[main.cjs](../../electron/main.cjs)。传输实现：[desktop-llm-provider.cjs](../../electron/desktop-llm-provider.cjs)。
