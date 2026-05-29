# haorender: Turning CPU Rasterization into a Debuggable Desktop Rendering Workbench

haorender has a clear position: it is not just a classroom demo for explaining the graphics pipeline. Based on its README and CMake configuration, it is a Windows-focused C++ CPU rendering workstation that brings software rasterization, material inspection, shadows, profiling, preset management, and a Qt desktop UI into one project.

This note is based only on low-risk project material: `README.md` and `CMakeLists.txt`. It does not inspect source internals, publish local packages, or expose private machine paths.

## From Renderer to Workbench

The primary executable target is `myrender`, and the main user experience goes through the Qt desktop entry point. The older OpenCV prototype remains as a comparison path and lightweight reference. That split says a lot about the project: haorender is no longer about producing one successful image; it is about repeatedly tuning and inspecting a renderer.

The README describes concrete engineering goals: reproducible asset loading, controllable shading workflows, inspectable renderer state, measurable frame-stage performance, and a desktop distribution format. Those goals make the project feel closer to a small look-dev tool than a single rendering experiment.

That distinction matters. CPU renderers often accumulate isolated features: one path for model loading, another for lighting, another for shadows, another for screenshots, and a separate way to inspect performance. haorender tries to pull those activities into a reusable workbench where iteration is part of the design.

## The CPU Pipeline Stays Central

The core is still CPU rasterization. The README lists model, view, projection, and viewport transforms, clipping, back-face culling, z-buffering, near-camera clipping, and tile binning. The last two are especially practical: they exist to prevent huge screen-space triangles from causing pathological rendering cost, not merely to demonstrate a concept.

The shadow system is also more than a single toggle. haorender supports raster shadow maps with near/far layered cascades, plus controls for cascade split, blend, extent, and depth range. For a CPU renderer, those controls are hard to tune if they live only in code. Connecting them to the UI and profiler makes them part of a daily rendering workflow.

The shading system has three routes:

- `Realistic PBR`: image-based lighting, metallic, roughness, AO, emissive channel remapping, tone mapping, and linear/sRGB conversion.
- `Stylized Phong`: hard or soft specular response, toon-band diffuse, and art-directed ambient and secondary light balance.
- `Programmable Shader`: an expression DSL editable from the desktop UI, with compile feedback, example presets, and fallback protection.

Together, these modes serve different debugging needs. PBR moves the renderer toward physically based materials, Phong keeps a direct art-direction path for stylized characters, and the DSL shortens the loop for shader experiments.

## Qt Makes Renderer State Visible

The desktop UI described in the README is organized around Workspace, Scene, Shading, Lights, Materials, and Inspect tabs. These are not decorative panels; they divide renderer state into operational work areas.

Scene controls field of view, exposure, normal strength, internal render resolution, back-face culling, and shadow parameters. Shading switches between PBR, Stylized Phong, and Programmable Shader workflows. Lights exposes up to three directional lights with yaw, pitch, intensity, and RGB controls. Materials shows per-mesh material information and texture bindings. Inspect gathers mesh, triangle, and vertex statistics, current resolution, Embree availability, camera readback, and frame profiler data.

The value of this UI is that it reduces the number of questions that require recompilation. Renderer development often means comparing many combinations of lighting, materials, shadows, and resolution. If every change requires code edits or command-line arguments, iteration slows down. haorender moves those controls into Qt because its target user is expected to observe, tune, and compare results repeatedly.

## The Engineering Boundary Is Practical

`CMakeLists.txt` shows the project boundary clearly: CMake 3.10+, C++17, Qt 5 Widgets, OpenCV, Assimp, and Eigen are the main dependencies. OpenMP is used when available for multithreaded rendering. Embree 4 is optional and acts as a CPU ray-occlusion helper path. Build options also cover enabling Embree and storing depth or loaded vertex attributes in half precision.

That dependency mix matches the README's positioning. OpenCV preserves the prototype and image-processing base, Qt provides the desktop shell, Assimp handles asset import, Eigen supports math and half types, and Embree remains an optional hybrid path. The project does not replace its rasterizer with Embree; it keeps rasterization as the main renderer and adds ray-assisted shadows where useful.

The distribution story is also practical. The README recommends a Windows portable package containing `myrender.exe`, runtime DLLs, Qt deployment folders, `Resources`, multilingual README files, license text, and notices. A packaging helper is provided to collect those pieces. For users, this is friendlier than requiring a full source build. For the project, it treats a runnable desktop package as part of engineering quality.

## Summary

haorender's most interesting quality is not a single rendering algorithm. It is the attempt to turn a CPU renderer into an observable, debuggable, and distributable desktop workbench. It keeps the educational and experimental value of software rasterization while adding the parts that make a renderer usable over time: material inspection, shadow tuning, frame-stage profiling, session restore, preset management, and portable release packaging.

Future articles about this project should continue to stay close to public material. Good follow-up topics would be the stage structure of a CPU raster pipeline, the debugging difference between PBR and Stylized Phong, or how portable packaging changes the usability of a desktop rendering tool.
