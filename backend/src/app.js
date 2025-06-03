import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'; // CORS対策で、異なるドメインに置いたフロントエンドからのリクエストを許可するために必要
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { isHttps } from './shared/protocol.js';


import authRouter from './auth/index.js';
import apiRouter from './api/index.js';

const app = express();
const IS_HTTPS = isHttps(); // 通信がHTTPSかHTTPかを判定。
if (IS_HTTPS) {
    console.log('  [Debug] HTTPS connection detected. - trust proxy set to true.');
    app.set('trust proxy', 1); // プロキシサーバーを信頼する設定。「CloudFront → Nginx → Express.js」構成で、Nxingにて「元はHTTPSだ」と付与する設定をする前提で、こうしておく。
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', // フロントエンドのURLを指定
    credentials: true, // Cookieを使用する場合はtrueに設定（レスポンスヘッダーにAccess-Control-Allow-Credentials追加）。
}));

// バックエンド処理するためのルーティング
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// それ以外は全て静的ホスティングファイルとして扱ってルーティング
app.use(express.static(path.join(__dirname, 'public')));

// [historyモード利用時の]フロントエンド用 catch-all ルーティング（SPA対応）
//app.get('*', (req, res) => {
//    // /auth や /api にマッチしなかった全てのリクエストは index.html を返す
//    res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});



export default app;
