# SHE W07: Turning Windowing, Input, and Frame Timing into a Runtime Boundary

The earlier SHE workstreams stabilize gameplay, data, diagnostics, scripting, scene, and asset contracts first. W07 Platform + Input handles a different foundation question: when does a compileable 2D engine skeleton become a real runtime?

The answer is not simply “add a window library.” W07 needs to place windowing, input, event pumping, and frame timing behind a clear boundary so renderer, physics, audio, UI, and gameplay can all depend on the same runtime rhythm.

## Why W07 Belongs to the Runtime Spine

The public docs classify W07 as part of the runtime plane, with A-level importance and B-level difficulty. That ranking makes sense. Without real windowing, input, and timing, the project can have good gameplay and data contracts, but it is not yet a playable engine.

In the rollout waves, W07 sits beside W05 Scene + ECS and W06 Asset Pipeline in the second-wave runtime spine. Scene defines what exists in the world, assets define how resources are identified and loaded, and the platform layer defines how that world enters frames and receives external input.

That also explains its relationship with W08 Renderer2D and W09 Physics2D. Rendering and physics make the engine more visible and playable, but they both need a stable source of window events and time. W07 should make that runtime entrance reliable before downstream modules build on top of it.

## The Platform Layer Should Expose Engine Facts

The current Phase 1 tech stack describes Platform as a null window service, with SDL3 planned as the production technology. W07’s target is to replace that placeholder path with the first SDL3-backed window and input layer.

The important detail is that SDL3 should not leak into gameplay code. The platform layer can own window creation, keyboard input, pointer input, event pumping, and close requests, but upper layers should receive engine-owned state and events rather than middleware details.

That preserves one of SHE’s core dependency rules: Game/Features depend on engine services, not concrete platform APIs. If the platform layer later grows gamepad support, multi-window support, high-DPI handling, or broader desktop coverage, those changes should stay behind the platform service boundary.

## Frame Timing Is a Shared Contract

One easy part to underestimate is frame timing. The documented frame flow places `Window.PumpEvents` after `Diagnostics.BeginFrame` and before `Gameplay.BeginFrame`. That means platform events are not incidental helper logic. They are an early fact in the frame narrative.

When input and time are collected clearly at the start of a frame, the rest of the runtime can move from the same facts:

- gameplay can turn input into commands, events, or timer-driven behavior
- physics can keep fixed-step updates easier to reason about
- renderer work can organize around clear frame begin/end ownership
- diagnostics can record which events arrived and which phases advanced
- AI context can export a more coherent runtime story after the frame closes

So W07 is not just about opening a window. It is about stabilizing the runtime clock.

## Input Should Not Bypass Gameplay Contracts

SHE’s architecture decisions already say that gameplay activity should flow through shared command, event, and timer paths. Once W07 receives keyboard or pointer input, gameplay-facing behavior should enter through those paths instead of directly mutating game rules from platform callbacks.

That keeps input visible to diagnostics, explainable through AI context, and testable through stable contracts. It also keeps the platform layer focused on its real responsibility: collecting and normalizing external input, not deciding game logic.

For an AI-native engine, that boundary matters. Future Codex sessions should not need to guess whether game behavior is hidden inside an SDL callback. They should be able to inspect engine service contracts and the gameplay digest.

## The Delivery Standard for Later Modules

The W07 launch plan gives the workstream a tight ownership boundary: primarily `Engine/Platform/*` and platform/input tests, with shared core files touched only when necessary. The acceptance focus is equally practical: event pumping, frame timing, and input state need to remain explicit, with focused smoke tests for platform/input behavior.

That affects the next workstreams directly:

- W08 Renderer2D needs a stable window and frame begin/end boundary
- W09 Physics2D needs a clear fixed-step timing integration point
- W10 Audio Runtime needs a predictable frame update cadence
- W11 UI + Debug Tools needs inspectable input state and events

W07’s value is not implementing every platform feature at once. Its value is making sure every later runtime module knows where to attach.

## Closing

W07 Platform + Input is the step that moves SHE from “architecture-readable” toward “runtime-usable.” It replaces the null platform path with a real window and input layer while preserving the order between event pumping, frame timing, diagnostics, gameplay, and AI context.

If W01 through W06 give the project a collaborative inner skeleton, W07 gives that skeleton a real clock. The later renderer, physics, audio, and debug UI work will be much easier to integrate if this boundary stays clean.
