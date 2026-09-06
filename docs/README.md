# AILIS 手册

AILIS 是一个支持聊天、工具执行、持久上下文和角色交互的桌面应用。手册分为使用指南、系统原理、工程流程和参考资料。

## 使用指南

- [使用桌面应用](guide/desktop.md)：安装依赖、启动、认识界面、文本任务、附件和调试。
- [配置应用](guide/configuration.md)：模型、语音、视觉、权限及状态位置。

第一次使用，从桌面指南开始；完成文本交互后，再启用需要的媒体和扩展能力。

## 系统原理

- [系统组成](design/system.md)：进程、模块与通信。
- [Agent 运行模型](design/agent-runtime.md)：请求、Session、循环、工具和交付。
- [数据与上下文](design/data.md)：执行记录、长期背景、预算和工件。
- [工具系统](design/tool-system.md)：定义、注册、发现、执行与内容契约。
- [语音、视觉和角色](design/media.md)：输入、播放、渲染与资源。

理解实现时，先看系统组成，再沿感兴趣的数据或功能阅读。

## 工程流程

- [开发工作流](engineering/development.md)：定位代码、修改、测试和提交。
- [构建与发布](engineering/distribution.md)：前端目标、源码集合、安装包和验证。
- [服务端运行](engineering/services.md)：FastAPI、Hosted Node 与部署配置。
- [运行观测与评估](engineering/measurement.md)：事件、质量、用量、缓存与时延。

## 参考资料

- [源码阅读地图](reference/source-map.md)：文档基线与实现入口。
- [实现状态记录](reference/implementation-status.md)：特殊行为和待验证项。
- [桌面依赖清单](generated/desktop-runtime.md)：审计工具生成的目录统计。
