"""Run the S3 adapter against an isolated local MinIO process."""

from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import boto3

from scripts.verify_backend_boundaries import main as run_checks


def main() -> None:
    minio = shutil.which("minio.exe") or shutil.which("minio")
    if not minio:
        raise SystemExit("minio executable not found")

    access_key = "ailis-rehearsal"
    secret_key = "ailis-rehearsal-secret"
    endpoint = "http://127.0.0.1:19000"
    with tempfile.TemporaryDirectory(prefix="ailis-minio-boundary-") as data_dir:
        env = os.environ.copy()
        env["MINIO_ROOT_USER"] = access_key
        env["MINIO_ROOT_PASSWORD"] = secret_key
        process = subprocess.Popen(
            [minio, "server", data_dir, "--address", "127.0.0.1:19000", "--console-address", "127.0.0.1:19001"],
            env=env,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        try:
            for _ in range(40):
                try:
                    with urllib.request.urlopen(f"{endpoint}/minio/health/live", timeout=2) as response:
                        if response.status == 200:
                            break
                except Exception:
                    time.sleep(0.25)
            else:
                raise RuntimeError("MinIO did not become ready")

            client = boto3.client(
                "s3",
                endpoint_url=endpoint,
                region_name="us-east-1",
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )
            client.create_bucket(Bucket="ailis-boundary")
            os.environ.update({
                "REHEARSAL_S3_ENDPOINT": endpoint,
                "REHEARSAL_S3_BUCKET": "ailis-boundary",
                "REHEARSAL_S3_REGION": "us-east-1",
                "REHEARSAL_S3_ACCESS_KEY": access_key,
                "REHEARSAL_S3_SECRET_KEY": secret_key,
            })
            asyncio.run(run_checks())
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


if __name__ == "__main__":
    main()
