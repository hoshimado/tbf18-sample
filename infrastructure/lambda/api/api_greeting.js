import JwtService from '../shared/jwt.js';
const jwtService = new JwtService({
    publicBase64: '＜公開鍵を1行の文字列として出力したものを記載＞',
    // 【注意】本ケースでは、サンプルコード簡素化のため公開鍵をソースコード中に直書きしています。
    // あくまで動作検証を目的としたチュートリアル用の簡易実装であり、運用の容易性を最優先しています。
    // 本来は AWS Systems Manager Parameter Store や AWS Secrets Manager による安全な外部管理が推奨されます。
    // 開発・検証用途であっても、実装を伴う場合は少なくとも Lambda の環境変数による管理を推奨します。

    issuerUri: 'sample.spa.api.aws.localhost'
});



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