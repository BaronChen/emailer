import { ValidationSchema } from 'express-validator/check';
import {
  existsValidator,
  isArrayValidator,
  isEmailValidator,
  isMongoIdValidator,
  notEmptyArrayValidator
} from '../common/validationHelper';

export const postSchema: ValidationSchema = {
  from: {
    in: 'body',
    ...existsValidator(),
    ...isEmailValidator()
  },
  to: {
    in: 'body',
    ...existsValidator(),
    ...isArrayValidator(),
    ...notEmptyArrayValidator()
  },
  cc: {
    in: 'body',
    optional: true,
    ...isArrayValidator()
  },
  bcc: {
    in: 'body',
    optional: true,
    ...isArrayValidator()
  },
  'to.*': {
    in: 'body',
    ...isEmailValidator()
  },
  'cc.*': {
    in: 'body',
    ...isEmailValidator()
  },
  'bcc.*': {
    in: 'body',
    ...isEmailValidator()
  }
};

export const getShcema: ValidationSchema = {
  referenceId: {
    in: 'params',
    ...existsValidator(),
    ...isMongoIdValidator()
  }
};
