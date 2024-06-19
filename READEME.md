# Rpaka Script Language

RpakaはAssemblyScriptで作られたスクリプト言語で、JavaScriptから呼び出すことができます。このドキュメントでは、Rpakaの概要、インストール方法、使用方法、主な機能、ファイル構成、開発方法、ライセンスについて説明します。

## 目次

1. [インストール](#インストール)
2. [動作環境](#動作環境)
3. [使用方法](#使用方法)
4. [主な機能](#主な機能)
5. [ライセンス](#ライセンス)

## インストール

Rpakaをインストールするには、リポジトリをクローンし、必要な依存関係をインストールします。

```bash
git clone https://github.com/yourusername/rpaka.git
cd rpaka
npm install
```

## 動作環境

RpakaはAssemblyScriptで構築されているため、AssemblyScriptが動作する環境であればどこでも動作します。具体的には以下の環境での動作が確認されています：

1. **Webブラウザ**:

   - 最新バージョンのChrome、Firefox、Safari、Edgeなどの主要なWebブラウザがサポートされています。
   - WebAssemblyをサポートするすべてのブラウザで動作可能です。

2. **Node.js**:

   - Node.js v12以降で動作確認されています。
   - WebAssemblyモジュールをNode.jsアプリケーションで使用可能です。

3. **スタンドアロンランタイム**:

   - **Wasmtime**や**Wasmer**などのスタンドアロンランタイムを使用して、WebAssemblyモジュールを実行できます。
   - これにより、ブラウザ外での実行やサーバーサイドアプリケーションでの使用が可能です。

4. **クラウドおよびコンテナ環境**:
   - **Docker**: WebAssemblyモジュールを直接コンテナ内で実行するための実験的なサポートがあります。
   - **Kubernetes**: WebAssemblyモジュールを管理およびスケーリングするために構成できます。

## 使用方法

### Rpakaの実行

提供されているコマンドラインツールを使用して、Rpakaスクリプトを実行できます。

```bash
npm run build
npm run start path/to/your/script.rpaka
```

### インタラクティブモードでの実行

```bash
npm run build
npm run start
>> print("hello")
```

### JavaScriptとの統合

RpakaはJavaScriptから呼び出すことができ、JavaScript環境内でその機能を活用できます。

```javascript
const rpaka = require('./dist/coreIndex.js');

const script = `
print("Hello, Rpaka!");
`;

rpaka.run(script);
```

## 主な機能

- **AssemblyScriptベース**: RpakaはAssemblyScriptを使用して構築されており、効率的なWebAssemblyをバックエンドに用いた実行を可能にします。
- **JavaScript統合**: JavaScriptからRpakaを簡単に呼び出せます。
- **カスタマイズ可能**: AssemblyScriptを使用して言語を拡張および変更できます。

### プロジェクトのビルド

プロジェクトをビルドするには、次のコマンドを使用します。

```bash
npm run build
```

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については、[LICENSE](LICENSE)ファイルを参照してください。
