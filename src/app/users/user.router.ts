import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { Router } from '../server/router';
import { IUser, userModel } from './user.model';

class UserRouter extends Router {

    constructor() {
        super();
        this.on('beforeRender', (document: mongoose.Document | IUser | any) => {
            if (document.password) {
                document.password = undefined;
            }
        });
    }

    public applyRouter(application: restify.Server): void {

        application.get('/users', (req, res, next) => {
            userModel.find().exec().then(this.render(req, res, next));
        });

        application.get('/users/:id', (req, res, next) => {
            userModel.findById(req.params.id).exec().then(this.render(req, res, next));
        });

        application.post('/users', (req, res, next) => {
            userModel.create(req.body).then(this.render(req, res, next));
        });

        application.put('/users/:id', (req, res, next) => {
            const options: mongoose.ModelUpdateOptions = { overwrite: true, runValidators: true };
            userModel.update({ _id: req.params.id }, req.body, options)
                .exec().catch((err) => { console.log('Failed'); })
                // @ts-ignore
                .then((query: mongoose.Query<any>) => {
                    // @ts-ignore
                    if (query.n) {
                        return userModel.findById(req.params.id).exec();
                    } else {
                        res.send(404);
                    }
                }).then(this.render(req, res, next));
        });

        application.patch('/users/:id', (req, res, next) => {
            const options: mongoose.QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
            userModel.findByIdAndUpdate(req.params.id, req.body, options).exec()
                .then(this.render(req, res, next));
        });

        application.del('/users/:id', (req, res, next) => {
            userModel.findByIdAndDelete(req.params.id).exec()
                .then(this.render(req, res, next));
        });

    }
}

export const userRouter: UserRouter = new UserRouter();
