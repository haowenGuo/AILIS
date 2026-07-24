import asyncio
import json
import time
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from backend.core.config import get_settings

settings = get_settings()

_default_source = {
    "dataset": settings.EDU_HF_QUESTION_DATASET,
    "config": settings.EDU_HF_QUESTION_CONFIG,
    "split": settings.EDU_HF_QUESTION_SPLIT,
}

_viewer_base_url = settings.EDU_HF_DATASET_VIEWER_URL.rstrip("/")
_cache_ttl_seconds = max(int(settings.EDU_QUESTION_BANK_CACHE_TTL_SECONDS or 900), 60)

_choice_labels = ["A", "B", "C", "D", "E", "F"]
_subject_aliases = {
    "语文": ["语文", "chinese", "language"],
    "数学": ["数学", "math"],
    "英语": ["英语", "english", "language"],
    "物理": ["物理", "physics", "natural-science"],
    "化学": ["化学", "chemistry", "natural-science"],
    "生物": ["生物", "biology", "natural-science"],
    "历史": ["历史", "history", "social-science"],
    "地理": ["地理", "geography", "social-science"],
    "政治": ["政治", "politics", "social-science"],
}


def _build_fallback_question(
    subject: str,
    index: int,
    stem: str,
    choices: list[str],
    answer_index: int,
    level: str = "基础",
    category: str = "",
) -> dict[str, Any]:
    return {
        "sourceId": f"fallback:{subject}:{index}",
        "dataset": "local-fallback",
        "config": "built-in",
        "split": "seed",
        "rowIndex": index,
        "subject": subject,
        "category": category or subject,
        "level": level,
        "stem": stem,
        "choices": choices,
        "answerIndex": answer_index,
        "answerText": choices[answer_index] if 0 <= answer_index < len(choices) else "",
        "raw": {
            "source": "built-in-fallback",
            "subject": subject,
            "stem": stem,
        },
    }


_fallback_questions = [
    _build_fallback_question("数学", 1, "已知一次函数 y = 2x + 1，当 x = 3 时，y 等于多少？", ["5", "7", "9", "10"], 1),
    _build_fallback_question("数学", 2, "一个三角形三个内角的度数之和是下列哪一项？", ["90°", "180°", "270°", "360°"], 1),
    _build_fallback_question("语文", 1, "下列词语中，没有错别字的一项是？", ["再接再厉", "迫不急待", "一愁莫展", "谈笑风声"], 0),
    _build_fallback_question("英语", 1, "Choose the correct sentence.", ["She go to school by bus every day.", "She goes to school by bus every day.", "She going to school by bus every day.", "She gone to school by bus every day."], 1),
    _build_fallback_question("物理", 1, "下列现象中，属于光的反射现象的是哪一项？", ["铅笔在水中看起来弯折", "平面镜成像", "小孔成像", "阳光下气温升高"], 1),
    _build_fallback_question("化学", 1, "空气中体积分数约为 21% 的气体是？", ["氮气", "氧气", "二氧化碳", "稀有气体"], 1),
    _build_fallback_question("生物", 1, "植物进行光合作用主要依赖细胞中的哪种结构？", ["液泡", "细胞壁", "叶绿体", "细胞核"], 2),
    _build_fallback_question("历史", 1, "辛亥革命爆发于哪一年？", ["1898 年", "1911 年", "1919 年", "1949 年"], 1),
    _build_fallback_question("地理", 1, "地球自转产生的自然现象主要是？", ["四季变化", "昼夜交替", "海陆变迁", "板块运动"], 1),
    _build_fallback_question("政治", 1, "社会主义核心价值观中属于个人层面的内容是？", ["富强、民主", "文明、和谐", "自由、平等", "爱国、敬业"], 3),
]

_cached_bank = {
    "cacheKey": "",
    "expiresAt": 0,
    "questions": [],
    "stats": None,
    "source": {
        "dataset": _default_source["dataset"],
        "config": _default_source["config"],
        "split": _default_source["split"],
        "mode": "uninitialized",
        "label": "真实题库（未加载）",
    },
    "warning": "",
}


