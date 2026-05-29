# SHE Workspace: Using W00 as the Integration Spine for Multi-Codex Engine Work

The main repository inside SHE-workspace is not just another copy of the engine. In the Multi-Codex setup, it is `W00`: the architect and integrator workspace. Its job is to keep direction stable, slice workstreams, receive handoffs from branch worktrees, and pull distributed module work back into one verifiable engine spine.

This post focuses on that engineering role. Earlier SHE articles covered Gameplay, Data, Diagnostics, Scene, Renderer, Physics, Audio, UI Debug, and the first vertical slice. The more interesting point here is how the main workspace prevents a dozen Codex sessions from turning parallel engine development into parallel confusion.

## W00 Is the Integration Line, Not a Spectator

`MULTI_CODEX_LAUNCH_PLAN.md` defines `W00` as Architect + Integrator. Other windows own focused slices: `W01 Gameplay Core`, `W02 Data Core`, `W03 Diagnostics + AI Context`, then Scene, Assets, Platform, Renderer2D, Physics2D, Audio Runtime, UI Debug, and the playable vertical slice. Each workstream has its own branch and worktree, but shared state cannot depend on uncommitted branch-local edits.

That is why `MULTI_CODEX_WORKFLOW.md` sets an important rule: when multiple worktrees are active, `W00` on `main` is the source of truth for coordination state. The task board, status ledger, and integration report should be maintained by `W00`. Copies of those files may exist in workstream branches, but they are not the live shared state.

This looks like process management, but it protects the architecture. The riskiest form of parallel work in an engine project is not multiple modules being edited at once. It is multiple modules changing boundaries without one place recording interface pressure. `W00` forces each slice to answer what changed, which interfaces moved, which tests ran, what remains risky, and where the next session should start.

## The Documentation Stack Is the Shared Memory System

The SHE workspace has a dense public documentation stack, but these files are not decoration. They are the shared memory system for multi-agent development. `ARCHITECTURE.md` explains runtime services, dependency rules, and frame flow. `MODULE_PRIORITY.md` ranks W01-W11 by importance and difficulty. `MILESTONES.md` turns the roadmap into Coordination Foundation, Gameplay Authoring Core, Scriptable Gameplay, World Model, Playable Runtime, Authoring Quality, and Vertical Slice milestones.

Together, these files move “what should happen next” out of chat history and into repeatable project material.

For a human developer, that reduces the cost of re-explaining context. For Codex, it matters even more because each session has limited context. A workstream Codex should not guess whether it may touch `RuntimeServices`, `Application`, or CMake configuration. It should learn the boundary from the launch plan, workflow, acceptance checklist, and architecture decisions.

That is why the main workspace is more important than any single module worktree. A module worktree goes deep on one slice. `W00` makes sure all those slices can still be assembled.

## Runtime Services Give Every Workstream a Common Language

The main README and `ARCHITECTURE.md` both make the current stage clear: SHE is a compileable architecture skeleton, not a feature-complete engine. The project first separates `Engine/`, `Game/`, `Tools/`, and `Tests/`, then uses runtime service contracts to control how modules connect.

Those services cover windowing, assets, scene, reflection, data, gameplay, renderer, physics, audio, UI, scripting, diagnostics, and AI context. Their value is not only that the interfaces are tidy. They give parallel Codex sessions a common language. `W08 Renderer2D` should not guess scene internals. `W09 Physics2D` should not bypass gameplay events. `W03 Diagnostics + AI Context` should not understand runtime state by scraping random files.

When work happens through these service contracts, integration has review points. A workstream that changes shared core must explain why. A workstream that replaces a placeholder implementation inside its own module should preserve interface stability and avoid leaking middleware details into gameplay code.

That matches the interface-first plan in `TECH_STACK.md`. Phase 1 uses null or in-memory bootstrap implementations, while the intended production stack includes SDL3, OpenGL, EnTT, Box2D, miniaudio, yaml-cpp, Dear ImGui, Lua/sol2, spdlog, and Tracy. Stabilizing replacement points before adding heavier dependencies makes parallel work easier to merge.

## AI Context Makes Integration Explainable

`AI_CONTEXT.md` is explicit about what the engine should export: project intent, active scene and entity count, assets, registered types and feature metadata, schemas, data registry state, gameplay digest, script modules, and the latest frame diagnostics report.

This is not about producing a nice report. It lets the next Codex session start from facts. If a finished module only exists as source changes, the next session still has to reread a large amount of code to understand the current state. If that module appears through reflection, data services, diagnostics, and the AI exporter, later work can inspect a smaller, stable surface.

`ACCEPTANCE_CHECKLIST.md` turns that into an acceptance requirement: a change should be visible or explainable through authoring context export, diagnostics should tell the story of what changed, and new contracts should be discoverable by Codex through docs, metadata, or schemas.

For a multi-worktree engine project, this raises the bar from “can it integrate?” to “can it be explained?” Compilation is the floor. Being understandable to the next developer and the next Codex session is what makes the workflow durable.

## The Open World Blueprint Moves the Target Toward Composable Content

`AI_NATIVE_OPEN_WORLD_BLUEPRINT_V2.md` gives the workspace a longer-term target: the future 2D open-world engine should not assume one AI pass can read the whole project. A creator AI should be able to perform world assembly, rule assembly, content assembly, local validation, and small base-contract edits under bounded context.

The blueprint splits the system into five layers: kernel, base, pack, composition, and validation. The important shift is that game creation should move away from direct edits to `Engine/*` or one-off `Game/Features/*` code, and toward composable bases and packs. Regions, tilemaps, avatars, animations, NPCs, interactions, quests, dialogue, encounters, and item economies should expose schemas, finite command sets, assemblers, runtime adapters, query APIs, validators, and preview paths.

That extends the same idea that makes `W00` useful. First, the engine implementation is sliced into W01-W11. Later, game content is sliced into queryable, validatable, previewable packs.

If the direction works, a future creator AI should not need to read the entire engine to add an NPC, a town, or a quest chain. It should query the relevant base, edit the matching pack, run local validation, and only promote genuinely reusable capability back into a base or runtime service.

## Closing

The `W00` main repository in SHE-workspace acts as the integration spine. It maintains architecture docs, workstream slicing, launch plans, acceptance rules, AI context contracts, and the longer open-world blueprint so multiple Codex sessions can move in parallel without overwriting one another.

The value is not the number of open windows. The value is that each window has a clear boundary, each handoff is recorded, and each module can return to the main line through service contracts and AI-visible context. For a 2D engine still in bootstrap form, that discipline matters more than raw feature count. It makes the project understandable by both humans and Codex before it grows into a playable, extensible, composable engine.
