import jwt from 'jsonwebtoken';

class JwtService {
    constructor(config = {}) {
        this.publicBase64     = config.publicBase64     || process.env.JWT_PUBLIC_KEY;
        this.secretBase64     = config.secretBase64     || process.env.JWT_PRIVATE_KEY;
        this.passphraseSecret = config.passphraseSecret || process.env.JWT_PASSPHRASE;
        this.issuerUri        = config.issuerUri        || process.env.JWT_ISSUER;
        this.expireMin        = config.expireMin        || process.env.JWT_EXPIRE_MINS;
        // https://kamichidu.github.io/post/2017/01/24-about-json-web-token/
    }

    /**
     * JWT形式でアクセストークンを発行する。
     * @param {Object} params - JWTのpayload、少なくとも `sub` を含むこと
     *     ※subと書いているが、OIDCのsubクレーム【相当】であればよく、対応するユーザーIDで良い。
     * @returns {Promise<string>} - 署名されたJWTトークン
     */
    async signPromise(params) {
        const payload = {
            sub: params.sub, // JWTのペイロードの観点からはsubキーが望ましい（というか必須）
            iss: this.issuerUri,
            aud: this.issuerUri, // 暫定的にissuerと同一
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (this.expireMin * 60),
            // 以下は余分（サンプルでのDB省略実装のために格納）
            name: params.name,
        };
        const options = {
            algorithm: 'RS256',
        };
        const privateKey = Buffer.from(this.secretBase64, 'base64');
        const token = jwt.sign(
            payload,
            {
                key: privateKey,
                passphrase: this.passphraseSecret
            },
            options
        );
        return Promise.resolve(token);
    }

    /**
     * JWTを検証する。
     * @param {string} token - 検証するJWTトークン
     * @returns {Promise<Object>} - デコード済みのペイロード
     */
    verifyPromise(token) {
        const publicKey = Buffer.from(this.publicBase64, 'base64');
        const options = {
            algorithms: ['RS256'],
            issuer: this.issuerUri,
            audience: this.issuerUri,
        };

        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKey, options, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}

export default JwtService;


