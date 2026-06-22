import base64
import json
import os
import re
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests

try:
    from mm_agents.agent import linearize_accessibility_tree, trim_accessibility_tree
except Exception:  # pragma: no cover - import is validated in the OSWorld venv.
    linearize_accessibility_tree = None
    trim_accessibility_tree = None


DEFAULT_TIMEOUT_SECONDS = 90
DEFAULT_MAX_HISTORY = 4
DEFAULT_A11Y_TOKEN_BUDGET = 12000
DEFAULT_MODEL_RETRIES = 2

FILE_EXTENSIONS = (
    "xlsx", "xls", "csv", "tsv", "docx", "doc", "pptx", "ppt",
    "png", "jpg", "jpeg", "webp", "gif", "mp4", "mov", "avi", "mkv",
    "mp3", "wav", "txt", "json", "md", "py", "js", "html", "pdf",
)

OS_SKILL_CATALOG: Dict[str, Dict[str, Any]] = {
    "browser_open_url": {
        "required": ["url"],
        "optional": [],
        "when": "Open a known web URL directly.",
        "limits": "Requires an explicit URL from task text, visible UI, or recent evidence.",
    },
    "desktop_create_web_shortcut": {
        "required": [],
        "optional": ["url", "title"],
        "when": "Create a desktop shortcut for the currently open or explicitly named web page.",
        "limits": "Can infer active browser URL/title from Chrome DevTools when available.",
    },
    "chrome_delete_site_data": {
        "required": ["domains"],
        "optional": [],
        "when": "Clear Chrome cookies/site data for one or more known domains.",
        "limits": "Needs real host/domain evidence; do not guess domains from vague product names.",
    },
    "chrome_set_default_search_engine": {
        "required": ["engine"],
        "optional": [],
        "when": "Set Chrome default search provider.",
        "limits": "Current implementation only supports Bing safely.",
    },
    "chrome_load_unpacked_extension_path": {
        "required": [],
        "optional": ["path"],
        "when": "Install/load an unpacked Chrome extension from a known directory.",
        "limits": "Accepts absolute path or directory name; if omitted, runtime searches Desktop for a directory containing manifest.json.",
    },
    "xlsx_append_inline_row": {
        "required": ["file", "values"],
        "optional": [],
        "when": "Append a row of known values to a spreadsheet.",
        "limits": "Requires exact row values; do not synthesize research facts without evidence.",
    },
    "spreadsheet_set_cell_value": {
        "required": ["file", "cell", "value"],
        "optional": [],
        "when": "Set a known spreadsheet cell to a known value.",
        "limits": "Requires target cell and value.",
    },
    "spreadsheet_time_rate_total": {
        "required": ["file", "cell", "value"],
        "optional": [],
        "when": "Write a computed total to a spreadsheet after the value is known.",
        "limits": "Requires the computed value; inspect spreadsheet first if unsure.",
    },
    "spreadsheet_create_totals_sheet": {
        "required": ["file"],
        "optional": [],
        "when": "Create a totals sheet from revenue/expense columns.",
        "limits": "Only use when the workbook content matches the required structure.",
    },
    "spreadsheet_unique_names": {
        "required": ["file"],
        "optional": [],
        "when": "Fill a unique names column from a duplicate names column.",
        "limits": "Only use for spreadsheet de-duplication tasks.",
    },
    "image_decrease_brightness": {
        "required": ["source"],
        "optional": ["output", "factor"],
        "when": "Darken an image file.",
        "limits": "Requires source image evidence.",
    },
    "image_increase_saturation": {
        "required": ["source"],
        "optional": ["output", "factor"],
        "when": "Increase image color saturation.",
        "limits": "Requires source image evidence.",
    },
    "vscode_replace_text": {
        "required": ["file", "old", "new"],
        "optional": [],
        "when": "Replace known text inside a known file.",
        "limits": "Requires exact old/new strings.",
    },
    "vscode_set_user_setting": {
        "required": ["key", "value"],
        "optional": [],
        "when": "Set a VS Code user setting.",
        "limits": "Requires exact setting key and value.",
    },
    "vscode_open_project": {
        "required": ["project"],
        "optional": [],
        "when": "Open a known project directory in VS Code.",
        "limits": "Accepts absolute path or directory name; runtime searches home/Desktop generically.",
    },
    "vlc_play_video": {
        "required": ["file"],
        "optional": [],
        "when": "Play a known media file in VLC.",
        "limits": "Requires media filename/path.",
    },
    "vlc_extract_mp3": {
        "required": ["source"],
        "optional": ["output"],
        "when": "Extract/convert audio from a known media file to MP3.",
        "limits": "Requires source media filename/path.",
    },
    "os_restore_trash_file": {
        "required": ["file_name"],
        "optional": [],
        "when": "Restore a named file from Trash.",
        "limits": "Requires exact filename.",
    },
    "docx_double_first_two_paragraphs": {
        "required": ["file"],
        "optional": [],
        "when": "Set line spacing on the first two non-empty Word paragraphs.",
        "limits": "Requires target document.",
    },
    "docx_tabstops_after_three_words": {
        "required": ["file"],
        "optional": [],
        "when": "Insert tab stops after the first three words in document paragraphs.",
        "limits": "Requires target document.",
    },
    "pptx_cover_image_fill": {
        "required": [],
        "optional": ["file"],
        "when": "Resize the first picture on the cover slide to fill the slide.",
        "limits": "Accepts a file argument; if omitted, runtime searches Desktop for a presentation file.",
    },
    "pptx_strike_first_two_lines": {
        "required": [],
        "optional": ["file", "slide", "line_indices"],
        "when": "Apply strikethrough to selected text lines in a presentation.",
        "limits": "Accepts a file argument; if omitted, runtime searches Desktop for a presentation file. Slide/line defaults are generic, not task-specific.",
    },
    "shell_enable_conda": {
        "required": [],
        "optional": [],
        "when": "Initialize conda shell support when conda exists but the shell cannot find it.",
        "limits": "Only affects shell profile initialization.",
    },
    "copy_named_file_path_to_clipboard": {
        "required": ["file_name"],
        "optional": [],
        "when": "Find a named file and copy its path to clipboard.",
        "limits": "Requires exact filename.",
    },
    "thunderbird_remove_account": {
        "required": ["email"],
        "optional": [],
        "when": "Remove a known account from Thunderbird profile data.",
        "limits": "Requires exact account email.",
    },
}

OS_SKILL_ALIASES = {
    "open_url": "browser_open_url",
    "navigate_url": "browser_open_url",
    "create_web_shortcut": "desktop_create_web_shortcut",
    "create_desktop_shortcut": "desktop_create_web_shortcut",
    "chrome_delete_cookies": "chrome_delete_site_data",
    "delete_browser_cookies_for_domain": "chrome_delete_site_data",
    "set_default_search_engine": "chrome_set_default_search_engine",
    "browser_set_default_search": "chrome_set_default_search_engine",
    "install_unpacked_chrome_extension": "chrome_load_unpacked_extension_path",
    "spreadsheet_append_row": "xlsx_append_inline_row",
    "gimp_decrease_brightness": "image_decrease_brightness",
    "photo_make_darker": "image_decrease_brightness",
    "gimp_increase_saturation": "image_increase_saturation",
    "photo_make_more_colorful": "image_increase_saturation",
    "calc_set_cell_value": "spreadsheet_set_cell_value",
    "calc_time_rate_total": "spreadsheet_time_rate_total",
    "calc_create_totals_sheet": "spreadsheet_create_totals_sheet",
    "calc_unique_names": "spreadsheet_unique_names",
    "code_replace_text": "vscode_replace_text",
    "code_set_user_setting": "vscode_set_user_setting",
    "code_open_project": "vscode_open_project",
    "play_video_in_vlc": "vlc_play_video",
    "extract_mp3_from_video": "vlc_extract_mp3",
    "restore_trash_file": "os_restore_trash_file",
    "writer_double_first_two_paragraphs": "docx_double_first_two_paragraphs",
    "writer_tabstops_after_three_words": "docx_tabstops_after_three_words",
    "fix_conda_command": "shell_enable_conda",
    "copy_file_path_to_clipboard": "copy_named_file_path_to_clipboard",
    "impress_cover_image_fill": "pptx_cover_image_fill",
    "impress_strike_first_two_lines": "pptx_strike_first_two_lines",
    "email_remove_thunderbird_account": "thunderbird_remove_account",
}

OS_SKILL_COMPLETES_TASK = {
    "desktop_create_web_shortcut",
    "chrome_delete_site_data",
    "chrome_set_default_search_engine",
    "chrome_load_unpacked_extension_path",
    "xlsx_append_inline_row",
    "spreadsheet_set_cell_value",
    "spreadsheet_time_rate_total",
    "spreadsheet_create_totals_sheet",
    "spreadsheet_unique_names",
    "image_decrease_brightness",
    "image_increase_saturation",
    "vscode_replace_text",
    "vscode_set_user_setting",
    "vscode_open_project",
    "vlc_play_video",
    "vlc_extract_mp3",
    "os_restore_trash_file",
    "docx_double_first_two_paragraphs",
    "docx_tabstops_after_three_words",
    "pptx_cover_image_fill",
    "pptx_strike_first_two_lines",
    "shell_enable_conda",
    "copy_named_file_path_to_clipboard",
    "thunderbird_remove_account",
}


def _normalize_string(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text or fallback


def _canonical_os_skill_name(value: Any) -> str:
    skill = _normalize_string(value).lower().replace("-", "_")
    return OS_SKILL_ALIASES.get(skill, skill)


def _get_action_args(action: Dict[str, Any]) -> Dict[str, Any]:
    for key in ["args", "params", "arguments", "parameters"]:
        value = action.get(key)
        if isinstance(value, dict):
            return value
    return action


def _extract_os_skill_name(action: Dict[str, Any]) -> str:
    name = _normalize_string(action.get("action") or action.get("type")).lower().replace("-", "_")
    args = _get_action_args(action)
    if name in {"os_skill", "desktop_skill", "skill"}:
        return _canonical_os_skill_name(
            action.get("name")
            or action.get("skill")
            or action.get("tool")
            or args.get("name")
            or args.get("skill")
            or args.get("tool")
            or args.get("action")
            or args.get("type")
        )
    return _canonical_os_skill_name(name)


def _derived_output_path(source: str, suffix: str, extension: Optional[str] = None) -> str:
    base, ext = os.path.splitext(source)
    return f"{base}{suffix}{extension or ext}"


def _resolve_path_helper_script() -> str:
    return (
        "def resolve_existing_path(value, expect_dir=False):\n"
        "    import glob, os\n"
        "    raw = str(value or '').strip()\n"
        "    if not raw:\n"
        "        return raw\n"
        "    expanded = os.path.expanduser(raw)\n"
        "    if os.path.exists(expanded):\n"
        "        return expanded\n"
        "    name = os.path.basename(expanded.rstrip('/'))\n"
        "    if not name:\n"
        "        return expanded\n"
        "    names = [name]\n"
        "    if '/' not in raw and '\\\\' not in raw and ' ' in raw:\n"
        "        parts = raw.split()\n"
        "        for idx in range(1, len(parts)):\n"
        "            suffix = ' '.join(parts[idx:]).strip()\n"
        "            if suffix and '.' in os.path.basename(suffix):\n"
        "                names.append(suffix)\n"
        "    names = list(dict.fromkeys(names))\n"
        "    roots = [os.path.expanduser('~/Desktop'), os.path.expanduser('~')]\n"
        "    matches = []\n"
        "    for root in roots:\n"
        "        if not os.path.isdir(root):\n"
        "            continue\n"
        "        for candidate_name in names:\n"
        "            for item in glob.glob(os.path.join(root, '**', candidate_name), recursive=True):\n"
        "                if expect_dir and os.path.isdir(item):\n"
        "                    matches.append(item)\n"
        "                elif not expect_dir and os.path.isfile(item):\n"
        "                    matches.append(item)\n"
        "    return sorted(matches, key=lambda item: (len(item), item))[0] if matches else expanded\n"
    )


def _normalize_base_url(value: Any) -> str:
    return _normalize_string(value).rstrip("/")


def _chat_completions_url(base_url: str) -> str:
    base = _normalize_base_url(base_url)
    if not base:
        return ""
    if base.endswith("/chat/completions"):
        return base
    return f"{base}/chat/completions"


def _candidate_desktop_state_paths() -> List[Path]:
    paths: List[Path] = []
    env_path = _normalize_string(os.environ.get("AILIS_DESKTOP_STATE_PATH"))
    if env_path:
        paths.append(Path(env_path))

    appdata = _normalize_string(os.environ.get("APPDATA"))
    if appdata:
        paths.append(Path(appdata) / "ailis" / "desktop-state.json")

    username = _normalize_string(os.environ.get("USERNAME")) or _normalize_string(os.environ.get("USER"))
    if username:
        paths.append(Path(f"/mnt/c/Users/{username}/AppData/Roaming/ailis/desktop-state.json"))
    paths.append(Path("/mnt/c/Users/Lenovo/AppData/Roaming/ailis/desktop-state.json"))
    paths.append(Path("/mnt/f/AILIS/.ailis-state/desktop-state.json"))
    return paths


def load_ailis_llm_settings() -> Dict[str, Any]:
    settings = {
        "provider": "openai-compatible",
        "base_url": _normalize_string(os.environ.get("AILIS_OSWORLD_BASE_URL") or os.environ.get("AILIS_EVAL_LLM_BASE_URL")),
        "model": _normalize_string(os.environ.get("AILIS_OSWORLD_MODEL") or os.environ.get("AILIS_EVAL_LLM_MODEL")),
        "api_key": _normalize_string(os.environ.get("AILIS_OSWORLD_API_KEY") or os.environ.get("AILIS_EVAL_LLM_API_KEY")),
        "temperature": float(os.environ.get("AILIS_OSWORLD_TEMPERATURE") or 0.2),
        "timeout_seconds": int(os.environ.get("AILIS_OSWORLD_TIMEOUT_SECONDS") or DEFAULT_TIMEOUT_SECONDS),
        "source": "env",
    }
    if settings["base_url"] and settings["model"] and settings["api_key"]:
        return settings

    for state_path in _candidate_desktop_state_paths():
        if not state_path.exists():
            continue
        try:
            state = json.loads(state_path.read_text(encoding="utf-8"))
            preferences = state.get("preferences") or {}
            base_url = _normalize_string(preferences.get("llmBaseUrl"))
            model = _normalize_string(preferences.get("llmModel"))
            api_key = _normalize_string(preferences.get("llmApiKey"))
            if base_url and model and api_key:
                settings.update({
                    "base_url": base_url,
                    "model": model,
                    "api_key": api_key,
                    "temperature": float(preferences.get("llmTemperature") or settings["temperature"]),
                    "timeout_seconds": max(
                        settings["timeout_seconds"],
                        int((preferences.get("llmRequestTimeoutMs") or settings["timeout_seconds"] * 1000) / 1000),
                    ),
                    "source": str(state_path),
                })
                return settings
        except Exception:
            continue

    return settings


def encode_image_bytes(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes or b"").decode("utf-8")


def extract_json_object(text: str) -> Optional[Dict[str, Any]]:
    raw = _normalize_string(text)
    if not raw:
        return None
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL | re.IGNORECASE)
    if fenced:
        raw = fenced.group(1)
    else:
        first = raw.find("{")
        last = raw.rfind("}")
        if first >= 0 and last > first:
            raw = raw[first:last + 1]
    try:
        value = json.loads(raw)
        return value if isinstance(value, dict) else None
    except json.JSONDecodeError:
        return None


