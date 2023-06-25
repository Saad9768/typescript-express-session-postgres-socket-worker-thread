import { Server as SocketServer, Socket } from 'socket.io';
import { sessionMiddleware } from '../middleware/session-middleware';
import sharedsession from 'express-socket.io-session';
import { logInfo, logError } from '../config/logging';
import { Server as HttpServer } from 'http';
import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'handle-socket';

let io: SocketServer;
const initSocket = (httpServer: HttpServer) => {
    io = new SocketServer(httpServer);
    // io.use(sharedsession(sessionMiddleware, { autoSave: true }));
    io.use((socket: Socket, next) => {
        // refer https://socket.io/how-to/use-with-express-session#with-typescript
        sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
    });
    io.on('connection', (socket: Socket) => {
        // const socket = <SessionSocket>defaultSocket;

        // socket.handshake.session.socketId = socket.id;
        // socket.handshake.session.save();

        const { request } = socket;
        request.session.socketId = socket.id;
        request.session.save();
        socket.on('disconnect', () => {
            logInfo(NAMESPACE, 'socket disconnected : ', socket.id);
        });
        socket.on('connect_error', (err: Error) => {
            logError(NAMESPACE, `connect_error due to ${err.message}`, err);
        });
        socket.on('connect_failed', (err: Error) => {
            logError(NAMESPACE, `connect_failed due to ${err.message}`, err);
        });
    });
};
const sendMessage = (eventName: string, data: object): void => {
    io.emit(eventName, data);
};
export { initSocket, sendMessage };
