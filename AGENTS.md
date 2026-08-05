# AILIS Agent Engineering Rules

These rules are hard constraints for Agent and Harness development in this repository.

1. The model is the semantic decision-maker. Do not use text matching, regular expressions, task-type branches, or fallback rewrites to replace or steer a valid model decision. Runtime code may validate a strict schema and return an error, but it must not invent or rewrite the model's task.
2. Context management is the primary engineering problem. Keep Persona memory, visible conversation, active-task state, TaskAgent working context, evidence, and tool outputs in explicit data lanes. Compact by budget while preserving goals, constraints, unresolved state, evidence refs, and output refs.
3. The Harness is an operating system for the model, not a cage around it. Focus deterministic code on context assembly, lifecycle state, permissions, budgets, MCP reliability, tool contracts, durable references, and observability. Let the model decide what a request means, whether evidence is sufficient, and what action to take next.

Allowed deterministic guards include schema validation, permission enforcement, timeout/cost safety limits, lifecycle status recording, and lossless reference preservation. They must report observations back to the model instead of substituting their own semantic plan.
