# SHE W05: Turning Scene + ECS into a Stable World Model

`SHE-w05-scene` is the W05 workstream in the SHE 2D engine plan. The earlier W01 through W04 tracks focus mostly on the control and authoring planes: commands, events, timers, schema-first data, diagnostics, AI context, and the scripting host boundary. W05 moves into a heavier question: how the engine owns a world.

In the public docs, the key phrase for W05 is `Scene + ECS`. That does not mean simply adding a scene class or immediately wiring every system to EnTT. The first job is to define entity identity, component storage, query conventions, transform ownership, and scene lifetime rules. Once gameplay, assets, rendering, physics, and tooling depend on that world model, replacing it later becomes expensive.

## The World Model Starts The Runtime Spine

SHE marks W05 as importance S and difficulty S, and places it in Wave B as part of the runtime spine. That order makes sense. W01, W02, and W03 make behavior, data, and diagnostics describable. W05 has to attach those descriptions to real objects in the scene.

Without Scene + ECS, gameplay commands stay abstract, data schemas have no stable runtime target, and renderer or physics workstreams have to guess what they should consume. W05 gives the engine one answer for what exists in the world, how it is identified, who owns its lifetime, and how systems query it.

That is also why W05 comes before W08 Renderer2D and W09 Physics2D. Rendering needs a scene snapshot to submit. Physics needs stable associations between bodies and entities. The asset pipeline eventually needs to connect prefabs, scene files, and runtime objects. W05 is the shared foundation for those modules.

## Identity And Lifetime Come Before Flashy ECS Features

The W05 prompt in the public launch plan is concrete: implement entity identity, component storage and query conventions, scene lifetime rules, then add scene lifetime and query tests. The important part is not the label “ECS”. The important part is identity and lifetime.

A maintainable scene system needs to answer several practical questions:

- Whether entity IDs are stable enough for gameplay, diagnostics, and AI context to reference safely.
- Where component ownership lives and how much of the query surface should be public.
- Whether transforms are owned by Scene or copied across renderer, physics, and gameplay.
- How entity creation, destruction, activation, and invalidation enter the story of a frame.
- How scene updates become visible to diagnostics and authoring context.

The earlier these rules stabilize, the less likely later systems are to bypass the scene contract. Otherwise the renderer may invent its own object table, physics may hold a separate body map, gameplay may keep temporary handles, and AI context will have to infer world state from fragments.

## Scene Has To Align With Earlier Contracts

W05 is not an isolated module. It should inherit the engineering habits created by the earlier workstreams.

W01’s `IGameplayService` already defines commands, events, and timers as shared gameplay entry points. If W05 responds to gameplay behavior, scene mutation should follow explainable command or lifecycle rules instead of letting features freely alter world state.

W02’s `IDataService` owns schemas and data registration. When W05 later supports prefabs, scene files, or data-driven entities, the data shape should still belong to schema contracts instead of spreading YAML or configuration parsing through the scene runtime.

W03’s diagnostics and AI context require scene changes to be observable. The AI context contract already reserves space for active scene, entity count, asset count, registered types, schema catalog, gameplay digest, and latest frame report. A good W05 implementation should eventually show up through those stable outputs.

## Interface First, Not A Full Production ECS Yet

The tech stack doc describes the current Scene layer as a minimal scene world and names EnTT as the planned production ECS. That is a pragmatic split. SHE is still a C++20 and CMake compileable skeleton, and many services are intentionally placeholder or null implementations. Chasing a full ECS too early could hide the more important interface questions.

The better route is to define the scene contract first: who owns the world, how entities are created and invalidated, how component queries are expressed, and how transforms become shared facts across systems. Once those choices are documented and tested, replacing the internal storage with EnTT becomes much safer.

That matches the larger SHE style: make module boundaries readable, testable, and understandable by Codex before adding real middleware. W05 does not need to deliver the final ECS in one pass. It needs to settle the long-term shape of the world model.

## What Should Be Verified Next

The most important test for W05 is whether it can become the scene layer that later runtime modules trust.

Tests should cover more than creating an entity. They should cover scene lifetime, component queries, transform ownership, invalid entity handling, and the scene update position inside the frame flow. Diagnostics and AI context should also be able to summarize the active scene and entity count without forcing a developer to inspect internal containers.

If W05 lands well, W06 Asset Pipeline, W08 Renderer2D, and W09 Physics2D all become easier. Assets can target a stable entity and prefab model. Rendering can consume a clear scene snapshot. Physics can return collision results through the gameplay event flow. For an AI-native 2D engine, that is the real point of Scene + ECS: the world should run, and it should also be understandable by humans and Codex.
