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
        application.get(this.basePath, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [this.findAll] },
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
        ]));
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(this.basePath, this.create);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
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
