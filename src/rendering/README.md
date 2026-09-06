# 角色渲染模块

[index.js](index.js)提供页面使用的公共接口：VRMModelSystem、对话气泡和桌宠鼠标命中测试。

[vrm-model-system.js](vrm-model-system.js)管理场景、模型、相机与绘制；[character](../character)组织角色状态、动作和表情；[pet-app.js](../pet-app.js)将它们接入桌宠页面。

修改渲染时，先验证资源加载和状态变化，再检查实际画面中的动作、遮挡、穿模与帧率。文本、播报和动作数据的衔接见[媒体系统](../../docs/design/media.md)。
