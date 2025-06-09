# 「AWSでWebアプリ公開を段階的モダナイズ体験」向けサンプルコード

本リポジトリでは、掲題の本に対するサンプルコードを提供します。

掲題の本は下記で頒布中です。

 * [技術書典オンラインマーケット内配布ページ](https://techbookfest.org/product/2j4emmuYQ9yMhvmMHhnMY5)



# 1章：

サンプルコードはありません。



# 2章：

## §2.3 ローカルサーバーでアプリを起動しログイン動作を確認

 * [backend](./backend/README.md)の「§2.3」節の案内を参照ください。


## §2.4 EC2 ベースでの公開に必要なインフラをAWSに構築

### §2.4.3 アプリ一式をZipで格納するS3バケットの作成

* [1-create-s3-for-appzip](./infrastructure/cloudformation/1-create-s3-for-appzip/README.md)の「§2.4.3」節の案内を参照ください。

### §2.4.4 EC2やVPCなど作成し、アプリを配置する

* [2-backend-infra-vpc-ec2](./infrastructure/cloudformation/2-backend-infra-vpc-ec2/README.md)の「§2.4.4 EC2やVPCなど作成し、アプリを配置する」節の案内を参照してください。

### §2.4.7 HTTPSドメインに合わせてアプリ側を再設定をする

* [backend](./backend/README.md)の「[§2.4.7](./backend/README.md#247-httpsドメインに合わせてアプリ側を再設定をする)」節の案内を参照ください。



# 3章：

## §3.1 フロントエンドの設定を変更してビルド

* [frontend](./frontend/README.md)の「[§3.1](./frontend/README.md#31-フロントエンドの設定を変更してビルド)」節の案内を参照してください。

## §3.2 S3とCloudFrontを組み合わせてフロントエンドをHTTPS公開

### §3.2.1 フロントエンド用のS3作成し、フロントエンドをアップロード

* [3-create-s3-for-static-spa](./infrastructure/cloudformation/3-create-s3-for-static-spa/README.md)の「§3.2.1」節の案内を参照してください。

## §3.3 バックエンドの設定を変更して再公開

* [backend](./backend/README.md)の「[§3.3](./backend/README.md#33-バックエンドの設定を変更して再公開)」節の案内を参照してください。



# 4章：

## §4.1 APIの実装をLambdaでの呼び出し用に切り出し、Zip にしてS3に配置

* [lambda](./infrastructure/lambda/README.md)の「[§4.1](./infrastructure/lambda/README.md#41-apiの実装をlambdaでの呼び出し用に切り出しzip-にしてs3に配置)」節の案内を参照してください。


## §4.2 API Gatewayを経由したLambda関数のエンドポイントを公開

* [lambda](./infrastructure/lambda/README.md)の「[§4.2](./infrastructure/lambda/README.md#42-api-gatewayを経由したlambda関数のエンドポイントを公開)」節の案内を参照してください。


## §4.2.1 フロントエンドの設定を変更して再公開

> ※本節のタイトルは、技術同人誌の**版によって「§4.3 フロントエンドの設定を変更して再公開」**となる場合があります。  
> 最新の版にあわせて確認してください。

* [frontend](./frontend/README.md)の「[§4.2.1](./frontend/README.md#421-フロントエンドの設定を変更して再公開)」節の案内を参照してください。


