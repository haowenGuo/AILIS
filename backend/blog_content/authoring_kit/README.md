# AIGril Blog Authoring Kit

以后如果你要发博客，或者让其他 AI 帮你发博客，直接把整个 `authoring_kit` 文件夹交给它就可以。

## 这个文件夹里有什么

- `PUBLISHING_GUIDE.md`
  - 完整发文规范
  - 规定能改什么、不能改什么、文章必须满足什么格式

- `post_template_zh.md`
  - 中文文章模板

- `post_template_en.md`
  - 英文文章模板

- `posts_json_entry_template.json`
  - `posts.json` 的标准条目模板

## 正确用法

让其他 AI 发文时，告诉它：

1. 先阅读 `PUBLISHING_GUIDE.md`
2. 按 `post_template_zh.md` 写中文正文
3. 按 `post_template_en.md` 写英文正文
4. 按 `posts_json_entry_template.json` 更新 `backend/blog_content/posts.json`

## 给其他 AI 的标准任务描述

你可以直接复制下面这段：

```md
请严格按照 AIGril 博客发文规范执行，只修改博客内容层：

1. 阅读 `backend/blog_content/authoring_kit/PUBLISHING_GUIDE.md`
2. 新增中文文章到 `backend/blog_content/posts/zh/<slug>.md`
3. 新增英文文章到 `backend/blog_content/posts/en/<slug>.md`
4. 按 `backend/blog_content/authoring_kit/posts_json_entry_template.json` 的格式更新 `backend/blog_content/posts.json`

要求：
- 必须中英双语
- 不要修改博客代码
- 不要修改部署配置
- 不要覆盖旧文章
- `slug` 使用小写英文和短横线
```

## 你自己只需要记住一件事

以后发文就看这个文件夹，不用再到处找规范。
