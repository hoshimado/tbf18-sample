/**
 * このファイルは、OIDC (OpenID Connect) を利用した認証に関連する
 * ロジックを定義するモジュールです。
 * 
 * 主な機能:
 * - Passport.js を利用した OIDC ストラテジーの設定
 * - 認証プロバイダーへのリダイレクト処理
 * - 認証プロバイダーからのコールバック処理
 * - セッションからユーザー情報を取得するユーティリティ関数の提供
 * 
 * 注意:
 * - セッションの初期化や Passport.js の初期化は、`index.js` で実施されています。
 * - このファイルでは、認証に特化したロジックのみを扱います。
 * 
 * 環境変数:
 * - GCP_ISSUER, GCP_AUTH_URL, GCP_TOKEN_URL, GCP_USERINFO_URL: OIDC プロバイダーの設定
 * - GCP_CLIENT_ID, GCP_CLIENT_SECRET: OIDC クライアントの認証情報
 * - PROTOCOL_AND_DOMAIN: 公開時のプロトコルとドメイン
 * - NODE_ENV: 環境モード (例: 'test', 'debug-id-wihtout-oidc')
 * 
 */
import express from 'express';
const router = express.Router();

import passport from 'passport';
import { Strategy as OpenidConnectStrategy } from 'passport-openidconnect';

import { createInstance4OpenidConnectStrategy } from './auth_oidc_common.js';
import { debugLog } from '../utils/debug_log.js';

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '';
const FRONTEND_REDIRECT_URL_SUCCESS = `${FRONTEND_ORIGIN}/index.html?status=loginsuccess&statuscode=200`;
const FRONTEND_REDIRECT_URL_FAIL = `${FRONTEND_ORIGIN}/index.html?status=loginfail&statuscode=401`;


// ここで、
// 「OpenidConnectStrategy = require("passport-openidconnect")」を
// Passport.jsのStrategyに設定した場合、Passportとしてのsessino初期化が必須となる。
// 
// OIDCでの認証だけでなく、その後に続く認可処理でも
// 同一のセッションを利用するため（共有するため）、
// ./auth/index.js の方で以下を記載している。
// 
// > app.use(passport.initialize());
// > app.use(passport.session());





/**
 * 下記のOIDC連携ログインの情報は、GCPは以下のコンソールから設定と取得を行う。
 * https://cloud.google.com/
 * https://console.developers.google.com/
 * 
 */
const THIS_ROUTE_PATH = 'auth'; // このフォルダーのパス名
const THIS_STRATEGY_NAME = 'openidconnect-gcp'; // OIDC-Strategyの識別子。passport.use()に、OIDC_CONFIGを登録する際に指定する。
let OIDC_CONFIG = {
    ISSUER        : process.env.GCP_ISSUER,
    AUTH_URL      : process.env.GCP_AUTH_URL,
    TOKEN_URL     : process.env.GCP_TOKEN_URL,
    USERINFO_URL  : process.env.GCP_USERINFO_URL,  
  
    CLIENT_ID : process.env.GCP_CLIENT_ID,
    CLIENT_SECRET : process.env.GCP_CLIENT_SECRET,
    RESPONSE_TYPE : 'code', // Authentication Flow、を指定
    SCOPE : 'profile email', // 「openid 」はデフォルトで「passport-openidconnect」側が付与するので、指定不要。
    REDIRECT_URI_DIRECTORY : 'callback', // 「THIS_ROUTE_PATH + この値」が、OIDCプロバイダーへ登録した「コールバック先のURL」になるので注意。
    PROTOCOL_AND_DOMAIN : (process.env.PROTOCOL_AND_DOMAIN) 
        ? process.env.PROTOCOL_AND_DOMAIN 
        : ''
        // 公開時＝httpsプロトコル動作時は、明示的にドメインを指定する必要がある。
        // 例えば「PROTOCOL_AND_DOMAIN=https://XXXX.azurewebsites.net」など。
        // ローカル動作時は上記の環境変数「PROTOCOL_AND_DOMAIN」は指定不要。
};

