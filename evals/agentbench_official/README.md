# Official AgentBench staged evaluation

The official AgentBench v0.2 integration runs one environment task at a time.
It does not start all eight environments from a single unapproved command.

## Stages

1. `smoke`: at most 3 samples. Verifies the official worker, bridge, model provider,
   action protocol, official scorer, and durable result path.
2. `pilot`: at most 10 samples. Verifies resume behavior, stability, and cost before
   a larger run.
3. `dev`: the selected official `-dev` task. Requires `--approve-large-stage`.
4. `test`: the selected official `-std` task. Requires `--approve-large-stage`.

Each stage has an independent run id, JSONL file, summary, and report. A stage passes
only when the official summary exists, infrastructure errors are zero, and the stage
budget gate passes. Accuracy is reported by the official `calculate_overall`; the
Harness never edits or post-processes model answers.

## Commands

```powershell
pnpm bench:agentbench:official:stage -- --stage smoke --task dbbench-dev
pnpm bench:agentbench:official:stage -- --stage pilot --task dbbench-dev
pnpm bench:agentbench:official:stage -- --stage dev --task dbbench-dev --approve-large-stage
pnpm bench:agentbench:official:stage -- --stage test --task dbbench-std --approve-large-stage
```

Only one task is accepted per controller invocation. Dev and Test cannot start without
the explicit approval flag.

## Failure semantics

Model-provider and transport failures are HTTP errors at the Bridge boundary. The
official runner records them as infrastructure errors rather than Agent answers. Three
consecutive infrastructure failures open the circuit breaker and stop the stage.
Call, Token, and cumulative-duration budgets are also enforced by the runner after every
durable sample. Smoke and Pilot use fixed stage budgets; explicitly approved Dev and Test
derive hard total budgets from their per-sample limits. A budget stop preserves the JSONL
checkpoint and never publishes a partial official score.

JSONL resume uses the latest record for each official sample index. With
`--retry-errors`, only infrastructure-failed indices are retried. Model protocol errors
remain benchmark outcomes and are not silently rewritten.

A summary is valid only when:

- every selected index has a durable latest record;
- no latest record contains an infrastructure failure;
- the official environment produced `calculate_overall` output;
- the stage call, Token, duration, and completion gates pass.

Do not use the old unqualified `bench:agentbench:official:full` command for unattended
runs. The controller now requires an explicit stage and one task, so that command exits
without starting work unless the required arguments are supplied.

## Harness checks

These checks do not start an environment worker or call a model:

```powershell
pnpm test:agentbench-official:python
pnpm test:agentbench-official
```
