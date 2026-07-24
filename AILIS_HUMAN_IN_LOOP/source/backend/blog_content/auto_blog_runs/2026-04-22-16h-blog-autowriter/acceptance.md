# Acceptance

The long-running blog job is acceptable when these conditions are met.

## Content

- At least 10 bilingual articles are created.
- Each article has a Chinese Markdown file and an English Markdown file.
- Each article is listed exactly once in `backend/blog_content/posts.json`.
- A final report is generated at `final_100_page_report.md`.

## Verification

- `posts.json` parses successfully as JSON after every accepted iteration.
- Generated article body files referenced by `posts.json` exist.
- The controller records every major transition in `event-log.jsonl`.
- `progress.json` is updated frequently enough for heartbeat reporting.
- Failures are classified before repair or retry.

## Operations

- The local controller owns heavy work and Git operations.
- Heartbeat only reads state and reports progress.
- Runtime files are not published to Git.
- Pending commits are retried before starting a new writing iteration.
- Duplicate heavy runs are prevented by `runner.lock` and process checks.

## Publishing

- Only blog content, stable run docs, and final reports may be committed by the runner.
- Runtime logs, status projections, event logs, control queues, and stop flags must remain local.
