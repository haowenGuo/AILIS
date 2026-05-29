# SHE W04: Turning Scripting into a Stable Host Boundary

`SHE-w04-scripting` is the W04 workstream in the SHE 2D engine plan. Its job is not to move all gameplay into scripts as quickly as possible. The more important question is where scripting should enter the engine so it does not bypass the gameplay, data, diagnostics, and AI context contracts that the earlier workstreams are trying to stabilize.

The public docs place W04 under “Scripting Host” and treat it as part of the authoring plane. That is the right framing. Scripting should make gameplay iteration faster, but it should not become a second hidden runtime. The safer route is to place scripts on top of the control plane created by W01, W02, and W03.

## Scripting Is Not A Shortcut Around The Engine

The first SHE workstreams already define the important shared boundaries. W01 owns commands, events, and timers. W02 owns schema-first gameplay data. W03 owns frame traces, diagnostics reports, and Codex-readable authoring context. If W04 allowed scripts to mutate gameplay or scene state freely, it would weaken that story.

That makes W04 a host boundary rather than a universal script entry point. Script modules can become the fast iteration layer for gameplay, but gameplay activity should still route through `IGameplayService` commands, events, and timers. Data access should still depend on schemas and records registered through `IDataService`. When scripts need to be visible to Codex, they should appear in the AI context `[script_catalog]`, not in an implicit convention that tooling has to guess.

This is why the docs keep pointing at a stable host boundary. Scripts can make feature work faster, but the boundary itself needs to be deliberate.

## What The Host Boundary Owns

The key W04 concepts are `IScriptingService`, `ScriptingService`, and `ScriptModuleDescriptor`. They do not imply that the engine already has a full Lua runtime. They first need to establish stable answers to a few smaller questions:

- How script modules are registered and identified.
- Which lifecycle hooks a script module can participate in.
- Where engine-native gameplay ends and script-owned gameplay begins.
- Where future Lua and `sol2` binding registration should live.
- How one bootstrap integration example can prove the boundary works.

The value of these interfaces is replacement safety. SHE is still a C++20 and CMake-based compileable skeleton, and many runtime services are intentionally placeholder or null implementations. If W04 defines the host contract first, a later Lua runtime can be added without leaking script-engine details through `Game/Features/*`, diagnostics, or the AI exporter.

## Its Place In The Frame Flow

SHE’s frame flow matters for W04. The architecture docs place `Scripting.Update` after `Gameplay.FlushCommands` and before `Scene.UpdateSceneGraph`. That order says a lot about the intended role of scripting: it can participate in gameplay progression during a frame, but it is neither the first event gateway nor a back door around the scene contract.

Later in the same frame, `AI.RefreshContext` runs after renderer, UI, and audio updates, and diagnostics closes the frame. That gives the engine one coherent place to summarize registered script modules, gameplay activity, the latest frame report, and data state. For Codex, that is far more reliable than scraping arbitrary script files and guessing what happened.

The same ordering makes tests sharper. W04 tests should not only prove that a script host can run. They should also prove that script-driven behavior is visible through the gameplay digest, diagnostics report, and authoring context.

## Why W04 Waits For Earlier Contracts

The module priority doc marks W04 as importance A and difficulty A, and recommends starting it after W01 and W02 have stabilized. That is a practical call. If commands, events, timers, and data schemas are still moving, the scripting layer will be tempted to invent temporary APIs. That may feel fast in the short term, but it creates a second gameplay runtime.

A healthier target is to make scripting an authoring layer bound to existing contracts. The conservative design is clear:

- Scripts should not directly own platform, renderer, or physics backends.
- Scripts should not bypass `IGameplayService` to mutate gameplay state.
- Script data should not avoid `IDataService` schema registration.
- AI context should summarize scripts through service catalogs, not file scraping.

With those rules, scripting becomes an iteration tool instead of an architectural escape hatch.

## What Should Be Verified Next

The W04 startup prompt gives the next sequence plainly: confirm that the W01 and W02 public contracts are stable enough to target, implement a stable script host boundary, document ownership between engine-native gameplay and script-owned gameplay, add focused script-host tests, and leave a handoff note.

That is the important lesson from this workstream. The most valuable part of SHE’s scripting plan is not the label “Lua”. It is the decision to place scripting somewhere registerable, diagnosable, testable, and understandable by Codex. Once that position is stable, the actual Lua runtime, binding layer, and script-authored gameplay have a maintainable foundation.
