import * as restify from 'restify';

export interface IRouter {
    applyRouter(application: restify.Server): void;
}
