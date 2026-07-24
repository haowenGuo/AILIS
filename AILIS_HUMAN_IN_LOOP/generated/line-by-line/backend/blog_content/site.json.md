# backend/blog_content/site.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`structured-data`
- 原始行数：169
- SHA-256：`b266b5733c97c9f7b5a6d2e8e2e535a6213bd53fd69de15da20dad82d64c0d9a`
- 可运行副本：[打开源文件](../../../../source/backend/blog_content/site.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "default_locale": "zh",</code> | 结构化数据字段 `default_locale`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "locales": {</code> | 结构化数据字段 `locales`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>    "zh": {</code> | 结构化数据字段 `zh`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>      "site_title": "郭浩文",</code> | 结构化数据字段 `site_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>      "site_subtitle": "个人博客 · 项目 · 笔记",</code> | 结构化数据字段 `site_subtitle`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>      "hero_title": "把系统、虚拟人和想法，持续地做出来，也写出来。",</code> | 结构化数据字段 `hero_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>      "hero_intro": "这是一个偏写作优先的个人博客框架。结构参考了几种非常成熟的个人博客写法：Paul Graham 的简洁文章流、Josh Comeau 的个人主页式入口，以及 swyx 的 About / Projects / Writing 分层。",</code> | 结构化数据字段 `hero_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>      "bio": "郭浩文，主要关注图形渲染、虚拟人交互、大模型应用工程，以及把想法真正做成可部署系统的过程。这里后续会持续更新项目记录、技术笔记、开发日志和随笔。",</code> | 结构化数据字段 `bio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>      "location": "武汉 / 中国",</code> | 结构化数据字段 `location`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>      "email": "1910481404@qq.com",</code> | 结构化数据字段 `email`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>      "github": "https://github.com/haowenGuo",</code> | 结构化数据字段 `github`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      "x": "",</code> | 结构化数据字段 `x`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>      "now_title": "Now",</code> | 结构化数据字段 `now_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>      "now_text": "当前重点：把个人项目、技术文章和实验记录系统化整理出来，逐步形成稳定的个人表达空间。",</code> | 结构化数据字段 `now_text`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>      "nav": {</code> | 结构化数据字段 `nav`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>        "home": "首页",</code> | 结构化数据字段 `home`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>        "about": "关于",</code> | 结构化数据字段 `about`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>        "projects": "项目",</code> | 结构化数据字段 `projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>        "writing": "写作"</code> | 结构化数据字段 `writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 22 | <code>      "labels": {</code> | 结构化数据字段 `labels`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>        "recent_writing": "最近写作",</code> | 结构化数据字段 `recent_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>        "recent_posts": "最近文章",</code> | 结构化数据字段 `recent_posts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>        "featured_writing": "精选写作",</code> | 结构化数据字段 `featured_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>        "start_here": "从这里开始",</code> | 结构化数据字段 `start_here`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>        "projects": "项目",</code> | 结构化数据字段 `projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>        "selected_work": "代表项目",</code> | 结构化数据字段 `selected_work`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>        "inspiration": "参考",</code> | 结构化数据字段 `inspiration`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>        "blog_references": "博客参考",</code> | 结构化数据字段 `blog_references`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>        "how_to_update": "如何更新",</code> | 结构化数据字段 `how_to_update`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>        "future_workflow": "后续更新方式",</code> | 结构化数据字段 `future_workflow`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>        "about": "关于",</code> | 结构化数据字段 `about`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>        "base": "基本信息",</code> | 结构化数据字段 `base`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>        "writing": "写作",</code> | 结构化数据字段 `writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>        "all_writing": "全部文章",</code> | 结构化数据字段 `all_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>        "project": "项目",</code> | 结构化数据字段 `project`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>        "read_more": "了解更多",</code> | 结构化数据字段 `read_more`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>        "read_writing": "阅读文章",</code> | 结构化数据字段 `read_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>        "view_projects": "查看项目",</code> | 结构化数据字段 `view_projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>        "about_me": "关于我",</code> | 结构化数据字段 `about_me`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>        "back_to_writing": "← 返回文章列表"</code> | 结构化数据字段 `back_to_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 44 | <code>      "about_sections": [</code> | 结构化数据字段 `about_sections`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 46 | <code>          "title": "关于我",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>          "body": "我主要关注图形渲染、虚拟人交互、大模型应用工程，以及把想法真正做成可部署系统的过程。这个博客后续会逐步承接这些内容。"</code> | 结构化数据字段 `body`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 49 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 50 | <code>          "title": "我会写什么",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>          "body": "博客将主要记录项目复盘、技术实现、开发日志、个人想法，以及一些更长期的研究兴趣。"</code> | 结构化数据字段 `body`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 53 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 54 | <code>      "projects_intro": "这里会逐步收录我认为值得长期维护和展示的项目。当前先保留最核心的两个入口，后面你只需要继续往 site.json 里追加项目即可。",</code> | 结构化数据字段 `projects_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>      "writing_intro": "这里是文章列表页。后续无论你写项目复盘、技术笔记、周记还是更个人化的随笔，都可以沿用同一套结构。",</code> | 结构化数据字段 `writing_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      "featured_projects": [</code> | 结构化数据字段 `featured_projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 58 | <code>          "name": "AILIS / AILIS",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 59 | <code>          "description": "一个基于浏览器的 3D 虚拟人项目，包含 VRM 渲染、动作表情联动、流式对话和记忆系统。",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 60 | <code>          "link": "https://haowenGuo.github.io/AILIS/?backend=https://airi-backend.onrender.com"</code> | 结构化数据字段 `link`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 62 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 63 | <code>          "name": "AI Safety API",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>          "description": "部署在同一 Render 服务中的内容安全审核接口，提供综合判定和多算法结果。",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>          "link": "https://airi-backend.onrender.com/docs"</code> | 结构化数据字段 `link`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 67 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 68 | <code>      "inspirations": [</code> | 结构化数据字段 `inspirations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 70 | <code>          "name": "Paul Graham",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 71 | <code>          "url": "https://paulgraham.com/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 72 | <code>          "note": "文章优先、极简结构"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 74 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 75 | <code>          "name": "Josh Comeau",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>          "url": "https://www.joshwcomeau.com/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 77 | <code>          "note": "首页像个人品牌入口，信息组织清晰"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 78 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 79 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 80 | <code>          "name": "swyx",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>          "url": "https://www.swyx.io/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>          "note": "About / Projects / Writing 分层明确"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 84 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 85 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 86 | <code>    "en": {</code> | 结构化数据字段 `en`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>      "site_title": "HaoWen Guo",</code> | 结构化数据字段 `site_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>      "site_subtitle": "Personal blog · projects · notes",</code> | 结构化数据字段 `site_subtitle`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>      "hero_title": "Building systems, avatars, and ideas in public.",</code> | 结构化数据字段 `hero_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 90 | <code>      "hero_intro": "This is a writing-first personal blog framework. The structure borrows from several mature blogs: the simplicity of Paul Graham, the strong homepage identity of Josh Comeau, and the About / Projects / Writing split used by swyx.",</code> | 结构化数据字段 `hero_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>      "bio": "HaoWen Guo works around graphics, virtual characters, AI application engineering, and the process of turning ideas into deployable systems. This blog will gradually collect project notes, technical writing, devlogs, and essays.",</code> | 结构化数据字段 `bio`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>      "location": "Wuhan / China",</code> | 结构化数据字段 `location`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>      "email": "1910481404@qq.com",</code> | 结构化数据字段 `email`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>      "github": "https://github.com/haowenGuo",</code> | 结构化数据字段 `github`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 95 | <code>      "x": "",</code> | 结构化数据字段 `x`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 96 | <code>      "now_title": "Now",</code> | 结构化数据字段 `now_title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 97 | <code>      "now_text": "Current focus: turning personal projects, technical writing, and experimental notes into a stable long-term body of work.",</code> | 结构化数据字段 `now_text`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 98 | <code>      "nav": {</code> | 结构化数据字段 `nav`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 99 | <code>        "home": "Home",</code> | 结构化数据字段 `home`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 100 | <code>        "about": "About",</code> | 结构化数据字段 `about`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>        "projects": "Projects",</code> | 结构化数据字段 `projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 102 | <code>        "writing": "Writing"</code> | 结构化数据字段 `writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 103 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 104 | <code>      "labels": {</code> | 结构化数据字段 `labels`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>        "recent_writing": "Recent writing",</code> | 结构化数据字段 `recent_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>        "recent_posts": "Recent posts",</code> | 结构化数据字段 `recent_posts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>        "featured_writing": "Featured writing",</code> | 结构化数据字段 `featured_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>        "start_here": "Start here",</code> | 结构化数据字段 `start_here`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 109 | <code>        "projects": "Projects",</code> | 结构化数据字段 `projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>        "selected_work": "Selected work",</code> | 结构化数据字段 `selected_work`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>        "inspiration": "Inspiration",</code> | 结构化数据字段 `inspiration`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>        "blog_references": "Blog references",</code> | 结构化数据字段 `blog_references`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>        "how_to_update": "How to update",</code> | 结构化数据字段 `how_to_update`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 114 | <code>        "future_workflow": "Future workflow",</code> | 结构化数据字段 `future_workflow`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 115 | <code>        "about": "About",</code> | 结构化数据字段 `about`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 116 | <code>        "base": "Base",</code> | 结构化数据字段 `base`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 117 | <code>        "writing": "Writing",</code> | 结构化数据字段 `writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 118 | <code>        "all_writing": "All writing",</code> | 结构化数据字段 `all_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>        "project": "Project",</code> | 结构化数据字段 `project`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>        "read_more": "Read more",</code> | 结构化数据字段 `read_more`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 121 | <code>        "read_writing": "Read writing",</code> | 结构化数据字段 `read_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>        "view_projects": "View projects",</code> | 结构化数据字段 `view_projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 123 | <code>        "about_me": "About me",</code> | 结构化数据字段 `about_me`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 124 | <code>        "back_to_writing": "← Back to writing"</code> | 结构化数据字段 `back_to_writing`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 126 | <code>      "about_sections": [</code> | 结构化数据字段 `about_sections`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 127 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 128 | <code>          "title": "About me",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 129 | <code>          "body": "I work around graphics, virtual character systems, AI application engineering, and the process of turning ideas into something deployable. This blog is meant to hold that body of work over time."</code> | 结构化数据字段 `body`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 130 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 131 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 132 | <code>          "title": "What I write about",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 133 | <code>          "body": "The writing here will mainly cover project breakdowns, implementation notes, devlogs, personal essays, and longer-term research interests."</code> | 结构化数据字段 `body`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 134 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 135 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 136 | <code>      "projects_intro": "This page will gradually collect the projects I want to maintain and present for the long term. For now it keeps the two most representative entries, and later you only need to append more items in site.json.",</code> | 结构化数据字段 `projects_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 137 | <code>      "writing_intro": "This is the archive page for writing. Whether you publish project breakdowns, technical notes, weekly logs, or more personal essays, they can all live in the same structure.",</code> | 结构化数据字段 `writing_intro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 138 | <code>      "featured_projects": [</code> | 结构化数据字段 `featured_projects`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 140 | <code>          "name": "AILIS / AILIS",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>          "description": "A browser-based 3D virtual companion project with VRM rendering, action/expression control, streaming chat, and memory.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 142 | <code>          "link": "https://haowenGuo.github.io/AILIS/?backend=https://airi-backend.onrender.com"</code> | 结构化数据字段 `link`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 143 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 144 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 145 | <code>          "name": "AI Safety API",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 146 | <code>          "description": "A safety moderation API deployed on the same Render backend, returning both aggregate decisions and per-algorithm results.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 147 | <code>          "link": "https://airi-backend.onrender.com/docs"</code> | 结构化数据字段 `link`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 149 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 150 | <code>      "inspirations": [</code> | 结构化数据字段 `inspirations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 151 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 152 | <code>          "name": "Paul Graham",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 153 | <code>          "url": "https://paulgraham.com/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 154 | <code>          "note": "Writing first, radically simple structure"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 155 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 156 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 157 | <code>          "name": "Josh Comeau",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 158 | <code>          "url": "https://www.joshwcomeau.com/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 159 | <code>          "note": "A homepage that works as a personal brand surface"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 161 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 162 | <code>          "name": "swyx",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 163 | <code>          "url": "https://www.swyx.io/",</code> | 结构化数据字段 `url`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>          "note": "Clear About / Projects / Writing information architecture"</code> | 结构化数据字段 `note`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 165 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 166 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 167 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 168 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 169 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
