"""Rehearse a production SQLite snapshot migration without touching production.

The caller supplies a locally downloaded SQLite snapshot through
``PRODUCTION_SQLITE_SNAPSHOT``. The script creates a disposable PostgreSQL
cluster, migrates every ORM table, verifies counts and canonical row digests,
backs the migrated database up with ``pg_dump``, restores that dump into a
second disposable database, and finally discards the migration database.

No production endpoint is opened by this script. It is intentionally separate
from the normal boundary rehearsal because a real production snapshot must
never be used as a default test fixture.
"""

from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import create_async_engine

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.core.database import Base
from backend.models import db_models, edu_models  # noqa: F401
from scripts.verify_backend_boundaries import (
    _create_engine,
    _prepare_rows_for_target,
    _row_digest,
)


def _find_binary(name: str) -> str:
    found = shutil.which(name)
    if found:
        return found
    candidate = Path(r"C:\Program Files\PostgreSQL\17\bin") / f"{name}.exe"
    if candidate.exists():
        return str(candidate)
    raise RuntimeError(f"{name} was not found")


def _run(command: list[str], *, env: dict[str, str] | None = None) -> None:
    subprocess.run(command, check=True, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


async def _snapshot(engine) -> dict[str, list[dict[str, object]]]:
    snapshot: dict[str, list[dict[str, object]]] = {}
    async with engine.connect() as conn:
        for table in Base.metadata.sorted_tables:
            snapshot[table.name] = [
                dict(row._mapping) for row in (await conn.execute(select(table))).all()
            ]
    return snapshot


def _digest_summary(snapshot: dict[str, list[dict[str, object]]]) -> dict[str, object]:
    return {
        "tables": len(snapshot),
        "rows": sum(len(rows) for rows in snapshot.values()),
        "counts": {name: len(rows) for name, rows in snapshot.items()},
        "digest": _row_digest(
            [
                {"table": table_name, "row": row}
                for table_name, rows in snapshot.items()
                for row in rows
            ]
        ),
    }


async def _migrate(source_url: str, target_url: str) -> tuple[dict[str, object], dict[str, object]]:
    source = await _create_engine(source_url)
    target = await _create_engine(target_url)
    try:
        source_snapshot = await _snapshot(source)
        async with target.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

        async with target.begin() as conn:
            for table in Base.metadata.sorted_tables:
                rows = source_snapshot[table.name]
                if rows:
                    await conn.execute(insert(table), _prepare_rows_for_target(table, rows))

            # Explicit IDs do not advance PostgreSQL serial/identity sequences.
            # Advance them now so the first post-migration insert cannot collide.
            for table in Base.metadata.sorted_tables:
                primary_key = list(table.primary_key.columns)
                if len(primary_key) != 1 or not primary_key[0].type.python_type is int:
                    continue
                column = primary_key[0]
                maximum = max((row.get(column.name) for row in source_snapshot[table.name]), default=None)
                if maximum is None:
                    continue
                await conn.execute(
                    __import__("sqlalchemy").text(
                        "SELECT setval(pg_get_serial_sequence(:table_name, :column_name), :value, true)"
                    ),
                    {"table_name": table.name, "column_name": column.name, "value": maximum},
                )

        target_snapshot = await _snapshot(target)
        source_summary = _digest_summary(source_snapshot)
        target_summary = _digest_summary(target_snapshot)
        if source_summary != target_summary:
            raise RuntimeError(
                f"migration mismatch: source={source_summary['digest']} target={target_summary['digest']}"
            )
        return source_summary, target_summary
    finally:
        await source.dispose()
        await target.dispose()


async def _verify_restore(target_url: str) -> dict[str, object]:
    engine = await _create_engine(target_url)
    try:
        return _digest_summary(await _snapshot(engine))
    finally:
        await engine.dispose()


def main() -> None:
    source_argument = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PRODUCTION_SQLITE_SNAPSHOT", "")
    source_path = Path(source_argument).expanduser()
    if not source_path.is_file():
        raise SystemExit("PRODUCTION_SQLITE_SNAPSHOT must point to a local SQLite snapshot")

    initdb = _find_binary("initdb")
    postgres = _find_binary("postgres")
    pg_ctl = _find_binary("pg_ctl")
    psql = _find_binary("psql")
    createdb = _find_binary("createdb")
    dropdb = _find_binary("dropdb")
    pg_dump = _find_binary("pg_dump")
    port = "55433"
    common_env = {
        **os.environ,
        "PGHOST": "127.0.0.1",
        "PGPORT": port,
        "PGUSER": "postgres",
    }

    with tempfile.TemporaryDirectory(prefix="ailis-production-migration-") as temp_dir:
        root = Path(temp_dir)
        data_dir = root / "data"
        dump_path = root / "migration.sql"
        _run([initdb, "-D", str(data_dir), "-U", "postgres", "-A", "trust", "-E", "UTF8", "--no-locale"])
        process = subprocess.Popen(
            [postgres, "-D", str(data_dir), "-p", port, "-h", "127.0.0.1"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        migration_db = "ailis_migration"
        restore_db = "ailis_restore"
        try:
            for _ in range(80):
                probe = subprocess.run(
                    [psql, "-d", "postgres", "-c", "SELECT 1"],
                    env=common_env,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                if probe.returncode == 0:
                    break
                time.sleep(0.25)
            else:
                raise RuntimeError("temporary PostgreSQL did not become ready")

            _run([createdb, migration_db], env=common_env)
            _run([createdb, restore_db], env=common_env)
            migration_url = f"postgresql+asyncpg://postgres@127.0.0.1:{port}/{migration_db}"
            restore_url = f"postgresql+asyncpg://postgres@127.0.0.1:{port}/{restore_db}"
            source_url = f"sqlite+aiosqlite:///{source_path.as_posix()}"
            source_summary, migrated_summary = asyncio.run(_migrate(source_url, migration_url))

            dump_env = {**common_env, "PGDATABASE": migration_db}
            _run(
                [
                    pg_dump,
                    "--no-owner",
                    "--no-privileges",
                    "--format=plain",
                    "--file",
                    str(dump_path),
                ],
                env=dump_env,
            )
            restore_env = {**common_env, "PGDATABASE": restore_db}
            _run([psql, "-X", "-v", "ON_ERROR_STOP=1", "-f", str(dump_path)], env=restore_env)
            restored_summary = asyncio.run(_verify_restore(restore_url))
            if restored_summary != migrated_summary:
                raise RuntimeError("pg_dump restore digest does not match migrated database")

            # Rollback rehearsal: discard the candidate migration database and
            # re-read the source snapshot to prove the original is unchanged.
            _run([dropdb, "--if-exists", migration_db], env=common_env)
            source_after_rollback = asyncio.run(_verify_restore(source_url))
            if source_after_rollback != source_summary:
                raise RuntimeError("source snapshot changed during rollback rehearsal")

            print(
                __import__("json").dumps(
                    {
                        "production_touched": False,
                        "source_snapshot": str(source_path),
                        "migration": {"status": "passed", "before": source_summary, "after": migrated_summary},
                        "restore": {"status": "passed", "restored": restored_summary},
                        "rollback": {
                            "status": "passed",
                            "candidate_database_discarded": True,
                            "source_unchanged": source_after_rollback == source_summary,
                        },
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )
        finally:
            _run([dropdb, "--if-exists", restore_db], env=common_env) if process.poll() is None else None
            _run([pg_ctl, "-D", str(data_dir), "-m", "fast", "-w", "stop"], env=common_env)
            if process.poll() is None:
                process.terminate()
                process.wait(timeout=5)


if __name__ == "__main__":
    main()
