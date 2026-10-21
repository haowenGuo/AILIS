# Model Transport Recovery

The direct agent loop can resume a failed inference request without rebuilding
canonical history or replaying completed tools. This restores the recovery
behavior already present in the evaluated local runtime but absent from the
published baseline before this change.

- `modelTransportRecoveryDeadlineMs` is an absolute episode deadline shared by
  all turns and reconnects. A reconnect never resets the task timeout.
- With a deadline or explicit recovery budget, retries are bounded by time,
  not a fixed reconnect count. Backoff is cancellable and capped at 30 seconds
  for an episode deadline. Five seconds remain reserved at the boundary.
- With neither configured, the existing optional short retry count applies;
  the default is zero outer retries. Provider-level retries remain unchanged.
- Socket failures, interrupted streams and transient gateway responses are
  retryable. Authentication, invalid request/schema, quota responses and user
  cancellation are not silently retried. Programming errors still propagate.
- Only a successful complete response is appended to history. Partial tool
  calls from a disconnected stream must never execute.
- Recovery emits `recovery_started`, `retry_scheduled`, `recovery_succeeded`,
  `recovery_stopped` or `recovery_exhausted` through existing request diagnostics.

Tests:

```text
node --test tests/ailis-model-transport-recovery.test.mjs tests/ailis-model-transport-recovery-native.test.cjs
```

The native integration uses real HTTP, the Responses serializer, SSE parser,
Gateway, exec worker and canonical checkpointing. Only external authentication
and TLS are replaced by a local fixture. It interrupts a partial tool stream,
returns 503 on the next request, then succeeds; repeated request bodies must be
byte-identical, existing pixels/reasoning must survive, and exec must run once.
