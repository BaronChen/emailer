import { Router } from 'express';
import { checkSchema } from 'express-validator/check';
import emailJobController from './emailJobController';

const router = Router();

router.post('/', emailJobController.post);

router.get('/:referenceId', emailJobController.get);

export default router;
