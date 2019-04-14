import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from './apiError';

export const errorHanlder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    const apiError = err as ApiError;

    if (!apiError.statusCode) {
      apiError.statusCode = 500;
      logger.error('error: ', apiError);
    }
    res.status(apiError.statusCode).json({
      message: apiError.message,
      errors: apiError.errorDetails
    });
  } else {
    logger.error('error: ', err);
    res.status(500).send('Internal Server Error');
  }
};
