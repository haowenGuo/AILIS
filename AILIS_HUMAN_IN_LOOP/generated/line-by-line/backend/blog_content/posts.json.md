# backend/blog_content/posts.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`structured-data`
- 原始行数：724
- SHA-256：`d30e71102067180dc8a96e33603d942e34a7e58a12e7d7fccde79fe765c191f9`
- 可运行副本：[打开源文件](../../../../source/backend/blog_content/posts.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>[</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 3 | <code>    "slug": "hello-blog-framework",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>    "published_at": "2026-04-17",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>    "reading_time": "2 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "featured": true,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>    "tags": ["intro", "blog", "framework"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>        "title": "Hello, Blog Framework",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>        "summary": "这是一篇占位文章，用来验证博客框架已经搭建完成，后续只需要填内容即可。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>        "body_file": "posts/zh/hello-blog-framework.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 14 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>        "title": "Hello, Blog Framework",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>        "summary": "This is a placeholder post to verify that the blog framework is ready and content can be added later without touching the page code.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>        "body_file": "posts/en/hello-blog-framework.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 19 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 20 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 22 | <code>    "slug": "why-build-in-public",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>    "published_at": "2026-04-17",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>    "reading_time": "3 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>    "tags": ["writing", "notes"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>        "title": "Why Build in Public",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>        "summary": "我希望博客不仅展示结果，也记录过程，这会让项目和成长轨迹都更清楚。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>        "body_file": "posts/zh/why-build-in-public.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 33 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>        "title": "Why Build in Public",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>        "summary": "I want the blog to show not only finished work, but also the process that produced it.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>        "body_file": "posts/en/why-build-in-public.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 38 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 39 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 40 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 41 | <code>    "slug": "ailis-desktop-pet-v1",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>    "published_at": "2026-04-18",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>    "featured": true,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>    "tags": ["electron", "desktop-pet", "vrm", "voice"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>        "title": "AILIS 桌宠版 V1：从网页虚拟人到常驻桌面",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>        "summary": "这一版把 AILIS 正式做成了一个可常驻桌面的桌宠形态，并补齐了右键控制、托盘、语音模式切换和本地语音识别的基础链路。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>        "body_file": "posts/zh/ailis-desktop-pet-v1.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 52 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>        "title": "AILIS Desktop Pet V1: From Web Avatar to Resident Companion",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>        "summary": "This iteration turns AILIS into a real desktop pet with a transparent always-on-top shell, tray and context controls, speech mode switching, and a first working pass of local speech recognition.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>        "body_file": "posts/en/ailis-desktop-pet-v1.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 57 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 58 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 59 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 60 | <code>    "slug": "ailis-render-github-pages-deployment",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 62 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>    "tags": ["deployment", "render", "github-pages", "fastapi"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>        "title": "AILIS 的上线方式：GitHub Pages 前端加 Render 后端",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>        "summary": "这篇文章记录 AILIS 如何从本地虚拟人项目变成可在线体验的前后端系统，并说明源码、体验地址和桌面包的整理方式。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>        "body_file": "posts/zh/ailis-render-github-pages-deployment.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 70 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 71 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 72 | <code>        "title": "How AILIS Is Deployed: GitHub Pages for the Frontend and Render for the Backend",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>        "summary": "This post explains how AILIS moved from a local virtual-character project to a live frontend-backend system, including source code, live links, and desktop packaging notes.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>        "body_file": "posts/en/ailis-render-github-pages-deployment.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 76 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 77 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 78 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 79 | <code>    "slug": "autoresearch-evidence-first-agentic-research",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 80 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>    "tags": ["autoresearch", "agents", "research", "rag"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 85 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 86 | <code>        "title": "AutoResearch：把自动调研做成可追踪的研究流水线",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>        "summary": "这篇文章介绍 AutoResearch 的 Phase 1 思路：用规划、检索、证据抽取、记忆和报告引擎，把自动调研从一次性总结变成可追踪的工程流水线。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>        "body_file": "posts/zh/autoresearch-evidence-first-agentic-research.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 90 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>        "title": "AutoResearch: Turning Agentic Research into a Traceable Pipeline",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>        "summary": "This post introduces AutoResearch as an evidence-first research pipeline built around planning, retrieval, memory, evidence extraction, and report generation.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>        "body_file": "posts/en/autoresearch-evidence-first-agentic-research.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 95 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 97 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 98 | <code>    "slug": "haorender-gpu-modern-rhi-roadmap",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 99 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 100 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 102 | <code>    "tags": ["rendering", "gpu", "rhi", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 103 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>        "title": "HaoRender-GPU：从 CPU 渲染经验走向现代 RHI 架构",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>        "summary": "这篇文章介绍 HaoRender-GPU 如何从独立工程起步，以 OpenGL triangle 为最小闭环，逐步走向 D3D12/Vulkan 风格的现代 RHI 架构。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>        "body_file": "posts/zh/haorender-gpu-modern-rhi-roadmap.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 109 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>        "title": "HaoRender-GPU: From CPU Rendering Experience to a Modern RHI Roadmap",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>        "summary": "This post introduces HaoRender-GPU as a separate modern rendering track that starts with OpenGL samples and moves toward a D3D12/Vulkan-shaped RHI architecture.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>        "body_file": "posts/en/haorender-gpu-modern-rhi-roadmap.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 114 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 115 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 116 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 117 | <code>    "slug": "multi-codex-orchestrator-patch-first-parallel-agents",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 118 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 121 | <code>    "tags": ["agents", "codex", "orchestration", "testing"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 123 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 124 | <code>        "title": "Multi-Codex Orchestrator：把多 Agent 协作变成可验证的 Patch 流水线",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>        "summary": "这篇文章介绍 Multi-Codex Orchestrator 如何用 Manager/Worker/Repair/Conflict Resolver、git worktree 和结构化工件，把多 Agent 编程变成可验证的 patch 流水线。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 126 | <code>        "body_file": "posts/zh/multi-codex-orchestrator-patch-first-parallel-agents.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 127 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 128 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 129 | <code>        "title": "Multi-Codex Orchestrator: Turning Multi-Agent Coding into a Verifiable Patch Pipeline",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 130 | <code>        "summary": "This post explains how Multi-Codex Orchestrator uses manager-worker roles, git worktrees, structured artifacts, repair loops, and deterministic validation to coordinate parallel coding agents.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 131 | <code>        "body_file": "posts/en/multi-codex-orchestrator-patch-first-parallel-agents.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 132 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 133 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 134 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 135 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 136 | <code>    "slug": "haorender-cpu-rendering-workbench",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 137 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 138 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 140 | <code>    "tags": ["rendering", "cpp", "qt", "cpu"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 142 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 143 | <code>        "title": "haorender：把 CPU 光栅化做成可调试的桌面渲染工作台",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 144 | <code>        "summary": "这篇文章基于 haorender 的 README 和 CMake 配置，介绍它如何从 CPU 光栅化项目发展成带 Qt UI、材质调试、阴影控制、profiling 和便携分发思路的桌面渲染工作台。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 145 | <code>        "body_file": "posts/zh/haorender-cpu-rendering-workbench.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 146 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 147 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>        "title": "haorender: Turning CPU Rasterization into a Debuggable Desktop Rendering Workbench",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 149 | <code>        "summary": "This post uses haorender's README and CMake configuration to explain how the project frames CPU rasterization as a Qt-based desktop rendering workbench with material inspection, shadows, profiling, and portable packaging.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 150 | <code>        "body_file": "posts/en/haorender-cpu-rendering-workbench.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 151 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 152 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 153 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 154 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 155 | <code>    "slug": "ailis-desktop-pet-openclaw-bridge",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 156 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 157 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 158 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 159 | <code>    "tags": ["electron", "desktop-pet", "openclaw", "voice"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 161 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 162 | <code>        "title": "AILIS：把桌宠界面和 OpenClaw 运行时分清楚",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 163 | <code>        "summary": "这篇文章基于 AILIS 的 README、package.json 和 requirements.txt，介绍它如何把 Electron 桌宠界面、Python companion backend 与本地 OpenClaw Gateway 运行时拆成清晰的产品边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>        "body_file": "posts/zh/ailis-desktop-pet-openclaw-bridge.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 165 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 166 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 167 | <code>        "title": "AILIS: Separating the Desktop Pet from the OpenClaw Runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 168 | <code>        "summary": "This post uses AILIS's README, package.json, and requirements.txt to explain how the project separates its Electron desktop pet, Python companion backend, and local OpenClaw Gateway runtime.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 169 | <code>        "body_file": "posts/en/ailis-desktop-pet-openclaw-bridge.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 170 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 171 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 172 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 173 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 174 | <code>    "slug": "she-ai-native-2d-engine-bootstrap",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 175 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 176 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 177 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 178 | <code>    "tags": ["engine", "cpp", "gamedev", "ai"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 179 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 180 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 181 | <code>        "title": "SHE：先把 2D 引擎做成 AI 可理解的骨架",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 182 | <code>        "summary": "这篇文章基于 SHE 的 README、CMake 配置和公开 docs，介绍它如何先用 runtime services、schema、diagnostics 和 AI context export 搭出可协作的 2D 引擎骨架。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 183 | <code>        "body_file": "posts/zh/she-ai-native-2d-engine-bootstrap.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 184 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 185 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 186 | <code>        "title": "SHE: Building an AI-Readable Bootstrap for a 2D Engine",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 187 | <code>        "summary": "This post uses SHE's README, CMake setup, and public docs to explain how the project starts with runtime services, schemas, diagnostics, and AI context export before building the full 2D engine stack.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 188 | <code>        "body_file": "posts/en/she-ai-native-2d-engine-bootstrap.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 189 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 190 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 191 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 192 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 193 | <code>    "slug": "humanoid-teaching-classroom-simclass-template",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 194 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 195 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 196 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 197 | <code>    "tags": ["education", "node", "serverless", "testing"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 198 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 199 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 200 | <code>        "title": "仿真人教学：从 Render 演示版走向多端教学平台模板",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 201 | <code>        "summary": "这篇文章基于仿真人教学的 README、package.json 和公开 docs，介绍它如何把学生端、教师端、仿真课堂、自动回归、生产自检和多端迁移路线整理成可验证的教学软件模板。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 202 | <code>        "body_file": "posts/zh/humanoid-teaching-classroom-simclass-template.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 203 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 204 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 205 | <code>        "title": "Humanoid Teaching Classroom: From a Render Demo to a Multi-Platform Education Template",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 206 | <code>        "summary": "This post uses the project's README, package metadata, and public docs to explain how it organizes student and teacher flows, simulated classrooms, regression checks, production readiness, and a multi-platform migration path.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 207 | <code>        "body_file": "posts/en/humanoid-teaching-classroom-simclass-template.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 208 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 209 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 210 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 211 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 212 | <code>    "slug": "she-w01-gameplay-core-contracts",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 213 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 214 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 215 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 216 | <code>    "tags": ["engine", "gamedev", "cpp", "agents"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 217 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 218 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 219 | <code>        "title": "SHE W01：把玩法核心先做成命令、事件和计时器契约",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 220 | <code>        "summary": "这篇文章基于 SHE-w01-gameplay 的 README、CMake 配置和公开 docs，介绍 W01 Gameplay Core 如何先稳定命令、事件、计时器和 AI 可见的玩法契约。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 221 | <code>        "body_file": "posts/zh/she-w01-gameplay-core-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 222 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 223 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 224 | <code>        "title": "SHE W01: Turning Gameplay Core into Command, Event, and Timer Contracts",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 225 | <code>        "summary": "This post uses SHE-w01-gameplay's README, CMake setup, and public docs to explain how W01 Gameplay Core stabilizes commands, events, timers, and AI-visible gameplay contracts.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 226 | <code>        "body_file": "posts/en/she-w01-gameplay-core-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 227 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 228 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 229 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 230 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 231 | <code>    "slug": "she-w02-data-core-schema-contracts",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 232 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 233 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 234 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 235 | <code>    "tags": ["engine", "gamedev", "cpp", "schema"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 236 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 237 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 238 | <code>        "title": "SHE W02：把玩法数据先做成 schema-first 契约",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 239 | <code>        "summary": "这篇文章基于 SHE-w02-data 的 README、CMake 配置和公开 docs，介绍 W02 Data Core 如何用 schema registration、validation results 和 AI context 把玩法数据做成可验证契约。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 240 | <code>        "body_file": "posts/zh/she-w02-data-core-schema-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 241 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 242 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 243 | <code>        "title": "SHE W02: Turning Gameplay Data into Schema-First Contracts",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 244 | <code>        "summary": "This post uses SHE-w02-data's README, CMake setup, and public docs to explain how W02 Data Core turns gameplay data into verifiable contracts through schema registration, validation results, and AI context.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 245 | <code>        "body_file": "posts/en/she-w02-data-core-schema-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 246 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 247 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 248 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 249 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 250 | <code>    "slug": "she-w03-diagnostics-ai-context",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 251 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 252 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 253 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 254 | <code>    "tags": ["engine", "diagnostics", "cpp", "ai"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 255 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 256 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 257 | <code>        "title": "SHE W03：让诊断和 AI Context 讲清楚每一帧",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 258 | <code>        "summary": "这篇文章基于 SHE-w03-diagnostics 的 README、CMake 配置和公开 docs，介绍 W03 如何用 frame trace、diagnostics report 和 authoring context 让运行时状态对人和 Codex 都可读。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 259 | <code>        "body_file": "posts/zh/she-w03-diagnostics-ai-context.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 260 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 261 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 262 | <code>        "title": "SHE W03: Making Diagnostics and AI Context Explain Every Frame",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 263 | <code>        "summary": "This post uses SHE-w03-diagnostics' README, CMake setup, and public docs to explain how W03 makes runtime state readable through frame traces, diagnostics reports, and authoring context export.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 264 | <code>        "body_file": "posts/en/she-w03-diagnostics-ai-context.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 265 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 266 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 267 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 268 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 269 | <code>    "slug": "she-w04-scripting-host-boundary",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 270 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 271 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 272 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 273 | <code>    "tags": ["engine", "scripting", "cpp", "lua"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 274 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 275 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 276 | <code>        "title": "SHE W04：把脚本能力先做成稳定宿主边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 277 | <code>        "summary": "这篇文章基于 SHE-w04-scripting 的 README、CMake 配置和公开 docs，介绍 W04 为什么要把脚本做成稳定 host boundary，而不是绕过 gameplay、data、diagnostics 和 AI Context 契约。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 278 | <code>        "body_file": "posts/zh/she-w04-scripting-host-boundary.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 279 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 280 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 281 | <code>        "title": "SHE W04: Turning Scripting into a Stable Host Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 282 | <code>        "summary": "This post uses SHE-w04-scripting's README, CMake setup, and public docs to explain why W04 treats scripting as a stable host boundary instead of a shortcut around gameplay, data, diagnostics, and AI context contracts.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 283 | <code>        "body_file": "posts/en/she-w04-scripting-host-boundary.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 284 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 285 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 286 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 287 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 288 | <code>    "slug": "she-w05-scene-ecs-world-model",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 289 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 290 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 291 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 292 | <code>    "tags": ["engine", "ecs", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 293 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 294 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 295 | <code>        "title": "SHE W05：把 Scene + ECS 做成稳定世界模型",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 296 | <code>        "summary": "这篇文章基于 SHE-w05-scene 的 README、CMake 配置和公开 docs，介绍 W05 为什么要先稳定 entity identity、component query、transform ownership 和 scene lifetime，再承接 renderer、physics 与 asset pipeline。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 297 | <code>        "body_file": "posts/zh/she-w05-scene-ecs-world-model.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 298 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 299 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 300 | <code>        "title": "SHE W05: Turning Scene + ECS into a Stable World Model",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 301 | <code>        "summary": "This post uses SHE-w05-scene's README, CMake setup, and public docs to explain why W05 stabilizes entity identity, component queries, transform ownership, and scene lifetime before renderer, physics, and asset pipeline work build on it.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 302 | <code>        "body_file": "posts/en/she-w05-scene-ecs-world-model.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 303 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 304 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 305 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 306 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 307 | <code>    "slug": "she-w06-asset-pipeline-contracts",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 308 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 309 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 310 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 311 | <code>    "tags": ["engine", "assets", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 312 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 313 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 314 | <code>        "title": "SHE W06：让资产管线先稳定身份、元数据和加载边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 315 | <code>        "summary": "这篇文章基于 SHE-w06-assets 的 README、CMake 配置和公开 docs，介绍 W06 为什么要先稳定 asset ID、metadata、loader registration 和 handle lifetime，再承接 renderer、audio 与 scene/prefab authoring。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 316 | <code>        "body_file": "posts/zh/she-w06-asset-pipeline-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 317 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 318 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 319 | <code>        "title": "SHE W06: Stabilizing Asset Identity, Metadata, and Loader Boundaries",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 320 | <code>        "summary": "This post uses SHE-w06-assets' README, CMake setup, and public docs to explain why W06 stabilizes asset IDs, metadata, loader registration, and handle lifetime before renderer, audio, and scene or prefab authoring depend on it.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 321 | <code>        "body_file": "posts/en/she-w06-asset-pipeline-contracts.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 322 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 323 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 324 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 325 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 326 | <code>    "slug": "she-w07-platform-input-frame-boundary",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 327 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 328 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 329 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 330 | <code>    "tags": ["engine", "platform", "input", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 331 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 332 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 333 | <code>        "title": "SHE W07：把窗口、输入和帧时间做成运行时边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 334 | <code>        "summary": "这篇文章基于 SHE-w07-platform 的 README、CMake 配置和公开 docs，介绍 W07 如何把窗口、输入、事件泵和帧时间做成后续渲染、物理、音频和 UI 能共同依赖的运行时边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 335 | <code>        "body_file": "posts/zh/she-w07-platform-input-frame-boundary.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 336 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 337 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 338 | <code>        "title": "SHE W07: Turning Windowing, Input, and Frame Timing into a Runtime Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 339 | <code>        "summary": "This post uses SHE-w07-platform's README, CMake setup, and public docs to explain how W07 turns windowing, input, event pumping, and frame timing into a runtime boundary for renderer, physics, audio, and UI work.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 340 | <code>        "body_file": "posts/en/she-w07-platform-input-frame-boundary.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 341 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 342 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 343 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 344 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 345 | <code>    "slug": "she-w08-renderer2d-frame-submission",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 346 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 347 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 348 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 349 | <code>    "tags": ["engine", "rendering", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 350 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 351 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 352 | <code>        "title": "SHE W08：把 Renderer2D 做成清晰的提交与帧所有权边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 353 | <code>        "summary": "这篇文章基于 SHE-w08-renderer 的 README、CMake 配置和公开 docs，介绍 W08 如何把 camera、sprite submission、texture/material handle 和 frame begin/end ownership 做成可解释的渲染边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 354 | <code>        "body_file": "posts/zh/she-w08-renderer2d-frame-submission.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 355 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 356 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 357 | <code>        "title": "SHE W08: Turning Renderer2D into a Clear Submission and Frame Ownership Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 358 | <code>        "summary": "This post uses SHE-w08-renderer's README, CMake setup, and public docs to explain how W08 turns camera state, sprite submission, texture/material handles, and frame begin/end ownership into a clear rendering boundary.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 359 | <code>        "body_file": "posts/en/she-w08-renderer2d-frame-submission.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 360 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 361 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 362 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 363 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 364 | <code>    "slug": "she-w09-physics2d-fixed-step-collisions",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 365 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 366 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 367 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 368 | <code>    "tags": ["engine", "physics", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 369 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 370 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 371 | <code>        "title": "SHE W09：把 Physics2D 做成固定步长与碰撞事件边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 372 | <code>        "summary": "这篇文章基于 SHE-w09-physics 的 README、CMake 配置和公开 docs，介绍 W09 如何把 Box2D runtime boundary、body/collider lifetime、fixed-step simulation 和 collision callbacks 接入 gameplay events。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 373 | <code>        "body_file": "posts/zh/she-w09-physics2d-fixed-step-collisions.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 374 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 375 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 376 | <code>        "title": "SHE W09: Turning Physics2D into a Fixed-Step and Collision Event Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 377 | <code>        "summary": "This post uses SHE-w09-physics' README, CMake setup, and public docs to explain how W09 connects the Box2D runtime boundary, body/collider lifetime, fixed-step simulation, and collision callbacks into gameplay events.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 378 | <code>        "body_file": "posts/en/she-w09-physics2d-fixed-step-collisions.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 379 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 380 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 381 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 382 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 383 | <code>    "slug": "she-w10-audio-runtime-playback-events",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 384 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 385 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 386 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 387 | <code>    "tags": ["engine", "audio", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 388 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 389 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 390 | <code>        "title": "SHE W10：把 Audio Runtime 做成播放契约和玩法反馈边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 391 | <code>        "summary": "这篇文章基于 SHE-w10-audio 的 README、CMake 配置和公开 docs，介绍 W10 如何把 miniaudio 播放路径、sound/music asset contract、channel ownership 和 gameplay-triggered audio events 放进统一运行时边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 392 | <code>        "body_file": "posts/zh/she-w10-audio-runtime-playback-events.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 393 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 394 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 395 | <code>        "title": "SHE W10: Turning Audio Runtime into Playback Contracts and Gameplay Feedback",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 396 | <code>        "summary": "This post uses SHE-w10-audio's README, CMake setup, and public docs to explain how W10 fits miniaudio playback, sound and music asset contracts, channel ownership, and gameplay-triggered audio events into one runtime boundary.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 397 | <code>        "body_file": "posts/en/she-w10-audio-runtime-playback-events.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 398 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 399 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 400 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 401 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 402 | <code>    "slug": "she-w11-ui-debug-runtime-inspection",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 403 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 404 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 405 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 406 | <code>    "tags": ["engine", "debugging", "gamedev", "cpp"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 407 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 408 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 409 | <code>        "title": "SHE W11：把 UI + Debug Tools 做成运行时检查界面",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 410 | <code>        "summary": "这篇文章基于 SHE-w11-ui-debug 的 README、CMake 配置和公开 docs，介绍 W11 如何用 IUiService、Dear ImGui 方向、sandbox debug integration 和 runtime inspection panels 把运行时状态变成可扫描的调试表面。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 411 | <code>        "body_file": "posts/zh/she-w11-ui-debug-runtime-inspection.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 412 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 413 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 414 | <code>        "title": "SHE W11: Turning UI + Debug Tools into a Runtime Inspection Surface",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 415 | <code>        "summary": "This post uses SHE-w11-ui-debug's README, CMake setup, and public docs to explain how W11 turns runtime counters, traces, inspection hooks, sandbox integration, and AI context previews into a scannable debug surface.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 416 | <code>        "body_file": "posts/en/she-w11-ui-debug-runtime-inspection.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 417 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 418 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 419 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 420 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 421 | <code>    "slug": "she-w12-first-playable-vertical-slice",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 422 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 423 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 424 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 425 | <code>    "tags": ["engine", "gamedev", "cpp", "vertical-slice"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 426 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 427 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 428 | <code>        "title": "SHE W12：用第一个可玩 Vertical Slice 验证整条引擎链路",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 429 | <code>        "summary": "这篇文章基于 SHE-w12-vertical-slice 的 README、CMake 配置和公开 docs，介绍 W12 如何用一个小型可玩循环验证 gameplay、data、scene、physics、audio、debug UI 和 AI context 是否真正接通。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 430 | <code>        "body_file": "posts/zh/she-w12-first-playable-vertical-slice.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 431 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 432 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 433 | <code>        "title": "SHE W12: Validating the Engine Spine with the First Playable Vertical Slice",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 434 | <code>        "summary": "This post uses SHE-w12-vertical-slice's README, CMake setup, and public docs to explain how W12 validates the engine spine through one small playable loop across gameplay, data, scene, physics, audio, debug UI, and AI context.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 435 | <code>        "body_file": "posts/en/she-w12-first-playable-vertical-slice.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 436 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 437 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 438 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 439 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 440 | <code>    "slug": "humanoid-teaching-aliyun-serverless-backend",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 441 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 442 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 443 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 444 | <code>    "tags": ["education", "serverless", "aliyun", "backend"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 445 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 446 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 447 | <code>        "title": "仿真人教学 Aliyun Serverless：把正式后端模板先立住",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 448 | <code>        "summary": "这篇文章基于仿真人教学 aliyun-serverless 子项目的 README 和 package.json，介绍它如何把身份、资源、AI、课堂、统计和家长视图整理成面向正式部署的后端模板。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 449 | <code>        "body_file": "posts/zh/humanoid-teaching-aliyun-serverless-backend.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 450 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 451 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 452 | <code>        "title": "Humanoid Teaching Aliyun Serverless: Establishing the Formal Backend Template",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 453 | <code>        "summary": "This post uses the aliyun-serverless subproject README and package metadata to explain how it organizes identity, resources, AI teaching, classroom interaction, statistics, and parent views into a deployment-oriented backend template.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 454 | <code>        "body_file": "posts/en/humanoid-teaching-aliyun-serverless-backend.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 455 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 456 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 457 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 458 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 459 | <code>    "slug": "humanoid-teaching-uniapp-multi-end-frontend",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 460 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 461 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 462 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 463 | <code>    "tags": ["education", "uniapp", "frontend", "vue"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 464 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 465 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 466 | <code>        "title": "仿真人教学 uni-app：把课堂产品做成多端前端模板",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 467 | <code>        "summary": "这篇文章基于仿真人教学 uniapp 子项目的 README 和 package.json，介绍它如何把登录、资源、仿真课堂、智能备课、答疑、错题复盘和家校协同整理成多端前端模板。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 468 | <code>        "body_file": "posts/zh/humanoid-teaching-uniapp-multi-end-frontend.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 469 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 470 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 471 | <code>        "title": "Humanoid Teaching uni-app: Turning the Classroom Product into a Multi-End Frontend Template",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 472 | <code>        "summary": "This post uses the uniapp subproject README and package metadata to explain how it organizes login, resources, simulated classrooms, lesson prep, Q&amp;A, wrong-question review, and parent collaboration into a multi-end frontend template.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 473 | <code>        "body_file": "posts/en/humanoid-teaching-uniapp-multi-end-frontend.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 474 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 475 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 476 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 477 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 478 | <code>    "slug": "aclpubcheck-camera-ready-format-checks",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 479 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 480 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 481 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 482 | <code>    "tags": ["publishing", "python", "latex", "acl"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 483 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 484 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 485 | <code>        "title": "ACL pubcheck：把论文格式检查提前到 camera-ready 之前",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 486 | <code>        "summary": "这篇文章基于 ACL pubcheck 的 README，介绍它如何把字体、作者格式、页边距、页底空间和引用姓名检查前移到作者自己的论文交付流程里。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 487 | <code>        "body_file": "posts/zh/aclpubcheck-camera-ready-format-checks.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 488 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 489 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 490 | <code>        "title": "ACL pubcheck: Moving Paper Format Checks Before Camera Ready",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 491 | <code>        "summary": "This post uses the ACL pubcheck README to explain how the tool moves font, author-formatting, margin, bottom-space, and citation-name checks into the author's own paper delivery workflow.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 492 | <code>        "body_file": "posts/en/aclpubcheck-camera-ready-format-checks.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 493 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 494 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 495 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 496 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 497 | <code>    "slug": "mediacrawler-playwright-social-data-boundaries",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 498 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 499 | <code>    "reading_time": "6 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 500 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 501 | <code>    "tags": ["crawler", "playwright", "data", "compliance"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 502 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 503 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 504 | <code>        "title": "MediaCrawler：把自媒体数据采集放进可控的学习边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 505 | <code>        "summary": "这篇文章基于 MediaCrawler 的 README、依赖清单和公开 docs，介绍它如何用 Playwright、登录态、多平台模块、结构化存储和词云分析组织自媒体数据采集，同时强调学习研究和合规边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 506 | <code>        "body_file": "posts/zh/mediacrawler-playwright-social-data-boundaries.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 507 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 508 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 509 | <code>        "title": "MediaCrawler: Keeping Social Platform Data Collection Inside a Controlled Learning Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 510 | <code>        "summary": "This post uses MediaCrawler's README, dependency metadata, and public docs to explain how it organizes Playwright login state, platform modules, structured storage, and word-cloud analysis while keeping compliance boundaries explicit.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 511 | <code>        "body_file": "posts/en/mediacrawler-playwright-social-data-boundaries.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 512 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 513 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 514 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 515 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 516 | <code>    "slug": "she-workspace-multicodex-integration-spine",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 517 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 518 | <code>    "reading_time": "7 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 519 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 520 | <code>    "tags": ["engine", "codex", "workflow", "gamedev"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 521 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 522 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 523 | <code>        "title": "SHE Workspace：把多 Codex 引擎开发收束到 W00 主线",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 524 | <code>        "summary": "这篇文章基于 SHE-workspace 主仓库的 README、CMake 配置和公开 docs，介绍 W00 如何作为多 Codex 引擎开发的架构、协调和集成主线。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 525 | <code>        "body_file": "posts/zh/she-workspace-multicodex-integration-spine.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 526 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 527 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 528 | <code>        "title": "SHE Workspace: Using W00 as the Integration Spine for Multi-Codex Engine Work",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 529 | <code>        "summary": "This post uses the SHE-workspace main repository README, CMake setup, and public docs to explain how W00 acts as the architecture, coordination, and integration line for multi-Codex engine development.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 530 | <code>        "body_file": "posts/en/she-workspace-multicodex-integration-spine.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 531 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 532 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 533 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 534 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 535 | <code>    "slug": "baidutieba-python-csv-research-crawler",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 536 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 537 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 538 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 539 | <code>    "tags": ["crawler", "python", "csv", "compliance"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 540 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 541 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 542 | <code>        "title": "BaiduTieba-main：把贴吧关键词采集收进 CSV 研究边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 543 | <code>        "summary": "这篇文章基于 BaiduTieba-main 的 README 和 requirements 文件，介绍它如何用 Python、关键词配置、页码范围、CSV 输出和日志，把贴吧采集做成小范围研究练习，并强调 cookie 与数据发布边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 544 | <code>        "body_file": "posts/zh/baidutieba-python-csv-research-crawler.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 545 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 546 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 547 | <code>        "title": "BaiduTieba-main: Keeping Tieba Keyword Collection Inside a CSV Research Boundary",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 548 | <code>        "summary": "This post uses BaiduTieba-main's README and requirements file to explain how a Python keyword crawler can stay within a small CSV-based research workflow while keeping cookie and data-publishing boundaries explicit.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 549 | <code>        "body_file": "posts/en/baidutieba-python-csv-research-crawler.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 550 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 551 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 552 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 553 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 554 | <code>    "slug": "she-coordination-multicodex-operational-memory",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 555 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 556 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 557 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 558 | <code>    "tags": ["engine", "codex", "workflow", "coordination"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 559 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 560 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 561 | <code>        "title": "SHE Coordination：把多 Codex 协作做成共享运行记忆",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 562 | <code>        "summary": "这篇文章基于 SHE coordination 目录下的 README 文件，介绍它如何用任务板、状态台账、workstream、handoff 和集成影响记录支撑多 Codex 并行开发。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 563 | <code>        "body_file": "posts/zh/she-coordination-multicodex-operational-memory.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 564 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 565 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 566 | <code>        "title": "SHE Coordination: Turning Multi-Codex Work into Shared Operational Memory",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 567 | <code>        "summary": "This post uses the README files in SHE coordination to explain how task boards, status ledgers, workstreams, handoffs, and integration-impact notes support parallel Codex development.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 568 | <code>        "body_file": "posts/en/she-coordination-multicodex-operational-memory.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 569 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 570 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 571 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 572 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 573 | <code>    "slug": "gltf-sample-models-rendering-test-suite",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 574 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 575 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 576 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 577 | <code>    "tags": ["gltf", "rendering", "assets", "testing"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 578 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 579 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 580 | <code>        "title": "glTF Sample Models：把 3D 资产样例做成渲染器测试清单",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 581 | <code>        "summary": "这篇文章基于 glTF Sample Models 的 README 和 glTF 2.0 索引，介绍它如何把三角形、PBR、动画、skinning、材质扩展和边缘案例整理成渲染器与资产管线的测试地图。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 582 | <code>        "body_file": "posts/zh/gltf-sample-models-rendering-test-suite.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 583 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 584 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 585 | <code>        "title": "glTF Sample Models: Turning 3D Assets into a Renderer Test Checklist",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 586 | <code>        "summary": "This post uses the glTF Sample Models README and glTF 2.0 index to explain how the collection turns triangles, PBR, animation, skinning, material extensions, and edge cases into a renderer and asset-pipeline test map.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 587 | <code>        "body_file": "posts/en/gltf-sample-models-rendering-test-suite.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 588 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 589 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 590 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 591 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 592 | <code>    "slug": "dify-llm-app-platform-workflow-rag-llmops",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 593 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 594 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 595 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 596 | <code>    "tags": ["llm", "workflow", "rag", "llmops"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 597 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 598 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 599 | <code>        "title": "Dify：把 LLM 应用开发收进工作流、RAG 和 LLMOps 平台",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 600 | <code>        "summary": "这篇文章基于 Dify 的 README，介绍它如何把可视化工作流、RAG、Agent、模型管理、可观测性和 API 集成整理成面向生产的 LLM 应用平台。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 601 | <code>        "body_file": "posts/zh/dify-llm-app-platform-workflow-rag-llmops.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 602 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 603 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 604 | <code>        "title": "Dify: Turning LLM App Development into Workflow, RAG, and LLMOps",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 605 | <code>        "summary": "This post uses Dify's README to explain how the platform combines visual workflows, RAG, agents, model management, observability, and APIs into a production-oriented LLM app platform.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 606 | <code>        "body_file": "posts/en/dify-llm-app-platform-workflow-rag-llmops.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 607 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 608 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 609 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 610 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 611 | <code>    "slug": "acl-style-files-latex-submission-contract",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 612 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 613 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 614 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 615 | <code>    "tags": ["publishing", "latex", "acl", "templates"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 616 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 617 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 618 | <code>        "title": "ACL Style Files：把论文模板当成投稿契约",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 619 | <code>        "summary": "这篇文章基于 ACL style files 的 README，介绍官方 LaTeX 模板如何把作者写作、格式边界、出版主席维护和后续格式预检连接成一条投稿契约。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 620 | <code>        "body_file": "posts/zh/acl-style-files-latex-submission-contract.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 621 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 622 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 623 | <code>        "title": "ACL Style Files: Treating the Paper Template as a Submission Contract",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 624 | <code>        "summary": "This post uses the ACL style files README to explain how the official LaTeX templates connect authoring, formatting boundaries, publication-chair maintenance, and later validation into one submission contract.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 625 | <code>        "body_file": "posts/en/acl-style-files-latex-submission-contract.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 626 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 627 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 628 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 629 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 630 | <code>    "slug": "apache-maven-pom-build-documentation-contract",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 631 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 632 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 633 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 634 | <code>    "tags": ["java", "maven", "build", "docs"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 635 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 636 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 637 | <code>        "title": "Apache Maven：用 POM 把 Java 构建、报告和文档收进同一个入口",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 638 | <code>        "summary": "这篇文章基于 Apache Maven 本地分发目录的 README，介绍 Maven 如何用 POM 把构建、报告和文档整理成可被人、CI 和自动化工具共同理解的工程契约。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 639 | <code>        "body_file": "posts/zh/apache-maven-pom-build-documentation-contract.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 640 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 641 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 642 | <code>        "title": "Apache Maven: Using the POM as a Build, Reporting, and Documentation Contract",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 643 | <code>        "summary": "This post uses the Apache Maven README to explain how Maven uses the POM to turn builds, reporting, and documentation into a contract that humans, CI systems, and automation tools can inspect.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 644 | <code>        "body_file": "posts/en/apache-maven-pom-build-documentation-contract.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 645 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 646 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 647 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 648 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 649 | <code>    "slug": "krkrz-visual-novel-runtime-compatibility",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 650 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 651 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 652 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 653 | <code>    "tags": ["gamedev", "runtime", "visual-novel", "compatibility"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 654 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 655 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 656 | <code>        "title": "吉里吉里Z：把视觉小说运行时做成清晰的兼容边界",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 657 | <code>        "summary": "这篇文章基于吉里吉里Z 本地分发目录的 README，介绍它如何把 2D 游戏运行时、KAG 视觉小说入口、插件化能力和吉里吉里2迁移注意事项整理成清晰边界。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 658 | <code>        "body_file": "posts/zh/krkrz-visual-novel-runtime-compatibility.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 659 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 660 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 661 | <code>        "title": "Kirikiri Z: Drawing a Clear Compatibility Boundary for a Visual Novel Runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 662 | <code>        "summary": "This post uses the Kirikiri Z README to explain how the runtime frames 2D game hosting, KAG visual-novel authoring, pluginized capabilities, and Kirikiri2 migration notes.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 663 | <code>        "body_file": "posts/en/krkrz-visual-novel-runtime-compatibility.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 664 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 665 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 666 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 667 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 668 | <code>    "slug": "notepad-plus-plus-local-tool-inventory",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 669 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 670 | <code>    "reading_time": "4 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 671 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 672 | <code>    "tags": ["tools", "editor", "workflow", "windows"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 673 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 674 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 675 | <code>        "title": "Notepad++：把轻量编辑器纳入本地工具清单",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 676 | <code>        "summary": "这篇文章基于 Notepad++ 的本地 README，介绍如何只用软件名、版本和启动入口等低风险信息，把轻量编辑器记录成本机工具链的一部分。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 677 | <code>        "body_file": "posts/zh/notepad-plus-plus-local-tool-inventory.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 678 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 679 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 680 | <code>        "title": "Notepad++: Treating a Lightweight Editor as Part of the Local Tool Inventory",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 681 | <code>        "summary": "This post uses the local Notepad++ README to explain how a lightweight editor can be documented through low-risk metadata such as name, version, and launch boundary.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 682 | <code>        "body_file": "posts/en/notepad-plus-plus-local-tool-inventory.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 683 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 684 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 685 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 686 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 687 | <code>    "slug": "jupyter-notebook-local-lab-entrypoint",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 688 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 689 | <code>    "reading_time": "4 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 690 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 691 | <code>    "tags": ["tools", "notebook", "python", "workflow"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 692 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 693 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 694 | <code>        "title": "Jupyter Notebook：把本地实验入口整理成可控工作台",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 695 | <code>        "summary": "这篇文章基于 JupyterNotebook 的本地 README，介绍如何把 Miniconda、Notebook 工作目录和启动入口整理成安全克制的本地研究工作台记录。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 696 | <code>        "body_file": "posts/zh/jupyter-notebook-local-lab-entrypoint.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 697 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 698 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 699 | <code>        "title": "Jupyter Notebook: Turning a Local Research Entry Point into a Controlled Workbench",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 700 | <code>        "summary": "This post uses the local JupyterNotebook README to explain how a Miniconda-backed notebook workspace can be documented as a safe, repeatable research entry point.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 701 | <code>        "body_file": "posts/en/jupyter-notebook-local-lab-entrypoint.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 702 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 703 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 704 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 705 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 706 | <code>    "slug": "mysql-workbench-visual-database-workbench",</code> | 结构化数据字段 `slug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 707 | <code>    "published_at": "2026-04-22",</code> | 结构化数据字段 `published_at`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 708 | <code>    "reading_time": "5 min",</code> | 结构化数据字段 `reading_time`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 709 | <code>    "featured": false,</code> | 结构化数据字段 `featured`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 710 | <code>    "tags": ["database", "mysql", "tools", "workflow"],</code> | 结构化数据字段 `tags`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 711 | <code>    "translations": {</code> | 结构化数据字段 `translations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 712 | <code>      "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 713 | <code>        "title": "MySQL Workbench：把数据库连接、建模和运维放进一个可视化工作台",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 714 | <code>        "summary": "这篇文章基于 MySQL Workbench 本地 README，介绍它如何把 SQL 开发、数据建模、服务器管理、数据迁移和企业能力整理成一个可视化数据库工作台。",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 715 | <code>        "body_file": "posts/zh/mysql-workbench-visual-database-workbench.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 716 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 717 | <code>      "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 718 | <code>        "title": "MySQL Workbench: Bringing SQL, Modeling, and Administration into One Visual Workbench",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 719 | <code>        "summary": "This post uses the local MySQL Workbench README to explain how it brings SQL development, data modeling, server administration, migration, and enterprise support into one visual database workbench.",</code> | 结构化数据字段 `summary`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 720 | <code>        "body_file": "posts/en/mysql-workbench-visual-database-workbench.md"</code> | 结构化数据字段 `body_file`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 721 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 722 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 723 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 724 | <code>]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
