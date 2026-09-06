# Cinematic Wave 皮肤示例

该示例展示 skin_pack 资产包的结构。标识为 ailis.skin.cinematic-wave.v1，资产包版本为 1.0.0。

[manifest.json](manifest.json)指定 ailis_cinematic_rim_toon 渲染 profile，并引用三个配置：

- [render-profile.json](assets/render-profile.json)
- [persona-style.json](assets/persona-style.json)
- [voice-profile.json](assets/voice-profile.json)

包中没有单独的 VRM，使用应用内置角色。资产包运行时负责安装、激活、重置和卸载；测试这些操作时使用独立状态，并验证可以恢复默认外观。

兼容字段和资源声明属于资产包本身。扩展模型、动作或声音时，需要增加对应文件及来源许可。

运行实现：[asset-pack-runtime](../../electron/asset-pack-runtime.cjs)。概念说明：[媒体系统](../../docs/design/media.md)。
