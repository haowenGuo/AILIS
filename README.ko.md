<div align="center">
  <img width="220" alt="손을 흔드는 AILIS" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>보고, 듣고, 기억하며 실제 작업을 끝낼 수 있는 오픈소스 데스크톱 AI 동반자.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.1-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>AILIS 체험</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases"><strong>다운로드</strong></a> ·
    <a href="docs/getting-started.md">빠른 시작</a> ·
    <a href="docs/README.md">문서</a>
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

## 채팅 창 그 이상

AILIS는 데스크톱에서 실제로 함께하는 개인 AI를 목표로 합니다. 보이는 3D 캐릭터, 음성, 표정, 장기 기억에 더해 조사, 파일 읽기, 코드 작성, 콘텐츠 정리, 컴퓨터 조작을 수행하는 Agent Runtime을 갖추고 있습니다.

자연스럽게 말하면 허용된 화면과 파일 컨텍스트를 이해하고, 알맞은 도구를 선택해 작업을 완료하며, 다음 협업에 필요한 선호를 기억합니다.

## 핵심 경험

<table>
  <tr>
    <td width="33%" valign="top"><h3>존재감</h3>표정, 모션, 립싱크, 말풍선을 지원하는 VRM 데스크톱 캐릭터.</td>
    <td width="33%" valign="top"><h3>자연스러운 대화</h3>빠른 텍스트 상호작용과 음성 입력·출력을 함께 제공합니다.</td>
    <td width="33%" valign="top"><h3>컨텍스트 이해</h3>허용된 화면, 창, 영역, 로컬 파일을 이해합니다.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>실행 능력</h3>검색, 코드, 파일, 웹, 이메일, 컴퓨터 작업을 하나의 감사 가능한 경로로 실행합니다.</td>
    <td width="33%" valign="top"><h3>장기 기억</h3>선호, 프로젝트 배경, 관계 컨텍스트를 보존해 협업을 개선합니다.</td>
    <td width="33%" valign="top"><h3>제어 가능</h3>중요한 작업은 승인과 감사 흐름을 거쳐 계획과 결과를 확인할 수 있습니다.</td>
  </tr>
</table>

## AILIS의 동작 방식

| 1. 설명 | 2. 이해 | 3. 실행 | 4. 기억 |
| :---: | :---: | :---: | :---: |
| 목표를 자연스럽게 설명 | 허용된 화면과 파일 읽기 | 검색, 코드, 파일, 컴퓨터 도구 사용 | 선호와 프로젝트 배경 유지 |

## 평가된 Agent 능력

AILIS는 완전한 엔드투엔드 작업으로 평가됩니다. 아래는 고정된 소스(GAIA A6 및 Terminal A7)의 과거 결과이며 v1.4.1의 새 평가 결과가 아닙니다. [버전 및 근거 기록](docs/ailis-version-registry.md)과 [릴리스 노트](docs/releases/v1.4.1.md)를 참고하세요.

| Benchmark | AILIS | Codex, 동일 모델 |
| :--- | ---: | ---: |
| **GAIA public validation · 165 tasks** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 tasks** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center"><a href="docs/evaluation.md"><strong>전체 점수, 효율 지표, 재현 가능한 근거 보기</strong></a></p>

## 현재 제공되는 기능

- [x] Windows 상주 VRM 캐릭터, 채팅 창, 제어판
- [x] 텍스트, 음성, 표정, 모션 기반 실시간 상호작용
- [x] 권한을 고려한 화면, 창, 파일, 코드 컨텍스트
- [x] 검색, 웹, 코드, 파일, 이메일, 컴퓨터 작업 도구
- [x] 선호, 프로젝트, 관계 컨텍스트 장기 기억
- [x] 중요한 작업을 위한 승인, 근거, 복구 경로
- [ ] 장기 작업의 신뢰성, 캐시, 복구 강화
- [ ] 더 완전한 실시간 음성, 크로스 디바이스, 플러그인 경험

## 빠른 시작

[Releases](https://github.com/haowenGuo/AILIS/releases)에서 데스크톱 빌드를 받거나 [웹 체험](https://101.133.239.56/Test/)으로 먼저 만나볼 수 있습니다.

```bash
pnpm install
pnpm desktop:dev
```

빌드, 음성, 검증, 선택적 백엔드, 패키징은 [Getting Started](docs/getting-started.md)를 참고하세요.

## 프로젝트 방향

AILIS는 실행 능력이 없는 역할극 채팅도, 아바타를 씌운 터미널도 아닙니다.

1. **존재감 있는 디지털 동반자**: 대화, 음성, 표정, 관계, 장기 기억.
2. **신뢰할 수 있는 개인 Agent**: 컨텍스트 이해, 범용 도구, 장기 작업 실행.
3. **이해하고 제어할 수 있는 실행 시스템**: 승인된 작업, 추적 가능한 진행, 복구 가능한 실패.

## 더 알아보기

<p align="center">
  <a href="docs/getting-started.md"><strong>설치와 설정</strong></a> ·
  <a href="docs/README.md"><strong>문서 센터</strong></a> ·
  <a href="docs/evaluation.md"><strong>평가 결과</strong></a>
</p>

## 개인정보와 제어

시각 컨텍스트에는 사용자의 허가가 필요합니다. 파일, 앱, 계정, 외부 서비스에 영향을 주는 작업은 승인 흐름에 들어가며 로컬 기억과 Runtime 상태는 기본적으로 사용자 컴퓨터에 남습니다. 현재 요청에 필요한 컨텍스트만 설정된 모델 서비스로 전송됩니다.

## 라이선스

AILIS 소스 코드는 [MIT License](LICENSE)로 공개됩니다. 일부 모델, 모션, 음성, 캐릭터 자산에는 별도 라이선스가 적용될 수 있습니다.
