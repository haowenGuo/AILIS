# SHE W01: Turning Gameplay Core into Command, Event, and Timer Contracts

The main SHE article already covered why the 2D engine starts as an AI-readable skeleton. `SHE-w01-gameplay` is narrower. It maps to the W01 Gameplay Core workstream in the multi-workstream plan, and its goal is not to ship a complete gameplay demo immediately. Its job is to stabilize the control surface that future game rules will depend on.

This note is based only on low-risk material: `README.md`, the root `CMakeLists.txt`, and public documentation under `docs/`. It does not inspect implementation internals, publish local absolute paths, distribute binaries, expose private configuration, or include unconfirmed project material.

## Why W01 Starts in the First Wave

`MODULE_PRIORITY.md` marks W01 Gameplay Core as highest-importance work and recommends starting it in the first wave. The reason is simple: every future rule, trigger, command, and event flow will pass through this area. If gameplay core has no stable boundary, adding rendering, physics, scripting, levels, and debug tools too early only makes later changes harder.

The milestone plan says the same thing. M1 is not "make it visually playable." It is Gameplay Authoring Core: commands can be registered and executed through a stable contract, events are observable and traceable, timers can drive gameplay flow deterministically, and data, diagnostics, and AI context participate in the same validation story.

So the value of W01 is not feature count. It is about pulling the most leak-prone part of gameplay into shared primitives. Future features should not invent their own event flows, delayed actions, or command queues. They should express those behaviors through the official gameplay service.

## Commands, Events, and Timers Form the Control Plane

SHE's architecture docs define `Engine/Gameplay` as the owner of gameplay commands, timed events, and a frame-level digest of gameplay activity. In engineering terms, W01 answers three questions:

1. How are gameplay actions requested and executed?
2. How are gameplay events broadcast, observed, and recorded?
3. How do delays, cooldowns, trigger windows, and other timing rules enter the frame loop?

If those questions are answered separately inside each feature, they quickly become hidden conventions. One enemy system may keep its own event list, a shop system may queue commands another way, and a quest system may use a different timer model. That can work briefly, but it makes the official gameplay path hard for humans and AI workers to identify.

W01's direction is to expose these capabilities through a stable entry point such as `IGameplayService`. Features can submit commands, publish events, and register timing behavior without depending directly on platform, renderer, physics, or scripting-host internals.

## Feature Boundaries Need to Be AI-Friendly

The docs recommend organizing gameplay as `Game/Features/<FeatureName>/`, with layer code, data schemas, tests, and a README living inside the feature boundary. That is more than a folder convention. It is a way to reduce the risk of AI-assisted edits.

If a feature is just a scattered set of files, an AI worker can easily edit the wrong layer or copy an old pattern without seeing the full local contract. If each feature has a clear boundary, registers metadata through `IReflectionService`, registers data shapes through `IDataService`, and uses `IGameplayService` for commands, events, and timers, the worker can reason from project facts instead of guesswork.

That is also why W01 belongs in the first wave with W02 and W03. Gameplay Core owns the behavior control plane. Data Core owns schema-first data contracts. Diagnostics + AI Context explains what happened. Together they create a path where future gameplay features are writable, inspectable, and testable.

## W01 in the Multi-Codex Workflow

`MULTI_CODEX_LAUNCH_PLAN.md` defines W01 as the Gameplay Core workstream and gives it ownership of gameplay modules plus gameplay-focused tests. Its startup tasks include the command registry, execution path, event bus, timer dispatch, lifecycle-boundary comments, focused contract tests, and a handoff note.

That shows that SHE's parallel development model is not just "open more sessions." Each workstream has a clear responsibility, recommended timing, and acceptance path. W01 does not need to build the renderer, asset pipeline, or platform input system at the same time. It needs to make the gameplay control surface trustworthy for the rest of the engine.

That split matters for an engine. Once gameplay core is stable, W04 Scripting Host can attach scripts to official command and event paths, W05 Scene + ECS can connect world objects to gameplay flow, W09 Physics2D can turn collision callbacks into gameplay events, and W10 Audio Runtime can respond to gameplay-triggered audio events.

## Acceptance Matters More Than a Feature List

`ACCEPTANCE_CHECKLIST.md` sets practical guardrails for workstreams like W01: module ownership should be clear, dependency directions should stay valid, risky behavior needs tests, architecture docs should change when contracts change, and new gameplay features should enter AI-visible context through standard services.

Those requirements sound conservative, but they are exactly what Gameplay Core should establish first. W01 is not about piling on gameplay. It is about preventing future gameplay from bypassing the shared path. Whether a command ran, an event was captured, or a timer fired should be explainable through diagnostics and AI context.

That also makes integration quality easier to judge. A workstream is not done just because it builds. It should leave a readable handoff, identify tests and risks, and avoid creating new hidden dependencies.

## Summary

`SHE-w01-gameplay` represents the first gameplay control surface in SHE: commands, events, timers, contract tests, diagnostics visibility, and AI-readable feature boundaries. It will not immediately make the engine look more impressive, but it determines whether future gameplay, scripting, scenes, physics, and audio can cooperate through one stable path.

For an AI-native 2D engine, that order makes sense. Define gameplay core as the shared language first, then let rendering and runtime systems connect to that language. That keeps later features from turning into isolated special cases that neither humans nor AI workers can reliably reason about.
