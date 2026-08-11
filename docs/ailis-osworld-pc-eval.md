# AILIS OSWorld / OSWorld-Verified Evaluation

This evaluation uses the current production AILIS TaskAgent. Python owns the
official OSWorld `DesktopEnv` and evaluator; AILIS owns model decisions, tool
selection, the execution loop, context, and natural termination.

## Source and suite identity

- Official repository: <https://github.com/xlang-ai/OSWorld>
- Pinned source: `evals/engineering/osworld-source-lock.json`
- Local source directory: `F:\AILIS\main\build-cache\OSWorld`
- `test_small.json`: 39 tasks
- `test_all.json`: 369 tasks
- `test_nogdrive.json`: 361 tasks
- `test_infeasible.json`: 26 tasks

OSWorld-Verified is an in-place upgrade of OSWorld, not a separate repository.
The `verified` local profile runs `test_nogdrive.json` and must be labelled
**Verified-compatible**. A local score is not an officially verified leaderboard
score; that claim requires the official verification process and trajectories.

OSWorld-V2 is a different suite and is intentionally not mixed into this baseline.

## Clean architecture

```text
official task JSON
  -> official DesktopEnv reset + screenshot/a11y observation
  -> narrow HTTP transport (generic computer_13 actions only)
  -> current AILIS Gateway / TaskAgent / GPT-5.6-Luna medium
  -> official DesktopEnv action execution
  -> official evaluator
  -> result.txt + trajectory + screenshots + recording
```

The clean runner does not import `ailis_osworld_agent.py`. That older adapter is
legacy and contains a task-shaped skill catalogue, so it is not a valid baseline.
The new path contains no expected answers, task-ID branches, domain router,
answer checker, or benchmark-specific recovery policy.

Generic environment instructions are still required: the TaskAgent is told that
it must operate the isolated Ubuntu desktop, use GUI actions, inspect each fresh
screenshot, and return normally when done.

## Local environment

The working route on this machine is WSL Ubuntu 22.04 with Docker and KVM:

- Python environment: `/root/ailis-osworld-venv`
- Docker image: `happysixd/osworld-docker:latest`
- VM data: `/root/osworld-docker-vm-data/Ubuntu.qcow2`
- Repository link: `build-cache/OSWorld/docker_vm_data`

The VM remains on the WSL filesystem because the image is large. Do not copy it
into the Git working tree.

## Commands

Readiness and source/suite validation:

```powershell
pnpm bench:osworld:readiness
```

Official quickstart:

```powershell
pnpm bench:osworld:quickstart:wsl
```

One clean `test_small` task:

```powershell
pnpm bench:osworld:ailis:test-small:wsl
```

One clean local Verified-compatible task:

```powershell
pnpm bench:osworld:ailis:verified:smoke:wsl
```

Direct WSL invocation with an explicit range:

```bash
cd /mnt/f/AILIS/main/build-cache/OSWorld
source /root/ailis-osworld-venv/bin/activate
PYTHONPATH=/mnt/f/AILIS/main/build-cache/OSWorld \
python /mnt/f/AILIS/main/scripts/osworld/run_clean_ailis_osworld.py \
  --suite small \
  --provider-name docker \
  --headless \
  --start-index 0 \
  --limit 3 \
  --max-actions 50
```

The TaskAgent uses `gpt-5.6-luna` with `medium` reasoning by default. Override
with `--codex-model` and `--codex-reasoning-effort` only for explicit comparisons.

## Outputs

Results default to:

```text
eval-results/engineering/osworld-clean-task-agent/
```

Each task writes the original instruction, initial and per-action screenshots,
`traj.jsonl`, the full AILIS result, stdout/stderr, official `result.txt`, a task
summary, and optionally `recording.mp4`.

The compact tracked evidence for the first clean smoke is
`evals/engineering/osworld-clean-task-agent-smoke.json`.

## Interpretation

OSWorld scores desktop observation, grounding, GUI execution, recovery, and task
completion. It should not be used to add task-specific skills or answer-shaped
prompts. Improvements must remain generic and should be checked against the
existing GAIA and TerminalBench baselines to catch regressions in non-GUI work.
