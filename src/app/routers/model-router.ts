import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { BaseRouter } from './base-router';

export abstract class ModelRouter<T extends mongoose.Document, U extends mongoose.Model<T>> extends BaseRouter<T> {
    constructor(protected model: U) {
        super();
    }

    public findAll = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.find()
            .then(this.renderAll(req, res, next))
            .catch(next);
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
            .then(this.render(req, res, next)).catch(next);
    }

    public delete = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.findByIdAndDelete(req.params.id).exec()
            .then(this.render(req, res, next)).catch(next);
    }

    protected prepareOneQuery(query: mongoose.DocumentQuery<T | null, T>): mongoose.DocumentQuery<T | null, T> {
        return query;
    }
}
