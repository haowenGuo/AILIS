import asyncio
import json
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, RedirectResponse, Response

from backend.core.config import get_settings


settings = get_settings()
router = APIRouter()
_static_root = Path(__file__).resolve().parent.parent / "static" / "vivix"


def _ensure_static_root() -> None:
    if not _static_root.exists():
        raise HTTPException(status_code=503, detail="Vivix frontend assets are not deployed yet.")


def _resolve_asset(asset_path: str) -> Path:
    candidate = (_static_root / asset_path).resolve()
    root = _static_root.resolve()

    if candidate == root:
        return root / "index.html"

    if root not in candidate.parents:
        raise HTTPException(status_code=403, detail="Invalid Vivix asset path.")

    if candidate.exists() and candidate.is_file():
        return candidate

    # SPA fallback for non-file-like routes.
    if "." not in Path(asset_path).name:
        return root / "index.html"

    raise HTTPException(status_code=404, detail="Vivix asset not found.")


def _build_ark_url(path: str) -> str:
    base = settings.LLM_API_BASE.rstrip("/")
    return f"{base}/contents/generations{path}"


def _perform_ark_request(method: str, path: str, payload: dict | None = None) -> tuple[int, bytes, str]:
    if not settings.LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY is missing on the AIGril backend.")

    data = None
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
    }

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = Request(
        url=_build_ark_url(path),
        data=data,
        headers=headers,
        method=method,
    )

    try:
        with urlopen(request, timeout=180) as response:
            content_type = response.headers.get("Content-Type", "application/json; charset=utf-8")
            return response.status, response.read(), content_type
    except HTTPError as exc:
        content_type = exc.headers.get("Content-Type", "application/json; charset=utf-8")
        return exc.code, exc.read(), content_type
    except URLError as exc:
        raise HTTPException(status_code=502, detail=f"Vivix Seedance proxy network error: {exc.reason}") from exc


@router.get("/vivix", include_in_schema=False)
async def vivix_redirect():
    return RedirectResponse(url="/vivix/")


@router.get("/vivix/{asset_path:path}", include_in_schema=False)
async def vivix_static(asset_path: str):
    _ensure_static_root()
    normalized = asset_path.strip("/")
    target = _resolve_asset(normalized)
    return FileResponse(target)


@router.post("/api/vivix/seedance/tasks")
async def vivix_create_seedance_task(payload: dict):
    status_code, content, content_type = await asyncio.to_thread(
        _perform_ark_request,
        "POST",
        "/tasks",
        payload,
    )
    return Response(content=content, status_code=status_code, media_type=content_type)


@router.get("/api/vivix/seedance/tasks/{task_id}")
async def vivix_get_seedance_task(task_id: str):
    status_code, content, content_type = await asyncio.to_thread(
        _perform_ark_request,
        "GET",
        f"/tasks/{task_id}",
        None,
    )
    return Response(content=content, status_code=status_code, media_type=content_type)
