import 'jest';
import * as jestCli from 'jest-cli';
import * as supertest from 'supertest';
import { restaurantModel } from './app/restaurants/restaurant.model';
import { restaurantRouter } from './app/restaurants/restaurant.router';
import { reviewModel } from './app/reviews/review.model';
import { reviewRouter } from './app/reviews/review.router';
import { MeatServer } from './app/server/meat.server';
import { userModel } from './app/users/user.model';
import { userRouter } from './app/users/user.router';
import { environment } from './environments/environment';

let server: MeatServer;
const beforeAllTests = () => {
    environment.database.url = process.env.DATABASE_URL || 'mongodb://localhost/meat-test';
    environment.server.port = process.env.PORT || 3001;
    server = new MeatServer();
    return server.bootstrap([userRouter, reviewRouter, restaurantRouter])
        .then(() => userModel.deleteMany({}).exec())
        .then(() => reviewModel.deleteMany({}).exec())
        .then(() => restaurantModel.deleteMany({}).exec());
    // .catch(console.error);
};

const afterAllTests = () => {
    return server.shutdown();
};

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
