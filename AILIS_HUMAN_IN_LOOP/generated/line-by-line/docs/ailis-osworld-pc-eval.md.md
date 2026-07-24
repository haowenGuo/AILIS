# docs/ailis-osworld-pc-eval.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：96
- SHA-256：`f0addebb963cc934e0d2f4885fe9cf451c75699c342e65e3f934061b4b4132ef`
- 可运行副本：[打开源文件](../../../source/docs/ailis-osworld-pc-eval.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS OSWorld PC Evaluation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>OSWorld is the external benchmark for AILIS's PC operation layer. It should be used to improve desktop observation, GUI input, recovery, and task execution stability before broader platform migration.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Current Local Status</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The OSWorld source is expected at:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>F:\AILIS\build-cache\OSWorld</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>Run the local readiness probe:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 16 | <code>pnpm bench:osworld:readiness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>The report is written to:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 22 | <code>eval-results/engineering/osworld-pc-readiness/osworld-pc-readiness.report.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>eval-results/engineering/osworld-pc-readiness/osworld-pc-readiness.report.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>## Official OSWorld Requirements</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>Official OSWorld runs need one desktop VM provider:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>- VMware Workstation Pro with `vmrun`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- VirtualBox with `VBoxManage`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Docker/KVM on Linux or a suitable Docker Desktop backend</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- Cloud providers such as AWS for parallel verified runs</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Without a provider, AILIS can still run readiness checks and local PC-tool smoke tests, but it cannot complete official OSWorld trajectories.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>## Current Working Route</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>On this machine, Windows native VMware/VirtualBox/Docker is not available, but WSL Ubuntu 22.04 has Docker and `/dev/kvm`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>Use the WSL route:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>bash /mnt/f/AILIS/scripts/setup-osworld-wsl.sh full</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>Then run the official OSWorld quickstart:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>pnpm bench:osworld:quickstart:wsl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>The OSWorld Docker VM image is large. Store it on the WSL filesystem, not `F:`, because `F:` may not have enough free space:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 56 | <code>mkdir -p /root/osworld-docker-vm-data</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>cd /mnt/f/AILIS/build-cache/OSWorld</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>rm -rf docker_vm_data</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>ln -s /root/osworld-docker-vm-data docker_vm_data</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>If Docker Hub times out while pulling the OSWorld container image, use a mirror and tag it back to the name expected by OSWorld:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 65 | <code>docker pull docker.1ms.run/happysixd/osworld-docker:latest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>docker tag docker.1ms.run/happysixd/osworld-docker:latest happysixd/osworld-docker:latest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>## AILIS PC Capability Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>The `computer` tool now exposes OSWorld-style PC primitives:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>- `screen_screenshot`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- `mouse_move`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- `mouse_click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- `mouse_double_click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- `mouse_right_click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- `mouse_drag`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- `scroll`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- `keyboard_type`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- `keyboard_press`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 82 | <code>- `keyboard_hotkey`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 83 | <code>- `clipboard_read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>- `clipboard_write`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- `wait`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>These sit beside the existing filesystem, process, PTY, watch, rollback, and command actions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>## Evaluation Flow</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>1. Run `pnpm bench:osworld:readiness`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>2. Install or connect one official OSWorld provider.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>3. Run OSWorld `quickstart.py` with that provider.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>4. Add an AILIS OSWorld agent wrapper that maps OSWorld observations into AILIS vision context and maps AILIS PC actions into OSWorld actions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>5. Start with `evaluation_examples/test_small.json`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>6. Use trajectory failures to tune AILIS's computer tool, evidence ledger, recovery loop, and persona surface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
