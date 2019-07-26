import 'jest';
import * as supertest from 'supertest';
import { environment } from '../../environments/environment';
import { meatServer, MeatServer } from '../server/meat.server';
import { IUser, userModel } from './user.model';
import { userRouter } from './user.router';

const name = 'Harlan Cleiton';
const email = 'harlancleiton@gmail.com';
const password = 'password';
const cpf = '92232767728';
const gender = 'MALE';
const user = { name, email, password, cpf, gender };

const address: string = (global as any).address;
console.log(address);

/*
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
*/

test('get /users', () => {
    return supertest(address)
        .get('/users')
        .then((response) => {
            expect(response.status).toBe(200);
        }).catch(fail);
});

test('get /users/invalidId', () => {
    return supertest(address)
        .get('/users/aaa')
        .then((response) => {
            expect(response.status).toBe(400);
        }).catch(fail);
});

test('path /users/:id', () => {
    return supertest(address)
        .post('/users')
        .send({
            email: 'usuario2@email.com',
            name: 'usuario2',
            password: '123456'
        })
        .then((response) => supertest(address)
            .patch(`/users/${response.body._id}`)
            .send({ name: 'Harlan Cleiton da Silva' })
            .then((response2) => {
                expect(response2.status).toBe(204);
                expect(response2.body).toEqual({});
            }).catch(fail))
        .catch(fail);
});

test('post /users', () => {
    return supertest(address)
        .post('/users')
        .send(user)
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
