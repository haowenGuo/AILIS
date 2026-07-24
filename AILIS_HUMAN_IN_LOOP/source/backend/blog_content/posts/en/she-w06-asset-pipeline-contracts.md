# SHE W06: Stabilizing Asset Identity, Metadata, and Loader Boundaries

`SHE-w06-assets` is the W06 workstream in the SHE 2D engine plan. W05 moved the project into Scene + ECS: what exists in the world, how entities are identified, how components are queried, and who owns lifetime. W06 follows with another foundational question that can easily become messy: how assets enter that world.

In the public docs, the key phrase for W06 is `Asset Pipeline`. The job is not to import a pile of files immediately. The first job is to define asset identifiers, a metadata model, loader registration, asset handle lifetime rules, and resource contracts that later renderer and audio systems can share. For an interface-first engine, that order is more useful than jumping straight into a full importer stack.

## The Asset Pipeline Sits Between Runtime And Data

SHE marks W06 as importance A and difficulty A, and places it in Wave B as part of the runtime spine. That placement matters. W06 is not mostly an authoring-control-plane track like W01, W02, and W03. It is also not the visible output layer like W08 Renderer2D. It sits between data, scene, rendering, and audio, making asset identity a stable fact.

Without an asset pipeline, Scene has no reliable way to reference prefabs, textures, sounds, or scene files. Renderer work may invent its own texture table. Audio may invent a separate sound registry. Each runtime module would then develop its own definition of what an asset is, making integration fragile.

The value of W06 is to give those modules a shared language: assets have stable IDs, readable metadata, registered loaders, explicit handle lifetime rules, and summaries that diagnostics and AI context can explain.

## Identity Comes Before Import Complexity

The tech stack doc describes the current Assets layer as an in-memory registry, with `yaml-cpp`, import metadata, and cooked cache planned for the production path. That split is pragmatic. The early decision to stabilize is not how many file formats the engine can import. The early decision is the shape of asset identity and metadata.

A maintainable asset contract should answer several practical questions:

- Whether asset IDs are stable enough for Scene, prefabs, rendering, audio, and AI context to reference.
- Whether metadata describes authoring paths, type, dependencies, version, runtime cache state, or some combination of those.
- Whether loaders are registered by resource type, extension, schema, or importer profile.
- How loading failures reach diagnostics instead of disappearing into temporary logs.
- What consumers should observe when a handle expires, is replaced, is hot-reloaded, or resolves lazily.

If these questions are not settled first, YAML support, texture importers, audio decoding, and cooked caches will spread complexity into every runtime module. W06 is more about laying the resource-system foundation than delivering a complete editor pipeline in one pass.

## W06 Has To Align With W02 And W05

The public launch plan gives W06 a pointed first task: confirm W02 data contracts and W05 scene needs. That line is important because the asset pipeline cannot be designed in isolation.

W02 already pushes gameplay data toward schema-first contracts. If W06 handles scene files, prefab metadata, or asset manifests, it should keep that schema habit so data shape remains verifiable instead of hiding a separate parsing convention inside each loader.

W05 provides the world model. Assets are not abstract forever: they are referenced by scene entities, prefabs, transform hierarchies, renderer submissions, physics relationships, and audio playback. If asset IDs and handle lifetime rules ignore scene lifetime, the engine can end up with entities that outlive their resources or resource replacements that consumers never observe.

So the W06 interface should treat resource identity, scene references, and data schemas as connected design problems. Assets is not merely a child of Scene, but it has to make prefab and scene authoring viable for W05.

## Loader Boundaries Protect Renderer And Audio

W06 is also told to keep renderer and audio consumers in mind. That should not mean Assets depends on concrete renderer or audio backends too early. The better interpretation is that the asset pipeline must deliver stable contracts those consumers can use while keeping middleware APIs from leaking through the engine.

Renderer2D will eventually need textures, materials, sprite sheets, fonts, and perhaps shader-like configuration. Audio Runtime will need sound effects, music, bus or group configuration, and playback parameters. The implementations differ, but the shared needs are the same: stable asset IDs, typed metadata, load state, error reporting, and lifetime rules.

If W06 makes loader registration a clean boundary, W08 can focus on sprite submission and texture/material handle integration. W10 can focus on the first miniaudio-backed playback path. Neither track should have to rediscover asset lookup and asset identity from scratch.

## AI Context Should See Asset State Too

SHE's AI Context contract already reserves space for asset count, asset registry, and loader summary. That means the asset pipeline is not only runtime infrastructure. It is also part of the project's explainability layer.

That matters for an AI-native engine. When Codex adds a future feature, it should not have to scan random files to guess whether an asset exists, who loads it, whether it is trusted, or how it is referenced. A better path is for `IAssetService` to expose a stable summary, then for AI context to present it as readable authoring context.

This also helps debugging. If an asset is missing, a loader is not registered, metadata does not match, or a handle expires, diagnostics can place that problem inside the story of a frame. The developer sees more than “the texture did not render”. They can see the relationship between resource identity, loading, the consuming module, and the failure phase.

## What Should Be Verified Next

The most important W06 test is not whether the engine can register one string. It is whether the asset contract can support the systems that come after it.

Tests should cover asset ID registration, metadata lookup, duplicate or unknown asset behavior, loader registration, handle lifetime, failure states, and whether AI context derives its asset summary from the standard `IAssetService` contract. They should also prove with small fixtures that renderer and audio consumers do not need to know internal asset storage details.

If W06 lands well, SHE's next steps become cleaner. W08 Renderer2D can receive a clear texture and material entry point. W10 Audio Runtime can build sound and music playback contracts. W05 Scene + ECS can connect prefab and scene authoring to stable resource identity. For this project, the asset pipeline is not mainly about managing files. It is about making resources first-class engine facts that are verifiable, traceable, and explainable.
