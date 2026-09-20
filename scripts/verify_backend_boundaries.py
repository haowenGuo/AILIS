"""Reproducible local rehearsal for the scalable backend boundaries.

This script never touches the production server. PostgreSQL and Redis checks
run only when an explicit disposable test URL is provided. Missing services
are reported as skipped, never replaced by SQLite or an in-memory fake.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
import sys
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.sql.sqltypes import DateTime as SqlDateTime

from backend.core.database import Base
from backend.infrastructure.object_storage import LocalObjectStorage, S3ObjectStorage
from backend.infrastructure.redis_state import RedisStateStore
from backend.services.llm_relay_service import LlmRelayGuard, LlmRelayLimitError
from backend.models import db_models, edu_models  # noqa: F401


def result(name: str, status: str, **details: Any) -> dict[str, Any]:
    return {"name": name, "status": status, **details}


async def _create_engine(url: str):
    kwargs: dict[str, Any] = {"pool_pre_ping": True}
    if "sqlite" in url:
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        kwargs.update(pool_size=5, max_overflow=5, pool_timeout=10, pool_recycle=300)
    return create_async_engine(url, **kwargs)


def _seed_rows() -> dict[str, list[dict[str, Any]]]:
    now = datetime.now(timezone.utc)
    suffix = uuid.uuid4().hex[:12]
    user_id = 900_000
    email = f"boundary-{suffix}@example.invalid"
    return {
        "app_users": [{
            "id": user_id,
            "email": email,
            "display_name": "Boundary Rehearsal",
            "password_hash": "fixture-only",
            "stripe_customer_id": "",
            "membership_status": "free",
            "membership_plan": "free",
            "created_at": now,
            "updated_at": now,
        }],
        "app_token_accounts": [{
            "user_id": user_id,
            "balance": 1000,
            "created_at": now,
            "updated_at": now,
        }],
        "app_token_ledger": [{
            "user_id": user_id,
            "delta": 1000,
            "balance_after": 1000,
            "entry_type": "rehearsal",
            "source": "test",
            "reference_id": suffix,
            "idempotency_key": f"boundary-{suffix}",
            "note": "fixture-only",
            "created_at": now,
        }],
    }


async def _table_counts(engine) -> dict[str, int]:
    counts: dict[str, int] = {}
    async with engine.connect() as conn:
        for table in Base.metadata.sorted_tables:
            counts[table.name] = int((await conn.execute(select(table))).rowcount or 0)
            rows = (await conn.execute(select(table))).all()
            counts[table.name] = len(rows)
    return counts


def _row_digest(rows: list[dict[str, Any]]) -> str:
    def normalize(value: Any) -> Any:
        if isinstance(value, datetime):
            if value.tzinfo is None:
                value = value.replace(tzinfo=timezone.utc)
            return value.astimezone(timezone.utc).isoformat()
        if isinstance(value, bytes):
            return {"__bytes__": value.hex()}
        if isinstance(value, str):
            try:
                parsed = datetime.fromisoformat(value.replace(" ", "T"))
            except ValueError:
                return value
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc).isoformat()
        if isinstance(value, dict):
            return {str(key): normalize(item) for key, item in value.items()}
        if isinstance(value, (list, tuple)):
            return [normalize(item) for item in value]
        return value

    canonical_rows = [normalize(row) for row in rows]
    canonical_rows.sort(key=lambda row: json.dumps(row, sort_keys=True, ensure_ascii=True, default=str))
    normalized = json.dumps(canonical_rows, sort_keys=True, ensure_ascii=True, default=str).encode()
    return hashlib.sha256(normalized).hexdigest()


def _prepare_rows_for_target(table, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Make SQLite's timezone-less datetime values explicit before PostgreSQL."""
    timezone_name = os.getenv("REHEARSAL_SOURCE_TIMEZONE", "UTC")
    source_timezone = timezone.utc if timezone_name.upper() == "UTC" else ZoneInfo(timezone_name)
    prepared: list[dict[str, Any]] = []
    for row in rows:
        converted = dict(row)
        for column in table.columns:
            value = converted.get(column.name)
            if value is None or not isinstance(column.type, SqlDateTime):
                continue
            if isinstance(value, str):
                try:
                    value = datetime.fromisoformat(value.replace(" ", "T"))
                except ValueError:
                    continue
            if isinstance(value, datetime):
                if value.tzinfo is None:
                    value = value.replace(tzinfo=source_timezone)
                converted[column.name] = value.astimezone(timezone.utc)
        prepared.append(converted)
    return prepared


