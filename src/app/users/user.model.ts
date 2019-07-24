import * as mongoose from 'mongoose';
import { encryptPassword } from '../middlewares/encrypt-password.middleware';
import { cpfValidator } from '../validators/cpf.validator';

export interface IUser extends mongoose.Document {
    id: string;
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserModel extends mongoose.Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}

const userSchema: mongoose.Schema = new mongoose.Schema({
    cpf: {
        type: String,
        validate: {
            msg: '{PATH}: Invalid CPF ({VALUE})',
            validator: cpfValidator,
        }
    },
    email: {
        // tslint:disable-next-line: max-line-length
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true,
        type: String,
        unique: true,
    },
    gender: {
        enum: ['MALE', 'FEMALE'],
        type: String,
    },
    name: {
        maxlength: 80,
        minlength: 3,
        required: true,
        type: String,
    },
    password: {
        required: true,
        select: false,
        type: String,
    },
},
    {
        timestamps: true
    }
);

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};

userSchema.pre('save', encryptPassword);
userSchema.pre('findOneAndUpdate', encryptPassword);
userSchema.pre('update', encryptPassword);

export const userModel: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
