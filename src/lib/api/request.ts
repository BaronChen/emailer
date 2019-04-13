import { NextFunction, Request, Response } from 'express';

export const wrapper = (
  controllerMethod: (req: Request, res: Response) => Promise<any>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controllerMethod(req, res);
  } catch (err) {
    next(err);
  }
};
