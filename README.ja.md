<div align="center">
  <h1>AIGril</h1>
  <p><strong>AIGL をメインキャラクターとする、3D VRM アバターとストリーミング対話を備えたブラウザ向けバーチャルコンパニオンプロジェクトです。</strong></p>
  <p>
    <a href="https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com"><img alt="Try AIGril" src="https://img.shields.io/badge/Try%20AIGril-フル体験版-2563eb?style=for-the-badge"></a>
    <a href="https://haowenGuo.github.io/AIGril/"><img alt="Frontend Demo" src="https://img.shields.io/badge/GitHub%20Pages-フロントエンド%20デモ-0f172a?style=for-the-badge"></a>
    <a href="https://airi-backend.onrender.com/docs"><img alt="Backend API" src="https://img.shields.io/badge/Backend-FastAPI%20Docs-059669?style=for-the-badge"></a>
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a>
  </p>
</div>

---

## 概要

AIGL は AIGril のメインキャラクターであり、Web 上のバーチャルキャラクターをより生き生きと感じられるようにすることを目指しています。

- ブラウザ上で 3D VRM アバターを表示
- FastAPI バックエンドからテキストをストリーミング返信
- モデル出力の制御タグでアクションと表情を切り替え
- リップシンク、まばたき、待機モーション、ダンスを実行
- 会話履歴を保存し、古い内容を定期的に要約圧縮

## 体験リンク

- フル体験版: [https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com](https://haowenGuo.github.io/AIGril/?backend=https://airi-backend.onrender.com)
- フロントエンドのみのデモ: [https://haowenGuo.github.io/AIGril/](https://haowenGuo.github.io/AIGril/)
- バックエンド API ドキュメント: [https://airi-backend.onrender.com/docs](https://airi-backend.onrender.com/docs)

## 主な機能

- ストリーミングテキスト対話
- 待機、ダンス、驚き、手を振る、怒るなどの動作
- happy、sad、relaxed、surprised、playful blink などの表情
- テキスト受信中の fallback 発話アニメーション
- セッション記憶と定期的な要約圧縮

## 技術スタック

- フロントエンド: Vite、Three.js、`@pixiv/three-vrm`
- バックエンド: FastAPI、SQLAlchemy、SQLite
- LLM 接続: OpenAI 互換 API
- デプロイ: GitHub Pages + Render

## ローカル実行

```bash
pnpm install
pnpm dev
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

最低限必要な環境変数:

```env
LLM_API_KEY=your_llm_api_key
```

## 構成

```text
backend/   FastAPI API、記憶ロジック、デプロイ設定
src/       VRM アバター、チャット UI、アクション、表情、フロントエンド処理
Resources/ VRM モデルと VRMA アセット
scripts/   静的ビルド補助スクリプト
examples/  開発者向けの独立サンプル。Python safety API デモを含む
```

## デプロイ

- 公開フロントエンド: GitHub Pages
- 公開バックエンド: Render
- Render 設定: [`render.yaml`](render.yaml)

## 目標

応答性が高く、表現力があり、Web 上で気持ちよく触れられるバーチャルキャラクター体験を作りつつ、今後の改善や拡張がしやすい構成を保つことを目指しています。
