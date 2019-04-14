import {
  check,
  CustomValidator,
  SanitizerSchemaOptions,
  ValidatorOptions,
  ValidatorSchemaOptions
} from 'express-validator/check';
import { template } from 'lodash';

export const errorMessageConstructor = (errorTemplate: string) => (
  value,
  { location, path }
) => {
  const compile = template(errorTemplate);
  return compile({ field: path });
};

export const trimString = (): {
  [name: string]: SanitizerSchemaOptions<any>;
} => {
  return {
    trim: {}
  };
};

export const existsValidator = (): {
  [name: string]: ValidatorSchemaOptions<ValidatorOptions.ExistsOptions>;
} => {
  return {
    exists: {
      errorMessage: errorMessageConstructor('\'${field}\' is required'),
      options: {
        checkNull: true,
        checkFalsy: true
      }
    }
  };
};

export const isEmailValidator = (): {
  [name: string]: ValidatorSchemaOptions<any>;
} => {
  return {
    isEmail: {
      errorMessage: errorMessageConstructor('\'${field}\' must be a valid email')
    }
  };
};

export const isArrayValidator = (): {
  [name: string]: ValidatorSchemaOptions<any>;
} => {
  return {
    isArray: {
      errorMessage: errorMessageConstructor('\'${field}\' must be an array')
    }
  };
};

export const isMongoIdValidator = (): {
  [name: string]: ValidatorSchemaOptions<any>;
} => {
  return {
    isMongoId: {
      errorMessage: errorMessageConstructor('\'${field}\' is not a valid id')
    }
  };
};

export const notEmptyAndIsUniqueAcrossArrays = (
  otherFields: string[]
): {
  [name: string]: ValidatorSchemaOptions<CustomValidator>;
} => {
  return {
    custom: {
      errorMessage: errorMessageConstructor(
        'Values must be not empty and unique across \'${field}\', ' +
          otherFields.map(x => `'${x}'`).join(', ')
      ),
      options: (value: any[], { req, location, path }): boolean => {
        if (!Array.isArray(value) || value.length === 0) {
          return false;
        }

        let allValues = [...value];
        if (
          Array.isArray(value) &&
          Array.isArray(otherFields) &&
          otherFields.length > 0
        ) {
          for (const otherField of otherFields) {
            if (Array.isArray(req.body[otherField])) {
              allValues = [...allValues, ...req.body[otherField]];
            }
          }
        }
        return new Set(allValues).size === allValues.length;
      }
    }
  };
};

export default {};
