import {
  emailService,
  IEmailStatusQueryRequest,
  ISendEmailRequest
} from '@common/services';
import { Request, Response } from 'express';
import { IControllerMethod } from '../common';
import { getShcema, postSchema } from './emailJobShcemas';

const post = async (req: Request, res: Response) => {
  const sendEmailRequest: ISendEmailRequest = {
    ...req.body
  };
  const response = await emailService.createEmailJob(sendEmailRequest);
  res.json(response);
};

const get = async (req: Request, res: Response) => {
  const emailStatusQueryRequest: IEmailStatusQueryRequest = {
    referenceId: req.params.referenceId
  };

  const response = await emailService.queryJobStatus(emailStatusQueryRequest);

  res.json(response);
};

const contoller: { [name: string]: IControllerMethod } = {
  post: {
    method: post,
    schema: postSchema
  },
  get: {
    method: get,
    schema: getShcema
  }
};

export default contoller;
