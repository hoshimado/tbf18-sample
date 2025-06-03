/**
 * HTTPS接続かどうかを判定する関数。
 * 環境変数 PROTOCOL_AND_DOMAIN が定義されており、
 * その値が「https://」で始まる場合はHTTPSとみなす。
 * 
 * @returns {boolean} HTTPS接続か否か
 */
export function isHttps() {
    return process.env.PROTOCOL_AND_DOMAIN && process.env.PROTOCOL_AND_DOMAIN.startsWith('https://');
}
