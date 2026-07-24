# glTF Sample Models：把 3D 资产样例做成渲染器测试清单

`glTF Sample Models` 不是一个应用项目，而是一套长期服务于 glTF 生态的样例资产集合。它的价值不在于复杂代码，而在于把 3D 引擎、Web viewer、资产导入器和渲染管线经常遇到的问题，整理成可以反复验证的模型清单。

本轮只阅读了项目根 README 和 glTF 2.0 样例索引 README。项目 README 也说明，这个旧仓库已经归档，后续 issue 和 pull request 应转到新的 `glTF-Sample-Assets` 仓库。因此，更适合把它看作一份历史稳定、便于回归测试的样例目录，而不是新的贡献入口。

## 三种打包形态对应三类风险

根 README 先把 glTF 资产的几种常见形态讲清楚：分离资源的 `.gltf`、嵌入 Data URI 的 `.gltf`，以及单文件二进制 `.glb`。

这对工程实践很重要。分离资源适合调试，因为 JSON、buffer、贴图文件都能独立检查；但它要求导入器正确处理相对路径和文件组合。Data URI 版本便于把资源嵌在一个 JSON 文件里，但体积和可读性会变差。`.glb` 则适合分享和分发，因为纹理、网格和场景数据被打包进一个容器，但调试时更依赖工具链。

如果一个引擎只用单一格式自测，很容易漏掉资源解析、路径编码、buffer 对齐、图片加载和分发打包的问题。这个仓库的意义，是把这些差异提前暴露出来。

## 从最小三角形到完整 PBR 展示

glTF 2.0 索引把模型分成 Core 和 Extensions 两大部分。Core 里又有 Showcase、Standard、Feature Tests 和 Minimal Tests。

Minimal Tests 很适合作为加载器的第一层验收：最简单的三角形、带索引的三角形、动画三角形、多个 scene、简单 morph、sparse accessor、简单 skin、camera、插值测试，以及包含 Unicode 名称的样例。它们目标很窄，适合定位“到底是 JSON 解析、accessor、animation、skin 还是命名路径出了问题”。

Standard 和 Showcase 则更接近真实资产。`Box`、`Box Textured`、`Animated Cube`、`Rigged Simple`、`Cesium Man`、`Sponza`、`Damaged Helmet`、`Boom Box` 等样例覆盖了纹理、动画、层级、skin、PBR 材质、法线贴图、遮蔽贴图、emissive 贴图和室内光照测试等场景。对渲染器来说，这些不是展示素材，而是一组逐步加压的验收台阶。

Feature Tests 更像诊断工具箱：alpha blend、金属粗糙度球、morph target、多 UV、负缩放、切线与法线、方向、递归骨骼、纹理坐标、线性插值、双面材质、顶点色等。每个样例都针对一小块渲染或导入行为，适合在引擎回归测试时快速确认改动是否破坏了已有能力。

## 扩展样例让能力边界更清楚

扩展区覆盖了 material variants、transmission、volume、sheen、specular、iridescence、clearcoat、punctual lights、unlit、texture transform 等特性。它们对工程项目的提醒是：glTF 导入器不能只回答“能不能打开文件”，还要回答“遇到扩展时如何声明支持、如何降级、如何暴露给材质系统”。

例如，透明、体积、折射率、清漆和布料 sheen 都不是普通 base color + metallic roughness 能完全表达的材质。如果引擎暂时不支持某个扩展，也应该在资产报告或诊断面板里明确说明，而不是静默渲染成错误外观。

## 对本地引擎项目的实际用法

对 2D/3D 引擎、资产管线或渲染工具来说，这个仓库可以被当成一份测试路线图：

- 先用 Minimal Tests 验证 JSON、buffer、accessor、mesh、scene 和 animation 的最小闭环。
- 再用 Standard 样例覆盖纹理、节点层级、skin、动画和常见 PBR 材质。
- 然后用 Feature Tests 定位 alpha、切线、UV、morph、sparse accessor、负缩放和 Unicode 名称等边缘行为。
- 最后用 Extensions 样例决定哪些 glTF 扩展进入正式支持范围，哪些只做诊断提示。

这比“随便找几个模型试试看”更可靠。样例本身已经按能力分层，工程团队可以把它映射成导入器验收清单、渲染回归列表、资产报告模板和发布前兼容性检查。

## 发布和使用边界

这个项目包含大量第三方样例资产。根 README 提醒每个模型目录里的 README 会说明许可信息，因此实际复用模型时必须逐个确认 license。自动博客不应该重新打包、上传或发布这些模型文件，也不应该把本地副本当成可直接分发的资源库。

更稳妥的做法，是在文章和工程文档里引用它作为测试集合思路：说明哪些能力可以用哪些类型的样例验证，真正需要使用或分发模型时，再回到官方当前仓库和具体模型许可中确认。

## 小结

`glTF Sample Models` 的价值，是把 3D 资产兼容性问题变成一张清楚的测试地图。它让导入器先从三角形走到动画、skin、PBR、材质扩展和边缘案例，再让渲染器用同一组样例反复检查回归。

对正在建设引擎、资产管线或可视化工具的项目来说，这类样例库不只是演示资源，更是一套可执行的质量标准。
