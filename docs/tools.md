# AILIS Tool Runtime

[Documentation](README.md) · [简体中文](tools.zh-CN.md) · [Architecture](architecture.md) · [TaskAgent](taskagent.md)

AILIS exposes one auditable tool runtime to Persona and TaskAgent. Built-in desktop capabilities, dynamically discovered tools, MCP tools, and artifact operations share the same contract, validation, approval, execution, observation, and event path.

## Tool Surface

| Capability | Current tools and runtime |
| --- | --- |
| Files and shell | read, write, edit, `exec`, `apply_patch`, long-running process sessions |
| Computer use | screen/window inspection and approved computer actions |
| Web | `web_run`, search, open, find, click, and reference-linked page observations |
| Code | code execution and repository-oriented task workflows |
| Documents and artifacts | import, inspect, query, edit, render, verify, export, and round-trip checks |
| Communication | email providers and account-aware operations |
| Vision | approved screen, image, and visual artifact understanding |
| Extensibility | `tool_search`, MCP bridge, standard tool packs, and external contracts |
| Task control | handoff, route, goal, verification, and compact result retrieval |

The model receives a stable core tool surface. Long-tail tools are discovered and exposed only when needed, reducing schema cost without hiding available capability.

## Execution Path

```text
Model function call
  -> normalize name and arguments
  -> validate against tool contract
  -> resolve policy and approval requirements
  -> execute through Gateway/runtime adapter
  -> normalize content, structured data, images, and artifacts
  -> emit progress and audit events
  -> record call-linked output in canonical history
```

Every accepted call is preserved. A validation failure or a serialized action does not discard later calls in the same model response. Safe independent calls may execute concurrently; state-changing calls follow runtime safety metadata.

## Contracts

`electron/ailis-tool-contracts.cjs` is the model-facing contract source. A contract defines the tool ID, description, input schema, validation rules, aliases, approval semantics, and output expectations. `electron/ailis-tool-executor.cjs` and Gateway adapters execute the validated contract.

Tool outputs can contain:

- user-visible text;
- structured content;
- images and media;
- source references;
- artifact references;
- process session IDs;
- error and recovery metadata.

The model input builder converts these outputs to canonical response items and keeps the original call pairing.

## Web References

`web_run` creates stable reference IDs for search results and opened pages. Follow-up open, click, and find operations target those references, so navigation results stay connected to their source instead of returning anonymous text fragments.

## Artifacts

Large files and structured documents use artifact references rather than being flattened into one prompt. Artifact tools preserve rows, pages, sheets, renderings, and verification results as structured data. Prompt-visible excerpts remain bounded while the full artifact stays available to later tool calls.

## Approval And Audit

Tools with external effects are checked before execution. Approval state is attached to the concrete Session, Turn, tool, and arguments. Gateway events expose call start, progress, output, completion, failure, and approval state to the desktop UI and evaluation harness.

## Adding A Tool

1. Define or import a contract.
2. Register the runtime implementation or platform adapter.
3. Declare approval and side-effect semantics.
4. Normalize outputs into the canonical tool-result shape.
5. Add contract, execution, failure, and approval tests.
6. Run `pnpm test:ailis-tool-contracts` and the relevant tool test.

The runtime should gain general capability, not benchmark-task routes or site-specific answer logic.

## Main Source Files

| File | Responsibility |
| --- | --- |
| `electron/ailis-gateway.cjs` | registry, policy, execution routing, events, and built-in integrations |
| `electron/ailis-tool-contracts.cjs` | schemas, validation, aliases, and model-facing definitions |
| `electron/ailis-tool-executor.cjs` | normalized execution and call results |
| `electron/ailis-tool-router.cjs` | runtime tool selection and routing |
| `electron/ailis-standard-tool-packs.cjs` | standard external contract and MCP packs |
| `electron/ailis-artifact-runtime.cjs` | structured document and artifact operations |

For the complete model-to-tool lifecycle, continue with [TaskAgent Runtime](taskagent.md).
