import { ValidationSchema } from 'express-validator/check';
import {
  existsValidator,
  isArrayValidator,
  isEmailValidator,
  isMongoIdValidator,
  notEmptyAndIsUniqueAcrossArrays,
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
    ...notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc'])
  },
  'cc.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  cc: {
    in: 'body',
    optional: true,
    ...notEmptyAndIsUniqueAcrossArrays(['to', 'bcc'])
  },
  'bcc.*': {
    in: 'body',
    ...trimString(),
    ...isEmailValidator()
  },
  bcc: {
    in: 'body',
    optional: true,
    ...notEmptyAndIsUniqueAcrossArrays(['to', 'cc'])
  }
};

export const getShcema: ValidationSchema = {
  referenceId: {
    in: 'params',
    ...existsValidator(),
    ...isMongoIdValidator()
  }
};
