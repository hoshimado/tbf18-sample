# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```



### Compile and Minify for Production

`.\backend`配下の[dist](../backend/dist/)フォルダー出力する。

* [backend](../backend/)側でホスティングしての動作確認用
* 環境変数などの設定は不要

```sh
npm run build
```

#### AWSへの直アップロード用のカスタマイズBuild:S3ホスティング

`.\dist`配下に出力する。

* [.env.production.s3](./.env.production.s3)ファイルを作成して、次の環境変数名を設定すること
    * `VITE_BACKEND_AUTH_URL=＜バックエンドのCloudFrontのHTTPSドメイン＞/`  ※最後にスラッシュを付ける。
    * `VITE_BACKEND_API_URL=＜バックエンドのCloudFrontのHTTPSドメイン＞/`  ※最後にスラッシュを付ける。
* S3でのホスティングを前提に、上記の環境変数の設定でビルドされる。

```sh
npm run build:s3
```

#### AWSへの直アップロード用のカスタマイズBuild:Lambda配置APIへS3ホスティングから通信

`.\dist`配下に出力する。

* [.env.production.lambda](./.env.production.lambda)ファイルを作成して、次の環境変数名を設定すること
    * `VITE_BACKEND_AUTH_URL=＜バックエンドのCloudFrontのHTTPSドメイン＞/`  ※最後にスラッシュを付ける。
    * `VITE_BACKEND_API_URL=＜API GatewayのHTTPSドメイン＞/`  ※最後にスラッシュを付ける。
* S3でのホスティングを前提に、上記の環境変数の設定でビルドされる。

```sh
npm build:lambda
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
