import { logInfo, logError } from '../config/logging';
import { Request, Response } from 'express';
import { join } from 'path';
const workerPath = join(__dirname, '../worker/worker.js');
import { Worker } from 'worker_threads';
import { sendMessage } from '../socket/handle-socket';
import { UserDetail } from '../model/HandleSession.interface';
import createError from 'http-errors';

const NAMESPACE = 'Email Controller';

const sendEmailRequestHandler = async (req: Request, res: Response) => {
    const { username } = req.user as UserDetail;
    const { socketId } = req.session;

    try {
        sendMessage(username, {
            progress: 0,
            requestId: req.body.requestId
        });
        const worker = new Worker(workerPath, {
            workerData: {
                path: './email-worker.ts',
                data: { obj: req.body, socketId: socketId, username: username }
            }
        });
        worker.on('message', (result) => {
            logInfo('on message result  :: ', result);
            sendMessage(username, result);
        });
        worker.on('error', (error) => {
            logError(NAMESPACE, 'on error :: ', error);
        });
        worker.on('exit', (exit) => {
            logInfo(NAMESPACE, 'on exit :: ', exit);
        });
        return res.status(200).send({ msg: 'Email Processing' });
    } catch (error) {
        logError(NAMESPACE, `error emailFunction ::`, error);
        throw createError(error && getErrorStatus(error) ? getErrorStatus(error) : 500, 'Internal Server Error');
    }
};
const getErrorStatus = (error: unknown) => {
    try {
        return JSON.parse(JSON.stringify(error)).status;
    } catch (exp) {
        return null;
    }
};

export { sendEmailRequestHandler };
