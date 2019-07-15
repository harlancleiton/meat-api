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

        application.put('/users/:id', (req, resp, next) => {
            const options: mongoose.ModelUpdateOptions = { overwrite: true, runValidators: true };
            userModel.update({ _id: req.params.id }, req.body, options)
                // @ts-ignore
                .exec().then((query: mongoose.Query<any>) => {
                    // @ts-ignore
                    if (query.n) {
                        return userModel.findById(req.params.id).exec();
                    } else {
                        resp.send(404);
                    }
                }).then((user: IUser | null) => {
                    resp.json(user);
                    return next();
                });
        });

        application.patch('/users/:id', (req, res, next) => {
            const options: mongoose.QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
            userModel.findByIdAndUpdate(req.params.id, req.body, options).exec()
                .then((user: IUser | null) => {
                    if (user) {
                        res.json(user);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                });
        });

        application.del('/users/:id', (req, res, next) => {
            userModel.findByIdAndDelete(req.params.id).exec()
                .then((user: IUser | null) => {
                    if (user) {
                        res.send(204);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                });
        });

    }
}

export const userRouter: UserRouter = new UserRouter();
