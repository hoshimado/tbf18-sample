import express from 'express';
import createError from 'http-errors';

import authLoginRouter from './auth_login.js';
import authTokenRouter from './auth_token.js';
import authVerifyRouter from './auth_verify.js';
import { isHttps } from '../shared/protocol.js';
import { debugLog } from '../utils/debug_log.js';

const router = express.Router();

// 通信がHTTPSかHTTPかを判定。→セッションの設定値を分岐させるために必要。
const IS_HTTPS = isHttps();



// passport.js に対するsession設定 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 本バックエンドにおいてセッションを利用するのは'auth/'配下で提供する機能のみ
// なので（認証と認可）、ここでセッションを設定しておく。
// 他のパスは以下でも共通的にセッションを利用するケースでは、app.jsで設定する
// ことになる。
//
//
// ------
// OIDCのStrategyではstate管理（OIDCのハッキング対策の仕様）その他のため、
// セッションの利用が必要。これをしないと、
// 「OpenID Connect authentication requires session support when using state. 
//   Did you forget to use express-session middleware?'」
// のエラーが出る。
// ※passport-openidconnect\lib\state\session.js
// 　の以下でチェックされている。
//  > SessionStore.prototype.store = function(req, meta, callback) {
//  > if (!req.session) { return callback(new Error('OpenID Connect authentication requires session support when using state. Did you forget to use express-session middleware?')); }
// 
// なお、「passport = require("passport");」はシングルトンとして同一の
// インスタンスが返却される。
// ※「passport\lib\index.js】の以下で
//   > exports = module.exports = new Passport();
//   > 
//   と1回のみインスタンスを生成して、それが返却されてくる。
//   従って、他ファイルで「passport = require("passport");」としたときに、
//   取得されるインスタンスは同一。
// 
import session from 'express-session';
import passport from 'passport';
if( process.env.NODE_ENV == 'test' ){
    process.env.COOKIE_ID = 'DUMMY_COOKIE_ID';
}
const COOKIE_OPTIONS = (IS_HTTPS) ? {
    secure: true, // HTTPS接続時のみクッキーを送信する
    sameSite: 'none', // SameSite属性をnoneに設定
} : {
    secure: false, // HTTP接続時はクッキーを送信しない
    sameSite: 'lax', // SameSite属性をlaxに設定(デフォルト)
};
router.use(
    session({
        // クッキー改ざん検証用ID
        secret: process.env.COOKIE_ID,
        
        
        // その他のオプションは以下を参照
        // https://github.com/expressjs/session#sessionoptions
        resave: false,
        saveUninitialized: false,
        cookie: {
            // セッションIDを格納するクッキーのオプション
            ...COOKIE_OPTIONS,

            httpOnly: true,// クライアント側でクッキー値を見れない、書きかえれないようにするか否か
            maxAge: 30*1000, // 30秒, セッションの有効期限
        },
    })
);

router.use(passport.initialize());
router.use(passport.session());

// ミドルウェアである passport.authenticate() が正常処理したときに done(errorObject, userObject)で
// 通知された情報を、セッションに保存して、任意のcallback中でセッションから取り出せるようにする。
// 「何をセッションに保存すべきか？」を選択的に行うためのフックcallback関数。
//
// なお、「正常終了したときに呼ばれる」と言う公式の記載にはたどり着けず。。。
// 一応以下の非公式QAで
// > Passport uses serializeUser function to persist user data 
// > (after successful authentication) into session. 
// との記載はある。
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
// 
passport.serializeUser(function (sessionInfo, done) {
    debugLog("");
    debugLog("+++[serializeUser called with the following parameter]+++");
    debugLog(JSON.stringify(sessionInfo));
    debugLog("---[serializeUser]---------------------------------------\n");
    debugLog("");

    // 本サンプルでは、auth_oidc_common.jsでのdone(null,sessionINfo)にて
    // issuer, user={sub, name, email}, tokens={idToken}フィールドを持つオブジェクトを渡している。
    // なので、それを取り出して、セッションに格納しておくこととする。
    // 
    // なお、本来は「セッションにはuserIdのみを格納して、他の情報は
    // サーバー側のDBに保管する。その上で、deserializeUser()にて
    // 保管したDBから取り出して提供する」実装が望ましい。
    // が、本サンプルはあくまで「試行」なので、セッションにそのまま格納しておく。
    // （※この場合であっても、ブラウザ側のcookieに保持されるのはセッションIDのみであって、
    //     セッションの中身そのものではないことに留意）
    const sessionPassportUserObject = {};
    sessionPassportUserObject.issuer = sessionInfo.issuer; // OIDCのIssuer
    sessionPassportUserObject.sub = sessionInfo.user.sub; // OIDCのsubクレーム
    sessionPassportUserObject.name = sessionInfo.user.name; // OIDCのnameクレーム
    sessionPassportUserObject.email = sessionInfo.user.email; // OIDCのemailクレーム
    sessionPassportUserObject.tokens = sessionInfo.tokens;

    done(null, sessionPassportUserObject);
});
// 上記と対となる、取り出し処理。
passport.deserializeUser(function (obj, done) {
    // 本来は、上述のように「objに格納されたuserIdをキーとして、別途保管してある
    // 情報をDBから取得して渡す」のが望ましいが、本サンプルでは簡易化のため、
    // セッション「obj」に必要な情報をすべて保管してあるので、
    // 「obj」をそのまま渡すことが「取り出し」となる。
    done(null, obj);
});
//*/
// --- ここまで ----------------------------------------------------------





// 認証関連ルート
router.use(authLoginRouter);

// 認可関連ルート（例: /auth/token）
router.use(authTokenRouter);

// アクセストークン検証ルート
router.use(authVerifyRouter);

// セッション有効性確認ルート
router.get('/session', (req, res) => {
    debugLog('  [Debug] GET /auth/session called');
    debugLog('  [Debug] req.header: ');
    debugLog(JSON.stringify(req.headers, null, 2));
    debugLog('-----------------------------------');
    debugLog('  [Debug] req.session: ', req.session);
    debugLog('-----------------------------------');

    if (req.query.debug === 'true') {
        const isSessionActive = req.session && req.session.passport ? true : false;
        return res.json({ sessionActive: isSessionActive });
    }
    res.status(400).json({ error: 'Invalid query parameter' });
});

// catch 404 and forward to error handler
router.use(function (req, res, next) {
    next(createError(404));
});

export default router;