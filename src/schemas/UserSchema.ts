import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as util from 'util';
import { User } from '../models/UserModel';

type UserDocument = mongoose.Document & User;

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    name: String,
    password: String,
    email: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.hashPassword = function () {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
};

userSchema.methods.comparePassword = function (candidatePassword: string) {
    const qCompare = (util as any).promisify(bcrypt.compare);
    return qCompare(candidatePassword, this.password);
};

const UserRepository = mongoose.model<UserDocument>('User', userSchema);
export default UserRepository;