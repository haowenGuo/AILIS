# AILIS Rendering

这里是浏览器侧 3D 角色渲染的公共边界。

- `index.js`：页面入口唯一需要依赖的渲染 API。
- `vrm-model-system.js`：Three.js 场景、VRM 加载、相机、灯光、动画混合和逐帧渲染。
- `../character/`：角色状态机、动作调度、表情、MToon 配置和 Persona Surface 到角色行为的映射。
- `../vrm-model-system.js`：旧路径兼容转发。

页面启动入口是 `../app.js` 和 `../pet-app.js`。完整阅读路线见 [`../../docs/ailis-core-loop-reading-guide.zh-CN.md`](../../docs/ailis-core-loop-reading-guide.zh-CN.md)。
