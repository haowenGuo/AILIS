# backend/blog_content/posts/en/haorender-gpu-modern-rhi-roadmap.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：154
- SHA-256：`4c640d4fb95186eff7a6a4d109f7350bce1decdf149f92454c419e8c60de24ee`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/posts/en/haorender-gpu-modern-rhi-roadmap.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># HaoRender-GPU: From CPU Rendering Experience to a Modern RHI Roadmap</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>HaoRender-GPU is a good example of a project that chooses not to overload an existing system with a fundamentally different direction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>Instead of directly transforming the existing CPU-based HaoRender renderer, it opens a separate GPU real-time rendering track. That decision matters. A CPU software renderer and a modern GPU renderer share graphics knowledge, but they do not share the same engineering boundaries, resource model, or debugging workflow.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>This post is based on the local `F:\HaoRender-GPU` README, CMake configuration, architecture notes, and roadmap.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>## Why a separate GPU project exists</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>The README gives the project a clear position:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- the existing `HaoRender`: stable CPU renderer, desktop tools, and accumulated results</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- `HaoRender-GPU`: a new engineering track for modern GPU rendering across OpenGL, Vulkan, and Direct3D</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>This is not just a technology swap. It is a boundary decision.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>A CPU renderer is excellent for learning rasterization, pipeline details, and software-level control. A GPU renderer needs to handle windowing, swapchains, command submission, shader compilation, GPU memory resources, synchronization, and graphics debugging tools. The two directions are related, but they are not the same engineering problem.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>That is why the project follows a useful principle: reuse experience, not baggage.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>The reusable parts are rendering experience, resource organization ideas, material-parameter design, debugging practices, and profiling habits. The parts that should not be copied directly are the old CPU rasterization core, the old shader logic, and the old Qt rendering path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>## What is already working</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>From the README, CMake file, and roadmap, HaoRender-GPU has reached a healthy bootstrap stage:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>- independent project directory</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- top-level README</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- architecture notes</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- roadmap document</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- CMake project</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- GLFW integration</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- OpenGL dependency setup</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- GLAD static library</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- empty window sample</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- OpenGL triangle sample</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>The current samples are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>- `haorender_gpu_glfw_window`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- `haorender_gpu_opengl_triangle`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>The value of these samples is not visual complexity. They prove the first graphics loop: window creation, main loop, OpenGL context, shader compilation, VBO/VAO setup, and the first rendered image.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>For a rendering engine, the first triangle is often more valuable than a big architecture diagram. It proves the toolchain, window library, context setup, and build path can actually run.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>## RHI as the center of the roadmap</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>The goal of HaoRender-GPU is not to build only an OpenGL demo. The project is moving toward an RHI: a Render Hardware Interface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>The value of an RHI is that the upper rendering system does not bind directly to one graphics API.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>The architecture notes propose this layering:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 57 | <code>Editor / App</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>    ↓</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>Scene / Asset / Material</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>    ↓</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>Renderer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>    ↓</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>RenderGraph</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>    ↓</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>RHI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>    ├─ D3D12</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>    ├─ Vulkan</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>    └─ OpenGL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>    ↓</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>Platform</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>This is close to how modern engines and renderers are usually organized.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>Scene, Asset, Material, and Renderer are upper-level concepts. D3D12, Vulkan, and OpenGL are backend implementations. The RHI sits between them. That separation makes it easier to switch backends, add debug views, build a render graph, or eventually connect an editor.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## Why D3D12 and Vulkan should shape the abstraction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>One important point in the architecture notes is that the abstraction should align first with the explicit resource and command model of D3D12 and Vulkan, while OpenGL should act as a compatibility path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>That is the right direction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>OpenGL is easier for fast first output, but it hides many things a modern renderer must eventually manage. D3D12 and Vulkan are more explicit and closer to the real resource model behind modern engines:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>- Device</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>- Queue</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>- Swapchain</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>- CommandList</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- Fence / Semaphore</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- Buffer / Texture</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- ShaderModule</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- Pipeline</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- DescriptorSet / BindGroup</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>If the RHI is designed around OpenGL first, adapting it to D3D12 and Vulkan later becomes painful. If it accepts the explicit model early and treats OpenGL as a compatibility backend, the long-term architecture is cleaner.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>## The roadmap rhythm</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>The roadmap is split into clear phases:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>- Phase 0: Project Bootstrap</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- Phase 1: Platform + First Window</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- Phase 2: Backend Spike</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- Phase 3: Minimal RHI</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- Phase 4: First Real Renderer</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- Phase 5: Lighting and Shadow</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- Phase 6: Tooling and Editor</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>The best part is what it does not do too early.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>It does not start with a large editor UI. It does not jump straight to PBR, shadows, post-processing, or GPU-driven rendering. Rendering projects often fail by building a material panel before the triangle is stable, or by stacking effects before resource lifetime is clear.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>HaoRender-GPU takes the steadier path: close the smallest loop, validate backends, extract the RHI, and only then move into real rendering.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>## Engineering details</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>The CMake setup uses C++20 and defines several executable targets:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>- `haorender_gpu`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- `haorender_gpu_glfw_window`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `haorender_gpu_opengl_triangle`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>OpenGL is found with `find_package(OpenGL REQUIRED)`. GLFW is added from a local source tree. GLAD is compiled as a static library. MSVC builds use `/W4 /permissive-`, while non-MSVC builds use `-Wall -Wextra -Wpedantic`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>These are small but useful signals. The project is not just a temporary demo; it is already being shaped as a maintainable C++ graphics project.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>One future packaging issue is worth noting: the current GLFW source path is a local absolute path. That is fine for local development, but public usage would benefit from a configurable dependency, a submodule, a package manager path, or clear dependency setup documentation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>## Source and packages</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>This article records the engineering state. It does not automatically package or upload the local source tree.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>HaoRender-GPU is still in the architecture bootstrap and sample validation stage. The most useful public artifacts right now would be:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>- README</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- architecture notes</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- roadmap</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- OpenGL triangle screenshot</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- build commands</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- milestone notes</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>A public release makes more sense after D3D12 or Vulkan minimum samples and the first Minimal RHI are complete.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>## Next steps</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>The next useful steps are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>1. Standardize dependency setup for GLFW and local toolchain paths.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>2. Complete a minimal D3D12 or Vulkan triangle to validate the explicit API direction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>3. Start the Minimal RHI only around objects that have been proven by at least two backends.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>The most valuable part of HaoRender-GPU right now is not visual complexity. It is the architectural boundary: keep the old project stable, let the new project pursue a modern GPU renderer, validate samples first, then extract the RHI, then build the real renderer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>That is slower than chasing effects, but much more likely to survive as an engine project.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
