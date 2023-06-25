import type { IncomingMessage } from 'http';
import type { SessionData } from 'express-session';
import type { Socket } from 'socket.io';
declare module "express-session" {
    interface SessionData {
        socketId: string;
        save(): void
    }
}

// interface SessionIncomingMessage extends IncomingMessage {
//     session: SessionData
// }

// export interface SessionSocket extends Socket {
//     request: SessionIncomingMessage
// }


declare module 'node:http' {
    interface IncomingMessage {
        session: SessionData
    }
}

export interface UserDetail extends Express.User {
    username: string;
}