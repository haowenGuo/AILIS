# SHE W02: Turning Gameplay Data into Schema-First Contracts

The previous SHE workstream article covered W01 Gameplay Core: commands, events, and timers. `SHE-w02-data` follows with another foundation question: how should gameplay data be defined, validated, read, and understood by both humans and Codex?

This note is based only on low-risk material: `README.md`, the root `CMakeLists.txt`, and public documentation under `docs/`. It does not inspect implementation internals, publish local absolute paths, distribute binaries, expose private configuration, or include unconfirmed project material.

## W02 Is About Whether Data Can Be Trusted

SHE's M1 milestone is Gameplay Authoring Core. It is not a single module. It is a group of contracts that support each other: W01 provides gameplay commands, events, and timers; W02 provides schema-first data contracts; W03 provides diagnostics and AI context. Together they give future features a path that can be written, inspected, and verified.

`MODULE_PRIORITY.md` marks W02 Data Core as highest-importance work and places it in the first wave. The reason is that gameplay data becomes risky quickly when it is scattered across YAML files, configuration snippets, or temporary code. Every feature then starts guessing fields, types, defaults, and ownership. Humans may fill those gaps from memory; AI workers are more likely to make mistakes when context is incomplete.

W02's value is turning those hidden assumptions into explicit contracts early. When a feature adds enemies, encounters, level parameters, or debug data, the first step should not be an ad hoc data file. The first step should be a data shape that can be registered, described, and validated.

## Data Core Is Part of the AI-Native Control Plane

The architecture docs define `Engine/Data` as the owner of schema contracts for gameplay-authored data. Unlike rendering, platform, or physics modules, it is closer to the control plane: it determines whether authors and tools can describe game content through a stable path.

`TECH_STACK.md` gives the roadmap clearly. Phase 1 starts with an in-memory schema registry so boundaries stay compileable and readable. Later phases can add `yaml-cpp` and real schema validation. That order is practical. The project does not need to solve parsing, recovery, and complex loading all at once before the public contract is stable.

This also matches the README's description of the bootstrap stage. The current project is a compileable architecture skeleton, not a pretend-complete engine. Data Core's first job is not feature spectacle. It is to provide a data entry point that future gameplay, scripting, asset, and scene systems can depend on without reshaping it every time.

## Schema-First Beats "Write Data First, Explain Later"

`docs/SCHEMAS/README.md` records the current Data Core contract expectations: schemas should declare `schema`, `description`, `owner`, and `fields`; each field should declare `name`, `kind`, `required`, and an optional `description`; the first YAML loader validates top-level mapping fields and supports `scalar`, `list`, and `map` field kinds.

Those fields are simple, but they solve several collaboration problems early:

1. `owner` says who is responsible for the contract.
2. `description` tells humans and AI what the data means.
3. `required` separates mandatory data from optional tuning.
4. `kind` gives validators and tools a minimum type signal.

Without that layer, future features can degrade into "it loads, so it is fine" configuration piles. That is fast at first and painful later, because errors may only appear deep inside a runtime path. Schema-first design moves data mistakes toward structured validation results instead of vague gameplay bugs.

## How W02 Connects to W01 and W03

W02 is not an isolated data store. It needs to work with W01 Gameplay Core and W03 Diagnostics + AI Context.

For W01, Data Core provides the data definitions behind gameplay commands and events. A command may start an encounter, an event may describe a reward, and a timer may drive a phase transition, but those behaviors still need stable data shapes for parameters, entities, tables, and debug descriptions.

For W03, Data Core is a key input to AI context. `AI_CONTEXT.md` requires the authoring context to include registered schemas. That means Codex should not have to search random files and guess data structures. It should be able to inspect the engine's exported context and see which schemas exist, who owns them, and what fields they define.

That is why SHE keeps using the term AI-native. AI is not a later chat layer bolted onto the engine. It is represented in runtime services, schemas, metadata, diagnostics, and context export from the beginning.

## W02 in the Multi-Codex Workflow

`MULTI_CODEX_LAUNCH_PLAN.md` defines W02 as the Data Core workstream. Its workspace is `SHE-w02-data`, and its ownership boundary is `Engine/Data/*` plus schema-focused tests. Its startup tasks include YAML loading, schema registration, validation results, data queries, structured error reporting, focused data-loading tests, and a handoff note.

That acceptance shape shows that W02 is not merely "load one file." It has to answer several engineering questions:

1. Where does data enter the engine?
2. How are schemas registered and queried?
3. How are validation failures represented structurally?
4. How can gameplay features read data without bypassing the shared contract?
5. How does the handoff let the W00 integrator understand interface changes and remaining risk?

That split matters for parallel development. W02 does not need to implement the full asset pipeline or scene system at the same time. It needs to make data contracts reliable enough for other workstreams to build on. When W05 Scene + ECS, W06 Asset Pipeline, or W04 Scripting Host connects later, they should not need their own private data interpretation path.

## Acceptance Should Focus on Contract Stability

`ACCEPTANCE_CHECKLIST.md` gives requirements that fit W02 well: the module should have a clear public interface, avoid forbidden dependency directions, provide a minimal smoke or integration test path, and document future replacement points while it is still a bootstrap implementation.

For Data Core, the most important acceptance target is not how many YAML features it supports. The important target is whether the public surface is stable. Once schema registration, field descriptions, validation results, and data queries become the official path, future gameplay features can add complexity on top of that path.

If that foundation is solid, later additions such as `yaml-cpp`, feature-local schemas, data tables, prefabs, scene files, or script hooks can still follow one clear rule: gameplay data is described first, validated next, and only then consumed by runtime systems.

## Summary

`SHE-w02-data` represents the first data infrastructure layer in SHE. It moves gameplay data from "write some configuration and let code read it" to "define a schema, register it, validate it, query it, and expose it to AI context."

That is not a flashy user-facing feature, but it determines whether the 2D engine can keep growing. If an AI-native engine expects Codex to add features reliably, data shapes need to be as explicit as the behavior control plane. W02 is where that discipline starts.
