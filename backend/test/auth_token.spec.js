import app from '../src/app.js'; // Expressアプリのエントリーポイント
import JwtService from '../src/shared/jwt.js';
import UserIds from '../src/shared/userId.js';


import sinon from 'sinon';

import * as chai from 'chai';
import { request as chaiRequest, default as chaiHttp } from 'chai-http';
const expect = chai.expect;
chai.use(chaiHttp);
// ref. https://www.chaijs.com/plugins/chai-http/
//      https://www.chaijs.com/guide/using-chai-with-esm-and-plugins/




describe('POST /auth/token', () => {
    let signStub;
    let findAsPromiseStub;

    beforeEach(() => {
        // jwt.signPromiseのスタブ
        signStub = sinon.stub(JwtService.prototype, 'signPromise');
        // UserIds.findAsPromiseのスタブ
        findAsPromiseStub = sinon.stub(UserIds.prototype, 'findAsPromise');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 401 if session is invalid', (done) => {
        chaiRequest.execute(app)
            .post('/auth/token')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error', 'Unauthorized');
                done();
            });
    });

    it('should return 500 if user ID retrieval fails', (done) => {
        // スタブの動作を定義
        findAsPromiseStub.rejects(new Error('User ID retrieval failed'));

        // テスト用のリクエスト
        chaiRequest.execute(app)
            .post('/auth/token')
            .send({ stubsub: process.env.DEBUG_USER_PROFILE_ID })
            // ↑リクエストボディにstubsubを設定
            // ↑本番環境では、req.session.passport.user.subで判断する（サーバーサイドのみ参照可能なセッション）ので、
            //  POSTリクエストボディは不要。
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error', 'Internal Server Error');
                done();
            });
    });

    it('should return accessToken and email if session is valid', (done) => {
        // スタブの動作を定義
        findAsPromiseStub.resolves('mockUserId');
        signStub.resolves('mockJwtToken');

        // テスト用のリクエスト
        chaiRequest.execute(app)
            .post('/auth/token')
            .send({ stubsub: process.env.DEBUG_USER_PROFILE_ID })
            // ↑リクエストボディにstubsubを設定
            // ↑本番環境では、req.session.passport.user.subで判断する（サーバーサイドのみ参照可能なセッション）ので、
            //  POSTリクエストボディは不要。
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken', 'mockJwtToken');
                expect(res.body).to.have.property('email', 'sample@example.com');
                done();
            });
    });
});