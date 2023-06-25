import { Request, Response } from 'express';
import { errorNotFound } from '../error';
const NAMESPACE = 'email';

type Email = {
    emailId: string;
};

const emails: Email[] = [
    {
        emailId: 'testEmail@test.co'
    },
    {
        emailId: 'testEmail12@test.co'
    }
];
const findByIndex = ({ emailId }: Email): number => {
    const emailIndex = emails.findIndex((r) => r.emailId === emailId);
    if (emailIndex) {
        return emailIndex;
    } else {
        throw errorNotFound('Email Not Found', NAMESPACE);
    }
};
const findById = ({ emailId }: Email): Email => {
    const emailIndex = findByIndex({ emailId });
    const email = emails[emailIndex];
    if (email) {
        return email;
    } else {
        throw errorNotFound('Email Not Found', NAMESPACE);
    }
};
const createEmail = (email: Email): Email => {
    emails.push(email);
    return findById(email);
};

const updateEmail = (findEmail: Email, email: Email): Email => {
    const emailIndex = findByIndex(findEmail);
    emails[emailIndex] = email;
    return findById(email);
};
const readAll = (req: Request, res: Response): void => {
    res.status(200).send(emails);
};
const read = (req: Request, res: Response): void => {
    const result = findById(req.params as Email);
    res.status(200).send(result);
};
const create = (req: Request, res: Response): void => {
    const newEmail = createEmail(req.body as Email);
    res.status(200).send(newEmail);
};

const update = (req: Request, res: Response): void => {
    const newEmail = updateEmail(req.params as Email, req.body);
    res.status(200).send(newEmail);
};
export { readAll, read, create, update };
