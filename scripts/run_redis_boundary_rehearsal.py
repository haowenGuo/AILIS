"""Run the Redis boundary rehearsal against a disposable local Redis process.

This deliberately starts Redis on a loopback-only high port, with persistence
disabled and a temporary working directory. It is a local integration check;
it does not register a Windows service and never connects to production.
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

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.verify_backend_boundaries import main as run_checks


def _find_binary() -> str:
    """Find redis-server without depending on the current shell PATH."""
    direct = shutil.which("redis-server") or shutil.which("redis-server.exe")
    if direct:
        return direct

    package_root = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages"
    candidates = sorted(package_root.glob("**/redis-server.exe"))
    if candidates:
        return str(candidates[-1])
    raise SystemExit("redis-server was not found; install a local Redis package first")


def main() -> None:
    redis_server = _find_binary()
    port = "16379"
    with tempfile.TemporaryDirectory(prefix="ailis-redis-boundary-") as temp_dir:
        process = subprocess.Popen(
            [
                redis_server,
                "--bind",
                "127.0.0.1",
                "--port",
                port,
                "--save",
                "",
                "--appendonly",
                "no",
                "--dir",
                temp_dir,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        try:
            import redis

            client = redis.Redis(host="127.0.0.1", port=int(port), decode_responses=True)
            for _ in range(80):
                if process.poll() is not None:
                    output = process.stdout.read() if process.stdout else ""
                    raise RuntimeError(f"temporary Redis exited early: {output[-2000:]}")
                try:
                    if client.ping():
                        break
                except redis.RedisError:
                    time.sleep(0.25)
            else:
                raise RuntimeError("temporary Redis did not become ready")

            os.environ["REHEARSAL_REDIS_URL"] = f"redis://127.0.0.1:{port}/0"
            asyncio.run(run_checks())
        finally:
            client = locals().get("client")
            if client is not None:
                try:
                    client.shutdown(nosave=True)
                except Exception:
                    pass
                try:
                    client.close()
                except Exception:
                    pass
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
            if process.stdout:
                process.stdout.close()


if __name__ == "__main__":
    main()
