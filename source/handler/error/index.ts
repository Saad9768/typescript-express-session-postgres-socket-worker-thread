import createError, { NotFound, Unauthorized } from 'http-errors';
import { logError } from '../../config/logging';

const errorHandler = (status: number, message: string, NAMESPACE: string) => {
    logError(NAMESPACE, status.toString(), message);
    return createError(status, message);
};
const errorNotFound = (message: string, NAMESPACE: string) => {
    logError(NAMESPACE, '404', message);
    return NotFound(message);
};
const errorNotAuthenticated = (message: string, NAMESPACE: string) => {
    logError(NAMESPACE, '401', message);
    return Unauthorized(message);
};

export { errorHandler, errorNotFound, errorNotAuthenticated };
