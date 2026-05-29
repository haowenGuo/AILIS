# HumanClaw：把桌宠界面和 OpenClaw 运行时分清楚

HumanClaw 的定位不是“再做一个完整 Agent 平台”，而是把桌面交互层和后端运行时拆清楚：桌面端负责头像、聊天、托盘、控制面板和语音入口，OpenClaw 则负责会话、事件流、工具执行和长任务编排。这个边界让项目更像一个可以贴近用户日常桌面的 assistant frontend。

这篇记录只基于低风险材料：`README.md`、`package.json` 和 `requirements.txt`。它不展开源码细节，不发布本地安装包，也不复述本机绝对路径或私有配置。

## 桌宠是第一交互面

HumanClaw 的第一层体验是桌面宠物。README 描述的核心能力包括透明 VRM 桌面窗口、独立聊天窗口、托盘与控制面板、首次设置向导，以及本地语音输入和语音输出的桌面 glue。换句话说，它先解决的是“AI 助手如何常驻在桌面上”，而不是直接把所有智能逻辑塞进前端。

从 `package.json` 看，前端技术栈很集中：Vite 负责开发和构建，Electron 负责桌面壳，Three.js 和 `@pixiv/three-vrm` 负责 VRM 头像渲染。这个组合适合做可视化桌面伴侣：浏览器技术负责 UI 和渲染，Electron 负责把窗口、托盘、IPC 和本机能力接起来。

这种设计的价值在于降低交互成本。用户不一定总是想打开完整工程平台，但可能需要一个一直可见、可点开、可说话的入口。HumanClaw 把这个入口做成桌面应用，再把较重的 assistant runtime 放到后面。

## 两种后端模式

README 把运行模式分成两条：

- `companion-service`：桌面宠物连接 companion backend，更适合轻量陪伴、对话和非 OpenClaw 场景。
- `openclaw-local`：桌面宠物连接本地 OpenClaw Gateway，由 OpenClaw 负责会话、事件流、工具执行和任务编排。

这个拆分很关键。HumanClaw 是桌面 shell，OpenClaw 是 assistant runtime。前者负责用户看得见、摸得到的体验，后者负责更长链路的任务系统。这样做比把所有能力混进一个进程更容易维护，也给后续替换后端、调试 Gateway 或分发桌面端留下空间。

README 还强调 HumanClaw 不替代 OpenClaw Gateway 或 agent system。这是一条健康的工程边界：桌宠可以做得更好看、更顺手、更适合桌面，但它不必重新实现运行时已有的 session、agent 和 tool orchestration。

## Electron、前端和 Python 能力拼在一起

`package.json` 暴露了桌面侧的工作流：开发模式会同时启动 Vite 和 Electron，桌面启动会先构建静态资源再进入 Electron，打包则走 electron-builder 的 Windows NSIS 和 portable 路线。也就是说，HumanClaw 不是纯网页项目，而是以 Electron 桌面应用作为主要交付形态。

`requirements.txt` 则说明 companion backend 不是空壳。它包含 FastAPI、Uvicorn、SQLAlchemy、Pydantic、LangChain、ChromaDB，以及 soundfile、torch、torchaudio、FunASR、ModelScope 等语音相关依赖。结合 README 中“browser microphone capture -> Electron IPC -> Python worker”的描述，可以看出项目把语音链路和本地 Python 能力作为桌面体验的一部分。

这种前后端组合有一个现实优势：头像、聊天和控制面板可以留在 TypeScript/Electron 世界里，ASR、LLM glue、向量记忆或后端服务可以留在 Python 世界里。两边通过 IPC、HTTP 或 Gateway 连接，职责比单语言全包更清楚。

## 打包策略服务于产品边界

README 提到仓库包含两个相关交付物：HumanClaw desktop app，以及 OpenClaw Runtime installer 的打包壳。这里的表述很谨慎：OpenClaw 相关部分是 runtime packaging 和 launcher layer，不是完整上游 OpenClaw 源码树。

这让分发边界更容易理解。HumanClaw 可以作为桌面应用打包；OpenClaw runtime 可以作为单独运行时包准备；两者之间通过 Gateway 和配置连接。对于用户来说，这意味着可以只使用轻量 companion 模式，也可以在需要工程任务能力时接入本地 OpenClaw。

更重要的是，这种结构避免把“桌面宠物”和“Agent 工程平台”绑死。桌面端可以继续优化窗口、头像、语音和设置流程；运行时可以继续优化 session、tools 和长任务。两条线通过明确协议连接，而不是互相吞并。

## 小结

HumanClaw 最值得记录的点，是它把桌面陪伴体验和 assistant runtime 分成了两个层次：前者解决可见、常驻、可说话的用户入口，后者解决会话、工具和任务执行。`package.json` 体现出它是一个 Electron/Vite/Three.js 桌面产品，`requirements.txt` 则说明它仍然保留 Python 后端、语音和智能服务的扩展空间。

后续如果继续写这个项目，更适合围绕公开材料展开三个方向：桌宠交互如何降低 AI 助手的使用摩擦、Electron 与 Python worker 如何配合本地语音链路，以及 HumanClaw 与 OpenClaw 之间如何通过 Gateway 保持轻量而清晰的边界。
