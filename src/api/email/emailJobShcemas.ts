import { ValidationSchema } from 'express-validator/check';
import {
  existsValidator,
  isArrayValidator,
  isEmailValidator,
  isMongoIdValidator,
  notEmptyArrayValidator,
  trimString
} from '../common';

export const postSchema: ValidationSchema = {
  from: {
    in: 'body',
    ...trimString(),
    ...existsValidator(),
    ...isEmailValidator()
  },
  to: {
    in: 'body',
    ...existsValidator(),
    ...notEmptyArrayValidator()
  },
  cc: {
    in: 'body',
    optional: true,
    ...notEmptyArrayValidator()
  },
  bcc: {
    in: 'body',
    optional: true,
    ...notEmptyArrayValidator()
  },
  'to.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  'cc.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  'bcc.*': {
    in: 'body',
    ...trimString(),
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
