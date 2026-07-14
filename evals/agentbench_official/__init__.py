"""AILIS adapters for the official AgentBench v0.2 environments."""

__all__ = ["AILISAgentClient"]


def __getattr__(name):
    if name != "AILISAgentClient":
        raise AttributeError(name)
    from .ailis_agent_client import AILISAgentClient
    return AILISAgentClient
