# AILIS Backend V2 Boundary

This document describes the first migration step toward a horizontally
scalable backend. It intentionally preserves the current local defaults.

## Runtime boundaries

```text
clients
  -> API service
       -> identity, account, membership, billing, user data
       -> LLM Gateway boundary
       -> async task boundary

PostgreSQL   durable business data
Redis        distributed state, limits, leases, cache
Object store attachments, audio, artifacts
Queue        long-running and retryable work
```

The current repository still starts as one FastAPI application. The boundaries
are represented as adapters so the API process can be split later without
changing endpoint contracts.

## Compatibility defaults

The following defaults are deliberately unchanged:

- `DATABASE_URL` defaults to SQLite.
- `DATABASE_AUTO_CREATE=true` keeps the existing development bootstrap.
- `AILIS_RELAY_STATE_BACKEND=memory` keeps single-process Relay limits.
- `OBJECT_STORAGE_PROVIDER=local` keeps local file storage.
- The current hosted runtime remains the LLM Gateway adapter.

Production should set:

```dotenv
DATABASE_URL=postgresql+asyncpg://...
DATABASE_AUTO_CREATE=false
REDIS_URL=redis://...
AILIS_RELAY_STATE_BACKEND=redis
OBJECT_STORAGE_PROVIDER=s3
OBJECT_STORAGE_BUCKET=...
OBJECT_STORAGE_ENDPOINT_URL=...
```

Schema changes must then be applied by a migration tool before the service is
started. `create_all()` is retained only for the current local compatibility
path and is not a production migration strategy.

## Implemented adapters

- `backend/core/database.py`: PostgreSQL-aware connection pool settings with
  `pool_pre_ping`, while preserving SQLite behavior.
- `backend/infrastructure/redis_state.py`: in-memory and Redis async state
  stores. The Relay guard uses atomic Redis scripts for rate and concurrency
  reservations when Redis mode is selected.
- `backend/infrastructure/object_storage.py`: local filesystem and S3-
  compatible object storage implementations. Object keys are checked against
  the local root to prevent path traversal.
- `backend/services/llm_gateway.py`: stable gateway protocol around the
  current hosted runtime adapter.
- `backend/services/hosted_agent_service.py`: one shared HTTP connection pool
  per process instead of creating a new `httpx.AsyncClient` per request.

## Deliberately deferred

This step does not silently migrate production data or change business policy.
The following require a separate rollout and verification gate:

1. SQLite to PostgreSQL data migration and rollback rehearsal.
2. Redis deployment and cross-instance load testing.
3. Moving large attachment/artifact paths to object storage.
4. Separating the LLM Gateway into its own deployable process.
5. Usage reservation, billing settlement, queue workers, and idempotency
   audits.

