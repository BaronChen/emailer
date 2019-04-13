import { wrapper } from '@lib/api';
import { Router } from 'express';
import emailController from './emailController';

const router = Router();

router.post('/sendEmail', wrapper(emailController.createEmailJob));

router.get(
  '/query-status/:jobId',
  wrapper(emailController.queryEmailJobStatus)
);

export default router;
