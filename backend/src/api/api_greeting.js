import JwtService from '../shared/jwt.js';
const jwtService = new JwtService(); // 必要なパラメータは環境変数に設定済みなので、ここはこれでよい。







/**
 * JWTトークンを検証し、ユーザー名に応じた挨拶メッセージを返す。
 * リクエストbodyにmessageキーがあれば、その値をrequestMessageとしてレスポンスに追加する。
 *
 * @param {string} token - 検証対象のJWTアクセストークン
 * @param {object} [body] - リクエストボディ（オプション）
 * @returns {Promise<{statusCode: number, bodyObject: object}>}
 *   statusCode: HTTPステータスコード
 *   bodyObject: { message: string, requestMessage?: string } または { error: string }
 */
export const handleGreetingRequest = async (token, body = {}) => {
    try {
        const decoded = await jwtService.verifyPromise(token);
        const name = decoded.name || 'ゲスト';
        const greetings = [
            `こんにちは、${name}さん！`,
            `やあ、${name}さん。調子はどう？`,
            `${name}さん、お元気ですか？`,
            `ハロー ${name}！今日もいい日になりますように！`,
        ];
        const message = greetings[Math.floor(Math.random() * greetings.length)];

        let response = { message };
        if (body && typeof body === 'object' && body.message) {
            response.requestMessage = body.message;
        }

        return {
            statusCode: 200,
            bodyObject: response,
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 401,
            bodyObject:{ error: 'Unauthorized' },
        };
    }

}