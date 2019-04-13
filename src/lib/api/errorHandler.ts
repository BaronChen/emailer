import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from './apiError';

export const errorHanlder = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  if (err.statusCode === 500) {
    logger.error('error: ', err);
  }

  res.status(err.statusCode).send(err.message);
};
