import crypto from 'crypto';

const envFactory = {
    hashSecret       : process.env.HASH_SECRET || 'RXw9qS62oIo+BK6mOlFtyVVZCr9g/mhMYgzWuLBtkuI=',
    // ※この実装自体がサンプル（動作がFAKEに相当）なので、省略時の簡略動作を目的に即値で記載する。
    //   この種の値は本来は環境変数などを経由して設定すべきで、コードに即値で記載すべきではない。
};


class UserIds {
    // constructor() {
    // }
    
    /**
     * ODICのsubクレーム元に、対応するUserIdを取得する。
     * 
     * ※なお簡易実装のため、ここでは値を安全に一方向変換することで代替する（HMAC-SHA256 + Base64 secret）
     * 
     * @param {string} oidcSubClaim - OIDCのsubクレーム（元のユーザー識別子）
     * @returns {string} ハッシュ化された内部識別子（16文字）
     */
    findAsPromise(oidcSubClaim) {
        const secretKey = Buffer.from(envFactory.hashSecret, 'base64');
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(oidcSubClaim);
        return Promise.resolve(hmac.digest('hex').slice(0, 16)); // 16文字（例：UUID風に短縮）
    }
}

export default UserIds;

