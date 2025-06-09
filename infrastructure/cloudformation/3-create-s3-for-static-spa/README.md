# §3.2.1 フロントエンド用のS3バケットを作成し、ビルド済みファイルをアップロード

## 本節の前提条件

[frontend](../../../frontend/README.md) の「[§3.1](../../../frontend/README.md#31-フロントエンドの設定を変更してビルド)」節で  
ビルド（トランスパイル）されたファイルが `frontend/dist` 配下に出力されていることを確認しておいてください。

## 本節の操作手順

本文の案内にしたがって、S3バケットを作成してください。以下の CloudFormation テンプレートを使用します。  
※「[§2.4.3](../1-create-s3-for-appzip/README.md#243-アプリ一式をzipで格納するs3バケットの作成)」で使用したテンプレートとは異なります。

* [s3-bucket-for-frontend-public-spa.yaml](./s3-bucket-for-frontend-public-spa.yaml)

S3バケットを作成したら、本文の手順に従って `frontend/dist` 配下のファイルをアップロードしてください。

