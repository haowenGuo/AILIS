import asyncio
import contextlib
import signal
import sys

from acp import run_agent

from .agent import AilisAgent
from .runtime import prepare_runtime


async def main():
    agent = AilisAgent()
    loop = asyncio.get_running_loop()
    task = asyncio.current_task()
    for signum in (signal.SIGTERM, signal.SIGINT):
        with contextlib.suppress(NotImplementedError):
            loop.add_signal_handler(signum, task.cancel)
    try:
        await run_agent(agent)
    except asyncio.CancelledError:
        pass
    finally:
        await agent.shutdown()


def cli():
    if sys.argv[1:] == ["--prepare"]:
        print(prepare_runtime())
    elif sys.argv[1:]:
        raise SystemExit("Usage: python -m ailis_harbor_acp [--prepare]")
    else:
        asyncio.run(main())


if __name__ == "__main__":
    cli()
