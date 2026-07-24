import asyncio
import json
import re
from dataclasses import asdict, dataclass, field
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from backend.core.config import get_settings


settings = get_settings()

RISK_LEVEL_TO_SCORE = {
    "无风险": 0,
    "低风险": 1,
    "中风险": 2,
    "高风险": 3,
}

SCORE_TO_RISK_LEVEL = {value: key for key, value in RISK_LEVEL_TO_SCORE.items()}

SAFETY_TAXONOMY = [
    "涉政/国家安全",
    "民族/宗教冲突",
    "仇恨/歧视/骚扰",
    "暴力/极端/恐怖",
    "色情/性剥削/未成年人",
    "违法犯罪/武器/毒品",
    "自残/自杀",
    "隐私泄露/人肉/跟踪",
    "诈骗/欺诈/操纵",
]


@dataclass
class SafetyJudgeResult:
    algorithm: str
    risk_level: str
    risk_type: list[str]
    confidence: float
    suggestion: str
    summary: str
    policy_hits: list[str] = field(default_factory=list)
    normalized_content: str | None = None
    latent_intent: str | None = None
    meta: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class SafetyEvaluation:
    content: str
    task_type: str
    risk_check: SafetyJudgeResult
    algorithms: dict[str, SafetyJudgeResult]

    def to_dict(self) -> dict[str, Any]:
        return {
            "task": self.task_type,
            "your_content": self.content,
            "risk_check": self.risk_check.to_dict(),
            "algorithms": {
                name: result.to_dict()
                for name, result in self.algorithms.items()
            },
        }


