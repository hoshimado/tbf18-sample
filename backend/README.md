# §2.3 ローカルサーバーでアプリを起動し、ログイン動作を確認する

## 本節の前提条件

まず、本文「§2.1.1 JWTへ署名する際に使うキーペアを作成」の手順に従って、
キーペアを作成しておいてください。

作成したキーペアは、本フォルダー `backend` 配下の `.ssh` フォルダー内に、
以下の2ファイルとして保存されていることを前提とします。

- `id_rsa.base64.oneline.txt`
- `id_rsa.pub.pem.base64.oneline.txt`

また、本文「§2.2 利用する外部IdP（GoogleのIdP）の設定」に従い、
Google Identity Platform に本サンプルアプリ（Relying Party）を登録してください。

登録後、以下の3つの値を取得済みであることを前提とします。

- クライアントID
- クライアントシークレット
- コールバックURL（※この値は固定で `http://localhost:3000/auth/callback` としてください）




## 本節の操作手順

本文の案内に従って、`./backend` フォルダー内に 
`.env.development.local` ファイルを作成してください。

なお、初期値が記載されたファイル 
[`env.development.local.txt`](./env.development.local.txt) 
を用意していますので、
それをコピーし、リネームしてから環境に応じた値を編集すると便利です。

環境変数の設定が完了したら、コマンドラインを開き、
`backend` フォルダー直下に移動します。
その状態で、以下のコマンドを実行してください。

```
npm run dev
```

HTTPサーバーが起動するので、ブラウザで以下のURLにアクセスします。

```
http://localhost:3000/
```

表示されたページで「ログイン」ボタンをクリックし、任意のGoogleアカウントでログインできることを確認してください。

ログイン後は、「挨拶する」ボタンをクリックし、挨拶メッセージが返ってくることを確認します。  
なお、「ユーザー情報を検証」ボタンは、アクセストークンの内容(の一部)を表示する機能です。

動作確認が終わったら、コマンドライン上で `Ctrl + C` を入力して、HTTPサーバーを停止してください。




# §2.4.7 HTTPSドメインに合わせてアプリ側を再設定をする

## 本節の前提条件

「[§2.3](#23-ローカルサーバーでアプリを起動しログイン動作を確認する)」で動作確認済みの  
`.env.development.local` ファイルが、`backend` フォルダー配下に存在していることを確認しておいてください。

また、本文「§2.4.5 CloudFrontを作成する」および続く「§2.4.6 動作確認」にて  
「ディストリビューションドメイン名」を取得済みであることを前提とします。


## 本節の操作手順

本文「サンプルアプリの起動時の設定変更とアップロード」の案内にしたがって、`./backend` フォルダー内に 
`.env.production.only.ec2` ファイルを作成してください。

「[§2.3](#23-ローカルサーバーでアプリを起動しログイン動作を確認する)」で案内した  
初期値が記載されたファイル [`env.development.local.txt`](./env.development.local.txt) を利用した場合、  
以下のような記述がすでに含まれているはずです（設定されている値はダミー値です）。

```
# THIS_PROTOCOL_AND_DOMAIN=https://dxhdh6471qt8w.cloudfront.net
```

この行のコメントアウトを解除し、  
「§2.4.6 動作確認」で取得した「ディストリビューションドメイン名」を使用して、  
HTTPSアクセス用のURLを値として記載してください。

.env.production.only.ec2` ファイルの編集を終えて保存したら、
本文の手順にしたがってアプリケーション一式をZipファイルにまとめます。

この際使用するスクリプトは、以下のファイルです
（※「[§2.3](#23-ローカルサーバーでアプリを起動しログイン動作を確認する)」で使用したスクリプトとは異なります）。

* `backend` フォルダー配下の  
  [s3-build-appzip4ec2idp.bat.txt](./s3-build-appzip4ec2idp.bat.txt)

続く「EC2等の再構築」の手順では、以下のCloudFormationテンプレートを使用してください。  
このテンプレートは「[§2.4.4](../infrastructure/cloudformation/2-backend-infra-vpc-ec2/README.md)」で使用したものと同一です。

- [infrastructure1-ec2base.yaml](../infrastructure/cloudformation/2-backend-infra-vpc-ec2/infrastructure1-ec2base.yaml)

