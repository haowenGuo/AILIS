import sys
import types
import unittest

import evals.agentbench_official as agentbench_official
from evals.agentbench_official.records import (
    budget_violations,
    deduplicate_records,
    is_infrastructure_error,
    record_quality,
)


class AgentBenchRecordTests(unittest.TestCase):
    def test_lazy_agent_client_export_returns_the_class(self):
        module_name = "evals.agentbench_official.ailis_agent_client"
        previous = sys.modules.get(module_name)
        fake = types.ModuleType(module_name)
        fake.AILISAgentClient = object
        sys.modules[module_name] = fake
        try:
            self.assertIs(
                agentbench_official.__getattr__("AILISAgentClient"),
                object,
            )
        finally:
            if previous is None:
                sys.modules.pop(module_name, None)
            else:
                sys.modules[module_name] = previous

    def test_bridge_failure_is_infrastructure_error(self):
        record = {
            "index": 24,
            "error": None,
            "agent_calls": [
                {"bridge": {"ok": False, "status": "transient_network_error", "usage": {}}}
            ],
        }
        self.assertTrue(is_infrastructure_error(record))

    def test_model_protocol_failure_is_not_infrastructure_error(self):
        record = {
            "index": 1,
            "error": None,
            "task_output": {"status": "agent validation failed"},
            "agent_calls": [
                {"bridge": {"ok": True, "status": "completed", "usage": {"total_tokens": 10}}}
            ],
        }
        self.assertFalse(is_infrastructure_error(record))

    def test_latest_record_replaces_failed_attempt(self):
        failed = {
            "index": 3,
            "error": "AGENT_FAILED",
            "task_output": {"status": "running"},
            "agent_calls": [],
        }
        recovered = {
            "index": 3,
            "error": None,
            "task_output": {"status": "completed"},
            "agent_calls": [],
        }
        records = deduplicate_records([failed, recovered])
        self.assertEqual(records["3"], recovered)

    def test_quality_excludes_infrastructure_failures(self):
        records = [
            {
                "index": 0,
                "error": None,
                "task_output": {"status": "completed"},
                "agent_calls": [],
            },
            {
                "index": 1,
                "error": "NETWORK_ERROR",
                "task_output": {"status": "running"},
                "agent_calls": [],
            },
        ]
        quality = record_quality(records)
        self.assertEqual(quality["infrastructure_errors"], 1)
        self.assertEqual(quality["completed_environment_records"], 1)
        self.assertEqual(quality["infrastructure_valid_rate"], 0.5)

    def test_runtime_budget_detects_cost_overrun(self):
        records = [
            {
                "index": 0,
                "duration_ms": 60_001,
                "agent_calls": [
                    {"bridge": {"usage": {"total_tokens": 101}}},
                    {"bridge": {"usage": {"total_tokens": 100}}},
                ],
            }
        ]
        self.assertEqual(
            budget_violations(
                records, max_calls=1, max_tokens=200, max_duration_ms=60_000
            ),
            ["call_budget_exceeded", "token_budget_exceeded", "duration_budget_exceeded"],
        )


if __name__ == "__main__":
    unittest.main()
