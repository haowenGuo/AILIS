from __future__ import annotations

import csv
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "docs" / "assets" / "benchmarks"
LEADERBOARD_PATH = ASSET_DIR / "agentbench-fc-leaderboard-20251118.csv"

AILIS = {
    "model": "AILIS + DeepSeek V4 Flash",
    "db": 209 / 300 * 100,
    "os": 66 / 144 * 100,
}
AILIS["db_os"] = (AILIS["db"] + AILIS["os"]) / 2

COLORS = {
    "ink": "#172033",
    "muted": "#6B7280",
    "paper": "#F6F2E8",
    "panel": "#FFFDF7",
    "grid": "#D7D2C7",
    "teal": "#147D73",
    "orange": "#E66A2C",
    "blue": "#315B7D",
    "soft": "#C5CBD3",
    "green": "#3E8E67",
}


def load_leaderboard() -> list[dict[str, float | str]]:
    rows = list(csv.reader(LEADERBOARD_PATH.open(encoding="utf-8-sig")))[3:]
    models: list[dict[str, float | str]] = []
    for row in rows:
        if len(row) < 15 or not row[0].strip():
            continue
        db = float(row[6])
        os_score = float(row[10])
        models.append(
            {
                "model": row[0],
                "db": db,
                "os": os_score,
                "db_os": (db + os_score) / 2,
                "avg": float(row[14]),
            }
        )
    return models


def text(x: float, y: float, value: str, size: int = 24, **attrs: str) -> str:
    attributes = {
        "x": str(x),
        "y": str(y),
        "font-size": str(size),
        "fill": COLORS["ink"],
    }
    attributes.update(attrs)
    rendered = " ".join(f'{key}="{escape(value)}"' for key, value in attributes.items())
    return f"<text {rendered}>{escape(value)}</text>"


def rect(x: float, y: float, width: float, height: float, fill: str, radius: int = 0) -> str:
    return (
        f'<rect x="{x}" y="{y}" width="{width}" height="{height}" '
        f'fill="{fill}" rx="{radius}" />'
    )


def svg_document(width: int, height: int, body: list[str]) -> str:
    return "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
            "<style>text { font-family: 'Trebuchet MS', 'Microsoft YaHei', sans-serif; } .mono { font-family: Consolas, monospace; }</style>",
            rect(0, 0, width, height, COLORS["paper"]),
            *body,
            "</svg>",
        ]
    )


def write_progress_chart() -> None:
    width, height = 1200, 640
    body = [
        text(70, 78, "AgentBench FC full run", 42, **{"font-weight": "700"}),
        text(70, 116, "Stage status · 2026-07-16 · official pass@1 protocol", 20, fill=COLORS["muted"]),
        rect(70, 155, 1060, 122, COLORS["panel"], 18),
        text(100, 216, "49.17%", 54, fill=COLORS["orange"], **{"font-weight": "700"}),
        text(320, 199, "444 / 903 durable sample records", 27, **{"font-weight": "700"}),
        text(320, 238, "DB and OS complete · KG environment preparing · 459 samples remain", 19, fill=COLORS["muted"]),
    ]
    bar_x, bar_y, bar_w, bar_h = 70, 315, 1060, 38
    db_w = bar_w * 300 / 903
    os_w = bar_w * 144 / 903
    body.extend(
        [
            rect(bar_x, bar_y, bar_w, bar_h, COLORS["soft"], 12),
            rect(bar_x, bar_y, db_w, bar_h, COLORS["teal"], 12),
            rect(bar_x + db_w, bar_y, os_w, bar_h, COLORS["orange"]),
            text(bar_x, bar_y + 72, "DB 300", 18, fill=COLORS["teal"], **{"font-weight": "700"}),
            text(bar_x + 160, bar_y + 72, "OS 144", 18, fill=COLORS["orange"], **{"font-weight": "700"}),
            text(bar_x + 315, bar_y + 72, "KG 150 · ALFWorld 109 · WebShop 200 pending", 18, fill=COLORS["muted"]),
        ]
    )
    environments = [
        ("DB", 300, 300, "69.67%", COLORS["teal"]),
        ("OS", 144, 144, "45.83%", COLORS["orange"]),
        ("KG", 0, 150, "pending", COLORS["soft"]),
        ("ALFWorld", 0, 109, "pending", COLORS["soft"]),
        ("WebShop", 0, 200, "pending", COLORS["soft"]),
    ]
    for index, (name, done, total, score, color) in enumerate(environments):
        y = 445 + index * 34
        body.append(text(70, y, name, 18, **{"font-weight": "700"}))
        body.append(rect(210, y - 18, 660, 16, COLORS["grid"], 8))
        if done:
            body.append(rect(210, y - 18, 660 * done / total, 16, color, 8))
        body.append(text(900, y, f"{done}/{total}", 17, fill=COLORS["muted"]))
        body.append(text(1040, y, score, 17, fill=color, **{"font-weight": "700"}))
    (ASSET_DIR / "agentbench-fc-stage-progress.svg").write_text(
        svg_document(width, height, body), encoding="utf-8"
    )


