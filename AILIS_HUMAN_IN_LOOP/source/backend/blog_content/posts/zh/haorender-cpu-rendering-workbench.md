# haorender：把 CPU 光栅化做成可调试的桌面渲染工作台

haorender 的定位很明确：它不是只用来讲解图形学流水线的课堂 Demo，而是一个面向 Windows 桌面的 C++ CPU 渲染工作台。根据项目的 README 和 CMake 配置，它已经把软件光栅化、材质调试、阴影、性能分析、预设管理和 Qt 桌面界面放到同一个工程目标里。

这篇记录只基于低风险材料：`README.md` 和 `CMakeLists.txt`。它不展开源码细节，也不发布本地包、安装文件或私有路径。

## 从渲染器到工作台

项目的主程序目标是 `myrender`，主体验走 Qt 桌面入口，旧的 OpenCV 原型则保留为对照和轻量参考。这说明 haorender 的重心已经从“跑出一张图”转向“持续调试一个渲染系统”。

README 对工程目标的描述很具体：资产加载要可复现，着色流程要可控，渲染状态要可检查，帧阶段耗时要可测量，最终还要能以桌面软件的方式分发。这些目标让它更像一个小型 look-dev 工具，而不是单个算法实验。

这种定位很重要。CPU 渲染器常见的问题不是缺少功能点，而是每个功能都孤立存在：模型加载、材质、光照、阴影、截图、性能分析分散在不同入口里。haorender 试图把这些能力收进一个可反复使用的工作台，让调参和验证成为日常流程。

## CPU 管线仍是核心

haorender 的核心仍然是 CPU 光栅化。README 中列出的管线包括模型、观察、投影和视口变换，裁剪、背面剔除、z-buffer，以及近相机裁剪和 tile binning。后两项尤其有工程味道：它们不是为了展示概念，而是为了避免巨大的屏幕空间三角形拖垮渲染。

阴影部分也不是单一开关。项目支持 raster shadow maps，并提供 near/far 分层级联、split、blend、extent 和 depth range 等控制项。对于 CPU 渲染器来说，这类参数如果只写在代码里会很难调；把它们接入桌面界面和 profiler，才适合持续开发。

着色系统分成三条路线：

- `Realistic PBR`：包含 IBL、金属度、粗糙度、AO、自发光通道重映射、tone mapping 和线性/sRGB 转换。
- `Stylized Phong`：保留更适合角色和风格化控制的高光、toon-band diffuse、环境光和副光源调节。
- `Programmable Shader`：提供表达式 DSL，可在桌面 UI 中编辑，并带有编译反馈、示例预设和回退保护。

这三个模式覆盖了不同层次的调试需求。PBR 用来靠近真实材质，Phong 用来保留艺术指导空间，DSL 则把 shader 调试变成更短的交互循环。

## Qt UI 让状态可见

README 描述的桌面界面由多个标签页组成：Workspace、Scene、Shading、Lights、Materials 和 Inspect。它们不是装饰性的面板，而是把渲染器内部状态拆成可以操作的工作区。

Scene 面板负责视场角、曝光、法线强度、内部渲染分辨率、背面剔除和阴影参数。Shading 面板负责 PBR、Stylized Phong 和 Programmable Shader 的模式切换。Lights 面板支持最多三个方向光，并开放 yaw、pitch、intensity 和 RGB。Materials 面板让每个 mesh 的材质和贴图绑定更容易检查。Inspect 面板则把 mesh、triangle、vertex 统计、当前分辨率、Embree 可用性、相机状态和帧 profiler 汇总到一起。

这个 UI 设计的价值在于减少“重新编译才能知道”的次数。渲染器开发经常需要比较不同光照、材质、阴影和分辨率组合；如果每次都要改代码或命令行参数，迭代速度会很慢。haorender 把这些控制面集中在 Qt 里，说明它的目标用户是会反复调试、观察和比较结果的开发者。

## 工程边界比较清楚

`CMakeLists.txt` 体现了项目的工程边界：CMake 3.10+、C++17、Qt 5 Widgets、OpenCV、Assimp、Eigen 是主要依赖；OpenMP 用于可用时的多线程渲染；Embree 4 是可选的 CPU ray occlusion 辅助路径。构建选项还包括是否启用 Embree，以及是否用 half precision 存储深度和顶点属性。

这种依赖组合和 README 中的定位一致。OpenCV 保留了原型和图像处理基础，Qt 提供桌面界面，Assimp 负责模型导入，Eigen 支撑数学和 half 类型，Embree 则作为可选的混合路径存在。项目并没有把 Embree 变成主渲染器，而是把 raster pipeline 保持为主体，这让它仍然是一个 CPU 光栅化工作台。

分发方式也偏务实。README 推荐 Windows portable package：把 `myrender.exe`、运行时 DLL、Qt 部署目录、`Resources`、多语言 README、许可证和 NOTICE 放在同一包里。项目还提供 packaging helper 来整理这些内容。对用户来说，这比要求所有人从源码配置依赖更友好；对作者来说，也能把“可以运行的版本”作为工程质量的一部分来维护。

## 小结

haorender 的特点不是某一个单独的渲染算法，而是把 CPU 渲染器做成了一个可观察、可调试、可分发的桌面工作台。它保留软件光栅化的教学和研究价值，同时补上了真实项目里更容易被忽略的部分：材质检查、阴影调参、帧阶段 profiling、会话恢复、预设管理和便携发布。

如果后续继续写这个项目，更适合展开的方向不是源码全文，而是围绕公开材料做专题：例如 CPU raster pipeline 的阶段划分、PBR 与 Stylized Phong 的调试差异，或者 portable package 对桌面渲染工具可用性的影响。
