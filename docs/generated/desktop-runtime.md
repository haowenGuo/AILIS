# desktop 运行依赖清单（自动生成）

由 `pnpm audit:production` 从入口清单、当前代码和显式动态依赖生成。这里只证明潜在依赖，不证明每一行都会执行。不要手工修改本文件。

| 范围 | 文件数 | 源码物理行数（含空行/注释） |
| --- | ---: | ---: |
| HTML entries | 5 | 4937 |
| electron | 108 | 99054 |
| installer | 1 | 0 |
| scripts | 5 | 16088 |
| src | 44 | 25193 |
| vendor | 5 | 1266 |

依赖闭包共 168 个文件，源码 146538 行；其中 vendor 为第三方，不能混入第一方代码数。Markdown/JSON 资源计文件、不计源码行。

## 正式入口

- `electron/main.cjs`
- `agent-lab.html`
- `control.html`
- `pet.html`
- `chat.html`
- `vision-region.html`

## 外部运行条件与未消除的动态边界

- Electron and production npm dependencies, including the selected Stockfish engine binary
- Python dependencies for research, RAGFlow table import, ASR and TTS; the source subset does not install interpreters or model weights
- Configured provider, external MCP servers and optional OpenClaw SDK are runtime integrations, not first-party source files
- Renderer VRM/motion/public assets are emitted by the existing asset build; not inferred from JS imports alone

- `electron/openclaw-runtime.cjs:215`：optional OpenClaw gateway SDK, selected from installed runtime candidates; no hermeticity claim for this path
- `electron/ailis-gateway.cjs:5453`：optional OpenClaw SDK agent-harness in separately prepared build-cache/openclaw-runtime; not bundled or validated by source closure

逐文件保留原因、上游引用和 SHA-256 见 `tmp/production-audit/desktop.json`；验证范围与命令见 `docs/production-runtime.md`。