async def rehearse_postgres() -> dict[str, Any]:
    target_url = os.getenv("REHEARSAL_POSTGRES_URL", "").strip()
    if not target_url:
        return result(
            "postgresql_migration",
            "skipped",
            reason="REHEARSAL_POSTGRES_URL is not set; no PostgreSQL server was used",
        )
    if os.getenv("REHEARSAL_ALLOW_RESET") != "true":
        return result(
            "postgresql_migration",
            "skipped",
            reason="refused to use a target database without REHEARSAL_ALLOW_RESET=true",
        )

    with tempfile.TemporaryDirectory(prefix="ailis-boundary-") as temp_dir:
        source_url = f"sqlite+aiosqlite:///{Path(temp_dir) / 'source.db'}"
        source = await _create_engine(source_url)
        target = await _create_engine(target_url)
        try:
            async with source.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            async with source.begin() as conn:
                for table_name, rows in _seed_rows().items():
                    await conn.execute(insert(Base.metadata.tables[table_name]), rows)

            async with target.begin() as conn:
                await conn.run_sync(Base.metadata.drop_all)
                await conn.run_sync(Base.metadata.create_all)

            source_snapshot: dict[str, list[dict[str, Any]]] = {}
            async with source.connect() as conn:
                for table in Base.metadata.sorted_tables:
                    rows = [dict(row._mapping) for row in (await conn.execute(select(table))).all()]
                    source_snapshot[table.name] = rows

            async with target.begin() as conn:
                for table in Base.metadata.sorted_tables:
                    rows = source_snapshot[table.name]
                    if rows:
                        await conn.execute(insert(table), _prepare_rows_for_target(table, rows))

            target_snapshot: dict[str, list[dict[str, Any]]] = {}
            async with target.connect() as conn:
                for table in Base.metadata.sorted_tables:
                    target_snapshot[table.name] = [
                        dict(row._mapping) for row in (await conn.execute(select(table))).all()
                    ]

            mismatches = [
                table.name
                for table in Base.metadata.sorted_tables
                if len(source_snapshot[table.name]) != len(target_snapshot[table.name])
                or _row_digest(source_snapshot[table.name]) != _row_digest(target_snapshot[table.name])
            ]
            mismatch_details = {
                table_name: {
                    "source_count": len(source_snapshot[table_name]),
                    "target_count": len(target_snapshot[table_name]),
                    "source_digest": _row_digest(source_snapshot[table_name]),
                    "target_digest": _row_digest(target_snapshot[table_name]),
                    "source_sample": source_snapshot[table_name][:1],
                    "target_sample": target_snapshot[table_name][:1],
                }
                for table_name in mismatches
            }
            return result(
                "postgresql_migration",
                "passed" if not mismatches else "failed",
                source_tables=len(source_snapshot),
                migrated_rows=sum(map(len, target_snapshot.values())),
                mismatched_tables=mismatches,
                mismatch_details=mismatch_details,
            )
        except Exception as error:
            return result("postgresql_migration", "failed", error=type(error).__name__, detail=str(error))
        finally:
            await source.dispose()
            await target.dispose()


async def rehearse_redis() -> dict[str, Any]:
    redis_url = os.getenv("REHEARSAL_REDIS_URL", "").strip()
    if not redis_url:
        return result(
            "redis_distributed_limits",
            "skipped",
            reason="REHEARSAL_REDIS_URL is not set; no Redis server was used",
        )
    first = second = None
    namespace = f"rehearsal-{uuid.uuid4().hex}"
    try:
        first = RedisStateStore(redis_url)
        second = RedisStateStore(redis_url)
        guard_a = LlmRelayGuard(
            requests_per_minute=100,
            max_concurrent=1,
            state_store=first,
            namespace=namespace,
        )
        guard_b = LlmRelayGuard(
            requests_per_minute=100,
            max_concurrent=1,
            state_store=second,
            namespace=namespace,
        )
        async with guard_a.acquire("same-session"):
            try:
                async with guard_b.acquire("same-session"):
                    return result("redis_distributed_limits", "failed", error="cross-client concurrency was not enforced")
            except LlmRelayLimitError as error:
                if error.reason != "concurrency_limit":
                    return result("redis_distributed_limits", "failed", error=f"unexpected reason: {error.reason}")
        async with guard_b.acquire("same-session"):
            pass
        return result("redis_distributed_limits", "passed", cross_client_concurrency="enforced")
    except Exception as error:
        return result("redis_distributed_limits", "failed", error=type(error).__name__, detail=str(error))
    finally:
        if first is not None:
            await first.close()
        if second is not None:
            await second.close()


async def rehearse_object_storage() -> list[dict[str, Any]]:
    checks: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="ailis-objects-") as temp_dir:
        local = LocalObjectStorage(temp_dir)
        key = "rehearsal/example.txt"
        await local.put_bytes(key, b"ailis-object-storage")
        read_back = await local.get_bytes(key)
        await local.delete(key)
        checks.append(result("object_storage_local", "passed" if read_back == b"ailis-object-storage" else "failed"))

    endpoint = os.getenv("REHEARSAL_S3_ENDPOINT", "").strip()
    bucket = os.getenv("REHEARSAL_S3_BUCKET", "").strip()
    if not endpoint or not bucket:
        checks.append(result("object_storage_s3", "skipped", reason="S3/MinIO rehearsal variables are not set"))
        return checks
    try:
        storage = S3ObjectStorage(
            bucket=bucket,
            endpoint_url=endpoint,
            region=os.getenv("REHEARSAL_S3_REGION", "us-east-1"),
            access_key=os.getenv("REHEARSAL_S3_ACCESS_KEY", ""),
            secret_key=os.getenv("REHEARSAL_S3_SECRET_KEY", ""),
        )
        key = f"rehearsal/{uuid.uuid4().hex}.txt"
        await storage.put_bytes(key, b"ailis-s3-object-storage", content_type="text/plain")
        read_back = await storage.get_bytes(key)
        await storage.delete(key)
        checks.append(result("object_storage_s3", "passed" if read_back == b"ailis-s3-object-storage" else "failed"))
    except Exception as error:
        checks.append(result("object_storage_s3", "failed", error=type(error).__name__, detail=str(error)))
    return checks


async def main() -> None:
    checks = [await rehearse_postgres(), await rehearse_redis(), *(await rehearse_object_storage())]
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "production_touched": False,
        "checks": checks,
        "summary": {
            "passed": sum(item["status"] == "passed" for item in checks),
            "failed": sum(item["status"] == "failed" for item in checks),
            "skipped": sum(item["status"] == "skipped" for item in checks),
        },
    }
    print(json.dumps(report, ensure_ascii=False, indent=2, default=str))
    if report["summary"]["failed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