def _summarize_questions(questions: list[dict[str, Any]]) -> dict[str, Any]:
    subject_breakdown: dict[str, int] = {}
    for item in questions:
        subject = item.get("subject") or "综合"
        subject_breakdown[subject] = subject_breakdown.get(subject, 0) + 1
    return {
        "total": len(questions),
        "subjectBreakdown": subject_breakdown,
    }


def _build_bank_state(
    *,
    cache_key: str,
    expires_at: float,
    questions: list[dict[str, Any]],
    source: dict[str, Any],
    warning: str = "",
) -> dict[str, Any]:
    return {
        "cacheKey": cache_key,
        "expiresAt": expires_at,
        "questions": questions,
        "stats": _summarize_questions(questions),
        "source": source,
        "warning": warning,
    }


def _build_rows_url(source: dict[str, str], offset: int, length: int) -> str:
    query = urlencode(
        {
            "dataset": source["dataset"],
            "config": source["config"],
            "split": source["split"],
            "offset": str(offset),
            "length": str(length),
        }
    )
    return f"{_viewer_base_url}/rows?{query}"


def _fetch_json_sync(url: str) -> dict[str, Any]:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "SimTeach-Edu/1.0",
        },
    )
    with urlopen(request, timeout=20) as response:  # noqa: S310
        payload = response.read().decode("utf-8")
    return json.loads(payload)


async def _fetch_json(url: str) -> dict[str, Any]:
    return await asyncio.to_thread(_fetch_json_sync, url)


def _normalize_choices(record: dict[str, Any]) -> list[str]:
    if isinstance(record.get("choices"), list):
        return [str(choice).strip() for choice in record["choices"] if str(choice).strip()]
    if isinstance(record.get("options"), list):
        return [str(choice).strip() for choice in record["options"] if str(choice).strip()]
    return []


def _normalize_question(source: dict[str, str], row_entry: dict[str, Any]) -> dict[str, Any]:
    record = row_entry.get("row") or {}
    metadata = record.get("metadata") or {}
    gold = record.get("gold")
    answer_raw = gold[0] if isinstance(gold, list) and gold else record.get("answer", 0)
    choices = _normalize_choices(record)
    answer_index = int(answer_raw or 0)
    subject = metadata.get("sub_subject") or metadata.get("subject") or record.get("subject") or "综合"
    level = metadata.get("level") or record.get("level") or ""
    stem = record.get("question") or record.get("query") or ""

    return {
        "sourceId": f"{source['dataset']}:{source['config']}:{source['split']}:{row_entry.get('row_idx', 0)}",
        "dataset": source["dataset"],
        "config": source["config"],
        "split": source["split"],
        "rowIndex": int(row_entry.get("row_idx", 0)),
        "subject": subject,
        "category": metadata.get("subject") or record.get("category") or "",
        "level": level,
        "stem": stem,
        "choices": choices,
        "answerIndex": answer_index,
        "answerText": choices[answer_index] if 0 <= answer_index < len(choices) else "",
        "raw": record,
    }


async def _fetch_all_rows(source: dict[str, str]) -> list[dict[str, Any]]:
    first_page = await _fetch_json(_build_rows_url(source, 0, 100))
    total = int(first_page.get("num_rows_total") or len(first_page.get("rows") or []))
    all_rows = list(first_page.get("rows") or [])
    for offset in range(len(all_rows), total, 100):
        page = await _fetch_json(_build_rows_url(source, offset, 100))
        all_rows.extend(page.get("rows") or [])
    return all_rows


def get_question_bank_source() -> dict[str, Any]:
    source = _cached_bank.get("source") or {}
    return {
        "dataset": source.get("dataset") or _default_source["dataset"],
        "config": source.get("config") or _default_source["config"],
        "split": source.get("split") or _default_source["split"],
        "configuredDataset": _default_source["dataset"],
        "configuredConfig": _default_source["config"],
        "configuredSplit": _default_source["split"],
        "mode": source.get("mode") or "configured",
        "label": source.get("label") or "真实题库",
    }


