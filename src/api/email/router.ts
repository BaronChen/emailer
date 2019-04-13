import { wrapper } from '@lib/api';
import { Router } from 'express';
import emailController from './emailController';

const router = Router();

router.post('/', wrapper(emailController.post));

router.get('/:referenceId', wrapper(emailController.get));

export default router;
