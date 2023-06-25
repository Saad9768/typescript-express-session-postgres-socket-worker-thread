import express, { Router } from 'express';
import { sendEmail, readAll, read } from '../handler/email';

const router: Router = express.Router();

router.post('/email/send', sendEmail);
router.get('/email', readAll);
router.get('/email/:emailId', read);

export default router;
