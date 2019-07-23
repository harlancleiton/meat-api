import { EventEmitter } from 'events';
import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';
import { IRouter } from '../interfaces/router.interface';

export abstract class BaseRouter<T extends mongoose.Document> extends EventEmitter implements IRouter {
    public abstract applyRouter(application: restify.Server): void;

    public render(req: restify.Request, res: restify.Response, next: restify.Next): any {
        return (document: T): void => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(document);
            } else {
                res.send(404);
            }
            return next();
        };
    }

    public renderAll(req: restify.Request, res: restify.Response, next: restify.Next): any {
        return (documents: T[]) => {
            if (documents && documents.length > 0) {
                documents.forEach((document: T) => {
                    this.emit('beforeRender', document);
                    res.json(documents);
                });
            } else {
                res.json([]);
            }
            return next();
        };
    }

    protected validateId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            next();
        } else {
            next(new BadRequestError('Invalid ID'));
        }
    }
}
