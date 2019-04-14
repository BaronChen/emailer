import {
  EmailService,
  IEmailStatusQueryRequest,
  ISendEmailRequest
} from '@common/services';
import { Request, Response } from 'express';
import { ApiError, IControllerMethod } from '../common';
import { getShcema, postSchema } from './emailJobShcemas';

const post = async (req: Request, res: Response) => {
  const sendEmailRequest: ISendEmailRequest = {
    ...req.body
  };
  const response = await EmailService.createEmailJob(sendEmailRequest);
  res.json(response);
};

const get = async (req: Request, res: Response) => {
  const emailStatusQueryRequest: IEmailStatusQueryRequest = {
    referenceId: req.params.referenceId
  };

  const response = await EmailService.queryJobStatus(emailStatusQueryRequest);

  if (!response) {
    throw new ApiError('Email Job Not Found', 404);
  }

  res.json(response);
};

export const EmailJobController: { [name: string]: IControllerMethod } = {
  post: {
    method: post,
    schema: postSchema
  },
  get: {
    method: get,
    schema: getShcema
  }
};
