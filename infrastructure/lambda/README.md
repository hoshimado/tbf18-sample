# §4.1 APIの実装をLambdaでの呼び出し用に切り出し、Zip にしてS3に配置

## 本節の前提条件

本文「§3.3 バックエンドの設定を変更して再公開」にしたがって、
`.env.production.s3.ec2`を作成済みであり、
続くS3バケットへのアップロードおよびEC2等の再構築が完了していることを前提とします。


## 本節の操作手順

本文で案内している `lambda` フォルダー配下の構成は、以下の通りです（このファイルが置かれているフォルダーです）。

 * [infrastructure/lambda](./)

まず、コマンドラインを開いて `lambda` フォルダー直下に移動してください。  
その状態で、以下のコマンドを実行し、依存モジュールをインストールします。

```
npm install
```

続いて、以下のファイルを開いてください。

 * [./api/api_greeting.js](./api/api_greeting.js)

ファイル冒頭の以下の部分に、「[§3.3](../../backend/README.md#33-バックエンドの設定を変更して再公開)」で作成した  
`.env.production.s3.ec2` に含まれる次の設定値を反映します。

```
JWT_PUBLIC_KEY=＜JWT用の公開鍵を1行化したもの＞
```

この値を、次のような記述の `publicBase64` の部分にコピー＆ペーストしてください。  
（この値は、本文「§2.1.1 JWTへ署名する際に使うキーペアを作成」で生成した  
`id_rsa.pub.pem.base64.oneline.txt` の内容と同一です）

```js
publicBase64: '＜公開鍵を1行の文字列として出力したものを記載＞'
```

`api_greeting.js` の編集を終えて保存したら、
本文の手順にしたがってAWS Lambdaに配置するファイル一式をZipにまとめます。

この際に使用するスクリプトは、以下のファイルです。
本文の案内にしたがってリネームし、バッチファイルとして実行してください。

* [s3-build-lambda-zip.bat.txt](./s3-build-lambda-zip.bat.txt)





# §4.2 API Gatewayを経由したLambda関数のエンドポイントを公開

## 本節の前提条件

以下の2点が完了していることを前提とします。

1. 「§4.1 APIの実装をLambdaでの呼び出し用に切り出し、ZipにしてS3に配置」にしたがって、作成した `lambda-function.zip` をS3バケットへアップロード済みであること。
2. 「§3.3 バックエンドの設定を変更して再公開」および「§3.4 AWSにS3へ移設して公開したWebアプリを動作確認」に従い、「CloudFrontを経由したS3へのHTTPSアクセス」が確認できていること。


## 本節の操作手順

本文の案内にしたがって、
AWS Lambdaへの関数配置と、
API Gateway のインスタンス作成を行います。

まず、以下のファイルを開いてください。

* [infrastructure-api-gateway-lambda.yaml](./infrastructure-api-gateway-lambda.yaml)

本文にしたがって、次のような記述部分を探し、  
「§3.4」で確認した「CloudFrontを経由したS3のHTTPSアクセス」
のURLを `AllowOrigins` に追加してください。

```yaml
      CorsConfiguration:
        AllowOrigins:
          - 'http://localhost:5173'
          - '＜S3用に設定したCloudFrontのドメインをプロトコルを含めて記述。例: https://d34oklk6ch12y3.cloudfront.net ＞'
```

編集を終えたらファイルを保存し、
CloudFormation の管理画面からこのテンプレート `infrastructure-api-gateway-lambda.yaml` を適用してください。


> ### 「localhost:5173」のCORS許可は何のため？
>
> `AllowOrigins` に `http://localhost:5173` を含めているのは、ローカル開発環境（例: ViteのDevサーバー）からAPI Gateway経由でLambda関数を呼び出して動作確認を行うためです。  
> サンプルコードとしては妥当な構成ですが、本番環境ではセキュリティ上の理由から、不要なオリジンは削除してください。
>





