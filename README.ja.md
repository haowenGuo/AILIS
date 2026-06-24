<div align="center">
  <h1>AILIS Assistant</h1>
  <p><strong>VRM キャラクター、リアルタイム音声、視覚コンテキスト、記憶、Codex 風の Agent Harness を備えたオープンソースのデスクトップ具身 AI アシスタントです。</strong></p>
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

## AILIS とは

AILIS Assistant は、デスクトップを中心に設計された具身 AI アシスタントです。3D VRM キャラクター、Electron デスクトップウィンドウ、音声対話、スクリーンショットに基づく視覚コンテキスト、記憶、構造化された Agent Runtime を一つのシステムにまとめています。

AILIS は単なる Web チャットボットではありません。ユーザーと自然に会話し、許可された範囲で画面コンテキストを理解し、有用な好みを記憶し、明示的に承認されたツールを通じて実作業を支援することを目指しています。

## プロジェクトの方向性

多くのアシスタントは、表現力のあるアバターだが実行能力が弱いもの、または強力だが開発者コンソールのように感じるものに分かれがちです。AILIS はその両方をつなぐことを目指します。

- 存在感、表情、動作、音声、関係性を持つキャラクター体験。
- 計画、ツールルーティング、承認、証拠ログ、回復を扱う Agent Harness。
- 設定、記憶、ログ、モデル構成をユーザーの手元に置くローカルファーストなデスクトップ runtime。

## 現在の機能

- 表情、モーション、リップシンク、吹き出しを備えた VRM デスクトップキャラクター。
- Electron のペットウィンドウ、チャットウィンドウ、コントロールパネル、トレイ統合、ローカル状態保存。
- カスタム base URL やローカルモデル運用を含む OpenAI 互換モデルプロバイダー設定。
- デスクトップ TTS worker、クラウド音声経路、オプションのローカル音声認識 worker。
- スクリーンショット、ウィンドウ、領域キャプチャによる権限意識のある視覚コンテキスト。
- 記憶ブロック、プロジェクトコンテキスト、関係状態、軽量なリフレクション。
- ファイル、コード、コンピューター操作、メール、MCP スキル、Web/Search、ローカル runtime ツール層。
- ファイル、アプリ、アカウント、外部サービスに影響する操作のための明示的承認モデル。
- 人間らしさの評価、ツール契約テスト、Gateway チェック、Agent 実行 smoke test。

## アーキテクチャ

```text
ユーザー / 音声 / 画面
        |
        v
AILIS Desktop UI
  - VRM キャラクター
  - チャットウィンドウ
  - コントロールパネル
        |
        v
Agent Harness
  - プランナー
  - ツールルーター
  - 承認ゲート
  - 証拠ログ
  - 回復ループ
        |
        v
Runtime Services
  - モデルプロバイダー
  - 音声 / ASR / TTS
  - 視覚キャプチャ
  - 記憶ストア
  - ローカルツール / MCP
        |
        v
Validation
  - テスト
  - 評価
  - smoke check
```

## リポジトリ構成

```text
electron/   Electron メインプロセス、preload bridge、runtime service、ローカルツール adapter
src/        ペット、チャット、コントロールパネル、音声、視覚 UI、吹き出しの renderer
backend/    任意の FastAPI backend、API schema、記憶 service、静的 asset
Resources/  VRM model、VRMA motion、reference audio、character asset
docs/       アーキテクチャ、記憶、ツールエコシステム、評価、release planning
evals/      人間らしさと長期コンパニオン評価の scenario data
scripts/    runtime 準備、validation、smoke test、benchmark、package helper
tests/      runtime、memory、tools、contracts、gateway、agent behavior の test
```

## クイックスタート

```bash
pnpm install
pnpm desktop:dev
```

ビルドして起動:

```bash
pnpm desktop:start
```

Windows デスクトップアプリをパッケージ:

```bash
pnpm desktop:package
```

任意の backend:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## モデルと音声設定

AILIS はアプリケーション層で特定のモデル事業者に固定されません。デスクトップのコントロールパネルまたはローカル環境ファイルから設定できます。

- OpenAI 互換クラウドプロバイダー。
- ローカル vLLM endpoint。
- Ollama 系のローカル workflow。
- カスタム base URL、model name、timeout、private API key。
- 任意の local ASR と desktop TTS runtime preparation。

本物の API key、アカウント認証情報、会話ログ、ローカルモデル cache、runtime log、生成された eval output を repository に commit しないでください。

## よく使うコマンド

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

重い full gateway validation:

```bash
pnpm ailis:validate-gateway
```

## 主要ドキュメント

- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## 状態

現在の release line: `v1.0.6`。

AILIS は活発に開発中です。デスクトップ runtime、Agent Harness、ツール層、評価基盤はすでに大きく育っていますが、現時点では production-grade Agent OS ではなく alpha 段階の product/runtime として扱うべきです。短期的な重点は、ツール契約、承認、安全性、記憶品質、ローカルモデル設定、end-to-end 評価の改善です。

## プライバシーと安全性

- 視覚キャプチャは権限を前提とし、コンテキスト理解のために使います。
- ファイル、アプリ、アカウント、外部サービスに影響する操作は明示的承認を通します。
- 記憶と runtime state は、ユーザーが選ばない限りローカルに残します。
- secret はローカル設定に置き、source control に含めません。

## ライセンス

AILIS の source code は [Apache License 2.0](LICENSE) で公開されています。一部の bundled asset、third-party model、motion、voice resource には個別のライセンスがある場合があります。再配布前に各 asset の説明を確認してください。