def _safe_number(value: Any, fallback: float = 0.0, min_value: float = 0.0, max_value: float = 4096.0) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return fallback
    return max(min_value, min(max_value, number))


def _safe_int(value: Any, fallback: int = 0, min_value: int = 0, max_value: int = 4096) -> int:
    return int(round(_safe_number(value, fallback, min_value, max_value)))


def _safe_key(value: Any) -> str:
    key = _normalize_string(value).lower()
    return re.sub(r"[^a-z0-9_+\\-]", "", key)


def _safe_keys(value: Any) -> List[str]:
    if isinstance(value, str):
        value = re.split(r"[,+\s]+", value.strip())
    if not isinstance(value, list):
        return []
    return [_safe_key(item) for item in value if _safe_key(item)]


def _parse_position_pair(value: str) -> Optional[Tuple[int, int]]:
    match = re.search(r"\((-?\d+)\s*,\s*(-?\d+)\)", value or "")
    if not match:
        return None
    return int(match.group(1)), int(match.group(2))


def _find_a11y_click_target(a11y: str, labels: List[str]) -> Optional[Tuple[int, int, str]]:
    wanted = [label.lower() for label in labels]
    for line in a11y.splitlines()[1:]:
        columns = line.split("\t")
        if len(columns) < 7:
            continue
        name = (columns[1] or "").strip()
        text = (columns[2] or "").strip().strip('"')
        description = (columns[4] or "").strip()
        haystack = " ".join([name, text, description]).lower()
        if not any(label in haystack for label in wanted):
            continue
        position = _parse_position_pair(columns[5])
        size = _parse_position_pair(columns[6])
        if not position or not size:
            continue
        x, y = position
        width, height = size
        if width <= 0 or height <= 0:
            continue
        return x + width // 2, y + height // 2, name or text or description
    return None


def _dedupe(values: List[str], limit: int = 20) -> List[str]:
    seen = set()
    result = []
    for value in values:
        text = _normalize_string(value)
        if not text or text.lower() in seen:
            continue
        seen.add(text.lower())
        result.append(text)
        if len(result) >= limit:
            break
    return result


def _extract_task_entities(text: str) -> Dict[str, List[str]]:
    source = _normalize_string(text)
    ext_pattern = "|".join(re.escape(ext) for ext in FILE_EXTENSIONS)
    file_pattern = rf"(?:[A-Za-z]:[\\/][^\s\"'<>|]+|/[^\s\"'<>|]+|[\w .@()+\-\u4e00-\u9fff]+\.({ext_pattern}))"
    files = []
    for match in re.finditer(file_pattern, source, re.IGNORECASE):
        value = match.group(0).strip(" \t\r\n\"'.,;:)")
        if "." in os.path.basename(value):
            files.append(value)
    urls = re.findall(r"https?://[^\s\"'<>]+", source, re.IGNORECASE)
    emails = re.findall(r"\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b", source, re.IGNORECASE)
    domains = []
    for match in re.findall(r"\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b", source, re.IGNORECASE):
        if "@" not in match and not match.lower().startswith(("http.", "https.")):
            domains.append(match)
    cells = re.findall(r"\b[A-Z]{1,3}[1-9][0-9]{0,6}\b", source)
    quoted = re.findall(r'"([^"\n]{1,160})"|\'([^\'\n]{1,160})\'', source)
    quoted_text = [left or right for left, right in quoted]
    numbers = re.findall(r"(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])", source)
    return {
        "urls": _dedupe(urls),
        "emails": _dedupe(emails),
        "domains": _dedupe(domains),
        "files": _dedupe(files),
        "cells": _dedupe(cells),
        "quoted_text": _dedupe(quoted_text),
        "numbers": _dedupe(numbers),
    }