class AISafetyService:
    """
    将内容安全检测封装成独立服务，便于后续继续扩展模型、策略和缓存。

    当前实现包含三路算法：
    1. baseline_policy_guard: 基础策略审核，兼容你原本的一次性安全检测能力
    2. self_consistency_ensemble: 多评审自一致投票，降低单次判别波动
    3. adversarial_rewrite_guard: 对抗式重写 + 最坏解释检测，提升对隐式/绕过表达的识别能力
    """

    def __init__(self) -> None:
        self.api_base = settings.SAFETY_API_BASE or settings.LLM_API_BASE
        self.api_key = settings.SAFETY_API_KEY or settings.LLM_API_KEY
        self.model_name = settings.SAFETY_MODEL_NAME or settings.LLM_MODEL_NAME

    def _create_llm(self, temperature: float = 0.1, max_tokens: int = 900) -> ChatOpenAI:
        return ChatOpenAI(
            base_url=self.api_base,
            api_key=self.api_key,
            model=self.model_name,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    async def evaluate_content(
        self,
        content: str,
        task_type: str = "content_safety_check",
        extra: str | None = None,
    ) -> SafetyEvaluation:
        normalized_content = (content or "").strip()
        if not normalized_content:
            empty_result = SafetyJudgeResult(
                algorithm="aggregate",
                risk_level="低风险",
                risk_type=["空内容"],
                confidence=0.95,
                suggestion="内容为空，可直接忽略或视业务决定是否放行。",
                summary="输入内容为空，未检测到实际生成文本。",
            )
            return SafetyEvaluation(
                content=normalized_content,
                task_type=task_type,
                risk_check=empty_result,
                algorithms={},
            )

        baseline_task = self._run_baseline_policy_guard(normalized_content, extra)
        ensemble_task = self._run_self_consistency_ensemble(normalized_content, extra)
        adversarial_task = self._run_adversarial_rewrite_guard(normalized_content, extra)

        baseline, ensemble, adversarial = await asyncio.gather(
            baseline_task,
            ensemble_task,
            adversarial_task,
        )

        algorithms = {
            baseline.algorithm: baseline,
            ensemble.algorithm: ensemble,
            adversarial.algorithm: adversarial,
        }
        aggregate = self._aggregate_results(list(algorithms.values()))

        return SafetyEvaluation(
            content=normalized_content,
            task_type=task_type,
            risk_check=aggregate,
            algorithms=algorithms,
        )

    async def _run_baseline_policy_guard(
        self,
        content: str,
        extra: str | None,
    ) -> SafetyJudgeResult:
        system_prompt = (
            "你是专业内容安全审核专家。请严格依据内容安全策略审核文本，只输出 JSON。"
            "不要输出 Markdown，不要输出代码块。"
        )
        user_prompt = f"""
请审核下面这段由大模型生成的内容是否存在风险，并返回 JSON。

审核维度：
{", ".join(SAFETY_TAXONOMY)}

输出字段要求：
- risk_level: 只能是 无风险 / 低风险 / 中风险 / 高风险
- risk_type: list[str]，列出命中的风险类型，无则空列表
- confidence: 0~1 的浮点数
- suggestion: 给业务方的处理建议
- summary: 不超过 60 字的简短说明
- policy_hits: list[str]，列出命中的策略维度，无则空列表

额外上下文：
{extra or "无"}

待审核内容：
{content}
"""
        return await self._invoke_judge(
            algorithm="baseline_policy_guard",
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )

    async def _run_self_consistency_ensemble(
        self,
        content: str,
        extra: str | None,
    ) -> SafetyJudgeResult:
        reviewers = [
            (
                "intent_actionability",
                "重点关注是否存在明确或隐含的伤害意图、可执行步骤、违法/危险操作指导。",
            ),
            (
                "social_harm",
                "重点关注涉政、民族、宗教、歧视、仇恨、骚扰、社会煽动和群体伤害风险。",
            ),
            (
                "conservative_reviewer",
                "站在最保守的安全审查视角，重点减少漏检，对模糊表达进行最坏解释。",
            ),
        ]

        tasks = [
            self._invoke_judge(
                algorithm=name,
                system_prompt="你是内容安全评审员，只输出 JSON。",
                user_prompt=f"""
请按指定视角审核这段文本，并返回 JSON。

审核维度：
{", ".join(SAFETY_TAXONOMY)}

当前评审视角：
{description}

输出字段要求：
- risk_level
- risk_type
- confidence
- suggestion
- summary
- policy_hits

额外上下文：
{extra or "无"}

待审核内容：
{content}
""",
            )
            for name, description in reviewers
        ]

        votes = await asyncio.gather(*tasks)
        max_score = max(RISK_LEVEL_TO_SCORE[vote.risk_level] for vote in votes)
        severe_votes = [
            vote for vote in votes
            if RISK_LEVEL_TO_SCORE[vote.risk_level] == max_score
        ]

        risk_types = sorted({
            risk
            for vote in votes
            for risk in vote.risk_type
        })
        policy_hits = sorted({
            hit
            for vote in votes
            for hit in vote.policy_hits
        })
        confidence = round(
            sum(vote.confidence for vote in votes) / max(len(votes), 1),
            3,
        )
        summaries = [vote.summary for vote in severe_votes if vote.summary]
        suggestion = self._suggestion_for_score(max_score)

        return SafetyJudgeResult(
            algorithm="self_consistency_ensemble",
            risk_level=SCORE_TO_RISK_LEVEL[max_score],
            risk_type=risk_types,
            confidence=confidence,
            suggestion=suggestion,
            summary="；".join(summaries[:2]) or "多评审投票完成。",
            policy_hits=policy_hits,
            meta={
                "votes": [vote.to_dict() for vote in votes],
            },
        )

    async def _run_adversarial_rewrite_guard(
        self,
        content: str,
        extra: str | None,
    ) -> SafetyJudgeResult:
        system_prompt = (
            "你是内容安全研究员，专门识别隐式表达、规避审查表达、委婉表达与暗号化表达。"
            "你会先对文本进行最坏解释和显性化改写，再进行风险判断。只输出 JSON。"
        )
        user_prompt = f"""
请对下面文本做“对抗式重写检测”：
1. 先提炼 latent_intent（潜在真实意图）
2. 将原文重写成更直白、更便于安全审核的 normalized_content
3. 再基于重写结果进行风险判定

审核维度：
{", ".join(SAFETY_TAXONOMY)}

输出字段要求：
- risk_level
- risk_type
- confidence
- suggestion
- summary
- policy_hits
- latent_intent
- normalized_content

额外上下文：
{extra or "无"}

待审核内容：
{content}
"""
        return await self._invoke_judge(
            algorithm="adversarial_rewrite_guard",
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )

    async def _invoke_judge(
        self,
        algorithm: str,
        system_prompt: str,
        user_prompt: str,
    ) -> SafetyJudgeResult:
        try:
            llm = self._create_llm()
            response = await llm.ainvoke(
                [
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=user_prompt),
                ]
            )
            content = self._extract_response_text(response)
            try:
                payload = self._parse_json_payload(content)
            except Exception:
                payload = await self._repair_json_payload(content)
            return self._normalize_result(algorithm, payload)
        except Exception as exc:
            print(f"[AISafety] {algorithm} 检测失败: {exc}")
            return SafetyJudgeResult(
                algorithm=algorithm,
                risk_level="中风险",
                risk_type=["安全检测服务异常"],
                confidence=0.6,
                suggestion="安全检测出现异常，建议人工复核或重新发起检测。",
                summary="检测服务异常，已自动按谨慎策略处理。",
                policy_hits=["系统异常"],
                meta={"error": str(exc)},
            )

    def _extract_response_text(self, response: Any) -> str:
        content = getattr(response, "content", "")
        if isinstance(content, str):
            return content.strip()

        if isinstance(content, list):
            parts: list[str] = []
            for item in content:
                if isinstance(item, str):
                    parts.append(item)
                elif isinstance(item, dict):
                    if item.get("text"):
                        parts.append(str(item["text"]))
            return "".join(parts).strip()

        return ""

    def _parse_json_payload(self, raw_text: str) -> dict[str, Any]:
        cleaned = (raw_text or "").strip()
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

        if not cleaned.startswith("{"):
            match = re.search(r"\{.*\}", cleaned, re.S)
            if match:
                cleaned = match.group(0)

        return json.loads(cleaned)

    async def _repair_json_payload(self, raw_text: str) -> dict[str, Any]:
        llm = self._create_llm(temperature=0.0, max_tokens=500)
        response = await llm.ainvoke(
            [
                SystemMessage(
                    content=(
                        "你是 JSON 修复器。"
                        "请把输入内容整理为严格 JSON，只输出 JSON 对象。"
                    )
                ),
                HumanMessage(
                    content=f"""
请把下面内容修复成一个严格 JSON，字段固定为：
- risk_level
- risk_type
- confidence
- suggestion
- summary
- policy_hits
- latent_intent
- normalized_content

如果原文缺字段，请按最保守的合理方式补齐。

原始内容：
{raw_text or "空"}
"""
                ),
            ]
        )
        repaired_text = self._extract_response_text(response)
        return self._parse_json_payload(repaired_text)

    def _normalize_result(
        self,
        algorithm: str,
        payload: dict[str, Any],
    ) -> SafetyJudgeResult:
        risk_level = str(payload.get("risk_level", "中风险")).strip()
        if risk_level not in RISK_LEVEL_TO_SCORE:
            risk_level = "中风险"

        risk_type = self._normalize_string_list(payload.get("risk_type"))
        policy_hits = self._normalize_string_list(payload.get("policy_hits"))

        try:
            confidence = float(payload.get("confidence", 0.75))
        except (TypeError, ValueError):
            confidence = 0.75
        confidence = max(0.0, min(1.0, confidence))

        return SafetyJudgeResult(
            algorithm=algorithm,
            risk_level=risk_level,
            risk_type=risk_type,
            confidence=round(confidence, 3),
            suggestion=str(payload.get("suggestion") or self._suggestion_for_score(RISK_LEVEL_TO_SCORE[risk_level])),
            summary=str(payload.get("summary") or "已完成风险判定。"),
            policy_hits=policy_hits,
            normalized_content=self._none_if_empty(payload.get("normalized_content")),
            latent_intent=self._none_if_empty(payload.get("latent_intent")),
        )

    def _aggregate_results(self, results: list[SafetyJudgeResult]) -> SafetyJudgeResult:
        max_score = max(RISK_LEVEL_TO_SCORE[result.risk_level] for result in results)
        dominant = [
            result for result in results
            if RISK_LEVEL_TO_SCORE[result.risk_level] == max_score
        ]

        risk_types = sorted({
            item
            for result in results
            for item in result.risk_type
        })
        policy_hits = sorted({
            item
            for result in results
            for item in result.policy_hits
        })
        confidence = round(
            max(result.confidence for result in dominant),
            3,
        )
        summary = " | ".join(
            f"{result.algorithm}: {result.summary}"
            for result in dominant[:3]
        )

        return SafetyJudgeResult(
            algorithm="aggregate",
            risk_level=SCORE_TO_RISK_LEVEL[max_score],
            risk_type=risk_types or ["未命中显式风险"],
            confidence=confidence,
            suggestion=self._suggestion_for_score(max_score),
            summary=summary or "综合检测完成。",
            policy_hits=policy_hits,
            meta={
                "triggered_algorithms": [result.algorithm for result in dominant],
            },
        )

    def _suggestion_for_score(self, score: int) -> str:
        if score >= 3:
            return "建议直接拦截，并进入人工复核或审计流程。"
        if score == 2:
            return "建议限制展示、触发人工复核，必要时要求模型重新生成。"
        if score == 1:
            return "建议保留日志并视业务场景进行轻度过滤或二次确认。"
        return "可正常放行。"

    def _none_if_empty(self, value: Any) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        return text or None

    def _normalize_string_list(self, value: Any) -> list[str]:
        if value is None:
            return []

        if isinstance(value, list):
            raw_items = value
        else:
            raw_items = [value]

        normalized: list[str] = []
        for item in raw_items:
            text = str(item).strip()
            if not text:
                continue
            parts = re.split(r"[，,、;/\n]+", text)
            normalized.extend(
                part.strip()
                for part in parts
                if part.strip()
            )

        # 去重并保持稳定顺序
        deduped: list[str] = []
        seen: set[str] = set()
        for item in normalized:
            if item not in seen:
                deduped.append(item)
                seen.add(item)
        return deduped
