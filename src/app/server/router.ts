import { EventEmitter } from 'events';
import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { IRouter } from '../interfaces/router.interface';

export abstract class Router extends EventEmitter implements IRouter {
    public abstract applyRouter(application: restify.Server): void;

    public render(req: restify.Request, res: restify.Response, next: restify.Next): any {
        return (document: mongoose.Document): void => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(document);
            } else {
                res.send(404);
            }
            return next();
        };
    }
}
