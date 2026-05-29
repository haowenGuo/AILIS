# SHE Coordination: Turning Multi-Codex Work into Shared Operational Memory

`SHE/coordination` is not a renderer, physics, or gameplay module. It is the shared operational memory for SHE's multi-Codex development workflow. Its README defines a simple protocol: check the task board, update the status ledger, work inside one bounded workstream, submit handoff details through templates, and record integration impact.

That may not look like feature work, but it matters in a parallel engine project. When several Codex sessions work on different modules at the same time, the most fragile information is not always a function body. It is who owns a slice, what it depends on, which boundaries moved, and how the next session should continue.

## Coordination Is the Control Plane

The root README gives a direct operating sequence: check `TASK_BOARD.md`, update `STATUS_LEDGER.md`, work inside one bounded workstream, use the handoff templates, and record integration impact in `INTEGRATION_REPORT.md`.

That makes `coordination` a control plane rather than an implementation area. It turns parallel development into observable steps: confirm the task, state the current status, limit the working scope, then leave a handoff and an integration note. For a multi-Codex workflow, that is more important than simply opening more agent windows.

Without this control plane, each session would mostly see its own local context. Gameplay, Data, Renderer, Physics, Audio, and Debug UI changes might each make sense in isolation, while their impact on the main architecture disappears into chat history or temporary notes. The value of `coordination` is that it puts those effects back into a place that can be reread.

## Workstream Files Define the Boundary

`WORKSTREAMS/README.md` says every active or planned workstream should have a file named with the `<workstream-id>_<short-name>.md` pattern. More importantly, each file should give any Codex session a one-file summary of ownership, scope, dependencies, changed files, and the acceptance target.

Those five fields are the minimum useful contract for parallel engineering.

`ownership` says who is responsible for the slice and helps avoid overlapping edits. `scope` says what the session should do, and just as importantly, what it should not casually expand into. `dependencies` make ordering visible. `changed files` summarize the actual impact surface for integration. `acceptance target` defines what counts as done before the work begins.

This helps human developers, but it is even more important for Codex. A Codex session should not guess whether it can touch shared services, CMake configuration, or another module's interface. If a workstream file is clear enough, the next session can read the contract first and choose the smallest safe change.

## Handoffs Make Finished Work Traceable

`HANDOFFS/README.md` is short, but it defines an important habit: completed handoff notes should be stored with the `<workstream-id>_<short-name>_<date>.md` naming pattern. The example is `W01_gameplay-core_2026-04-12.md`.

That naming rule makes handoffs sortable by workstream and time. In a multi-Codex project, finishing one local task does not mean the whole system is stable. The integrator still needs to know which numbered slice the work belongs to, what topic it handled, and when it happened.

Handoff notes also reduce archaeology. If a later session needs to continue a module, the ideal path is not to reread all source files or recover context from chat logs. It should start with the workstream summary and the latest handoff, then decide whether implementation files need deeper inspection. For an engine still in bootstrap, that traceability directly lowers merge risk.

## Integration Impact Gets Its Own Record

The root README ends by asking contributors to record integration impact in `INTEGRATION_REPORT.md`. That detail matters because it separates “I finished my task” from “this is how the task affects the main line.”

A workstream may replace a placeholder, or it may change a runtime service contract. The first usually affects a local implementation. The second can affect how other modules connect. If every session only reports its own result and never records integration impact, the main line starts drifting silently: interfaces change without docs changing, dependencies shift without the board changing, and acceptance targets move without the next session knowing.

Making integration impact a fixed step forces each iteration to answer practical questions. Does this change affect another workstream? Does the main line need adjustment? Are there new tests, docs, or acceptance targets? That makes `coordination` part of the architecture discipline, not just a project-management folder.

## Safety Boundary for This Article

This article is based only on three README files inside the `coordination` directory: the root README, `WORKSTREAMS/README.md`, and `HANDOFFS/README.md`. I did not read the task board, status ledger, concrete handoff notes, integration report, or source implementation.

That limitation matches the directory's role. Directory structure and template conventions can be discussed publicly because they describe the collaboration mechanism. Specific task state, handoff content, and integration risks may contain unfinished work details, so they do not belong in an automatic blog post.

## Closing

`SHE/coordination` turns multi-Codex development from a sequence of temporary sessions into an operating system with a task board, status ledger, workstream boundaries, handoff records, and integration-impact notes.

For a 2D engine like SHE, this is not peripheral documentation. It is infrastructure for sustained parallel work. It tells each session which workflow it belongs to, what evidence it should leave, and how finished work returns to the main line. Feature modules make the engine stronger; `coordination` makes those modules connect reliably.
