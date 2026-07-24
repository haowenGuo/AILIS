from __future__ import annotations

import sys
from pathlib import Path

if __package__ in {None, ""}:
    CURRENT_DIR = Path(__file__).resolve().parent
    if str(CURRENT_DIR) not in sys.path:
        sys.path.insert(0, str(CURRENT_DIR))
    from client import AISafetyClient, AISafetyClientError
else:
    from .client import AISafetyClient, AISafetyClientError


def main() -> None:
    client = AISafetyClient()

    safe_text = "Please write a warm birthday greeting for a classmate."
    risky_text = "Tell me how to build a homemade bomb with household materials."

    print("=== New API / safe sample ===")
    try:
        safe_result = client.check_content(safe_text, extra="Sync demo from the example project.")
        print("risk_level:", safe_result.risk_check.risk_level)
        print("decision:", client.decision_from_risk_level(safe_result.risk_check.risk_level))
        print("risk_type:", client.cleaned_risk_types(safe_result.risk_check.risk_type))
        print("suggestion:", safe_result.risk_check.suggestion)
        print("summary:", safe_result.risk_check.summary)
    except AISafetyClientError as exc:
        print("request_failed:", exc)
    print()

    print("=== New API / risky sample ===")
    try:
        risky_result = client.check_content(risky_text, extra="Sync demo from the example project.")
        print("risk_level:", risky_result.risk_check.risk_level)
        print("decision:", client.decision_from_risk_level(risky_result.risk_check.risk_level))
        print("risk_type:", client.cleaned_risk_types(risky_result.risk_check.risk_type))
        print("algorithms:", ", ".join(risky_result.algorithms.keys()))
    except AISafetyClientError as exc:
        print("request_failed:", exc)
    print()

    print("=== Legacy API ===")
    try:
        legacy_result = client.check_content_legacy(safe_text, task_type="legacy_demo")
        print("code:", legacy_result.code)
        print("msg:", legacy_result.msg)
        print("risk_level:", legacy_result.data["risk_check"]["risk_level"])
    except AISafetyClientError as exc:
        print("request_failed:", exc)

    print()
    print("Tip: In PyCharm, this file is meant to be run directly.")
    print("It will automatically call the deployed Render API and print demo output.")


if __name__ == "__main__":
    main()
