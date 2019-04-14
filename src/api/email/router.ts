import { Router } from 'express';
import { wrap } from '../common';
import { EmailJobController } from './emailJobController';

export const router = Router();

router.post('/', wrap(EmailJobController.post));

router.get('/:referenceId', wrap(EmailJobController.get));
