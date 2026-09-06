# Cinematic Wave 示例皮肤

[manifest.json](manifest.json)声明 `ailis.skin.cinematic-wave.v1`，类型 `skin_pack`，包自身版本 `1.0.0`。这是示例包版本，不是 AILIS 主程序版本。

该包不包含 VRM，沿用内置角色，选择 `ailis_cinematic_rim_toon` 渲染 profile，并引用：

- [render-profile.json](assets/render-profile.json)
- [persona-style.json](assets/persona-style.json)
- [voice-profile.json](assets/voice-profile.json)

加载／安装／激活／卸载由 [asset-pack-runtime.cjs](../../electron/asset-pack-runtime.cjs)实现，会更改资产和激活状态。使用独立状态测试，检查包内路径边界与恢复到默认角色的能力。人格样式属于模型背景配置，不应误认成启用另一个 Persona 模型。

manifest 的 `minAilisVersion: 1.0.6` 是兼容声明，不能当成所有后续版本都已端到端验证的证明。新增 VRM、动作或声音时另行核验许可；此示例不替外部资产授权。

通用说明只在 [语音和角色手册](../../docs/voice-and-avatar.md)维护。
