import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { ModelRouter } from '../routers/model-router';
import { IUser, userModel } from './user.model';

class UserRouter extends ModelRouter<IUser> {

    constructor() {
        super(userModel);
        this.listenBeforeRender();
    }

    public applyRouter(application: restify.Server): void {
        application.get('/users', this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.create);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }

    private listenBeforeRender(): void {
        this.on('beforeRender', (document: mongoose.Document | IUser | any) => {
            if (document.password) {
                document.password = undefined;
            }
        });
    }
}

export const userRouter: UserRouter = new UserRouter();
