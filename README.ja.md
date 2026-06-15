# AIGL Assistant / HumanClaw

<p align="center">
  <strong>AIGL を中心にしたデスクトップ優先の embodied AI assistant です。VRM キャラクター、HumanClaw によるタスク実行、自然な対話、長期記憶、視覚理解、音声対話、ローカル Electron ランタイムを組み合わせています。</strong>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a>
</p>

---

## このプロジェクトについて

AIGL Assistant は、現在の AIGRIL のメインラインです。初期の AIGril のような Web アバターや軽量デスクトップペットにとどまらず、個人向け embodied agent system へ向かっています。AIGL はデスクトップ上のキャラクターとして現れ、ユーザーと会話し、長期文脈を保持し、許可されたときに視覚情報を理解し、HumanClaw ランタイムを通して実際のタスクを実行します。

プロダクトの目標は二層構造です。

- 表層では、AIGL がユーザーと同じデスクトップ上で一緒に作業しているように感じられること。
- 下層では、ローカル agent harness として、ツール、権限、監査、記憶、復旧、テストを安定して扱えること。

つまり AIGL Assistant は、タスク実行を開発者コンソール操作ではなく、有能なキャラクターとの協作として感じられるようにするプロジェクトです。

## 中核システム

| システム | 役割 |
| --- | --- |
| Embodied desktop shell | Electron による VRM ペット、チャット、コントロールパネル、Agent Analysis Lab のウィンドウ群。 |
| AIGL character runtime | VRM 描画、VRMA モーション、表情、対話バブル、リップシンク、発話状態、スタイル化された描画制御。 |
| HumanClaw Gateway | `127.0.0.1:19777` のローカル HTTP/SSE Gateway。health、ツール一覧、ツール呼び出し、監査、イベント、agent run を担当します。 |
| HumanClaw Agent Runner | LLM 中心の Agent Loop。対話/タスクのルーティング、計画、ツール呼び出し、承認後の復旧、中断、最終応答を扱います。 |
| Tool layer | OpenClaw に近い core tools と、email、file、code、computer、vision、MCP、tool search、capability manager、artifact verifier などの HumanClaw ローカルツール。 |
| Persona memory runtime | core memory blocks、user/project/relationship state、affinity、secret index、event memory、reflection の方向性、コントロールパネル表示。 |
| Vision layer | 権限に基づき、screen、active window、chat window、pet window、control panel、選択領域のスクリーンショットを読み取り専用の文脈として使います。 |
| Speech layer | ローカル ASR worker と、browser speech、Kokoro、CosyVoice3、ElevenLabs 風クラウド TTS など複数の音声経路。 |
| Control panel | LLM Provider、モデルプリセット、音声、ASR、メール、computer-control mode、state directory、memory、Gateway 状態を管理します。 |
| Eval and validation | Humanlike eval、長期 companionship シナリオ、HumanClaw tool tests、Gateway smoke、SWE-bench/GAIA/OSWorld 系スクリプト。 |

## 設計方針

AIGL Assistant は「チャットボットにツールボタンを足したもの」でも、「Agent プラットフォームにかわいい見た目を被せたもの」でもありません。目指す境界は次の通りです。

```text
LLM が意図を理解する。
Memory が継続性を保つ。
Harness が信頼できる実行を担う。
Tools が観察または行動する。
Persona Renderer が runtime events を AIGL らしい表現に変える。
Eval が信頼性、安全性、humanlike experience のずれを見つける。
```

重要な原則:

- 表層は低ツール感を保ち、`tool_call`、approval id、raw observation をそのまま見せません。
- 実行は明示的で監査可能にします。ファイル書き込み、シェル実行、メール操作、外部副作用、プライバシーを含む視覚入力は policy と approval を通します。
- 記憶は人格の連続性のために使い、キーワードトリガーとして扱いません。
- 意味判断は文脈を持つモデルに任せ、コードは schema、path guard、approval、redaction、timeout、event replay、persistence を堅くします。
- デスクトップキャラクター体験を保ち、すべてをコントロールパネルに押し込めません。

## タスク実行

HumanClaw は、レンダラーから直接ツールを呼ぶのではなく、ローカル Gateway と Agent Loop を通してタスクを実行します。

実行経路:

```text
chat / voice / attachment
  -> HumanClaw Desktop Chat Service
  -> window.aigrilDesktop.gateway.runAgent()
  -> HumanClaw Agent Runner
  -> HumanClaw Gateway
  -> local tools / OpenClaw-style tools / MCP tools
  -> structured events
  -> AIGL-like progress and final response
```

