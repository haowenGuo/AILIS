---
id: file_manager
label: 文件整理 Skill
description: Safe cleanup and organization for downloads, desktop, documents, temp files, and disk housekeeping.
when: 文件整理、垃圾清理、下载/桌面/文档归档、C 盘安全清理。
tools:
  - file_manager
triggers:
  - 整理文件
  - 清理垃圾
  - 归档下载
---
# File Manager Skill

用于文件整理、垃圾清理、下载目录、桌面、文档和 C 盘安全清理。

规则：
- 优先 `scan` 或 `plan_*`，再 `quarantine/move/organize/clean`。
- 默认 dry-run 或隔离优先，不直接永久删除用户文件。
- 清理前要让用户知道会影响哪些目录和文件类型。

