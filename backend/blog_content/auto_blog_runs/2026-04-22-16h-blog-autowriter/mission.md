# Mission

Run the AIGril auto blog writing job as a durable 16-hour long-running engineering workflow.

The controller should repeatedly study low-risk local project materials, create bilingual blog articles, update the blog index, validate the generated artifacts, commit only allowed blog content, and publish the result to GitHub `main`.

The heartbeat is only an observability and conversation projector. It must not write articles, mutate `posts.json`, or execute Git operations.

## Scope

- Workspace: `F:\AIGril`
- Run directory: `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/`
- Controller: `scripts/auto_blog_runner.py`
- Worker prompt: `RUNNER_PROMPT.md`
- Publishing worktree: `F:\AIGril_tmp_main`

## Safety Boundary

The job may read README files, manifests, and public docs. It must not read or publish `.env`, secrets, tokens, private keys, databases, chat logs, model weights, private datasets, unconfirmed source dumps, installers, or binaries.
