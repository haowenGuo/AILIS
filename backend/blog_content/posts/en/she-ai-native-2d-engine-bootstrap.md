# SHE: Building an AI-Readable Bootstrap for a 2D Engine

The most interesting thing about SHE today is not that it already has a complete renderer, physics system, or editor. It is more specific than that: the project is deliberately turning a small 2D game engine into a compileable, readable, replaceable skeleton before the heavy systems arrive. The README describes the current stage as an architectural skeleton whose first milestone is to make ownership boundaries, module responsibilities, and workflow obvious.

This note is based only on low-risk material: `README.md`, the root `CMakeLists.txt`, and public documentation under `docs/`. It does not inspect implementation internals, publish local machine paths, distribute binaries, or expose private configuration.

## Start With Project Boundaries

SHE's directory layout is designed for teaching and collaboration. `Engine/` contains reusable runtime modules, `Game/` contains concrete gameplay that depends on the engine, `Tools/` contains non-shipping utilities such as the sandbox app, and `Tests/` contains smoke tests for the bootstrap architecture. That split keeps engine code, game code, tooling, and validation from collapsing into one undifferentiated demo.

The root `CMakeLists.txt` reinforces that shape. The project is organized as a C++ CMake build with separate `Engine` and `Game` targets, plus options for the sandbox executable and smoke tests. SHE is therefore not starting as a monolithic sample that will be modularized later. It treats build targets as part of the architecture from the beginning.

That matters in practice. When a new capability is added, the project can ask a concrete question: which module owns this, does it need to become a runtime service, and does it introduce a new dependency edge? If those answers are unclear, the change is probably not ready to land.

## Runtime Services Are the Spine

`docs/ARCHITECTURE.md` frames SHE as an AI-native 2D engine architecture. Its spine is not a specific middleware library. It is a set of stable runtime service contracts for windowing, assets, scenes, reflection, data, gameplay, rendering, physics, audio, UI, scripting, diagnostics, and AI context export.

This is an interface-first route. Phase 1 uses placeholder or null implementations so the repository can compile, run smoke tests, and demonstrate sequencing. The planned production stack comes later: SDL3 for platform/input, OpenGL for the first 2D renderer, EnTT for ECS, Box2D for physics, miniaudio for audio, yaml-cpp for scene and gameplay data, Dear ImGui for debug tools, and Lua behind a stable scripting host. The docs do not pretend the placeholder services are production systems; they mark the replacement points.

That choice is important for a small engine. Many engine projects begin with "draw a sprite" and then let platform, renderer, input, assets, and gameplay rules leak into one another. SHE takes the opposite route. Gameplay depends on engine contracts instead of middleware APIs. AI context reads stable summaries instead of guessing from scattered files. Diagnostics records a frame story instead of being added only after something breaks.

## AI-Native Is Not a Wrapper

SHE's AI-native design is not just a chat layer around the project. It is embedded into the engine structure.

Several modules carry that idea:

- `Reflection` owns type and feature metadata so tools can know what exists.
- `Data` owns schema-first contracts so gameplay data is not just ad hoc configuration.
- `Gameplay` owns events, commands, and timers behind a stable authoring surface.
- `Scripting` reserves a Lua host boundary for future scriptable gameplay.
- `Diagnostics` records frame phase traces so behavior can be reviewed.
- `AI` exports authoring context covering scene state, assets, types, features, schemas, scripts, and recent diagnostics.

The point is to reduce guessing. An AI agent that only sees scattered source files can easily infer the wrong dependency direction or edit the wrong layer. If the engine can export a stable authoring context, and if gameplay features register metadata and schemas, AI collaboration becomes closer to reading system facts than relying on a narrow context window.

## The Roadmap Does Not Start With Rendering

`MODULE_PRIORITY.md` puts the first wave on Gameplay Core, Data Core, and Diagnostics + AI Context rather than Renderer2D. The reason is direct: SHE is trying to validate AI-native gameplay authoring, not merely get pixels on screen as quickly as possible.

That does not mean rendering is unimportant. `TECH_STACK.md` already lays out OpenGL as the first practical 2D renderer path, alongside future SDL3, EnTT, Box2D, miniaudio, yaml-cpp, Dear ImGui, and Lua integration. The priority document simply places renderer work after gameplay/data/diagnostics because those contracts are harder to change later and more central to AI-assisted development.

`MILESTONES.md` follows the same sequence. M1 is the Gameplay Authoring Core. M2 is Scriptable Gameplay. M3 stabilizes the world model. M4 moves toward a playable runtime. The final proof is a vertical slice game that uses the official gameplay, data, diagnostics, and AI-native workflows. That route is slower than building visuals first, but it is more controlled for an engine intended to be maintained by both humans and AI workers.

## Multi-Codex Workflow Is Part of the Architecture

SHE's documentation does not stop at runtime modules. It also defines how multiple Codex sessions should collaborate. `MULTI_CODEX_WORKFLOW.md` asks each Codex to own a workstream rather than a random set of files. A `W00` integration workspace owns the shared task board, status ledger, and integration report. Every workstream is expected to return a handoff with changed files, interface changes, tests, risks, and recommended next steps.

That process is connected to the engine design. Parallel AI work is only useful when module boundaries are clear. Integration only works when acceptance criteria are explicit. `ACCEPTANCE_CHECKLIST.md` turns that into concrete checks: module ownership, dependency direction, architecture docs, tests, AI-visible context, diagnostics, and handoff quality all have to be inspectable.

So SHE's "AI-native" direction includes both runtime visibility and development workflow. The engine should expose enough structure for AI tools to understand what is happening, and the project process should let several AI workers divide, hand off, and integrate work without hidden assumptions.

## Summary

SHE currently looks like a 2D engine project with the stakes placed early: C++20 and CMake provide the build skeleton, runtime services define module contracts, schemas/reflection/diagnostics/AI context make the system legible, and milestones plus multi-Codex workflow divide future work into manageable streams.

It is not a finished engine, and it should not be described as one. The more accurate view is that SHE is turning a future 2D game engine into a compileable, explainable, collaborative framework first. The value of this phase is not feature count. It is whether later features can grow along clear boundaries without forcing an architecture rewrite.
