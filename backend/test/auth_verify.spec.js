import app from '../src/app.js'; // Expressアプリのエントリーポイント
import JwtService from '../src/shared/jwt.js';

import sinon from 'sinon';
import * as chai from 'chai';
import { request as chaiRequest, default as chaiHttp } from 'chai-http';
const expect = chai.expect;
chai.use(chaiHttp);

// テストスイート
describe('POST /auth/verify', () => {
    let verifyStub;

    beforeEach(() => {
        // jwt.verifyPromiseのスタブ
        verifyStub = sinon.stub(JwtService.prototype, 'verifyPromise');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 401 if Authorization header is missing', (done) => {
        chaiRequest.execute(app)
            .post('/auth/verify')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('valid', false);
                expect(res.body).to.have.property('message', 'Authorization header missing or malformed');
                done();
            });
    });

    it('should return 401 if token is invalid or expired', (done) => {
        // スタブの動作を定義
        verifyStub.rejects(new Error('Invalid or expired token'));

        chaiRequest.execute(app)
            .post('/auth/verify')
            .set('Authorization', 'Bearer invalidToken')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('valid', false);
                expect(res.body).to.have.property('message', 'Invalid or expired token');
                done();
            });
    });

    it('should return 200 and token details if token is valid', (done) => {
        // スタブの動作を定義
        verifyStub.resolves({ sub: 'mockUserId', exp: Math.floor(Date.now() / 1000) + 3600 });

        chaiRequest.execute(app)
            .post('/auth/verify')
            .set('Authorization', 'Bearer validToken')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('valid', true);
                expect(res.body).to.have.property('userId', 'mockUserId');
                expect(res.body).to.have.property('expiresAt');
                done();
            });
    });
});