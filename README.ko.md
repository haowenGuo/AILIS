<div align="center">
  <h1>AILIS Assistant</h1>
  <p><strong>VRM 캐릭터, 실시간 음성, 시각 컨텍스트, 기억, Codex 스타일 Agent Harness를 갖춘 오픈소스 데스크톱 체화형 AI 어시스턴트입니다.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.6-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-059669?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

---

## AILIS란 무엇인가

AILIS Assistant는 데스크톱 우선으로 설계된 체화형 AI 어시스턴트입니다. 3D VRM 캐릭터, Electron 데스크톱 창, 음성 상호작용, 스크린샷 기반 시각 컨텍스트, 기억, 구조화된 Agent Runtime을 하나의 시스템으로 묶습니다.

AILIS는 단순한 웹 챗봇이 아닙니다. 사용자의 허가를 받아 화면 맥락을 이해하고, 유용한 선호를 기억하며, 명시적으로 승인된 도구를 통해 실제 작업을 돕는 개인 데스크톱 어시스턴트를 목표로 합니다.

## 프로젝트 방향

AILIS는 표현력 있는 캐릭터 경험과 신뢰할 수 있는 작업 실행 능력을 함께 추구합니다.

- 존재감, 표정, 동작, 음성, 관계감을 가진 캐릭터 레이어.
- 계획, 도구 라우팅, 승인, 증거 로그, 복구를 담당하는 Agent Harness.
- 설정, 기억, 로그, 모델 구성을 사용자의 기기에 두는 로컬 우선 데스크톱 runtime.

## 현재 기능

- 표정, 모션, 립싱크, 대화 말풍선을 지원하는 VRM 데스크톱 캐릭터.
- Electron 펫 창, 채팅 창, 제어판, 트레이 통합, 로컬 상태 저장.
- 사용자 지정 base URL과 로컬 모델 워크플로를 포함한 OpenAI 호환 모델 제공자 설정.
- 데스크톱 TTS worker, 클라우드 음성 경로, 선택적 로컬 음성 인식 worker.
- 스크린샷, 창, 영역 캡처를 통한 권한 인식 시각 컨텍스트.
- 기억 블록, 프로젝트 컨텍스트, 관계 상태, 가벼운 reflection.
- 파일, 코드, 컴퓨터 조작, 이메일, MCP 기술, Web/Search, 로컬 runtime 도구 레이어.
- 파일, 앱, 계정, 외부 서비스에 영향을 주는 작업을 위한 명시적 승인 모델.
- 인간다운 경험 평가, 도구 계약 테스트, Gateway 검사, Agent 실행 smoke test.

## 아키텍처

```text
사용자 / 음성 / 화면
        |
        v
AILIS Desktop UI
  - VRM 캐릭터
  - 채팅 창
  - 제어판
        |
        v
Agent Harness
  - planner
  - tool router
  - approval gate
  - evidence log
  - recovery loop
        |
        v
Runtime Services
  - model providers
  - voice / ASR / TTS
  - vision capture
  - memory store
  - local tools / MCP
        |
        v
Validation
  - tests
  - evals
  - smoke checks
```

## 저장소 구조

```text
electron/   Electron 메인 프로세스, preload bridge, runtime service, 로컬 도구 adapter
src/        펫, 채팅, 제어판, 음성, 시각 UI, 말풍선 renderer 앱
backend/    선택적 FastAPI backend, API schema, 기억 service, 정적 asset
Resources/  VRM model, VRMA motion, reference audio, character asset
docs/       아키텍처, 기억, 도구 생태계, 평가, release planning
evals/      인간다운 경험과 장기 동반자 평가 scenario data
scripts/    runtime 준비, validation, smoke test, benchmark, packaging helper
tests/      runtime, memory, tools, contracts, gateway, agent behavior 테스트
```

## 빠른 시작

```bash
pnpm install
pnpm desktop:dev
```

빌드 후 실행:

```bash
pnpm desktop:start
```

Windows 데스크톱 앱 패키징:

```bash
pnpm desktop:package
```

선택적 backend:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 모델 및 음성 설정

AILIS는 애플리케이션 레벨에서 특정 모델 제공자에 고정되지 않습니다. 데스크톱 제어판이나 로컬 환경 파일에서 설정할 수 있습니다.

- OpenAI 호환 클라우드 제공자.
- 로컬 vLLM endpoint.
- Ollama 지향 로컬 workflow.
- 사용자 지정 base URL, model name, timeout, private API key.
- 선택적 local ASR 및 desktop TTS runtime preparation.

실제 API key, 계정 자격 증명, 대화 기록, 로컬 모델 cache, runtime log, 생성된 eval output을 저장소에 커밋하지 마세요.

## 자주 쓰는 명령

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

전체 Gateway 검증:

```bash
pnpm ailis:validate-gateway
```

## 핵심 문서

- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## 상태

현재 release line: `v1.0.6`.

AILIS는 활발히 개발 중입니다. 데스크톱 runtime, Agent Harness, 도구 레이어, 평가 표면은 이미 상당하지만, 아직 production-grade Agent OS가 아니라 alpha 단계의 product/runtime으로 보는 것이 맞습니다. 단기 우선순위는 도구 계약, 승인 안전성, 기억 품질, 로컬 모델 설정, end-to-end 평가를 강화하는 것입니다.

## 개인정보와 안전

- 시각 캡처는 권한을 전제로 하며, 맥락 이해를 위해 사용됩니다.
- 파일, 앱, 계정, 외부 서비스에 영향을 주는 작업은 명시적 승인을 거칩니다.
- 기억과 runtime state는 사용자가 선택하지 않는 한 로컬에 남습니다.
- secret은 로컬 설정에 두고 source control에 포함하지 않습니다.

## 라이선스

AILIS source code는 [Apache License 2.0](LICENSE)로 공개됩니다. 일부 bundled asset, third-party model, motion, voice resource는 별도 라이선스를 가질 수 있으므로 재배포 전에 각 asset 설명을 확인하세요.
