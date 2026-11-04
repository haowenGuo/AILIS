"""Install the exact evaluated artifact, never the mutable main working tree."""

import hashlib
import json
import os
import platform
import tarfile
import tempfile
from importlib.resources import files
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urlsplit

PACKAGE = Path(__file__).resolve().parent
LOCK = json.loads((PACKAGE / "runtime-lock.json").read_text(encoding="utf-8"))


@dataclass(frozen=True)
class Settings:
    base_url: str
    api_key: str = field(repr=False)
    provider: str
    model: str = LOCK["model"]
    effort: str = LOCK["reasoning_effort"]

    @classmethod
    def from_env(cls, env=None):
        env = os.environ if env is None else env
        # Hosted Harbor injects its selected credential using this standard name.
        # OPENAI_API_KEY is also supported for the official local ACP runner.
        key = env.get("HOSTED_INFERENCE_TOKEN") or env.get("OPENAI_API_KEY")
        if not key:
            raise ValueError("Missing HOSTED_INFERENCE_TOKEN / OPENAI_API_KEY")
        base = env.get("HOSTED_INFERENCE_URL") or env.get("OPENAI_BASE_URL")
        if not base:
            raise ValueError("Set OPENAI_BASE_URL explicitly; no implicit provider fallback")
        url = urlsplit(base)
        local = url.hostname in ("127.0.0.1", "localhost", "::1")
        if url.username or url.password or url.query or url.fragment:
            raise ValueError("Model URL must not contain credentials, query or fragment")
        if not url.hostname or (url.scheme != "https" and not (url.scheme == "http" and local)):
            raise ValueError("Model URL must use HTTPS (HTTP is allowed only on loopback)")
        protocol = env.get("AILIS_API_FORMAT", "openai_responses")
        providers = {"openai_responses": "openai-responses", "openai_chat_completions": "openai-compatible"}
        if protocol not in providers:
            raise ValueError("Unsupported AILIS_API_FORMAT")
        model = env.get("AILIS_MODEL", LOCK["model"])
        effort = env.get("AILIS_REASONING_EFFORT", LOCK["reasoning_effort"])
        if model != LOCK["model"] or effort != LOCK["reasoning_effort"]:
            raise ValueError("The frozen comparison profile requires gpt-6-luna/xhigh")
        return cls(base.rstrip("/"), key, providers[protocol], model, effort)


def verify_archive(archive: Path, expected: str = LOCK["sha256"]):
    with archive.open("rb") as stream:
        actual = hashlib.file_digest(stream, "sha256").hexdigest()
    if actual != expected:
        raise ValueError("Frozen AILIS runtime SHA256 mismatch")


def extract_archive(archive: Path, destination: Path):
    # The stdlib data filter rejects absolute paths, traversal and escaping links.
    # Internal npm symlinks remain usable. No shell-based extraction is needed.
    with tarfile.open(archive, "r:gz") as bundle:
        bundle.extractall(destination, filter="data")


def prepare_runtime() -> Path:
    if platform.system() != "Linux" or platform.machine().lower() not in ("x86_64", "amd64"):
        raise ValueError("The frozen runtime requires Linux x86_64")
    cache = Path(os.environ.get("AILIS_RUNTIME_CACHE", Path.home() / ".cache/ailis-harbor-acp"))
    cache.mkdir(parents=True, exist_ok=True)
    target = cache / LOCK["sha256"]
    # Each task environment owns its own cache. flock also protects local clients.
    import fcntl
    with (cache / "install.lock").open("a") as guard:
        fcntl.flock(guard, fcntl.LOCK_EX)
        marker = target / "runtime.sha256"
        if marker.is_file() and marker.read_text() == LOCK["sha256"]:
            if (target / "node/bin/node").is_file() and (target / "ailis/electron/ailis-gateway.cjs").is_file():
                return target
            raise ValueError("Cached runtime is incomplete; use a new cache directory")
        if target.exists():
            raise ValueError("Unverified runtime directory exists; use a new cache directory")
        with tempfile.TemporaryDirectory(prefix="install-", dir=cache) as staging:
            staging = Path(staging)
            local = os.environ.get("AILIS_RUNTIME_ARCHIVE")
            if local:
                archive = Path(local).resolve(strict=True)
            else:
                try:
                    archive = Path(str(files("ailis_tb4_runtime") / "runtime.tar.gz"))
                except ModuleNotFoundError:
                    raise ValueError("Frozen runtime dependency is not installed; run uv sync --frozen during setup") from None
            verify_archive(archive)
            unpacked = staging / "unpacked"
            unpacked.mkdir()
            extract_archive(archive, unpacked)
            if not (unpacked / "node/bin/node").is_file() or not (unpacked / "ailis/electron/ailis-gateway.cjs").is_file():
                raise ValueError("Frozen runtime layout is invalid")
            (unpacked / "runtime.sha256").write_text(LOCK["sha256"])
            unpacked.rename(target)
    return target
