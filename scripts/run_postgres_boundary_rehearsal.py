"""Run the PostgreSQL migration rehearsal against an isolated local cluster."""

from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.verify_backend_boundaries import main as run_checks


def _find_binary(name: str) -> str:
    path = shutil.which(name)
    if path:
        return path
    candidate = Path(r"C:\Program Files\PostgreSQL\17\bin") / f"{name}.exe"
    if candidate.exists():
        return str(candidate)
    raise SystemExit(f"{name} was not found")


def main() -> None:
    initdb = _find_binary("initdb")
    postgres = _find_binary("postgres")
    pg_ctl = _find_binary("pg_ctl")
    psql = _find_binary("psql")

    with tempfile.TemporaryDirectory(prefix="ailis-postgres-boundary-") as temp_dir:
        data_dir = Path(temp_dir) / "data"
        subprocess.run(
            [initdb, "-D", str(data_dir), "-U", "postgres", "-A", "trust", "-E", "UTF8", "--no-locale"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        process = subprocess.Popen(
            [postgres, "-D", str(data_dir), "-p", "55432", "-h", "127.0.0.1"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        try:
            for _ in range(60):
                probe = subprocess.run(
                    [psql, "-h", "127.0.0.1", "-p", "55432", "-U", "postgres", "-d", "postgres", "-c", "SELECT 1"],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                if probe.returncode == 0:
                    break
                time.sleep(0.25)
            else:
                raise RuntimeError("temporary PostgreSQL did not become ready")

            os.environ["REHEARSAL_POSTGRES_URL"] = "postgresql+asyncpg://postgres@127.0.0.1:55432/postgres"
            os.environ["REHEARSAL_ALLOW_RESET"] = "true"
            asyncio.run(run_checks())
        finally:
            subprocess.run(
                [pg_ctl, "-D", str(data_dir), "-m", "fast", "-w", "stop"],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            if process.poll() is None:
                process.terminate()
                process.wait(timeout=5)


if __name__ == "__main__":
    main()

