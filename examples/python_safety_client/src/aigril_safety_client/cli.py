from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

if __package__ in {None, ""}:
    CURRENT_DIR = Path(__file__).resolve().parent
    if str(CURRENT_DIR) not in sys.path:
        sys.path.insert(0, str(CURRENT_DIR))
    from client import AISafetyAsyncClient, AISafetyClient, AISafetyClientError
else:
    from .client import AISafetyAsyncClient, AISafetyClient, AISafetyClientError


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AIGril safety API example CLI")
    subparsers = parser.add_subparsers(dest="command", required=False)

    check_parser = subparsers.add_parser("check", help="Call the new /api/safety/check endpoint")
    check_parser.add_argument("--content", required=True, help="Text to moderate")
    check_parser.add_argument("--extra", default=None, help="Optional context")
    check_parser.add_argument("--task-type", default="content_safety_check", help="Task type")

    legacy_parser = subparsers.add_parser("legacy", help="Call the legacy /api/handle endpoint")
    legacy_parser.add_argument("--content", required=True, help="Text to moderate")
    legacy_parser.add_argument("--extra", default=None, help="Optional context")
    legacy_parser.add_argument("--task-type", default="content_safety_check", help="Task type")

    batch_parser = subparsers.add_parser("batch", help="Run async batch moderation from a text file")
    batch_parser.add_argument("--file", required=True, help="Path to a UTF-8 text file, one sample per line")
    batch_parser.add_argument("--extra", default=None, help="Optional context")
    batch_parser.add_argument("--task-type", default="content_safety_check", help="Task type")

    return parser


def print_json(payload: object) -> None:
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def run_default_demo() -> None:
    """
    PyCharm 直接点运行 cli.py 时的默认演示模式。
    不要求用户手动传命令行参数。
    """
    client = AISafetyClient()
    sample = "Please summarize a birthday greeting in a warm tone."
    print("No CLI arguments detected. Running default demo...\n")
    try:
        result = client.check_content(sample, extra="Default demo mode from cli.py")
        print_json(
            {
                "mode": "default_demo",
                "content": sample,
                "risk_level": result.risk_check.risk_level,
                "risk_type": client.cleaned_risk_types(result.risk_check.risk_type),
                "decision": client.decision_from_risk_level(result.risk_check.risk_level),
                "suggestion": result.risk_check.suggestion,
                "algorithms": list(result.algorithms.keys()),
            }
        )
    except AISafetyClientError as exc:
        print_json({"mode": "default_demo", "error": str(exc)})
    print("\nExamples:")
    print('  python cli.py check --content "Please summarize a birthday greeting in a warm tone."')
    print('  python cli.py legacy --content "Please summarize a birthday greeting in a warm tone."')
    print("  python cli.py batch --file demo_inputs.txt")


async def run_batch(file_path: str, task_type: str, extra: str | None) -> None:
    lines = [
        line.strip()
        for line in Path(file_path).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    client = AISafetyAsyncClient()
    results = await client.check_many_safe(lines, task_type=task_type, extra=extra)
    print_json(
        [
            {
                "content": original_content,
                "request_failed": error,
                "risk_level": item.risk_check.risk_level if item else None,
                "risk_type": client.cleaned_risk_types(item.risk_check.risk_type) if item else [],
                "decision": client.decision_from_risk_level(item.risk_check.risk_level) if item else "error",
                "suggestion": item.risk_check.suggestion if item else "Retry or log the failed request.",
            }
            for original_content, item, error in results
        ]
    )


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        run_default_demo()
        return

    if args.command == "check":
        client = AISafetyClient()
        try:
            result = client.check_content(args.content, task_type=args.task_type, extra=args.extra)
        except AISafetyClientError as exc:
            print_json({"error": str(exc)})
            return
        print_json(
            {
                "task": result.task,
                "risk_level": result.risk_check.risk_level,
                "risk_type": client.cleaned_risk_types(result.risk_check.risk_type),
                "decision": client.decision_from_risk_level(result.risk_check.risk_level),
                "suggestion": result.risk_check.suggestion,
                "algorithms": list(result.algorithms.keys()),
            }
        )
        return

    if args.command == "legacy":
        client = AISafetyClient()
        try:
            result = client.check_content_legacy(args.content, task_type=args.task_type, extra=args.extra)
        except AISafetyClientError as exc:
            print_json({"error": str(exc)})
            return
        print_json(result.data)
        return

    if args.command == "batch":
        try:
            asyncio.run(run_batch(args.file, args.task_type, args.extra))
        except AISafetyClientError as exc:
            print_json({"error": str(exc)})
        return


if __name__ == "__main__":
    main()
