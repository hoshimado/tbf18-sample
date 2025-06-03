/**
 * このファイルは、認可に関連するロジックを定義するモジュールです。
 * 
 * 主な機能:
 * - アクセストークン（JWT形式）の生成
 * 
 * 注意:
 * - セッションの初期化は、`index.js` で実施されています。
 * - このファイルでは、認証に特化したロジックのみを扱います。
 * - auth_index.jsで実施した認証済み状態（セッションで管理）を前提とし、
 *   認可処理を行います。
 */
import express from 'express';
const router = express.Router();

import JwtService from '../shared/jwt.js'; // JWT生成・検証用モジュールをインポート
import UserIds from '../shared/userId.js'; // ユーザーID取得用モジュールをインポート
import { debugLog } from '../utils/debug_log.js';
const users = new UserIds();


router.post('/token', (req, res) => {
    let userSubClaim = null;
    let userEmailClaim = null;
    let userNameClaim = '';
    debugLog('  [Debug] POST /auth/token called');
    debugLog('  [Debug] req.body: ', req.body);
    debugLog('  [Debug] req.header: ');
    debugLog(JSON.stringify(req.headers, null, 2));
    debugLog('-----------------------------------');
    debugLog('  [Debug] req.session: ', req.session);
    debugLog('-----------------------------------');

    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.sub) {
        userSubClaim = req.session.passport.user.sub;
    }
    if( 
        process.env.NODE_ENV == 'test' || 
        process.env.NODE_ENV == 'debug-id-wihtout-oidc'
    ) {
        // テスト環境ではリクエストボディのsutbsubキーを参照して、
        // その値が DEBUG_USER_PROFILE_ID であれば、
        // テスト用のユーザーID(subクレーム)を返却する。
        // それ以外は、ユーザーIDにnullを設定する。
        const stubSub = req.body.stubsub;
        if (stubSub === process.env.DEBUG_USER_PROFILE_ID) {
            userSubClaim = stubSub;
            userEmailClaim = 'sample@example.com';
            userNameClaim = 'OIDC省略ユーザー';
            debugLog('  [Debug] POST MODE is stub-sub.');
        }
    }
    if (!userSubClaim) {
        return res.status(401).json({ error: 'Unauthorized' });
    }else if( !userEmailClaim ) {
        userEmailClaim = req.session.passport.user.email;
        userNameClaim  = req.session.passport.user.name;
    }

    // OIDCのsubクレームをキーにuserIdを取得
    const promise = users.findAsPromise(userSubClaim);
    promise.then((userId) => {
        // JWTペイロードを構築
        const payload = {
            sub: userId,
            // 以下は余分（サンプルでのDB省略実装のために格納）
            name: userNameClaim
        };

        // JWTを生成
        const jwt = new JwtService();
        return jwt.signPromise(payload);
    }).then((token)=>{
        // レスポンスを返却
        res.json({
            accessToken: token,
            email: userEmailClaim,
        });
    }).catch((error) => {
        console.error('Error retrieving user ID:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    });
});

export default router;





