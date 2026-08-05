#!/usr/bin/env python3
"""Score an AILIS LoCoMo run with the released LoCoMo QA metrics."""

from __future__ import annotations

import argparse
import json
import re
import string
from collections import Counter, defaultdict
from pathlib import Path

from nltk.stem import PorterStemmer


PORTER = PorterStemmer()
CATEGORY_NAMES = {
    1: "multi_hop",
    2: "temporal",
    3: "open_domain",
    4: "single_hop",
    5: "adversarial",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", required=True, type=Path)
    parser.add_argument("--gold", required=True, type=Path)
    parser.add_argument("--output-dir", type=Path)
    return parser.parse_args()


def read_jsonl(path: Path) -> list[dict]:
    rows = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def normalize_answer(value: str) -> str:
    text = str(value).replace(",", "").lower()
    text = "".join(char for char in text if char not in set(string.punctuation))
    text = re.sub(r"\b(a|an|the|and)\b", " ", text)
    return " ".join(text.split())


def token_f1(prediction: str, ground_truth: str) -> float:
    prediction_tokens = [PORTER.stem(word) for word in normalize_answer(prediction).split()]
    truth_tokens = [PORTER.stem(word) for word in normalize_answer(ground_truth).split()]
    if not prediction_tokens or not truth_tokens:
        return float(prediction_tokens == truth_tokens)
    common = Counter(prediction_tokens) & Counter(truth_tokens)
    overlap = sum(common.values())
    if not overlap:
        return 0.0
    precision = overlap / len(prediction_tokens)
    recall = overlap / len(truth_tokens)
    return 2 * precision * recall / (precision + recall)


def multi_answer_f1(prediction: str, ground_truth: str) -> float:
    predictions = [part.strip() for part in prediction.split(",")]
    truths = [part.strip() for part in ground_truth.split(",")]
    if not truths:
        return 0.0
    return sum(max(token_f1(candidate, truth) for candidate in predictions) for truth in truths) / len(truths)


def official_qa_score(prediction: str, ground_truth: str, category: int) -> float:
    if category == 1:
        return multi_answer_f1(prediction, ground_truth)
    if category in (2, 3, 4):
        if category == 3:
            ground_truth = ground_truth.split(";", 1)[0].strip()
        return token_f1(prediction, ground_truth)
    if category == 5:
        lowered = prediction.lower()
        return float("no information available" in lowered or "not mentioned" in lowered)
    raise ValueError(f"Unsupported LoCoMo category: {category}")


def mean(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None


def main() -> None:
    args = parse_args()
    run_dir = args.run_dir.resolve()
    output_dir = (args.output_dir or (run_dir / "locomo-official-eval")).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    results_path = run_dir / "results.jsonl"
    gold = json.loads(args.gold.resolve().read_text(encoding="utf-8"))
    latest_results = {}
    for row in read_jsonl(results_path):
        latest_results[str(row.get("question_id", ""))] = row

    judgments = []
    category_scores = defaultdict(list)
    retrieval_session = []
    retrieval_turn = []
    completed = 0
    for question_id, reference in gold.items():
        result = latest_results.get(question_id)
        is_completed = bool(result and result.get("completed") is True)
        prediction = str(result.get("hypothesis", "")) if result else ""
        category = int(reference["category"])
        score = official_qa_score(prediction, str(reference["answer"]), category) if is_completed else None
        if is_completed:
            completed += 1
            category_scores[category].append(score)
            retrieval = result.get("retrieval") or {}
            if retrieval.get("answerable") is True:
                session_recall = retrieval.get("evidenceSessionRecallAt8")
                turn_recall = retrieval.get("evidenceTurnRecallAt8")
                if isinstance(session_recall, (int, float)):
                    retrieval_session.append(float(session_recall))
                if isinstance(turn_recall, (int, float)):
                    retrieval_turn.append(float(turn_recall))
        judgments.append({
            "question_id": question_id,
            "category": category,
            "category_name": CATEGORY_NAMES[category],
            "completed": is_completed,
            "prediction": prediction,
            "reference": reference["answer"],
            "score": score,
        })

    completed_scores = [row["score"] for row in judgments if row["score"] is not None]
    summary = {
        "benchmark": "LoCoMo",
        "evaluator": "released LoCoMo QA metric port",
        "source_metric": "build-cache/benchmarks/locomo/task_eval/evaluation.py",
        "expected": len(gold),
        "recorded": len(latest_results),
        "completed": completed,
        "missing": len(gold) - completed,
        "completion_rate": completed / len(gold) if gold else None,
        "qa_score": mean(completed_scores),
        "qa_score_all_expected": sum(completed_scores) / len(gold) if gold else None,
        "retrieval_session_recall_at_8": mean(retrieval_session),
        "retrieval_turn_recall_at_8": mean(retrieval_turn),
        "retrieval_answerable_count": len(retrieval_session),
        "by_category": {
            CATEGORY_NAMES[category]: {
                "category": category,
                "expected": sum(1 for ref in gold.values() if int(ref["category"]) == category),
                "completed": len(category_scores[category]),
                "score": mean(category_scores[category]),
            }
            for category in sorted(CATEGORY_NAMES)
        },
    }

    judgments_path = output_dir / "judgments.jsonl"
    with judgments_path.open("w", encoding="utf-8") as handle:
        for row in judgments:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    summary_path = output_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({**summary, "artifacts": {
        "judgments": str(judgments_path),
        "summary": str(summary_path),
    }}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
