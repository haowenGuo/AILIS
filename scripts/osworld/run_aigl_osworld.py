import argparse
import datetime
import json
import logging
import os
import signal
import sys
from pathlib import Path
from typing import Dict, List

import requests
from tqdm import tqdm

import lib_run_single
from aigl_osworld_agent import AIGLOsWorldAgent
from desktop_env.desktop_env import DesktopEnv


class TaskTimeoutError(TimeoutError):
    pass


def install_hf_mirror_redirect():
    mirror = os.environ.get("AIGL_OSWORLD_HF_MIRROR", "https://hf-mirror.com").rstrip("/")
    original_request = requests.sessions.Session.request

    def request_with_hf_mirror(self, method, url, *args, **kwargs):
        if isinstance(url, str) and url.startswith("https://huggingface.co/"):
            url = url.replace("https://huggingface.co", mirror, 1)
        return original_request(self, method, url, *args, **kwargs)

    requests.sessions.Session.request = request_with_hf_mirror


def configure_logger() -> logging.Logger:
    os.makedirs("logs", exist_ok=True)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    stamp = datetime.datetime.now().strftime("%Y%m%d@%H%M%S")
    formatter = logging.Formatter(
        fmt="[%(asctime)s %(levelname)s %(module)s/%(lineno)d] %(message)s"
    )

    for name, level in [(f"logs/aigl-osworld-{stamp}.log", logging.INFO), (f"logs/aigl-osworld-debug-{stamp}.log", logging.DEBUG)]:
        handler = logging.FileHandler(name, encoding="utf-8")
        handler.setLevel(level)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.INFO)
    stdout_handler.setFormatter(formatter)
    logger.addHandler(stdout_handler)
    return logging.getLogger("desktopenv.experiment")


logger = configure_logger()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run OSWorld with the AIGL OSWorld agent wrapper")
    parser.add_argument("--provider_name", default="docker")
    parser.add_argument("--path_to_vm", default=None)
    parser.add_argument("--headless", action="store_true")
    parser.add_argument("--action_space", default="pyautogui")
    parser.add_argument(
        "--observation_type",
        choices=["screenshot", "a11y_tree", "screenshot_a11y_tree", "som"],
        default="a11y_tree",
    )
    parser.add_argument("--screen_width", type=int, default=1920)
    parser.add_argument("--screen_height", type=int, default=1080)
    parser.add_argument("--sleep_after_execution", type=float, default=0.2)
    parser.add_argument("--max_steps", type=int, default=15)
    parser.add_argument("--max_trajectory_length", type=int, default=4)
    parser.add_argument("--test_config_base_dir", default="evaluation_examples")
    parser.add_argument("--test_all_meta_path", default="evaluation_examples/test_small.json")
    parser.add_argument("--domain", default="all")
    parser.add_argument("--result_dir", default="/mnt/f/AIGril/eval-results/engineering/osworld-aigl-test-small")
    parser.add_argument("--model", default="aigl-osworld")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--start_index", type=int, default=0)
    parser.add_argument("--task_timeout_seconds", type=int, default=600)
    parser.add_argument("--validate_only", action="store_true")
    parser.add_argument("--include_screenshot", action="store_true")
    parser.add_argument(
        "--vm_secret_mount",
        action="append",
        default=None,
        help="Passed through to OSWorld DesktopEnv as local_path:guest_path.",
    )
    return parser.parse_args()


def make_env(args: argparse.Namespace, agent: AIGLOsWorldAgent) -> DesktopEnv:
    return DesktopEnv(
        provider_name=args.provider_name,
        path_to_vm=args.path_to_vm,
        action_space=agent.action_space,
        screen_size=(args.screen_width, args.screen_height),
        headless=args.headless,
        os_type="Ubuntu",
        require_a11y_tree=args.observation_type in ["a11y_tree", "screenshot_a11y_tree", "som"],
        vm_secret_mounts=args.vm_secret_mount,
    )


def mark_zero_result(example: Dict[str, object], example_result_dir: Path, reason: str):
    example_result_dir.mkdir(parents=True, exist_ok=True)
    with open(example_result_dir / "traj.jsonl", "a", encoding="utf-8") as handle:
        handle.write(json.dumps({"Error": reason}, ensure_ascii=False) + "\n")
    (example_result_dir / "result.txt").write_text("0.0\n", encoding="utf-8")


def run_with_task_timeout(callback, timeout_seconds: int):
    if timeout_seconds <= 0:
        return callback()

    def _handle_timeout(_signum, _frame):
        raise TaskTimeoutError(f"OSWorld task exceeded wall-clock timeout ({timeout_seconds}s)")

    previous_handler = signal.signal(signal.SIGALRM, _handle_timeout)
    signal.alarm(timeout_seconds)
    try:
        return callback()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, previous_handler)


def flatten_meta(meta: Dict[str, List[str]]) -> List[tuple[str, str]]:
    items: List[tuple[str, str]] = []
    for domain, example_ids in meta.items():
        for example_id in example_ids:
            items.append((domain, example_id))
    return items