def shorten(name: str) -> str:
    replacements = {
        "AgentRL w/ Qwen2.5-32B-Instruct": "AgentRL + Qwen2.5-32B",
        "AgentRL w/ Qwen2.5-14B-Instruct": "AgentRL + Qwen2.5-14B",
        "Claude Sonnet 3.7 Thinking (2025-02-19)": "Sonnet 3.7 Thinking",
        "Claude Sonnet 4 Thinking (2025-05-14)": "Sonnet 4 Thinking",
        "Claude Sonnet 4 (2025-05-14)": "Sonnet 4",
        "Claude Sonnet 4.5 Thinking (2025-09-29)": "Sonnet 4.5 Thinking",
        "Claude Sonnet 4.5 (2025-09-29)": "Sonnet 4.5",
        "DeepSeek-R1 (2025-05-28)": "DeepSeek-R1",
        "DeepSeek-V3 (2025-03-24)": "DeepSeek-V3",
        "o4-mini (2025-04-16)": "o4-mini",
    }
    return replacements.get(name, name.replace(" (2025-", " ("))


def write_slice_ranking_chart(models: list[dict[str, float | str]]) -> None:
    entries = [*models, AILIS]
    entries.sort(key=lambda item: float(item["db_os"]), reverse=True)
    top = entries[:10]
    width, height = 1200, 760
    body = [
        text(70, 76, "DB + OS comparable slice", 42, **{"font-weight": "700"}),
        text(70, 113, "Mean pass@1 across the two completed environments · not the official five-environment AVG", 19, fill=COLORS["muted"]),
        rect(70, 142, 1060, 54, "#FFF1E7", 12),
        text(92, 177, "AILIS provisional slice position: #5 / 26", 23, fill=COLORS["orange"], **{"font-weight": "700"}),
    ]
    chart_x, chart_y, chart_w = 390, 230, 700
    max_value = 65.0
    for index, item in enumerate(top, 1):
        y = chart_y + (index - 1) * 48
        is_ailis = item["model"] == AILIS["model"]
        color = COLORS["orange"] if is_ailis else COLORS["blue"]
        body.append(text(80, y + 18, str(index), 17, fill=COLORS["muted"], **{"text-anchor": "end"}))
        body.append(text(100, y + 18, shorten(str(item["model"])), 18, **{"font-weight": "700" if is_ailis else "400"}))
        body.append(rect(chart_x, y, chart_w, 24, COLORS["grid"], 8))
        body.append(rect(chart_x, y, chart_w * float(item["db_os"]) / max_value, 24, color, 8))
        body.append(text(1110, y + 19, f'{float(item["db_os"]):.2f}%', 18, fill=color, **{"text-anchor": "end", "font-weight": "700"}))
    body.extend(
        [
            text(70, 724, "Source: official AgentBench FC leaderboard snapshot (updated 2025-11-18). AILIS is a single in-progress run without repeated-run error bars.", 16, fill=COLORS["muted"]),
        ]
    )
    (ASSET_DIR / "agentbench-fc-db-os-slice-ranking.svg").write_text(
        svg_document(width, height, body), encoding="utf-8"
    )


def write_environment_rank_chart(models: list[dict[str, float | str]]) -> None:
    width, height = 1200, 720
    body = [
        text(70, 76, "Environment-level leaderboard position", 42, **{"font-weight": "700"}),
        text(70, 114, "AILIS inserted into the official leaderboard snapshot for each completed environment", 19, fill=COLORS["muted"]),
    ]
    panels = [("DB", "db", 69.67, 6, 70), ("OS", "os", 45.83, 7, 630)]
    for label, metric, score, rank, panel_x in panels:
        body.append(rect(panel_x, 150, 500, 500, COLORS["panel"], 18))
        body.append(text(panel_x + 28, 198, f"{label} · #{rank} / 26", 28, **{"font-weight": "700"}))
        body.append(text(panel_x + 28, 232, f"AILIS {score:.2f}%", 22, fill=COLORS["orange"], **{"font-weight": "700"}))
        entries = [*models, AILIS]
        entries.sort(key=lambda item: float(item[metric]), reverse=True)
        around = entries[:8]
        max_value = max(float(item[metric]) for item in around) + 3
        for index, item in enumerate(around, 1):
            y = 270 + (index - 1) * 44
            is_ailis = item["model"] == AILIS["model"]
            color = COLORS["orange"] if is_ailis else COLORS["teal"]
            body.append(text(panel_x + 28, y + 17, f"{index}. {shorten(str(item['model']))}", 15, **{"font-weight": "700" if is_ailis else "400"}))
            body.append(rect(panel_x + 265, y, 180, 20, COLORS["grid"], 7))
            body.append(rect(panel_x + 265, y, 180 * float(item[metric]) / max_value, 20, color, 7))
            body.append(text(panel_x + 470, y + 16, f'{float(item[metric]):.1f}', 15, fill=color, **{"text-anchor": "end", "font-weight": "700"}))
    body.append(text(70, 690, "Per-environment positions are valid comparisons; the overall AgentBench FC rank remains unavailable until KG, ALFWorld and WebShop finish.", 16, fill=COLORS["muted"]))
    (ASSET_DIR / "agentbench-fc-environment-ranks.svg").write_text(
        svg_document(width, height, body), encoding="utf-8"
    )


def main() -> None:
    models = load_leaderboard()
    if len(models) != 25:
        raise RuntimeError(f"Expected 25 official leaderboard rows, found {len(models)}")
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    write_progress_chart()
    write_slice_ranking_chart(models)
    write_environment_rank_chart(models)
    print(
        "generated=3 "
        f"db_rank={1 + sum(float(item['db']) > AILIS['db'] for item in models)}/26 "
        f"os_rank={1 + sum(float(item['os']) > AILIS['os'] for item in models)}/26 "
        f"slice_rank={1 + sum(float(item['db_os']) > AILIS['db_os'] for item in models)}/26"
    )


if __name__ == "__main__":
    main()
