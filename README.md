<div align="center">
  <h1>AIGril</h1>
  <p><strong>AIGL virtual companion for both the browser and a desktop-pet style Electron app, with a 3D VRM avatar, streaming chat, expressive animation, and lightweight memory.</strong></p>
  <p>
    <a href="https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com"><img alt="Try AIGril" src="https://img.shields.io/badge/Try%20AIGril-Live%20Experience-2563eb?style=for-the-badge"></a>
    <a href="https://haowenGuo.github.io/AIGril/"><img alt="Frontend Demo" src="https://img.shields.io/badge/GitHub%20Pages-Frontend%20Demo-0f172a?style=for-the-badge"></a>
    <a href="https://airi-backend.onrender.com/docs"><img alt="Backend API" src="https://img.shields.io/badge/Backend-FastAPI%20Docs-059669?style=for-the-badge"></a>
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a>
  </p>
</div>

---

## Overview

AIGril now has two usable fronts built around the same AIGL runtime:

- Web experience for browser-based conversation and demo access
- Electron desktop pet for always-on-top companionship on Windows PC

The project keeps the same VRM avatar, motion system, chat flow, and backend integration, while packaging them differently for browser and desktop use.

## Experience

- Full web experience: [https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com](https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com)
- Frontend-only demo: [https://haowenGuo.github.io/AIGril/](https://haowenGuo.github.io/AIGril/)
- Backend API docs: [https://airi-backend.onrender.com/docs](https://airi-backend.onrender.com/docs)

## Desktop Pet Features

- Frameless transparent pet window
- Always-on-top desktop presence with remembered size, scale, position, and visibility
- Click the pet to open chat
- Right-click menu for `Chat`, `Speech Mode`, `Scale`, and `Quit`
- System tray entry with visibility and taskbar options
- Separate chat window synchronized with the pet runtime
- Three speech output modes: server voice, local lightweight voice, or muted voice
- Manual local speech recognition in the chat window on desktop

## Core Features

- Streaming chat responses from a FastAPI backend
- VRM avatar actions such as idle, dance, surprise, wave, and anger
- Expression presets such as happy, sad, relaxed, surprised, and playful blink
- Speaking-state animation and lip-sync fallback while text is arriving
- Session memory with periodic summary compression

## Tech Stack

- Frontend: Vite, Three.js, `@pixiv/three-vrm`
- Desktop shell: Electron
- Backend: FastAPI, SQLAlchemy, SQLite
- Model access: OpenAI-compatible API
- Deployment: GitHub Pages + Render

## Run Locally

### Web

```bash
pnpm install
pnpm dev
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

### Desktop Pet

```bash
pnpm install
python -m pip install -r requirements-desktop-asr.txt
pnpm desktop:start
```

Notes:

- Local speech recognition is optional and only used by the Electron build
- The current desktop ASR path uses a local Python worker with Whisper Small
- On first use, the ASR model is downloaded and cached locally

### Desktop Development

```bash
pnpm desktop:dev
```

Required environment variable:

```env
LLM_API_KEY=your_llm_api_key
```

## Packaging

Build the latest Windows desktop packages with:

```bash
pnpm desktop:package
```

Generated files are written to [`release/`](release), including:

- `AIGril-Setup-<version>-win-x64.exe`
- `AIGril-Portable-<version>-win-x64.exe`
- `release/win-unpacked/AIGril.exe`

## Repository Layout

```text
backend/   FastAPI API, memory logic, deployment config
electron/  Electron main process, preload bridge, desktop state
src/       VRM avatar, chat runtime, desktop render entry points
Resources/ VRM model and VRMA animation assets
scripts/   Static build helpers
examples/  Standalone developer examples
```

## Deployment

- Public frontend: GitHub Pages
- Public backend: Render
- Render config: [`render.yaml`](render.yaml)

## Goal

Build a virtual companion that feels responsive, expressive, and pleasant both in the browser and as a desktop pet, while keeping the project structure practical to evolve.
