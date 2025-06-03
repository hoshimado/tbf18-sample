/**
 * このファイルは、アクセストークンの検証APIのロジックを定義するモジュールです。
 * 
 * 主な機能:
 * - アクセストークン（JWT形式）の検証
 * 
 * 注意:
 * - 本APIはテスト用です。
 * - 有効なアクセストークンが付与されているか否かの検証のみを目的としたAPIを提供します。
 * 
 */

import express from 'express';
import JwtService from '../shared/jwt.js';

const router = express.Router();
const jwtService = new JwtService();

/**
 * POST /auth/verify
 * アクセストークンの有効性を検証するエンドポイント
 */
router.post('/verify', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            valid: false,
            message: 'Authorization header missing or malformed'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwtService.verifyPromise(token);
        return res.status(200).json({
            valid: true,
            userId: decoded.sub,
            expiresAt: new Date(decoded.exp * 1000).toISOString()
        });
    } catch (err) {
        return res.status(401).json({
            valid: false,
            message: 'Invalid or expired token'
        });
    }
});

export default router;
