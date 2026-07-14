import importlib
import sys
import types
import unittest
from unittest.mock import patch


class AgentBenchClientTests(unittest.TestCase):
    def test_http_failure_preserves_bridge_usage(self):
        module_names = [
            "src",
            "src.client",
            "src.client.agent",
            "src.typings",
            "evals.agentbench_official.ailis_agent_client",
        ]
        previous = {name: sys.modules.get(name) for name in module_names}
        src = types.ModuleType("src")
        client_package = types.ModuleType("src.client")
        client_package.__path__ = []
        agent_module = types.ModuleType("src.client.agent")
        typings_module = types.ModuleType("src.typings")

        class AgentClient:
            pass

        class AgentContextLimitException(Exception):
            pass

        agent_module.AgentClient = AgentClient
        typings_module.AgentContextLimitException = AgentContextLimitException
        sys.modules["src"] = src
        sys.modules["src.client"] = client_package
        sys.modules["src.client.agent"] = agent_module
        sys.modules["src.typings"] = typings_module
        sys.modules.pop("evals.agentbench_official.ailis_agent_client", None)
        try:
            module = importlib.import_module(
                "evals.agentbench_official.ailis_agent_client"
            )

            class FailedResponse:
                status_code = 503
                text = "provider unavailable"

                @staticmethod
                def json():
                    return {
                        "error": "provider unavailable",
                        "metrics": {
                            "ok": False,
                            "status": "transient_network_error",
                            "usage": {"total_tokens": 125},
                        },
                    }

                @staticmethod
                def raise_for_status():
                    raise RuntimeError("503")

            client = module.AILISAgentClient(session_id="budget-test")
            with patch.object(module.requests, "post", return_value=FailedResponse()):
                with self.assertRaises(RuntimeError):
                    client.inference([{"role": "user", "content": "question"}])
            self.assertEqual(len(client.call_stats), 1)
            self.assertFalse(client.call_stats[0]["bridge"]["ok"])
            self.assertEqual(
                client.call_stats[0]["bridge"]["usage"]["total_tokens"], 125
            )
        finally:
            for name, value in previous.items():
                if value is None:
                    sys.modules.pop(name, None)
                else:
                    sys.modules[name] = value


if __name__ == "__main__":
    unittest.main()
