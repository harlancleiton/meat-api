import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../routers/model-router';
import { IRestaurant, IRestaurantModel, restaurantModel } from './restaurant.model';

class RestaurantRouter extends ModelRouter<IRestaurant, IRestaurantModel> {
    constructor() {
        super(restaurantModel);
    }

    public applyRouter(application: restify.Server) {
        application.get(this.basePath, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(this.basePath, this.create);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenuByRestaurantId]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenuByRestaurantId]);
    }

    protected envelope(document: IRestaurant): IRestaurant {
        const resource: IRestaurant | any = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    private findMenuByRestaurantId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.findById(req.params.id).select('menu')
            .exec()
            .then((restaurant: IRestaurant | null) => {
                if (restaurant) {
                    res.json(restaurant.menu);
                } else {
                    res.send(404);
                }
                return next();
            }).catch(next);
    }

    private replaceMenuByRestaurantId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
        this.model.findById(req.params.id).select('menu')
            .exec()
            .then((restaurant: IRestaurant | null): Promise<IRestaurant> => {
                if (restaurant) {
                    restaurant.menu = req.body;
                    return restaurant.save();
                } else {
                    throw new NotFoundError('Restaurant not found');
                }
            }).then((restaurant: IRestaurant) => {
                res.json(restaurant.menu);
                return next();
            }).catch(next);
    }
}

export const restaurantRouter: RestaurantRouter = new RestaurantRouter();
