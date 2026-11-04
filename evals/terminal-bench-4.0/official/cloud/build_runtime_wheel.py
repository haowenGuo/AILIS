"""Wrap the unchanged archive as a data-only wheel for Harbor's uv install step."""

import argparse
import base64
import csv
import hashlib
import io
import json
import zipfile
from pathlib import Path

from verify_runtime import inspect

NAME = "ailis_tb4_runtime"
VERSION = "0.20261029.0"


def build(archive, license_file, destination):
    audit = inspect(archive)
    if audit["suspects"]:
        raise ValueError("Unreviewed credential candidates; do not publish this artifact")
    destination.mkdir(parents=True, exist_ok=True)
    wheel_path = destination / f"{NAME}-{VERSION}-py3-none-any.whl"
    dist = f"{NAME}-{VERSION}.dist-info"
    rows = []
    # The tar.gz already contains compressed bytes. STORE avoids recompressing it.
    with zipfile.ZipFile(wheel_path, "w", compression=zipfile.ZIP_STORED) as wheel:
        files = {
            f"{NAME}/__init__.py": b'"""Immutable Linux AILIS runtime data; no import-time code."""\n',
            f"{dist}/METADATA": (f"Metadata-Version: 2.1\nName: ailis-tb4-runtime\nVersion: {VERSION}\n"
                "Summary: Frozen AILIS runtime data for Harbor ACP\nLicense: MIT; bundled dependencies retain their licenses\n\n"
                "Data-only wheel. Executable payload is Linux x86_64; checked by the ACP adapter.\n").encode(),
            f"{dist}/WHEEL": b"Wheel-Version: 1.0\nGenerator: ailis-runtime-wrapper\nRoot-Is-Purelib: true\nTag: py3-none-any\n",
            f"{dist}/LICENSE": license_file.read_bytes(),
            f"{NAME}/provenance.json": (json.dumps(audit, indent=2) + "\n").encode(),
        }
        for name, data in files.items():
            wheel.writestr(name, data)
            digest = base64.urlsafe_b64encode(hashlib.sha256(data).digest()).rstrip(b"=").decode()
            rows.append([name, "sha256=" + digest, str(len(data))])
        name = f"{NAME}/runtime.tar.gz"
        wheel.write(archive, name)
        digest = base64.urlsafe_b64encode(bytes.fromhex(audit["archive_sha256"])).rstrip(b"=").decode()
        rows.append([name, "sha256=" + digest, str(archive.stat().st_size)])
        rows.append([f"{dist}/RECORD", "", ""])
        record = io.StringIO(newline="")
        csv.writer(record).writerows(rows)
        wheel.writestr(f"{dist}/RECORD", record.getvalue())
    with wheel_path.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    print(json.dumps({"wheel": str(wheel_path), "sha256": digest,
                      "bytes": wheel_path.stat().st_size, "runtime_sha256": audit["archive_sha256"]}, indent=2))
    return wheel_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("--license", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=Path("dist"))
    args = parser.parse_args()
    build(args.archive, args.license, args.output_dir)
