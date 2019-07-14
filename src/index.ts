import meatServer from './app/meat.server';

console.log('Hello World');

meatServer.bootstrap()
    .then((server) => {
        console.log('Server is listening on: ', server.application.address());
    }).catch((err) => {
        console.log('Erro failed to start');
        console.error(err);
        process.exit(1);
    });
