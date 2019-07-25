import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { environment } from '../../environments/environment';
import { IPageOptions } from '../interfaces/page-options.interface';
import { BaseRouter } from './base-router';

export abstract class ModelRouter<T extends mongoose.Document, U extends mongoose.Model<T>> extends BaseRouter<T> {
    protected basePath: string;

    constructor(protected model: U) {
        super();
        this.basePath = `/${model.collection.name}`;
    }

    public findAll = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.countDocuments({}).exec()
            .then((totalElements: number) => {
                const pageOptions: IPageOptions = this.generatePageOptions(req, totalElements);
                this.model.find()
                    // TODO sort
                    // .sort('createdAt', -1)
                    .limit(pageOptions.pageSize)
                    .skip(pageOptions.skip)
                    .then(this.renderAll(req, res, next, pageOptions))
                    .catch(next);
            });
    }

    public findById = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.prepareOneQuery(this.model.findById(req.params.id))
            .exec()
            .then(this.render(req, res, next))
            .catch(next);
    }

    public create = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.create(req.body)
            .then(this.render(req, res, next))
            .catch(next);
    }

    public replace = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        const options: mongoose.ModelUpdateOptions = { overwrite: true, runValidators: true };
        // TODO melhorar update
        this.model.update({ _id: req.params.id }, req.body, options).exec()
            .then((query: any) => {
                if (query.n) {
                    res.send(204);
                } else {
                    res.send(404);
                }
                return next();
            }).catch(next);
    }

    public update = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        const options: mongoose.QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
        this.model.findByIdAndUpdate(req.params.id, req.body, options).exec()
            .then(() => {
                res.send(204);
                return next();
            }).catch(next);
    }

    public delete = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.findByIdAndDelete(req.params.id).exec()
            .then(this.render(req, res, next)).catch(next);
    }

    protected envelope(document: T): T {
        const resource: T | any = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }

    protected envelopeAll(documents: T[], pageOptions: IPageOptions): T[] {
        const resource: any = {
            _links: {
                self: ''
            },
            data: {
                items: documents,
                pagination: pageOptions,
            }
        };
        if (pageOptions.pageNumber) {
            // tslint:disable-next-line: max-line-length
            resource._links.previous = pageOptions.first ? undefined : `${this.basePath}?pageNumber=${pageOptions.pageNumber - 1}`;
            // tslint:disable-next-line: max-line-length
            resource._links.next = pageOptions.last ? undefined : `${this.basePath}?pageNumber=${parseInt(pageOptions.pageNumber.toString(), 10) + 1}`;
        }
        return resource;
    }

    protected prepareOneQuery(query: mongoose.DocumentQuery<T | null, T>): mongoose.DocumentQuery<T | null, T> {
        return query;
    }

    protected generatePageOptions(req: restify.Request, totalElements: number): IPageOptions {
        const pageSize: number = parseInt(req.query.pageSize || environment.pagination.size, 10);
        const pageNumber: number = parseInt(req.query.pageNumber || environment.pagination.page, 10);
        const skip: number = (pageNumber - 1) * pageSize;
        const first: boolean = pageNumber === 1;
        const last: boolean = totalElements <= pageNumber * pageSize;
        return { pageNumber, pageSize, totalElements, first, last, skip };
    }
}
