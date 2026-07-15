import argparse
import unittest
from unittest.mock import patch

from evals.agentbench_fc import run_fc


class AgentBenchFcRunnerTests(unittest.TestCase):
    def test_runner_preserves_native_fc_protocol_across_turns(self):
        args = argparse.Namespace(
            task="dbbench-std",
            controller="http://controller/api",
            bridge="http://bridge/v1",
            timeout_seconds=30,
            max_environment_turns=20,
            temperature=0.8,
        )
        calls = []

        def request_json(method, url, payload=None, headers=None, timeout_seconds=0, failure_kind="controller_transport"):
            calls.append((method, url, payload, headers))
            if url.endswith("/start_sample"):
                return {
                    "messages": [{"role": "user", "content": "Inspect the DB"}],
                    "tools": [{"type": "function", "function": {"name": "execute_sql"}}],
                }, {"session_id": "session-1"}
            if url.endswith("/interact"):
                return {"messages": [], "finish": True, "reward": 1}, {}
            if url.endswith("/cancel"):
                return {}, {}
            raise AssertionError(url)

        assistant = {
            "role": "assistant",
            "content": None,
            "tool_calls": [{
                "id": "call-1",
                "type": "function",
                "function": {"name": "execute_sql", "arguments": "{\"query\":\"SHOW TABLES\"}"},
            }],
        }
        metric = {"duration_ms": 1, "usage": {"total_tokens": 10}, "tool_call_count": 1}
        with patch.object(run_fc, "request_json", side_effect=request_json), patch.object(
            run_fc, "call_bridge", return_value=(assistant, metric)
        ):
            record = run_fc.run_sample(args, 7)

        self.assertEqual(record["status"], "completed")
        self.assertEqual(record["reward"], 1)
        interact = next(call for call in calls if call[1].endswith("/interact"))
        self.assertEqual(interact[2], {"messages": [assistant]})
        self.assertEqual(interact[3], {"session_id": "session-1"})

    def test_runner_classifies_missing_tools_as_environment_failure(self):
        args = argparse.Namespace(
            task="dbbench-std",
            controller="http://controller/api",
            bridge="http://bridge/v1",
            timeout_seconds=30,
            max_environment_turns=20,
            temperature=0.8,
        )
        with patch.object(run_fc, "request_json", return_value=(
            {"messages": [{"role": "user", "content": "x"}], "tools": []},
            {"session_id": "session-1"},
        )):
            record = run_fc.run_sample(args, 1)
        self.assertEqual(record["status"], "infrastructure_error")
        self.assertEqual(record["error"]["kind"], "environment_unavailable")


if __name__ == "__main__":
    unittest.main()
