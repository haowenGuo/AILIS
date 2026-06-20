# AILIS GAIA Auto Optimizer Mission

Build and operate a durable automatic optimization loop for AILIS using GAIA/GIAI tasks.

The loop must select one task per iteration, execute it through the AILIS benchmark runner, extract the full execution chain, classify success or failure, and produce generalized repair guidance. The system should optimize Tools and MCP first, and only modify Agent/Harness layers when the chain proves that orchestration, stopping, finalization, or evaluation is the bottleneck.

Do not hard-code individual GAIA answers, task IDs, URLs, names, or one-off task hacks. Every repair should improve a class of similar tasks.