def build_meta_from_flat(items: List[tuple[str, str]]) -> Dict[str, List[str]]:
    meta: Dict[str, List[str]] = {}
    for domain, example_id in items:
        meta.setdefault(domain, []).append(example_id)
    return meta


def filter_meta(args: argparse.Namespace, meta: Dict[str, List[str]]) -> Dict[str, List[str]]:
    if args.domain != "all":
        meta = {args.domain: meta.get(args.domain, [])}
    flat = flatten_meta(meta)
    if args.start_index:
        flat = flat[args.start_index:]
    if args.limit:
        flat = flat[:args.limit]
    return build_meta_from_flat(flat)


def get_unfinished(args: argparse.Namespace, meta: Dict[str, List[str]]) -> Dict[str, List[str]]:
    target_dir = Path(args.result_dir) / args.action_space / args.observation_type / args.model
    if not target_dir.exists():
        return meta
    filtered: Dict[str, List[str]] = {}
    for domain, example_ids in meta.items():
        for example_id in example_ids:
            result_path = target_dir / domain / example_id / "result.txt"
            if not result_path.exists():
                filtered.setdefault(domain, []).append(example_id)
    return filtered


def summarize_results(args: argparse.Namespace) -> Dict[str, object]:
    target_dir = Path(args.result_dir) / args.action_space / args.observation_type / args.model
    scores: List[float] = []
    examples: List[Dict[str, object]] = []
    if target_dir.exists():
        for result_path in target_dir.glob("*/*/result.txt"):
            try:
                score = float(result_path.read_text(encoding="utf-8").strip())
            except Exception:
                score = 0.0
            domain = result_path.parent.parent.name
            example_id = result_path.parent.name
            scores.append(score)
            examples.append({"domain": domain, "example_id": example_id, "score": score})

    summary = {
        "result_dir": str(target_dir),
        "completed": len(scores),
        "average_score": sum(scores) / len(scores) if scores else 0.0,
        "examples": sorted(examples, key=lambda item: (item["domain"], item["example_id"])),
    }
    summary_path = Path(args.result_dir) / "aigl-osworld-summary.json"
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    return summary


def save_args(args: argparse.Namespace):
    path_to_args = Path(args.result_dir) / args.action_space / args.observation_type / args.model / "args.json"
    path_to_args.parent.mkdir(parents=True, exist_ok=True)
    path_to_args.write_text(json.dumps(vars(args), indent=2, ensure_ascii=False), encoding="utf-8")


def main() -> int:
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    install_hf_mirror_redirect()
    args = parse_args()
    save_args(args)

    with open(args.test_all_meta_path, "r", encoding="utf-8") as handle:
        meta = json.load(handle)
    selected_meta = filter_meta(args, meta)
    unfinished_meta = get_unfinished(args, selected_meta)
    selected_count = len(flatten_meta(selected_meta))
    unfinished_count = len(flatten_meta(unfinished_meta))
    logger.info("Selected OSWorld tasks: %s; unfinished: %s", selected_count, unfinished_count)

    if args.validate_only:
        summary = summarize_results(args)
        logger.info("Validate-only OK. Existing completed=%s average=%.3f", summary["completed"], summary["average_score"])
        return 0

    agent = AIGLOsWorldAgent(
        model=args.model,
        action_space=args.action_space,
        observation_type=args.observation_type,
        max_trajectory_length=args.max_trajectory_length,
        screen_size=(args.screen_width, args.screen_height),
        include_screenshot=args.include_screenshot or args.observation_type in {"screenshot", "screenshot_a11y_tree", "som"},
    )

    env = make_env(args, agent)

    scores: List[float] = []
    try:
        for domain in tqdm(unfinished_meta, desc="Domain"):
            for example_id in tqdm(unfinished_meta[domain], desc="Example", leave=False):
                config_file = Path(args.test_config_base_dir) / "examples" / domain / f"{example_id}.json"
                with open(config_file, "r", encoding="utf-8") as handle:
                    example = json.load(handle)
                instruction = example["instruction"]
                logger.info("[Domain]: %s", domain)
                logger.info("[Example ID]: %s", example_id)
                logger.info("[Instruction]: %s", instruction)
                example_result_dir = Path(args.result_dir) / args.action_space / args.observation_type / args.model / domain / example_id
                example_result_dir.mkdir(parents=True, exist_ok=True)
                try:
                    run_with_task_timeout(
                        lambda: lib_run_single.run_single_example(
                            agent,
                            env,
                            example,
                            args.max_steps,
                            instruction,
                            args,
                            str(example_result_dir),
                            scores,
                        ),
                        args.task_timeout_seconds,
                    )
                except Exception as error:
                    logger.exception("Exception in %s/%s: %s", domain, example_id, error)
                    mark_zero_result(example, example_result_dir, str(error))
                    try:
                        env.close()
                    except Exception:
                        pass
                    env = make_env(args, agent)
    finally:
        env.close()

    summary = summarize_results(args)
    logger.info("AIGL OSWorld completed=%s average=%.3f", summary["completed"], summary["average_score"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
