import { ValidationSchema } from 'express-validator/check';
import {
  existsValidator,
  isArrayValidator,
  isEmailValidator,
  isMongoIdValidator,
  isUniqueArray,
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
  'to.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  to: {
    in: 'body',
    ...existsValidator(),
    ...notEmptyArrayValidator(),
    ...isUniqueArray()
  },
  'cc.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  cc: {
    in: 'body',
    optional: true,
    ...notEmptyArrayValidator(),
    ...isUniqueArray()
  },
  'bcc.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  bcc: {
    in: 'body',
    optional: true,
    ...notEmptyArrayValidator(),
    ...isUniqueArray()
  }
};

export const getShcema: ValidationSchema = {
  referenceId: {
    in: 'params',
    ...existsValidator(),
    ...isMongoIdValidator()
  }
};
