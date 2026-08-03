# Codex Memory Checkpoint

Updated: 2026-08-03

## Current Baseline

- AILIS TaskAgent baseline: A6 natural termination.
- Implementation commit: `085e17d2f4a8ce0e841ee1543ad0df10e2387415`.
- Branch: `codex/a6-natural-termination`.
- Worktree: `F:\AILIS_self_evolution_runtime-gaia-a6-natural-termination`.
- Parent score-recovery commit: `b6f6dc0a9a41062dbde02337ae989aa591018acc`.
- Previous operational baseline: P1 `7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b`.
- Frozen historical baseline: `6afc0ae6a4b51992fcf20092fb5b8e109dab98e5`.

## A6 Behavior

- Native Responses function calls transport model tool intent.
- AILIS owns context, tool execution, permissions, persistence, retries,
  interruption and final result transport.
- Canonical response items remain the source of truth.
- There is no fixed TaskAgent model-round cap.
- There is no synthetic tool-free final request or reconstructed final prompt.
- The model ends the task by returning a normal assistant response.
- Semantic compaction controls context growth in the same canonical history.
- Bounded evidence and source-navigation references survive context projection.
- There is no task-ID, expected-answer or site-specific routing.

## GAIA Validation Result

Dataset: GAIA 2023 public validation, 165 tasks, `gpt-5.6-luna`.

- Overall: 102/165, 61.82%.
- L1: 38/53, 71.70%.
- L2: 50/86, 58.14%.
- L3: 14/26, 53.85%.
- Answer-bearing outcomes: 165/165.
- Gross/effective tokens: 31.37M/31.37M.
- Mean/P95 latency: 210.4s/575.0s.
- Model calls: 1,881.
- Logical tool calls: 1,814.

Fair Luna controls:

- P1-Luna: 54/165, 32.73%, 165 answers, 41.23M gross tokens.
- Native Codex-Luna: 106/165, 64.24%, 161 answers, four clean capability
  timeouts, 69.06M gross and 8.18M effective tokens.

A6 is +48 correct and +29.09 percentage points over P1-Luna. Codex-Luna is
four answers ahead overall, while A6 is +6 on L3 and has complete answer
coverage.

## Evaluation Boundary

- This is a local deterministic score on the public validation split, not an
  official private-test leaderboard submission.
- Accepted rows require complete artifacts, a submitted answer, nonzero tokens,
  empty stderr and no network/authentication error.
- Infrastructure failures restart the complete task. Partial answers are not
  merged and excluded attempts do not enter the score.
- 216 attempts produced 165 accepted unique outcomes; 140 were accepted on the
  first attempt and 25 after excluded infrastructure attempts.
- Historical gpt-5.5 rows are not causal comparisons with A6-Luna.

## Durable Reports

- `docs/ailis-gaia-a6-taskagent-baseline.md`
- `evals/engineering/gaia-a6-luna-validation165-summary.json`
- `docs/assets/benchmarks/gaia-a6-luna-validation165-20260803.svg`

External aggregate source retained outside Git:

`F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\gaia-a6-all-schemes-codex-luna-comparison-20260803`

## Next Optimization Contract

Start future TaskAgent work from A6. Focus on stable prefix caching, L1/L2
source selection and exact-answer extraction, and timeout-safe checkpoint/replay.
Do not reintroduce a forced final prompt or fixed model-round cap without a
complete paired regression. Preserve all 14 A6 L3 successes as mandatory
controls. A focused fix is not promotable until the complete paired score,
answer coverage, token use and latency pass against A6.
