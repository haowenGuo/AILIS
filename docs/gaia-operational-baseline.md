# GAIA Operational Baseline

Updated: 2026-07-29

## Active baseline

P1 commit `7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b` is the active
engineering baseline for subsequent AILIS launches, GAIA experiments, and
long-horizon capability work.

Future candidates must branch from this fixed code commit unless another
candidate is independently promoted by a complete paired gate.

The operational branch is:

```text
codex/gaia-p1-operational-baseline
```

The machine-readable pointer is
`evals/engineering/gaia-operational-baseline.json`.

## Decision boundary

This promotion is a new engineering decision. It does not rewrite the prior
L1 paired evidence:

- P0 `8ebc1e577a21e9badf081ae9b05fb3eb0607cb88` scored 47/53 and
  50/53 in its historical valid L1 runs, mean 91.51%.
- P1 scored 48/53 and 48/53 in its historical valid L1 runs, mean 90.57%,
  and therefore failed that earlier no-regression gate.

The broader evidence available at promotion time is:

- shared 20-task L1/L2/L3 sample: P1 14/20, P0 12/20;
- complete P1 public validation: 109/165 (66.06%);
- P1 level scores: L1 49/53, L2 50/86, L3 10/26;
- P1 response integrity: 162/165 response OK.

The public validation runner used a permissive visible-answer scorer. A
post-run submission audit found four clear P1 false positives where the
actual answer had a wrong unit or extra list/set members. The preserved
visible score is 109/165; the strict audited score is 105/165, with audited
level scores L1 46/53, L2 50/86, and L3 9/26. This does not reverse the
explicit operational promotion, but all future gates must report both
figures and score the actual submitted answer.

P0 remains the historical narrow-fix success reference. The frozen baseline
`6afc0ae6a4b51992fcf20092fb5b8e109dab98e5` also remains immutable.

## Development rules

1. Start new production candidates from fixed P1.
2. Preserve all quarantined-run and historical-score boundaries.
3. Do not add task IDs, expected answers, question-specific prompts, or
   site-specific hard routing.
4. Improve context integrity, generic data presentation, tool capability,
   checkpoint/replay reliability, and lifecycle robustness.
5. Do not treat response completion as semantic correctness.
6. Promote a successor only after fixed-commit paired regression demonstrates
   score and per-task non-regression, with response, latency, and token costs
   reported separately.

## Evidence locations

The local campaign and historical reports live under:

```text
F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real
```

The current full comparison campaign is:

```text
F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p1-vs-codex-validation165-20260728
```

The execution-chain study is:

```text
docs/gaia-p1-vs-codex-l23-execution-study.md
```
