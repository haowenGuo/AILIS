# Native Image Contract And Budget

The direct Gateway `view_image` result remains an MCP result with `content` and
`structuredContent`. Inside `exec`, its projected result is `{ image_url, detail }`.
The nested tool declaration must describe that projection, not the MCP envelope.
Use `image(await tools.view_image({ path: "/path/to/image.png" }))`.

Context budgeting must distinguish typed image parts from text. Inline base64
image payloads are replaced only in the local estimate, never in model input:

- Resized/high/auto inputs: 7,373 estimated bytes, about 1,844 tokens per image.
- Original detail: `ceil(width / 32) * ceil(height / 32)` patches, capped at 10,000.
- Unknown original dimensions use the resized estimate.
- Data URLs printed as text remain text; remote URLs retain ordinary counting.
- Provider-reported usage remains authoritative; these estimates are not prices.

This follows the image accounting in the local Codex reference `history.rs`.
The original-image estimate cache retains at most 32 hashes and numeric estimates,
not image payloads. The shared header reader supports PNG, JPEG, GIF and WebP.

## Single-Task Retest

On 2026-10-19, `freecad-platform-drawing` was run as a separate fresh experiment
using the original frozen runtime, changing only the three image-fix files.
The other 13,747 runtime files, task checksum, model `gpt-6-luna` / `xhigh`,
official 28,800-second timeout and separate verifier were preserved.

| Metric | Original | Image Fix |
| --- | ---: | ---: |
| Official reward | 0 | 1 |
| Agent time | 1,590.0 s | 552.1 s |
| Model calls | 110 | 23 |
| Compactions | 25 | 0 |
| Input tokens | 1,653,013 | 838,566 |
| Uncached input tokens | 587,285 | 117,926 |
| Input cache rate | 64.47% | 85.94% |
| Peak request input | 31,830 | 62,779 |

All 21 image-bearing decision inputs matched recorded transport item hashes.
The new run was append-only, with no undefined-content errors or failed model
requests. The official geometry similarity was 1.0 and all 19 CAD specification
checks matched. This is a single intervention result, not a new full-suite score.
Original full-run results are not replaced by this experimental retest.

Regression coverage includes the actual isolated exec worker and a two-request
Gateway HTTP loop, image preservation, text budgets and provider usage thresholds.

## Publishing Prerequisite

The evaluated frozen runtime already waited for the final IPC send callback
before exiting an exec worker. The public/hosted runtime had not received that
change. It is published alongside this fix so large images are not dropped by
an early worker exit. A regression exercises both normal completion and `exit()`
with more than 1 MiB of pixels. The HTTP integration uses an ordinary bounded
workspace, not full-control access; Linux server validation runs in a private
network namespace so the synthetic loopback port does not require a host
firewall exception. Neither adjustment changes the original task retest bundle.
