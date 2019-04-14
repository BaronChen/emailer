import { NextFunction, Request, Response } from 'express';
import {
  checkSchema,
  ErrorFormatter,
  validationResult,
  ValidationSchema
} from 'express-validator/check';
import { ApiError, IErrorDetail } from './apiError';
import { IControllerMethod } from './controllerMethod';

const errorFormatter: ErrorFormatter<IErrorDetail> = (error): IErrorDetail => {
  return {
    field: error.param,
    value: error.value,
    errorMessage: error.msg
  };
};

const wrapper = (
  method: (req: Request, res: Response) => Promise<any>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = validationResult<IErrorDetail>(req).formatWith(
      errorFormatter
    );
    if (!result.isEmpty()) {
      const errDetails = result.mapped();
      throw new ApiError('validation failed', 400, errDetails);
    } else {
      await method(req, res);
    }
  } catch (err) {
    next(err);
  }
};

export const wrap = (controllerMethod: IControllerMethod) => {
  const wrappedMethod = [];
  if (controllerMethod.schema) {
    wrappedMethod.push(checkSchema(controllerMethod.schema));
  }
  wrappedMethod.push(wrapper(controllerMethod.method));
  return wrappedMethod;
};
