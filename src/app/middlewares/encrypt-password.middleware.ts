import * as bcrypt from 'bcrypt';
import { environment } from '../../environments/environment';
import { IUser } from '../users/user.model';

export const encryptPassword = function (next: any) {
    // @ts-ignore
    const user: IUser = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, environment.security.saltRounds)
            .then((hash: string) => {
                user.password = hash;
                next();
            }).catch(next);
    } else {
        next();
    }
};
