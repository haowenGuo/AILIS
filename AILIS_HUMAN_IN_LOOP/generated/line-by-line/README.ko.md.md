# README.ko.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：173
- SHA-256：`65e7e490aebecf5d994fe1f3664c4525a56edfa109f595539ced490bd402e9f5`
- 可运行副本：[打开源文件](../../source/README.ko.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>&lt;div align="center"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>  &lt;h1&gt;AILIS Assistant&lt;/h1&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>  &lt;p&gt;&lt;strong&gt;VRM 캐릭터, 실시간 음성, 시각 컨텍스트, 기억, Codex 스타일 Agent Harness를 갖춘 오픈소스 데스크톱 체화형 AI 어시스턴트입니다.&lt;/strong&gt;&lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>  &lt;p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>    &lt;img alt="Version" src="https://img.shields.io/badge/version-1.1.0-2563eb?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>    &lt;img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>    &lt;img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=for-the-badge"&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>  &lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  &lt;p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>    &lt;a href="README.md"&gt;English&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>    &lt;a href="README.zh-CN.md"&gt;简体中文&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>    &lt;a href="README.ja.md"&gt;日本語&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>    &lt;a href="README.ko.md"&gt;한국어&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>    &lt;a href="README.fr.md"&gt;Français&lt;/a&gt; ·</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>    &lt;a href="README.de.md"&gt;Deutsch&lt;/a&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>  &lt;/p&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>&lt;/div&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## AILIS란 무엇인가</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>AILIS Assistant는 데스크톱 우선으로 설계된 체화형 AI 어시스턴트입니다. 3D VRM 캐릭터, Electron 데스크톱 창, 음성 상호작용, 스크린샷 기반 시각 컨텍스트, 기억, 구조화된 Agent Runtime을 하나의 시스템으로 묶습니다.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>AILIS는 단순한 웹 챗봇이 아닙니다. 사용자의 허가를 받아 화면 맥락을 이해하고, 유용한 선호를 기억하며, 명시적으로 승인된 도구를 통해 실제 작업을 돕는 개인 데스크톱 어시스턴트를 목표로 합니다.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>## 프로젝트 방향</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>AILIS는 표현력 있는 캐릭터 경험과 신뢰할 수 있는 작업 실행 능력을 함께 추구합니다.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>- 존재감, 표정, 동작, 음성, 관계감을 가진 캐릭터 레이어.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- 계획, 도구 라우팅, 승인, 증거 로그, 복구를 담당하는 Agent Harness.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- 설정, 기억, 로그, 모델 구성을 사용자의 기기에 두는 로컬 우선 데스크톱 runtime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>## 현재 기능</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- 표정, 모션, 립싱크, 대화 말풍선을 지원하는 VRM 데스크톱 캐릭터.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Electron 펫 창, 채팅 창, 제어판, 트레이 통합, 로컬 상태 저장.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- 사용자 지정 base URL과 로컬 모델 워크플로를 포함한 OpenAI 호환 모델 제공자 설정.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- 데스크톱 TTS worker, 클라우드 음성 경로, 선택적 로컬 음성 인식 worker.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- 스크린샷, 창, 영역 캡처를 통한 권한 인식 시각 컨텍스트.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- 기억 블록, 프로젝트 컨텍스트, 관계 상태, 가벼운 reflection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- 파일, 코드, 컴퓨터 조작, 이메일, MCP 기술, Web/Search, 로컬 runtime 도구 레이어.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- 파일, 앱, 계정, 외부 서비스에 영향을 주는 작업을 위한 명시적 승인 모델.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- 인간다운 경험 평가, 도구 계약 테스트, Gateway 검사, Agent 실행 smoke test.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>## 아키텍처</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>사용자 / 음성 / 화면</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>AILIS Desktop UI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  - VRM 캐릭터</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>  - 채팅 창</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>  - 제어판</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 58 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>Agent Harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>  - planner</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>  - tool router</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>  - approval gate</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>  - evidence log</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>  - recovery loop</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>Runtime Services</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>  - model providers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>  - voice / ASR / TTS</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>  - vision capture</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>  - memory store</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>  - local tools / MCP</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 74 | <code>        v</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>Validation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>  - tests</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>  - evals</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>  - smoke checks</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>## 저장소 구조</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 84 | <code>electron/   Electron 메인 프로세스, preload bridge, runtime service, 로컬 도구 adapter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>src/        펫, 채팅, 제어판, 음성, 시각 UI, 말풍선 renderer 앱</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>backend/    선택적 FastAPI backend, API schema, 기억 service, 정적 asset</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>Resources/  VRM model, VRMA motion, reference audio, character asset</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>docs/       아키텍처, 기억, 도구 생태계, 평가, release planning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>evals/      인간다운 경험과 장기 동반자 평가 scenario data</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>scripts/    runtime 준비, validation, smoke test, benchmark, packaging helper</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>tests/      runtime, memory, tools, contracts, gateway, agent behavior 테스트</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>## 빠른 시작</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 97 | <code>pnpm install</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>pnpm desktop:dev</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>빌드 후 실행:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 104 | <code>pnpm desktop:start</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>Windows 데스크톱 앱 패키징:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 110 | <code>pnpm desktop:package</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>선택적 backend:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 116 | <code>python -m venv .venv</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>.venv\Scripts\activate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>pip install -r requirements.txt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>copy backend\.env.example backend\.env</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>python -m uvicorn backend.main:app --reload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>## 모델 및 음성 설정</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>AILIS는 애플리케이션 레벨에서 특정 모델 제공자에 고정되지 않습니다. 데스크톱 제어판이나 로컬 환경 파일에서 설정할 수 있습니다.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>- OpenAI 호환 클라우드 제공자.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- 로컬 vLLM endpoint.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- Ollama 지향 로컬 workflow.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- 사용자 지정 base URL, model name, timeout, private API key.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- 선택적 local ASR 및 desktop TTS runtime preparation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>실제 API key, 계정 자격 증명, 대화 기록, 로컬 모델 cache, runtime log, 생성된 eval output을 저장소에 커밋하지 마세요.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>## 자주 쓰는 명령</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 138 | <code>pnpm test:ailis-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>pnpm test:ailis-memory</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>pnpm ailis:validate-harness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>전체 Gateway 검증:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 148 | <code>pnpm ailis:validate-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>## 핵심 문서</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- [Humanlike Eval](docs/ailis-humanlike-eval.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>## 상태</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>현재 release line: `v1.1.0`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>AILIS는 활발히 개발 중입니다. 데스크톱 runtime, Agent Harness, 도구 레이어, 평가 표면은 이미 상당하지만, 아직 production-grade Agent OS가 아니라 alpha 단계의 product/runtime으로 보는 것이 맞습니다. 단기 우선순위는 도구 계약, 승인 안전성, 기억 품질, 로컬 모델 설정, end-to-end 평가를 강화하는 것입니다.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## 개인정보와 안전</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>- 시각 캡처는 권한을 전제로 하며, 맥락 이해를 위해 사용됩니다.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- 파일, 앱, 계정, 외부 서비스에 영향을 주는 작업은 명시적 승인을 거칩니다.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- 기억과 runtime state는 사용자가 선택하지 않는 한 로컬에 남습니다.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- secret은 로컬 설정에 두고 source control에 포함하지 않습니다.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>## 라이선스</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>AILIS source code는 [MIT License](LICENSE)로 공개됩니다. 일부 bundled asset, third-party model, motion, voice resource는 별도 라이선스를 가질 수 있으므로 재배포 전에 각 asset 설명을 확인하세요.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
