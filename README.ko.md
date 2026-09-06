# AILIS

AILIS는 VRM 아바타, 텍스트·음성, 도구, 영구 메모리를 갖춘 데스크톱 에이전트입니다. 기본 대화에서는 하나의 Agent가 하나의 영구 Session으로 대화, 실행, 최종 답변을 담당합니다. 성격 설정은 결과를 다시 쓰는 별도 모델이 아닙니다.

[English](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

패키지 버전은 1.4.1입니다. 이 문서의 소스 기준은 독립 작업 트리의 `00b3244`이며 확인일은 2026-09-06입니다. 같은 버전 번호의 설치 앱도 코드가 다를 수 있습니다.

## 실행

저장소 루트에서 지정된 pnpm 10.33.0을 사용합니다. 기록된 로컬 검증은 Node 22.17.1에서 수행했습니다.

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

제어판에서 모델, 인증 정보, 상태 디렉터리를 확인하세요. 음성·시각·외부 도구는 별도 의존성과 설정이 필요합니다. 설치와 실행은 파일 및 프로세스 상태를 변경합니다.

## 현재 문서

번역 간 구조 설명이 달라지는 것을 막기 위해 상세 설명은 하나의 중국어 매뉴얼로 관리합니다: [목차](docs/README.md), [구조](docs/architecture.md), [설정](docs/configuration.md), [평가](docs/evaluation.md), [문제 해결](docs/troubleshooting.md).

로컬 저장은 완전한 오프라인 동작이나 암호화를 보장하지 않습니다. 도구는 파일과 외부 서비스에 접근할 수 있습니다. 과거 벤치마크 점수를 현재 소스의 측정 결과로 재사용하지 않습니다.

[기여 안내](CONTRIBUTING.md) · [라이선스](LICENSE). 외부 코드, 모델, 음성, 자산에는 각각의 라이선스가 적용됩니다.
