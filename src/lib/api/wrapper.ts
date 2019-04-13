import { NextFunction, Request, Response } from 'express';

export const wrapper = (
  method: (req: Request, res: Response) => Promise<any>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await method(req, res);
  } catch (err) {
    next(err);
  }
};
