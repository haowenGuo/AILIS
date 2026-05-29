# SHE W03: Making Diagnostics and AI Context Explain Every Frame

SHE's W03 workstream owns `Diagnostics + AI Context`. It is not a gameplay feature, a renderer, a physics layer, or the scripting host. It is the observability layer that should make those systems understandable to both humans and Codex.

This article is based on the project's README, CMake setup, and public docs. The central idea is that W03 turns frame traces, phase reports, gameplay activity, schema catalogs, and authoring context into one stable runtime narrative.

## Why Diagnostics Belongs in the First Wave

SHE places W01 Gameplay Core, W02 Data Core, and W03 Diagnostics + AI Context in the same foundation wave. That ordering matters. If gameplay commands, data schemas, and runtime state exist without a shared diagnostic path, debugging quickly falls back to guesswork.

W03 is not about printing more logs. It is about structuring what happened during runtime as inspectable facts. The documented frame flow starts with `Diagnostics.BeginFrame`, passes through window events, gameplay, fixed updates, scripting, scene updates, renderer, UI, audio, and AI context refresh, then closes with `Diagnostics.EndFrame`. That order turns a frame into a story that can be reviewed.

## The W03 Boundary

The workstream has two main ownership areas:

- `Engine/Diagnostics/*`: record frame phases, generate frame reports, and make command and event activity visible in the diagnostic story.
- `Engine/AI/*`: export a Codex-readable authoring context that summarizes the scene, types, features, schemas, data registry, gameplay digest, script catalog, and latest diagnostics report.

That boundary is important. AI context is a read-only observation surface; it does not directly mutate simulation. Diagnostics records facts; it does not bypass the formal Gameplay, Data, or Scene contracts. Later scripting, physics, rendering, and UI systems can then plug into the same explainable path instead of inventing one-off debug formats.

## A Stable Authoring Context

`AI_CONTEXT.md` defines the stable outer shape for W03: `authoring_context_contract_version`, `context_version`, `frame_index`, plus sections such as `[project]`, `[runtime_state]`, `[module_counts]`, `[reflection_catalog]`, `[schema_catalog]`, `[data_registry]`, `[gameplay_state]`, `[script_catalog]`, and `[latest_frame_report]`.

The important detail is ownership. The schema catalog and data registry should come from the stable `IDataService` contract. The gameplay digest should come from `IGameplayService`. The latest frame report should come from diagnostics. The AI layer summarizes those facts; it does not replace the modules that own them.

For an AI-native engine, this is more useful than simply feeding more files into context. Stable context helps Codex see which features, schemas, script modules, and recent runtime activity actually exist. It also reduces the chance that future changes depend on hidden conventions.

## Good Diagnostics Is Not Noise

The docs also constrain the latest frame report shape. A report includes a version, captured frame count, frame index, phase count, whether gameplay activity was present, a frame summary, and one section per recorded phase.

That suggests the goal is not an unlimited log stream. The useful output is a report that can be tested, reviewed, and compressed. The high-value questions are:

- Which phases did this frame pass through?
- Did gameplay commands and events use the official path?
- Are data and schema summaries still trustworthy?
- Can AI context explain the runtime instead of only listing files?

Once that shape is stable, later workstreams such as W04 Scripting Host, W05 Scene + ECS, W08 Renderer2D, and W11 UI + Debug Tools can attach their state to the same diagnostic narrative.

## Takeaway

SHE W03 makes observability part of the architecture instead of treating it as a later debugging add-on. It gives the engine a way to explain how a frame begins, which systems participate, where gameplay activity appears, whether data contracts are visible, and where Codex should read runtime facts.

This work is less visually dramatic than opening a real renderer window, but it is foundational for multi-module and multi-agent development. For an AI-native 2D engine, Diagnostics + AI Context belongs in the control plane.
