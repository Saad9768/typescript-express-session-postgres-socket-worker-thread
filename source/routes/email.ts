import express, { Router } from 'express';
import { sendEmailRequestHandler } from '../controllers/send-email-controller';

const router: Router = express.Router();

router.post('/email/send', sendEmailRequestHandler);
// router.get('/email', emailFunction);

export default router;
