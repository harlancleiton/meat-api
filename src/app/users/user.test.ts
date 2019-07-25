import 'jest'
import * as supertest from 'supertest';
import { environment } from '../../environments/environment';
import { meatServer, MeatServer } from '../server/meat.server';
import { IUser, userModel } from './user.model';
import { userRouter } from './user.router';

let address: string;
let server: MeatServer;
beforeAll(() => {
    environment.database.url = process.env.DATABASE_URL || 'mongodb://localhost/meat-api-test';
    environment.server.port = process.env.PORT || 3001;
    address = `http://localhost:${environment.server.port}`;
    server = new MeatServer();
    return server.bootstrap([userRouter])
        .then(() => userModel.deleteMany({}).exec())
        .catch(console.error);
});

afterAll(() => {
    return userModel.deleteMany({}).exec()
        .then(() => server.shutdown())
        .catch(fail);
});

test('get /users', () => {
    return supertest(address)
        .get('/users')
        .then((response) => {
            expect(response.status).toBe(200);
        }).catch(fail);
});

test('post /users', () => {
    const name = 'Harlan Cleiton';
    const email = 'harlancleiton@gmail.com';
    const password = 'password';
    const cpf = '92232767728';
    const gender = 'MALE';
    return supertest(address)
        .post('/users')
        .send({ name, email, password, cpf, gender })
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(name);
            expect(response.body.email).toBe(email);
            expect(response.body.cpf).toBe(cpf);
            expect(response.body.gender).toBe(gender);
            expect(response.body.password).toBeUndefined();
        }).catch(fail);
});
