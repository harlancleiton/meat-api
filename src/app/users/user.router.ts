import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { Router } from '../server/router';
import { IUser, userModel } from './user.model';

class UserRouter extends Router {
    public applyRouter(application: restify.Server): void {

        application.get('/users', (req, res, next) => {
            userModel.find().exec().then((users: IUser[]) => {
                res.json(users);
                return next();
            });
        });

        application.get('/users/:id', (req, res, next) => {
            userModel.findById(req.params.id).exec().then((user: IUser | null) => {
                res.json(user);
                return next();
            });
        });

        application.post('/users', (req, res, next) => {
            userModel.create(req.body).then((user: IUser) => {
                user.password = undefined;
                res.json(user);
                return next();
            });
        });

        application.put('/users/:id', (req, res, next) => {
            userModel.updateOne({ _id: req.params.id }, req.body, { overwrite: true }).exec()
                .then((user: IUser | null) => {
                    console.log('User: ' + user);
                    res.json(user);
                    return next();
                });
        });

    }
}

export const userRouter: UserRouter = new UserRouter();
