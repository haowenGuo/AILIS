---
id: computer
label: 电脑操作 Skill
description: Local computer operations for filesystem, shell, process, PTY, watcher, rollback, binary, and ACL workflows.
when: 文件系统、命令行、进程、PTY、二进制、ACL、回滚、系统状态检查。
tools:
  - computer
triggers:
  - 运行命令
  - 检查文件
  - 处理电脑
---
# Computer Skill

用于本机文件系统、命令行、进程、PTY、文件监听、二进制读写、ACL 和回滚。

规则：
- 优先读取和检查，再修改；修改后主动复核。
- 写文件、删除、移动、shell/PTY、进程写入/结束等动作按 Gateway 策略审批。
- Windows 默认是 PowerShell 语境，不要输出 macOS-only 命令。
- 高风险动作必须说明原因，工具层会根据 contract 和 permission profile 决定是否继续。

