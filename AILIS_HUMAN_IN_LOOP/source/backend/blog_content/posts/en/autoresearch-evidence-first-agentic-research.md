# AutoResearch: Turning Agentic Research into a Traceable Pipeline

AutoResearch is an agentic research system for complex technical work. Its goal is not merely to search and summarize, but to turn research into an inspectable engineering pipeline.

This post is based on the local `F:\AutoResearch` project README, MVP architecture notes, and Phase 1 module checklist. It is a first project-level introduction: why the system exists, how it is structured, and how it moves from a research topic to an evidence-backed Markdown report.

## The problem it is trying to solve

Many research agents are basically search plus summarization.

That can work for short questions, but longer tasks expose several problems:

- search direction drifts
- claims and evidence are loosely connected
- intermediate steps are hard to inspect
- reports may look complete while citations remain weak
- each run behaves like a one-off prompt instead of a reusable workflow

AutoResearch takes a more engineering-oriented position. It treats research as a task pipeline rather than a single model response. The input is a topic; the output is a structured report with sources, evidence, and traceable intermediate artifacts.

## The Phase 1 boundary

AutoResearch does not begin by trying to automate all of science.

Its Phase 1 focuses on one main path:

```text
research topic
  -> question decomposition
  -> web and paper retrieval
  -> evidence extraction and citation storage
  -> outline generation
  -> section drafting
  -> critic review
  -> final Markdown report
```

That boundary matters.

Phase 1 intentionally avoids automatic experiment execution, automatic code modification, leaderboard submission, and complex multi-agent tree search. The immediate goal is to build a credible Research Core first.

I like this tradeoff because research systems need grounding before they need spectacle. If the evidence layer is weak, adding more agents only amplifies instability.

## The architectural split

The README and architecture notes show a clear layered structure:

- `apps/api`
- `apps/web`
- `services/worker`
- `packages/agent-core`
- `packages/connectors`
- `packages/memory`
- `packages/paper-rag`
- `packages/report-engine`
- `packages/shared-schemas`

The API creates tasks, returns status, streams progress, and exposes reports. The web app lets users submit topics, inspect the timeline, review sources, and read the generated report. The worker runs long research jobs asynchronously instead of forcing the whole process into a single request.

The package layer is where the design becomes interesting.

`agent-core` orchestrates the main path with roles such as Planner, WebScout, ScholarScout, Synthesis, and Critic. `connectors` handle search and content fetching. `memory` normalizes and deduplicates sources while preserving task artifacts. `paper-rag` builds evidence cards and citations. `report-engine` assembles outlines, section drafts, and final Markdown reports.

The core value of this split is that every stage has an explicit artifact. The system is not just one large prompt with hidden intermediate reasoning.

## Evidence before style

One principle in the AutoResearch documents is especially important: evidence comes before prose style.

The system first needs to ensure that:

- sources are traceable
- claims are grounded in evidence
- reports carry citations

Only after that should it optimize for writing quality.

This sounds simple, but it is a serious product decision. A research report is not marketing copy. For technical surveys, literature reviews, and architecture decisions, the most valuable part is not fluency. It is knowing why a conclusion should be trusted.

That is why AutoResearch does not treat report generation as a final “write everything” prompt. It decomposes the process into evidence extraction, citation storage, outline generation, section drafting, and critic review. This may be slower, but it is much more suitable for long-term technical work.

## Why the memory layer matters

In an automatic research system, memory is not just chat history.

AutoResearch uses memory more like a research asset layer. It is responsible for:

- normalizing URLs, DOIs, arXiv IDs, and other source identities
- deduplicating repeated sources
- preserving intermediate artifacts from each research task
- supporting lookup of sources, evidence, and reports by task

This matters for long-running work.

Without memory, every research run starts from scratch. With structured memory, the system can accumulate what it has already read, what it has already concluded, and which pieces of evidence support which claims.

That is the difference between a search-summary tool and a real research workflow. AutoResearch is not only generating a report; it is preserving a research trajectory.

## The product value

AutoResearch is well suited for tasks such as:

- technical architecture surveys
- literature direction mapping
- open-source project comparisons
- early-stage competition planning
- system design research
- first drafts of long reports or proposals

It is less about answering a single fact and more about helping a user form a judgment around a complex topic.

For example, when researching an autonomous science system, a game engine architecture, or a safety-evaluation pipeline, a single chat response is rarely enough. A better workflow is to decompose the question, collect sources, extract evidence, build an outline, and preserve the path that produced the final report.

## Source and local usage

The local README shows that AutoResearch is a Python project using FastAPI, Pydantic, SQLAlchemy, Requests, and Uvicorn.

The basic local setup looks like this:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e .[dev]
.\.venv\Scripts\python.exe -m uvicorn autoresearch.api.main:app --host 127.0.0.1 --port 8000
```

Then the worker can be started with:

```powershell
.\.venv\Scripts\python.exe -m autoresearch.worker.main --poll-interval 1
```

The web UI lives under `apps\web` and can be run separately.

I am not automatically packaging or uploading the local source tree, because public distribution boundaries still need to be confirmed. But the project already has a structure that could later support a polished GitHub README, screenshots, reproducible demos, and public research reports.

## What to write next

AutoResearch can naturally become a series:

- how the Planner decomposes a research topic
- how evidence cards reduce vague reporting
- how memory supports long-running research
- how the report engine turns evidence into long-form writing
- why automatic research cannot be reduced to one large prompt

This first article is the overview. The main idea is simple: AutoResearch turns agentic research from one-shot generation into a traceable, reviewable, and steadily improvable pipeline.
