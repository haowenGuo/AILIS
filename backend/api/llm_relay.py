import json
from contextlib import AsyncExitStack
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import StreamingResponse

from backend.core.config import get_settings
from backend.services.hosted_agent_service import (
    HostedAgentRuntimeClient,
    HostedWebSession,
    HostedWebSessionService,
)
from backend.services.llm_relay_service import LlmRelayGuard, LlmRelayLimitError


router = APIRouter()
settings = get_settings()
session_service = HostedWebSessionService()
runtime_client = HostedAgentRuntimeClient()
relay_guard = LlmRelayGuard(
    requests_per_minute=settings.AILIS_LLM_RELAY_REQUESTS_PER_MINUTE,
    max_concurrent=settings.AILIS_LLM_RELAY_MAX_CONCURRENT_PER_SESSION,
)
ip_relay_guard = LlmRelayGuard(
    requests_per_minute=settings.AILIS_LLM_RELAY_IP_REQUESTS_PER_MINUTE,
    max_concurrent=settings.AILIS_LLM_RELAY_GLOBAL_MAX_CONCURRENT,
)
global_relay_guard = LlmRelayGuard(
    requests_per_minute=settings.AILIS_LLM_RELAY_GLOBAL_REQUESTS_PER_MINUTE,
    max_concurrent=settings.AILIS_LLM_RELAY_GLOBAL_MAX_CONCURRENT,
)


def _require_relay_enabled() -> None:
    if not settings.AILIS_LLM_RELAY_ENABLED:
        raise HTTPException(status_code=503, detail="AILIS Cloud relay is disabled.")
    if not settings.AILIS_HOSTED_RUNTIME_ENABLED:
        raise HTTPException(status_code=503, detail="AILIS Hosted Runtime is disabled.")
    if not session_service.configured:
        raise HTTPException(status_code=503, detail="AILIS session signing is not configured.")


def _request_token(authorization: str | None, session_header: str | None) -> str:
    header_token = (session_header or "").strip()
    if header_token:
        return header_token
    auth = (authorization or "").strip()
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return ""


def _resolve_session(token: str) -> HostedWebSession:
    _require_relay_enabled()
    session = session_service.verify(token)
    if not session:
        raise HTTPException(status_code=401, detail="AILIS Cloud 会话无效，请重新建立会话。")
    return session


def _runtime_error(error: Exception) -> HTTPException:
    if isinstance(error, httpx.TimeoutException):
        return HTTPException(status_code=504, detail="AILIS Cloud 模型调用超时。")
    if isinstance(error, httpx.HTTPStatusError):
        upstream_status = error.response.status_code
        status_code = 429 if upstream_status == 429 else 502
        return HTTPException(
            status_code=status_code,
            detail=f"AILIS Cloud 上游返回 HTTP {upstream_status}。",
        )
    return HTTPException(status_code=502, detail=f"AILIS Cloud 暂时不可用：{error}")


def _limited_payload(payload: dict) -> dict:
    allowed = {
        "messages",
        "tools",
        "tool_choice",
        "response_format",
        "temperature",
        "max_tokens",
        "max_completion_tokens",
        "parallel_tool_calls",
        "reasoning_effort",
        "thinking",
        "stream",
        "stream_options",
    }
    forwarded = {key: value for key, value in (payload or {}).items() if key in allowed}
    forwarded["model"] = "ailis-cloud"
    body_size = len(json.dumps(forwarded, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    if body_size > settings.AILIS_LLM_RELAY_MAX_BYTES:
        raise HTTPException(status_code=413, detail="AILIS Cloud 请求上下文过大。")
    return forwarded


def _rate_limit_error(error: LlmRelayLimitError) -> HTTPException:
    detail = "请求过于频繁，请稍后重试。" if error.reason == "rate_limit" else "当前会话已有模型请求正在运行。"
    return HTTPException(
        status_code=429,
        detail=detail,
        headers={"Retry-After": str(error.retry_after)},
    )


def _client_limit_key(request: Request) -> str:
    peer = request.client.host if request.client else "unknown"
    if not settings.AILIS_LLM_RELAY_TRUST_PROXY_HEADERS:
        return f"peer:{peer}"
    forwarded = (
        request.headers.get("cf-connecting-ip")
        or request.headers.get("x-real-ip")
        or (request.headers.get("x-forwarded-for") or "").split(",", 1)[0]
    ).strip()
    return f"proxy:{forwarded[:128] or peer}"


async def _enter_relay_limits(request: Request, session: HostedWebSession) -> AsyncExitStack:
    stack = AsyncExitStack()
    await stack.__aenter__()
    try:
        await stack.enter_async_context(global_relay_guard.acquire("global"))
        await stack.enter_async_context(ip_relay_guard.acquire(_client_limit_key(request)))
        await stack.enter_async_context(relay_guard.acquire(session.session_id))
    except Exception:
        await stack.aclose()
        raise
    return stack


@router.get("/llm/session")
async def llm_relay_session(
    authorization: str | None = Header(default=None),
    x_ailis_web_session: str | None = Header(default=None),
):
    _require_relay_enabled()
    token = _request_token(authorization, x_ailis_web_session)
    session = session_service.verify(token)
    if not session:
        session = session_service.issue()
    return {
        "ok": True,
        "sessionId": session.session_id,
        "token": session.token,
        "expiresAt": datetime.fromtimestamp(session.expires_at, tz=timezone.utc).isoformat(),
        "runtime": "ailis-cloud",
    }


@router.get("/llm/status")
async def llm_relay_status(
    authorization: str | None = Header(default=None),
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(_request_token(authorization, x_ailis_web_session))
    try:
        status = await runtime_client.llm_status()
    except Exception as error:
        raise _runtime_error(error) from error
    return {
        "ok": bool(status.get("ok") and status.get("configured")),
        "sessionId": session.session_id,
        "provider": "ailis-cloud",
        "configured": bool(status.get("configured")),
        "transport": "chat-completions",
    }


@router.post("/llm/v1/chat/completions")
async def llm_relay_chat_completions(
    payload: dict,
    request: Request,
    authorization: str | None = Header(default=None),
    x_ailis_web_session: str | None = Header(default=None),
):
    session = _resolve_session(_request_token(authorization, x_ailis_web_session))
    try:
        content_length = int(request.headers.get("content-length") or 0)
    except ValueError:
        content_length = 0
    if content_length > settings.AILIS_LLM_RELAY_MAX_BYTES:
        raise HTTPException(status_code=413, detail="AILIS Cloud 请求上下文过大。")
    forwarded = _limited_payload(payload)
    wants_stream = forwarded.get("stream") is True or "text/event-stream" in (
        request.headers.get("accept") or ""
    ).lower()

    if not wants_stream:
        try:
            limits = await _enter_relay_limits(request, session)
            try:
                return await runtime_client.run_llm_completion(forwarded)
            finally:
                await limits.aclose()
        except LlmRelayLimitError as error:
            raise _rate_limit_error(error) from error
        except Exception as error:
            raise _runtime_error(error) from error

    try:
        limits = await _enter_relay_limits(request, session)
    except LlmRelayLimitError as error:
        raise _rate_limit_error(error) from error

    async def stream_response():
        try:
            async for chunk in runtime_client.stream_llm_completion(forwarded):
                yield chunk
        finally:
            await limits.aclose()

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )
