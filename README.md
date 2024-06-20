# RpakaScript

RpakaScriptはAssemblyScriptで作られたスクリプト言語で、JavaScriptから呼び出すことができます。このドキュメントでは、RpakaScriptの概要、インストール方法、使用方法、主な機能、ファイル構成、開発方法、ライセンスについて説明します。

**注意** RpakaScript言語は現在開発中の言語のため処理のログが出力される可能性があります。

## 目次

1. [インストール](#インストール)
2. [動作環境](#動作環境)
3. [使用方法](#使用方法)
4. [主な機能](#主な機能)
5. [文法について](#文法について)
6. [ライセンス](#ライセンス)

## インストール

RpakaScriptをインストールするには、リポジトリをクローンし、必要な依存関係をインストールします。

```bash
git clone https://github.com/yourusername/RpakaScript.git
cd RpakaScript
npm install
```

## 動作環境

RpakaScriptはAssemblyScriptで構築されているため、AssemblyScriptが動作する環境であればどこでも動作します。具体的には以下の環境での動作が確認されています：

1. **Webブラウザ**:

   - 最新バージョンのChrome、Firefox、Safari、Edgeなどの主要なWebブラウザがサポートされています。
   - WebAssemblyをサポートするすべてのブラウザで動作可能です。

2. **Node.js**:

   - Node.js v12以降で動作確認されています。
   - WebAssemblyモジュールを動かせるNode.jsアプリケーションで使用可能です。

3. **スタンドアロンランタイム**:

   - **Wasmtime**や**Wasmer**などのスタンドアロンランタイムを使用して、WebAssemblyモジュールを用いて実行できます。
   - これにより、ブラウザ外での実行やサーバーサイドアプリケーションでの使用が可能です。

4. **クラウドおよびコンテナ環境**:
   - **Docker**: WebAssemblyモジュールを用いて直接コンテナ内で実行するための実験的なサポートがあります。
   - **Kubernetes**: WebAssemblyモジュールを用いて管理およびスケーリングするために構成できます。

## 使用方法

### RpakaScriptの実行

提供されているコマンドラインツールを使用して、RpakaScriptスクリプトを実行できます。

```bash
npm run build
npm run start path/to/your/script.RpakaScript
```

### インタラクティブモードでの実行

```bash
npm run build
npm run start
>> print("hello")
```

### JavaScriptとの統合

RpakaScriptはJavaScriptから呼び出すことができ、JavaScript環境内でその機能を活用できます。

```javascript
const RpakaScript = require('./dist/coreIndex.js');

const script = `
print("Hello, RpakaScript!");
`;

RpakaScript.run(script);
```

## 文法について

### PEGによる文法の定義

PEGによる文法規則を確認したい場合は、[LANGUAGE_PEG](docs/LANGUAGE_PEG.md)から確認してください

### RpakaScriptによる言語の文法の使い方と例について

[LANGUAGE](docs/LANGUAGE.md)から確認してください

## 主な機能

- **AssemblyScriptベース**: RpakaScriptはAssemblyScriptを使用して構築されており、効率的なWebAssemblyをバックエンドに用いた実行を可能にします。
- **JavaScript統合**: JavaScriptからRpakaScriptを簡単に呼び出せます。
- **カスタマイズ可能**: AssemblyScriptを使用して言語を拡張および変更できます。

### プロジェクトのビルド

プロジェクトをビルドするには、次のコマンドを使用します。

```bash
npm run build
```

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については、[LICENSE](LICENSE)ファイルを参照してください。
