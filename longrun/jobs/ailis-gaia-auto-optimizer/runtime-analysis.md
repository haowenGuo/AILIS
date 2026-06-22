# AILIS GAIA Runtime Analysis

Generated: 2026-06-22T02:41:05.570Z

## Score Snapshot

- Official validation Level 1 passed: 15/53 (28.3%)
- Attempted: 34/53
- Failed/backlog: 19
- Unattempted: 19
- Current status: repair_required
- Stop flag: true

## Waste Signals

- Final rows: 61
- Empty final answers: 23
- Repeated task ids: 7
- Transcript audit bytes: 89362668

## Repeated Tasks

| Task | Runs | OK | Empty | Steps |
| --- | --- | --- | --- | --- |
| cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb | 8 | 7 | 1 | 11 |
| e1fc63a2-da7a-432f-be78-7c4a95598703 | 7 | 3 | 4 | 9 |
| ec09fa32-d03f-4bf8-84b0-1f16922c3ae4 | 6 | 4 | 2 | 15 |
| a1e91b78-d3d8-4675-bb8d-62741b4b68a6 | 5 | 2 | 3 | 29 |
| 65afbc8a-89ca-4ad5-8d62-355bb401f61d | 4 | 4 | 0 | 37 |
| b816bfce-3d80-4913-a07d-69b752ce6377 | 2 | 2 | 0 | 13 |
| 72e110e7-464c-453c-a309-90a95aed6538 | 2 | 0 | 2 | 12 |

## Largest Transcripts

| Bytes | Path |
| --- | --- |
| 3710015 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-054-official-validation-l1-offset-28\eval-results\gateway-audit\iter-054-official-validation-l1-offset-28-2026-06-21T04-44-53-099Z\transcripts\gaia-official-validation-l1-iter-054-official-validation-l1-offset-28-2026-06-21T04-44-53-099Z-cabe07ed-9eca-40ea-8ead-4\902143de-91e1-4d63-a524-5bc074fa804f.jsonl |
| 3590599 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-011-official-validation-l1-offset-0\eval-results\gateway-audit\iter-011-official-validation-l1-offset-0-2026-06-20T18-21-39-273Z\transcripts\gaia-official-validation-l1-iter-011-official-validation-l1-offset-0-2026-06-20T18-21-39-273Z-e1fc63a2-da7a-432f-be78-7c\351d7e03-28ee-4ec9-aa4a-ebd8c1a40c9f.jsonl |
| 3381591 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-040-official-validation-l1-offset-13\eval-results\gateway-audit\iter-040-official-validation-l1-offset-13-2026-06-21T03-04-19-035Z\transcripts\gaia-official-validation-l1-iter-040-official-validation-l1-offset-13-2026-06-21T03-04-19-035Z-72e110e7-464c-453c-a309-9\7c024d5d-3175-40b4-88c1-cc4536dbe147.jsonl |
| 3322011 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-040-official-validation-l1-offset-13\eval-results\gateway-audit\iter-040-official-validation-l1-offset-13-2026-06-21T03-04-19-035Z\transcripts\gaia-official-validation-l1-iter-040-official-validation-l1-offset-13-2026-06-21T03-04-19-035Z-72e110e7-464c-453c-a309-9\89efe55a-a9ef-4dae-a2c9-65899d810b93.jsonl |
| 3139696 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-026-official-validation-l1-offset-4\eval-results\gateway-audit\iter-026-official-validation-l1-offset-4-2026-06-20T21-31-34-910Z\transcripts\gaia-official-validation-l1-iter-026-official-validation-l1-offset-4-2026-06-20T21-31-34-910Z-a1e91b78-d3d8-4675-bb8d-62\b635893f-b33c-473d-8b88-4dff6eb239ac.jsonl |
| 2806164 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-025-official-validation-l1-offset-4\eval-results\gateway-audit\iter-025-official-validation-l1-offset-4-2026-06-20T20-55-03-076Z\transcripts\gaia-official-validation-l1-iter-025-official-validation-l1-offset-4-2026-06-20T20-55-03-076Z-a1e91b78-d3d8-4675-bb8d-62\98e0be4d-4258-462c-96c7-ccf9dc1d95b1.jsonl |
| 2657269 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-054-official-validation-l1-offset-28\eval-results\gateway-audit\iter-054-official-validation-l1-offset-28-2026-06-21T04-44-53-099Z\transcripts\gaia-official-validation-l1-iter-054-official-validation-l1-offset-28-2026-06-21T04-44-53-099Z-cabe07ed-9eca-40ea-8ead-4\e21bb974-1035-4d77-aa33-1ebb65d0d4c4.jsonl |
| 2641075 | F:\AILIS_self_evolution_runtime\longrun\jobs\ailis-gaia-auto-optimizer\iterations\iter-026-official-validation-l1-offset-4\eval-results\gateway-audit\iter-026-official-validation-l1-offset-4-2026-06-20T21-31-34-910Z\transcripts\gaia-official-validation-l1-iter-026-official-validation-l1-offset-4-2026-06-20T21-31-34-910Z-a1e91b78-d3d8-4675-bb8d-62\0b4bf3ac-ecf6-49bc-a431-a1c4bbd89af2.jsonl |

## Recommended Safety Policy

```json
{
  "safety": {
    "enabled": true,
    "maxRepairBacklog": 3,
    "maxConsecutiveFailures": 2,
    "maxEmptyAnswerStreak": 1,
    "maxSameTaskAttempts": 1,
    "recentWindow": 6,
    "minRecentSample": 3,
    "minRecentPassRate": 0.5,
    "stopOnEnvironmentFailure": true
  },
  "maxIterationsPerControllerRun": 3,
  "maxAgentSteps": 12,
  "taskRetries": 0,
  "continueAfterFailure": false
}
```

## Operational Rule

Do not resume paid GAIA execution until provider billing is healthy and the safety policy above is active. Resume with a tiny canary batch only.
