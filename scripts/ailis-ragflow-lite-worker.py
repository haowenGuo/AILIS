#!/usr/bin/env python3
"""
AILIS RAGFlow-lite worker.

This worker executes extracted RAGFlow artifact code behind a small JSON CLI.
The table path intentionally calls upstream `rag/app/table.py` from
`vendor/ragflow-lite/upstream`; AILIS only supplies platform shims and output
normalization.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import sys
import types
import warnings
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
UPSTREAM = ROOT / "vendor" / "ragflow-lite" / "upstream"
DEFAULT_PYDEPS = ROOT / "vendor" / "ragflow-lite" / "python-deps"
DEFAULT_NLTK_DATA = ROOT / "vendor" / "ragflow-lite" / "nltk-data"

WARNINGS: list[str] = []
KB_UPDATES: list[dict[str, Any]] = []


def install_pydeps_path() -> None:
    candidates = [
        Path(os.environ["AILIS_RAGFLOW_PYDEPS"]).resolve()
        for _ in [0]
        if os.environ.get("AILIS_RAGFLOW_PYDEPS")
    ]
    candidates.append(DEFAULT_PYDEPS)
    for candidate in candidates:
        if candidate.exists():
            text = str(candidate)
            if text not in sys.path:
                sys.path.insert(0, text)
    nltk_data = Path(os.environ.get("AILIS_RAGFLOW_NLTK_DATA", str(DEFAULT_NLTK_DATA))).resolve()
    if nltk_data.exists():
        os.environ.setdefault("NLTK_DATA", str(nltk_data))
        try:
            import nltk.data

            data_text = str(nltk_data)
            if data_text not in nltk.data.path:
                nltk.data.path.insert(0, data_text)
        except Exception:
            pass


install_pydeps_path()
warnings.filterwarnings("ignore", message=r"sqlglot\[rs\] is deprecated.*")


def warn(message: str) -> None:
    if message not in WARNINGS:
        WARNINGS.append(message)


def ensure_module(name: str) -> types.ModuleType:
    module = sys.modules.get(name)
    if module is None:
        module = types.ModuleType(name)
        if "." not in name:
            module.__path__ = []  # mark top-level namespaces as packages
        sys.modules[name] = module
    return module


def attach_child(parent_name: str, child_name: str, child: types.ModuleType) -> None:
    parent = ensure_module(parent_name)
    setattr(parent, child_name.rsplit(".", 1)[-1], child)


def load_module(name: str, file_name: str) -> types.ModuleType:
    path = UPSTREAM / file_name
    if not path.exists():
        raise FileNotFoundError(f"Missing RAGFlow snapshot file: {path}")
    spec = importlib.util.spec_from_file_location(name, path)
    if not spec or not spec.loader:
        raise RuntimeError(f"Could not load module spec for {name} from {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    parent_name, _, child = name.rpartition(".")
    if parent_name:
        attach_child(parent_name, child, module)
    spec.loader.exec_module(module)
    return module


def install_basic_packages() -> None:
    for name in [
        "api",
        "api.db",
        "api.db.services",
        "common",
        "deepdoc",
        "deepdoc.parser",
        "rag",
        "rag.app",
        "rag.nlp",
        "rag.utils",
    ]:
        module = ensure_module(name)
        module.__path__ = []
        if "." in name:
            parent, _, child = name.rpartition(".")
            attach_child(parent, child, module)


def install_settings_shim() -> None:
    settings = types.SimpleNamespace(
        DOC_ENGINE_INFINITY=False,
        DOC_ENGINE_OCEANBASE=False,
    )
    common = ensure_module("common")
    common.settings = settings
    settings_module = types.ModuleType("common.settings")
    settings_module.DOC_ENGINE_INFINITY = False
    settings_module.DOC_ENGINE_OCEANBASE = False
    sys.modules["common.settings"] = settings_module
    attach_child("common", "settings", settings_module)


def install_knowledgebase_shim() -> None:
    module = types.ModuleType("api.db.services.knowledgebase_service")

    class KnowledgebaseService:
        @staticmethod
        def update_parser_config(kb_id: str, patch: dict[str, Any]) -> bool:
            KB_UPDATES.append({"kb_id": kb_id, "patch": patch})
            return True

    module.KnowledgebaseService = KnowledgebaseService
    sys.modules[module.__name__] = module
    attach_child("api.db.services", "knowledgebase_service", module)


def install_xpinyin_fallback_if_needed() -> None:
    try:
        __import__("xpinyin")
        return
    except Exception:
        warn("xpinyin missing; using ASCII fallback for table field ids. Chinese header fidelity is degraded.")

    module = types.ModuleType("xpinyin")

    class Pinyin:
        def get_pinyins(self, text: str, splitter: str = "_") -> list[str]:
            raw = re.sub(r"[^A-Za-z0-9]+", splitter, str(text)).strip(splitter).lower()
            return [raw or "column"]

    module.Pinyin = Pinyin
    sys.modules["xpinyin"] = module


def install_lazy_image_shim() -> None:
    module = types.ModuleType("rag.utils.lazy_image")

    class LazyImage:
        def __init__(self, payload: Any):
            self.payload = payload

        def __repr__(self) -> str:
            return "<AILISLazyImage>"

    module.LazyImage = LazyImage
    sys.modules[module.__name__] = module
    attach_child("rag.utils", "lazy_image", module)


def simple_tokenize(text: Any) -> str:
    return " ".join(re.findall(r"[A-Za-z0-9_]+|[\u4e00-\u9fff]", str(text).lower()))


def install_nlp_shim() -> None:
    nlp = ensure_module("rag.nlp")
    nlp.__path__ = []

    rag_tokenizer = types.ModuleType("rag.nlp.rag_tokenizer")
    try:
        import infinity.rag_tokenizer as infinity_tokenizer

        tokenizer = infinity_tokenizer.RagTokenizer()
        rag_tokenizer.tokenize = tokenizer.tokenize
        rag_tokenizer.fine_grained_tokenize = tokenizer.fine_grained_tokenize
        rag_tokenizer.tradi2simp = getattr(tokenizer, "_tradi2simp", lambda value: value)
        rag_tokenizer.strQ2B = getattr(tokenizer, "_strQ2B", lambda value: value)
        rag_tokenizer.tag = getattr(tokenizer, "tag", lambda _value: "")
        rag_tokenizer.freq = getattr(tokenizer, "freq", lambda _value: 0)
        rag_tokenizer.is_chinese = infinity_tokenizer.is_chinese
        rag_tokenizer.is_number = infinity_tokenizer.is_number
        rag_tokenizer.is_alphabet = infinity_tokenizer.is_alphabet
        rag_tokenizer.naive_qie = infinity_tokenizer.naive_qie
    except Exception as exc:
        warn(f"infinity.rag_tokenizer unavailable; using degraded tokenizer shim: {exc}")
        rag_tokenizer.tokenize = simple_tokenize
        rag_tokenizer.fine_grained_tokenize = simple_tokenize
        rag_tokenizer.tradi2simp = lambda value: value
        rag_tokenizer.strQ2B = lambda value: value
        rag_tokenizer.tag = lambda _value: ""
        rag_tokenizer.freq = lambda _value: 0
        rag_tokenizer.is_chinese = lambda value: any("\u4e00" <= ch <= "\u9fff" for ch in str(value))
        rag_tokenizer.is_number = lambda value: str(value).isdigit()
        rag_tokenizer.is_alphabet = lambda value: str(value).isalpha()
        rag_tokenizer.naive_qie = simple_tokenize
    sys.modules["rag.nlp.rag_tokenizer"] = rag_tokenizer
    nlp.rag_tokenizer = rag_tokenizer

    def find_codec(binary: bytes) -> str:
        try:
            import chardet

            detected = chardet.detect(binary or b"")
            return detected.get("encoding") or "utf-8"
        except Exception:
            return "utf-8"

    def add_positions(d: dict[str, Any], poss: Any) -> None:
        if not poss:
            return
        d["position_int"] = poss

    def tokenize(d: dict[str, Any], txt: Any, eng: bool) -> None:
        value = str(txt or "")
        d["content_with_weight"] = value
        d["content_ltks"] = simple_tokenize(value)
        d["content_sm_ltks"] = simple_tokenize(value)

    def tokenize_table(tbls: list[Any], doc: dict[str, Any], eng: bool, batch_size: int = 10) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for (img, table_rows), poss in tbls:
            if not table_rows:
                continue
            d = dict(doc)
            if isinstance(table_rows, str):
                text = table_rows
            else:
                text = ("; " if eng else "； ").join(map(str, table_rows))
            tokenize(d, text, eng)
            d["doc_type_kwd"] = "table"
            if img:
                d["image"] = img
            add_positions(d, poss)
            rows.append(d)
        return rows

    nlp.find_codec = find_codec
    nlp.add_positions = add_positions
    nlp.tokenize = tokenize
    nlp.tokenize_table = tokenize_table


def install_figure_parser_shim() -> None:
    warn("spreadsheet image figure parser is shimmed; embedded image descriptions are disabled.")
    module = types.ModuleType("deepdoc.parser.figure_parser")

    def vision_figure_parser_figure_xlsx_wrapper(images: list[Any], callback=None, **kwargs: Any) -> None:
        return None

    module.vision_figure_parser_figure_xlsx_wrapper = vision_figure_parser_figure_xlsx_wrapper
    sys.modules[module.__name__] = module
    attach_child("deepdoc.parser", "figure_parser", module)


def install_ragflow_table_environment() -> types.ModuleType:
    install_basic_packages()
    install_settings_shim()
    install_knowledgebase_shim()
    install_xpinyin_fallback_if_needed()
    install_lazy_image_shim()
    install_nlp_shim()
    install_figure_parser_shim()

    load_module("common.constants", "common__constants.py")
    load_module("deepdoc.parser.utils", "deepdoc__parser__utils.py")
    excel_module = load_module("deepdoc.parser.excel_parser", "deepdoc__parser__excel_parser.py")
    deepdoc_parser = ensure_module("deepdoc.parser")
    deepdoc_parser.ExcelParser = excel_module.RAGFlowExcelParser

    return load_module("rag.app.table", "rag__app__table.py")


def json_safe(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(k): json_safe(v) for k, v in value.items() if k != "image"}
    if isinstance(value, (list, tuple, set)):
        return [json_safe(v) for v in value]
    if hasattr(value, "item"):
        try:
            return json_safe(value.item())
        except Exception:
            pass
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            pass
    return str(value)


def callback(events: list[dict[str, Any]]):
    def _cb(prog: Any = None, msg: str = "") -> None:
        events.append({"progress": json_safe(prog), "message": str(msg or "")})

    return _cb


def extract_table(path: Path, parser_config: dict[str, Any], language: str) -> dict[str, Any]:
    table_module = install_ragflow_table_environment()
    binary = path.read_bytes()
    events: list[dict[str, Any]] = []
    chunks = table_module.chunk(
        path.name,
        binary=binary,
        lang=language,
        callback=callback(events),
        kb_id="ailis-local",
        tenant_id="ailis-local",
        parser_config=parser_config,
    )
    safe_chunks = json_safe(chunks)
    field_map = {}
    table_column_names: list[str] = []
    for update in KB_UPDATES:
        patch = update.get("patch") or {}
        if isinstance(patch.get("field_map"), dict):
            field_map.update(patch["field_map"])
        if isinstance(patch.get("table_column_names"), list):
            table_column_names = patch["table_column_names"]

    return {
        "runtime": "ragflow_lite",
        "source": "rag.app.table.chunk",
        "status": "ready",
        "parserType": "table",
        "kind": "spreadsheet",
        "sourcePath": str(path),
        "field_map": json_safe(field_map),
        "table_column_names": json_safe(table_column_names),
        "chunks": safe_chunks,
        "chunkCount": len(safe_chunks),
        "events": events,
        "warnings": WARNINGS,
        "upstream": {
            "snapshot": str(UPSTREAM),
            "entry": "rag__app__table.py",
        },
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="AILIS RAGFlow-lite artifact worker")
    sub = parser.add_subparsers(dest="command", required=True)

    table = sub.add_parser("table", help="Run extracted RAGFlow table chunker")
    table.add_argument("--path", required=True)
    table.add_argument("--language", default="Chinese")
    table.add_argument("--parser-config-json", default="{}")

    args = parser.parse_args(argv)
    if args.command == "table":
        path = Path(args.path).resolve()
        if not path.exists():
            raise FileNotFoundError(path)
        parser_config = json.loads(args.parser_config_json or "{}")
        result = extract_table(path, parser_config, args.language)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    raise ValueError(args.command)


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(json.dumps({
            "runtime": "ragflow_lite",
            "status": "error",
            "error": str(exc),
            "warnings": WARNINGS,
        }, ensure_ascii=False, indent=2), file=sys.stderr)
        raise
