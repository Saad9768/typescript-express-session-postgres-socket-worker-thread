import 'express-async-errors';
import { createServer, Server } from 'http';
import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import { logInfo, logError } from './config/logging';
import config from './config/config';
import emailRoutes from './routes/email';
import responseTime from 'response-time';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import customstrategy from 'passport-local';
import { initSocket } from './socket/handle-socket';
import { sessionMiddleware } from './middleware/session-middleware';
import { UserDetail } from './model/HandleSession.interface';
import helmet from 'helmet';
import { errorNotAuthenticated } from './handler/error';

const NAMESPACE = 'Server';
const app = express();

app.use(sessionMiddleware);
app.use(cookieParser('9ad4f7b1-d4bd-4f8c-8536-ec7b1b52b762'));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

passport.use(
    new customstrategy.Strategy((username: string, password: string, done) => {
        // can add logic for authentication
        return done(null, { username: username });
    })
);

passport.serializeUser((user: Express.User, done) => done(null, user));

passport.deserializeUser((user: Express.User, done) => done(null, user));

app.use(responseTime());
/** Log the request */
app.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the req */
    logInfo(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logInfo(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Rules of our API */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
const isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        logError(NAMESPACE, 'Request is not authenticated');
        throw errorNotAuthenticated('Request is not authenticated', NAMESPACE);
    } else {
        next();
    }
};
app.post('/api/login', passport.authenticate('local'), (req: Request, res: Response) => {
    const { username } = req.user as UserDetail;
    res.status(200).json({
        username
    });
});

app.get('/api/userInfo', isAuthenticate, (req: Request, res: Response) => {
    const { username } = req.user as UserDetail;
    res.status(200).json({
        username
    });
});
// app.use('/', express.static('<Path to index.html>'));
// app.use('*', express.static('<Path to index.html>'));

/** Routes go here */
app.use('/api', isAuthenticate, emailRoutes);

/** Error handling */
app.use((req: Request, res: Response) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});

const httpServer: Server = createServer(app);
initSocket(httpServer);
httpServer.listen(config.server.port, () => logInfo(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));

export default app;
