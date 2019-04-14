import { Router } from 'express';
import { wrap } from '../common';
import emailJobController from './emailJobController';

const router = Router();

router.post('/', wrap(emailJobController.post));

router.get('/:referenceId', wrap(emailJobController.get));

export default router;
