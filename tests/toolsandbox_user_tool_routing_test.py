import datetime
import sys
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from pathlib import Path
from unittest import TestCase, main
from unittest.mock import patch

from tool_sandbox.common.execution_context import RoleType

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.toolsandbox.run_ailis_toolsandbox import (
    CodexToolSandboxUser,
    benchmark_runtime_environment_override,
    exclude_rapid_api_scenarios,
    install_benchmark_clock,
    load_latest_progress,
    load_or_create_benchmark_clock,
    restore_benchmark_clock,
    retry_batch_metrics,
    retry_error_scenario_names,
    retry_failure_scenario_names,
)


class FakeClient:
    def infer(self, *, messages, tools):
        return {
            "provider": "codex-model-bridge",
            "model": "gpt-5.5",
            "usage": {},
            "toolCalls": [
                {
                    "id": "user_call",
                    "name": "end_conversation",
                    "arguments": {},
                }
            ],
        }


class CodexToolSandboxUserRoutingTest(TestCase):
    def test_user_tool_name_bypasses_agent_scrambling_map(self):
        user = object.__new__(CodexToolSandboxUser)
        user.client = FakeClient()
        user.calls = []
        user.get_messages = lambda ending_index=None: [
            SimpleNamespace(sender=RoleType.AGENT)
        ]
        user.messages_validation = lambda messages: None
        user.filter_messages = lambda messages: messages
        user.get_available_tools = lambda: {"end_conversation": object()}
        captured = []
        user.add_messages = captured.extend

        with (
            patch(
                "scripts.toolsandbox.run_ailis_toolsandbox.convert_to_openai_tool",
                return_value={"type": "function"},
            ),
            patch(
                "scripts.toolsandbox.run_ailis_toolsandbox.OpenAIAPIUser.to_openai_messages",
                return_value=[],
            ),
        ):
            user.respond()

        self.assertEqual(len(captured), 1)
        self.assertEqual(captured[0].openai_function_name, "end_conversation")
        self.assertIn(
            "user_call_response = end_conversation(**user_call_parameters)",
            captured[0].content,
        )

    def test_latest_progress_keeps_only_the_latest_error_for_retry_selection(self):
        with TemporaryDirectory() as temp_dir:
            progress_path = Path(temp_dir) / "progress.jsonl"
            progress_path.write_text(
                "\n".join(
                    [
                        '{"scenario":"fixed","status":"error"}',
                        '{"scenario":"fixed","status":"completed","similarity":1}',
                        '{"scenario":"retry","status":"error"}',
                    ]
                )
                + "\n",
                encoding="utf-8",
            )

            latest = load_latest_progress(progress_path)
            retry_error_names = retry_error_scenario_names(
                ["fixed", "retry"], latest
            )

        self.assertEqual(retry_error_names, {"retry"})

    def test_failure_retry_selection_and_batch_metrics_use_only_new_attempts(self):
        selected = ["positive", "zero", "error", "blocked"]
        latest = {
            "positive": {"status": "completed", "similarity": 0.5, "attempt": 1},
            "zero": {"status": "completed", "similarity": 0, "attempt": 1},
            "error": {"status": "error", "attempt": 2},
            "blocked": {"status": "blocked_environment", "attempt": 1},
        }
        self.assertEqual(
            retry_failure_scenario_names(selected, latest),
            {"zero", "error"},
        )

        manifest = {
            "batchId": "remediation-1",
            "manifestPath": "retry-batches/remediation-1.manifest.json",
            "scenarios": ["zero", "error"],
            "baseline": {
                "zero": {"status": "completed", "similarity": 0, "attempt": 1},
                "error": {"status": "error", "similarity": None, "attempt": 2},
            },
        }
        latest["zero"] = {
            "status": "completed",
            "similarity": 0.75,
            "attempt": 2,
            "durationMs": 100,
            "ailisMetrics": {"calls": 2, "totalTokens": 10},
            "userSimulatorMetrics": {
                "calls": [{"id": "user-1"}],
                "totalTokens": 5,
            },
        }
        metrics = retry_batch_metrics(manifest, latest)
        self.assertEqual(metrics["target"], 2)
        self.assertEqual(metrics["processed"], 1)
        self.assertEqual(metrics["scored"], 1)
        self.assertEqual(metrics["improved"], 1)
        self.assertEqual(metrics["recoveredErrors"], 0)
        self.assertEqual(metrics["averageSimilarity"], 0.75)
        self.assertEqual(metrics["totalCalls"], 3)
        self.assertEqual(metrics["totalTokens"], 15)

    def test_benchmark_clock_is_persisted_and_controls_official_time_tools(self):
        anchor_text = "2026-07-17T06:06:27+08:00"
        with TemporaryDirectory() as temp_dir:
            clock_path = Path(temp_dir) / "benchmark-clock.json"
            clock = load_or_create_benchmark_clock(clock_path, anchor_text)
            reloaded = load_or_create_benchmark_clock(
                clock_path, "2026-08-01T12:00:00+08:00"
            )

        self.assertEqual(clock, reloaded)
        override = benchmark_runtime_environment_override(clock)
        self.assertEqual(override["current_date"], "2026-07-17")
        self.assertEqual(override["current_time"], "06:06:27")
        self.assertEqual(override["utc_offset"], "+08:00")

        anchor = datetime.datetime.fromisoformat(anchor_text)
        patched = install_benchmark_clock(anchor)
        try:
            from tool_sandbox.common.utils import get_tomorrow_datetime
            from tool_sandbox.tools.utilities import get_current_timestamp

            self.assertEqual(get_current_timestamp(), anchor.timestamp())
            self.assertEqual(
                get_tomorrow_datetime(),
                datetime.datetime(2026, 7, 18, 6, 6, 27),
            )
        finally:
            restore_benchmark_clock(patched)

    def test_rapid_api_scenarios_are_excluded_before_completion_accounting(self):
        scenarios = {
            "offline": SimpleNamespace(
                starting_context=SimpleNamespace(tool_allow_list=["add_reminder"])
            ),
            "paid": SimpleNamespace(
                starting_context=SimpleNamespace(tool_allow_list=["search_weather_around_lat_lon"])
            ),
            "paid_3_distraction_tools": SimpleNamespace(
                starting_context=SimpleNamespace(tool_allow_list=[])
            ),
        }

        self.assertEqual(
            exclude_rapid_api_scenarios(list(scenarios), scenarios),
            ["offline"],
        )


if __name__ == "__main__":
    main()
