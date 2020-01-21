import { expect } from 'chai';
import { User } from '../../src/models/UserModel';

describe('UserModel', () => {

    it('Users name should be Panda', (done) => {
        let name = 'panda';
        let model = new User(name);
        expect(model.name).to.be.equal(name);
        done();
    });

});
