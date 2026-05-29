# AIGril Blog Publishing Guide

这份文档是给“帮你发文的其他 AI”准备的。

目标很简单：只改内容层，不碰页面逻辑；按统一格式新增文章；保证中英双语、结构稳定、可直接部署。

## 1. 允许修改的文件范围

正常发一篇新文章时，只应该修改下面 3 类内容：

- `backend/blog_content/posts.json`
- `backend/blog_content/posts/zh/<slug>.md`
- `backend/blog_content/posts/en/<slug>.md`

如果只是写文章，不要修改：

- `backend/api/blog.py`
- `backend/services/blog_service.py`
- 前端页面代码
- 任何部署配置

## 2. 目录结构

- `backend/blog_content/site.json`
  - 站点级静态文案
  - 一般只有在修改博客首页、About、Projects、Writing 页面时才需要动

- `backend/blog_content/posts.json`
  - 全部文章的元数据索引
  - 每新增一篇文章，必须新增一条记录

- `backend/blog_content/posts/zh/`
  - 中文正文

- `backend/blog_content/posts/en/`
  - 英文正文

## 3. 发文硬性规则

### 3.1 必须双语

每篇文章都必须同时提供：

- 中文版 Markdown
- 英文版 Markdown

不允许只发单语版本，除非维护者明确说明本次可以例外。

### 3.2 `slug` 规则

`slug` 是文章唯一标识，必须满足：

- 只使用小写英文字母、数字、短横线 `-`
- 不使用空格
- 不使用中文
- 必须全站唯一

示例：

- `my-first-post`
- `render-deployment-notes`
- `weekly-devlog-01`

### 3.3 文件命名规则

中英两个正文文件名必须和 `slug` 完全一致：

- `backend/blog_content/posts/zh/<slug>.md`
- `backend/blog_content/posts/en/<slug>.md`

例如 `slug = "render-deployment-notes"` 时：

- `backend/blog_content/posts/zh/render-deployment-notes.md`
- `backend/blog_content/posts/en/render-deployment-notes.md`

### 3.4 日期格式

`published_at` 必须使用：

- `YYYY-MM-DD`

示例：

- `2026-04-17`

### 3.5 标签规则

`tags` 建议控制在 2 到 5 个之间：

- 使用英文小写
- 尽量短
- 语义明确

示例：

- `["ai", "devlog", "render"]`
- `["blog", "notes"]`

### 3.6 阅读时长

`reading_time` 使用简洁格式：

- `2 min`
- `5 min`
- `8 min`

不要写成段落说明。

### 3.7 `featured` 规则

只有以下内容才建议设为 `true`：

- 博客首页希望重点展示的文章
- 项目介绍类文章
- 阶段性总结

普通文章默认使用 `false`。

## 4. `posts.json` 条目格式

新增文章时，在 `backend/blog_content/posts.json` 中追加一条对象，格式如下：

```json
{
  "slug": "my-new-post",
  "published_at": "2026-04-17",
  "reading_time": "4 min",
  "featured": false,
  "tags": ["ai", "devlog"],
  "translations": {
    "zh": {
      "title": "中文标题",
      "summary": "中文摘要，1 到 2 句即可。",
      "body_file": "posts/zh/my-new-post.md"
    },
    "en": {
      "title": "English Title",
      "summary": "English summary in one or two sentences.",
      "body_file": "posts/en/my-new-post.md"
    }
  }
}
```

## 5. Markdown 正文写法

### 5.1 推荐结构

每篇文章建议使用下面的结构：

1. 标题
2. 简短引言
3. 2 到 4 个正文小节
4. 结尾总结

### 5.2 标题要求

Markdown 第一行必须是一级标题：

```md
# Your Title
```

标题应与 `posts.json` 中对应语言的 `title` 基本一致。

### 5.3 内容风格

建议遵循：

- 信息密度高
- 段落短
- 标题清楚
- 少空话，多事实
- 适合网页快速阅读

### 5.4 不要做的事

不要在正文里放：

- API Key
- 本地绝对路径
- 内网地址
- 需要保密的部署细节
- 未经确认的对外承诺

### 5.5 链接规范

外部链接使用完整 URL。

例如：

```md
[Render](https://render.com/)
```

## 6. 推荐写作工作流

当其他 AI 帮你发文时，应该按这个顺序执行：

1. 先确定文章主题、标题、`slug`
2. 写中文正文 `posts/zh/<slug>.md`
3. 写英文正文 `posts/en/<slug>.md`
4. 在 `posts.json` 中新增元数据
5. 检查 JSON 是否合法
6. 检查中英文页面路径是否都能访问

## 7. AI 执行约束

这是给其他 AI 的明确规则：

- 默认只新增文章，不修改旧文章
- 默认只修改内容层，不修改博客代码
- 如果信息不完整，优先做保守假设
- 假设必须体现在提交说明里
- 不要删除现有文章
- 不要覆盖已有 `slug`
- 不要因为补文章而顺手重构博客系统

## 8. 发文前检查清单

提交前必须确认：

- 已新增中文 Markdown 文件
- 已新增英文 Markdown 文件
- `posts.json` 是合法 JSON
- `slug` 没有重复
- `body_file` 路径正确
- 中文页面路径可用：`/blog/<slug>`
- 英文页面路径可用：`/en/blog/<slug>`

## 9. 给其他 AI 的标准任务描述

以后你可以直接把下面这段发给别的 AI：

```md
请按 AIGril 博客发文规范新增一篇文章，只修改博客内容层：

1. 新增中文正文到 `backend/blog_content/posts/zh/<slug>.md`
2. 新增英文正文到 `backend/blog_content/posts/en/<slug>.md`
3. 在 `backend/blog_content/posts.json` 中新增对应元数据

要求：
- 必须中英双语
- 不要修改博客页面代码
- 不要修改部署配置
- `slug` 使用小写英文和短横线
- 标题、摘要、标签、阅读时长都要补全
```

## 10. 模板文件

可直接参考：

- `backend/blog_content/templates/post_template_zh.md`
- `backend/blog_content/templates/post_template_en.md`
- `backend/blog_content/templates/posts_json_entry_template.json`
