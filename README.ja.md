<div align="center">
  <img width="220" alt="手を振る AILIS" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>見て、聞いて、記憶し、実際の仕事を完了できるオープンソースのデスクトップ AI コンパニオン。</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.0-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>AILIS を試す</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases/latest"><strong>ダウンロード</strong></a> ·
    <a href="docs/getting-started.md">クイックスタート</a> ·
    <a href="docs/README.md">ドキュメント</a>
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

## チャットウィンドウを超えて

AILIS は、デスクトップ上で実際に共に過ごすパーソナル AI を目指しています。見える 3D キャラクター、音声、表情、長期記憶に加え、調査、ファイル読解、コード作成、情報整理、コンピューター操作を行う Agent Runtime を備えています。

自然な言葉で話しかけるだけで、許可された画面やファイルのコンテキストを理解し、適切なツールを選び、タスクを完了し、次回に役立つ好みを記憶します。

## コア体験

<table>
  <tr>
    <td width="33%" valign="top"><h3>存在感</h3>表情、モーション、リップシンク、吹き出しを備えた VRM デスクトップキャラクター。</td>
    <td width="33%" valign="top"><h3>自然な対話</h3>高速なテキスト操作と、音声入力・自然な音声出力を両立します。</td>
    <td width="33%" valign="top"><h3>コンテキスト理解</h3>許可された画面、ウィンドウ、領域、ローカルファイルを理解します。</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>実行能力</h3>検索、コード、ファイル、Web、メール、コンピューター操作を一つの監査可能な経路で実行します。</td>
    <td width="33%" valign="top"><h3>長期記憶</h3>好み、プロジェクト背景、関係コンテキストを保存し、協働を改善します。</td>
    <td width="33%" valign="top"><h3>制御可能</h3>重要な操作は承認と監査を通り、計画と結果を確認できます。</td>
  </tr>
</table>

## AILIS の動作

| 1. 伝える | 2. 理解する | 3. 実行する | 4. 記憶する |
| :---: | :---: | :---: | :---: |
| 目的を自然に説明 | 許可された画面とファイルを読む | 検索、コード、ファイル、コンピューターツールを使う | 好みとプロジェクト背景を保存 |

## 評価された Agent 能力

AILIS は機能デモだけでなく、完全なエンドツーエンドタスクで評価されています。同じ Luna モデルでは、AILIS の Agent Harness は Codex と同等の性能帯に到達しています。

| Benchmark | AILIS | Codex、同一モデル |
| :--- | ---: | ---: |
| **GAIA public validation · 165 tasks** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 tasks** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center"><a href="docs/evaluation.md"><strong>完全なスコア、効率指標、再現可能な証拠を見る</strong></a></p>

## 現在利用できる機能

- [x] Windows 上の常駐 VRM キャラクター、チャット、コントロールパネル
- [x] テキスト、音声、表情、モーションによるリアルタイム対話
- [x] 権限を考慮した画面、ウィンドウ、ファイル、コードのコンテキスト
- [x] 検索、Web、コード、ファイル、メール、コンピューター操作ツール
- [x] 好み、プロジェクト、関係コンテキストの長期記憶
- [x] 重要な操作の承認、証拠、回復経路
- [ ] 長期タスクの信頼性、キャッシュ、回復のさらなる改善
- [ ] より完全なリアルタイム音声、クロスデバイス、プラグイン体験

## クイックスタート

[Releases](https://github.com/haowenGuo/AILIS/releases/latest) からデスクトップ版を入手するか、[Web 体験](https://101.133.239.56/Test/) で AILIS を試せます。

```bash
pnpm install
pnpm desktop:dev
```

ビルド、音声、検証、オプションのバックエンド、パッケージングは [Getting Started](docs/getting-started.md) を参照してください。

## プロジェクトの方向

AILIS は、実行能力のないロールプレイチャットでも、アバターを被せただけのターミナルでもありません。

1. **存在感のあるデジタルコンパニオン**：対話、音声、表情、関係、長期記憶。
2. **信頼できるパーソナル Agent**：コンテキスト理解、汎用ツール、長期タスク実行。
3. **理解・制御できる実行システム**：承認された操作、追跡可能な進捗、回復可能な失敗。

## 詳細

<p align="center">
  <a href="docs/getting-started.md"><strong>インストールと設定</strong></a> ·
  <a href="docs/README.md"><strong>ドキュメント</strong></a> ·
  <a href="docs/evaluation.md"><strong>評価結果</strong></a>
</p>

## プライバシーと制御

視覚コンテキストには許可が必要です。ファイル、アプリ、アカウント、外部サービスに影響する操作は承認フローに入り、ローカル記憶と Runtime 状態は標準でユーザーのコンピューターに残ります。現在のリクエストに必要なコンテキストだけが設定されたモデルサービスへ送信されます。

## ライセンス

AILIS のソースコードは [MIT License](LICENSE) で公開されています。一部のモデル、モーション、音声、キャラクター資産には個別のライセンスが適用されます。
