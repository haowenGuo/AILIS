from fastapi import APIRouter

from backend.api.schemas import (
    LegacySafetyRequest,
    LegacySafetyResponse,
    SafetyCheckRequest,
    SafetyCheckResponse,
)
from backend.services.ai_safety_service import AISafetyService


router = APIRouter()


@router.post("/safety/check", response_model=SafetyCheckResponse)
async def safety_check_endpoint(request: SafetyCheckRequest):
    """
    新版安全检测接口。
    会返回：
    1. 综合风险判定
    2. 三路算法的详细结果
    """
    service = AISafetyService()
    evaluation = await service.evaluate_content(
        content=request.content,
        task_type=request.task_type,
        extra=request.extra,
    )

    return SafetyCheckResponse(
        task=request.task_type,
        your_content=evaluation.content,
        risk_check=evaluation.risk_check.to_dict(),
        algorithms={
            name: result.to_dict()
            for name, result in evaluation.algorithms.items()
        },
    )


@router.post("/handle", response_model=LegacySafetyResponse)
async def legacy_safety_handle(request: LegacySafetyRequest):
    """
    兼容旧版接口格式：
    {
      "task_type": "...",
      "params": {"content": "..."},
      "extra": "..."
    }

    这里保持永远返回 200 的设计，便于你沿用旧调用方。
    """
    content = str((request.params or {}).get("content", "")).strip()
    service = AISafetyService()

    try:
        evaluation = await service.evaluate_content(
            content=content,
            task_type=request.task_type,
            extra=request.extra,
        )
        payload = evaluation.to_dict()
        return LegacySafetyResponse(
            code=200,
            msg="检测完成",
            data=payload,
        )
    except Exception as exc:
        print(f"[AISafety] legacy handle 兜底异常: {exc}")
        return LegacySafetyResponse(
            code=200,
            msg="检测完成（服务异常）",
            data={
                "task": request.task_type,
                "your_content": content,
                "risk_check": {
                    "algorithm": "aggregate",
                    "risk_level": "高风险",
                    "risk_type": ["服务异常，自动判定高风险"],
                    "confidence": 0.99,
                    "suggestion": "建议暂时拦截，并人工复核。",
                    "summary": "安全检测服务发生异常。",
                    "policy_hits": ["系统异常"],
                    "normalized_content": None,
                    "latent_intent": None,
                    "meta": {"error": str(exc)},
                },
                "algorithms": {},
            },
        )