現在の tool surface:

- `read`、`write`、`edit`、`apply_patch`、`exec`、`update_plan`、`tool_search`、permission request などの core tools。
- email、file manager、computer/runtime state、code inspection、artifact verifier、vision capture などの HumanClaw ローカルツール。
- 外部ツールの発見、接続、公開に使う MCP bridge と capability manager。
- run、tool start/finish、approval、failure、analysis の audit log と SSE event stream。

## デスクトップ体験

パッケージ名は `HumanClaw` です。

- フレームレスで常時最前面の VRM ペットウィンドウ。
- 日常対話とタスク依頼のための独立したチャットウィンドウ。
- Provider、音声、記憶、メール、Gateway 状態、権限を管理するコントロールパネル。
- agent run を確認、分析、継続する Agent Analysis Lab。
- 既定のローカル状態ディレクトリは `.humanclaw-state`。
- Windows の installer と portable 版は Electron Builder で生成します。

## リポジトリ構成

```text
electron/   main process、HumanClaw Gateway、Agent Runner、tools、memory、TTS/ASR workers
src/        pet、chat、control panel、vision UI、speech、bubbles、character runtime
backend/    optional FastAPI backend、schemas、legacy services、education/Vivix/static assets
Resources/  AIGL VRM model、VRMA motions、motion intake assets、reference voice assets
docs/       architecture、memory、gateway、OpenClaw alignment、eval、benchmark、tooling notes
tests/      HumanClaw runtime、tools、memory、gateway、evals、provider、UI helper tests
scripts/    smoke tests、validation、benchmark runners、eval generation、build helpers
evals/      AIGL humanlike and engineering evaluation fixtures
release/    desktop release metadata and packaged artifacts
```

主要ドキュメント:

- [Embodied Agent Architecture](docs/aigl-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/aigl-memory-architecture-v2.md)
- [HumanClaw Gateway v0](docs/humanclaw-gateway-v0.md)
- [HumanClaw Agent Runner v0](docs/humanclaw-agent-runner-v0.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)
- [Humanlike Eval](docs/aigl-humanlike-eval.md)
- [OpenClaw From Zero](docs/openclaw-from-zero.md)

## ローカル開発

依存関係:

```bash
pnpm install
```

デスクトップアプリを開発モードで起動:

```bash
pnpm desktop:dev
```

ビルドして起動:

```bash
pnpm desktop:start
```

Windows 版をパッケージ:

```bash
pnpm desktop:package:win
```

任意のバックエンド:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## 設定

多くのデスクトップ設定は HumanClaw のコントロールパネルから管理します。OpenAI-compatible provider と provider preset、自定义 base URL、model name、timeout、local credential をサポートします。

API key、メール資格情報、memory state、ダウンロードした音声モデル、runtime logs、eval outputs、一時的な run state はローカル実行データであり、Git に入れるべきではありません。

## 検証

よく使う検証:

```bash
pnpm test:humanclaw-gateway
pnpm test:humanclaw-agent
pnpm test:humanclaw-runtime
pnpm test:humanclaw-tool-contracts
pnpm test:humanclaw-memory
pnpm test:aigl-humanlike-eval
```

Gateway 全体検証:

```bash
pnpm humanclaw:validate-gateway
```

Humanlike eval:

```bash
pnpm eval:aigl-humanlike:validate
pnpm eval:aigl-humanlike:generate
pnpm eval:aigl-humanlike:report
pnpm eval:aigl-humanlike:long-term:validate
```

## プライバシーと安全

AIGL Assistant は個人のデスクトップアシスタントなので、ユーザーのローカルマシン上に記憶、資格情報、パス、プロジェクト文脈を保持できます。これらは source asset ではなく、ローカル runtime data として扱います。

安全の既定値には、workspace path guard、secret redaction、高リスク操作の approval gate、外部副作用の dry-run、tool call audit log が含まれます。Vision は perception layer です。スクリーンショットは文脈理解のために使われますが、クリック、入力、購入、送信、提出の許可を意味しません。

## 現在の状態

現在のメインラインは HumanClaw `1.0.4` で、活発に開発されています。優先事項は、既存のデスクトップ runtime を安定させたまま、Gateway 起動信頼性、タスク実行、記憶品質、音声/視覚体験、tool contracts、eval coverage を改善することです。
