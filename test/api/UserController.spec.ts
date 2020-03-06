import * as request from 'supertest';
import * as server from '../../src/index';
// import { expect } from 'chai';

describe('UserController', () => {

    it('Users should return 200', (done) => {
        request(server.default.express.app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

});