// テスト用にOIDCのIdp側の応答をMock下に相当する応答得差し替える。
if( process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'debug-id-wihtout-oidc' ){
    // routerの場合は、module.exports がそのままrouterで置き換えらえる仕様なので、
    // 個別では無くて、 routerに対してプロパティを足すことで対応する。

    OIDC_CONFIG = {
        ISSUER        : 'dummy.env.GCP_ISSUER',
        AUTH_URL      : 'dummy.env.GCP_AUTH_URL',
        TOKEN_URL     : 'dummy.env.GCP_TOKEN_URL',
        USERINFO_URL  : 'dummy.env.GCP_USERINFO_URL',  
      
        CLIENT_ID : 'dummy.env.GCP_CLIENT_ID',
        CLIENT_SECRET : 'dummy.env.GCP_CLIENT_SECRET',
        RESPONSE_TYPE : 'code', // Authentication Flow、を指定
        SCOPE : 'profile email', // 「openid 」はデフォルトで「passport-openidconnect」側が付与するので、指定不要。
        REDIRECT_URI_DIRECTORY : 'callback', // 「THIS_ROUTE_PATH + この値」が、OIDCプロバイダーへ登録した「コールバック先のURL」になるので注意。
        PROTOCOL_AND_DOMAIN : ''
    };
}




// OIDCの認可手続きを行うためのミドルウェアとしてのpassportをセットアップ。-------------------------------------------------
const Instance4GoogleOIDC = createInstance4OpenidConnectStrategy(
    OpenidConnectStrategy,
    OIDC_CONFIG,
    THIS_ROUTE_PATH
);




/**
 * Strategies used for authorization are the same as those used for authentication. 
 * However, an application may want to offer both authentication and 
 * authorization with the same third-party service. 
 * In this case, a named strategy can be used, 
 * by overriding the strategy's default name in the call to use().
 * 
 * https://www.passportjs.org/docs/configure/
 * の、大分下の方に、上述の「a named strategy can be used」の記載がある。
*/
passport.use(THIS_STRATEGY_NAME, Instance4GoogleOIDC)




// ログイン要求を受けて、OIDCの認可プロバイダーへリダイレクト。-------------------------------------------------
if( process.env.NODE_ENV != 'debug-id-wihtout-oidc' ){
    // 本番環境でのOIDC認証を行う。
    router.get(
        '/login', 
        passport.authenticate(THIS_STRATEGY_NAME)
    );
}else{
    // テスト用のMock動作を行う。
    // OIDCの認可プロバイダーへリダイレクトをSkipする。
    // その代わり、環境変数で与えられた固定IDでログインしたものとして、
    // セッションにユーザー情報を格納してからリダイレクトする。
    const sessionInfoUser = {
        issuer: "Duumy-issuer",
        sub: process.env.DEBUG_USER_PROFILE_ID,
        name: process.env.DEBUG_USER_PROFILE_DISPLAYNAM,
        email: "sample@example.com",
        tokens: {
            // 以降でIdPへ追加の情報取得はしないので（UserInfoは取得済みなので）
            // IdPから受け取ったaccessToken等は保持しない。
            //
            // IDトークンの情報は、続く認可APIの呼び出し時に必要になるので、
            // セッションに保持しておく。
            // なお、IDトークンのidキー（=subキー)があれば認可処理は可能。
            idToken: "Dummy-idToken",
        }
    }
    router.get(
        '/login',
        function (req, res) {
            debugLog('[DEBUG] OIDCをスキップして、環境変数で与えられた固定IDでログインする');
            req.session.passport = { user : sessionInfoUser};
            res.redirect(FRONTEND_REDIRECT_URL_SUCCESS);
        }
    );
}




// OIDCの認可プロバイダーからのリダイレクトを受ける。---------------------------------------------------------
// ※この時、passport.authenticate() は、渡されてくるクエリーによって動作を変更する仕様。
router.get(
    // ※本設計では、成功と失敗のUI表示はSPA側で行うので、
    //   ここでは、成功時のリダイレクト先は「loginsuccess」、失敗時は「loginfail」としている。

    '/' + OIDC_CONFIG.REDIRECT_URI_DIRECTORY,
    passport.authenticate(
        THIS_STRATEGY_NAME, {
          failureRedirect: FRONTEND_REDIRECT_URL_FAIL,
        }
    ),
    function (req, res) {
        // Successful authentication, redirect home.
        debugLog("認可コード:" + req.query.code);
        debugLog('--- [DEBUG] Session after authentication: ---');
        debugLog(req.session);
        // このセッションオブジェクトのpassport.userに、
        // `./auth/index.js`側の`passport.serializeUser()`で格納した
        // OIDCで受け取ったIssuer, subクレーム, name, email, tokens={idToken}が格納されている。
        debugLog('---------------------------------------------');
        res.redirect(FRONTEND_REDIRECT_URL_SUCCESS);
    }
);




export default router;
