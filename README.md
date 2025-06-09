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




