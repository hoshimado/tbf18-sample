# 「AWSでWebアプリ公開を段階的モダナイズ体験」向けサンプルコード

このリポジトリは、技術同人誌『AWSでWebアプリ公開を段階的モダナイズ体験』の読者が、サンプルコードを活用して各章の手順を追体験できるよう補助する目的で作成されています。

各章・各節に対応するサンプルコードや設定ファイルの場所を明示していますので、読み進める際の参考にしてください。

掲題の本は下記で頒布中です。

 * [技術書典オンラインマーケット内配布ページ](https://techbookfest.org/product/2j4emmuYQ9yMhvmMHhnMY5)

<br><br><br>



# 1章：

サンプルコードはありません。



# 2章：

## §2.3 ローカルサーバーでアプリを起動しログイン動作を確認

* `./backend` フォルダー内の [README.md](./backend/README.md) の「§2.3 ローカルサーバーでアプリを起動しログイン動作を確認」節を参照してください。

## §2.4 EC2 ベースでの公開に必要なインフラをAWSに構築

### §2.4.3 アプリ一式をZipで格納するS3バケットの作成

* `./infrastructure/cloudformation/1-create-s3-for-appzip` フォルダー内の [README.md](./infrastructure/cloudformation/1-create-s3-for-appzip/README.md) の「§2.4.3 アプリ一式をZipで格納するS3バケットの作成」節を参照してください。

### §2.4.4 EC2やVPCなど作成し、アプリを配置する

* `./infrastructure/cloudformation/2-backend-infra-vpc-ec2` フォルダー内の [README.md](./infrastructure/cloudformation/2-backend-infra-vpc-ec2/README.md) の「§2.4.4 EC2やVPCなど作成し、アプリを配置する」節を参照してください。

### §2.4.7 HTTPSドメインに合わせてアプリ側を再設定する

* `./backend` フォルダー内の [README.md](./backend/README.md) の「[§2.4.7 HTTPSドメインに合わせてアプリ側を再設定する](./backend/README.md#247-httpsドメインに合わせてアプリ側を再設定をする)」節を参照してください。



# 3章：

## §3.1 フロントエンドの設定を変更してビルド

* `./frontend` フォルダー内の [README.md](./frontend/README.md) の「[§3.1 フロントエンドの設定を変更してビルド](./frontend/README.md#31-フロントエンドの設定を変更してビルド)」節を参照してください。

## §3.2 S3とCloudFrontを組み合わせてフロントエンドをHTTPS公開

### §3.2.1 フロントエンド用のS3作成し、フロントエンドをアップロード

* `./infrastructure/cloudformation/3-create-s3-for-static-spa` フォルダー内の [README.md](./infrastructure/cloudformation/3-create-s3-for-static-spa/README.md) の「§3.2.1 フロントエンド用のS3作成し、フロントエンドをアップロード」節を参照してください。


## §3.3 バックエンドの設定を変更して再公開

* `./backend` フォルダー内の [README.md](./backend/README.md) の「[§3.3 バックエンドの設定を変更して再公開](./backend/README.md#33-バックエンドの設定を変更して再公開)」節を参照してください。



# 4章：

## §4.1 APIの実装をLambdaでの呼び出し用に切り出し、Zip にしてS3に配置

* `./infrastructure/lambda` フォルダー内の [README.md](./infrastructure/lambda/README.md) の「[§4.1 APIの実装をLambdaでの呼び出し用に切り出し、ZipにしてS3に配置](./infrastructure/lambda/README.md#41-apiの実装をlambdaでの呼び出し用に切り出しzip-にしてs3に配置)」節を参照してください。

## §4.2 API Gatewayを経由したLambda関数のエンドポイントを公開

* `./infrastructure/lambda` フォルダー内の [README.md](./infrastructure/lambda/README.md) の「[§4.2 API Gatewayを経由したLambda関数のエンドポイントを公開](./infrastructure/lambda/README.md#42-api-gatewayを経由したlambda関数のエンドポイントを公開)」節を参照してください。

## §4.2.1 フロントエンドの設定を変更して再公開

> ※本節のタイトルは技術同人誌の版によって「§4.3 フロントエンドの設定を変更して再公開」となる場合があります。
> 最新版に合わせてご確認ください。

* `./frontend` フォルダー内の [README.md](./frontend/README.md) の「[§4.2.1 フロントエンドの設定を変更して再公開](./frontend/README.md#421-フロントエンドの設定を変更して再公開)」節を参照してください。


