import unittest

from evals.agentbench_fc.records import budget_violations, is_infrastructure_error, record_quality


class AgentBenchFcRecordTests(unittest.TestCase):
    def test_infrastructure_errors_do_not_become_zero_reward_answers(self):
        records = [
            {"index": 1, "status": "completed", "reward": 1, "agent_calls": []},
            {
                "index": 2,
                "status": "infrastructure_error",
                "reward": None,
                "error": {"kind": "bridge_transport"},
                "agent_calls": [],
            },
        ]
        self.assertTrue(is_infrastructure_error(records[1]))
        quality = record_quality(records)
        self.assertEqual(quality["infrastructure_errors"], 1)
        self.assertEqual(quality["valid_environment_records"], 1)
        self.assertEqual(quality["success_rate"], 1)

    def test_call_and_token_budgets_use_durable_call_metrics(self):
        records = [{
            "duration_ms": 500,
            "agent_calls": [{"usage": {"total_tokens": 100}}, {"usage": {"total_tokens": 200}}],
        }]
        self.assertEqual(
            budget_violations(records, max_calls=1, max_tokens=250, max_duration_ms=400),
            ["call_budget_exceeded", "token_budget_exceeded", "duration_budget_exceeded"],
        )


if __name__ == "__main__":
    unittest.main()