async def get_question_bank() -> dict[str, Any]:
    global _cached_bank

    cache_key = f"{_default_source['dataset']}:{_default_source['config']}:{_default_source['split']}"
    if _cached_bank["cacheKey"] == cache_key and _cached_bank["expiresAt"] > time.time():
        return _cached_bank

    try:
        rows = await _fetch_all_rows(_default_source)
        questions = [_normalize_question(_default_source, row_entry) for row_entry in rows]
        _cached_bank = _build_bank_state(
            cache_key=cache_key,
            expires_at=time.time() + _cache_ttl_seconds,
            questions=questions,
            source={
                "dataset": _default_source["dataset"],
                "config": _default_source["config"],
                "split": _default_source["split"],
                "mode": "remote",
                "label": "Hugging Face 真实题库",
            },
        )
        return _cached_bank
    except Exception as error:  # noqa: BLE001
        print(f"[Edu Question Bank] 真实题库拉取失败，切换保底题库: {error}")
        if _cached_bank["questions"]:
            _cached_bank = {
                **_cached_bank,
                "expiresAt": time.time() + max(_cache_ttl_seconds, 120),
                "source": {
                    **(_cached_bank.get("source") or {}),
                    "mode": "stale-cache",
                    "label": "最近一次缓存题库",
                },
                "warning": "真实题库暂时不可用，当前已自动切换到最近一次缓存题库。",
            }
            return _cached_bank

        _cached_bank = _build_bank_state(
            cache_key=cache_key,
            expires_at=time.time() + 120,
            questions=_fallback_questions,
            source={
                "dataset": "local-fallback",
                "config": "built-in",
                "split": "seed",
                "mode": "fallback",
                "label": "内置保底题库",
            },
            warning="真实题库暂时不可用，当前已自动切换到内置保底题库。",
        )
        return _cached_bank


def _matches_subject(question: dict[str, Any], subject: str) -> bool:
    if not subject or subject == "全部":
        return True
    aliases = _subject_aliases.get(subject, [subject])
    haystack = " ".join(
        str(part).lower()
        for part in (question.get("subject"), question.get("category"))
        if part
    )
    return any(alias.lower() in haystack for alias in aliases)


def _matches_query(question: dict[str, Any], query: str) -> bool:
    if not query:
        return True
    haystack = " ".join(
        [str(question.get("stem") or ""), str(question.get("answerText") or ""), *[str(item) for item in question.get("choices") or []]]
    ).lower()
    return query.strip().lower() in haystack


async def search_question_bank(subject: str = "", query: str = "", limit: int = 12) -> dict[str, Any]:
    bank = await get_question_bank()
    safe_limit = max(1, min(int(limit or 12), 30))
    normalized_subject = (subject or "").strip()
    normalized_query = (query or "").strip()
    results = [
        item
        for item in bank["questions"]
        if _matches_subject(item, normalized_subject) and _matches_query(item, normalized_query)
    ][:safe_limit]
    return {
        "source": bank["source"],
        "stats": bank["stats"],
        "results": results,
        "warning": bank["warning"],
        "filters": {
            "subject": normalized_subject,
            "query": normalized_query,
            "limit": safe_limit,
        },
    }


async def get_questions_by_source_ids(source_ids: list[str] | None = None) -> list[dict[str, Any]]:
    requested = [item for item in (source_ids or []) if item]
    if not requested:
        return []
    bank = await get_question_bank()
    lookup: dict[str, dict[str, Any]] = {}
    for item in [*_fallback_questions, *(bank["questions"] or [])]:
        lookup.setdefault(item["sourceId"], item)
    return [lookup[item] for item in requested if item in lookup]


async def pick_question(subject: str, used_question_ids: list[str] | None = None) -> dict[str, Any] | None:
    bank = await get_question_bank()
    used = set(used_question_ids or [])
    for item in bank["questions"]:
        if _matches_subject(item, subject) and item["sourceId"] not in used:
            return item
    for item in bank["questions"]:
        if item["sourceId"] not in used:
            return item
    return None


def build_choice_label(index: int) -> str:
    return _choice_labels[index] if 0 <= index < len(_choice_labels) else str(index + 1)
