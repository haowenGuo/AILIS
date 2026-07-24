import re
from dataclasses import dataclass


ACTION_PATTERN = re.compile(r"\[action:(.*?)\]")
EXPRESSION_PATTERN = re.compile(r"\[expression:(.*?)\]")
CONTROL_TAG_PATTERN = re.compile(r"\[(?:action|expression):(.*?)\]")
MULTI_SPACE_PATTERN = re.compile(r"[ \t]+")


@dataclass
class ParsedReply:
    """
    将 LLM 的原始输出拆成三层语义：
    1. raw_text: 模型原始回复，方便调试
    2. display_text: 给前端显示的文字
    3. speech_text: 给 ElevenLabs 朗读的文字
    """
    raw_text: str
    display_text: str
    speech_text: str
    action: str | None = None
    expression: str | None = None


def _normalize_lines(text: str) -> list[str]:
    normalized_lines: list[str] = []
    for line in text.splitlines():
        clean_line = MULTI_SPACE_PATTERN.sub(" ", line).strip()
        if clean_line:
            normalized_lines.append(clean_line)
    return normalized_lines


def parse_reply_markup(raw_text: str) -> ParsedReply:
    """
    统一处理 LLM 输出里的控制标签。
    这样前端和 TTS 都只面对干净文本，不需要重复写解析逻辑。
    """
    text = raw_text or ""
    action_match = ACTION_PATTERN.search(text)
    expression_match = EXPRESSION_PATTERN.search(text)

    stripped_text = CONTROL_TAG_PATTERN.sub("", text)
    normalized_lines = _normalize_lines(stripped_text)

    display_text = "\n".join(normalized_lines).strip()
    speech_text = " ".join(normalized_lines).strip()

    return ParsedReply(
        raw_text=text,
        display_text=display_text,
        speech_text=speech_text,
        action=action_match.group(1).strip() if action_match else None,
        expression=expression_match.group(1).strip() if expression_match else None,
    )
