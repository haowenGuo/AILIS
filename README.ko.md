# AILIS

이 매뉴얼은 통합 Agent를 포함한 현재 소스 브랜치를 설명합니다. 기존 [v1.4.1 설치 파일](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.1)은 `659bf61`에서 빌드되어 이후 변경을 포함하지 않습니다. 새 구현은 현재 소스에서 실행하세요.

AILIS는 텍스트·음성 대화, 도구 기반 작업, 지속적인 컨텍스트와 VRM 아바타를 제공하는 데스크톱 앱입니다.

## 실행

저장소 루트에서 pnpm 10.33.0을 사용합니다.

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

제어판에서 모델 서비스를 설정하세요. 음성, 이미지 및 외부 도구에는 별도 설정과 의존성이 필요합니다.

[중국어 매뉴얼](docs/README.md) · [English](README.md) · [기여 안내](CONTRIBUTING.md) · [License](LICENSE)

상세 기술 문서는 중국어로 통합 관리합니다. 외부 모델과 리소스에는 각각의 이용 조건이 적용됩니다.
