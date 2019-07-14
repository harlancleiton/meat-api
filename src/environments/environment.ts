export const environment = {
    database: { url: process.env.DATABASE_URL || 'mongodb://localhost/meat-dev' },
    security: {
        jwtExpiration: process.env.JWT_EXPIRATION || 15,
        prefixToken: process.env.PREFIX_TOKEN || 'Bearer',
        saltRounds: process.env.SALT_ROUNDS || 10,
        // tslint:disable-next-line: max-line-length
        secret: '8`](~2eM6@Yb?=+bd%k>{)NAaWj/<5E;&2>5%jG.%Z9ZL@~\'~c,)]S!,N2xV!+7/q^>{pvh+arF5*_bG72,QJY?jp8%.Y4e~A3!$San~Ep*^Qv;MgCB\\Z6HJkkE=xWMx'
    },
    server: { port: process.env.PORT || 3000 },
};
