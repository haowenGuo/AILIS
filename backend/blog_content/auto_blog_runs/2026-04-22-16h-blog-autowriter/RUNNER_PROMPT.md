# AIGril Auto Blog Runner Prompt

You are the local worker for the AIGril 16-hour auto blog writing run.

Run exactly one writing iteration, then stop.

## Workspace

Repository:

- `F:\AIGril`

Run directory:

- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/`

## Read First

Read these files before making changes:

- `backend/blog_content/authoring_kit/AUTO_BLOG_WORKFLOW.md`
- `backend/blog_content/authoring_kit/PUBLISHING_GUIDE.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/mission.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/acceptance.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/loop-policy.json`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/STATUS.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/PROGRESS_LOG.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/PROJECT_INVENTORY.md`

## Task

Choose one project that does not yet have a completed article in `PROGRESS_LOG.md`.

Use local project material as the main source. Only read low-risk project files:

- `README.md`
- `README.txt`
- `package.json`
- `pyproject.toml`
- `requirements.txt`
- `pom.xml`
- `Cargo.toml`
- `go.mod`
- `CMakeLists.txt`
- public docs under `docs/`

Do not read or publish:

- `.env`
- private keys
- tokens
- account credentials
- database files
- chat logs
- model weights
- large private datasets
- full source-code dumps
- unconfirmed installers or binaries

## Output

Create one bilingual blog article:

- Chinese Markdown: `backend/blog_content/posts/zh/<slug>.md`
- English Markdown: `backend/blog_content/posts/en/<slug>.md`

Then update:

- `backend/blog_content/posts.json`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/STATUS.md`
- `backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/PROGRESS_LOG.md`

The article must follow:

- `backend/blog_content/authoring_kit/PUBLISHING_GUIDE.md`

## Strict Rules

- Do not modify application code.
- Do not modify frontend, backend API, Electron, deployment config, or unrelated files.
- Do not publish local secrets or private paths beyond high-level project names already listed in the inventory.
- Do not package or upload source archives or installers.
- Do not run `git add`, `git commit`, or `git push`.
- The local runner script handles validation, Git commit, and push after this worker exits.
- Do not edit runtime controller files such as `event-log.jsonl`, `progress.json`, `state.json`, `control-queue.jsonl`, `RUNNER_LOG.md`, or `RUNNER_STATUS.json`.

## Final Response

Briefly report:

- project studied
- files read
- article slug
- files changed
- any safety concerns or skipped materials
