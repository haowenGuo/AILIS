from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse

from backend.core.config import get_settings
from backend.services.hosted_agent_service import (
    HostedAgentRuntimeClient,
    HostedWebSession,
    HostedWebSessionService,
)


router = APIRouter()
settings = get_settings()
session_service = HostedWebSessionService()
runtime_client = HostedAgentRuntimeClient()


def _require_runtime_enabled() -> None:
    if not settings.AILIS_HOSTED_RUNTIME_ENABLED:
        raise HTTPException(status_code=503, detail="AILIS Hosted Runtime is disabled.")
    if not session_service.configured:
        raise HTTPException(status_code=503, detail="AILIS web session signing is not configured.")


def _resolve_session(token: str | None) -> HostedWebSession:
    _require_runtime_enabled()
    session = session_service.verify((token or "").strip())
    if not session:
        raise HTTPException(status_code=401, detail="网页 Agent 会话无效，请重新建立会话。")
    return session


def _runtime_error(error: Exception) -> HTTPException:
    if isinstance(error, httpx.TimeoutException):
        return HTTPException(status_code=504, detail="AILIS Agent Runtime 调用超时。")
    if isinstance(error, httpx.HTTPStatusError):
        return HTTPException(
            status_code=502,
            detail=f"AILIS Agent Runtime 返回 HTTP {error.response.status_code}。",
        )
    return HTTPException(status_code=502, detail=f"AILIS Agent Runtime 暂时不可用：{error}")


async def _read_limited_body(request: Request, max_bytes: int) -> bytes:
    chunks: list[bytes] = []
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"单个附件不能超过 {max_bytes // (1024 * 1024)} MB。",
            )
        chunks.append(chunk)
    return b"".join(chunks)


@router.get("/agent/session")
async def hosted_agent_session(
    x_ailis_web_session: str | None = Header(default=None),
):
    _require_runtime_enabled()
    session = session_service.verify((x_ailis_web_session or "").strip())
    if not session:
        session = session_service.issue()
    return {
        "ok": True,
        "sessionId": session.session_id,
        "token": session.token,
        "expiresAt": datetime.fromtimestamp(
            session.expires_at,
            tz=timezone.utc,
        ).isoformat(),
        "runtime": "ailis-hosted",
    }


@router.get("/agent/status")
async def hosted_agent_status(
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(x_ailis_web_session)
    try:
        return await runtime_client.tenant_status(session.tenant_id)
    except Exception as error:
        raise _runtime_error(error) from error


@router.get("/agent/events")
async def hosted_agent_events(
    cursor: int = 0,
    limit: int = 100,
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(x_ailis_web_session)
    try:
        return await runtime_client.recent_events(
            session.tenant_id,
            cursor=max(0, cursor),
            limit=max(1, min(limit, 500)),
        )
    except Exception as error:
        raise _runtime_error(error) from error


@router.post("/agent/attachments")
async def hosted_agent_upload_attachment(
    request: Request,
    filename: str = Query(default="attachment.bin", max_length=200),
    session_id: str = Query(default="main", alias="sessionId", max_length=160),
    mime_type: str = Query(default="application/octet-stream", alias="mimeType", max_length=160),
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(x_ailis_web_session)
    try:
        content_length = int(request.headers.get("content-length") or 0)
    except ValueError:
        content_length = 0
    max_bytes = max(1024, settings.AILIS_HOSTED_ATTACHMENT_MAX_BYTES)
    if content_length > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"单个附件不能超过 {max_bytes // (1024 * 1024)} MB。",
        )
    content = await _read_limited_body(request, max_bytes)
    if not content:
        raise HTTPException(status_code=400, detail="附件内容为空。")
    try:
        return await runtime_client.upload_attachment(
            session.tenant_id,
            session_id=session_id,
            filename=filename,
            mime_type=mime_type,
            content=content,
        )
    except httpx.HTTPStatusError as error:
        status_code = error.response.status_code
        if status_code == 413:
            raise HTTPException(status_code=413, detail="附件过大或当前会话的附件空间已满。") from error
        raise _runtime_error(error) from error
    except Exception as error:
        raise _runtime_error(error) from error


@router.post("/agent/run")
async def hosted_agent_run(
    payload: dict,
    request: Request,
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(x_ailis_web_session)
    forwarded = dict(payload or {})
    forwarded["client"] = {
        "origin": request.headers.get("origin") or "",
        "userAgent": (request.headers.get("user-agent") or "")[:300],
        "runtime": "web",
    }
    try:
        if "text/event-stream" in (request.headers.get("accept") or "").lower():
            return StreamingResponse(
                runtime_client.stream_agent(session.tenant_id, forwarded),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache, no-transform",
                    "X-Accel-Buffering": "no",
                },
            )
        return await runtime_client.run_agent(session.tenant_id, forwarded)
    except Exception as error:
        raise _runtime_error(error) from error


@router.post("/agent/interrupt")
async def hosted_agent_interrupt(
    payload: dict,
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(x_ailis_web_session)
    try:
        return await runtime_client.interrupt(session.tenant_id, payload or {})
    except Exception as error:
        raise _runtime_error(error) from error
