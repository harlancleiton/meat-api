import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../routers/model-router';
import { IReview, IReviewModel, reviewModel } from './review.model';

class ReviewRouter extends ModelRouter<IReview, IReviewModel> {
    constructor() {
        super(reviewModel);
    }

    public applyRouter(application: restify.Server) {
        application.get(this.basePath, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(this.basePath, this.create);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }

    protected envelope(document: IReview): IReview {
        console.log('review envelope');
        const resource: IReview | any = super.envelope(document);
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restaurantId}`;
        return resource;
    }

    protected prepareOneQuery(query: mongoose.DocumentQuery<IReview | null, IReview>)
        : mongoose.DocumentQuery<IReview | null, IReview> {
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name');
    }
}

export const reviewRouter: ReviewRouter = new ReviewRouter();
