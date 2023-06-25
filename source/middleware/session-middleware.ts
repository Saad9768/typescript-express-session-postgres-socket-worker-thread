import session from 'express-session';
import pg from 'pg';
import pgSession from 'connect-pg-simple';
const pgSess = pgSession(session);

const sessionMiddleware = session({
    secret: '9ad4f7b1-d4bd-4f8c-8536-ec7b1b52b762',
    name: 'auth_cookie',
    proxy: true,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    },
    store: new pgSess({
        pool: new pg.Pool({
            user: 'postgres',
            password: 'saadsaad',
            host: 'localhost',
            port: 5432,
            database: 'email'
        }),
        tableName: 'sessions'
    })
});

export { sessionMiddleware };
