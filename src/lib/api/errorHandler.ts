import { NextFunction, Request, Response } from 'express';
import logger from '../logger';
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
    logger.log('error', JSON.stringify(err));
  }

  res.status(err.statusCode).send(err.message);
};
