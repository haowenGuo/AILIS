# TaskAgent A7 Context Baseline

- Mainline promotion: 2026-08-13
- Evaluation source: `taskagent-a7-terminal-20260812`
- Evaluation source commit: `e3c7e7d93767df8978487b84f4219119d39726e5`
- Mainline base: `68c4d82a432ea437312287b9ba3e1979eb5d0e3e`

## Decision

A7 is the TaskAgent context-management baseline on the AILIS `main` branch.
This mainline integration intentionally ports only the general context changes
that produced the A7 result. It does not merge the old evaluation snapshot,
Terminal-Bench adapter, transport experiments, Gateway changes, or benchmark
artifacts into the product runtime.

## Runtime Changes

1. Full TaskAgent turns retain tool-layer-bounded outputs in canonical history.
   History is no longer compressed merely because it contains more than six
   tool results, and older results are no longer replaced by a blanket
   900-character preview.
2. `gpt-5.6-luna` has a built-in A7 context profile: a 272,000-token input
   window, 220,000-token soft monitor, 244,800-token semantic-compaction point,
   and 258,400-token operational stop point.
3. The soft threshold is telemetry only. Semantic compaction begins at the hard
   threshold instead of at the first warning.
4. Explicit request, model, settings, and environment configuration remains
   authoritative. Other models retain the existing conservative fallback.
5. The canonical checkpoint records the active tool-output projection policy,
   including the full-history value `0`, so replay does not silently restore the
   previous 24,000-character cap.

These changes alter context visibility and budget management, not model behavior
policy. They add no task route, expected answer, forced verifier, forced tool
use, fixed round cap, or synthetic final prompt.

## Evaluation Evidence

The frozen A7 evaluation source completed one valid Terminal-Bench 2.1 pass with
`gpt-5.6-luna` at max reasoning:

| Metric | A6 control | A7 evaluation source |
| --- | ---: | ---: |
| Correct | 53 / 89 | **60 / 89** |
| Accuracy | 59.55% | **67.42%** |
| Net change | - | **+7 tasks, +7.87 pp** |
| A6 failures fixed | - | 18 |
| A6 successes regressed | - | 11 |
| Semantic compactions | 20 | **4** |
| Peak request prompt | 67,381 | **245,017 tokens** |

The score is evidence for selecting the A7 mechanism as a development baseline,
not a release-stability claim. It has one complete pass, 11 paired regressions,
and a two-sided discordant sign-test result of approximately `p=0.265`.

This minimal mainline integration has not been presented as a second 89-task
score. Its implementation was verified with focused context/runtime tests and a
broader TaskAgent regression suite. A new benchmark score requires a new fixed
source snapshot and complete run.

## Promotion Gate

The next candidate must:

1. preserve the 18 A7 fixes while recovering the 11 regressions;
2. avoid task-specific prompts, routes, or object types;
3. improve stable-prefix cache reuse and time-to-testable-artifact;
4. complete two fixed 89-task passes before a release-stability claim.

Machine-readable provenance is in
[`evals/terminal-bench-2.1/A7_BASELINE.json`](../evals/terminal-bench-2.1/A7_BASELINE.json).
