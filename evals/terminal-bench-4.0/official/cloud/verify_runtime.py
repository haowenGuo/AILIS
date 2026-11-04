"""Read-only publication checks; print paths/hashes, never possible secret values."""

import argparse
import hashlib
import json
import re
import tarfile
from pathlib import Path

from ailis_harbor_acp.runtime import LOCK, verify_archive


def inspect(archive):
    verify_archive(archive)
    suspects = []
    members = 0
    inspected_bytes = 0
    # This is a publication gate, not a claim to detect every possible secret.
    patterns = {
        "private-key": rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        "provider-token": rb"\b(?:sk-proj-|ghp_|github_pat_)[A-Za-z0-9_-]{24,}",
        "jwt": rb"\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}",
        "assigned-secret": rb'''(?i)(?:api_key|apiKey|access_token|refresh_token)\s*[=:]\s*["'][A-Za-z0-9_-]{32,}["']''',
    }
    hashes = {}
    reviewed = {
        "node/lib/node_modules/npm/docs/content/using-npm/config.md": "4793d88688041eb7660ffc8fa249a0e41f2dad7bbdcd2441073424b154b8bb02",
        "node/lib/node_modules/npm/node_modules/@npmcli/config/lib/definitions/definitions.js": "83b2068320f1a131c96658940e80522ec1f29150b338ce40eccf486e0ee05900",
        "node/lib/node_modules/npm/.npmrc": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    }
    reviewed_matches = []
    with tarfile.open(archive, "r:gz") as bundle:
        for member in bundle:
            members += 1
            path = Path(member.name)
            if member.name in reviewed:
                data = bundle.extractfile(member).read()
                if hashlib.sha256(data).hexdigest() == reviewed[member.name]:
                    reviewed_matches.append({"path": member.name, "sha256": reviewed[member.name],
                        "reason": "Reviewed npm documentation XXXX placeholders or empty npmrc"})
                    continue
            if path.name in {"auth.json", ".env", ".npmrc", "id_rsa", "id_ed25519"}:
                suspects.append({"path": member.name, "reason": "credential-filename"})
            if not member.isfile():
                continue
            required = member.name in {
                "ailis/agent.cjs", "ailis/electron/ailis-gateway.cjs",
                "ailis/electron/agent-loop/runner.cjs", "ailis/electron/ailis-context-manager.cjs",
                "ailis/electron/codex-exec-runtime.cjs", "ailis/electron/codex-exec-output.cjs",
                "ailis/electron/prompts/codex-gpt-5.6.instructions.md",
                "ailis/.local/codex-exec/0.159.0/linux/package/vendor/x86_64-unknown-linux-musl/bin/codex",
            }
            text = path.suffix.lower() in {".py", ".js", ".cjs", ".mjs", ".json", ".md", ".sh", ".ps1", ".yaml", ".toml", ".txt"}
            if required or text:
                with bundle.extractfile(member) as stream:
                    if required:
                        digest = hashlib.sha256()
                        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                            digest.update(chunk)
                        hashes[member.name] = digest.hexdigest()
                        stream.seek(0)
                    if text:
                        data = stream.read()
                        inspected_bytes += len(data)
                        for reason, pattern in patterns.items():
                            if re.search(pattern, data):
                                suspects.append({"path": member.name, "reason": reason})
    return {"archive_sha256": LOCK["sha256"], "archive_bytes": archive.stat().st_size,
            "members": members, "text_bytes_scanned": inspected_bytes,
            "critical_files": hashes, "reviewed_benign_matches": reviewed_matches, "suspects": suspects}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = inspect(args.archive)
    payload = json.dumps(result, indent=2)
    if args.output:
        args.output.write_text(payload + "\n", encoding="utf-8")
    print(payload)
    raise SystemExit(bool(result["suspects"]))
