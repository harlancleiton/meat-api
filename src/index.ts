import meatServer from './app/server/meat.server';
import { Router } from './app/server/router';
import { userRouter } from './app/users/user.router';

console.log('Hello World');

const routers: Router[] = [
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
