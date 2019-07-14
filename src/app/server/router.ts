import * as restify from 'restify';
import { IRouter } from '../interfaces/router.interface';

export abstract class Router implements IRouter {
    public abstract applyRouter(application: restify.Server): void;
}
