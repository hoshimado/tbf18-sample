import express from 'express';

import { handleGreetingRequest } from './api_greeting.js';

const router = express.Router();

// 挨拶メッセージ応答のルート（例： /api/greeting）
// ※本来は、↓とすべきなのだが、Lambda側の実装との共有の都合で変更する。
// router.use(apiGreeting);
router.post('/greeting', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            valid: false,
            message: 'Authorization header missing or malformed'
        });
    }

    const token = authHeader.split(' ')[1];
    const result = await handleGreetingRequest(token, req.body);
    return res.status(result.statusCode).json(result.bodyObject);
});

export default router;