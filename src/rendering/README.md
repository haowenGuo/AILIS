# 浏览器侧角色渲染

[index.js](index.js)是公共导出边界，暴露 `VRMModelSystem`、对话气泡事件／安装方法和鼠标命中测试安装方法。

- [vrm-model-system.js](vrm-model-system.js)：场景、VRM、相机、灯光、动画与渲染。
- [../character/](../character)：状态机、动作／表情调度、screenplay 与渲染 profile。
- [../pet-app.js](../pet-app.js)：桌宠页面消费入口。
- [../../Test/app.js](../../Test/app.js)：独立浏览器演示入口，不属于默认桌面包。

角色呈现不是另一个模型改写主 Agent 答案。修改时分别验证正文保持、语音文本和动作映射，并进行实际画面验收；结构测试不能证明没有穿模或掉帧。

配置、资源、许可与验证范围统一在 [语音和角色手册](../../docs/voice-and-avatar.md)维护，不在这里复制第二套架构。
