# §2.4.3 アプリ一式をZipで格納するS3バケットの作成

## 本節の前提条件

[backend](../../../backend/README.md) の「§2.3」節で動作確認済みの  
`.env.development.local` ファイルが、`backend` フォルダー配下に存在していることを確認しておいてください。


## 本節の操作手順

本文の案内に従って、S3バケットを作成します。以下のCloudFormationテンプレートを使用してください。

* [s3-bucket-for-appzip.yaml](./s3-bucket-for-appzip.yaml)


S3バケットの作成後、本文の手順に従って、アプリケーション一式をZipファイルにまとめます。  
Zipファイルの作成には、以下のスクリプトを使用してください。

* backend配下にある [s3-build-appzip4ec2base.bat.txt](../../../backend/s3-build-appzip4ec2base.bat.txt)





