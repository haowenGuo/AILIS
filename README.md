<div align="center">
  <img width="220" alt="AILIS waving" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>An open-source desktop AI companion that can see, listen, remember, and get real work done.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.1-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>Try AILIS</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases"><strong>Download</strong></a> ·
    <a href="docs/getting-started.md">Quick Start</a> ·
    <a href="docs/README.md">Documentation</a>
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

## More Than a Chat Window

AILIS is designed to become a personal AI that actually lives on your desktop. She has a visible 3D character, voice, expressions, and long-term memory, backed by an Agent Runtime that can research, read files, write code, organize content, and operate computer tools.

Talk to AILIS naturally, like a companion. When there is work to do, she can understand approved screen and file context, choose the right tools, complete the task, and remember the preferences that matter next time.

## Core Experience

<table>
  <tr>
    <td width="33%" valign="top"><h3>Visible</h3>A VRM desktop character with expressions, motions, lip sync, and dialogue bubbles. AI no longer has to feel like an empty text box.</td>
    <td width="33%" valign="top"><h3>Conversational</h3>Voice input and natural speech output are available alongside quiet, fast text interaction.</td>
    <td width="33%" valign="top"><h3>Context-aware</h3>With permission, AILIS can understand screens, windows, captured regions, and local files without making you repeat the context.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>Capable</h3>Search, code, files, web, email, and computer actions share one auditable tool execution path.</td>
    <td width="33%" valign="top"><h3>Memorable</h3>Long-term memory keeps useful preferences, project background, and relationship context for better collaboration.</td>
    <td width="33%" valign="top"><h3>Controllable</h3>Important tool actions enter approval and audit flows, so users know what the system plans to do and what it has done.</td>
  </tr>
</table>

## How AILIS Works

| 1. Describe | 2. Understand | 3. Execute | 4. Remember |
| :---: | :---: | :---: | :---: |
| Explain the goal naturally | Read approved screen and file context | Use search, code, file, and computer tools | Keep useful preferences and project background |

## Evaluated Agent Capability

AILIS is tested on complete end-to-end tasks, not only feature demos. The following are historical, frozen-source results (GAIA A6 and Terminal A7), not a benchmark certification of v1.4.1. See the [version and evidence registry](docs/ailis-version-registry.md) for source identities and comparison protocols.

| Benchmark | AILIS | Codex, same model |
| :--- | ---: | ---: |
| **GAIA public validation · 165 tasks** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 tasks** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center">
  <a href="docs/evaluation.md"><strong>View complete scores, efficiency metrics, and reproducible evidence</strong></a>
</p>

## What Works Today

- [x] A resident VRM character, chat window, and control panel on Windows
- [x] Realtime interaction through text, voice, expressions, and motion
- [x] Permission-aware screen, window, file, and code context
- [x] Search, web, code, file, email, and computer-operation tools
- [x] Long-term memory for preferences, projects, and relationship context
- [x] Approval, evidence, and recovery paths for consequential tool actions
- [ ] Stronger reliability, caching, and recovery for long-horizon work
- [ ] A more complete realtime voice, cross-device, and plugin experience

## Quick Start

### v1.4.1 update

The latest release brings stable append-only context handling, a governed code-mode tool runtime, auxiliary vision routing, and fixes that preserve attachment context during compaction and Korean voice-profile settings. See the [release notes](docs/releases/v1.4.1.md) for upgrade instructions and limits. Cache hit rates and cost savings depend on the provider and workload; no fixed reduction is promised.

### Use AILIS

Download the desktop build from [Releases](https://github.com/haowenGuo/AILIS/releases), or meet AILIS first through the [web experience](https://101.133.239.56/Test/).

### Develop Locally

```bash
pnpm install
pnpm desktop:dev
```

Desktop builds, voice, validation, the optional backend, and packaging are documented in the [Getting Started guide](docs/getting-started.md).

## Direction

AILIS is neither a roleplay chat app with no execution ability nor a terminal wrapped in an avatar. The project brings three ideas together:

1. **A digital companion with presence**: conversation, voice, expression, relationships, and long-term memory.
2. **A reliable personal Agent**: contextual understanding, general tools, and long-horizon task execution.
3. **An understandable, controllable execution system**: approved actions, traceable progress, and recoverable failures.

## Learn More

<p align="center">
  <a href="docs/getting-started.md"><strong>Install and Configure</strong></a> ·
  <a href="docs/README.md"><strong>Documentation Center</strong></a> ·
  <a href="docs/evaluation.md"><strong>Complete Evaluation Scorecard</strong></a>
</p>

## Community

If AILIS is useful to you, star the repository to follow its progress. Bug reports, workflow ideas, and focused pull requests are welcome through [Issues](https://github.com/haowenGuo/AILIS/issues) and the [contribution guide](CONTRIBUTING.md).

## Privacy and Control

AILIS is built for personal desktop use. Visual context requires permission, actions that affect files, apps, accounts, or external services enter an approval flow, and local memory and runtime state remain on the user's machine by default. Only context needed for the current request is sent to the configured model service.

## License

AILIS source code is released under the [MIT License](LICENSE). Some third-party models, motions, voice assets, and character resources may use their own licenses.
