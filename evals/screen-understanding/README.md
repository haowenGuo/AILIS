# AILIS Screen Understanding Evaluation

This is a read-only evaluation of AILIS's ability to understand what a user is
doing from a desktop screenshot. It deliberately does not evaluate pointing,
clicking, action planning, or task completion.

The default sample source is the repository's existing OSWorld-Verified run.
Only stored screenshots and their task metadata are read; OSWorld is not
started and no desktop action is performed.

The visual model returns five fields:

- `application`
- `activity`
- `state`
- `visible_issue`
- `confidence`

The saved AILIS main model semantically judges whether the description is
consistent with the source task and visible step context. Scores are reported
for application recognition, broad activity understanding, state plausibility,
usability, hallucination rate, and latency.

Run a three-sample smoke test:

```powershell
node scripts/run-ailis-screen-understanding-eval.mjs --limit 3 --concurrency 1
```

Run the default 20-sample baseline:

```powershell
node scripts/run-ailis-screen-understanding-eval.mjs
```

Retry one named sample after a transient infrastructure failure:

```powershell
node scripts/run-ailis-screen-understanding-eval.mjs --only-id <sample-id> --concurrency 1
```

Each visual request has at most two infrastructure attempts. Semantic failures
and invalid outputs are not repeatedly retried.

By default the evaluator uses the repository's evaluation-only Codex model
bridge as the auxiliary visual model. Add `--use-configured-vision` to evaluate
the independent visual model saved in the AILIS desktop control panel instead.
