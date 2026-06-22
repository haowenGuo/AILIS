from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from backend.core.config import get_settings

settings = get_settings()


EMBER_CLASSROOM_RULES = """你是仿真课堂中的 AI 教师，负责根据黑板知识库进行安全、清晰、循循善诱的课堂教学。

必须遵循 EMBER-Agent 安全增强规则：
E - Evidence：只基于当前黑板、知识库摘要和学生问题作答，不编造来源。
M - Moderation：拒绝作弊、隐私、危险、违法和越权请求，并把学生带回学习主题。
B - Boundary：不冒充真人教师、官方机构或考试命题人员。
E - Explain：用课堂语言分步骤讲解，先回应学生，再讲概念，再举例。
R - Record：最后给出一句可写到黑板上的板书摘要，并追问一个互动问题。
"""


async def generate_ai_teacher_reply(
    *,
    student_name: str,
    message: str,
    knowledge_title: str,
    blackboard_summary: str,
    history: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Use the configured classroom LLM as the teacher, otherwise return a safe fallback."""

    llm_config = _resolve_teacher_llm_config()
    if not llm_config:
        return _fallback_reply(
            student_name=student_name,
            message=message,
            knowledge_title=knowledge_title,
            blackboard_summary=blackboard_summary,
        )

    llm = ChatOpenAI(
        base_url=llm_config["base_url"],
        api_key=llm_config["api_key"],
        model=llm_config["model"],
        temperature=0.35,
        max_tokens=900,
    )
    prompt = "\n".join(
        [
            f"学生姓名：{student_name}",
            f"黑板标题：{knowledge_title}",
            f"黑板摘要：{blackboard_summary or '暂无，需基于当前课堂内容进行讲解。'}",
            f"最近对话：{history or []}",
            f"学生问题：{message}",
            "请输出适合语音播报的课堂讲解，控制在 500 字以内。",
            "如果黑板摘要里有教师参考答案：学生未明确要求解析前，不要直接报答案；先提示观察条件、排除法或关键概念。",
        ]
    )

    try:
        response = await llm.ainvoke(
            [
                SystemMessage(content=EMBER_CLASSROOM_RULES),
                HumanMessage(content=prompt),
            ]
        )
        content = _extract_text(response)
        if not content:
            raise RuntimeError("empty classroom teacher response")
        return {
            "teacherName": "EMBER AI 教师",
            "content": content,
            "speechText": content,
            "model": llm_config["model"],
            "provider": llm_config["provider"],
            "safetyLabel": "ember-agent-safe",
        }
    except Exception as error:  # noqa: BLE001
        fallback = _fallback_reply(
            student_name=student_name,
            message=message,
            knowledge_title=knowledge_title,
            blackboard_summary=blackboard_summary,
        )
        fallback["provider"] = "fallback"
        fallback["error"] = str(error)
        return fallback


def _resolve_teacher_llm_config() -> dict[str, str] | None:
    if settings.EDU_DEEPSEEK_API_KEY:
        return {
            "base_url": settings.EDU_DEEPSEEK_API_BASE,
            "api_key": settings.EDU_DEEPSEEK_API_KEY,
            "model": settings.EDU_DEEPSEEK_MODEL,
            "provider": "deepseek",
        }

    if settings.LLM_API_KEY:
        return {
            "base_url": settings.LLM_API_BASE,
            "api_key": settings.LLM_API_KEY,
            "model": settings.LLM_MODEL_NAME,
            "provider": "configured-llm",
        }

    return None


def _extract_text(response: Any) -> str:
    content = getattr(response, "content", "")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        return "".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in content
        ).strip()
    return ""


def _fallback_reply(
    *,
    student_name: str,
    message: str,
    knowledge_title: str,
    blackboard_summary: str,
) -> dict[str, Any]:
    trimmed_question = (message or "").strip()
    anchor = blackboard_summary or "先看黑板标题，再把知识点拆成定义、步骤、例题和检查四步。"
    content = (
        f"{student_name}同学，这个问题可以先回到黑板：{knowledge_title}。"
        f"你刚才问的是“{trimmed_question}”。我们先抓住核心：{anchor} "
        "第一步，确认题目中的条件；第二步，把条件转成课堂知识点；第三步，用一个小例子验证；"
        "最后把答案代回去检查。黑板摘要：先找依据，再分步推理，最后检验。你能说说这道题最容易错在哪一步吗？"
    )
    return {
        "teacherName": "EMBER AI 教师",
        "content": content,
        "speechText": content,
        "model": "fallback",
        "provider": "local-safe-fallback",
        "safetyLabel": "ember-agent-safe",
    }
