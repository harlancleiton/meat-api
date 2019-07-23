import * as mongoose from 'mongoose';
import { BaseRouter } from './app/routers/base-router';
import { meatServer } from './app/server/meat.server';
import { userRouter } from './app/users/user.router';

console.log('Hello World');

const routers: Array<BaseRouter<mongoose.Document>> = [
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
