import assert from 'assert';
import JwtService from '../src/shared/jwt.js';


describe('JwtService Class', function () {
    let jwtService;

    before(() => {
        const config = {
            // テスト用に生成した有効なRSA鍵ペアです。
            // 単体テストの実行時にのみ使用し、実運用には一切利用しません。
            // この鍵が外部に流出してもサービスや本番環境の安全性には影響がありません。
            publicBase64: 'LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJDZ0tDQVFFQXFqYS83MmNERlljVHpOOVl3T1l1L3NiclFacFo4ZEtnOHo2RithM1dMNVpuSTlqdmxFRVEKdWwrZWtRT2UycUp0S3I4ODREMi83dFB0RlIzM3NNb3REeUpaZVpVaWNQUTR1aE05aTFSZ3lCMXlEZytSRWNkKwpHYkdzbDdhNk9QQ0NRMU9qTWtDc3drL2N0dWJjWHFpb1RwbEc4NTZoMldOZTFEenZpbmtzeEtNUkZlNXZyNW83CjV2YmRMcW9IK2JHbmxXaFQybGRKNkZWN3ZNWWtQcHdFV3dYL2J0M1NRM2RKTVp4OVoxelZXbG1xcDlkNEpjMU0KbGFkTWVkY3BoUXg4VzJlSGtRWFpaTXB3L2VoMkE1cGpreVlCaDh1MWErdTJsM3EwdzZReHN5Rkd1ODdVaHhxRwp2VE9EOHZ4dXhKZ294ZThIOU8vR015TFVZUTVhVGIvSGZRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K',
            secretBase64: 'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBcWphLzcyY0RGWWNUek45WXdPWXUvc2JyUVpwWjhkS2c4ejZGK2EzV0w1Wm5JOWp2CmxFRVF1bCtla1FPZTJxSnRLcjg4NEQyLzd0UHRGUjMzc01vdER5SlplWlVpY1BRNHVoTTlpMVJneUIxeURnK1IKRWNkK0diR3NsN2E2T1BDQ1ExT2pNa0Nzd2svY3R1YmNYcWlvVHBsRzg1NmgyV05lMUR6dmlua3N4S01SRmU1dgpyNW83NXZiZExxb0grYkdubFdoVDJsZEo2RlY3dk1Za1Bwd0VXd1gvYnQzU1EzZEpNWng5WjF6VldsbXFwOWQ0CkpjMU1sYWRNZWRjcGhReDhXMmVIa1FYWlpNcHcvZWgyQTVwamt5WUJoOHUxYSt1MmwzcTB3NlF4c3lGR3U4N1UKaHhxR3ZUT0Q4dnh1eEpnb3hlOEg5Ty9HTXlMVVlRNWFUYi9IZlFJREFRQUJBb0lCQVFDU2s1c3RHZFE2RVp3bgpiSjROWHl0UkV4TTc1eU5WYjBCU3Q2Qy9wY2N3SzZDZDZnNUY2Tkh5N0t5cnpDWmJ1RXV4NkFVUVJaeW1tYkVyCjRpYU9BMHhTSUE1VStPd3p3TnVvd1REYWJzcjVDUUpTd1d6M2xvY3NzU2dqYmFObnJSVS96U0pZQUFIRlF1aWEKU0t1MGlDQ0hyczYrcy9oRUw2SlZ1ak85VnlRS0g4cU9Ga3VMSDQveDRuT2kzV3BZc0hDUW15NjFrUGc0QjVQcApCY2VoK1UwUlVVUXdvd2VMSmpyTUlnak1ZNDBWZk5hYTU5cUVLbmxsblFLR2o5Kzl4NEtIVHBOTDRNVUFNNnJoClJhZjZiNmxnUjJJODl1NWJzWlN0eGpnUzMyN2VvU0Z5a0dMYXdDTzNwaXg4SU1CNGs3VjlHTzA4NnRETHI1SzkKa0o2NnhuNkJBb0dCQU5wNHBWTWF4bnV6T0c0Y0FOVDFHK01KRFRjT1hOVlMrM1lDSjU1bXZxa3RHTTczOVdOaQp3WVljZTBpTDdGSG0xQVo4NFdNcU9BZVU4NjI0OURHazd4c1ZhV2NUenhpZjFXV0dPOHN2bEEwMzJUd1IrZ1RtCi9nVk9KZjVoUTFTaDNYSVArc1VkOExhRlQzdlp5L1RncWcvZGN5ME1pUjFyQS9aTHB1MG1QS2twQW9HQkFNZHoKOTRJNFdWV2RkZkNlUnhZMmozS2p0WDQ2cEkwdXlESWJpZ2ptMUdFSE5yMTAweXJBN2xpQ2JaY2llVEt2aEZwRQpRdmkvK1YySW5GdTYxV2RtNElFRGJ4QjAyVmRtY0pPTDY5Y3c0OEUrNzhtckRMTEdnTGNkSGk0VUNHdHJYc3NGCkRlOCtub0hhZVh5aE5uRmtpWDYvejZkWjRFcTZTdmMxWUo3eUNQSTFBb0dCQUtWZFNKWTg0QnZscmtMNkEwOHUKTUd1TEFHdTUvVjZqTHg5RnhrTkp0ZXRMN1VsTHVudjkxa255NlFZaWt6L3pIbTNDdkw5WXg0eEZuS1RVS0ZJagphN0R1WmhmVmtKNHM3Vk9wWlQwSXlHR3c4a2RidkFsVjV0U1JNSVQ1amdOVGVkREtjNkFjWjRWZ0pxZXlWWVVIClFQSTlSdDdFYkV6T0lmT2RrNzVSZ1B6eEFvR0FENUtwWjV4NHRTdVhNdE5ZMzQ0aEF5VnZIVXo4M2gwaCttK1cKQm4zblpUQUlBU0RtLy9hU1pZekJlOFJ3VEJuU0xxNFh3STVVclEzbWoyNzJESjNHdDZ3Sjl2SDRxazlRU09UcQo1Q0ZvRndXUCtXSUdtc3JPNy8weEJ3My9Ya3ZDMmYwcUNsME1TVDFDc1ExeFQ4YzJ5Uk8yNWUwcGl3d2lvRXlsCm42TnNPV1VDZ1lBc3BlZ2MxNkJuRHd3a1k4bm51ZGlxQldSVjN6anoybEdWWE9EODcxczdjaThxWnpnbThRdTIKeVRCcU1qZTg5Z1lWdklDUk9IcDlsTDA4cGJhL2wyK0NzcVFBZ3ZGNEwvYno5VGZjR2JQblhRRWdQNURVWHFpNwpFNU1JcFNPWUVyK2ZkZm96L0VkcWNlcjZzMGtTRE1FZ0VWbFVkT1ZBVVdXdFpuUE8zM3FPaVE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=',
            passphraseSecret: '', // 空文字
            issuerUri: 'https://example.com',
            expireMin: 60,
        };
        jwtService = new JwtService(config);
    });

    describe('signPromise()', function () {
        it('should generate a valid JWT token', async function () {
            const token = await jwtService.signPromise({ sub: 'user123' });
            assert.ok(typeof token === 'string');
            assert.strictEqual(token.split('.').length, 3); // JWT形式を確認
        });
    });

    describe('verifyPromise()', function () {
        it('should decode a valid token correctly', async function () {
            const token = await jwtService.signPromise({ sub: 'user123' });
            const decoded = await jwtService.verifyPromise(token);

            assert.strictEqual(decoded.sub, 'user123');
            assert.strictEqual(decoded.iss, 'https://example.com');
            assert.strictEqual(decoded.aud, 'https://example.com');
            assert.ok(decoded.iat);
            assert.ok(decoded.exp);
        });

        it('should reject an invalid token', async function () {
            const invalidToken = 'invalid.token.string';
            await assert.rejects(() => jwtService.verifyPromise(invalidToken), {
                name: 'JsonWebTokenError',
            });
        });

        it.skip('should reject a token with an expired validity period', async function () {
            const expiredConfig = {
                ...jwtService.config,
                expireMin: -1, // Set expiration time to the past
                // ↑この設定は不可。
            };
            const expiredJwtService = new JwtService(expiredConfig);
            const token = await expiredJwtService.signPromise({ sub: 'user123' });

            await assert.rejects(() => jwtService.verifyPromise(token), {
                name: 'TokenExpiredError',
            });
        });
    });
});
