import * as restify from 'restify';
import { Router } from '../server/router';

class UserRouter extends Router {
    public applyRouter(application: restify.Server): void {
        application.get('/users', (req, res, next) => {
            res.json({ message: 'Users works!' });
            return next();
        });
    }
}

export default new UserRouter();
