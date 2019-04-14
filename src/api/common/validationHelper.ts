import {
  check,
  CustomValidator,
  SanitizerSchemaOptions,
  ValidatorOptions,
  ValidatorSchemaOptions
} from 'express-validator/check';

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
      errorMessage: 'Field is required',
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
      errorMessage: 'Field must be a valid email'
    }
  };
};

export const isArrayValidator = (): {
  [name: string]: ValidatorSchemaOptions<any>;
} => {
  return {
    isArray: {
      errorMessage: 'Field must be an array'
    }
  };
};

export const isMongoIdValidator = (): {
  [name: string]: ValidatorSchemaOptions<any>;
} => {
  return {
    isMongoId: {
      errorMessage: 'Id is not valid'
    }
  };
};

export const notEmptyArrayValidator = (): {
  [name: string]: ValidatorSchemaOptions<CustomValidator>;
} => {
  return {
    custom: {
      errorMessage: 'Array cannot be empty',
      options: (value: any[]): boolean => {
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }
        return false;
      }
    }
  };
};

export default {};
