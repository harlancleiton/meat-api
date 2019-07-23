import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../routers/model-router';
import { IReview, reviewModel } from './review.model';

class ReviewRouter extends ModelRouter<IReview> {
    constructor() {
        super(reviewModel);
    }

    public applyRouter(application: restify.Server) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.create);
        application.put('/reviews/:id', [this.validateId, this.replace]);
        application.del('/reviews/:id', [this.validateId, this.delete]);
    }

    protected prepareOneQuery(query: mongoose.DocumentQuery<IReview | null, IReview>)
        : mongoose.DocumentQuery<IReview | null, IReview> {
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name');
    }
}

export const reviewRouter: ReviewRouter = new ReviewRouter();
