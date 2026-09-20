"""Object storage boundary.

LocalObjectStorage preserves the existing single-host behavior. S3ObjectStorage
supports S3-compatible services such as OSS, MinIO, and Cloudflare R2 when the
deployment supplies the optional boto3 dependency and configuration.
"""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Protocol


class ObjectStorage(Protocol):
    async def put_bytes(self, key: str, content: bytes, *, content_type: str = "application/octet-stream") -> str: ...

    async def get_bytes(self, key: str) -> bytes: ...

    async def delete(self, key: str) -> None: ...


class LocalObjectStorage:
    def __init__(self, root: str | Path) -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        candidate = (self.root / key).resolve()
        if self.root.resolve() not in candidate.parents and candidate != self.root.resolve():
            raise ValueError("object key escapes storage root")
        return candidate

    async def put_bytes(self, key: str, content: bytes, *, content_type: str = "application/octet-stream") -> str:
        del content_type
        path = self._path(key)
        await asyncio.to_thread(path.parent.mkdir, parents=True, exist_ok=True)
        await asyncio.to_thread(path.write_bytes, content)
        return key

    async def get_bytes(self, key: str) -> bytes:
        return await asyncio.to_thread(self._path(key).read_bytes)

    async def delete(self, key: str) -> None:
        path = self._path(key)
        if path.exists():
            await asyncio.to_thread(path.unlink)


class S3ObjectStorage:
    def __init__(self, *, bucket: str, endpoint_url: str = "", region: str = "", access_key: str = "", secret_key: str = "") -> None:
        if not bucket:
            raise ValueError("OBJECT_STORAGE_BUCKET is required")
        try:
            import boto3
        except ImportError as error:  # pragma: no cover - depends on deployment extras
            raise RuntimeError("Install boto3 to use S3 object storage") from error
        self.bucket = bucket
        self._client = boto3.client(
            "s3",
            endpoint_url=endpoint_url or None,
            region_name=region or None,
            aws_access_key_id=access_key or None,
            aws_secret_access_key=secret_key or None,
        )

    async def put_bytes(self, key: str, content: bytes, *, content_type: str = "application/octet-stream") -> str:
        await asyncio.to_thread(
            self._client.put_object,
            Bucket=self.bucket,
            Key=key,
            Body=content,
            ContentType=content_type,
        )
        return key

    async def get_bytes(self, key: str) -> bytes:
        response = await asyncio.to_thread(self._client.get_object, Bucket=self.bucket, Key=key)
        return await asyncio.to_thread(response["Body"].read)

    async def delete(self, key: str) -> None:
        await asyncio.to_thread(self._client.delete_object, Bucket=self.bucket, Key=key)


def create_object_storage(settings) -> ObjectStorage:
    if settings.OBJECT_STORAGE_PROVIDER.strip().lower() == "s3":
        return S3ObjectStorage(
            bucket=settings.OBJECT_STORAGE_BUCKET,
            endpoint_url=settings.OBJECT_STORAGE_ENDPOINT_URL,
            region=settings.OBJECT_STORAGE_REGION,
            access_key=settings.OBJECT_STORAGE_ACCESS_KEY,
            secret_key=settings.OBJECT_STORAGE_SECRET_KEY,
        )
    # In production DATA_DIR is normally a writable bind mount while the
    # source tree is read-only.  Keep the explicit override for deployments
    # that need a different root, but never default writes into source code.
    local_root = (settings.OBJECT_STORAGE_LOCAL_ROOT or "").strip()
    if not local_root:
        local_root = str(Path(settings.DATA_DIR) / "objects")
    return LocalObjectStorage(local_root)
