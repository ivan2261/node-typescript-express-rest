import { User } from '../models/UserModel';
import * as bcrypt from 'bcrypt-nodejs';
import * as util from 'util';
import UserRepository from '../schemas/UserSchema';
import { BaseService } from './BaseService';

/**
 * @class UserService
 */
export class UserService extends BaseService<User> {

    Repository = UserRepository;

    /**
     * @description Fetches single user from the storage by email or name
     * @param {string} name
     * @param {string} email
     * @returns {Promise<User>}
     */
    async findByNameOrEmail(name: string, email: string): Promise<User> {
        const user: User = await this.Repository.findOne({ $or: [{ email: email }, { name: name }] });
        return user;
    }

    /**
     * @description Compares encrypted and decrypted passwords
     * @param {string} candidatePassword
     * @param {string} storedPassword
     * @returns {boolean}
     */
    comparePassword(candidatePassword: string, storedPassword: string): boolean {
        const qCompare = (util as any).promisify(bcrypt.compare);
        return qCompare(candidatePassword, storedPassword);
    }
}

export { User };
