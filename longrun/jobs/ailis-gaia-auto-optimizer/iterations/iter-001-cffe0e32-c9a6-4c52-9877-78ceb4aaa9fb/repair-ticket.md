# GAIA Repair Ticket: cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb

- Source: practice
- Title: Secret Santa DOCX
- Failure category: tools_mcp
- Optimization focus: artifact_tools_mcp
- Generalized capability: document_reading_and_constraint_reasoning
- Submitted answer: Alex
- Expected answer: Fred
- Step count: 4

## Diagnosis

Failure chain involves artifact-specific tool or MCP behavior.

## Required Repair Policy

- Do not hard-code this task, its answer, or one-off strings.
- Prefer a Tools/MCP fix if the first wrong turn is parser, fetcher, reader, schema, extraction, or source ranking.
- Touch Agent/Harness only when the chain proves stopping, finalization, loop control, or evidence handoff is the generalized bottleneck.
- Add or update a regression test that protects a class of similar tasks.

## Execution Chain

### 1. mcp__ailis_research__read_document

- ok: true
- status: completed
- evidenceQuality: (none)
- error: (none)
- preview: (none)

### 2. artifact_query

- ok: false
- status: failed
- evidenceQuality: (none)
- error: (none)
- preview: (none)

### 3. mcp__ailis_research__read_document

- ok: true
- status: completed
- evidenceQuality: (none)
- error: (none)
- preview: (none)

### 4. artifact_query

- ok: false
- status: failed
- evidenceQuality: (none)
- error: (none)
- preview: (none)
