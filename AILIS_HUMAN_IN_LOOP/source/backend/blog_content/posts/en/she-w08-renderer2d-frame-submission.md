# SHE W08: Turning Renderer2D into a Clear Submission and Frame Ownership Boundary

The earlier SHE workstreams split gameplay, data, diagnostics, scripting, scene, assets, platform, and input into stable boundaries. W08 Renderer2D moves into the next layer: how does a 2D engine actually show the world?

The point is not to chase complex rendering features immediately. The first job is to make render submission, camera state, sprites, texture/material handles, and frame begin/end ownership explicit. Once that path is stable, physics, audio, UI, and tooling have a reliable visual target to build around.

## Why W08 Is a Key Wave C Workstream

The public docs place W08 Renderer2D in Wave C, the “playable runtime” stage. Its importance and difficulty are both marked S. That ranking is reasonable: rendering is the first result users see, and it is also one of the easiest places for early design debt to become expensive.

W01 through W03 stabilize the control plane first. W05 through W07 then establish the world and runtime spine. By the time W08 starts, Scene + ECS should describe what exists in the world, the Asset Pipeline should describe how resources are referenced, and Platform + Input should provide the window, events, and frame timing. Renderer2D connects those contracts into a testable and explainable visual submission path.

So W08 is not an isolated “draw one sprite” task. It validates whether the previous layers can support a real runtime: whether the world model can be read, asset handles can be consumed, window and frame cadence can carry begin/end ownership, and diagnostics can explain what happened in the frame.

## The Renderer Service Should Protect Engine Boundaries

The tech stack document describes the current Renderer as a null renderer service, with OpenGL planned as the first production technology and a possible RHI later. That is a practical choice. For an early 2D engine, OpenGL can cover sprites, texture uploads, framebuffers, and simple post-processing while staying easier to teach and debug than modern explicit graphics APIs.

The more important detail is the boundary. Game/Features should not depend directly on OpenGL, and they should not own backend details. They should express what they want to render through engine contracts, not how to call a graphics API.

That is why W08 needs to stabilize `IRendererService` first. Renderer can replace the null backend and gradually introduce an OpenGL sprite pipeline, but the upper-facing surface should be camera state, sprite submission, material/texture handles, and frame lifecycle, not leaked low-level API calls.

## Sprite Submission Is the First Playable Visual Path

The W08 launch plan gives a precise immediate task: implement the first real 2D render path with camera and sprite submission. That scope is intentionally modest, and it matters.

The camera connects world space to screen space. Sprite submission turns scene or gameplay intent into renderer-readable requests that can later be sorted, batched, or drawn directly. Texture and material handles connect the W06 Asset Pipeline identity model to visible output.

If this layer is shaped well, later work can expand it naturally:

- batching sprites to reduce draw calls
- supporting material parameters and texture atlases
- adding framebuffers, post-processing, and debug overlays
- exposing renderer counters or frame artifacts to UI/debug tools

The first version does not need all of that. It needs stable submission data and frame lifecycle rules so tests, diagnostics, and later workstreams know where to attach.

## Frame Begin/End Needs Clear Ownership

SHE’s frame flow places Renderer after Scene update and before UI and Audio: `Renderer.BeginFrame / OnRender / SubmitSceneSnapshot / EndFrame`. That makes rendering a formal phase in the frame narrative, not a random drawing callback.

W08 needs to answer several ownership questions:

- who begins and ends a renderer frame
- when a scene snapshot is read
- what a layer can submit during OnRender
- whether renderer submissions are accepted outside a frame
- how diagnostics records the renderer phase

These sound like engineering details, but they decide whether the engine stays easy to extend. If begin/end ownership is scattered, physics, UI, debug overlays, and a future editor will all have to guess render state. If Renderer2D owns the lifecycle clearly, later modules can build around one shared frame contract.

## An AI-Native Engine Still Needs Explainable Pixels

SHE keeps emphasizing an AI-native design: service contracts, schema-first data, feature metadata, frame diagnostics, and authoring context should let Codex understand the project from facts. W08 should continue that direction.

Rendering is not only about putting pixels on the screen. It should also help answer why a frame looks the way it does. At minimum, renderer-facing state should be explainable through diagnostics or AI context indirectly: how many objects are in the current scene, what assets are registered, which features submitted visible work, and whether the latest frame passed through the renderer phase.

That does not mean AI context should control rendering. The architecture decisions already keep AI context read-only with respect to the deterministic simulation path. W08 should make the renderer an observable runtime service, not a hidden box inside gameplay logic or platform callbacks.

## Closing

W08 Renderer2D is the step that moves SHE from a runtime skeleton toward a visible runtime. It replaces the null renderer direction with an OpenGL-first 2D rendering path, but the real deliverable is a stronger engineering contract: camera state, sprite submission, texture/material handle integration, and clear frame begin/end ownership.

If W07 gives the engine a window, input, and rhythm, W08 lets that rhythm produce an image. The first version does not need to solve every rendering problem, but it does need to make later physics, audio, UI, debug tools, and AI context understand where the image came from, when it was submitted, and who closed the frame.
