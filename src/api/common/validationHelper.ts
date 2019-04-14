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

export const notEmptyArrayValidator = (): {
  [name: string]: ValidatorSchemaOptions<CustomValidator>;
} => {
  return {
    custom: {
      errorMessage: errorMessageConstructor(
        '\'${field}\' values cannot be empty'
      ),
      options: (value: any[]): boolean => {
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }
        return false;
      }
    }
  };
};

export const isUniqueArray = (): {
  [name: string]: ValidatorSchemaOptions<CustomValidator>;
} => {
  return {
    custom: {
      errorMessage: errorMessageConstructor('\'${field}\' values must be unique'),
      options: (value: any[]): boolean => {
        if (Array.isArray(value)) {
          return new Set(value).size === value.length;
        }
        return false;
      }
    }
  };
};

export default {};
