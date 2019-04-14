import { Request, Response } from 'express';
import { ValidationSchema } from 'express-validator/check';

export interface IControllerMethod {
  method: (req: Request, res: Response) => Promise<any>;
  schema?: ValidationSchema;
}
