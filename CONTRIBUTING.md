# Contributing to AILIS

Thanks for helping build a capable, understandable desktop AI companion.

## Start Here

1. Read the [Getting Started guide](docs/getting-started.md).
2. Search existing [issues](https://github.com/haowenGuo/AILIS/issues) before opening a new one.
3. For a code change, create a focused branch and keep one behavioral objective per pull request.

```bash
pnpm install
pnpm desktop:dev
```

Run the tests closest to your change. Runtime and Harness changes should also run:

```bash
pnpm ailis:validate-harness
```

## Project Principles

- Improve general Agent capability, context, tools, memory, reliability, or user experience.
- Do not add benchmark-task answers, site-specific routes, or hidden behavior that only raises one score.
- Preserve approval and audit boundaries for consequential actions.
- Keep model-visible context and tool contracts explicit and testable.
- Include correctness, latency, token, cache, and regression evidence for Harness changes.

## Pull Requests

A useful pull request includes:

- the problem and intended behavior;
- the smallest relevant implementation;
- tests or reproducible validation;
- screenshots for visible UI changes;
- benchmark evidence only when the protocol and source are fixed.

Please do not commit credentials, user memory, chat transcripts, generated evaluation outputs, or third-party assets without a compatible license.
