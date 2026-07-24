# HaoRender-GPU：从 CPU 渲染经验走向现代 RHI 架构

HaoRender-GPU 是一个很典型的“不要在旧系统上硬堆新能力”的项目。

它不是直接改造已有的 HaoRender CPU 渲染器，而是单独开出一条 GPU 实时渲染工程主线。这个决定很重要：CPU 软件渲染器已经有自己的稳定成果，而现代 GPU 渲染会引入完全不同的架构边界、资源模型和调试方式。如果把两者强行揉在一起，很容易让旧系统变重，也让新系统背上历史包袱。

这篇文章基于本机项目 `F:\HaoRender-GPU` 中的 README、CMake 配置、架构文档和路线图整理，记录它目前最值得写下来的工程思路。

## 为什么要单独启动 GPU 项目

HaoRender-GPU 的 README 里给了一个清楚的定位：

- 旧 `HaoRender`：稳定 CPU 渲染器、桌面工具、已有成果沉淀
- `HaoRender-GPU`：面向 OpenGL、Vulkan、Direct3D 的现代 GPU 渲染架构实验与产品化演进

这不是简单的技术栈替换，而是工程边界重划。

CPU 渲染器更适合学习光栅化原理、图形管线细节和软件级控制。GPU 渲染器则要面对窗口系统、交换链、命令提交、Shader 编译、显存资源、同步机制和调试工具。两者当然有关联，但不是同一个工程问题。

所以这个项目的原则是：复用经验，不复用包袱。

可以复用的是渲染经验、资源组织思路、材质参数设计经验、调试与 profiling 方法。暂时不建议直接照搬的是旧 CPU 光栅主干、旧 shader 主逻辑和旧 Qt 渲染链路。

## 当前项目已经打通了什么

从 README、CMake 和路线图看，HaoRender-GPU 已经完成了一个很健康的启动状态：

- 独立项目目录
- 顶层 README
- 架构说明文档
- 路线图文档
- CMake 工程
- GLFW 接入
- OpenGL 依赖接入
- GLAD 静态库
- 空窗口 sample
- OpenGL triangle sample

当前样例包括：

- `haorender_gpu_glfw_window`
- `haorender_gpu_opengl_triangle`

这两个样例的意义不在于画面复杂，而在于它们验证了第一阶段最基本的图形应用闭环：窗口创建、主循环、OpenGL 上下文、shader、VBO/VAO 和第一张图。

对渲染引擎来说，第一张三角形有时候比很多“宏大架构图”更重要。因为它证明工具链、窗口库、上下文和编译链真的能跑起来。

## RHI 是这条路线的中枢

HaoRender-GPU 的核心目标不是只做一个 OpenGL Demo，而是逐步建立 RHI，也就是 Render Hardware Interface。

RHI 的价值在于让上层渲染系统不要直接绑定某一个图形 API。

架构文档给出的推荐分层是：

```text
Editor / App
    ↓
Scene / Asset / Material
    ↓
Renderer
    ↓
RenderGraph
    ↓
RHI
    ├─ D3D12
    ├─ Vulkan
    └─ OpenGL
    ↓
Platform
```

这个分层很像现代游戏引擎和渲染器的核心组织方式。

Scene、Asset、Material 和 Renderer 属于上层逻辑；D3D12、Vulkan、OpenGL 属于后端实现；RHI 负责把两者隔开。这样以后想切换后端、做调试视图、做 RenderGraph 或接入编辑器，就不会每一步都被某个具体 API 卡死。

## 为什么优先对齐 D3D12 / Vulkan

架构文档里有一个判断很关键：抽象应该优先对齐 D3D12 / Vulkan 的显式资源与命令模型，再让 OpenGL 做兼容适配，而不是反过来。

这个判断很正确。

OpenGL 更容易快速出图，但它隐藏了很多现代 GPU 编程必须面对的问题。D3D12 和 Vulkan 更显式，也更接近现代引擎要管理的真实资源模型：

- Device
- Queue
- Swapchain
- CommandList
- Fence / Semaphore
- Buffer / Texture
- ShaderModule
- Pipeline
- DescriptorSet / BindGroup

如果 RHI 先按照 OpenGL 的心智模型设计，后面适配 D3D12 和 Vulkan 会很痛苦。反过来，如果先接受显式 API 的复杂度，再把 OpenGL 当成兼容路径，长期更稳。

## 路线图的节奏

当前 ROADMAP 很清楚地分成几个阶段：

- Phase 0：项目启动
- Phase 1：Platform + First Window
- Phase 2：Backend Spike
- Phase 3：Minimal RHI
- Phase 4：First Real Renderer
- Phase 5：Lighting and Shadow
- Phase 6：Tooling and Editor

我认为这里最好的地方是没有一上来就做编辑器大界面，也没有直接追求 PBR、阴影、后处理和 GPU Driven。

渲染项目最容易犯的错是：三角形还没稳定，就开始写材质面板；资源生命周期还没想清楚，就开始堆效果。HaoRender-GPU 目前的路线是先打通最小闭环，再做抽象，再做真实渲染，这个顺序很稳。

## 工程化细节

从 CMake 配置看，项目使用 C++20，并且已经把几个样例独立成可执行目标：

- `haorender_gpu`
- `haorender_gpu_glfw_window`
- `haorender_gpu_opengl_triangle`

OpenGL 通过 `find_package(OpenGL REQUIRED)` 引入，GLFW 从本机源码目录作为子项目加入，GLAD 被编译为静态库。MSVC 下打开 `/W4 /permissive-`，非 MSVC 下打开 `-Wall -Wextra -Wpedantic`。

这些细节说明项目不是只写了一个临时 demo，而是在向可维护工程靠拢。

不过后续如果要公开分发，还需要处理一个问题：当前 GLFW 路径是本机绝对路径。它适合本机开发，但公开给别人时，最好改成可配置依赖、子模块、包管理器或文档化的依赖下载步骤。

## 源码和安装包

当前这篇文章只记录工程状态，不自动打包或上传本机源码。

HaoRender-GPU 还处在架构启动和样例验证阶段，最适合公开的不是安装包，而是：

- README
- 架构图
- Roadmap
- OpenGL triangle 截图
- 构建命令
- 后续 milestone 记录

等 D3D12 / Vulkan 最小样例和 Minimal RHI 完成后，再考虑整理 Release 会更合适。

## 下一步

我认为 HaoRender-GPU 接下来最值得推进的事情有三件：

1. 把 GLFW、本机工具链路径这类依赖配置进一步标准化。
2. 完成 D3D12 或 Vulkan 的最小 triangle，验证显式 API 路线。
3. 开始抽最小 RHI，但只抽已经被两个后端验证过的对象。

HaoRender-GPU 当前最有价值的地方，不是已经做出了多复杂的画面，而是它选对了边界：旧项目保稳定，新项目走现代 GPU 架构；先样例闭环，再 RHI，再真实渲染器。

这是一条更慢但更稳的渲染工程路线。
