# SHE W11: Turning UI + Debug Tools into a Runtime Inspection Surface

SHE’s first ten workstreams have already separated the 2D engine skeleton into clearer runtime layers. Gameplay Core owns commands, events, and timers. Data Core owns schemas. Diagnostics and AI Context explain frames. Scene/ECS, Assets, Platform, Renderer2D, Physics2D, and Audio Runtime gradually fill in the systems needed for a running world.

W11 UI + Debug Tools sits in a different position. It is not the player-facing menu system, and it is not a full editor. It is the tooling plane: once runtime systems have something worth observing, W11 uses debug overlays, panels, runtime counters, traces, scene/physics/render inspection hooks, and sandbox entry points to make engine state readable to both developers and Codex.

## Debug UI Should Not Arrive Before the Systems It Inspects

`MODULE_PRIORITY.md` places W11 in Wave D because debug visibility becomes high leverage after runtime systems exist to inspect. That ordering is practical. If UI arrives too early, the project gets empty panels. If it arrives too late, renderer, physics, audio, and scene problems stay hidden in logs and guesswork.

So W11 is not mainly about adding windows. It is about visualizing the runtime contracts that already exist. W03 defines frame traces and the latest frame diagnostics report. W08 provides renderer frame submission. W09 provides fixed-step physics and collision callbacks. W10 provides audio update and gameplay feedback boundaries. W11 should bring those observable signals into one debug surface instead of letting each module invent temporary output.

That also explains why the docs place W11 beside `W04 Scripting Host` in the higher-level authoring and inspection stage. Scripting improves gameplay iteration speed, while Debug Tools improve observation and diagnosis speed. Both should sit on top of clear runtime contracts.

## `IUiService` Owns the UI Frame Boundary

The AI-native refactor document lists `IUiService` as a first-class runtime service. Its current bootstrap implementation is `NullUiService`, and its responsibility is debug/runtime UI frame ownership. That wording matters: UI should not be a few ImGui calls hidden inside the renderer. It needs its own frame boundary.

In the frame flow, UI runs after renderer and before audio: `Renderer.BeginFrame / OnRender / SubmitSceneSnapshot / EndFrame`, then `UI.BeginFrame / OnUi / EndFrame`, then `Audio.Update`, `AI.RefreshContext`, and `Diagnostics.EndFrame`.

This sequence gives W11 a clear role. UI can show the scene snapshot, render submissions, physics/debug state, gameplay digest, and diagnostics trace that already exist for the current frame. But it should not quietly become a second gameplay mutation path. Any interaction that changes runtime state should go through existing gameplay command, event, data, or service contracts instead of directly rewriting internal objects.

## The First Panels Should Serve Inspection, Not Editor Ambition

The tech stack document points future UI toward `Dear ImGui` plus a simple runtime HUD layer because it is a fast path to debug HUDs, inspector panels, profiling views, and scene or asset inspection. The important phrase is “fast path to useful tooling,” not “build the whole editor immediately.”

For W11, the first high-value surfaces can stay plain:

- runtime counters: frame index, delta time, entity count, asset count, schema count, active feature count
- diagnostics panel: latest frame phase list, phase count, and whether gameplay activity was captured
- scene inspector: active scene, entity summary, and transform or component summaries
- render/physics view: sprite submission count, camera state, body/collider count, and recent collision events
- audio/debug event view: recent gameplay-triggered audio events and channel/group summaries
- AI context preview: whether the current authoring context contains the required sections

These panels do not need to be visually sophisticated at first. Their value is making hidden state scannable so a developer can answer: what happened this frame, whether a system is wired through the standard contract, and whether Codex can understand the current state from public context.

## The Sandbox Is the Right Landing Place

The Multi-Codex launch plan gives W11 clear ownership: `Engine/UI/*`, debug-tooling tests, and selected sandbox debug integration. In other words, W11 should define the UI service boundary and also provide a non-shipping runtime entry point where the tools can be exercised.

The README already describes `Tools/Sandbox` as the engine inspection executable. That makes the sandbox the natural landing place for W11. It can host debug overlays, inspection panels, and smoke-level integration without pushing tooling logic into the shipping game entry point. This validates the UI service frame lifecycle while keeping gameplay code and tooling code separate.

That separation matters over time. Debug UI may inspect engine internals more aggressively than the game, but it still should not become a dumping ground for engine responsibility. Information that needs to stabilize should become a service contract, diagnostics report, reflection metadata entry, or AI context section. The panel is only the visualization layer.

## W11 Still Needs Tests

The docs require every workstream to include focused smoke tests. For UI/debug tools, the point is not necessarily pixel-perfect screenshot testing. The useful target is contract and lifecycle behavior.

The project can test whether `IUiService` enters a frame in begin/on/end order, whether debug panels can read stable summaries from diagnostics, scene, assets, physics, or render state, whether sandbox integration avoids forbidden dependency directions, and whether AI context refresh still happens after UI and audio but before diagnostics closes the frame.

Those tests keep Debug Tools from becoming “a window that opens during development” and make them part of SHE’s AI-native architecture. Like W03 diagnostics, W05 scene modeling, W08 rendering, W09 physics, and W10 audio, W11 should have contracts that an integrator can review.

## Closing

W11 UI + Debug Tools moves SHE’s runtime explanation layer from documents and logs into an interactive inspection surface. It should stabilize `IUiService` frame ownership, use Dear ImGui and a runtime HUD as the future implementation direction, expose debug overlays and inspection panels through the sandbox, and bring runtime counters, traces, scene/physics/render state, and AI context previews into one scannable surface.

It should not rush into becoming a full editor, and it should not bypass gameplay, data, diagnostics, or AI context contracts. A good W11 helps every later Codex session and developer guess less: open the debug surface and see what this frame, this scene, these assets, and these systems are actually doing.
