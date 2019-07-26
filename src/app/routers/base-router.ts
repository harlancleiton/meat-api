import { EventEmitter } from 'events';
import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';
import { IPageOptions } from '../interfaces/page-options.interface';
import { IRouter } from '../interfaces/router.interface';

export abstract class BaseRouter<T extends mongoose.Document> extends EventEmitter implements IRouter {
    public abstract applyRouter(application: restify.Server): void;

    public render(req: restify.Request, res: restify.Response, next: restify.Next): any {
        return (document: T): void => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(this.envelope(document));
            } else {
                res.send(404);
            }
            return next(false);
        };
    }

    public renderAll(req: restify.Request, res: restify.Response, next: restify.Next, pageOptions: IPageOptions): any {
        return (documents: T[]) => {
            if (documents && documents.length > 0) {
                documents.forEach((document: T, index: number, array: T[]) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                res.json(this.envelopeAll(documents, pageOptions));
            } else {
                res.json(this.envelopeAll([], pageOptions));
            }
            return next(false);
        };
    }

    protected envelope(document: T): T {
        return document;
    }

    protected envelopeAll(documents: T[], pageOptions: IPageOptions): T[] {
        return documents;
    }

    protected validateId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            next();
        } else {
            next(new BadRequestError('Invalid ID'));
        }
    }
}
