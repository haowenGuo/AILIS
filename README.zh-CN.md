# AILIS

本手册对应当前源码分支，包含统一 Agent。已有 [v1.4.1 安装包](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.1) 来自 `659bf61`，不包含之后的这些改动；体验新实现请从当前源码启动。历史 Release 保持不变。

AILIS 是一个桌面交互应用，提供文本与语音聊天、工具任务、持久上下文和 VRM 角色。

## 开始使用

项目使用 pnpm 10.33.0。在仓库根目录执行：

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

打开控制面板配置模型服务，即可开始文本交互。视觉、语音和外部工具按需要准备对应依赖。

## 了解项目

- 桌面界面：聊天、桌宠、控制面板、Agent Lab 和区域选择。
- 执行系统：主 Agent、持久 Session、工具调用和运行事件。
- 数据系统：对话记录、预算化背景和工具内容引用。
- 服务入口：可独立运行的 Hosted Node 与 Python API。

[阅读手册](docs/README.md)，或直接进入[桌面指南](docs/guide/desktop.md)、[系统组成](docs/design/system.md)、[开发流程](docs/engineering/development.md)。

[English](README.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 参与开发

参见[贡献约定](CONTRIBUTING.md)、[源码地图](docs/reference/source-map.md)和[许可证](LICENSE)。第三方代码与资源遵守各自条款；账户凭据和个人状态不提交到源码仓库。
