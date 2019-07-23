import * as mongoose from 'mongoose';
import { restaurantRouter } from './app/restaurants/restarant.router';
import { BaseRouter } from './app/routers/base-router';
import { meatServer } from './app/server/meat.server';
import { userRouter } from './app/users/user.router';

console.log('Initializing Meat API');

const routers: Array<BaseRouter<mongoose.Document>> = [
    restaurantRouter,
    userRouter,
];

meatServer.bootstrap(routers)
    .then((server) => {
        console.log('Server is listening on: ', server.application.address());
    }).catch((err) => {
        console.log('Erro failed to start');
        console.error(err);
        process.exit(1);
    });
