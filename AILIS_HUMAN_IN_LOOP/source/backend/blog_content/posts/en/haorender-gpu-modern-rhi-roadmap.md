# HaoRender-GPU: From CPU Rendering Experience to a Modern RHI Roadmap

HaoRender-GPU is a good example of a project that chooses not to overload an existing system with a fundamentally different direction.

Instead of directly transforming the existing CPU-based HaoRender renderer, it opens a separate GPU real-time rendering track. That decision matters. A CPU software renderer and a modern GPU renderer share graphics knowledge, but they do not share the same engineering boundaries, resource model, or debugging workflow.

This post is based on the local `F:\HaoRender-GPU` README, CMake configuration, architecture notes, and roadmap.

## Why a separate GPU project exists

The README gives the project a clear position:

- the existing `HaoRender`: stable CPU renderer, desktop tools, and accumulated results
- `HaoRender-GPU`: a new engineering track for modern GPU rendering across OpenGL, Vulkan, and Direct3D

This is not just a technology swap. It is a boundary decision.

A CPU renderer is excellent for learning rasterization, pipeline details, and software-level control. A GPU renderer needs to handle windowing, swapchains, command submission, shader compilation, GPU memory resources, synchronization, and graphics debugging tools. The two directions are related, but they are not the same engineering problem.

That is why the project follows a useful principle: reuse experience, not baggage.

The reusable parts are rendering experience, resource organization ideas, material-parameter design, debugging practices, and profiling habits. The parts that should not be copied directly are the old CPU rasterization core, the old shader logic, and the old Qt rendering path.

## What is already working

From the README, CMake file, and roadmap, HaoRender-GPU has reached a healthy bootstrap stage:

- independent project directory
- top-level README
- architecture notes
- roadmap document
- CMake project
- GLFW integration
- OpenGL dependency setup
- GLAD static library
- empty window sample
- OpenGL triangle sample

The current samples are:

- `haorender_gpu_glfw_window`
- `haorender_gpu_opengl_triangle`

The value of these samples is not visual complexity. They prove the first graphics loop: window creation, main loop, OpenGL context, shader compilation, VBO/VAO setup, and the first rendered image.

For a rendering engine, the first triangle is often more valuable than a big architecture diagram. It proves the toolchain, window library, context setup, and build path can actually run.

## RHI as the center of the roadmap

The goal of HaoRender-GPU is not to build only an OpenGL demo. The project is moving toward an RHI: a Render Hardware Interface.

The value of an RHI is that the upper rendering system does not bind directly to one graphics API.

The architecture notes propose this layering:

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

This is close to how modern engines and renderers are usually organized.

Scene, Asset, Material, and Renderer are upper-level concepts. D3D12, Vulkan, and OpenGL are backend implementations. The RHI sits between them. That separation makes it easier to switch backends, add debug views, build a render graph, or eventually connect an editor.

## Why D3D12 and Vulkan should shape the abstraction

One important point in the architecture notes is that the abstraction should align first with the explicit resource and command model of D3D12 and Vulkan, while OpenGL should act as a compatibility path.

That is the right direction.

OpenGL is easier for fast first output, but it hides many things a modern renderer must eventually manage. D3D12 and Vulkan are more explicit and closer to the real resource model behind modern engines:

- Device
- Queue
- Swapchain
- CommandList
- Fence / Semaphore
- Buffer / Texture
- ShaderModule
- Pipeline
- DescriptorSet / BindGroup

If the RHI is designed around OpenGL first, adapting it to D3D12 and Vulkan later becomes painful. If it accepts the explicit model early and treats OpenGL as a compatibility backend, the long-term architecture is cleaner.

## The roadmap rhythm

The roadmap is split into clear phases:

- Phase 0: Project Bootstrap
- Phase 1: Platform + First Window
- Phase 2: Backend Spike
- Phase 3: Minimal RHI
- Phase 4: First Real Renderer
- Phase 5: Lighting and Shadow
- Phase 6: Tooling and Editor

The best part is what it does not do too early.

It does not start with a large editor UI. It does not jump straight to PBR, shadows, post-processing, or GPU-driven rendering. Rendering projects often fail by building a material panel before the triangle is stable, or by stacking effects before resource lifetime is clear.

HaoRender-GPU takes the steadier path: close the smallest loop, validate backends, extract the RHI, and only then move into real rendering.

## Engineering details

The CMake setup uses C++20 and defines several executable targets:

- `haorender_gpu`
- `haorender_gpu_glfw_window`
- `haorender_gpu_opengl_triangle`

OpenGL is found with `find_package(OpenGL REQUIRED)`. GLFW is added from a local source tree. GLAD is compiled as a static library. MSVC builds use `/W4 /permissive-`, while non-MSVC builds use `-Wall -Wextra -Wpedantic`.

These are small but useful signals. The project is not just a temporary demo; it is already being shaped as a maintainable C++ graphics project.

One future packaging issue is worth noting: the current GLFW source path is a local absolute path. That is fine for local development, but public usage would benefit from a configurable dependency, a submodule, a package manager path, or clear dependency setup documentation.

## Source and packages

This article records the engineering state. It does not automatically package or upload the local source tree.

HaoRender-GPU is still in the architecture bootstrap and sample validation stage. The most useful public artifacts right now would be:

- README
- architecture notes
- roadmap
- OpenGL triangle screenshot
- build commands
- milestone notes

A public release makes more sense after D3D12 or Vulkan minimum samples and the first Minimal RHI are complete.

## Next steps

The next useful steps are:

1. Standardize dependency setup for GLFW and local toolchain paths.
2. Complete a minimal D3D12 or Vulkan triangle to validate the explicit API direction.
3. Start the Minimal RHI only around objects that have been proven by at least two backends.

The most valuable part of HaoRender-GPU right now is not visual complexity. It is the architectural boundary: keep the old project stable, let the new project pursue a modern GPU renderer, validate samples first, then extract the RHI, then build the real renderer.

That is slower than chasing effects, but much more likely to survive as an engine project.