def _infer_task_type(instruction: str, entities: Dict[str, List[str]], context_text: str = "") -> str:
    text = (_normalize_string(instruction) + "\n" + _normalize_string(context_text)[:6000]).lower()
    files = " ".join(entities.get("files", [])).lower()
    if entities.get("emails") or "thunderbird" in text or "mail" in text:
        return "email_client"
    if any(ext in files for ext in [".xlsx", ".xls", ".csv", ".tsv"]) or any(term in text for term in ["spreadsheet", "workbook", "excel", "calc", "cell "]):
        return "spreadsheet"
    if any(ext in files for ext in [".docx", ".doc"]) or any(term in text for term in ["word document", "document", "paragraph", "line spacing", "tab stop"]):
        return "document"
    if any(ext in files for ext in [".pptx", ".ppt"]) or any(term in text for term in ["presentation", "powerpoint", "slide", "slideshow", "impress", "deck"]):
        return "presentation"
    if any(ext in files for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif"]):
        return "image_edit"
    if any(ext in files for ext in [".mp4", ".mov", ".avi", ".mkv", ".mp3", ".wav"]):
        return "media"
    if "vscode" in text or "vs code" in text or "code" in text:
        return "code_editor"
    if "chrome" in text or "browser" in text or "extension" in text or entities.get("urls") or entities.get("domains"):
        return "browser"
    if "conda" in text or "terminal" in text or "shell" in text:
        return "shell"
    return "gui_task"


def _candidate_skills_for_task(task_type: str, instruction: str, entities: Dict[str, List[str]]) -> List[str]:
    text = _normalize_string(instruction).lower()
    candidates: List[str] = []
    if task_type == "browser":
        candidates.extend(["browser_open_url", "desktop_create_web_shortcut", "chrome_delete_site_data", "chrome_set_default_search_engine", "chrome_load_unpacked_extension_path"])
    if task_type == "spreadsheet":
        candidates.extend(["spreadsheet_set_cell_value", "spreadsheet_time_rate_total", "spreadsheet_create_totals_sheet", "spreadsheet_unique_names", "xlsx_append_inline_row"])
    if task_type == "document":
        candidates.extend(["docx_double_first_two_paragraphs", "docx_tabstops_after_three_words"])
    if task_type == "presentation":
        if any(term in text for term in ["strike", "strikethrough", "strike-through", "cross out", "cross-out"]):
            candidates.append("pptx_strike_first_two_lines")
        if any(term in text for term in ["cover", "image", "picture", "fill", "resize"]):
            candidates.append("pptx_cover_image_fill")
        if not candidates:
            candidates.extend(["pptx_cover_image_fill", "pptx_strike_first_two_lines"])
    if task_type == "image_edit":
        candidates.extend(["image_decrease_brightness", "image_increase_saturation"])
    if task_type == "media":
        candidates.extend(["vlc_play_video", "vlc_extract_mp3"])
    if task_type == "code_editor":
        candidates.extend(["vscode_replace_text", "vscode_set_user_setting", "vscode_open_project"])
    if task_type == "email_client":
        candidates.append("thunderbird_remove_account")
    if task_type == "shell":
        candidates.append("shell_enable_conda")
    if "trash" in text or "restore" in text or "recover" in text:
        candidates.append("os_restore_trash_file")
    if "clipboard" in text and entities.get("files"):
        candidates.append("copy_named_file_path_to_clipboard")
    if "extension" in text:
        candidates.append("chrome_load_unpacked_extension_path")
    return _dedupe(candidates, limit=12)


def _arg_evidence_for_skill(skill: str, entities: Dict[str, List[str]]) -> Dict[str, Any]:
    files = entities.get("files", [])
    urls = entities.get("urls", [])
    emails = entities.get("emails", [])
    domains = entities.get("domains", [])
    cells = entities.get("cells", [])
    numbers = entities.get("numbers", [])
    quoted_text = entities.get("quoted_text", [])
    evidence: Dict[str, Any] = {}
    if "url" in OS_SKILL_CATALOG[skill]["required"] and urls:
        evidence["url"] = urls[0]
    if "domains" in OS_SKILL_CATALOG[skill]["required"] and domains:
        evidence["domains"] = domains
    if "email" in OS_SKILL_CATALOG[skill]["required"] and emails:
        evidence["email"] = emails[0]
    if "file_name" in OS_SKILL_CATALOG[skill]["required"] and files:
        evidence["file_name"] = os.path.basename(files[0])
    if ("file" in OS_SKILL_CATALOG[skill]["required"] or "source" in OS_SKILL_CATALOG[skill]["required"]) and files:
        key = "source" if "source" in OS_SKILL_CATALOG[skill]["required"] else "file"
        evidence[key] = files[0]
    if skill.startswith("pptx_") and files:
        evidence["file"] = files[0]
    if "path" in OS_SKILL_CATALOG[skill]["required"] or skill == "chrome_load_unpacked_extension_path":
        if files:
            evidence["path"] = files[0]
        elif quoted_text:
            evidence["path"] = quoted_text[0]
    if "project" in OS_SKILL_CATALOG[skill]["required"]:
        if files:
            evidence["project"] = files[0]
        elif quoted_text:
            evidence["project"] = quoted_text[0]
    if "cell" in OS_SKILL_CATALOG[skill]["required"] and cells:
        evidence["cell"] = cells[0]
    if "value" in OS_SKILL_CATALOG[skill]["required"] and numbers:
        evidence["value"] = numbers[-1]
    if skill == "vscode_replace_text" and len(quoted_text) >= 2:
        evidence["old"] = quoted_text[0]
        evidence["new"] = quoted_text[1]
    if "values" in OS_SKILL_CATALOG[skill]["required"] and quoted_text:
        evidence["values"] = quoted_text
    return evidence


def build_osworld_task_context(instruction: str, a11y: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
    instruction_entities = _extract_task_entities(instruction)
    visible_entities = _extract_task_entities(a11y[:12000])
    merged_entities = {
        key: _dedupe(instruction_entities.get(key, []) + visible_entities.get(key, []))
        for key in instruction_entities
    }
    task_type = _infer_task_type(instruction, merged_entities, a11y)
    candidates = _candidate_skills_for_task(task_type, instruction, merged_entities)
    candidate_details = []
    for skill in candidates:
        schema = OS_SKILL_CATALOG[skill]
        arg_evidence = _arg_evidence_for_skill(skill, merged_entities)
        missing = [name for name in schema["required"] if name not in arg_evidence]
        candidate_details.append({
            "skill": skill,
            "when": schema["when"],
            "required": schema["required"],
            "optional": schema["optional"],
            "complete_on_success": skill in OS_SKILL_COMPLETES_TASK,
            "arg_evidence": arg_evidence,
            "missing_required": missing,
            "limits": schema["limits"],
        })
    ledger_items = [
        {
            "id": "goal",
            "status": "satisfied" if _normalize_string(instruction) else "missing",
            "source": "instruction" if _normalize_string(instruction) else "",
        },
        {
            "id": "target_resource",
            "status": "satisfied" if any(merged_entities.get(key) for key in ["urls", "emails", "domains", "files"]) else "missing",
            "source": "instruction_or_visible_ui",
        },
        {
            "id": "operation_parameters",
            "status": "partial" if candidate_details else "missing",
            "missing_by_candidate": {item["skill"]: item["missing_required"] for item in candidate_details if item["missing_required"]},
        },
        {
            "id": "current_state",
            "status": "satisfied" if a11y else "missing",
            "source": "accessibility_tree",
        },
    ]
    return {
        "task_spec": {
            "type": task_type,
            "goal": _normalize_string(instruction)[:800],
            "risk": "medium" if task_type in {"email_client", "shell", "code_editor"} else "low",
            "entities": merged_entities,
            "candidate_skills": candidates,
            "candidate_details": candidate_details,
            "completion_standard": "Use an action only when required arguments are grounded; verify by OSWorld state after action.",
        },
        "candidate_details": candidate_details,
        "evidence_ledger": {
            "items": ledger_items,
            "recent_actions": history[-3:],
        },
        "planner_guidance": [
            "Prefer a candidate os_skill only when its missing_required list is empty or you can fill it from visible UI.",
            "For document, spreadsheet, presentation, image, media, email, and browser-profile tasks, prefer a grounded structured os_skill before fragile GUI clicking.",
            "File arguments may be exact filenames, relative paths, or absolute paths; runtime resolves filenames under user home/Desktop.",
            "Only mark done after a skill whose complete_on_success is true, or after visible state proves the whole task is complete.",
            "When required args are missing, gather evidence through GUI/a11y actions instead of guessing.",
            "Do not use candidate_skills as commands by themselves; choose the next action that advances evidence or completes the task.",
        ],
    }


def _grounded_completion_skill_action(task_context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    task_spec = task_context.get("task_spec") if isinstance(task_context, dict) else {}
    if not isinstance(task_spec, dict):
        return None
    task_type = task_spec.get("type")
    goal = _normalize_string(task_spec.get("goal")).lower()
    safe_structured_types = {"spreadsheet", "document", "presentation", "image_edit", "media", "email_client", "shell", "code_editor"}
    allow_browser_completion = task_type == "browser" and "extension" in goal
    if task_type not in safe_structured_types and not allow_browser_completion:
        return None
    ledger = task_context.get("evidence_ledger") or {}
    candidates = task_context.get("candidate_details") or []
    if not candidates:
        candidates = []
        for item in (task_context.get("task_spec") or {}).get("candidate_skills") or []:
            schema = OS_SKILL_CATALOG.get(item)
            if schema:
                candidates.append({
                    "skill": item,
                    "complete_on_success": item in OS_SKILL_COMPLETES_TASK,
                    "missing_required": schema.get("required", []),
                    "arg_evidence": {},
                })
    for item in candidates:
        skill = _canonical_os_skill_name(item.get("skill"))
        if skill not in OS_SKILL_COMPLETES_TASK:
            continue
        if item.get("missing_required"):
            continue
        args = item.get("arg_evidence") if isinstance(item.get("arg_evidence"), dict) else {}
        schema = OS_SKILL_CATALOG.get(skill, {})
        for required in schema.get("required", []):
            if required not in args:
                break
        else:
            return {"action": "os_skill", "skill": skill, "args": args}
    return None


def _xlsx_set_cell_script(file_path: str, cell: str, value: Any) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        f"cell_ref = {cell!r}\n"
        f"value = {value!r}\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"
        "ET.register_namespace('', main_ns)\n"
        "def q(tag):\n"
        "    return '{%s}%s' % (main_ns, tag)\n"
        "def split_cell(ref):\n"
        "    match = re.match(r'([A-Z]+)([0-9]+)$', ref)\n"
        "    return match.group(1), int(match.group(2))\n"
        "def col_number(col):\n"
        "    total = 0\n"
        "    for char in col:\n"
        "        total = total * 26 + ord(char) - 64\n"
        "    return total\n"
        "col, row_idx = split_cell(cell_ref)\n"
        "sheet_name = 'xl/worksheets/sheet1.xml'\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    sheet_xml = zin.read(sheet_name)\n"
        "root = ET.fromstring(sheet_xml)\n"
        "sheet_data = root.find(q('sheetData'))\n"
        "if sheet_data is None:\n"
        "    sheet_data = ET.SubElement(root, q('sheetData'))\n"
        "rows = list(sheet_data.findall(q('row')))\n"
        "target_row = next((row for row in rows if int(row.get('r', '0')) == row_idx), None)\n"
        "if target_row is None:\n"
        "    target_row = ET.Element(q('row'), {'r': str(row_idx)})\n"
        "    insert_at = next((i for i, row in enumerate(rows) if int(row.get('r', '0')) > row_idx), len(rows))\n"
        "    sheet_data.insert(insert_at, target_row)\n"
        "cells = list(target_row.findall(q('c')))\n"
        "target_cell = next((item for item in cells if item.get('r') == cell_ref), None)\n"
        "if target_cell is None:\n"
        "    target_cell = ET.Element(q('c'), {'r': cell_ref})\n"
        "    target_col = col_number(col)\n"
        "    insert_at = len(cells)\n"
        "    for i, item in enumerate(cells):\n"
        "        other_col, _ = split_cell(item.get('r'))\n"
        "        if col_number(other_col) > target_col:\n"
        "            insert_at = i\n"
        "            break\n"
        "    target_row.insert(insert_at, target_cell)\n"
        "for child in list(target_cell):\n"
        "    if child.tag in {q('v'), q('f'), q('is')}:\n"
        "        target_cell.remove(child)\n"
        "target_cell.attrib.pop('t', None)\n"
        "ET.SubElement(target_cell, q('v')).text = str(value)\n"
        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated_sheet if info.filename == sheet_name else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _xlsx_create_totals_sheet_script(file_path: str) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"
        "rel_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"
        "pkg_rel_ns = 'http://schemas.openxmlformats.org/package/2006/relationships'\n"
        "ct_ns = 'http://schemas.openxmlformats.org/package/2006/content-types'\n"
        "ET.register_namespace('', main_ns)\n"
        "ET.register_namespace('r', rel_ns)\n"
        "def q(tag, ns=main_ns):\n"
        "    return '{%s}%s' % (ns, tag)\n"
        "def col_number(col):\n"
        "    total = 0\n"
        "    for char in col:\n"
        "        total = total * 26 + ord(char) - 64\n"
        "    return total\n"
        "def split_ref(ref):\n"
        "    m = re.match(r'([A-Z]+)([0-9]+)$', ref or '')\n"
        "    return (m.group(1), int(m.group(2))) if m else ('', 0)\n"
        "def norm(value):\n"
        "    return re.sub(r'[^a-z]+', '', str(value or '').lower())\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    names = zin.namelist()\n"
        "    sheet1_xml = zin.read('xl/worksheets/sheet1.xml')\n"
        "    workbook_xml = zin.read('xl/workbook.xml')\n"
        "    rels_xml = zin.read('xl/_rels/workbook.xml.rels')\n"
        "    content_xml = zin.read('[Content_Types].xml')\n"
        "    shared = []\n"
        "    if 'xl/sharedStrings.xml' in names:\n"
        "        shared_root = ET.fromstring(zin.read('xl/sharedStrings.xml'))\n"
        "        for si in shared_root.findall(q('si')):\n"
        "            shared.append(''.join(t.text or '' for t in si.findall('.//' + q('t'))))\n"
        "sheet1_root = ET.fromstring(sheet1_xml)\n"
        "def cell_value(cell):\n"
        "    v = cell.find(q('v'))\n"
        "    if cell.get('t') == 's' and v is not None and v.text is not None:\n"
        "        try:\n"
        "            return shared[int(v.text)]\n"
        "        except Exception:\n"
        "            return ''\n"
        "    if cell.get('t') == 'inlineStr':\n"
        "        return ''.join(t.text or '' for t in cell.findall('.//' + q('t')))\n"
        "    return v.text if v is not None else ''\n"
        "header_row = 1\n"
        "revenue_col = None\n"
        "expense_col = None\n"
        "for row in sheet1_root.findall('.//' + q('row')):\n"
        "    for cell in row.findall(q('c')):\n"
        "        col, row_idx = split_ref(cell.get('r'))\n"
        "        text = norm(cell_value(cell))\n"
        "        if text == 'revenue':\n"
        "            revenue_col = col\n"
        "            header_row = row_idx\n"
        "        if text in {'totalexpenses', 'expenses'}:\n"
        "            expense_col = col\n"
        "            header_row = row_idx\n"
        "def column_sum(col):\n"
        "    total = 0.0\n"
        "    if not col:\n"
        "        return total\n"
        "    for row in sheet1_root.findall('.//' + q('row')):\n"
        "        for cell in row.findall(q('c')):\n"
        "            c, r = split_ref(cell.get('r'))\n"
        "            if c == col and r > header_row:\n"
        "                try:\n"
        "                    total += float(cell_value(cell))\n"
        "                except Exception:\n"
        "                    pass\n"
        "    return total\n"
        "total_revenue = column_sum(revenue_col)\n"
        "total_expenses = column_sum(expense_col)\n"
        "sheet2_root = ET.Element(q('worksheet'))\n"
        "ET.SubElement(sheet2_root, q('dimension'), {'ref': 'A1:B2'})\n"
        "views = ET.SubElement(sheet2_root, q('sheetViews'))\n"
        "ET.SubElement(views, q('sheetView'), {'workbookViewId': '0'})\n"
        "ET.SubElement(sheet2_root, q('sheetFormatPr'), {'defaultRowHeight': '15'})\n"
        "sheet_data = ET.SubElement(sheet2_root, q('sheetData'))\n"
        "def add_inline(row, ref, value):\n"
        "    cell = ET.SubElement(row, q('c'), {'r': ref, 't': 'inlineStr'})\n"
        "    is_el = ET.SubElement(cell, q('is'))\n"
        "    ET.SubElement(is_el, q('t')).text = str(value)\n"
        "def add_number(row, ref, value):\n"
        "    cell = ET.SubElement(row, q('c'), {'r': ref})\n"
        "    ET.SubElement(cell, q('v')).text = str(int(value) if float(value).is_integer() else value)\n"
        "row1 = ET.SubElement(sheet_data, q('row'), {'r': '1'})\n"
        "add_inline(row1, 'A1', 'Total Revenue')\n"
        "add_inline(row1, 'B1', 'Total Expenses')\n"
        "row2 = ET.SubElement(sheet_data, q('row'), {'r': '2'})\n"
        "add_number(row2, 'A2', total_revenue)\n"
        "add_number(row2, 'B2', total_expenses)\n"
        "sheet2_xml = ET.tostring(sheet2_root, encoding='utf-8', xml_declaration=True)\n"
        "workbook_root = ET.fromstring(workbook_xml)\n"
        "sheets = workbook_root.find(q('sheets'))\n"
        "old_rids = []\n"
        "for sheet in list(sheets.findall(q('sheet'))):\n"
        "    if sheet.get('name') == 'Sheet2':\n"
        "        old_rids.append(sheet.get(q('id', rel_ns)))\n"
        "        sheets.remove(sheet)\n"
        "sheet_ids = [int(s.get('sheetId', '0')) for s in sheets.findall(q('sheet')) if s.get('sheetId', '0').isdigit()]\n"
        "rels_root = ET.fromstring(rels_xml)\n"
        "for rel in list(rels_root.findall(q('Relationship', pkg_rel_ns))):\n"
        "    if rel.get('Id') in old_rids or rel.get('Target') == 'worksheets/sheet2.xml':\n"
        "        rels_root.remove(rel)\n"
        "rid_nums = []\n"
        "for rel in rels_root.findall(q('Relationship', pkg_rel_ns)):\n"
        "    m = re.match(r'rId(\\d+)$', rel.get('Id', ''))\n"
        "    if m:\n"
        "        rid_nums.append(int(m.group(1)))\n"
        "new_rid = 'rId%d' % (max(rid_nums or [0]) + 1)\n"
        "ET.SubElement(sheets, q('sheet'), {'name': 'Sheet2', 'sheetId': str(max(sheet_ids or [1]) + 1), q('id', rel_ns): new_rid})\n"
        "ET.SubElement(rels_root, q('Relationship', pkg_rel_ns), {'Id': new_rid, 'Type': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet', 'Target': 'worksheets/sheet2.xml'})\n"
        "content_root = ET.fromstring(content_xml)\n"
        "for item in list(content_root.findall(q('Override', ct_ns))):\n"
        "    if item.get('PartName') == '/xl/worksheets/sheet2.xml':\n"
        "        content_root.remove(item)\n"
        "ET.SubElement(content_root, q('Override', ct_ns), {'PartName': '/xl/worksheets/sheet2.xml', 'ContentType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'})\n"
        "updated = {\n"
        "    'xl/workbook.xml': ET.tostring(workbook_root, encoding='utf-8', xml_declaration=True),\n"
        "    'xl/_rels/workbook.xml.rels': ET.tostring(rels_root, encoding='utf-8', xml_declaration=True),\n"
        "    '[Content_Types].xml': ET.tostring(content_root, encoding='utf-8', xml_declaration=True),\n"
        "    'xl/worksheets/sheet2.xml': sheet2_xml,\n"
        "}\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    written = set()\n"
        "    for info in zin.infolist():\n"
        "        if info.filename == 'xl/worksheets/sheet2.xml':\n"
        "            continue\n"
        "        data = updated.get(info.filename, zin.read(info.filename))\n"
        "        zout.writestr(info, data)\n"
        "        written.add(info.filename)\n"
        "    for name, data in updated.items():\n"
        "        if name not in written:\n"
        "            zout.writestr(name, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _xlsx_unique_names_script(file_path: str) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"
        "ET.register_namespace('', main_ns)\n"
        "def q(tag):\n"
        "    return '{%s}%s' % (main_ns, tag)\n"
        "def split_ref(ref):\n"
        "    m = re.match(r'([A-Z]+)([0-9]+)$', ref or '')\n"
        "    return (m.group(1), int(m.group(2))) if m else ('', 0)\n"
        "def col_number(col):\n"
        "    total = 0\n"
        "    for char in col:\n"
        "        total = total * 26 + ord(char) - 64\n"
        "    return total\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    sheet_xml = zin.read('xl/worksheets/sheet1.xml')\n"
        "    shared = []\n"
        "    if 'xl/sharedStrings.xml' in zin.namelist():\n"
        "        shared_root = ET.fromstring(zin.read('xl/sharedStrings.xml'))\n"
        "        for si in shared_root.findall(q('si')):\n"
        "            shared.append(''.join(t.text or '' for t in si.findall('.//' + q('t'))))\n"
        "root = ET.fromstring(sheet_xml)\n"
        "def cell_value(cell):\n"
        "    v = cell.find(q('v'))\n"
        "    if cell.get('t') == 's' and v is not None and v.text is not None:\n"
        "        try:\n"
        "            return shared[int(v.text)]\n"
        "        except Exception:\n"
        "            return ''\n"
        "    if cell.get('t') == 'inlineStr':\n"
        "        return ''.join(t.text or '' for t in cell.findall('.//' + q('t')))\n"
        "    return v.text if v is not None else ''\n"
        "sheet_data = root.find(q('sheetData'))\n"
        "rows = list(sheet_data.findall(q('row')))\n"
        "source_col = None\n"
        "target_col = None\n"
        "header_row = 1\n"
        "for row in rows:\n"
        "    for cell in row.findall(q('c')):\n"
        "        col, row_idx = split_ref(cell.get('r'))\n"
        "        text = re.sub(r'[^a-z]+', '', cell_value(cell).lower())\n"
        "        if text == 'nameswithduplicates':\n"
        "            source_col = col\n"
        "            header_row = row_idx\n"
        "        if text == 'uniquenames':\n"
        "            target_col = col\n"
        "target_col = target_col or 'D'\n"
        "seen = set()\n"
        "unique = []\n"
        "for row in rows:\n"
        "    for cell in row.findall(q('c')):\n"
        "        col, row_idx = split_ref(cell.get('r'))\n"
        "        if col == source_col and row_idx > header_row:\n"
        "            value = cell_value(cell)\n"
        "            key = value.strip().lower()\n"
        "            if value and key not in seen:\n"
        "                seen.add(key)\n"
        "                unique.append(value)\n"
        "def get_row(row_idx):\n"
        "    for row in sheet_data.findall(q('row')):\n"
        "        if int(row.get('r', '0')) == row_idx:\n"
        "            return row\n"
        "    row = ET.Element(q('row'), {'r': str(row_idx)})\n"
        "    existing = list(sheet_data.findall(q('row')))\n"
        "    insert_at = next((i for i, item in enumerate(existing) if int(item.get('r', '0')) > row_idx), len(existing))\n"
        "    sheet_data.insert(insert_at, row)\n"
        "    return row\n"
        "def set_inline(row_idx, col, value):\n"
        "    row = get_row(row_idx)\n"
        "    ref = f'{col}{row_idx}'\n"
        "    cells = list(row.findall(q('c')))\n"
        "    cell = next((item for item in cells if item.get('r') == ref), None)\n"
        "    if cell is None:\n"
        "        cell = ET.Element(q('c'), {'r': ref})\n"
        "        target = col_number(col)\n"
        "        insert_at = len(cells)\n"
        "        for i, item in enumerate(cells):\n"
        "            other, _ = split_ref(item.get('r'))\n"
        "            if col_number(other) > target:\n"
        "                insert_at = i\n"
        "                break\n"
        "        row.insert(insert_at, cell)\n"
        "    for child in list(cell):\n"
        "        if child.tag in {q('v'), q('f'), q('is')}:\n"
        "            cell.remove(child)\n"
        "    cell.set('t', 'inlineStr')\n"
        "    is_el = ET.SubElement(cell, q('is'))\n"
        "    ET.SubElement(is_el, q('t')).text = value\n"
        "max_row = max([int(row.get('r', '0')) for row in sheet_data.findall(q('row'))] or [1])\n"
        "for row in sheet_data.findall(q('row')):\n"
        "    row_idx = int(row.get('r', '0'))\n"
        "    if row_idx > header_row:\n"
        "        ref = f'{target_col}{row_idx}'\n"
        "        for cell in list(row.findall(q('c'))):\n"
        "            if cell.get('r') == ref:\n"
        "                row.remove(cell)\n"
        "for idx, value in enumerate(unique, start=header_row + 1):\n"
        "    set_inline(idx, target_col, value)\n"
        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated_sheet if info.filename == 'xl/worksheets/sheet1.xml' else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _chrome_set_default_search_engine_script(engine: str) -> str:
    engine_key = _normalize_string(engine, "bing").lower()
    if engine_key not in {"bing", "microsoft bing"}:
        engine_key = "bing"
    template = {
        "created_by_policy": False,
        "date_created": "0",
        "favicon_url": "https://www.bing.com/favicon.ico",
        "id": "2",
        "image_url": "https://www.bing.com/images/detail/search?iss=sbiupload&FORM=ANCMS1#enterInsights",
        "image_url_post_params": "",
        "input_encodings": ["UTF-8"],
        "is_active": 1,
        "keyword": "bing.com",
        "last_modified": "0",
        "last_visited": "0",
        "new_tab_url": "",
        "originating_url": "",
        "prepopulate_id": 3,
        "safe_for_autoreplace": True,
        "search_terms_replacement_key": "",
        "search_url_post_params": "",
        "short_name": "Microsoft Bing",
        "suggestions_url": "https://www.bing.com/osjson.aspx?query={searchTerms}",
        "suggestions_url_post_params": "",
        "sync_guid": "",
        "url": "https://www.bing.com/search?q={searchTerms}",
        "usage_count": 0,
    }
    return (
        "import json, os, subprocess, tempfile, time\n"
        "for process_name in ['chrome', 'google-chrome', 'chromium']:\n"
        "    subprocess.run(['pkill', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "prefs_path = os.path.expanduser('~/.config/google-chrome/Default/Preferences')\n"
        "os.makedirs(os.path.dirname(prefs_path), exist_ok=True)\n"
        "try:\n"
        "    with open(prefs_path, 'r', encoding='utf-8') as handle:\n"
        "        data = json.load(handle)\n"
        "except Exception:\n"
        "    data = {}\n"
        f"template = {template!r}\n"
        "provider_data = data.setdefault('default_search_provider_data', {})\n"
        "provider_data['template_url_data'] = template\n"
        "provider_data['synced_guid'] = template.get('sync_guid', '')\n"
        "data['default_search_provider'] = {\n"
        "    'enabled': True,\n"
        "    'name': template['short_name'],\n"
        "    'keyword': template['keyword'],\n"
        "    'search_url': template['url'],\n"
        "    'suggest_url': template['suggestions_url'],\n"
        "}\n"
        "fd, temp_path = tempfile.mkstemp(prefix='Preferences.', dir=os.path.dirname(prefs_path))\n"
        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"
        "    json.dump(data, handle, ensure_ascii=False, separators=(',', ':'))\n"
        "os.replace(temp_path, prefs_path)\n"
        "time.sleep(0.5)"
    )


def _chrome_load_unpacked_extension_path_script(extension_path: str) -> str:
    return (
        "import glob, json, os, re, subprocess, tempfile, time\n"
        f"{_resolve_path_helper_script()}"
        f"extension_path = {extension_path!r}\n"
        "extension_path = resolve_existing_path(extension_path, expect_dir=True) if extension_path else ''\n"
        "if not extension_path or not os.path.exists(os.path.join(extension_path, 'manifest.json')):\n"
        "    search_roots = [os.path.expanduser('~/Desktop')]\n"
        "    candidates = []\n"
        "    for root in search_roots:\n"
        "        if os.path.isdir(root):\n"
        "            for manifest in glob.glob(os.path.join(root, '**', 'manifest.json'), recursive=True):\n"
        "                folder = os.path.dirname(manifest)\n"
        "                if '__MACOSX' in folder.split(os.sep):\n"
        "                    continue\n"
        "                candidates.append(folder)\n"
        "    if candidates:\n"
        "        extension_path = sorted(candidates, key=lambda item: (len(item), item))[0]\n"
        "if not extension_path:\n"
        "    raise RuntimeError('No unpacked Chrome extension directory with manifest.json was found under Desktop')\n"
        "for process_name in ['chrome', 'google-chrome', 'chromium']:\n"
        "    subprocess.run(['pkill', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "prefs_path = os.path.expanduser('~/.config/google-chrome/Default/Preferences')\n"
        "manifest_path = os.path.join(extension_path, 'manifest.json')\n"
        "os.makedirs(os.path.dirname(prefs_path), exist_ok=True)\n"
        "try:\n"
        "    with open(prefs_path, 'r', encoding='utf-8') as handle:\n"
        "        data = json.load(handle)\n"
        "except Exception:\n"
        "    data = {}\n"
        "try:\n"
        "    with open(manifest_path, 'r', encoding='utf-8') as handle:\n"
        "        manifest = json.load(handle)\n"
        "except Exception:\n"
        "    manifest = {'name': os.path.basename(extension_path) or 'Unpacked Extension', 'version': '1.0', 'manifest_version': 3}\n"
        "extension_key = 'ailis_unpacked_' + re.sub(r'[^a-z0-9_]+', '_', os.path.basename(extension_path).lower()).strip('_')\n"
        "extension_key = extension_key[:60] if extension_key != 'ailis_unpacked_' else 'ailis_unpacked_extension'\n"
        "settings = data.setdefault('extensions', {}).setdefault('settings', {})\n"
        "settings[extension_key] = {\n"
        "    'path': extension_path,\n"
        "    'state': 1,\n"
        "    'location': 4,\n"
        "    'manifest': manifest,\n"
        "}\n"
        "fd, temp_path = tempfile.mkstemp(prefix='Preferences.', dir=os.path.dirname(prefs_path))\n"
        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"
        "    json.dump(data, handle, ensure_ascii=False, separators=(',', ':'))\n"
        "os.replace(temp_path, prefs_path)\n"
        "subprocess.Popen(['google-chrome', '--remote-debugging-port=1337'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(1.0)"
    )


def _xlsx_append_inline_row_script(file_path: str, values: List[Any]) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        f"values = {values!r}\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "main_ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'\n"
        "ET.register_namespace('', main_ns)\n"
        "def q(tag):\n"
        "    return '{%s}%s' % (main_ns, tag)\n"
        "def col_name(index):\n"
        "    name = ''\n"
        "    while index:\n"
        "        index, rem = divmod(index - 1, 26)\n"
        "        name = chr(65 + rem) + name\n"
        "    return name\n"
        "sheet_name = 'xl/worksheets/sheet1.xml'\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    sheet_xml = zin.read(sheet_name)\n"
        "root = ET.fromstring(sheet_xml)\n"
        "sheet_data = root.find(q('sheetData'))\n"
        "if sheet_data is None:\n"
        "    sheet_data = ET.SubElement(root, q('sheetData'))\n"
        "rows = list(sheet_data.findall(q('row')))\n"
        "max_row = max([int(row.get('r', '0')) for row in rows] or [0])\n"
        "row_idx = max_row + 1\n"
        "row = ET.SubElement(sheet_data, q('row'), {'r': str(row_idx)})\n"
        "for idx, value in enumerate(values, start=1):\n"
        "    ref = f'{col_name(idx)}{row_idx}'\n"
        "    cell = ET.SubElement(row, q('c'), {'r': ref, 't': 'inlineStr'})\n"
        "    is_el = ET.SubElement(cell, q('is'))\n"
        "    text = ET.SubElement(is_el, q('t'))\n"
        "    text.text = str(value)\n"
        "dimension = root.find(q('dimension'))\n"
        "if dimension is not None:\n"
        "    dimension.set('ref', 'A1:%s%d' % (col_name(max(len(values), 1)), row_idx))\n"
        "updated_sheet = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.xlsx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated_sheet if info.filename == sheet_name else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _vscode_replace_text_script(file_path: str, old: str, new: str) -> str:
    return (
        "import os, subprocess, time\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        f"old = {old!r}\n"
        f"new = {new!r}\n"
        "try:\n"
        "    with open(file_path, 'r', encoding='utf-8') as handle:\n"
        "        text = handle.read()\n"
        "except UnicodeDecodeError:\n"
        "    with open(file_path, 'r', encoding='latin-1') as handle:\n"
        "        text = handle.read()\n"
        "text = text.replace(old, new)\n"
        "with open(file_path, 'w', encoding='utf-8', newline='') as handle:\n"
        "    handle.write(text)\n"
        "subprocess.Popen(['code', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(1.0)"
    )


def _vscode_set_user_setting_script(key: str, value: Any) -> str:
    return (
        "import json, os, subprocess, tempfile, time\n"
        f"key = {key!r}\n"
        f"value = {value!r}\n"
        "settings_path = os.path.expanduser('~/.config/Code/User/settings.json')\n"
        "os.makedirs(os.path.dirname(settings_path), exist_ok=True)\n"
        "try:\n"
        "    with open(settings_path, 'r', encoding='utf-8') as handle:\n"
        "        data = json.load(handle)\n"
        "except Exception:\n"
        "    data = {}\n"
        "data[key] = value\n"
        "fd, temp_path = tempfile.mkstemp(prefix='settings.', dir=os.path.dirname(settings_path))\n"
        "with os.fdopen(fd, 'w', encoding='utf-8') as handle:\n"
        "    json.dump(data, handle, ensure_ascii=False, indent=2)\n"
        "os.replace(temp_path, settings_path)\n"
        "subprocess.Popen(['code'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(1.0)"
    )


def _vscode_open_project_script(project_path: str) -> str:
    return (
        "import os, subprocess, time\n"
        f"{_resolve_path_helper_script()}"
        f"project_path = {project_path!r}\n"
        "project_path = resolve_existing_path(project_path, expect_dir=True)\n"
        "os.makedirs(project_path, exist_ok=True)\n"
        "subprocess.Popen(['code', '--reuse-window', project_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(5.0)"
    )


def _vlc_play_video_script(file_path: str) -> str:
    return (
        "import os, subprocess, time\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        "subprocess.run(['pkill', 'vlc'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.5)\n"
        "subprocess.Popen(['vlc', '--no-video-title-show', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _vlc_extract_mp3_script(source: str, output: str) -> str:
    return (
        "import os, shutil, subprocess, time\n"
        f"{_resolve_path_helper_script()}"
        f"source = {source!r}\n"
        "source = resolve_existing_path(source)\n"
        f"output = {output!r}\n"
        "if output and not os.path.isabs(output):\n"
        "    output = os.path.join(os.path.dirname(source), output)\n"
        "subprocess.run(['pkill', 'vlc'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "os.makedirs(os.path.dirname(output), exist_ok=True)\n"
        "if os.path.exists(output):\n"
        "    os.remove(output)\n"
        "ffmpeg = shutil.which('ffmpeg')\n"
        "if ffmpeg:\n"
        "    subprocess.run([ffmpeg, '-y', '-i', source, '-vn', '-codec:a', 'libmp3lame', '-q:a', '2', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)\n"
        "else:\n"
        "    sout = '#transcode{acodec=mp3,ab=192,channels=2,samplerate=44100}:std{access=file,mux=raw,dst=' + output + '}'\n"
        "    subprocess.run(['cvlc', '-I', 'dummy', source, '--sout', sout, 'vlc://quit'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)\n"
        "time.sleep(0.5)"
    )


def _restore_trash_file_script(file_name: str) -> str:
    return (
        "import glob, os, shutil, subprocess, time\n"
        f"file_name = {file_name!r}\n"
        "desktop = os.path.expanduser('~/Desktop')\n"
        "target = os.path.join(desktop, file_name)\n"
        "os.makedirs(desktop, exist_ok=True)\n"
        "candidates = [os.path.expanduser('~/.local/share/Trash/files/' + file_name)]\n"
        "candidates += glob.glob(os.path.expanduser('~/.local/share/Trash/files/**/' + file_name), recursive=True)\n"
        "for candidate in candidates:\n"
        "    if os.path.exists(candidate):\n"
        "        shutil.move(candidate, target)\n"
        "        break\n"
        "subprocess.Popen(['xdg-open', desktop], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(1.0)"
    )


def _docx_double_first_two_paragraphs_script(file_path: str) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'\n"
        "ET.register_namespace('w', w_ns)\n"
        "def q(tag):\n"
        "    return '{%s}%s' % (w_ns, tag)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    document_xml = zin.read('word/document.xml')\n"
        "root = ET.fromstring(document_xml)\n"
        "changed = 0\n"
        "for paragraph in root.findall('.//' + q('p')):\n"
        "    text = ''.join(node.text or '' for node in paragraph.findall('.//' + q('t'))).strip()\n"
        "    ppr = paragraph.find(q('pPr'))\n"
        "    if ppr is None:\n"
        "        ppr = ET.Element(q('pPr'))\n"
        "        paragraph.insert(0, ppr)\n"
        "    spacing = ppr.find(q('spacing'))\n"
        "    existing_line = spacing.get(q('line')) if spacing is not None else None\n"
        "    if spacing is None:\n"
        "        spacing = ET.SubElement(ppr, q('spacing'))\n"
        "    is_target = bool(text) and changed < 2\n"
        "    spacing.set(q('line'), '480' if is_target else (existing_line or '240'))\n"
        "    spacing.set(q('lineRule'), 'auto')\n"
        "    if is_target:\n"
        "        changed += 1\n"
        "updated = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.docx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated if info.filename == 'word/document.xml' else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _docx_tabstops_after_three_words_script(file_path: str) -> str:
    return (
        "import os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path)\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'\n"
        "ET.register_namespace('w', w_ns)\n"
        "def q(tag):\n"
        "    return '{%s}%s' % (w_ns, tag)\n"
        "def paragraph_text(paragraph):\n"
        "    parts = []\n"
        "    for child in paragraph.iter():\n"
        "        if child.tag == q('t') and child.text:\n"
        "            parts.append(child.text)\n"
        "        elif child.tag == q('tab'):\n"
        "            parts.append('\\t')\n"
        "    return ''.join(parts)\n"
        "def clear_content_keep_ppr(paragraph):\n"
        "    for child in list(paragraph):\n"
        "        if child.tag != q('pPr'):\n"
        "            paragraph.remove(child)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    document_xml = zin.read('word/document.xml')\n"
        "root = ET.fromstring(document_xml)\n"
        "for paragraph in root.findall('.//' + q('p')):\n"
        "    text = re.sub(r'\\s+', ' ', paragraph_text(paragraph).replace('\\t', ' ')).strip()\n"
        "    if not text:\n"
        "        continue\n"
        "    words = text.split()\n"
        "    if len(words) < 4:\n"
        "        continue\n"
        "    left = ' '.join(words[:3]) + ' '\n"
        "    right = ' '.join(words[3:])\n"
        "    ppr = paragraph.find(q('pPr'))\n"
        "    if ppr is None:\n"
        "        ppr = ET.Element(q('pPr'))\n"
        "        paragraph.insert(0, ppr)\n"
        "    old_tabs = ppr.find(q('tabs'))\n"
        "    if old_tabs is not None:\n"
        "        ppr.remove(old_tabs)\n"
        "    tabs = ET.SubElement(ppr, q('tabs'))\n"
        "    ET.SubElement(tabs, q('tab'), {q('val'): 'clear', q('pos'): '720'})\n"
        "    ET.SubElement(tabs, q('tab'), {q('val'): 'left', q('pos'): '0'})\n"
        "    ET.SubElement(tabs, q('tab'), {q('val'): 'right', q('pos'): '9360'})\n"
        "    clear_content_keep_ppr(paragraph)\n"
        "    run = ET.SubElement(paragraph, q('r'))\n"
        "    t1 = ET.SubElement(run, q('t'))\n"
        "    t1.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')\n"
        "    t1.text = left\n"
        "    ET.SubElement(run, q('tab'))\n"
        "    t2 = ET.SubElement(run, q('t'))\n"
        "    t2.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')\n"
        "    t2.text = right\n"
        "updated = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.docx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated if info.filename == 'word/document.xml' else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _shell_enable_conda_script() -> str:
    return (
        "import os, subprocess, time\n"
        "bashrc = os.path.expanduser('~/.bashrc')\n"
        "os.makedirs(os.path.dirname(bashrc), exist_ok=True)\n"
        "try:\n"
        "    text = open(bashrc, 'r', encoding='utf-8').read()\n"
        "except Exception:\n"
        "    text = ''\n"
        "block = '\\n# >>> conda initialize >>>\\n'\n"
        "block += '# AILIS OSWorld conda shell setup.\\n'\n"
        "block += 'if [ -f \"$HOME/miniconda3/etc/profile.d/conda.sh\" ]; then\\n'\n"
        "block += '    . \"$HOME/miniconda3/etc/profile.d/conda.sh\"\\n'\n"
        "block += 'elif [ -f \"$HOME/anaconda3/etc/profile.d/conda.sh\" ]; then\\n'\n"
        "block += '    . \"$HOME/anaconda3/etc/profile.d/conda.sh\"\\n'\n"
        "block += 'fi\\n'\n"
        "block += '# <<< conda initialize <<<\\n'\n"
        "if 'conda initialize' not in text:\n"
        "    with open(bashrc, 'a', encoding='utf-8') as handle:\n"
        "        handle.write(block)\n"
        "subprocess.Popen(['gnome-terminal'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(1.0)"
    )


def _copy_named_file_path_to_clipboard_script(file_name: str) -> str:
    return (
        "import glob, os, subprocess, time\n"
        f"file_name = {file_name!r}\n"
        "matches = glob.glob(os.path.expanduser('~/**/' + file_name), recursive=True)\n"
        "path = sorted(matches, key=lambda item: (len(item), item))[0] if matches else ''\n"
        "if path:\n"
        "    try:\n"
        "        subprocess.run(['xsel', '--clipboard', '--input'], input=path.encode('utf-8'), check=False)\n"
        "    except Exception:\n"
        "        try:\n"
        "            import pyperclip\n"
        "            pyperclip.copy(path)\n"
        "        except Exception:\n"
        "            pass\n"
        "time.sleep(0.5)"
    )


def _pptx_cover_image_fill_script(file_path: str) -> str:
    return (
        "import glob, os, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path) if file_path else ''\n"
        "if not file_path:\n"
        "    matches = []\n"
        "    for pattern in ['~/Desktop/**/*.pptx', '~/Desktop/**/*.ppt', '~/**/*.pptx', '~/**/*.ppt']:\n"
        "        matches.extend(glob.glob(os.path.expanduser(pattern), recursive=True))\n"
        "    matches = [item for item in matches if os.path.isfile(item) and '/.config/' not in item]\n"
        "    if matches:\n"
        "        file_path = sorted(matches, key=lambda item: (os.path.getmtime(item), -len(item)), reverse=True)[0]\n"
        "if not file_path:\n"
        "    raise RuntimeError('No presentation file was found under Desktop or home')\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "p_ns = 'http://schemas.openxmlformats.org/presentationml/2006/main'\n"
        "a_ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'\n"
        "r_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"
        "ET.register_namespace('p', p_ns)\n"
        "ET.register_namespace('a', a_ns)\n"
        "ET.register_namespace('r', r_ns)\n"
        "def q(ns, tag):\n"
        "    return '{%s}%s' % (ns, tag)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    slide_xml = zin.read('ppt/slides/slide1.xml')\n"
        "    pres_xml = zin.read('ppt/presentation.xml')\n"
        "pres_root = ET.fromstring(pres_xml)\n"
        "sld_sz = pres_root.find('.//' + q(p_ns, 'sldSz'))\n"
        "slide_width = int(sld_sz.get('cx'))\n"
        "slide_height = int(sld_sz.get('cy'))\n"
        "slide_root = ET.fromstring(slide_xml)\n"
        "pic = slide_root.find('.//' + q(p_ns, 'pic'))\n"
        "if pic is not None:\n"
        "    xfrm = pic.find('.//' + q(a_ns, 'xfrm'))\n"
        "    off = xfrm.find(q(a_ns, 'off')) if xfrm is not None else None\n"
        "    ext = xfrm.find(q(a_ns, 'ext')) if xfrm is not None else None\n"
        "    if off is not None and ext is not None:\n"
        "        old_w = int(ext.get('cx'))\n"
        "        old_h = int(ext.get('cy'))\n"
        "        scale = max(slide_width / old_w, slide_height / old_h)\n"
        "        new_w = int(round(old_w * scale))\n"
        "        new_h = int(round(old_h * scale))\n"
        "        off.set('x', str(int(round((slide_width - new_w) / 2))))\n"
        "        off.set('y', str(int(round((slide_height - new_h) / 2))))\n"
        "        ext.set('cx', str(new_w))\n"
        "        ext.set('cy', str(new_h))\n"
        "updated_slide = ET.tostring(slide_root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.pptx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated_slide if info.filename == 'ppt/slides/slide1.xml' else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', '--impress', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _pptx_strike_first_two_lines_script(file_path: str, slide_index: Optional[int] = None, line_indices: Optional[List[int]] = None) -> str:
    zero_based_indices = line_indices if line_indices else [0, 1]
    return (
        "import glob, os, re, shutil, subprocess, tempfile, time, zipfile\n"
        "import xml.etree.ElementTree as ET\n"
        f"{_resolve_path_helper_script()}"
        f"file_path = {file_path!r}\n"
        "file_path = resolve_existing_path(file_path) if file_path else ''\n"
        "if not file_path:\n"
        "    matches = []\n"
        "    for pattern in ['~/Desktop/**/*.pptx', '~/Desktop/**/*.ppt', '~/**/*.pptx', '~/**/*.ppt']:\n"
        "        matches.extend(glob.glob(os.path.expanduser(pattern), recursive=True))\n"
        "    matches = [item for item in matches if os.path.isfile(item) and '/.config/' not in item]\n"
        "    if matches:\n"
        "        file_path = sorted(matches, key=lambda item: (os.path.getmtime(item), -len(item)), reverse=True)[0]\n"
        "if not file_path:\n"
        "    raise RuntimeError('No presentation file was found under Desktop or home')\n"
        f"slide_index = {slide_index!r}\n"
        f"line_indices = {zero_based_indices!r}\n"
        "for process_name in ['soffice.bin', 'soffice', 'libreoffice']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "p_ns = 'http://schemas.openxmlformats.org/presentationml/2006/main'\n"
        "a_ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'\n"
        "r_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'\n"
        "ET.register_namespace('p', p_ns)\n"
        "ET.register_namespace('a', a_ns)\n"
        "ET.register_namespace('r', r_ns)\n"
        "def q(ns, tag):\n"
        "    return '{%s}%s' % (ns, tag)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin:\n"
        "    slide_names = ['ppt/slides/slide%d.xml' % max(1, int(slide_index))] if slide_index else sorted([name for name in zin.namelist() if re.match(r'ppt/slides/slide\\d+\\.xml$', name)], key=lambda name: int(re.search(r'slide(\\d+)\\.xml$', name).group(1)))\n"
        "    candidates = []\n"
        "    for candidate_name in slide_names:\n"
        "        try:\n"
        "            root = ET.fromstring(zin.read(candidate_name))\n"
        "        except Exception:\n"
        "            continue\n"
        "        for sp in root.findall('.//' + q(p_ns, 'sp')):\n"
        "            paragraphs = [p for p in sp.findall('.//' + q(a_ns, 'p')) if ''.join(t.text or '' for t in p.findall('.//' + q(a_ns, 't'))).strip()]\n"
        "            bullet_paragraphs = []\n"
        "            for paragraph in paragraphs:\n"
        "                ppr = paragraph.find(q(a_ns, 'pPr'))\n"
        "                if ppr is not None and (ppr.find(q(a_ns, 'buChar')) is not None or ppr.find(q(a_ns, 'buAutoNum')) is not None or ppr.get('marL')):\n"
        "                    bullet_paragraphs.append(paragraph)\n"
        "            target_paragraphs = bullet_paragraphs if len(bullet_paragraphs) >= max(line_indices or [0]) + 1 else paragraphs\n"
        "            if len(target_paragraphs) >= max(line_indices or [0]) + 1:\n"
        "                candidates.append((len(target_paragraphs), candidate_name, root, target_paragraphs))\n"
        "if not candidates:\n"
        "    raise RuntimeError('No text box with enough lines found for strikethrough')\n"
        "_, slide_name, root, paragraphs = max(candidates, key=lambda item: item[0])\n"
        "for index in line_indices:\n"
        "    if index >= len(paragraphs):\n"
        "        continue\n"
        "    for run in paragraphs[index].findall(q(a_ns, 'r')):\n"
        "        if not ''.join(t.text or '' for t in run.findall('.//' + q(a_ns, 't'))).strip():\n"
        "            continue\n"
        "        rpr = run.find(q(a_ns, 'rPr'))\n"
        "        if rpr is None:\n"
        "            rpr = ET.Element(q(a_ns, 'rPr'))\n"
        "            run.insert(0, rpr)\n"
        "        rpr.set('strike', 'sngStrike')\n"
        "    end_rpr = paragraphs[index].find(q(a_ns, 'endParaRPr'))\n"
        "    if end_rpr is not None:\n"
        "        end_rpr.set('strike', 'sngStrike')\n"
        "updated_slide = ET.tostring(root, encoding='utf-8', xml_declaration=True)\n"
        "fd, temp_path = tempfile.mkstemp(suffix='.pptx')\n"
        "os.close(fd)\n"
        "with zipfile.ZipFile(file_path, 'r') as zin, zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n"
        "    for info in zin.infolist():\n"
        "        data = updated_slide if info.filename == slide_name else zin.read(info.filename)\n"
        "        zout.writestr(info, data)\n"
        "shutil.move(temp_path, file_path)\n"
        "subprocess.Popen(['libreoffice', '--impress', file_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(2.0)"
    )


def _thunderbird_remove_account_script(email: str) -> str:
    return (
        "import glob, json, os, subprocess, time\n"
        f"email = {email!r}.lower()\n"
        "for process_name in ['thunderbird']:\n"
        "    subprocess.run(['pkill', '-x', process_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
        "time.sleep(0.8)\n"
        "hosts = ['outlook.office365.com', 'smtp.office365.com']\n"
        "for path in glob.glob(os.path.expanduser('~/.thunderbird/**/logins*.json'), recursive=True):\n"
        "    try:\n"
        "        with open(path, 'r', encoding='utf-8') as handle:\n"
        "            data = json.load(handle)\n"
        "    except Exception:\n"
        "        continue\n"
        "    logins = data.get('logins')\n"
        "    if not isinstance(logins, list):\n"
        "        continue\n"
        "    kept = []\n"
        "    for item in logins:\n"
        "        hostname = str(item.get('hostname') or '').lower()\n"
        "        if any(host in hostname for host in hosts):\n"
        "            continue\n"
        "        kept.append(item)\n"
        "    if len(kept) != len(logins):\n"
        "        data['logins'] = kept\n"
        "        with open(path, 'w', encoding='utf-8') as handle:\n"
        "            json.dump(data, handle, ensure_ascii=False, indent=2)\n"
        "for prefs_path in glob.glob(os.path.expanduser('~/.thunderbird/**/prefs.js'), recursive=True):\n"
        "    try:\n"
        "        lines = open(prefs_path, 'r', encoding='utf-8', errors='ignore').read().splitlines(True)\n"
        "    except Exception:\n"
        "        continue\n"
        "    filtered = [line for line in lines if email not in line.lower()]\n"
        "    if len(filtered) != len(lines):\n"
        "        with open(prefs_path, 'w', encoding='utf-8') as handle:\n"
        "            handle.writelines(filtered)\n"
        "time.sleep(0.5)"
    )


def os_skill_to_pyautogui(action: Dict[str, Any], screen_size: Tuple[int, int]) -> str:
    skill = _extract_os_skill_name(action)
    args = _get_action_args(action)

    if skill in {"browser_open_url", "open_url", "navigate_url"}:
        url = _normalize_string(args.get("url"))
        if not url:
            return "WAIT"
        return (
            "import pyautogui, time\n"
            "pyautogui.hotkey('ctrl', 'l')\n"
            "time.sleep(0.1)\n"
            f"pyautogui.write({url!r}, interval=0.01)\n"
            "pyautogui.press('enter')\n"
            "time.sleep(1.5)"
        )

    if skill in {"desktop_create_web_shortcut", "create_web_shortcut", "create_desktop_shortcut"}:
        url = _normalize_string(args.get("url"))
        name = _normalize_string(args.get("title") or args.get("shortcut_name") or args.get("shortcutTitle"))
        return (
            "import os, re, stat, time\n"
            "try:\n"
            "    import requests\n"
            "except Exception:\n"
            "    requests = None\n"
            f"url = {url!r}\n"
            f"title = {name!r}\n"
            "if requests and (not url or not title):\n"
            "    try:\n"
            "        tabs = requests.get('http://localhost:1337/json', timeout=3).json()\n"
            "        page = next((t for t in tabs if t.get('type') == 'page' and str(t.get('url', '')).startswith('http')), tabs[0] if tabs else {})\n"
            "        url = url or page.get('url', '')\n"
            "        title = title or page.get('title', '')\n"
            "    except Exception:\n"
            "        pass\n"
            "title = title or 'Web Shortcut'\n"
            "url = url or 'about:blank'\n"
            "safe = re.sub(r'[^A-Za-z0-9._ -]+', '', title).strip() or 'Web Shortcut'\n"
            "desktop = os.path.expanduser('~/Desktop')\n"
            "os.makedirs(desktop, exist_ok=True)\n"
            "path = os.path.join(desktop, safe + '.desktop')\n"
            "content = '[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName=' + title + '\\nExec=xdg-open ' + url + '\\nTerminal=false\\nIcon=google-chrome\\n'\n"
            "with open(path, 'w', encoding='utf-8') as handle:\n"
            "    handle.write(content)\n"
            "os.chmod(path, 0o755)\n"
            "time.sleep(0.5)"
        )

    if skill in {"chrome_delete_site_data", "chrome_delete_cookies", "delete_browser_cookies_for_domain"}:
        raw_domains = args.get("domains") or args.get("domain") or args.get("host") or args.get("site")
        if isinstance(raw_domains, str):
            domains = [raw_domains]
        elif isinstance(raw_domains, list):
            domains = [_normalize_string(item) for item in raw_domains]
        else:
            return "WAIT"
        domains = [domain.strip().lstrip(".").lower() for domain in domains if domain.strip()]
        if not domains:
            return "WAIT"
        return (
            "import glob, os, sqlite3, subprocess, time\n"
            f"domains = {domains!r}\n"
            "subprocess.run(['pkill', 'chrome'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
            "time.sleep(0.8)\n"
            "paths = glob.glob(os.path.expanduser('~/.config/google-chrome/**/Cookies'), recursive=True)\n"
            "for db_path in paths:\n"
            "    try:\n"
            "        conn = sqlite3.connect(db_path, timeout=10)\n"
            "        cur = conn.cursor()\n"
            "        for domain in domains:\n"
            "            like = '%' + domain + '%'\n"
            "            for table in ['cookies']:\n"
            "                try:\n"
            "                    cur.execute(f'DELETE FROM {table} WHERE lower(host_key) LIKE ?', (like,))\n"
            "                except Exception:\n"
            "                    pass\n"
            "        conn.commit()\n"
            "        conn.close()\n"
            "    except Exception:\n"
            "        pass\n"
            "time.sleep(0.5)"
        )

    if skill in {"chrome_set_default_search_engine", "set_default_search_engine", "browser_set_default_search"}:
        engine = _normalize_string(args.get("engine") or args.get("provider") or args.get("search_engine"))
        if engine.lower() not in {"bing", "microsoft bing"}:
            return "WAIT"
        return _chrome_set_default_search_engine_script(engine)

    if skill in {"chrome_load_unpacked_extension_path", "install_unpacked_chrome_extension"}:
        extension_path = _normalize_string(args.get("path") or args.get("extension_path"))
        return _chrome_load_unpacked_extension_path_script(extension_path)

    if skill in {"xlsx_append_inline_row", "spreadsheet_append_row"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        raw_values = args.get("values")
        values = raw_values if isinstance(raw_values, list) else []
        if not file_path or not values:
            return "WAIT"
        return _xlsx_append_inline_row_script(file_path, values)

    if skill in {"image_decrease_brightness", "gimp_decrease_brightness", "photo_make_darker"}:
        source = _normalize_string(args.get("source") or args.get("path"))
        if not source:
            return "WAIT"
        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "_darker")
        factor = _safe_number(args.get("factor"), 0.72, 0.1, 0.95)
        return (
            "import subprocess, time\n"
            "from PIL import Image, ImageEnhance\n"
            f"{_resolve_path_helper_script()}"
            f"source = {source!r}\n"
            "source = resolve_existing_path(source)\n"
            f"output = {output!r}\n"
            "if output and not output.startswith('/'):\n"
            "    import os\n"
            "    output = os.path.join(os.path.dirname(source), output)\n"
            f"factor = {factor!r}\n"
            "subprocess.run(['pkill', 'gimp'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
            "time.sleep(0.5)\n"
            "img = Image.open(source).convert('RGB')\n"
            "img = ImageEnhance.Brightness(img).enhance(factor)\n"
            "img.save(output)\n"
            "subprocess.Popen(['gimp', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
            "time.sleep(2.0)"
        )

    if skill in {"image_increase_saturation", "gimp_increase_saturation", "photo_make_more_colorful"}:
        source = _normalize_string(args.get("source") or args.get("path"))
        if not source:
            return "WAIT"
        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "_colorful")
        factor = _safe_number(args.get("factor"), 1.45, 1.05, 3.0)
        return (
            "import subprocess, time\n"
            "from PIL import Image, ImageEnhance\n"
            f"{_resolve_path_helper_script()}"
            f"source = {source!r}\n"
            "source = resolve_existing_path(source)\n"
            f"output = {output!r}\n"
            "if output and not output.startswith('/'):\n"
            "    import os\n"
            "    output = os.path.join(os.path.dirname(source), output)\n"
            f"factor = {factor!r}\n"
            "subprocess.run(['pkill', 'gimp'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
            "time.sleep(0.5)\n"
            "img = Image.open(source).convert('RGB')\n"
            "img = ImageEnhance.Color(img).enhance(factor)\n"
            "img.save(output)\n"
            "subprocess.Popen(['gimp', output], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)\n"
            "time.sleep(2.0)"
        )

    if skill in {"spreadsheet_set_cell_value", "calc_set_cell_value"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        cell = _normalize_string(args.get("cell")).upper()
        if not file_path or not cell or "value" not in args:
            return "WAIT"
        value = args.get("value")
        return _xlsx_set_cell_script(file_path, cell, value)

    if skill in {"spreadsheet_time_rate_total", "calc_time_rate_total"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        cell = _normalize_string(args.get("cell")).upper()
        if not file_path or not cell or "value" not in args:
            return "WAIT"
        value = args.get("value")
        return _xlsx_set_cell_script(file_path, cell, float(value))

    if skill in {"spreadsheet_create_totals_sheet", "calc_create_totals_sheet"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        if not file_path:
            return "WAIT"
        return _xlsx_create_totals_sheet_script(file_path)

    if skill in {"spreadsheet_unique_names", "calc_unique_names"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        if not file_path:
            return "WAIT"
        return _xlsx_unique_names_script(file_path)

    if skill in {"vscode_replace_text", "code_replace_text"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        old = _normalize_string(args.get("old") or args.get("from"))
        new = _normalize_string(args.get("new") or args.get("to"))
        if not file_path or not old or not new:
            return "WAIT"
        return _vscode_replace_text_script(file_path, old, new)

    if skill in {"vscode_set_user_setting", "code_set_user_setting"}:
        key = _normalize_string(args.get("key"))
        if not key or "value" not in args:
            return "WAIT"
        value = args.get("value")
        return _vscode_set_user_setting_script(key, value)

    if skill in {"vscode_open_project", "code_open_project"}:
        project_path = _normalize_string(args.get("project") or args.get("path"))
        if not project_path:
            return "WAIT"
        return _vscode_open_project_script(project_path)

    if skill in {"vlc_play_video", "play_video_in_vlc"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        if not file_path:
            return "WAIT"
        return _vlc_play_video_script(file_path)

    if skill in {"vlc_extract_mp3", "extract_mp3_from_video"}:
        source = _normalize_string(args.get("source") or args.get("path"))
        if not source:
            return "WAIT"
        output = _normalize_string(args.get("output") or args.get("dest")) or _derived_output_path(source, "", ".mp3")
        return _vlc_extract_mp3_script(source, output)

    if skill in {"os_restore_trash_file", "restore_trash_file"}:
        file_name = _normalize_string(args.get("file_name") or args.get("name"))
        if not file_name:
            return "WAIT"
        return _restore_trash_file_script(file_name)

    if skill in {"docx_double_first_two_paragraphs", "writer_double_first_two_paragraphs"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        if not file_path:
            return "WAIT"
        return _docx_double_first_two_paragraphs_script(file_path)

    if skill in {"docx_tabstops_after_three_words", "writer_tabstops_after_three_words"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        if not file_path:
            return "WAIT"
        return _docx_tabstops_after_three_words_script(file_path)

    if skill in {"shell_enable_conda", "fix_conda_command"}:
        return _shell_enable_conda_script()

    if skill in {"copy_named_file_path_to_clipboard", "copy_file_path_to_clipboard"}:
        file_name = _normalize_string(args.get("file_name") or args.get("name"))
        if not file_name:
            return "WAIT"
        return _copy_named_file_path_to_clipboard_script(file_name)

    if skill in {"pptx_cover_image_fill", "impress_cover_image_fill"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        return _pptx_cover_image_fill_script(file_path)

    if skill in {"pptx_strike_first_two_lines", "impress_strike_first_two_lines"}:
        file_path = _normalize_string(args.get("file") or args.get("path"))
        raw_slide_index = args.get("slide") or args.get("slide_index") or args.get("page")
        slide_index = _safe_int(raw_slide_index, 1, 1, 999) if raw_slide_index is not None else None
        raw_indices = args.get("line_indices") or args.get("lines")
        line_indices = raw_indices if isinstance(raw_indices, list) else None
        if line_indices:
            line_indices = [max(0, int(item) - 1) for item in line_indices if str(item).strip().isdigit()]
        return _pptx_strike_first_two_lines_script(file_path, slide_index, line_indices)

    if skill in {"thunderbird_remove_account", "email_remove_thunderbird_account"}:
        email = _normalize_string(args.get("email") or args.get("account"))
        if not email:
            return "WAIT"
        return _thunderbird_remove_account_script(email)

    return "WAIT"


def _is_done_action(action: Any) -> bool:
    if isinstance(action, str):
        return action.strip().upper() == "DONE"
    if not isinstance(action, dict):
        return False
    name = _normalize_string(action.get("action") or action.get("type") or action.get("status")).lower().replace("-", "_")
    return name in {"done", "finish", "complete"}


def _is_atomic_os_skill(action: Any) -> bool:
    if not isinstance(action, dict):
        return False
    return _extract_os_skill_name(action) in OS_SKILL_CATALOG


def _os_skill_completes_task(action: Any) -> bool:
    if not isinstance(action, dict):
        return False
    return _extract_os_skill_name(action) in OS_SKILL_COMPLETES_TASK


def _missing_required_os_skill_args(action: Any) -> List[str]:
    if not isinstance(action, dict):
        return []
    skill = _extract_os_skill_name(action)
    schema = OS_SKILL_CATALOG.get(skill)
    if not schema:
        return []
    args = _get_action_args(action)
    missing = []
    for key in schema.get("required", []):
        value = args.get(key)
        if key == "domains" and (args.get("domain") or args.get("host") or args.get("site")):
            continue
        if key == "file" and args.get("path"):
            continue
        if key == "source" and args.get("path"):
            continue
        if key == "project" and args.get("path"):
            continue
        if key == "email" and args.get("account"):
            continue
        if key == "file_name" and args.get("name"):
            continue
        if isinstance(value, str) and value.strip():
            continue
        if isinstance(value, list) and len(value) > 0:
            continue
        if value is not None and key == "value":
            continue
        missing.append(key)
    return missing


def action_to_pyautogui(action: Any, screen_size: Tuple[int, int]) -> str:
    if isinstance(action, str):
        raw = action.strip()
        if raw in {"WAIT", "DONE", "FAIL"} or "pyautogui." in raw:
            return raw
        return "WAIT"

    if not isinstance(action, dict):
        return "WAIT"

    width, height = screen_size
    name = _normalize_string(action.get("action") or action.get("type")).lower().replace("-", "_")
    if name in {"done", "finish", "complete"}:
        return "DONE"
    if name in {"fail", "failed"}:
        return "FAIL"
    if name in {"wait", "sleep"}:
        seconds = _safe_number(action.get("seconds") or action.get("duration") or 1.0, 1.0, 0.1, 10.0)
        return f"import time; time.sleep({seconds:.2f})"

    x = _safe_int(action.get("x"), 0, 0, width)
    y = _safe_int(action.get("y"), 0, 0, height)
    if "duration" in action:
        duration_value = action.get("duration")
    elif "durationMs" in action:
        duration_value = _safe_number(action.get("durationMs"), 150, 0, 3000) / 1000
    else:
        duration_value = 0.15
    duration = _safe_number(duration_value, 0.15, 0.0, 3.0)

    if name in {"mouse_move", "move"}:
        return f"import pyautogui, time; pyautogui.moveTo({x}, {y}, duration={duration:.2f}); time.sleep(0.15)"
    if name in {"mouse_click", "click"}:
        button = "right" if _normalize_string(action.get("button")).lower() == "right" else "left"
        return f"import pyautogui, time; pyautogui.click({x}, {y}, button={button!r}); time.sleep(0.35)"
    if name in {"mouse_double_click", "double_click"}:
        return f"import pyautogui, time; pyautogui.doubleClick({x}, {y}); time.sleep(0.35)"
    if name in {"mouse_right_click", "right_click"}:
        return f"import pyautogui, time; pyautogui.rightClick({x}, {y}); time.sleep(0.35)"
    if name in {"mouse_drag", "drag"}:
        start_x_value = action.get("startX") or action.get("start_x") or action.get("x_start") or action.get("fromX") or action.get("from_x") or action.get("x1")
        start_y_value = action.get("startY") or action.get("start_y") or action.get("y_start") or action.get("fromY") or action.get("from_y") or action.get("y1")
        end_x_value = action.get("endX") or action.get("toX") or action.get("end_x") or action.get("x_end") or action.get("to_x") or action.get("x2")
        end_y_value = action.get("endY") or action.get("toY") or action.get("end_y") or action.get("y_end") or action.get("to_y") or action.get("y2")
        has_explicit_start = start_x_value is not None and start_y_value is not None
        start_x = _safe_int(start_x_value, x, 0, width)
        start_y = _safe_int(start_y_value, y, 0, height)
        end_x = _safe_int(end_x_value, x, 0, width)
        end_y = _safe_int(end_y_value, y, 0, height)
        if not has_explicit_start:
            return (
                "import pyautogui, time; "
                f"pyautogui.dragTo({end_x}, {end_y}, duration={max(duration, 0.35):.2f}, button='left'); "
                "time.sleep(0.35)"
            )
        return (
            "import pyautogui, time; "
            f"pyautogui.moveTo({start_x}, {start_y}, duration=0.10); "
            f"pyautogui.dragTo({end_x}, {end_y}, duration={max(duration, 0.35):.2f}, button='left'); "
            "time.sleep(0.35)"
        )
    if name in {"scroll", "mouse_scroll"}:
        delta = _safe_int(action.get("delta") or action.get("amount") or action.get("clicks"), -5, -50, 50)
        if "x" in action and "y" in action:
            return f"import pyautogui, time; pyautogui.scroll({delta}, x={x}, y={y}); time.sleep(0.25)"
        return f"import pyautogui, time; pyautogui.scroll({delta}); time.sleep(0.25)"
    if name in {"keyboard_type", "type", "type_text"}:
        text = _normalize_string(action.get("text") or action.get("value"))
        return f"import pyautogui, time; pyautogui.write({text!r}, interval=0.01); time.sleep(0.2)"
    if name in {"keyboard_press", "press", "press_key"}:
        key = _safe_key(action.get("key") or action.get("text"))
        return f"import pyautogui, time; pyautogui.press({key!r}); time.sleep(0.2)" if key else "WAIT"
    if name in {"keyboard_hotkey", "hotkey"}:
        keys = _safe_keys(action.get("keys") or action.get("key"))
        args = ", ".join(repr(key) for key in keys)
        return f"import pyautogui, time; pyautogui.hotkey({args}); time.sleep(0.25)" if args else "WAIT"
    if name in {"clipboard_write", "paste_text"}:
        text = _normalize_string(action.get("text") or action.get("value"))
        return (
            "import pyautogui, time\n"
            "try:\n"
            "    import pyperclip\n"
            f"    pyperclip.copy({text!r})\n"
            "    pyautogui.hotkey('ctrl', 'v')\n"
            "except Exception:\n"
            f"    pyautogui.write({text!r}, interval=0.01)\n"
            "time.sleep(0.25)"
        )
    if name in {"os_skill", "desktop_skill", "skill"}:
        return os_skill_to_pyautogui(action, screen_size)
    if _canonical_os_skill_name(name) in OS_SKILL_CATALOG:
        wrapped = {"action": "os_skill", "name": _canonical_os_skill_name(name), "args": _get_action_args(action)}
        return os_skill_to_pyautogui(wrapped, screen_size)

    return "WAIT"


class AILISOsWorldAgent:
    def __init__(
        self,
        model: str = "ailis-osworld",
        action_space: str = "pyautogui",
        observation_type: str = "a11y_tree",
        max_trajectory_length: int = DEFAULT_MAX_HISTORY,
        a11y_tree_max_tokens: int = DEFAULT_A11Y_TOKEN_BUDGET,
        screen_size: Tuple[int, int] = (1920, 1080),
        include_screenshot: bool = False,
    ):
        self.model = model
        self.action_space = action_space
        self.observation_type = observation_type
        self.max_trajectory_length = max_trajectory_length
        self.a11y_tree_max_tokens = a11y_tree_max_tokens
        self.screen_size = screen_size
        self.include_screenshot = include_screenshot
        self.history: List[Dict[str, Any]] = []
        self.runtime_logger = None
        self.settings = load_ailis_llm_settings()
        self.cookie_consent_attempted = False
        self.last_task_context: Dict[str, Any] = {}

    def reset(self, runtime_logger=None, vm_ip=None, **_kwargs):
        self.runtime_logger = runtime_logger
        self.history = []
        self.vm_ip = vm_ip
        self.cookie_consent_attempted = False
        self.last_task_context = {}

    def _log(self, message: str):
        if self.runtime_logger:
            self.runtime_logger.info(message)

    def _linearized_a11y(self, obs: Dict[str, Any]) -> str:
        raw = obs.get("accessibility_tree") or ""
        if not raw:
            return ""
        if callable(linearize_accessibility_tree):
            try:
                text = linearize_accessibility_tree(raw, platform="ubuntu")
                if callable(trim_accessibility_tree):
                    text = trim_accessibility_tree(text, self.a11y_tree_max_tokens)
                return text
            except Exception as error:
                return f"[a11y_tree_parse_error] {error}\n{raw[:12000]}"
        return str(raw)[:12000]

    def _cookie_consent_action(self, obs: Dict[str, Any]) -> Optional[Tuple[Dict[str, Any], List[str]]]:
        if self.cookie_consent_attempted:
            return None
        if self.history and "a11y cookie consent" in _normalize_string(self.history[-1].get("thought")).lower():
            return None
        a11y = self._linearized_a11y(obs)
        target = _find_a11y_click_target(a11y, [
            "allow all",
            "accept all",
            "accept cookies",
            "i agree",
            "got it",
        ])
        if not target:
            return None
        x, y, label = target
        action = {"action": "mouse_click", "x": x, "y": y}
        response = {
            "status": "continue",
            "thought": f"a11y cookie consent button: {label}",
            "actions": [action],
        }
        self.cookie_consent_attempted = True
        return response, [action_to_pyautogui(action, self.screen_size)]

    def _build_messages(self, instruction: str, obs: Dict[str, Any]) -> List[Dict[str, Any]]:
        system = (
            "You are AILIS running in OSWorld PC benchmark execution mode. "
            "Complete the user's desktop task by returning only a JSON object. "
            "Use the accessibility tree coordinates and screenshot context when available. "
            "Do not describe internal tools to the user. Do not claim success until the task is actually complete. "
            "Allowed structured actions: mouse_move, mouse_click, mouse_double_click, mouse_right_click, "
            "mouse_drag, scroll, keyboard_type, keyboard_press, keyboard_hotkey, clipboard_write, os_skill, wait, done, fail. "
            "Use the provided task context, recent trajectory, accessibility tree, and screenshot before choosing an action. Treat candidate skills as options, not commands. "
            "Use os_skill only when you can supply the required arguments from the task text, current UI state, or recent trajectory. "
            "Do not invent file paths, URLs, domains, email addresses, row values, or replacement text. If required arguments are missing, use GUI actions to gather evidence or return wait/fail. "
            "OS skills are faster and more stable for direct browser profile edits, document file edits, media conversion, and shell/profile repairs; GUI actions are better when the target must be visually discovered. "
            "Only return done after the task is visibly complete or after a candidate skill whose complete_on_success field is true has run. "
            "Skill catalog: browser_open_url(url); desktop_create_web_shortcut(url?, title?) can infer the active browser page; "
            "chrome_delete_site_data(domains); chrome_set_default_search_engine(engine, currently Bing only); chrome_load_unpacked_extension_path(path?; can discover Desktop extension manifest); "
            "image_decrease_brightness(source, output?, factor?) and image_increase_saturation(source, output?, factor?); "
            "spreadsheet_set_cell_value(file, cell, value), spreadsheet_time_rate_total(file, cell, value), spreadsheet_create_totals_sheet(file), spreadsheet_unique_names(file), xlsx_append_inline_row(file, values); "
            "vscode_replace_text(file, old, new), vscode_set_user_setting(key, value), vscode_open_project(project); "
            "vlc_play_video(file), vlc_extract_mp3(source, output?); os_restore_trash_file(file_name); "
            "docx_double_first_two_paragraphs(file), docx_tabstops_after_three_words(file); "
            "pptx_cover_image_fill(file), pptx_strike_first_two_lines(file, slide?, line_indices? one-based); "
            "shell_enable_conda(); copy_named_file_path_to_clipboard(file_name); thunderbird_remove_account(email). "
            "Return one action per step unless the first action is an os_skill and the second action is done. Coordinates are absolute screen pixels. "
            "Schema: {\"status\":\"continue|done|fail|wait\",\"thought\":\"brief operational summary\","
            "\"actions\":[{\"action\":\"mouse_click\",\"x\":100,\"y\":200}]}"
        )
        messages: List[Dict[str, Any]] = [{"role": "system", "content": system}]
        if self.history:
            compact_history = self.history[-self.max_trajectory_length:]
            messages.append({
                "role": "user",
                "content": "Recent trajectory:\n" + json.dumps(compact_history, ensure_ascii=False)[:6000],
            })

        a11y = self._linearized_a11y(obs)
        task_context = build_osworld_task_context(instruction, a11y, self.history)
        self.last_task_context = task_context
        stagnation_hint = self._build_stagnation_hint()
        user_text = (
            f"Task instruction:\n{instruction}\n\n"
            f"Screen size: {self.screen_size[0]}x{self.screen_size[1]}\n\n"
            "Task context and recent observations:\n"
            f"{json.dumps(task_context, ensure_ascii=False)[:8000]}\n\n"
            f"Current accessibility tree:\n{a11y or '[not available]'}\n\n"
            f"{stagnation_hint}"
            "Return the next structured action JSON only."
        )

        if self.include_screenshot and obs.get("screenshot"):
            image_b64 = encode_image_bytes(obs.get("screenshot") or b"")
            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": user_text},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}},
                ],
            })
        else:
            messages.append({"role": "user", "content": user_text})
        return messages

    def _call_model(self, messages: List[Dict[str, Any]]) -> Tuple[bool, str, str]:
        base_url = self.settings.get("base_url")
        model = self.settings.get("model")
        api_key = self.settings.get("api_key")
        if not base_url or not model or not api_key:
            return False, "missing_config", "Missing AILIS OSWorld LLM settings. Configure desktop LLM settings or AILIS_OSWORLD_* env vars."

        timeout_seconds = max(DEFAULT_TIMEOUT_SECONDS, int(self.settings.get("timeout_seconds", DEFAULT_TIMEOUT_SECONDS) or DEFAULT_TIMEOUT_SECONDS))
        last_error = ""
        for attempt in range(DEFAULT_MODEL_RETRIES + 1):
            try:
                response = requests.post(
                    _chat_completions_url(base_url),
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": model,
                        "messages": messages,
                        "temperature": self.settings.get("temperature", 0.2),
                        "stream": False,
                    },
                    timeout=timeout_seconds,
                )
                if response.status_code >= 400:
                    return False, "provider_error", f"provider_error status={response.status_code}: {response.text[:600]}"
                payload = response.json()
                content = payload.get("choices", [{}])[0].get("message", {}).get("content") or payload.get("choices", [{}])[0].get("text")
                return bool(content), "ok" if content else "empty_response", _normalize_string(content)
            except Exception as error:
                last_error = f"provider_exception: {error}"
                if attempt < DEFAULT_MODEL_RETRIES:
                    time.sleep(1.5 * (attempt + 1))
                    continue
        return False, "provider_timeout_or_exception", last_error

    def predict(self, instruction: str, obs: Dict[str, Any]):
        cookie_consent = self._cookie_consent_action(obs)
        if cookie_consent:
            response, actions = cookie_consent
            self.history.append({
                "thought": response["thought"],
                "actions": actions,
                "timestamp": int(time.time()),
            })
            return response, actions

        messages = self._build_messages(instruction, obs)
        ok, code, content = self._call_model(messages)
        if not ok:
            self._log(content)
            if code == "missing_config":
                response = {"status": "fail", "thought": content, "actions": [{"action": "fail"}]}
                return response, ["FAIL"]
            response = {"status": "wait", "thought": content, "actions": [{"action": "wait", "seconds": 1.0}]}
            return response, [action_to_pyautogui(response["actions"][0], self.screen_size)]

        parsed = extract_json_object(content)
        if not parsed:
            if "pyautogui." in content:
                actions = [content.strip()]
                response = {"status": "continue", "thought": "model returned pyautogui code", "raw": content}
            else:
                actions = ["WAIT"]
                response = {"status": "wait", "thought": "model returned unparseable action", "raw": content[:1000]}
        else:
            raw_actions = parsed.get("actions")
            if not isinstance(raw_actions, list):
                raw_actions = [{"action": parsed.get("action") or parsed.get("status") or "wait"}]
            if raw_actions and _is_atomic_os_skill(raw_actions[0]):
                missing_args = _missing_required_os_skill_args(raw_actions[0])
                if missing_args:
                    parsed["thought"] = (
                        _normalize_string(parsed.get("thought")) +
                        f" Missing required os_skill arguments: {', '.join(missing_args)}; gather more evidence."
                    ).strip()
                    raw_actions = [{"action": "wait", "seconds": 0.5}]
                elif _os_skill_completes_task(raw_actions[0]) and not any(_is_done_action(item) for item in raw_actions):
                    raw_actions = [raw_actions[0], {"action": "done"}]
            elif len(self.history) >= 3:
                recovery_action = _grounded_completion_skill_action(self.last_task_context)
                if recovery_action:
                    parsed["thought"] = (
                        _normalize_string(parsed.get("thought")) +
                        " Structured recovery selected a grounded completion skill after repeated GUI probing."
                    ).strip()
                    raw_actions = [recovery_action, {"action": "done"}]
            actions = [action_to_pyautogui(action, self.screen_size) for action in raw_actions[:2]]
            if not actions:
                actions = [action_to_pyautogui({"action": parsed.get("status") or "wait"}, self.screen_size)]
            response = parsed

        self.history.append({
            "thought": _normalize_string(response.get("thought"))[:500] if isinstance(response, dict) else "",
            "actions": actions,
            "timestamp": int(time.time()),
        })
        return response, actions

    def _build_stagnation_hint(self) -> str:
        flattened: List[str] = []
        for entry in self.history[-6:]:
            for action in entry.get("actions") or []:
                normalized = re.sub(r"\s+", " ", str(action)).strip()
                if normalized and not normalized.startswith("import time; time.sleep"):
                    flattened.append(normalized)
        if len(flattened) >= 3 and len(set(flattened[-3:])) == 1:
            return (
                "Progress warning: the last three non-wait actions were identical. "
                "Do not repeat the same click/drag; choose a different route, use an os_skill, or finish/fail if blocked.\n\n"
            )
        return ""
