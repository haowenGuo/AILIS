# AILIS

このマニュアルは統合 Agent を含む現在のソースを説明します。[v1.4.2](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.2) には新しいチャット画面・設定画面と ASR の修正が含まれます。Unity や大容量の音声・モデル環境は同梱しません。[リリースノート](docs/releases/v1.4.2.md)で要件をご確認ください。

AILIS は、テキスト・音声対話、ツールを使うタスク、継続的なコンテキスト、VRM アバターを備えたデスクトップアプリです。

## 起動

リポジトリのルートで pnpm 10.33.0 を使用します。

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

コントロールパネルでモデルサービスを設定してください。音声、画像、外部ツールにはそれぞれ追加の設定や依存関係が必要です。

[中国語マニュアル](docs/README.md) · [English](README.md) · [贡献约定](CONTRIBUTING.md) · [License](LICENSE)

技術マニュアルは中国語で一元管理しています。外部のモデルや素材には個別の利用条件があります。
