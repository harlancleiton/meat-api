import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { ModelRouter } from '../routers/model-router';
import { IUser, IUserModel, userModel } from './user.model';

class UserRouter extends ModelRouter<IUser, IUserModel> {

    constructor() {
        super(userModel);
        this.listenBeforeRender();
    }

    public applyRouter(application: restify.Server): void {
        application.get('/users', restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [this.findAll] },
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
        ]));
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.create);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }

    private findByEmail = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        if (req.query.email) {
            this.model.findByEmail(req.query.email)
                .then((user) => user ? [user] : [])
                .then(this.renderAll(req, res, next))
                .catch(next);
        } else {
            return next();
        }
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
