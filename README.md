# AILIS

This manual describes the current source branch, including the unified Agent. The existing [v1.4.1 installers](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.1) were built from `659bf61` and do not include these later changes. Use this source branch to try them; historical releases remain available.

AILIS is a desktop application for text and voice interaction, tool-assisted tasks, persistent context, and a VRM avatar.

## Run from source

The project uses pnpm 10.33.0. From the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

Configure a model service in the control panel before starting a conversation. Voice, vision and external tools use their own optional dependencies and settings.

## Explore

- Desktop: chat, pet, control panel, Agent Lab and region capture.
- Runtime: a main Agent with Session persistence, tool execution and events.
- Data: conversation records, budgeted memory and referenced tool outputs.
- Services: separate Hosted Node and Python API entrypoints.

Read the [manual](docs/README.md) for setup, system design and engineering workflows. The detailed technical manual is maintained in Chinese; these language pages provide entrypoints.

[中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Development and license

See [CONTRIBUTING](CONTRIBUTING.md), [source map](docs/reference/source-map.md) and [LICENSE](LICENSE). External code, models, voices and motion assets have their own terms. Keep account credentials and personal state outside source control.
