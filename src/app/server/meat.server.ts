import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { IRouter } from '../interfaces/router.interface';
import { environment } from '../../environments/environment';

class MeatServer {
    // tslint:disable-next-line: variable-name
    private _application: restify.Server | undefined;

    get application(): restify.Server {
        return this._application!;
    }

    public bootstrap(routers: IRouter[]): Promise<MeatServer> {
        return this.initializeDatabase()
            .then(() => this.initRoutes(routers)
                .then(() => this));
    }

    private initializeDatabase(): Promise<mongoose.Mongoose> {
        return mongoose.connect(environment.database.url, { useNewUrlParser: true });
    }

    private initRoutes(routers: IRouter[]): Promise<restify.Server> {
        return new Promise<restify.Server>((resolve, reject) => {
            try {

                this._application = restify.createServer({
                    name: 'Meat API',
                    version: '1.0.0'
                });

                this._application.use(restify.plugins.bodyParser());

                this._application.get('/hello', (req, res, next) => {
                    res.json({ message: 'Hello World' });
                    return next();
                });

                routers.forEach((router: IRouter) => {
                    router.applyRouter(this._application!);
                });

                this._application.listen(3000, () => {
                    resolve(this._application);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

}

export default new MeatServer();