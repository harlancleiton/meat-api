import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { environment } from '../../environments/environment';
import { IUser } from '../users/user.model';

const hashPassword: (user: any, next: () => void) => void = (user: any, next: () => void) => {
    console.log('hash');
    bcrypt.hash(user.password, environment.security.saltRounds)
        .then((hash: string) => {
            console.log('then');
            user.password = hash;
            next();
        }).catch(next);
};

export const encryptPassword = function (next: () => void) {
    console.log('encrypt');
    // @ts-ignore
    const user: IUser | mongoose.Query = this;
    if (user.isModified && user.isModified('password')) {
        console.log('modified');
        hashPassword(user, next);
    } else if (user.getUpdate().password) {
        hashPassword(user.getUpdate(), next);
    } else {
        next();
    }
};
