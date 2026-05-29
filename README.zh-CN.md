<div align="center">
  <h1>AIGril</h1>
  <p><strong>一个围绕 AIGL 构建的虚拟陪伴项目，同时提供网页体验与 Electron 桌宠版本，重点是 3D VRM 虚拟形象、流式对话、动作表情联动，以及轻量记忆能力。</strong></p>
  <p>
    <a href="https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com"><img alt="Try AIGril" src="https://img.shields.io/badge/Try%20AIGril-完整体验-2563eb?style=for-the-badge"></a>
    <a href="https://haowenGuo.github.io/AIGril/"><img alt="Frontend Demo" src="https://img.shields.io/badge/GitHub%20Pages-前端展示-0f172a?style=for-the-badge"></a>
    <a href="https://airi-backend.onrender.com/docs"><img alt="Backend API" src="https://img.shields.io/badge/Backend-FastAPI%20文档-059669?style=for-the-badge"></a>
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a>
  </p>
</div>

---

## 项目简介

AIGril 现在已经有两条可以实际使用的产品形态：

- 网页版：适合在线体验、前端展示和后端联调
- 桌宠版：适合常驻桌面、随时唤起聊天的陪伴场景

两者共用 AIGL 的 VRM 形象、动作系统、聊天流程和后端能力，只是在运行外壳和交互方式上不同。

## 在线体验

- 完整体验版：[https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com](https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com)
- 纯前端展示版：[https://haowenGuo.github.io/AIGril/](https://haowenGuo.github.io/AIGril/)
- 后端接口文档：[https://airi-backend.onrender.com/docs](https://airi-backend.onrender.com/docs)

## 桌宠版功能

- 无边框透明桌宠窗口
- 常驻置顶，并记住位置、缩放、大小和显示状态
- 点击人物弹出聊天窗
- 右键菜单支持 `聊天`、`语音模式`、`缩放`、`退出`
- 系统托盘支持显示隐藏和任务栏选项
- 聊天窗与桌宠运行时同步
- 语音输出支持服务端语音、本地简易语音和关闭语音三种模式
- 桌面端聊天窗支持手动触发的本地语音识别

## 核心功能

- 流式文本对话，降低等待体感
- 虚拟角色动作控制，如待机、跳舞、惊讶、挥手、生气
- 表情预设，如开心、难过、放松、惊讶、俏皮眨眼
- 在文本到达过程中执行说话状态动画和 fallback 口型
- 会话记忆存储与定时摘要压缩

## 技术栈

- 前端：Vite、Three.js、`@pixiv/three-vrm`
- 桌面端外壳：Electron
- 后端：FastAPI、SQLAlchemy、SQLite
- 大模型接入：OpenAI 兼容接口
- 部署：GitHub Pages + Render

## 本地启动

### 网页版

```bash
pnpm install
pnpm dev
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

### 桌宠版

```bash
pnpm install
python -m pip install -r requirements-desktop-asr.txt
pnpm desktop:start
```

补充说明：

- 本地语音识别是 Electron 桌面端的可选能力
- 当前桌面端 ASR 使用本地 Python worker + Whisper Small
- 首次使用时会自动下载并缓存识别模型

### 桌宠开发模式

```bash
pnpm desktop:dev
```

至少需要配置：

```env
LLM_API_KEY=your_llm_api_key
```

## 打包

生成最新版 Windows 桌宠安装包与便携版：

```bash
pnpm desktop:package
```

产物会输出到 [`release/`](release) 目录，包括：

- `AIGril-Setup-<version>-win-x64.exe`
- `AIGril-Portable-<version>-win-x64.exe`
- `release/win-unpacked/AIGril.exe`

## 项目结构

```text
backend/   FastAPI 接口、记忆逻辑、部署配置
electron/  Electron 主进程、预加载桥接、桌宠状态管理
src/       VRM 数字人、聊天运行时、桌面端渲染入口
Resources/ VRM 模型与 VRMA 动作资源
scripts/   静态构建辅助脚本
examples/  独立开发示例
```

## 部署方式

- 公开前端：GitHub Pages
- 公开后端：Render
- Render 配置文件：[`render.yaml`](render.yaml)

## 项目目标

让 AIGL 既能作为网页中的虚拟角色，也能作为真正的桌宠常驻桌面，在保持响应速度和表现力的同时，继续方便工程化迭代。
