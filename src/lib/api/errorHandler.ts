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
    console.log(err);
  }
  console.log('error!!!');
  res.status(err.statusCode).send(err.message);
};
