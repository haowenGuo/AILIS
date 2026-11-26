# Hosted concurrency A/B

This is a loopback experiment, not a deployment configuration. Both arms use
three Agent processes, the same local `electron/` code, an isolated data root,
and a synthetic model with fixed response chunks. No production traffic or
account data is used.

- **Baseline:** Caddy forwards to the distributed ingress. Use the deployed
  ingress and BullMQ coordinator/worker sources with their lockfile, but point
  both at a new Redis instance on loopback. The settings are three active runs
  and twelve waiting runs.
- **Candidate:** Caddy sends each request to one fixed shard. The test client
  stands in for the authenticated API when it sets the shard header. Each shard
  has one active run and four waiting runs. Cancel/status do not wait in the
  run queue. There is no alternate shard on failure.

Place the read-only source copies in `<artifacts>/production-source/{ingress,worker}`
with their original paths (`scripts`, `server/agent-cluster`,
`server/observability`). Run `npm ci --ignore-scripts` in the copied worker's
`server/agent-cluster` directory. Use a local Caddy and Redis binary:

```powershell
node scripts/loadtest/governance/concurrency-routing-ab.cjs $artifacts $caddy $redis
$env:AILIS_AB_ORDER='fixed-shards,bullmq'
node scripts/loadtest/governance/concurrency-routing-ab.cjs $artifacts $caddy $redis
```

Each arm has a warm-up followed by 6 and 24 closed-loop clients with a 500 ms
gap between attempts. Requests use distinct tenants and the same conversation
ID; the tenants are evenly assigned to shards. Every attempt is counted, and
only successful responses with a model time span contribute phase latencies.
`dispatch` measures client start to entry into the Agent runtime, including
transport, admission and any process-side setup preceding entry. `relay`
measures fixture first chunk to first text delta at the client. `prepare` and
`dispatch` are overlapping intervals; do not add their percentiles. Verify
success rate as well as relay latency. Slow fixture spans invalidate a clean
comparison but are kept in the receipt.

Production requires binding the shard key to the existing authenticated
principal at the API boundary. Do not accept a caller's shard header. Test
crash/restart, mixed tenant traffic, attachment routing, credentials and quota
before promotion. Do not send a write to another shard on timeout or expiry
without a handoff that prevents the old writer from committing. Complete the
repository's official process/session regression gate before deployment.

## Execution slot matrix

Use `AILIS_AB_SLOT_SERIES=1,2,4` or `4,2,1`, a fresh artifact root for each
order, and the same Caddy binary. This mode does not need Redis or the deployed
source copies. It always uses three Worker processes. Four waiting places per
Worker stay fixed; only the number of active execution slots changes.

```powershell
$env:AILIS_AB_SLOT_SERIES='1,2,4'
node scripts/loadtest/governance/concurrency-routing-ab.cjs $artifacts $caddy
```

Set `AILIS_AB_PROFILE=1` for a fixed-shard run to save one CPU profile per
Worker and split first-delta relay latency. `providerToRead` ends when the
Worker's provider reader returns the first chunk; it does not measure when the
kernel received the bytes. `readToWrite` covers decoding through the first SSE
write, and `writeToClient` ends when the load client parses that event. Compare
profiled runs with other profiled runs, and check `timedRelayPhases` coverage.
These percentiles overlap with `relay`; do not add them.

The 6- and 24-client stages use disjoint tenants, with exactly one warm-up turn
per tenant before measurement. `queue` is timed from admission to slot grant
inside one process. It excludes transport, context preparation and time spent
on rejected attempts. Assess it alongside the all-attempt success rate. Verify
each counted response contains only its own tagged stream and one completion.
Receipts include per-process peak active slots, lifecycle checks, and the count
of completed turns matched to the on-disk memory snapshot and raw journal.

This tests ordinary streaming turns with balanced assignments and a loopback
model. The fixture rejects duplicate runs from one tenant. It does not validate
production authentication, crash recovery, client disconnect while queued, or
the lifecycle of deferred tool work.

To vary the total slot budget across the same three workers, use
`AILIS_AB_TOTAL_SLOT_SERIES` instead of `AILIS_AB_SLOT_SERIES`. Nonuniform budgets
are split deterministically, e.g. 100 slots as 34/33/33. Set the measured client
count with `AILIS_AB_CLIENTS`; the harness distributes tenants the same way and
keeps four waiting places per worker across all arms. At client counts other
than 24, it runs just that measured concurrency after warm-up.

```powershell
$env:AILIS_AB_TOTAL_SLOT_SERIES='100,12'
$env:AILIS_AB_CLIENTS='100'
node scripts/loadtest/governance/concurrency-routing-ab.cjs $artifacts $caddy
```
